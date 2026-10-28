/* Renders every question into contact-sheet PNGs (correct answer outlined green) for visual review.
 * node tests/gallery.js [grade] -> tests/shots/gallery-<bank>-<n>.png */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'index.html');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
  await p.goto(URL);
  await p.evaluate(() => {
    document.getElementById('main').hidden = true;
    const wrap = document.createElement('div'); wrap.id = 'gallery'; wrap.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:12px;font-family:sans-serif';
    document.body.appendChild(wrap);
    document.head.insertAdjacentHTML('beforeend', '<style>#gallery .cell{border:2px solid #ccc;border-radius:12px;padding:6px;background:#fff8ea}#gallery .cell .tag{font:700 12px monospace;color:#555}#gallery .option.is-correct{outline:5px solid #16a34a;outline-offset:-3px}#gallery .instruction{font-size:1.1rem}#gallery .main-visual .vis{max-height:150px}.speak{display:none!important}</style>');
  });
  const banks = await p.evaluate(() => Object.keys(VA.banks));
  for (const key of banks) {
    const n = await p.evaluate((k) => {
      const w = document.getElementById('gallery'); w.innerHTML = '';
      VA.banks[k].forEach((q) => {
        const pub = VA.QuestionBank.toPublic(q);
        const c = document.createElement('div'); c.className = 'cell';
        c.innerHTML = '<div class="tag">' + q.id + ' | ' + q.standard + ' | ' + q.skill + '</div>' + VA.QuestionRenderer.renderQuestion(pub, null);
        c.querySelectorAll('.option').forEach((o) => { if (o.dataset.option === q.correctOptionId) o.classList.add('is-correct'); });
        w.appendChild(c);
      });
      return VA.banks[k].length;
    }, key);
    const cells = await p.$$('#gallery .cell');
    const per = 8;
    for (let i = 0; i < cells.length; i += per) {
      const f = cells[i], l = cells[Math.min(i + per, cells.length) - 1];
      const a = await f.boundingBox(), z = await l.boundingBox();
      await p.screenshot({ path: path.join(__dirname, 'shots', 'gallery-' + key.replace(':', '-') + '-' + (i / per) + '.png'), fullPage: true, clip: { x: 0, y: a.y - 6, width: 1100, height: z.y + z.height - a.y + 12 } });
    }
    console.log(key, n);
  }
  await b.close();
})();
