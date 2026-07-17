'use client';

// app/my-tests/page.tsx
// Logged-in students see their saved tests: review-style test sheet on screen,
// plus downloads for the test sheet PDF and the performance report.
// Supports ?download=sheet / ?download=report to auto-trigger from the navbar.

import { useEffect, useState, useRef,  Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, withTimeout } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import {
  generateTestSheetPDF, splitSections, isCorrect,
  type TestSubmission,
} from '@/app/utils/TestSheet';
// Performance report — the SAME generator the review page uses.
// Align the import + call below with your review page's download handler.
import { generateReport } from '@/app/utils/generateReport';

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const fmtSec = (s?: number | null) =>
  s != null ? `${Math.floor(s / 60)}m ${s % 60}s` : '—';

function MyTestsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subs, setSubs]       = useState<TestSubmission[]>([]);
  const [selected, setSelected] = useState<TestSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const autoDownloaded = useRef(false);

  // ── Load this student's submissions ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const result = await withTimeout(supabase.auth.getSession());
        const user = result?.data?.session?.user;
        if (!user) { router.push('/login'); return; }

        const { data, error } = await supabase
          .from('test_submissions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setSubs(data);
          setSelected(data[0] ?? null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  // ── Auto-download when arriving from the navbar (?download=...) ────────────
  useEffect(() => {
    if (loading || !selected || autoDownloaded.current) return;
    const dl = searchParams.get('download');
    if (dl === 'sheet')  { autoDownloaded.current = true; handleDownloadSheet(selected); }
    if (dl === 'report') { autoDownloaded.current = true; handleDownloadReport(selected); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, selected, searchParams]);

  const handleDownloadSheet = (sub: TestSubmission) => {
    try { generateTestSheetPDF(sub); }
    catch (e) { console.error(e); toast.error('Could not generate the test sheet.'); }
  };

const handleDownloadReport = (sub: TestSubmission) => {
    try {
      const grade  = (sub.grade ?? '').toLowerCase();
      const isSat  = sub.test_type === 'sat' || sub.test_type === 'ssat';
      const isG910 = grade.includes('9th') || grade.includes('10th');

      const correctCount = (sub.questions ?? []).filter(q => isCorrect(q, sub.answers)).length;

      generateReport({
        userName:            sub.full_name ?? 'Student',
        userEmail:           sub.email ?? 'N/A',
        gradeParam:          sub.grade,
        testId:              sub.test_type ?? 'quiz-assessment',
        score:               String(sub.overall_score ?? 0),          // string, per the interface
        correctAnswersCount: correctCount,
        totalQuestions:      sub.questions?.length ?? 0,
        mathScore:           sub.math_score,
        elaScore:            isSat ? sub.ela_score : sub.ela_score,   // SAT stores reading in the ela slot
        scienceScore:        isSat ? null : sub.science_score,
        elaSkipped:          false,
        isGrade9Or10:        isG910,
        isSat,
        mathDuration:        sub.durations?.mathDuration    ?? undefined,
        elaDuration:         sub.durations?.elaDuration     ?? undefined,
        scienceDuration:     sub.durations?.scienceDuration ?? undefined,
        totalDuration:       sub.durations?.totalDuration   ?? undefined,
        times: {
          total:   fmtSec(sub.durations?.totalDuration),
          math:    fmtSec(sub.durations?.mathDuration),
          ela:     fmtSec(sub.durations?.elaDuration),
          science: fmtSec(sub.durations?.scienceDuration),
        },
      });
    } catch (e) {
      console.error(e);
      toast.error('Could not generate the performance report.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading your tests...</p>
      </div>
    </div>
  );

  if (subs.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">No saved tests yet</h1>
        <p className="text-sm text-gray-500 mb-6">
          Tests you take from now on will appear here, with your full test sheet and performance report.
        </p>
        <button onClick={() => router.push('/')}
          className="bg-[#7FB509] hover:bg-[#8fc61a] text-white font-bold px-6 py-2.5 rounded-full text-sm cursor-pointer transition-colors">
          Take an Assessment
        </button>
      </div>
    </div>
  );

  const sections = selected ? splitSections(selected) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto  px-4 sm:px-6 py-10">

        {/* Header + test picker */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tests</h1>
            <p className="text-sm text-gray-500 mt-1">Review your answers and download your documents.</p>
          </div>
          {subs.length > 1 && (
            <select
              value={selected?.id}
              onChange={e => setSelected(subs.find(s => s.id === e.target.value) ?? null)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white cursor-pointer focus:outline-none">
              {subs.map(s => (
                <option key={s.id} value={s.id}>
                  {(s.test_type ?? 'Test').toUpperCase()} · {fmtDate(s.created_at)}
                </option>
              ))}
            </select>
          )}
        </div>

        {selected && (
          <>
            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#1a2e05] text-white flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold">
                      {selected.overall_score != null ? `${Math.round(selected.overall_score)}%` : '—'}
                    </span>
                    <span className="text-[9px] uppercase opacity-70">Overall</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{(selected.test_type ?? 'Test').toUpperCase()}</p>
                    <p className="text-xs text-gray-400">
                      {(selected.grade ?? '').toUpperCase()} · {fmtDate(selected.created_at)} · Total time {fmtSec(selected.durations?.totalDuration)}
                    </p>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {sections.map(sec => {
                        const c = sec.qs.filter(q => isCorrect(q, selected.answers)).length;
                        return (
                          <span key={sec.name} className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {sec.name}: {c}/{sec.qs.length}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => handleDownloadSheet(selected)}
                    className="text-xs font-bold bg-[#1a2e05] hover:bg-[#2a4a09] text-white px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                    📄 Download Test Sheet
                  </button>
                  <button onClick={() => handleDownloadReport(selected)}
                    className="text-xs font-bold bg-[#7FB509] hover:bg-[#8fc61a] text-white px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                    📊 Performance Report
                  </button>
                </div>
              </div>
            </div>

            {/* Review-style sections */}
            {sections.map(section => (
              <div key={section.name} className="mb-6">
                <h2 className="text-sm font-bold text-[#1a2e05] uppercase tracking-wide mb-2 px-1">
                  {section.name}
                </h2>
                <div className="space-y-2.5">
                  {section.qs.map((q, i) => {
                    const student = selected.answers?.[q.question];
                    const correct = q.correctAnswer || q.answer || '';
                    const right   = student === correct;
                    return (
                      <div key={i}
                        className={`bg-white rounded-xl border p-4 ${right ? 'border-green-200' : 'border-red-200'}`}>
                        <div className="flex items-start gap-2.5">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5
                            ${right ? 'bg-green-500' : 'bg-red-500'}`}>
                            {right ? '✓' : '✗'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-2"
                               dangerouslySetInnerHTML={{ __html: `${i + 1}. ${q.question}` }} />
                            <p className={`text-xs ${right ? 'text-green-700' : 'text-red-600'}`}>
                              <span className="font-semibold">Your answer:</span>{' '}
                              {student ?? <em className="text-gray-400">no answer</em>}
                            </p>
                            {!right && (
                              <p className="text-xs text-green-700 mt-0.5">
                                <span className="font-semibold">Correct answer:</span> {correct}
                              </p>
                            )}
                            {q.solution && !right && (
                              <div className="text-[11px] text-gray-500 mt-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 flex gap-1.5">
                                <span>💡</span>
                                <div className="[&_p]:inline [&_strong]:text-gray-700"
                                     dangerouslySetInnerHTML={{ __html: q.solution }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}


export default function MyTestsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MyTestsContent />
    </Suspense>
  );
}