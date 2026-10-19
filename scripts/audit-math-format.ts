/**
 * Audit math banks + sample legacy strings for KaTeX coverage.
 * Run: npx tsx scripts/audit-math-format.ts
 */
import fs from 'fs';
import path from 'path';
import { formatMathHtml } from '../app/utils/formatMathText';

const root = path.resolve('app/data/questionBanks');
const NEEDS_MATH = /(\^|\d\s+\d\s*\/\s*\d|\d\s*\/\s*\d|\(\s*-?\d+\s*\/|\[\s*.+\]\s*\/\s*\[|\sx\s)/;

type Row = { file: string; id?: string; kind: 'q' | 'o'; text: string };

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith('.json') ? [p] : [];
  });
}

const failures: { row: Row; reason: string; out: string }[] = [];
let checked = 0;
let ok = 0;

for (const file of walk(root)) {
  if (file.includes('manifest')) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as any[];
  if (!Array.isArray(data)) continue;
  for (const item of data) {
    const texts: Row[] = [
      { file, id: item.id, kind: 'q', text: item.question },
      ...(item.options || []).map((o: string, i: number) => ({
        file,
        id: `${item.id}-opt${i}`,
        kind: 'o' as const,
        text: o,
      })),
    ];
    for (const row of texts) {
      if (!row.text || !NEEDS_MATH.test(row.text)) continue;
      checked++;
      let out = '';
      try {
        out = formatMathHtml(row.text);
      } catch (e: any) {
        failures.push({ row, reason: `throw: ${e.message}`, out: '' });
        continue;
      }
      const hasKatex = out.includes('katex');
      const stillAsciiMath =
        (/\^/.test(row.text) && out.includes('^') && !hasKatex) ||
        (/\/\s*\[/.test(row.text) && !hasKatex && out.includes('/'));
      if (!hasKatex && NEEDS_MATH.test(row.text)) {
        // Plain prose with a slash date etc. may not need katex — require stronger signal
        const strong = /\^|\d\s+\d\s*\/\s*\d|\[\s*.+\]\s*\/\s*\[|(?:Evaluate|Simplify|Solve).*:/i.test(
          row.text
        );
        if (strong) {
          failures.push({ row, reason: 'no katex class', out: out.slice(0, 120) });
          continue;
        }
      }
      if (stillAsciiMath) {
        failures.push({ row, reason: 'ascii math leaked', out: out.slice(0, 120) });
        continue;
      }
      ok++;
    }
  }
}

// Spot-check the exact screenshot question
const shot = 'Evaluate: [ (-1 1/2)^3 - 1/8 ] / [ (-2/3) x (-3/4) ]';
const shotOut = formatMathHtml(shot);
console.log('Screenshot question katex?', shotOut.includes('katex'), 'caret leaked?', shotOut.includes('^3'));

console.log(`Checked ${checked} math-like strings; OK ${ok}; failures ${failures.length}`);
for (const f of failures.slice(0, 40)) {
  console.log('-', f.reason, '|', f.row.kind, f.row.id, '|', JSON.stringify(f.row.text).slice(0, 100));
  console.log('  out:', JSON.stringify(f.out).slice(0, 100));
}
if (failures.length > 40) console.log(`... +${failures.length - 40} more`);
process.exit(failures.length ? 1 : 0);
