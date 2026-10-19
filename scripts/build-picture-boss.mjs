/**
 * Turns "new picture based.html" into app/data/pictureBoss.json.
 * The HTML has no answer key; correct indexes are the option positions below.
 */
import fs from 'fs';

const html = fs.readFileSync('new picture based.html', 'utf8');
const start = html.indexOf('const sections = ');
const end = html.indexOf(';\nconst gradeEl');
if (start < 0 || end < 0) throw new Error('Could not find sections in the HTML');
const sections = JSON.parse(html.slice(start + 'const sections = '.length, end));

const ANSWERS = {
  'Pre-K|ELA': [
    0,1,0,0,1, 2,1,0,2,1, 0,2,0,1,2, 0,2,1,1,2,
    1,2,1,0,1, 1,2,2,1,2, 0,1,1,0,2, 0,0,2,1,1,
    0,0,2,0,0, 0,0,0,2,2,
  ],
  'Pre-K|Math': [
    0,1,1,1,2, 1,1,0,2,1, 1,1,1,0,1, 1,0,1,2,1,
    1,1,1,0,1, 0,2,1,1,1, 1,1,0,0,2, 0,1,1,1,1,
    1,2,2,0,1, 2,1,0,1,0,
  ],
  'Kindergarten|ELA': [
    0,1,2,2,0, 1,0,0,0,1, 2,0,1,0,2, 0,0,0,0,0,
    0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,2,
    0,0,0,0,0, 0,0,0,0,0,
  ],
  'Kindergarten|Math': [
    1,2,2,1,1, 1,0,1,1,0, 0,1,0,1,1, 1,1,1,1,1,
    1,1,0,1,2, 0,1,0,0,0, 1,0,0,2,0, 1,1,1,1,1,
    1,1,1,0,1, 1,0,1,1,1,
  ],
  'Grade 1|ELA': [
    0,0,0,0,0, 0,0,0,0,0, 0,0,2,0,0, 0,0,0,0,0,
    0,2,0,1,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0,
    0,0,0,0,0, 0,0,0,0,0,
  ],
  'Grade 1|Math': [
    1,1,1,1,1, 1,1,0,1,0, 1,1,1,1,1, 1,1,1,0,1,
    1,1,0,2,0, 1,0,1,0,1, 1,1,0,2,1, 1,1,1,0,1,
    1,1,1,1,1, 0,0,0,1,0,
  ],
};

const gradeKey = { 'Pre-K': 'pre-k', Kindergarten: 'kindergarten', 'Grade 1': '1' };
const out = { 'pre-k': {}, kindergarten: {}, '1': {} };

for (const section of sections) {
  const key = `${section.grade}|${section.subject}`;
  const answers = ANSWERS[key];
  if (!answers || answers.length !== section.questions.length) {
    throw new Error(`${key}: expected ${section.questions.length} answers, got ${answers?.length}`);
  }
  const g = gradeKey[section.grade];
  const subject = section.subject.toLowerCase();
  const seen = new Map();
  out[g][subject] = section.questions.map((q, i) => {
    const correct = answers[i];
    if (correct < 0 || correct > 3) throw new Error(`Bad index ${key} #${i + 1}`);
    const base = q.prompt;
    const n = seen.get(base) || 0;
    seen.set(base, n + 1);
    const question = n ? `${base}${'\u200b'.repeat(n)}` : base;
    const band = q.number <= 20 ? 'easy' : q.number <= 35 ? 'medium' : 'hard';
    return {
      id: `pic-${g}-${subject}-${q.number}`,
      question,
      stimulus: (q.visuals || []).join(' '),
      picture: true,
      options: q.options,
      correctAnswer: q.options[correct],
      difficulty: band,
      topic: section.subject === 'ELA' ? 'ELA' : 'Math',
      subject,
      grade: g,
    };
  });
}

fs.writeFileSync('app/data/pictureBoss.json', JSON.stringify(out));
const spot = [
  ['pre-k', 'ela', 1, 'A'],
  ['pre-k', 'math', 5, '5'],
  ['kindergarten', 'ela', 13, 'cat'],
  ['kindergarten', 'math', 28, '13'],
  ['1', 'ela', 24, 'walks'],
  ['1', 'math', 39, '4:00'],
];
for (const [g, s, n, expect] of spot) {
  const q = out[g][s][n - 1];
  const ok = q.correctAnswer === expect ? 'ok' : 'MISMATCH';
  console.log(ok, g, s, n, q.correctAnswer, '|', q.question.slice(0, 60));
}
for (const g of Object.keys(out)) {
  for (const s of Object.keys(out[g])) {
    console.log(g, s, out[g][s].length);
  }
}
