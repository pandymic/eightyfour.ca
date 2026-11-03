// The viewer: a canvas, a control bar that looks like it shipped on a
// CD-ROM, navigation, pointing-device sensors and a console.

import { World, nowSeconds } from './world.js?v=a2755cdd91';
import { Renderer } from './renderer.js?v=836dc0021a';
import { mat4, vec3, quat } from './math.js?v=f2166ec675';
import { VRMLError } from './parser.js?v=3a1f1700f9';

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

function poseFromMatrix(M) {
  const pos = [M[12], M[13], M[14]];
  const cols = [0, 4, 8].map((o) => vec3.normalize([M[o], M[o + 1], M[o + 2]]));
  const m3 = [...cols[0], ...cols[1], ...cols[2]];
  // matrix -> quaternion
  const [m00, m10, m20, m01, m11, m21, m02, m12, m22] = m3;
  const tr = m00 + m11 + m22;
  let q;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; q = [(m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, 0.25 * s]; }
  else if (m00 > m11 && m00 > m22) { const s = Math.sqrt(1 + m00 - m11 - m22) * 2; q = [0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s]; }
  else if (m11 > m22) { const s = Math.sqrt(1 + m11 - m00 - m22) * 2; q = [(m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s]; }
  else { const s = Math.sqrt(1 + m22 - m00 - m11) * 2; q = [(m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s]; }
  return { pos, q };
}
const qconj = (q) => [-q[0], -q[1], -q[2], q[3]];
const qnorm = (q) => { const l = Math.hypot(...q) || 1; return q.map((x) => x / l); };
const qAxis = (axis, ang) => quat.fromAxisAngle([...axis, ang]);
const matFromPose = (pos, q) => {
  const [x, y, z, a] = quat.toAxisAngle(q);
  const m = mat4.rotation(x, y, z, a);
  m[12] = pos[0]; m[13] = pos[1]; m[14] = pos[2];
  return m;
};

export class Viewer {
  constructor(container, opts = {}) {
    this.opts = opts;
    this.root = el('div', 'vv');
    this.toolbar = el('div', 'vv-bar');
    this.stage = el('div', 'vv-stage');
    this.canvas = el('canvas', 'vv-canvas');
    this.canvas.tabIndex = 0;
    this.overlay = el('div', 'vv-overlay');
    this.status = el('div', 'vv-status');
    this.console = el('pre', 'vv-console');
    this.stage.append(this.canvas, this.overlay);
    this.root.append(this.toolbar, this.stage, this.status);
    if (opts.console !== false) this.root.append(this.console);
    if (opts.height) this.stage.style.height = opts.height;
    container.append(this.root);
    this.statusLeft = el('span', 'vv-status-l');
    this.statusRight = el('span', 'vv-status-r');
    this.status.append(this.statusLeft, this.statusRight);

    this.mode = 'EXAMINE';
    this.offset = { pos: [0, 0, 0], q: [0, 0, 0, 1] };
    this.keys = new Set();
    this.sceneCenter = [0, 0, 0];
    this.sceneRadius = 5;
    this.lastTime = nowSeconds();
    this.frames = 0;
    this.fps = 0;
    this.lines = [];
    this.description = '';
    this.anchorText = '';

    try {
      this.renderer = new Renderer(this.canvas, {
        resolveURL: (u) => this.resolveURL(u),
        warn: (m) => this.log(m, 'warn'),
      });
    } catch (e) {
      this.overlay.textContent = e.message;
      this.overlay.classList.add('show');
      this.failed = true;
      return;
    }
    this.world = this.makeWorld();
    this.buildToolbar();
    this.bindInput();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.stage);
    this.visible = true;
    this.io = new IntersectionObserver((ents) => {
      this.visible = ents.some((e) => e.isIntersecting);
      if (this.visible) this.loop();
    });
    this.io.observe(this.root);
    this.resize();
    this.loop();
  }

  makeWorld() {
    return new World({
      print: (s) => this.log(s),
      warn: (s) => this.log(s, 'warn'),
      fetchText: (u, base) => this.fetchText(u, base),
      loadURL: (u) => this.followURL(u),
      setDescription: (s) => { this.description = s; },
      replaceWorld: (nodes) => {
        this.world.roots = nodes;
        this.world.dirty = true;
      },
    });
  }

  // ---------- I/O ----------
  async fetchText(url) {
    if (this.opts.fetchText) {
      const r = await this.opts.fetchText(url);
      if (r != null) return r;
    }
    const res = await fetch(new URL(url, this.baseURL || document.baseURI));
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    if (/\.gz$/i.test(url) && 'DecompressionStream' in window) {
      return new Response(res.body.pipeThrough(new DecompressionStream('gzip'))).text();
    }
    return res.text();
  }
  resolveURL(u) {
    if (this.opts.resolveURL) return this.opts.resolveURL(u);
    return new URL(u, this.baseURL || document.baseURI).href;
  }
  followURL(url) {
    if (url.startsWith('#')) {
      const vp = this.world.findDef(url.slice(1));
      if (vp && vp.type === 'Viewpoint') this.world.sendIn(vp, 'set_bind', true);
      else this.log(`Anchor: no Viewpoint called "${url.slice(1)}"`, 'warn');
      return;
    }
    if (this.opts.onFollow && this.opts.onFollow(url) !== false) return;
    if (/\.wrl(\.gz)?$/i.test(url) || /^lib:/i.test(url)) {
      this.fetchText(url).then((t) => this.load(t, url)).catch((e) => this.log(`Could not load ${url}: ${e.message}`, 'warn'));
    } else {
      window.open(url, '_blank', 'noopener');
    }
  }

  log(msg, kind = 'info') {
    const line = (kind === 'warn' ? '! ' : '') + msg;
    this.lines.push(line);
    if (this.lines.length > 200) this.lines.shift();
    this.console.textContent = this.lines.join('\n');
    this.console.scrollTop = this.console.scrollHeight;
    this.console.classList.add('has');
    this.opts.onLog?.(msg, kind);
  }
  clearLog() { this.lines = []; this.console.textContent = ''; this.console.classList.remove('has'); }

  // ---------- loading ----------
  load(src, url = '') {
    if (this.failed) return false;
    this.overlay.classList.remove('show');
    this.clearLog();
    const w = this.makeWorld();
    try {
      w.load(src, { url });
    } catch (e) {
      const msg = e instanceof VRMLError ? e.message : `${e.name}: ${e.message}`;
      this.overlay.innerHTML = '';
      this.overlay.append(el('b', null, 'This world failed to load.'), el('div', null, msg));
      this.overlay.classList.add('show');
      this.log(msg, 'warn');
      this.opts.onError?.(e);
      return false;
    }
    this.world?.shutdownScripts();
    this.world = w;
    w.listeners.add((what, node) => {
      if (what === 'bind' && node.type === 'Viewpoint') this.onViewpointBound(node);
      if (what === 'bind' && node.type === 'NavigationInfo') this.applyNav(node);
      if (what === 'inline') this.fitPending = true;
    });
    this.offset = { pos: [0, 0, 0], q: [0, 0, 0, 1] };
    this.transition = null;
    this.applyNav(w.top('NavigationInfo'));
    this.fitPending = true;
    this.fillViewpoints();
    this.renderer.forceHeadlight = null;
    this.headBtn.classList.toggle('on', w.top('NavigationInfo')?.f.headlight ?? true);
    this.opts.onLoad?.(w);
    this.loop();
    return true;
  }

  applyNav(nav) {
    const types = nav ? nav.f.type.map((t) => t.toUpperCase()) : ['EXAMINE', 'ANY'];
    const first = types.find((t) => ['WALK', 'EXAMINE', 'FLY', 'NONE'].includes(t));
    this.allowAny = !nav || types.includes('ANY');
    this.allowed = this.allowAny ? ['EXAMINE', 'WALK', 'FLY'] : types.filter((t) => ['WALK', 'EXAMINE', 'FLY'].includes(t));
    this.setMode(first || (this.allowAny ? 'EXAMINE' : 'NONE'));
    for (const b of this.modeBtns || []) b.disabled = !this.allowed.includes(b.dataset.mode);
  }

  // ---------- toolbar ----------
  buildToolbar() {
    const btn = (label, title, fn) => {
      const b = el('button', 'vv-btn', label);
      b.type = 'button';
      b.title = title;
      b.addEventListener('click', (e) => { e.preventDefault(); fn(b); this.canvas.focus({ preventScroll: true }); });
      return b;
    };
    this.vpSelect = el('select', 'vv-vp');
    this.vpSelect.title = 'Viewpoints';
    this.vpSelect.addEventListener('change', () => {
      const vp = this.world.viewpoints[+this.vpSelect.value];
      if (vp) this.world.sendIn(vp, 'set_bind', true);
    });
    const prev = btn('Prev', 'Previous viewpoint (Page Up)', () => this.stepViewpoint(-1));
    const next = btn('Next', 'Next viewpoint (Page Down)', () => this.stepViewpoint(1));
    const sep = () => el('span', 'vv-sep');
    this.modeBtns = ['EXAMINE', 'WALK', 'FLY'].map((m) => {
      const b = btn(m[0] + m.slice(1).toLowerCase(), `${m} navigation`, () => this.setMode(m));
      b.dataset.mode = m;
      return b;
    });
    const straighten = btn('Level', 'Straighten up', () => this.straighten());
    const reset = btn('Home', 'Return to the current viewpoint', () => this.resetView());
    this.headBtn = btn('Headlight', 'Toggle headlight', (b) => {
      const on = !b.classList.contains('on');
      b.classList.toggle('on', on);
      this.renderer.forceHeadlight = on;
    });
    this.headBtn.classList.add('on');
    this.wireBtn = btn('Wire', 'Wireframe', (b) => {
      this.renderer.wireframe = !this.renderer.wireframe;
      b.classList.toggle('on', this.renderer.wireframe);
    });
    const shot = btn('Snap', 'Save a screenshot as PNG', () => this.screenshot());
    this.toolbar.append(this.vpSelect, prev, next, sep(), ...this.modeBtns, sep(), straighten, reset, sep(), this.headBtn, this.wireBtn, shot);
  }

  fillViewpoints() {
    this.vpSelect.innerHTML = '';
    const vps = this.world.viewpoints;
    if (!vps.length) {
      const o = el('option', null, 'Entry view');
      o.value = -1;
      this.vpSelect.append(o);
      this.vpSelect.disabled = true;
      return;
    }
    this.vpSelect.disabled = false;
    vps.forEach((vp, i) => {
      const o = el('option', null, vp.f.description || vp.name || `Viewpoint ${i + 1}`);
      o.value = i;
      this.vpSelect.append(o);
    });
    const top = this.world.top('Viewpoint');
    this.vpSelect.value = Math.max(0, vps.indexOf(top));
  }

  stepViewpoint(d) {
    const vps = this.world.viewpoints;
    if (!vps.length) return;
    const i = vps.indexOf(this.world.top('Viewpoint'));
    const vp = vps[(i + d + vps.length) % vps.length];
    this.world.sendIn(vp, 'set_bind', true);
  }

  setMode(m) {
    this.mode = m;
    for (const b of this.modeBtns || []) b.classList.toggle('on', b.dataset.mode === m);
  }

  screenshot() {
    this.renderFrame();
    this.canvas.toBlob((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = 'snapshot.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  // ---------- camera ----------
  basePose() {
    const vp = this.world.top('Viewpoint');
    if (!vp) return { pos: [0, 0, 10], q: [0, 0, 0, 1], fov: 0.785398 };
    let M = vp._mat ? mat4.clone(vp._mat) : mat4.identity();
    M = mat4.multiply(M, mat4.translation(...vp.f.position));
    M = mat4.multiply(M, mat4.rotation(...vp.f.orientation));
    const p = poseFromMatrix(M);
    p.fov = vp.f.fieldOfView;
    return p;
  }

  cameraPose() {
    const b = this.basePose();
    let pos = vec3.add(b.pos, quat.rotate(b.q, this.offset.pos));
    let q = qnorm(quat.multiply(b.q, this.offset.q));
    if (this.transition) {
      const t = Math.min(1, (performance.now() - this.transition.t0) / 700);
      const s = t * t * (3 - 2 * t);
      pos = vec3.lerp(this.transition.pos, pos, s);
      q = qnorm(quat.slerp(this.transition.q, q, s));
      if (t >= 1) this.transition = null;
    }
    return { pos, q, fov: b.fov };
  }

  setCameraPose(pos, q) {
    const b = this.basePose();
    const bi = qconj(b.q);
    this.offset = { pos: quat.rotate(bi, vec3.sub(pos, b.pos)), q: qnorm(quat.multiply(bi, q)) };
    this.transition = null;
  }

  onViewpointBound(vp) {
    if (this.lastPose && vp.f.jump !== false) this.transition = { pos: this.lastPose.pos, q: this.lastPose.q, t0: performance.now() };
    if (vp.f.jump !== false) this.offset = { pos: [0, 0, 0], q: [0, 0, 0, 1] };
    const i = this.world.viewpoints.indexOf(vp);
    if (i >= 0) this.vpSelect.value = i;
  }

  resetView() {
    this.transition = this.lastPose ? { pos: this.lastPose.pos, q: this.lastPose.q, t0: performance.now() } : null;
    this.offset = { pos: [0, 0, 0], q: [0, 0, 0, 1] };
  }

  straighten() {
    const c = this.cameraPose();
    const fwd = quat.rotate(c.q, [0, 0, -1]);
    const yaw = Math.atan2(-fwd[0], -fwd[2]);
    this.setCameraPose(c.pos, qAxis([0, 1, 0], yaw));
  }

  // ---------- input ----------
  bindInput() {
    const cv = this.canvas;
    cv.addEventListener('contextmenu', (e) => e.preventDefault());
    cv.addEventListener('pointerdown', (e) => this.onDown(e));
    cv.addEventListener('pointermove', (e) => this.onMove(e));
    cv.addEventListener('pointerup', (e) => this.onUp(e));
    cv.addEventListener('pointercancel', (e) => this.onUp(e));
    cv.addEventListener('pointerleave', () => { if (!this.drag) this.hover(null); });
    cv.addEventListener('wheel', (e) => {
      if (this.mode === 'NONE') return;
      e.preventDefault();
      const c = this.cameraPose();
      const amt = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 100) / 100;
      if (this.mode === 'EXAMINE') {
        const d = vec3.sub(c.pos, this.sceneCenter);
        this.setCameraPose(vec3.add(this.sceneCenter, vec3.scale(d, 1 + amt * 0.15)), c.q);
      } else {
        const fwd = quat.rotate(c.q, [0, 0, -1]);
        this.setCameraPose(vec3.add(c.pos, vec3.scale(fwd, -amt * this.sceneRadius * 0.1)), c.q);
      }
    }, { passive: false });
    cv.addEventListener('keydown', (e) => {
      if (e.key === 'PageDown') { this.stepViewpoint(1); e.preventDefault(); return; }
      if (e.key === 'PageUp') { this.stepViewpoint(-1); e.preventDefault(); return; }
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'q', 'e', 'shift'].includes(k)) {
        this.keys.add(k);
        e.preventDefault();
        this.loop();
      }
    });
    cv.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    cv.addEventListener('blur', () => this.keys.clear());
  }

  rayAt(e) {
    const r = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = 1 - ((e.clientY - r.top) / r.height) * 2;
    const inv = mat4.invert(mat4.multiply(this.proj, this.view));
    const a = mat4.transformPoint(inv, [x, y, -1]);
    const b = mat4.transformPoint(inv, [x, y, 1]);
    return { o: a, d: vec3.normalize(vec3.sub(b, a)) };
  }

  sensorLevel(hit) {
    if (!hit) return null;
    const levels = hit.item.sensors;
    for (let i = levels.length - 1; i >= 0; i--) {
      const lv = levels[i];
      const live = lv.sensors.filter((s) => s.type === 'Anchor' || s.f.enabled);
      if (live.length) return { ...lv, sensors: live };
    }
    return null;
  }

  onDown(e) {
    if (!this.view) return;
    this.canvas.focus({ preventScroll: true });
    this.canvas.setPointerCapture(e.pointerId);
    const w = this.world;
    w.now = nowSeconds();
    const ray = this.rayAt(e);
    const hit = this.renderer.pick(ray.o, ray.d);
    const level = e.button === 0 ? this.sensorLevel(hit) : null;
    if (level) {
      const inv = mat4.invert(level.M);
      const lp = mat4.transformPoint(inv, hit.world);
      const st = { level, inv, startLocal: lp, active: [] };
      for (const s of level.sensors) {
        switch (s.type) {
          case 'TouchSensor':
            w.emit(s, 'isActive', true, w.now);
            break;
          case 'PlaneSensor':
            s._start = lp; s._z = lp[2];
            w.emit(s, 'isActive', true, w.now);
            w.emit(s, 'trackPoint_changed', lp, w.now);
            break;
          case 'SphereSensor':
            s._r = vec3.length(lp) || 1;
            s._startV = vec3.normalize(lp);
            w.emit(s, 'isActive', true, w.now);
            break;
          case 'CylinderSensor':
            s._y = lp[1];
            s._a0 = Math.atan2(lp[0], lp[2]);
            s._rad = Math.hypot(lp[0], lp[2]) || 1;
            w.emit(s, 'isActive', true, w.now);
            break;
        }
        st.active.push(s);
      }
      this.drag = { kind: 'sensor', st, x: e.clientX, y: e.clientY };
      w.flushScripts();
      this.loop();
      return;
    }
    this.drag = { kind: 'nav', x: e.clientX, y: e.clientY, button: e.button, shift: e.shiftKey, start: this.cameraPose() };
  }

  onMove(e) {
    if (!this.view) return;
    const w = this.world;
    w.now = nowSeconds();
    if (!this.drag) { this.hover(e); return; }
    if (this.drag.kind === 'sensor') {
      const { st } = this.drag;
      const ray = this.rayAt(e);
      const o = mat4.transformPoint(st.inv, ray.o);
      const d = vec3.normalize(mat4.transformDir(st.inv, ray.d));
      for (const s of st.active) this.dragSensor(s, o, d);
      // touch sensors keep reporting while dragged
      this.hover(e, true);
      w.flushScripts();
      this.loop();
      return;
    }
    this.navDrag(e);
  }

  dragSensor(s, o, d) {
    const w = this.world, t = w.now, f = s.f;
    if (s.type === 'PlaneSensor') {
      if (Math.abs(d[2]) < 1e-9) return;
      const k = (s._z - o[2]) / d[2];
      if (k < 0) return;
      const p = vec3.add(o, vec3.scale(d, k));
      w.emit(s, 'trackPoint_changed', p, t);
      let tr = vec3.add(vec3.sub(p, s._start), f.offset);
      tr[2] = f.offset[2];
      for (let i = 0; i < 2; i++) {
        if (f.minPosition[i] <= f.maxPosition[i]) tr[i] = Math.max(f.minPosition[i], Math.min(f.maxPosition[i], tr[i]));
      }
      s._last = tr;
      w.emit(s, 'translation_changed', tr, t);
    } else if (s.type === 'SphereSensor') {
      // ray / sphere, falling back to the closest approach
      const b = vec3.dot(o, d), c = vec3.dot(o, o) - s._r * s._r;
      const disc = b * b - c;
      let p;
      if (disc >= 0) p = vec3.add(o, vec3.scale(d, -b - Math.sqrt(disc)));
      else p = vec3.add(o, vec3.scale(d, -b));
      const v = vec3.normalize(p);
      w.emit(s, 'trackPoint_changed', p, t);
      const dq = quat.fromTo(s._startV, v);
      const r = quat.toAxisAngle(quat.multiply(dq, quat.fromAxisAngle(f.offset)));
      s._last = r;
      w.emit(s, 'rotation_changed', r, t);
    } else if (s.type === 'CylinderSensor') {
      if (Math.abs(d[1]) < 1e-6) return;
      const k = (s._y - o[1]) / d[1];
      const p = vec3.add(o, vec3.scale(d, k));
      w.emit(s, 'trackPoint_changed', p, t);
      let a = f.offset + (Math.atan2(p[0], p[2]) - s._a0);
      if (f.minAngle <= f.maxAngle) a = Math.max(f.minAngle, Math.min(f.maxAngle, a));
      s._last = a;
      w.emit(s, 'rotation_changed', [0, 1, 0, a], t);
    }
  }

  onUp(e) {
    const w = this.world;
    w.now = nowSeconds();
    const drag = this.drag;
    this.drag = null;
    try { this.canvas.releasePointerCapture(e.pointerId); } catch { /* fine */ }
    if (!drag || drag.kind !== 'sensor') return;
    const { st } = drag;
    const ray = this.rayAt(e);
    const hit = this.renderer.pick(ray.o, ray.d);
    const stillOver = (s) => hit && hit.item.sensors.some((l) => l.sensors.includes(s));
    for (const s of st.active) {
      const f = s.f;
      switch (s.type) {
        case 'TouchSensor':
          w.emit(s, 'isActive', false, w.now);
          if (stillOver(s)) w.emit(s, 'touchTime', w.now, w.now);
          break;
        case 'PlaneSensor':
        case 'SphereSensor':
        case 'CylinderSensor':
          w.emit(s, 'isActive', false, w.now);
          if (f.autoOffset && s._last !== undefined) w.sendIn(s, 'set_offset', s._last, w.now);
          s._last = undefined;
          break;
        case 'Anchor':
          if (stillOver(s) && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) {
            const url = s.f.url[0];
            if (url) this.followURL(url);
          }
          break;
      }
    }
    w.flushScripts();
    this.hover(e);
  }

  hover(e, dragging = false) {
    const w = this.world;
    let hit = null;
    if (e && this.view) {
      const ray = this.rayAt(e);
      hit = this.renderer.pick(ray.o, ray.d);
    }
    const level = this.sensorLevel(hit);
    const now = new Set(level ? level.sensors : []);
    const prev = this.overSet || new Set();
    for (const s of prev) {
      if (!now.has(s) && s.type === 'TouchSensor') w.emit(s, 'isOver', false, w.now);
    }
    for (const s of now) {
      if (s.type !== 'TouchSensor') continue;
      if (!prev.has(s)) w.emit(s, 'isOver', true, w.now);
      const lp = mat4.transformPoint(mat4.invert(level.M), hit.world);
      w.emit(s, 'hitPoint_changed', lp, w.now);
      w.emit(s, 'hitNormal_changed', hit.normal, w.now);
      w.emit(s, 'hitTexCoord_changed', hit.uv, w.now);
    }
    this.overSet = now;
    const anchor = level?.sensors.find((s) => s.type === 'Anchor');
    this.anchorText = anchor ? (anchor.f.description || anchor.f.url[0] || '') : '';
    if (!dragging) this.canvas.style.cursor = level ? 'pointer' : (this.mode === 'NONE' ? 'default' : 'grab');
    w.flushScripts();
  }

  navDrag(e) {
    const d = this.drag;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    const c = d.start;
    const r = this.sceneRadius;
    const pan = d.button === 2 || d.button === 1 || d.shift;
    if (this.mode === 'NONE') return;
    if (pan) {
      const right = quat.rotate(c.q, [1, 0, 0]), up = quat.rotate(c.q, [0, 1, 0]);
      const s = r * 0.004;
      if (this.mode === 'EXAMINE') {
        const mv = vec3.add(vec3.scale(right, -dx * s), vec3.scale(up, dy * s));
        this.setCameraPose(vec3.add(c.pos, mv), c.q);
        this.sceneCenter = vec3.add(d.center0 || (d.center0 = this.sceneCenter), mv);
      } else {
        this.setCameraPose(vec3.add(c.pos, vec3.add(vec3.scale(right, dx * s), vec3.scale(up, -dy * s))), c.q);
      }
      return;
    }
    if (this.mode === 'EXAMINE') {
      const yaw = qAxis([0, 1, 0], -dx * 0.008);
      const right = quat.rotate(c.q, [1, 0, 0]);
      const pitch = qAxis(right, -dy * 0.008);
      const R = quat.multiply(yaw, pitch);
      const rel = vec3.sub(c.pos, this.sceneCenter);
      this.setCameraPose(vec3.add(this.sceneCenter, quat.rotate(R, rel)), qnorm(quat.multiply(R, c.q)));
    } else if (this.mode === 'WALK') {
      const yaw = qAxis([0, 1, 0], -dx * 0.005);
      const fwd = quat.rotate(c.q, [0, 0, -1]);
      const flat = vec3.normalize([fwd[0], 0, fwd[2]]);
      this.setCameraPose(vec3.add(c.pos, vec3.scale(flat, -dy * r * 0.01)), qnorm(quat.multiply(yaw, c.q)));
    } else if (this.mode === 'FLY') {
      const yaw = qAxis([0, 1, 0], -dx * 0.005);
      const right = quat.rotate(c.q, [1, 0, 0]);
      const pitch = qAxis(right, -dy * 0.005);
      this.setCameraPose(c.pos, qnorm(quat.multiply(quat.multiply(yaw, pitch), c.q)));
    }
  }

  keyMove(dt) {
    if (!this.keys.size || this.mode === 'NONE') return;
    const nav = this.world.top('NavigationInfo');
    const speed = (nav?.f.speed || 1) * Math.max(1, this.sceneRadius / 4) * (this.keys.has('shift') ? 3 : 1);
    const c = this.cameraPose();
    const k = this.keys;
    const f = (k.has('arrowup') || k.has('w') ? 1 : 0) - (k.has('arrowdown') || k.has('s') ? 1 : 0);
    const turn = (k.has('arrowleft') || k.has('a') ? 1 : 0) - (k.has('arrowright') || k.has('d') ? 1 : 0);
    const lift = (k.has('e') ? 1 : 0) - (k.has('q') ? 1 : 0);
    if (this.mode === 'EXAMINE') {
      const R = quat.multiply(qAxis([0, 1, 0], turn * dt * 1.5), qAxis(quat.rotate(c.q, [1, 0, 0]), f * dt * 1.5));
      const rel = vec3.sub(c.pos, this.sceneCenter);
      this.setCameraPose(vec3.add(this.sceneCenter, quat.rotate(R, rel)), qnorm(quat.multiply(R, c.q)));
      return;
    }
    let fwd = quat.rotate(c.q, [0, 0, -1]);
    if (this.mode === 'WALK') fwd = vec3.normalize([fwd[0], 0, fwd[2]]);
    const pos = vec3.add(vec3.add(c.pos, vec3.scale(fwd, f * speed * dt)), [0, lift * speed * dt, 0]);
    this.setCameraPose(pos, qnorm(quat.multiply(qAxis([0, 1, 0], turn * dt * 1.2), c.q)));
  }

  // ---------- frame loop ----------
  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(this.stage.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.stage.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w; this.canvas.height = h;
    }
    this.loop();
  }

  loop() {
    if (this.raf || this.failed || this.disposed) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      if (!this.visible || this.disposed) return;
      this.renderFrame();
      this.loop();
    });
  }

  fitScene(items) {
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (const it of items) {
      const bb = it.geom?.cpu?.bbox;
      if (!bb) continue;
      for (let i = 0; i < 8; i++) {
        const p = mat4.transformPoint(it.M, [bb[i & 1][0], bb[(i >> 1) & 1][1], bb[(i >> 2) & 1][2]]);
        for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], p[k]); max[k] = Math.max(max[k], p[k]); }
      }
    }
    if (min[0] === Infinity) return;
    this.sceneCenter = vec3.scale(vec3.add(min, max), 0.5);
    this.sceneRadius = Math.max(0.5, vec3.length(vec3.sub(max, min)) / 2);
  }

  renderFrame() {
    const w = this.world;
    if (!w) return;
    const now = nowSeconds();
    const dt = Math.min(0.1, now - this.lastTime);
    this.lastTime = now;
    this.keyMove(dt);
    w.tick(now);
    const cam = this.cameraPose();
    this.lastPose = cam;
    const width = this.canvas.width, height = this.canvas.height;
    const aspect = width / height;
    const fov = cam.fov > 0 && cam.fov < Math.PI ? cam.fov : 0.785398;
    const fovy = aspect >= 1 ? fov : 2 * Math.atan(Math.tan(fov / 2) / aspect);
    const nav = w.top('NavigationInfo');
    const near = Math.max(0.01, (nav?.f.avatarSize[0] ?? 0.25) * 0.5);
    const far = nav?.f.visibilityLimit > 0 ? nav.f.visibilityLimit : 10000;
    this.proj = mat4.perspective(fovy, aspect, near, far);
    const camM = matFromPose(cam.pos, cam.q);
    const camRot = mat4.clone(camM); camRot[12] = camRot[13] = camRot[14] = 0;
    this.view = mat4.invert(camM);
    const items = this.renderer.render(w, { view: this.view, proj: this.proj, camPos: cam.pos, camRot, width, height });
    if (this.fitPending && items.length) { this.fitScene(items); this.fitPending = false; }
    w.updateProximity(cam.pos, camRot, now);
    w.flushScripts();
    // status bar
    this.frames++;
    if (now - (this.fpsT || 0) > 0.5) {
      this.fps = Math.round(this.frames / (now - (this.fpsT || now - 0.5)));
      this.frames = 0;
      this.fpsT = now;
      w.frameRate = this.fps;
      const vp = w.top('Viewpoint');
      const where = this.anchorText ? `Link: ${this.anchorText}` : (this.description || vp?.f.description || w.title || '');
      this.statusLeft.textContent = where;
      const s = this.renderer.stats;
      this.statusRight.textContent = `${this.mode.toLowerCase()} | ${s.tris} polys | ${this.fps} fps`;
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.world?.shutdownScripts();
    this.ro?.disconnect();
    this.io?.disconnect();
    this.renderer?.dispose();
    this.root.remove();
  }
}
