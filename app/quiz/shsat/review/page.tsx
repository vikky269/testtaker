'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, withTimeout } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { SHSAT_SECTIONS, ELA_TOTAL, MATH_TOTAL, type SHSATSectionKey } from '@/app/data/shsatConfig';
import { generateShsatReport } from '@/app/utils/generateShsatReport';
import SectionBlock from '@/app/components/SectionBlock/SectionBlock';

interface ShsatSubmission {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  questions: {
    question: string;
    options: string[];
    correctAnswer?: string;
    answer?: string;
    domain?: string;
    subtopic?: string;
  }[];
  answers: Record<string, string>;
  math_score: number | null;
  ela_score: number | null;
  overall_score: number | null;
  durations: {
    totalDuration?: number;
    mathDuration?: number;
    elaDuration?: number;
  } | null;
}

const fmtSec = (s?: number) => {
  if (!s || s <= 0) return '—';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function ShsatReviewPage() {
  const router = useRouter();
  const [sub, setSub] = useState<ShsatSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('test_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('test_type', 'shsat')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.error('Could not load SHSAT review data:', error);
      setSub(data ?? null);
      setLoading(false);
    };
    load();
  }, []);

  const handleDownload = async () => {
    if (!sub || downloading) return;
    setDownloading(true);
    try {
      await generateShsatReport({
        studentName: sub.full_name ?? 'Student',
        studentEmail: sub.email ?? undefined,
        testDate: fmtDate(sub.created_at),
        questions: sub.questions ?? [],
        answers: sub.answers ?? {},
        durations: sub.durations ?? undefined,
        elaScore: sub.ela_score,
        mathScore: sub.math_score,
        overallScore: sub.overall_score,
      });
    } catch (e) {
      console.error(e);
      toast.error('Could not generate the SHSAT report.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-400">Loading your SHSAT review...</p>;
  }

  if (!sub) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 mb-4">No SHSAT review data found.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-[#7FB509] hover:bg-[#6a9a07] text-white font-bold text-sm rounded-full cursor-pointer transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const sectionResults = SHSAT_SECTIONS.map((sec) => {
    const qs = (sub.questions ?? []).slice(sec.start, sec.end);
    const correct = qs.filter(
      (q) => sub.answers?.[q.question] === (q.correctAnswer || q.answer)
    ).length;
    return {
      key: sec.key as SHSATSectionKey,
      label: sec.label,
      qs,
      correct,
      total: qs.length,
    };
  });

  const totalCorrect = sectionResults.reduce((s, r) => s + r.correct, 0);
  const elaScore = sub.ela_score != null ? Math.round(sub.ela_score) : 0;
  const mathScore = sub.math_score != null ? Math.round(sub.math_score) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 mt-12">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-6 text-center">
        <span className="inline-block bg-indigo-600 text-white text-lg font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
          Test Review
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900">SHSAT Practice Review</h1>
        <p className="text-sm font-semibold mt-1 text-gray-500">
          {Math.round(sub.overall_score ?? 0)}% overall · {totalCorrect} /{' '}
          {ELA_TOTAL + MATH_TOTAL} correct
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-1">
              English Language Arts
            </p>
            <p className="text-4xl font-extrabold text-emerald-600 leading-none">{elaScore}%</p>
            <p className="text-xs text-gray-400 mt-1">
              {sectionResults[0]?.correct ?? 0} / {ELA_TOTAL} correct ·{' '}
              {fmtSec(sub.durations?.elaDuration)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-1">
              Mathematics
            </p>
            <p className="text-4xl font-extrabold text-indigo-600 leading-none">{mathScore}%</p>
            <p className="text-xs text-gray-400 mt-1">
              {sectionResults[1]?.correct ?? 0} / {MATH_TOTAL} correct ·{' '}
              {fmtSec(sub.durations?.mathDuration)}
            </p>
          </div>
        </div>

        {sectionResults.map((r) => (
          <SectionBlock
            key={r.key}
            label={r.label}
            emoji={r.key === 'ela' ? '📖' : '🔢'}
            color={r.key === 'ela' ? 'emerald' : 'indigo'}
            questions={r.qs}
            allQuestions={sub.questions ?? []}
            answers={sub.answers ?? {}}
          />
        ))}

        <div className="flex justify-center gap-4 flex-wrap mt-4">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            {downloading ? 'Preparing PDF…' : 'Download Result'}
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('activeStudent');
              router.push('/');
            }}
            className="px-6 py-3 bg-[#7FB509] hover:bg-[#6a9a07] text-white font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
