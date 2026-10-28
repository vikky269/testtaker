/* Assessment engine: session state, navigation, answers, review and submit.
 * No DOM access. Dependencies are injected so the engine can be tested in Node.
 *
 *   const engine = VA.createEngine({ selector, scoring, bank, persistence, rng });
 *   engine.start('kindergarten');  engine.answer(id, 'b');  engine.next();  engine.submit();
 */
(function (root) {
  const VA = (root.VA = root.VA || {});

  function createEngine(deps) {
    deps = deps || {};
    const selector = deps.selector || VA.Selector;
    const scoring = deps.scoring || VA.Scoring;
    const bank = deps.bank || VA.QuestionBank;
    const persistence = deps.persistence || null;
    const rng = deps.rng || Math.random;
    const listeners = [];

    // session = { status, grade, ids[], orders{}, answers{}, index, startedAt, submittedAt }
    let session = null;
    let questions = []; // full question objects with this session's option order applied

    function persist() { if (persistence) persistence.save(session); }
    function emit() { listeners.forEach((fn) => fn(api.getState())); }
    function need(status) {
      if (!session) throw new Error('No assessment in progress');
      if (status && session.status !== status) throw new Error('Not allowed while status is "' + session.status + '"');
    }
    function rebuild() {
      questions = session.ids.map((id) => selector.applyOrder(bank.getById(id), session.orders[id]));
    }

    const api = {
      onChange(fn) { listeners.push(fn); },

      start(grade) {
        const picked = selector.generateAssessment(grade, { rng, bank });
        session = {
          version: 1, status: 'inProgress', grade,
          ids: picked.map((p) => p.q.id),
          orders: picked.reduce((m, p) => ((m[p.q.id] = p.order), m), {}),
          answers: {}, index: 0, startedAt: Date.now(), submittedAt: null,
        };
        rebuild(); persist(); emit();
        return api.getState();
      },

      /** Restore a saved session. Returns false if nothing usable is stored. */
      resume() {
        const saved = persistence && persistence.load();
        if (!saved || saved.version !== 1 || !Array.isArray(saved.ids) || saved.ids.some((id) => !bank.getById(id))) return false;
        session = saved;
        rebuild(); emit();
        return true;
      },

      hasSaved() {
        const s = persistence && persistence.load();
        return !!(s && s.version === 1 && s.ids && s.ids.length);
      },

      getState() {
        if (!session) return { status: 'idle' };
        return {
          status: session.status, grade: session.grade, index: session.index, total: session.ids.length,
          answeredCount: Object.keys(session.answers).length, startedAt: session.startedAt, submittedAt: session.submittedAt,
        };
      },

      /** Student-facing questions: answer key stripped. */
      getQuestions() { need(); return questions.map((q) => bank.toPublic(q)); },
      current() { need(); return bank.toPublic(questions[session.index]); },
      answerFor(id) { need(); return session.answers[id] || null; },
      answers() { need(); return Object.assign({}, session.answers); },

      goTo(i) {
        need('inProgress');
        if (i < 0 || i >= session.ids.length) throw new Error('Question index out of range');
        session.index = i; persist(); emit();
      },
      next() { need('inProgress'); if (session.index < session.ids.length - 1) api.goTo(session.index + 1); },
      prev() { need('inProgress'); if (session.index > 0) api.goTo(session.index - 1); },

      answer(questionId, optionId) {
        need('inProgress');
        const q = questions.find((x) => x.id === questionId);
        if (!q) throw new Error('Question is not in this session: ' + questionId);
        if (!q.options.some((o) => o.id === optionId)) throw new Error('Option does not belong to question');
        session.answers[questionId] = optionId; persist(); emit();
      },

      unanswered() {
        need();
        return questions.map((q, i) => ({ q, i })).filter((x) => !session.answers[x.q.id]).map((x) => ({ index: x.i, id: x.q.id }));
      },

      goToReview() { need('inProgress'); session.status = 'review'; persist(); emit(); },
      backToQuestions(i) { need('review'); session.status = 'inProgress'; session.index = typeof i === 'number' ? i : session.index; persist(); emit(); },

      /** Locks the session. Returns the results. */
      submit() {
        need('review');
        session.status = 'submitted'; session.submittedAt = Date.now();
        persist(); emit();
        return api.results();
      },

      results() {
        need('submitted');
        return Object.assign({ grade: session.grade, submittedAt: session.submittedAt }, scoring.score(questions, session.answers));
      },
      /** Full questions incl. answers: only after submit (for the optional answer review). */
      reviewItems() {
        need('submitted');
        return questions.map((q) => ({ question: q, given: session.answers[q.id] || null }));
      },

      reset() { session = null; questions = []; if (persistence) persistence.clear(); emit(); },
    };
    return api;
  }

  VA.createEngine = createEngine;
})(typeof window !== 'undefined' ? window : globalThis);
