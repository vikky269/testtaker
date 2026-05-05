// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import {
//   FaSearch, FaFilePdf, FaChevronDown, FaChevronUp,
//   FaTimes, FaStar, FaLightbulb, FaPlus, FaTrash,
// } from 'react-icons/fa';
// import {
//   generateRecommendationPDF,
//   getLearningCategory,
//   getSuggestedPackage,
//   ALL_PACKAGES,
//   CUSTOM_SUBJECT_OPTIONS,
//   buildCustomPackage,
//   StudentData,
//   Package,
//   PackageKey,
//   PackageHourEntry,
// } from '@/app/utils/generateRecommendation';

// // ── Helpers ──────────────────────────────────────────────────
// const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

// // Updated to match new thresholds: 95/80/61/31
// const getScoreBadge = (score: number) => {
//   if (score >= 95) return { label: 'Excellent',     cls: 'bg-green-100 text-green-800'  };
//   if (score >= 80) return { label: 'Strong',        cls: 'bg-[#e8f5c0] text-[#3a5a09]' };
//   if (score >= 61) return { label: 'Developing',    cls: 'bg-blue-100 text-blue-800'   };
//   if (score >= 31) return { label: 'Rising',        cls: 'bg-amber-100 text-amber-800' };
//   return               { label: 'Needs Support', cls: 'bg-red-100 text-red-800'    };
// };

// const CATEGORY_COLORS: Record<string, string> = {
//   WHIZZES:   'bg-green-100 text-green-800 border-green-300',
//   ACES:      'bg-emerald-100 text-emerald-800 border-emerald-300',
//   EXPLORERS: 'bg-blue-100 text-blue-800 border-blue-300',
//   RISERS:    'bg-amber-100 text-amber-800 border-amber-300',
//   ADAPTERS:  'bg-purple-100 text-purple-800 border-purple-300',
// };

// // ── Component ────────────────────────────────────────────────
// export default function ResultsPage() {
//   const [students, setStudents]             = useState<StudentData[]>([]);
//   const [loading, setLoading]               = useState(true);
//   const [search, setSearch]                 = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [gradeFilter, setGradeFilter]       = useState('All');
//   const [categoryFilter, setCategoryFilter] = useState('All');
//   const [grades, setGrades]                 = useState<string[]>([]);
//   const [sortCol, setSortCol]               = useState<keyof StudentData>('overall_score');
//   const [sortAsc, setSortAsc]               = useState(false);
//   const [page, setPage]                     = useState(1);
//   const [selected, setSelected]             = useState<StudentData | null>(null);
//   const [selectedPackageKey, setSelectedPackageKey] = useState<PackageKey>('package1');
//   const [instructorName, setInstructorName] = useState('Isaac Salako');

//   // Custom package state
//   const [customSelections, setCustomSelections] = useState<PackageHourEntry[]>([
//     { subject: 'Mathematics', hours: '2 hours per week (1-hour sessions twice weekly)' },
//   ]);

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

//   const openModal = (s: StudentData) => {
//     const suggested = getSuggestedPackage(s);
//     setSelectedPackageKey(suggested.key);
//     setSelected(s);
//   };

//   const handleSearchChange = (val: string) => {
//     setSearch(val);
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => { setDebouncedSearch(val); setPage(1); }, 300);
//   };

//   const handleSort = (col: keyof StudentData) => {
//     if (sortCol === col) setSortAsc(p => !p);
//     else { setSortCol(col); setSortAsc(false); }
//   };

//   // ── Custom package helpers ────────────────────────────────
//   const addCustomSubject = () => {
//     const used = customSelections.map(s => s.subject);
//     const next = CUSTOM_SUBJECT_OPTIONS.find(o => !used.includes(o.label));
//     if (!next) return;
//     setCustomSelections(prev => [...prev, { subject: next.label, hours: next.defaultHours }]);
//   };

//   const removeCustomSubject = (idx: number) => {
//     setCustomSelections(prev => prev.filter((_, i) => i !== idx));
//   };

//   const updateCustomSubject = (idx: number, field: 'subject' | 'hours', value: string) => {
//     setCustomSelections(prev => prev.map((item, i) => {
//       if (i !== idx) return item;
//       if (field === 'subject') {
//         const defaultHours = CUSTOM_SUBJECT_OPTIONS.find(o => o.label === value)?.defaultHours ?? '1 hour per week';
//         return { subject: value, hours: defaultHours };
//       }
//       return { ...item, hours: value };
//     }));
//   };

//   const usedSubjects = customSelections.map(s => s.subject);
//   const availableToAdd = CUSTOM_SUBJECT_OPTIONS.filter(o => !usedSubjects.includes(o.label));

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

//       {/* ── Category distribution cards ── */}
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

//       {/* ── Score thresholds reference strip ── */}
//       <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
//         {[
//           { label: 'WHIZZES 95–100%',   cls: 'bg-green-100 text-green-800'    },
//           { label: 'ACES 80–94%',       cls: 'bg-emerald-100 text-emerald-800' },
//           { label: 'EXPLORERS 61–79%',  cls: 'bg-blue-100 text-blue-800'      },
//           { label: 'RISERS 31–60%',     cls: 'bg-amber-100 text-amber-800'    },
//           { label: 'ADAPTERS 0–30%',    cls: 'bg-purple-100 text-purple-800'  },
//         ].map(({ label, cls }) => (
//           <span key={label} className={`px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>
//         ))}
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
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Suggested</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pageData.map((s, idx) => {
//                 const category  = getLearningCategory(s.overall_score);
//                 const suggested = getSuggestedPackage(s);
//                 const rank      = (page - 1) * PAGE_SIZE + idx + 1;
//                 const catCls    = CATEGORY_COLORS[category.name] ?? 'bg-gray-100 text-gray-700';
//                 const badge     = getScoreBadge(s.overall_score);

//                 return (
//                   <tr key={idx}
//                     className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
//                     onClick={() => openModal(s)}>
//                     <td className="px-4 py-3 text-xs text-gray-400 font-medium">{rank}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2.5">
//                         <div className="w-8 h-8 rounded-full bg-[#e8f5c0] flex items-center justify-center
//                                         text-xs font-bold text-[#3a5a09] flex-shrink-0">
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
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-1.5">
//                         <span className="font-bold text-gray-900">{Math.round(s.overall_score)}%</span>
//                         <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-xs hidden md:table-cell">
//                       <span className={`font-semibold ${s.math_score >= 61 ? 'text-green-700' : 'text-red-600'}`}>{s.math_score}%</span>
//                     </td>
//                     <td className="px-4 py-3 text-xs hidden md:table-cell">
//                       {s.ela_score != null
//                         ? <span className={`font-semibold ${s.ela_score >= 61 ? 'text-green-700' : 'text-red-600'}`}>{s.ela_score}%</span>
//                         : <span className="text-gray-400">—</span>}
//                     </td>
//                     <td className="px-4 py-3 text-xs hidden lg:table-cell">
//                       {s.science_score != null
//                         ? <span className={`font-semibold ${s.science_score >= 61 ? 'text-green-700' : 'text-red-600'}`}>{s.science_score}%</span>
//                         : <span className="text-gray-400">—</span>}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catCls}`}>{category.name}</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
//                         {suggested.displayName.split('–')[0].trim()}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3" onClick={e => { e.stopPropagation(); openModal(s); }}>
//                       <button className="text-xs text-[#3a5a09] hover:text-[#7FB509] font-semibold px-2 py-1
//                                          rounded-lg hover:bg-green-50 transition-colors cursor-pointer flex items-center gap-1">
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
//             <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
//               className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg
//                          disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed">
//               ← Prev
//             </button>
//             <span className="px-3 py-1.5 text-xs text-gray-500">Page {page}/{pages}</span>
//             <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
//               className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg
//                          disabled:opacity-40 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed">
//               Next →
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Recommendation Modal ── */}
//       {selected && (() => {
//         const category      = getLearningCategory(selected.overall_score);
//         const suggested     = getSuggestedPackage(selected);
//         const catCls        = CATEGORY_COLORS[category.name] ?? 'bg-gray-100 text-gray-700';
//         const isCustom      = selectedPackageKey === 'custom';
//         const chosenPackage = isCustom
//           ? buildCustomPackage(customSelections)
//           : (ALL_PACKAGES.find(p => p.key === selectedPackageKey) ?? suggested);
//         const isSuggested   = selectedPackageKey === suggested.key;

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
//                     { label: 'Overall', val: selected.overall_score,     color: '#3a5a09' },
//                     { label: 'Math',    val: selected.math_score,         color: '#4f46e5' },
//                     { label: 'ELA',     val: selected.ela_score ?? 0,     color: '#059669' },
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

//                 {/* Suggested badge */}
//                 <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
//                   <FaLightbulb className="text-indigo-500 flex-shrink-0" size={13} />
//                   <div>
//                     <p className="text-xs font-bold text-indigo-700">System Suggestion</p>
//                     <p className="text-xs text-indigo-600">{suggested.displayName}</p>
//                   </div>
//                 </div>

//                 {/* Package dropdown */}
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
//                     Select Programme Package
//                   </label>
//                   <select
//                     value={selectedPackageKey}
//                     onChange={e => setSelectedPackageKey(e.target.value as PackageKey)}
//                     className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
//                                focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509] cursor-pointer"
//                   >
//                     {ALL_PACKAGES.filter(p => p.key !== 'custom').map(p => (
//                       <option key={p.key} value={p.key}>
//                         {p.displayName}{p.key === suggested.key ? ' ⭐ Suggested' : ''}
//                       </option>
//                     ))}
//                     <option value="custom">✏️ Custom Package – Tailored</option>
//                   </select>
//                   {!isSuggested && !isCustom && (
//                     <p className="text-[10px] text-amber-600 mt-1 font-medium">
//                       ⚠️ You have selected a different package from the system suggestion.
//                     </p>
//                   )}
//                 </div>

//                 {/* ── Custom package builder ── */}
//                 {isCustom && (
//                   <div className="border border-dashed border-indigo-300 rounded-xl p-4 bg-indigo-50/40 space-y-3">
//                     <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
//                       ✏️ Build Custom Package
//                     </p>

//                     {customSelections.map((sel, idx) => (
//                       <div key={idx} className="flex gap-2 items-start">
//                         {/* Subject dropdown */}
//                         <div className="flex-1">
//                           <select
//                             value={sel.subject}
//                             onChange={e => updateCustomSubject(idx, 'subject', e.target.value)}
//                             className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg bg-white
//                                        focus:outline-none focus:ring-1 focus:ring-[#7FB509] cursor-pointer"
//                           >
//                             {/* Show current selection + any not yet used */}
//                             {CUSTOM_SUBJECT_OPTIONS
//                               .filter(o => o.label === sel.subject || !usedSubjects.includes(o.label))
//                               .map(o => (
//                                 <option key={o.label} value={o.label}>{o.label}</option>
//                               ))}
//                           </select>
//                         </div>

//                         {/* Hours input */}
//                         <div className="flex-1">
//                           {sel.subject === 'Virtual Library' ? (
//                             <input
//                               type="text"
//                               value={sel.hours}
//                               disabled
//                               className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-400"
//                             />
//                           ) : (
//                             <select
//                               value={sel.hours}
//                               onChange={e => updateCustomSubject(idx, 'hours', e.target.value)}
//                               className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg bg-white
//                                          focus:outline-none focus:ring-1 focus:ring-[#7FB509] cursor-pointer"
//                             >
//                               {[
//                                 '1 hour per week',
//                                 '2 hours per week (1-hour sessions twice weekly)',
//                                 '2 hours per week',
//                                 '3 hours per week',
//                                 '4 hours per week',
//                               ].map(h => <option key={h} value={h}>{h}</option>)}
//                             </select>
//                           )}
//                         </div>

//                         {/* Remove button */}
//                         <button
//                           onClick={() => removeCustomSubject(idx)}
//                           disabled={customSelections.length === 1}
//                           className="mt-1 text-red-400 hover:text-red-600 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
//                         >
//                           <FaTrash size={11} />
//                         </button>
//                       </div>
//                     ))}

//                     {/* Add subject button */}
//                     {availableToAdd.length > 0 && (
//                       <button
//                         onClick={addCustomSubject}
//                         className="w-full py-2 border border-dashed border-indigo-300 rounded-lg text-xs
//                                    font-semibold text-indigo-600 hover:bg-indigo-50 cursor-pointer flex items-center justify-center gap-1.5"
//                       >
//                         <FaPlus size={9} /> Add Subject
//                       </button>
//                     )}

//                     {/* Preview total */}
//                     <div className="bg-white rounded-lg px-3 py-2 border border-indigo-100 flex justify-between items-center">
//                       <span className="text-xs font-bold text-gray-600">Total:</span>
//                       <span className="text-xs font-extrabold text-indigo-700">{buildCustomPackage(customSelections).totalHours}</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Non-custom package preview */}
//                 {!isCustom && (
//                   <div className="bg-[#e8f5c0] rounded-xl p-3 border border-[#c8e46b]">
//                     <p className="text-[10px] font-bold uppercase tracking-wide text-[#3a5a09] mb-1">Selected Package</p>
//                     <p className="font-bold text-[#1a2e05] text-sm">{chosenPackage.name}</p>
//                     <p className="text-xs text-[#3a5a09] mt-1">{chosenPackage.totalHours}</p>
//                   </div>
//                 )}

//                 {/* Session breakdown (non-custom only — custom shows inline above) */}
//                 {!isCustom && (
//                   <div>
//                     <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Session Breakdown</p>
//                     <div className="space-y-1.5">
//                       {chosenPackage.hours.map(({ subject, hours }) => (
//                         <div key={subject} className="flex justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
//                           <span className="font-semibold text-gray-700">{subject}</span>
//                           <span className="text-gray-500">{hours}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Instructor name */}
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
//                     Instructor Name (for PDF)
//                   </label>
//                   <input
//                     type="text"
//                     value={instructorName}
//                     onChange={e => setInstructorName(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl
//                                focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]"
//                     placeholder="e.g. Isaac Salako"
//                   />
//                 </div>

//                 {/* Download button */}
//                 <button
//                   onClick={() => generateRecommendationPDF(selected, chosenPackage, instructorName)}
//                   className="w-full py-3 bg-[#3a5a09] hover:bg-[#2d4707] text-white font-bold text-sm
//                              rounded-xl flex items-center justify-center gap-2 cursor-pointer
//                              transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
//                   <FaFilePdf size={14} /> Download Recommendation PDF
//                 </button>

//                 <p className="text-[10px] text-gray-400 text-center">
//                   Confidential — for SmartMathz internal use only.
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

// app/admin/dashboard/results/page.tsx
// Admin Results & Recommendations page
// — Updated scoring bands: WHIZZES 95–100, ACES 80–94, EXPLORERS 61–79, RISERS 31–60, ADAPTERS 0–30
// — Custom Package: admin selects subjects + hours per week, reflected in PDF

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getLearningCategory, LEARNING_CATEGORIES, type LearningCategory } from '@/app/utils/reviewUtils';
import {
  PACKAGES, CUSTOM_PACKAGE_SUBJECTS, getSuggestedPackage,
  generateRecommendationPDF,
  type PackageOption, type CustomPackageSubject,
} from '@/app/utils/generateRecommendation';

interface StudentResult {
  id?: string;
  full_name: string;
  email: string;
  grade: string;
  gender?: string;
  math_score: number;
  ela_score: number | null;
  science_score: number | null;
  overall_score: number;
  total_time: number;
  test_type?: string;
  created_at?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

const ScorePill = ({ value }: { value: number | null }) => {
  if (value == null) return <span className="text-gray-300 text-xs">—</span>;
  const cls = value >= 80 ? 'bg-green-100 text-green-800'
    : value >= 61 ? 'bg-blue-100 text-blue-800'
    : value >= 31 ? 'bg-yellow-100 text-yellow-800'
    : 'bg-purple-100 text-purple-800';
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${cls}`}>{Math.round(value)}%</span>;
};

const CategoryBadge = ({ category }: { category: LearningCategory }) => (
  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${category.bgColor} ${category.color}`}>
    {category.name}
  </span>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const [results, setResults]           = useState<StudentResult[]>([]);
  const [filtered, setFiltered]         = useState<StudentResult[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [gradeFilter, setGradeFilter]   = useState('All Grades');
  const [catFilter, setCatFilter]       = useState('All Categories');
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);

  // Modal state
  const [selectedPackage, setSelectedPackage]     = useState<PackageOption>(PACKAGES[0]);
  const [customSubjects, setCustomSubjects]       = useState<CustomPackageSubject[]>([]);
  const [instructorName, setInstructorName]       = useState('ISAAC SALAKO');
  const [newSubjectName, setNewSubjectName]        = useState(CUSTOM_PACKAGE_SUBJECTS[0].name);
  const [newSubjectHours, setNewSubjectHours]      = useState(1);

  // ── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('overall_score', { ascending: false });
      if (!error && data) { setResults(data); setFiltered(data); }
      setLoading(false);
    };
    load();
  }, []);

  // ── Filter logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    let out = [...results];
    if (gradeFilter !== 'All Grades') out = out.filter(r => r.grade === gradeFilter);
    if (catFilter   !== 'All Categories') out = out.filter(r => getLearningCategory(r.overall_score).name === catFilter);
    if (search) out = out.filter(r => r.full_name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()));
    setFiltered(out);
  }, [results, search, gradeFilter, catFilter]);

  const allGrades    = ['All Grades',      ...Array.from(new Set(results.map(r => r.grade))).sort()];
  const allCats      = ['All Categories',  ...LEARNING_CATEGORIES.map(c => c.name)];
  const categoryCounts = LEARNING_CATEGORIES.map(c => ({
    ...c,
    count: results.filter(r => getLearningCategory(r.overall_score).name === c.name).length,
  }));

  // ── Modal open ────────────────────────────────────────────────────────────
  const openModal = (student: StudentResult) => {
    setSelectedStudent(student);
    const suggested = getSuggestedPackage({
      math: student.math_score, ela: student.ela_score, science: student.science_score,
    });
    setSelectedPackage(suggested);
    setCustomSubjects([]);
    setInstructorName('');
  };

  // ── Custom package helpers ────────────────────────────────────────────────
  const addCustomSubject = () => {
    if (customSubjects.find(s => s.name === newSubjectName)) return;
    setCustomSubjects(prev => [...prev, { name: newSubjectName, hours: newSubjectHours }]);
  };
  const removeCustomSubject = (name: string) => setCustomSubjects(prev => prev.filter(s => s.name !== name));
  const updateSubjectHours  = (name: string, hours: number) =>
    setCustomSubjects(prev => prev.map(s => s.name === name ? { ...s, hours } : s));

  // ── Generate PDF ──────────────────────────────────────────────────────────
  const handleGeneratePDF = () => {
    if (!selectedStudent) return;
    generateRecommendationPDF({
      studentName:   selectedStudent.full_name,
      studentEmail:  selectedStudent.email,
      grade:         selectedStudent.grade,
      gender:        selectedStudent.gender,
      mathScore:     selectedStudent.math_score,
      elaScore:      selectedStudent.ela_score,
      scienceScore:  selectedStudent.science_score,
      overallScore:  selectedStudent.overall_score,
      selectedPackage,
      customSubjects: selectedPackage.id === 'custom' ? customSubjects : [],
      instructorName,
    });
  };

  if (loading) return <div className="p-8 text-gray-500">Loading results...</div>;

  return (
    <div className=" max-w-7xl">

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Results & Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">View student results, learning categories, and generate personalised programme recommendations.</p>
      </div>

      {/* Category summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {categoryCounts.map(c => (
          <button key={c.name}
            onClick={() => setCatFilter(prev => prev === c.name ? 'All Categories' : c.name)}
            className={`rounded-2xl p-4 text-center border transition-all duration-150 cursor-pointer
              ${catFilter === c.name ? `${c.bgColor} border-current shadow-sm` : 'bg-white border-gray-100 hover:border-gray-200'}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${c.color}`}>{c.name}</p>
            <p className={`text-2xl font-extrabold ${c.color}`}>{c.count}</p>
            <p className="text-xs text-gray-400 mt-0.5">students</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <input type="text" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer">
          {allGrades.map(g => <option key={g}>{g}</option>)}
        </select>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer">
          {allCats.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="hidden sm:flex items-center text-xs text-gray-400 whitespace-nowrap">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#','STUDENT','GRADE','OVERALL','MATH','ELA','SCIENCE','CATEGORY','SUGGESTED','ACTIONS'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-gray-400 text-sm">No results found</td></tr>
              ) : filtered.map((r, idx) => {
                const cat  = getLearningCategory(r.overall_score);
                const sugg = getSuggestedPackage({ math: r.math_score, ela: r.ela_score, science: r.science_score });
                return (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {r.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">{r.full_name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[140px]">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{r.grade}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{Math.round(r.overall_score)}%</td>
                    <td className="px-4 py-3"><ScorePill value={r.math_score} /></td>
                    <td className="px-4 py-3"><ScorePill value={r.ela_score} /></td>
                    <td className="px-4 py-3"><ScorePill value={r.science_score} /></td>
                    <td className="px-4 py-3"><CategoryBadge category={cat} /></td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">{sugg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openModal(r)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                        📄 Recommend
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recommendation Modal ── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Programme Recommendation</h2>
                <p className="text-sm text-gray-400 mt-0.5">{selectedStudent.full_name}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400">
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* Score summary */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Overall', val: `${Math.round(selectedStudent.overall_score)}%` },
                  { label: 'Math',    val: selectedStudent.math_score != null ? `${Math.round(selectedStudent.math_score)}%` : '—' },
                  { label: 'ELA',     val: selectedStudent.ela_score  != null ? `${Math.round(selectedStudent.ela_score)}%`  : '—' },
                  { label: 'Science', val: selectedStudent.science_score != null ? `${Math.round(selectedStudent.science_score)}%` : '—' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-lg font-bold text-gray-900">{val}</p>
                  </div>
                ))}
              </div>

              {/* Category + suggestion */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Learning Category</p>
                  <CategoryBadge category={getLearningCategory(selectedStudent.overall_score)} />
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">System Suggestion 💡</p>
                  <span className="text-sm font-semibold text-blue-700">
                    {getSuggestedPackage({ math: selectedStudent.math_score, ela: selectedStudent.ela_score, science: selectedStudent.science_score }).label}
                  </span>
                </div>
              </div>

              {/* Package selection */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Select Package</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PACKAGES.map(pkg => (
                    <button key={pkg.id}
                      onClick={() => { setSelectedPackage(pkg); if (pkg.id !== 'custom') setCustomSubjects([]); }}
                      className={`p-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all text-left
                        ${selectedPackage.id === pkg.id
                          ? 'bg-green-600 text-white border-green-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'}`}>
                      <p className="font-bold">{pkg.label}</p>
                      <p className={`text-xs mt-0.5 ${selectedPackage.id === pkg.id ? 'text-green-100' : 'text-gray-400'}`}>
                        {pkg.id === 'custom' ? 'Build your own' : `${pkg.hoursPerWeek}hrs/wk`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom package builder */}
              {selectedPackage.id === 'custom' && (
                <div className="border border-dashed border-green-300 rounded-2xl p-4 space-y-3 bg-green-50/30">
                  <p className="text-sm font-semibold text-gray-700">Build Custom Package</p>

                  {/* Subject picker */}
                  <div className="flex gap-2 flex-wrap">
                    <select value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)}
                      className="flex-1 min-w-[160px] px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer">
                      {CUSTOM_PACKAGE_SUBJECTS.map(s => <option key={s.name}>{s.name}</option>)}
                    </select>
                    <div className="flex items-center gap-1.5">
                      <input type="number" min={0} max={5} step={1} value={newSubjectHours}
                        onChange={e => setNewSubjectHours(parseFloat(e.target.value))}
                        className="w-16 px-2 py-2 text-sm border border-gray-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                      <span className="text-xs text-gray-400">hr/wk</span>
                    </div>
                    <button onClick={addCustomSubject}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-green-700 transition-colors">
                      + Add
                    </button>
                  </div>

                  {/* Added subjects */}
                  {customSubjects.length > 0 ? (
                    <div className="space-y-2">
                      {customSubjects.map(s => (
                        <div key={s.name} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-gray-100">
                          <span className="flex-1 text-sm font-medium text-gray-800">{s.name}</span>
                          <input type="number" min={0.5} max={5} step={0.5} value={s.hours}
                            onChange={e => updateSubjectHours(s.name, parseFloat(e.target.value))}
                            className="w-14 px-2 py-1 text-sm border border-gray-200 rounded-lg text-center" />
                          <span className="text-xs text-gray-400">hr/wk</span>
                          <button onClick={() => removeCustomSubject(s.name)}
                            className="text-red-400 hover:text-red-600 text-sm cursor-pointer">✕</button>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 pt-1">
                        Total: <strong>{customSubjects.reduce((s, c) => s + c.hours, 0)}hrs/week</strong>
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No subjects added yet. Use the picker above.</p>
                  )}
                </div>
              )}

              {/* Standard package subjects preview */}
              {selectedPackage.id !== 'custom' && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Included Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPackage.subjects.map(s => (
                      <span key={s} className="text-xs bg-green-100 text-green-800 font-semibold px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{selectedPackage.hoursPerWeek} hrs/week total</p>
                </div>
              )}

              {/* Instructor name */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instructor Name (optional)</label>
                <input type="text" value={instructorName} onChange={e => setInstructorName(e.target.value)}
                  placeholder="e.g. Mr. James Osei"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
              </div> */}


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

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelectedStudent(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleGeneratePDF}
                  disabled={selectedPackage.id === 'custom' && customSubjects.length === 0}
                  className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  📄 Download Recommendation PDF
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}