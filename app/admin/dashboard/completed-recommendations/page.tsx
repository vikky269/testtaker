'use client';

// app/admin/dashboard/completed-recommendations/page.tsx
// Saved programme recommendations — key metrics, download PDF, edit (reopens the results modal)

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

const pkgBadge = (id: string) =>
  id === 'I'      ? 'bg-blue-50 text-blue-700'
  : id === 'II'   ? 'bg-green-50 text-green-700'
  : id === 'III'  ? 'bg-purple-50 text-purple-700'
  : 'bg-amber-50 text-amber-700';

export default function CompletedRecommendationsPage() {
  const router = useRouter();
  const [recs, setRecs]         = useState<CompletedRec[]>([]);
  const [filtered, setFiltered] = useState<CompletedRec[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [pkgFilter, setPkgFilter] = useState('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

  // ── Download PDF from the stored snapshot ─────────────────────────────────
  const handleDownload = (rec: CompletedRec) => {
    setDownloadingId(rec.id);
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
    } finally {
      setDownloadingId(null);
    }
  };

  // ── Edit — reopen the results-page modal pre-populated ───────────────────
  const handleEdit = (rec: CompletedRec) => {
    router.push(`/admin/dashboard/results?edit=${rec.id}`);
  };

  if (loading) return <div className="p-8 text-gray-500">Loading completed recommendations...</div>;

  return (
    <div className="max-w-7xl">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Completed Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Saved program recommendations. Download the final PDF or edit a recommendation before sending it out.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total',          count: recs.length,                                          cls: 'text-gray-800'   },
          { label: 'Package I',      count: recs.filter(r => r.package_id === 'I').length,        cls: 'text-blue-700'   },
          { label: 'Package II',     count: recs.filter(r => r.package_id === 'II').length,       cls: 'text-green-700'  },
          { label: 'Package III',    count: recs.filter(r => r.package_id === 'III').length,      cls: 'text-purple-700' },
          { label: 'Custom',         count: recs.filter(r => r.package_id === 'custom').length,   cls: 'text-amber-700'  },
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
                {['#','STUDENT','GRADE','PACKAGE','HRS/WK','SESSIONS','MONTHLY FEE','BI-WEEKLY','SAVINGS','EVALUATOR','SAVED','ACTIONS'].map(h => (
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
                    <td className="px-3 py-3 text-sm text-gray-700">{r.hours_per_week ?? '—'}</td>
                    <td className="px-3 py-3 text-sm text-gray-700">{r.sessions ?? cp?.sessions ?? '—'}</td>
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
                    <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleDownload(r)}
                          disabled={downloadingId === r.id}
                          className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 whitespace-nowrap">
                          {downloadingId === r.id ? '...' : '📄 Download'}
                        </button>
                        <button onClick={() => handleEdit(r)}
                          className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                          ✏️ Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}