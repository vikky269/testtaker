'use client';

import type { SkillBreakdown, SkillDomainRow } from '@/app/utils/skillBreakdown';

function Ring({ percent, tone }: { percent: number; tone: 'math' | 'ela' | 'science' }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const color =
    tone === 'math' ? '#4f46e5' : tone === 'ela' ? '#059669' : '#d97706';
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e6edf7" strokeWidth="12" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${((c * percent) / 100).toFixed(1)} ${c.toFixed(1)}`}
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fill={color}
      >
        {percent}%
      </text>
    </svg>
  );
}

function bandClass(key: string) {
  if (key === 'strong') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (key === 'growing') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
}

function DomainList({
  title,
  rows,
}: {
  title: string;
  rows: SkillDomainRow[];
}) {
  if (!rows.length) return null;
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-neutral-500">
        {title}
      </h2>
      <ul className="space-y-3">
        {rows.map((d) => (
          <li
            key={`${d.subject}-${d.domain}`}
            className="rounded-2xl border border-neutral-100 bg-white px-4 py-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-neutral-800">{d.domain}</span>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${bandClass(d.band.key)}`}
              >
                {d.band.label}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-neutral-100"
              role="img"
              aria-label={`${d.correct} of ${d.total} correct`}
            >
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${d.percent}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs font-medium text-neutral-400">
              {d.correct} of {d.total} correct
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SkillResultsSummary({
  title,
  breakdown,
  onReview,
  onGoHome,
}: {
  title: string;
  breakdown: SkillBreakdown;
  onReview: () => void;
  onGoHome: () => void;
}) {
  const mathRows = breakdown.domains.filter((d) => d.subject === 'math');
  const elaRows = breakdown.domains.filter((d) => d.subject === 'ela');
  const scienceRows = breakdown.domains.filter((d) => d.subject === 'science');
  const perfect = breakdown.percent === 100;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">All done!</h1>
        <p className="mt-1 text-sm font-semibold text-neutral-400">{title}</p>
      </div>

      <div className="mb-5 rounded-2xl bg-indigo-600 px-6 py-6 text-center text-white shadow-md">
        <p className="text-4xl font-extrabold leading-none">
          {breakdown.correct}
          <span className="text-2xl font-bold text-indigo-200"> / {breakdown.total}</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-indigo-100">
          {breakdown.percent}% correct
        </p>
        {breakdown.unanswered > 0 ? (
          <p className="mt-1 text-xs text-indigo-200">
            {breakdown.unanswered} left blank
          </p>
        ) : null}
      </div>

      <div
        className={`mb-8 grid gap-3 ${
          breakdown.science ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
        }`}
      >
        {breakdown.math ? (
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
            <Ring percent={breakdown.math.percent} tone="math" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-500">
                Math
              </p>
              <p className="text-lg font-extrabold text-neutral-900">
                {breakdown.math.correct} / {breakdown.math.total}
              </p>
            </div>
          </div>
        ) : null}
        {breakdown.ela ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <Ring percent={breakdown.ela.percent} tone="ela" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">
                Reading and language
              </p>
              <p className="text-lg font-extrabold text-neutral-900">
                {breakdown.ela.correct} / {breakdown.ela.total}
              </p>
            </div>
          </div>
        ) : null}
        {breakdown.science ? (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <Ring percent={breakdown.science.percent} tone="science" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-500">
                Science
              </p>
              <p className="text-lg font-extrabold text-neutral-900">
                {breakdown.science.correct} / {breakdown.science.total}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <DomainList title="Math by skill area" rows={mathRows} />
      <DomainList title="Reading and language by skill area" rows={elaRows} />
      <DomainList title="Science by skill area" rows={scienceRows} />

      <p className="mb-8 text-center text-xs text-neutral-400">
        This short check-in shows how the student did on these questions. It is not a full
        diagnosis or placement evaluation.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onReview}
          className="rounded-full bg-emerald-500 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-600"
        >
          View detailed review
        </button>
        {perfect ? (
          <button
            type="button"
            onClick={onGoHome}
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700"
          >
            Back to Home
          </button>
        ) : null}
      </div>
    </div>
  );
}
