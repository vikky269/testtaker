'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Clock,
  Pause,
  Play,
  Radio,
  RefreshCw,
  UserRound,
  AlertCircle,
  CheckCircle2,
  Timer,
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import {
  LiveEvaluationSession,
  computeRemainingSeconds,
  fetchActiveLiveSessions,
  formatClock,
  grantPauseLiveSession,
  resumeLiveSession,
} from '@/lib/liveEvaluation';
import { KpiCard, PageHeader, cardClass, cardHoverClass } from '../ui';

type Filter = 'all' | 'active' | 'pause_requested' | 'paused';

const STATUS_META: Record<
  string,
  { label: string; chip: string; dot: string }
> = {
  active: {
    label: 'In progress',
    chip: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    dot: 'bg-emerald-500',
  },
  pause_requested: {
    label: 'Pause requested',
    chip: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
    dot: 'bg-amber-500 animate-pulse',
  },
  paused: {
    label: 'Paused',
    chip: 'bg-sky-50 text-sky-800 ring-1 ring-sky-100',
    dot: 'bg-sky-500',
  },
};

function progressPct(s: LiveEvaluationSession) {
  if (!s.total_questions) return 0;
  return Math.min(100, Math.round((s.questions_attempted / s.total_questions) * 100));
}

function SessionCard({
  session,
  remaining,
  busy,
  onGrantPause,
  onResume,
}: {
  session: LiveEvaluationSession;
  remaining: number;
  busy: boolean;
  onGrantPause: () => void;
  onResume: () => void;
}) {
  const meta = STATUS_META[session.status] || STATUS_META.active;
  const pct = progressPct(session);
  const needsAttention = session.status === 'pause_requested';

  return (
    <article
      className={`${cardClass} ${cardHoverClass} relative overflow-hidden p-5 ${
        needsAttention ? 'ring-2 ring-amber-300/70' : ''
      }`}
    >
      {needsAttention && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#e8f5c0] flex items-center justify-center text-sm font-bold text-[#3a5a09] flex-shrink-0">
            {(session.student_name || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#1a2e05] truncate">{session.student_name || 'Student'}</p>
            <p className="text-xs text-gray-400 truncate">{session.student_email || 'No email'}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${meta.chip}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-[#1a2e05] truncate">
          {session.assessment_label || session.assessment_type}
        </p>
        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-500">
          {session.grade && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#f0f4ec] px-2 py-0.5 font-medium">
              <BookOpen className="w-3 h-3" /> {session.grade}
            </span>
          )}
          {session.section && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#f0f4ec] px-2 py-0.5 font-medium capitalize">
              Section: {session.section}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-xl bg-[#f7faf5] px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Time left</p>
          <p className="text-lg font-extrabold text-[#1a2e05] tabular-nums mt-0.5">
            {formatClock(remaining)}
          </p>
        </div>
        <div className="rounded-xl bg-[#f7faf5] px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Answered</p>
          <p className="text-lg font-extrabold text-[#1a2e05] mt-0.5">
            {session.questions_attempted}
            <span className="text-xs font-semibold text-gray-400">/{session.total_questions}</span>
          </p>
        </div>
        <div className="rounded-xl bg-[#f7faf5] px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Question</p>
          <p className="text-lg font-extrabold text-[#1a2e05] mt-0.5">
            {Math.min(session.current_question_index + 1, session.total_questions || 1)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
          <span className="font-medium">Progress</span>
          <span className="font-semibold">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#eef2ea] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7FB509] to-[#9fd12a] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {session.pause_reason && session.status === 'pause_requested' && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <span className="font-bold">Reason: </span>
          {session.pause_reason}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <p className="text-[10px] text-gray-400">
          Last seen{' '}
          {session.last_seen_at
            ? new Date(session.last_seen_at).toLocaleTimeString()
            : '—'}
        </p>
        <div className="flex gap-2">
          {(session.status === 'pause_requested' || session.status === 'active') && (
            <button
              type="button"
              disabled={busy}
              onClick={onGrantPause}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 cursor-pointer disabled:opacity-50"
            >
              <Pause className="w-3.5 h-3.5" />
              {session.status === 'pause_requested' ? 'Grant pause' : 'Pause now'}
            </button>
          )}
          {session.status === 'paused' && (
            <button
              type="button"
              disabled={busy}
              onClick={onResume}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#7FB509] hover:bg-[#6a9a07] text-white text-xs font-bold px-3 py-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Resume
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function LiveEvaluationsPage() {
  const [sessions, setSessions] = useState<LiveEvaluationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError(null);
    try {
      const rows = await fetchActiveLiveSessions();
      setSessions(rows);
      setLastRefresh(new Date());
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Could not load live sessions.';
      setLoadError(
        msg.includes('relation') || msg.includes('does not exist')
          ? 'Table missing — run supabase/live_evaluation_sessions.sql in the Supabase SQL Editor.'
          : msg
      );
      if (!silent) setSessions([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(() => load(true), 3000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-live-evals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_evaluation_sessions' },
        () => {
          load(true);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') return sessions;
    return sessions.filter((s) => s.status === filter);
  }, [sessions, filter]);

  const stats = useMemo(() => {
    return {
      total: sessions.length,
      active: sessions.filter((s) => s.status === 'active').length,
      requested: sessions.filter((s) => s.status === 'pause_requested').length,
      paused: sessions.filter((s) => s.status === 'paused').length,
    };
  }, [sessions]);

  const handleGrant = async (session: LiveEvaluationSession) => {
    setBusyId(session.id);
    try {
      const remaining = computeRemainingSeconds(session);
      await grantPauseLiveSession(session.id, remaining);
      toast.success(`Paused ${session.student_name}'s assessment`);
      await load(true);
    } catch (err) {
      console.error(err);
      toast.error('Could not pause session');
    } finally {
      setBusyId(null);
    }
  };

  const handleResume = async (session: LiveEvaluationSession) => {
    setBusyId(session.id);
    try {
      await resumeLiveSession(session.id);
      toast.success(`Resumed ${session.student_name}'s assessment`);
      await load(true);
    } catch (err) {
      console.error(err);
      toast.error('Could not resume session');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Evaluations"
        subtitle="Monitor active assessments, grant pause requests, and resume timers in real time."
        action={
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e4ebe0] bg-white px-3 py-2 text-xs font-semibold text-[#1a2e05] hover:bg-[#f7faf5] cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        }
      />

      <div className="relative overflow-hidden rounded-3xl border border-[#d8e8b8] bg-gradient-to-br from-[#f4fbe6] via-white to-[#eef8d4] p-5 sm:p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#7FB509]/10 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#7FB509] text-white flex items-center justify-center shadow-lg shadow-[#7FB509]/25">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1a2e05] flex items-center gap-2">
                Live monitor
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-xl">
                Sessions update every few seconds. When a student requests a pause, grant it to freeze
                their timer until you resume.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-gray-400">
            {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : '—'}
          </p>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm px-4 py-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Could not load live evaluations</p>
            <p className="text-xs mt-0.5">{loadError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Live now"
          value={stats.total}
          color="#3a5a09"
          iconBg="bg-[#e8f5c0]"
          icon={<Activity className="w-4 h-4 text-[#3a5a09]" />}
        />
        <KpiCard
          label="In progress"
          value={stats.active}
          color="#059669"
          iconBg="bg-emerald-50"
          icon={<Timer className="w-4 h-4 text-emerald-600" />}
        />
        <KpiCard
          label="Pause requests"
          value={stats.requested}
          color="#d97706"
          iconBg="bg-amber-50"
          icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
        />
        <KpiCard
          label="Paused"
          value={stats.paused}
          color="#0284c7"
          iconBg="bg-sky-50"
          icon={<Pause className="w-4 h-4 text-sky-600" />}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', 'All'],
            ['pause_requested', 'Needs approval'],
            ['paused', 'Paused'],
            ['active', 'In progress'],
          ] as [Filter, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border cursor-pointer transition-colors ${
              filter === key
                ? 'bg-[#1a2e05] text-white border-[#1a2e05]'
                : 'bg-white text-gray-600 border-[#e4ebe0] hover:bg-[#f7faf5]'
            }`}
          >
            {label}
            {key === 'pause_requested' && stats.requested > 0 && (
              <span className="ml-1.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-amber-500 text-white text-[10px]">
                {stats.requested}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={`${cardClass} px-6 py-16 text-center`}>
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#eef5e3] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-[#7FB509]" />
          </div>
          <p className="text-base font-bold text-[#1a2e05]">No live evaluations right now</p>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            When a student starts an assessment, their session will appear here with progress and
            timer controls.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((session) => {
            // Force recompute with `now` tick
            void now;
            const remaining = computeRemainingSeconds(session);
            return (
              <SessionCard
                key={session.id}
                session={session}
                remaining={remaining}
                busy={busyId === session.id}
                onGrantPause={() => handleGrant(session)}
                onResume={() => handleResume(session)}
              />
            );
          })}
        </div>
      )}

      <div className={`${cardClass} p-4 flex items-start gap-3 text-xs text-gray-500`}>
        <UserRound className="w-4 h-4 text-[#7FB509] flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-[#1a2e05]">How it works: </span>
          Student taps <em>Request pause</em> → session shows under Needs approval → you{' '}
          <em>Grant pause</em> to freeze their timer → when they are ready, tap <em>Resume</em> and
          the countdown continues from the remaining time.
        </p>
        <Clock className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 hidden sm:block" />
      </div>
    </div>
  );
}
