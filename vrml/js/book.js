// Wires the book together: cover art, listings, live examples, the
// Workbench, and the generated node reference.

import { Viewer } from './vrml/viewer.js?v=83941bf571';
import { Editor, highlight } from './editor.js?v=217035960c';
import { library, libraryFetch, download, downloadGzip, readFile, normalize } from './library.js?v=182f7e837a';
import { builtinSchemas, SUPPORT } from './vrml/nodes.js?v=c25d7a32a3';
import { formatValue } from './vrml/fields.js?v=faf24e7990';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null) e.append(k);
  return e;
};

// ---------------------------------------------------------------
// Cover engraving: a chambered nautilus, drawn the hard way.
// ---------------------------------------------------------------
function nautilusSVG() {
  const W = 520, H = 470, cx = 268, cy = 238;
  const b = Math.log(3.1) / (2 * Math.PI);
  const tMax = 6 * Math.PI;
  const R = 215;
  const a = R / Math.exp(b * tMax);
  const r = (t) => a * Math.exp(b * t);
  const P = (t, k = 1) => [cx + r(t) * k * Math.cos(t), cy + r(t) * k * Math.sin(t)];
  const fmt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const spiral = (t0, t1, k = 1, steps = 60) => {
    const pts = [];
    for (let i = 0; i <= steps; i++) pts.push(P(t0 + ((t1 - t0) * i) / steps, k));
    return pts;
  };
  const poly = (pts) => 'M' + pts.map(fmt).join('L');
  const parts = [];
  const defs = [];
  const ink = '#1b1a17';

  const dTheta = (2 * Math.PI) / 15;
  const tBody = tMax - 2 * Math.PI * 0.30; // the living chamber starts here
  // septum geometry between outer wall at t and inner wall at t - 2pi
  const septum = (t) => {
    const o = P(t, 0.965), i = P(t - 2 * Math.PI, 1.02);
    const mr = (r(t) * 0.965 + r(t - 2 * Math.PI) * 1.02) / 2;
    const ct = t - dTheta * 0.55;
    const c = [cx + mr * Math.cos(ct), cy + mr * Math.sin(ct)];
    return { o, i, c };
  };
  const lerp2 = (p, q, s) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s];

  // chambers, newest first
  const nCh = 26;
  for (let k = 0; k < nCh; k++) {
    const t1 = tBody - k * dTheta, t0 = t1 - dTheta;
    if (t0 < 2 * Math.PI + 0.6) break;
    const s1 = septum(t1), s0 = septum(t0);
    const outer = spiral(t0, t1, 0.965, 12);
    const inner = spiral(t1 - 2 * Math.PI, t0 - 2 * Math.PI, 1.02, 12);
    const path = poly(outer) + `Q${fmt(s1.c)} ${fmt(s1.i)}` + 'L' + inner.map(fmt).join('L') + `Q${fmt(s0.c)} ${fmt(s0.o)}Z`;
    const id = `ch${k}`;
    // light comes from the upper left: chambers facing down-right get denser hatching
    const mid = (t0 + t1) / 2;
    const shade = 0.5 + 0.5 * Math.sin(mid - Math.PI / 4);
    const gap = (3.2 - shade * 1.6).toFixed(2);
    const ang = ((mid * 180) / Math.PI + 90) % 180;
    defs.push(`<pattern id="p${id}" patternUnits="userSpaceOnUse" width="${gap}" height="${gap}" patternTransform="rotate(${ang.toFixed(1)})"><line x1="0" y1="0" x2="0" y2="${gap}" stroke="${ink}" stroke-width="${(0.35 + shade * 0.35).toFixed(2)}"/></pattern>`);
    defs.push(`<clipPath id="c${id}"><path d="${path}"/></clipPath>`);
    parts.push(`<path d="${path}" fill="url(#p${id})" stroke="none"/>`);
    // engraved shadow lines hugging each septum
    let lines = '';
    for (const s of [0.06, 0.13, 0.21, 0.31]) {
      const o = lerp2(s1.o, s0.o, s), c = lerp2(s1.c, s0.c, s), i = lerp2(s1.i, s0.i, s);
      lines += `<path d="M${fmt(o)}Q${fmt(c)} ${fmt(i)}" fill="none" stroke="${ink}" stroke-width="${(1.1 - s * 2.4).toFixed(2)}"/>`;
    }
    parts.push(`<g clip-path="url(#c${id})">${lines}</g>`);
    parts.push(`<path d="M${fmt(s1.o)}Q${fmt(s1.c)} ${fmt(s1.i)}" fill="none" stroke="${ink}" stroke-width="2.1"/>`);
  }

  // the siphuncle: a beaded tube threading every chamber
  const sip = [];
  for (let t = 2 * Math.PI + 1.2; t <= tBody; t += dTheta / 3) {
    const rr = r(t - 2 * Math.PI) + (r(t) - r(t - 2 * Math.PI)) * 0.28;
    sip.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]);
  }
  parts.push(`<path d="${poly(sip)}" fill="none" stroke="${ink}" stroke-width="3.2"/>`);
  parts.push(`<path d="${poly(sip)}" fill="none" stroke="#fffefb" stroke-width="1.2"/>`);

  // body chamber: fine growth lines following the spiral
  for (let k = 1; k < 14; k++) {
    const s = k / 14;
    const pts = [];
    for (let i = 0; i <= 50; i++) {
      const t = tBody + ((tMax - tBody) * i) / 50;
      const ro = r(t) * 0.965, ri = r(t - 2 * Math.PI) * 1.02;
      const rr = ri + (ro - ri) * s;
      pts.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]);
    }
    // denser and heavier toward the shadowed inner side
    parts.push(`<path d="${poly(pts)}" fill="none" stroke="${ink}" stroke-width="${(0.9 - s * 0.6).toFixed(2)}" opacity="${(0.95 - s * 0.5).toFixed(2)}"/>`);
  }
  // shell walls, thick and black, with a thin engraved outline outside
  const wall = (k0, k1, t0, t1) => {
    const outer = spiral(t0, t1, k0, 140), inner = spiral(t1, t0, k1, 140);
    return `<path d="${poly(outer)}L${inner.map(fmt).join('L')}Z" fill="${ink}"/>`;
  };
  parts.push(wall(1, 0.965, 2 * Math.PI + 0.4, tMax));
  parts.push(wall(1.035, 1.0, 0.4, tMax - 2 * Math.PI));
  parts.push(`<path d="${poly(spiral(2 * Math.PI + 0.9, tMax, 1.03, 140))}" fill="none" stroke="${ink}" stroke-width="0.7"/>`);
  // short hatching just outside the outer wall: the shading of the curved shell surface
  for (let t = 2 * Math.PI + 1.2; t < tMax - 0.05; t += 0.035) {
    const shade = 0.5 + 0.5 * Math.sin(t - Math.PI / 4);
    if (shade < 0.45) continue;
    const p0 = P(t, 1.0), p1 = P(t - 0.02, 1.0 + 0.02 + 0.035 * shade);
    parts.push(`<path d="M${fmt(p0)}L${fmt(p1)}" stroke="${ink}" stroke-width="0.6"/>`);
  }
  // aperture lip
  const lipO = P(tMax, 1), lipI = P(tMax - 2 * Math.PI, 1.03);
  const lipC = [cx + (r(tMax) + r(tMax - 2 * Math.PI)) * 0.55 * Math.cos(tMax + 0.25), cy + (r(tMax) + r(tMax - 2 * Math.PI)) * 0.55 * Math.sin(tMax + 0.25)];
  parts.push(`<path d="M${fmt(lipO)}Q${fmt(lipC)} ${fmt(lipI)}" fill="none" stroke="${ink}" stroke-width="3"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="3" fill="${ink}"/>`);
  // fit the drawing: bounds of the outer wall over the last whorl
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of spiral(tMax - 2 * Math.PI, tMax, 1.06, 200)) {
    x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
  }
  // stippled ground shadow, just under the shell
  let dots = '';
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const mx = (x0 + x1) / 2, hw = (x1 - x0) / 2 + 20;
  for (let i = 0; i < 700; i++) {
    const u = rnd() * 2 - 1, v = rnd();
    const x = mx + u * hw, y = y1 + 6 + v * 14 * (1 - u * u);
    if (rnd() < 1 - Math.abs(u)) dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + rnd() * 0.7).toFixed(2)}"/>`;
  }
  parts.push(`<g fill="${ink}" opacity=".7">${dots}</g>`);
  const vb = [x0 - 24, y0 - 12, x1 - x0 + 48, y1 - y0 + 40].map((v) => v.toFixed(0)).join(' ');
  void W; void H;
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Engraving of a chambered nautilus shell in cross section"><defs>${defs.join('')}</defs>${parts.join('')}</svg>`;
}

const PRESS_LOGO = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 12m0 0a1.5 1.5 0 0 1 1.5 1.5a3 3 0 0 1-3 3a4.5 4.5 0 0 1-4.5-4.5a6 6 0 0 1 6-6a7.5 7.5 0 0 1 7.5 7.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

const ICONS = {
  note: `<svg viewBox="0 0 48 48" aria-label="Note"><circle cx="24" cy="24" r="21" fill="none" stroke="#1b1a17" stroke-width="2"/><path d="M24 24a2 2 0 0 1 2 2a4 4 0 0 1-4 4a6 6 0 0 1-6-6a8 8 0 0 1 8-8a10 10 0 0 1 10 10a12 12 0 0 1-12 12" fill="none" stroke="#1b1a17" stroke-width="2.2"/></svg>`,
  warn: `<svg viewBox="0 0 48 48" aria-label="Warning"><rect x="5" y="6" width="38" height="28" rx="3" fill="#1b1a17"/><rect x="9" y="10" width="30" height="20" fill="#fdfcf8"/><path d="M22 10l-3 7 5 2-4 6 3 5" fill="none" stroke="#7a1f14" stroke-width="2"/><path d="M18 34h12l3 7H15z" fill="#1b1a17"/></svg>`,
  tip: `<svg viewBox="0 0 48 48" aria-label="Tip"><path d="M8 30c6-2 10-8 16-8h6c3 0 3 4 0 4h-6 12c3 0 3 4 0 4H28h8c3 0 3 4 0 4h-8 5c3 0 3 4 0 4H18c-5 0-8-2-10-4z" fill="none" stroke="#1b1a17" stroke-width="2" stroke-linejoin="round"/><path d="M28 22V8c0-3 4-3 4 0v14" fill="none" stroke="#1b1a17" stroke-width="2"/></svg>`,
};

const CUBE_ICON = `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><path d="M28 6 48 17v22L28 50 8 39V17z" fill="#d8d8d8" stroke="#000"/><path d="M28 6 48 17 28 28 8 17z" fill="#fff" stroke="#000"/><path d="M28 28v22" stroke="#000"/><path d="M28 28 48 17v22L28 50z" fill="#9a9a9a" stroke="#000"/></svg>`;

// ---------------------------------------------------------------
// Examples
// ---------------------------------------------------------------
const examples = [];
const active = [];
const MAX_ACTIVE = 4;

function renderListing(src) {
  const pre = h('pre', { class: 'listing' });
  pre.innerHTML = highlight(src).split('\n').map((l) => `<span class="ln">${l || ' '}</span>`).join('');
  return pre;
}

function setupExamples() {
  for (const fig of $$('figure.example')) {
    const script = $('script[type="model/vrml"]', fig);
    if (!script) continue;
    const src = script.textContent.replace(/^\n/, '').replace(/\s+$/, '') + '\n';
    const cap = $('figcaption', fig);
    const num = cap ? $('b', cap)?.textContent.replace(/\.$/, '') : '';
    const title = cap ? cap.textContent.replace(/^[^.]*\.\s*/, '') : 'Untitled';
    const ex = { id: fig.id || `ex${examples.length}`, num, title, src, fig };
    examples.push(ex);
    const listing = renderListing(src);
    const lines = src.split('\n').length;
    const long = lines > 34 && !fig.hasAttribute('data-expanded');
    if (long) listing.classList.add('collapsed');
    const plugin = h('div', { class: 'plugin' });
    const poster = makePoster(ex, plugin);
    plugin.append(poster);
    const toggle = long ? h('button', { class: 'linkish', type: 'button', onclick: (e) => {
      listing.classList.toggle('collapsed');
      e.target.textContent = listing.classList.contains('collapsed') ? `Show all ${lines} lines` : 'Fold listing';
    } }, `Show all ${lines} lines`) : null;
    const actions = h('div', { class: 'ex-actions' },
      toggle,
      h('span', { class: 'grow' }),
      h('button', { class: 'linkish', type: 'button', onclick: () => activate(ex, plugin) }, 'Run it here'),
      h('button', { class: 'linkish', type: 'button', onclick: () => openInWorkbench(ex.src, `${ex.id}.wrl`) }, 'Open in the Workbench'),
    );
    fig.append(listing, actions, plugin);
  }
}

function makePoster(ex, plugin) {
  const p = h('div', { class: 'plugin-poster', role: 'button', tabindex: '0', title: 'Load this world' });
  p.innerHTML = `<div class="box">${CUBE_ICON}<b>VRML 2.0 world: ${ex.title.replace(/</g, '&lt;')}</b>Click here to activate the plug-in</div>`;
  const go = () => activate(ex, plugin);
  p.addEventListener('click', go);
  p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  return p;
}

function activate(ex, plugin) {
  const existing = active.find((a) => a.ex === ex);
  if (existing) { existing.viewer.load(ex.src, `${ex.id}.wrl`); return; }
  while (active.length >= MAX_ACTIVE) {
    const old = active.shift();
    old.viewer.dispose();
    old.plugin.append(makePoster(old.ex, old.plugin));
  }
  plugin.innerHTML = '';
  const viewer = new Viewer(plugin, {
    fetchText: libraryFetch,
    height: ex.fig.dataset.height || '360px',
  });
  viewer.load(ex.src, `${ex.id}.wrl`);
  active.push({ ex, viewer, plugin });
  setTimeout(() => viewer.canvas.focus({ preventScroll: true }), 50);
}

// ---------------------------------------------------------------
// The Workbench
// ---------------------------------------------------------------
const SCRATCH = 'pandymic.vrml.scratch.v1';
let wb = null;

function openInWorkbench(src, name) {
  if (!wb) return;
  if (wb.dirty && !confirm('Discard changes to the current file?')) return;
  wb.open(src, null, name);
  $('#workbench').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setupWorkbench() {
  const host = $('#wb-host');
  if (!host) return;
  const status = { file: h('span'), pos: h('span', {}, 'Ln 1, Col 1'), msg: h('span', { class: 'msg' }, 'Ready') };
  const edHost = h('div');
  const viewHost = h('div');
  const fileInput = h('input', { type: 'file', accept: '.wrl,.gz,.vrml,.wrz,model/vrml', hidden: true });
  const menu = h('div', { class: 'wb-menu' });
  const root = h('div', { class: 'wb' },
    h('div', { class: 'wb-title' }, h('span', {}, 'VRML Workbench 1.0'), h('span', { class: 'ctl' }, h('span', {}, '_'), h('span', {}, '□'), h('span', {}, 'x'))),
    menu,
    h('div', { class: 'wb-body' }, edHost, viewHost),
    h('div', { class: 'wb-status' }, status.file, status.pos, status.msg),
    fileInput,
  );
  host.append(root);

  const state = { name: null, libName: null, dirty: false, auto: false };
  const say = (m) => { status.msg.textContent = m; };
  const showName = () => {
    status.file.textContent = (state.libName || state.name || 'Untitled.wrl') + (state.dirty ? ' *' : '');
  };
  let autoTimer = 0;
  const editor = new Editor(edHost, {
    onRun: () => run(),
    onChange: () => {
      state.dirty = true; showName();
      localStorage.setItem(SCRATCH, JSON.stringify({ text: editor.value, name: state.name, libName: state.libName }));
      if (state.auto) { clearTimeout(autoTimer); autoTimer = setTimeout(run, 700); }
    },
  });
  editor.onCursor = ({ line, col }) => { status.pos.textContent = `Ln ${line}, Col ${col}`; };

  const viewer = new Viewer(viewHost, {
    fetchText: libraryFetch,
    onError: (e) => { editor.markError(e.line); say(`Error: ${e.message}`); },
    onLoad: (w) => {
      const n = w.version === 1 ? 'VRML 1.0' : 'VRML 2.0';
      say(`Loaded ${n} world${w.title ? ` "${w.title}"` : ''}: ${w.roots.length} top-level nodes, ${w.allRoutes().length} routes`);
    },
    onFollow: (url) => {
      const n = url.replace(/^lib:/i, '');
      if (library.has(n)) {
        if (state.dirty && !confirm(`Follow link to ${normalize(n)}? Unsaved changes will be lost.`)) return true;
        wb.open(library.get(n), normalize(n));
        return true;
      }
      return false;
    },
  });
  viewer.console.classList.add('has');

  function run() {
    editor.markError(null);
    viewer.load(editor.value, state.libName || state.name || 'untitled.wrl');
  }

  const open = (text, libName = null, name = null) => {
    editor.value = text;
    state.libName = libName;
    state.name = name || libName;
    state.dirty = false;
    showName();
    run();
  };

  const saveLib = (forceAsk) => {
    let n = state.libName;
    if (!n || forceAsk) {
      const s = prompt('Save to My Worlds as:', state.libName || state.name || 'myworld.wrl');
      if (!s) return;
      n = normalize(s);
      if (library.has(n) && n !== state.libName && !confirm(`${n} already exists. Replace it?`)) return;
    }
    try {
      library.put(n, editor.value);
      state.libName = n; state.name = n; state.dirty = false;
      showName(); buildMenu();
      say(`Saved ${n} to My Worlds (browser storage). Inline and Anchor can use url "${n}".`);
    } catch (e) {
      say(`Could not save: ${e.message}. Browser storage may be full.`);
    }
  };

  const openFile = async (file) => {
    try {
      const text = await readFile(file);
      if (state.dirty && !confirm('Discard changes to the current file?')) return;
      open(text, null, file.name.replace(/\.gz$/i, ''));
      say(`Opened ${file.name} (${text.length.toLocaleString()} characters)`);
    } catch (e) { say(`Could not open ${file.name}: ${e.message}`); }
  };
  fileInput.addEventListener('change', () => { if (fileInput.files[0]) openFile(fileInput.files[0]); fileInput.value = ''; });

  // drag and drop, the 1995 way to feel modern
  root.addEventListener('dragover', (e) => { e.preventDefault(); root.classList.add('drop'); });
  root.addEventListener('dragleave', () => root.classList.remove('drop'));
  root.addEventListener('drop', (e) => {
    e.preventDefault(); root.classList.remove('drop');
    const f = e.dataTransfer.files[0];
    if (f) openFile(f);
  });

  const NEW = '#VRML V2.0 utf8\n# A new world. Press Ctrl+Enter to run.\n\nShape {\n  appearance Appearance { material Material { } }\n  geometry Box { }\n}\n';

  function buildMenu() {
    menu.innerHTML = '';
    const closeAll = () => $$('.mi', menu).forEach((m) => m.classList.remove('open'));
    const mi = (label, items) => {
      const dd = h('div', { class: 'dd' });
      for (const it of items) {
        if (it === '-') { dd.append(h('hr')); continue; }
        dd.append(h('button', { type: 'button', disabled: it.disabled, onclick: () => { closeAll(); it.fn(); } }, h('span', {}, it.label), it.key ? h('span', { class: 'k' }, it.key) : null));
      }
      const m = h('div', { class: 'mi' });
      const b = h('button', { type: 'button', onclick: (e) => {
        e.stopPropagation();
        const was = m.classList.contains('open');
        closeAll();
        if (!was) m.classList.add('open');
      }, onmouseenter: () => { if ($('.mi.open', menu) && !m.classList.contains('open')) { closeAll(); m.classList.add('open'); } } }, label);
      m.append(b, dd);
      return m;
    };
    const libItems = library.list();
    menu.append(
      mi('File', [
        { label: 'New', fn: () => { if (!state.dirty || confirm('Discard changes?')) open(NEW); } },
        { label: 'Open from disk...', key: 'Ctrl+O', fn: () => fileInput.click() },
        '-',
        { label: 'Save to My Worlds', key: 'Ctrl+S', fn: () => saveLib(false) },
        { label: 'Save to My Worlds as...', fn: () => saveLib(true) },
        '-',
        { label: 'Download .wrl', fn: () => download(state.libName || state.name || 'world.wrl', editor.value) },
        { label: 'Download .wrl.gz (gzipped)', fn: () => downloadGzip(state.libName || state.name || 'world.wrl', editor.value).catch((e) => say(e.message)) },
      ]),
      mi('Examples', examples.map((ex) => ({ label: `${ex.num}: ${ex.title}`, fn: () => openInWorkbench(ex.src, `${ex.id}.wrl`) }))),
      mi('My Worlds', [
        ...(libItems.length ? libItems.map((f) => ({
          label: f.name, key: `${Math.ceil(f.size / 1024)}K`,
          fn: () => { if (!state.dirty || confirm('Discard changes?')) open(library.get(f.name), f.name); },
        })) : [{ label: '(nothing saved yet)', disabled: true, fn: () => {} }]),
        '-',
        { label: state.libName ? `Delete ${state.libName}` : 'Delete current file', disabled: !state.libName, fn: () => {
          if (confirm(`Delete ${state.libName} from My Worlds?`)) {
            library.remove(state.libName); say(`Deleted ${state.libName}`); state.libName = null; state.dirty = true; showName(); buildMenu();
          }
        } },
      ]),
      mi('World', [
        { label: 'Run', key: 'Ctrl+Enter', fn: run },
        { label: state.auto ? 'Live update: on' : 'Live update: off', fn: () => { state.auto = !state.auto; buildMenu(); say(state.auto ? 'Live update on. The world reloads as you type.' : 'Live update off.'); } },
        { label: 'Clear console', fn: () => viewer.clearLog() },
        '-',
        { label: 'List routes in console', fn: () => {
          const rs = viewer.world.allRoutes();
          viewer.log(rs.length ? rs.map((r) => `ROUTE ${r.from.name || r.from.type}.${r.fromField} TO ${r.to.name || r.to.type}.${r.toField}`).join('\n') : '(no routes)');
        } },
        { label: 'List DEF names in console', fn: () => {
          const d = [...viewer.world.defs.entries()];
          viewer.log(d.length ? d.map(([k, n]) => `DEF ${k} ${n.type}`).join('\n') : '(no DEF names)');
        } },
      ]),
      mi('Help', [
        { label: 'Keyboard and mouse', fn: () => viewer.log([
          'Editor: Ctrl+Enter runs, Tab indents, Shift+Tab outdents.',
          'Examine: drag to orbit, wheel to zoom, right-drag or Shift-drag to pan.',
          'Walk: drag up/down to move, left/right to turn. Arrows or WASD also work.',
          'Fly: drag to look around, arrows or WASD to move, Q and E for down and up.',
          'Page Up / Page Down step through viewpoints.',
        ].join('\n')) },
        { label: 'About VRML Workbench', fn: () => viewer.log('VRML Workbench 1.0. Runs on any computer with a 1996 imagination and a 2020s browser.') },
      ]),
      h('span', { class: 'spacer' }),
      h('button', { class: 'w95', type: 'button', onclick: run, title: 'Run (Ctrl+Enter)' }, 'Run'),
    );
  }
  document.addEventListener('click', () => $$('.mi', menu).forEach((m) => m.classList.remove('open')));
  root.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveLib(false); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') { e.preventDefault(); fileInput.click(); }
  });

  wb = { open, editor, viewer, get dirty() { return state.dirty; } };
  buildMenu();
  let initial = null;
  try { initial = JSON.parse(localStorage.getItem(SCRATCH) || 'null'); } catch { /* ignore */ }
  if (initial?.text) {
    open(initial.text, initial.libName, initial.name);
    state.dirty = true; showName();
    say('Restored your last session from browser storage.');
  } else {
    open(examples.find((e) => e.id === 'ex-frontispiece')?.src || NEW, null, 'frontispiece.wrl');
  }
}

// ---------------------------------------------------------------
// Appendix A, generated from the engine's own node table
// ---------------------------------------------------------------
function setupReference() {
  const host = $('#ref-host');
  if (!host) return;
  const schemas = builtinSchemas();
  const names = [...schemas.keys()].filter((n) => n !== 'MatrixTransform').sort();
  const grid = h('div', { class: 'ref-grid' });
  for (const n of names) {
    const s = schemas.get(n);
    const w = Math.max(...[...s.fields.values()].map((d) => d.kind.length));
    const tw = Math.max(...[...s.fields.values()].map((d) => d.type.length));
    const lines = [...s.fields.values()].map((d) => {
      const v = d.kind === 'eventIn' || d.kind === 'eventOut' ? '' : ' ' + formatValue(d.type, d.value);
      return `${d.kind.padEnd(w)} ${d.type.padEnd(tw)} ${d.name}${v}`;
    });
    const body = h('pre');
    body.textContent = `${n} {\n${lines.map((l) => '  ' + l).join('\n')}\n}`;
    grid.append(h('div', { class: 'ref-node', id: `ref-${n}` },
      h('h4', {}, n, h('small', {}, SUPPORT[n] ? 'partial' : 'supported')),
      body,
      SUPPORT[n] ? h('div', { class: 'sup' }, SUPPORT[n]) : null,
    ));
  }
  host.append(grid);
}

// ---------------------------------------------------------------
// Folios and the table of contents
// ---------------------------------------------------------------
function setupFolios() {
  let folio = 1;
  const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii'];
  let front = 0;
  for (const page of $$('.page')) {
    const isFront = page.classList.contains('front');
    const label = isFront ? roman[front++] || 'xx' : String(folio);
    page.dataset.folio = label;
    const rh = $('.runhead .folio', page);
    if (rh) rh.textContent = label;
    page.append(h('div', { class: 'foot-folio' }, label));
    if (!isFront) {
      const chars = page.textContent.length + $$('.example', page).length * 1800;
      folio += Math.max(1, Math.round(chars / 2600));
    }
  }
  for (const a of $$('.toc a[href^="#"]')) {
    const target = $(a.getAttribute('href'));
    const page = target?.closest('.page');
    const pg = a.closest('li')?.querySelector('.pg');
    if (pg && page) pg.textContent = page.dataset.folio;
  }
}

function setupIcons() {
  for (const n of $$('.note')) {
    const kind = n.dataset.icon || 'note';
    const box = h('div');
    box.innerHTML = ICONS[kind] || ICONS.note;
    const body = h('div');
    while (n.firstChild) body.append(n.firstChild);
    n.append(box, body);
  }
}

function setupCover() {
  const art = $('#cover-art');
  if (art) art.innerHTML = nautilusSVG();
  for (const p of $$('.press-logo')) p.innerHTML = PRESS_LOGO;
}

setupCover();
setupIcons();
setupExamples();
setupReference();
setupWorkbench();
setupFolios();
