import { questionsForSection } from '@/app/utils/gradeAssessmentGenerator';

export type SkillBand = { key: 'strong' | 'growing' | 'practice'; label: string };

export type SkillDomainRow = {
  subject: 'math' | 'ela' | 'science';
  domain: string;
  correct: number;
  total: number;
  percent: number;
  band: SkillBand;
};

export type SkillBreakdown = {
  total: number;
  correct: number;
  percent: number;
  unanswered: number;
  math: { correct: number; total: number; percent: number } | null;
  ela: { correct: number; total: number; percent: number } | null;
  science: { correct: number; total: number; percent: number } | null;
  domains: SkillDomainRow[];
  band: SkillBand;
};

type Q = {
  question: string;
  correctAnswer?: string;
  answer?: string;
  subject?: string;
  topic?: string;
  domain?: string;
};

function pct(c: number, t: number) {
  return t ? Math.round((c / t) * 100) : 0;
}

export function skillBand(percent: number): SkillBand {
  if (percent >= 80) return { key: 'strong', label: 'Strong' };
  if (percent >= 50) return { key: 'growing', label: 'Growing' };
  return { key: 'practice', label: 'Needs practice' };
}

function tidyTopic(topic: string) {
  return topic
    .replace(/\s*\(\d+(ST|ND|RD|TH)\s+GRADE\)\s*$/i, '')
    .replace(/\s*Question Bank.*$/i, '')
    .replace(/^Topic\s+\d+\s+/i, '')
    .trim() || 'General';
}

function sectionStats(
  section: 'math' | 'ela' | 'science',
  questions: Q[],
  answers: Record<string, string>
) {
  const list = questionsForSection(questions, section);
  if (!list.length) return null;
  const correct = list.filter(
    (q) => answers[q.question] === (q.correctAnswer || q.answer)
  ).length;
  return { correct, total: list.length, percent: pct(correct, list.length) };
}

/** Build overall + per-subject + per-topic skill rows for the results summary. */
export function buildSkillBreakdown(
  questions: Q[],
  answers: Record<string, string>
): SkillBreakdown {
  const items = questions.map((q) => {
    const given = answers[q.question];
    const ok = given === (q.correctAnswer || q.answer);
    const subject =
      q.subject === 'math' || q.subject === 'ela' || q.subject === 'science'
        ? q.subject
        : 'math';
    const domain = tidyTopic(q.domain || q.topic || 'General');
    return { subject, domain, answered: given != null && given !== '', correct: ok };
  });

  const domainsMap = new Map<string, SkillDomainRow>();
  for (const item of items) {
    const key = `${item.subject}|${item.domain}`;
    const row =
      domainsMap.get(key) ||
      ({
        subject: item.subject,
        domain: item.domain,
        correct: 0,
        total: 0,
        percent: 0,
        band: skillBand(0),
      } as SkillDomainRow);
    row.total++;
    if (item.correct) row.correct++;
    domainsMap.set(key, row);
  }

  const domains = [...domainsMap.values()]
    .map((d) => {
      d.percent = pct(d.correct, d.total);
      d.band = skillBand(d.percent);
      return d;
    })
    .sort((a, b) =>
      a.subject === b.subject
        ? a.domain.localeCompare(b.domain)
        : a.subject.localeCompare(b.subject)
    );

  const correct = items.filter((i) => i.correct).length;
  const total = items.length;
  const percent = pct(correct, total);

  return {
    total,
    correct,
    percent,
    unanswered: items.filter((i) => !i.answered).length,
    math: sectionStats('math', questions, answers),
    ela: sectionStats('ela', questions, answers),
    science: sectionStats('science', questions, answers),
    domains,
    band: skillBand(percent),
  };
}
