// The World: a parsed scene plus the machinery that makes it go.
// Routes, the event cascade, bindable node stacks, time, and the loading of
// Inline and EXTERNPROTO content.

import { Node, ProtoInstance } from './node.js';
import { builtinSchemas } from './nodes.js';
import { tokenize, Parser, Scope, detectVersion, VRMLError, instantiateProtoBody } from './parser.js';
import { cloneValue } from './fields.js';
import { BEHAVIORS } from './behaviors.js';
import { ScriptRunner } from './script.js';
import { v1Schemas, convertV1 } from './v1.js';

export const BINDABLE = ['Viewpoint', 'NavigationInfo', 'Background', 'Fog'];

export function nowSeconds() {
  return (performance.timeOrigin + performance.now()) / 1000;
}

export class World {
  constructor(opts = {}) {
    this.opts = opts; // { print, warn, fetchText, loadURL, setDescription }
    this.schemas = builtinSchemas();
    this.reset();
  }

  reset() {
    this.shutdownScripts?.();
    this.roots = [];
    this.routes = new Map();
    this.defs = new Map();
    this.protos = new Scope();
    this.timeSensors = new Set();
    this.scripts = new Set();
    this.proximity = new Set();
    this.audio = new Set();
    this.visibility = new Set();
    this.viewpoints = [];
    this.stacks = Object.fromEntries(BINDABLE.map((t) => [t, []]));
    this.registered = Object.fromEntries(BINDABLE.map((t) => [t, []]));
    this.pendingScripts = new Set();
    this.now = nowSeconds();
    this.version = 2;
    this.title = '';
    this.info = [];
    this.pending = 0;
    this.dirty = true;
    this.listeners = new Set();
  }

  print(...a) { this.opts.print?.(a.join(' ')); }
  warn(msg) { this.opts.warn ? this.opts.warn(msg) : console.warn(msg); }
  notify(what, data) { for (const l of this.listeners) l(what, data); }

  hasType(t) { return this.schemas.has(t); }
  createNode(type) {
    const s = this.schemas.get(type);
    if (!s) throw new Error(`Unknown node type ${type}`);
    return new Node(type, type === 'Script' ? s.clone() : s);
  }

  // ---------- loading ----------
  load(src, { url = '' } = {}) {
    this.reset();
    this.url = url;
    let version = detectVersion(src);
    if (version === 0) {
      this.warn('No "#VRML V2.0 utf8" header on line 1. Assuming VRML 2.0 and carrying on.');
      version = 2;
    }
    this.version = version;
    const created = [];
    if (version === 1) {
      const ctx = this.makeCtx({ version: 1, created });
      const p = new Parser(tokenize(src, true), ctx);
      const tree = p.parseStatements();
      this.roots = convertV1(tree, this, created);
    } else {
      const ctx = this.makeCtx({ version: 2, created, defs: this.defs, protos: this.protos });
      const p = new Parser(tokenize(src), ctx);
      this.roots = p.parseStatements();
    }
    this.initNodes(created);
    for (const t of BINDABLE) {
      const first = this.registered[t][0];
      if (first) this.bind(first, true, this.now);
    }
    this.startScripts();
    this.dirty = true;
    this.notify('loaded');
    return this;
  }

  makeCtx(extra) {
    return {
      world: this,
      version: 2,
      protos: new Scope(),
      defs: new Map(),
      instance: null,
      created: [],
      v1Schemas: v1Schemas(),
      warn: (m) => this.warn(m),
      ...extra,
    };
  }

  // Parse more VRML into this world (Browser.createVrmlFromString, Inline)
  parseInto(src, { inline = false } = {}) {
    let version = detectVersion(src);
    if (!version) version = 2;
    const created = [];
    let nodes;
    if (version === 1) {
      const ctx = this.makeCtx({ version: 1, created });
      nodes = convertV1(new Parser(tokenize(src, true), ctx).parseStatements(), this, created);
    } else {
      const ctx = this.makeCtx({ version: 2, created });
      nodes = new Parser(tokenize(src), ctx).parseStatements();
    }
    this.initNodes(created, { inline });
    for (const n of created) if (n.type === 'Script') n._runner?.initialize();
    return nodes;
  }

  initNodes(created, { inline = false } = {}) {
    for (const node of created) {
      if (node instanceof ProtoInstance) continue;
      if (BINDABLE.includes(node.type)) {
        this.registered[node.type].push(node);
        if (node.type === 'Viewpoint') this.viewpoints.push(node);
      }
      switch (node.type) {
        case 'TimeSensor': this.timeSensors.add(node); break;
        case 'ProximitySensor': this.proximity.add(node); break;
        case 'VisibilitySensor': this.visibility.add(node); break;
        case 'AudioClip': this.audio.add(node); break;
        case 'Script':
          this.scripts.add(node);
          node._runner = new ScriptRunner(node, this);
          break;
        case 'WorldInfo':
          if (!inline && node.f.title && !this.title) this.title = node.f.title;
          if (!inline) this.info.push(...node.f.info);
          break;
        case 'Inline':
          this.loadInline(node);
          break;
      }
      BEHAVIORS[node.type]?.init?.(node, this);
    }
  }

  startScripts() {
    for (const s of this.scripts) s._runner.initialize();
    this.flushScripts();
  }

  shutdownScripts() {
    for (const s of this.scripts || []) s._runner?.shutdown();
    for (const a of this.audio || []) a._audio?.pause();
  }

  // ---------- routes & events ----------
  routeKey(node, field) { return node.id + '.' + field; }

  addRoute(from, fromField, to, toField) {
    const out = from.schema.resolveOut(fromField);
    if (!out) throw new Error(`${from.name || from.type} has no eventOut called '${fromField}'`);
    const inn = to.schema.resolveIn(toField);
    if (!inn) throw new Error(`${to.name || to.type} has no eventIn called '${toField}'`);
    if (out.type !== inn.type) {
      throw new Error(`ROUTE type mismatch: ${fromField} is ${out.type} but ${toField} is ${inn.type}`);
    }
    const key = this.routeKey(from, out.name);
    if (!this.routes.has(key)) this.routes.set(key, []);
    const list = this.routes.get(key);
    if (list.some((r) => r.to === to && r.toField === inn.name)) return;
    list.push({ from, fromField: out.name, to, toField: inn.name, stamp: -1 });
  }

  deleteRoute(from, fromField, to, toField) {
    const out = from.schema.resolveOut(fromField);
    const inn = to.schema.resolveIn(toField);
    if (!out || !inn) return;
    const key = this.routeKey(from, out.name);
    const list = this.routes.get(key);
    if (list) this.routes.set(key, list.filter((r) => !(r.to === to && r.toField === inn.name)));
  }

  allRoutes() {
    return [...this.routes.values()].flat();
  }

  sendIn(node, name, value, time = this.now) {
    const d = node.schema.resolveIn(name);
    if (!d) { this.warn(`${node.type} has no eventIn '${name}'`); return; }
    this.dirty = true;
    if (node instanceof ProtoInstance) {
      if (d.kind === 'exposedField') {
        node.f[d.name] = value; node._ver++;
        this.emit(node, d.name, value, time);
      }
      for (const l of node.isIn.get(d.name) || []) this.sendIn(l.node, l.field, cloneValue(value), time);
      return;
    }
    if (node.type === 'Script') {
      node._runner?.receive(d.name, value, time);
      return;
    }
    const beh = BEHAVIORS[node.type];
    if (d.kind === 'exposedField') {
      if (beh?.filterSet && beh.filterSet(node, d.name, value, time, this) === false) return;
      node.f[d.name] = value;
      node._ver++;
      this.emit(node, d.name, value, time);
      beh?.changed?.(node, d.name, value, time, this);
    } else {
      beh?.eventIn?.(node, d.name, value, time, this);
    }
  }

  emit(node, name, value, time = this.now) {
    const d = node.schema.resolveOut(name);
    if (!d) return;
    if (d.kind === 'eventOut') node.f[d.name] = value;
    const list = this.routes.get(this.routeKey(node, d.name));
    if (list) {
      for (const r of list) {
        if (r.stamp === time) continue; // loop breaking: one event per route per timestamp
        r.stamp = time;
        this.sendIn(r.to, r.toField, cloneValue(value), time);
      }
    }
    const links = node.isOut?.get(d.name);
    if (links) {
      for (const l of links) {
        const pd = l.inst.schema.get(l.field);
        if (pd && pd.kind !== 'eventIn') l.inst.f[l.field] = cloneValue(value);
        this.emit(l.inst, l.field, value, time);
      }
    }
  }

  flushScripts() {
    let guard = 0;
    while (this.pendingScripts.size && guard++ < 100) {
      const list = [...this.pendingScripts];
      this.pendingScripts.clear();
      for (const s of list) s._runner.eventsProcessed();
    }
  }

  // ---------- time ----------
  tick(now = nowSeconds()) {
    this.now = now;
    for (const ts of this.timeSensors) BEHAVIORS.TimeSensor.tick(ts, now, this);
    for (const a of this.audio) BEHAVIORS.AudioClip.tick(a, now, this);
    for (const v of this.visibility) {
      if (!v._reported && v.f.enabled) {
        v._reported = true;
        this.emit(v, 'isActive', true, now);
        this.emit(v, 'enterTime', now, now);
      }
    }
    this.flushScripts();
  }

  // ---------- bindable nodes ----------
  top(type) { const s = this.stacks[type]; return s[s.length - 1] || null; }

  bind(node, on, time = this.now) {
    const stack = this.stacks[node.type];
    if (!stack) return;
    const top = stack[stack.length - 1];
    if (on) {
      if (top === node) return;
      const i = stack.indexOf(node);
      if (i >= 0) stack.splice(i, 1);
      stack.push(node);
      if (top) this.emit(top, 'isBound', false, time);
      this.emit(node, 'isBound', true, time);
      if (node.type === 'Viewpoint') this.emit(node, 'bindTime', time, time);
    } else {
      const i = stack.indexOf(node);
      if (i < 0) return;
      stack.splice(i, 1);
      if (top === node) {
        this.emit(node, 'isBound', false, time);
        const nt = stack[stack.length - 1];
        if (nt) {
          this.emit(nt, 'isBound', true, time);
          if (nt.type === 'Viewpoint') this.emit(nt, 'bindTime', time, time);
        }
      }
    }
    this.dirty = true;
    this.notify('bind', node);
  }

  // ---------- Inline & EXTERNPROTO ----------
  async fetchText(url) {
    if (!this.opts.fetchText) throw new Error('No way to fetch ' + url);
    return this.opts.fetchText(url, this.url);
  }

  async loadInline(node) {
    const urls = node.f.url;
    node._children = [];
    if (!urls.length) return;
    this.pending++;
    const loadId = (node._loadId = (node._loadId || 0) + 1);
    for (const u of urls) {
      try {
        const text = await this.fetchText(u);
        if (node._loadId !== loadId) return;
        node._children = this.parseInto(text, { inline: true });
        node._ver++;
        this.dirty = true;
        this.notify('inline', node);
        break;
      } catch (e) {
        this.warn(`Inline could not load "${u}": ${e.message}`);
      }
    }
    this.pending--;
  }

  async deferExternProto(inst, def) {
    this.pending++;
    try {
      let realDef = null;
      for (const u of def.urls) {
        const [file, frag] = u.split('#');
        try {
          const text = await this.fetchText(file);
          const scratch = new World({ warn: () => {} });
          scratch.load(text);
          realDef = frag ? scratch.protos.get(frag) : [...scratch.protos.map.values()][0];
          if (realDef) break;
        } catch (e) {
          this.warn(`EXTERNPROTO ${def.name}: could not load "${u}": ${e.message}`);
        }
      }
      if (!realDef) { this.warn(`EXTERNPROTO ${def.name} never resolved; instances will be invisible.`); return; }
      for (const d of realDef.schema.fields.values()) {
        if (!inst._given?.has(d.name) && d.kind !== 'eventIn' && d.kind !== 'eventOut') {
          inst.f[d.name] = cloneValue(d.value);
        }
      }
      const created = [];
      instantiateProtoBody(inst, realDef, this.makeCtx({ version: 2, created }));
      this.initNodes(created);
      for (const n of created) if (n.type === 'Script') n._runner?.initialize();
      inst._ver++;
      this.dirty = true;
    } finally {
      this.pending--;
    }
  }

  // ---------- proximity ----------
  // Called by the viewer every frame with the camera in world space.
  updateProximity(camPos, camRotMat, time) {
    for (const p of this.proximity) BEHAVIORS.ProximitySensor.update(p, camPos, camRotMat, time, this);
  }

  findDef(name) {
    return this.defs.get(name) || null;
  }
}

export { VRMLError };
