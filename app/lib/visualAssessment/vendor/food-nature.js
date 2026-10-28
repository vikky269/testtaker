/* Fruit, food and nature illustrations (original SVG, 100 x 100). */
(function (root) {
  const art = root.VA.art;
  const { ST, ST2, INK } = art;

  /* ---------- fruit & food ---------- */
  art.def('apple', (o) => {
    const c = art.color(o.color, '#ef4444');
    return '<path d="M50 30 C32 16 10 30 13 56 C16 80 34 94 50 87 C66 94 84 80 87 56 C90 30 68 16 50 30Z" fill="' + c + '" ' + ST + '/>' +
      '<path d="M50 30 C50 22 53 14 59 9" fill="none" stroke="#6b4423" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M54 20 C62 7 78 10 80 15 C73 23 62 25 54 20Z" fill="#4ade80" ' + ST2 + '/>' +
      '<ellipse cx="29" cy="50" rx="5" ry="10" fill="#fff" opacity=".4" transform="rotate(18 29 50)"/>';
  });

  art.def('banana', () =>
    '<path d="M16 30 C16 66 44 90 88 72 C93 70 92 61 85 61 C58 66 40 50 33 24 C32 17 17 21 16 30Z" fill="#facc15" ' + ST + '/>' +
    '<path d="M24 22 L31 11" stroke="#6b4423" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M24 36 C28 58 46 70 70 70" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>' +
    '<circle cx="88" cy="68" r="3" fill="#6b4423"/>');

  art.def('pear', () =>
    '<path d="M50 14 C58 14 61 26 63 34 C82 48 84 82 50 90 C16 82 18 48 37 34 C39 26 42 14 50 14Z" fill="#a3d977" ' + ST + '/>' +
    '<path d="M50 14 C50 8 52 4 56 2" fill="none" stroke="#6b4423" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M54 12 C62 2 76 6 76 10 C70 17 60 18 54 12Z" fill="#4ade80" ' + ST2 + '/>' +
    '<ellipse cx="36" cy="62" rx="4.5" ry="10" fill="#fff" opacity=".4" transform="rotate(12 36 62)"/>');

  art.def('grapes', () => {
    const pts = [[34, 40], [50, 40], [66, 40], [42, 55], [58, 55], [34, 56], [66, 56], [50, 70]];
    return '<path d="M50 22 L50 12" stroke="#6b4423" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M52 16 C60 4 78 8 80 14 C72 22 60 22 52 16Z" fill="#4ade80" ' + ST2 + '/>' +
      pts.map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="#a855f7" ' + ST2 + '/><circle cx="' + (p[0] - 4) + '" cy="' + (p[1] - 4) + '" r="3" fill="#fff" opacity=".45"/>').join('') +
      '<circle cx="50" cy="84" r="0" fill="none"/>';
  });

  art.def('carrot', () =>
    '<path d="M50 40 C44 24 34 14 28 8 M50 40 C50 22 50 12 50 4 M50 40 C56 24 66 14 72 8" fill="none" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M32 38 C28 36 70 36 68 38 C66 58 56 82 50 96 C44 82 34 58 32 38Z" fill="#fb923c" ' + ST + '/>' +
    '<path d="M42 52 L48 52 M52 66 L58 66 M45 78 L50 78" stroke="#c2410c" stroke-width="3" stroke-linecap="round"/>');

  art.def('cake', () =>
    '<rect x="16" y="66" width="68" height="26" rx="5" fill="#f9a8d4" ' + ST + '/>' +
    '<rect x="24" y="44" width="52" height="24" rx="5" fill="#fde68a" ' + ST + '/>' +
    '<path d="M24 48 Q32 60 40 48 Q48 60 56 48 Q64 60 76 48" fill="#fff" ' + ST2 + '/>' +
    '<path d="M16 70 Q24 82 32 70 Q40 82 48 70 Q56 82 64 70 Q72 82 84 70" fill="#fff" ' + ST2 + '/>' +
    '<rect x="46" y="26" width="8" height="18" rx="2" fill="#60a5fa" ' + ST2 + '/>' +
    '<path d="M50 6 C56 14 56 22 50 24 C44 22 44 14 50 6Z" fill="#fbbf24" ' + ST2 + '/>');

  art.def('egg', () =>
    '<path d="M50 8 C72 8 84 44 84 62 C84 82 68 94 50 94 C32 94 16 82 16 62 C16 44 28 8 50 8Z" fill="#fff7ed" ' + ST + '/>' +
    '<ellipse cx="36" cy="46" rx="5" ry="11" fill="#fff" opacity=".8" transform="rotate(14 36 46)"/>' +
    '<circle cx="62" cy="66" r="2.6" fill="#fed7aa"/><circle cx="50" cy="78" r="2.2" fill="#fed7aa"/><circle cx="68" cy="50" r="2" fill="#fed7aa"/>');

  art.def('basket', () =>
    '<path d="M22 44 C22 10 78 10 78 44" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/><path d="M22 44 C22 10 78 10 78 44" fill="none" stroke="#d97706" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M10 44 L90 44 L80 90 Q50 98 20 90Z" fill="#f59e0b" ' + ST + '/>' +
    '<path d="M14 58 L86 58 M18 72 L82 72 M34 46 L36 92 M50 46 L50 94 M66 46 L64 92" stroke="#b45309" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>' +
    '<ellipse cx="50" cy="44" rx="40" ry="6" fill="#fbbf24" ' + ST2 + '/>');

  /* ---------- nature ---------- */
  art.def('flower', (o) => {
    const c = art.color(o.color, '#f472b6');
    let petals = '';
    for (let i = 0; i < 5; i++) {
      const a = (-90 + i * 72) * Math.PI / 180;
      petals += '<circle cx="' + (50 + 18 * Math.cos(a)).toFixed(1) + '" cy="' + (34 + 18 * Math.sin(a)).toFixed(1) + '" r="13.5" fill="' + c + '" ' + ST2 + '/>';
    }
    return '<path d="M50 48 L50 96" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/><path d="M50 48 L50 96" stroke="#22c55e" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M50 80 C30 80 24 66 22 60 C40 60 48 68 50 80Z" fill="#4ade80" ' + ST2 + '/><path d="M50 72 C68 72 76 60 78 54 C60 54 52 62 50 72Z" fill="#4ade80" ' + ST2 + '/>' +
      petals + '<circle cx="50" cy="34" r="10" fill="#facc15" ' + ST2 + '/>';
  });

  art.def('tree', () =>
    '<rect x="42" y="58" width="16" height="38" rx="3" fill="#92400e" ' + ST + '/>' +
    '<circle cx="50" cy="36" r="28" fill="#22c55e" ' + ST + '/><circle cx="28" cy="52" r="18" fill="#22c55e" ' + ST + '/><circle cx="72" cy="52" r="18" fill="#22c55e" ' + ST + '/>' +
    '<circle cx="50" cy="44" r="22" fill="#22c55e"/>' +
    '<circle cx="40" cy="30" r="5" fill="#86efac" opacity=".7"/><circle cx="64" cy="42" r="4" fill="#86efac" opacity=".7"/>');

  art.def('sun', () => {
    let rays = '';
    for (let i = 0; i < 12; i++) {
      const a = i * 30 * Math.PI / 180;
      rays += '<line x1="' + (50 + 34 * Math.cos(a)).toFixed(1) + '" y1="' + (50 + 34 * Math.sin(a)).toFixed(1) + '" x2="' + (50 + 46 * Math.cos(a)).toFixed(1) + '" y2="' + (50 + 46 * Math.sin(a)).toFixed(1) + '" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>';
    }
    return rays + '<circle cx="50" cy="50" r="27" fill="#facc15" ' + ST + '/><circle cx="42" cy="42" r="6" fill="#fff" opacity=".45"/>';
  });

  art.def('moon', () =>
    '<path d="M62 8 C30 10 10 34 14 62 C18 86 44 98 68 92 C80 88 88 80 90 76 C60 76 44 48 62 8Z" fill="#fde68a" ' + ST + '/>' +
    '<circle cx="30" cy="56" r="5" fill="#fcd34d"/><circle cx="42" cy="78" r="4" fill="#fcd34d"/><circle cx="34" cy="36" r="3.4" fill="#fcd34d"/>');

  art.def('star', (o) => {
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 44 : 19, a = (-90 + i * 36) * Math.PI / 180;
      pts.push((50 + r * Math.cos(a)).toFixed(1) + ' ' + (54 + r * Math.sin(a)).toFixed(1));
    }
    return '<polygon points="' + pts.join(' ') + '" fill="' + art.color(o.color, '#facc15') + '" ' + ST + '/>' +
      '<circle cx="44" cy="46" r="4" fill="#fff" opacity=".5"/>';
  });

  art.def('heart', () =>
    '<path d="M50 90 C14 62 8 38 22 24 C34 12 48 20 50 32 C52 20 66 12 78 24 C92 38 86 62 50 90Z" fill="#ef4444" ' + ST + '/>' +
    '<ellipse cx="30" cy="34" rx="5" ry="8" fill="#fff" opacity=".45" transform="rotate(30 30 34)"/>');

  art.def('leaf', () =>
    '<path d="M14 86 C10 40 44 10 90 12 C92 58 62 92 14 86Z" fill="#4ade80" ' + ST + '/>' +
    '<path d="M14 86 C34 66 56 44 82 20 M40 62 L40 44 M54 48 L72 48 M32 74 L20 66" fill="none" stroke="#15803d" stroke-width="3" stroke-linecap="round"/>');

  art.def('rock', () =>
    '<path d="M10 78 C8 56 20 36 38 30 C50 18 72 22 80 38 C94 46 94 70 88 80 C70 88 28 90 10 78Z" fill="#94a3b8" ' + ST + '/>' +
    '<path d="M30 46 C34 38 42 34 50 34" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/><path d="M60 70 L70 64 M44 72 L50 66" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>');

  art.def('feather', () =>
    '<path d="M18 90 C10 50 40 14 86 8 C88 52 60 86 18 90Z" fill="#bae6fd" ' + ST + '/>' +
    '<path d="M10 96 L74 20" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M30 76 L44 78 M40 62 L56 62 M50 48 L66 44 M36 70 L24 62" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round"/>');

  art.def('seed', () =>
    '<path d="M6 90 C14 62 34 54 50 54 C66 54 86 62 94 90Z" fill="#92400e" ' + ST + '/>' +
    '<ellipse cx="50" cy="52" rx="9" ry="6" fill="#d6b788" ' + ST + '/>' +
    '<path d="M26 82 L32 80 M60 78 L66 82 M44 70 L50 72" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>');

  art.def('raincloud', () =>
    '<path d="M26 56 C10 56 8 34 26 32 C28 14 56 10 64 28 C84 24 94 46 78 56Z" fill="#cbd5e1" ' + ST + '/>' +
    '<path d="M30 66 L24 82 M48 66 L42 86 M66 66 L60 82" stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M40 90 L36 98 M58 88 L54 96 M76 70 L72 80" stroke="#60a5fa" stroke-width="4" stroke-linecap="round"/>');

  art.def('nest', () =>
    '<path d="M6 46 C10 82 90 82 94 46 C90 60 10 60 6 46Z" fill="#a16207" ' + ST + '/>' +
    '<ellipse cx="50" cy="46" rx="44" ry="10" fill="#ca8a04" ' + ST + '/>' +
    '<ellipse cx="50" cy="48" rx="30" ry="5.5" fill="#78350f"/>' +
    '<path d="M16 60 Q30 70 48 66 M50 70 Q70 72 84 60 M30 76 Q50 82 70 76" fill="none" stroke="#fbbf24" stroke-width="2.6" stroke-linecap="round"/>');

  art.def('log', () =>
    '<path d="M18 28 L80 28 L80 74 L18 74 C8 74 8 28 18 28Z" fill="#a16207" ' + ST + '/>' +
    '<path d="M24 40 L70 40 M22 52 L72 52 M24 62 L70 62" stroke="#78350f" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>' +
    '<ellipse cx="80" cy="51" rx="12" ry="23" fill="#fcd34d" ' + ST + '/>' +
    '<ellipse cx="80" cy="51" rx="7.5" ry="14.5" fill="none" stroke="#b45309" stroke-width="2.4"/><circle cx="80" cy="51" r="2.6" fill="#b45309"/>');

  art.def('equals', () =>
    '<rect x="12" y="26" width="76" height="16" rx="8" fill="#3b82f6" ' + ST + '/><rect x="12" y="58" width="76" height="16" rx="8" fill="#3b82f6" ' + ST + '/>');
})(typeof window !== 'undefined' ? window : globalThis);
