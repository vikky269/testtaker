/* App controller: wires the engine to the screens. All DOM work lives here and in question-renderer.js. */
(function () {
  const VA = window.VA;
  const $ = (id) => document.getElementById(id);
  const esc = VA.QuestionRenderer.esc;
  const engine = VA.createEngine({ persistence: VA.persistence });
  let chosenGrade = null;
  let confirmingSubmit = false;

  const SCREENS = ['welcome', 'question', 'review', 'results'];
  function show(name, focusId) {
    SCREENS.forEach((s) => { $('screen-' + s).hidden = s !== name; });
    window.scrollTo(0, 0);
    const el = $(focusId);
    if (el) el.focus({ preventScroll: true });
  }
  const say = (msg) => { $('live').textContent = ''; setTimeout(() => ($('live').textContent = msg), 30); };

  // ---------- speech (optional; hidden when unsupported) ----------
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  function speak(text) {
    if (!canSpeak || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }

  // ---------- welcome ----------
  const GRADE_ART = {
    prek: { bg: '#ffe8a3', items: [['bear', 6, 26, 80], ['ball', 78, 10, 46, { color: 'red' }], ['cube', 92, 60, 44, { color: 'blue' }], ['duck', 62, 62, 44]] },
    kindergarten: { bg: '#c9f0d0', items: [['tree', 4, 14, 84], ['sun', 100, 4, 50], ['rabbit', 70, 50, 62], ['flower', 126, 74, 40, { color: 'pink' }]] },
    grade1: { bg: '#cfe4ff', items: [['book', 8, 22, 70], ['pencil', 66, 18, 66], ['ruler', 92, 70, 52], ['star', 128, 6, 40, { color: 'yellow' }]] },
  };
  function gradeSvg(g) {
    const d = GRADE_ART[g];
    return '<svg viewBox="0 0 180 120" class="grade-svg" aria-hidden="true" focusable="false"><rect width="180" height="120" rx="16" fill="' + d.bg + '"/><circle cx="150" cy="104" r="40" fill="#fff" opacity=".35"/>' +
      d.items.map((i) => VA.art.place(i[0], i[1], i[2], i[3], i[4])).join('') + '</svg>';
  }
  function buildWelcome() {
    $('hero-art').innerHTML = '<svg viewBox="0 0 260 90" aria-hidden="true" focusable="false">' +
      [['apple', 4, 14, 62], ['cat', 60, 6, 70], ['star', 124, 14, 56, { color: 'yellow' }], ['book', 170, 8, 70]].map((i) => VA.art.place(i[0], i[1], i[2], i[3], i[4])).join('') + '</svg>';
    $('grade-cards').innerHTML = Object.keys(VA.GRADES).map((g) => {
      const G = VA.GRADES[g];
      return '<button type="button" role="radio" aria-checked="false" class="grade-card" data-grade="' + g + '" tabindex="' + (g === 'prek' ? 0 : -1) + '">' + gradeSvg(g) +
        '<span class="grade-name">' + esc(G.label) + '</span><span class="grade-fw">' + esc(G.framework) + '</span></button>';
    }).join('');
    const resume = engine.hasSaved();
    const box = $('resume-box');
    if (resume) {
      const probe = VA.createEngine({ persistence: VA.persistence });
      if (probe.resume()) {
        const s = probe.getState();
        if (s.status !== 'submitted') {
          box.hidden = false;
          box.innerHTML = '<p><strong>You have an unfinished ' + esc(VA.GRADES[s.grade].short) + ' quiz.</strong> ' + s.answeredCount + ' of ' + s.total + ' answered.</p>' +
            '<div class="actions"><button type="button" class="btn btn-primary" id="btn-resume">Keep going</button><button type="button" class="btn btn-secondary" id="btn-discard">Start fresh</button></div>';
          $('btn-resume').onclick = () => { engine.resume(); route(); };
          $('btn-discard').onclick = () => { engine.reset(); box.hidden = true; };
        } else { VA.persistence.clear(); }
      }
    }
  }
  function chooseGrade(g) {
    chosenGrade = g;
    document.querySelectorAll('.grade-card').forEach((b) => {
      const on = b.dataset.grade === g;
      b.classList.toggle('is-selected', on); b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1;
    });
    $('btn-start').disabled = false;
    say(VA.GRADES[g].label + ' selected');
  }
  $('grade-cards').addEventListener('click', (e) => { const b = e.target.closest('.grade-card'); if (b) chooseGrade(b.dataset.grade); });
  $('grade-cards').addEventListener('keydown', (e) => {
    const cards = [].slice.call(document.querySelectorAll('.grade-card'));
    const i = cards.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % cards.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + cards.length) % cards.length;
    if (n !== null) { e.preventDefault(); cards[n].focus(); chooseGrade(cards[n].dataset.grade); }
  });
  $('btn-start').onclick = () => { if (!chosenGrade) return; engine.start(chosenGrade); route(); };

  // ---------- question ----------
  function renderQuestion() {
    const st = engine.getState(), q = engine.current();
    $('progress-text').textContent = 'Question ' + (st.index + 1) + ' of ' + st.total;
    $('progress').setAttribute('aria-valuenow', st.index + 1);
    $('progress').setAttribute('aria-valuemax', st.total);
    $('progress-fill').style.width = ((st.index + 1) / st.total) * 100 + '%';
    const all = engine.getQuestions();
    $('progress-dots').innerHTML = all.map((x, i) => '<span class="pd' + (i === st.index ? ' is-current' : '') + (engine.answerFor(x.id) ? ' is-done' : '') + '"></span>').join('');
    $('question-body').innerHTML = VA.QuestionRenderer.renderQuestion(q, engine.answerFor(q.id));
    $('btn-prev').disabled = st.index === 0;
    $('btn-next').textContent = st.index === st.total - 1 ? 'Review answers' : 'Next';
    show('question', 'q-instruction');
    say('Question ' + (st.index + 1) + ' of ' + st.total + '. ' + q.instruction);
  }
  function select(optId) {
    const q = engine.current();
    engine.answer(q.id, optId);
    document.querySelectorAll('.option').forEach((b) => {
      const on = b.dataset.option === optId;
      b.classList.toggle('is-selected', on); b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1;
    });
    const dots = document.querySelectorAll('.pd'); dots[engine.getState().index].classList.add('is-done');
    say('Answer chosen');
  }
  $('question-body').addEventListener('click', (e) => {
    const o = e.target.closest('.option'); if (o) return select(o.dataset.option);
    const s = e.target.closest('.speak');
    if (s) { const q = engine.current(); speak(VA.QuestionRenderer.speechText(q, s.dataset.speak)); }
  });
  $('question-body').addEventListener('keydown', (e) => {
    const opts = [].slice.call(document.querySelectorAll('.option'));
    const i = opts.indexOf(document.activeElement);
    if (i >= 0 && (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      const n = opts[(i + d + opts.length) % opts.length]; n.focus(); select(n.dataset.option);
    }
  });
  document.addEventListener('keydown', (e) => {
    if ($('screen-question').hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^[1-4]$/.test(e.key) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      const o = document.querySelectorAll('.option')[Number(e.key) - 1];
      if (o) { select(o.dataset.option); o.focus(); }
    }
  });
  $('btn-prev').onclick = () => { engine.prev(); renderQuestion(); };
  $('btn-next').onclick = () => {
    const st = engine.getState();
    if (st.index === st.total - 1) { engine.goToReview(); route(); } else { engine.next(); renderQuestion(); }
  };

  // ---------- review ----------
  function renderReview() {
    confirmingSubmit = false;
    const un = engine.unanswered(), st = engine.getState();
    $('review-summary').textContent = un.length
      ? 'You have not answered ' + un.length + ' question' + (un.length === 1 ? '' : 's') + ' yet. Tap a number to go back to it.'
      : 'You answered all ' + st.total + ' questions. You can still tap a number to change an answer.';
    const qs = engine.getQuestions();
    $('review-grid').innerHTML = qs.map((q, i) => {
      const done = !!engine.answerFor(q.id);
      return '<button type="button" class="chip ' + (done ? 'is-done' : 'is-open') + '" data-index="' + i + '" aria-label="Question ' + (i + 1) + ', ' + (done ? 'answered' : 'not answered') + '">' +
        '<span class="chip-num">' + (i + 1) + '</span><span class="chip-state">' + (done ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' : 'open') + '</span></button>';
    }).join('');
    $('review-confirm').hidden = true;
    $('btn-submit').textContent = 'Submit';
    show('review', 'review-title');
    say('Review. ' + $('review-summary').textContent);
  }
  $('review-grid').addEventListener('click', (e) => {
    const c = e.target.closest('.chip'); if (!c) return;
    engine.backToQuestions(Number(c.dataset.index)); route();
  });
  $('btn-review-back').onclick = () => { engine.backToQuestions(); route(); };
  $('btn-submit').onclick = () => {
    const un = engine.unanswered();
    if (un.length && !confirmingSubmit) {
      confirmingSubmit = true;
      const box = $('review-confirm'); box.hidden = false;
      box.innerHTML = '<p><strong>' + un.length + ' question' + (un.length === 1 ? ' is' : 's are') + ' still blank.</strong> Blank questions count as not correct. After you submit, you cannot change your answers.</p><div class="actions"><button type="button" class="btn btn-secondary" id="btn-go-first">Go to first blank</button></div>';
      $('btn-go-first').onclick = () => { engine.backToQuestions(un[0].index); route(); };
      $('btn-submit').textContent = 'Submit anyway';
      box.setAttribute('role', 'alert');
      return;
    }
    engine.submit(); route();
  };

  // ---------- results ----------
  const ring = (pct, label) => {
    const r = 42, c = 2 * Math.PI * r;
    return '<svg viewBox="0 0 100 100" class="ring" aria-hidden="true"><circle cx="50" cy="50" r="' + r + '" fill="none" stroke="#e6edf7" stroke-width="12"/><circle cx="50" cy="50" r="' + r + '" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + (c * pct / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 50 50)"/>' +
      '<text x="50" y="57" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor">' + label + '</text></svg>';
  };
  function renderResults() {
    const r = engine.results(), G = VA.GRADES[r.grade];
    const sub = (name, s, cls) => '<div class="score-card ' + cls + '">' + ring(s.percent, s.percent + '%') + '<div><div class="score-title">' + name + '</div><div class="score-num">' + s.correct + ' / ' + s.total + '</div></div></div>';
    const dom = (subject) => r.domains.filter((d) => d.subject === subject).map((d) =>
      '<li class="domain"><div class="domain-head"><span>' + esc(d.domain) + '</span><span class="band ' + d.band.key + '">' + d.band.label + '</span></div>' +
      '<div class="meter" role="img" aria-label="' + d.correct + ' of ' + d.total + ' correct"><span style="width:' + d.percent + '%"></span></div><div class="domain-num">' + d.correct + ' of ' + d.total + ' correct</div></li>').join('');
    $('results-body').innerHTML =
      '<p class="lead">' + esc(G.label) + ' assessment</p>' +
      '<div class="total-card"><div class="total-big">' + r.correct + '<span> / ' + r.total + '</span></div><div class="total-pct">' + r.percent + '% correct</div>' +
        (r.unanswered ? '<div class="total-note">' + r.unanswered + ' left blank</div>' : '') + '</div>' +
      '<div class="score-row">' + sub('Math', r.math, 'math') + sub('Reading and language', r.ela, 'ela') + '</div>' +
      '<h2 class="section-title">Math by skill area</h2><ul class="domains">' + dom('math') + '</ul>' +
      '<h2 class="section-title">Reading and language by skill area</h2><ul class="domains">' + dom('ela') + '</ul>' +
      '<p class="fineprint">This short check-in shows how a child did on 20 questions. It is not a diagnosis or a full evaluation.</p>';
    show('results', 'results-title');
    say('All done. You got ' + r.correct + ' out of ' + r.total + '.');
  }
  $('btn-again').onclick = () => { engine.reset(); chosenGrade = null; $('btn-start').disabled = true; buildWelcome(); route(); };

  function route() {
    const st = engine.getState();
    if (st.status === 'inProgress') renderQuestion();
    else if (st.status === 'review') renderReview();
    else if (st.status === 'submitted') renderResults();
    else { show('welcome', 'welcome-title'); }
  }

  buildWelcome();
  show('welcome');
  if (canSpeak) document.documentElement.classList.add('can-speak');
  window.VA_APP = { engine, route };
})();
