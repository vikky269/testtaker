/* Animal illustrations (original SVG, 100 x 100). */
(function (root) {
  const art = root.VA.art;
  const { ST, ST2, INK } = art;
  const eye = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3.4) + '" fill="' + INK + '"/><circle cx="' + (x + 1) + '" cy="' + (y - 1.2) + '" r="1.1" fill="#fff"/>';

  art.def('cat', () =>
    '<path d="M72 86 C96 88 98 62 84 56" fill="none" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M72 86 C96 88 98 62 84 56" fill="none" stroke="#fb923c" stroke-width="6" stroke-linecap="round"/>' +
    '<ellipse cx="50" cy="78" rx="25" ry="18" fill="#fb923c" ' + ST + '/>' +
    '<ellipse cx="50" cy="82" rx="12" ry="11" fill="#fff7ed"/>' +
    '<path d="M28 34 L29 8 L47 22Z" fill="#fb923c" ' + ST + '/><path d="M72 34 L71 8 L53 22Z" fill="#fb923c" ' + ST + '/>' +
    '<path d="M32 25 L33 15 L41 21Z" fill="#fbcfe8"/><path d="M68 25 L67 15 L59 21Z" fill="#fbcfe8"/>' +
    '<circle cx="50" cy="44" r="26" fill="#fb923c" ' + ST + '/>' +
    '<path d="M44 22 L44 29 M50 21 L50 29 M56 22 L56 29" stroke="#c2410c" stroke-width="3" stroke-linecap="round"/>' +
    eye(40, 42, 3.6) + eye(60, 42, 3.6) +
    '<path d="M46 50 L54 50 L50 55Z" fill="#f472b6" ' + ST2 + '/>' +
    '<path d="M50 55 L50 58 M50 58 Q45 63 40 59 M50 58 Q55 63 60 59" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M32 52 L16 49 M32 56 L16 58 M68 52 L84 49 M68 56 L84 58" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>');

  art.def('dog', () =>
    '<ellipse cx="50" cy="80" rx="23" ry="17" fill="#d6a36a" ' + ST + '/>' +
    '<ellipse cx="50" cy="84" rx="11" ry="10" fill="#f3e0c2"/>' +
    '<path d="M72 80 C84 76 90 66 86 58" fill="none" stroke="' + INK + '" stroke-width="10" stroke-linecap="round"/><path d="M72 80 C84 76 90 66 86 58" fill="none" stroke="#d6a36a" stroke-width="5" stroke-linecap="round"/>' +
    '<ellipse cx="24" cy="42" rx="11" ry="20" fill="#8b5a2b" ' + ST + ' transform="rotate(12 24 42)"/>' +
    '<ellipse cx="76" cy="42" rx="11" ry="20" fill="#8b5a2b" ' + ST + ' transform="rotate(-12 76 42)"/>' +
    '<circle cx="50" cy="42" r="25" fill="#d6a36a" ' + ST + '/>' +
    '<ellipse cx="50" cy="52" rx="14" ry="11" fill="#f3e0c2" ' + ST2 + '/>' +
    eye(40, 38, 3.6) + eye(60, 38, 3.6) +
    '<ellipse cx="50" cy="47" rx="5.5" ry="4" fill="' + INK + '"/>' +
    '<path d="M50 51 L50 55 M50 55 Q45 60 41 56 M50 55 Q55 60 59 56" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M46 58 Q50 70 54 58Z" fill="#fb7185" ' + ST2 + '/>');

  art.def('pig', () =>
    '<path d="M24 34 L18 12 L40 24Z" fill="#f9a8d4" ' + ST + '/><path d="M76 34 L82 12 L60 24Z" fill="#f9a8d4" ' + ST + '/>' +
    '<ellipse cx="50" cy="56" rx="34" ry="32" fill="#f9a8d4" ' + ST + '/>' +
    eye(37, 46, 3.8) + eye(63, 46, 3.8) +
    '<ellipse cx="50" cy="64" rx="15" ry="11" fill="#f472b6" ' + ST + '/>' +
    '<ellipse cx="45" cy="64" rx="2.6" ry="4" fill="#9d174d"/><ellipse cx="55" cy="64" rx="2.6" ry="4" fill="#9d174d"/>');

  art.def('cow', () =>
    '<path d="M24 30 L16 14 M76 30 L84 14" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/><path d="M24 30 L16 14 M76 30 L84 14" stroke="#fef3c7" stroke-width="4" stroke-linecap="round"/>' +
    '<ellipse cx="14" cy="42" rx="12" ry="8" fill="#f1f5f9" ' + ST + ' transform="rotate(-20 14 42)"/><ellipse cx="86" cy="42" rx="12" ry="8" fill="#f1f5f9" ' + ST + ' transform="rotate(20 86 42)"/>' +
    '<ellipse cx="50" cy="48" rx="28" ry="32" fill="#f8fafc" ' + ST + '/>' +
    '<path d="M32 22 Q44 14 52 24 Q50 40 38 40 Q28 36 32 22Z" fill="#1f2937"/>' +
    '<ellipse cx="50" cy="72" rx="22" ry="16" fill="#fbcfe8" ' + ST + '/>' +
    '<ellipse cx="42" cy="72" rx="3" ry="4.5" fill="#9d174d"/><ellipse cx="58" cy="72" rx="3" ry="4.5" fill="#9d174d"/>' +
    eye(38, 46, 3.4) + eye(62, 46, 3.4));

  art.def('hen', () =>
    '<path d="M26 56 L8 44 L14 62 L6 70 L28 68Z" fill="#fdba74" ' + ST + '/>' +
    '<ellipse cx="44" cy="60" rx="28" ry="22" fill="#fff7ed" ' + ST + '/>' +
    '<path d="M34 58 Q50 50 62 62 Q52 76 36 70Z" fill="#fdba74" ' + ST2 + '/>' +
    '<circle cx="68" cy="34" r="15" fill="#fff7ed" ' + ST + '/>' +
    '<path d="M60 22 Q62 12 66 20 Q70 10 74 20 Q80 14 78 26Z" fill="#ef4444" ' + ST2 + '/>' +
    '<path d="M82 32 L96 37 L82 42Z" fill="#facc15" ' + ST2 + '/>' +
    '<path d="M80 44 Q84 54 78 54 Q74 50 76 44Z" fill="#ef4444" ' + ST2 + '/>' + eye(72, 31, 3) +
    '<path d="M38 82 L38 94 M32 94 L44 94 M52 82 L52 94 M46 94 L58 94" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>');

  art.def('duck', () =>
    '<path d="M18 62 L4 52 L10 68 Z" fill="#facc15" ' + ST + '/>' +
    '<ellipse cx="46" cy="66" rx="30" ry="21" fill="#facc15" ' + ST + '/>' +
    '<path d="M32 64 Q46 56 58 68 Q48 80 34 74Z" fill="#fbbf24" ' + ST2 + '/>' +
    '<circle cx="68" cy="36" r="17" fill="#facc15" ' + ST + '/>' +
    '<ellipse cx="86" cy="42" rx="11" ry="6" fill="#fb923c" ' + ST + '/>' + eye(70, 32, 3.2) +
    '<path d="M40 86 L40 94 M34 94 L46 94 M56 86 L56 94 M50 94 L62 94" stroke="#fb923c" stroke-width="3.5" stroke-linecap="round"/>');

  art.def('bird', () =>
    '<path d="M20 58 L2 50 L6 66 Z" fill="#2563eb" ' + ST + '/>' +
    '<ellipse cx="48" cy="58" rx="28" ry="22" fill="#3b82f6" ' + ST + '/>' +
    '<ellipse cx="50" cy="66" rx="16" ry="12" fill="#bfdbfe"/>' +
    '<path d="M30 52 Q48 40 62 56 Q50 72 32 64Z" fill="#2563eb" ' + ST2 + '/>' +
    '<circle cx="70" cy="36" r="15" fill="#3b82f6" ' + ST + '/>' +
    '<path d="M82 34 L97 39 L82 44Z" fill="#facc15" ' + ST2 + '/>' + eye(72, 33, 3.2) +
    '<path d="M42 80 L42 92 M36 92 L48 92 M56 80 L56 92 M50 92 L62 92" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>');

  art.def('fish', () =>
    '<path d="M24 50 L4 32 L4 68Z" fill="#fb923c" ' + ST + '/>' +
    '<path d="M44 32 L52 16 L64 32Z" fill="#f97316" ' + ST2 + '/>' +
    '<ellipse cx="52" cy="50" rx="32" ry="21" fill="#fb923c" ' + ST + '/>' +
    '<path d="M44 32 Q40 50 44 68 M58 30 Q54 50 58 70" fill="none" stroke="#fff7ed" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M50 58 Q62 70 70 60Z" fill="#f97316" ' + ST2 + '/>' + eye(72, 44, 3.8) +
    '<path d="M82 54 Q86 58 80 60" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>');

  art.def('frog', () =>
    '<ellipse cx="22" cy="82" rx="14" ry="8" fill="#22c55e" ' + ST + '/><ellipse cx="78" cy="82" rx="14" ry="8" fill="#22c55e" ' + ST + '/>' +
    '<ellipse cx="50" cy="66" rx="32" ry="24" fill="#4ade80" ' + ST + '/>' +
    '<ellipse cx="50" cy="74" rx="18" ry="12" fill="#dcfce7"/>' +
    '<circle cx="33" cy="38" r="13" fill="#4ade80" ' + ST + '/><circle cx="67" cy="38" r="13" fill="#4ade80" ' + ST + '/>' +
    '<circle cx="33" cy="38" r="8" fill="#fff"/><circle cx="67" cy="38" r="8" fill="#fff"/>' +
    '<circle cx="34" cy="39" r="4.4" fill="' + INK + '"/><circle cx="66" cy="39" r="4.4" fill="' + INK + '"/>' +
    '<path d="M30 60 Q50 74 70 60" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="46" cy="53" r="1.6" fill="' + INK + '"/><circle cx="54" cy="53" r="1.6" fill="' + INK + '"/>');

  art.def('bee', () =>
    '<ellipse cx="34" cy="30" rx="16" ry="11" fill="#e0f2fe" ' + ST + ' transform="rotate(-25 34 30)"/><ellipse cx="62" cy="26" rx="16" ry="11" fill="#e0f2fe" ' + ST + ' transform="rotate(20 62 26)"/>' +
    '<path d="M30 20 L24 10 M60 14 L66 6" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<ellipse cx="48" cy="58" rx="30" ry="22" fill="#facc15" ' + ST + '/>' +
    '<path d="M38 38 Q34 58 38 78 M52 36 Q48 58 52 80 M66 40 Q62 58 66 76" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
    '<circle cx="80" cy="56" r="13" fill="#facc15" ' + ST + '/>' + eye(84, 53, 2.8) +
    '<path d="M88 46 Q94 38 98 40 M84 44 Q86 34 92 32" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M18 58 L8 58" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>');

  art.def('butterfly', (o) => {
    const a = art.color(o.color, '#a855f7'), c = '#f472b6';
    return '<ellipse cx="28" cy="34" rx="22" ry="20" fill="' + a + '" ' + ST + ' transform="rotate(-20 28 34)"/><ellipse cx="72" cy="34" rx="22" ry="20" fill="' + a + '" ' + ST + ' transform="rotate(20 72 34)"/>' +
      '<ellipse cx="32" cy="68" rx="15" ry="14" fill="' + c + '" ' + ST + ' transform="rotate(20 32 68)"/><ellipse cx="68" cy="68" rx="15" ry="14" fill="' + c + '" ' + ST + ' transform="rotate(-20 68 68)"/>' +
      '<circle cx="26" cy="32" r="6" fill="#fff" opacity=".8"/><circle cx="74" cy="32" r="6" fill="#fff" opacity=".8"/>' +
      '<ellipse cx="50" cy="52" rx="6" ry="26" fill="#374151" ' + ST + '/>' +
      '<path d="M48 28 Q40 14 34 12 M52 28 Q60 14 66 12" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
  });

  art.def('bug', () => // ladybird
    '<path d="M36 22 Q30 10 24 10 M64 22 Q70 10 76 10" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M32 30 A20 16 0 0 1 68 30 Z" fill="#1f2937" ' + ST + '/>' +
    '<circle cx="50" cy="60" r="34" fill="#ef4444" ' + ST + '/>' +
    '<path d="M50 28 L50 94" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="34" cy="52" r="6.5" fill="#1f2937"/><circle cx="66" cy="52" r="6.5" fill="#1f2937"/><circle cx="36" cy="74" r="5.5" fill="#1f2937"/><circle cx="64" cy="74" r="5.5" fill="#1f2937"/>' +
    '<circle cx="42" cy="26" r="2.2" fill="#fff"/><circle cx="58" cy="26" r="2.2" fill="#fff"/>');

  art.def('rabbit', () =>
    '<ellipse cx="50" cy="84" rx="25" ry="14" fill="#f1f5f9" ' + ST + '/>' +
    '<ellipse cx="36" cy="26" rx="9" ry="20" fill="#f1f5f9" ' + ST + ' transform="rotate(-8 36 26)"/><ellipse cx="64" cy="26" rx="9" ry="20" fill="#f1f5f9" ' + ST + ' transform="rotate(8 64 26)"/>' +
    '<ellipse cx="36" cy="26" rx="4" ry="14" fill="#fbcfe8" transform="rotate(-8 36 26)"/><ellipse cx="64" cy="26" rx="4" ry="14" fill="#fbcfe8" transform="rotate(8 64 26)"/>' +
    '<circle cx="50" cy="56" r="25" fill="#f1f5f9" ' + ST + '/>' + eye(41, 52, 3.4) + eye(59, 52, 3.4) +
    '<path d="M46 60 L54 60 L50 65Z" fill="#f472b6" ' + ST2 + '/>' +
    '<path d="M50 65 L50 68 M50 68 Q45 72 41 68 M50 68 Q55 72 59 68" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
    '<rect x="47" y="69" width="6" height="7" rx="1.5" fill="#fff" ' + ST2 + '/>');

  art.def('elephant', () =>
    '<path d="M86 52 Q96 56 92 66" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="26" y="70" width="14" height="24" rx="5" fill="#94a3b8" ' + ST + '/><rect x="62" y="70" width="14" height="24" rx="5" fill="#94a3b8" ' + ST + '/>' +
    '<ellipse cx="58" cy="54" rx="32" ry="24" fill="#a8b5c7" ' + ST + '/>' +
    '<circle cx="30" cy="42" r="20" fill="#a8b5c7" ' + ST + '/>' +
    '<ellipse cx="42" cy="38" rx="12" ry="17" fill="#94a3b8" ' + ST + '/>' +
    '<path d="M18 52 Q6 62 10 78 Q14 86 20 80 Q16 70 24 62" fill="#a8b5c7" ' + ST + '/>' +
    eye(24, 36, 3.2) + '<path d="M22 56 L14 70" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round" opacity=".7"/>');

  art.def('mouse', () =>
    '<path d="M72 84 C94 88 98 66 88 56" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/><path d="M72 84 C94 88 98 66 88 56" fill="none" stroke="#f9a8d4" stroke-width="3.4" stroke-linecap="round"/>' +
    '<ellipse cx="50" cy="74" rx="24" ry="19" fill="#cbd5e1" ' + ST + '/><ellipse cx="50" cy="78" rx="12" ry="12" fill="#f1f5f9"/>' +
    '<circle cx="30" cy="26" r="13" fill="#cbd5e1" ' + ST + '/><circle cx="70" cy="26" r="13" fill="#cbd5e1" ' + ST + '/>' +
    '<circle cx="30" cy="26" r="7" fill="#fbcfe8"/><circle cx="70" cy="26" r="7" fill="#fbcfe8"/>' +
    '<ellipse cx="50" cy="46" rx="22" ry="20" fill="#cbd5e1" ' + ST + '/>' + eye(41, 42, 3.2) + eye(59, 42, 3.2) +
    '<circle cx="50" cy="52" r="3.6" fill="#f472b6" ' + ST2 + '/>' +
    '<path d="M36 52 L20 48 M36 56 L20 60 M64 52 L80 48 M64 56 L80 60" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round"/>');

  art.def('monkey', () =>
    '<circle cx="22" cy="46" r="11" fill="#a16207" ' + ST + '/><circle cx="78" cy="46" r="11" fill="#a16207" ' + ST + '/><circle cx="22" cy="46" r="5.5" fill="#fcd9a8"/><circle cx="78" cy="46" r="5.5" fill="#fcd9a8"/>' +
    '<ellipse cx="50" cy="85" rx="22" ry="12" fill="#a16207" ' + ST + '/>' +
    '<circle cx="50" cy="46" r="27" fill="#a16207" ' + ST + '/>' +
    '<path d="M30 40 Q36 30 50 38 Q64 30 70 40 Q76 60 62 70 Q50 76 38 70 Q24 60 30 40Z" fill="#fcd9a8" ' + ST2 + '/>' +
    eye(41, 46, 3.2) + eye(59, 46, 3.2) +
    '<ellipse cx="46" cy="58" rx="1.8" ry="2.4" fill="' + INK + '"/><ellipse cx="54" cy="58" rx="1.8" ry="2.4" fill="' + INK + '"/>' +
    '<path d="M42 65 Q50 72 58 65" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>');

  art.def('penguin', () =>
    '<path d="M18 56 Q6 70 16 82 Q24 74 24 62Z" fill="#1f2937" ' + ST + '/><path d="M82 56 Q94 70 84 82 Q76 74 76 62Z" fill="#1f2937" ' + ST + '/>' +
    '<ellipse cx="50" cy="52" rx="29" ry="40" fill="#1f2937" ' + ST + '/>' +
    '<ellipse cx="50" cy="62" rx="19" ry="28" fill="#f8fafc"/>' +
    '<ellipse cx="41" cy="30" rx="8" ry="10" fill="#f8fafc"/><ellipse cx="59" cy="30" rx="8" ry="10" fill="#f8fafc"/>' +
    eye(41, 31, 3) + eye(59, 31, 3) +
    '<path d="M42 40 L58 40 L50 50Z" fill="#fb923c" ' + ST2 + '/>' +
    '<ellipse cx="38" cy="92" rx="12" ry="5" fill="#fb923c" ' + ST2 + '/><ellipse cx="62" cy="92" rx="12" ry="5" fill="#fb923c" ' + ST2 + '/>');

  art.def('chick', () =>
    '<ellipse cx="50" cy="68" rx="29" ry="24" fill="#fde047" ' + ST + '/>' +
    '<circle cx="50" cy="36" r="19" fill="#fde047" ' + ST + '/>' +
    '<path d="M42 18 Q44 8 48 16 M52 16 Q56 6 58 18" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M42 40 L58 40 L50 48Z" fill="#fb923c" ' + ST2 + '/>' + eye(42, 33, 2.8) + eye(58, 33, 2.8) +
    '<path d="M22 66 Q16 76 28 80Z" fill="#fbbf24" ' + ST2 + '/><path d="M78 66 Q84 76 72 80Z" fill="#fbbf24" ' + ST2 + '/>' +
    '<path d="M42 90 L42 96 M36 96 L48 96 M58 90 L58 96 M52 96 L64 96" stroke="#fb923c" stroke-width="3" stroke-linecap="round"/>');

  art.def('snake', () =>
    '<path d="M12 78 C12 56 40 70 50 58 C60 46 34 40 46 28 C54 20 74 24 80 26" fill="none" stroke="' + INK + '" stroke-width="20" stroke-linecap="round"/>' +
    '<path d="M12 78 C12 56 40 70 50 58 C60 46 34 40 46 28 C54 20 74 24 80 26" fill="none" stroke="#22c55e" stroke-width="14" stroke-linecap="round"/>' +
    '<path d="M12 78 C12 56 40 70 50 58 C60 46 34 40 46 28" fill="none" stroke="#bbf7d0" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/>' +
    '<ellipse cx="84" cy="27" rx="13" ry="10" fill="#22c55e" ' + ST + '/>' + eye(84, 23, 2.8) +
    '<path d="M96 28 L99 28 M99 28 L100 25 M99 28 L100 31" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>');

  art.def('fox', () =>
    '<path d="M16 26 L22 4 L44 24Z" fill="#fb923c" ' + ST + '/><path d="M84 26 L78 4 L56 24Z" fill="#fb923c" ' + ST + '/>' +
    '<path d="M22 14 L28 8 L34 20Z" fill="#1f2937"/><path d="M78 14 L72 8 L66 20Z" fill="#1f2937"/>' +
    '<path d="M50 90 L8 50 Q6 28 20 24 L50 36 L80 24 Q94 28 92 50Z" fill="#fb923c" ' + ST + '/>' +
    '<path d="M50 90 L22 54 Q40 54 50 62 Q60 54 78 54Z" fill="#fff7ed" ' + ST2 + '/>' +
    eye(35, 44, 3.4) + eye(65, 44, 3.4) + '<ellipse cx="50" cy="86" rx="5.5" ry="4" fill="' + INK + '"/>');

  art.def('bear', () =>
    '<ellipse cx="50" cy="90" rx="24" ry="12" fill="#a16207" ' + ST + '/>' +
    '<circle cx="24" cy="26" r="13" fill="#a16207" ' + ST + '/><circle cx="76" cy="26" r="13" fill="#a16207" ' + ST + '/><circle cx="24" cy="26" r="6.5" fill="#fcd9a8"/><circle cx="76" cy="26" r="6.5" fill="#fcd9a8"/>' +
    '<circle cx="50" cy="52" r="30" fill="#a16207" ' + ST + '/>' +
    '<ellipse cx="50" cy="62" rx="15" ry="12" fill="#fcd9a8" ' + ST2 + '/>' +
    eye(38, 46, 3.4) + eye(62, 46, 3.4) + '<ellipse cx="50" cy="58" rx="5" ry="3.8" fill="' + INK + '"/>' +
    '<path d="M50 62 L50 66 M50 66 Q45 71 41 67 M50 66 Q55 71 59 67" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>');
})(typeof window !== 'undefined' ? window : globalThis);
