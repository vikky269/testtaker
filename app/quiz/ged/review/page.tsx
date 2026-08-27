"use client";

// app/quiz/ged/review/page.tsx
// GED review page — modeled on the main quiz review page's layout (score
// cards, stats strip, SectionBlock per section, download button), but reads
// from test_submissions directly rather than URL params/context, since
// that's the durable source of truth already used by My Tests and the
// admin GED review page. Works even after a fresh navigation, a refresh,
// or on a different device — no in-memory state required.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, withTimeout } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { GED_SECTIONS, GED_SECTION_LABELS, type GEDSectionKey } from "@/app/data/geddata";
import { generateGedReport } from "@/app/utils/generateGedReport";
import SectionBlock from "@/app/components/SectionBlock/SectionBlock";

interface GedSubmission {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  questions: { question: string; options: string[]; correctAnswer?: string; answer?: string }[];
  answers: Record<string, string>;
  math_score: number | null;
  ela_score: number | null;        // RLA
  science_score: number | null;
  social_studies_score: number | null;
  overall_score: number | null;
  durations: {
    totalDuration?: number;
    mathDuration?: number;
    elaDuration?: number;          // RLA
    scienceDuration?: number;
    socialDuration?: number;
  } | null;
}

const fmtSec = (s?: number) => {
  if (!s || s <= 0) return "—";
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}m ${sec}s`;
};

// SectionBlock's color prop is a restricted set in the shared component —
// reusing the three already used elsewhere in the app for the first three
// sections; Social Studies uses a 4th value that may need adding to
// SectionBlock's accepted colors if TypeScript flags it.
const SECTION_COLOR: Record<GEDSectionKey, "indigo" | "emerald" | "amber" | "violet"> = {
  math: "indigo", rla: "emerald", science: "amber", social: "violet",
};
const SECTION_EMOJI: Record<GEDSectionKey, string> = {
  math: "🔢", rla: "📖", science: "🔬", social: "🌍",
};

export default function GedReviewPage() {
  const router = useRouter();
  const [sub, setSub] = useState<GedSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("test_submissions")
        .select("*")
        .eq("user_id", user.id)
        .eq("test_type", "ged")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.error("Could not load GED review data:", error);
      setSub(data ?? null);
      setLoading(false);
    };
    load();
  }, []);

  const handleDownloadReport = () => {
    if (!sub) return;
    try {
      generateGedReport({
        studentName: sub.full_name ?? "Student",
        studentEmail: sub.email ?? undefined,
        testDate: new Date(sub.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        questions: sub.questions ?? [],
        answers: sub.answers ?? {},
        durations: sub.durations ?? undefined,
      });
    } catch (e) {
      console.error(e);
      toast.error("Could not generate the report.");
    }
  };

  const handleGoHome = () => {
    localStorage.removeItem("activeStudent");
    router.push("/");
  };

  // ── Guards ──────────────────────────────────────────────
  if (loading) return <p className="text-center mt-20 text-gray-400">Loading your GED review...</p>;

  if (!sub) return (
    <div className="text-center mt-20">
      <p className="text-red-500 mb-4">No GED review data found.</p>
      <button onClick={() => router.push("/")}
        className="px-6 py-2.5 bg-[#7FB509] hover:bg-[#6a9a07] text-white font-bold text-sm rounded-full cursor-pointer transition-colors">
        Back to Home
      </button>
    </div>
  );

  // ── Compute per-section results from the stored submission ──────────────
  const sectionResults = GED_SECTIONS.map((sec) => {
    const qs = (sub.questions ?? []).slice(sec.start, sec.end);
    const correct = qs.filter((q) => sub.answers?.[q.question] === (q.correctAnswer || q.answer)).length;
    return { key: sec.key, label: GED_SECTION_LABELS[sec.key], qs, correct, total: qs.length };
  });

  const totalCorrect = sectionResults.reduce((s, r) => s + r.correct, 0);
  const totalQuestions = sectionResults.reduce((s, r) => s + r.total, 0);
  const overall = sub.overall_score != null ? Math.round(sub.overall_score) : (totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0);

  const scoreOf = (key: GEDSectionKey) =>
    key === "math" ? sub.math_score
    : key === "rla" ? sub.ela_score
    : key === "science" ? sub.science_score
    : sub.social_studies_score;

  const statsStrip = [
    { label: "Score", val: `${overall}%`, cls: "text-gray-800" },
    { label: "Correct", val: `${totalCorrect} / ${totalQuestions}`, cls: "text-gray-800" },
    { label: "Total Time", val: fmtSec(sub.durations?.totalDuration), cls: "text-gray-800" },
    { label: "Math", val: fmtSec(sub.durations?.mathDuration), cls: "text-indigo-600" },
    { label: "RLA", val: fmtSec(sub.durations?.elaDuration), cls: "text-emerald-600" },
    { label: "Science", val: fmtSec(sub.durations?.scienceDuration), cls: "text-amber-600" },
    { label: "Social Studies", val: fmtSec(sub.durations?.socialDuration), cls: "text-violet-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 mt-12">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-6 text-center">
        <span className="inline-block bg-indigo-600 text-white text-lg font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
          Test Review
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900">
          GED Readiness Diagnostic
        </h1>
        <p className="text-sm text-gray-400 italic mt-1">Full Review</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">

        {/* ── SCORE CARDS — 4 sections ── */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {sectionResults.map((r) => {
            const score = scoreOf(r.key) != null ? Math.round(scoreOf(r.key)!) : (r.total ? Math.round((r.correct / r.total) * 100) : 0);
            const colorMap = {
              math:    { bg: "bg-indigo-50",  text: "text-indigo-600",  bar: "bg-indigo-500" },
              rla:     { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
              science: { bg: "bg-amber-50",   text: "text-amber-600",  bar: "bg-amber-500" },
              social:  { bg: "bg-violet-50",  text: "text-violet-600", bar: "bg-violet-500" },
            }[r.key];
            return (
              <div key={r.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
                <div className={`w-10 h-10 rounded-xl ${colorMap.bg} flex items-center justify-center text-xl mx-auto mb-3`}>
                  {SECTION_EMOJI[r.key]}
                </div>
                <p className={`text-xs font-extrabold uppercase tracking-widest ${colorMap.text} mb-1`}>{r.label}</p>
                <p className={`text-3xl font-extrabold ${colorMap.text} leading-none`}>{score}%</p>
                <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${colorMap.bar} transition-all duration-700`} style={{ width: `${score}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── OVERALL ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center mb-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">Overall Score</p>
          <p className="text-5xl font-extrabold text-gray-900">{overall}%</p>
          <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden max-w-xs mx-auto">
            <div className="h-full rounded-full bg-[#1a2e05]" style={{ width: `${overall}%` }} />
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-wrap justify-center gap-6 md:gap-10 text-center">
          {statsStrip.map(({ label, val, cls }) => (
            <div key={label}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-extrabold ${cls}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* ── SECTIONED QUESTIONS ── */}
        {sectionResults.map((r) => (
          <SectionBlock
            key={r.key}
            label={r.label}
            emoji={SECTION_EMOJI[r.key]}
            color={SECTION_COLOR[r.key] as any}
            questions={r.qs}
            allQuestions={sub.questions ?? []}
            answers={sub.answers ?? {}}
          />
        ))}

        {/* ── FOOTER BUTTONS ── */}
        <div className="flex justify-center gap-4 flex-wrap mt-4">
          <button
            onClick={handleDownloadReport}
            className="px-6 py-3 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700
                       font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200
                       cursor-pointer flex items-center gap-2">
            📄 Download Report
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-[#7FB509] hover:bg-[#6a9a07] text-white font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            🏠 Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}