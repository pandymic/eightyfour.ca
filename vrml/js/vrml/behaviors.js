// Per-node runtime behavior: sensors, interpolators, grouping events,
// bindables. Rendering lives elsewhere; this is the "what happens when an
// event shows up" part.

import { quat, mat4 } from './math.js';
import { cloneValue } from './fields.js';

// ---------- interpolators ----------
function segment(key, f) {
  const n = key.length;
  if (!n) return null;
  if (f <= key[0]) return [0, 0, 0];
  if (f >= key[n - 1]) return [n - 1, n - 1, 0];
  for (let i = 0; i < n - 1; i++) {
    if (f >= key[i] && f <= key[i + 1]) {
      const span = key[i + 1] - key[i];
      return [i, i + 1, span > 0 ? (f - key[i]) / span : 0];
    }
  }
  return [n - 1, n - 1, 0];
}

const lerp = (a, b, t) => a + (b - a) * t;
const lerpVec = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));

function makeInterp(mix, multi = false) {
  return {
    eventIn(node, name, f, time, world) {
      if (name !== 'set_fraction') return;
      const { key, keyValue } = node.f;
      const seg = segment(key, f);
      if (!seg || !keyValue.length) return;
      const [i, j, t] = seg;
      let out;
      if (multi) {
        const n = Math.floor(keyValue.length / key.length);
        out = [];
        for (let k = 0; k < n; k++) {
          const a = keyValue[i * n + k], b = keyValue[j * n + k];
          if (a && b) out.push(mix(a, b, t));
        }
      } else {
        const a = keyValue[Math.min(i, keyValue.length - 1)];
        const b = keyValue[Math.min(j, keyValue.length - 1)];
        out = mix(a, b, t);
      }
      world.emit(node, 'value_changed', out, time);
    },
  };
}

function slerpRot(a, b, t) {
  return quat.toAxisAngle(quat.slerp(quat.fromAxisAngle(a), quat.fromAxisAngle(b), t));
}
function lerpNormal(a, b, t) {
  const v = lerpVec(a, b, t);
  const l = Math.hypot(...v) || 1;
  return v.map((x) => x / l);
}

// ---------- grouping ----------
const groupEvents = {
  eventIn(node, name, value, time, world) {
    const kids = node.f.children;
    if (name === 'addChildren') {
      for (const c of value) if (c && !kids.includes(c)) kids.push(c);
    } else if (name === 'removeChildren') {
      node.f.children = kids.filter((c) => !value.includes(c));
    } else return;
    node._ver++;
    world.emit(node, 'children', node.f.children, time);
  },
};

const bindable = {
  eventIn(node, name, value, time, world) {
    if (name === 'set_bind') world.bind(node, value, time);
  },
};

// ---------- geometry eventIns that write to plain fields ----------
function setterFor(map) {
  return {
    eventIn(node, name, value) {
      const f = map[name];
      if (f) { node.f[f] = value; node._ver++; }
    },
  };
}

// ---------- TimeSensor ----------
function timeSensorTick(n, now, world) {
  const f = n.f;
  if (!f.enabled) {
    if (n._active) {
      n._active = false;
      world.emit(n, 'isActive', false, now);
    }
    return;
  }
  const ci = f.cycleInterval > 0 ? f.cycleInterval : 1;
  if (!n._active) {
    const stopOk = f.stopTime <= f.startTime || now < f.stopTime;
    if (now >= f.startTime && stopOk && (f.loop || now < f.startTime + ci)) {
      n._active = true;
      n._cycle = Math.floor((now - f.startTime) / ci);
      world.emit(n, 'isActive', true, now);
      world.emit(n, 'cycleTime', now, now);
    } else return;
  }
  const elapsed = now - f.startTime;
  let done = false;
  let frac;
  if (!f.loop && elapsed >= ci) { frac = 1; done = true; }
  else if (f.stopTime > f.startTime && now >= f.stopTime) {
    const e = f.stopTime - f.startTime;
    frac = (e / ci) % 1 || (e > 0 ? 1 : 0);
    done = true;
  } else {
    const c = elapsed / ci;
    frac = c - Math.floor(c);
    const cyc = Math.floor(c);
    if (cyc !== n._cycle) {
      n._cycle = cyc;
      world.emit(n, 'cycleTime', now, now);
    }
  }
  world.emit(n, 'fraction_changed', frac, now);
  world.emit(n, 'time', now, now);
  if (done) {
    n._active = false;
    world.emit(n, 'isActive', false, now);
  }
}

// ---------- AudioClip (minimal) ----------
function audioTick(n, now, world) {
  const f = n.f;
  const shouldPlay = now >= f.startTime && f.startTime > 0 &&
    (f.stopTime <= f.startTime || now < f.stopTime);
  if (shouldPlay && !n._active) {
    const url = f.url[0];
    if (!url) return;
    if (!n._audio) {
      n._audio = new Audio(url);
      n._audio.addEventListener('loadedmetadata', () => world.emit(n, 'duration_changed', n._audio.duration));
      n._audio.addEventListener('ended', () => { if (!f.loop) { n._active = false; world.emit(n, 'isActive', false); } });
    }
    n._audio.loop = f.loop;
    n._audio.playbackRate = f.pitch || 1;
    n._audio.volume = n._volume ?? 1;
    n._audio.currentTime = 0;
    n._audio.play().catch(() => world.warn('The browser refused to play audio until you click something. Some things never change.'));
    n._active = true;
    n._startedAt = f.startTime;
    world.emit(n, 'isActive', true, now);
  } else if (n._active && f.stopTime > f.startTime && now >= f.stopTime) {
    n._audio?.pause();
    n._active = false;
    world.emit(n, 'isActive', false, now);
  } else if (n._active && f.startTime !== n._startedAt) {
    n._active = false; // restart on next tick
  }
}

// ---------- ProximitySensor ----------
function mat3ToQuat(m) {
  // m is column-major 3x3 as [c0x,c0y,c0z, c1x,...]
  const m00 = m[0], m01 = m[3], m02 = m[6];
  const m10 = m[1], m11 = m[4], m12 = m[7];
  const m20 = m[2], m21 = m[5], m22 = m[8];
  const tr = m00 + m11 + m22;
  let x, y, z, w;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    w = 0.25 * s; x = (m21 - m12) / s; y = (m02 - m20) / s; z = (m10 - m01) / s;
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    w = (m21 - m12) / s; x = 0.25 * s; y = (m01 + m10) / s; z = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    w = (m02 - m20) / s; x = (m01 + m10) / s; y = 0.25 * s; z = (m12 + m21) / s;
  } else {
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    w = (m10 - m01) / s; x = (m02 + m20) / s; y = (m12 + m21) / s; z = 0.25 * s;
  }
  return [x, y, z, w];
}
export { mat3ToQuat };

function proximityUpdate(n, camPos, camRot, time, world) {
  const f = n.f;
  if (!f.enabled || !n._mat) return;
  const inv = mat4.invert(n._mat);
  const p = mat4.transformPoint(inv, camPos);
  const inside = [0, 1, 2].every((i) => Math.abs(p[i] - f.center[i]) <= f.size[i] / 2);
  if (inside && !n._active) {
    n._active = true;
    world.emit(n, 'isActive', true, time);
    world.emit(n, 'enterTime', time, time);
  } else if (!inside && n._active) {
    n._active = false;
    world.emit(n, 'isActive', false, time);
    world.emit(n, 'exitTime', time, time);
  }
  if (!inside) return;
  if (!n._lastPos || p.some((v, i) => Math.abs(v - n._lastPos[i]) > 1e-6)) {
    n._lastPos = p;
    world.emit(n, 'position_changed', p, time);
  }
  // camera orientation expressed in the sensor's coordinate system
  const r = mat4.multiply(inv, camRot);
  const cols = [0, 4, 8].map((o) => {
    const v = [r[o], r[o + 1], r[o + 2]];
    const l = Math.hypot(...v) || 1;
    return v.map((x) => x / l);
  });
  const q = mat3ToQuat([...cols[0], ...cols[1], ...cols[2]]);
  const aa = quat.toAxisAngle(q);
  if (!n._lastRot || aa.some((v, i) => Math.abs(v - n._lastRot[i]) > 1e-5)) {
    n._lastRot = aa;
    world.emit(n, 'orientation_changed', aa, time);
  }
}

export const BEHAVIORS = {
  Group: groupEvents,
  Transform: groupEvents,
  Anchor: groupEvents,
  Billboard: groupEvents,
  Collision: groupEvents,
  MatrixTransform: groupEvents,

  Viewpoint: bindable,
  NavigationInfo: bindable,
  Background: bindable,
  Fog: bindable,

  PositionInterpolator: makeInterp(lerpVec),
  ColorInterpolator: makeInterp(lerpVec),
  ScalarInterpolator: makeInterp(lerp),
  OrientationInterpolator: makeInterp(slerpRot),
  CoordinateInterpolator: makeInterp(lerpVec, true),
  NormalInterpolator: makeInterp(lerpNormal, true),

  IndexedFaceSet: setterFor({
    set_colorIndex: 'colorIndex', set_coordIndex: 'coordIndex',
    set_normalIndex: 'normalIndex', set_texCoordIndex: 'texCoordIndex',
  }),
  IndexedLineSet: setterFor({ set_colorIndex: 'colorIndex', set_coordIndex: 'coordIndex' }),
  ElevationGrid: setterFor({ set_height: 'height' }),
  Extrusion: setterFor({
    set_crossSection: 'crossSection', set_orientation: 'orientation',
    set_scale: 'scale', set_spine: 'spine',
  }),

  TimeSensor: {
    tick: timeSensorTick,
    filterSet(n, name) {
      // While running, a TimeSensor ignores changes to its timing fields.
      if (n._active && (name === 'startTime' || name === 'cycleInterval')) return false;
      return true;
    },
    changed(n, name, value, time, world) {
      if (name === 'enabled' && !value && n._active) {
        n._active = false;
        world.emit(n, 'isActive', false, time);
      }
    },
  },

  AudioClip: { tick: audioTick },
  Sound: {
    init(n) {
      const src = n.f.source;
      if (src) src._volume = Math.max(0, Math.min(1, n.f.intensity));
    },
  },

  Inline: {
    changed(n, name, v, t, world) { if (name === 'url') world.loadInline(n); },
  },

  ProximitySensor: { update: proximityUpdate },

  Switch: {},
  LOD: {},
};

export { cloneValue };
