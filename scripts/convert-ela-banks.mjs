/**
 * Converts NEW QUESTION BANK/ELA grade PDFs into app/data/questionBanks/ela/grade-N.json
 *
 * Format:
 *  - Easy / Medium / Hard sections (50 each typical)
 *  - Optional short passages (title + body) before question groups
 *  - Numbered MCQ with A-D options
 *  - Answer Key at end: "1. C | 2. A | ..."
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = path.join(root, 'NEW QUESTION BANK', 'ELA');
const outRoot = path.join(root, 'app', 'data', 'questionBanks', 'ela');

function letterToIndex(letter) {
  return letter.trim().toUpperCase().charCodeAt(0) - 65;
}

function slug(s) {
  return String(s || 'topic')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 56);
}

function topicFromFile(fileName) {
  return fileName
    .replace(/\.pdf$/i, '')
    .replace(/^Grade_\d+_/i, '')
    .replace(/_Question_Bank$/i, '')
    .replace(/_/g, ' ')
    .trim();
}

async function extractPdfText(pdfPath) {
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  try {
    const result = await parser.getText();
    return result.text || '';
  } finally {
    await parser.destroy();
  }
}

function cleanLines(text) {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => {
      if (!l) return false;
      if (/^SmartMathz/i.test(l)) return false;
      if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(l)) return false;
      if (/^Page\s+\d+/i.test(l)) return false;
      if (/Page\s+\d+\s*$/i.test(l) && /\bELA\b/i.test(l)) return false;
      if (/^Grade\s+\d+\s+ELA\b/i.test(l)) return false;
      if (/^Student:/i.test(l)) return false;
      if (/^Instructions:/i.test(l)) return false;
      if (/^Multiple-Choice Question Bank$/i.test(l)) return false;
      if (/^\d+\s+questions/i.test(l)) return false;
      if (/^\d+\s+Easy/i.test(l)) return false;
      if (/^Original short passages/i.test(l)) return false;
      if (/^Skills include/i.test(l)) return false;
      if (/^Skills covered$/i.test(l)) return false;
      if (/^Student question sections/i.test(l)) return false;
      if (/^Answers are grouped/i.test(l)) return false;
      if (/^GRADE\s+\d+\s+ELA$/i.test(l)) return false;
      return true;
    });
}

function findAnswerKeyIndex(lines) {
  let idx = -1;
  for (let i = 0; i < lines.length; i++) {
    // "Answer Key", "ANSWER KEY", "Answer Key — Numerical Sequence"
    if (/^Answer Key\b/i.test(lines[i])) idx = i;
  }
  return idx;
}

function difficultyFromAbs(abs) {
  if (abs <= 50) return 'easy';
  if (abs <= 100) return 'medium';
  return 'hard';
}

function isDifficultyHeader(line) {
  // "Easy", "Easy Questions", "Easy — Questions 1–50", "EASY — Questions 1–50"
  // Avoid meta lines that mention multiple bands: "Questions 1–50: Easy • 51–100: Medium"
  if (/Easy.*Medium|Medium.*Hard|51\s*[–-]\s*100/i.test(line) && /Easy/i.test(line) && /Medium/i.test(line)) {
    return null;
  }
  if (/^Easy(\s+Questions|\s*[—–-]|$)/i.test(line)) return 'easy';
  if (/^Medium(\s+Questions|\s*[—–-]|$)/i.test(line)) return 'medium';
  if (/^Hard(\s+Questions|\s*[—–-]|$)/i.test(line)) return 'hard';
  return null;
}

/**
 * Answer-key formats seen across grades:
 *  - Pipe:        "1. C | 2. A | 3. B"
 *  - Spaced:      "1. A 2. B 3. C" / "1. D 2. D 3. D"
 *  - Table:       "1 D 31 A 61 C" / "1 C 51 B 101 D"
 *  - Per-band renumber (G4/G5): Easy 1–50, Medium 1–50, Hard 1–50
 *  - Continuous:  Medium starts at 51, Hard at 101
 *  - Interleaved: Easy/Medium/Hard sections keep absolute nums (G6 Lit)
 */
function parseAnswerKey(lines) {
  const map = new Map(); // "absNum" | "difficulty:localNum" -> { letter, difficulty }
  const keyIdx = findAnswerKeyIndex(lines);
  if (keyIdx < 0) return map;

  const rawAfter = lines.slice(keyIdx + 1);
  // Join split entries like "39." + "D" and "48. A 49." + "D 50. A"
  const after = [];
  for (let i = 0; i < rawAfter.length; i++) {
    let line = rawAfter[i];
    const next = rawAfter[i + 1] || '';
    if (/^\d+\.\s*$/.test(line) && next) {
      after.push(`${line} ${next}`);
      i++;
      continue;
    }
    if (/\d+\.\s*$/.test(line) && /^[A-D]\b/i.test(next)) {
      const letter = next.match(/^([A-D])\b\s*(.*)$/i);
      after.push(`${line} ${letter[1]}`);
      if (letter[2] && letter[2].trim()) after.push(letter[2].trim());
      i++;
      continue;
    }
    after.push(line);
  }

  let difficulty = null;
  // null | 'reset' | 'absolute'
  let mediumMode = null;
  let hardMode = null;

  const addAnswer = (abs, letter, sectionDiff, alsoLocal) => {
    const n = Number(abs);
    if (!Number.isFinite(n) || n < 1) return;
    const d = sectionDiff || difficultyFromAbs(n);
    const entry = { letter: String(letter).toUpperCase(), difficulty: d };
    map.set(String(n), entry);
    map.set(`${d}:${n}`, entry);
    if (alsoLocal) {
      const local = n <= 50 ? n : n <= 100 ? n - 50 : n - 100;
      map.set(`${d}:${local}`, entry);
    }
  };

  for (const line of after) {
    if (/^No\.\s*Ans/i.test(line)) continue;
    if (/^Question\s+Answer/i.test(line)) continue;
    if (/^Answers (are|correspond)\b/i.test(line)) continue;

    const headerDiff = isDifficultyHeader(line);
    if (headerDiff) {
      difficulty = headerDiff;
      continue;
    }

    // Global match: "12. B" or "12 B"
    const re = /(\d+)\s*[.\)]\s*([A-D])\b|(\d+)\s+([A-D])\b/gi;
    let m;
    while ((m = re.exec(line)) !== null) {
      const num = Number(m[1] || m[3]);
      const letter = m[2] || m[4];
      if (!letter) continue;

      if (difficulty === 'easy') {
        // Easy is always absolute as printed (1–50, or interleaved abs nums)
        addAnswer(num, letter, 'easy', num <= 50);
      } else if (difficulty === 'medium') {
        if (mediumMode === null) {
          // Only treat as renumbered local 1–50 when the band restarts at 1
          mediumMode = num === 1 ? 'reset' : 'absolute';
        }
        if (mediumMode === 'reset') {
          addAnswer(num + 50, letter, 'medium', true);
        } else {
          addAnswer(num, letter, 'medium', false);
        }
      } else if (difficulty === 'hard') {
        if (hardMode === null) {
          hardMode = num === 1 ? 'reset' : 'absolute';
        }
        if (hardMode === 'reset') {
          addAnswer(num + 100, letter, 'hard', true);
        } else {
          addAnswer(num, letter, 'hard', false);
        }
      } else {
        addAnswer(num, letter, null, true);
      }
    }
  }
  return map;
}

function numberingMode(lines) {
  let max = 0;
  for (const line of lines) {
    const m = line.match(/^(\d+)\.\s+/);
    if (!m) continue;
    const n = Number(m[1]);
    if (n < max) return 'restart';
    if (n > max) max = n;
  }
  return 'absolute';
}

function lookupAnswer(answerMap, num, difficulty, mode) {
  const n = String(num);
  // Absolute banks keep one running number. A local alias such as
  // medium:24 can belong to question 74, so the printed number wins.
  if (mode === 'absolute') {
    return answerMap.get(n) || answerMap.get(`${difficulty}:${n}`) || null;
  }
  return answerMap.get(`${difficulty}:${n}`) || answerMap.get(n) || null;
}

function looksLikePassageTitle(line, nextLine) {
  if (!line || !nextLine) return false;
  if (/^\d+\.\s/.test(line)) return false;
  if (/^[A-D][\.\)]\s/.test(line)) return false;
  if (/^(Easy|Medium|Hard)\b/i.test(line)) return false;
  if (/^Read each/i.test(line)) return false;
  if (/^Select the best answer/i.test(line)) return false;
  if (/^Answer Key\b/i.test(line)) return false;
  if (/^Grade\s+\d+/i.test(line)) return false;
  if (/^SmartMathz/i.test(line)) return false;
  if (/^Question:\s*/i.test(line)) return false;
  if (/^Passage\s+\d+/i.test(line)) return false;
  if (/^Read the passage:/i.test(line)) return false;
  // Bank cover / metadata — not passages
  if (/\b(Question Bank|Multiple-Choice|Common Core|answer key|Skills (include|covered)|Topics include|Structure:|Aligned|Instructions:|Directions:)\b/i.test(line)) return false;
  if (/\b\d+\s+(Easy|Medium|Hard)\b/i.test(line)) return false;
  if (/^\d+\s+questions\b/i.test(line)) return false;
  // Titles are short-ish and next line is prose (longer)
  if (line.length > 70) return false;
  if (line.endsWith('?') || line.endsWith('.')) return false;
  if (/^[a-z]/.test(line)) return false;
  if (/^(Which|What|Who|Where|When|How|Why|Choose|Select|Identify)\b/i.test(line)) return false;
  // Next line shouldn't be an option or question number
  if (/^\d+\.\s/.test(nextLine) || /^[A-D][\.\)]\s/.test(nextLine)) return false;
  // Title Case phrase. Content words are capitalized, so
  // "The Library Visit" counts and "The students walked..." does not.
  const words = line.split(/\s+/);
  if (words.length < 2 || words.length > 8) return false;
  const small = new Set(['a', 'an', 'the', 'of', 'and', 'or', 'for', 'to', 'in', 'on', 'at', 'with', 'from', 'by']);
  const titleCase = words.every((w, idx) => {
    const core = w.replace(/[^A-Za-z0-9']/g, '');
    if (!core) return false;
    if (idx > 0 && small.has(core.toLowerCase())) return true;
    return /^[A-Z0-9]/.test(core);
  });
  if (!titleCase) return false;
  return nextLine.length >= 40 || /[.!]/.test(nextLine);
}

function buildPrompt(passageTitle, passageBody, question) {
  const q = question.trim();
  if (!passageBody) return q;
  const titleHtml = passageTitle
    ? `<strong>${escapeHtml(passageTitle)}</strong><br/>`
    : '';
  const bodyHtml = escapeHtml(passageBody).replace(/\n/g, '<br/>');
  return `<blockquote class="quiz-passage">${titleHtml}${bodyHtml}</blockquote><p><strong>${escapeHtml(q)}</strong></p>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isBodyDifficultyHeader(line) {
  return isDifficultyHeader(line) !== null;
}

function parseElaDoc(text, { grade, topic }) {
  const lines = cleanLines(text);
  const answerMap = parseAnswerKey(lines);
  const keyIdx = findAnswerKeyIndex(lines);
  const body = keyIdx >= 0 ? lines.slice(0, keyIdx) : lines;

  const questions = [];
  let difficulty = 'easy';
  let passageTitle = null;
  let passageParts = [];
  let i = 0;
  const numbers = numberingMode(body);

  const flushPassageText = () => passageParts.join(' ').replace(/\s+/g, ' ').trim();

  while (i < body.length) {
    const line = body[i];

    const bodyDiff = isDifficultyHeader(line);
    if (bodyDiff) {
      difficulty = bodyDiff;
      // Always clear cover-page noise when a band starts
      passageTitle = null;
      passageParts = [];
      i++;
      continue;
    }
    if (/^Read each passage/i.test(line)) { i++; continue; }
    if (/^Select the best answer/i.test(line)) { i++; continue; }

    const qm = line.match(/^(\d+)\.\s+(.+)$/);
    if (qm) {
      const num = qm[1];
      let prompt = qm[2];
      let inlineDiff = null;
      // "1. [Easy] What do tree leaves provide..."
      const tag = prompt.match(/^\[(Easy|Medium|Hard)\]\s*(.*)$/i);
      if (tag) {
        inlineDiff = tag[1].toLowerCase();
        prompt = tag[2];
        difficulty = inlineDiff;
      }

      // Embedded passage+question: "1. Read the passage: Title"
      const readPassage = /^Read the passage:\s*(.+)$/i.exec(prompt);
      let embeddedTitle = readPassage ? readPassage[1].trim() : null;
      let embeddedParts = [];

      i++;
      // continuation until option
      while (
        i < body.length &&
        !/^[A-D][\.\)]\s+/.test(body[i]) &&
        !/^\d+\.\s+/.test(body[i]) &&
        !isBodyDifficultyHeader(body[i])
      ) {
        const cur = body[i];
        const qLine = cur.match(/^Question:\s*(.+)$/i);
        if (qLine) {
          prompt = qLine[1].trim();
          i++;
          continue;
        }
        if (embeddedTitle) {
          embeddedParts.push(cur);
          i++;
          continue;
        }
        // If a new passage title sneaks in mid-way, stop
        if (looksLikePassageTitle(cur, body[i + 1] || '')) break;
        prompt += ' ' + cur;
        i++;
      }

      const options = [];
      while (i < body.length && /^[A-D][\.\)]\s+/.test(body[i])) {
        options.push(body[i].replace(/^[A-D][\.\)]\s+/, '').trim());
        i++;
      }

      const key = lookupAnswer(answerMap, num, difficulty, numbers);
      const letter = key?.letter;
      const diff = (inlineDiff || key?.difficulty || difficulty || 'medium').toLowerCase();
      if (options.length >= 2 && letter) {
        const idx = letterToIndex(letter);
        if (idx >= 0 && idx < options.length) {
          const useTitle = embeddedTitle || passageTitle;
          const useBody = embeddedTitle
            ? embeddedParts.join(' ').replace(/\s+/g, ' ').trim()
            : flushPassageText();
          const questionText = buildPrompt(useTitle, useBody, prompt);
          questions.push({
            id: `ela-${grade}-${slug(topic)}-${diff}-${num}`,
            question: questionText,
            options,
            correctAnswer: options[idx],
            difficulty: diff,
            topic,
            subject: 'ela',
            grade: String(grade),
            ...(useTitle ? { passageTitle: useTitle } : {}),
          });
        }
      }
      continue;
    }

    // Standalone "Passage N: Title" headers (G6 informational/literature)
    const passageHeader = line.match(/^Passage\s+\d+:\s*(.+)$/i);
    if (passageHeader) {
      passageTitle = passageHeader[1].replace(/\s*\([^)]*\)\s*$/, '').trim();
      passageParts = [];
      i++;
      while (
        i < body.length &&
        !/^\d+\.\s+/.test(body[i]) &&
        !isBodyDifficultyHeader(body[i]) &&
        !/^Passage\s+\d+:/i.test(body[i])
      ) {
        if (!/^[A-D][\.\)]\s+/.test(body[i])) passageParts.push(body[i]);
        i++;
      }
      continue;
    }

    // Passage detection
    const next = body[i + 1] || '';
    if (looksLikePassageTitle(line, next)) {
      passageTitle = line;
      passageParts = [];
      i++;
      // Collect prose until first numbered question
      while (
        i < body.length &&
        !/^\d+\.\s+/.test(body[i]) &&
        !isBodyDifficultyHeader(body[i]) &&
        !looksLikePassageTitle(body[i], body[i + 1] || '')
      ) {
        if (!/^[A-D][\.\)]\s+/.test(body[i])) passageParts.push(body[i]);
        i++;
      }
      continue;
    }

    // Orphan prose — append to current passage if we have a title
    if (
      passageTitle &&
      !/^[A-D][\.\)]\s+/.test(line) &&
      !/\b(Question Bank|Multiple-Choice|answer key|Skills (include|covered))\b/i.test(line)
    ) {
      passageParts.push(line);
    }
    i++;
  }

  return questions;
}

function writeJson(rel, data) {
  const full = path.join(outRoot, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Wrote ela/${rel} (${data.length} questions)`);
}

// ── Main ───────────────────────────────────────────────────────────────────
fs.mkdirSync(outRoot, { recursive: true });
const summary = [];

const onlyGrades = new Set(process.argv.slice(2).filter((a) => /^\d+$/.test(a)));

for (const folder of fs.readdirSync(srcRoot)) {
  const m = folder.match(/grade\s*(\d+)/i);
  if (!m) continue;
  const gradeNum = m[1];
  if (onlyGrades.size && !onlyGrades.has(gradeNum)) continue;
  const folderPath = path.join(srcRoot, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  const all = [];
  for (const file of fs.readdirSync(folderPath)) {
    if (!/\.pdf$/i.test(file)) continue;
    const full = path.join(folderPath, file);
    const topic = topicFromFile(file);
    process.stdout.write(`  ela G${gradeNum} ${file}... `);
    try {
      const text = await extractPdfText(full);
      const qs = parseElaDoc(text, { grade: gradeNum, topic });
      console.log(qs.length);
      all.push(...qs);
    } catch (err) {
      console.log('FAIL', err.message);
    }
  }
  writeJson(`grade-${gradeNum}.json`, all);
  summary.push({ bank: `ela/grade-${gradeNum}`, count: all.length });
}

const manifestPath = path.join(root, 'app', 'data', 'questionBanks', 'manifest.json');
let manifest = [];
try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch {}
const converted = new Set(summary.map((s) => s.bank));
manifest = [
  ...manifest.filter((x) => !converted.has(String(x.bank || ''))),
  ...summary,
];
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('\nELA Done:');
console.log(summary.map((s) => `${s.bank}: ${s.count}`).join('\n'));
