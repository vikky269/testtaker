'use client';

// app/admin/dashboard/ged-results/page.tsx
// Admin review of all GED diagnostic submissions — full Q&A review + the
// same beautiful report the student can download, generated on demand from
// the stored questions/answers (never a saved static file).

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { GED_SECTIONS, GED_SECTION_LABELS } from '@/app/data/geddata';
import { generateGedReport } from '@/app/utils/generateGedReport';

interface GedSubmission {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  grade: string | null;
  questions: { question: string; options: string[]; correctAnswer?: string; answer?: string }[];
  answers: Record<string, string>;
  math_score: number | null;
  ela_score: number | null;       // RLA
  science_score: number | null;
  social_studies_score: number | null;
  overall_score: number | null;
  durations: any;
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const isCorrect = (q: { question: string; correctAnswer?: string; answer?: string }, answers: Record<string, string>) =>
  answers?.[q.question] === (q.correctAnswer || q.answer);

export default function GedResultsPage() {
  const [subs, setSubs] = useState<GedSubmission[]>([]);
  const [filtered, setFiltered] = useState<GedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewTarget, setViewTarget] = useState<GedSubmission | null>(null);
  const [menu, setMenu] = useState<{ sub: GedSubmission; x: number; y: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GedSubmission | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('test_submissions')
        .select('*')
        .eq('test_type', 'ged')
        .order('created_at', { ascending: false });
      if (!error && data) { setSubs(data); setFiltered(data); }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let out = [...subs];
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(s =>
        (s.full_name ?? '').toLowerCase().includes(q) ||
        (s.email ?? '').toLowerCase().includes(q)
      );
    }
    setFiltered(out);
  }, [subs, search]);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [menu]);

  const openMenu = (e: React.MouseEvent, sub: GedSubmission) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const MENU_H = 100;
    const openUp = rect.bottom + MENU_H > window.innerHeight - 8;
    setMenu(prev => prev?.sub.id === sub.id ? null : {
      sub, x: Math.max(8, rect.right - 180), y: openUp ? rect.top - MENU_H - 6 : rect.bottom + 6,
    });
  };

  const handleDownload = (sub: GedSubmission) => {
    try {
      generateGedReport({
        studentName: sub.full_name ?? 'Student',
        studentEmail: sub.email ?? undefined,
        testDate: fmtDate(sub.created_at),
        questions: sub.questions ?? [],
        answers: sub.answers ?? {},
        durations: sub.durations,
      });
    } catch (e) {
      console.error(e);
      toast.error('Could not generate the GED report.');
    }
  };


  const handleDelete = async () => {
  if (!deleteTarget) return;
  setDeleting(true);
  const { error } = await supabase.from('test_submissions').delete().eq('id', deleteTarget.id);
  setDeleting(false);
  if (error) {
    console.error(error);
    toast.error('Failed to delete. Check permissions and try again.');
    return;
  }
  toast.success(`${deleteTarget.full_name}'s GED result deleted.`);
  setSubs(prev => prev.filter(s => s.id !== deleteTarget.id));
  setDeleteTarget(null);
};

  if (loading) return <div className="p-8 text-gray-500">Loading GED submissions...</div>;

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">GED Assessments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Every SmartMathz GED Readiness Diagnostic submission. View full answers or download the report.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[{ label: 'Total', val: subs.length }].map(({ label, val }) => (
          <div key={label} className="bg-white rounded-2xl p-4 text-center border border-gray-100">
            <p className="text-2xl font-extrabold text-gray-800">{val}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-5 max-w-md">
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#', 'STUDENT', 'OVERALL', 'MATH', 'RLA', 'SCIENCE', 'SOCIAL', 'DATE', 'ACTIONS'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No GED submissions yet.</td></tr>
              ) : filtered.map((s, idx) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-gray-900 text-sm">{s.full_name}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                  </td>
                  <td className="px-3 py-3 font-bold text-gray-900">{s.overall_score != null ? `${Math.round(s.overall_score)}%` : '—'}</td>
                  <td className="px-3 py-3 text-gray-700">{s.math_score != null ? `${Math.round(s.math_score)}%` : '—'}</td>
                  <td className="px-3 py-3 text-gray-700">{s.ela_score != null ? `${Math.round(s.ela_score)}%` : '—'}</td>
                  <td className="px-3 py-3 text-gray-700">{s.science_score != null ? `${Math.round(s.science_score)}%` : '—'}</td>
                  <td className="px-3 py-3 text-gray-700">{s.social_studies_score != null ? `${Math.round(s.social_studies_score)}%` : '—'}</td>
                  <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(s.created_at)}</td>
                  <td className="px-3 py-3">
                    <button onClick={e => openMenu(e, s)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Floating action menu ── */}
      {menu && (
        <div className="fixed z-[70] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-[180px]"
          style={{ left: menu.x, top: menu.y }} onClick={e => e.stopPropagation()}>
          <button onClick={() => { setViewTarget(menu.sub); setMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
            👁️ View Answers
          </button>
                  <button onClick={() => { handleDownload(menu.sub); setMenu(null); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      📄 Download Report
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { setDeleteTarget(menu.sub); setMenu(null); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer">
                      🗑️ Delete
                  </button>
        </div>
      )}

      {/* ── View Details modal — full Q&A, section by section ── */}
      {viewTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewTarget.full_name}</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  GED Diagnostic · {fmtDate(viewTarget.created_at)} · Overall {viewTarget.overall_score != null ? `${Math.round(viewTarget.overall_score)}%` : '—'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDownload(viewTarget)}
                  className="text-xs font-bold bg-[#1a2e05] hover:bg-[#2a4a09] text-white px-3 py-2 rounded-xl cursor-pointer transition-colors">
                  📄 Download Report
                </button>
                <button onClick={() => setViewTarget(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 text-lg">✕</button>
              </div>
            </div>

            <div className="px-6 py-5">
              {GED_SECTIONS.map(sec => {
                const qs = (viewTarget.questions ?? []).slice(sec.start, sec.end);
                return (
                  <div key={sec.key} className="mb-6">
                    <h3 className="text-sm font-bold text-[#1a2e05] uppercase tracking-wide mb-2">
                      {GED_SECTION_LABELS[sec.key]}
                    </h3>
                    <div className="space-y-2">
                      {qs.map((q, i) => {
                        const student = viewTarget.answers?.[q.question];
                        const correct = q.correctAnswer || q.answer || '';
                        const right = isCorrect(q, viewTarget.answers);
                        return (
                          <div key={i} className={`rounded-xl border p-3 ${right ? 'border-green-200' : 'border-red-200'}`}>
                            <div className="flex items-start gap-2.5">
                              <span className={`flex-shrink-0 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center mt-0.5
                                ${right ? 'bg-green-500' : 'bg-red-500'}`}>
                                {right ? '✓' : '✗'}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1.5"
                                   dangerouslySetInnerHTML={{ __html: `${i + 1}. ${q.question}` }} />
                                <p className={`text-xs ${right ? 'text-green-700' : 'text-red-600'}`}>
                                  <span className="font-semibold">Answer:</span>{' '}
                                  {student ?? <em className="text-gray-400">no answer</em>}
                                </p>
                                {!right && (
                                  <p className="text-xs text-green-700 mt-0.5">
                                    <span className="font-semibold">Correct:</span> {correct}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}



      {deleteTarget && (
  <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1.5">Delete this GED result?</h3>
      <p className="text-sm text-gray-500 mb-1">
        You're about to permanently delete
        <span className="font-semibold text-gray-800"> {deleteTarget.full_name}</span>'s GED submission.
      </p>
      <p className="text-xs text-red-500 font-medium mb-5">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={() => setDeleteTarget(null)}
          className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          Cancel
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}