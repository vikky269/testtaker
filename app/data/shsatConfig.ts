// SHSAT diagnostic structure — 2 sections, pools drawn once per attempt.

export type SHSATSectionKey = 'ela' | 'math';

export const SECTION_ORDER: SHSATSectionKey[] = ['ela', 'math'];

export const SECTION_TITLE: Record<SHSATSectionKey, string> = {
  ela: 'English Language Arts',
  math: 'Mathematics',
};

export const SECTION_SHORT_LABEL: Record<SHSATSectionKey, string> = {
  ela: 'ELA',
  math: 'Math',
};

/** Seconds per section — easy to tweak later. */
export const SECTION_TIME: Record<SHSATSectionKey, number> = {
  ela: 90 * 60,
  math: 90 * 60,
};

/** Questions drawn per section from each pool. */
export const SECTION_DRAW: Record<SHSATSectionKey, number> = {
  ela: 50,
  math: 50,
};

export const SHSAT_SECTIONS = [
  { key: 'ela' as const, label: SECTION_TITLE.ela, start: 0, end: 50 },
  { key: 'math' as const, label: SECTION_TITLE.math, start: 50, end: 100 },
];

export const TOTAL_QUESTIONS = 100;
export const ELA_TOTAL = 50;
export const MATH_TOTAL = 50;
