// app/utils/quizRandomizer.ts
// Randomly selects N questions per section from a (potentially large) pool,
// shuffles their order, and persists the selection so refreshes and the
// review page see the exact same quiz.
//
// HOW SECTIONS ARE DETECTED:
//  1. If questions carry a `subject` tag ("math" | "ela" | "science" | "reading"),
//     the pool can be ANY size per section — this is the long-term format.
//  2. If no tags exist (your current data), the legacy block convention is used:
//     grade quizzes → [0-9]=math, [10-19]=ela, [20-29]=science
//     SAT/SSAT      → [0-9]=reading, [10-19]=math
//     So everything works today, and starts scaling the moment you add tags.

export interface PoolQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
  solution?: string;
  subject?: 'math' | 'ela' | 'science' | 'reading';
}

// Fisher–Yates shuffle (unbiased)
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Shuffle a section pool and take up to n questions
const pickRandom = <T,>(arr: T[], n: number): T[] =>
  shuffle(arr).slice(0, Math.min(n, arr.length));

interface BuildOptions {
  isSat: boolean;          // SAT / SSAT two-section format
  isGradeLevel: boolean;   // grade quizzes (math / ela / science)
  perSection?: number;     // questions per section (default 10)
}

export function buildRandomQuiz(
  pool: PoolQuestion[],
  { isSat, isGradeLevel, perSection = 10 }: BuildOptions
): PoolQuestion[] {
  if (!pool || pool.length === 0) return [];

  const hasTags = pool.some(q => q.subject);

  if (isSat) {
    const reading = hasTags
      ? pool.filter(q => q.subject === 'reading' || q.subject === 'ela')
      : pool.slice(0, 10);
    const math = hasTags
      ? pool.filter(q => q.subject === 'math')
      : pool.slice(10, 20);
    // Block order preserved: [reading][math]
    return [...pickRandom(reading, perSection), ...pickRandom(math, perSection)];
  }

  if (isGradeLevel) {
    const math = hasTags
      ? pool.filter(q => q.subject === 'math')
      : pool.slice(0, 10);
    const ela = hasTags
      ? pool.filter(q => q.subject === 'ela')
      : pool.slice(10, 20);
    const science = hasTags
      ? pool.filter(q => q.subject === 'science')
      : pool.slice(20, 30);
    // Block order preserved: [math][ela][science]
    // Grades without a science section (e.g. pre-k) just contribute an empty slice.
    return [
      ...pickRandom(math, perSection),
      ...pickRandom(ela, perSection),
      ...pickRandom(science, perSection),
    ];
  }

  // Other tests (algebra-1, geometry, etc.) — shuffle the whole pool
  return shuffle(pool);
}

// ── Persistence — the selected quiz must survive refresh + review ────────────

const storageKey = (testid?: string, grade?: string) =>
  `selectedQuiz:${testid ?? 'unknown'}:${grade ?? 'none'}`;

export function saveSelectedQuiz(
  testid: string | undefined,
  grade: string | undefined,
  questions: PoolQuestion[]
) {
  try {
    localStorage.setItem(storageKey(testid, grade), JSON.stringify(questions));
  } catch {
    // localStorage full or unavailable — quiz still works for this session
  }
}

export function loadSelectedQuiz(
  testid: string | undefined,
  grade: string | undefined
): PoolQuestion[] | null {
  try {
    const raw = localStorage.getItem(storageKey(testid, grade));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSelectedQuizzes() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('selectedQuiz:'))
    .forEach(k => localStorage.removeItem(k));
}