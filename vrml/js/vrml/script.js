// The Script node, ECMAScript flavor (Annex C of the VRML97 spec), which
// is what everyone called "javascript:" or "vrmlscript:" at the time.
//
// Script fields and eventOuts appear as global variables. Each eventIn calls
// a function with the same name, passing (value, timestamp). Assigning to an
// eventOut sends an event. We fake the "global variables" bit with a Proxy
// and a with() statement, which is exactly the sort of thing you could get
// away with in 1997.

import { isMF, sfOf, defaultValue, cloneValue, valuesEqual } from './fields.js';
import { quat, hsvToRgb, rgbToHsv } from './math.js';
import { Node, ProtoInstance } from './node.js';

const RAW = Symbol('vrmlNode');

// ---------- the VRML ECMAScript object model ----------
export class SFVec2f {
  constructor(x = 0, y = 0) { this.x = +x; this.y = +y; }
  get 0() { return this.x; } set 0(v) { this.x = v; }
  get 1() { return this.y; } set 1(v) { this.y = v; }
  add(v) { return new SFVec2f(this.x + v.x, this.y + v.y); }
  subtract(v) { return new SFVec2f(this.x - v.x, this.y - v.y); }
  multiply(s) { return new SFVec2f(this.x * s, this.y * s); }
  divide(s) { return new SFVec2f(this.x / s, this.y / s); }
  dot(v) { return this.x * v.x + this.y * v.y; }
  length() { return Math.hypot(this.x, this.y); }
  negate() { return new SFVec2f(-this.x, -this.y); }
  normalize() { const l = this.length() || 1; return this.divide(l); }
  toString() { return `${this.x} ${this.y}`; }
}

export class SFVec3f {
  constructor(x = 0, y = 0, z = 0) { this.x = +x; this.y = +y; this.z = +z; }
  get 0() { return this.x; } set 0(v) { this.x = v; }
  get 1() { return this.y; } set 1(v) { this.y = v; }
  get 2() { return this.z; } set 2(v) { this.z = v; }
  add(v) { return new SFVec3f(this.x + v.x, this.y + v.y, this.z + v.z); }
  subtract(v) { return new SFVec3f(this.x - v.x, this.y - v.y, this.z - v.z); }
  multiply(s) { return new SFVec3f(this.x * s, this.y * s, this.z * s); }
  divide(s) { return new SFVec3f(this.x / s, this.y / s, this.z / s); }
  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
  cross(v) {
    return new SFVec3f(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
  }
  length() { return Math.hypot(this.x, this.y, this.z); }
  negate() { return new SFVec3f(-this.x, -this.y, -this.z); }
  normalize() { const l = this.length() || 1; return this.divide(l); }
  toString() { return `${this.x} ${this.y} ${this.z}`; }
}

export class SFColor {
  constructor(r = 0, g = 0, b = 0) { this.r = +r; this.g = +g; this.b = +b; }
  get 0() { return this.r; } set 0(v) { this.r = v; }
  get 1() { return this.g; } set 1(v) { this.g = v; }
  get 2() { return this.b; } set 2(v) { this.b = v; }
  setHSV(h, s, v) { [this.r, this.g, this.b] = hsvToRgb(h, s, v); }
  getHSV() { return rgbToHsv(this.r, this.g, this.b); }
  toString() { return `${this.r} ${this.g} ${this.b}`; }
}

export class SFRotation {
  constructor(a = 0, b = 0, c = 1, d = 0) {
    if (a instanceof SFVec3f && b instanceof SFVec3f) {
      // rotation taking vector a to vector b
      const u = a.normalize(), v = b.normalize();
      const aa = quat.toAxisAngle(quat.fromTo([u.x, u.y, u.z], [v.x, v.y, v.z]));
      [this.x, this.y, this.z, this.angle] = aa;
    } else if (a instanceof SFVec3f) {
      this.x = a.x; this.y = a.y; this.z = a.z; this.angle = +b;
    } else {
      this.x = +a; this.y = +b; this.z = +c; this.angle = +d;
    }
  }
  get 0() { return this.x; } set 0(v) { this.x = v; }
  get 1() { return this.y; } set 1(v) { this.y = v; }
  get 2() { return this.z; } set 2(v) { this.z = v; }
  get 3() { return this.angle; } set 3(v) { this.angle = v; }
  _q() { return quat.fromAxisAngle([this.x, this.y, this.z, this.angle]); }
  static _from(q) { return new SFRotation(...quat.toAxisAngle(q)); }
  getAxis() { return new SFVec3f(this.x, this.y, this.z); }
  setAxis(v) { this.x = v.x; this.y = v.y; this.z = v.z; }
  inverse() { return new SFRotation(this.x, this.y, this.z, -this.angle); }
  multiply(r) { return SFRotation._from(quat.multiply(this._q(), r._q())); }
  multVec(v) { const o = quat.rotate(this._q(), [v.x, v.y, v.z]); return new SFVec3f(...o); }
  slerp(r, t) { return SFRotation._from(quat.slerp(this._q(), r._q(), t)); }
  toString() { return `${this.x} ${this.y} ${this.z} ${this.angle}`; }
}

export class SFImage {
  constructor(w = 0, h = 0, nc = 0, pixels = []) {
    this.width = w; this.height = h; this.comp = nc;
    this.array = pixels instanceof Array ? pixels.slice() : Array.from(pixels || []);
  }
}

function mfClass(name, conv) {
  const C = class extends Array {
    constructor(...items) { super(); for (const it of items) this.push(conv ? conv(it) : it); }
    static get [Symbol.species]() { return Array; }
    toString() { return '[' + this.join(', ') + ']'; }
  };
  Object.defineProperty(C, 'name', { value: name });
  return C;
}
export const MFFloat = mfClass('MFFloat', Number);
export const MFInt32 = mfClass('MFInt32', (v) => Math.trunc(v));
export const MFTime = mfClass('MFTime', Number);
export const MFString = mfClass('MFString', String);
export const MFVec2f = mfClass('MFVec2f');
export const MFVec3f = mfClass('MFVec3f');
export const MFColor = mfClass('MFColor');
export const MFRotation = mfClass('MFRotation');
export const MFNode = mfClass('MFNode');

const MF_CLASSES = { MFFloat, MFInt32, MFTime, MFString, MFVec2f, MFVec3f, MFColor, MFRotation, MFNode };

// ---------- conversions between storage values and script objects ----------
export function toScript(type, v, world) {
  if (isMF(type)) {
    const C = MF_CLASSES[type] || MFFloat;
    const st = sfOf(type);
    const out = new C();
    for (const x of v) out.push(toScript(st, x, world));
    return out;
  }
  switch (type) {
    case 'SFVec2f': return new SFVec2f(...v);
    case 'SFVec3f': return new SFVec3f(...v);
    case 'SFColor': return new SFColor(...v);
    case 'SFRotation': return new SFRotation(...v);
    case 'SFImage': return new SFImage(v.w, v.h, v.nc, v.pixels);
    case 'SFNode': return v ? nodeProxy(v, world) : null;
    default: return v;
  }
}

function vecFrom(v, n, keys) {
  if (v == null) return new Array(n).fill(0);
  if (Array.isArray(v)) return v.slice(0, n).map(Number);
  if (typeof v === 'object') return keys.map((k, i) => Number(v[k] ?? v[i] ?? 0));
  return new Array(n).fill(Number(v));
}

export function fromScript(type, v) {
  if (isMF(type)) {
    const st = sfOf(type);
    if (v == null) return [];
    if (!Array.isArray(v)) return [fromScript(st, v)];
    // Allow flat numeric arrays for vector MF types, a kindness to the reader
    const n = { SFVec2f: 2, SFVec3f: 3, SFColor: 3, SFRotation: 4 }[st];
    if (n && v.length && typeof v[0] === 'number') {
      const out = [];
      for (let i = 0; i + n <= v.length; i += n) out.push(v.slice(i, i + n).map(Number));
      return out;
    }
    return Array.from(v, (x) => fromScript(st, x)).filter((x) => !(st === 'SFNode' && !x));
  }
  switch (type) {
    case 'SFBool': return !!v;
    case 'SFInt32': return Math.trunc(Number(v)) || 0;
    case 'SFFloat': case 'SFTime': return Number(v) || 0;
    case 'SFString': return v == null ? '' : String(v);
    case 'SFVec2f': return vecFrom(v, 2, ['x', 'y']);
    case 'SFVec3f': return vecFrom(v, 3, ['x', 'y', 'z']);
    case 'SFColor': return vecFrom(v, 3, ['r', 'g', 'b']);
    case 'SFRotation': return vecFrom(v, 4, ['x', 'y', 'z', 'angle']);
    case 'SFImage':
      if (v instanceof SFImage) return { w: v.width, h: v.height, nc: v.comp, pixels: v.array.slice() };
      return v || defaultValue('SFImage');
    case 'SFNode': return v ? (v[RAW] || (v instanceof Node ? v : null)) : null;
    default: return v;
  }
}

// ---------- SFNode objects: field access by name ----------
const proxies = new WeakMap();
export function nodeProxy(node, world) {
  if (proxies.has(node)) return proxies.get(node);
  const p = new Proxy({}, {
    get(_, k) {
      if (k === RAW) return node;
      if (k === 'toString') return () => `${node.type}${node.name ? ' "' + node.name + '"' : ''}`;
      if (k === 'getType' || k === 'getTypeName') return () => node.type;
      if (k === 'getName') return () => node.name || '';
      if (typeof k !== 'string') return undefined;
      const d = node.schema.resolveOut(k) || node.schema.get(k);
      if (!d || d.kind === 'eventIn') return undefined;
      return toScript(d.type, node.f[d.name], world);
    },
    set(_, k, v) {
      const d = node.schema.resolveIn(k);
      if (!d) { world.warn(`Script tried to set ${node.type}.${String(k)}, which is not an eventIn`); return true; }
      world.sendIn(node, d.name, fromScript(d.type, v), world.now);
      return true;
    },
    has(_, k) { return typeof k === 'string' && !!node.schema.get(k); },
  });
  proxies.set(node, p);
  return p;
}

// ---------- the Browser object ----------
function makeBrowser(world, runner) {
  return {
    getName: () => 'Pandymic Homage Browser',
    getVersion: () => '2.0',
    getCurrentSpeed: () => world.currentSpeed || 0,
    getCurrentFrameRate: () => world.frameRate || 0,
    getCurrentTime: () => world.now,
    getWorldURL: () => world.url || '',
    setDescription: (s) => world.opts.setDescription?.(String(s)),
    print: (...a) => world.print(...a.map(String)),
    println: (...a) => world.print(...a.map(String)),
    createVrmlFromString(s) {
      const nodes = world.parseInto(String(s));
      return MFNode.from ? new MFNode(...nodes.map((n) => nodeProxy(n, world))) : nodes;
    },
    createVrmlFromURL(urls, node, event) {
      const list = Array.isArray(urls) ? urls : [urls];
      (async () => {
        for (const u of list) {
          try {
            const text = await world.fetchText(u);
            const nodes = world.parseInto(text);
            const target = fromScript('SFNode', node);
            if (target) world.sendIn(target, event, nodes, world.now);
            world.flushScripts();
            return;
          } catch (e) { world.warn(`createVrmlFromURL: ${e.message}`); }
        }
      })();
    },
    addRoute(fromNode, fromField, toNode, toField) {
      world.addRoute(fromScript('SFNode', fromNode), fromField, fromScript('SFNode', toNode), toField);
    },
    deleteRoute(fromNode, fromField, toNode, toField) {
      world.deleteRoute(fromScript('SFNode', fromNode), fromField, fromScript('SFNode', toNode), toField);
    },
    loadURL(urls, params) {
      const u = Array.isArray(urls) ? urls[0] : urls;
      world.opts.loadURL?.(String(u), params);
    },
    replaceWorld(nodes) {
      world.opts.replaceWorld?.(Array.from(nodes || [], (n) => fromScript('SFNode', n)));
    },
  };
}

// ---------- the runner ----------
export class ScriptRunner {
  constructor(node, world) {
    this.node = node;
    this.world = world;
    this.fns = null;
    this.touched = new Map();
    this.pendingOut = [];
    this.label = node.name ? `Script "${node.name}"` : `Script (line ${node.srcLine ?? '?'})`;
    this.compile();
  }

  findSource() {
    for (const u of this.node.f.url) {
      const m = /^\s*(javascript|vrmlscript|ecmascript):([\s\S]*)$/i.exec(u);
      if (m) return m[2];
      if (/\.class$/i.test(u)) {
        this.world.warn(`${this.label}: Java bytecode (${u}) is not supported. We did the world a favor.`);
      }
      if (/\.(js|vs)$/i.test(u)) {
        this.world.warn(`${this.label}: external script files are not fetched; inline the code with "javascript:".`);
      }
    }
    return null;
  }

  compile() {
    const src = this.findSource();
    if (src == null) {
      if (this.node.f.url.length) this.world.warn(`${this.label}: no javascript: or vrmlscript: source found`);
      return;
    }
    const schema = this.node.schema;
    const eventIns = [...schema.fields.values()].filter((d) => d.kind === 'eventIn' || d.kind === 'exposedField').map((d) => d.name);
    const vars = new Map();
    for (const d of schema.fields.values()) {
      if (d.kind !== 'eventIn' && !['url', 'directOutput', 'mustEvaluate'].includes(d.name)) vars.set(d.name, d);
    }
    this.vars = vars;
    const world = this.world;
    const globals = {
      Browser: makeBrowser(world, this),
      print: (...a) => world.print(...a.map(String)),
      trace: (...a) => world.print(...a.map(String)),
      SFVec2f, SFVec3f, SFColor, SFRotation, SFImage,
      MFFloat, MFInt32, MFTime, MFString, MFVec2f, MFVec3f, MFColor, MFRotation, MFNode,
      SFNode: (s) => {
        const nodes = world.parseInto(String(s));
        return nodes[0] ? nodeProxy(nodes[0], world) : null;
      },
      TRUE: true, FALSE: false,
    };
    const self = this;
    const scope = new Proxy(Object.create(null), {
      has(_, k) { return typeof k === 'string' && (vars.has(k) || k in globals); },
      get(_, k) {
        if (k === Symbol.unscopables) return undefined;
        if (vars.has(k)) return self.read(k);
        return globals[k];
      },
      set(_, k, v) {
        if (vars.has(k)) { self.write(k, v); return true; }
        globals[k] = v;
        return true;
      },
    });
    const names = [...new Set([...eventIns, 'initialize', 'shutdown', 'eventsProcessed'])];
    const table = names.map((n) => `${JSON.stringify(n)}: typeof ${n} === 'function' ? ${n} : undefined`).join(',\n');
    const code = `with (__scope) { return (function () {\n${src}\n;return {${table}};\n}).call(__scope); }`;
    try {
      // eslint-disable-next-line no-new-func
      this.fns = new Function('__scope', code)(scope);
    } catch (e) {
      this.world.warn(`${this.label}: ${e.name}: ${e.message}`);
      this.fns = null;
    }
  }

  read(name) {
    if (this.touched.has(name)) return this.touched.get(name).obj;
    const d = this.vars.get(name);
    const raw = this.node.f[name] ?? defaultValue(d.type);
    const obj = toScript(d.type, raw, this.world);
    if (obj && typeof obj === 'object') this.touched.set(name, { obj, snap: cloneValue(raw) });
    return obj;
  }

  write(name, v) {
    const d = this.vars.get(name);
    this.node.f[name] = fromScript(d.type, v);
    this.touched.delete(name);
    if (d.kind === 'eventOut' || d.kind === 'exposedField') this.pendingOut.push(name);
  }

  call(fnName, args) {
    const fn = this.fns?.[fnName];
    if (!fn) return false;
    this.touched.clear();
    this.pendingOut = [];
    try {
      fn.apply(null, args);
    } catch (e) {
      this.world.warn(`${this.label}, in ${fnName}(): ${e.name}: ${e.message}`);
    }
    // In-place edits like "pos.x = 3" count as assignments
    for (const [name, { obj, snap }] of this.touched) {
      const d = this.vars.get(name);
      const cur = fromScript(d.type, obj);
      if (!valuesEqual(cur, snap)) {
        this.node.f[name] = cur;
        if (d.kind === 'eventOut' || d.kind === 'exposedField') this.pendingOut.push(name);
      }
    }
    this.touched.clear();
    const out = [...new Set(this.pendingOut)];
    this.pendingOut = [];
    const t = this.world.now;
    for (const name of out) this.world.emit(this.node, name, cloneValue(this.node.f[name]), t);
    return true;
  }

  initialize() { this.call('initialize', []); }
  shutdown() { this.call('shutdown', []); }
  eventsProcessed() { this.call('eventsProcessed', []); }

  receive(name, value, time) {
    const d = this.node.schema.get(name);
    if (d.kind === 'exposedField') this.node.f[name] = value;
    if (this.fns?.[name]) {
      this.call(name, [toScript(d.type, value, this.world), time]);
      if (this.fns.eventsProcessed) this.world.pendingScripts.add(this.node);
    }
  }
}

export { RAW, ProtoInstance };
