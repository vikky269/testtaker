import { formatMathHtml } from '../app/utils/formatMathText';

const samples = [
  'What is the diameter of a circle with a circumference of 78.5 cm? (Use pi = 3.14)',
  'Evaluate: [ (-1 1/2)^3 - 1/8 ] / [ (-2/3) x (-3/4) ]',
  '(-4)^2 - (-3)^3',
  '1/2',
  '8x + 3',
  'Simplify: 1/2(4x - 6) + 3/4(8x + 12)',
];

for (const s of samples) {
  const h = formatMathHtml(s);
  const plain = h.replace(/<[^>]+>/g, '');
  console.log('\nIN:', s);
  console.log('display katex:', h.includes('katex-display'));
  console.log('has diameter phrase:', plain.includes('diameter of a'));
  console.log('glued Whatis:', plain.includes('Whatis'));
  console.log('OUT plain:', plain.slice(0, 140));
}
