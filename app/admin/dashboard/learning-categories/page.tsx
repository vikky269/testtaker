'use client';

// app/admin/dashboard/learning-categories/page.tsx
// Interactive SmartMathz Learning Categories — pyramid + live student counts

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getLearningCategory } from '@/app/utils/reviewUtils';

// ── Category data ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name:        'WHIZZES',
    range:       '95–100%',
    // color:       '#7B2FBE',
    color:        "#165634",
    light:       '#F3E8FF',
    // border:      '#C084FC',
    border:      '#165634',
    description: 'Students who demonstrate exceptional ability across Mathematics, ELA, and Science. They quickly grasp complex concepts, think critically, and solve challenging problems with ease. These students often show advanced reasoning and may find grade-level material relatively straightforward.',
    icon:        '🏆',
    tip:         'Enrich with advanced challenges and extension tasks to sustain momentum.',
  },
  {
    name:        'ACES',
    range:       '80–94%',
    color:       '#1D4ED8',
    light:       '#EFF6FF',
    border:      '#93C5FD',
    description: 'Students who consistently perform very well across Mathematics, ELA, and Science. They have a strong understanding of core concepts and regularly achieve high scores through focus and consistent effort.',
    icon:        '🎯',
    tip:         'Encourage peer mentoring and independent problem-solving to solidify mastery.',
  },
  {
    name:        'EXPLORERS',
    range:       '61–79%',
    color:       '#90EE90',
    light:       '#F0FDF4',
    border:      '#86EFAC',
    description: 'Students who show strong curiosity and engagement across subjects. They ask thoughtful questions, participate actively, and enjoy exploring ideas beyond the standard curriculum, even if they do not always score at the top.',
    icon:        '🔍',
    tip:         'Channel curiosity with project-based learning and guided discovery tasks.',
  },
  {
    name:        'RISERS',
    range:       '31–60%',
    color:       '#FFEB00',
    light:       '#FFFBEB',
    border:      '#FCD34D',
    description: 'Students who are steadily improving in Mathematics, ELA, and Science. While they may not yet demonstrate advanced mastery, they show commitment, effort, and noticeable progress in their understanding and academic performance.',
    icon:        '📈',
    tip:         'Celebrate incremental wins and use targeted practice to close specific gaps.',
  },
  {
    name:        'ADAPTERS',
    range:       '0–30%',
    color:       '#FF69B4',
    light:       '#FFF1F2',
    border:      '#FDA4AF',
    description: 'Students who may initially struggle or show hesitation toward Mathematics, ELA, or Science but can improve significantly when exposed to the right learning strategies, practical examples, and supportive instruction.',
    icon:        '🌱',
    tip:         'Focus on foundational concepts with concrete examples and positive reinforcement.',
  },
];

// Pyramid tier widths — widest at bottom (ADAPTERS), narrowest at top (WHIZZES)
const TIER_WIDTHS = ['40%', '52%', '64%', '78%', '100%'];

// ── Student counts from leaderboard ──────────────────────────────────────────
interface Counts { [key: string]: number }

export default function LearningCategoriesPage() {
  const [counts, setCounts]           = useState<Counts>({});
  const [total, setTotal]             = useState(0);
  const [selected, setSelected]       = useState<typeof CATEGORIES[0] | null>(null);
  const [loading, setLoading]         = useState(true);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('overall_score');

      if (data) {
        const c: Counts = { WHIZZES: 0, ACES: 0, EXPLORERS: 0, RISERS: 0, ADAPTERS: 0 };
        data.forEach(row => {
          const cat = getLearningCategory(row.overall_score);
          c[cat.name] = (c[cat.name] ?? 0) + 1;
        });
        setCounts(c);
        setTotal(data.length);
      }
      setLoading(false);
    };
    load();
  }, []);

  const pct = (name: string) =>
    total > 0 ? Math.round(((counts[name] ?? 0) / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf4] to-[#f0f4e8] p-6">
      <div className="max-w-6xl">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7FB509] mb-1">
            SmartMathz Framework
          </p>
          <h1 className="text-3xl font-extrabold text-[#1a2e05] leading-tight">
            Learning Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Every learner. Every step. Every success.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ══════════════════════════════════════════════
              LEFT — Interactive Pyramid
          ══════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <div className="text-center mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Growth & Achievement
              </p>
              <div className="flex justify-center my-1">
                <div className="text-2xl" style={{ transform: 'rotate(-90deg)' }}>→</div>
              </div>
            </div>

            {/* Pyramid tiers — stacked, centred, narrowing toward top */}
            <div className="flex flex-col items-center gap-1 py-2">
              {CATEGORIES.map((cat, i) => {
                const isSelected = selected?.name === cat.name;
                const isHovered  = hoveredTier === cat.name;
                const count      = counts[cat.name] ?? 0;

                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelected(isSelected ? null : cat)}
                    onMouseEnter={() => setHoveredTier(cat.name)}
                    onMouseLeave={() => setHoveredTier(null)}
                    style={{
                      width: TIER_WIDTHS[i],
                      backgroundColor: (isSelected || isHovered) ? cat.color : cat.light,
                      borderColor: cat.border,
                      transform: isSelected ? 'scale(1.03)' : isHovered ? 'scale(1.015)' : 'scale(1)',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    className={`
                      relative flex items-center justify-between px-4 py-3 rounded-xl border-2
                      cursor-pointer shadow-sm
                      ${isSelected ? 'shadow-lg' : 'hover:shadow-md'}
                    `}
                  >
                    {/* Icon + name */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className={`text-sm font-extrabold tracking-wide
                        ${(isSelected || isHovered) ? 'text-white' : ''}`}
                        style={{ color: (isSelected || isHovered) ? '#fff' : cat.color }}>
                        {cat.name}
                      </span>
                    </div>

                    {/* Range + count */}
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold hidden sm:block
                        ${(isSelected || isHovered) ? 'text-white/70' : 'text-gray-400'}`}>
                        {cat.range}
                      </span>
                      {!loading && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                          ${(isSelected || isHovered)
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-gray-700 border border-gray-200'}`}>
                          {count} {count === 1 ? 'student' : 'students'}
                        </span>
                      )}
                    </div>

                    {/* Active indicator dot */}
                    {isSelected && (
                      <span className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2"
                        style={{ borderColor: cat.color }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tagline */}
            <div className="mt-5 bg-[#1a2e05]/5 rounded-2xl p-4 border border-[#1a2e05]/10">
              <div className="flex items-start gap-3">
                {/* <span className="text-xl flex-shrink-0">⭐</span> */}
                <p className="text-xs text-gray-600 leading-relaxed">
                  At SmartMathz, we meet every student where they are and help them grow to where they can be.
                  Every step up the pyramid is a step toward greater{' '}
                  <strong className="text-[#7FB509]">confidence</strong>,{' '}
                  <strong className="text-[#1D4ED8]">skills</strong>, and{' '}
                  <strong className="text-[#7B2FBE]">success</strong>!
                </p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT — Detail panel + distribution
          ══════════════════════════════════════════════ */}
          <div className="space-y-5">

            {/* Detail card — shown when a tier is selected */}
            {selected ? (
              <div
                className="rounded-3xl border-2 p-6 shadow-sm transition-all duration-300"
                style={{ backgroundColor: selected.light, borderColor: selected.border }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ backgroundColor: selected.color }}>
                      {selected.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: selected.color }}>
                        Learning Group
                      </p>
                      <h2 className="text-2xl font-extrabold" style={{ color: selected.color }}>
                        {selected.name}
                      </h2>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white cursor-pointer transition-colors">
                    ✕
                  </button>
                </div>

                {/* Score range badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-4"
                  style={{ backgroundColor: selected.color }}>
                  📊 Score Range: {selected.range}
                </div>

                {/* Student count */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/70 rounded-2xl px-4 py-3 text-center border"
                    style={{ borderColor: selected.border }}>
                    <p className="text-2xl font-extrabold" style={{ color: selected.color }}>
                      {counts[selected.name] ?? 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">current students</p>
                  </div>
                  <div className="bg-white/70 rounded-2xl px-4 py-3 text-center border"
                    style={{ borderColor: selected.border }}>
                    <p className="text-2xl font-extrabold" style={{ color: selected.color }}>
                      {pct(selected.name)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">of total</p>
                  </div>
                  <div className="flex-1 bg-white/70 rounded-2xl px-4 py-3 border"
                    style={{ borderColor: selected.border }}>
                    {/* Mini progress bar */}
                    <p className="text-xs text-gray-400 mb-1.5">Proportion</p>
                    <div className="h-2 rounded-full bg-white overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct(selected.name)}%`, backgroundColor: selected.color }} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {selected.description}
                </p>

                {/* Instructor tip */}
                <div className="bg-white/60 rounded-xl p-3 border"
                  style={{ borderColor: selected.border }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1"
                    style={{ color: selected.color }}>
                    💡 Instructor Tip
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">{selected.tip}</p>
                </div>
              </div>

            ) : (
              /* Placeholder when nothing selected */
              <div className="rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center bg-white">
                <p className="text-4xl mb-3">👆</p>
                <p className="text-sm font-semibold text-gray-600">
                  Click any tier on the pyramid to explore that learning group
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  See descriptions, student counts, and instructor tips
                </p>
              </div>
            )}

            {/* ── Distribution overview ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">Current Distribution</h3>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                  {total} total students
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {CATEGORIES.map(cat => {
                    const count = counts[cat.name] ?? 0;
                    const p     = pct(cat.name);
                    return (
                      <button key={cat.name}
                        onClick={() => setSelected(cat)}
                        className="w-full flex items-center gap-3 group cursor-pointer">
                        <span className="text-sm w-5 flex-shrink-0">{cat.icon}</span>
                        <span className="text-xs font-bold w-20 text-left flex-shrink-0"
                          style={{ color: cat.color }}>
                          {cat.name}
                        </span>
                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                            style={{
                              width: p > 0 ? `${Math.max(p, 8)}%` : '0%',
                              backgroundColor: cat.color,
                            }}>
                            {p >= 15 && (
                              <span className="text-white text-[10px] font-bold">{p}%</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-14 text-right flex-shrink-0">
                          {count} / {total}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}