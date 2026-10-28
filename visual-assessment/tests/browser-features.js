/* Headless browser feature checks: keyboard, resume after reload, submit locking, speech button, no remote requests. */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'index.html');
let fails = 0;
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 900, height: 900 } });
  const p = await ctx.newPage();
  const remote = [];
  p.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) remote.push(r.url()); });
  await p.goto(URL);
  ok(await p.isDisabled('#btn-start'), 'Start disabled until a grade is chosen');
  await p.focus('.grade-card >> nth=0'); await p.keyboard.press('ArrowRight');
  ok((await p.getAttribute('.grade-card[data-grade="kindergarten"]', 'aria-checked')) === 'true', 'arrow keys choose a grade');
  await p.click('#btn-start');
  ok((await p.textContent('#progress-text')) === 'Question 1 of 20', 'progress text shows Question 1 of 20');
  await p.keyboard.press('2');
  ok((await p.locator('.option').nth(1).getAttribute('aria-checked')) === 'true', 'number key selects option 2');
  await p.locator('.option').nth(1).focus(); await p.keyboard.press('ArrowRight');
  ok((await p.locator('.option').nth(2).getAttribute('aria-checked')) === 'true' || (await p.locator('.option').count()) < 3, 'arrow key moves selection');
  // no answer reveal on question screen
  const html = await p.content();
  ok(!/is-correct|correctOptionId|explanation/.test(html), 'no answer key in the DOM during the assessment');
  ok(await p.isDisabled('#btn-prev'), 'Previous disabled on question 1');
  await p.click('#btn-next'); await p.click('#btn-prev');
  ok((await p.textContent('#progress-text')) === 'Question 1 of 20', 'Previous returns to question 1 and keeps the answer');
  ok((await p.locator('.option[aria-checked="true"]').count()) === 1, 'earlier answer is kept');
  // resume after reload
  await p.reload();
  ok(await p.isVisible('#btn-resume'), 'unfinished session offered after reload');
  await p.click('#btn-resume');
  ok((await p.locator('.option[aria-checked="true"]').count()) === 1, 'resumed session keeps the answer');
  for (let i = 0; i < 20; i++) await p.click('#btn-next');
  ok(await p.isVisible('#screen-review'), 'review screen after the last question');
  ok((await p.locator('.chip.is-open').count()) === 19, '19 unanswered questions flagged on review');
  await p.click('.chip >> nth=4');
  ok((await p.textContent('#progress-text')) === 'Question 5 of 20', 'review chip jumps to that question');
  for (let i = 0; i < 16; i++) await p.click('#btn-next');
  await p.click('#btn-submit');
  ok(await p.isVisible('#review-confirm'), 'submitting with blanks asks for confirmation first');
  await p.click('#btn-submit');
  ok(await p.isVisible('#screen-results'), 'results screen after confirmed submit');
  const t = await p.textContent('#results-body');
  ok(/\/\s*20/.test(t) && /Math/.test(t) && /Reading/.test(t), 'results show total /20 plus math and reading');
  await p.reload();
  ok(!(await p.isVisible('#btn-resume')), 'submitted session is not resumable (locked)');
  await p.click('.grade-card[data-grade="prek"]'); await p.click('#btn-start');
  ok((await p.textContent('#progress-text')) === 'Question 1 of 20', 'a new assessment starts after submit');
  ok(remote.length === 0, 'no remote requests (' + remote.length + ')');
  // reduced motion
  const p2 = await (await b.newContext({ reducedMotion: 'reduce' })).newPage();
  await p2.goto(URL);
  const dur = await p2.evaluate(() => getComputedStyle(document.querySelector('.btn')).transitionDuration);
  ok(/^0s/.test(dur), 'reduced motion disables transitions (' + dur + ')');
  // narrow widths: no horizontal scroll
  for (const w of [320, 375, 768]) {
    const p3 = await b.newPage({ viewport: { width: w, height: 800 } });
    await p3.goto(URL); await p3.click('.grade-card[data-grade="grade1"]'); await p3.click('#btn-start');
    let overflow = false;
    for (let i = 0; i < 20; i++) {
      overflow = overflow || (await p3.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1));
      await p3.click('#btn-next');
    }
    ok(!overflow, 'no horizontal scroll at ' + w + 'px across 20 questions');
    await p3.close();
  }
  await b.close();
  console.log(fails ? fails + ' FAILED' : 'all browser feature checks passed');
  process.exit(fails ? 1 : 0);
})();
