import type { BankQuestion, Difficulty, QuizQuestion } from '@/app/utils/gradeAssessmentGenerator';
import type { VaBankQuestion, VaOption, VisualSpec } from './types';

export type VisualQuizQuestion = QuizQuestion & {
  visual?: VisualSpec | null;
  optionVisuals?: (VisualSpec | null)[];
  optionShowLabels?: boolean[];
  domain?: string;
  skill?: string;
  standard?: string;
  story?: string;
  passage?: string;
  alt?: string;
  optionLayout?: string;
  speech?: string;
  /** Marker so UI knows to use the VA SVG renderer */
  visualKind?: 'va';
};

function orderOptions(q: VaBankQuestion, shuffle: boolean): VaOption[] {
  const opts = q.options.slice();
  if (!shuffle || !q.shuffleOptions) return opts;
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

/** Map a VA bank item into the app's quiz question shape. */
export function adaptVaQuestion(
  q: VaBankQuestion,
  appGrade: string,
  opts?: { shuffle?: boolean }
): VisualQuizQuestion {
  const ordered = orderOptions(q, opts?.shuffle !== false);
  const correct = ordered.find((o) => o.id === q.correctOptionId);
  if (!correct) {
    throw new Error(`Missing correct option for ${q.id}`);
  }

  // Uniquify duplicate labels so answer map keys stay unambiguous
  const labels = ordered.map((o, i) => {
    const twins = ordered.slice(0, i).filter((p) => p.label === o.label).length;
    return twins ? `${o.label}${'\u200b'.repeat(twins)}` : o.label;
  });
  const correctIndex = ordered.findIndex((o) => o.id === q.correctOptionId);

  return {
    id: q.id,
    question: q.instruction,
    options: labels,
    correctAnswer: labels[correctIndex],
    solution: q.explanation,
    difficulty: q.difficulty,
    topic: q.domain,
    domain: q.domain,
    skill: q.skill,
    standard: q.standard,
    subject: q.subject,
    grade: appGrade,
    picture: true,
    stimulus: 'va-visual',
    visualKind: 'va',
    visual: q.visual || { type: 'none' },
    optionVisuals: ordered.map((o) => o.visual || null),
    optionShowLabels: ordered.map((o) => Boolean(o.showLabel || !o.visual)),
    story: q.story,
    passage: q.passage,
    alt: q.alt,
    optionLayout: q.optionLayout,
    speech: q.speech,
  };
}

export function toBankQuestions(list: VaBankQuestion[], appGrade: string): BankQuestion[] {
  return list.map((q) => {
    const adapted = adaptVaQuestion(q, appGrade);
    return {
      id: adapted.id,
      question: adapted.question,
      options: adapted.options,
      correctAnswer: adapted.correctAnswer,
      difficulty: (adapted.difficulty || 'medium') as Difficulty,
      topic: adapted.topic,
      subject: adapted.subject,
      grade: adapted.grade,
      solution: adapted.solution,
      stimulus: adapted.stimulus,
      picture: true,
      // Keep VA fields on the bank so drawBalanced → toQuizQuestion can be extended
      ...(adapted as object),
    } as BankQuestion;
  });
}
