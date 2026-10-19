/**
 * Async loaders for converted K–12 question banks.
 * Only the grade/subject needed for an attempt is loaded into the bundle chunk.
 */
import type { BankQuestion } from '@/app/utils/gradeAssessmentGenerator';

const MATH_GRADES = new Set(['1', '2', '3', '4', '5', '6', '7']);
const ELA_GRADES = new Set(['1', '2', '3', '4', '5', '6', '7']);
const SCIENCE_GRADES = new Set([
  'kindergarten', '1', '2', '3', '4', '5', '6', '7', '8',
]);

export function hasNewMathBank(gradeNum: string | null): boolean {
  return !!gradeNum && MATH_GRADES.has(gradeNum);
}

export function hasNewElaBank(gradeNum: string | null): boolean {
  return !!gradeNum && ELA_GRADES.has(gradeNum);
}

export function hasNewScienceBank(gradeKey: string | null): boolean {
  if (!gradeKey) return false;
  if (SCIENCE_GRADES.has(gradeKey)) return true;
  const n = Number(gradeKey);
  return n >= 9 && n <= 12;
}

export async function getMathBank(gradeNum: string): Promise<BankQuestion[]> {
  switch (gradeNum) {
    case '1': return (await import('./math/grade-1.json')).default as BankQuestion[];
    case '2': return (await import('./math/grade-2.json')).default as BankQuestion[];
    case '3': return (await import('./math/grade-3.json')).default as BankQuestion[];
    case '4': return (await import('./math/grade-4.json')).default as BankQuestion[];
    case '5': return (await import('./math/grade-5.json')).default as BankQuestion[];
    case '6': return (await import('./math/grade-6.json')).default as BankQuestion[];
    case '7': return (await import('./math/grade-7.json')).default as BankQuestion[];
    default: return [];
  }
}

export async function getElaBank(gradeNum: string): Promise<BankQuestion[]> {
  switch (gradeNum) {
    case '1': return (await import('./ela/grade-1.json')).default as BankQuestion[];
    case '2': return (await import('./ela/grade-2.json')).default as BankQuestion[];
    case '3': return (await import('./ela/grade-3.json')).default as BankQuestion[];
    case '4': return (await import('./ela/grade-4.json')).default as BankQuestion[];
    case '5': return (await import('./ela/grade-5.json')).default as BankQuestion[];
    case '6': return (await import('./ela/grade-6.json')).default as BankQuestion[];
    case '7': return (await import('./ela/grade-7.json')).default as BankQuestion[];
    default: return [];
  }
}

export async function getScienceBank(gradeKey: string): Promise<BankQuestion[]> {
  switch (gradeKey) {
    case 'kindergarten':
      return (await import('./science/kindergarten.json')).default as BankQuestion[];
    case '1': return (await import('./science/grade-1.json')).default as BankQuestion[];
    case '2': return (await import('./science/grade-2.json')).default as BankQuestion[];
    case '3': return (await import('./science/grade-3.json')).default as BankQuestion[];
    case '4': return (await import('./science/grade-4.json')).default as BankQuestion[];
    case '5': return (await import('./science/grade-5.json')).default as BankQuestion[];
    case '6': return (await import('./science/grade-6.json')).default as BankQuestion[];
    case '7': return (await import('./science/grade-7.json')).default as BankQuestion[];
    case '8': return (await import('./science/grade-8.json')).default as BankQuestion[];
    default: return [];
  }
}

export async function getHsSciencePools(): Promise<{
  physics: BankQuestion[];
  chemistry: BankQuestion[];
  biology: BankQuestion[];
}> {
  const [physics, chemistry, biology] = await Promise.all([
    import('./science/physics.json'),
    import('./science/chemistry.json'),
    import('./science/biology.json'),
  ]);
  return {
    physics: physics.default as BankQuestion[],
    chemistry: chemistry.default as BankQuestion[],
    biology: biology.default as BankQuestion[],
  };
}
