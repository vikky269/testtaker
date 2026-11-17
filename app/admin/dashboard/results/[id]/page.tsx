'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileSearch, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import SkillResultsSummary from '@/app/components/SkillResultsSummary';
import MathHtml from '@/app/components/MathHtml';
import { buildSkillBreakdown } from '@/app/utils/skillBreakdown';
import { annotateShsatQuestionsForSkills } from '@/app/utils/shsatSkillAreas';
import { getLearningCategory } from '@/app/utils/reviewUtils';
import { PageHeader, cardClass } from '../../ui';

type LeaderboardRow = {
  id: string;
  full_name: string;
  email: string;
  grade: string;
  gender?: string | null;
  math_score: number | null;
  ela_score: number | null;
  science_score: number | null;
  overall_score: number;
  total_time?: number | null;
  test_type?: string | null;
  created_at?: string | null;
};

type SubmissionQuestion = {
  question: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string;
  subject?: string;
  topic?: string;
  domain?: string;
  subtopic?: string;
};

type TestSubmission = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  grade: string | null;
  test_type: string | null;
  questions: SubmissionQuestion[] | null;
  answers: Record<string, string> | null;
  math_score: number | null;
  ela_score: number | null;
  science_score: number | null;
  overall_score: number | null;
};

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

const fmtTime = (s?: number | null) =>
  s != null && s > 0 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : '—';

function pickBestSubmission(
  rows: TestSubmission[],
  leaderboard: LeaderboardRow
): TestSubmission | null {
  if (!rows.length) return null;
  const target = Number(leaderboard.overall_score);
  const scored = [...rows].sort((a, b) => {
    const da = Math.abs(Number(a.overall_score ?? 0) - target);
    const db = Math.abs(Number(b.overall_score ?? 0) - target);
    if (da !== db) return da - db;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return scored[0] ?? null;
}

function normalizeQuestions(
  questions: SubmissionQuestion[],
  testType?: string | null
): SubmissionQuestion[] {
  if (!questions.length) return [];
  const t = (testType || '').toLowerCase();
  if (t === 'shsat') {
    const mid = Math.ceil(questions.length / 2);
    const elaQs = questions.slice(0, mid);
    return annotateShsatQuestionsForSkills(questions, elaQs) as SubmissionQuestion[];
  }
  return questions.map((q) => {
    if (q.subject === 'math' || q.subject === 'ela' || q.subject === 'science') return q;
    // Heuristic for banks that omit subject
    const domain = (q.domain || q.topic || '').toLowerCase();
    let subject: 'math' | 'ela' | 'science' = 'math';
    if (
      domain.includes('read') ||
      domain.includes('ela') ||
      domain.includes('vocab') ||
      domain.includes('grammar') ||
      domain.includes('writing') ||
      domain.includes('language')
    ) {
      subject = 'ela';
    } else if (
      domain.includes('science') ||
      domain.includes('biology') ||
      domain.includes('earth') ||
      domain.includes('physics') ||
      domain.includes('chem')
    ) {
      subject = 'science';
    }
    return { ...q, subject };
  });
}

export default function AdminResultDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || '');
  const reviewRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow | null>(null);
  const [submission, setSubmission] = useState<TestSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data: lb, error: lbErr } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (cancelled) return;

      if (lbErr || !lb) {
        setError(lbErr?.message || 'Result not found.');
        setLoading(false);
        return;
      }

      setLeaderboard(lb as LeaderboardRow);

      // Match the saved test sheet (questions + answers) for this student/result
      let query = supabase
        .from('test_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (lb.email) query = query.eq('email', lb.email);
      else if (lb.full_name) query = query.eq('full_name', lb.full_name);

      const { data: subs, error: subErr } = await query;

      if (cancelled) return;

      if (subErr) {
        console.error(subErr);
        setError(
          'Could not load the test sheet. The score is available, but question-level data may be missing.'
        );
      }

      const candidates = ((subs as TestSubmission[]) || []).filter((s) => {
        if (!s.questions?.length) return false;
        if (lb.grade && s.grade && s.grade.toLowerCase() !== String(lb.grade).toLowerCase()) {
          // Allow soft mismatches like "4th-grade" vs "4th grade"
          const a = String(lb.grade).toLowerCase().replace(/\s+/g, '');
          const b = String(s.grade).toLowerCase().replace(/\s+/g, '');
          if (a !== b) return false;
        }
        return true;
      });

      setSubmission(pickBestSubmission(candidates, lb as LeaderboardRow));
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const questions = useMemo(() => {
    if (!submission?.questions?.length) return [];
    return normalizeQuestions(submission.questions, submission.test_type || leaderboard?.test_type);
  }, [submission, leaderboard?.test_type]);

  const answers = submission?.answers || {};

  const breakdown = useMemo(() => {
    if (!questions.length) return null;
    return buildSkillBreakdown(questions, answers);
  }, [questions, answers]);

  const cat = leaderboard ? getLearningCategory(leaderboard.overall_score) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className={`${cardClass} p-8 text-center`}>
        <p className="text-sm font-semibold text-gray-700">Result not found</p>
        <Link
          href="/admin/dashboard/results"
          className="inline-flex mt-4 text-sm font-semibold text-[#5f8a08] hover:underline"
        >
          ← Back to Results & Recommendations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Result Details"
        subtitle="Same topic-by-topic performance breakdown the student sees after submitting."
        action={
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/results')}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e4ebe0] bg-white px-3 py-2 text-xs font-semibold text-[#1a2e05] hover:bg-[#f7faf5] cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to results
          </button>
        }
      />

      <div className={`${cardClass} p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f5c0] flex items-center justify-center text-sm font-bold text-[#3a5a09] flex-shrink-0">
              {leaderboard.full_name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-[#1a2e05] truncate">{leaderboard.full_name}</p>
              <p className="text-xs text-gray-400 truncate">{leaderboard.email || 'No email'}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-lg bg-[#f0f4ec] px-2 py-0.5 font-medium text-gray-600">
                  {leaderboard.grade}
                </span>
                {leaderboard.test_type && (
                  <span className="rounded-lg bg-[#f0f4ec] px-2 py-0.5 font-medium text-gray-600 capitalize">
                    {leaderboard.test_type}
                  </span>
                )}
                {cat && (
                  <span className={`rounded-full px-2 py-0.5 font-bold ${cat.bgColor} ${cat.color}`}>
                    {cat.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
            {[
              { label: 'Overall', value: `${Math.round(leaderboard.overall_score)}%` },
              { label: 'Math', value: leaderboard.math_score != null ? `${Math.round(leaderboard.math_score)}%` : '—' },
              { label: 'ELA', value: leaderboard.ela_score != null ? `${Math.round(leaderboard.ela_score)}%` : '—' },
              { label: 'Science', value: leaderboard.science_score != null ? `${Math.round(leaderboard.science_score)}%` : '—' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-[#f7faf5] px-3 py-2.5 min-w-[88px]">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.label}</p>
                <p className="text-lg font-extrabold text-[#1a2e05] mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[11px] text-gray-400">
          Taken {fmtDate(submission?.created_at || leaderboard.created_at)}
          {leaderboard.total_time != null ? ` · Time ${fmtTime(leaderboard.total_time)}` : ''}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {breakdown ? (
        <div className={`${cardClass} p-5 sm:p-6`}>
          <SkillResultsSummary
            variant="admin"
            title={`${leaderboard.grade} assessment`}
            breakdown={breakdown}
            studentName={leaderboard.full_name}
            testDate={fmtDate(submission?.created_at || leaderboard.created_at)}
            onReview={() => reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            onGoHome={() => router.push('/admin/dashboard/results')}
            showHome
            showReview
            showDownload
          />
        </div>
      ) : (
        <div className={`${cardClass} px-6 py-14 text-center`}>
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#eef5e3] flex items-center justify-center mb-4">
            <FileSearch className="w-7 h-7 text-[#7FB509]" />
          </div>
          <p className="text-base font-bold text-[#1a2e05]">No question-level sheet found</p>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Scores are on the leaderboard, but this attempt did not save a full test sheet
            (questions + answers), so a topic breakdown cannot be rebuilt. Newer assessments save
            this automatically.
          </p>
        </div>
      )}

      {questions.length > 0 && (
        <div ref={reviewRef} className={`${cardClass} overflow-hidden`}>
          <div className="px-5 py-4 border-b border-[#eef2ea]">
            <h3 className="text-sm font-bold text-[#1a2e05]">Question review</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Student answers vs correct answers ({questions.length} questions)
            </p>
          </div>
          <div className="divide-y divide-[#eef2ea]">
            {questions.map((q, idx) => {
              const correct = q.correctAnswer || q.answer || '';
              const given = answers[q.question];
              const answered = given != null && given !== '';
              const ok = answered && given === correct;
              return (
                <div key={`${idx}-${q.question.slice(0, 24)}`} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${
                        !answered ? 'bg-gray-300' : ok ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {(q.subject || q.domain || q.topic) && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            {[q.subject, q.domain || q.topic].filter(Boolean).join(' · ')}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            !answered
                              ? 'bg-gray-100 text-gray-500'
                              : ok
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {!answered ? 'Blank' : ok ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <MathHtml
                        as="div"
                        text={q.question}
                        className="text-sm font-semibold text-[#1a2e05] leading-snug"
                      />
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                        <div className="rounded-xl bg-[#f7faf5] px-3 py-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                            Student answer
                          </p>
                          <p className={`font-semibold ${ok ? 'text-emerald-700' : answered ? 'text-rose-700' : 'text-gray-400'}`}>
                            {answered ? given : '—'}
                          </p>
                        </div>
                        <div className="rounded-xl bg-[#f7faf5] px-3 py-2">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                            Correct answer
                          </p>
                          <p className="font-semibold text-[#1a2e05]">{correct || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
