// Field types. Values are stored as plain JS: numbers, booleans, strings,
// small arrays for vectors, arrays-of-those for MF types, Node objects for nodes.

export const SF_ARITY = {
  SFVec2f: 2, SFVec3f: 3, SFColor: 3, SFRotation: 4,
};

export const isMF = (t) => t.startsWith('MF');
export const sfOf = (t) => (isMF(t) ? 'SF' + t.slice(2) : t);

export function defaultValue(type) {
  if (isMF(type)) return [];
  switch (type) {
    case 'SFBool': return false;
    case 'SFInt32': case 'SFLong': case 'SFFloat': case 'SFTime': return 0;
    case 'SFString': case 'SFEnum': return '';
    case 'SFBitMask': return [];
    case 'SFVec2f': return [0, 0];
    case 'SFVec3f': case 'SFColor': return [0, 0, 0];
    case 'SFRotation': return [0, 0, 1, 0];
    case 'SFImage': return { w: 0, h: 0, nc: 0, pixels: [] };
    case 'SFMatrix': return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    case 'SFNode': return null;
    default: return null;
  }
}

// Deep copy of a value; nodes are shared, never copied.
export function cloneValue(v) {
  if (Array.isArray(v)) return v.map(cloneValue);
  if (v && typeof v === 'object' && 'pixels' in v && 'w' in v) {
    return { w: v.w, h: v.h, nc: v.nc, pixels: v.pixels.slice() };
  }
  return v;
}

export function valuesEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!valuesEqual(a[i], b[i])) return false;
    return true;
  }
  return false;
}

// Format a value back into VRML text. Used by the node reference appendix
// and by the console when printing things.
export function formatValue(type, v) {
  const num = (n) => {
    if (Number.isInteger(n)) return String(n);
    return String(+n.toFixed(6));
  };
  const sf = (t, x) => {
    switch (t) {
      case 'SFBool': return x ? 'TRUE' : 'FALSE';
      case 'SFString': return JSON.stringify(x);
      case 'SFInt32': case 'SFFloat': case 'SFTime': case 'SFLong': return num(x);
      case 'SFVec2f': case 'SFVec3f': case 'SFColor': case 'SFRotation': return x.map(num).join(' ');
      case 'SFNode': return x ? (x.name ? `USE ${x.name}` : `${x.type} { }`) : 'NULL';
      case 'SFImage': return `${x.w} ${x.h} ${x.nc}` + (x.pixels.length ? ' ...' : '');
      case 'SFEnum': return x;
      case 'SFBitMask': return x.length > 1 ? `(${x.join(' | ')})` : x[0] || '';
      case 'SFMatrix': return x.map(num).join(' ');
      default: return String(x);
    }
  };
  if (isMF(type)) {
    const t = sfOf(type);
    if (v.length === 1) return sf(t, v[0]);
    return '[' + v.map((x) => sf(t, x)).join(', ') + ']';
  }
  return sf(type, v);
}
