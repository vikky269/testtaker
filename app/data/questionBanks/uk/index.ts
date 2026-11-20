/**
 * UK Year 1–11 question banks (Math / ELA / Science).
 * Source: UK QUESTION BANK/question_bank.json (Years 6 & 7 currently).
 * Assessment draws 10 random questions per subject via generateUkGradeAssessment.
 */
import type { BankQuestion, Difficulty } from '@/app/utils/gradeAssessmentGenerator';
import rawBank from './question_bank.json';

export const UK_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export type UkYear = (typeof UK_YEARS)[number];

type UkSubjectKey = 'math' | 'ela' | 'science';

interface UkRawOptions {
  A?: string;
  B?: string;
  C?: string;
  D?: string;
  E?: string;
  [key: string]: string | undefined;
}

interface UkRawStimulus {
  id?: string;
  title?: string | null;
  text?: string | string[] | null;
  table?: string[][] | null;
  figure?: string | null;
}

interface UkRawQuestion {
  id: string;
  year: string;
  subject: string;
  section?: string;
  topic?: string;
  skill?: string;
  difficulty?: string;
  stem: string;
  options: UkRawOptions;
  answer: string;
  explanation?: string;
  stimulus?: UkRawStimulus | null;
  figure?: string | null;
}

const SUBJECT_MAP: Record<string, UkSubjectKey> = {
  mathematics: 'math',
  maths: 'math',
  math: 'math',
  english: 'ela',
  ela: 'ela',
  science: 'science',
};

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  foundational: 'easy',
  standard: 'medium',
  stretch: 'hard',
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

/** Years with enough questions (≥10) in Math, ELA, and Science. */
const UK_YEARS_WITH_BANKS = new Set<UkYear>([6, 7]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function tableToHtml(table: string[][]): string {
  const rows = table
    .map((row, ri) => {
      const cells = row
        .map((cell) => {
          const tag = ri === 0 ? 'th' : 'td';
          return `<${tag} style="border:1px solid #d1d5db;padding:6px 10px;text-align:left">${escapeHtml(
            String(cell ?? '')
          )}</${tag}>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');
  return `<table style="border-collapse:collapse;width:100%;margin:12px 0;font-size:0.95em">${rows}</table>`;
}

const UK_FIGURE_BASE = '/uk/figures';

function figureImgHtml(fileName: string, alt: string): string {
  const safe = escapeHtml(fileName.replace(/^.*[\\/]/, ''));
  const src = `${UK_FIGURE_BASE}/${safe}`;
  return `<p style="margin:12px 0;text-align:center"><img src="${src}" alt="${escapeHtml(
    alt
  )}" style="max-width:100%;height:auto;border-radius:12px;border:1px solid #e5e7eb" /></p>`;
}

function formatUkPassage(stimulus: UkRawStimulus | null | undefined): string | undefined {
  if (!stimulus) return undefined;
  const parts: string[] = [];
  if (stimulus.title) {
    parts.push(`<p><strong>${escapeHtml(stimulus.title)}</strong></p>`);
  }
  if (Array.isArray(stimulus.text)) {
    for (const para of stimulus.text) {
      if (para?.trim()) parts.push(`<p>${escapeHtml(para)}</p>`);
    }
  } else if (typeof stimulus.text === 'string' && stimulus.text.trim()) {
    parts.push(`<p>${escapeHtml(stimulus.text)}</p>`);
  }
  if (stimulus.table?.length) {
    parts.push(tableToHtml(stimulus.table));
  }
  if (stimulus.figure) {
    parts.push(figureImgHtml(stimulus.figure, stimulus.title || 'Diagram'));
  }
  return parts.length ? parts.join('\n') : undefined;
}

function normalizeUkQuestion(raw: UkRawQuestion): BankQuestion | null {
  const yearMatch = String(raw.year ?? '').match(/(\d+)/);
  const yearNum = yearMatch ? Number(yearMatch[1]) : NaN;
  if (!UK_YEARS.includes(yearNum as UkYear)) return null;

  const subject = SUBJECT_MAP[String(raw.subject ?? '').toLowerCase().trim()];
  if (!subject) return null;

  const optionEntries = Object.entries(raw.options || {})
    .filter(([, v]) => typeof v === 'string' && v.length > 0)
    .sort(([a], [b]) => a.localeCompare(b));
  const options = optionEntries.map(([, v]) => v as string);
  if (options.length < 2) return null;

  const answerKey = String(raw.answer ?? '').trim().toUpperCase();
  const correctAnswer = raw.options?.[answerKey] ?? raw.options?.[raw.answer];
  if (!correctAnswer || !options.includes(correctAnswer)) return null;

  const difficulty =
    DIFFICULTY_MAP[String(raw.difficulty ?? '').toLowerCase().trim()] ?? 'medium';

  const stem = String(raw.stem ?? '').trim();
  // Stem-level figures (math/science diagrams without a stimulus block)
  const question = raw.figure
    ? `${figureImgHtml(raw.figure, 'Question diagram')}<p>${escapeHtml(stem)}</p>`
    : stem;

  const passage = formatUkPassage(raw.stimulus);

  return {
    id: raw.id,
    question,
    options,
    correctAnswer,
    solution: raw.explanation ? `<p>${escapeHtml(raw.explanation)}</p>` : undefined,
    difficulty,
    topic: raw.topic || raw.section || 'General',
    subject,
    grade: String(yearNum),
    domain: raw.section,
    skill: raw.skill,
    passage,
  };
}

let cachedBank: BankQuestion[] | null = null;

function loadNormalizedBank(): BankQuestion[] {
  if (cachedBank) return cachedBank;
  const rows = (rawBank as UkRawQuestion[]) || [];
  cachedBank = rows.map(normalizeUkQuestion).filter((q): q is BankQuestion => !!q);
  return cachedBank;
}

export function parseUkYear(gradeParam: string | null | undefined): UkYear | null {
  const key = (gradeParam ?? '').toLowerCase().trim().replace(/\s+/g, '-');
  const m = key.match(/^year-?(\d+)$/);
  if (!m) return null;
  const n = Number(m[1]);
  return UK_YEARS.includes(n as UkYear) ? (n as UkYear) : null;
}

function bankFor(year: UkYear, subject: UkSubjectKey): BankQuestion[] {
  return loadNormalizedBank().filter(
    (q) => q.grade === String(year) && q.subject === subject
  );
}

/** True when a UK year has ≥10 questions in Math, ELA, and Science. */
export function hasUkBanksReady(gradeParam: string | null | undefined): boolean {
  const year = parseUkYear(gradeParam);
  if (year === null || !UK_YEARS_WITH_BANKS.has(year)) return false;
  return (
    bankFor(year, 'math').length >= 10 &&
    bankFor(year, 'ela').length >= 10 &&
    bankFor(year, 'science').length >= 10
  );
}

export async function getUkMathBank(year: UkYear): Promise<BankQuestion[]> {
  return bankFor(year, 'math');
}

export async function getUkElaBank(year: UkYear): Promise<BankQuestion[]> {
  return bankFor(year, 'ela');
}

export async function getUkScienceBank(year: UkYear): Promise<BankQuestion[]> {
  return bankFor(year, 'science');
}
