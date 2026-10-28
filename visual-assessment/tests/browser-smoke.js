/* Headless browser check: node tests/browser-smoke.js
 * Loads index.html from file://, walks welcome -> 20 questions -> review -> results, reports console errors. */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'index.html');
const SH = path.join(__dirname, 'shots');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [w, h, tag] of [[900, 1000, 'desktop'], [390, 800, 'mobile']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', (e) => errs.push(tag + ' pageerror ' + e.message));
    p.on('console', (m) => m.type() === 'error' && errs.push(tag + ' console ' + m.text()));
    await p.goto(URL);
    await p.screenshot({ path: SH + '/' + tag + '-welcome.png', fullPage: true });
    await p.click('.grade-card[data-grade="kindergarten"]');
    await p.click('#btn-start');
    for (let i = 0; i < 20; i++) {
      if (i === 0 || i === 7) await p.screenshot({ path: SH + '/' + tag + '-q' + i + '.png', fullPage: true });
      if (i % 3 !== 2) await p.click('.option >> nth=0');
      await p.click('#btn-next');
    }
    await p.screenshot({ path: SH + '/' + tag + '-review.png', fullPage: true });
    await p.click('#btn-submit');
    await p.click('#btn-submit');
    await p.screenshot({ path: SH + '/' + tag + '-results.png', fullPage: true });
    console.log(tag, 'results text:', (await p.textContent('.total-card')).replace(/\s+/g, ' '));
    await p.close();
  }
  console.log('errors:', errs);
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
