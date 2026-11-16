import { supabase } from '@/lib/supabaseClient';

export type LiveEvalStatus =
  | 'active'
  | 'pause_requested'
  | 'paused'
  | 'completed'
  | 'abandoned';

export interface LiveEvaluationSession {
  id: string;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
  student_id: string | null;
  student_name: string;
  student_email: string | null;
  student_gender: string | null;
  assessment_type: string;
  assessment_label: string | null;
  grade: string | null;
  section: string | null;
  test_id: string | null;
  status: LiveEvalStatus;
  total_questions: number;
  questions_attempted: number;
  current_question_index: number;
  answers_count: number;
  timer_total_seconds: number;
  timer_remaining_seconds: number;
  timer_ends_at: string | null;
  pause_reason: string | null;
  paused_at: string | null;
  resumed_at: string | null;
  completed_at: string | null;
  client_key: string | null;
}

export const LIVE_SESSION_STORAGE_KEY = 'liveEvaluationSessionId';

export const ACTIVE_LIVE_STATUSES: LiveEvalStatus[] = [
  'active',
  'pause_requested',
  'paused',
];

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export function computeRemainingSeconds(session: Pick<
  LiveEvaluationSession,
  'status' | 'timer_remaining_seconds' | 'timer_ends_at'
>) {
  // Only fully frozen after admin grants pause
  if (session.status === 'paused') {
    return Math.max(0, session.timer_remaining_seconds || 0);
  }
  if (session.timer_ends_at) {
    return Math.max(
      0,
      Math.floor((new Date(session.timer_ends_at).getTime() - Date.now()) / 1000)
    );
  }
  return Math.max(0, session.timer_remaining_seconds || 0);
}

export type StartLiveSessionInput = {
  studentId?: string | null;
  studentName: string;
  studentEmail?: string | null;
  studentGender?: string | null;
  assessmentType: string;
  assessmentLabel: string;
  grade?: string | null;
  section?: string | null;
  testId?: string | null;
  totalQuestions: number;
  timerTotalSeconds: number;
  clientKey: string;
};

export async function startLiveSession(input: StartLiveSessionInput) {
  const now = new Date();
  const endsAt = new Date(now.getTime() + input.timerTotalSeconds * 1000);

  // Reuse open session for same client_key if still live
  const { data: existing } = await supabase
    .from('live_evaluation_sessions')
    .select('*')
    .eq('client_key', input.clientKey)
    .in('status', ACTIVE_LIVE_STATUSES)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    localStorage.setItem(LIVE_SESSION_STORAGE_KEY, existing.id);
    return existing as LiveEvaluationSession;
  }

  const payload = {
    student_id: input.studentId ?? null,
    student_name: input.studentName || 'Student',
    student_email: input.studentEmail ?? null,
    student_gender: input.studentGender ?? null,
    assessment_type: input.assessmentType,
    assessment_label: input.assessmentLabel,
    grade: input.grade ?? null,
    section: input.section ?? null,
    test_id: input.testId ?? null,
    status: 'active' as LiveEvalStatus,
    total_questions: input.totalQuestions,
    questions_attempted: 0,
    current_question_index: 0,
    answers_count: 0,
    timer_total_seconds: input.timerTotalSeconds,
    timer_remaining_seconds: input.timerTotalSeconds,
    timer_ends_at: endsAt.toISOString(),
    client_key: input.clientKey,
    last_seen_at: now.toISOString(),
  };

  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  localStorage.setItem(LIVE_SESSION_STORAGE_KEY, data.id);
  return data as LiveEvaluationSession;
}

export async function heartbeatLiveSession(
  id: string,
  patch: {
    questionsAttempted?: number;
    currentQuestionIndex?: number;
    answersCount?: number;
    section?: string | null;
    timerRemainingSeconds?: number;
    totalQuestions?: number;
    timerTotalSeconds?: number;
  }
) {
  const updates: Record<string, unknown> = {
    last_seen_at: new Date().toISOString(),
  };
  if (patch.questionsAttempted != null) updates.questions_attempted = patch.questionsAttempted;
  if (patch.currentQuestionIndex != null)
    updates.current_question_index = patch.currentQuestionIndex;
  if (patch.answersCount != null) updates.answers_count = patch.answersCount;
  if (patch.section !== undefined) updates.section = patch.section;
  if (patch.totalQuestions != null) updates.total_questions = patch.totalQuestions;
  if (patch.timerTotalSeconds != null) updates.timer_total_seconds = patch.timerTotalSeconds;
  if (patch.timerRemainingSeconds != null) {
    updates.timer_remaining_seconds = patch.timerRemainingSeconds;
    // Keep ends_at aligned while active so admin sees live countdown
    updates.timer_ends_at = new Date(
      Date.now() + patch.timerRemainingSeconds * 1000
    ).toISOString();
  }

  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .update(updates)
    .eq('id', id)
    .in('status', ACTIVE_LIVE_STATUSES)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data as LiveEvaluationSession | null;
}

export async function requestPauseLiveSession(
  id: string,
  remainingSeconds: number,
  reason?: string
) {
  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .update({
      status: 'pause_requested',
      timer_remaining_seconds: Math.max(0, remainingSeconds),
      pause_reason: reason || 'Student requested a pause',
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', id)
    .in('status', ['active', 'pause_requested'])
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data as LiveEvaluationSession | null;
}

export async function cancelPauseRequestLiveSession(id: string, remainingSeconds: number) {
  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .update({
      status: 'active',
      timer_remaining_seconds: Math.max(0, remainingSeconds),
      timer_ends_at: new Date(Date.now() + Math.max(0, remainingSeconds) * 1000).toISOString(),
      pause_reason: null,
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'pause_requested')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data as LiveEvaluationSession | null;
}

export async function grantPauseLiveSession(id: string, remainingSeconds?: number) {
  const { data: current } = await supabase
    .from('live_evaluation_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!current) throw new Error('Session not found');

  const remaining =
    remainingSeconds != null
      ? remainingSeconds
      : computeRemainingSeconds(current as LiveEvaluationSession);

  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .update({
      status: 'paused',
      timer_remaining_seconds: Math.max(0, remaining),
      timer_ends_at: null,
      paused_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', id)
    .in('status', ['active', 'pause_requested', 'paused'])
    .select('*')
    .single();

  if (error) throw error;
  return data as LiveEvaluationSession;
}

export async function resumeLiveSession(id: string) {
  const { data: current } = await supabase
    .from('live_evaluation_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!current) throw new Error('Session not found');

  const remaining = Math.max(0, current.timer_remaining_seconds || 0);
  const endsAt = new Date(Date.now() + remaining * 1000);

  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .update({
      status: 'active',
      timer_remaining_seconds: remaining,
      timer_ends_at: endsAt.toISOString(),
      resumed_at: new Date().toISOString(),
      pause_reason: null,
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', id)
    .in('status', ['paused', 'pause_requested'])
    .select('*')
    .single();

  if (error) throw error;
  return data as LiveEvaluationSession;
}

export async function completeLiveSession(id: string, remainingSeconds?: number) {
  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      timer_remaining_seconds:
        remainingSeconds != null ? Math.max(0, remainingSeconds) : undefined,
      timer_ends_at: null,
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  localStorage.removeItem(LIVE_SESSION_STORAGE_KEY);
  return data as LiveEvaluationSession | null;
}

export async function fetchActiveLiveSessions() {
  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .select('*')
    .in('status', ACTIVE_LIVE_STATUSES)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as LiveEvaluationSession[];
}

export async function fetchLiveSession(id: string) {
  const { data, error } = await supabase
    .from('live_evaluation_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as LiveEvaluationSession | null;
}
