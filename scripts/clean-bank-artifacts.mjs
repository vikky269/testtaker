/**
 * One-pass cleanup of converted bank JSON:
 *  - \text{ inches } → inches
 *  - \10 (stripped currency) → $10
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'app', 'data', 'questionBanks');

const UNITS =
  'thousands|thousand|hundreds|hundred|inches|inch|cents|cent|ones|one|tens|ten|feet|foot|dollars|dollar|yards|yard|miles|mile|minutes|minute|hours|hour|seconds|second|pounds|pound|ounces|ounce|grams|gram|liters|liter|cups|cup|quarts|quart|meters|meter|centimeters|centimeter';

function clean(s) {
  return s
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\\$/g, '$')
    .replace(/\\(?=\d)/g, '$')
    .replace(new RegExp(`(\\d)(${UNITS})\\b`, 'gi'), '$1 $2')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function walk(v, stats) {
  if (typeof v === 'string') {
    const next = clean(v);
    if (next !== v) stats.changed++;
    return next;
  }
  if (Array.isArray(v)) return v.map((x) => walk(x, stats));
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, val] of Object.entries(v)) o[k] = walk(val, stats);
    return o;
  }
  return v;
}

function scan(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      scan(full);
      continue;
    }
    if (!name.endsWith('.json') || name === 'manifest.json') continue;
    const stats = { changed: 0 };
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    const next = walk(data, stats);
    if (stats.changed) {
      fs.writeFileSync(full, JSON.stringify(next, null, 2) + '\n');
      console.log(`${path.relative(root, full)}: ${stats.changed} strings`);
    }
  }
}

scan(root);
