export type VisualSpec = {
  type: string;
  [key: string]: unknown;
};

export type VaOption = {
  id: string;
  label: string;
  visual?: VisualSpec;
  showLabel?: boolean;
};

/** Raw question as stored in visualAssessmentBanks.json */
export type VaBankQuestion = {
  id: string;
  grade: string;
  subject: 'math' | 'ela';
  framework?: string;
  standard?: string;
  domain: string;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard' | string;
  instruction: string;
  visual?: VisualSpec | null;
  options: VaOption[];
  correctOptionId: string;
  explanation?: string;
  shuffleOptions?: boolean;
  speech?: string;
  story?: string;
  passage?: string;
  alt?: string;
  optionLayout?: string;
};
