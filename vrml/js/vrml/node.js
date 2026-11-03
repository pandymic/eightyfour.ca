import { cloneValue, defaultValue } from './fields.js?v=faf24e7990';

// A schema is the interface of a node type: an ordered map of
// name -> { kind, type, name, value }. kind is one of
// field | exposedField | eventIn | eventOut.
export class Schema {
  constructor(type, decls = []) {
    this.type = type;
    this.fields = new Map();
    for (const d of decls) this.fields.set(d.name, d);
  }
  clone(type = this.type) {
    const s = new Schema(type);
    for (const [k, d] of this.fields) s.fields.set(k, { ...d, value: cloneValue(d.value) });
    return s;
  }
  get(name) { return this.fields.get(name); }

  // Map an incoming event name to the field that receives it.
  resolveIn(name) {
    let d = this.fields.get(name);
    if (d && (d.kind === 'eventIn' || d.kind === 'exposedField')) return d;
    if (name.startsWith('set_')) {
      d = this.fields.get(name.slice(4));
      if (d && d.kind === 'exposedField') return d;
    }
    return null;
  }
  // Map an outgoing event name to the field that produces it.
  resolveOut(name) {
    let d = this.fields.get(name);
    if (d && (d.kind === 'eventOut' || d.kind === 'exposedField')) return d;
    if (name.endsWith('_changed')) {
      d = this.fields.get(name.slice(0, -8));
      if (d && d.kind === 'exposedField') return d;
    }
    return null;
  }
}

let nodeSerial = 0;

export class Node {
  constructor(type, schema) {
    this.type = type;
    this.schema = schema;
    this.id = ++nodeSerial;
    this.name = null; // DEF name, if any
    this.f = Object.create(null);
    this._ver = 0;
    this.isOut = null; // Map eventOutName -> [{ inst, field }] for PROTO IS wiring
    for (const d of schema.fields.values()) {
      if (d.kind !== 'eventIn') {
        this.f[d.name] = d.value !== undefined ? cloneValue(d.value) : defaultValue(d.type);
      }
    }
  }
  get(name) { return this.f[name]; }
  set(name, value) {
    this.f[name] = value;
    this._ver++;
  }
  // The node actually used for rendering. Proto instances delegate.
  get renderNode() { return this; }
}

export class ProtoInstance extends Node {
  constructor(type, schema, def) {
    super(type, schema);
    this.proto = def;
    this.primary = null;
    this.body = [];
    this.isIn = new Map(); // protoField -> [{ node, field }]
  }
  get renderNode() {
    return this.primary ? this.primary.renderNode : null;
  }
}

export function addIsIn(inst, protoField, node, field) {
  if (!inst.isIn.has(protoField)) inst.isIn.set(protoField, []);
  inst.isIn.get(protoField).push({ node, field });
}
export function addIsOut(node, field, inst, protoField) {
  if (!node.isOut) node.isOut = new Map();
  if (!node.isOut.has(field)) node.isOut.set(field, []);
  node.isOut.get(field).push({ inst, field: protoField });
}
