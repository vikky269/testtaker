import fs from 'fs';
import { PDFParse } from 'pdf-parse';

async function tail(rel) {
  const parser = new PDFParse({ data: fs.readFileSync(rel) });
  const result = await parser.getText();
  await parser.destroy();
  const t = result.text;
  const matches = [...t.matchAll(/Answer Key/gi)];
  console.log('\n', rel);
  console.log('Answer Key mentions:', matches.length, 'at', matches.map((m) => m.index));
  console.log('TAIL:\n', t.slice(-2200));
}

await tail('NEW QUESTION BANK/ELA/GRADE 5/Grade_5_Topic_5_Poetry_Figurative_Language_and_Literary_Devices_Question_Bank.pdf');
await tail('NEW QUESTION BANK/ELA/GRADE 6/Grade_6_Grammar_Language_and_Vocabulary_Question_Bank.pdf');
await tail('NEW QUESTION BANK/ELA/GRADE 2/Grade_2_Grammar_Language_and_Vocabulary_Question_Bank.pdf');
