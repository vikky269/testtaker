/* Question bank access layer.
 * Question files register themselves in VA.banks['<grade>:<subject>'].
 * Swap this module to load questions from an API during integration.
 */
(function (root) {
  const VA = (root.VA = root.VA || {});

  const QuestionBank = {
    /** @returns {Array} all questions for one grade + subject */
    getBank(grade, subject) {
      return VA.banks[grade + ':' + subject] || [];
    },
    getAll() {
      return Object.keys(VA.banks).reduce((all, k) => all.concat(VA.banks[k]), []);
    },
    getById(id) {
      return QuestionBank._index()[id] || null;
    },
    _index() {
      if (!QuestionBank._idx) {
        QuestionBank._idx = {};
        QuestionBank.getAll().forEach((q) => (QuestionBank._idx[q.id] = q));
      }
      return QuestionBank._idx;
    },
    /** Student-facing copy: never exposes the answer key or explanation. */
    toPublic(q) {
      const copy = Object.assign({}, q);
      delete copy.correctOptionId;
      delete copy.explanation;
      delete copy.check;
      return copy;
    },
  };

  VA.QuestionBank = QuestionBank;
})(typeof window !== 'undefined' ? window : globalThis);
