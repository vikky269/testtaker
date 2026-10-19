/**
 * Rewrites kindergarten items that do not stand alone:
 * missing comparisons, blank sequences, and number tiles that are not a picture.
 */
import fs from 'fs';

const math = {
  3: { prompt: 'Which number means six?' },
  7: { prompt: 'Start at 6. What are the next three numbers?', visuals: [] },
  8: { prompt: 'Count by tens. What number comes next after 10, 20, 30?' },
  9: { prompt: 'Look at 6, 9, and 0. Which number is the greatest?' },
  10: { prompt: 'Look at 3, 7, and 10. Which number is the smallest?' },
  12: { prompt: 'Which group has more counters?' },
  13: { prompt: 'Which group has fewer stars?' },
  18: { prompt: 'Three ducks are in a pond. Two more ducks join them. How many ducks are there now?', visuals: [] },
  19: { prompt: 'There are six blocks. One block is taken away. How many blocks are left?', visuals: [] },
  20: { prompt: 'Which pair of numbers adds up to 5?' },
  21: { prompt: 'What number goes in the blank? 4 + __ = 6' },
  22: { prompt: 'What number goes in the blank? 3 + __ = 5' },
  23: { prompt: 'Which addition equals 5?' },
  24: { prompt: 'What number do you add to 3 to make 7?' },
  27: { prompt: 'Which number is a teen number, from 10 to 19?' },
  28: { prompt: 'One ten and three ones make which number?', visuals: [] },
  29: { prompt: 'Which group shows 12 as one ten and two ones?', visuals: [] },
  36: { prompt: 'Which row of cubes is longer?' },
  37: { prompt: 'Which container holds the most water?' },
  38: { visuals: [] },
  39: { prompt: 'What shape comes next in this pattern? ▲ ▲ ○ ▲ ▲ __' },
  40: { prompt: 'You have five crayons. You get two more crayons. How many crayons do you have now?', visuals: [] },
  41: { prompt: 'Eight birds are sitting together. Three birds fly away. How many birds are left?', visuals: [] },
  42: { prompt: 'What number is missing? 1, 2, __, 4, 5' },
  43: { prompt: 'Which number is smaller than 10 and closest to 10?' },
  44: { prompt: 'There are 3 objects, and 2 more are added. Which equation matches?', visuals: [] },
  45: { prompt: 'There are 5 objects, and 2 are taken away. Which equation matches?', visuals: [] },
  47: { prompt: 'Which two groups make 6 altogether?', visuals: [] },
  48: { prompt: 'Look at 13, 18, and 8. Which number is the greatest?' },
  49: { prompt: 'One plate has 4 crackers. Another plate has 3 crackers. How many crackers are there altogether?' },
  50: { visuals: [] },
};

const ela = {
  5: { prompt: 'Which word begins with the m sound?' },
  6: { prompt: 'Which word begins with the s sound?' },
  7: { prompt: 'Which word ends with the t sound?' },
  8: { prompt: 'Which pair of words rhymes?' },
  9: { prompt: 'Which other pair of words rhymes?' },
  12: { prompt: 'Listen to the sounds s, u, n. Which word do they make?' },
  13: { prompt: 'Listen to the sounds c, a, t. Which word do they make?' },
  14: { prompt: 'What is the first sound in the word pig?', options: ['p', 'g', 'i', 't'], correctAnswer: 'p' },
  15: { prompt: 'What is the last sound in the word map?', options: ['m', 'a', 'p', 's'], correctAnswer: 'p' },
  22: { visuals: ['🍎'] },
  23: { prompt: 'Which of these is a real word you can read?' },
  24: { visuals: ['☀️'] },
  33: { prompt: 'The sky grew dark and rain tapped on the window. What was the weather doing?' },
  34: { visuals: ['🐟'] },
  35: { prompt: 'Which word describes how something feels?' },
  39: { prompt: 'Which word do you see most often when you read?' },
  40: { prompt: 'Cake, car, sun, and cup. Which word begins with a different sound?' },
  50: { prompt: 'Which word has the short e sound, like in egg?' },
};

const htmlPath = 'new picture based.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const start = html.indexOf('const sections = ');
const end = html.indexOf(';\nconst gradeEl');
const sections = JSON.parse(html.slice(start + 'const sections = '.length, end));
const boss = JSON.parse(fs.readFileSync('app/data/pictureBoss.json', 'utf8'));

function apply(sectionName, map) {
  const section = sections.find((s) => s.grade === 'Kindergarten' && s.subject === sectionName);
  const bank = boss.kindergarten[sectionName.toLowerCase()];
  for (const [num, patch] of Object.entries(map)) {
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
      throw new Error(`${sectionName} ${num} lost answer ${item.correctAnswer}`);
    }
  }
}

apply('Math', math);
apply('ELA', ela);

const seen = new Set();
for (const subject of ['math', 'ela']) {
  for (const q of boss.kindergarten[subject]) {
    if (seen.has(q.question)) throw new Error('Duplicate prompt: ' + q.question);
    seen.add(q.question);
  }
}

fs.writeFileSync(htmlPath, html.slice(0, start) + 'const sections = ' + JSON.stringify(sections) + html.slice(end));
fs.writeFileSync('app/data/pictureBoss.json', JSON.stringify(boss));

for (const subject of ['math', 'ela']) {
  console.log('\n' + subject);
  boss.kindergarten[subject].forEach((q, i) => {
    console.log(String(i + 1).padStart(2, '0') + ' | ' + q.question + ' => ' + q.correctAnswer);
  });
}
