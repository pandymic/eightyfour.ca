// Tokenizer and recursive-descent parser for VRML 1.0 and VRML 2.0.
// The grammar is small. The interesting bits are PROTO (we keep the body as
// tokens and re-parse it for every instance) and IS, which wires a field
// inside a prototype body to the interface of the instance.

import { isMF, sfOf, cloneValue, defaultValue } from './fields.js?v=faf24e7990';
import { Schema, ProtoInstance, addIsIn, addIsOut } from './node.js?v=7fee4c555e';

export class VRMLError extends Error {
  constructor(msg, tok) {
    super(tok ? `line ${tok.line}, col ${tok.col}: ${msg}` : msg);
    this.name = 'VRMLError';
    this.line = tok?.line ?? null;
    this.col = tok?.col ?? null;
  }
}

export function detectVersion(src) {
  const first = src.slice(0, 80).split(/\r?\n/)[0];
  if (/^#VRML V1\.0/.test(first)) return 1;
  if (/^#VRML V2\.0/.test(first)) return 2;
  if (/^#X3D/.test(first)) throw new VRMLError('This is X3D. Wrong decade. We only speak VRML here.');
  return 0;
}

const WS = new Set([' ', '\t', '\r', '\n', ',', '\f', '\v']);

export function tokenize(src, v1 = false) {
  const toks = [];
  let i = 0, line = 1, lineStart = 0;
  const n = src.length;
  const special = v1 ? '{}[]"#()|' : '{}[]"#';
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; lineStart = i + 1; i++; continue; }
    if (WS.has(c)) { i++; continue; }
    if (c === '#') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    const col = i - lineStart + 1;
    if (c === '"') {
      let s = '';
      const tl = line;
      i++;
      while (i < n && src[i] !== '"') {
        // Only \" and \\ are escapes in VRML; other backslashes pass through.
        if (src[i] === '\\' && (src[i + 1] === '"' || src[i + 1] === '\\')) { s += src[i + 1]; i += 2; continue; }
        if (src[i] === '\n') { line++; lineStart = i + 1; }
        s += src[i++];
      }
      if (i >= n) throw new VRMLError('Unterminated string', { line: tl, col });
      i++;
      toks.push({ t: 's', v: s, line: tl, col });
      continue;
    }
    if (special.includes(c)) {
      toks.push({ t: 'p', v: c, line, col });
      i++;
      continue;
    }
    let j = i;
    while (j < n && !WS.has(src[j]) && !special.includes(src[j])) j++;
    toks.push({ t: 'w', v: src.slice(i, j), line, col });
    i = j;
  }
  return toks;
}

export class Scope {
  constructor(parent = null) { this.parent = parent; this.map = new Map(); }
  get(k) { return this.map.has(k) ? this.map.get(k) : this.parent?.get(k); }
  set(k, v) { this.map.set(k, v); }
}

const KINDS = new Set(['field', 'exposedField', 'eventIn', 'eventOut']);
export const V2_TYPES = new Set([
  'SFBool', 'SFColor', 'SFFloat', 'SFImage', 'SFInt32', 'SFNode', 'SFRotation', 'SFString',
  'SFTime', 'SFVec2f', 'SFVec3f', 'MFColor', 'MFFloat', 'MFInt32', 'MFNode', 'MFRotation',
  'MFString', 'MFTime', 'MFVec2f', 'MFVec3f',
]);

export class Parser {
  constructor(tokens, ctx) {
    this.toks = tokens;
    this.i = 0;
    this.ctx = ctx; // { world, version, protos, defs, instance, created, v1Schemas, warn }
  }

  // ---- token helpers ----
  peek(o = 0) { return this.toks[this.i + o]; }
  next() {
    const t = this.toks[this.i++];
    if (!t) {
      const last = this.toks[this.toks.length - 1];
      throw new VRMLError('Unexpected end of file', last);
    }
    return t;
  }
  get atEnd() { return this.i >= this.toks.length; }
  isP(v, o = 0) { const t = this.peek(o); return t && t.t === 'p' && t.v === v; }
  isW(v, o = 0) { const t = this.peek(o); return t && t.t === 'w' && t.v === v; }
  expectP(v) {
    const t = this.next();
    if (t.t !== 'p' || t.v !== v) throw new VRMLError(`Expected '${v}' but found '${t.v}'`, t);
    return t;
  }
  word(what = 'a name') {
    const t = this.next();
    if (t.t !== 'w') throw new VRMLError(`Expected ${what} but found '${t.v}'`, t);
    return t;
  }

  // ---- values ----
  num() {
    const t = this.next();
    let v = NaN;
    if (t.t === 'w') {
      v = /^[+-]?0x/i.test(t.v) ? parseInt(t.v, 16) : Number(t.v);
    }
    if (!Number.isFinite(v)) throw new VRMLError(`Expected a number but found '${t.v}'`, t);
    return v;
  }
  int() {
    const t = this.peek();
    const v = this.num();
    if (!Number.isInteger(v)) throw new VRMLError(`Expected an integer but found '${t.v}'`, t);
    return v;
  }

  parseValue(type) {
    if (isMF(type)) {
      const st = sfOf(type);
      if (this.isP('[')) {
        this.next();
        const arr = [];
        while (!this.isP(']')) {
          if (this.atEnd) throw new VRMLError(`Unclosed '[' in ${type} value`, this.toks[this.toks.length - 1]);
          const v = this.parseSF(st);
          if (!(st === 'SFNode' && v === null)) arr.push(v);
        }
        this.next();
        return arr;
      }
      const v = this.parseSF(st);
      return st === 'SFNode' && v === null ? [] : [v];
    }
    return this.parseSF(type);
  }

  parseSF(t) {
    switch (t) {
      case 'SFBool': {
        const tok = this.next();
        if (tok.v === 'TRUE' || (this.ctx.version === 1 && tok.v === '1')) return true;
        if (tok.v === 'FALSE' || (this.ctx.version === 1 && tok.v === '0')) return false;
        throw new VRMLError(`Expected TRUE or FALSE but found '${tok.v}'`, tok);
      }
      case 'SFInt32': case 'SFLong': return this.int();
      case 'SFFloat': case 'SFTime': return this.num();
      case 'SFString': {
        const tok = this.next();
        if (tok.t === 's') return tok.v;
        if (this.ctx.version === 1 && tok.t === 'w') return tok.v;
        throw new VRMLError(`Expected a quoted string but found '${tok.v}'`, tok);
      }
      case 'SFVec2f': return [this.num(), this.num()];
      case 'SFVec3f': case 'SFColor': return [this.num(), this.num(), this.num()];
      case 'SFRotation': return [this.num(), this.num(), this.num(), this.num()];
      case 'SFMatrix': { const m = []; for (let k = 0; k < 16; k++) m.push(this.num()); return m; }
      case 'SFImage': {
        const w = this.int(), h = this.int(), nc = this.int();
        const pixels = new Array(w * h);
        for (let k = 0; k < w * h; k++) pixels[k] = this.int();
        return { w, h, nc, pixels };
      }
      case 'SFNode': return this.parseNodeStatement();
      case 'SFEnum': return this.word('an enum value').v;
      case 'SFBitMask': {
        if (this.isP('(')) {
          this.next();
          const out = [];
          while (!this.isP(')')) {
            const tok = this.next();
            if (tok.t === 'p' && tok.v === '|') continue;
            out.push(tok.v);
          }
          this.next();
          return out;
        }
        return this.word('a bitmask value').v.split('|').filter(Boolean);
      }
      default:
        throw new VRMLError(`Unknown field type ${t}`, this.peek());
    }
  }

  // ---- statements ----
  parseStatements(stopAtBrace = false) {
    const nodes = [];
    while (!this.atEnd) {
      if (stopAtBrace && this.isP('}')) break;
      const t = this.peek();
      if (this.ctx.version === 2 && t.t === 'w') {
        if (t.v === 'PROTO') { this.parseProto(); continue; }
        if (t.v === 'EXTERNPROTO') { this.parseExternProto(); continue; }
        if (t.v === 'ROUTE') { this.parseRoute(); continue; }
      }
      const n = this.parseNodeStatement();
      if (n) nodes.push(n);
    }
    return nodes;
  }

  parseNodeStatement() {
    const t = this.peek();
    if (!t) throw new VRMLError('Expected a node', this.toks[this.toks.length - 1]);
    if (t.t !== 'w') throw new VRMLError(`Expected a node but found '${t.v}'`, t);
    if (t.v === 'NULL') { this.next(); return null; }
    if (t.v === 'USE') {
      this.next();
      const nt = this.word('a DEF name after USE');
      const node = this.ctx.defs.get(nt.v);
      if (!node) throw new VRMLError(`USE of undefined name '${nt.v}'`, nt);
      return node;
    }
    if (t.v === 'DEF') {
      this.next();
      const nt = this.word('a name after DEF');
      return this.parseNode(nt.v);
    }
    return this.parseNode(null);
  }

  parseNode(defName) {
    if (this.ctx.version === 1) return this.parseV1Node(defName);
    const tt = this.word('a node type');
    const type = tt.v;
    const world = this.ctx.world;
    const proto = this.ctx.protos.get(type);
    if (proto) return this.parseProtoInstance(proto, defName, tt);
    if (!world.hasType(type)) throw new VRMLError(`Unknown node type '${type}'`, tt);
    const node = world.createNode(type);
    node.srcLine = tt.line;
    if (defName) { this.ctx.defs.set(defName, node); node.name = defName; }
    this.expectP('{');
    while (!this.isP('}')) {
      const ft = this.word('a field name');
      if (ft.v === 'ROUTE') { this.i--; this.parseRoute(); continue; }
      if (ft.v === 'PROTO') { this.i--; this.parseProto(); continue; }
      if (ft.v === 'EXTERNPROTO') { this.i--; this.parseExternProto(); continue; }
      if (KINDS.has(ft.v) && type === 'Script') { this.parseScriptDecl(node, ft); continue; }
      const d = node.schema.get(ft.v);
      if (!d) throw new VRMLError(`${type} has no field called '${ft.v}'`, ft);
      if (this.isW('IS')) { this.next(); this.applyIs(node, d, this.word('a prototype field name')); continue; }
      if (d.kind === 'eventIn' || d.kind === 'eventOut') {
        throw new VRMLError(`'${ft.v}' is an ${d.kind}; you can route to it but not give it a value`, ft);
      }
      node.f[d.name] = this.parseValue(d.type);
    }
    this.next();
    this.ctx.created.push(node);
    return node;
  }

  parseScriptDecl(node, kindTok) {
    const kind = kindTok.v;
    const tt = this.word('a field type');
    if (!V2_TYPES.has(tt.v)) throw new VRMLError(`Unknown field type '${tt.v}'`, tt);
    const nt = this.word('a field name');
    if (node.schema.get(nt.v)) throw new VRMLError(`Script already has a field called '${nt.v}'`, nt);
    const d = { kind, type: tt.v, name: nt.v, value: defaultValue(tt.v) };
    node.schema.fields.set(d.name, d);
    if (kind !== 'eventIn') node.f[d.name] = defaultValue(d.type);
    if (this.isW('IS')) { this.next(); this.applyIs(node, d, this.word('a prototype field name')); return; }
    if (kind === 'field' || kind === 'exposedField') node.f[d.name] = this.parseValue(d.type);
  }

  applyIs(node, d, pt) {
    const inst = this.ctx.instance;
    if (!inst) throw new VRMLError(`IS can only be used inside a PROTO body`, pt);
    const pd = inst.schema.get(pt.v);
    if (!pd) throw new VRMLError(`PROTO ${inst.type} has no interface field '${pt.v}'`, pt);
    if (pd.type !== d.type) throw new VRMLError(`Type mismatch: ${d.name} is ${d.type} but ${pt.v} is ${pd.type}`, pt);
    const hasVal = (k) => k === 'field' || k === 'exposedField';
    const canIn = (k) => k === 'eventIn' || k === 'exposedField';
    const canOut = (k) => k === 'eventOut' || k === 'exposedField';
    if (hasVal(d.kind) && hasVal(pd.kind)) node.f[d.name] = cloneValue(inst.f[pd.name]);
    if (canIn(d.kind) && canIn(pd.kind)) addIsIn(inst, pd.name, node, d.name);
    if (canOut(d.kind) && canOut(pd.kind)) addIsOut(node, d.name, inst, pd.name);
  }

  parseRoute() {
    const rt = this.word();
    const a = this.word('NodeName.eventOut');
    const to = this.word("'TO'");
    if (to.v !== 'TO') throw new VRMLError(`Expected 'TO' in ROUTE but found '${to.v}'`, to);
    const b = this.word('NodeName.eventIn');
    const split = (tok) => {
      const k = tok.v.lastIndexOf('.');
      if (k <= 0) throw new VRMLError(`ROUTE needs NodeName.fieldName, got '${tok.v}'`, tok);
      const node = this.ctx.defs.get(tok.v.slice(0, k));
      if (!node) throw new VRMLError(`ROUTE refers to unknown node '${tok.v.slice(0, k)}'`, tok);
      return [node, tok.v.slice(k + 1)];
    };
    const [fn, ff] = split(a);
    const [tn, tf] = split(b);
    try {
      this.ctx.world.addRoute(fn, ff, tn, tf);
    } catch (e) {
      throw new VRMLError(e.message, rt);
    }
  }

  parseInterface(allowValues) {
    this.expectP('[');
    const decls = [];
    while (!this.isP(']')) {
      const kt = this.word('field, exposedField, eventIn or eventOut');
      if (!KINDS.has(kt.v)) throw new VRMLError(`Expected an interface declaration but found '${kt.v}'`, kt);
      const tt = this.word('a field type');
      if (!V2_TYPES.has(tt.v)) throw new VRMLError(`Unknown field type '${tt.v}'`, tt);
      const nt = this.word('a field name');
      const d = { kind: kt.v, type: tt.v, name: nt.v, value: defaultValue(tt.v) };
      if (allowValues && (d.kind === 'field' || d.kind === 'exposedField')) d.value = this.parseValue(d.type);
      decls.push(d);
    }
    this.next();
    return decls;
  }

  parseProto() {
    this.next(); // PROTO
    const nt = this.word('a prototype name');
    const decls = this.parseInterface(true);
    const open = this.expectP('{');
    const start = this.i;
    let depth = 1;
    while (depth > 0) {
      const t = this.next();
      if (t.t === 'p' && t.v === '{') depth++;
      else if (t.t === 'p' && t.v === '}') depth--;
      if (this.atEnd && depth > 0) throw new VRMLError(`PROTO ${nt.v} body never closes`, open);
    }
    const def = {
      name: nt.v,
      schema: new Schema(nt.v, decls),
      bodyTokens: this.toks.slice(start, this.i - 1),
      scope: this.ctx.protos,
      external: false,
    };
    this.ctx.protos.set(nt.v, def);
    return def;
  }

  parseExternProto() {
    this.next();
    const nt = this.word('a prototype name');
    const decls = this.parseInterface(false);
    const urls = this.parseValue('MFString');
    const def = {
      name: nt.v, schema: new Schema(nt.v, decls), external: true, urls, scope: this.ctx.protos,
    };
    this.ctx.protos.set(nt.v, def);
    return def;
  }

  parseProtoInstance(def, defName, tt) {
    const inst = new ProtoInstance(def.name, def.schema.clone(), def);
    inst.srcLine = tt.line;
    inst._given = new Set();
    if (defName) { this.ctx.defs.set(defName, inst); inst.name = defName; }
    this.expectP('{');
    while (!this.isP('}')) {
      const ft = this.word('a field name');
      const d = inst.schema.get(ft.v);
      if (!d) throw new VRMLError(`PROTO ${def.name} has no field called '${ft.v}'`, ft);
      inst._given.add(d.name);
      if (this.isW('IS')) { this.next(); this.applyIs(inst, d, this.word('a prototype field name')); continue; }
      if (d.kind === 'eventIn' || d.kind === 'eventOut') {
        throw new VRMLError(`'${ft.v}' is an ${d.kind} and cannot be given a value`, ft);
      }
      inst.f[d.name] = this.parseValue(d.type);
    }
    this.next();
    if (def.external) {
      this.ctx.world.deferExternProto(inst, def);
    } else {
      instantiateProtoBody(inst, def, this.ctx);
    }
    this.ctx.created.push(inst);
    return inst;
  }

  // ---- VRML 1.0 ----
  parseV1Node(defName) {
    const tt = this.word('a node type');
    const type = tt.v;
    let schema = this.ctx.v1Schemas.get(type);
    const node = { type, f: {}, children: [], name: defName, v1: true, line: tt.line };
    if (defName) this.ctx.defs.set(defName, node);
    this.expectP('{');
    if (!schema) {
      // Self-describing nodes: "fields [ SFFloat foo, MFVec3f bar ]"
      if (this.isW('fields') && this.isP('[', 1)) {
        this.next(); this.next();
        const decls = [];
        while (!this.isP(']')) {
          const ty = this.word('a field type').v;
          const nm = this.word('a field name').v;
          decls.push({ kind: 'field', type: ty, name: nm, value: defaultValue(ty) });
        }
        this.next();
        schema = new Schema(type, decls);
        this.ctx.warn?.(`line ${tt.line}: unknown VRML 1.0 node '${type}' (self-described, ignored)`);
        node.unknown = true;
      } else {
        this.ctx.warn?.(`line ${tt.line}: unknown VRML 1.0 node '${type}' skipped`);
        let depth = 1;
        while (depth > 0) {
          const t = this.next();
          if (t.t === 'p' && t.v === '{') depth++;
          else if (t.t === 'p' && t.v === '}') depth--;
        }
        node.unknown = true;
        return node;
      }
    }
    for (const d of schema.fields.values()) node.f[d.name] = cloneValue(d.value);
    while (!this.isP('}')) {
      const t = this.peek();
      if (t.t === 'w' && (t.v === 'DEF' || t.v === 'USE' || this.isP('{', 1))) {
        const child = this.parseNodeStatement();
        if (child) node.children.push(child);
        continue;
      }
      const ft = this.word('a field name');
      const d = schema.get(ft.v);
      if (!d) throw new VRMLError(`${type} has no field called '${ft.v}'`, ft);
      node.f[d.name] = this.parseValue(d.type);
    }
    this.next();
    return node;
  }
}

// Build the body of a prototype instance by re-parsing the stored tokens.
export function instantiateProtoBody(inst, def, ctx) {
  const sub = new Parser(def.bodyTokens, {
    ...ctx,
    protos: new Scope(def.scope),
    defs: new Map(),
    instance: inst,
  });
  const nodes = sub.parseStatements();
  inst.primary = nodes[0] || null;
  inst.body = nodes;
  return nodes;
}

// Parse a list of interface declarations, used to build the built-in node
// table from plain text.
export function parseInterfaceText(text) {
  const toks = tokenize('[' + text + ']');
  const p = new Parser(toks, { version: 2, protos: new Scope(), defs: new Map(), created: [] });
  return p.parseInterface(true);
}
