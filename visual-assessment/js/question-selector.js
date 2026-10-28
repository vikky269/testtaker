/* Question selection. Independent of the DOM and of navigation.
 *
 *   VA.Selector.generateAssessment(grade, { rng, bank })  -> array of 20 full question objects
 *
 * Rules: 10 math + 10 ELA from the chosen grade only, round-robin across domains, skills not repeated
 * until every skill in the domain has been used, no duplicates, final order shuffled with Fisher-Yates.
 */
(function (root) {
  const VA = (root.VA = root.VA || {});
  const PER_SUBJECT = 10;

  /** Fisher-Yates shuffle (returns a new array). */
  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /** Small seedable generator (mulberry32) for tests and reproducible sessions. */
  function seeded(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pickFromSubject(list, count, rng) {
    if (list.length < count) throw new Error('Not enough questions: need ' + count + ', have ' + list.length);
    const byDomain = {};
    list.forEach((q) => (byDomain[q.domain] = byDomain[q.domain] || []).push(q));
    let domains = shuffle(Object.keys(byDomain), rng);
    const usedSkills = {};
    const chosen = [];
    const taken = {};
    let guard = 0;
    while (chosen.length < count && guard++ < 1000) {
      for (const d of domains) {
        if (chosen.length >= count) break;
        const left = byDomain[d].filter((q) => !taken[q.id]);
        if (!left.length) continue;
        const fresh = left.filter((q) => !usedSkills[d + '|' + q.skill]);
        const pool = fresh.length ? fresh : left;
        const q = pool[Math.floor(rng() * pool.length)];
        taken[q.id] = true;
        usedSkills[d + '|' + q.skill] = true;
        chosen.push(q);
      }
      domains = shuffle(domains, rng); // different domain order each pass
    }
    return chosen;
  }

  /** Copy of a question with its option order fixed for this session. */
  function withOptionOrder(q, rng) {
    const ids = q.options.map((o) => o.id);
    const order = q.shuffleOptions ? shuffle(ids, rng) : ids;
    return { q, order };
  }

  function generateAssessment(grade, opts) {
    opts = opts || {};
    const rng = opts.rng || Math.random;
    const bank = opts.bank || VA.QuestionBank;
    const math = pickFromSubject(bank.getBank(grade, 'math'), PER_SUBJECT, rng);
    const ela = pickFromSubject(bank.getBank(grade, 'ela'), PER_SUBJECT, rng);
    const mixed = shuffle(math.concat(ela), rng);
    return mixed.map((q) => withOptionOrder(q, rng));
  }

  /** Reorder a question's options by an id list (used when restoring a saved session). */
  function applyOrder(q, order) {
    const byId = {};
    q.options.forEach((o) => (byId[o.id] = o));
    return Object.assign({}, q, { options: order.map((id) => byId[id]) });
  }

  VA.Selector = { generateAssessment, shuffle, seeded, applyOrder, PER_SUBJECT };
})(typeof window !== 'undefined' ? window : globalThis);
