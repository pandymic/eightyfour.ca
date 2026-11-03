// WebGL2 renderer. Walks the scene graph every frame, collects shapes,
// lights and sensors, then draws with a per-pixel version of the VRML97
// lighting equation (section 4.14 of the spec, if you have it handy).

import { mat4, vec3, quat, rotationToMat } from './math.js?v=f2166ec675';
import { ProtoInstance } from './node.js?v=7fee4c555e';
import {
  buildFaceSet, buildBox, buildSphere, buildCylinder, buildCone,
  buildElevationGrid, buildExtrusion, buildLineSet, buildPointSet, buildText,
} from './geometry.js?v=75be9ac128';

const MAX_LIGHTS = 8;

const VS = `#version 300 es
in vec3 aPos; in vec3 aNormal; in vec3 aColor; in vec2 aUV;
uniform mat4 uModelView, uProj;
uniform mat3 uNormalMat, uTexMat;
uniform float uPointSize;
out vec3 vPos; out vec3 vN; out vec3 vColor; out vec2 vUV;
void main() {
  vec4 p = uModelView * vec4(aPos, 1.0);
  vPos = p.xyz;
  vN = uNormalMat * aNormal;
  vColor = aColor;
  vUV = (uTexMat * vec3(aUV, 1.0)).xy;
  gl_Position = uProj * p;
  gl_PointSize = uPointSize;
}`;

const FS = `#version 300 es
precision highp float;
in vec3 vPos; in vec3 vN; in vec3 vColor; in vec2 vUV;
uniform int uLit, uHasColor, uHasTex, uTexComp, uLightCount, uFogType;
uniform sampler2D uTex;
uniform vec3 uDiffuse, uEmissive, uSpecular, uFogColor;
uniform float uAmbient, uShininess, uAlpha, uFogRange;
uniform int uLType[${MAX_LIGHTS}];
uniform vec3 uLColor[${MAX_LIGHTS}], uLAmb[${MAX_LIGHTS}], uLPos[${MAX_LIGHTS}], uLDir[${MAX_LIGHTS}], uLAtt[${MAX_LIGHTS}];
uniform float uLRadius[${MAX_LIGHTS}], uLBeam[${MAX_LIGHTS}], uLCut[${MAX_LIGHTS}];
out vec4 outColor;
void main() {
  vec3 diffuse = uHasColor == 1 ? vColor : uDiffuse;
  float alpha = uAlpha;
  if (uHasTex == 1) {
    vec4 t = texture(uTex, vUV);
    if (uTexComp == 1) diffuse *= t.r;
    else if (uTexComp == 2) { diffuse *= t.r; alpha *= t.a; }
    else if (uTexComp == 3) diffuse = t.rgb;
    else if (uTexComp == 4) { diffuse = t.rgb; alpha *= t.a; }
    else alpha *= t.a; // text: the texture is only a mask
  }
  if (alpha < 0.004) discard;
  vec3 col;
  if (uLit == 0) {
    col = diffuse;
  } else {
    vec3 N = normalize(vN);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(-vPos);
    col = uEmissive;
    for (int i = 0; i < ${MAX_LIGHTS}; i++) {
      if (i >= uLightCount) break;
      vec3 L; float att = 1.0, spot = 1.0;
      if (uLType[i] == 0) {
        L = normalize(-uLDir[i]);
      } else {
        vec3 d = uLPos[i] - vPos;
        float dist = length(d);
        if (dist > uLRadius[i]) continue;
        L = d / max(dist, 1e-5);
        att = 1.0 / max(uLAtt[i].x + uLAtt[i].y * dist + uLAtt[i].z * dist * dist, 1.0);
        if (uLType[i] == 2) {
          float ang = acos(clamp(dot(-L, normalize(uLDir[i])), -1.0, 1.0));
          if (ang >= uLCut[i]) spot = 0.0;
          else if (ang > uLBeam[i]) spot = (ang - uLCut[i]) / (uLBeam[i] - uLCut[i]);
        }
      }
      float ndl = max(dot(N, L), 0.0);
      float spec = 0.0;
      if (ndl > 0.0) spec = pow(max(dot(N, normalize(L + V)), 0.0), max(uShininess * 128.0, 1.0));
      col += att * spot * (uLAmb[i] * diffuse * uAmbient + uLColor[i] * (diffuse * ndl + uSpecular * spec));
    }
  }
  if (uFogType > 0 && uFogRange > 0.0) {
    float dist = length(vPos);
    float f = uFogType == 1 ? (uFogRange - dist) / uFogRange : exp(-dist / max(uFogRange - dist, 1e-4));
    if (dist >= uFogRange) f = 0.0;
    col = mix(uFogColor, col, clamp(f, 0.0, 1.0));
  }
  outColor = vec4(clamp(col, 0.0, 1.0), alpha);
}`;

const BG_VS = `#version 300 es
in vec2 aPos; out vec2 vNdc;
void main() { vNdc = aPos; gl_Position = vec4(aPos, 0.9999, 1.0); }`;

const BG_FS = `#version 300 es
precision highp float;
in vec2 vNdc;
uniform mat4 uInv;
uniform vec3 uSky[8]; uniform float uSkyAng[8]; uniform int uSkyN;
uniform vec3 uGround[8]; uniform float uGroundAng[8]; uniform int uGroundN;
out vec4 outColor;
vec3 ramp(vec3 cols[8], float angs[8], int n, float a) {
  if (n <= 1) return cols[0];
  for (int i = 1; i < 8; i++) {
    if (i >= n) break;
    float a0 = i == 1 ? 0.0 : angs[i - 2];
    float a1 = angs[i - 1];
    if (a <= a1) return mix(cols[i - 1], cols[i], clamp((a - a0) / max(a1 - a0, 1e-5), 0.0, 1.0));
  }
  return cols[n - 1];
}
void main() {
  vec4 p = uInv * vec4(vNdc, 1.0, 1.0);
  vec3 d = normalize(p.xyz / p.w);
  float theta = acos(clamp(d.y, -1.0, 1.0));
  vec3 c = ramp(uSky, uSkyAng, uSkyN, theta);
  if (uGroundN > 0) {
    float phi = acos(clamp(-d.y, -1.0, 1.0));
    float limit = uGroundN > 1 ? uGroundAng[uGroundN - 2] : 0.0;
    if (uGroundN == 1) limit = 1.5707963;
    if (phi <= limit) c = ramp(uGround, uGroundAng, uGroundN, phi);
  }
  outColor = vec4(c, 1.0);
}`;

function compile(gl, vs, fs) {
  const mk = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'aPos');
  gl.bindAttribLocation(p, 1, 'aNormal');
  gl.bindAttribLocation(p, 2, 'aColor');
  gl.bindAttribLocation(p, 3, 'aUV');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    const name = info.name.replace(/\[0\]$/, '');
    u[name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

export function transformLocal(f) {
  const T = mat4.translation(...f.translation);
  const C = mat4.translation(...f.center);
  const Ci = mat4.translation(-f.center[0], -f.center[1], -f.center[2]);
  const R = rotationToMat(f.rotation);
  const so = f.scaleOrientation;
  const SR = rotationToMat(so);
  const SRi = mat4.rotation(so[0], so[1], so[2], -so[3]);
  const S = mat4.scaling(...f.scale);
  let m = mat4.multiply(T, C);
  m = mat4.multiply(m, R);
  m = mat4.multiply(m, SR);
  m = mat4.multiply(m, S);
  m = mat4.multiply(m, SRi);
  return mat4.multiply(m, Ci);
}

function texMatrix(tt) {
  if (!tt) return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  const f = tt.f;
  // Tc' = -C * S * R * C * T * Tc, as 3x3 column-major
  const m3 = (a, b) => {
    const r = new Float32Array(9);
    for (let c = 0; c < 3; c++) for (let row = 0; row < 3; row++) {
      r[c * 3 + row] = a[row] * b[c * 3] + a[3 + row] * b[c * 3 + 1] + a[6 + row] * b[c * 3 + 2];
    }
    return r;
  };
  const tr = (x, y) => new Float32Array([1, 0, 0, 0, 1, 0, x, y, 1]);
  const cs = Math.cos(f.rotation), sn = Math.sin(f.rotation);
  const R = new Float32Array([cs, sn, 0, -sn, cs, 0, 0, 0, 1]);
  const S = new Float32Array([f.scale[0], 0, 0, 0, f.scale[1], 0, 0, 0, 1]);
  let m = tr(-f.center[0], -f.center[1]);
  m = m3(m, S);
  m = m3(m, R);
  m = m3(m, tr(f.center[0], f.center[1]));
  return m3(m, tr(f.translation[0], f.translation[1]));
}

const SENSOR_TYPES = new Set(['TouchSensor', 'PlaneSensor', 'SphereSensor', 'CylinderSensor']);
const LIGHT_TYPES = new Set(['DirectionalLight', 'PointLight', 'SpotLight']);

export class Renderer {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, preserveDrawingBuffer: true });
    if (!gl) throw new Error('No WebGL2. This browser is more 1997 than we are.');
    this.gl = gl;
    this.opts = opts; // { resolveURL(url) -> string|Promise<string>, warn }
    this.main = compile(gl, VS, FS);
    this.bg = compile(gl, BG_VS, BG_FS);
    this.geomCache = new WeakMap();
    this.texCache = new WeakMap();
    this.wireframe = false;
    this.stats = { shapes: 0, tris: 0 };
    // full-screen triangle for the background
    this.bgVao = gl.createVertexArray();
    gl.bindVertexArray(this.bgVao);
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    this.white = this.makeTex(new Uint8Array([255, 255, 255, 255]), 1, 1);
  }

  makeTex(data, w, h) {
    const gl = this.gl;
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return t;
  }

  dispose() {
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  // ---------- traversal ----------
  collect(world, camPos, camRot) {
    const items = [], lights = [], bindMats = [];
    const ctx = { items, lights, camPos, camRot, world };
    const visitList = (list, M, scoped, sensors) => {
      // pass 1: scoped lights and sensors among the siblings
      let localLights = scoped;
      let level = null;
      for (const raw of list) {
        const n = raw?.renderNode;
        if (!n) continue;
        if (n.type === 'DirectionalLight' && n.f.on) {
          if (localLights === scoped) localLights = scoped.slice();
          localLights.push({ node: n, M });
        } else if (SENSOR_TYPES.has(n.type)) {
          if (!level) level = { sensors: [], M };
          level.sensors.push(n);
          n._mat = M;
        }
      }
      const sens = level ? [...sensors, level] : sensors;
      for (const raw of list) visit(raw, M, localLights, sens);
    };
    const visit = (raw, M, scoped, sensors) => {
      if (!raw) return;
      const n = raw instanceof ProtoInstance ? raw.renderNode : raw;
      if (!n) return;
      const f = n.f;
      switch (n.type) {
        case 'Transform': {
          const L = transformLocal(f);
          visitList(f.children, mat4.multiply(M, L), scoped, sensors);
          break;
        }
        case 'MatrixTransform':
          visitList(f.children, mat4.multiply(M, new Float32Array(f.matrix)), scoped, sensors);
          break;
        case 'Group': case 'Collision':
          visitList(f.children, M, scoped, sensors);
          break;
        case 'Anchor': {
          const level = { sensors: [n], M, anchor: true };
          visitList(f.children, M, scoped, [...sensors, level]);
          break;
        }
        case 'Billboard': {
          visitList(f.children, mat4.multiply(M, this.billboard(n, M, camPos, camRot)), scoped, sensors);
          break;
        }
        case 'Switch': {
          const c = f.choice[f.whichChoice];
          if (c) visitList([c], M, scoped, sensors);
          break;
        }
        case 'LOD': {
          if (!f.level.length) break;
          const inv = mat4.invert(M);
          const lc = mat4.transformPoint(inv, camPos);
          const d = vec3.length(vec3.sub(lc, f.center));
          let i = 0;
          while (i < f.range.length && d >= f.range[i]) i++;
          visitList([f.level[Math.min(i, f.level.length - 1)]], M, scoped, sensors);
          break;
        }
        case 'Inline':
          if (n._children) visitList(n._children, M, scoped, sensors);
          break;
        case 'Shape':
          if (f.geometry) items.push({ shape: n, M, dirLights: scoped, sensors });
          break;
        case 'PointLight': case 'SpotLight':
          if (f.on) lights.push({ node: n, M });
          break;
        case 'Viewpoint': case 'Background': case 'Fog': case 'NavigationInfo':
        case 'ProximitySensor': case 'Sound': case 'VisibilitySensor':
          n._mat = M;
          break;
        default:
          break;
      }
    };
    visitList(world.roots, mat4.identity(), [], []);
    void ctx; void bindMats;
    return { items, lights };
  }

  billboard(n, M, camPos, camRot) {
    const axis = n.f.axisOfRotation;
    const inv = mat4.invert(M);
    if (!vec3.length(axis)) {
      // screen aligned: undo parent rotation, apply camera rotation
      const r = mat4.multiply(inv, camRot);
      const cols = [0, 4, 8].map((o) => vec3.normalize([r[o], r[o + 1], r[o + 2]]));
      const m = mat4.identity();
      for (let c = 0; c < 3; c++) for (let k = 0; k < 3; k++) m[c * 4 + k] = cols[c][k];
      return m;
    }
    const a = vec3.normalize(axis);
    const v = mat4.transformPoint(inv, camPos);
    const vp = vec3.sub(v, vec3.scale(a, vec3.dot(v, a)));
    const zp = vec3.sub([0, 0, 1], vec3.scale(a, a[2]));
    if (vec3.length(vp) < 1e-6 || vec3.length(zp) < 1e-6) return mat4.identity();
    const ang = Math.atan2(vec3.dot(a, vec3.cross(zp, vp)), vec3.dot(zp, vp));
    return mat4.rotation(a[0], a[1], a[2], ang);
  }

  // ---------- geometry ----------
  geomKey(g) {
    const f = g.f;
    const parts = [g.id, g._ver];
    for (const k of ['coord', 'color', 'normal', 'texCoord', 'fontStyle']) if (f[k]) parts.push(f[k].renderNode?._ver ?? f[k]._ver);
    return parts.join(':');
  }

  buildGeom(g) {
    const f = g.f;
    const pts = (n, k) => (n ? n.renderNode?.f[k] || [] : []);
    switch (g.type) {
      case 'Box': return buildBox(f.size);
      case 'Sphere': return buildSphere(f.radius);
      case 'Cylinder': return buildCylinder(f);
      case 'Cone': return buildCone(f);
      case 'IndexedFaceSet':
        return buildFaceSet({
          coords: pts(f.coord, 'point'), coordIndex: f.coordIndex,
          colors: pts(f.color, 'color'), colorIndex: f.colorIndex, colorPerVertex: f.colorPerVertex,
          normals: pts(f.normal, 'vector'), normalIndex: f.normalIndex, normalPerVertex: f.normalPerVertex,
          texcoords: pts(f.texCoord, 'point'), texCoordIndex: f.texCoordIndex,
          ccw: f.ccw, convex: f.convex, creaseAngle: f.creaseAngle, solid: f.solid,
        });
      case 'ElevationGrid':
        return buildElevationGrid(f, pts(f.color, 'color'), pts(f.normal, 'vector'), pts(f.texCoord, 'point'));
      case 'Extrusion': return buildExtrusion(f);
      case 'IndexedLineSet':
        return buildLineSet(pts(f.coord, 'point'), f.coordIndex, pts(f.color, 'color'), f.colorIndex, f.colorPerVertex);
      case 'PointSet': return buildPointSet(pts(f.coord, 'point'), pts(f.color, 'color'));
      case 'Text': return buildText(f, f.fontStyle?.renderNode?.f);
      default: return null;
    }
  }

  getGeom(gnode) {
    const g = gnode.renderNode;
    if (!g) return null;
    const key = this.geomKey(g);
    let e = this.geomCache.get(g);
    if (e && e.key === key) return e;
    if (e) this.freeGeom(e);
    let cpu = null;
    try { cpu = this.buildGeom(g); } catch (err) { this.opts.warn?.(`${g.type}: ${err.message}`); }
    e = { key, cpu, gpu: cpu && cpu.count ? this.upload(cpu) : null, wire: null };
    if (cpu?.textCanvas) e.textTex = this.canvasTex(cpu.textCanvas);
    this.geomCache.set(g, e);
    return e;
  }

  freeGeom(e) {
    const gl = this.gl;
    for (const x of [e.gpu, e.wire]) {
      if (!x) continue;
      gl.deleteVertexArray(x.vao);
      x.bufs.forEach((b) => gl.deleteBuffer(b));
    }
    if (e.textTex) gl.deleteTexture(e.textTex);
  }

  upload(cpu) {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const bufs = [];
    const attr = (loc, data, size) => {
      if (!data) { gl.disableVertexAttribArray(loc); return; }
      const b = gl.createBuffer();
      bufs.push(b);
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    attr(0, cpu.positions, 3);
    attr(1, cpu.normals, 3);
    attr(2, cpu.colors, 3);
    attr(3, cpu.texcoords, 2);
    gl.bindVertexArray(null);
    return { vao, bufs, count: cpu.count };
  }

  wireOf(e) {
    if (e.wire) return e.wire;
    const p = e.cpu.positions;
    const out = new Float32Array((p.length / 9) * 18);
    let o = 0;
    for (let i = 0; i < p.length; i += 9) {
      for (const [a, b] of [[0, 3], [3, 6], [6, 0]]) {
        out.set(p.subarray(i + a, i + a + 3), o); o += 3;
        out.set(p.subarray(i + b, i + b + 3), o); o += 3;
      }
    }
    e.wire = this.upload({ positions: out, count: out.length / 3 });
    return e.wire;
  }

  // ---------- textures ----------
  canvasTex(canvas) {
    const gl = this.gl;
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  getTexture(tnode, world) {
    const t = tnode?.renderNode;
    if (!t) return null;
    const key = t.id + ':' + t._ver;
    let e = this.texCache.get(t);
    if (e && e.key === key) return e.ready ? e : null;
    if (e?.tex) this.gl.deleteTexture(e.tex);
    e = { key, ready: false, tex: null, comp: 4, alpha: false };
    this.texCache.set(t, e);
    const gl = this.gl;
    const wrap = (on) => (on ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    if (t.type === 'PixelTexture') {
      const img = t.f.image;
      if (!img || img.w <= 0 || img.h <= 0) return null;
      const data = new Uint8Array(img.w * img.h * 4);
      let alpha = false, gray = img.nc <= 2;
      img.pixels.forEach((px, i) => {
        let r, g, b, a = 255;
        switch (img.nc) {
          case 1: r = g = b = px & 255; break;
          case 2: r = g = b = (px >>> 8) & 255; a = px & 255; break;
          case 3: r = (px >>> 16) & 255; g = (px >>> 8) & 255; b = px & 255; break;
          default: r = (px >>> 24) & 255; g = (px >>> 16) & 255; b = (px >>> 8) & 255; a = px & 255;
        }
        if (a < 255) alpha = true;
        data.set([r, g, b, a], i * 4);
      });
      const tex = this.makeTex(data, img.w, img.h);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap(t.f.repeatS));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap(t.f.repeatT));
      Object.assign(e, { tex, ready: true, comp: img.nc, alpha: alpha && (img.nc === 2 || img.nc === 4), gray });
      return e;
    }
    if (t.type === 'ImageTexture') {
      const url = t.f.url[0];
      if (!url) return null;
      Promise.resolve(this.opts.resolveURL ? this.opts.resolveURL(url) : url).then((src) => {
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = () => {
          if (this.texCache.get(t) !== e) return;
          // peek at the pixels: grayscale? any alpha?
          let comp = 3, alpha = false;
          try {
            const c = document.createElement('canvas');
            c.width = Math.min(64, im.width); c.height = Math.min(64, im.height);
            const cx = c.getContext('2d');
            cx.drawImage(im, 0, 0, c.width, c.height);
            const d = cx.getImageData(0, 0, c.width, c.height).data;
            let gray = true;
            for (let i = 0; i < d.length; i += 4) {
              if (d[i + 3] < 250) alpha = true;
              if (Math.abs(d[i] - d[i + 1]) > 3 || Math.abs(d[i] - d[i + 2]) > 3) gray = false;
            }
            comp = gray ? (alpha ? 2 : 1) : (alpha ? 4 : 3);
          } catch { comp = 4; }
          const tex = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap(t.f.repeatS));
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap(t.f.repeatT));
          Object.assign(e, { tex, ready: true, comp, alpha });
          if (world) world.dirty = true;
          this.onAsync?.();
        };
        im.onerror = () => this.opts.warn?.(`ImageTexture could not load "${url}"`);
        im.src = src;
      }).catch((err) => this.opts.warn?.(`ImageTexture "${url}": ${err.message}`));
      return null;
    }
    return null; // MovieTexture: not today
  }

  // ---------- drawing ----------
  render(world, cam) {
    const gl = this.gl;
    const { view, proj, camPos, camRot, width, height } = cam;
    gl.viewport(0, 0, width, height);
    const { items, lights } = this.collect(world, camPos, camRot);
    this.lastItems = items;

    // background
    const bgNode = world.top('Background');
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (bgNode) this.drawBackground(bgNode, view, proj);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    const { p, u } = this.main;
    gl.useProgram(p);
    gl.uniformMatrix4fv(u.uProj, false, proj);
    gl.uniform1i(u.uTex, 0);

    // fog
    const fog = world.top('Fog');
    const ft = fog ? ({ LINEAR: 1, EXPONENTIAL: 2 }[fog.f.fogType] || 1) : 0;
    gl.uniform1i(u.uFogType, fog && fog.f.visibilityRange > 0 ? ft : 0);
    if (fog) { gl.uniform3fv(u.uFogColor, fog.f.color); gl.uniform1f(u.uFogRange, fog.f.visibilityRange); }

    const nav = world.top('NavigationInfo');
    const headlight = this.forceHeadlight ?? (nav ? nav.f.headlight : true);

    // global lights to view space
    const toView = (M, pnt) => mat4.transformPoint(view, mat4.transformPoint(M, pnt));
    const dirView = (M, d) => vec3.normalize(mat4.transformDir(view, mat4.transformDir(M, d)));
    const lightRec = (L, M) => {
      const f = L.f;
      const type = L.type === 'DirectionalLight' ? 0 : L.type === 'PointLight' ? 1 : 2;
      const scaleR = vec3.length(mat4.transformDir(M, [1, 0, 0])) || 1;
      return {
        type,
        color: f.color.map((c) => c * f.intensity),
        amb: f.color.map((c) => c * f.ambientIntensity),
        pos: type ? toView(M, f.location) : [0, 0, 0],
        dir: type !== 1 ? dirView(M, f.direction) : [0, 0, -1],
        att: f.attenuation || [1, 0, 0],
        radius: (f.radius ?? 1e9) * scaleR,
        beam: Math.min(f.beamWidth ?? 0, f.cutOffAngle ?? 0),
        cut: f.cutOffAngle ?? 0,
      };
    };
    const globals = lights.map(({ node, M }) => lightRec(node, M));
    const head = headlight ? [{ type: 0, color: [1, 1, 1], amb: [0, 0, 0], pos: [0, 0, 0], dir: [0, 0, -1], att: [1, 0, 0], radius: 1e9, beam: 0, cut: 0 }] : [];
    const dirCache = new Map();

    const opaque = [], transp = [];
    let tris = 0;
    for (const it of items) {
      const geom = this.getGeom(it.shape.f.geometry);
      if (!geom || !geom.gpu) continue;
      it.geom = geom;
      const app = it.shape.f.appearance?.renderNode;
      const mat = app?.f.material?.renderNode;
      const tex = app ? this.getTexture(app.f.texture, world) : null;
      it.app = app; it.mat = mat; it.tex = tex;
      const transparent = (mat && mat.f.transparency > 0.001) || (tex && tex.alpha) || geom.textTex;
      if (transparent) {
        const c = mat4.transformPoint(view, mat4.transformPoint(it.M, geom.cpu.bbox ? vec3.scale(vec3.add(geom.cpu.bbox[0], geom.cpu.bbox[1]), 0.5) : [0, 0, 0]));
        it.depth = c[2];
        transp.push(it);
      } else opaque.push(it);
      if (geom.cpu.kind === 'tris') tris += geom.gpu.count / 3;
    }
    transp.sort((a, b) => a.depth - b.depth);
    this.stats = { shapes: opaque.length + transp.length, tris };

    const draw = (it, blend) => {
      const { geom, mat, tex, app } = it;
      const kind = geom.cpu.kind;
      const MV = mat4.multiply(view, it.M);
      gl.uniformMatrix4fv(u.uModelView, false, MV);
      gl.uniformMatrix3fv(u.uNormalMat, false, mat4.normalMatrix(MV));
      gl.uniformMatrix3fv(u.uTexMat, false, texMatrix(app?.f.textureTransform?.renderNode));
      const wire = this.wireframe && kind === 'tris';
      const lit = !!mat && kind === 'tris' && !wire;
      gl.uniform1i(u.uLit, lit ? 1 : 0);
      const hasColor = !!geom.cpu.colors && !wire;
      gl.uniform1i(u.uHasColor, hasColor ? 1 : 0);
      if (!hasColor) gl.vertexAttrib3f(2, 1, 1, 1);
      if (mat) {
        const m = mat.f;
        const base = kind === 'tris' && !wire ? m.diffuseColor : (wire ? m.diffuseColor : m.emissiveColor);
        gl.uniform3fv(u.uDiffuse, base);
        gl.uniform3fv(u.uEmissive, m.emissiveColor);
        gl.uniform3fv(u.uSpecular, m.specularColor);
        gl.uniform1f(u.uAmbient, m.ambientIntensity);
        gl.uniform1f(u.uShininess, m.shininess);
        gl.uniform1f(u.uAlpha, 1 - m.transparency);
      } else {
        gl.uniform3fv(u.uDiffuse, [1, 1, 1]);
        gl.uniform1f(u.uAlpha, 1);
      }
      // texture
      let texObj = null, comp = 0;
      if (geom.textTex) { texObj = geom.textTex; comp = 5; }
      else if (tex && kind === 'tris' && !wire) { texObj = tex.tex; comp = tex.comp; }
      gl.uniform1i(u.uHasTex, texObj ? 1 : 0);
      gl.uniform1i(u.uTexComp, comp);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texObj || this.white);
      // lights
      if (lit) {
        let scoped = dirCache.get(it.dirLights);
        if (!scoped) {
          scoped = it.dirLights.map(({ node, M }) => lightRec(node, M));
          dirCache.set(it.dirLights, scoped);
        }
        const all = [...head, ...scoped, ...globals].slice(0, MAX_LIGHTS);
        gl.uniform1i(u.uLightCount, all.length);
        if (all.length) {
          const flat = (k) => all.flatMap((l) => l[k]);
          gl.uniform1iv(u.uLType, all.map((l) => l.type));
          gl.uniform3fv(u.uLColor, flat('color'));
          gl.uniform3fv(u.uLAmb, flat('amb'));
          gl.uniform3fv(u.uLPos, flat('pos'));
          gl.uniform3fv(u.uLDir, flat('dir'));
          gl.uniform3fv(u.uLAtt, flat('att'));
          gl.uniform1fv(u.uLRadius, all.map((l) => l.radius));
          gl.uniform1fv(u.uLBeam, all.map((l) => l.beam));
          gl.uniform1fv(u.uLCut, all.map((l) => l.cut));
        }
      }
      // culling
      if (kind === 'tris' && geom.cpu.solid && !blend) gl.enable(gl.CULL_FACE);
      else gl.disable(gl.CULL_FACE);
      gl.uniform1f(u.uPointSize, 3 * (window.devicePixelRatio || 1));
      if (wire) {
        const w = this.wireOf(geom);
        gl.bindVertexArray(w.vao);
        gl.vertexAttrib3f(1, 0, 0, 1);
        gl.drawArrays(gl.LINES, 0, w.count);
      } else {
        gl.bindVertexArray(geom.gpu.vao);
        gl.drawArrays(kind === 'tris' ? gl.TRIANGLES : kind === 'lines' ? gl.LINES : gl.POINTS, 0, geom.gpu.count);
      }
    };

    gl.disable(gl.BLEND);
    for (const it of opaque) draw(it, false);
    if (transp.length) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
      for (const it of transp) draw(it, true);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }
    gl.bindVertexArray(null);
    return items;
  }

  drawBackground(bg, view, proj) {
    const gl = this.gl;
    const { p, u } = this.bg;
    gl.useProgram(p);
    // rotation-only view, including the Background node's own orientation
    const v = mat4.clone(view);
    v[12] = v[13] = v[14] = 0;
    let m = v;
    if (bg._mat) {
      const r = mat4.clone(bg._mat);
      r[12] = r[13] = r[14] = 0;
      m = mat4.multiply(v, r);
    }
    gl.uniformMatrix4fv(u.uInv, false, mat4.invert(mat4.multiply(proj, m)));
    const pad = (cols, n) => { const a = new Float32Array(24); cols.slice(0, 8).forEach((c, i) => a.set(c, i * 3)); return a; };
    const padA = (angs) => { const a = new Float32Array(8); angs.slice(0, 8).forEach((x, i) => { a[i] = x; }); return a; };
    const f = bg.f;
    gl.uniform3fv(u.uSky, pad(f.skyColor.length ? f.skyColor : [[0, 0, 0]]));
    gl.uniform1fv(u.uSkyAng, padA(f.skyAngle));
    gl.uniform1i(u.uSkyN, Math.min(8, Math.max(1, Math.min(f.skyColor.length, f.skyAngle.length + 1))));
    gl.uniform3fv(u.uGround, pad(f.groundColor.length ? f.groundColor : [[0, 0, 0]]));
    gl.uniform1fv(u.uGroundAng, padA(f.groundAngle));
    gl.uniform1i(u.uGroundN, Math.min(8, Math.min(f.groundColor.length, f.groundAngle.length + 1)));
    gl.bindVertexArray(this.bgVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  }

  // ---------- picking ----------
  // origin/dir in world space; returns the nearest hit on any triangle shape.
  pick(origin, dir, items = this.lastItems || []) {
    let best = null;
    for (const it of items) {
      const geom = it.geom || this.getGeom(it.shape.f.geometry);
      if (!geom?.cpu || geom.cpu.kind !== 'tris') continue;
      const inv = mat4.invert(it.M);
      const o = mat4.transformPoint(inv, origin);
      const d = mat4.transformDir(inv, dir);
      // bounding box early-out
      const bb = geom.cpu.bbox;
      if (bb && !rayBox(o, d, bb)) continue;
      const P = geom.cpu.positions;
      for (let i = 0; i < P.length; i += 9) {
        const a = [P[i], P[i + 1], P[i + 2]], b = [P[i + 3], P[i + 4], P[i + 5]], c = [P[i + 6], P[i + 7], P[i + 8]];
        const h = rayTri(o, d, a, b, c);
        if (!h) continue;
        const local = vec3.add(o, vec3.scale(d, h.t));
        const world = mat4.transformPoint(it.M, local);
        const dist = vec3.length(vec3.sub(world, origin));
        if (best && dist >= best.dist) continue;
        const UV = geom.cpu.texcoords;
        let uv = [0, 0];
        if (UV) {
          const k = (i / 9) * 6, w = 1 - h.u - h.v;
          uv = [UV[k] * w + UV[k + 2] * h.u + UV[k + 4] * h.v, UV[k + 1] * w + UV[k + 3] * h.u + UV[k + 5] * h.v];
        }
        const n = vec3.normalize(vec3.cross(vec3.sub(b, a), vec3.sub(c, a)));
        best = { item: it, dist, world, local, normal: n, uv };
      }
    }
    return best;
  }
}

function rayBox(o, d, [min, max]) {
  let t0 = -Infinity, t1 = Infinity;
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-12) {
      if (o[i] < min[i] - 1e-6 || o[i] > max[i] + 1e-6) return false;
      continue;
    }
    let a = (min[i] - o[i]) / d[i], b = (max[i] - o[i]) / d[i];
    if (a > b) [a, b] = [b, a];
    t0 = Math.max(t0, a); t1 = Math.min(t1, b);
    if (t0 > t1 + 1e-6) return false;
  }
  return t1 >= 0;
}

function rayTri(o, d, a, b, c) {
  const e1 = vec3.sub(b, a), e2 = vec3.sub(c, a);
  const p = vec3.cross(d, e2);
  const det = vec3.dot(e1, p);
  if (Math.abs(det) < 1e-12) return null;
  const inv = 1 / det;
  const s = vec3.sub(o, a);
  const u = vec3.dot(s, p) * inv;
  if (u < 0 || u > 1) return null;
  const q = vec3.cross(s, e1);
  const v = vec3.dot(d, q) * inv;
  if (v < 0 || u + v > 1) return null;
  const t = vec3.dot(e2, q) * inv;
  return t > 1e-6 ? { t, u, v } : null;
}

export { quat };
