'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { KpiCard, PageHeader, Panel, TrackBar, cardClass } from '../ui';

interface Entry {
  overall_score: number;
  math_score: number;
  ela_score: number | null;
  science_score: number | null;
  grade: string;
  total_time: number;
  created_at: string;
}

const avg = (arr: number[]) =>
  arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

export default function AnalyticsPage() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('leaderboard').select('*').then(({ data: rows, error }) => {
      if (!error && rows) setData(rows);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const grades = [...new Set(data.map((d) => d.grade))].sort();

  const gradeAvgs = grades.map((g) => {
    const group = data.filter((d) => d.grade === g);
    return {
      grade: g,
      overall: avg(group.map((d) => d.overall_score)),
      math: avg(group.map((d) => d.math_score)),
      ela: avg(group.map((d) => d.ela_score ?? 0)),
      science: avg(group.map((d) => d.science_score ?? 0)),
      count: group.length,
    };
  });

  const monthlyMap: Record<string, number> = {};
  data.forEach((d) => {
    const month = new Date(d.created_at).toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    });
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });
  const monthlyEntries = Object.entries(monthlyMap).slice(-6);
  const maxMonthly = Math.max(...monthlyEntries.map(([, v]) => v), 1);

  const scoreBuckets = [
    { range: '0–9%', count: data.filter((d) => d.overall_score < 10).length },
    { range: '10–19%', count: data.filter((d) => d.overall_score >= 10 && d.overall_score < 20).length },
    { range: '20–29%', count: data.filter((d) => d.overall_score >= 20 && d.overall_score < 30).length },
    { range: '30–39%', count: data.filter((d) => d.overall_score >= 30 && d.overall_score < 40).length },
    { range: '40–49%', count: data.filter((d) => d.overall_score >= 40 && d.overall_score < 50).length },
    { range: '50–59%', count: data.filter((d) => d.overall_score >= 50 && d.overall_score < 60).length },
    { range: '60–69%', count: data.filter((d) => d.overall_score >= 60 && d.overall_score < 70).length },
    { range: '70–79%', count: data.filter((d) => d.overall_score >= 70 && d.overall_score < 80).length },
    { range: '80–89%', count: data.filter((d) => d.overall_score >= 80 && d.overall_score < 90).length },
    { range: '90–100%', count: data.filter((d) => d.overall_score >= 90).length },
  ];
  const maxBucket = Math.max(...scoreBuckets.map((b) => b.count), 1);

  const getBucketColor = (range: string) => {
    const start = parseInt(range);
    if (start >= 80) return '#7FB509';
    if (start >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Performance trends and insights across all assessments."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Overall Avg" value={`${avg(data.map((d) => d.overall_score))}%`} color="#3a5a09" />
        <KpiCard label="Math Avg" value={`${avg(data.map((d) => d.math_score))}%`} color="#4f46e5" />
        <KpiCard label="ELA Avg" value={`${avg(data.map((d) => d.ela_score ?? 0))}%`} color="#059669" />
        <KpiCard
          label="Science Avg"
          value={`${avg(data.map((d) => d.science_score ?? 0))}%`}
          color="#d97706"
        />
      </div>

      <Panel title="Score Distribution" subtitle="How overall scores spread across students">
        <div className="flex items-end gap-2 h-44 px-1">
          {scoreBuckets.map(({ range, count }) => (
            <div key={range} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-semibold text-gray-500 h-3">
                {count > 0 ? count : ''}
              </span>
              <div
                className="w-full rounded-t-lg transition-all duration-700"
                style={{
                  height: `${(count / maxBucket) * 130}px`,
                  minHeight: count > 0 ? '4px' : '0',
                  background: `linear-gradient(180deg, ${getBucketColor(range)} 0%, ${getBucketColor(range)}cc 100%)`,
                  opacity: count === 0 ? 0.18 : 1,
                }}
              />
              <span className="text-[9px] text-gray-400 text-center leading-tight hidden sm:block">
                {range.split('–')[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-[#eef2ea]">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />
            &lt; 50%
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
            50–79%
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#7FB509] inline-block" />
            80%+
          </span>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Average Score by Grade" subtitle="Overall performance">
          <div className="space-y-3.5">
            {gradeAvgs.map(({ grade, overall, count }) => (
              <TrackBar
                key={grade}
                label={grade}
                right={`${overall}% · ${count}x`}
                value={overall}
                max={100}
                color={overall >= 80 ? '#7FB509' : overall >= 50 ? '#f59e0b' : '#ef4444'}
              />
            ))}
            {gradeAvgs.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No data</p>
            )}
          </div>
        </Panel>

        <Panel title="Submissions Over Time" subtitle="Last 6 months">
          {monthlyEntries.length > 0 ? (
            <div className="flex items-end gap-3 h-40">
              {monthlyEntries.map(([month, count]) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-500">{count}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#5f8a08] to-[#9fd12a] transition-all duration-700"
                    style={{
                      height: `${(count / maxMonthly) * 110}px`,
                      minHeight: '4px',
                    }}
                  />
                  <span className="text-[10px] text-gray-400 text-center">{month}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No submission data yet</p>
          )}
        </Panel>
      </div>

      <div className={`${cardClass} p-5`}>
        <h3 className="text-sm font-bold text-[#1a2e05] mb-1">Section Performance by Grade</h3>
        <p className="text-xs text-gray-400 mb-4">Math, ELA, and Science averages</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7faf5]">
                {['Grade', 'Students', 'Overall', 'Math', 'ELA', 'Science', 'Avg Time'].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gradeAvgs.map(({ grade, count, overall, math, ela, science }) => {
                const gradeData = data.filter((d) => d.grade === grade);
                const avgTime = Math.round(
                  gradeData.reduce((a, d) => a + d.total_time, 0) / (gradeData.length || 1)
                );
                return (
                  <tr key={grade} className="border-t border-[#eef2ea] hover:bg-[#f9fbf7]">
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] bg-[#f0f4ec] text-gray-600 px-2 py-0.5 rounded-lg font-medium">
                        {grade}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-600 font-medium">{count}</td>
                    {[overall, math, ela, science].map((val, i) => (
                      <td key={i} className="px-3 py-2.5">
                        <span
                          className={`text-xs font-bold ${
                            val >= 80
                              ? 'text-[#3a5a09]'
                              : val >= 50
                                ? 'text-amber-600'
                                : 'text-red-600'
                          }`}
                        >
                          {val}%
                        </span>
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-xs text-gray-400">
                      {Math.floor(avgTime / 60)}m {avgTime % 60}s
                    </td>
                  </tr>
                );
              })}
              {gradeAvgs.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                    No data available
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
