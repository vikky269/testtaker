/* Scoring. Pure functions: no DOM, no storage.
 *   VA.Scoring.score(questions, answers) -> results object
 * questions: full question objects (with correctOptionId); answers: { [questionId]: optionId }
 */
(function (root) {
  const VA = (root.VA = root.VA || {});

  const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);
  function band(p) {
    if (p >= 80) return { key: 'strong', label: 'Strong' };
    if (p >= 50) return { key: 'growing', label: 'Growing' };
    return { key: 'practice', label: 'Needs practice' };
  }

  function score(questions, answers) {
    answers = answers || {};
    const subjects = { math: { correct: 0, total: 0, answered: 0 }, ela: { correct: 0, total: 0, answered: 0 } };
    const domains = {};
    const items = questions.map((q) => {
      const given = answers[q.id] || null;
      const ok = given === q.correctOptionId;
      const s = subjects[q.subject];
      s.total++; if (given) s.answered++; if (ok) s.correct++;
      const key = q.subject + '|' + q.domain;
      const d = (domains[key] = domains[key] || { subject: q.subject, domain: q.domain, correct: 0, total: 0 });
      d.total++; if (ok) d.correct++;
      return { id: q.id, subject: q.subject, domain: q.domain, standard: q.standard, answered: !!given, correct: ok, given };
    });
    const total = items.length, correct = items.filter((i) => i.correct).length;
    Object.keys(subjects).forEach((k) => { subjects[k].percent = pct(subjects[k].correct, subjects[k].total); });
    const domainList = Object.keys(domains).map((k) => {
      const d = domains[k];
      d.percent = pct(d.correct, d.total);
      d.band = band(d.percent);
      return d;
    }).sort((a, b) => (a.subject === b.subject ? a.domain.localeCompare(b.domain) : a.subject < b.subject ? 1 : -1));
    return {
      total, correct, percent: pct(correct, total),
      unanswered: items.filter((i) => !i.answered).length,
      math: subjects.math, ela: subjects.ela,
      domains: domainList, items, band: band(pct(correct, total)),
    };
  }

  VA.Scoring = { score, band, pct };
})(typeof window !== 'undefined' ? window : globalThis);
