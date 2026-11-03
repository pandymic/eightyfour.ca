// A plain textarea with a syntax-colored <pre> underneath it and a line
// number gutter. Nothing clever. It does not need to be.

import { V2_NODES } from './vrml/nodes.js?v=c25d7a32a3';
import { V1_NODE_NAMES } from './vrml/v1.js?v=247bf7f156';

const NODE_NAMES = new Set([...Object.keys(V2_NODES), ...V1_NODE_NAMES]);
const KEYWORDS = new Set(['DEF', 'USE', 'PROTO', 'EXTERNPROTO', 'ROUTE', 'TO', 'IS', 'NULL', 'TRUE', 'FALSE']);
const KINDS = new Set(['field', 'exposedField', 'eventIn', 'eventOut']);
const JS_WORDS = new Set(['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'new', 'true', 'false', 'null', 'this']);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function highlight(src) {
  const re = /(#[^\n]*)|("(?:\\.|[^"\\])*"?)|([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?|0x[0-9a-fA-F]+)\b|([A-Za-z_][\w-]*)|([{}[\]])/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    last = re.lastIndex;
    const [t, com, str, num, word, br] = m;
    if (com) {
      out += src.startsWith('#VRML', m.index) && m.index === 0 ? `<span class="h-hdr">${esc(t)}</span>` : `<span class="h-com">${esc(t)}</span>`;
    } else if (str) {
      if (/^"\s*(javascript|vrmlscript|ecmascript):/i.test(str)) out += `<span class="h-str">${highlightJS(str)}</span>`;
      else out += `<span class="h-str">${esc(t)}</span>`;
    } else if (num) out += `<span class="h-num">${esc(t)}</span>`;
    else if (word) {
      if (KEYWORDS.has(word)) out += `<span class="h-kw">${word}</span>`;
      else if (KINDS.has(word)) out += `<span class="h-kind">${word}</span>`;
      else if (/^[SM]F[A-Z]/.test(word)) out += `<span class="h-type">${word}</span>`;
      else if (NODE_NAMES.has(word)) out += `<span class="h-node">${word}</span>`;
      else out += esc(word);
    } else if (br) out += `<span class="h-br">${br}</span>`;
    else out += esc(t);
  }
  out += esc(src.slice(last));
  return out;
}

function highlightJS(str) {
  return str.replace(/(\/\/[^\n]*)|([A-Za-z_$][\w$]*)|([^A-Za-z_$/]+|\/)/g, (t, com, word) => {
    if (com) return `<span class="h-com">${esc(t)}</span>`;
    if (word && JS_WORDS.has(word)) return `<span class="h-jskw">${word}</span>`;
    return esc(t);
  });
}

export class Editor {
  constructor(host, { value = '', onRun, onChange } = {}) {
    this.host = host;
    host.classList.add('ed');
    this.gutter = document.createElement('pre');
    this.gutter.className = 'ed-gutter';
    this.wrap = document.createElement('div');
    this.wrap.className = 'ed-wrap';
    this.hl = document.createElement('pre');
    this.hl.className = 'ed-hl';
    this.hl.setAttribute('aria-hidden', 'true');
    this.ta = document.createElement('textarea');
    this.ta.className = 'ed-ta';
    this.ta.spellcheck = false;
    this.ta.autocapitalize = 'off';
    this.ta.setAttribute('autocomplete', 'off');
    this.ta.setAttribute('aria-label', 'VRML source');
    this.ta.wrap = 'off';
    this.wrap.append(this.hl, this.ta);
    host.append(this.gutter, this.wrap);
    this.onRun = onRun;
    this.onChange = onChange;
    this.errorLine = null;
    this.ta.addEventListener('input', () => { this.errorLine = null; this.refresh(); this.onChange?.(); });
    this.ta.addEventListener('scroll', () => this.sync());
    this.ta.addEventListener('keydown', (e) => this.key(e));
    this.ta.addEventListener('keyup', () => this.onCursor?.(this.cursor()));
    this.ta.addEventListener('click', () => this.onCursor?.(this.cursor()));
    this.value = value;
  }

  get value() { return this.ta.value; }
  set value(v) {
    this.ta.value = v;
    this.errorLine = null;
    this.refresh();
    this.ta.scrollTop = 0;
    this.ta.scrollLeft = 0;
    this.sync();
  }

  refresh() {
    const v = this.ta.value;
    this.hl.innerHTML = highlight(v) + '\n';
    const n = v.split('\n').length;
    let g = '';
    for (let i = 1; i <= n; i++) g += (i === this.errorLine ? `<b>${i}</b>` : i) + '\n';
    this.gutter.innerHTML = g;
    this.sync();
  }

  sync() {
    this.hl.style.transform = `translate(${-this.ta.scrollLeft}px, ${-this.ta.scrollTop}px)`;
    this.gutter.style.transform = `translateY(${-this.ta.scrollTop}px)`;
  }

  cursor() {
    const before = this.ta.value.slice(0, this.ta.selectionStart);
    const lines = before.split('\n');
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
  }

  markError(line) {
    this.errorLine = line;
    this.refresh();
    if (!line) return;
    const lh = parseFloat(getComputedStyle(this.ta).lineHeight) || 16;
    const top = (line - 1) * lh;
    if (top < this.ta.scrollTop || top > this.ta.scrollTop + this.ta.clientHeight - lh * 2) {
      this.ta.scrollTop = Math.max(0, top - this.ta.clientHeight / 3);
    }
  }

  key(e) {
    const ta = this.ta;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); this.onRun?.(); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = ta.selectionStart, end = ta.selectionEnd;
      if (s === end && !e.shiftKey) {
        ta.setRangeText('  ', s, end, 'end');
      } else {
        // indent or outdent the selected lines
        const v = ta.value;
        const ls = v.lastIndexOf('\n', s - 1) + 1;
        const block = v.slice(ls, end);
        const changed = e.shiftKey ? block.replace(/^ {1,2}/gm, '') : block.replace(/^/gm, '  ');
        ta.setRangeText(changed, ls, end, 'select');
      }
      this.refresh();
      this.onChange?.();
      return;
    }
    if (e.key === 'Enter') {
      // keep indentation, add a level after an opening bracket
      const s = ta.selectionStart;
      const v = ta.value;
      const ls = v.lastIndexOf('\n', s - 1) + 1;
      const indent = /^[ \t]*/.exec(v.slice(ls, s))[0];
      const extra = /[{[]\s*$/.test(v.slice(ls, s)) ? '  ' : '';
      e.preventDefault();
      ta.setRangeText('\n' + indent + extra, s, ta.selectionEnd, 'end');
      this.refresh();
      this.onChange?.();
    }
    if (e.key === '}' || e.key === ']') {
      const s = ta.selectionStart, v = ta.value;
      const ls = v.lastIndexOf('\n', s - 1) + 1;
      if (/^\s+$/.test(v.slice(ls, s)) && s - ls >= 2) {
        e.preventDefault();
        ta.setRangeText(v.slice(ls, s - 2) + e.key, ls, s, 'end');
        this.refresh();
        this.onChange?.();
      }
    }
  }

  focus() { this.ta.focus(); }
}
