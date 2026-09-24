// app/data/psatConfig.ts
// PSAT module structure — small config file, does NOT import the question pools
// (those are only needed where actual random drawing happens: psatRandomizer.ts).
// Review/report/admin pages only need this file + whatever's stored in a
// submission's own `questions` array — never the multi-MB pool files.

export type PSATModuleKey = 'rw1' | 'rw2' | 'math1' | 'math2';

export const MODULE_ORDER: PSATModuleKey[] = ['rw1', 'rw2', 'math1', 'math2'];

export const MODULE_TITLE: Record<PSATModuleKey, string> = {
  rw1: 'Reading & Writing — Module 1',
  rw2: 'Reading & Writing — Module 2',
  math1: 'Math — Module 1',
  math2: 'Math — Module 2',
};

export const MODULE_SHORT_LABEL: Record<PSATModuleKey, string> = {
  rw1: 'R&W 1', rw2: 'R&W 2', math1: 'Math 1', math2: 'Math 2',
};

// Seconds per module: R&W 32 min, Math 35 min
export const MODULE_TIME: Record<PSATModuleKey, number> = {
  rw1: 32 * 60, rw2: 32 * 60, math1: 35 * 60, math2: 35 * 60,
};

export const MODULE_QUESTION_COUNT: Record<PSATModuleKey, number> = {
  rw1: 27, rw2: 27, math1: 22, math2: 22,
};

// Difficulty mix per module (must sum to the module's question count).
// Roughly even thirds — adjust freely, this is the only place it's defined.
export const MODULE_DIFFICULTY_MIX: Record<PSATModuleKey, { easy: number; medium: number; hard: number }> = {
  rw1:   { easy: 9, medium: 9, hard: 9 },
  rw2:   { easy: 9, medium: 9, hard: 9 },
  math1: { easy: 8, medium: 7, hard: 7 },
  math2: { easy: 8, medium: 7, hard: 7 },
};

// Boundaries within the SAVED, concatenated 98-question submission array
// (order: rw1, rw2, math1, math2) — used by review/report/testSheet, exactly
// like GED_SECTIONS / SAT_SECTIONS work for those quiz types.
export const PSAT_SECTIONS = [
  { key: 'rw1',   label: MODULE_TITLE.rw1,   start: 0,  end: 27 },
  { key: 'rw2',   label: MODULE_TITLE.rw2,   start: 27, end: 54 },
  { key: 'math1', label: MODULE_TITLE.math1, start: 54, end: 76 },
  { key: 'math2', label: MODULE_TITLE.math2, start: 76, end: 98 },
] as const;

export const TOTAL_QUESTIONS = 98; // 54 R&W + 44 Math
export const RW_TOTAL = 54;
export const MATH_TOTAL = 44;