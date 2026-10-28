/* Visual renderer: core helpers + simple visuals (shapes, dots, text, letters, equations).
 * VA.visuals.render(visual) -> HTML string. Pure string building: works in Node and the browser.
 */
(function (root) {
  const VA = (root.VA = root.VA || {});
  const art = VA.art;
  const { ST, ST2, INK } = art;

  let uid = 0;
  const nid = (p) => p + '-' + ++uid;
  const FONT = 'font-family="Trebuchet MS, Verdana, Arial, sans-serif"';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /** wrap inner SVG markup */
  function S(w, h, inner, type) {
    return '<svg class="vis vis-' + type + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">' + inner + '</svg>';
  }
  const text = (x, y, str, size, o) => {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.anchor || 'middle') + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 800) + '" fill="' + (o.fill || INK) + '">' + esc(str) + '</text>';
  };

  /** deterministic pseudo-random */
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  /** n non-overlapping points inside W x H using a jittered grid. */
  function scatter(n, W, H, seed) {
    const r = rng(seed * 7919 + 13);
    const cols = Math.max(1, Math.ceil(Math.sqrt((n * W) / H)));
    const rows = Math.ceil(n / cols);
    const cw = W / cols, ch = H / rows;
    const cells = [];
    for (let i = 0; i < cols * rows; i++) cells.push(i);
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]]; }
    return {
      size: Math.min(cw, ch),
      pts: cells.slice(0, n).map((c) => ({
        x: (c % cols) * cw + cw / 2 + (r() - 0.5) * cw * 0.28,
        y: Math.floor(c / cols) * ch + ch / 2 + (r() - 0.5) * ch * 0.28,
      })),
    };
  }

  // ---------- shapes ----------
  const SHAPE_DEFAULT = { circle: '#60a5fa', square: '#f87171', triangle: '#fbbf24', rectangle: '#34d399', hexagon: '#a78bfa', trapezoid: '#fb923c', cube: '#60a5fa', sphere: '#f472b6', cone: '#fb923c', cylinder: '#34d399' };
  function shapeInner(shape, color, rot) {
    const c = art.color(color, SHAPE_DEFAULT[shape] || '#60a5fa');
    let g = '';
    switch (shape) {
      case 'circle': g = '<circle cx="50" cy="50" r="40" fill="' + c + '" ' + ST + '/>'; break;
      case 'square': g = '<rect x="16" y="16" width="68" height="68" rx="3" fill="' + c + '" ' + ST + '/>'; break;
      case 'triangle': g = '<polygon points="50,12 92,84 8,84" fill="' + c + '" ' + ST + '/>'; break;
      case 'rectangle': g = '<rect x="6" y="26" width="88" height="48" rx="3" fill="' + c + '" ' + ST + '/>'; break;
      case 'hexagon': {
        const p = [];
        for (let i = 0; i < 6; i++) { const a = (i * 60) * Math.PI / 180; p.push((50 + 42 * Math.cos(a)).toFixed(1) + ',' + (50 + 42 * Math.sin(a)).toFixed(1)); }
        g = '<polygon points="' + p.join(' ') + '" fill="' + c + '" ' + ST + '/>'; break;
      }
      case 'trapezoid': g = '<polygon points="28,24 72,24 94,76 6,76" fill="' + c + '" ' + ST + '/>'; break;
      case 'open-triangle': g = '<path d="M50 14 L90 82 L10 82" fill="none" stroke="' + c + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'; break;
      case 'cube': return art.inner('cube', { color: color });
      case 'sphere': {
        const id = nid('sg');
        g = '<defs><radialGradient id="' + id + '" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '"/></radialGradient></defs>' +
          '<circle cx="50" cy="50" r="40" fill="url(#' + id + ')" ' + ST + '/><circle cx="50" cy="50" r="40" fill="#000" opacity=".08"/>' +
          '<ellipse cx="36" cy="32" rx="8" ry="5" fill="#fff" opacity=".7" transform="rotate(-35 36 32)"/>';
        break;
      }
      case 'cone':
        g = '<path d="M50 8 L86 76 A36 12 0 0 1 14 76Z" fill="' + c + '" ' + ST + '/><path d="M14 76 A36 12 0 0 0 86 76" fill="#000" opacity=".12"/>' +
          '<path d="M14 76 A36 12 0 0 0 86 76" fill="none" ' + ST + '/>'; break;
      case 'cylinder':
        g = '<path d="M16 26 L16 76 A34 11 0 0 0 84 76 L84 26Z" fill="' + c + '" ' + ST + '/>' +
          '<ellipse cx="50" cy="26" rx="34" ry="11" fill="' + c + '" ' + ST + '/><ellipse cx="50" cy="26" rx="34" ry="11" fill="#fff" opacity=".35"/>'; break;
      default: throw new Error('Unknown shape: ' + shape);
    }
    return rot ? '<g transform="translate(50 50) rotate(' + rot + ') scale(0.78) translate(-50 -50)">' + g + '</g>' : g;
  }

  const T = {};
  T.art = (v) => S(100, 100, art.inner(v.name, v), 'art');
  T.shape = (v) => S(100, 100, shapeInner(v.shape, v.color, v.rot), 'shape');
  T['shape-row'] = (v) => {
    const n = v.items.length, step = 100;
    return S(n * step, 100, v.items.map((it, i) => '<g transform="translate(' + i * step + ' 0)">' + shapeInner(it.shape, it.color, it.rot) + '</g>').join(''), 'shaperow');
  };
  T.sequence = (v) => {
    const n = v.items.length + 1, step = 76;
    const body = v.items.map((it, i) => {
      const inner = it.art ? art.inner(it.art, it) : shapeInner(it.shape, it.color, it.rot);
      return '<svg x="' + (i * step + 4) + '" y="12" width="68" height="68" viewBox="0 0 100 100">' + inner + '</svg>';
    }).join('');
    const qx = v.items.length * step + 4;
    return S(n * step + 8, 92, body +
      '<rect x="' + qx + '" y="12" width="68" height="68" rx="12" fill="#fff8e1" stroke="#f59e0b" stroke-width="3" stroke-dasharray="7 6"/>' + text(qx + 34, 60, '?', 40, { fill: '#d97706' }), 'sequence');
  };
  T.sized = (v) => {
    const s = 100 * v.scale;
    return S(100, 100, '<svg x="' + ((100 - s) / 2) + '" y="' + (100 - s) + '" width="' + s + '" height="' + s + '" viewBox="0 0 100 100" overflow="visible">' + art.inner(v.art, v) + '</svg>' +
      '<line x1="4" y1="99" x2="96" y2="99" stroke="#a3b18a" stroke-width="2" stroke-linecap="round"/>', 'sized');
  };
  T.none = () => '';

  // ---------- dots ----------
  const PIPS = { 1: [[50, 50]], 2: [[30, 30], [70, 70]], 3: [[30, 30], [50, 50], [70, 70]], 4: [[30, 30], [70, 30], [30, 70], [70, 70]], 5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]], 6: [[30, 28], [70, 28], [30, 50], [70, 50], [30, 72], [70, 72]] };
  T.dots = (v) => {
    const n = v.n, color = art.color(v.color, '#ef4444');
    if (v.pattern === 'dice') {
      return S(100, 100, '<rect x="8" y="8" width="84" height="84" rx="16" fill="#fff" ' + ST + '/>' +
        PIPS[n].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="' + color + '"/>').join(''), 'dots');
    }
    if (v.pattern === 'line') {
      const step = 30, w = 100, x0 = (w - n * step) / 2;
      return S(w, 44, Array.from({ length: n }, (_, i) => '<circle cx="' + (x0 + step / 2 + i * step) + '" cy="22" r="10" fill="' + color + '" ' + ST2 + '/>').join(''), 'dots');
    }
    const sc = scatter(n, 80, 80, n + 3);
    return S(100, 100, '<rect x="4" y="4" width="92" height="92" rx="14" fill="#fff" ' + ST + '/>' +
      sc.pts.map((p) => '<circle cx="' + (10 + p.x).toFixed(1) + '" cy="' + (10 + p.y).toFixed(1) + '" r="8" fill="' + color + '"/>').join(''), 'dots');
  };

  // ---------- text-like visuals (HTML so they wrap and scale with the page) ----------
  T.letter = (v) => '<div class="vis vis-letter" aria-hidden="true">' + esc(v.text) + '</div>';
  T.text = (v) => {
    const cls = 'vis vis-text' + (v.big ? ' is-big' : '') + (v.sentence ? ' is-sentence' : '') + (v.words ? ' is-words' : '') + (/=/.test(v.text) ? ' is-equation' : v.text.length > 8 ? ' is-long' : '');
    if (v.words) return '<div class="' + cls + '" aria-hidden="true">' + v.text.split(' ').map((w) => '<span class="word">' + esc(w) + '</span>').join(' ') + '</div>';
    return '<div class="' + cls + '" aria-hidden="true">' + esc(v.text) + '</div>';
  };
  T.equation = (v) => {
    const w = 52;
    const body = v.parts.map((p, i) => {
      const x = i * w + w / 2;
      if (p === '?') return '<rect x="' + (i * w + 5) + '" y="10" width="' + (w - 10) + '" height="52" rx="10" fill="#fff8e1" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 5"/>' + text(x, 48, '?', 36, { fill: '#d97706' });
      return text(x, 50, p === '-' ? '\u2212' : p, 40, { fill: /[+\-=]/.test(p) ? '#2563eb' : INK });
    }).join('');
    return S(v.parts.length * w, 72, body, 'equation');
  };
  T.numcompare = (v) =>
    S(300, 80, text(60, 56, String(v.a), 50) + text(240, 56, String(v.b), 50) +
      '<rect x="116" y="12" width="68" height="60" rx="12" fill="#fff8e1" stroke="#f59e0b" stroke-width="3" stroke-dasharray="7 6"/>' + text(150, 56, '?', 40, { fill: '#d97706' }), 'numcompare');
  T.tiles = (v) => {
    const w = 78, n = v.items.length;
    return S(n * w + 6, 84, v.items.map((t, i) => {
      const q = t === '?', x = 4 + i * w;
      return '<rect x="' + x + '" y="8" width="' + (w - 8) + '" height="64" rx="12" fill="' + (q ? '#fff8e1' : '#e0f2fe') + '" stroke="' + (q ? '#f59e0b' : '#3b82f6') + '" stroke-width="3"' + (q ? ' stroke-dasharray="7 6"' : '') + '/>' + text(x + (w - 8) / 2, 54, t, t.length > 2 ? 28 : 36, { fill: q ? '#d97706' : INK });
    }).join(''), 'tiles');
  };

  const V = (VA.visuals = {
    types: T, S, text, esc, rng, scatter, shapeInner, nid, FONT,
    /** Render any visual spec to an HTML string. */
    render(v) {
      if (!v || !v.type) return '';
      const fn = T[v.type];
      if (!fn) throw new Error('Unknown visual type: ' + v.type);
      return fn(v);
    },
  });
  void V;
})(typeof window !== 'undefined' ? window : globalThis);
