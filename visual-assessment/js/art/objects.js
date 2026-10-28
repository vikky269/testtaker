/* Toys, household and classroom object illustrations (original SVG, 100 x 100). */
(function (root) {
  const art = root.VA.art;
  const { ST, ST2, INK } = art;
  let uid = 0;
  const nextId = (p) => p + '-' + ++uid;

  art.def('ball', (o) => {
    const c = art.color(o.color, '#ef4444'), id = nextId('cb');
    return '<defs><clipPath id="' + id + '"><circle cx="50" cy="50" r="38"/></clipPath></defs>' +
      '<circle cx="50" cy="50" r="38" fill="' + c + '"/>' +
      '<g clip-path="url(#' + id + ')"><path d="M0 36 Q50 62 100 36 L100 52 Q50 78 0 52Z" fill="#fff"/></g>' +
      '<circle cx="50" cy="50" r="38" fill="none" ' + ST + '/>' +
      '<ellipse cx="34" cy="30" rx="6" ry="9" fill="#fff" opacity=".45" transform="rotate(35 34 30)"/>';
  });

  art.def('balloon', (o) => {
    const c = art.color(o.color, '#ef4444');
    return '<path d="M50 80 Q40 88 50 93 Q60 98 52 100" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M44 74 L56 74 L50 82Z" fill="' + c + '" ' + ST2 + '/>' +
      '<ellipse cx="50" cy="38" rx="28" ry="35" fill="' + c + '" ' + ST + '/>' +
      '<ellipse cx="38" cy="26" rx="5" ry="10" fill="#fff" opacity=".45" transform="rotate(20 38 26)"/>';
  });

  art.def('bed', () =>
    '<rect x="6" y="24" width="12" height="68" rx="4" fill="#92400e" ' + ST + '/><rect x="82" y="50" width="12" height="42" rx="4" fill="#92400e" ' + ST + '/>' +
    '<rect x="14" y="58" width="72" height="22" rx="4" fill="#f8fafc" ' + ST + '/>' +
    '<path d="M36 52 L86 52 L86 78 L36 78Z" fill="#60a5fa" ' + ST + '/><path d="M36 64 L86 64" stroke="#2563eb" stroke-width="3"/>' +
    '<ellipse cx="28" cy="52" rx="14" ry="9" fill="#fff" ' + ST + '/>');

  art.def('bell', () =>
    '<circle cx="50" cy="12" r="6" fill="none" ' + ST + '/>' +
    '<path d="M50 16 C30 16 26 42 24 60 L12 76 L88 76 L76 60 C74 42 70 16 50 16Z" fill="#facc15" ' + ST + '/>' +
    '<path d="M36 30 C32 44 32 54 30 64" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>' +
    '<circle cx="50" cy="84" r="8" fill="#a16207" ' + ST + '/>');

  art.def('bicycle', () =>
    '<circle cx="22" cy="68" r="20" fill="none" stroke="' + INK + '" stroke-width="5"/><circle cx="78" cy="68" r="20" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
    '<circle cx="22" cy="68" r="3" fill="' + INK + '"/><circle cx="78" cy="68" r="3" fill="' + INK + '"/>' +
    '<path d="M22 68 L40 36 L66 36 L78 68 M40 36 L46 68 L22 68 M46 68 L66 36" fill="none" stroke="#ef4444" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<path d="M30 30 L46 30" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/><path d="M66 36 L62 22 L74 22" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="46" cy="68" r="5" fill="#facc15" ' + ST2 + '/>');

  art.def('boat', () =>
    '<path d="M50 8 L50 62" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M46 12 L46 58 L14 58Z" fill="#fff" ' + ST + '/><path d="M54 24 L54 58 L84 58Z" fill="#fde047" ' + ST + '/>' +
    '<path d="M8 62 L92 62 L80 84 L20 84Z" fill="#ef4444" ' + ST + '/>' +
    '<path d="M0 92 Q8 86 16 92 T32 92 T48 92 T64 92 T80 92 T96 92" fill="none" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/>');

  art.def('ship', () =>
    '<rect x="42" y="14" width="14" height="22" rx="2" fill="#ef4444" ' + ST + '/><rect x="42" y="20" width="14" height="5" fill="#1f2937"/>' +
    '<path d="M44 12 Q40 6 46 6 M52 10 Q50 2 56 2" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>' +
    '<rect x="24" y="36" width="52" height="22" rx="3" fill="#f8fafc" ' + ST + '/>' +
    '<circle cx="36" cy="47" r="4.5" fill="#60a5fa" ' + ST2 + '/><circle cx="50" cy="47" r="4.5" fill="#60a5fa" ' + ST2 + '/><circle cx="64" cy="47" r="4.5" fill="#60a5fa" ' + ST2 + '/>' +
    '<path d="M4 58 L96 58 L82 82 L18 82Z" fill="#1d4ed8" ' + ST + '/><path d="M10 66 L90 66" stroke="#fff" stroke-width="3"/>' +
    '<path d="M0 92 Q8 86 16 92 T32 92 T48 92 T64 92 T80 92 T96 92" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>');

  art.def('book', () =>
    '<rect x="22" y="8" width="62" height="84" rx="4" fill="#fff" ' + ST + '/>' +
    '<rect x="18" y="8" width="62" height="84" rx="4" fill="#3b82f6" ' + ST + '/>' +
    '<rect x="18" y="8" width="11" height="84" rx="3" fill="#1d4ed8" ' + ST2 + '/>' +
    '<rect x="38" y="22" width="32" height="9" rx="3" fill="#fde68a"/><rect x="38" y="35" width="22" height="6" rx="3" fill="#fde68a"/>' +
    '<circle cx="54" cy="66" r="12" fill="#facc15" ' + ST2 + '/>');

  art.def('box', () =>
    '<path d="M12 38 L28 18 L92 18 L88 38Z" fill="#e7b974" ' + ST + '/>' +
    '<rect x="12" y="38" width="76" height="50" fill="#d9a05b" ' + ST + '/>' +
    '<rect x="42" y="38" width="16" height="26" fill="#fde68a" ' + ST2 + '/>' +
    '<path d="M28 18 L32 38 M92 18 L88 38" stroke="' + INK + '" stroke-width="2.4"/>');

  art.def('box-front', () =>
    '<rect x="10" y="40" width="80" height="52" rx="3" fill="#d9a05b" ' + ST + '/>' +
    '<rect x="10" y="36" width="80" height="10" rx="3" fill="#e7b974" ' + ST + '/>' +
    '<rect x="40" y="46" width="20" height="14" fill="#fde68a" ' + ST2 + '/>');

  art.def('bone', () =>
    '<g stroke="' + INK + '" stroke-width="7" stroke-linejoin="round" fill="' + INK + '"><rect x="24" y="40" width="52" height="20"/><circle cx="22" cy="38" r="11"/><circle cx="22" cy="62" r="11"/><circle cx="78" cy="38" r="11"/><circle cx="78" cy="62" r="11"/></g>' +
    '<g fill="#fff"><rect x="24" y="40" width="52" height="20"/><circle cx="22" cy="38" r="11"/><circle cx="22" cy="62" r="11"/><circle cx="78" cy="38" r="11"/><circle cx="78" cy="62" r="11"/></g>');

  art.def('chair', () =>
    '<rect x="22" y="8" width="10" height="56" rx="3" fill="#a16207" ' + ST + '/>' +
    '<rect x="20" y="52" width="58" height="11" rx="3" fill="#ca8a04" ' + ST + '/>' +
    '<rect x="66" y="62" width="10" height="32" rx="3" fill="#a16207" ' + ST + '/><rect x="22" y="62" width="10" height="32" rx="3" fill="#a16207" ' + ST + '/>' +
    '<path d="M32 22 L32 40" stroke="' + INK + '" stroke-width="0"/>');

  art.def('clock', () => {
    let ticks = '';
    for (let i = 0; i < 12; i++) {
      const a = i * 30 * Math.PI / 180, r1 = i % 3 === 0 ? 31 : 34, r2 = 38;
      ticks += '<line x1="' + (50 + r1 * Math.sin(a)).toFixed(1) + '" y1="' + (50 - r1 * Math.cos(a)).toFixed(1) + '" x2="' + (50 + r2 * Math.sin(a)).toFixed(1) + '" y2="' + (50 - r2 * Math.cos(a)).toFixed(1) + '" stroke="' + INK + '" stroke-width="' + (i % 3 === 0 ? 3.4 : 2) + '" stroke-linecap="round"/>';
    }
    return '<circle cx="50" cy="50" r="44" fill="#3b82f6" ' + ST + '/><circle cx="50" cy="50" r="38" fill="#fff" ' + ST2 + '/>' + ticks +
      '<path d="M50 50 L36 38" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/><path d="M50 50 L66 28" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/><circle cx="50" cy="50" r="4" fill="#ef4444"/>';
  });

  art.def('coat', () =>
    '<path d="M32 12 L50 22 L68 12 L92 34 L82 54 L74 46 L74 92 L26 92 L26 46 L18 54 L8 34Z" fill="#3b82f6" ' + ST + '/>' +
    '<path d="M50 22 L50 92" stroke="' + INK + '" stroke-width="3"/><path d="M32 12 L50 30 L68 12" fill="#2563eb" ' + ST2 + '/>' +
    '<rect x="31" y="66" width="12" height="14" rx="2" fill="#2563eb" ' + ST2 + '/><rect x="57" y="66" width="12" height="14" rx="2" fill="#2563eb" ' + ST2 + '/>' +
    '<circle cx="50" cy="46" r="2.6" fill="#facc15"/><circle cx="50" cy="60" r="2.6" fill="#facc15"/>');

  art.def('cube', (o) => {
    const c = art.color(o.color, '#60a5fa');
    return '<path d="M50 10 L88 30 L50 50 L12 30Z" fill="' + c + '" ' + ST + '/>' +
      '<path d="M50 10 L88 30 L50 50 L12 30Z" fill="#fff" opacity=".3"/>' +
      '<path d="M12 30 L50 50 L50 92 L12 70Z" fill="' + c + '" ' + ST + '/>' +
      '<path d="M50 50 L88 30 L88 70 L50 92Z" fill="' + c + '" ' + ST + '/><path d="M50 50 L88 30 L88 70 L50 92Z" fill="#000" opacity=".16"/>';
  });

  art.def('cup', () =>
    '<path d="M74 36 Q96 36 92 56 Q88 72 68 70" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/><path d="M74 36 Q96 36 92 56 Q88 72 68 70" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round"/>' +
    '<path d="M16 22 L76 22 L70 82 Q68 92 58 92 L34 92 Q24 92 22 82Z" fill="#fff" ' + ST + '/>' +
    '<path d="M18 38 L74 38 L72 56 L20 56Z" fill="#60a5fa"/><ellipse cx="46" cy="22" rx="30" ry="6" fill="#e0f2fe" ' + ST2 + '/>');

  art.def('crayon', (o) => {
    const c = art.color(o.color, '#ef4444');
    return '<g transform="rotate(30 50 50)"><rect x="34" y="28" width="32" height="64" rx="4" fill="' + c + '" ' + ST + '/>' +
      '<rect x="34" y="44" width="32" height="30" fill="#fff" opacity=".9"/><rect x="34" y="44" width="32" height="6" fill="' + c + '"/><rect x="34" y="68" width="32" height="6" fill="' + c + '"/>' +
      '<path d="M34 28 L66 28 L50 4Z" fill="' + c + '" ' + ST + '/><rect x="34" y="44" width="32" height="30" fill="none" ' + ST2 + '/></g>';
  });

  art.def('drum', () =>
    '<path d="M30 6 L62 36 M72 6 L40 36" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/><path d="M30 6 L62 36 M72 6 L40 36" stroke="#fde68a" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M12 40 L12 76 Q12 90 50 90 Q88 90 88 76 L88 40Z" fill="#ef4444" ' + ST + '/>' +
    '<path d="M12 44 L26 78 L38 46 L50 80 L62 46 L74 78 L88 44" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>' +
    '<ellipse cx="50" cy="40" rx="38" ry="12" fill="#fef3c7" ' + ST + '/>');

  art.def('hat', () =>
    '<path d="M24 62 C22 20 78 20 76 62Z" fill="#fbbf24" ' + ST + '/>' +
    '<path d="M24 56 L76 56 L76 64 L24 64Z" fill="#ef4444" ' + ST2 + '/>' +
    '<ellipse cx="50" cy="66" rx="46" ry="13" fill="#fbbf24" ' + ST + '/>' +
    '<path d="M36 34 Q40 28 48 27" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/>');

  art.def('house', () =>
    '<rect x="64" y="14" width="12" height="26" fill="#b45309" ' + ST + '/>' +
    '<rect x="20" y="46" width="60" height="44" fill="#fde68a" ' + ST + '/>' +
    '<path d="M10 50 L50 12 L90 50Z" fill="#ef4444" ' + ST + '/>' +
    '<rect x="43" y="62" width="16" height="28" rx="2" fill="#92400e" ' + ST2 + '/><circle cx="55" cy="77" r="1.6" fill="#facc15"/>' +
    '<rect x="26" y="56" width="12" height="12" fill="#bae6fd" ' + ST2 + '/><rect x="64" y="56" width="12" height="12" fill="#bae6fd" ' + ST2 + '/>');

  art.def('key', () =>
    '<circle cx="28" cy="30" r="17" fill="none" stroke="' + INK + '" stroke-width="16" /><circle cx="28" cy="30" r="17" fill="none" stroke="#facc15" stroke-width="9"/>' +
    '<path d="M40 42 L88 90" stroke="' + INK + '" stroke-width="14" stroke-linecap="round"/><path d="M40 42 L88 90" stroke="#facc15" stroke-width="7.5" stroke-linecap="round"/>' +
    '<path d="M70 72 L80 62 M80 82 L90 72" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/><path d="M70 72 L80 62 M80 82 L90 72" stroke="#facc15" stroke-width="5.5" stroke-linecap="round"/>');

  art.def('kite', () =>
    '<path d="M50 80 Q40 88 50 92 Q60 96 50 100" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M50 4 L82 40 L50 78 L18 40Z" fill="#ef4444" ' + ST + '/>' +
    '<path d="M50 4 L82 40 L50 40Z" fill="#facc15"/><path d="M50 78 L18 40 L50 40Z" fill="#facc15"/>' +
    '<path d="M50 4 L50 78 M18 40 L82 40" stroke="' + INK + '" stroke-width="2.4"/><path d="M50 4 L82 40 L50 78 L18 40Z" fill="none" ' + ST + '/>' +
    '<path d="M44 86 L50 82 L56 86Z M44 94 L50 90 L56 94Z" fill="#3b82f6" ' + ST2 + '/>');

  art.def('pen', () =>
    '<g transform="rotate(-45 50 50)"><rect x="39" y="6" width="22" height="62" rx="6" fill="#3b82f6" ' + ST + '/>' +
    '<rect x="39" y="6" width="22" height="16" rx="6" fill="#1d4ed8" ' + ST2 + '/><rect x="56" y="10" width="3" height="26" rx="1.5" fill="#fff" opacity=".75"/>' +
    '<path d="M42 68 L58 68 L50 94Z" fill="#e2e8f0" ' + ST + '/><path d="M50 82 L50 94" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/></g>');

  art.def('pencil', () =>
    '<g transform="rotate(-45 50 50)"><rect x="38" y="14" width="24" height="12" rx="4" fill="#f9a8d4" ' + ST + '/><rect x="38" y="26" width="24" height="7" fill="#cbd5e1" ' + ST2 + '/>' +
    '<rect x="38" y="33" width="24" height="40" fill="#facc15" ' + ST + '/><path d="M46 33 L46 73 M54 33 L54 73" stroke="#f59e0b" stroke-width="2"/>' +
    '<path d="M38 73 L62 73 L50 96Z" fill="#fcd9a8" ' + ST + '/><path d="M46 88 L54 88 L50 96Z" fill="' + INK + '"/></g>');

  art.def('ribbon', (o) => {
    const c = art.color(o.color, '#ef4444');
    return '<path d="M50 52 L22 84 L34 88 L50 66 L66 88 L78 84Z" fill="' + c + '" ' + ST + '/>' +
      '<path d="M50 52 C34 28 8 30 12 46 C16 60 36 56 50 52Z" fill="' + c + '" ' + ST + '/><path d="M50 52 C66 28 92 30 88 46 C84 60 64 56 50 52Z" fill="' + c + '" ' + ST + '/>' +
      '<circle cx="50" cy="52" r="8" fill="' + c + '" ' + ST + '/>';
  });

  art.def('ribbon-roll', (o) => {
    const c = art.color(o.color, '#ef4444');
    return '<path d="M52 82 C52 94 84 96 96 88 L96 98 C74 102 40 100 40 84Z" fill="' + c + '" ' + ST + '/>' +
      '<circle cx="46" cy="46" r="38" fill="' + c + '" ' + ST + '/>' +
      '<circle cx="46" cy="46" r="26" fill="none" stroke="#fff" stroke-width="3" opacity=".55"/><circle cx="46" cy="46" r="15" fill="none" stroke="#fff" stroke-width="3" opacity=".55"/>' +
      '<circle cx="46" cy="46" r="8" fill="#fff" ' + ST2 + '/>';
  });

  art.def('ruler', () => {
    let t = '';
    for (let i = 0; i <= 10; i++) {
      const x = 12 + i * 7.6;
      t += '<line x1="' + x.toFixed(1) + '" y1="32" x2="' + x.toFixed(1) + '" y2="' + (i % 5 === 0 ? 52 : 44) + '" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
    }
    return '<rect x="6" y="30" width="88" height="42" rx="5" fill="#fde047" ' + ST + '/>' + t +
      '<text x="12" y="66" font-size="12" font-family="Arial,sans-serif" font-weight="700" fill="' + INK + '">0</text><text x="78" y="66" font-size="11" font-family="Arial,sans-serif" font-weight="700" fill="' + INK + '">10</text>';
  });

  art.def('scale', () =>
    '<path d="M32 94 L68 94 L60 84 L40 84Z" fill="#64748b" ' + ST + '/><rect x="46.5" y="26" width="7" height="60" rx="3" fill="#94a3b8" ' + ST2 + '/>' +
    '<rect x="10" y="22" width="80" height="7" rx="3.5" fill="#64748b" ' + ST2 + '/><circle cx="50" cy="20" r="6" fill="#facc15" ' + ST2 + '/>' +
    '<path d="M16 28 L6 60 M16 28 L26 60 M84 28 L74 60 M84 28 L94 60" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M2 60 L30 60 Q30 74 16 74 Q2 74 2 60Z" fill="#60a5fa" ' + ST2 + '/><path d="M70 60 L98 60 Q98 74 84 74 Q70 74 70 60Z" fill="#60a5fa" ' + ST2 + '/>');

  art.def('scissors', () =>
    '<path d="M36 62 L66 4 L74 10 L50 58Z" fill="#cbd5e1" ' + ST + '/><path d="M64 62 L34 4 L26 10 L50 58Z" fill="#e2e8f0" ' + ST + '/>' +
    '<circle cx="28" cy="78" r="13" fill="none" stroke="' + INK + '" stroke-width="13"/><circle cx="28" cy="78" r="13" fill="none" stroke="#ef4444" stroke-width="7"/>' +
    '<circle cx="72" cy="78" r="13" fill="none" stroke="' + INK + '" stroke-width="13"/><circle cx="72" cy="78" r="13" fill="none" stroke="#ef4444" stroke-width="7"/>' +
    '<circle cx="50" cy="56" r="4" fill="#475569" ' + ST2 + '/>');

  art.def('shoe', () =>
    '<path d="M8 80 L8 48 Q8 42 16 42 L34 42 Q38 54 52 56 L84 62 Q96 66 96 80Z" fill="#3b82f6" ' + ST + '/>' +
    '<path d="M6 78 L96 78 L96 90 L6 90Z" fill="#fff" ' + ST + '/>' +
    '<path d="M40 50 L48 44 M48 56 L56 50 M56 60 L64 54" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M16 62 Q24 66 32 62" fill="none" stroke="#bfdbfe" stroke-width="3" stroke-linecap="round"/>');

  art.def('sock', () =>
    '<path d="M32 8 L68 8 L68 50 L90 62 Q100 70 92 84 L42 84 Q30 82 32 66Z" fill="#ef4444" ' + ST + '/>' +
    '<rect x="32" y="8" width="36" height="14" fill="#fff" ' + ST + '/><path d="M32 34 L68 34 M32 42 L68 42" stroke="#fff" stroke-width="4"/>' +
    '<path d="M72 74 Q84 70 92 80 L72 84Z" fill="#fff" opacity=".9"/>');

  art.def('stopsign', () => {
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (22.5 + i * 45) * Math.PI / 180;
      pts.push((50 + 46 * Math.cos(a)).toFixed(1) + ' ' + (50 + 46 * Math.sin(a)).toFixed(1));
    }
    return '<rect x="46" y="86" width="8" height="14" fill="#94a3b8" ' + ST2 + '/>' +
      '<polygon points="' + pts.join(' ') + '" fill="#ef4444" ' + ST + '/>' +
      '<polygon points="' + pts.map((p) => p.split(' ').map((v) => (50 + (v - 50) * 0.86).toFixed(1)).join(' ')).join(' ') + '" fill="none" stroke="#fff" stroke-width="2.6"/>' +
      '<text x="50" y="58" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="23" fill="#fff">STOP</text>';
  });

  art.def('table', () =>
    '<rect x="14" y="48" width="12" height="46" rx="3" fill="#a16207" ' + ST + '/><rect x="74" y="48" width="12" height="46" rx="3" fill="#a16207" ' + ST + '/>' +
    '<rect x="6" y="34" width="88" height="15" rx="4" fill="#ca8a04" ' + ST + '/><path d="M12 40 L88 40" stroke="#fde68a" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>');

  art.def('umbrella', () =>
    '<path d="M50 50 L50 82 Q50 95 38 92" fill="none" stroke="' + INK + '" stroke-width="8" stroke-linecap="round"/><path d="M50 50 L50 82 Q50 95 38 92" fill="none" stroke="#92400e" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M6 52 C6 14 94 14 94 52 Q86 42 78 52 Q70 42 62 52 Q56 42 50 52 Q44 42 38 52 Q30 42 22 52 Q14 42 6 52Z" fill="#ef4444" ' + ST + '/>' +
    '<path d="M50 52 Q40 30 30 20 M50 52 Q60 30 70 20 M50 52 L50 16" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M30 20 Q50 8 70 20 Q60 30 50 30 Q40 30 30 20Z" fill="#fff" opacity=".35"/><circle cx="50" cy="12" r="3" fill="' + INK + '"/>');
})(typeof window !== 'undefined' ? window : globalThis);
