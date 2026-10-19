/**
 * Correct picture cues and a few wordings in the boss assessment.
 * Visuals that pointed at a wrong choice are replaced. Answer strings stay the same.
 */
import fs from 'fs';

const patches = {
  'Pre-K|ELA|1': { visuals: [] },
  'Pre-K|ELA|3': { visuals: [] },
  'Pre-K|ELA|7': { visuals: ['🐱'] },
  'Pre-K|ELA|8': { visuals: ['🐝'] },
  'Pre-K|ELA|9': { visuals: [] },
  'Pre-K|ELA|10': { visuals: ['☀️'] },
  'Pre-K|ELA|11': { visuals: ['⚽'] },
  'Pre-K|ELA|19': { visuals: ['🥄', '🍴'] },
  'Pre-K|ELA|24': { visuals: ['🐟'] },
  'Pre-K|ELA|25': { visuals: [] },
  'Pre-K|ELA|29': { visuals: [] },
  'Pre-K|ELA|42': { visuals: ['🐔'] },
  'Pre-K|ELA|47': { visuals: [] },
  'Pre-K|Math|13': { prompt: 'Which number is the biggest?' },
  'Pre-K|Math|14': { prompt: 'Which number is the smallest?' },
  'Pre-K|Math|16': { visuals: [] },
  'Pre-K|Math|34': { visuals: ['△', '○', '□'] },
  'Kindergarten|ELA|5': { visuals: [] },
  'Kindergarten|ELA|6': { visuals: ['☀️'] },
  'Kindergarten|ELA|8': { visuals: [] },
  'Kindergarten|ELA|9': { visuals: [] },
  'Kindergarten|ELA|21': { visuals: ['👟'] },
  'Kindergarten|ELA|23': { options: ['map', 'xqz', 'mpt', 'ptl'] },
  'Kindergarten|ELA|42': { visuals: ['🛏️'] },
  'Kindergarten|ELA|48': { visuals: ['🌙'] },
  'Kindergarten|Math|31': { visuals: ['🔵', '🔺', '▭', '⬡'] },
  'Kindergarten|Math|33': { visuals: ['🥫'] },
  'Grade 1|ELA|6': { visuals: ['🎂'] },
  'Grade 1|ELA|11': { visuals: [] },
  'Grade 1|ELA|14': { visuals: [] },
  'Grade 1|ELA|22': { prompt: 'We visited on monday. Which word still needs a capital letter?' },
  'Grade 1|ELA|29': { visuals: [] },
  'Grade 1|ELA|32': { visuals: ['🐶'] },
  'Grade 1|ELA|34': { visuals: [] },
  'Grade 1|ELA|49': { visuals: [] },
  'Grade 1|Math|42': { visuals: ['🐱', '🐶', '🐟'] },
  'Grade 1|Math|43': { visuals: ['🐶', '🐟'] },
  'Grade 1|Math|44': { visuals: ['🔺', '▭', '⬠', '⬡'] },
  'Grade 1|Math|48': { visuals: ['🔺', '🔺'] },
};

const htmlPath = 'new picture based.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const start = html.indexOf('const sections = ');
const end = html.indexOf(';\nconst gradeEl');
if (start < 0 || end < 0) throw new Error('Could not find sections');
const sections = JSON.parse(html.slice(start + 'const sections = '.length, end));

const gradeKey = { 'Pre-K': 'pre-k', Kindergarten: 'kindergarten', 'Grade 1': '1' };
const boss = JSON.parse(fs.readFileSync('app/data/pictureBoss.json', 'utf8'));
let applied = 0;

for (const section of sections) {
  const subject = section.subject.toLowerCase();
  const bank = boss[gradeKey[section.grade]][subject];
  for (const q of section.questions) {
    const patch = patches[`${section.grade}|${section.subject}|${q.number}`];
    if (!patch) continue;
    const item = bank[q.number - 1];
    if (item.correctAnswer !== q.options[q.options.indexOf(item.correctAnswer)]) {
      throw new Error(`Answer missing before patch ${q.number}`);
    }
    if (patch.prompt) q.prompt = patch.prompt;
    if (patch.options) q.options = patch.options;
    if (patch.visuals) q.visuals = patch.visuals;
    if (!q.options.includes(item.correctAnswer)) {
      throw new Error(`Patch dropped the answer for ${section.grade} ${section.subject} ${q.number}: ${item.correctAnswer}`);
    }
    item.question = q.prompt;
    item.options = q.options;
    item.stimulus = (q.visuals || []).join(' ');
    item.correctAnswer = q.options[q.options.indexOf(item.correctAnswer)];
    applied++;
  }
}

if (applied !== Object.keys(patches).length) {
  throw new Error(`Applied ${applied} of ${Object.keys(patches).length}`);
}

fs.writeFileSync(htmlPath, html.slice(0, start) + 'const sections = ' + JSON.stringify(sections) + html.slice(end));
fs.writeFileSync('app/data/pictureBoss.json', JSON.stringify(boss));
console.log('patched', applied);
console.log('K math 31', boss.kindergarten.math[30].stimulus, boss.kindergarten.math[30].question);
console.log('G1 math 44', boss['1'].math[43].stimulus);
console.log('G1 ela 22', boss['1'].ela[21].question, boss['1'].ela[21].correctAnswer);
