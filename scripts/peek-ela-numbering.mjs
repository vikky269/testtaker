import fs from 'fs';
import { PDFParse } from 'pdf-parse';

async function check(p, label) {
  const parser = new PDFParse({ data: fs.readFileSync(p) });
  const r = await parser.getText();
  await parser.destroy();
  const lines = r.text
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const sectionHeaders = lines.filter((l) =>
    /^(Easy|Medium|Hard)\b/i.test(l) || /Questions\s*\(/i.test(l)
  );
  console.log('\n' + label);
  console.log('  headers:', sectionHeaders.slice(0, 12));

  for (const name of ['Medium', 'Hard']) {
    const idx = lines.findIndex((l) => new RegExp(`^${name}\\s+Questions`, 'i').test(l));
    if (idx >= 0) {
      console.log(`  after ${name} Questions:`, lines.slice(idx, idx + 4).map((l) => l.slice(0, 80)));
    } else {
      const idx2 = lines.findIndex((l) => new RegExp(`^${name}$`, 'i').test(l));
      console.log(`  ${name} Questions header missing; bare ${name} at`, idx2);
    }
  }

  const nums = [];
  for (const l of lines) {
    const m = l.match(/^(\d+)\.\s/);
    if (m) nums.push(Number(m[1]));
  }
  console.log('  q nums: count', nums.length, 'max', nums.length ? Math.max(...nums) : null, 'has1', nums.includes(1), 'has51', nums.includes(51), 'has101', nums.includes(101));
}

const files = [
  ['G1', 'NEW QUESTION BANK/ELA/GRADE 1/Grade_1_Grammar_and_Sentence_Structure_Question_Bank.pdf'],
  ['G2', 'NEW QUESTION BANK/ELA/GRADE 2/Grade_2_Grammar_Language_and_Vocabulary_Question_Bank.pdf'],
  ['G3', 'NEW QUESTION BANK/ELA/GRADE 3/Grade_3_Grammar_Language_and_Vocabulary_Question_Bank.pdf'],
  ['G4', 'NEW QUESTION BANK/ELA/GRADE 4/Grade_4_Grammar_Language_and_Vocabulary_Question_Bank.pdf'],
  ['G5', 'NEW QUESTION BANK/ELA/GRADE 5/Grade_5_Grammar_Language_and_Vocabulary_Question_Bank.pdf'],
  ['G6', 'NEW QUESTION BANK/ELA/GRADE 6/Grade_6_Grammar_Language_and_Vocabulary_Question_Bank.pdf'],
  ['G7', 'NEW QUESTION BANK/ELA/GRADE 7/Grade_7_Literature_and_Reading_Comprehension_Question_Bank.pdf'],
];

for (const [label, p] of files) {
  await check(p, label);
}
