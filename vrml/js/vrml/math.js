// Small, boring linear algebra. Column-major 4x4 matrices, like OpenGL wants.

export const mat4 = {
  identity() {
    const m = new Float32Array(16);
    m[0] = m[5] = m[10] = m[15] = 1;
    return m;
  },
  clone(a) { return new Float32Array(a); },
  multiply(a, b, out = new Float32Array(16)) {
    const r = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let row = 0; row < 4; row++) {
        r[c * 4 + row] =
          a[row] * b[c * 4] +
          a[4 + row] * b[c * 4 + 1] +
          a[8 + row] * b[c * 4 + 2] +
          a[12 + row] * b[c * 4 + 3];
      }
    }
    out.set(r);
    return out;
  },
  translation(x, y, z) {
    const m = mat4.identity();
    m[12] = x; m[13] = y; m[14] = z;
    return m;
  },
  scaling(x, y, z) {
    const m = mat4.identity();
    m[0] = x; m[5] = y; m[10] = z;
    return m;
  },
  // axis-angle rotation, the VRML way
  rotation(x, y, z, angle) {
    const m = mat4.identity();
    let len = Math.hypot(x, y, z);
    if (len < 1e-12 || angle === 0) return m;
    x /= len; y /= len; z /= len;
    const c = Math.cos(angle), s = Math.sin(angle), t = 1 - c;
    m[0] = t * x * x + c;     m[4] = t * x * y - s * z; m[8] = t * x * z + s * y;
    m[1] = t * x * y + s * z; m[5] = t * y * y + c;     m[9] = t * y * z - s * x;
    m[2] = t * x * z - s * y; m[6] = t * y * z + s * x; m[10] = t * z * z + c;
    return m;
  },
  invert(a, out = new Float32Array(16)) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) { out.set(mat4.identity()); return out; }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  },
  normalMatrix(m) {
    // inverse transpose of upper 3x3
    const inv = mat4.invert(m);
    return new Float32Array([
      inv[0], inv[4], inv[8],
      inv[1], inv[5], inv[9],
      inv[2], inv[6], inv[10],
    ]);
  },
  perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const m = new Float32Array(16);
    m[0] = f / aspect; m[5] = f;
    m[10] = (far + near) / (near - far); m[11] = -1;
    m[14] = (2 * far * near) / (near - far);
    return m;
  },
  ortho(l, r, b, t, n, f) {
    const m = mat4.identity();
    m[0] = 2 / (r - l); m[5] = 2 / (t - b); m[10] = -2 / (f - n);
    m[12] = -(r + l) / (r - l); m[13] = -(t + b) / (t - b); m[14] = -(f + n) / (f - n);
    return m;
  },
  transformPoint(m, p) {
    const x = p[0], y = p[1], z = p[2];
    const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
    return [
      (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
      (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
      (m[2] * x + m[6] * y + m[10] * z + m[14]) / w,
    ];
  },
  transformDir(m, d) {
    return [
      m[0] * d[0] + m[4] * d[1] + m[8] * d[2],
      m[1] * d[0] + m[5] * d[1] + m[9] * d[2],
      m[2] * d[0] + m[6] * d[1] + m[10] * d[2],
    ];
  },
};

export const vec3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ],
  length: (a) => Math.hypot(a[0], a[1], a[2]),
  normalize(a) {
    const l = Math.hypot(a[0], a[1], a[2]);
    return l > 1e-12 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 0];
  },
  lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
};

// Quaternions as [x, y, z, w]
export const quat = {
  fromAxisAngle(r) {
    let [x, y, z, a] = r;
    const l = Math.hypot(x, y, z);
    if (l < 1e-12) return [0, 0, 0, 1];
    const s = Math.sin(a / 2) / l;
    return [x * s, y * s, z * s, Math.cos(a / 2)];
  },
  toAxisAngle(q) {
    let [x, y, z, w] = q;
    const l = Math.hypot(x, y, z, w) || 1;
    x /= l; y /= l; z /= l; w /= l;
    const angle = 2 * Math.acos(Math.max(-1, Math.min(1, w)));
    const s = Math.sqrt(1 - w * w);
    if (s < 1e-6) return [0, 0, 1, 0];
    return [x / s, y / s, z / s, angle];
  },
  multiply(a, b) {
    const [ax, ay, az, aw] = a, [bx, by, bz, bw] = b;
    return [
      aw * bx + ax * bw + ay * bz - az * by,
      aw * by - ax * bz + ay * bw + az * bx,
      aw * bz + ax * by - ay * bx + az * bw,
      aw * bw - ax * bx - ay * by - az * bz,
    ];
  },
  slerp(a, b, t) {
    let [bx, by, bz, bw] = b;
    let cos = a[0] * bx + a[1] * by + a[2] * bz + a[3] * bw;
    if (cos < 0) { cos = -cos; bx = -bx; by = -by; bz = -bz; bw = -bw; }
    let s0, s1;
    if (1 - cos > 1e-6) {
      const om = Math.acos(cos), so = Math.sin(om);
      s0 = Math.sin((1 - t) * om) / so;
      s1 = Math.sin(t * om) / so;
    } else { s0 = 1 - t; s1 = t; }
    return [s0 * a[0] + s1 * bx, s0 * a[1] + s1 * by, s0 * a[2] + s1 * bz, s0 * a[3] + s1 * bw];
  },
  rotate(q, v) {
    const [x, y, z, w] = q;
    const ix = w * v[0] + y * v[2] - z * v[1];
    const iy = w * v[1] + z * v[0] - x * v[2];
    const iz = w * v[2] + x * v[1] - y * v[0];
    const iw = -x * v[0] - y * v[1] - z * v[2];
    return [
      ix * w + iw * -x + iy * -z - iz * -y,
      iy * w + iw * -y + iz * -x - ix * -z,
      iz * w + iw * -z + ix * -y - iy * -x,
    ];
  },
  // rotation taking unit vector a onto unit vector b
  fromTo(a, b) {
    const d = vec3.dot(a, b);
    if (d > 0.999999) return [0, 0, 0, 1];
    if (d < -0.999999) {
      let axis = vec3.cross([1, 0, 0], a);
      if (vec3.length(axis) < 1e-6) axis = vec3.cross([0, 1, 0], a);
      axis = vec3.normalize(axis);
      return [axis[0], axis[1], axis[2], 0];
    }
    const c = vec3.cross(a, b);
    const q = [c[0], c[1], c[2], 1 + d];
    const l = Math.hypot(...q);
    return q.map((v) => v / l);
  },
};

export function rotationToMat(r) {
  return mat4.rotation(r[0], r[1], r[2], r[3]);
}

// HSV helpers for SFColor.setHSV / getHSV
export function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360 / 60;
  const i = Math.floor(h), f = h - i;
  const p = v * (1 - s), q = v * (1 - s * f), t = v * (1 - s * (1 - f));
  return [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i % 6];
}
export function rgbToHsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, mx ? d / mx : 0, mx];
}
