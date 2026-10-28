/**
 * Pre-K, Kindergarten, and Grade 1 picture banks from visual-assessment/
 * (50 Math + 50 ELA each). Grade 2 stays on the emoji pool in pictureAssessments.
 */
import banks from './visualAssessmentBanks.json';
import { adaptVaQuestion } from '@/app/lib/visualAssessment/adapt';
import type { VaBankQuestion } from '@/app/lib/visualAssessment/types';
import type { BankQuestion } from '@/app/utils/gradeAssessmentGenerator';

type AppGrade = 'pre-k' | 'kindergarten' | '1';

const raw = banks as Record<AppGrade, { math: VaBankQuestion[]; ela: VaBankQuestion[] }>;

function adaptBank(list: VaBankQuestion[], appGrade: AppGrade): BankQuestion[] {
  // Stable option order in the stored bank; session draw shuffles when needed.
  return list.map((q) => adaptVaQuestion(q, appGrade, { shuffle: false }) as BankQuestion);
}

const cache: Partial<Record<AppGrade, { math: BankQuestion[]; ela: BankQuestion[] }>> = {};

export function getVisualPictureBank(grade: AppGrade) {
  if (!cache[grade]) {
    const src = raw[grade];
    if (!src) throw new Error(`No visual bank for grade ${grade}`);
    cache[grade] = {
      math: adaptBank(src.math, grade),
      ela: adaptBank(src.ela, grade),
    };
  }
  return cache[grade]!;
}

/** Apply per-session option shuffle for a drawn VA question. */
export function withSessionOptionOrder(q: BankQuestion): BankQuestion {
  if (q.visualKind !== 'va') return q;
  const grade = (q.grade || '') as AppGrade;
  const subject = q.subject === 'ela' ? 'ela' : 'math';
  const src = raw[grade]?.[subject]?.find((item) => item.id === q.id);
  if (!src) return q;
  return adaptVaQuestion(src, grade, { shuffle: true }) as BankQuestion;
}
