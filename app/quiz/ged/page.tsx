"use client";

// app/quiz/ged/page.tsx
// SmartMathz GED Readiness Diagnostic — a self-contained page, separate from
// the main [testId] quiz page. It does NOT touch or share section-state logic
// with grade-level or SAT quizzes; it only reuses already-shared utilities:
// QuizBody, QuizModals (via QuizBody), supabase client, withTimeout.
//
// Why a separate page rather than folding into [testId]: GED has 4 unequal
// sections (24/22/19/15) where the existing page hardcodes 3 sections of 10.
// Building it standalone means zero risk to any existing grade/SAT flow.

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase, withTimeout } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

import { gedQuestions, GED_SECTIONS, type GEDSectionKey } from "@/app/data/geddata";
import { calculateGEDSectionScore, calculateGEDOverallScore } from "@/app/utils/ScoreUtils";
import QuizBody from "@/app/quizBody/quizBody";
import ResultsScreen from "@/app/modals/resultScreen";

// ── Section config ───────────────────────────────────────────────────────────
const SECTION_ORDER: GEDSectionKey[] = ["math", "rla", "science", "social"];

const GED_STORAGE_KEY = "gedQuizState";

const SECTION_TITLE: Record<GEDSectionKey, string> = {
  math: "Mathematical Reasoning",
  rla: "Reasoning Through Language Arts",
  science: "Science",
  social: "Social Studies",
};

// Per-section time limits, in seconds — adjust freely, this is the only place
// they're defined. (Totals ~2hrs; the source doc recommends 2.5–3hrs across
// two sittings — tune these once you've seen real completion times.)
const SECTION_TIME: Record<GEDSectionKey, number> = {
  math: 2400,    // 40 min for 24 questions
  rla: 2100,     // 35 min for 22 questions
  science: 1500, // 25 min for 19 questions
  social: 1200,  // 20 min for 15 questions
};

export default function GedQuizPage() {
  const router = useRouter();

  const [section, setSection] = useState<GEDSectionKey>("math");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [transitionModal, setTransitionModal] = useState<{ fromLabel: string; toLabel: string; next: GEDSectionKey } | null>(null);
  const [unansweredModal, setUnansweredModal] = useState<{ count: number; toLabel: string; isFinal: boolean } | null>(null);

  const hasSavedRef = useRef(false);
  const studentInfoRef = useRef<{ id: string; fullName: string; email: string; gender: string } | null>(null);

  // Per-section elapsed time tracking (seconds), for the leaderboard/report
  const sectionStartRef = useRef<Record<GEDSectionKey, number | null>>({ math: null, rla: null, science: null, social: null });
  const sectionDurationRef = useRef<Record<GEDSectionKey, number>>({ math: 0, rla: 0, science: 0, social: 0 });

  // ── Snapshot the logged-in student once, at quiz start (same pattern as the main quiz page) ──
  useEffect(() => {
    const captureStudent = async () => {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (!user) return;
      const { data: profile } = await supabase
        .from("student_profile").select("full_name, gender").eq("id", user.id).maybeSingle();
      studentInfoRef.current = {
        id: user.id,
        fullName: profile?.full_name || user.email || "Student",
        email: user.email ?? "",
        gender: profile?.gender || "N/A",
      };
      localStorage.setItem("activeStudent", JSON.stringify(studentInfoRef.current));
    };
    captureStudent();
    sectionStartRef.current.math = Date.now();
  }, []);


  useEffect(() => {
  const saved = localStorage.getItem(GED_STORAGE_KEY);
  if (!saved) return;
  try {
    const p = JSON.parse(saved);
    if (p.section) setSection(p.section);
    if (p.answers) setAnswers(p.answers);
    if (typeof p.currentQuestionIndex === "number") setCurrentQuestionIndex(p.currentQuestionIndex);
    if (p.sectionDurations) sectionDurationRef.current = p.sectionDurations;
    // Resume the timer for whichever section we're restoring into
    sectionStartRef.current = { math: null, rla: null, science: null, social: null };
    sectionStartRef.current[(p.section ?? "math") as GEDSectionKey] = Date.now();
  } catch {}
}, []);



useEffect(() => {
  if (submitted) return; // don't keep writing once it's done
  localStorage.setItem(GED_STORAGE_KEY, JSON.stringify({
    section, currentQuestionIndex, answers,
    sectionDurations: sectionDurationRef.current,
  }));
}, [section, currentQuestionIndex, answers, submitted]);



  // ── Active questions for the current section ─────────────────────────────
  const activeQuestions = useMemo(() => {
    const cfg = GED_SECTIONS.find((s) => s.key === section)!;
    return gedQuestions.slice(cfg.start, cfg.end);
  }, [section]);

  const handleSelect = (question: string, option: string) => {
    if (answers[question] === option) {
      const u = { ...answers }; delete u[question]; setAnswers(u);
    } else {
      setAnswers({ ...answers, [question]: option });
    }
  };
  const handleNext = () => { if (currentQuestionIndex < activeQuestions.length - 1) setCurrentQuestionIndex((p) => p + 1); };
  const handlePrev = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex((p) => p - 1); };

  const recordSectionEnd = (key: GEDSectionKey) => {
    const start = sectionStartRef.current[key];
    if (start) {
      sectionDurationRef.current[key] += Math.round((Date.now() - start) / 1000);
      sectionStartRef.current[key] = null;
    }
  };

  const proceedToSection = (next: GEDSectionKey) => {
    recordSectionEnd(section);
    sectionStartRef.current[next] = Date.now();
    setSection(next);
    setCurrentQuestionIndex(0);
    setTransitionModal(null);
    setUnansweredModal(null);
  };

  // ── Section submit — called when "Submit Quiz" is clicked at the end of a section ──
  const handleSectionSubmit = () => {
    const unanswered = activeQuestions.filter((q) => !answers[q.question]).length;
    const nextIndex = SECTION_ORDER.indexOf(section) + 1;
    const next = SECTION_ORDER[nextIndex];

    if (unanswered > 0) {
      setUnansweredModal({
        count: unanswered,
        toLabel: next ? SECTION_TITLE[next] : "",
        isFinal: !next,
      });
      return;
    }
    if (next) {
      setTransitionModal({ fromLabel: SECTION_TITLE[section], toLabel: SECTION_TITLE[next], next });
    } else {
      finalizeSubmit();
    }
  };

  const confirmUnanswered = () => {
    const nextIndex = SECTION_ORDER.indexOf(section) + 1;
    const next = SECTION_ORDER[nextIndex];
    setUnansweredModal(null);
    if (next) proceedToSection(next);
    else finalizeSubmit();
  };

  const confirmTransition = () => { if (transitionModal) proceedToSection(transitionModal.next); };

  // Time runs out on the current section — auto-advance (or auto-submit on the last section)
  const handleTimeUp = () => {
    const nextIndex = SECTION_ORDER.indexOf(section) + 1;
    const next = SECTION_ORDER[nextIndex];
    if (next) proceedToSection(next);
    else finalizeSubmit();
  };

  // ── Save to leaderboard + test_submissions (same pattern as the main quiz page) ──
  const saveToLeaderboard = async (durations: Record<GEDSectionKey, number>) => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    let student = studentInfoRef.current;
    if (!student) {
      const saved = localStorage.getItem("activeStudent");
      if (saved) { try { student = JSON.parse(saved); } catch {} }
    }
    if (!student) {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (user) {
        const { data: profile } = await supabase
          .from("student_profile").select("full_name, gender").eq("id", user.id).maybeSingle();
        student = {
          id: user.id,
          fullName: profile?.full_name || user.email || "Student",
          email: user.email ?? "",
          gender: profile?.gender || "N/A",
        };
      }
    }
    if (!student) {
      toast.error("You're not logged in — this result will NOT be saved!", { duration: 8000 });
      hasSavedRef.current = false;
      return;
    }

    const mathScore   = calculateGEDSectionScore("math", gedQuestions, answers);
    const rlaScore    = calculateGEDSectionScore("rla", gedQuestions, answers);
    const scienceScore = calculateGEDSectionScore("science", gedQuestions, answers);
    const socialScore  = calculateGEDSectionScore("social", gedQuestions, answers);
    const overall       = calculateGEDOverallScore(gedQuestions, answers);

    const totalTime = durations.math + durations.rla + durations.science + durations.social;

    const payload = {
      full_name: student.fullName,
      email: student.email,
      grade: "GED",
      math_score: Number(mathScore),
      ela_score: Number(rlaScore),          // RLA stored in the ela_score column (closest semantic fit)
      science_score: Number(scienceScore),
      social_studies_score: Number(socialScore), // new column
      overall_score: Number(overall),
      total_time: totalTime,
      math_duration: durations.math,
      ela_duration: durations.rla,
      science_duration: durations.science,
      test_type: "ged",
      gender: student.gender,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("leaderboard").insert([payload]);

    if (error) {
      console.error("GED leaderboard save error:", error);
      hasSavedRef.current = false;
      toast.error("Could not save your result. Please contact SmartMathz.");
      return;
    }

    toast.success("Result saved ✓");

    const { error: subError } = await supabase.from("test_submissions").insert([{
      user_id: student.id,
      full_name: student.fullName,
      email: student.email,
      grade: "GED",
      test_type: "ged",
      questions: gedQuestions,
      answers,
      math_score: Number(mathScore),
      ela_score: Number(rlaScore),
      science_score: Number(scienceScore),
      social_studies_score: Number(socialScore),
      overall_score: Number(overall),
      durations: {
        totalDuration: totalTime,
        mathDuration: durations.math,
        elaDuration: durations.rla,
        scienceDuration: durations.science,
        socialDuration: durations.social,
      },
    }]);
    if (subError) console.error("GED test sheet save error:", subError);
  };

const finalizeSubmit = () => {
  recordSectionEnd(section);
  setTransitionModal(null);
  setUnansweredModal(null);
  setSubmitted(true);
  localStorage.removeItem(GED_STORAGE_KEY);   // ← add this
  setTimeout(() => {
    saveToLeaderboard({ ...sectionDurationRef.current });
  }, 100);
};


  const handleGoHome = () => {
    localStorage.removeItem("activeStudent");
    localStorage.removeItem(GED_STORAGE_KEY);   // ← add this
    router.push("/");
  };

  // Review page for GED is a follow-up build — for now, "Review" isn't offered;
  // students see their scores here and can go home. (Flagged, not silently skipped.)
  const handleReview = () => {
    toast("Detailed review for the GED assessment is coming soon.", { icon: "🛠️" });
  };

  const gedScores = useMemo(() => ({
    math: calculateGEDSectionScore("math", gedQuestions, answers),
    rla: calculateGEDSectionScore("rla", gedQuestions, answers),
    science: calculateGEDSectionScore("science", gedQuestions, answers),
    social: calculateGEDSectionScore("social", gedQuestions, answers),
    overall: calculateGEDOverallScore(gedQuestions, answers),
  }), [answers]);

  const answeredCount = Object.keys(answers).filter((k) => gedQuestions.find((q) => q.question === k)).length;

  return (
    <div>
      {!submitted ? (
        <QuizBody
          testid="ged"
          stateParam={undefined}
          gradeParam="ged"
          normalizedGrade="ged"
          isSATQuiz={false}
          isGrade9Or10={false}
          isSat={false}
          isGed={true}
          quizSection={section}
          satSection="reading"
          isSatReading={false}
          activeQuestions={activeQuestions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          answers={answers}
          timerDuration={SECTION_TIME[section]}
          timerIdentifier={`ged-${section}`}
          onTimeUp={handleTimeUp}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSectionSubmit}
          unansweredCount={0}
          showConfirmModal={false}
          showConfirmElaModal={false}
          showConfirmSubmissionModal={false}
          showGradeModal={false}
          showScienceModal={false}
          showSatModal={false}
          onCancelConfirm={() => {}}
          onConfirmMathSubmit={() => {}}
          onCancelElaConfirm={() => {}}
          onConfirmElaSubmit={() => {}}
          onCancelSubmission={() => {}}
          onConfirmFinalSubmit={() => {}}
          onSkipEla={() => {}}
          onTakeEla={() => {}}
          onTakeScience={() => {}}
          onContinueMath={() => {}}
          gedTransitionModal={transitionModal ? { fromLabel: transitionModal.fromLabel, toLabel: transitionModal.toLabel } : null}
          onGedTransitionContinue={confirmTransition}
          gedUnansweredModal={unansweredModal}
          onGedUnansweredCancel={() => setUnansweredModal(null)}
          onGedUnansweredConfirm={confirmUnanswered}
        />
      ) : (
        <ResultsScreen
          isGrade9Or10={false}
          isSat={false}
          isGed={true}
          gedScores={gedScores}
          calculateSectionScore={() => null}
          calculateScore={() => ({ combined: gedScores.overall })}
          totalQuestions={gedQuestions.length}
          answeredCount={answeredCount}
          onGoHome={handleGoHome}
          onReview={handleReview}
        />
      )}
    </div>
  );
}