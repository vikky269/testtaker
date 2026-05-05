'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaSearch, FaFilePdf, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Student {
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

const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

// ── Updated 5-band thresholds ────────────────────────────────
// WHIZZES 95–100% | ACES 80–94% | EXPLORERS 61–79% | RISERS 31–60% | ADAPTERS 0–30%
const getBand = (score: number) => {
  if (score >= 95) return { label: 'Excellent Mastery',          shortLabel: 'Whizzes',   cls: 'bg-green-800 text-white'         };
  if (score >= 80) return { label: 'Strong Performance',          shortLabel: 'Aces',      cls: 'bg-green-300 text-green-900'     };
  if (score >= 61) return { label: 'Developing Progress',         shortLabel: 'Explorers', cls: 'bg-green-100 text-green-800'     };
  if (score >= 31) return { label: 'Steady Progress',             shortLabel: 'Risers',    cls: 'bg-yellow-300 text-yellow-900'   };
  return               { label: 'Foundational Support Needed', shortLabel: 'Adapters',  cls: 'bg-pink-300 text-pink-900'       };
};

const getBandComment = (score: number) => {
  if (score >= 95) return 'The student demonstrates outstanding understanding and mastery of the subject. Concepts are applied accurately and confidently, with strong problem-solving skills. This performance reflects high academic potential, and we recommend enrichment activities to further challenge and sustain this level of excellence.';
  if (score >= 80) return 'The student shows a solid grasp of the subject matter and applies concepts effectively. Performance at this level reflects good study habits and growing confidence. Continued practice and exposure to slightly more challenging problems will help push performance toward excellence.';
  if (score >= 61) return 'The student demonstrates a fair understanding of the subject with noticeable strengths in some areas. While progress is evident, there are still concepts that need reinforcement. With regular practice and targeted support, the student is well-positioned to achieve stronger and more consistent results.';
  if (score >= 31) return 'The student is steadily improving and showing commitment to their learning. While mastery of core concepts is still developing, consistent effort and targeted practice will help build the skills needed to move into higher performance bands.';
  return 'The student is currently developing basic understanding of key concepts and requires significant support. This score indicates gaps in foundational skills, and we recommend focused revision, guided practice, and consistent tutoring sessions to help strengthen confidence and improve performance over time.';
};

// PDF color map — matches the band chart image colors exactly
const BAND_PDF_COLORS: Record<string, [number, number, number]> = {
  'Excellent Mastery':          [22, 101, 52],    // dark green  (WHIZZES)
  'Strong Performance':          [144, 238, 144],  // light green (ACES)
  'Developing Progress':         [220, 237, 200],  // very light green (EXPLORERS)
  'Steady Progress':             [255, 235, 0],    // yellow (RISERS)
  'Foundational Support Needed': [255, 105, 180],  // pink/magenta (ADAPTERS)
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [grades, setGrades]     = useState<string[]>([]);
  const [sortCol, setSortCol]   = useState<keyof Student>('overall_score');
  const [sortAsc, setSortAsc]   = useState(false);
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<Student | null>(null);
  const PAGE_SIZE = 12;
  const searchTimer = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('leaderboard').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setStudents(data);
        setGrades([...new Set(data.map((d: Student) => d.grade))].sort() as string[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setDebouncedSearch(val); setPage(1); }, 300);
  };

  const handleSort = (col: keyof Student) => {
    if (sortCol === col) setSortAsc(p => !p);
    else { setSortCol(col); setSortAsc(false); }
  };

  const filtered = students
    .filter(s => gradeFilter === 'All' || s.grade === gradeFilter)
    .filter(s => !debouncedSearch ||
      s.full_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .sort((a, b) => {
      const av = (a[sortCol] ?? '') as any;
      const bv = (b[sortCol] ?? '') as any;
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const pages    = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const SortIcon = ({ col }: { col: keyof Student }) =>
    sortCol === col
      ? (sortAsc ? <FaChevronUp size={9} className="inline ml-1"/> : <FaChevronDown size={9} className="inline ml-1"/>)
      : <span className="inline ml-1 opacity-30">↕</span>;

  // ── Generate PDF ──────────────────────────────────────────
  const generateStudentPDF = (s: Student) => {
    const doc      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW    = doc.internal.pageSize.getWidth();
    const pageH    = doc.internal.pageSize.getHeight();
    const margin   = 14;
    const contentW = pageW - margin * 2;

    // ── HEADER ────────────────────────────────────────────
    doc.setFillColor(22, 101, 52);
    doc.rect(0, 0, pageW, 36, 'F');
    try { doc.addImage('/logo.png', 'PNG', margin, 4, 28, 28); } catch {}
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15); doc.setFont('helvetica', 'bold');
    doc.text('SmartMathz', margin + 32, 14);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Evaluation Assessment Report', margin + 32, 20);
    doc.setFontSize(8);
    doc.text(
      `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      pageW - margin, 14, { align: 'right' }
    );

    // ── STUDENT INFO ──────────────────────────────────────
    let y = 44;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, y, contentW, 22, 2, 2, 'F');
    doc.setTextColor(22, 101, 52); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION', margin + 4, y + 6);
    doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    const col1x = margin + 4, col2x = pageW / 2 + 2;
    const testLabel = s.test_type === 'state-test' ? 'State Test' : s.test_type === 'quiz-assessment' ? 'Evaluation' : (s.test_type || 'Evaluation');

    doc.setFont('helvetica', 'bold');   doc.text('Name:',  col1x, y + 13);
    doc.setFont('helvetica', 'normal'); doc.text(s.full_name || 'Student', col1x + 18, y + 13);
    doc.setFont('helvetica', 'bold');   doc.text('Grade:', col2x, y + 13);
    doc.setFont('helvetica', 'normal'); doc.text(s.grade?.toUpperCase() || 'N/A', col2x + 18, y + 13);
    doc.setFont('helvetica', 'bold');   doc.text('Email:', col1x, y + 19);
    doc.setFont('helvetica', 'normal'); doc.text(s.email || 'N/A', col1x + 18, y + 19);
    doc.setFont('helvetica', 'bold');   doc.text('Test:',  col2x, y + 19);
    doc.setFont('helvetica', 'normal'); doc.text(testLabel, col2x + 14, y + 19);
    y += 28;

    // ── OVERALL PERFORMANCE ───────────────────────────────
    const band      = getBand(s.overall_score);
    const bandColor = BAND_PDF_COLORS[band.label] ?? [22, 101, 52];

    doc.setFillColor(...bandColor);
    doc.roundedRect(margin, y, 44, 28, 2, 2, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text(`${Math.round(s.overall_score)}%`, margin + 22, y + 14, { align: 'center' });
    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text('OVERALL SCORE', margin + 22, y + 20, { align: 'center' });

    const commentX = margin + 48, commentW = contentW - 48;
    doc.setTextColor(...bandColor);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(band.label, commentX, y + 7);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(getBandComment(s.overall_score), commentW).slice(0, 4), commentX, y + 13);
    y += 34;

    // ── TIME STRIP ────────────────────────────────────────
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin, y, contentW, 14, 2, 2, 'S');
    const timeItems = [
      { label: 'Total Time', val: formatTime(s.total_time) },
      { label: 'Test Type',  val: testLabel },
      { label: 'Grade',      val: s.grade || 'N/A' },
      { label: 'Date',       val: new Date(s.created_at).toLocaleDateString() },
    ];
    const colW = contentW / timeItems.length;
    timeItems.forEach(({ label, val }, i) => {
      const cx = margin + colW * i + colW / 2;
      doc.setTextColor(107, 114, 128); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
      doc.text(label.toUpperCase(), cx, y + 5, { align: 'center' });
      doc.setTextColor(17, 24, 39); doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
      doc.text(val, cx, y + 11, { align: 'center' });
    });
    y += 20;

    // ── SECTION BREAKDOWN TABLE ───────────────────────────
    doc.setTextColor(17, 24, 39); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('SECTION BREAKDOWN', margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Section', 'Score', 'Performance Band']],
      body: [
        ['Mathematics', `${s.math_score ?? 0}%`,                                               getBand(s.math_score ?? 0).label],
        ['ELA',         s.ela_score     != null ? `${s.ela_score}%`     : 'Skipped',           s.ela_score     != null ? getBand(s.ela_score).label     : 'Skipped'],
        ['Science',     s.science_score != null ? `${s.science_score}%` : 'N/A',               s.science_score != null ? getBand(s.science_score).label  : 'N/A'],
      ],
      theme: 'plain',
      headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', cellPadding: 3 },
      bodyStyles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 55 },
        1: { halign: 'center', cellWidth: 20 },
        2: { cellWidth: contentW - 75 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          const val = parseFloat(data.cell.raw as string);
          if (!isNaN(val)) {
            if (val >= 80)      data.cell.styles.textColor = [22, 101, 52];
            else if (val >= 61) data.cell.styles.textColor = [100, 150, 50];
            else if (val >= 31) data.cell.styles.textColor = [146, 64, 14];
            else                data.cell.styles.textColor = [153, 27, 27];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 6;

    // ── PERFORMANCE SCALE (5 bands, 2-row layout to prevent overflow) ──
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
    doc.text('PERFORMANCE SCALE', margin, y);
    y += 4;

    // 5 bands — render as 3 on top row, 2 on bottom row to avoid overflow
    const scaleBands: { range: string; label: string; color: [number, number, number] }[] = [
      { range: '95–100%', label: 'Excellent Mastery',          color: [22, 101, 52]   },  // dark green
      { range: '80–94%',  label: 'Strong Performance',          color: [144, 238, 144] },  // light green
      { range: '61–79%',  label: 'Developing Progress',         color: [220, 237, 200] },  // very light green
      { range: '31–60%',  label: 'Steady Progress',             color: [255, 235, 0]   },  // yellow
      { range: '0–30%',   label: 'Foundational Support Needed', color: [255, 105, 180] },  // pink
    ];

    // Row 1: first 3 bands
    const row1 = scaleBands.slice(0, 3);
    const bw3  = (contentW - 4) / 3;
    row1.forEach((b, i) => {
      const bx = margin + i * (bw3 + 2);
      doc.setFillColor(...b.color);
      doc.roundedRect(bx, y, bw3, 13, 1, 1, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7); doc.setFont('helvetica', 'bold');
      doc.text(b.range, bx + bw3 / 2, y + 5, { align: 'center' });
      doc.setFontSize(5.8); doc.setFont('helvetica', 'normal');
      doc.text(doc.splitTextToSize(b.label, bw3 - 4), bx + bw3 / 2, y + 9.5, { align: 'center' });
    });

    // Row 2: last 2 bands
    const row2 = scaleBands.slice(3);
    const bw2  = (contentW - 2) / 2;
    row2.forEach((b, i) => {
      const bx = margin + i * (bw2 + 2);
      doc.setFillColor(...b.color);
      doc.roundedRect(bx, y + 15, bw2, 13, 1, 1, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7); doc.setFont('helvetica', 'bold');
      doc.text(b.range, bx + bw2 / 2, y + 20, { align: 'center' });
      doc.setFontSize(5.8); doc.setFont('helvetica', 'normal');
      doc.text(doc.splitTextToSize(b.label, bw2 - 4), bx + bw2 / 2, y + 24.5, { align: 'center' });
    });

    y += 32;

    // ── RECOMMENDATIONS ───────────────────────────────────
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
    doc.text('RECOMMENDATIONS', margin, y);
    y += 4;

    doc.setFillColor(254, 252, 232);
    doc.roundedRect(margin, y, contentW, 22, 2, 2, 'F');
    doc.setDrawColor(234, 179, 8);
    doc.roundedRect(margin, y, contentW, 22, 2, 2, 'S');
    doc.setTextColor(92, 76, 3); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');

    const recs = [
      s.math_score    != null && s.math_score    < 61 ? '• Focus on strengthening foundational math skills through daily practice.'           : null,
      s.ela_score     != null && s.ela_score     < 61 ? '• Dedicate time to reading comprehension and vocabulary building.'                  : null,
      s.science_score != null && s.science_score < 61 ? '• Review core science concepts and practice application-based questions.'           : null,
      '• Schedule regular review sessions and attempt timed practice tests.',
      '• Consult with your SmartMathz tutor to build a personalised improvement plan.',
    ].filter(Boolean).join('\n');

    doc.text(doc.splitTextToSize(recs, contentW - 8).slice(0, 5), margin + 4, y + 6);

    // ── FOOTER ────────────────────────────────────────────
    doc.setFillColor(22, 101, 52);
    doc.rect(0, pageH - 12, pageW, 12, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text('Generated by SmartMathz  |  www.smartmathz.com', pageW / 2, pageH - 5, { align: 'center' });

    doc.save(`SmartMathz_${s.full_name.replace(/\s+/g, '_')}_Report.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Students</h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} student{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* ── Score band reference strip ── */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'WHIZZES 95–100%',   cls: 'bg-green-800 text-white'       },
          { label: 'ACES 80–94%',       cls: 'bg-green-300 text-green-900'   },
          { label: 'EXPLORERS 61–79%',  cls: 'bg-green-100 text-green-800'   },
          { label: 'RISERS 31–60%',     cls: 'bg-yellow-300 text-yellow-900' },
          { label: 'ADAPTERS 0–30%',    cls: 'bg-pink-300 text-pink-900'     },
        ].map(({ label, cls }) => (
          <span key={label} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          <input type="text" value={search} onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]" />
        </div>
        <select value={gradeFilter} onChange={e => { setGradeFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30">
          <option value="All">All Grades</option>
          {grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('full_name')}>
                  Student <SortIcon col="full_name" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('overall_score')}>
                  Overall <SortIcon col="overall_score" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell cursor-pointer" onClick={() => handleSort('math_score')}>
                  Math <SortIcon col="math_score" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell">ELA</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Science</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden lg:table-cell cursor-pointer" onClick={() => handleSort('total_time')}>
                  Time <SortIcon col="total_time" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Band</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">PDF</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((s, idx) => {
                const band = getBand(s.overall_score);
                const rank = (page-1)*PAGE_SIZE + idx + 1;
                return (
                  <tr key={idx}
                    className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelected(s)}>
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium">{rank}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e8f5c0] flex items-center justify-center text-xs font-bold text-[#3a5a09] flex-shrink-0">
                          {s.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{s.full_name}</p>
                          <p className="text-gray-400 text-[10px] truncate max-w-[140px]">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.grade}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{Math.round(s.overall_score)}%</td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      <span className={s.math_score >= 61 ? 'text-green-700 font-semibold' : 'text-red-500 font-semibold'}>
                        {s.math_score ?? '—'}{s.math_score != null ? '%' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      {s.ela_score != null
                        ? <span className={s.ela_score >= 61 ? 'text-green-700 font-semibold' : 'text-red-500 font-semibold'}>{s.ela_score}%</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs hidden lg:table-cell">
                      {s.science_score != null
                        ? <span className={s.science_score >= 61 ? 'text-green-700 font-semibold' : 'text-red-500 font-semibold'}>{s.science_score}%</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{formatTime(s.total_time)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${band.cls}`}>
                        {band.shortLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={e => { e.stopPropagation(); generateStudentPDF(s); }}>
                      <button className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold
                                         cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
                        <FaFilePdf size={12} /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pageData.length === 0 && (
                <tr><td colSpan={10} className="text-center py-10 text-gray-400 text-sm">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg
                         disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed">
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-xs text-gray-500">Page {page}/{pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(p => p+1)}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg
                         disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ── Student Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Student Details</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400">
                <FaTimes size={14} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">

              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#e8f5c0] flex items-center justify-center text-xl font-bold text-[#3a5a09]">
                  {selected.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{selected.full_name}</p>
                  <p className="text-sm text-gray-400">{selected.email}</p>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{selected.grade}</span>
                </div>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Overall', val: `${Math.round(selected.overall_score)}%`, color: '#3a5a09', bg: '#e8f5c0' },
                  { label: 'Math',    val: `${selected.math_score ?? 0}%`,            color: '#4f46e5', bg: '#eef2ff' },
                  { label: 'ELA',     val: selected.ela_score != null ? `${selected.ela_score}%` : 'Skipped', color: '#059669', bg: '#ecfdf5' },
                  { label: 'Science', val: selected.science_score != null ? `${selected.science_score}%` : 'N/A', color: '#d97706', bg: '#fffbeb' },
                ].map(({ label, val, color, bg }) => (
                  <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: bg }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{label}</p>
                    <p className="text-2xl font-extrabold" style={{ color }}>{val}</p>
                  </div>
                ))}
              </div>

              {/* Band indicator */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${getBand(selected.overall_score).cls}`}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">Performance Band</p>
                  <p className="font-extrabold text-sm">{getBand(selected.overall_score).label}</p>
                </div>
                <span className="ml-auto text-2xl font-extrabold">{Math.round(selected.overall_score)}%</span>
              </div>

              {/* Meta */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {[
                  { label: 'Time taken', val: formatTime(selected.total_time) },
                  { label: 'Test type',  val: selected.test_type },
                  { label: 'Submitted',  val: new Date(selected.created_at).toLocaleDateString() },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">{label}</span>
                    <span className="font-semibold text-gray-900">{val}</span>
                  </div>
                ))}
              </div>

              {/* Download */}
              <button
                onClick={() => { generateStudentPDF(selected); setSelected(null); }}
                className="w-full py-3 bg-[#3a5a09] hover:bg-[#2d4707] text-white font-bold text-sm rounded-xl
                           flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm hover:shadow-md">
                <FaFilePdf size={14} /> Download Assessment Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}