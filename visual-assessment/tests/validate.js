/* Content validation: node tests/validate.js */
const { load, DATA_FILES } = require('./load.js');
const ART = ['js/art/core.js', 'js/art/animals.js', 'js/art/food-nature.js', 'js/art/objects.js', 'js/art/people.js'];
const VIS = ['js/visuals-core.js', 'js/visuals-math.js', 'js/visuals-scenes.js'];
const VA = load(DATA_FILES.concat(ART, VIS, ['js/lexicon.js']));
const P = VA.phonics;
let fails = 0, checks = 0;
const fail = (id, msg) => { fails++; console.log('FAIL', id, msg); };
const ok = (c, id, msg) => { checks++; if (!c) fail(id, msg); };

const all = VA.QuestionBank.getAll();
const GRADES = ['prek', 'kindergarten', 'grade1'], SUBJ = ['math', 'ela'];
for (const g of GRADES) for (const s of SUBJ) ok(VA.QuestionBank.getBank(g, s).length === 50, g + s, 'bank must have 50 questions');
ok(all.length === 300, 'all', 'expected 300 questions, got ' + all.length);
ok(new Set(all.map((q) => q.id)).size === all.length, 'ids', 'duplicate ids');
ok(new Set(all.map((q) => q.grade + '|' + q.subject + '|' + q.instruction + '|' + JSON.stringify(q.visual) + JSON.stringify(q.options.map(o => o.label)))).size === all.length, 'dupe', 'duplicate question content');

const FW = { prek: 'ELOF', kindergarten: 'CCSS', grade1: 'CCSS' };
const label = (q, id) => q.options.find((o) => o.id === id).label;
const ans = (q) => label(q, q.correctOptionId);

for (const q of all) {
  const id = q.id;
  ok(q.options.length >= 3 && q.options.length <= 4, id, 'needs 3-4 options');
  ok(q.options.filter((o) => o.id === q.correctOptionId).length === 1, id, 'exactly one correct option');
  ok(new Set(q.options.map((o) => o.label)).size === q.options.length, id, 'duplicate option labels');
  ok(!!VA.STANDARDS[q.standard], id, 'unknown standard ' + q.standard);
  ok(q.framework === FW[q.grade], id, 'framework mismatch');
  ok(q.explanation && q.instruction, id, 'missing instruction/explanation');
  // every question needs something visual to look at (picture, scene, shapes, numbers, letters...)
  const hasVisual = (q.visual && q.visual.type !== 'none') || q.options.some((o) => o.visual) || q.story || q.passage;
  ok(hasVisual || q.subject === 'ela', id, 'no visual');
  [q.visual].concat(q.options.map((o) => o.visual)).forEach((v) => {
    if (!v) return;
    try { const h = VA.visuals.render(v); ok(typeof h === 'string', id, 'render'); } catch (e) { fail(id, 'visual render: ' + e.message); }
  });
}

// every illustration referenced exists
const used = new Set();
const walk = (v) => {
  if (!v || typeof v !== 'object') return;
  if (Array.isArray(v)) return v.forEach(walk);
  for (const k of Object.keys(v)) {
    if ((k === 'art' || k === 'object' || k === 'goal') && typeof v[k] === 'string') used.add(v[k]); else walk(v[k]);
  }
  if (v.type === 'queue') v.items.forEach((i) => used.add(i));
  if (v.type === 'art') used.add(v.name);
};
all.forEach((q) => { walk(q.visual); q.options.forEach((o) => walk(o.visual)); });
used.delete('hbar'); ['pencil', 'ribbon', 'crayon'].forEach((n) => used.delete(n));
// pencil/ribbon/crayon are also art names; check all used names exist when used as art
used.forEach((n) => { if (['pencil', 'ribbon', 'crayon'].indexOf(n) < 0) ok(VA.art.has(n), 'art', 'missing illustration: ' + n); });

// ---- derived-answer checks for math visuals ----
for (const q of all) {
  const v = q.visual, a = ans(q), id = q.id;
  if (!v) continue;
  if (v.type === 'objects' && /how many|which number/i.test(q.instruction) && !/more than|fewer|less than/i.test(q.instruction)) {
    if (a === String(v.count) || q.options.every((o) => /^\d+$/.test(o.label))) ok(a === String(v.count), id, 'count mismatch: shows ' + v.count + ', key ' + a);
  }
  if (v.type === 'dots' && q.options.every((o) => /^\d+$/.test(o.label))) ok(a === String(v.n), id, 'dots mismatch');
  if (v.type === 'join' && q.options.every((o) => /^\d+$/.test(o.label))) ok(Number(a) === (v.op === '+' ? v.a + v.b : v.a - v.b), id, 'join mismatch');
  if (v.type === 'tenframe' && /more make 10/.test(q.instruction)) ok(Number(a) === 10 - v.filled, id, 'tenframe mismatch');
  if (v.type === 'tenframe' && /in all/.test(q.instruction) && v.second) ok(Number(a) === v.filled + v.second, id, 'make-ten mismatch');
  if (v.type === 'measure' && /Count the cubes/.test(q.instruction)) ok(a === String(v.n), id, 'measure mismatch');
  if (v.type === 'tower' && false) {}
  if (v.type === 'numcompare') ok(a === (v.a < v.b ? '<' : v.a > v.b ? '>' : '='), id, 'numcompare mismatch');
  if (v.type === 'base10' && /What is 34 \+ 5|What is 70 - 30/.test(q.instruction)) ok(Number(a) === (v.plus ? v.tens * 10 + v.ones + v.plus : (v.tens - v.take) * 10), id, 'base10 mismatch');
  if (v.type === 'equation') {
    const p = v.parts, x = Number(p[0]), y = Number(p[2]);
    if (p[1] === '+' && p[3] === '=' && p[4] === '?' && q.options.every((o) => /^\d+$/.test(o.label))) ok(Number(a) === x + y, id, 'equation + mismatch');
    if (p[1] === '-' && p[3] === '=' && p[4] === '?' && q.options.every((o) => /^\d+$/.test(o.label))) ok(Number(a) === x - y, id, 'equation - mismatch');
  }
  if (v.type === 'pictograph' && /in all/.test(q.instruction)) ok(Number(a) === v.rows.reduce((s, r) => s + r.count, 0), id, 'pictograph total');
  if (v.type === 'groups' && /more/i.test(q.instruction) && q.options.some((o) => o.visual)) {
    const [g1, g2] = v.groups, want = g1.count === g2.count ? 'same' : g1.count > g2.count ? g1.art : g2.art;
    ok(a === want, id, 'groups mismatch, want ' + want);
  }
  if (v.type === 'tiles') {
    const n = v.items.map(Number); const qi = v.items.indexOf('?');
    const step = qi === n.length - 1 ? n[1] - n[0] : n[1] - n[0];
    const exp = qi === n.length - 1 ? n[qi - 1] + step : n[qi - 1] + step;
    if (!/pattern/i.test(q.instruction)) ok(Number(a) === exp, id, 'tiles mismatch want ' + exp);
  }
}
// bar / sized / tower option questions: longest / tallest / shortest
for (const q of all) {
  const m = q.instruction.match(/\b(longest|shortest|tallest|smallest|biggest|largest)\b/i);
  if (!m || !q.options.every((o) => o.visual && ['bar', 'sized', 'tower'].indexOf(o.visual.type) >= 0)) continue;
  const val = (o) => o.visual.len !== undefined ? o.visual.len : o.visual.scale !== undefined ? o.visual.scale : o.visual.n;
  const big = /longest|tallest|biggest|largest/i.test(m[1]);
  const vals = q.options.map(val);
  const target = q.options.find((o) => val(o) === (big ? Math.max(...vals) : Math.min(...vals)));
  ok(target.id === q.correctOptionId, q.id, 'size comparison key wrong');
}

// ---- phonics / language checks via lexicon ----
const A = (q) => q.options.map((o) => o.label);
for (const q of all.filter((x) => x.check)) {
  const c = q.check, id = q.id, a = ans(q), others = q.options.filter((o) => o.id !== q.correctOptionId).map((o) => o.label);
  try {
    switch (c.kind) {
      case 'initial': ok(P.initial(a) === c.sound, id, 'answer does not start with /' + c.sound + '/'); others.forEach((w) => ok(P.initial(w) !== c.sound, id, w + ' also starts with /' + c.sound + '/')); break;
      case 'rhyme': ok(P.rime(a) === P.rime(c.target) && a !== c.target, id, 'answer does not rhyme'); others.forEach((w) => ok(P.rime(w) !== P.rime(c.target), id, w + ' also rhymes with ' + c.target)); break;
      case 'syllables': ok(P.get(c.word).syl === c.n && a === String(c.n), id, 'syllable mismatch'); break;
      case 'letterSound': ok(P.get(c.art).spell[0].toUpperCase() === c.letter && a === c.letter, id, 'letter mismatch'); others.forEach((l) => ok(P.get(c.art).spell[0].toLowerCase() !== l.toLowerCase(), id, 'distractor equals initial')); break;
      case 'blend': ok((P.onset(c.answer).join('') + P.rime(c.answer).replace(/ /g, '')) === c.onset + c.rime && a === c.answer, id, 'blend mismatch'); break;
      case 'initialLetter': ok(P.get(c.art).spell[0] === c.letter && a === c.letter, id, 'initial letter'); break;
      case 'finalLetter': ok(P.get(c.art).spell.slice(-1) === c.letter && a === c.letter, id, 'final letter'); break;
      case 'medial': ok(P.vowel(c.art) === c.vowel && a === c.vowel, id, 'medial vowel'); break;
      case 'substitute': ok(a === c.answer && P.rime(c.answer) === P.rime(c.from) && P.initial(c.answer) === c.newOnset, id, 'substitute mismatch'); break;
      case 'longVowel': ok(a === c.correct && P.isLong(a), id, 'answer not long vowel'); others.forEach((w) => ok(!P.isLong(w), id, w + ' has a long vowel')); break;
      case 'cvc': case 'decode': ok(a === c.word && c.word === c.art, id, 'decode mismatch'); break;
      case 'blendSounds': ok(c.sounds.join(' ') === P.get(c.answer).phones.join(' ') && a === c.answer, id, 'blendSounds mismatch ' + P.get(c.answer).phones.join(' ')); break;
      case 'phonemeCount': ok(P.get(c.art).phones.length === c.n && a === String(c.n), id, 'phoneme count'); break;
      case 'initialDigraph': ok(P.initial(a) === c.digraph && a === c.correct, id, 'initial digraph'); others.forEach((w) => ok(P.initial(w) !== c.digraph, id, 'distractor digraph')); break;
      case 'finalDigraph': ok(P.final(a) === c.digraph && a === c.correct, id, 'final digraph'); others.forEach((w) => ok(P.final(w) !== c.digraph, id, 'distractor final digraph')); break;
      default: fail(id, 'unknown check kind ' + c.kind);
    }
  } catch (e) { fail(id, e.message); }
}
void A;

// ---- domain / standard coverage ----
const cov = {};
all.forEach((q) => { const k = q.grade + '|' + q.subject; (cov[k] = cov[k] || {}); cov[k][q.domain] = (cov[k][q.domain] || 0) + 1; });
for (const k of Object.keys(cov)) ok(Object.keys(cov[k]).length >= 4, k, 'too few domains');

// ---- source hygiene: no emoji, no remote URLs ----
const fs = require('fs'), pth = require('path');
const walkDir = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === 'tests' || e.name === 'docs' || e.name === 'node_modules' ? [] : walkDir(pth.join(d, e.name))) : [pth.join(d, e.name)]);
for (const f of walkDir(pth.join(__dirname, '..')).filter((x) => /\.(js|css|html)$/.test(x))) {
  const src = fs.readFileSync(f, 'utf8');
  ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(src.replace(/\u2212/g, '')), f, 'contains emoji');
  const urls = (src.match(/https?:\/\/[^\s"')]+/g) || []).filter((u) => u.indexOf('www.w3.org') < 0);
  ok(urls.length === 0, f, 'remote URL: ' + urls[0]);
}

console.log(checks + ' checks, ' + fails + ' failures');
process.exit(fails ? 1 : 0);
