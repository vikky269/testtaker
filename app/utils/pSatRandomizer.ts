// app/utils/psatRandomizer.ts
// Draws a fresh, unique-per-attempt question set for all 4 PSAT modules.
// This is the ONLY file that imports the full question pools — the quiz page
// calls it once at attempt creation; review/report/admin never import the
// pools at all, since a finished submission stores its own question objects.
//
// Math grid-in ("student-produced response") items are excluded for now —
// QuizBody only renders multiple-choice buttons; adding a text-entry answer
// type is a separate, deliberate UI change, not bundled into this build.

import mathPoolRaw from '@/app/data/psatMathPool.json';
import rwPoolRaw from '@/app/data/psatRwPool.json';
import { MODULE_ORDER, MODULE_DIFFICULTY_MIX, type PSATModuleKey } from '@/app/data/pSatconfig'

export interface PSATQuestion {
  id: string;
  question: string;
  options: string[] | null;
  correctAnswer: string;
  solution?: string;
  domain: string;
  subtopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const mathPool: PSATQuestion[] = (mathPoolRaw as PSATQuestion[]).filter(q => q.options !== null);
const rwPool: PSATQuestion[] = rwPoolRaw as PSATQuestion[];

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Draws `count` questions of one difficulty tier from `pool`, spread as evenly
// as possible across the domains present at that tier, excluding any id
// already used elsewhere in this attempt.
function drawTier(pool: PSATQuestion[], difficulty: 'easy' | 'medium' | 'hard', count: number, usedIds: Set<string>): PSATQuestion[] {
  const tierPool = pool.filter(q => q.difficulty === difficulty && !usedIds.has(q.id));
  const byDomain = new Map<string, PSATQuestion[]>();
  for (const q of tierPool) {
    if (!byDomain.has(q.domain)) byDomain.set(q.domain, []);
    byDomain.get(q.domain)!.push(q);
  }
  // Shuffle within each domain bucket
  for (const [k, list] of byDomain) byDomain.set(k, shuffle(list));

  const domains = shuffle([...byDomain.keys()]);
  const picked: PSATQuestion[] = [];
  let round = 0;
  while (picked.length < count && domains.some(d => (byDomain.get(d)?.length ?? 0) > round)) {
    for (const d of domains) {
      if (picked.length >= count) break;
      const bucket = byDomain.get(d)!;
      if (bucket[round]) picked.push(bucket[round]);
    }
    round++;
  }
  return picked;
}

// Draws one module's full question set (all 3 difficulty tiers combined + shuffled).
function drawModule(pool: PSATQuestion[], moduleKey: PSATModuleKey, usedIds: Set<string>): PSATQuestion[] {
  const mix = MODULE_DIFFICULTY_MIX[moduleKey];
  const easy = drawTier(pool, 'easy', mix.easy, usedIds);
  const medium = drawTier(pool, 'medium', mix.medium, usedIds);
  const hard = drawTier(pool, 'hard', mix.hard, usedIds);
  const all = shuffle([...easy, ...medium, ...hard]);
  all.forEach(q => usedIds.add(q.id));
  return all;
}

export interface DrawnAttempt {
  rw1: PSATQuestion[]; rw2: PSATQuestion[];
  math1: PSATQuestion[]; math2: PSATQuestion[];
}

// Draws all 4 modules for a brand-new attempt — no question repeats across
// the whole 98-question attempt (R&W modules pull from the R&W pool only,
// Math modules from the Math pool only, but repeats are also blocked within
// each pool's own two modules).
export function drawFullAttempt(): DrawnAttempt {
  const rwUsed = new Set<string>();
  const mathUsed = new Set<string>();
  return {
    rw1: drawModule(rwPool, 'rw1', rwUsed),
    rw2: drawModule(rwPool, 'rw2', rwUsed),
    math1: drawModule(mathPool, 'math1', mathUsed),
    math2: drawModule(mathPool, 'math2', mathUsed),
  };
}

// Rebuilds a module's question array from a stored list of ids (used on resume,
// and when reconstructing from an existing psat_attempts row).
export function lookupByIds(moduleKey: PSATModuleKey, ids: string[]): PSATQuestion[] {
  const pool = moduleKey === 'rw1' || moduleKey === 'rw2' ? rwPool : mathPool;
  const map = new Map(pool.map(q => [q.id, q]));
  return ids.map(id => map.get(id)).filter((q): q is PSATQuestion => !!q);
}

export function idsOf(questions: PSATQuestion[]): string[] {
  return questions.map(q => q.id);
}