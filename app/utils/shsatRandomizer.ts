/**
 * Draws SHSAT ELA + Math sets once per attempt.
 * Review/report should use stored submission questions — not re-import pools.
 */
import elaPoolRaw from '@/app/data/shsatElaPool.json';
import mathPoolRaw from '@/app/data/shsatMathPool.json';
import { SECTION_DRAW, type SHSATSectionKey } from '@/app/data/shsatConfig';

export interface SHSATQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  solution?: string;
  domain?: string;
  subtopic?: string;
  difficulty?: string;
  source?: string;
  sourceNumber?: number;
}

const elaPool = elaPoolRaw as SHSATQuestion[];
const mathPool = (mathPoolRaw as SHSATQuestion[]).filter(
  (q) => Array.isArray(q.options) && q.options.length >= 2 && Boolean(q.correctAnswer)
);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawFrom(pool: SHSATQuestion[], count: number): SHSATQuestion[] {
  const n = Math.min(count, pool.length);
  return shuffle(pool).slice(0, n);
}

export interface DrawnShsatAttempt {
  ela: SHSATQuestion[];
  math: SHSATQuestion[];
}

export function drawFullAttempt(): DrawnShsatAttempt {
  return {
    ela: drawFrom(elaPool, SECTION_DRAW.ela),
    math: drawFrom(mathPool, SECTION_DRAW.math),
  };
}

export function lookupByIds(section: SHSATSectionKey, ids: string[]): SHSATQuestion[] {
  const pool = section === 'ela' ? elaPool : mathPool;
  const byId = new Map(pool.map((q) => [q.id, q]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as SHSATQuestion[];
}

export function idsOf(questions: SHSATQuestion[]): string[] {
  return questions.map((q) => q.id);
}

export function poolSizes() {
  return { ela: elaPool.length, math: mathPool.length };
}
