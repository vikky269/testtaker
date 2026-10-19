import fs from 'fs';
import { PDFParse } from 'pdf-parse';

async function peek(rel) {
  const parser = new PDFParse({ data: fs.readFileSync(rel) });
  const result = await parser.getText();
  await parser.destroy();
  console.log('\n========', rel, 'len', result.text.length);
  console.log(result.text.slice(0, 3500));
  console.log('---KEY---');
  const idx = result.text.search(/Answer Key/i);
  console.log(idx >= 0 ? result.text.slice(idx, idx + 1200) : 'NO KEY');
}

await peek('NEW QUESTION BANK/ELA/GRADE 2/Grade_2_Grammar_Language_and_Vocabulary_Question_Bank.pdf');
await peek('NEW QUESTION BANK/ELA/GRADE 6/Grade_6_Grammar_Language_and_Vocabulary_Question_Bank.pdf');
await peek('NEW QUESTION BANK/ELA/GRADE 5/Grade_5_Topic_5_Poetry_Figurative_Language_and_Literary_Devices_Question_Bank.pdf');
await peek('NEW QUESTION BANK/ELA/GRADE 7/Grade_7_Literature_and_Reading_Comprehension_Question_Bank.pdf');
