'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Link2,
  Mail,
  Printer,
  Trash2,
  AlertTriangle,
  Tag,
} from 'lucide-react';
import {
  ADMIN_LABELS,
  FeedbackStatus,
  LinkedSubscription,
  ParentFeedback,
  STATUS_OPTIONS,
  SUGGESTED_TAGS,
  TEACHING_LABELS,
  buildSummaryText,
  displayProgress,
  displayWorksWell,
  downloadFeedbackCsv,
  fmtDateTime,
  isLegacyResponse,
  isLowRisk,
  lowAdminScores,
  lowTeachingScores,
  matchSubscriptions,
  wantsFollowUp,
} from '../shared';

function RatingBars({
  ratings,
  labels,
}: {
  ratings: Record<string, number> | null;
  labels: Record<string, string>;
}) {
  return (
    <div className="space-y-3">
      {Object.keys(labels).map((key) => {
        const v = ratings?.[key];
        const low = typeof v === 'number' && v <= 2;
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-40 flex-shrink-0">{labels[key]}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full ${low ? 'bg-red-500' : 'bg-[#123d35]'}`}
                style={{
                  width: `${typeof v === 'number' ? (v / 5) * 100 : 0}%`,
                  minWidth: typeof v === 'number' && v > 0 ? '8px' : 0,
                }}
              />
            </div>
            <span className={`text-xs font-bold w-8 text-right ${low ? 'text-red-600' : 'text-gray-700'}`}>
              {v ?? '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3 print:shadow-none print:border-[#d5e0d4] print:rounded-lg print:break-inside-avoid">
      <h3 className="text-sm font-bold text-[#123d35] print:text-[12pt] print:border-b print:border-[#7FB509] print:pb-1">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="print:break-inside-avoid">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-0.5 print:text-[#62716c]">
        {label}
      </p>
      <p className="text-sm text-gray-800 whitespace-pre-wrap print:text-[10.5pt]">{value}</p>
    </div>
  );
}

export default function ParentFeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = String(params.id || '');

  const [row, setRow] = useState<ParentFeedback | null>(null);
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<FeedbackStatus>('new');
  const [email, setEmail] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [linked, setLinked] = useState<LinkedSubscription[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const listQuery = searchParams.toString();
  const backHref = listQuery
    ? `/admin/dashboard/parent-feedback?${listQuery}`
    : '/admin/dashboard/parent-feedback';

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data, error }, { data: allIds }] = await Promise.all([
      supabase.from('parent_feedback').select('*').eq('id', id).maybeSingle(),
      supabase
        .from('parent_feedback')
        .select('id')
        .order('created_at', { ascending: false }),
    ]);

    if (error || !data) {
      toast.error('Feedback not found');
      setRow(null);
      setLoading(false);
      return;
    }

    const fb = data as ParentFeedback;
    setRow(fb);
    setNotes(fb.admin_notes || '');
    setStatus((fb.status as FeedbackStatus) || 'new');
    setEmail(fb.parent_email || '');
    setTags(fb.tags || []);
    setIds((allIds ?? []).map((r) => r.id));

    const { data: subs } = await supabase
      .from('subscriptions')
      .select('id, student_first_name, student_last_name, parent_email, email, programme_package');
    setLinked(matchSubscriptions(fb, (subs as LinkedSubscription[]) ?? []));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  const idx = ids.indexOf(id);
  const prevId = idx > 0 ? ids[idx - 1] : null;
  const nextId = idx >= 0 && idx < ids.length - 1 ? ids[idx + 1] : null;

  const goNeighbor = (neighborId: string | null) => {
    if (!neighborId) return;
    const q = listQuery ? `?${listQuery}` : '';
    router.push(`/admin/dashboard/parent-feedback/${neighborId}${q}`);
  };

  const persist = async (patch: Partial<ParentFeedback>) => {
    setSaving(true);
    const { error } = await supabase
      .from('parent_feedback')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id);
    setSaving(false);
    if (error) {
      toast.error(error.message || 'Could not save');
      return false;
    }
    setRow((prev) => (prev ? { ...prev, ...patch } : prev));
    return true;
  };

  const saveNotes = async () => {
    const ok = await persist({ admin_notes: notes.trim() || null });
    if (ok) toast.success('Notes saved');
  };

  const saveStatus = async (next: FeedbackStatus) => {
    setStatus(next);
    const ok = await persist({ status: next });
    if (ok) toast.success('Status updated');
  };

  const saveEmail = async () => {
    const ok = await persist({ parent_email: email.trim() || null });
    if (ok) toast.success('Email saved');
  };

  const saveTags = async (next: string[]) => {
    setTags(next);
    const ok = await persist({ tags: next });
    if (ok) toast.success('Tags updated');
  };

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setTagInput('');
      return;
    }
    saveTags([...tags, t]);
    setTagInput('');
  };

  const removeTag = (t: string) => saveTags(tags.filter((x) => x !== t));

  const copySummary = async () => {
    if (!row) return;
    try {
      await navigator.clipboard.writeText(buildSummaryText({ ...row, admin_notes: notes, status, tags, parent_email: email }));
      toast.success('Summary copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  const exportOne = () => {
    if (!row) return;
    downloadFeedbackCsv(
      [{ ...row, admin_notes: notes, status, tags, parent_email: email }],
      `SmartMathz_Feedback_${(row.parent_name || 'response').replace(/\s+/g, '_')}.csv`
    );
    toast.success('Exported');
  };

  const emailParent = () => {
    if (!email.trim()) {
      toast.error('Add a parent email first (survey did not collect one by default).');
      return;
    }
    const subject = encodeURIComponent('Following up on your SmartMathz feedback');
    const body = encodeURIComponent(
      `Hi ${row?.parent_name || 'there'},\n\nThank you for sharing your feedback with SmartMathz. We wanted to follow up on a few points from your survey.\n\nBest regards,\nSmartMathz Administration`
    );
    window.open(`mailto:${email.trim()}?subject=${subject}&body=${body}`, '_blank');
  };

  const confirmDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('parent_feedback').delete().eq('id', id);
    setDeleting(false);
    if (error) {
      toast.error('Could not delete');
      return;
    }
    toast.success('Response deleted');
    router.push(backHref);
  };

  const alerts = useMemo(() => {
    if (!row) return [] as string[];
    const items: string[] = [];
    if (wantsFollowUp(row)) items.push('Parent said Yes to a follow-up discussion.');
    if (typeof row.nps === 'number' && row.nps <= 6) items.push(`Low NPS: ${row.nps}/10`);
    lowTeachingScores(row).forEach((x) => items.push(`Low teaching score — ${x.label}: ${x.value}/5`));
    lowAdminScores(row).forEach((x) => items.push(`Low communication score — ${x.label}: ${x.value}/5`));
    return items;
  }, [row]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!row) {
    return (
      <div className="space-y-4">
        <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-[#123d35] cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Parent Feedback
        </Link>
        <p className="text-gray-500">This feedback response could not be found.</p>
      </div>
    );
  }

  const statusMeta = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  return (
    <div className="space-y-5 print:space-y-3 feedback-print-root">
      {/* Print-only branded header (matches SHSAT/recommendation report style) */}
      <div className="hidden print:block print:mb-4">
        <div
          className="rounded-none -mx-0 px-5 py-4 text-white"
          style={{ background: '#1a2e05' }}
        >
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="SmartMathz"
              className="w-12 h-12 object-contain bg-white rounded-lg p-1"
            />
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: '#a3d926' }}>
                SmartMathz
              </p>
              <h1 className="text-lg font-bold leading-tight text-white m-0">
                Parent Feedback Report
              </h1>
              <p className="text-[10px] m-0 mt-0.5" style={{ color: '#dce6c8' }}>
                Service satisfaction · Teaching quality · Communication
              </p>
            </div>
            <div className="text-right text-[9px] text-white/90">
              <p className="m-0">Generated</p>
              <p className="m-0 font-semibold">{new Date().toLocaleDateString('en-US')}</p>
            </div>
          </div>
        </div>
        <div className="h-1" style={{ background: '#7FB509' }} />
        <div
          className="mt-3 rounded-lg px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-2 text-[10pt]"
          style={{ background: '#f8faf5', border: '1px solid #e2e9e0' }}
        >
          <div>
            <span className="font-bold text-[#123d35]">Parent: </span>
            {row.parent_name || '—'}
          </div>
          <div>
            <span className="font-bold text-[#123d35]">Submitted: </span>
            {fmtDateTime(row.created_at)}
          </div>
          <div>
            <span className="font-bold text-[#123d35]">Students: </span>
            {(row.student_names ?? []).filter(Boolean).join(', ') || '—'}
          </div>
          <div>
            <span className="font-bold text-[#123d35]">Overall / NPS: </span>
            {row.overall || '—'} · {row.nps ?? '—'}
          </div>
          <div>
            <span className="font-bold text-[#123d35]">Tutoring: </span>
            {row.tutoring_quality || '—'}
          </div>
          <div className="col-span-2">
            <span className="font-bold text-[#123d35]">Subjects: </span>
            {(row.subjects ?? []).join(', ') || '—'}
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div className="flex flex-col gap-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#123d35] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to list
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!prevId}
              onClick={() => goNeighbor(prevId)}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-xs text-gray-400">
              {idx >= 0 ? idx + 1 : '—'} / {ids.length}
            </span>
            <button
              type="button"
              disabled={!nextId}
              onClick={() => goNeighbor(nextId)}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {row.parent_name || 'Anonymous parent'}
              </h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusMeta.color}`}>
                {statusMeta.label}
              </span>
              {wantsFollowUp(row) && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                  Follow-up Yes
                </span>
              )}
              {isLowRisk(row) && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 inline-flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Needs attention
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Submitted {fmtDateTime(row.created_at)}
              {saving ? ' · Saving…' : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={copySummary} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-gray-50">
              <Copy className="w-3.5 h-3.5" /> Copy summary
            </button>
            <button type="button" onClick={exportOne} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-gray-50">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-gray-50">
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button type="button" onClick={emailParent} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-gray-50">
              <Mail className="w-3.5 h-3.5" /> Email parent
            </button>
            <button type="button" onClick={() => setDeleteOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-red-100">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 print:hidden">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-900 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Attention
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-amber-950">
            {alerts.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          {wantsFollowUp(row) && (
            <p className="text-sm text-amber-950 mt-2">
              Contact reminder: reach out to <strong>{row.parent_name || 'this parent'}</strong>
              {email ? (
                <>
                  {' '}
                  at <strong>{email}</strong>
                </>
              ) : (
                <> (add their email below — the survey form did not require one)</>
              )}
              .
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 print:block">
        {/* Main columns */}
        <div className="xl:col-span-2 space-y-5 print:space-y-3">
          <Section title="1 · Your child">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Parent / guardian" value={row.parent_name} />
              <Field label="Email" value={row.parent_email} />
              <Field label="Student" value={(row.student_names ?? []).filter(Boolean).join(', ')} />
              <Field
                label="Subjects"
                value={[...(row.subjects ?? []), row.subject_other].filter(Boolean).join(', ')}
              />
            </div>
          </Section>

          <Section title="2 · Your experience">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tutoring quality" value={row.tutoring_quality} />
              <Field label="Learning progress" value={displayProgress(row)} />
              <Field label="Communication & support" value={row.communication_support} />
              <Field label="Overall satisfaction" value={row.overall} />
              <Field
                label="Recommend SmartMathz (NPS 0–10)"
                value={
                  row.nps == null
                    ? null
                    : `${row.nps}${row.nps <= 6 ? ' · Detractor / at risk' : row.nps >= 9 ? ' · Promoter' : ' · Passiveive'}`
                }
              />
            </div>
          </Section>

          <Section title="3 · Tell us more">
            <Field label="What’s working well?" value={displayWorksWell(row)} />
            <Field label="What’s one thing we could improve?" value={row.improve} />
            <Field label="May follow up" value={row.followup} />
            <Field label="Additional comments" value={row.additional} />
          </Section>

          {isLegacyResponse(row) && (
            <>
              <Section title="Legacy · Detailed teaching ratings">
                <RatingBars ratings={row.teaching_ratings} labels={TEACHING_LABELS} />
                <Field label="Child enjoys lessons" value={row.enjoy} />
                <Field label="Appreciate tutor" value={row.appreciate_tutor} />
              </Section>
              <Section title="Legacy · Communication ratings">
                <RatingBars ratings={row.admin_ratings} labels={ADMIN_LABELS} />
                <Field label="Admin responsiveness" value={row.responsiveness} />
                <Field label="Scheduling challenges" value={row.challenges} />
                <Field label="Challenge details" value={row.challenge_details} />
              </Section>
            </>
          )}
        </div>

        {/* Sidebar admin tools */}
        <div className="space-y-5 print:hidden">
          <Section title="Workflow status">
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => saveStatus(s.value)}
                  className={`text-xs font-semibold rounded-xl px-3 py-2 border cursor-pointer ${
                    status === s.value
                      ? 'border-[#123d35] bg-[#123d35] text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Parent email">
            <p className="text-xs text-gray-500 mb-2">
              Optional — store an email so you can follow up (survey submissions may not include one).
            </p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@email.com"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#7FB509]"
            />
            <button
              type="button"
              onClick={saveEmail}
              className="w-full rounded-xl bg-[#123d35] text-white text-xs font-semibold py-2 cursor-pointer hover:bg-[#1d6252]"
            >
              Save email
            </button>
          </Section>

          <Section title="Tags (tutor / subject)">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => removeTag(t)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#edf5e5] text-[#123d35] px-2 py-1 rounded-full cursor-pointer"
                  title="Click to remove"
                >
                  <Tag className="w-3 h-3" /> {t} ×
                </button>
              ))}
              {!tags.length && <p className="text-xs text-gray-400">No tags yet</p>}
            </div>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Add tag…"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7FB509]"
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="rounded-xl border border-gray-200 px-3 text-xs font-semibold cursor-pointer hover:bg-gray-50"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addTag(t)}
                  className="text-[10px] text-gray-500 border border-dashed border-gray-300 rounded-full px-2 py-0.5 cursor-pointer hover:border-[#123d35] hover:text-[#123d35]"
                >
                  + {t}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Internal admin notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="e.g. Followed up by email on Nov 14. Waiting on scheduling reply…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7FB509] resize-y"
            />
            <button
              type="button"
              onClick={saveNotes}
              className="w-full mt-2 rounded-xl bg-[#123d35] text-white text-xs font-semibold py-2 cursor-pointer hover:bg-[#1d6252]"
            >
              Save notes
            </button>
          </Section>

          <Section title="Linked enrollments">
            {linked.length === 0 ? (
              <p className="text-sm text-gray-400">
                No subscription matches found for these student/parent names.
              </p>
            ) : (
              <ul className="space-y-2">
                {linked.map((s) => (
                  <li key={s.id} className="rounded-xl border border-gray-100 p-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {s.student_first_name} {s.student_last_name}
                    </p>
                    <p className="text-xs text-gray-500">{s.programme_package || 'Enrollment'}</p>
                    <p className="text-xs text-gray-400">{s.parent_email || s.email || '—'}</p>
                    <Link
                      href={`/admin/dashboard/subscriptions?q=${encodeURIComponent(
                        `${s.student_first_name} ${s.student_last_name}`
                      )}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#123d35] mt-2 cursor-pointer hover:underline"
                    >
                      <Link2 className="w-3 h-3" /> Open in Subscriptions
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>

      {/* Print footer */}
      <div className="hidden print:block mt-6 pt-3 text-center text-[9pt]" style={{ borderTop: '1px solid #d5e0d4', color: '#62716c' }}>
        SmartMathz · www.smartmathz.com · Confidential parent feedback · INSPIRE. LEARN. ACHIEVE.
      </div>

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 print:hidden">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Delete this response?</h3>
            <p className="text-sm text-gray-500">
              This permanently removes feedback from <strong>{row.parent_name || 'this parent'}</strong>.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white disabled:opacity-60 cursor-pointer"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { margin: 12mm; }
              html, body { background: white !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .feedback-print-root { color: #1e2b28; }
              aside, header { display: none !important; }
            }
          `,
        }}
      />
    </div>
  );
}
