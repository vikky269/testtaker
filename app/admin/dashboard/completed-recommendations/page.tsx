'use client';

// app/admin/dashboard/completed-recommendations/page.tsx
// Saved programme recommendations — view / edit / download / delete

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import {
  PACKAGES, generateRecommendationPDF,
  type PackageOption, type CustomPackageSubject,
} from '@/app/utils/generateRecommendation';
import { type ComputedPrice } from '@/app/utils/pricingData';
import {
  getLearningCategory,
  LEARNING_CATEGORIES,
  type LearningCategory,
} from '@/app/utils/reviewUtils';
import { PageHeader, KpiCard, cardClass, cardHoverClass } from '../ui';

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
  id === 'I'      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
  : id === 'II'   ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
  : id === 'III'  ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-100'
  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100';

const CAT_ACCENT: Record<LearningCategory['name'], string> = {
  WHIZZES: '#16a34a',
  ACES: '#15803d',
  EXPLORERS: '#2563eb',
  RISERS: '#d97706',
  ADAPTERS: '#7c3aed',
};

function Tile({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: ReactNode;
  tone?: 'default' | 'green' | 'blue' | 'amber' | 'violet' | 'rose' | 'indigo';
}) {
  const tones: Record<string, string> = {
    default: 'bg-[#f7faf5] border-[#eef2ea]',
    green: 'bg-emerald-50 border-emerald-100',
    blue: 'bg-sky-50 border-sky-100',
    amber: 'bg-amber-50 border-amber-100',
    violet: 'bg-violet-50 border-violet-100',
    rose: 'bg-rose-50 border-rose-100',
    indigo: 'bg-indigo-50 border-indigo-100',
  };
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${tones[tone]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-bold text-[#1a2e05] break-words">{value ?? '—'}</div>
    </div>
  );
}

export default function CompletedRecommendationsPage() {
  const router = useRouter();
  const [recs, setRecs] = useState<CompletedRec[]>([]);
  const [filtered, setFiltered] = useState<CompletedRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pkgFilter, setPkgFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');

  const [actionsTarget, setActionsTarget] = useState<CompletedRec | null>(null);
  const [viewTarget, setViewTarget] = useState<CompletedRec | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompletedRec | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from('completed_recommendations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setRecs(data);
      setFiltered(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let out = [...recs];
    if (pkgFilter !== 'All') out = out.filter((r) => r.package_id === pkgFilter);
    if (catFilter !== 'All') {
      out = out.filter((r) => getLearningCategory(r.overall_score).name === catFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.student_name.toLowerCase().includes(q) ||
          (r.student_email ?? '').toLowerCase().includes(q)
      );
    }
    setFiltered(out);
  }, [recs, search, pkgFilter, catFilter]);

  const categoryCounts = useMemo(
    () =>
      LEARNING_CATEGORIES.map((c) => ({
        ...c,
        count: recs.filter((r) => getLearningCategory(r.overall_score).name === c.name).length,
      })),
    [recs]
  );

  const handleDownload = (rec: CompletedRec) => {
    try {
      const selectedPackage: PackageOption =
        rec.package_id === 'custom'
          ? {
              id: 'custom',
              label: 'Custom Package',
              subjects: (rec.custom_subjects ?? []).map((s) => s.name),
              hoursPerWeek: rec.hours_per_week,
              description: `Customized program — ${(rec.custom_subjects ?? []).map((s) => s.name).join(', ')} — ${rec.hours_per_week ?? 0}hrs/week`,
            }
          : PACKAGES.find((p) => p.id === rec.package_id) ?? PACKAGES[0];

      generateRecommendationPDF({
        studentName: rec.student_name,
        studentEmail: rec.student_email ?? undefined,
        grade: rec.grade,
        gender: rec.gender ?? undefined,
        mathScore: rec.math_score,
        elaScore: rec.ela_score,
        scienceScore: rec.science_score,
        overallScore: rec.overall_score,
        selectedPackage,
        customSubjects: rec.package_id === 'custom' ? (rec.custom_subjects ?? []) : [],
        additionalPrograms: rec.package_id !== 'custom' ? (rec.additional_programs ?? []) : [],
        instructorName: rec.instructor_name ?? undefined,
        instructorComment: rec.instructor_comment ?? undefined,
        testDate: fmtDate(rec.created_at),
        computedPrice: rec.computed_price ?? undefined,
        defaultSessions: rec.default_sessions ?? undefined,
        times: rec.times ?? undefined,
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

    const { data, error } = await supabase
      .from('completed_recommendations')
      .delete()
      .eq('id', deleteTarget.id)
      .select('id');

    if (error) {
      setDeleting(false);
      console.error(error);
      toast.error('Failed to delete. Check permissions and try again.');
      return;
    }
    if (!data || data.length === 0) {
      setDeleting(false);
      toast.error('Delete was blocked by a permissions rule — nothing was removed.');
      return;
    }

    if (deleteTarget.leaderboard_id) {
      const { error: lbError } = await supabase
        .from('leaderboard')
        .delete()
        .eq('id', deleteTarget.leaderboard_id);
      if (lbError) {
        console.error('Could not delete linked leaderboard row:', lbError);
        toast.error(
          'Recommendation deleted, but the result row could not be removed — it may still show in Pending Evaluations.'
        );
      }
    }

    setDeleting(false);
    toast.success(`${deleteTarget.student_name}'s recommendation and result deleted.`);
    window.dispatchEvent(new Event('pending-evals-changed'));
    setRecs((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
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
        title="Completed Recommendations"
        subtitle="Saved program recommendations. Open any row to view a polished details card, edit, download, or delete."
      />

      {/* Learning categories at top */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-2">
          Learning categories
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoryCounts.map((c) => {
            const active = catFilter === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setCatFilter(active ? 'All' : c.name)}
                className={`${cardClass} ${cardHoverClass} relative overflow-hidden p-4 text-left cursor-pointer ${
                  active ? 'ring-2 ring-[#7FB509]/50 border-[#cfe39a]' : ''
                }`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ backgroundColor: CAT_ACCENT[c.name] }}
                />
                <p className={`text-[11px] font-bold uppercase tracking-wide ${c.color}`}>{c.name}</p>
                <p className="text-2xl font-extrabold text-[#1a2e05] mt-1">{c.count}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{c.range}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <KpiCard label="Total" value={recs.length} color="#1a2e05" />
        <KpiCard label="Package I" value={recs.filter((r) => r.package_id === 'I').length} color="#2563eb" />
        <KpiCard label="Package II" value={recs.filter((r) => r.package_id === 'II').length} color="#059669" />
        <KpiCard label="Package III" value={recs.filter((r) => r.package_id === 'III').length} color="#7c3aed" />
        <KpiCard label="Custom" value={recs.filter((r) => r.package_id === 'custom').length} color="#d97706" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e4ebe0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB509]/25 bg-white shadow-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={pkgFilter}
          onChange={(e) => setPkgFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-[#e4ebe0] rounded-xl bg-white focus:outline-none cursor-pointer shadow-sm"
        >
          {['All', 'I', 'II', 'III', 'custom'].map((p) => (
            <option key={p} value={p}>
              {p === 'All' ? 'All Packages' : p === 'custom' ? 'Custom' : `Package ${p}`}
            </option>
          ))}
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-[#e4ebe0] rounded-xl bg-white focus:outline-none cursor-pointer shadow-sm"
        >
          <option value="All">All Categories</option>
          {LEARNING_CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="hidden sm:flex items-center text-xs text-gray-400 whitespace-nowrap">
          {filtered.length} results
        </span>
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#f7faf5] border-b border-[#eef2ea]">
                {['#', 'STUDENT', 'GRADE', 'CATEGORY', 'PACKAGE', 'MONTHLY FEE', 'BI-WEEKLY', 'SAVINGS', 'EVALUATOR', 'SAVED', 'ACTIONS'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-gray-400 text-sm">
                    No completed recommendations match these filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const cp = r.computed_price;
                  const cat = getLearningCategory(r.overall_score);
                  const stripe = idx % 2 === 0 ? 'bg-white' : 'bg-[#f9fbf7]';
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setActionsTarget(r)}
                      className={`${stripe} border-b border-[#eef2ea] hover:bg-[#eef8d4]/35 transition-colors cursor-pointer`}
                    >
                      <td className="px-3 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center flex-shrink-0 text-white"
                            style={{ backgroundColor: CAT_ACCENT[cat.name] }}
                          >
                            {r.student_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a2e05] text-sm truncate max-w-[130px]">
                              {r.student_name}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[130px]">
                              {r.student_email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[11px] bg-[#f0f4ec] text-gray-600 px-2 py-0.5 rounded-lg font-medium">
                          {r.grade}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.bgColor} ${cat.color}`}>
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pkgBadge(r.package_id)}`}>
                          {r.package_id === 'custom' ? 'Custom' : `Package ${r.package_id}`}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm font-bold text-[#3a5a09]">
                        {cp ? `$${cp.smMonthlyFee}` : '—'}
                        {cp && (
                          <span className="block text-[10px] font-normal text-gray-400">
                            std ${cp.standardMonthlyFee}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-sm font-semibold text-gray-700">
                        {cp ? `$${cp.smBiweekly.toFixed(1)}` : '—'}
                      </td>
                      <td className="px-3 py-3">
                        {cp ? (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              cp.savingsPercent >= 0
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {cp.savingsPercent}%
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-500 truncate max-w-[110px]">
                        {r.instructor_name ?? '—'}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {fmtDate(r.created_at)}
                        <span className="block text-[10px] text-gray-300">
                          {new Date(r.created_at).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionsTarget(r);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e4ebe0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1a2e05] hover:bg-[#f7faf5] hover:border-[#cfd9c8] cursor-pointer transition-colors"
                          title="Actions"
                        >
                          Actions
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions modal — replaces floating kebab menu */}
      {actionsTarget && (() => {
        const r = actionsTarget;
        const cat = getLearningCategory(r.overall_score);
        const actions = [
          {
            key: 'view',
            title: 'View Details',
            desc: 'Scores, program, pricing & evaluator notes',
            icon: '👁️',
            tone: 'bg-[#eef8d4] border-[#d8e8b8] hover:bg-[#e4f3b8]',
            onClick: () => {
              setViewTarget(r);
              setActionsTarget(null);
            },
          },
          {
            key: 'edit',
            title: 'Edit Recommendation',
            desc: 'Open the recommendation editor',
            icon: '✏️',
            tone: 'bg-sky-50 border-sky-100 hover:bg-sky-100',
            onClick: () => {
              handleEdit(r);
              setActionsTarget(null);
            },
          },
          {
            key: 'pdf',
            title: 'Download PDF',
            desc: 'Export the saved recommendation letter',
            icon: '📄',
            tone: 'bg-violet-50 border-violet-100 hover:bg-violet-100',
            onClick: () => {
              handleDownload(r);
              setActionsTarget(null);
            },
          },
          {
            key: 'delete',
            title: 'Delete',
            desc: 'Permanently remove this recommendation',
            icon: '🗑️',
            tone: 'bg-rose-50 border-rose-100 hover:bg-rose-100',
            danger: true,
            onClick: () => {
              setDeleteTarget(r);
              setActionsTarget(null);
            },
          },
        ] as const;

        return (
          <div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setActionsTarget(null)}
          >
            <div
              className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 pt-5 pb-4 border-b border-[#eef2ea]">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl text-sm font-bold flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: CAT_ACCENT[cat.name] }}
                    >
                      {r.student_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                        Recommendation actions
                      </p>
                      <h2 className="text-lg font-bold text-[#1a2e05] truncate">{r.student_name}</h2>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.bgColor} ${cat.color}`}>
                          {cat.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pkgBadge(r.package_id)}`}>
                          {r.package_id === 'custom' ? 'Custom' : `Package ${r.package_id}`}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f0f4ec] text-gray-600">
                          {r.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActionsTarget(null)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer flex items-center justify-center flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                {actions.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={a.onClick}
                    className={`w-full flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left cursor-pointer transition-all ${a.tone}`}
                  >
                    <span className="text-xl leading-none mt-0.5">{a.icon}</span>
                    <span className="min-w-0">
                      <span
                        className={`block text-sm font-bold ${
                          'danger' in a && a.danger ? 'text-rose-700' : 'text-[#1a2e05]'
                        }`}
                      >
                        {a.title}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">{a.desc}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="px-4 pb-5">
                <button
                  type="button"
                  onClick={() => setActionsTarget(null)}
                  className="w-full py-2.5 rounded-xl border border-[#e4ebe0] text-sm font-semibold text-gray-600 hover:bg-[#f7faf5] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* View Details modal — tiled layout + learning category on top */}
      {viewTarget && (() => {
        const r = viewTarget;
        const cp = r.computed_price;
        const cat = getLearningCategory(r.overall_score);
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#eef2ea] px-6 pt-5 pb-4 rounded-t-3xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: CAT_ACCENT[cat.name] }}
                      >
                        {r.student_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-[#1a2e05] truncate">{r.student_name}</h2>
                        <p className="text-xs text-gray-400">
                          Saved {fmtDate(r.created_at)}
                          {r.updated_at !== r.created_at ? ` · edited ${fmtDate(r.updated_at)}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${cat.bgColor} ${cat.color}`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: CAT_ACCENT[cat.name] }}
                        />
                        {cat.name}
                        <span className="opacity-70 font-semibold">· {cat.range}</span>
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${pkgBadge(r.package_id)}`}>
                        {r.package_id === 'custom' ? 'Custom Package' : `Package ${r.package_id}`}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f0f4ec] text-gray-600">
                        {r.grade}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewTarget(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 text-lg flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                <div className={`rounded-2xl border px-4 py-3 ${cat.bgColor} border-black/5`}>
                  <p className={`text-[11px] font-bold uppercase tracking-wide mb-1 ${cat.color}`}>
                    Learning category
                  </p>
                  <p className={`text-base font-extrabold ${cat.color}`}>{cat.name}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{cat.description}</p>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3a5a09] mb-2">
                    Scores
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Tile label="Overall" value={`${Math.round(r.overall_score)}%`} tone="green" />
                    <Tile
                      label="Math"
                      value={r.math_score != null ? `${Math.round(r.math_score)}%` : '—'}
                      tone="indigo"
                    />
                    <Tile
                      label="ELA"
                      value={r.ela_score != null ? `${Math.round(r.ela_score)}%` : '—'}
                      tone="blue"
                    />
                    <Tile
                      label="Science"
                      value={r.science_score != null ? `${Math.round(r.science_score)}%` : '—'}
                      tone="amber"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3a5a09] mb-2">
                    Student
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Tile label="Email" value={r.student_email || '—'} />
                    <Tile label="Gender" value={r.gender || '—'} />
                    <Tile label="Total time" value={r.times?.total || '—'} />
                    <Tile
                      label="Section times"
                      value={
                        [r.times?.math && `Math ${r.times.math}`, r.times?.ela && `ELA ${r.times.ela}`, r.times?.science && `Sci ${r.times.science}`]
                          .filter(Boolean)
                          .join(' · ') || '—'
                      }
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3a5a09] mb-2">
                    Program
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Tile label="Hours / week" value={r.hours_per_week ?? '—'} tone="green" />
                    <Tile label="Sessions / month" value={r.sessions ?? '—'} tone="green" />
                    {r.package_id === 'custom' && (r.custom_subjects ?? []).length > 0 && (
                      <div className="sm:col-span-2">
                        <Tile
                          label="Subjects"
                          value={(r.custom_subjects ?? [])
                            .map((s) => `${s.name} (${s.hours}hr/wk)`)
                            .join(', ')}
                          tone="violet"
                        />
                      </div>
                    )}
                    {(r.additional_programs ?? []).length > 0 && (
                      <div className="sm:col-span-2">
                        <Tile
                          label="Additional programs"
                          value={(r.additional_programs ?? []).join(', ')}
                          tone="blue"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3a5a09] mb-2">
                    Pricing
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Tile
                      label="Standard monthly"
                      value={cp ? `$${cp.standardMonthlyFee}` : '—'}
                    />
                    <Tile
                      label="SmartMathz monthly"
                      value={cp ? `$${cp.smMonthlyFee}` : '—'}
                      tone="green"
                    />
                    <Tile
                      label="Hourly rate"
                      value={
                        cp
                          ? `$${cp.smHourlyRate.toFixed(2)}/hr (std $${cp.standardHourlyRate.toFixed(2)})`
                          : '—'
                      }
                      tone="amber"
                    />
                    <Tile
                      label="Bi-weekly"
                      value={cp ? `$${cp.smBiweekly.toFixed(1)}` : '—'}
                      tone="blue"
                    />
                    <Tile
                      label="Savings"
                      value={
                        cp ? `${cp.savingsPercent}% · $${cp.smInvestment}/mo investment` : '—'
                      }
                      tone="green"
                    />
                    {(r.parent_budget ?? 0) > 0 && (
                      <Tile label="Parent budget" value={`$${r.parent_budget}/mo`} tone="violet" />
                    )}
                    {(r.adjuster ?? 0) !== 0 && (
                      <Tile
                        label="Rate adjuster"
                        value={`${(r.adjuster ?? 0) > 0 ? '+' : ''}$${r.adjuster}/hr`}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3a5a09] mb-2">
                    Evaluator
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Tile label="Name" value={r.instructor_name || '—'} />
                    {r.instructor_comment && (
                      <div className="rounded-xl border border-[#eef2ea] bg-[#f7faf5] px-3 py-3 text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {r.instructor_comment}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    onClick={() => handleDownload(r)}
                    className="flex-1 py-2.5 bg-[#1a2e05] hover:bg-[#2a4a09] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    📄 Download PDF
                  </button>
                  <button
                    onClick={() => {
                      handleEdit(r);
                      setViewTarget(null);
                    }}
                    className="flex-1 py-2.5 border border-[#e4ebe0] text-[#1a2e05] text-sm font-semibold rounded-xl hover:bg-[#f7faf5] cursor-pointer transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setViewTarget(null)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Delete this recommendation?</h3>
            <p className="text-sm text-gray-500 mb-1">
              You&apos;re about to permanently delete
              <span className="font-semibold text-gray-800"> {deleteTarget.student_name}</span>&apos;s
              saved recommendation (
              {deleteTarget.package_id === 'custom'
                ? 'Custom'
                : `Package ${deleteTarget.package_id}`}
              ).
            </p>
            <p className="text-xs text-gray-400 mb-1">
              This removes the student&apos;s result completely — it will not reappear in Pending
              Evaluations.
            </p>
            <p className="text-xs text-red-500 font-medium mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
