/**
 * Converts NEW QUESTION BANK/*.docx → app/data/questionBanks/*.json
 * Formats handled:
 *  - Math topic docs: SECTION EASY/MEDIUM/HARD + A) options + Answer: X
 *  - Science K–8: per-question difficulty + Answer Key table at end
 *  - Physics/Chem/Bio: Qn. [Easy] ... + ✔ Correct Answer on option line
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = path.join(root, 'NEW QUESTION BANK');
const outRoot = path.join(root, 'app', 'data', 'questionBanks');
const tmp = path.join(root, '.tmp-docx');

function unpack(docxPath) {
  const base = path.basename(docxPath, '.docx').replace(/[^\w\-]+/g, '_');
  const zip = path.join(tmp, base + '.zip');
  const out = path.join(tmp, base);
  fs.mkdirSync(tmp, { recursive: true });
  fs.copyFileSync(docxPath, zip);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zip.replace(/'/g, "''")}' -DestinationPath '${out.replace(/'/g, "''")}' -Force"`,
    { stdio: 'pipe' }
  );
  return out;
}

function plainText(xml) {
  return xml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\r/g, '');
}

function readDocxText(docxPath) {
  const dir = unpack(docxPath);
  const xml = fs.readFileSync(path.join(dir, 'word', 'document.xml'), 'utf8');
  return plainText(xml);
}

function letterToIndex(letter) {
  const L = letter.trim().toUpperCase().charAt(0);
  return L.charCodeAt(0) - 65; // A=0
}

function normalizeOption(s) {
  return s.replace(/\s+/g, ' ').replace(/\s*✔.*$/u, '').replace(/\s*Correct Answer.*$/i, '').trim();
}

function shuffleSeeded(arr) {
  // deterministic-ish not needed; converter doesn't shuffle
  return arr;
}

/** Math: SECTION + numbered Q + A) B) C) D) + Answer: X */
function parseMathDoc(text, { grade, topic, subject = 'math' }) {
  const questions = [];
  let difficulty = 'easy';
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Detect topic from header if not provided
  let topicName = topic;
  for (const line of lines.slice(0, 8)) {
    const m = line.match(/^TOPIC\s+\d+\s*:\s*(.+)$/i);
    if (m) topicName = m[1].trim();
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const sec = line.match(/SECTION\s+\d+\s*:\s*(EASY|MEDIUM|HARD)/i);
    if (sec) {
      difficulty = sec[1].toLowerCase();
      i++;
      continue;
    }

    const qm = line.match(/^(\d+)\.\s+(.+)$/);
    if (!qm) {
      i++;
      continue;
    }

    const num = qm[1];
    let prompt = qm[2];
    i++;
    // continuation lines until option
    while (i < lines.length && !/^[A-D][\)\.]\s*/.test(lines[i]) && !/^Answer\s*:/i.test(lines[i]) && !/^\d+\.\s+/.test(lines[i]) && !/^SECTION\s+/i.test(lines[i])) {
      prompt += ' ' + lines[i];
      i++;
    }

    const options = [];
    let answerLetter = null;
    while (i < lines.length && /^[A-D][\)\.]\s*/.test(lines[i])) {
      // Some docs put "D) ... Answer: B" on the same line as the last option
      let raw = lines[i];
      const inlineAns = raw.match(/\s*Answer\s*:\s*([A-D])\s*$/i);
      if (inlineAns) {
        answerLetter = inlineAns[1].toUpperCase();
        raw = raw.replace(/\s*Answer\s*:\s*[A-D]\s*$/i, '');
      }
      options.push(normalizeOption(raw.replace(/^[A-D][\)\.]\s*/, '').replace(/\$/g, '')));
      i++;
    }

    if (i < lines.length && /^Answer\s*:/i.test(lines[i])) {
      const am = lines[i].match(/^Answer\s*:\s*([A-D])/i);
      if (am) answerLetter = am[1].toUpperCase();
      i++;
    }

    prompt = prompt.replace(/\$/g, '').trim();

    if (options.length >= 2 && answerLetter) {
      const idx = letterToIndex(answerLetter);
      if (idx >= 0 && idx < options.length) {
        questions.push({
          id: `math-${grade}-${slug(topicName)}-${difficulty}-${num}`,
          question: prompt,
          options,
          correctAnswer: options[idx],
          difficulty,
          topic: topicName || topic || 'General',
          subject,
          grade,
        });
      }
    }
  }
  return questions;
}

function slug(s) {
  return String(s || 'topic')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

/** Science K-8 with Answer Key table */
function parseScienceGradeDoc(text, { grade, subject = 'science' }) {
  const questions = [];
  const lines = text.split('\n').map((l) => l.trim());

  // Parse answer key first
  const keyIdx = lines.findIndex((l) => /^Answer Key$/i.test(l));
  const answerMap = new Map(); // num -> { letter, difficulty, topic }
  if (keyIdx >= 0) {
    // After header rows Q# / Answer / Difficulty / Topic / Standard, entries are sequential
    const after = lines.slice(keyIdx + 1).filter(Boolean);
    // Skip header labels
    let start = 0;
    while (start < after.length && /^(Q#|Answer|Difficulty|Topic|Standard)$/i.test(after[start])) start++;

    // Rows appear as: num, letter(+optional note), difficulty, topic, standard
    let p = start;
    while (p < after.length) {
      const num = after[p];
      if (!/^\d+$/.test(num)) {
        p++;
        continue;
      }
      const ansLine = after[p + 1] || '';
      const letterMatch = ansLine.match(/^([A-D])/i);
      const difficulty = (after[p + 2] || '').toLowerCase();
      const topic = after[p + 3] || 'General';
      if (letterMatch) {
        answerMap.set(num, {
          letter: letterMatch[1].toUpperCase(),
          difficulty: /easy|medium|hard/.test(difficulty) ? difficulty : 'medium',
          topic,
        });
      }
      p += 5; // num, answer, difficulty, topic, standard
    }
  }

  // Parse questions body (before answer key)
  const body = keyIdx >= 0 ? lines.slice(0, keyIdx) : lines;
  let i = 0;
  let currentTopic = 'General';
  while (i < body.length) {
    const line = body[i];
    // Part headers as topics
    const part = line.match(/^Part\s+\d+\s*:\s*(.+)$/i);
    if (part) {
      currentTopic = part[1].trim();
      i++;
      continue;
    }

    const qm = line.match(/^(\d+)\.\s+(.+)$/);
    if (!qm) {
      i++;
      continue;
    }
    const num = qm[1];
    let prompt = qm[2];
    i++;

    let difficulty = null;
    // difficulty line: EASY | NGSS ...
    if (i < body.length && /^(EASY|MEDIUM|HARD)\b/i.test(body[i])) {
      difficulty = body[i].match(/^(EASY|MEDIUM|HARD)/i)[1].toLowerCase();
      i++;
    }

    while (i < body.length && !/^[A-D][\.\)]\s*/.test(body[i]) && !/^\d+\.\s+/.test(body[i]) && !/^(EASY|MEDIUM|HARD)\b/i.test(body[i])) {
      if (body[i]) prompt += ' ' + body[i];
      i++;
    }

    const options = [];
    while (i < body.length && /^[A-D][\.\)]\s*/.test(body[i])) {
      options.push(normalizeOption(body[i].replace(/^[A-D][\.\)]\s*/, '')));
      i++;
    }

    const key = answerMap.get(num);
    const letter = key?.letter;
    const diff = (key?.difficulty || difficulty || 'medium');
    const topic = key?.topic || currentTopic;

    if (options.length >= 2 && letter) {
      const idx = letterToIndex(letter);
      if (idx >= 0 && idx < options.length) {
        questions.push({
          id: `science-${grade}-${diff}-${num}`,
          question: prompt.trim(),
          options,
          correctAnswer: options[idx],
          difficulty: diff,
          topic,
          subject,
          grade,
        });
      }
    }
  }
  return questions;
}

/** Physics / Chemistry / Biology 150 banks */
function parseHsScienceDoc(text, { grade = 'hs', subject, topicDefault }) {
  const questions = [];
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  let unitTopic = topicDefault || subject;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const unit = line.match(/^Unit\s+\d+\s*:\s*(.+)$/i);
    if (unit) {
      unitTopic = unit[1].trim();
      i++;
      continue;
    }
    const level = line.match(/^LEVEL\s+\d+/i);
    if (level) {
      i++;
      continue;
    }

    // Q12. [Hard] prompt...  OR  Q1. [Easy] ...
    const qm = line.match(/^Q(\d+)\.\s*\[(Easy|Medium|Hard)\]\s*(.+)$/i);
    if (!qm) {
      i++;
      continue;
    }
    const num = qm[1];
    const difficulty = qm[2].toLowerCase();
    let prompt = qm[3];
    i++;

    while (i < lines.length && !/^[A-D][\.\)]\s*/.test(lines[i]) && !/^Q\d+\./.test(lines[i])) {
      prompt += ' ' + lines[i];
      i++;
    }

    const options = [];
    let correctIdx = -1;
    while (i < lines.length && /^[A-D][\.\)]\s*/.test(lines[i])) {
      const raw = lines[i];
      const isCorrect = /✔|Correct Answer/i.test(raw);
      const opt = normalizeOption(raw.replace(/^[A-D][\.\)]\s*/, ''));
      if (isCorrect) correctIdx = options.length;
      options.push(opt);
      i++;
    }

    if (options.length >= 2 && correctIdx >= 0) {
      questions.push({
        id: `${subject}-${difficulty}-${num}`,
        question: prompt.trim(),
        options,
        correctAnswer: options[correctIdx],
        difficulty,
        topic: unitTopic,
        subject,
        grade,
      });
    }
  }
  return questions;
}

function writeJson(rel, data) {
  const full = path.join(outRoot, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Wrote ${rel} (${data.length} questions)`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

function gradeFromMathFolder(folderName) {
  const m = folderName.match(/grade\s*(\d+)/i);
  return m ? m[1] : null;
}

function topicFromMathFile(fileName) {
  return fileName
    .replace(/\.docx$/i, '')
    .replace(/^Grade\s*\d+\s*/i, '')
    .replace(/^Introduction and\s*/i, '')
    .replace(/^Intro and\s*/i, '')
    .trim();
}

// ── Main ───────────────────────────────────────────────────────────────────
fs.mkdirSync(outRoot, { recursive: true });
const summary = [];

// MATH grades 1-7
const mathsRoot = path.join(srcRoot, 'MATHS');
for (const folder of fs.readdirSync(mathsRoot)) {
  const gradeNum = gradeFromMathFolder(folder);
  if (!gradeNum) continue;
  const folderPath = path.join(mathsRoot, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  const all = [];
  const files = fs.readdirSync(folderPath).filter((f) => /\.docx$/i.test(f));
  // Prefer non-"(1)" copies when both exist
  const preferred = files.filter((f) => {
    if (/\(\d+\)\.docx$/i.test(f)) {
      const canon = f.replace(/\s*\(\d+\)\.docx$/i, '.docx');
      return !files.some((other) => other.toLowerCase() === canon.toLowerCase());
    }
    return true;
  });

  for (const file of preferred) {
    const full = path.join(folderPath, file);
    const text = readDocxText(full);
    const topic = topicFromMathFile(file);
    const qs = parseMathDoc(text, { grade: gradeNum, topic });
    console.log(`  math G${gradeNum} ${file}: ${qs.length}`);
    all.push(...qs);
  }
  writeJson(`math/grade-${gradeNum}.json`, all);
  summary.push({ bank: `math/grade-${gradeNum}`, count: all.length });
}

// SCIENCE K-8 grade banks + HS
const scienceRoot = path.join(srcRoot, 'SCIENCE');
const scienceMap = [
  { file: 'Kindergarten_Science_Question_Bank.docx', out: 'science/kindergarten.json', grade: 'kindergarten', parser: 'grade' },
  { file: 'Grade1_Science_Question_Bank.docx', out: 'science/grade-1.json', grade: '1', parser: 'grade' },
  { file: 'Grade2_Science_Question_Bank.docx', out: 'science/grade-2.json', grade: '2', parser: 'grade' },
  { file: 'Grade3_Science_Question_Bank.docx', out: 'science/grade-3.json', grade: '3', parser: 'grade' },
  { file: 'Grade4_Science_Question_Bank.docx', out: 'science/grade-4.json', grade: '4', parser: 'grade' },
  { file: 'Grade5_Science_Question_Bank.docx', out: 'science/grade-5.json', grade: '5', parser: 'grade' },
  { file: 'Grade6_Earth_Space_Science_Question_Bank.docx', out: 'science/grade-6.json', grade: '6', parser: 'grade' },
  { file: 'Grade7_Life_Science_Question_Bank.docx', out: 'science/grade-7.json', grade: '7', parser: 'grade' },
  { file: 'Grade8_Physical_Science_Question_Bank.docx', out: 'science/grade-8.json', grade: '8', parser: 'grade' },
  { file: 'Physics_150_Question_Bank.docx', out: 'science/physics.json', grade: 'hs', parser: 'hs', subject: 'physics' },
  { file: 'Chemistry_150_Question_Bank.docx', out: 'science/chemistry.json', grade: 'hs', parser: 'hs', subject: 'chemistry' },
  { file: 'Biology_150_Question_Bank.docx', out: 'science/biology.json', grade: 'hs', parser: 'hs', subject: 'biology' },
];

for (const entry of scienceMap) {
  const full = path.join(scienceRoot, entry.file);
  if (!fs.existsSync(full)) {
    console.warn('Missing', entry.file);
    continue;
  }
  const text = readDocxText(full);
  let qs;
  if (entry.parser === 'hs') {
    qs = parseHsScienceDoc(text, { grade: 'hs', subject: entry.subject, topicDefault: entry.subject });
  } else {
    qs = parseScienceGradeDoc(text, { grade: entry.grade });
  }
  writeJson(entry.out, qs);
  summary.push({ bank: entry.out, count: qs.length });
}

fs.writeFileSync(path.join(outRoot, 'manifest.json'), JSON.stringify(summary, null, 2));
console.log('\nDone. Manifest:');
console.log(summary.map((s) => `${s.bank}: ${s.count}`).join('\n'));
