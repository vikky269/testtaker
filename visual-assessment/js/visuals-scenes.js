/* Visual renderer: scenes, book parts, labelled plant, text-line direction visuals. */
(function (root) {
  const VA = root.VA;
  const art = VA.art, V = VA.visuals, T = V.types;
  const { ST, ST2, INK } = art;
  const { S, text, nid } = V;

  const cloud = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fff"><ellipse cx="20" cy="14" rx="20" ry="11"/><ellipse cx="38" cy="10" rx="16" ry="11"/><ellipse cx="8" cy="16" rx="10" ry="8"/></g>';

  const BG = {
    sky: () => '<rect width="200" height="140" fill="#bfe6ff"/>' + cloud(18, 14, 0.9) + cloud(120, 26, 0.7) + '<path d="M0 108 Q60 96 120 106 T200 104 L200 140 L0 140Z" fill="#86d36b"/>',
    meadow: () => '<rect width="200" height="140" fill="#cdeeff"/>' + cloud(130, 10, 0.8) + '<path d="M0 96 Q50 76 110 92 T200 86 L200 140 L0 140Z" fill="#9be07a"/><path d="M0 116 Q70 100 140 114 T200 110 L200 140 L0 140Z" fill="#7bcf5e"/>' +
      [[22, 124], [70, 130], [118, 122], [168, 130], [150, 106], [36, 108]].map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="' + ['#f472b6', '#fde047', '#fff'][i % 3] + '"/>').join(''),
    pond: () => '<rect width="200" height="140" fill="#cdeeff"/>' + cloud(20, 10, 0.8) + '<rect y="70" width="200" height="70" fill="#86d36b"/><ellipse cx="100" cy="106" rx="78" ry="26" fill="#5fb3f0" stroke="#3b82c4" stroke-width="2.4"/><path d="M60 104 q10 -4 20 0 M110 112 q10 -4 20 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
    beach: () => '<rect width="200" height="140" fill="#bfe6ff"/><rect y="56" width="200" height="34" fill="#4fb0e8"/><path d="M0 62 q12 -6 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0" stroke="#fff" stroke-width="2.4" fill="none"/><path d="M0 88 Q100 78 200 90 L200 140 L0 140Z" fill="#f6dc9a"/>',
    snow: () => '<rect width="200" height="140" fill="#dbeafe"/>' + [[20, 20], [60, 40], [100, 16], [150, 34], [180, 12], [40, 70], [130, 60]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.8" fill="#fff"/>').join('') + '<path d="M0 100 Q60 80 120 98 T200 92 L200 140 L0 140Z" fill="#fff"/><path d="M0 100 Q60 80 120 98 T200 92" fill="none" stroke="#bfdbfe" stroke-width="2.4"/>',
    rain: () => '<rect width="200" height="140" fill="#9fb4c9"/>' + cloud(10, 6, 1.0).replace('#fff', '#d6dee8') + cloud(110, 14, 0.9).replace('#fff', '#d6dee8') +
      Array.from({ length: 26 }, (_, i) => '<line x1="' + (8 + (i * 37) % 190) + '" y1="' + (36 + (i * 53) % 70) + '" x2="' + (3 + (i * 37) % 190) + '" y2="' + (48 + (i * 53) % 70) + '" stroke="#e8f1fa" stroke-width="2" stroke-linecap="round"/>').join('') + '<path d="M0 112 Q100 102 200 112 L200 140 L0 140Z" fill="#6aa86a"/>',
    room: () => '<rect width="200" height="140" fill="#fde9b8"/><rect y="104" width="200" height="36" fill="#c98f55"/><path d="M0 104 L200 104" stroke="#a9733f" stroke-width="3"/><rect x="132" y="18" width="52" height="44" rx="3" fill="#bfe6ff" stroke="#8b5e34" stroke-width="3.4"/><path d="M158 18 L158 62 M132 40 L184 40" stroke="#8b5e34" stroke-width="2.6"/>',
  };

  T.scene = (v) => {
    const bg = BG[v.bg];
    if (!bg) throw new Error('Unknown scene background: ' + v.bg);
    const id = nid('sc');
    const items = v.items.map((it) => art.place(it.art, it.x, it.y, it.s, it)).join('');
    return S(200, 140, '<defs><clipPath id="' + id + '"><rect width="200" height="140" rx="10"/></clipPath></defs><g clip-path="url(#' + id + ')">' + bg() + items + '</g><rect width="200" height="140" rx="10" fill="none" stroke="' + INK + '" stroke-width="3"/>', 'scene');
  };

  T.book = (v) => {
    if (v.part === 'spine') {
      return S(100, 100, '<rect x="38" y="6" width="24" height="88" rx="3" fill="#2563eb" ' + ST + '/><rect x="38" y="6" width="5" height="88" fill="#1d4ed8"/>' +
        '<rect x="42" y="14" width="16" height="4" fill="#fde68a"/><rect x="42" y="82" width="16" height="4" fill="#fde68a"/>' +
        '<text x="50" y="50" transform="rotate(-90 50 50)" text-anchor="middle" ' + V.FONT + ' font-size="13" font-weight="800" fill="#fff" dominant-baseline="middle">BIG DOG</text>', 'book');
    }
    if (v.part === 'back') {
      return S(100, 100, '<rect x="16" y="6" width="68" height="88" rx="5" fill="#3b82f6" ' + ST + '/><rect x="16" y="6" width="9" height="88" rx="3" fill="#1d4ed8"/>' +
        [22, 30, 38, 46].map((y, i) => '<rect x="32" y="' + y + '" width="' + (44 - (i % 2) * 8) + '" height="4" rx="2" fill="#bfdbfe"/>').join('') +
        '<rect x="46" y="68" width="30" height="18" fill="#fff" ' + ST2 + '/>' + Array.from({ length: 9 }, (_, i) => '<rect x="' + (49 + i * 3) + '" y="71" width="' + (i % 3 ? 1.2 : 2) + '" height="12" fill="' + INK + '"/>').join(''), 'book');
    }
    return S(100, 100, '<rect x="16" y="6" width="68" height="88" rx="5" fill="#3b82f6" ' + ST + '/><rect x="16" y="6" width="9" height="88" rx="3" fill="#1d4ed8"/>' +
      '<rect x="30" y="14" width="46" height="18" rx="4" fill="#fde68a"/>' + text(53, 27, 'BIG DOG', 10, { fill: INK }) +
      '<svg x="32" y="38" width="44" height="44" viewBox="0 0 100 100">' + art.inner('dog') + '</svg>', 'book');
  };

  T['plant-labeled'] = () => {
    const tag = (x, y, l) => '<circle cx="' + x + '" cy="' + y + '" r="13" fill="#fff" ' + ST + '/>' + text(x, y + 6, l, 17);
    return S(200, 210, '<rect width="200" height="210" rx="12" fill="#e0f2fe"/><rect y="118" width="200" height="92" fill="#a16207"/><path d="M0 118 Q50 110 100 118 T200 116" stroke="#7c4a12" stroke-width="3" fill="none"/>' +
      // roots
      '<g fill="none" stroke="#f5e6c8" stroke-width="4.4" stroke-linecap="round"><path d="M100 118 L100 176 M100 140 Q84 150 76 168 M100 134 Q118 146 126 170 M100 160 Q90 172 90 186"/></g>' +
      // stem + leaves + flower
      '<path d="M100 118 L100 56" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M100 96 Q70 88 62 66 Q92 66 100 92Z" fill="#4ade80" ' + ST2 + '/><path d="M100 82 Q130 76 140 54 Q108 54 100 78Z" fill="#4ade80" ' + ST2 + '/>' +
      '<g transform="translate(100 38)">' + Array.from({ length: 6 }, (_, i) => '<ellipse cx="0" cy="-16" rx="8" ry="13" fill="#f472b6" ' + ST2 + ' transform="rotate(' + i * 60 + ')"/>').join('') + '<circle r="9" fill="#fde047" ' + ST2 + '/></g>' +
      // labels
      '<path d="M130 30 L152 22" stroke="' + INK + '" stroke-width="2.4"/>' + tag(162, 20, 'A') +
      '<path d="M101 100 L50 100" stroke="' + INK + '" stroke-width="0"/><path d="M106 104 L144 104" stroke="' + INK + '" stroke-width="2.4"/>' + tag(158, 104, 'B') +
      '<path d="M96 178 L56 192" stroke="' + INK + '" stroke-width="2.4"/>' + tag(44, 194, 'C'), 'plant');
  };

  T.textline = (v) => {
    const cols = ['#ef4444', '#3b82f6', '#22c55e'];
    let out = '<rect x="6" y="6" width="188" height="' + (v.lines * 26 + 14) + '" rx="10" fill="#fff" ' + ST + '/>';
    for (let i = 0; i < v.lines; i++) {
      out += '<rect x="18" y="' + (18 + i * 26) + '" width="' + (i === v.lines - 1 ? 120 : 164) + '" height="10" rx="5" fill="' + (v.colors ? cols[i % 3] : '#cbd5e1') + '"/>';
    }
    if (v.mark) {
      const last = 18 + (v.lines - 1) * 26 + 5;
      const pos = { 'top-left': [14, 23], 'top-right': [186, 23], 'bottom-right': [150, last], 'bottom-left': [14, last] }[v.mark];
      out += '<circle cx="' + pos[0] + '" cy="' + pos[1] + '" r="8.5" fill="#22c55e" stroke="' + INK + '" stroke-width="2.4"/>';
    }
    return S(200, v.lines * 26 + 22, out, 'textline');
  };
})(typeof window !== 'undefined' ? window : globalThis);
