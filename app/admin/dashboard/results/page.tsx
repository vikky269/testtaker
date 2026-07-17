'use client';

// app/admin/dashboard/results/page.tsx

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getLearningCategory, LEARNING_CATEGORIES, type LearningCategory } from '@/app/utils/reviewUtils';
import { PACKAGES, CUSTOM_PACKAGE_SUBJECTS, getSuggestedPackage, generateRecommendationPDF, type PackageOption, type CustomPackageSubject } from '@/app/utils/generateRecommendation';
import { getPricingTable, computePrice, type ComputedPrice, type GradePricing } from '@/app/utils/pricingData';

const COMMENT_MAX = 2500; // max characters for evaluator's comment (renders well on PDF)

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
  math_duration?:    number | null;
  ela_duration?:     number | null;
  science_duration?: number | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const ScorePill = ({ value }: { value: number | null }) => {
  if (value == null) return <span className="text-gray-300 text-xs">—</span>;
  const cls = value >= 80 ? 'bg-green-100 text-green-800'
    : value >= 61 ? 'bg-blue-100 text-blue-800'
    : value >= 31 ? 'bg-yellow-100 text-yellow-800'
    : 'bg-purple-100 text-purple-800';
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${cls}`}>{Math.round(value)}%</span>;
};

const CategoryBadge = ({ cat }: { cat: LearningCategory }) => (
  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.bgColor} ${cat.color}`}>{cat.name}</span>
);

// ── Price computation ─────────────────────────────────────────────────────────
// Normal mode:  SM rate = standard rate − adjuster; SM fee = SM rate × SM sessions.
// Budget mode:  parentBudget > 0 → SM fee = budget; SM rate = budget ÷ SM sessions.
//               The hourly-rate adjuster is then DERIVED (standard − SM rate).
function computePriceWithAdjuster(
  standardHourlyRate: number,
  monthlyHours: number,      // package default — used for standard column (never changes)
  adjuster: number,
  smSessions?: number,       // actual SM session count (default + delta)
  parentBudget?: number,     // parent's target monthly amount (0/undefined = off)
): ComputedPrice {
  const sessions = smSessions ?? monthlyHours;

  // Standard rate always uses the original package monthlyHours
  const standardMonthlyFee = Math.round(standardHourlyRate * monthlyHours);

  let smHourlyRate: number;
  let smMonthlyFee: number;

  if (parentBudget && parentBudget > 0 && sessions > 0) {
    // Budget mode — the parent's amount drives everything
    smMonthlyFee = Math.round(parentBudget);
    smHourlyRate = parentBudget / sessions;
  } else {
    // Normal mode — $-off adjuster
    smHourlyRate = standardHourlyRate - adjuster;
    smMonthlyFee = Math.round(smHourlyRate * sessions);
  }

  const smBiweekly = smMonthlyFee / 2;

  const savingsPercent = standardMonthlyFee > 0
    ? Math.round(((standardMonthlyFee - smMonthlyFee) / standardMonthlyFee) * 100)
    : 0;
  const smInvestment = standardMonthlyFee - smMonthlyFee;

  return {
    sessions,
    standardHourlyRate,
    standardMonthlyFee,
    smHourlyRate,
    smMonthlyFee,
    smBiweekly,
    savingsPercent,
    smInvestment,
  };
}

// ── Stepper control ───────────────────────────────────────────────────────────
const Stepper = ({
  value, onChange, min, max, prefix = '', suffix = '',
  colorClass = 'text-gray-700', showSign = false,
}: {
  value: number; onChange: (v: number) => void;
  min: number; max: number;
  prefix?: string; suffix?: string; colorClass?: string;
  showSign?: boolean; // display "+2" for positive deltas
}) => (
  <div className="flex items-center justify-center gap-1">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-6 h-6 rounded-md bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 text-sm font-bold cursor-pointer transition-colors flex items-center justify-center">
      −
    </button>
    <span className={`text-xs font-bold min-w-[42px] text-center ${colorClass}`}>
      {prefix}{showSign && value > 0 ? '+' : ''}{value}{suffix}
    </span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      className="w-6 h-6 rounded-md bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 text-sm font-bold cursor-pointer transition-colors flex items-center justify-center">
      +
    </button>
  </div>
);

// ── PriceCard — pricing table with session delta, rate adjuster + budget ─────
function PriceCard({
  price, packageLabel, adjuster, onAdjusterChange,
  sessionDelta, onSessionDeltaChange, defaultSessions,
  parentBudget, onParentBudgetChange,
}: {
  price: ComputedPrice;
  packageLabel: string;
  adjuster: number;
  onAdjusterChange: (val: number) => void;
  sessionDelta: number;                       // 0 = no adjustment
  onSessionDeltaChange: (val: number) => void;
  defaultSessions: number;
  parentBudget: number;
  onParentBudgetChange: (val: number) => void;
}) {
  const budgetActive = parentBudget > 0;
  // In budget mode the hourly-rate adjuster is derived automatically
  const derivedAdjuster = price.standardHourlyRate - price.smHourlyRate;

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#1a2e05] text-white px-4 py-3 text-center">
        <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-0.5">{packageLabel}</p>
        <p className="text-xs opacity-60">Math Tutoring + Programme</p>
      </div>

      {/* Table */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 w-2/5"> </th>
            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Standard Rate</th>
            <th className="px-3 py-2 text-center text-xs font-bold text-green-700 bg-green-50">SmartMathz Offer</th>
            <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 w-32">Adjust</th>
          </tr>
        </thead>
        <tbody>
          {/* Sessions / Month — delta adjuster, starts at 0 */}
          <tr className="border-t border-gray-100">
            <td className="px-3 py-2 text-xs text-gray-500">Sessions / Month</td>
            <td className="px-3 py-2 text-center text-sm font-semibold text-gray-700">{defaultSessions}</td>
            <td className="px-3 py-2 text-center text-sm font-bold text-yellow-600 bg-yellow-50">{price.sessions}</td>
            <td className="px-3 py-2">
              <Stepper
                value={sessionDelta}
                onChange={onSessionDeltaChange}
                min={1 - defaultSessions}
                max={40 - defaultSessions}
                suffix=" sess"
                showSign
                colorClass="text-yellow-600"
              />
            </td>
          </tr>

          {/* Hourly Rate — manual adjuster, or auto-derived in budget mode */}
          <tr className="border-t border-gray-100">
            <td className="px-3 py-2 text-xs text-gray-500">
              Hourly Rate
              {budgetActive && (
                <span className="block text-[10px] text-blue-500 font-semibold">auto · budget ÷ sessions</span>
              )}
            </td>
            <td className="px-3 py-2 text-center text-sm font-semibold text-gray-700">${price.standardHourlyRate.toFixed(2)}</td>
            <td className="px-3 py-2 text-center text-sm font-bold text-yellow-600 bg-yellow-50">${price.smHourlyRate.toFixed(2)}</td>
            <td className="px-3 py-2">
              {budgetActive ? (
                <p className="text-center text-[11px] font-bold text-red-500">
                  −${derivedAdjuster.toFixed(2)}
                  <span className="block text-[10px] font-normal text-gray-400 italic">auto</span>
                </p>
              ) : (
                <Stepper
                  value={adjuster}
                  onChange={onAdjusterChange}
                  min={0} max={50}
                  prefix="$"
                  colorClass="text-red-500"
                />
              )}
            </td>
          </tr>

          {/* Parent Budget */}
          <tr className={`border-t border-gray-100 ${budgetActive ? 'bg-blue-50/50' : ''}`}>
            <td className="px-3 py-2 text-xs text-gray-500">
              Final Adjuster
              {/* <span className="block text-[10px] text-gray-400">amount the parent wants to pay</span> */}
            </td>
            <td className="px-3 py-2 text-center text-xs text-gray-300">—</td>
            <td className="px-3 py-2 text-center text-sm font-bold text-blue-600">
              {budgetActive ? `$${Math.round(parentBudget)}` : '—'}
            </td>
            <td className="px-3 py-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-xs text-gray-400">$</span>
                <input
                  type="number" min={0} step={10}
                  value={parentBudget || ''}
                  placeholder="0"
                  onChange={e => onParentBudgetChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-20 px-2 py-1 text-xs font-bold text-blue-600 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                />
                {budgetActive && (
                  <button
                    onClick={() => onParentBudgetChange(0)}
                    title="Clear budget"
                    className="w-5 h-5 rounded-md bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 text-[10px] font-bold cursor-pointer flex items-center justify-center">
                    ✕
                  </button>
                )}
              </div>
            </td>
          </tr>

          {/* Monthly Fee */}
          <tr className="border-t border-gray-100">
            <td className="px-3 py-2 text-xs text-gray-500">Monthly Fee</td>
            <td className="px-3 py-2 text-center text-sm font-semibold text-gray-700">${price.standardMonthlyFee}</td>
            <td className="px-3 py-2 text-center text-sm font-bold text-green-700 bg-green-50">${price.smMonthlyFee}</td>
            <td className="px-3 py-2"></td>
          </tr>

          {/* Bi-Weekly */}
          <tr className="border-t border-gray-100">
            <td className="px-3 py-2 text-xs text-gray-500">Bi-Weekly</td>
            <td className="px-3 py-2 text-center text-sm font-semibold text-gray-700">${(price.standardMonthlyFee / 2).toFixed(0)}</td>
            <td className="px-3 py-2 text-center text-sm font-bold text-green-700 bg-green-50">${price.smBiweekly.toFixed(1)}</td>
            <td className="px-3 py-2"></td>
          </tr>
        </tbody>
      </table>

      {/* Savings strip */}
      <div className="bg-green-50 border-t border-green-100 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-green-700 font-semibold">% Savings</p>
          <p className="text-sm font-bold text-green-800">
            {price.savingsPercent}% <span className="text-xs font-normal text-green-600">Per Month</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-green-700 font-semibold">SmartMathz Investment</p>
          <p className="text-sm font-bold text-green-800">
            ${price.smInvestment} <span className="text-xs font-normal text-green-600">Per Month</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const [results, setResults]   = useState<StudentResult[]>([]);
  const [filtered, setFiltered] = useState<StudentResult[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [catFilter, setCatFilter]     = useState('All Categories');

  // Modal state
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>(PACKAGES[0]);
  const [customSubjects, setCustomSubjects]   = useState<CustomPackageSubject[]>([]);
  const [instructorName, setInstructorName]   = useState('');
  const [newSubjectName, setNewSubjectName]   = useState(CUSTOM_PACKAGE_SUBJECTS[0].name);
  const [newSubjectHours, setNewSubjectHours] = useState(1);
  const [instructorComment, setInstructorComment] = useState('');

  // Pricing adjusters — ALL start at zero
  const [adjuster, setAdjuster]         = useState<number>(0); // $ off per hour
  const [sessionDelta, setSessionDelta] = useState<number>(0); // ± sessions vs package default
  const [parentBudget, setParentBudget] = useState<number>(0); // parent's target $/month (0 = off)

  // Custom package rate
  const [customStdRate, setCustomStdRate] = useState<number>(50);

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('leaderboard').select('*').order('overall_score', { ascending: false });
      if (!error && data) { setResults(data); setFiltered(data); }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let out = [...results];
    if (gradeFilter !== 'All Grades')   out = out.filter(r => r.grade === gradeFilter);
    if (catFilter !== 'All Categories') out = out.filter(r => getLearningCategory(r.overall_score).name === catFilter);
    if (search) out = out.filter(r =>
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(out);
  }, [results, search, gradeFilter, catFilter]);

  const allGrades = ['All Grades', ...Array.from(new Set(results.map(r => r.grade))).sort()];
  const categoryCounts = LEARNING_CATEGORIES.map(c => ({
    ...c,
    count: results.filter(r => getLearningCategory(r.overall_score).name === c.name).length,
  }));

  // Custom package hours
  const customWeeklyHours  = customSubjects.reduce((s, c) => s + c.hours, 0);
  const customMonthlyHours = customWeeklyHours * 4;

  // ── Pricing ────────────────────────────────────────────────────────────────
  const pricingTable: GradePricing | null = useMemo(() => {
    if (!selectedStudent) return null;
    const cat = getLearningCategory(selectedStudent.overall_score);
    return getPricingTable(cat.name, selectedStudent.grade);
  }, [selectedStudent]);

  // Default sessions from the selected package
  const defaultSessions = useMemo(() => {
    if (selectedPackage.id === 'custom') return customMonthlyHours;
    if (!pricingTable) return 8;
    return selectedPackage.id === 'I'  ? pricingTable.packageI.monthlyHours
         : selectedPackage.id === 'II' ? pricingTable.packageII.monthlyHours
         : pricingTable.packageIII.monthlyHours;
  }, [selectedPackage, pricingTable, customMonthlyHours]);

  // Actual SM session count = package default + zero-based delta (never below 1)
  const smSessions = useMemo(
    () => Math.max(1, defaultSessions + sessionDelta),
    [defaultSessions, sessionDelta]
  );

  const computedPrice: ComputedPrice | null = useMemo(() => {
    if (selectedPackage.id === 'custom') {
      if (customMonthlyHours === 0) return null;
      return computePriceWithAdjuster(customStdRate, customMonthlyHours, adjuster, smSessions, parentBudget);
    }
    if (!pricingTable) return null;
    const pp = selectedPackage.id === 'I'  ? pricingTable.packageI
             : selectedPackage.id === 'II' ? pricingTable.packageII
             : pricingTable.packageIII;
    return computePriceWithAdjuster(pp.standardHourlyRate, pp.monthlyHours, adjuster, smSessions, parentBudget);
  }, [selectedPackage, pricingTable, customStdRate, customMonthlyHours, adjuster, smSessions, parentBudget]);

  // ── Open modal — all adjusters reset to zero ───────────────────────────────
  const openModal = (s: StudentResult) => {
    setSelectedStudent(s);
    const suggested = getSuggestedPackage({ math: s.math_score, ela: s.ela_score, science: s.science_score });
    setSelectedPackage(suggested);
    setCustomSubjects([]);
    setInstructorName('');
    setCustomStdRate(50);
    setAdjuster(0);
    setSessionDelta(0);
    setParentBudget(0);
    setInstructorComment('');
  };

  // When package changes, reset all adjusters to zero
  const handlePackageChange = (pkg: PackageOption) => {
    setSelectedPackage(pkg);
    if (pkg.id !== 'custom') setCustomSubjects([]);
    setAdjuster(0);
    setSessionDelta(0);
    setParentBudget(0);
  };

  // ── Custom subject helpers ─────────────────────────────────────────────────
  const addCustomSubject = () => {
    if (customSubjects.find(s => s.name === newSubjectName)) return;
    setCustomSubjects(p => [...p, { name: newSubjectName, hours: newSubjectHours }]);
  };
  const removeCustomSubject = (name: string) => setCustomSubjects(p => p.filter(s => s.name !== name));
  const updateHours = (name: string, h: number) =>
    setCustomSubjects(p => p.map(s => s.name === name ? { ...s, hours: h } : s));

  // ── Generate PDF ───────────────────────────────────────────────────────────
  const handleGeneratePDF = () => {
    if (!selectedStudent) return;
    const fmt = (s?: number | null) =>
        s ? `${Math.floor(s / 60)}m ${s % 60}s` : '—';

    generateRecommendationPDF({
      studentName:    selectedStudent.full_name,
      studentEmail:   selectedStudent.email,
      grade:          selectedStudent.grade,
      gender:         selectedStudent.gender,
      mathScore:      selectedStudent.math_score,
      elaScore:       selectedStudent.ela_score,
      scienceScore:   selectedStudent.science_score,
      overallScore:   selectedStudent.overall_score,
      selectedPackage,
      customSubjects: selectedPackage.id === 'custom' ? customSubjects : [],
      instructorName,
      instructorComment: instructorComment.slice(0, COMMENT_MAX),
      defaultSessions,
      computedPrice:  computedPrice ?? undefined,

      times: {
        total: fmt(selectedStudent.total_time),
        math: fmt((selectedStudent as any).math_duration),
        ela: fmt((selectedStudent as any).ela_duration),
        science: fmt((selectedStudent as any).science_duration),
      },
    });
  };

  if (loading) return <div className="p-8 text-gray-500">Loading results...</div>;

  return (
    <div className="overflow-x-hidden max-w-7xl">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Results & Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">View student results, learning categories, and generate personalised programme recommendations.</p>
      </div>

      {/* Category summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {categoryCounts.map(c => (
          <button key={c.name} onClick={() => setCatFilter(p => p === c.name ? 'All Categories' : c.name)}
            className={`rounded-2xl p-4 text-center border transition-all cursor-pointer
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
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none cursor-pointer">
          {allGrades.map(g => <option key={g}>{g}</option>)}
        </select>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none cursor-pointer">
          {['All Categories', ...LEARNING_CATEGORIES.map(c => c.name)].map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="hidden sm:flex items-center text-xs text-gray-400 whitespace-nowrap">{filtered.length} results</span>
      </div>

      {/* Results table */}
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
                    <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{r.grade}</span></td>
                    <td className="px-4 py-3 font-bold text-gray-900">{Math.round(r.overall_score)}%</td>
                    <td className="px-4 py-3"><ScorePill value={r.math_score} /></td>
                    <td className="px-4 py-3"><ScorePill value={r.ela_score} /></td>
                    <td className="px-4 py-3"><ScorePill value={r.science_score} /></td>
                    <td className="px-4 py-3"><CategoryBadge cat={cat} /></td>
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

      {/* ══════════════════════════ MODAL ══════════════════════════ */}
      {selectedStudent && (() => {
        const cat = getLearningCategory(selectedStudent.overall_score);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[94vh] overflow-y-auto">

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Programme Recommendation</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{selectedStudent.full_name} · {selectedStudent.grade}</p>
                </div>
                <button onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 text-lg">✕</button>
              </div>

              <div className="px-6 py-5 space-y-5">

                {/* Score summary */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Overall', val: `${Math.round(selectedStudent.overall_score)}%` },
                    { label: 'Math',    val: selectedStudent.math_score    != null ? `${Math.round(selectedStudent.math_score)}%`    : '—' },
                    { label: 'ELA',     val: selectedStudent.ela_score     != null ? `${Math.round(selectedStudent.ela_score)}%`     : '—' },
                    { label: 'Science', val: selectedStudent.science_score != null ? `${Math.round(selectedStudent.science_score)}%` : '—' },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                      <p className="text-lg font-bold text-gray-900">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Category + suggestion */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Learning Category</p>
                    <CategoryBadge cat={cat} />
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">System Suggestion 💡</p>
                    <span className="text-sm font-semibold text-blue-700">
                      {getSuggestedPackage({ math: selectedStudent.math_score, ela: selectedStudent.ela_score, science: selectedStudent.science_score }).label}
                    </span>
                  </div>
                  {pricingTable && (
                    <>
                      <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Rate Table</p>
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{cat.name} rates applied</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Package selector */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Select Package</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PACKAGES.map(pkg => (
                      <button key={pkg.id}
                        onClick={() => handlePackageChange(pkg)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all
                          ${selectedPackage.id === pkg.id
                            ? 'bg-[#1a2e05] text-white border-[#1a2e05] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'}`}>
                        <p className="font-bold text-sm">{pkg.label}</p>
                        <p className={`text-xs mt-0.5 ${selectedPackage.id === pkg.id ? 'text-green-300' : 'text-gray-400'}`}>
                          {pkg.id === 'custom'
                            ? customWeeklyHours > 0
                              ? `${customWeeklyHours}hrs/wk · ${customMonthlyHours}hrs/mo`
                              : 'Build your own'
                            : `${(pkg.hoursPerWeek ?? 0) * 4}hrs/month`}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Standard packages ── */}
                {selectedPackage.id !== 'custom' && pricingTable && computedPrice && (
                  <>
                    {/* Reference cards */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Pricing Reference — {cat.name} rates
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        {[
                          { label: 'Package I (8hrs)',    pp: pricingTable.packageI   },
                          { label: 'Package II (16hrs)',  pp: pricingTable.packageII  },
                          { label: 'Package III (20hrs)', pp: pricingTable.packageIII },
                        ].map(({ label, pp }, i) => {
                          const isActive =
                            (selectedPackage.id === 'I'   && i === 0) ||
                            (selectedPackage.id === 'II'  && i === 1) ||
                            (selectedPackage.id === 'III' && i === 2);
                          const refSessions = Math.max(1, pp.monthlyHours + sessionDelta);
                          const smRate = pp.standardHourlyRate - adjuster;
                          const smFee  = Math.round(smRate * refSessions);
                          return (
                            <div key={label} className={`rounded-xl p-2 border ${isActive ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                              <p className={`font-bold mb-1 ${isActive ? 'text-green-700' : 'text-gray-600'}`}>{label}</p>
                              <p className="text-gray-500">Std: <span className="font-semibold text-gray-700">${pp.standardHourlyRate}/hr</span></p>
                              <p className="text-green-600">SM: <span className="font-semibold">${smRate}/hr</span></p>
                              <p className="text-gray-400 mt-1">
                                ${pp.standardMonthlyFee}/mo → <span className="text-green-600 font-semibold">${smFee}/mo</span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Full breakdown */}
                    <PriceCard
                      price={computedPrice}
                      packageLabel={selectedPackage.label}
                      adjuster={adjuster}
                      onAdjusterChange={setAdjuster}
                      sessionDelta={sessionDelta}
                      onSessionDeltaChange={setSessionDelta}
                      defaultSessions={defaultSessions}
                      parentBudget={parentBudget}
                      onParentBudgetChange={setParentBudget}
                    />
                  </>
                )}

                {/* ── Custom package ── */}
                {selectedPackage.id === 'custom' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
                      <p className="text-sm font-semibold text-gray-700">Set Pricing for Custom Package</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Standard Hourly Rate ($)</label>
                          <input type="number" min={30} max={200} step={0.5} value={customStdRate}
                            onChange={e => setCustomStdRate(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white" />
                          <p className="text-xs text-green-600 mt-1">
                            SM rate: ${computedPrice ? computedPrice.smHourlyRate.toFixed(2) : (customStdRate - adjuster).toFixed(2)}/hr
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Monthly Hours (auto)</label>
                          <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-semibold">
                            {customMonthlyHours > 0
                              ? `${customMonthlyHours} hrs/month`
                              : <span className="text-gray-400 font-normal">Add subjects below</span>}
                          </div>
                          {customWeeklyHours > 0 && (
                            <p className="text-xs text-gray-400 mt-1">{customWeeklyHours}hr/wk × 4 weeks</p>
                          )}
                        </div>
                      </div>
                      {computedPrice && (
                        <div className="bg-white rounded-xl p-3 border border-blue-100 text-xs grid grid-cols-2 gap-2">
                          <div><span className="text-gray-400">Standard monthly:</span> <span className="font-bold text-gray-700">${computedPrice.standardMonthlyFee}</span></div>
                          <div><span className="text-gray-400">SM monthly:</span> <span className="font-bold text-green-700">${computedPrice.smMonthlyFee}</span></div>
                          <div><span className="text-gray-400">Bi-weekly:</span> <span className="font-bold text-green-700">${computedPrice.smBiweekly.toFixed(1)}</span></div>
                          <div><span className="text-gray-400">Savings:</span> <span className="font-bold text-green-700">{computedPrice.savingsPercent}%</span></div>
                        </div>
                      )}
                    </div>

                    {/* Custom PriceCard with all adjusters */}
                    {computedPrice && (
                      <PriceCard
                        price={computedPrice}
                        packageLabel="Custom Package"
                        adjuster={adjuster}
                        onAdjusterChange={setAdjuster}
                        sessionDelta={sessionDelta}
                        onSessionDeltaChange={setSessionDelta}
                        defaultSessions={customMonthlyHours}
                        parentBudget={parentBudget}
                        onParentBudgetChange={setParentBudget}
                      />
                    )}

                    {/* Subject builder */}
                    <div className="border border-dashed border-green-300 rounded-2xl p-4 space-y-3 bg-green-50/30">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">Build Subject List</p>
                        {customWeeklyHours > 0 && (
                          <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            {customWeeklyHours}hr/wk → {customMonthlyHours}hrs/month
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <select value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)}
                          className="flex-1 min-w-[150px] px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white cursor-pointer focus:outline-none">
                          {CUSTOM_PACKAGE_SUBJECTS.map(s => <option key={s.name}>{s.name}</option>)}
                        </select>
                        <div className="flex items-center gap-1.5">
                          <input type="number" min={0} max={10} step={1} value={newSubjectHours}
                            onChange={e => setNewSubjectHours(parseFloat(e.target.value))}
                            className="w-14 px-2 py-2 text-sm border border-gray-200 rounded-xl text-center" />
                          <span className="text-xs text-gray-400">hr/wk</span>
                        </div>
                        <button onClick={addCustomSubject}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-green-700 transition-colors">
                          + Add
                        </button>
                      </div>
                      {customSubjects.length > 0 ? (
                        <div className="space-y-2">
                          {customSubjects.map(s => (
                            <div key={s.name} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-gray-100">
                              <span className="flex-1 text-sm font-medium text-gray-800">{s.name}</span>
                              <input type="number" min={0.5} max={10} step={0.5} value={s.hours}
                                onChange={e => updateHours(s.name, parseFloat(e.target.value))}
                                className="w-14 px-2 py-1 text-sm border border-gray-200 rounded-lg text-center" />
                              <span className="text-xs text-gray-400">hr/wk</span>
                              <button onClick={() => removeCustomSubject(s.name)}
                                className="text-red-400 hover:text-red-600 cursor-pointer">✕</button>
                            </div>
                          ))}
                          <p className="text-xs text-gray-500 pt-1">
                            Total: <strong>{customWeeklyHours}hrs/week</strong>
                            <span className="text-gray-400 ml-2">→ <strong className="text-green-700">{customMonthlyHours}hrs/month</strong> (auto)</span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No subjects added yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Evaluator's comment — max 2500 chars for clean PDF rendering */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Evaluator's Comment <span className="text-gray-400 font-normal text-xs">(optional)</span>
                    </label>
                    <span className={`text-xs ${instructorComment.length >= COMMENT_MAX ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                      {instructorComment.length.toLocaleString()} / {COMMENT_MAX.toLocaleString()}
                    </span>
                  </div>
                  <textarea
                    value={instructorComment}
                    onChange={e => setInstructorComment(e.target.value.slice(0, COMMENT_MAX))}
                    maxLength={COMMENT_MAX}
                    placeholder="Add any personalised notes or comments for the student and parent..."
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl
               focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
               resize-none placeholder:text-gray-400"
                  />
                </div>

                {/* Instructor name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Evaluator's Name (optional)</label>
                  <input type="text" value={instructorName} onChange={e => setInstructorName(e.target.value)}
                    placeholder="e.g. Mr. James Osei"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setSelectedStudent(null)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleGeneratePDF}
                    disabled={selectedPackage.id === 'custom' && customSubjects.length === 0}
                    className="flex-[2] py-3 bg-[#1a2e05] hover:bg-[#2a4a09] text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    📄 Download Recommendation PDF
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}