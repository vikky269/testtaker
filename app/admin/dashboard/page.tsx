'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaUsers, FaChartBar, FaFileAlt, FaClock, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

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
}

interface Metrics {
  totalStudents: number;
  avgOverall: number;
  avgMath: number;
  avgEla: number;
  avgScience: number;
  topScore: number;
  topStudent: string;
  belowPass: number;       // scored < 50%
  totalTests: number;
}

const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

const getScoreBadge = (score: number) => {
  if (score >= 91) return { label: 'Excellent',   cls: 'bg-green-100 text-green-800'  };
  if (score >= 80) return { label: 'Strong',       cls: 'bg-[#e8f5c0] text-[#3a5a09]' };
  if (score >= 50) return { label: 'Developing',   cls: 'bg-amber-100 text-amber-800' };
  return               { label: 'Needs Support', cls: 'bg-red-100 text-red-800'    };
};

export default function AdminDashboard() {
  const [entries, setEntries]   = useState<LeaderboardEntry[]>([]);
  const [metrics, setMetrics]   = useState<Metrics | null>(null);
  const [loading, setLoading]   = useState(true);
  const [gradeFilter, setGradeFilter] = useState('All');
  const [grades, setGrades]     = useState<string[]>([]);

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
      avgOverall:    avg('overall_score'),
      avgMath:       avg('math_score'),
      avgEla:        avg('ela_score'),
      avgScience:    avg('science_score'),
      topScore:      Math.round(Math.max(...data.map(d => d.overall_score))),
      topStudent:    data[0]?.full_name ?? '—',
      belowPass:     data.filter(d => d.overall_score < 50).length,
      totalTests:    data.length,
    });
  };

  const filtered = gradeFilter === 'All' ? entries : entries.filter(e => e.grade === gradeFilter);

  // Grade distribution for bar chart
  const gradeDistribution = grades.map(g => ({
    grade: g,
    count: entries.filter(e => e.grade === g).length,
    avg:   Math.round(entries.filter(e => e.grade === g).reduce((a, d) => a + d.overall_score, 0) / (entries.filter(e => e.grade === g).length || 1)),
  }));

  const maxCount = Math.max(...gradeDistribution.map(d => d.count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">All student assessment data at a glance.</p>
        </div>
        <select
          value={gradeFilter}
          onChange={e => setGradeFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30"
        >
          <option value="All">All Grades</option>
          {grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* ── STAT CARDS ── */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: FaUsers,            label: 'Total Students',   val: metrics.totalStudents,     cls: 'text-indigo-600', bg: 'bg-indigo-50'  },
            { icon: FaChartBar,         label: 'Avg Overall Score', val: `${metrics.avgOverall}%`,  cls: 'text-[#3a5a09]', bg: 'bg-[#e8f5c0]' },
            { icon: FaTrophy,           label: 'Top Score',         val: `${metrics.topScore}%`,    cls: 'text-amber-600', bg: 'bg-amber-50'  },
            { icon: FaExclamationTriangle, label: 'Need Support',   val: metrics.belowPass,         cls: 'text-red-600',   bg: 'bg-red-50'    },
            // { icon: FaChartBar,         label: 'Avg Math',          val: `${metrics.avgMath}%`,     cls: 'text-blue-600',  bg: 'bg-blue-50'   },
            // { icon: FaChartBar,         label: 'Avg ELA',           val: `${metrics.avgEla}%`,      cls: 'text-emerald-600', bg: 'bg-emerald-50' },
            // { icon: FaChartBar,         label: 'Avg Science',       val: `${metrics.avgScience}%`,  cls: 'text-purple-600', bg: 'bg-purple-50' },
            // { icon: FaFileAlt,          label: 'Total Tests',       val: metrics.totalTests,        cls: 'text-gray-600',  bg: 'bg-gray-100'  },
          ].map(({ icon: Icon, label, val, cls, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:shadow-md transition-all">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={cls} size={16} />
              </div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{val}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Grade distribution bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm cursor-pointer hover:shadow-md transition-all">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Students by Grade</h3>
          <div className="space-y-2.5 cursor-pointer">
            {gradeDistribution.slice(0, 10).map(({ grade, count, avg }) => (
              <div key={grade} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20 truncate flex-shrink-0">{grade}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#7FB509] flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%`, minWidth: count > 0 ? '32px' : '0' }}
                  >
                    <span className="text-[10px] text-white font-bold">{count}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">{avg}% avg</span>
              </div>
            ))}
            {gradeDistribution.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No data</p>}
          </div>
        </div>

        {/* Score distribution donut-style */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm cursor-pointer hover:shadow-md transition-all">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Performance Distribution</h3>
          {(() => {
            const bands = [
              { label: 'Excellent (91–100%)',      count: filtered.filter(e => e.overall_score >= 91).length,                            color: '#22c55e'  },
              { label: 'Strong (80–90%)',           count: filtered.filter(e => e.overall_score >= 80 && e.overall_score < 91).length,   color: '#7FB509'  },
              { label: 'Developing (50–79%)',       count: filtered.filter(e => e.overall_score >= 50 && e.overall_score < 80).length,   color: '#f59e0b'  },
              { label: 'Needs Support (0–49%)',     count: filtered.filter(e => e.overall_score < 50).length,                            color: '#ef4444'  },
            ];
            const total = filtered.length || 1;
            return (
              <div className="space-y-3">
                {bands.map(({ label, count, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{label}</span>
                      <span className="font-semibold">{count} ({Math.round((count/total)*100)}%)</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(count/total)*100}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── SECTION AVERAGES ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-5">Section Score Averages</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Mathematics', color: '#4f46e5', bg: '#eef2ff',
              avg: Math.round(filtered.reduce((a,d) => a + (d.math_score||0), 0) / (filtered.length||1)) },
            { label: 'ELA',         color: '#059669', bg: '#ecfdf5',
              avg: Math.round(filtered.reduce((a,d) => a + (d.ela_score||0), 0) / (filtered.length||1)) },
            { label: 'Science',     color: '#d97706', bg: '#fffbeb',
              avg: Math.round(filtered.reduce((a,d) => a + (d.science_score||0), 0) / (filtered.length||1)) },
          ].map(({ label, color, bg, avg }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ backgroundColor: bg }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color }}>{label}</p>
              <p className="text-3xl font-extrabold" style={{ color }}>{avg}%</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/60 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${avg}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RECENT STUDENTS TABLE ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Recent Submissions</h3>
          <Link href="/admin/dashboard/students"
            className="text-xs text-[#7FB509] font-semibold hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Student</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Overall</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell">Math</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell">ELA</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Science</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Band</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 8).map((entry, idx) => {
                const badge = getScoreBadge(entry.overall_score);
                return (
                  <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    {/* Student info with avatar and date of submission */}
                     <td className='px-4 py-3  text-gray-600 text-xs hidden md:table-cell'>{entry.created_at && new Date(entry.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#e8f5c0] flex items-center justify-center text-[11px] font-bold text-[#3a5a09] flex-shrink-0">
                          {entry.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{entry.full_name}</p>
                          <p className="text-gray-400 text-[10px] truncate max-w-[120px]">{entry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{entry.grade}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 text-sm">{Math.round(entry.overall_score)}%</td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden md:table-cell">{entry.math_score}%</td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden md:table-cell">{entry.ela_score ?? '—'}{entry.ela_score ? '%' : ''}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden lg:table-cell">{entry.science_score ?? '—'}{entry.science_score ? '%' : ''}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{formatTime(entry.total_time)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-sm">No data found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}