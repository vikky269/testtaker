import fs from 'fs';
import { PDFParse } from 'pdf-parse';

async function peek(p) {
  const parser = new PDFParse({ data: fs.readFileSync(p) });
  const r = await parser.getText();
  await parser.destroy();
  const text = r.text || '';
  const lines = text
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  console.log('\n====', p.split(/[/\\]/).pop());
  console.log('chars', text.length, 'lines', lines.length);

  const keyIdxs = [];
  lines.forEach((l, i) => {
    if (/answer key/i.test(l)) keyIdxs.push([i, l]);
  });
  console.log('answer key lines:', keyIdxs);

  // sample question shapes
  const qLines = lines.filter((l) => /^\d+[\.\)]\s/.test(l) || /^\d+\s+[A-D]\b/.test(l));
  console.log('numbered-ish lines sample:', qLines.slice(0, 8));
  console.log('option sample:', lines.filter((l) => /^[A-D][\.\)]\s/.test(l)).slice(0, 6));

  const lastKey = [...lines].map((l, i) => [/answer key/i.test(l), i, l]).filter((x) => x[0]).pop();
  if (lastKey) {
    console.log('TAIL FROM KEY:');
    console.log(lines.slice(lastKey[1], lastKey[1] + 40).join('\n'));
  }

  // body difficulty headers
  console.log(
    'diff headers',
    lines.filter((l) => /^(Easy|Medium|Hard|EASY|MEDIUM|HARD)\b/.test(l)).slice(0, 10)
  );

  // first 30 lines
  console.log('HEAD:\n' + lines.slice(0, 30).join('\n'));
}

const files = [
  'NEW QUESTION BANK/ELA/GRADE 6/Grade_6_Informational_Text_and_Research_Skills_Question_Bank.pdf',
  'NEW QUESTION BANK/ELA/GRADE 5/Grade_5_Informational_Text_and_Research_Skills_Question_Bank.pdf',
  'NEW QUESTION BANK/ELA/GRADE 5/Grade_5_Literature_and_Reading_Comprehension_Question_Bank.pdf',
  'NEW QUESTION BANK/ELA/GRADE 6/Grade_6_Literature_and_Reading_Comprehension_Question_Bank.pdf',
];

for (const f of files) await peek(f);
