/* People and vehicles (original SVG, 100 x 100). */
(function (root) {
  const art = root.VA.art;
  const { ST, ST2, INK } = art;

  function kid(o, girl) {
    const shirt = art.color(o.color, girl ? '#f472b6' : '#3b82f6');
    const hair = girl ? '#7c2d12' : '#5b3a1a';
    return '<rect x="34" y="76" width="12" height="20" rx="4" fill="#475569" ' + ST2 + '/><rect x="54" y="76" width="12" height="20" rx="4" fill="#475569" ' + ST2 + '/>' +
      '<path d="M26 82 L26 56 Q26 46 38 46 L62 46 Q74 46 74 56 L74 82Z" fill="' + shirt + '" ' + ST + '/>' +
      (girl ? '<path d="M26 82 L74 82 L80 70 L20 70Z" fill="' + shirt + '" ' + ST + '/>' : '') +
      '<rect x="44" y="38" width="12" height="10" fill="#fcd9b6" ' + ST2 + '/>' +
      '<circle cx="50" cy="26" r="20" fill="#fcd9b6" ' + ST + '/>' +
      (girl ? '<path d="M30 28 Q28 4 50 6 Q72 4 70 28 Q60 14 50 16 Q40 14 30 28Z" fill="' + hair + '" ' + ST + '/><circle cx="26" cy="32" r="7" fill="' + hair + '" ' + ST2 + '/><circle cx="74" cy="32" r="7" fill="' + hair + '" ' + ST2 + '/>'
             : '<path d="M30 24 Q30 6 50 6 Q70 6 70 24 Q58 14 50 18 Q42 14 30 24Z" fill="' + hair + '" ' + ST + '/>') +
      '<circle cx="42" cy="28" r="2.6" fill="' + INK + '"/><circle cx="58" cy="28" r="2.6" fill="' + INK + '"/>' +
      '<path d="M43 35 Q50 41 57 35" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
  }
  art.def('boy', (o) => kid(o, false));
  art.def('girl', (o) => kid(o, true));

  art.def('car', (o) => {
    const c = art.color(o.color, '#ef4444');
    return '<path d="M6 66 L6 54 Q6 48 14 46 L30 44 L40 28 Q43 24 50 24 L68 24 Q74 24 78 30 L86 44 Q96 46 96 56 L96 66Z" fill="' + c + '" ' + ST + '/>' +
      '<path d="M43 32 L36 44 L52 44 L52 30Z" fill="#bae6fd" ' + ST2 + '/><path d="M58 30 L58 44 L82 44 L74 31Z" fill="#bae6fd" ' + ST2 + '/>' +
      '<circle cx="28" cy="68" r="11" fill="' + INK + '"/><circle cx="28" cy="68" r="4.5" fill="#cbd5e1"/>' +
      '<circle cx="76" cy="68" r="11" fill="' + INK + '"/><circle cx="76" cy="68" r="4.5" fill="#cbd5e1"/>';
  });

  art.def('bus', () =>
    '<rect x="4" y="22" width="92" height="52" rx="8" fill="#facc15" ' + ST + '/>' +
    '<rect x="10" y="30" width="16" height="16" rx="2" fill="#bae6fd" ' + ST2 + '/><rect x="32" y="30" width="16" height="16" rx="2" fill="#bae6fd" ' + ST2 + '/><rect x="54" y="30" width="16" height="16" rx="2" fill="#bae6fd" ' + ST2 + '/><rect x="76" y="30" width="14" height="22" rx="2" fill="#bae6fd" ' + ST2 + '/>' +
    '<path d="M4 58 L96 58" stroke="' + INK + '" stroke-width="2.4"/>' +
    '<circle cx="26" cy="76" r="10" fill="' + INK + '"/><circle cx="26" cy="76" r="4" fill="#cbd5e1"/><circle cx="74" cy="76" r="10" fill="' + INK + '"/><circle cx="74" cy="76" r="4" fill="#cbd5e1"/>');

  art.def('door', () =>
    '<rect x="22" y="6" width="56" height="90" rx="4" fill="#b45309" ' + ST + '/>' +
    '<rect x="30" y="14" width="40" height="30" rx="2" fill="#d97706" ' + ST2 + '/><rect x="30" y="52" width="40" height="36" rx="2" fill="#d97706" ' + ST2 + '/>' +
    '<circle cx="66" cy="54" r="4" fill="#facc15" ' + ST2 + '/>');
})(typeof window !== 'undefined' ? window : globalThis);
