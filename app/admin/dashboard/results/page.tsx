// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import {
//   FaSearch, FaFilePdf, FaChevronDown, FaChevronUp,
//   FaTimes, FaEnvelope, FaStar,
// } from 'react-icons/fa';
// import { generateRecommendationPDF, getLearningCategory, getPackageRecommendation, StudentData } from '@/app/utils/generateRecommendation';

// // ── Helpers ──────────────────────────────────────────────────
// const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

// const getScoreBadge = (score: number) => {
//   if (score >= 91) return { label: 'Excellent',   cls: 'bg-green-100 text-green-800'  };
//   if (score >= 80) return { label: 'Strong',       cls: 'bg-[#e8f5c0] text-[#3a5a09]' };
//   if (score >= 50) return { label: 'Developing',   cls: 'bg-amber-100 text-amber-800' };
//   return               { label: 'Needs Support', cls: 'bg-red-100 text-red-800'    };
// };

// const CATEGORY_COLORS: Record<string, string> = {
//   WHIZZES:  'bg-green-100 text-green-800 border-green-300',
//   ACES:     'bg-emerald-100 text-emerald-800 border-emerald-300',
//   EXPLORERS:'bg-blue-100 text-blue-800 border-blue-300',
//   RISERS:   'bg-amber-100 text-amber-800 border-amber-300',
//   ADAPTERS: 'bg-purple-100 text-purple-800 border-purple-300',
// };

// // ── Component ────────────────────────────────────────────────
// export default function ResultsPage() {
//   const [students, setStudents]   = useState<StudentData[]>([]);
//   const [loading, setLoading]     = useState(true);
//   const [search, setSearch]       = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [gradeFilter, setGradeFilter] = useState('All');
//   const [categoryFilter, setCategoryFilter] = useState('All');
//   const [grades, setGrades]       = useState<string[]>([]);
//   const [sortCol, setSortCol]     = useState<keyof StudentData>('overall_score');
//   const [sortAsc, setSortAsc]     = useState(false);
//   const [page, setPage]           = useState(1);
//   const [selected, setSelected]   = useState<StudentData | null>(null);
//   const [instructorName, setInstructorName] = useState('Isaac Salako');
//   const searchTimer = useRef<NodeJS.Timeout | null>(null);
//   const PAGE_SIZE = 10;

//   useEffect(() => {
//     const load = async () => {
//       const { data, error } = await supabase
//         .from('leaderboard').select('*').order('overall_score', { ascending: false });
//       if (!error && data) {
//         setStudents(data);
//         setGrades([...new Set(data.map((d: StudentData) => d.grade))].sort() as string[]);
//       }
//       setLoading(false);
//     };
//     load();
//   }, []);

//   const handleSearchChange = (val: string) => {
//     setSearch(val);
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => { setDebouncedSearch(val); setPage(1); }, 300);
//   };

//   const handleSort = (col: keyof StudentData) => {
//     if (sortCol === col) setSortAsc(p => !p);
//     else { setSortCol(col); setSortAsc(false); }
//   };

//   const CATEGORIES = ['All', 'WHIZZES', 'ACES', 'EXPLORERS', 'RISERS', 'ADAPTERS'];

//   const filtered = students
//     .filter(s => gradeFilter === 'All' || s.grade === gradeFilter)
//     .filter(s => categoryFilter === 'All' || getLearningCategory(s.overall_score).name === categoryFilter)
//     .filter(s => !debouncedSearch ||
//       s.full_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
//       s.email.toLowerCase().includes(debouncedSearch.toLowerCase()))
//     .sort((a, b) => {
//       const av = (a[sortCol] ?? 0) as number;
//       const bv = (b[sortCol] ?? 0) as number;
//       return sortAsc ? av - bv : bv - av;
//     });

//   const pages    = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const SortIcon = ({ col }: { col: keyof StudentData }) =>
//     sortCol === col
//       ? (sortAsc ? <FaChevronUp size={9} className="inline ml-1" /> : <FaChevronDown size={9} className="inline ml-1" />)
//       : <span className="inline ml-1 opacity-30">↕</span>;

//   // Category stats
//   const categoryStats = ['WHIZZES','ACES','EXPLORERS','RISERS','ADAPTERS'].map(cat => ({
//     name: cat,
//     count: students.filter(s => getLearningCategory(s.overall_score).name === cat).length,
//   }));

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   return (
//     <div className="space-y-5">

//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Results & Recommendations</h1>
//         <p className="text-sm text-gray-500 mt-0.5">
//           View student results, learning categories, and generate personalised programme recommendations.
//         </p>
//       </div>

//       {/* ── Category distribution ── */}
//       <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
//         {categoryStats.map(({ name, count }) => {
//           const cls = CATEGORY_COLORS[name] ?? 'bg-gray-100 text-gray-700 border-gray-200';
//           return (
//             <button
//               key={name}
//               onClick={() => { setCategoryFilter(categoryFilter === name ? 'All' : name); setPage(1); }}
//               className={`border rounded-xl p-3 text-center cursor-pointer transition-all duration-150
//                 ${cls} ${categoryFilter === name ? 'ring-2 ring-offset-1 ring-[#7FB509] scale-[1.02]' : 'hover:scale-[1.01]'}`}
//             >
//               <p className="text-xs font-bold uppercase tracking-wide">{name}</p>
//               <p className="text-2xl font-extrabold mt-1">{count}</p>
//               <p className="text-[10px] opacity-70">students</p>
//             </button>
//           );
//         })}
//       </div>

//       {/* ── Filters ── */}
//       <div className="flex flex-wrap gap-3">
//         <div className="relative flex-1 min-w-[200px]">
//           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
//           <input type="text" value={search} onChange={e => handleSearchChange(e.target.value)}
//             placeholder="Search by name or email..."
//             className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
//                        focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]" />
//         </div>
//         <select value={gradeFilter} onChange={e => { setGradeFilter(e.target.value); setPage(1); }}
//           className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer focus:outline-none">
//           <option value="All">All Grades</option>
//           {grades.map(g => <option key={g} value={g}>{g}</option>)}
//         </select>
//         <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
//           className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer focus:outline-none">
//           {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
//         </select>
//         <span className="flex items-center text-xs text-gray-500 font-medium px-2">
//           {filtered.length} result{filtered.length !== 1 ? 's' : ''}
//         </span>
//       </div>

//       {/* ── Table ── */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-100">
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">#</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('full_name')}>
//                   Student <SortIcon col="full_name" />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Grade</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide cursor-pointer" onClick={() => handleSort('overall_score')}>
//                   Overall <SortIcon col="overall_score" />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell cursor-pointer" onClick={() => handleSort('math_score')}>
//                   Math <SortIcon col="math_score" />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell">ELA</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Science</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Category</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Package</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pageData.map((s, idx) => {
//                 const badge    = getScoreBadge(s.overall_score);
//                 const category = getLearningCategory(s.overall_score);
//                 const pkg      = getPackageRecommendation(s);
//                 const rank     = (page - 1) * PAGE_SIZE + idx + 1;
//                 const catCls   = CATEGORY_COLORS[category.name] ?? 'bg-gray-100 text-gray-700';

//                 return (
//                   <tr key={idx}
//                     className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
//                     onClick={() => setSelected(s)}>
//                     <td className="px-4 py-3 text-xs text-gray-400 font-medium">{rank}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2.5">
//                         <div className="w-8 h-8 rounded-full bg-[#e8f5c0] flex items-center justify-center text-xs font-bold text-[#3a5a09] flex-shrink-0">
//                           {s.full_name?.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900 text-xs">{s.full_name}</p>
//                           <p className="text-gray-400 text-[10px] truncate max-w-[130px]">{s.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.grade}</span>
//                     </td>
//                     <td className="px-4 py-3 font-bold text-gray-900">{Math.round(s.overall_score)}%</td>
//                     <td className="px-4 py-3 text-xs hidden md:table-cell">
//                       <span className={`font-semibold ${s.math_score >= 70 ? 'text-green-700' : 'text-red-600'}`}>
//                         {s.math_score}%
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-xs hidden md:table-cell">
//                       {s.ela_score != null
//                         ? <span className={`font-semibold ${s.ela_score >= 70 ? 'text-green-700' : 'text-red-600'}`}>{s.ela_score}%</span>
//                         : <span className="text-gray-400">—</span>}
//                     </td>
//                     <td className="px-4 py-3 text-xs hidden lg:table-cell">
//                       {s.science_score != null
//                         ? <span className={`font-semibold ${s.science_score >= 70 ? 'text-green-700' : 'text-red-600'}`}>{s.science_score}%</span>
//                         : <span className="text-gray-400">—</span>}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catCls}`}>
//                         {category.name}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
//                         {pkg.name.split('–')[0].trim()}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
//                       <button
//                         onClick={() => setSelected(s)}
//                         className="text-xs text-[#3a5a09] hover:text-[#7FB509] font-semibold px-2 py-1 rounded-lg hover:bg-green-50 transition-colors cursor-pointer flex items-center gap-1">
//                         <FaFilePdf size={11} /> Recommend
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//               {pageData.length === 0 && (
//                 <tr><td colSpan={10} className="text-center py-10 text-gray-400 text-sm">No results found</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
//           <p className="text-xs text-gray-400">
//             Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
//           </p>
//           <div className="flex gap-2">
//             <button disabled={page <= 1} onClick={() => setPage(p => p-1)}
//               className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed">
//               ← Prev
//             </button>
//             <span className="px-3 py-1.5 text-xs text-gray-500">Page {page}/{pages}</span>
//             <button disabled={page >= pages} onClick={() => setPage(p => p+1)}
//               className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed">
//               Next →
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Student Recommendation Modal ── */}
//       {selected && (() => {
//         const category = getLearningCategory(selected.overall_score);
//         const pkg      = getPackageRecommendation(selected);
//         const catCls   = CATEGORY_COLORS[category.name] ?? 'bg-gray-100 text-gray-700';

//         return (
//           <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
//             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

//               {/* Modal header */}
//               <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
//                 <div>
//                   <h2 className="text-lg font-bold text-gray-900">Recommendation Report</h2>
//                   <p className="text-xs text-gray-400 mt-0.5">{selected.full_name}</p>
//                 </div>
//                 <button onClick={() => setSelected(null)}
//                   className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400">
//                   <FaTimes size={14} />
//                 </button>
//               </div>

//               <div className="px-6 py-5 space-y-4">

//                 {/* Score summary */}
//                 <div className="grid grid-cols-4 gap-2">
//                   {[
//                     { label: 'Overall', val: selected.overall_score, color: '#3a5a09' },
//                     { label: 'Math',    val: selected.math_score,    color: '#4f46e5' },
//                     { label: 'ELA',     val: selected.ela_score ?? 0,color: '#059669' },
//                     { label: 'Science', val: selected.science_score ?? 0, color: '#d97706' },
//                   ].map(({ label, val, color }) => (
//                     <div key={label} className="text-center p-2 rounded-xl bg-gray-50">
//                       <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color }}>{label}</p>
//                       <p className="text-xl font-extrabold" style={{ color }}>{Math.round(val)}%</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Learning category */}
//                 <div className={`flex items-center gap-3 p-3 rounded-xl border ${catCls}`}>
//                   <FaStar size={14} />
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-wide">Learning Category</p>
//                     <p className="text-lg font-extrabold">{category.name}</p>
//                   </div>
//                 </div>

//                 {/* Package */}
//                 <div className="bg-[#e8f5c0] rounded-xl p-3">
//                   <p className="text-[10px] font-bold uppercase tracking-wide text-[#3a5a09] mb-1">Recommended Package</p>
//                   <p className="font-bold text-[#1a2e05] text-sm">{pkg.name}</p>
//                   <p className="text-xs text-[#3a5a09] mt-1">{pkg.totalHours}</p>
//                 </div>

//                 {/* Session schedule */}
//                 <div>
//                   <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Session Breakdown</p>
//                   <div className="space-y-1.5">
//                     {pkg.hours.map(({ subject, hours }) => (
//                       <div key={subject} className="flex justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
//                         <span className="font-semibold text-gray-700">{subject}</span>
//                         <span className="text-gray-500">{hours}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Instructor name */}
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
//                     Instructor Name (for PDF)
//                   </label>
//                   <input
//                     type="text"
//                     value={instructorName}
//                     onChange={e => setInstructorName(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]"
//                     placeholder="e.g. Isaac Salako"
//                   />
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3 pt-1">
//                   <button
//                     onClick={() => { generateRecommendationPDF(selected, instructorName); }}
//                     className="flex-1 py-3 bg-[#3a5a09] hover:bg-[#2d4707] text-white font-bold text-sm rounded-xl
//                                flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm hover:shadow-md">
//                     <FaFilePdf size={14} /> Download Recommendation
//                   </button>
//                 </div>

//                 <p className="text-[10px] text-gray-400 text-center">
//                   This is a confidential document intended for SmartMathz internal use only.
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       })()}
//     </div>
//   );
// }



'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  FaSearch, FaFilePdf, FaChevronDown, FaChevronUp,
  FaTimes, FaStar, FaLightbulb,
} from 'react-icons/fa';
import {
  generateRecommendationPDF,
  getLearningCategory,
  getSuggestedPackage,
  ALL_PACKAGES,
  StudentData,
  Package,
  PackageKey,
} from '@/app/utils/generateRecommendation';

// ── Helpers ──────────────────────────────────────────────────
const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

const getScoreBadge = (score: number) => {
  if (score >= 91) return { label: 'Excellent',   cls: 'bg-green-100 text-green-800'  };
  if (score >= 80) return { label: 'Strong',       cls: 'bg-[#e8f5c0] text-[#3a5a09]' };
  if (score >= 50) return { label: 'Developing',   cls: 'bg-amber-100 text-amber-800' };
  return               { label: 'Needs Support', cls: 'bg-red-100 text-red-800'    };
};

const CATEGORY_COLORS: Record<string, string> = {
  WHIZZES:   'bg-green-100 text-green-800 border-green-300',
  ACES:      'bg-emerald-100 text-emerald-800 border-emerald-300',
  EXPLORERS: 'bg-blue-100 text-blue-800 border-blue-300',
  RISERS:    'bg-amber-100 text-amber-800 border-amber-300',
  ADAPTERS:  'bg-purple-100 text-purple-800 border-purple-300',
};

// ── Component ────────────────────────────────────────────────
export default function ResultsPage() {
  const [students, setStudents]             = useState<StudentData[]>([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [gradeFilter, setGradeFilter]       = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [grades, setGrades]                 = useState<string[]>([]);
  const [sortCol, setSortCol]               = useState<keyof StudentData>('overall_score');
  const [sortAsc, setSortAsc]               = useState(false);
  const [page, setPage]                     = useState(1);
  const [selected, setSelected]             = useState<StudentData | null>(null);
  const [selectedPackageKey, setSelectedPackageKey] = useState<PackageKey>('package1');
  const [instructorName, setInstructorName] = useState('Isaac Salako');
  const searchTimer = useRef<NodeJS.Timeout | null>(null);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('leaderboard').select('*').order('overall_score', { ascending: false });
      if (!error && data) {
        setStudents(data);
        setGrades([...new Set(data.map((d: StudentData) => d.grade))].sort() as string[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  // When a student is selected, pre-fill with the suggested package
  const openModal = (s: StudentData) => {
    const suggested = getSuggestedPackage(s);
    setSelectedPackageKey(suggested.key);
    setSelected(s);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setDebouncedSearch(val); setPage(1); }, 300);
  };

  const handleSort = (col: keyof StudentData) => {
    if (sortCol === col) setSortAsc(p => !p);
    else { setSortCol(col); setSortAsc(false); }
  };

  const CATEGORIES = ['All', 'WHIZZES', 'ACES', 'EXPLORERS', 'RISERS', 'ADAPTERS'];

  const filtered = students
    .filter(s => gradeFilter === 'All' || s.grade === gradeFilter)
    .filter(s => categoryFilter === 'All' || getLearningCategory(s.overall_score).name === categoryFilter)
    .filter(s => !debouncedSearch ||
      s.full_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .sort((a, b) => {
      const av = (a[sortCol] ?? 0) as number;
      const bv = (b[sortCol] ?? 0) as number;
      return sortAsc ? av - bv : bv - av;
    });

  const pages    = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ col }: { col: keyof StudentData }) =>
    sortCol === col
      ? (sortAsc ? <FaChevronUp size={9} className="inline ml-1" /> : <FaChevronDown size={9} className="inline ml-1" />)
      : <span className="inline ml-1 opacity-30">↕</span>;

  const categoryStats = ['WHIZZES','ACES','EXPLORERS','RISERS','ADAPTERS'].map(cat => ({
    name: cat,
    count: students.filter(s => getLearningCategory(s.overall_score).name === cat).length,
  }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Results & Recommendations</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View student results, learning categories, and generate personalised programme recommendations.
        </p>
      </div>

      {/* ── Category distribution cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {categoryStats.map(({ name, count }) => {
          const cls = CATEGORY_COLORS[name] ?? 'bg-gray-100 text-gray-700 border-gray-200';
          return (
            <button
              key={name}
              onClick={() => { setCategoryFilter(categoryFilter === name ? 'All' : name); setPage(1); }}
              className={`border rounded-xl p-3 text-center cursor-pointer transition-all duration-150
                ${cls} ${categoryFilter === name ? 'ring-2 ring-offset-1 ring-[#7FB509] scale-[1.02]' : 'hover:scale-[1.01]'}`}
            >
              <p className="text-xs font-bold uppercase tracking-wide">{name}</p>
              <p className="text-2xl font-extrabold mt-1">{count}</p>
              <p className="text-[10px] opacity-70">students</p>
            </button>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          <input type="text" value={search} onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]" />
        </div>
        <select value={gradeFilter} onChange={e => { setGradeFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer focus:outline-none">
          <option value="All">All Grades</option>
          {grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer focus:outline-none">
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>
        <span className="flex items-center text-xs text-gray-500 font-medium px-2">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide cursor-pointer"
                  onClick={() => handleSort('full_name')}>
                  Student <SortIcon col="full_name" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide cursor-pointer"
                  onClick={() => handleSort('overall_score')}>
                  Overall <SortIcon col="overall_score" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell cursor-pointer"
                  onClick={() => handleSort('math_score')}>
                  Math <SortIcon col="math_score" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden md:table-cell">ELA</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Science</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Suggested</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((s, idx) => {
                const category  = getLearningCategory(s.overall_score);
                const suggested = getSuggestedPackage(s);
                const rank      = (page - 1) * PAGE_SIZE + idx + 1;
                const catCls    = CATEGORY_COLORS[category.name] ?? 'bg-gray-100 text-gray-700';

                return (
                  <tr key={idx}
                    className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => openModal(s)}>
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium">{rank}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e8f5c0] flex items-center justify-center
                                        text-xs font-bold text-[#3a5a09] flex-shrink-0">
                          {s.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{s.full_name}</p>
                          <p className="text-gray-400 text-[10px] truncate max-w-[130px]">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.grade}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{Math.round(s.overall_score)}%</td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      <span className={`font-semibold ${s.math_score >= 70 ? 'text-green-700' : 'text-red-600'}`}>
                        {s.math_score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      {s.ela_score != null
                        ? <span className={`font-semibold ${s.ela_score >= 70 ? 'text-green-700' : 'text-red-600'}`}>
                            {s.ela_score}%
                          </span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs hidden lg:table-cell">
                      {s.science_score != null
                        ? <span className={`font-semibold ${s.science_score >= 70 ? 'text-green-700' : 'text-red-600'}`}>
                            {s.science_score}%
                          </span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catCls}`}>
                        {category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {suggested.displayName.split('–')[0].trim()}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={e => { e.stopPropagation(); openModal(s); }}>
                      <button className="text-xs text-[#3a5a09] hover:text-[#7FB509] font-semibold px-2 py-1
                                         rounded-lg hover:bg-green-50 transition-colors cursor-pointer flex items-center gap-1">
                        <FaFilePdf size={11} /> Recommend
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-400 text-sm">No results found</td>
                </tr>
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
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg
                         disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed">
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-xs text-gray-500">Page {page}/{pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg
                         disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ── Recommendation Modal ── */}
      {selected && (() => {
        const category       = getLearningCategory(selected.overall_score);
        const suggested      = getSuggestedPackage(selected);
        const catCls         = CATEGORY_COLORS[category.name] ?? 'bg-gray-100 text-gray-700';
        const chosenPackage  = ALL_PACKAGES.find(p => p.key === selectedPackageKey) ?? suggested;
        const isSuggested    = selectedPackageKey === suggested.key;

        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Recommendation Report</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{selected.full_name}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full
                             hover:bg-gray-100 cursor-pointer text-gray-400">
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">

                {/* Score summary */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Overall', val: selected.overall_score,      color: '#3a5a09' },
                    { label: 'Math',    val: selected.math_score,          color: '#4f46e5' },
                    { label: 'ELA',     val: selected.ela_score ?? 0,      color: '#059669' },
                    { label: 'Science', val: selected.science_score ?? 0,  color: '#d97706' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="text-center p-2 rounded-xl bg-gray-50">
                      <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color }}>{label}</p>
                      <p className="text-xl font-extrabold" style={{ color }}>{Math.round(val)}%</p>
                    </div>
                  ))}
                </div>

                {/* Learning category */}
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${catCls}`}>
                  <FaStar size={14} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide">Learning Category</p>
                    <p className="text-lg font-extrabold">{category.name}</p>
                  </div>
                </div>

                {/* ── Suggested badge ── */}
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
                  <FaLightbulb className="text-indigo-500 flex-shrink-0" size={13} />
                  <div>
                    <p className="text-xs font-bold text-indigo-700">System Suggestion</p>
                    <p className="text-xs text-indigo-600">{suggested.displayName}</p>
                  </div>
                </div>

                {/* ── Package dropdown ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Select Programme Package
                  </label>
                  <select
                    value={selectedPackageKey}
                    onChange={e => setSelectedPackageKey(e.target.value as PackageKey)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                               focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                               cursor-pointer"
                  >
                    {ALL_PACKAGES.map(p => (
                      <option key={p.key} value={p.key}>
                        {p.displayName}{p.key === suggested.key ? ' ⭐ Suggested' : ''}
                      </option>
                    ))}
                  </select>
                  {!isSuggested && (
                    <p className="text-[10px] text-amber-600 mt-1 font-medium">
                      ⚠️ You have selected a different package from the system suggestion.
                    </p>
                  )}
                </div>

                {/* Chosen package preview */}
                <div className="bg-[#e8f5c0] rounded-xl p-3 border border-[#c8e46b]">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#3a5a09] mb-1">
                    Selected Package
                  </p>
                  <p className="font-bold text-[#1a2e05] text-sm">{chosenPackage.name}</p>
                  <p className="text-xs text-[#3a5a09] mt-1">{chosenPackage.totalHours}</p>
                </div>

                {/* Session breakdown */}
                <div>
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Session Breakdown</p>
                  <div className="space-y-1.5">
                    {chosenPackage.hours.map(({ subject, hours }) => (
                      <div key={subject}
                        className="flex justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                        <span className="font-semibold text-gray-700">{subject}</span>
                        <span className="text-gray-500">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructor name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Instructor Name (for PDF)
                  </label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={e => setInstructorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]"
                    placeholder="e.g. Isaac Salako"
                  />
                </div>

                {/* Download button */}
                <button
                  onClick={() => generateRecommendationPDF(selected, chosenPackage, instructorName)}
                  className="w-full py-3 bg-[#3a5a09] hover:bg-[#2d4707] text-white font-bold text-sm
                             rounded-xl flex items-center justify-center gap-2 cursor-pointer
                             transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
                  <FaFilePdf size={14} /> Download Recommendation PDF
                </button>

                <p className="text-[10px] text-gray-400 text-center">
                  Confidential — for SmartMathz internal use only.
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}