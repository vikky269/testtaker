/**
 * Completes Pre-K and Grade 1 items that do not stand alone.
 * Answer strings stay the same unless an option itself is rewritten.
 */
import fs from 'fs';

const patches = {
  'Pre-K|Math|6': { prompt: 'Which group has more dots?' },
  'Pre-K|Math|7': { prompt: 'Which group has fewer stars?' },
  'Pre-K|Math|10': { prompt: 'Which number matches these three dots? ● ● ●' },
  'Pre-K|Math|13': { prompt: 'Look at 2, 4, and 0. Which number is the biggest?' },
  'Pre-K|Math|14': { prompt: 'Look at 1, 3, 4, and 5. Which number is the smallest?' },
  'Pre-K|Math|15': { prompt: 'You have two dots and get one more. How many dots do you have now?', visuals: [] },
  'Pre-K|Math|16': { prompt: 'There are four crackers. One is eaten. How many crackers are left?' },
  'Pre-K|Math|18': { visuals: [] },
  'Pre-K|Math|19': { visuals: [] },
  'Pre-K|Math|20': { prompt: 'What comes next in this pattern? ● ▲ ● ▲ ● __' },
  'Pre-K|Math|21': { prompt: 'What comes next in this pattern? ★ ★ ○ ★ ★ __' },
  'Pre-K|Math|22': { prompt: 'Which of these lines is longer?' },
  'Pre-K|Math|23': { prompt: 'Which object is heavier?' },
  'Pre-K|Math|24': { prompt: 'Which container can hold the most water?' },
  'Pre-K|Math|30': { visuals: [] },
  'Pre-K|Math|31': { prompt: 'You have one apple and get one more. How many apples do you have now?', visuals: ['🍎'] },
  'Pre-K|Math|32': { prompt: 'Two ducks are in a pond. One more duck joins them. How many ducks are there now?', visuals: [] },
  'Pre-K|Math|35': { visuals: [] },
  'Pre-K|Math|38': { visuals: [] },
  'Pre-K|Math|39': { prompt: 'You cover two of these dots: ● ● ● ●. How many dots can you still see?', visuals: [] },
  'Pre-K|Math|41': { prompt: 'Which of these is taller?' },
  'Pre-K|Math|43': { visuals: [] },
  'Pre-K|Math|44': { prompt: 'What number comes next? 1, 2, 1, 2, __' },
  'Pre-K|Math|46': { visuals: [] },
  'Pre-K|Math|47': { visuals: [] },
  'Pre-K|Math|50': { prompt: 'What comes next in this pattern? ■ ○ ■ ○ __' },

  'Pre-K|ELA|5': { prompt: 'Which letter is a capital letter?' },
  'Pre-K|ELA|12': { prompt: 'Sun, sock, fish, and sand. Which word begins with a different sound?', visuals: [] },
  'Pre-K|ELA|19': { visuals: [] },
  'Pre-K|ELA|28': { prompt: 'Which one is a word?' },
  'Pre-K|ELA|30': { prompt: 'Ball, bat, moon, and book. Which word starts with a different sound?', visuals: [] },
  'Pre-K|ELA|33': { visuals: ['⚽'] },
  'Pre-K|ELA|36': { visuals: ['🐦', '🌳'] },
  'Pre-K|ELA|39': { visuals: ['🍎'] },
  'Pre-K|ELA|43': { visuals: [] },
  'Pre-K|ELA|49': { visuals: [] },

  'Grade 1|Math|4': { prompt: 'Count by tens. What number comes next after 10, 20, 30?' },
  'Grade 1|Math|9': { prompt: 'Look at 46, 64, and 14. Which number is the greatest?' },
  'Grade 1|Math|17': { prompt: 'What number goes in the blank? 8 + __ = 13' },
  'Grade 1|Math|18': { prompt: 'What number goes in the blank? __ − 3 = 6' },
  'Grade 1|Math|19': { prompt: 'Which of these equals 10?' },
  'Grade 1|Math|21': { prompt: 'There are 8 red balloons and 7 blue balloons. How many balloons are there altogether?' },
  'Grade 1|Math|22': { prompt: 'Mia has 15 stickers and gives away 6. How many stickers are left?' },
  'Grade 1|Math|23': { prompt: 'Count by tens. What two numbers come next after 30, 40, 50?' },
  'Grade 1|Math|33': { prompt: 'Which of these equals 5 + 3?' },
  'Grade 1|Math|34': { prompt: 'What number goes in the blank? 6 + __ = 15' },
  'Grade 1|Math|35': { prompt: 'Twelve birds are on a fence. Five fly away and two return. How many birds are left?', visuals: [] },
  'Grade 1|Math|36': { prompt: 'A basket has 9 apples. Three are added and then 2 are taken out. How many apples are left?', visuals: [] },
  'Grade 1|Math|42': { prompt: 'There are 5 cats, 8 dogs, and 3 fish. Which group has the most?' },
  'Grade 1|Math|47': { prompt: 'Which shape can be split into two triangles with one straight line?' },
  'Grade 1|Math|48': {
    prompt: 'Which pair of shapes can be joined to make a rectangle?',
    options: ['Two triangles', 'Two circles', 'A circle and a line', 'Two points'],
    correctAnswer: 'Two triangles',
  },
  'Grade 1|Math|50': { prompt: 'Which pair of equations uses 7, 3, and 10 correctly?', visuals: [] },

  'Grade 1|ELA|1': { prompt: 'Which word begins with st?' },
  'Grade 1|ELA|2': { prompt: 'Which word begins with sh?' },
  'Grade 1|ELA|3': { prompt: 'Which word begins with ch?' },
  'Grade 1|ELA|4': { prompt: 'Which word begins with th?' },
  'Grade 1|ELA|5': { prompt: 'Which word begins with br?' },
  'Grade 1|ELA|12': { prompt: 'Which word ends with nd?' },
  'Grade 1|ELA|24': { prompt: 'She ___ to school each day. Which word fits?' },
  'Grade 1|ELA|25': { prompt: 'Maya and I read. ___ like stories. Which word fits?' },
  'Grade 1|ELA|36': { prompt: 'Which question asks why someone did something?' },
  'Grade 1|ELA|40': { prompt: 'We ___ our books yesterday. Which word fits?' },
  'Grade 1|ELA|41': { prompt: 'Which word begins with cl?' },
  'Grade 1|ELA|42': { prompt: 'Which word has the long a sound, like rain?' },
  'Grade 1|ELA|48': { visuals: [] },
};

const htmlPath = 'new picture based.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const start = html.indexOf('const sections = ');
const end = html.indexOf(';\nconst gradeEl');
const sections = JSON.parse(html.slice(start + 'const sections = '.length, end));
const boss = JSON.parse(fs.readFileSync('app/data/pictureBoss.json', 'utf8'));
const gradeKey = { 'Pre-K': 'pre-k', 'Grade 1': '1' };

for (const [key, patch] of Object.entries(patches)) {
  const [grade, subject, num] = key.split('|');
  const section = sections.find((s) => s.grade === grade && s.subject === subject);
  const bank = boss[gradeKey[grade]][subject.toLowerCase()];
  const q = section.questions[Number(num) - 1];
  const item = bank[Number(num) - 1];
  const previous = item.correctAnswer;
  if (patch.prompt) q.prompt = patch.prompt;
  if (patch.options) q.options = patch.options;
  if (patch.visuals) q.visuals = patch.visuals;
  item.question = q.prompt;
  item.options = q.options;
  item.stimulus = (q.visuals || []).join(' ');
  item.correctAnswer = patch.correctAnswer || previous;
  if (!item.options.includes(item.correctAnswer)) {
    throw new Error(`${key} lost answer ${item.correctAnswer}`);
  }
}

for (const grade of ['pre-k', '1']) {
  const seen = new Set();
  for (const subject of ['math', 'ela']) {
    for (const q of boss[grade][subject]) {
      if (seen.has(q.question)) throw new Error(`${grade} duplicate: ${q.question}`);
      seen.add(q.question);
    }
  }
}

fs.writeFileSync(htmlPath, html.slice(0, start) + 'const sections = ' + JSON.stringify(sections) + html.slice(end));
fs.writeFileSync('app/data/pictureBoss.json', JSON.stringify(boss));
console.log('updated', Object.keys(patches).length);
