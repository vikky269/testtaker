/** Smoke-test draw helpers against converted JSON (no Next runtime). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const banks = path.join(root, 'app', 'data', 'questionBanks');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawBalanced(pool, count) {
  const mix = { easy: 4, medium: 3, hard: 3 };
  const used = new Set();
  const picked = [];
  for (const d of ['easy', 'medium', 'hard']) {
    const candidates = shuffle(pool.filter((q) => q.difficulty === d && !used.has(q.id)));
    for (const q of candidates) {
      if (picked.filter((p) => p.difficulty === d).length >= mix[d]) break;
      used.add(q.id);
      picked.push(q);
    }
  }
  for (const q of shuffle(pool)) {
    if (picked.length >= count) break;
    if (used.has(q.id)) continue;
    used.add(q.id);
    picked.push(q);
  }
  return shuffle(picked.slice(0, count));
}

const math5 = JSON.parse(fs.readFileSync(path.join(banks, 'math/grade-5.json'), 'utf8'));
const sci5 = JSON.parse(fs.readFileSync(path.join(banks, 'science/grade-5.json'), 'utf8'));
const phys = JSON.parse(fs.readFileSync(path.join(banks, 'science/physics.json'), 'utf8'));
const chem = JSON.parse(fs.readFileSync(path.join(banks, 'science/chemistry.json'), 'utf8'));
const bio = JSON.parse(fs.readFileSync(path.join(banks, 'science/biology.json'), 'utf8'));

const m = drawBalanced(math5, 10);
const s = drawBalanced(sci5, 10);
const hs = [
  ...drawBalanced(phys, 4),
  ...drawBalanced(chem, 3),
  ...drawBalanced(bio, 3),
];

console.log('Grade 5 math draw:', m.length, m.map((q) => q.difficulty));
console.log('Grade 5 science draw:', s.length, s.map((q) => q.difficulty));
console.log('HS science draw:', hs.length, hs.map((q) => q.subject || q.id.split('-')[0]));
console.log('All have correctAnswer in options:', [...m, ...s, ...hs].every((q) => q.options.includes(q.correctAnswer)));
