import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import path from 'path';

// Load the TS util via dynamic transpile isn't available — duplicate minimal check
import katex from 'katex';

function plainMathToLatex(input) {
  let s = input.trim();
  s = s.replace(/×/g, ' \\times ');
  s = s.replace(/\)\s*[xX]\s*\(/g, ') \\times (');
  s = s.replace(/\)\s*[xX]\s+(?=\d)/g, ') \\times ');
  s = s.replace(/(?<=\d)\s+[xX]\s+(?=\d|\()/g, ' \\times ');
  s = s.replace(/\s+[xX]\s+/g, ' \\times ');
  s = s.replace(
    /(^|[^0-9.\\])(-?\d+)\s+(\d+)\s*\/\s*(\d+)(?![0-9])/g,
    (_, pre, whole, num, den) => `${pre}${whole}\\tfrac{${num}}{${den}}`
  );
  s = s.replace(
    /\(\s*(-?)(\d+)\s*\/\s*(-?)(\d+)\s*\)/g,
    (_m, s1, a, s2, b) => `\\left(${s1}\\frac{${a}}{${s2}${b}}\\right)`
  );
  s = s.replace(
    /(?<!\\(?:t)?frac\{[^}]{0,40})(?<![\w}])(-?\d+)\s*\/\s*(-?\d+)(?![0-9])/g,
    (_, a, b) => `\\frac{${a}}{${b}}`
  );
  s = s.replace(/\^\((-?\d+)\)/g, '^{($1)}');
  s = s.replace(/\^(-?\d+)/g, '^{$1}');
  s = s.replace(
    /\[\s*([^\]]+?)\s*\]\s*\/\s*\[\s*([^\]]+?)\s*\]/g,
    (_m, num, den) => `\\dfrac{${num.trim()}}{${den.trim()}}`
  );
  return s.replace(/\s+/g, ' ').trim();
}

const samples = [
  '[ (-1 1/2)^3 - 1/8 ] / [ (-2/3) x (-3/4) ]',
  '1/2(4x - 6) + 3/4(8x + 12)',
  '(-4)^2 - (-3)^3',
  '-1 1/2',
];

for (const s of samples) {
  const L = plainMathToLatex(s);
  console.log('\n', s, '\n=>', L);
  try {
    katex.renderToString(L, { throwOnError: true, displayMode: true });
    console.log('KaTeX OK');
  } catch (e) {
    console.log('KaTeX FAIL', e.message);
  }
}
