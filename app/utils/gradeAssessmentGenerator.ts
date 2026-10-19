/**
 * Builds a Grade Assessment attempt.
 * Pre-K through Grade 2: 10 picture Math + 10 picture ELA, no Science.
 * Grades 3–12: [10 Math] + [10 ELA] + [10 Science], unchanged.
 * Math 3–7, ELA 3–7, and Science 3–8 / HS Phys-Chem-Bio come from the new banks.
 * Math/ELA 8–12 use the legacy bank where needed.
 */
import { quizAssessmentData } from '@/app/data/quizassessmentdata';
import {
  getMathBank,
  getElaBank,
  getScienceBank,
  getHsSciencePools,
  hasNewMathBank,
  hasNewElaBank,
} from '@/app/data/questionBanks';
import { getPictureBank } from '@/app/data/pictureAssessments';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BankQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty?: Difficulty | string;
  topic?: string;
  subject?: string;
  grade?: string;
  solution?: string;
  stimulus?: string;
  picture?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  solution?: string;
  difficulty?: string;
  topic?: string;
  subject?: string;
  stimulus?: string;
  picture?: boolean;
}

export const SECTION_SIZE = 10;
export const DIFFICULTY_MIX: Record<Difficulty, number> = {
  easy: 4,
  medium: 3,
  hard: 3,
};

const GENERATED_KEY = 'generatedAssessment';

export function normalizeGradeKey(gradeParam: string | null | undefined): string {
  return (gradeParam ?? '').toLowerCase().replace(/\s+/g, '-');
}

/** Map UI grade slug → numeric string "1"…"12", or "pre-k" / "kindergarten". */
export function parseGradeParts(gradeParam: string | null | undefined): {
  key: string;
  num: string | null;
  isPreK: boolean;
  isKindergarten: boolean;
  isHs: boolean; // 9–12
} {
  const key = normalizeGradeKey(gradeParam);
  if (key === 'pre-k' || key === 'prek') {
    return { key: 'pre-k', num: null, isPreK: true, isKindergarten: false, isHs: false };
  }
  if (key === 'kindergarten' || key === 'k') {
    return { key: 'kindergarten', num: null, isPreK: false, isKindergarten: true, isHs: false };
  }
  const m = key.match(/^(\d+)(st|nd|rd|th)?-?grade$/);
  if (m) {
    const num = m[1];
    const n = Number(num);
    return {
      key,
      num,
      isPreK: false,
      isKindergarten: false,
      isHs: n >= 9 && n <= 12,
    };
  }
  // bare number
  if (/^\d+$/.test(key)) {
    const n = Number(key);
    return {
      key: `${key}th-grade`,
      num: key,
      isPreK: false,
      isKindergarten: false,
      isHs: n >= 9 && n <= 12,
    };
  }
  return { key, num: null, isPreK: false, isKindergarten: false, isHs: false };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toQuizQuestion(q: BankQuestion | QuizQuestion): QuizQuestion {
  return {
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    solution: q.solution,
    difficulty: q.difficulty,
    topic: 'topic' in q ? q.topic : undefined,
    subject: 'subject' in q ? q.subject : undefined,
    stimulus: q.stimulus,
    picture: q.picture,
  };
}

/** Pre-K through Grade 2 use picture Math and ELA, with no Science section. */
export function isEarlyPictureGrade(gradeParam: string | null | undefined): boolean {
  const parts = parseGradeParts(gradeParam);
  if (parts.isPreK || parts.isKindergarten) return true;
  const n = Number(parts.num);
  return n === 1 || n === 2;
}

/**
 * Draw `count` questions with a preferred easy/medium/hard mix,
 * spreading across topics when possible. Falls back to any remaining items.
 */
export function drawBalanced(
  pool: BankQuestion[],
  count: number,
  mix: Record<Difficulty, number> = DIFFICULTY_MIX
): QuizQuestion[] {
  if (!pool.length || count <= 0) return [];

  const used = new Set<string>();
  const picked: BankQuestion[] = [];

  const byDiff = (d: Difficulty) =>
    shuffle(pool.filter((q) => (q.difficulty || '').toLowerCase() === d && !used.has(q.id)));

  const takeSpread = (candidates: BankQuestion[], n: number) => {
    if (n <= 0 || !candidates.length) return;
    // Round-robin across topics
    const byTopic = new Map<string, BankQuestion[]>();
    for (const q of candidates) {
      const t = q.topic || 'General';
      if (!byTopic.has(t)) byTopic.set(t, []);
      byTopic.get(t)!.push(q);
    }
    const topicKeys = shuffle([...byTopic.keys()]);
    let taken = 0;
    let guard = 0;
    while (taken < n && guard < n * topicKeys.length + 20) {
      for (const t of topicKeys) {
        if (taken >= n) break;
        const bucket = byTopic.get(t)!;
        while (bucket.length && used.has(bucket[0].id)) bucket.shift();
        if (!bucket.length) continue;
        const q = bucket.shift()!;
        used.add(q.id);
        picked.push(q);
        taken++;
      }
      guard++;
      // if all topics exhausted, break
      if ([...byTopic.values()].every((b) => b.length === 0)) break;
    }
  };

  for (const d of ['easy', 'medium', 'hard'] as Difficulty[]) {
    const need = mix[d] ?? 0;
    takeSpread(byDiff(d), need);
  }

  // Fill remainder from unused pool
  if (picked.length < count) {
    const rest = shuffle(pool.filter((q) => !used.has(q.id)));
    for (const q of rest) {
      if (picked.length >= count) break;
      used.add(q.id);
      picked.push(q);
    }
  }

  return shuffle(picked.slice(0, count)).map(toQuizQuestion);
}

function legacyGradeQuestions(gradeKey: string): QuizQuestion[] {
  const entry = quizAssessmentData.find(
    (e) => e.grade.toLowerCase().replace(/\s+/g, '-') === gradeKey
  );
  // Also try without hyphens / Kindergarten variants
  const entry2 =
    entry ||
    quizAssessmentData.find(
      (e) => e.grade.toLowerCase().replace(/\s+/g, '') === gradeKey.replace(/-/g, '')
    );
  return (entry2?.questions ?? []).map((q, i) => ({
    id: q.id || `legacy-${i}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    solution: q.solution,
  }));
}

function sectionFromLegacy(
  legacy: QuizQuestion[],
  section: 'math' | 'ela' | 'science'
): QuizQuestion[] {
  if (section === 'math') return legacy.slice(0, 10);
  if (section === 'ela') return legacy.slice(10, 20);
  return legacy.slice(20, 30).length
    ? legacy.slice(20, 30)
    : legacy.slice(20); // whatever science remains
}

async function drawHsScience(count: number): Promise<QuizQuestion[]> {
  const { physics, chemistry, biology } = await getHsSciencePools();
  // Aim for ~equal share from each subject
  const base = Math.floor(count / 3);
  const rem = count - base * 3;
  const shares = [
    { pool: physics, n: base + (rem > 0 ? 1 : 0) },
    { pool: chemistry, n: base + (rem > 1 ? 1 : 0) },
    { pool: biology, n: base },
  ];

  const parts: QuizQuestion[] = [];
  const used = new Set<string>();
  for (const { pool, n } of shares) {
    const drawn = drawBalanced(pool, n);
    for (const q of drawn) {
      if (used.has(q.id)) continue;
      used.add(q.id);
      parts.push(q);
    }
  }
  // fill if short
  if (parts.length < count) {
    const all = shuffle([...physics, ...chemistry, ...biology]).filter((q) => !used.has(q.id));
    for (const q of all) {
      if (parts.length >= count) break;
      used.add(q.id);
      parts.push(toQuizQuestion(q));
    }
  }
  return shuffle(parts.slice(0, count));
}

export interface GeneratedAssessment {
  gradeParam: string;
  questions: QuizQuestion[];
  meta: {
    mathSource: 'new' | 'legacy';
    elaSource: 'new' | 'legacy';
    scienceSource: 'new-grade' | 'new-hs' | 'legacy' | 'none';
    generatedAt: number;
  };
}

export type GenerateProgress = (message: string) => void;

/**
 * Build a quiz-assessment: 20 picture questions for Pre-K–Grade 2, 30 for Grades 3–12.
 */
export async function generateGradeAssessment(
  gradeParam: string,
  opts?: { delayMs?: number; onProgress?: GenerateProgress }
): Promise<GeneratedAssessment> {
  const delayMs = opts?.delayMs ?? 400;
  const onProgress = opts?.onProgress;
  const started = Date.now();

  const parts = parseGradeParts(gradeParam);

  if (isEarlyPictureGrade(gradeParam)) {
    const key = parts.isPreK
      ? 'pre-k'
      : parts.isKindergarten
      ? 'kindergarten'
      : (parts.num as '1' | '2');
    onProgress?.('Loading picture questions...');
    const bank = getPictureBank(key);
    onProgress?.('Drawing math and ELA pictures...');
    const math = drawBalanced(bank.math, SECTION_SIZE).map((q) => ({ ...q, subject: 'math' }));
    const ela = drawBalanced(bank.ela, SECTION_SIZE).map((q) => ({ ...q, subject: 'ela' }));
    const elapsedEarly = Date.now() - started;
    if (delayMs > elapsedEarly) {
      await new Promise((r) => setTimeout(r, delayMs - elapsedEarly));
    }
    return {
      gradeParam: parts.key,
      questions: [...math, ...ela],
      meta: {
        mathSource: 'new',
        elaSource: 'new',
        scienceSource: 'none',
        generatedAt: Date.now(),
      },
    };
  }

  const legacy = legacyGradeQuestions(parts.key);

  // ── Math ──────────────────────────────────────────────────────────────
  let math: QuizQuestion[];
  let mathSource: 'new' | 'legacy' = 'legacy';
  if (parts.isPreK || parts.isKindergarten) {
    math = sectionFromLegacy(legacy, 'math');
  } else if (parts.num && hasNewMathBank(parts.num)) {
    onProgress?.('Loading math question bank...');
    const bank = await getMathBank(parts.num);
    onProgress?.('Drawing math questions...');
    math = drawBalanced(bank, SECTION_SIZE);
    mathSource = 'new';
  } else {
    // 8–12 (or unknown): legacy until new banks arrive
    math = sectionFromLegacy(legacy, 'math');
  }
  // Ensure length 10 — pad from legacy if bank was thin
  if (math.length < SECTION_SIZE) {
    const pad = sectionFromLegacy(legacy, 'math').filter(
      (q) => !math.some((m) => m.question === q.question)
    );
    math = [...math, ...pad].slice(0, SECTION_SIZE);
  }

  // ── ELA ───────────────────────────────────────────────────────────────
  let ela: QuizQuestion[];
  let elaSource: 'new' | 'legacy' = 'legacy';
  if (parts.num && hasNewElaBank(parts.num)) {
    onProgress?.('Loading ELA question bank...');
    const bank = await getElaBank(parts.num);
    onProgress?.('Drawing ELA questions...');
    ela = drawBalanced(bank, SECTION_SIZE);
    elaSource = 'new';
  } else {
    onProgress?.('Loading ELA questions...');
    ela = sectionFromLegacy(legacy, 'ela');
  }
  if (ela.length < SECTION_SIZE) {
    const pad = sectionFromLegacy(legacy, 'ela').filter(
      (q) => !ela.some((e) => e.question === q.question)
    );
    ela = [...ela, ...pad].slice(0, SECTION_SIZE);
  }
  ela = ela.slice(0, SECTION_SIZE);

  // ── Science ───────────────────────────────────────────────────────────
  let science: QuizQuestion[];
  let scienceSource: 'new-grade' | 'new-hs' | 'legacy' = 'legacy';
  if (parts.isPreK) {
    science = sectionFromLegacy(legacy, 'science');
  } else if (parts.isKindergarten) {
    onProgress?.('Loading science question bank...');
    science = drawBalanced(await getScienceBank('kindergarten'), SECTION_SIZE);
    scienceSource = 'new-grade';
  } else if (parts.num && Number(parts.num) >= 1 && Number(parts.num) <= 8) {
    onProgress?.('Loading science question bank...');
    const bank = await getScienceBank(parts.num);
    onProgress?.('Drawing science questions...');
    science = drawBalanced(bank, SECTION_SIZE);
    scienceSource = 'new-grade';
  } else if (parts.isHs || (parts.num && Number(parts.num) >= 9 && Number(parts.num) <= 12)) {
    onProgress?.('Pooling Physics, Chemistry & Biology...');
    science = await drawHsScience(SECTION_SIZE);
    scienceSource = 'new-hs';
  } else {
    science = sectionFromLegacy(legacy, 'science');
  }
  if (science.length < SECTION_SIZE) {
    const pad = sectionFromLegacy(legacy, 'science').filter(
      (q) => !science.some((s) => s.question === q.question)
    );
    science = [...science, ...pad].slice(0, SECTION_SIZE);
  }

  onProgress?.('Shuffling your personalized assessment...');
  math = math.map((q) => ({ ...q, subject: 'math' }));
  ela = ela.map((q) => ({ ...q, subject: 'ela' }));
  science = science.map((q) => ({ ...q, subject: 'science' }));

  const questions = [...math, ...ela, ...science];

  const elapsed = Date.now() - started;
  if (delayMs > elapsed) {
    await new Promise((r) => setTimeout(r, delayMs - elapsed));
  }

  return {
    gradeParam: parts.key,
    questions,
    meta: {
      mathSource,
      elaSource,
      scienceSource,
      generatedAt: Date.now(),
    },
  };
}

export function saveGeneratedAssessment(data: GeneratedAssessment) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GENERATED_KEY, JSON.stringify(data));
}

function gradesMatch(a: string, b: string): boolean {
  const na = normalizeGradeKey(a);
  const nb = normalizeGradeKey(b);
  if (na === nb) return true;
  return na.replace(/-/g, '') === nb.replace(/-/g, '');
}

export function loadGeneratedAssessment(
  gradeParam: string | null | undefined
): GeneratedAssessment | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GENERATED_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GeneratedAssessment;
    if (!gradesMatch(data.gradeParam, gradeParam ?? '')) return null;
    if (!Array.isArray(data.questions) || data.questions.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearGeneratedAssessment() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GENERATED_KEY);
}

/** Call before navigating into a new quiz-assessment so the student gets a fresh draw. */
export function beginFreshAssessment() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GENERATED_KEY);
  localStorage.removeItem('quizState');
  localStorage.removeItem('quiz-end-time');
  localStorage.removeItem('elaSkipped');
  localStorage.removeItem('quizDurations');
  localStorage.removeItem('testDurations');
}
