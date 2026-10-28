/**
 * Writes the illustrated Pre-K Math and Kindergarten Math/ELA banks to a PDF.
 */
import fs from 'fs';
import { jsPDF } from 'jspdf';

function parseItems(source) {
  const re = /item\(\s*'([^']+)',\s*(\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'((?:\\'|[^'])*)',\s*\[([^\]]*)\],\s*'((?:\\'|[^'])*)',\s*'((?:\\'|[^'])*)'\s*\)/g;
  const items = [];
  let match;
  while ((match = re.exec(source))) {
    const options = [...match[7].matchAll(/'((?:\\'|[^'])*)'/g)].map((m) => m[1]);
    items.push({
      group: match[1],
      number: Number(match[2]),
      topic: match[3],
      difficulty: match[4],
      stimulus: match[5],
      question: match[6],
      options,
      answer: match[8],
      solution: match[9],
    });
  }
  return items;
}

function label(option) {
  return option.replace(/^(pic|shape|letter):/, '');
}

function plural(name, count) {
  const n = String(count);
  return n === '1' ? `1 ${name}` : `${n} ${name}s`;
}

function pictureNote(stimulus) {
  const parts = stimulus.replace(/^kvis:/, '').split(':');
  const [kind, a, b, c] = parts;
  if (kind === 'count') return `Picture: ${plural(a, b)}.`;
  if (kind === 'add') return `Picture: ${plural(a, b)} plus ${plural(a, c)}.`;
  if (kind === 'sub') return `Picture: ${plural(a, b)}, with ${c} crossed out.`;
  if (kind === 'compare') return `Picture: Group A has ${plural(a, b)}. Group B has ${plural(a, c)}.`;
  if (kind === 'length') return `Picture: Row A has ${a || '3'} blocks. Row B has ${b || '6'} blocks.`;
  if (kind === 'next') return `Picture: number cards ${a}, ${b}, ${c}, then a blank.`;
  if (kind === 'ten') return `Picture: one full ten-frame and ${b} single blocks.`;
  if (kind === 'pattern') return `Picture: ${a.split(',').join(', ')}, then a blank.`;
  if (kind === 'ref') return `Picture: a ${a}.`;
  if (kind === 'after') return `Picture: the letter ${a}, then a blank card.`;
  if (kind === 'story' && a === 'rain') return 'Picture: a rain cloud.';
  if (kind === 'story' && a === 'bird') return 'Picture: a bird sitting in a tree.';
  if (kind === 'story' && a === 'seed') return 'Picture: a seed in the soil.';
  if (kind === 'story' && a === 'boots') return 'Picture: boots splashing in a puddle.';
  if (kind === 'size') return 'Picture: Ball A is small. Ball B is big.';
  if (kind === 'listen') return 'Picture: the answer choices are the pictures. An adult reads the question.';
  if (kind === 'tap') return 'Picture: the answer choices are the pictures.';
  return '';
}

const kinder = parseItems(fs.readFileSync('app/data/kindergartenVisual.ts', 'utf8'));
const early = parseItems(fs.readFileSync('app/data/earlyMathVisual.ts', 'utf8'));
const prek = early.filter((q) => q.group === 'pre-k');
const kMath = kinder.filter((q) => q.group === 'math');
const kEla = kinder.filter((q) => q.group === 'ela');

if (prek.length !== 20 || kMath.length !== 20 || kEla.length !== 20) {
  throw new Error(`Unexpected counts ${prek.length} ${kMath.length} ${kEla.length}`);
}

const doc = new jsPDF({ unit: 'pt', format: 'letter' });
const margin = 54;
const width = 612 - margin * 2;
let y = 0;

function newPage() {
  doc.addPage();
  y = margin;
}

function need(height) {
  if (y + height > 742) newPage();
}

function write(text, size, style, color, gap) {
  doc.setFont('times', style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, width);
  need(lines.length * (size + 3) + gap);
  doc.text(lines, margin, y);
  y += lines.length * (size + 3) + gap;
}

doc.setFillColor(34, 92, 46);
doc.rect(0, 0, 612, 792, 'F');
doc.setTextColor(255, 255, 255);
doc.setFont('times', 'bold');
doc.setFontSize(28);
doc.text('Pre-K and Kindergarten', margin, 250);
doc.text('Question Bank', margin, 286);
doc.setFont('times', 'normal');
doc.setFontSize(13);
const intro = doc.splitTextToSize(
  'These are the illustrated questions from the latest integration. A quiz draws 10 questions from each section. Pre-K ELA is not in this file. It still uses the earlier question bank.',
  width
);
doc.text(intro, margin, 330);
doc.setFontSize(12);
doc.text('Pre-K Mathematics: 20 questions', margin, 420);
doc.text('Kindergarten Mathematics: 20 questions', margin, 440);
doc.text('Kindergarten ELA: 20 questions', margin, 460);

const sections = [
  ['Pre-K Mathematics', prek],
  ['Kindergarten Mathematics', kMath],
  ['Kindergarten ELA', kEla],
];

for (const [title, questions] of sections) {
  newPage();
  write(title, 20, 'bold', [34, 92, 46], 16);
  for (const q of questions) {
    need(88);
    write(`${q.number}.  ${q.question}`, 12, 'bold', [20, 20, 20], 4);
    write(`${q.topic}  ·  ${q.difficulty}`, 10, 'italic', [90, 90, 90], 4);
    const note = pictureNote(q.stimulus);
    if (note) write(note, 11, 'italic', [50, 70, 40], 4);
    q.options.forEach((option, index) => {
      const letter = String.fromCharCode(65 + index);
      const mark = option === q.answer ? '    correct' : '';
      write(`${letter}.  ${label(option)}${mark}`, 11, 'normal', [30, 30, 30], 2);
    });
    y += 10;
  }
}

const out = 'PreK-Kindergarten-Question-Bank.pdf';
fs.writeFileSync(out, Buffer.from(doc.output('arraybuffer')));
console.log(out, doc.getNumberOfPages(), 'pages');
