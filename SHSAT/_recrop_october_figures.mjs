/**
 * Re-crop SHSAT October figure/table images that were truncated.
 * Source pages: SHSAT/_preview/october/page-XX.png (1530×1980)
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PAGES = path.join(__dirname, '_preview/october');
const CROPS_DIR = path.join(__dirname, '_preview/october/_crops');
const OUT_PUBLIC = path.join(ROOT, 'public/shsat/math/october');
const OUT_PREVIEW = path.join(__dirname, '_preview/october/_recrop');

fs.mkdirSync(OUT_PREVIEW, { recursive: true });
fs.mkdirSync(OUT_PUBLIC, { recursive: true });

/** Fractions of page: [left, top, right, bottom] */
const CROPS = {
  'q64-figure.png': { page: 'page-04.png', box: [0.1, 0.42, 0.47, 0.64] },
  'q66-table.png': { page: 'page-05.png', box: [0.12, 0.08, 0.46, 0.28] },
  'q75-table.png': { page: 'page-07.png', box: [0.1, 0.05, 0.46, 0.34] },
  'q80-numberline.png': { page: 'page-08.png', box: [0.06, 0.36, 0.5, 0.48] },
  'q89-table.png': { page: 'page-10.png', box: [0.1, 0.36, 0.48, 0.56] },
  'q92-figure.png': { page: 'page-11.png', box: [0.1, 0.08, 0.48, 0.36] },
  'q95-table.png': { page: 'page-11.png', box: [0.54, 0.46, 0.9, 0.64] },
  'q101-numberline.png': { page: 'page-13.png', box: [0.07, 0.09, 0.49, 0.2] },
  'q103-figure.png': { page: 'page-13.png', box: [0.55, 0.09, 0.93, 0.32] },
  'q106-table.png': { page: 'page-14.png', box: [0.54, 0.08, 0.9, 0.3] },
};

/** Keep prior good crops as-is (already complete). */
const COPY_FROM_CROPS = [
  'q100-figure.png',
  'q107-optA.png',
  'q107-optB.png',
  'q107-optC.png',
  'q107-optD.png',
];

async function cropOne(name, { page, box }) {
  const src = path.join(PAGES, page);
  const meta = await sharp(src).metadata();
  const [l, t, r, b] = box;
  const left = Math.round(l * meta.width);
  const top = Math.round(t * meta.height);
  const width = Math.round((r - l) * meta.width);
  const height = Math.round((b - t) * meta.height);

  const buf = await sharp(src)
    .extract({ left, top, width, height })
    .png()
    .toBuffer();

  await fs.promises.writeFile(path.join(OUT_PREVIEW, name), buf);
  await fs.promises.writeFile(path.join(OUT_PUBLIC, name), buf);
  console.log(`crop  ${name.padEnd(22)} ← ${page}  ${width}x${height}`);
}

async function copyOne(name) {
  const src = path.join(CROPS_DIR, name);
  const buf = await fs.promises.readFile(src);
  await fs.promises.writeFile(path.join(OUT_PREVIEW, name), buf);
  await fs.promises.writeFile(path.join(OUT_PUBLIC, name), buf);
  const meta = await sharp(buf).metadata();
  console.log(`copy  ${name.padEnd(22)} ← _crops  ${meta.width}x${meta.height}`);
}

async function main() {
  for (const [name, cfg] of Object.entries(CROPS)) {
    await cropOne(name, cfg);
  }
  for (const name of COPY_FROM_CROPS) {
    await copyOne(name);
  }
  console.log('\nDone → public/shsat/math/october/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
