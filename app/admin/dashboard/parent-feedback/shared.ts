export type FeedbackStatus = 'new' | 'reviewed' | 'follow_up' | 'closed';

export interface ParentFeedback {
  id: string;
  created_at: string;
  updated_at?: string | null;
  parent_name: string | null;
  parent_email: string | null;
  student_names: string[] | null;
  tenure: string | null;
  subjects: string[] | null;
  subject_other: string | null;

  // New simplified form
  tutoring_quality: string | null;
  learning_progress: string | null;
  communication_support: string | null;
  works_well: string | null;

  // Legacy long-form fields (still shown if present)
  teaching_ratings: Record<string, number> | null;
  enjoy: string | null;
  appreciate_tutor: string | null;
  progress: string | null;
  improvements: string[] | null;
  improvement_other: string | null;
  reports: string | null;
  alignment: string | null;
  focus_areas: string | null;
  admin_ratings: Record<string, number> | null;
  responsiveness: string | null;
  challenges: string | null;
  challenge_details: string | null;

  overall: string | null;
  nps: number | null;
  strength: string | null;
  improve: string | null;
  services: string[] | null;
  service_other: string | null;
  additional: string | null;
  followup: string | null;
  status: FeedbackStatus | null;
  admin_notes: string | null;
  tags: string[] | null;
}

export const TEACHING_LABELS: Record<string, string> = {
  subject_knowledge: 'Subject knowledge',
  explain_clearly: 'Explains clearly',
  patience: 'Patience',
  engage_motivate: 'Engage & motivate',
  preparation: 'Preparation',
  adapt_lessons: 'Adapts lessons',
  punctuality: 'Punctuality',
  overall_teaching: 'Overall teaching',
};

export const ADMIN_LABELS: Record<string, string> = {
  promptness: 'Promptness',
  clarity: 'Clarity',
  schedule_notifications: 'Schedule notices',
  ease_of_contact: 'Ease of contact',
  concern_resolution: 'Concern resolution',
  progress_updates: 'Progress updates',
};

export const STATUS_OPTIONS: { value: FeedbackStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-sky-100 text-sky-800' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'follow_up', label: 'Follow-up needed', color: 'bg-amber-100 text-amber-900' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-700' },
];

export const SUGGESTED_TAGS = [
  'Tutor: Isaac',
  'Tutor: Abdul',
  'Tutor: Faith',
  'Tutor: Hafisat',
  'Tutor: Ephraim',
  'Tutor: Bright',
  'Math',
  'ELA',
  'Science',
  'Coding',
  'SAT / Test prep',
  'Scheduling',
  'Communication',
  'Progress reports',
  'Priority',
];

export const avg = (arr: number[]) =>
  arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

/** Prefer new simplified fields, fall back to legacy. */
export function displayProgress(r: ParentFeedback) {
  return r.learning_progress || r.progress || null;
}

export function displayWorksWell(r: ParentFeedback) {
  return r.works_well || r.strength || null;
}

export function isLegacyResponse(r: ParentFeedback) {
  return !!(
    r.teaching_ratings &&
    Object.keys(r.teaching_ratings).length > 0
  ) || !!(r.admin_ratings && Object.keys(r.admin_ratings).length > 0);
}

export function lowTeachingScores(r: ParentFeedback) {
  return Object.entries(r.teaching_ratings ?? {})
    .filter(([, v]) => typeof v === 'number' && v <= 2)
    .map(([k, v]) => ({ key: k, label: TEACHING_LABELS[k] || k, value: v as number }));
}

export function lowAdminScores(r: ParentFeedback) {
  return Object.entries(r.admin_ratings ?? {})
    .filter(([, v]) => typeof v === 'number' && v <= 2)
    .map(([k, v]) => ({ key: k, label: ADMIN_LABELS[k] || k, value: v as number }));
}

const NEGATIVE_OVERALL = new Set([
  'Very dissatisfied',
  'Dissatisfied',
  'Very Dissatisfied',
]);

export function isLowRisk(r: ParentFeedback) {
  const npsLow = typeof r.nps === 'number' && r.nps <= 6;
  const overallLow = !!(r.overall && NEGATIVE_OVERALL.has(r.overall));
  const progressLow = (r.learning_progress || r.progress || '') === 'Fallen behind';
  return npsLow || overallLow || progressLow || lowTeachingScores(r).length > 0 || lowAdminScores(r).length > 0;
}

export function wantsFollowUp(r: ParentFeedback) {
  return (r.followup || '').toLowerCase() === 'yes';
}

export function buildSummaryText(r: ParentFeedback) {
  const lines = [
    `SmartMathz parent feedback — ${fmtDate(r.created_at)}`,
    `Parent: ${r.parent_name || '—'}`,
    `Email: ${r.parent_email || '—'}`,
    `Students: ${(r.student_names ?? []).filter(Boolean).join(', ') || '—'}`,
    `Subjects: ${(r.subjects ?? []).join(', ') || '—'}`,
    `Tutoring quality: ${r.tutoring_quality || '—'}`,
    `Learning progress: ${displayProgress(r) || '—'}`,
    `Communication: ${r.communication_support || '—'}`,
    `Overall: ${r.overall || '—'} | NPS: ${r.nps ?? '—'}`,
    `Follow-up requested: ${r.followup || '—'}`,
    `Status: ${r.status || 'new'}`,
    `Tags: ${(r.tags ?? []).join(', ') || '—'}`,
    isLowRisk(r) ? '⚠️ Flagged for attention' : 'No low-score flags',
    displayWorksWell(r) ? `Working well: ${displayWorksWell(r)}` : null,
    r.improve ? `Improve: ${r.improve}` : null,
    r.admin_notes ? `Admin notes: ${r.admin_notes}` : null,
  ].filter(Boolean);
  return lines.join('\n');
}

function escapeCell(v: string | number | null | undefined) {
  const s = v == null ? '' : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function feedbackToCsvRows(source: ParentFeedback[]) {
  const headers = [
    'Submitted at',
    'Status',
    'Parent name',
    'Parent email',
    'Student names',
    'Subjects',
    'Tutoring quality',
    'Learning progress',
    'Communication & support',
    'Overall satisfaction',
    'NPS (0-10)',
    'Working well',
    'One improvement',
    'Willing to follow up',
    'Tags',
    'Admin notes',
  ];

  const lines = [
    headers.map(escapeCell).join(','),
    ...source.map((r) =>
      [
        new Date(r.created_at).toISOString(),
        r.status || 'new',
        r.parent_name,
        r.parent_email,
        (r.student_names ?? []).filter(Boolean).join('; '),
        (r.subjects ?? []).join('; '),
        r.tutoring_quality,
        displayProgress(r),
        r.communication_support,
        r.overall,
        r.nps,
        displayWorksWell(r),
        r.improve,
        r.followup,
        (r.tags ?? []).join('; '),
        r.admin_notes,
      ]
        .map(escapeCell)
        .join(',')
    ),
  ];
  return lines.join('\r\n');
}

export function downloadFeedbackCsv(source: ParentFeedback[], filename: string) {
  const blob = new Blob(['\uFEFF' + feedbackToCsvRows(source)], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function normalizeName(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export interface LinkedSubscription {
  id: string;
  student_first_name: string;
  student_last_name: string;
  parent_email: string | null;
  email: string | null;
  programme_package: string | null;
}

export function matchSubscriptions(
  feedback: ParentFeedback,
  subs: LinkedSubscription[]
): LinkedSubscription[] {
  const studentNames = (feedback.student_names ?? [])
    .map(normalizeName)
    .filter(Boolean);

  return subs.filter((s) => {
    const full = normalizeName(`${s.student_first_name} ${s.student_last_name}`);
    const first = normalizeName(s.student_first_name || '');
    const last = normalizeName(s.student_last_name || '');
    return studentNames.some(
      (n) =>
        n === full ||
        full.includes(n) ||
        n.includes(full) ||
        (first && n.includes(first)) ||
        (last && n.includes(last))
    );
  });
}
