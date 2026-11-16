'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  LIVE_SESSION_STORAGE_KEY,
  LiveEvaluationSession,
  LiveEvalStatus,
  cancelPauseRequestLiveSession,
  completeLiveSession,
  fetchLiveSession,
  heartbeatLiveSession,
  requestPauseLiveSession,
  startLiveSession,
} from '@/lib/liveEvaluation';
import { supabase } from '@/lib/supabaseClient';

export type UseLiveEvaluationArgs = {
  enabled: boolean;
  assessmentType: string;
  assessmentLabel: string;
  grade?: string | null;
  section?: string | null;
  testId?: string | null;
  totalQuestions: number;
  timerTotalSeconds: number;
  questionsAttempted: number;
  currentQuestionIndex: number;
  answersCount: number;
  student?: {
    id?: string | null;
    fullName?: string | null;
    email?: string | null;
    gender?: string | null;
  } | null;
  /** Called when admin resumes — remaining seconds to restore into local timer */
  onAdminResume?: (remainingSeconds: number) => void;
  /** Called when admin grants pause (freeze local timer; do not reset duration) */
  onAdminPause?: (remainingSeconds: number) => void;
};

function clientKeyFor(assessmentType: string, testId?: string | null, grade?: string | null) {
  const base = `live-${assessmentType}-${testId || 'x'}-${grade || 'x'}`;
  try {
    const existing = localStorage.getItem(`${base}-key`);
    if (existing) return existing;
    const key = `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(`${base}-key`, key);
    return key;
  } catch {
    return `${base}-${Date.now()}`;
  }
}

export function useLiveEvaluation(args: UseLiveEvaluationArgs) {
  const [session, setSession] = useState<LiveEvaluationSession | null>(null);
  const [starting, setStarting] = useState(false);
  const remainingRef = useRef<number>(args.timerTotalSeconds);
  const sessionIdRef = useRef<string | null>(null);
  const prevStatusRef = useRef<LiveEvalStatus | null>(null);
  const argsRef = useRef(args);
  argsRef.current = args;

  const status: LiveEvalStatus | null = session?.status ?? null;
  const isPaused = status === 'paused';
  const isPauseRequested = status === 'pause_requested';
  // Timer only freezes after admin grants the pause (not on request alone)
  const timerFrozen = isPaused;

  const setRemaining = useCallback((seconds: number) => {
    remainingRef.current = Math.max(0, Math.floor(seconds));
  }, []);

  const refreshSession = useCallback(async (id: string) => {
    const row = await fetchLiveSession(id);
    if (row) setSession(row);
    return row;
  }, []);

  // Start / resume live session once quiz is ready
  useEffect(() => {
    if (!args.enabled || args.totalQuestions <= 0 || args.timerTotalSeconds <= 0) return;
    if (sessionIdRef.current || starting) return;

    let cancelled = false;
    const run = async () => {
      setStarting(true);
      try {
        const student =
          args.student ||
          (() => {
            try {
              return JSON.parse(localStorage.getItem('activeStudent') || 'null');
            } catch {
              return null;
            }
          })();

        const started = await startLiveSession({
          studentId: student?.id ?? null,
          studentName: student?.fullName || student?.email || 'Student',
          studentEmail: student?.email ?? null,
          studentGender: student?.gender ?? null,
          assessmentType: args.assessmentType,
          assessmentLabel: args.assessmentLabel,
          grade: args.grade,
          section: args.section,
          testId: args.testId,
          totalQuestions: args.totalQuestions,
          timerTotalSeconds: args.timerTotalSeconds,
          clientKey: clientKeyFor(args.assessmentType, args.testId, args.grade),
        });
        if (cancelled) return;
        sessionIdRef.current = started.id;
        remainingRef.current = started.timer_remaining_seconds || args.timerTotalSeconds;
        setSession(started);
        prevStatusRef.current = started.status;
      } catch (err) {
        console.error('live session start failed', err);
        // Table may not exist yet — keep quiz usable
      } finally {
        if (!cancelled) setStarting(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.enabled, args.totalQuestions, args.timerTotalSeconds, args.assessmentType]);

  // Heartbeat progress while live
  useEffect(() => {
    if (!session?.id || !ACTIVE(session.status)) return;

    const tick = async () => {
      try {
        const a = argsRef.current;
        const updated = await heartbeatLiveSession(session.id, {
          questionsAttempted: a.questionsAttempted,
          currentQuestionIndex: a.currentQuestionIndex,
          answersCount: a.answersCount,
          section: a.section,
          totalQuestions: a.totalQuestions,
          timerRemainingSeconds:
            session.status === 'active' || session.status === 'pause_requested'
              ? remainingRef.current
              : undefined,
        });
        if (updated) setSession(updated);
      } catch (err) {
        console.error('live heartbeat failed', err);
      }
    };

    tick();
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, [session?.id, session?.status]);

  // Poll + realtime for admin actions
  useEffect(() => {
    if (!session?.id) return;
    const id = session.id;

    const applyStatusChange = (row: LiveEvaluationSession) => {
      const prev = prevStatusRef.current;
      setSession(row);
      if (prev !== row.status) {
        if (row.status === 'paused' && prev !== 'paused') {
          const frozen = Math.max(0, row.timer_remaining_seconds || remainingRef.current);
          remainingRef.current = frozen;
          // Persist locally so a racey remount cannot fall back to full duration
          try {
            const id = argsRef.current.testId || argsRef.current.assessmentType || 'default';
            // Best-effort: parent Timer also writes pausedRemainKey
            localStorage.setItem(`live-eval-frozen-remaining`, String(frozen));
          } catch {
            /* ignore */
          }
          argsRef.current.onAdminPause?.(frozen);
          toast('Admin paused your assessment — timer is frozen.', { icon: '⏸️' });
        }
        if (row.status === 'active' && (prev === 'paused' || prev === 'pause_requested')) {
          const remaining = Math.max(0, row.timer_remaining_seconds || remainingRef.current);
          remainingRef.current = remaining;
          if (prev === 'paused') {
            argsRef.current.onAdminResume?.(remaining);
            toast.success('Assessment resumed — timer is running again.');
          }
        }
        prevStatusRef.current = row.status;
      }
    };

    const poll = async () => {
      try {
        const row = await fetchLiveSession(id);
        if (row) applyStatusChange(row);
      } catch {
        /* ignore */
      }
    };

    const pollId = setInterval(poll, 2500);

    const channel = supabase
      .channel(`live-eval-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_evaluation_sessions',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (payload.new) applyStatusChange(payload.new as LiveEvaluationSession);
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollId);
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  // Update section label on server when section changes
  useEffect(() => {
    if (!session?.id || !args.section) return;
    if (session.section === args.section) return;
    heartbeatLiveSession(session.id, { section: args.section }).then((row) => {
      if (row) setSession(row);
    }).catch(() => {});
  }, [args.section, session?.id, session?.section]);

  const requestPause = useCallback(
    async (reason?: string) => {
      if (!session?.id) {
        toast.error('Live session not ready yet.');
        return;
      }
      try {
        const row = await requestPauseLiveSession(
          session.id,
          remainingRef.current,
          reason || 'Internet / technical issue — please pause my timer'
        );
        if (row) {
          setSession(row);
          prevStatusRef.current = row.status;
          toast.success('Pause requested — waiting for admin approval.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Could not request pause. Is the live_evaluation_sessions table set up?');
      }
    },
    [session?.id]
  );

  const cancelPauseRequest = useCallback(async () => {
    if (!session?.id) return;
    try {
      const row = await cancelPauseRequestLiveSession(session.id, remainingRef.current);
      if (row) {
        setSession(row);
        prevStatusRef.current = row.status;
        toast('Pause request cancelled — timer continues.', { icon: '▶️' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not cancel pause request.');
    }
  }, [session?.id]);

  const endSession = useCallback(async () => {
    const id = sessionIdRef.current || session?.id || localStorage.getItem(LIVE_SESSION_STORAGE_KEY);
    if (!id) return;
    try {
      await completeLiveSession(id, remainingRef.current);
    } catch (err) {
      console.error(err);
    } finally {
      sessionIdRef.current = null;
      setSession(null);
    }
  }, [session?.id]);

  return {
    session,
    status,
    isPaused,
    isPauseRequested,
    timerFrozen,
    starting,
    setRemaining,
    requestPause,
    cancelPauseRequest,
    endSession,
    refreshSession,
  };
}

function ACTIVE(status: LiveEvalStatus) {
  return status === 'active' || status === 'pause_requested' || status === 'paused';
}
