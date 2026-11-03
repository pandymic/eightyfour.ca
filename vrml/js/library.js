// "My Worlds": a tiny file system in localStorage, plus file open/save
// helpers. Inline and Anchor can point at library files by name, e.g.
//   Inline { url "lib:castle.wrl" }   or simply   url "castle.wrl"

const KEY = 'pandymic.vrml.library.v1';

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function writeAll(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

export const library = {
  list() {
    return Object.entries(readAll())
      .map(([name, v]) => ({ name, modified: v.modified, size: v.text.length }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  get(name) {
    const v = readAll()[normalize(name)];
    return v ? v.text : null;
  },
  has(name) { return normalize(name) in readAll(); },
  put(name, text) {
    const all = readAll();
    all[normalize(name)] = { text, modified: Date.now() };
    writeAll(all);
  },
  remove(name) {
    const all = readAll();
    delete all[normalize(name)];
    writeAll(all);
  },
};

export function normalize(name) {
  let n = String(name).trim().replace(/^lib:/i, '').replace(/^\.\//, '');
  if (!/\.wrl(\.gz)?$/i.test(n)) n += '.wrl';
  return n;
}

// Resolver used by viewers: library first, null means "go fetch it".
export async function libraryFetch(url) {
  if (/^lib:/i.test(url)) {
    const t = library.get(url);
    if (t == null) throw new Error(`No file called "${normalize(url)}" in My Worlds`);
    return t;
  }
  if (!/[/:]/.test(url) && library.has(url)) return library.get(url);
  return null;
}

export function download(name, text) {
  const blob = new Blob([text], { type: 'model/vrml' });
  saveBlob(blob, name);
}

export async function downloadGzip(name, text) {
  if (!('CompressionStream' in window)) throw new Error('This browser cannot gzip. Try the plain .wrl.');
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
  const blob = await new Response(stream).blob();
  saveBlob(new Blob([blob], { type: 'application/gzip' }), name.replace(/(\.wrl)?$/i, '.wrl.gz'));
}

function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// Read a File (from <input type=file> or drag and drop). Handles .wrl.gz,
// and sniffs gzip by magic number because file extensions lie.
export async function readFile(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  if (buf[0] === 0x1f && buf[1] === 0x8b) {
    if (!('DecompressionStream' in window)) throw new Error('This browser cannot gunzip.');
    const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  }
  return new TextDecoder('utf-8').decode(buf);
}
