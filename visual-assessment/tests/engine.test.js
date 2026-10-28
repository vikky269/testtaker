/* Engine, selector and scoring tests: node tests/engine.test.js */
const assert = require('assert');
const { load, DATA_FILES, ENGINE_FILES } = require('./load.js');
const VA = load(DATA_FILES.concat(ENGINE_FILES));
let n = 0;
const t = (name, fn) => { try { fn(); n++; console.log('ok  ', name); } catch (e) { console.log('FAIL', name, '\n    ', e.message); process.exitCode = 1; } };

const GRADES = ['prek', 'kindergarten', 'grade1'];
const mem = () => { let v = null; return { load: () => (v ? JSON.parse(v) : null), save: (s) => { v = JSON.stringify(s); }, clear: () => { v = null; } }; };

t('each grade yields 10 math + 10 ela, same grade only, no repeats (200 sessions)', () => {
  for (const g of GRADES) for (let i = 0; i < 200; i++) {
    const qs = VA.Selector.generateAssessment(g, { rng: VA.Selector.seeded(i + 1) }).map((p) => p.q);
    assert.strictEqual(qs.length, 20);
    assert.strictEqual(qs.filter((q) => q.subject === 'math').length, 10);
    assert.strictEqual(qs.filter((q) => q.subject === 'ela').length, 10);
    assert(qs.every((q) => q.grade === g), 'wrong grade question');
    assert.strictEqual(new Set(qs.map((q) => q.id)).size, 20, 'duplicate question');
  }
});

t('selection is balanced across domains and skills', () => {
  for (const g of GRADES) for (const s of ['math', 'ela']) {
    const bank = VA.QuestionBank.getBank(g, s);
    const domains = new Set(bank.map((q) => q.domain)).size;
    for (let i = 0; i < 100; i++) {
      const qs = VA.Selector.generateAssessment(g, { rng: VA.Selector.seeded(1000 + i) }).map((p) => p.q).filter((q) => q.subject === s);
      const per = {};
      qs.forEach((q) => (per[q.domain] = (per[q.domain] || 0) + 1));
      const counts = Object.values(per);
      const lo = Math.floor(10 / domains), hi = Math.ceil(10 / domains);
      if (domains <= 10) {
        assert.strictEqual(Object.keys(per).length, domains, g + s + ' missing domain');
        assert(Math.min(...counts) >= lo && Math.max(...counts) <= hi, g + s + ' unbalanced ' + JSON.stringify(per));
      }
      assert.strictEqual(new Set(qs.map((q) => q.skill)).size >= Math.min(10, new Set(bank.map((x) => x.skill)).size) - 3, true, 'skills too repetitive');
    }
  }
});

t('sessions differ (randomised)', () => {
  const a = VA.Selector.generateAssessment('kindergarten', { rng: VA.Selector.seeded(1) }).map((p) => p.q.id).join();
  const b = VA.Selector.generateAssessment('kindergarten', { rng: VA.Selector.seeded(2) }).map((p) => p.q.id).join();
  assert.notStrictEqual(a, b);
});

t('Fisher-Yates shuffle is a permutation and roughly uniform', () => {
  const r = VA.Selector.seeded(7), counts = [0, 0, 0, 0];
  for (let i = 0; i < 8000; i++) { const s = VA.Selector.shuffle([0, 1, 2, 3], r); assert.deepStrictEqual(s.slice().sort(), [0, 1, 2, 3]); counts[s[0]]++; }
  counts.forEach((c) => assert(c > 1700 && c < 2300, 'skewed ' + counts));
});

t('ordered numeric options stay ascending; others are shuffled; ids stable', () => {
  const qs = VA.Selector.generateAssessment('grade1', { rng: VA.Selector.seeded(3) });
  qs.forEach(({ q, order }) => {
    assert.deepStrictEqual(order.slice().sort(), q.options.map((o) => o.id).sort());
    if (!q.shuffleOptions) assert.deepStrictEqual(order, q.options.map((o) => o.id));
  });
});

t('engine flow: start, answer, navigate, review, submit locks', () => {
  const e = VA.createEngine({ persistence: mem(), rng: VA.Selector.seeded(5) });
  assert.strictEqual(e.getState().status, 'idle');
  e.start('prek');
  assert.strictEqual(e.getState().total, 20);
  const pub = e.getQuestions();
  assert(pub.every((q) => q.correctOptionId === undefined && q.explanation === undefined && q.check === undefined), 'answer key leaked');
  assert(JSON.stringify(e.current()).indexOf('correctOptionId') < 0);
  const full = VA.QuestionBank.getById(pub[0].id);
  e.answer(pub[0].id, full.correctOptionId);
  e.next(); e.next(); e.prev();
  assert.strictEqual(e.getState().index, 1);
  assert.strictEqual(e.unanswered().length, 19);
  e.goToReview();
  assert.throws(() => e.answer(pub[1].id, 'a') , /Not allowed/);
  e.backToQuestions(1);
  e.answer(pub[1].id, 'a');
  e.goToReview();
  const r = e.submit();
  assert.strictEqual(r.total, 20);
  assert.strictEqual(r.unanswered, 18);
  assert.throws(() => e.answer(pub[2].id, 'a'), /Not allowed/);
  assert.throws(() => e.goTo(3), /Not allowed/);
  assert.throws(() => e.submit(), /Not allowed/);
});

t('scoring: all correct = 20/20; all wrong = 0; math/ela split; domains add up', () => {
  const e = VA.createEngine({ persistence: mem(), rng: VA.Selector.seeded(11) });
  e.start('kindergarten');
  e.getQuestions().forEach((q) => e.answer(q.id, VA.QuestionBank.getById(q.id).correctOptionId));
  e.goToReview();
  const r = e.submit();
  assert.strictEqual(r.correct, 20); assert.strictEqual(r.math.correct, 10); assert.strictEqual(r.ela.correct, 10); assert.strictEqual(r.percent, 100);
  assert.strictEqual(r.domains.reduce((s, d) => s + d.total, 0), 20);
  assert(r.domains.every((d) => d.percent === 100));

  const e2 = VA.createEngine({ persistence: mem(), rng: VA.Selector.seeded(12) });
  e2.start('grade1');
  e2.getQuestions().forEach((q) => { const k = VA.QuestionBank.getById(q.id); e2.answer(q.id, k.options.find((o) => o.id !== k.correctOptionId).id); });
  e2.goToReview();
  const r2 = e2.submit();
  assert.strictEqual(r2.correct, 0); assert.strictEqual(r2.percent, 0);

  const e3 = VA.createEngine({ persistence: mem(), rng: VA.Selector.seeded(13) });
  e3.start('grade1');
  const qs = e3.getQuestions();
  qs.slice(0, 7).forEach((q) => e3.answer(q.id, VA.QuestionBank.getById(q.id).correctOptionId));
  e3.goToReview();
  const r3 = e3.submit();
  assert.strictEqual(r3.correct, 7); assert.strictEqual(r3.unanswered, 13); assert.strictEqual(r3.percent, 35);
  assert.strictEqual(r3.math.correct + r3.ela.correct, 7);
});

t('persistence: session restores with same questions, option order, answers, status', () => {
  const store = mem();
  const e = VA.createEngine({ persistence: store, rng: VA.Selector.seeded(21) });
  e.start('kindergarten');
  const qs = e.getQuestions();
  e.answer(qs[0].id, qs[0].options[1].id); e.goTo(4);
  const e2 = VA.createEngine({ persistence: store });
  assert(e2.hasSaved());
  assert(e2.resume());
  assert.deepStrictEqual(e2.getQuestions().map((q) => q.id), qs.map((q) => q.id));
  assert.deepStrictEqual(e2.getQuestions().map((q) => q.options.map((o) => o.id)), qs.map((q) => q.options.map((o) => o.id)));
  assert.strictEqual(e2.getState().index, 4);
  assert.strictEqual(e2.answerFor(qs[0].id), qs[0].options[1].id);
  e2.goToReview(); e2.submit();
  const e3 = VA.createEngine({ persistence: store }); e3.resume();
  assert.strictEqual(e3.getState().status, 'submitted');
  e3.reset(); assert(!e3.hasSaved());
});

t('resume ignores corrupt data', () => {
  const e = VA.createEngine({ persistence: { load: () => ({ version: 1, ids: ['NOPE-1'], orders: {} }), save() {}, clear() {} } });
  assert.strictEqual(e.resume(), false);
});

console.log(n + ' tests passed');
