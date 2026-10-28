/* Visual renderer: counting, number, measurement and data visuals. */
(function (root) {
  const VA = root.VA;
  const art = VA.art, V = VA.visuals;
  const { ST, ST2, INK } = art;
  const { S, text, scatter } = V;
  const T = V.types;

  const place = (name, cx, cy, size, o) => art.place(name, (cx - size / 2).toFixed(1), (cy - size / 2).toFixed(1), size.toFixed(1), o);

  /** Positions for `count` items. Returns {pts, size, W, H}. */
  function layoutPoints(count, layout, cols) {
    const W = 300;
    if (layout === 'scatter') {
      const H = 150, sc = scatter(count, W - 20, H - 16, count + 1);
      return { W, H, size: Math.min(sc.size * 0.92, 58), pts: sc.pts.map((p) => ({ x: p.x + 10, y: p.y + 8 })) };
    }
    if (layout === 'circle') {
      const H = 170, R = 62, size = Math.min(54, (2 * Math.PI * R) / Math.max(count, 1) * 0.95);
      return { W, H, size, pts: Array.from({ length: count }, (_, i) => {
        const a = (i / count) * 2 * Math.PI - Math.PI / 2;
        return { x: W / 2 + R * 1.25 * Math.cos(a), y: H / 2 + R * Math.sin(a) };
      }) };
    }
    const per = layout === 'array' ? cols : count <= 10 ? Math.max(count, 1) : 10;
    const rows = Math.ceil(count / per);
    const cell = Math.min((W - 16) / per, 58);
    const H = Math.max(rows * cell + 16, 60);
    const Wt = Math.max(per * cell + 16, 90); // tight width so small groups fill the picture
    const x0 = (Wt - per * cell) / 2;
    return { W: Wt, H, size: cell * 0.92, pts: Array.from({ length: count }, (_, i) => ({ x: x0 + (i % per) * cell + cell / 2, y: 8 + Math.floor(i / per) * cell + cell / 2 })) };
  }

  T.objects = (v) => {
    if (!v.count) {
      return S(300, 120, '<rect x="30" y="20" width="240" height="80" rx="18" fill="#f8fafc" stroke="#94a3b8" stroke-width="3" stroke-dasharray="9 7"/>', 'objects');
    }
    const L = layoutPoints(v.count, v.layout || 'row', v.cols || 5);
    return S(L.W, L.H, L.pts.map((p) => place(v.art, p.x, p.y, L.size, v)).join(''), 'objects');
  };

  T['objects-mixed'] = (v) => {
    const all = [];
    v.items.forEach((g, gi) => { for (let i = 0; i < g.count; i++) all.push({ art: g.art, color: v.reveal === false && gi > 0 ? '#e2e8f0' : g.color }); });
    const per = Math.min(all.length, 6), rows = Math.ceil(all.length / per), cell = Math.min(260 / per, 56);
    const x0 = (300 - per * cell) / 2;
    return S(300, rows * cell + 16, all.map((it, i) => place(it.art, x0 + (i % per) * cell + cell / 2, 8 + Math.floor(i / per) * cell + cell / 2, cell * 0.92, { color: it.color })).join(''), 'objects');
  };

  T.groups = (v) => {
    const n = v.groups.length, gw = 300 / n;
    let out = '';
    v.groups.forEach((g, gi) => {
      const per = Math.min(g.count, 3), rows = Math.ceil(g.count / per), cell = Math.min((gw - 24) / per, 44);
      const x0 = gi * gw + (gw - per * cell) / 2;
      out += '<rect x="' + (gi * gw + 6) + '" y="4" width="' + (gw - 12) + '" height="' + (Math.max(rows, 3) * 44 + 12) + '" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2.5"/>';
      for (let i = 0; i < g.count; i++) out += place(g.art, x0 + (i % per) * cell + cell / 2, 12 + Math.floor(i / per) * 44 + 22, cell * 0.92, g);
    });
    const maxRows = Math.max(3, ...v.groups.map((g) => Math.ceil(g.count / 3)));
    return S(300, maxRows * 44 + 20, out, 'groups');
  };

  T.join = (v) => {
    const grid = (n, x0, cell) => {
      const per = Math.min(n, 5);
      return Array.from({ length: n }, (_, i) => ({ x: x0 + (i % per) * cell + cell / 2, y: 8 + Math.floor(i / per) * cell + cell / 2 }));
    };
    const perA = Math.min(v.a, 5), perB = Math.min(v.b, 5);
    const cell = Math.min(46, v.op === '+' ? 270 / (perA + perB + 1.3) : 270 / perA);
    const rows = Math.ceil(v.a / 5);
    const H = Math.max(rows * cell, 36) + 16;
    let out = '';
    const wA = perA * cell;
    const A = grid(v.a, 0, cell);
    if (v.op === '+') {
      const gapX = Math.max(30, cell * 1.1), wB = perB * cell, total = wA + gapX + wB, off = (300 - total) / 2;
      A.forEach((p) => (out += place(v.art, off + p.x, p.y, cell * 0.92, v)));
      out += text(off + wA + gapX / 2, H / 2 + 10, '+', Math.min(40, cell * 1.1), { fill: '#2563eb' });
      grid(v.b, off + wA + gapX, cell).forEach((p) => (out += place(v.art, p.x, p.y, cell * 0.92, v)));
    } else {
      const off = (300 - wA) / 2;
      A.forEach((p, i) => {
        const gone = i >= v.a - v.b;
        out += '<g opacity="' + (gone ? 0.38 : 1) + '">' + place(v.art, off + p.x, p.y, cell * 0.92, v) + '</g>';
        if (gone) out += '<path d="M' + (off + p.x - 9) + ' ' + (p.y - 9) + ' L' + (off + p.x + 9) + ' ' + (p.y + 9) + ' M' + (off + p.x + 9) + ' ' + (p.y - 9) + ' L' + (off + p.x - 9) + ' ' + (p.y + 9) + '" stroke="#dc2626" stroke-width="3.4" stroke-linecap="round"/>';
      });
    }
    return S(300, H, out, 'join');
  };

  // ---------- ten frames ----------
  function frame(x, y, filled, color, cell) {
    let o = '<rect x="' + x + '" y="' + y + '" width="' + cell * 5 + '" height="' + cell * 2 + '" fill="#fff" ' + ST + '/>';
    for (let i = 1; i < 5; i++) o += '<line x1="' + (x + i * cell) + '" y1="' + y + '" x2="' + (x + i * cell) + '" y2="' + (y + cell * 2) + '" stroke="' + INK + '" stroke-width="2"/>';
    o += '<line x1="' + x + '" y1="' + (y + cell) + '" x2="' + (x + cell * 5) + '" y2="' + (y + cell) + '" stroke="' + INK + '" stroke-width="2"/>';
    for (let i = 0; i < filled; i++) {
      o += '<circle cx="' + (x + (i % 5) * cell + cell / 2) + '" cy="' + (y + Math.floor(i / 5) * cell + cell / 2) + '" r="' + cell * 0.36 + '" fill="' + color + '" ' + ST2 + '/>';
    }
    return o;
  }
  T.tenframe = (v) => {
    const cell = 26, w = cell * 5;
    let a = v.filled, b = v.second || 0;
    if (!v.second && a > 10) { b = a - 10; a = 10; }
    const has2 = b > 0;
    const x = 6;
    let out = frame(x + 0, 4, a, '#3b82f6', cell);
    if (has2) out += frame(x + 0, 4 + cell * 2 + 14, b, v.second ? '#f97316' : '#3b82f6', cell);
    return S(w + 2 * x, has2 ? cell * 4 + 22 : cell * 2 + 8, out, 'tenframe');
  };

  // ---------- base ten blocks ----------
  function rod(x, y, u) {
    let o = '<rect x="' + x + '" y="' + y + '" width="' + u + '" height="' + u * 10 + '" fill="#60a5fa" ' + ST2 + '/>';
    for (let i = 1; i < 10; i++) o += '<line x1="' + x + '" y1="' + (y + i * u) + '" x2="' + (x + u) + '" y2="' + (y + i * u) + '" stroke="#1d4ed8" stroke-width="1"/>';
    return o;
  }
  const unit = (x, y, u, c) => '<rect x="' + x + '" y="' + y + '" width="' + u + '" height="' + u + '" fill="' + (c || '#fbbf24') + '" ' + ST2 + '/>';
  T.base10 = (v) => {
    const u = 12, rodW = u + 6;
    let x = 8, out = '';
    for (let i = 0; i < v.tens; i++) {
      const crossed = v.take && i >= v.tens - v.take;
      out += '<g opacity="' + (crossed ? 0.4 : 1) + '">' + rod(x, 10, u) + '</g>';
      if (crossed) out += '<path d="M' + (x - 2) + ' 14 L' + (x + u + 2) + ' ' + (10 + u * 10 - 4) + ' M' + (x + u + 2) + ' 14 L' + (x - 2) + ' ' + (10 + u * 10 - 4) + '" stroke="#dc2626" stroke-width="3.4" stroke-linecap="round"/>';
      x += rodW;
    }
    x += 12;
    const onesCols = 2;
    for (let i = 0; i < v.ones; i++) out += unit(x + (i % onesCols) * (u + 3), 10 + Math.floor(i / onesCols) * (u + 3), u);
    if (v.ones) x += onesCols * (u + 3) + 6;
    if (v.plus) {
      x += 8;
      out += text(x + 8, 66, '+', 30, { fill: '#2563eb' });
      x += 34;
      for (let i = 0; i < v.plus; i++) out += unit(x + (i % 3) * (u + 3), 10 + Math.floor(i / 3) * (u + 3), u, '#fb923c');
      x += 3 * (u + 3);
    }
    return S(Math.max(x + 8, 120), 10 + u * 10 + 10, out, 'base10');
  };

  T.tower = (v) => {
    const h = 13, w = 36;
    let out = '';
    for (let i = 0; i < v.n; i++) out += '<rect x="32" y="' + (98 - (i + 1) * h) + '" width="' + w + '" height="' + h + '" fill="' + ['#60a5fa', '#f87171', '#fbbf24', '#34d399', '#a78bfa', '#fb923c', '#2dd4bf'][i % 7] + '" ' + ST2 + '/>';
    return S(100, 100, out + '<line x1="14" y1="99" x2="86" y2="99" stroke="#a3b18a" stroke-width="2.4" stroke-linecap="round"/>', 'tower');
  };

  // ---------- number line ----------
  T.numberline = (v) => {
    const n = v.to - v.from, L = 24, R = 276, step = (R - L) / n, y = 84;
    const X = (k) => L + (k - v.from) * step;
    let out = '<line x1="' + (L - 10) + '" y1="' + y + '" x2="' + (R + 10) + '" y2="' + y + '" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>';
    for (let k = v.from; k <= v.to; k++) {
      out += '<line x1="' + X(k) + '" y1="' + (y - 9) + '" x2="' + X(k) + '" y2="' + (y + 9) + '" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';
      const hidden = (v.hide && v.hide.indexOf(k) >= 0) || (v.marker !== undefined && k > v.marker);
      if (v.hide && v.hide.indexOf(k) >= 0) {
        out += '<rect x="' + (X(k) - 15) + '" y="' + (y + 16) + '" width="30" height="30" rx="7" fill="#fff8e1" stroke="#f59e0b" stroke-width="2.6" stroke-dasharray="5 4"/>' + text(X(k), y + 39, '?', 22, { fill: '#d97706' });
      } else if (!hidden) out += text(X(k), y + 38, String(k), 22);
    }
    if (v.marker !== undefined) {
      out += place('frog', X(v.marker), 40, 46) + '<path d="M' + X(v.marker) + ' 66 L' + X(v.marker) + ' ' + (y - 14) + '" stroke="#16a34a" stroke-width="0"/>';
      for (let h = 0; h < (v.hops || 0); h++) {
        const x1 = X(v.marker + h), x2 = X(v.marker + h + 1);
        out += '<path d="M' + x1 + ' ' + (y - 6) + ' Q' + (x1 + x2) / 2 + ' ' + (y - 40) + ' ' + x2 + ' ' + (y - 6) + '" fill="none" stroke="#f97316" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="1 7"/>' +
          '<path d="M' + (x2 - 6) + ' ' + (y - 14) + ' L' + x2 + ' ' + (y - 5) + ' L' + (x2 + 3) + ' ' + (y - 16) + '" fill="none" stroke="#f97316" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>';
      }
    }
    return S(300, 130, out, 'numberline');
  };

  // ---------- clocks ----------
  T.clock = (v) => {
    let out = '<circle cx="50" cy="50" r="46" fill="#3b82f6" ' + ST + '/><circle cx="50" cy="50" r="39" fill="#fff" ' + ST2 + '/>';
    for (let i = 1; i <= 12; i++) {
      const a = i * 30 * Math.PI / 180;
      out += text((50 + 32.5 * Math.sin(a)).toFixed(1), (50 - 32.5 * Math.cos(a) + 3.8).toFixed(1), String(i), 10.5, { weight: 800 });
    }
    const ha = ((v.h % 12) + v.m / 60) * 30, ma = v.m * 6;
    const hand = (ang, len, w) => '<line x1="50" y1="50" x2="' + (50 + len * Math.sin(ang * Math.PI / 180)).toFixed(1) + '" y2="' + (50 - len * Math.cos(ang * Math.PI / 180)).toFixed(1) + '" stroke="' + INK + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    return S(100, 100, out + hand(ha, 17, 5) + hand(ma, 25, 3.2) + '<circle cx="50" cy="50" r="3.4" fill="#ef4444"/>', 'clock');
  };
  T.digital = (v) => {
    const t = v.h + ':' + String(v.m).padStart(2, '0');
    return S(180, 90, '<rect x="6" y="10" width="168" height="70" rx="14" fill="#1f2937" ' + ST + '/><rect x="14" y="18" width="152" height="54" rx="8" fill="#a7f3d0"/>' +
      '<text x="90" y="62" text-anchor="middle" font-family="Courier New, monospace" font-size="46" font-weight="900" fill="#064e3b">' + t + '</text>', 'digital');
  };

  // ---------- fractions ----------
  T.fraction = (v) => {
    const c = '#fbbf24', pale = '#fff', eq = v.equal !== false;
    let out = '';
    if (v.shape === 'circle') {
      const cx = 50, cy = 50, r = 40;
      if (!eq) {
        // unequal halves: chord off centre
        const dx = 17, ch = Math.sqrt(r * r - dx * dx);
        out += '<circle cx="50" cy="50" r="40" fill="' + pale + '"/>' +
          '<path d="M' + (cx + dx) + ' ' + (cy - ch) + ' A40 40 0 1 0 ' + (cx + dx) + ' ' + (cy + ch) + 'Z" fill="' + c + '"/>' +
          '<line x1="' + (cx + dx) + '" y1="' + (cy - ch) + '" x2="' + (cx + dx) + '" y2="' + (cy + ch) + '" stroke="' + INK + '" stroke-width="3"/>';
      } else {
        for (let i = 0; i < v.parts; i++) {
          const a0 = (i / v.parts) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / v.parts) * 2 * Math.PI - Math.PI / 2;
          const p = (a) => (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2);
          out += '<path d="M50 50 L' + p(a0) + ' A40 40 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + p(a1) + 'Z" fill="' + (i < v.shaded ? c : pale) + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
        }
      }
      out += '<circle cx="50" cy="50" r="40" fill="none" ' + ST + '/>';
    } else {
      const x0 = 8, y0 = 22, w = 84, h = 56;
      if (!eq) {
        const sx = x0 + w * 0.3;
        out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" fill="' + pale + '"/><rect x="' + x0 + '" y="' + y0 + '" width="' + (sx - x0) + '" height="' + h + '" fill="' + c + '"/><line x1="' + sx + '" y1="' + y0 + '" x2="' + sx + '" y2="' + (y0 + h) + '" stroke="' + INK + '" stroke-width="3"/>';
      } else {
        const pw = w / v.parts;
        for (let i = 0; i < v.parts; i++) out += '<rect x="' + (x0 + i * pw) + '" y="' + y0 + '" width="' + pw + '" height="' + h + '" fill="' + (i < v.shaded ? c : pale) + '" stroke="' + INK + '" stroke-width="2.6"/>';
      }
      out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" fill="none" ' + ST + '/>';
    }
    return S(100, 100, out, 'fraction');
  };

  // ---------- horizontal bars (pencil / ribbon / crayon) ----------
  /** draw object horizontally from x with length len, height h (centre at cy) */
  function hbar(kind, x, cy, len, h, color) {
    const c = art.color(color, '#ef4444');
    const y = cy - h / 2;
    if (kind === 'pencil') {
      const tip = Math.min(h * 1.1, len * 0.2), er = Math.min(h * 0.7, len * 0.12);
      return '<rect x="' + x + '" y="' + y + '" width="' + er + '" height="' + h + '" rx="3" fill="#f9a8d4" ' + ST2 + '/>' +
        '<rect x="' + (x + er) + '" y="' + y + '" width="' + er * 0.6 + '" height="' + h + '" fill="#cbd5e1" ' + ST2 + '/>' +
        '<rect x="' + (x + er * 1.6) + '" y="' + y + '" width="' + (len - er * 1.6 - tip) + '" height="' + h + '" fill="' + c + '" ' + ST2 + '/>' +
        '<path d="M' + (x + len - tip) + ' ' + y + ' L' + (x + len) + ' ' + cy + ' L' + (x + len - tip) + ' ' + (y + h) + 'Z" fill="#fcd9a8" ' + ST2 + '/>' +
        '<path d="M' + (x + len - tip * 0.34) + ' ' + (cy - h * 0.17) + ' L' + (x + len) + ' ' + cy + ' L' + (x + len - tip * 0.34) + ' ' + (cy + h * 0.17) + 'Z" fill="' + INK + '"/>';
    }
    if (kind === 'ribbon') {
      const n = Math.min(h * 0.45, len * 0.1);
      return '<path d="M' + x + ' ' + y + ' L' + (x + len) + ' ' + y + ' L' + (x + len - n) + ' ' + cy + ' L' + (x + len) + ' ' + (y + h) + ' L' + x + ' ' + (y + h) + ' L' + (x + n) + ' ' + cy + 'Z" fill="' + c + '" ' + ST2 + '/>' +
        '<line x1="' + (x + n + 2) + '" y1="' + (cy - h * 0.18) + '" x2="' + (x + len - n - 2) + '" y2="' + (cy - h * 0.18) + '" stroke="#fff" stroke-width="1.6" opacity=".6" stroke-linecap="round"/>';
    }
    // crayon
    const tip = Math.min(h * 0.9, len * 0.2);
    return '<rect x="' + x + '" y="' + y + '" width="' + (len - tip) + '" height="' + h + '" rx="2" fill="' + c + '" ' + ST2 + '/>' +
      '<rect x="' + (x + len * 0.22) + '" y="' + (y + 0.5) + '" width="' + Math.max(len * 0.4, 4) + '" height="' + (h - 1) + '" fill="#fff" opacity=".85"/>' +
      '<path d="M' + (x + len - tip) + ' ' + y + ' L' + (x + len) + ' ' + cy + ' L' + (x + len - tip) + ' ' + (y + h) + 'Z" fill="' + c + '" ' + ST2 + '/>';
  }
  T.bar = (v) => S(100, 18, hbar(v.art, 2, 9, Math.max(8, v.len * 0.94), 12, v.color), 'bar');

  T.measure = (v) => {
    const u = Math.min(15, 105 / v.n), step = v.gap ? u * 1.45 : v.overlap ? u * 0.6 : u;
    const len = v.n * u, W = 126;
    const x0 = (W - len) / 2, objH = Math.min(18, u * 1.15);
    let out = hbar(v.object, x0, 16, len, objH, v.object === 'crayon' ? 'green' : v.object === 'ribbon' ? 'red' : 'yellow');
    // cubes
    for (let i = 0; i < v.n; i++) out += '<rect x="' + (x0 + i * step).toFixed(1) + '" y="38" width="' + u + '" height="' + u + '" fill="' + (i % 2 ? '#93c5fd' : '#60a5fa') + '" ' + ST2 + '/>';
    // alignment guide at start of object
    out += '<line x1="' + x0 + '" y1="2" x2="' + x0 + '" y2="' + (38 + u + 4) + '" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/>';
    return S(W, 38 + u + 8, out, 'measure');
  };

  // ---------- charts ----------
  T.barchart = (v) => {
    const max = Math.max(...v.bars.map((b) => b.count)) + 1, top = 34, bot = 168, H = bot - top, L = 40, W = 300;
    const bw = (W - L - 20) / v.bars.length;
    let out = text(150, 20, v.title, 17);
    for (let k = 0; k <= max; k++) {
      const y = bot - (k / max) * H;
      out += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" stroke="#e2e8f0" stroke-width="1.6"/>' + text(L - 10, y + 5, String(k), 13, { anchor: 'end', weight: 700 });
    }
    v.bars.forEach((b, i) => {
      const h = (b.count / max) * H, x = L + i * bw + bw * 0.18;
      out += '<rect x="' + x + '" y="' + (bot - h) + '" width="' + bw * 0.64 + '" height="' + h + '" rx="3" fill="' + art.color(b.color) + '" ' + ST2 + '/>';
    });
    out += '<line x1="' + L + '" y1="' + top + '" x2="' + L + '" y2="' + bot + '" stroke="' + INK + '" stroke-width="2.6"/><line x1="' + L + '" y1="' + bot + '" x2="' + (W - 10) + '" y2="' + bot + '" stroke="' + INK + '" stroke-width="2.6"/>';
    return S(W, 178, out, 'barchart');
  };

  T.pictograph = (v) => {
    const rowH = 40, top = 34;
    let out = text(150, 22, v.title, 17);
    v.rows.forEach((r, i) => {
      const y = top + i * rowH;
      out += '<rect x="8" y="' + y + '" width="284" height="' + (rowH - 4) + '" rx="8" fill="' + (i % 2 ? '#f8fafc' : '#eff6ff') + '"/>' + place(r.art, 28, y + 18, 30, r);
      for (let k = 0; k < r.count; k++) out += place(r.art, 66 + k * 27 + 12, y + 18, 24, r);
    });
    return S(300, top + v.rows.length * rowH + 4, out, 'pictograph');
  };

  // ---------- geometry helpers ----------
  T.build = (v) => {
    void v;
    const p = [[50, 16], [90, 84], [10, 84]];
    let out = '';
    for (let i = 0; i < 3; i++) {
      const a = p[i], b = p[(i + 1) % 3];
      out += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#a16207" stroke-width="9" stroke-linecap="round"/><line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#d6a25a" stroke-width="4" stroke-linecap="round"/>';
    }
    p.forEach((q) => (out += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="8" fill="#ef4444" ' + ST + '/>'));
    return S(100, 100, out, 'build');
  };
  T.compose = (v) => {
    const sh = (d, c) => '<path d="' + d + '" fill="' + c + '" ' + ST + '/>';
    let out = '';
    if (v.kind === 'tri-tri-rect') {
      out = sh('M8 80 L8 24 L58 80Z', '#fbbf24') + text(75, 62, '+', 26, { fill: '#2563eb' }) + sh('M142 20 L142 76 L92 20Z', '#fb923c');
      return S(150, 100, '<g transform="translate(0 6)">' + out + '</g>', 'compose');
    }
    if (v.kind === 'sq-sq-rect') {
      return S(150, 100, '<rect x="14" y="26" width="58" height="58" fill="#60a5fa" ' + ST + '/><rect x="72" y="26" width="58" height="58" fill="#f87171" ' + ST + '/>', 'compose');
    }
    out = sh('M8 70 A32 32 0 0 1 72 70Z', '#a78bfa') + text(88, 66, '+', 26, { fill: '#2563eb' }) + sh('M104 40 A32 32 0 0 0 168 40Z', '#34d399');
    return S(176, 100, '<g transform="translate(0 6)">' + out + '</g>', 'compose');
  };

  T.queue = (v) => {
    const n = v.items.length, step = 62, W = n * step + 104;
    let out = '';
    // items[0] is nearest the goal (right)
    v.items.forEach((name, i) => {
      out += place(name, W - 124 - i * step, 56, 54);
    });
    out += '<svg x="' + (W - 84) + '" y="6" width="76" height="76" viewBox="0 0 100 100">' + art.inner(v.goal) + '</svg>' +
      '<path d="M8 90 L' + (W - 96) + ' 90" stroke="#94a3b8" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>' +
      '<path d="M' + (W - 110) + ' 82 L' + (W - 96) + ' 90 L' + (W - 110) + ' 98" fill="none" stroke="#94a3b8" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>';
    return S(W, 104, out, 'queue');
  };
})(typeof window !== 'undefined' ? window : globalThis);
