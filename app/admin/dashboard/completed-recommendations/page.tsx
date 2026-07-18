'use client';

// app/admin/dashboard/completed-recommendations/page.tsx
// Saved programme recommendations — kebab action menu per row:
// View Details · Edit · Download · Delete

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import {
  PACKAGES, generateRecommendationPDF,
  type PackageOption, type CustomPackageSubject,
} from '@/app/utils/generateRecommendation';
import { type ComputedPrice } from '@/app/utils/pricingData';

interface CompletedRec {
  id: string;
  created_at: string;
  updated_at: string;
  leaderboard_id: string | null;
  student_name: string;
  student_email: string | null;
  grade: string;
  gender: string | null;
  math_score: number | null;
  ela_score: number | null;
  science_score: number | null;
  overall_score: number;
  times: { math?: string; ela?: string; science?: string; total?: string } | null;
  package_id: 'I' | 'II' | 'III' | 'custom';
  package_label: string | null;
  hours_per_week: number | null;
  custom_subjects: CustomPackageSubject[] | null;
  additional_programs: string[] | null;
  default_sessions: number | null;
  sessions: number | null;
  adjuster: number | null;
  parent_budget: number | null;
  custom_std_rate: number | null;
  computed_price: ComputedPrice | null;
  instructor_name: string | null;
  instructor_comment: string | null;
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });

const pkgBadge = (id: string) =>
  id === 'I'      ? 'bg-blue-50 text-blue-700'
  : id === 'II'   ? 'bg-green-50 text-green-700'
  : id === 'III'  ? 'bg-purple-50 text-purple-700'
  : 'bg-amber-50 text-amber-700';

const MENU_W = 190;

export default function CompletedRecommendationsPage() {
  const router = useRouter();
  const [recs, setRecs]         = useState<CompletedRec[]>([]);
  const [filtered, setFiltered] = useState<CompletedRec[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [pkgFilter, setPkgFilter] = useState('All');

  // Kebab menu state — fixed-positioned so the scroll container can't clip it
  const [menu, setMenu] = useState<{ rec: CompletedRec; x: number; y: number } | null>(null);
  // Modals
  const [viewTarget, setViewTarget]     = useState<CompletedRec | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompletedRec | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('completed_recommendations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) { setRecs(data); setFiltered(data); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let out = [...recs];
    if (pkgFilter !== 'All') out = out.filter(r => r.package_id === pkgFilter);
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(r =>
        r.student_name.toLowerCase().includes(q) ||
        (r.student_email ?? '').toLowerCase().includes(q)
      );
    }
    setFiltered(out);
  }, [recs, search, pkgFilter]);

  // Close the kebab menu on any outside click / scroll
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

 const openMenu = (e: React.MouseEvent, rec: CompletedRec) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const MENU_H = 195; // 4-item menu + divider
    const openUp = rect.bottom + MENU_H > window.innerHeight - 8;
    setMenu(prev => prev?.rec.id === rec.id ? null : {
      rec,
      x: Math.max(8, rect.right - MENU_W),
      y: openUp ? rect.top - MENU_H - 6 : rect.bottom + 6,
    });
  };
  // ── Download PDF from the stored snapshot ─────────────────────────────────
  const handleDownload = (rec: CompletedRec) => {
    try {
      const selectedPackage: PackageOption =
        rec.package_id === 'custom'
          ? {
              id: 'custom',
              label: 'Custom Package',
              subjects: (rec.custom_subjects ?? []).map(s => s.name),
              hoursPerWeek: rec.hours_per_week,
              description: `Customized program — ${(rec.custom_subjects ?? []).map(s => s.name).join(', ')} — ${rec.hours_per_week ?? 0}hrs/week`,
            }
          : PACKAGES.find(p => p.id === rec.package_id) ?? PACKAGES[0];

      generateRecommendationPDF({
        studentName:        rec.student_name,
        studentEmail:       rec.student_email ?? undefined,
        grade:              rec.grade,
        gender:             rec.gender ?? undefined,
        mathScore:          rec.math_score,
        elaScore:           rec.ela_score,
        scienceScore:       rec.science_score,
        overallScore:       rec.overall_score,
        selectedPackage,
        customSubjects:     rec.package_id === 'custom' ? (rec.custom_subjects ?? []) : [],
        additionalPrograms: rec.package_id !== 'custom' ? (rec.additional_programs ?? []) : [],
        instructorName:     rec.instructor_name ?? undefined,
        instructorComment:  rec.instructor_comment ?? undefined,
        testDate:           fmtDate(rec.created_at),
        computedPrice:      rec.computed_price ?? undefined,
        defaultSessions:    rec.default_sessions ?? undefined,
        times:              rec.times ?? undefined,
      });
    } catch (err) {
      console.error(err);
      toast.error('Could not generate the PDF for this record.');
    }
  };

  const handleEdit = (rec: CompletedRec) =>
    router.push(`/admin/dashboard/results?edit=${rec.id}`);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from('completed_recommendations').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      console.error(error);
      toast.error('Failed to delete. Check permissions and try again.');
      return;
    }
    toast.success(`${deleteTarget.student_name}'s recommendation deleted.`);
    window.dispatchEvent(new Event('pending-evals-changed'));
    setRecs(prev => prev.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  if (loading) return <div className="p-8 text-gray-500">Loading completed recommendations...</div>;

  return (
    <div className="max-w-7xl">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Completed Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Saved program recommendations. Use the actions menu to view, edit, download, or delete.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total',       count: recs.length,                                        cls: 'text-gray-800'   },
          { label: 'Package I',   count: recs.filter(r => r.package_id === 'I').length,      cls: 'text-blue-700'   },
          { label: 'Package II',  count: recs.filter(r => r.package_id === 'II').length,     cls: 'text-green-700'  },
          { label: 'Package III', count: recs.filter(r => r.package_id === 'III').length,    cls: 'text-purple-700' },
          { label: 'Custom',      count: recs.filter(r => r.package_id === 'custom').length, cls: 'text-amber-700'  },
        ].map(({ label, count, cls }) => (
          <div key={label} className="bg-white rounded-2xl p-4 text-center border border-gray-100">
            <p className={`text-2xl font-extrabold ${cls}`}>{count}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <input type="text" placeholder="Search by student name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={pkgFilter} onChange={e => setPkgFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none cursor-pointer">
          {['All', 'I', 'II', 'III', 'custom'].map(p => (
            <option key={p} value={p}>{p === 'All' ? 'All Packages' : p === 'custom' ? 'Custom' : `Package ${p}`}</option>
          ))}
        </select>
        <span className="hidden sm:flex items-center text-xs text-gray-400 whitespace-nowrap">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#','STUDENT','GRADE','PACKAGE','MONTHLY FEE','BI-WEEKLY','SAVINGS','EVALUATOR','SAVED','ACTIONS'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-12 text-gray-400 text-sm">
                  No completed recommendations yet. Save one from the Results page.
                </td></tr>
              ) : filtered.map((r, idx) => {
                const cp = r.computed_price;
                return (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {r.student_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm truncate max-w-[130px]">{r.student_name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[130px]">{r.student_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.grade}</span></td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pkgBadge(r.package_id)}`}>
                        {r.package_id === 'custom' ? 'Custom' : `Package ${r.package_id}`}
                      </span>
                    </td>
                    {/* <td className="px-3 py-3 text-sm text-gray-700">{r.hours_per_week ?? '—'}</td>
                    <td className="px-3 py-3 text-sm text-gray-700">{r.sessions ?? cp?.sessions ?? '—'}</td> */}
                    <td className="px-3 py-3 text-sm font-bold text-green-700">
                      {cp ? `$${cp.smMonthlyFee}` : '—'}
                      {cp && <span className="block text-[10px] font-normal text-gray-400">std ${cp.standardMonthlyFee}</span>}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-gray-700">{cp ? `$${cp.smBiweekly.toFixed(1)}` : '—'}</td>
                    <td className="px-3 py-3">
                      {cp ? (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cp.savingsPercent >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {cp.savingsPercent}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500 truncate max-w-[110px]">{r.instructor_name ?? '—'}</td>
                    <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {fmtDate(r.created_at)}
                      <span className="block text-[10px] text-gray-300">
                        {new Date(r.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {/* Kebab action button */}
                      <button onClick={e => openMenu(e, r)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Kebab dropdown — fixed positioned, never clipped by the table ── */}
      {menu && (
        <div className="fixed z-[70] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5"
          style={{ left: menu.x, top: menu.y, width: MENU_W }}
          onClick={e => e.stopPropagation()}>
          <button onClick={() => { setViewTarget(menu.rec); setMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
            👁️ View Details
          </button>
          <button onClick={() => { handleEdit(menu.rec); setMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
            ✏️ Edit
          </button>
          <button onClick={() => { handleDownload(menu.rec); setMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
            📄 Download PDF
          </button>
          <hr className="my-1 border-gray-100" />
          <button onClick={() => { setDeleteTarget(menu.rec); setMenu(null); }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer">
            🗑️ Delete
          </button>
        </div>
      )}

      {/* ── View Details modal ── */}
      {viewTarget && (() => {
        const r = viewTarget; const cp = r.computed_price;
        const Row = ({ label, value }: { label: string; value: string | number | null | undefined }) =>
          value != null && value !== '' ? (
            <div className="flex justify-between py-1.5 border-b border-gray-50 last:border-0 text-sm gap-4">
              <span className="text-gray-400 text-xs uppercase tracking-wide pt-0.5">{label}</span>
              <span className="font-semibold text-gray-800 text-right">{value}</span>
            </div>
          ) : null;
        const Section = ({ title }: { title: string }) => (
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3a5a09] mt-4 mb-1 border-b border-green-100 pb-1">{title}</h3>
        );
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{r.student_name}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Saved {fmtDate(r.created_at)}{r.updated_at !== r.created_at ? ` · edited ${fmtDate(r.updated_at)}` : ''}</p>
                </div>
                <button onClick={() => setViewTarget(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 text-lg">✕</button>
              </div>
              <div className="px-6 py-5">
                <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full mb-2 ${pkgBadge(r.package_id)}`}>
                  {r.package_id === 'custom' ? 'Custom Package' : `Package ${r.package_id}`}
                </span>

                <Section title="Student" />
                <Row label="Email"   value={r.student_email} />
                <Row label="Grade"   value={r.grade} />
                <Row label="Gender"  value={r.gender} />
                <Row label="Overall" value={`${Math.round(r.overall_score)}%`} />
                <Row label="Math"    value={r.math_score    != null ? `${Math.round(r.math_score)}%`    : null} />
                <Row label="ELA"     value={r.ela_score     != null ? `${Math.round(r.ela_score)}%`     : null} />
                <Row label="Science" value={r.science_score != null ? `${Math.round(r.science_score)}%` : null} />
                <Row label="Total Time" value={r.times?.total} />

                <Section title="Program" />
                <Row label="Hours / Week" value={r.hours_per_week} />
                <Row label="Sessions / Month" value={r.sessions} />
                {r.package_id === 'custom' && (r.custom_subjects ?? []).length > 0 && (
                  <Row label="Subjects" value={(r.custom_subjects ?? []).map(s => `${s.name} (${s.hours}hr/wk)`).join(', ')} />
                )}
                {(r.additional_programs ?? []).length > 0 && (
                  <Row label="Additional Programs" value={(r.additional_programs ?? []).join(', ')} />
                )}

                <Section title="Pricing" />
                <Row label="Standard Monthly" value={cp ? `$${cp.standardMonthlyFee}` : null} />
                <Row label="SmartMathz Monthly" value={cp ? `$${cp.smMonthlyFee}` : null} />
                <Row label="Hourly Rate" value={cp ? `$${cp.smHourlyRate.toFixed(2)}/hr (std $${cp.standardHourlyRate.toFixed(2)})` : null} />
                <Row label="Bi-Weekly" value={cp ? `$${cp.smBiweekly.toFixed(1)}` : null} />
                <Row label="Savings" value={cp ? `${cp.savingsPercent}% · $${cp.smInvestment}/mo investment` : null} />
                {(r.parent_budget ?? 0) > 0 && <Row label="Parent Budget" value={`$${r.parent_budget}/mo`} />}
                {(r.adjuster ?? 0) !== 0 && <Row label="Rate Adjuster" value={`${(r.adjuster ?? 0) > 0 ? '+' : ''}$${r.adjuster}/hr`} />}

                <Section title="Evaluator" />
                <Row label="Name" value={r.instructor_name} />
                {r.instructor_comment && (
                  <div className="mt-2 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-600 whitespace-pre-wrap">
                    {r.instructor_comment}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => { handleDownload(r); }}
                    className="flex-1 py-2.5 bg-[#1a2e05] hover:bg-[#2a4a09] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors">
                    📄 Download PDF
                  </button>
                  <button onClick={() => setViewTarget(null)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Delete this recommendation?</h3>
            <p className="text-sm text-gray-500 mb-1">
              You're about to permanently delete
              <span className="font-semibold text-gray-800"> {deleteTarget.student_name}</span>'s
              saved recommendation ({deleteTarget.package_id === 'custom' ? 'Custom' : `Package ${deleteTarget.package_id}`}).
            </p>
            <p className="text-xs text-gray-400 mb-1">The student will reappear on the Results page.</p>
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