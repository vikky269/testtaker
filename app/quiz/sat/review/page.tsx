"use client";

// app/quiz/sat/review/page.tsx
// SAT review page — reads the latest test_submissions row for this student
// (test_type='sat'), same durable, DB-sourced pattern as the GED review page.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, withTimeout } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { SAT_SECTIONS, SAT_SECTION_LABELS, type SATSectionKey } from "@/app/data/satdata";
import { generateSatReport } from "@/app/utils/generateSatReport";
import SectionBlock from "@/app/components/SectionBlock/SectionBlock";

interface SatSubmission {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  questions: { id: string; question: string; options: string[]; correctAnswer?: string; answer?: string }[];
  answers: Record<string, string>;
  math_score: number | null;
  ela_score: number | null; // reading & writing
  overall_score: number | null;
  durations: { totalDuration?: number; mathDuration?: number; elaDuration?: number } | null;
}

const fmtSec = (s?: number) => {
  if (!s || s <= 0) return "—";
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}m ${sec}s`;
};

const SECTION_COLOR: Record<SATSectionKey, "indigo" | "emerald" | "amber"> = {
  reading: "emerald", math: "indigo",
};
const SECTION_EMOJI: Record<SATSectionKey, string> = { reading: "📖", math: "🔢" };

function getSatBand(correctCount: number): { label: string; desc: string; colorClass: string } {
  if (correctCount >= 18) return { label: "Strong", desc: "On track for a competitive SAT score.", colorClass: "text-emerald-700" };
  if (correctCount >= 14) return { label: "Solid Foundation", desc: "Focus on missed question types for refinement.", colorClass: "text-blue-700" };
  if (correctCount >= 10) return { label: "Developing", desc: "Review core concepts in both sections before full-length practice tests.", colorClass: "text-amber-700" };
  return { label: "Foundational", desc: "Foundational review recommended before timed practice.", colorClass: "text-red-700" };
}

export default function SatReviewPage() {
  const router = useRouter();
  const [sub, setSub] = useState<SatSubmission | null>(null);
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
        .eq("test_type", "sat")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.error("Could not load SAT review data:", error);
      setSub(data ?? null);
      setLoading(false);
    };
    load();
  }, []);

  const handleDownloadReport = () => {
    if (!sub) return;
    try {
      generateSatReport({
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

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading your SAT review...</p>;

  if (!sub) return (
    <div className="text-center mt-20">
      <p className="text-red-500 mb-4">No SAT review data found.</p>
      <button onClick={() => router.push("/")}
        className="px-6 py-2.5 bg-[#7FB509] hover:bg-[#6a9a07] text-white font-bold text-sm rounded-full cursor-pointer transition-colors">
        Back to Home
      </button>
    </div>
  );

  const sectionResults = SAT_SECTIONS.map((sec) => {
    const qs = (sub.questions ?? []).slice(sec.start, sec.end);
    const correct = qs.filter((q) => sub.answers?.[q.question] === (q.correctAnswer || q.answer)).length;
    return { key: sec.key, label: SAT_SECTION_LABELS[sec.key], qs, correct, total: qs.length };
  });

  const totalCorrect = sectionResults.reduce((s, r) => s + r.correct, 0);
  const readingScore = sub.ela_score != null ? Math.round(sub.ela_score) : 0;
  const mathScore = sub.math_score != null ? Math.round(sub.math_score) : 0;
  const satBand = getSatBand(totalCorrect);

  const statsStrip = [
    { label: "Score", val: `${Math.round(sub.overall_score ?? 0)}%`, cls: "text-gray-800" },
    { label: "Correct", val: `${totalCorrect} / 20`, cls: "text-gray-800" },
    { label: "Total Time", val: fmtSec(sub.durations?.totalDuration), cls: "text-gray-800" },
    { label: "Reading & Writing Time", val: fmtSec(sub.durations?.elaDuration), cls: "text-emerald-600" },
    { label: "Math Time", val: fmtSec(sub.durations?.mathDuration), cls: "text-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 mt-12">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-6 text-center">
        <span className="inline-block bg-indigo-600 text-white text-lg font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
          Test Review
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900">SAT Practice Review</h1>
        <p className={`text-sm font-semibold mt-1 ${satBand.colorClass}`}>{satBand.label} — {satBand.desc}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-1">Reading & Writing</p>
            <p className="text-4xl font-extrabold text-emerald-600 leading-none">{readingScore}%</p>
            <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${readingScore}%` }} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-1">Mathematics</p>
            <p className="text-4xl font-extrabold text-indigo-600 leading-none">{mathScore}%</p>
            <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${mathScore}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-1">
            SAT Readiness · {totalCorrect} / 20 correct
          </p>
          <p className={`text-2xl font-extrabold ${satBand.colorClass}`}>{satBand.label}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-wrap justify-center gap-6 md:gap-12 text-center">
          {statsStrip.map(({ label, val, cls }) => (
            <div key={label}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-extrabold ${cls}`}>{val}</p>
            </div>
          ))}
        </div>

        {sectionResults.map((r) => (
          <SectionBlock
            key={r.key}
            label={r.label}
            emoji={SECTION_EMOJI[r.key]}
            color={SECTION_COLOR[r.key]}
            questions={r.qs}
            allQuestions={sub.questions ?? []}
            answers={sub.answers ?? {}}
          />
        ))}

        <div className="flex justify-center gap-4 flex-wrap mt-4">
          <button onClick={handleDownloadReport}
            className="px-6 py-3 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700
                       font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200
                       cursor-pointer flex items-center gap-2">
            📄 Download Report
          </button>
          <button onClick={handleGoHome}
            className="px-6 py-3 bg-[#7FB509] hover:bg-[#6a9a07] text-white font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}