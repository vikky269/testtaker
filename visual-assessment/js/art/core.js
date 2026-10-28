/* Illustration registry.
 * Every illustration is an original SVG drawn on a 100 x 100 canvas and stored as a function
 * returning inner SVG markup. No emoji, no remote images, no external assets.
 *
 *   VA.art.def('apple', (o) => '<path .../>')   // register
 *   VA.art.svg('apple', { color:'#e63946' })      // full <svg> string
 *   VA.art.inner('apple', opts)                   // inner markup, for composing scenes
 */
(function (root) {
  const VA = (root.VA = root.VA || {});

  const COLORS = {
    red: '#ef4444', blue: '#3b82f6', green: '#22c55e', yellow: '#facc15', orange: '#fb923c',
    purple: '#a855f7', pink: '#f472b6', teal: '#14b8a6', brown: '#a16207', gray: '#94a3b8',
    white: '#ffffff', black: '#1f2937',
  };
  const INK = '#3d2c24';
  const ST = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const ST2 = 'stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';

  const defs = {};
  const art = {
    COLORS, INK, ST, ST2,
    color(c, fallback) {
      if (!c) return fallback;
      return COLORS[c] || c;
    },
    def(name, fn) { defs[name] = fn; },
    has(name) { return !!defs[name]; },
    names() { return Object.keys(defs); },
    inner(name, opts) {
      if (!defs[name]) throw new Error('Unknown illustration: ' + name);
      return defs[name](opts || {});
    },
    svg(name, opts) {
      opts = opts || {};
      return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"' +
        (opts.cls ? ' class="' + opts.cls + '"' : '') + '>' + art.inner(name, opts) + '</svg>';
    },
    /** Nested placement used by scenes and groups. */
    place(name, x, y, size, opts) {
      return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="0 0 100 100" overflow="visible">' +
        art.inner(name, opts) + '</svg>';
    },
  };

  VA.art = art;
})(typeof window !== 'undefined' ? window : globalThis);
