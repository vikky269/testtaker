/**
 * Map SHSAT pool items to skill areas for results / PDF breakdowns.
 * ELA uses bank subtopics; Math uses light keyword classification
 * (pool subtopic is currently mostly "General").
 */

export type ShsatSkillSubject = 'ela' | 'math';

type ShsatSkillSource = {
  question?: string;
  domain?: string;
  subtopic?: string;
  subject?: string;
};

export function shsatSubjectOf(q: ShsatSkillSource, elaSet?: Set<string>): ShsatSkillSubject {
  if (q.subject === 'ela' || q.subject === 'math') return q.subject;
  if (q.domain === 'ELA' || /ela|english|reading|revis/i.test(q.domain || '')) return 'ela';
  if (q.domain === 'Math' || /math/i.test(q.domain || '')) return 'math';
  if (elaSet && q.question && elaSet.has(q.question)) return 'ela';
  return 'math';
}

export function shsatSkillDomain(q: ShsatSkillSource, subject?: ShsatSkillSubject): string {
  const subj = subject || shsatSubjectOf(q);
  if (subj === 'ela') {
    const s = (q.subtopic || '').toLowerCase();
    if (s.includes('revis') || s.includes('edit')) return 'Revising / Editing';
    if (s.includes('read')) return 'Reading Comprehension';
    return q.subtopic?.trim() || 'ELA Skills';
  }

  const text = `${q.question || ''} ${q.subtopic || ''}`.toLowerCase();
  if (
    /angle|triangle|circle|parallel|perimeter|area|volume|square|rectangle|coordinate|geometry|midpoint|shaded|parallelogram|quadrilateral|prism|radius|diameter|circumference/.test(
      text
    )
  ) {
    return 'Geometry & Measurement';
  }
  if (
    /probability|ratio|percent|%|mean|average|survey|table above|data|chance|odds|proportion/.test(
      text
    )
  ) {
    return 'Data, Ratios & Probability';
  }
  if (
    /equation|inequality|variable|solve for|expression|algebra|consecutive|in terms of|simplify this|x\s*=|y\s*=/.test(
      text
    )
  ) {
    return 'Algebra';
  }
  if (
    /fraction|decimal|integer|multiple|factor|prime|number line|absolute|least common|greatest common|mixed number|dividend|divisor/.test(
      text
    )
  ) {
    return 'Number & Operations';
  }
  return 'Problem Solving';
}

/** Annotate questions for buildSkillBreakdown / SkillResultsSummary. */
export function annotateShsatQuestionsForSkills<
  T extends {
    question: string;
    domain?: string;
    subtopic?: string;
    subject?: string;
  }
>(questions: T[], elaQuestions?: T[]) {
  const elaSet = new Set((elaQuestions || []).map((q) => q.question));
  return questions.map((q) => {
    const subject = shsatSubjectOf(q, elaSet);
    return {
      ...q,
      subject,
      domain: shsatSkillDomain(q, subject),
      topic: shsatSkillDomain(q, subject),
    };
  });
}
