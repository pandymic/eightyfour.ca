// Turns VRML geometry nodes into flat triangle soup (or lines, or points)
// ready for the GPU. Everything funnels through buildFaceSet(), including
// ElevationGrid and Extrusion, which are just face sets wearing a hat.

import { vec3, quat } from './math.js';

const TAU = Math.PI * 2;

// ---------- polygon triangulation ----------
function newellNormal(pts) {
  let nx = 0, ny = 0, nz = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    nx += (a[1] - b[1]) * (a[2] + b[2]);
    ny += (a[2] - b[2]) * (a[0] + b[0]);
    nz += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return vec3.normalize([nx, ny, nz]);
}

function earClip(pts, normal) {
  const n = pts.length;
  if (n < 3) return [];
  if (n === 3) return [[0, 1, 2]];
  // project to 2D by dropping the dominant axis
  const ax = Math.abs(normal[0]), ay = Math.abs(normal[1]), az = Math.abs(normal[2]);
  let u = 0, v = 1, sign = normal[2];
  if (ax >= ay && ax >= az) { u = 1; v = 2; sign = normal[0]; }
  else if (ay >= az) { u = 2; v = 0; sign = normal[1]; }
  const p2 = pts.map((p) => [p[u], p[v]]);
  const flip = sign < 0 ? -1 : 1;
  const cross = (a, b, c) => ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) * flip;
  const inTri = (p, a, b, c) => cross(a, b, p) >= 0 && cross(b, c, p) >= 0 && cross(c, a, p) >= 0;
  const idx = [...Array(n).keys()];
  const tris = [];
  let guard = 0;
  while (idx.length > 3 && guard++ < n * n) {
    let clipped = false;
    for (let i = 0; i < idx.length; i++) {
      const i0 = idx[(i + idx.length - 1) % idx.length], i1 = idx[i], i2 = idx[(i + 1) % idx.length];
      const a = p2[i0], b = p2[i1], c = p2[i2];
      if (cross(a, b, c) <= 1e-12) continue;
      let ok = true;
      for (const j of idx) {
        if (j === i0 || j === i1 || j === i2) continue;
        if (inTri(p2[j], a, b, c)) { ok = false; break; }
      }
      if (!ok) continue;
      tris.push([i0, i1, i2]);
      idx.splice(i, 1);
      clipped = true;
      break;
    }
    if (!clipped) break;
  }
  if (idx.length === 3) tris.push([idx[0], idx[1], idx[2]]);
  else if (idx.length > 3) for (let i = 1; i < idx.length - 1; i++) tris.push([idx[0], idx[i], idx[i + 1]]);
  return tris;
}

// ---------- the face set workhorse ----------
// opts: coords, coordIndex, colors, colorIndex, colorPerVertex, normals,
// normalIndex, normalPerVertex, texcoords, texCoordIndex, ccw, convex,
// creaseAngle, solid
export function buildFaceSet(o) {
  const coords = o.coords || [];
  const ci = o.coordIndex || [];
  // split into faces
  const faces = [];
  let cur = null;
  for (let s = 0; s < ci.length; s++) {
    const k = ci[s];
    if (k < 0) { if (cur && cur.idx.length) faces.push(cur); cur = null; continue; }
    if (k >= coords.length) continue; // bad index, skip quietly
    if (!cur) cur = { idx: [], pos: [] };
    cur.idx.push(k); cur.pos.push(s);
  }
  if (cur && cur.idx.length) faces.push(cur);

  const ccw = o.ccw !== false;
  for (const f of faces) {
    const pts = f.idx.map((k) => coords[k]);
    let n = newellNormal(pts);
    f.n = ccw ? n : vec3.scale(n, -1);
    f.tris = f.idx.length < 3 ? [] : (o.convex !== false
      ? Array.from({ length: f.idx.length - 2 }, (_, i) => [0, i + 1, i + 2])
      : earClip(pts, n));
    if (!ccw) f.tris = f.tris.map(([a, b, c]) => [a, c, b]);
  }

  // smoothing groups for generated normals
  const genNormals = !(o.normals && o.normals.length);
  const crease = o.creaseAngle || 0;
  const cosCrease = Math.cos(Math.min(crease, Math.PI));
  let vertFaces = null;
  if (genNormals && crease > 0) {
    vertFaces = new Map();
    faces.forEach((f, fi) => {
      for (const k of f.idx) {
        if (!vertFaces.has(k)) vertFaces.set(k, []);
        vertFaces.get(k).push(fi);
      }
    });
  }

  // default texture mapping from the bounding box
  let texMap = null;
  if (!(o.texcoords && o.texcoords.length)) {
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (const p of coords) for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], p[i]); max[i] = Math.max(max[i], p[i]); }
    const size = [0, 1, 2].map((i) => max[i] - min[i]);
    const order = [0, 1, 2].sort((a, b) => size[b] - size[a]);
    const S = order[0], T = order[1], len = size[S] || 1;
    texMap = (p) => [(p[S] - min[S]) / len, (p[T] - min[T]) / len];
  }

  const P = [], N = [], C = [], UV = [];
  const hasColor = !!(o.colors && o.colors.length);
  faces.forEach((f, fi) => {
    for (const tri of f.tris) {
      for (const c of tri) {
        const k = f.idx[c], s = f.pos[c];
        const p = coords[k];
        P.push(p[0], p[1], p[2]);
        // normal
        let n;
        if (!genNormals) {
          let ni;
          if (o.normalPerVertex !== false) ni = o.normalIndex?.length ? o.normalIndex[s] : k;
          else ni = o.normalIndex?.length ? o.normalIndex[fi] : fi;
          n = o.normals[ni] || f.n;
        } else if (vertFaces) {
          let acc = [0, 0, 0];
          for (const g of vertFaces.get(k)) {
            const gn = faces[g].n;
            if (g === fi || vec3.dot(gn, f.n) >= cosCrease) acc = vec3.add(acc, gn);
          }
          n = vec3.normalize(acc);
        } else n = f.n;
        N.push(n[0], n[1], n[2]);
        // color
        if (hasColor) {
          let cc;
          if (o.colorPerVertex !== false) cc = o.colors[o.colorIndex?.length ? o.colorIndex[s] : k];
          else cc = o.colors[o.colorIndex?.length ? o.colorIndex[fi] : fi];
          cc = cc || [1, 1, 1];
          C.push(cc[0], cc[1], cc[2]);
        }
        // texture coordinates
        if (texMap) { const t = texMap(p); UV.push(t[0], t[1]); }
        else {
          const ti = o.texCoordIndex?.length ? o.texCoordIndex[s] : k;
          const t = o.texcoords[ti] || [0, 0];
          UV.push(t[0], t[1]);
        }
      }
    }
  });
  return finish({ kind: 'tris', P, N, C: hasColor ? C : null, UV, solid: o.solid !== false });
}

function finish(g) {
  const out = {
    kind: g.kind,
    positions: new Float32Array(g.P),
    normals: g.N ? new Float32Array(g.N) : null,
    colors: g.C ? new Float32Array(g.C) : null,
    texcoords: g.UV ? new Float32Array(g.UV) : null,
    solid: g.solid,
    count: g.P.length / 3,
  };
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < g.P.length; i += 3) {
    for (let j = 0; j < 3; j++) { min[j] = Math.min(min[j], g.P[i + j]); max[j] = Math.max(max[j], g.P[i + j]); }
  }
  out.bbox = out.count ? [min, max] : null;
  return out;
}

// ---------- primitives ----------
// Each primitive builds explicit triangles. push() orients each triangle so
// its face agrees with the supplied outward normals, which saves a lot of
// staring at winding diagrams.
function triBuilder() {
  const P = [], N = [], UV = [];
  return {
    P, N, UV,
    tri(a, b, c) { // each vertex: [pos, normal, uv]
      const e1 = vec3.sub(b[0], a[0]), e2 = vec3.sub(c[0], a[0]);
      const fn = vec3.cross(e1, e2);
      const avg = vec3.add(vec3.add(a[1], b[1]), c[1]);
      if (vec3.dot(fn, avg) < 0) [b, c] = [c, b];
      for (const v of [a, b, c]) { P.push(...v[0]); N.push(...v[1]); UV.push(...v[2]); }
    },
    quad(a, b, c, d) { this.tri(a, b, c); this.tri(a, c, d); },
  };
}

export function buildBox(size) {
  const [x, y, z] = size.map((s) => s / 2);
  const t = triBuilder();
  // face: normal, right, up (as seen from outside)
  const faces = [
    [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
    [[0, 0, -1], [-1, 0, 0], [0, 1, 0]],
    [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
    [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 0, 0], [0, 0, -1]],
    [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
  ];
  const half = [x, y, z];
  const pt = (n, r, u, sr, su) => [0, 1, 2].map((i) => (n[i] + r[i] * sr + u[i] * su) * half[i]);
  for (const [n, r, u] of faces) {
    const v = (sr, su) => [pt(n, r, u, sr, su), n, [(sr + 1) / 2, (su + 1) / 2]];
    t.quad(v(-1, -1), v(1, -1), v(1, 1), v(-1, 1));
  }
  return finish({ kind: 'tris', P: t.P, N: t.N, UV: t.UV, solid: true });
}

const ringPt = (r, y, u) => {
  const phi = u * TAU;
  return [-Math.sin(phi) * r, y, -Math.cos(phi) * r];
};

export function buildSphere(radius, seg = 36, rings = 18) {
  const t = triBuilder();
  const v = (u, w) => {
    const theta = w * Math.PI; // 0 at bottom
    const y = -Math.cos(theta), r = Math.sin(theta);
    const n = ringPt(r, y, u);
    return [n.map((c) => c * radius), n, [u, w]];
  };
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < seg; i++) {
      const u0 = i / seg, u1 = (i + 1) / seg, w0 = j / rings, w1 = (j + 1) / rings;
      if (j === 0) t.tri(v(u0, w0), v(u1, w1), v(u0, w1));
      else if (j === rings - 1) t.tri(v(u0, w0), v(u1, w0), v(u0, w1));
      else t.quad(v(u0, w0), v(u1, w0), v(u1, w1), v(u0, w1));
    }
  }
  return finish({ kind: 'tris', P: t.P, N: t.N, UV: t.UV, solid: true });
}

function cap(t, r, y, up, seg) {
  const n = [0, up ? 1 : -1, 0];
  const c = [[0, y, 0], n, [0.5, 0.5]];
  for (let i = 0; i < seg; i++) {
    const a = ringPt(r, y, i / seg), b = ringPt(r, y, (i + 1) / seg);
    const uv = (p) => [0.5 + p[0] / (2 * r), up ? 0.5 - p[2] / (2 * r) : 0.5 + p[2] / (2 * r)];
    t.tri(c, [a, n, uv(a)], [b, n, uv(b)]);
  }
}

export function buildCylinder(f, seg = 36) {
  const t = triBuilder();
  const r = f.radius, h = f.height / 2;
  if (f.side) {
    for (let i = 0; i < seg; i++) {
      const u0 = i / seg, u1 = (i + 1) / seg;
      const n0 = ringPt(1, 0, u0), n1 = ringPt(1, 0, u1);
      t.quad(
        [ringPt(r, -h, u0), n0, [u0, 0]], [ringPt(r, -h, u1), n1, [u1, 0]],
        [ringPt(r, h, u1), n1, [u1, 1]], [ringPt(r, h, u0), n0, [u0, 1]],
      );
    }
  }
  if (f.top) cap(t, r, h, true, seg);
  if (f.bottom) cap(t, r, -h, false, seg);
  return finish({ kind: 'tris', P: t.P, N: t.N, UV: t.UV, solid: true });
}

export function buildCone(f, seg = 36) {
  const t = triBuilder();
  const r = f.bottomRadius, h = f.height / 2, len = Math.hypot(f.height, r) || 1;
  if (f.side) {
    for (let i = 0; i < seg; i++) {
      const u0 = i / seg, u1 = (i + 1) / seg, um = (u0 + u1) / 2;
      const nrm = (u) => { const d = ringPt(1, 0, u); return [d[0] * f.height / len, r / len, d[2] * f.height / len]; };
      t.tri(
        [ringPt(r, -h, u0), nrm(u0), [u0, 0]],
        [ringPt(r, -h, u1), nrm(u1), [u1, 0]],
        [[0, h, 0], nrm(um), [um, 1]],
      );
    }
  }
  if (f.bottom) cap(t, r, -h, false, seg);
  return finish({ kind: 'tris', P: t.P, N: t.N, UV: t.UV, solid: true });
}

// ---------- ElevationGrid ----------
export function buildElevationGrid(f, colors, normals, texcoords) {
  const nx = f.xDimension, nz = f.zDimension;
  if (nx < 2 || nz < 2) return null;
  const coords = [];
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) coords.push([i * f.xSpacing, f.height[i + j * nx] || 0, j * f.zSpacing]);
  }
  const coordIndex = [];
  for (let j = 0; j < nz - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = i + j * nx;
      coordIndex.push(a, a + nx, a + nx + 1, a + 1, -1);
    }
  }
  let tc = texcoords;
  if (!tc || !tc.length) {
    tc = [];
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) tc.push([i / (nx - 1), j / (nz - 1)]);
  }
  return buildFaceSet({
    coords, coordIndex, colors, colorPerVertex: f.colorPerVertex,
    normals, normalPerVertex: f.normalPerVertex, texcoords: tc,
    ccw: f.ccw, convex: true, creaseAngle: f.creaseAngle, solid: f.solid,
  });
}

// ---------- Extrusion ----------
export function buildExtrusion(f) {
  const spine = f.spine, cs = f.crossSection;
  const n = spine.length, m = cs.length;
  if (n < 2 || m < 2) return null;
  const eq = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + (a.length > 2 ? Math.abs(a[2] - b[2]) : 0) < 1e-6;
  const spineClosed = n > 2 && eq(spine[0], spine[n - 1]);
  const csClosed = m > 2 && eq(cs[0], cs[m - 1]);

  // spine-aligned cross-section planes
  const Ys = [], Zs = [];
  for (let i = 0; i < n; i++) {
    let y;
    if (spineClosed && (i === 0 || i === n - 1)) y = vec3.sub(spine[1], spine[n - 2]);
    else if (i === 0) y = vec3.sub(spine[1], spine[0]);
    else if (i === n - 1) y = vec3.sub(spine[n - 1], spine[n - 2]);
    else y = vec3.sub(spine[i + 1], spine[i - 1]);
    Ys.push(vec3.normalize(y));
    let z = [0, 0, 0];
    const zAt = (k) => {
      const prev = spineClosed && k === 0 ? spine[n - 2] : spine[k - 1];
      const next = spineClosed && k === n - 1 ? spine[1] : spine[k + 1];
      return vec3.cross(vec3.sub(next, spine[k]), vec3.sub(prev, spine[k]));
    };
    if (spineClosed || (i > 0 && i < n - 1)) z = zAt(i);
    else if (n > 2) z = zAt(i === 0 ? 1 : n - 2);
    Zs.push(vec3.length(z) > 1e-9 ? vec3.normalize(z) : null);
  }
  // fill undefined Z axes
  if (Zs.every((z) => !z)) {
    const q = quat.fromTo([0, 1, 0], Ys[0]);
    const z0 = quat.rotate(q, [0, 0, 1]);
    for (let i = 0; i < n; i++) {
      const qi = quat.fromTo([0, 1, 0], Ys[i]);
      Zs[i] = vec3.length(Ys[i]) ? quat.rotate(qi, [0, 0, 1]) : z0;
    }
  } else {
    const firstZ = Zs.find((z) => z);
    for (let i = 0; i < n; i++) if (!Zs[i]) Zs[i] = i > 0 ? Zs[i - 1] : firstZ;
    for (let i = 1; i < n; i++) if (vec3.dot(Zs[i], Zs[i - 1]) < 0) Zs[i] = vec3.scale(Zs[i], -1);
  }
  for (let i = 0; i < n; i++) if (!vec3.length(Ys[i])) Ys[i] = i > 0 ? Ys[i - 1] : [0, 1, 0];

  const coords = [];
  for (let i = 0; i < n; i++) {
    const s = f.scale[Math.min(i, f.scale.length - 1)] || [1, 1];
    const o = f.orientation[Math.min(i, f.orientation.length - 1)] || [0, 0, 1, 0];
    const q = quat.fromAxisAngle(o);
    const Y = Ys[i], Z = Zs[i], X = vec3.normalize(vec3.cross(Y, Z));
    for (let j = 0; j < m; j++) {
      const p = quat.rotate(q, [cs[j][0] * s[0], 0, cs[j][1] * s[1]]);
      coords.push([
        spine[i][0] + X[0] * p[0] + Y[0] * p[1] + Z[0] * p[2],
        spine[i][1] + X[1] * p[0] + Y[1] * p[1] + Z[1] * p[2],
        spine[i][2] + X[2] * p[0] + Y[2] * p[1] + Z[2] * p[2],
      ]);
    }
  }
  // texture coordinates
  const cum = (pts, d) => { const out = [0]; for (let k = 1; k < pts.length; k++) out.push(out[k - 1] + d(pts[k], pts[k - 1])); return out; };
  const sLen = cum(cs, (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]));
  const tLen = cum(spine, (a, b) => vec3.length(vec3.sub(a, b)));
  const sTot = sLen[m - 1] || 1, tTot = tLen[n - 1] || 1;
  const texcoords = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) texcoords.push([sLen[j] / sTot, tLen[i] / tTot]);

  // Which way does the cross section wind? (x,z) plane, shoelace.
  let area = 0;
  for (let j = 0; j < m; j++) { const a = cs[j], b = cs[(j + 1) % m]; area += a[0] * b[1] - b[0] * a[1]; }
  const flip = area < 0;

  const vid = (i, j) => {
    if (csClosed && j === m - 1) j = 0;
    if (spineClosed && i === n - 1) i = 0;
    return i * m + j;
  };
  const coordIndex = [], texCoordIndex = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < m - 1; j++) {
      let q = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
      if (flip) q = q.reverse();
      for (const [a, b] of q) { coordIndex.push(vid(a, b)); texCoordIndex.push(a * m + b); }
      coordIndex.push(-1); texCoordIndex.push(-1);
    }
  }
  const capCount = csClosed ? m - 1 : m;
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of cs) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minZ = Math.min(minZ, p[1]); maxZ = Math.max(maxZ, p[1]); }
  const cspan = Math.max(maxX - minX, maxZ - minZ) || 1;
  const capTexBase = texcoords.length;
  for (let j = 0; j < capCount; j++) texcoords.push([(cs[j][0] - minX) / cspan, (cs[j][1] - minZ) / cspan]);
  const addCap = (i, outward) => {
    let ring = [...Array(capCount).keys()];
    const pts = ring.map((j) => coords[vid(i, j)]);
    const nrm = newellNormal(pts);
    if (vec3.dot(nrm, outward) < 0) ring = ring.reverse();
    for (const j of ring) { coordIndex.push(vid(i, j)); texCoordIndex.push(capTexBase + j); }
    coordIndex.push(-1); texCoordIndex.push(-1);
  };
  const sideFaces = coordIndex.filter((k) => k < 0).length;
  if (f.beginCap && capCount >= 3 && !spineClosed) addCap(0, vec3.scale(Ys[0], -1));
  if (f.endCap && capCount >= 3 && !spineClosed) addCap(n - 1, Ys[n - 1]);

  // Smooth only the sides; caps keep their own flat normal.
  const g = buildFaceSet({
    coords, coordIndex, texcoords, texCoordIndex,
    ccw: true, convex: f.convex, creaseAngle: f.creaseAngle, solid: f.solid,
    _sideFaces: sideFaces,
  });
  return g;
}

// ---------- lines and points ----------
export function buildLineSet(coords, coordIndex, colors, colorIndex, colorPerVertex) {
  const P = [], C = [];
  const hasColor = !!(colors && colors.length);
  let line = [], lineNo = 0;
  const flush = () => {
    for (let k = 0; k < line.length - 1; k++) {
      for (const e of [line[k], line[k + 1]]) {
        const p = coords[e.k];
        P.push(p[0], p[1], p[2]);
        if (hasColor) {
          let c;
          if (colorPerVertex !== false) c = colors[colorIndex?.length ? colorIndex[e.s] : e.k];
          else c = colors[colorIndex?.length ? colorIndex[lineNo] : lineNo];
          c = c || [1, 1, 1];
          C.push(c[0], c[1], c[2]);
        }
      }
    }
    if (line.length) lineNo++;
    line = [];
  };
  coordIndex.forEach((k, s) => {
    if (k < 0) flush();
    else if (coords[k]) line.push({ k, s });
  });
  flush();
  return finish({ kind: 'lines', P, C: hasColor ? C : null });
}

export function buildPointSet(coords, colors) {
  const P = [], C = [];
  const hasColor = !!(colors && colors.length);
  coords.forEach((p, i) => {
    P.push(p[0], p[1], p[2]);
    if (hasColor) { const c = colors[i] || [1, 1, 1]; C.push(c[0], c[1], c[2]); }
  });
  return finish({ kind: 'points', P, C: hasColor ? C : null });
}

// ---------- Text ----------
const FAMILIES = {
  SERIF: '"Times New Roman", Times, serif',
  SANS: 'Helvetica, Arial, sans-serif',
  TYPEWRITER: '"Courier New", Courier, monospace',
};

export function buildText(f, fs) {
  const strings = f.string.filter((s) => s !== undefined);
  if (!strings.length || typeof document === 'undefined') return null;
  const size = fs?.size ?? 1, spacing = fs?.spacing ?? 1;
  const fam = FAMILIES[(fs?.family?.[0] || 'SERIF').toUpperCase()] || FAMILIES.SERIF;
  const style = (fs?.style || 'PLAIN').toUpperCase();
  const justify = fs?.justify || ['BEGIN'];
  const major = (justify[0] || 'BEGIN').toUpperCase();
  const minor = (justify[1] || 'FIRST').toUpperCase();
  const PX = 64;
  const font = `${style.includes('ITALIC') ? 'italic ' : ''}${style.includes('BOLD') ? 'bold ' : ''}${PX}px ${fam}`;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const widths = strings.map((s, i) => {
    let w = ctx.measureText(s).width;
    const target = f.length?.[i];
    if (target > 0) w = (target / size) * PX;
    return w;
  });
  let scaleAll = 1;
  const maxW = Math.max(...widths, 1);
  if (f.maxExtent > 0 && (maxW / PX) * size > f.maxExtent) scaleAll = f.maxExtent / ((maxW / PX) * size);
  const step = spacing * PX;
  const ascent = PX * 0.82, descent = PX * 0.24;
  const pad = 4;
  const W = Math.ceil(maxW * scaleAll) + pad * 2;
  const H = Math.ceil((strings.length - 1) * step + ascent + descent) + pad * 2;
  canvas.width = Math.min(4096, W);
  canvas.height = Math.min(4096, H);
  ctx.font = font;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'alphabetic';
  strings.forEach((s, i) => {
    const natural = ctx.measureText(s).width || 1;
    const w = widths[i] * scaleAll;
    let x = pad;
    if (major === 'MIDDLE') x = pad + (maxW * scaleAll - w) / 2;
    else if (major === 'END') x = pad + maxW * scaleAll - w;
    ctx.save();
    ctx.translate(x, pad + ascent + i * step);
    ctx.scale(w / natural, 1);
    ctx.fillText(s, 0, 0);
    ctx.restore();
  });
  // world-space quad
  const u = size / PX;
  let x0 = 0;
  const wWorld = (W - pad * 2) * u;
  if (major === 'MIDDLE') x0 = -wWorld / 2;
  else if (major === 'END') x0 = -wWorld;
  x0 -= pad * u;
  let yTop = (ascent + pad) * u; // baseline of first line at y=0
  const blockH = ((strings.length - 1) * step + ascent + descent) * u;
  if (minor === 'BEGIN') yTop = pad * u;
  else if (minor === 'MIDDLE') yTop = blockH / 2 + pad * u;
  else if (minor === 'END') yTop = blockH + pad * u;
  const x1 = x0 + W * u, yBot = yTop - H * u;
  const su = canvas.width / W, sv = canvas.height / H;
  const P = [x0, yBot, 0, x1, yBot, 0, x1, yTop, 0, x0, yBot, 0, x1, yTop, 0, x0, yTop, 0];
  const N = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
  const g = finish({ kind: 'tris', P, N, UV: [0, 0, su, 0, su, sv, 0, 0, su, sv, 0, sv], solid: false });
  g.textCanvas = canvas;
  return g;
}
