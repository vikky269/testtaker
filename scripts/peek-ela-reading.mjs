import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

const file = path.resolve(
  'NEW QUESTION BANK/ELA/GRADE 1/Grade_1_Reading_Comprehension_Question_Bank.pdf'
);
const parser = new PDFParse({ data: fs.readFileSync(file) });
const result = await parser.getText();
await parser.destroy();
console.log(result.text.slice(0, 5500));
console.log('\n---KEY TAIL---\n');
console.log(result.text.slice(-1800));
