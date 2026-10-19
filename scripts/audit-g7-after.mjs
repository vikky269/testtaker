import fs from 'fs';

const before = JSON.parse(fs.readFileSync('scripts/g7-answers-before.json', 'utf8'));
const bank = JSON.parse(fs.readFileSync('app/data/questionBanks/ela/grade-7.json', 'utf8'));
const after = Object.fromEntries(bank.map((q) => [q.id, q.correctAnswer]));

const changed = [];
const missing = [];
const added = [];
for (const id of Object.keys(before)) {
  if (!(id in after)) missing.push(id);
  else if (before[id] !== after[id]) changed.push(`${id}: ${before[id]} -> ${after[id]}`);
}
for (const id of Object.keys(after)) if (!(id in before)) added.push(id);

function strip(q) {
  return String(q.question).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const lit = bank.filter((q) => /Literature/.test(q.topic));
const withP = lit.filter((q) => String(q.question).includes('quiz-passage'));
const bare = lit.filter((q) => !String(q.question).includes('quiz-passage'));
const info = bank.filter((q) => /Informational|Critical/.test(q.topic));
const infoP = info.filter((q) => String(q.question).includes('quiz-passage'));
const bad = bank.filter((q) => !q.options.includes(q.correctAnswer));

const want = [
  'ela-7-literature-and-reading-comprehension-easy-1',
  'ela-7-literature-and-reading-comprehension-medium-51',
  'ela-7-literature-and-reading-comprehension-hard-101',
  'ela-7-literature-and-reading-comprehension-easy-6',
];
const samples = {};
for (const id of want) {
  const q = bank.find((x) => x.id === id);
  samples[id] = q ? { title: q.passageTitle, answer: q.correctAnswer, text: strip(q).slice(0, 280) } : null;
}

const titles = [...new Set(lit.map((q) => q.passageTitle))];
console.log(JSON.stringify({
  total: bank.length,
  answerChanges: changed.length,
  changed: changed.slice(0, 20),
  missingIds: missing,
  addedIds: added,
  lit: `${withP.length}/${lit.length}`,
  bare: bare.map((q) => q.id + ' ' + strip(q).slice(0, 80)),
  info: `${infoP.length}/${info.length}`,
  badAnswers: bad.length,
  titleCount: titles.length,
  titles,
  samples,
}, null, 2));
