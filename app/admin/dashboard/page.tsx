'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaUsers, FaChartBar, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';
import { KpiCard, PageHeader, Panel, TrackBar, cardClass } from './ui';

interface LeaderboardEntry {
  id: string;
  full_name: string;
  email: string;
  grade: string;
  overall_score: number;
  math_score: number;
  ela_score: number | null;
  science_score: number | null;
  total_time: number;
  test_type: string;
  created_at: string;
  gender?: string;
}

interface Metrics {
  totalStudents: number;
  avgOverall: number;
  avgMath: number;
  avgEla: number;
  avgScience: number;
  topScore: number;
  topStudent: string;
  belowPass: number;
  totalTests: number;
}

const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

const getScoreBadge = (score: number) => {
  if (score >= 91) return { label: 'Excellent', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' };
  if (score >= 80) return { label: 'Strong', cls: 'bg-[#eef8d4] text-[#3a5a09] ring-1 ring-[#d8ec9a]' };
  if (score >= 50) return { label: 'Developing', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' };
  return { label: 'Needs Support', cls: 'bg-red-50 text-red-700 ring-1 ring-red-100' };
};

export default function AdminDashboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState('All');
  const [grades, setGrades] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setEntries(data);
        const uniqueGrades = [...new Set(data.map((d: LeaderboardEntry) => d.grade))].sort() as string[];
        setGrades(uniqueGrades);
        computeMetrics(data);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const computeMetrics = (data: LeaderboardEntry[]) => {
    if (!data.length) return;
    const avg = (key: keyof LeaderboardEntry) =>
      Math.round(data.reduce((a, d) => a + ((d[key] as number) || 0), 0) / data.length);

    setMetrics({
      totalStudents: data.length,
      avgOverall: avg('overall_score'),
      avgMath: avg('math_score'),
      avgEla: avg('ela_score'),
      avgScience: avg('science_score'),
      topScore: Math.round(Math.max(...data.map((d) => d.overall_score))),
      topStudent: data[0]?.full_name ?? '—',
      belowPass: data.filter((d) => d.overall_score < 50).length,
      totalTests: data.length,
    });
  };

  const filtered = gradeFilter === 'All' ? entries : entries.filter((e) => e.grade === gradeFilter);

  const gradeDistribution = grades.map((g) => ({
    grade: g,
    count: entries.filter((e) => e.grade === g).length,
    avg: Math.round(
      entries.filter((e) => e.grade === g).reduce((a, d) => a + d.overall_score, 0) /
        (entries.filter((e) => e.grade === g).length || 1)
    ),
  }));

  const maxCount = Math.max(...gradeDistribution.map((d) => d.count), 1);

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
        title="Dashboard Overview"
        subtitle="All student assessment data at a glance."
        action={
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="text-sm border border-[#e4ebe0] rounded-xl px-3 py-2 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7FB509]/25"
          >
            <option value="All">All Grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        }
      />

      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Students"
            value={metrics.totalStudents}
            color="#4f46e5"
            iconBg="bg-indigo-50"
            icon={<FaUsers className="text-indigo-600" size={15} />}
          />
          <KpiCard
            label="Avg Overall Score"
            value={`${metrics.avgOverall}%`}
            color="#3a5a09"
            iconBg="bg-[#e8f5c0]"
            icon={<FaChartBar className="text-[#3a5a09]" size={15} />}
          />
          <KpiCard
            label="Top Score"
            value={`${metrics.topScore}%`}
            color="#d97706"
            iconBg="bg-amber-50"
            icon={<FaTrophy className="text-amber-600" size={15} />}
          />
          <KpiCard
            label="Need Support"
            value={metrics.belowPass}
            sub="Scored below 50%"
            color="#dc2626"
            iconBg="bg-red-50"
            icon={<FaExclamationTriangle className="text-red-600" size={15} />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Students by Grade" subtitle="Headcount and average score">
          <div className="space-y-3.5">
            {gradeDistribution.slice(0, 10).map(({ grade, count, avg }) => (
              <div key={grade} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600 w-[4.5rem] truncate flex-shrink-0">
                  {grade}
                </span>
                <div className="flex-1 bg-[#eef2ea] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7FB509] to-[#9fd12a] transition-all duration-700"
                    style={{ width: `${(count / maxCount) * 100}%`, minWidth: count > 0 ? '8px' : '0' }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#1a2e05] w-6 text-right">{count}</span>
                <span className="text-[11px] text-gray-400 w-14 text-right">{avg}% avg</span>
              </div>
            ))}
            {gradeDistribution.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No data</p>
            )}
          </div>
        </Panel>

        <Panel title="Performance Distribution" subtitle="Based on overall score bands">
          {(() => {
            const bands = [
              { label: 'Excellent (91–100%)', count: filtered.filter((e) => e.overall_score >= 91).length, color: '#22c55e' },
              { label: 'Strong (80–90%)', count: filtered.filter((e) => e.overall_score >= 80 && e.overall_score < 91).length, color: '#7FB509' },
              { label: 'Developing (50–79%)', count: filtered.filter((e) => e.overall_score >= 50 && e.overall_score < 80).length, color: '#f59e0b' },
              { label: 'Needs Support (0–49%)', count: filtered.filter((e) => e.overall_score < 50).length, color: '#ef4444' },
            ];
            const total = filtered.length || 1;
            return (
              <div className="space-y-4">
                {bands.map(({ label, count, color }) => (
                  <TrackBar
                    key={label}
                    label={label}
                    right={`${count} · ${Math.round((count / total) * 100)}%`}
                    value={count}
                    max={total}
                    color={color}
                  />
                ))}
              </div>
            );
          })()}
        </Panel>
      </div>

      <Panel title="Section Score Averages" subtitle="Filtered by selected grade">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: 'Mathematics',
              color: '#4f46e5',
              bg: 'linear-gradient(180deg,#eef2ff 0%,#ffffff 100%)',
              avg: Math.round(filtered.reduce((a, d) => a + (d.math_score || 0), 0) / (filtered.length || 1)),
            },
            {
              label: 'ELA',
              color: '#059669',
              bg: 'linear-gradient(180deg,#ecfdf5 0%,#ffffff 100%)',
              avg: Math.round(filtered.reduce((a, d) => a + (d.ela_score || 0), 0) / (filtered.length || 1)),
            },
            {
              label: 'Science',
              color: '#d97706',
              bg: 'linear-gradient(180deg,#fffbeb 0%,#ffffff 100%)',
              avg: Math.round(filtered.reduce((a, d) => a + (d.science_score || 0), 0) / (filtered.length || 1)),
            },
          ].map(({ label, color, bg, avg }) => (
            <div
              key={label}
              className="rounded-2xl p-4 border border-[#eef2ea]"
              style={{ background: bg }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color }}>
                {label}
              </p>
              <p className="text-3xl font-extrabold tracking-tight" style={{ color }}>
                {avg}%
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-black/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${avg}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eef2ea]">
          <div>
            <h3 className="text-sm font-bold text-[#1a2e05]">Recent Submissions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest assessment results</p>
          </div>
          <Link
            href="/admin/dashboard/students"
            className="text-xs text-[#5f8a08] font-semibold hover:text-[#3a5a09] hover:underline cursor-pointer"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7faf5]">
                {['Date', 'Student', 'Grade', 'Gender', 'Overall', 'Math', 'ELA', 'Science', 'Time', 'Band'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider ${
                        i >= 5 && i <= 8 ? 'hidden md:table-cell' : ''
                      } ${i === 7 || i === 8 ? 'lg:table-cell' : ''} ${i === 0 ? 'hidden md:table-cell' : ''}`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 8).map((entry, idx) => {
                const badge = getScoreBadge(entry.overall_score);
                return (
                  <tr
                    key={entry.id || idx}
                    className="border-t border-[#eef2ea] hover:bg-[#f9fbf7] transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell whitespace-nowrap">
                      {entry.created_at && new Date(entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#e8f5c0] flex items-center justify-center text-[11px] font-bold text-[#3a5a09] flex-shrink-0">
                          {entry.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1a2e05] text-xs truncate">{entry.full_name}</p>
                          <p className="text-gray-400 text-[10px] truncate max-w-[140px]">{entry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] bg-[#f0f4ec] text-gray-600 px-2 py-0.5 rounded-lg font-medium">
                        {entry.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-gray-500">{entry.gender || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#1a2e05] text-sm">
                      {Math.round(entry.overall_score)}%
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden md:table-cell">{entry.math_score}%</td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden md:table-cell">
                      {entry.ela_score ?? '—'}
                      {entry.ela_score != null ? '%' : ''}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden lg:table-cell">
                      {entry.science_score ?? '—'}
                      {entry.science_score != null ? '%' : ''}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {formatTime(entry.total_time)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-400 text-sm">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
