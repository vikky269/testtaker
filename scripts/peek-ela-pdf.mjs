import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

const file = path.resolve(
  'NEW QUESTION BANK/ELA/GRADE 1/Grade_1_Grammar_and_Sentence_Structure_Question_Bank.pdf'
);
const buf = fs.readFileSync(file);
const parser = new PDFParse({ data: buf });
const result = await parser.getText();
await parser.destroy();
console.log('chars', result.text.length);
console.log('---TEXT START---');
console.log(result.text.slice(0, 5000));
console.log('---END---');
console.log(result.text.slice(-2500));
