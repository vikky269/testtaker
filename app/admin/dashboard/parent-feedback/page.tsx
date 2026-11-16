'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import {
  Download,
  MessageSquareHeart,
  Trash2,
  AlertTriangle,
  Search,
  X,
} from 'lucide-react';
import {
  ParentFeedback,
  STATUS_OPTIONS,
  downloadFeedbackCsv,
  displayProgress,
  fmtDate,
  isLowRisk,
  wantsFollowUp,
} from './shared';

function countByValues(rows: ParentFeedback[], getter: (r: ParentFeedback) => string | null | undefined) {
  const map: Record<string, number> = {};
  rows.forEach((r) => {
    const v = getter(r);
    if (!v) return;
    map[v] = (map[v] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function countArrayField(rows: ParentFeedback[], key: 'subjects') {
  const map: Record<string, number> = {};
  rows.forEach((r) => {
    (r[key] ?? []).forEach((v) => {
      map[v] = (map[v] || 0) + 1;
    });
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function BarList({
  items,
  max,
  color = '#123d35',
}: {
  items: [string, number][];
  max: number;
  color?: string;
}) {
  if (!items.length) {
    return <p className="text-sm text-gray-400 text-center py-6">No data yet</p>;
  }
  return (
    <div className="space-y-2.5">
      {items.map(([label, count]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-xs text-gray-600 w-44 truncate flex-shrink-0" title={label}>
            {label}
          </span>
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${max ? (count / max) * 100 : 0}%`,
                backgroundColor: color,
                minWidth: count > 0 ? '6px' : '0',
              }}
            />
          </div>
          <span className="text-xs text-gray-500 w-8 text-right font-medium">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default function ParentFeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rows, setRows] = useState<ParentFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [attentionOnly, setAttentionOnly] = useState(searchParams.get('attention') === '1');
  const [followUpOnly, setFollowUpOnly] = useState(searchParams.get('followup') === '1');
  const [deleteTarget, setDeleteTarget] = useState<ParentFeedback | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const syncUrl = (next: {
    q?: string;
    status?: string;
    attention?: boolean;
    followup?: boolean;
  }) => {
    const sp = new URLSearchParams();
    const q = next.q ?? search;
    const st = next.status ?? statusFilter;
    const att = next.attention ?? attentionOnly;
    const fu = next.followup ?? followUpOnly;
    if (q.trim()) sp.set('q', q.trim());
    if (st && st !== 'all') sp.set('status', st);
    if (att) sp.set('attention', '1');
    if (fu) sp.set('followup', '1');
    const qs = sp.toString();
    router.replace(
      qs ? `/admin/dashboard/parent-feedback?${qs}` : '/admin/dashboard/parent-feedback',
      { scroll: false }
    );
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      const { data, error } = await supabase
        .from('parent_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error(error);
        setLoadError(error.message || 'Could not load feedback.');
        setRows([]);
      } else {
        setRows((data as ParentFeedback[]) ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let out = [...rows];
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((r) => {
        const haystack = [
          r.parent_name,
          r.parent_email,
          (r.student_names ?? []).join(' '),
          (r.subjects ?? []).join(' '),
          r.tutoring_quality,
          r.learning_progress,
          r.communication_support,
          r.overall,
          displayProgress(r),
          r.works_well,
          r.strength,
          r.improve,
          r.followup,
          r.status,
          String(r.nps ?? ''),
          (r.tags ?? []).join(' '),
          r.admin_notes,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
    }
    if (statusFilter !== 'all') out = out.filter((r) => (r.status || 'new') === statusFilter);
    if (attentionOnly) out = out.filter(isLowRisk);
    if (followUpOnly) out = out.filter(wantsFollowUp);
    return out;
  }, [rows, search, statusFilter, attentionOnly, followUpOnly]);

  const listQuery = useMemo(() => {
    const sp = new URLSearchParams();
    if (search.trim()) sp.set('q', search.trim());
    if (statusFilter !== 'all') sp.set('status', statusFilter);
    if (attentionOnly) sp.set('attention', '1');
    if (followUpOnly) sp.set('followup', '1');
    return sp.toString();
  }, [search, statusFilter, attentionOnly, followUpOnly]);

  const stats = useMemo(() => {
    const npsScores = rows.map((r) => r.nps).filter((n): n is number => typeof n === 'number');
    const promoters = npsScores.filter((n) => n >= 9).length;
    const detractors = npsScores.filter((n) => n <= 6).length;
    const nps =
      npsScores.length === 0
        ? null
        : Math.round(((promoters - detractors) / (npsScores.length || 1)) * 100);

    const overallBreakdown = countByValues(rows, (r) => r.overall);
    const tutoringBreakdown = countByValues(rows, (r) => r.tutoring_quality);
    const progressBreakdown = countByValues(rows, (r) => displayProgress(r));
    const commBreakdown = countByValues(rows, (r) => r.communication_support);
    const subjectBreakdown = countArrayField(rows, 'subjects');

    const monthlyMap: Record<string, number> = {};
    rows.forEach((r) => {
      const month = new Date(r.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });
    const monthly = Object.entries(monthlyMap).slice(-8);
    const avgNps =
      npsScores.length === 0
        ? null
        : Math.round((npsScores.reduce((a, b) => a + b, 0) / npsScores.length) * 10) / 10;

    return {
      total: rows.length,
      nps,
      avgNps,
      promoters,
      detractors,
      overallBreakdown,
      tutoringBreakdown,
      progressBreakdown,
      commBreakdown,
      subjectBreakdown,
      followupYes: rows.filter(wantsFollowUp).length,
      attentionCount: rows.filter(isLowRisk).length,
      monthly,
      maxMonthly: Math.max(...monthly.map(([, v]) => v), 1),
      maxOverall: Math.max(...overallBreakdown.map(([, v]) => v), 1),
      maxTutoring: Math.max(...tutoringBreakdown.map(([, v]) => v), 1),
      maxProgress: Math.max(...progressBreakdown.map(([, v]) => v), 1),
      maxComm: Math.max(...commBreakdown.map(([, v]) => v), 1),
      maxSubjects: Math.max(...subjectBreakdown.map(([, v]) => v), 1),
    };
  }, [rows]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('parent_feedback').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) {
      toast.error('Could not delete response.');
      return;
    }
    toast.success('Response deleted');
    setDeleteTarget(null);
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
  };

  const exportCsv = () => {
    const source = filtered.length ? filtered : rows;
    if (!source.length) {
      toast.error('No responses to export.');
      return;
    }
    downloadFeedbackCsv(source, `SmartMathz_Parent_Feedback_${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success(`Exported ${source.length} response${source.length === 1 ? '' : 's'}`);
  };

  const openDetails = (r: ParentFeedback) => {
    router.push(`/admin/dashboard/parent-feedback/${r.id}${listQuery ? `?${listQuery}` : ''}`);
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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquareHeart className="w-6 h-6 text-[#123d35]" />
            Parent Feedback
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Analytics from the 3-step parent survey. Click a row for full details.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              syncUrl({ q: e.target.value });
            }}
            placeholder="Search name, students, tags…"
            className="border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#7FB509] bg-white"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                syncUrl({ q: '' });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm px-4 py-3">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Responses', val: String(stats.total), color: '#123d35' },
          {
            label: 'NPS',
            val: stats.nps == null ? '—' : String(stats.nps),
            sub: stats.nps == null ? undefined : `${stats.promoters} promoters · ${stats.detractors} detractors`,
            color: '#0f766e',
          },
          {
            label: 'Avg recommend',
            val: stats.avgNps == null ? '—' : `${stats.avgNps}/10`,
            color: '#3a5a09',
          },
          {
            label: 'Follow-up Yes',
            val: String(stats.followupYes),
            color: '#4f46e5',
          },
        ].map(({ label, val, color, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-extrabold" style={{ color }}>{val}</p>
            {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Overall satisfaction</h3>
          <BarList items={stats.overallBreakdown} max={stats.maxOverall} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Tutoring quality</h3>
          <BarList items={stats.tutoringBreakdown} max={stats.maxTutoring} color="#059669" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Learning progress</h3>
          <BarList items={stats.progressBreakdown} max={stats.maxProgress} color="#d97706" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Communication & support</h3>
          <BarList items={stats.commBreakdown} max={stats.maxComm} color="#4f46e5" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Subjects</h3>
          <BarList items={stats.subjectBreakdown} max={stats.maxSubjects} color="#0284c7" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Responses over time</h3>
          {stats.monthly.length ? (
            <div className="flex items-end gap-3 h-36">
              {stats.monthly.map(([month, count]) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500">{count}</span>
                  <div
                    className="w-full bg-[#7FB509] rounded-t-lg"
                    style={{ height: `${(count / stats.maxMonthly) * 100}px`, minHeight: '4px' }}
                  />
                  <span className="text-[10px] text-gray-400">{month}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No submissions yet</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-sm font-bold text-gray-700">All responses ({filtered.length})</h3>
            <button
              type="button"
              onClick={exportCsv}
              disabled={!rows.length}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-[#123d35] cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel (CSV)
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                syncUrl({ status: e.target.value });
              }}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs cursor-pointer"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const next = !followUpOnly;
                setFollowUpOnly(next);
                syncUrl({ followup: next });
              }}
              className={`text-xs font-semibold rounded-xl px-3 py-1.5 border cursor-pointer ${
                followUpOnly ? 'bg-violet-100 border-violet-200 text-violet-900' : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              Follow-up Yes ({stats.followupYes})
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !attentionOnly;
                setAttentionOnly(next);
                syncUrl({ attention: next });
              }}
              className={`text-xs font-semibold rounded-xl px-3 py-1.5 border cursor-pointer inline-flex items-center gap-1 ${
                attentionOnly ? 'bg-red-100 border-red-200 text-red-800' : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              <AlertTriangle className="w-3 h-3" /> Needs attention ({stats.attentionCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Date', 'Parent', 'Student', 'Overall', 'NPS', 'Progress', 'Status', 'Flags', ''].map((h) => (
                  <th key={h || 'a'} className="px-3 py-2.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const st = STATUS_OPTIONS.find((s) => s.value === (r.status || 'new')) || STATUS_OPTIONS[0];
                return (
                  <tr
                    key={r.id}
                    onClick={() => openDetails(r)}
                    className="border-t border-gray-50 hover:bg-[#f7faf5] cursor-pointer"
                  >
                    <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                    <td className="px-3 py-2.5 text-xs font-medium text-gray-800">{r.parent_name || '—'}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[140px] truncate">
                      {(r.student_names ?? []).filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-700">{r.overall || '—'}</td>
                    <td className="px-3 py-2.5 text-xs font-bold">{r.nps ?? '—'}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">{displayProgress(r) || '—'}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {wantsFollowUp(r) && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-800">Follow-up</span>
                        )}
                        {isLowRisk(r) && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">Low score</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/admin/dashboard/parent-feedback/${r.id}${listQuery ? `?${listQuery}` : ''}`}
                        className="text-xs font-semibold text-[#123d35] hover:underline mr-3 cursor-pointer"
                      >
                        Open
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(r)}
                        className="text-xs text-red-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400 text-sm">
                    No feedback responses match these filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Delete this response?</h3>
            <p className="text-sm text-gray-500">
              Permanently remove feedback from <strong>{deleteTarget.parent_name || 'this parent'}</strong>.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-3 py-2 text-sm rounded-lg border cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white cursor-pointer disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
