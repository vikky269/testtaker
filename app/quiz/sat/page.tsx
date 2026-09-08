"use client";

// app/quiz/sat/page.tsx
// SmartMathz SAT Readiness Diagnostic — DB-backed progress (same pattern as
// GED: ged_attempts → sat_attempts, same ownership/tab-locking model).
//
// Structurally simpler than GED: this reuses QuizBody's NATIVE isSat/
// satSection support (showSatModal/onContinueMath for the reading→math
// transition, showConfirmModal/showConfirmSubmissionModal for the two
// unanswered-question warnings) — no changes to QuizBody, QuizModals, or
// ResultsScreen were needed; all three already had SAT-specific branches
// built in from the original app.

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, withTimeout } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

import { satQuestions, SAT_SECTIONS, type SATSectionKey } from "@/app/data/satdata";
import { calculateSATSectionScore, calculateSATOverallScore } from "@/app/utils/ScoreUtils";
import QuizBody from "@/app/quizBody/quizBody";
import ResultsScreen from "@/app/modals/resultScreen";

const SECTION_TIME: Record<SATSectionKey, number> = {
  reading: 1500, // 25 min for 10 R&W questions
  math: 1800,    // 30 min for 10 Math questions
};

const SESSION_ID = typeof crypto !== "undefined" && crypto.randomUUID
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2);

type SectionDurations = Record<SATSectionKey, number>;
const EMPTY_DURATIONS: SectionDurations = { reading: 0, math: 0 };

export default function SatQuizPage() {
  const router = useRouter();

  const [section, setSection] = useState<SATSectionKey>("reading");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Native QuizBody modal flags (already exist for the SAT reading→math flow)
  const [showConfirmModal, setShowConfirmModal] = useState(false);           // unanswered — reading section
  const [showSatModal, setShowSatModal] = useState(false);                   // reading complete → offer math
  const [showConfirmSubmissionModal, setShowConfirmSubmissionModal] = useState(false); // unanswered — math (final)
  const [unansweredCount, setUnansweredCount] = useState(0);

  const [restoring, setRestoring] = useState(true);
  const [locked, setLocked] = useState(false);
  const attemptIdRef = useRef<string | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hasSavedRef = useRef(false);
  const studentInfoRef = useRef<{ id: string; fullName: string; email: string; gender: string } | null>(null);

  const sectionStartRef = useRef<Record<SATSectionKey, number | null>>({ reading: null, math: null });
  const sectionDurationRef = useRef<SectionDurations>({ ...EMPTY_DURATIONS });

  // ── Mount: snapshot student, resume or create the attempt ─────────────────
  useEffect(() => {
    const init = async () => {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (!user) { setRestoring(false); return; }

      const { data: profile } = await supabase
        .from("student_profile").select("full_name, gender").eq("id", user.id).maybeSingle();
      studentInfoRef.current = {
        id: user.id,
        fullName: profile?.full_name || user.email || "Student",
        email: user.email ?? "",
        gender: profile?.gender || "N/A",
      };
      localStorage.setItem("activeStudent", JSON.stringify(studentInfoRef.current));

      const { data: existing } = await supabase
        .from("sat_attempts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "in_progress")
        .maybeSingle();

      let attempt = existing;
      if (!attempt) {
        const { data: created, error } = await supabase
          .from("sat_attempts")
          .insert({
            user_id: user.id, status: "in_progress",
            section: "reading", current_question_index: 0,
            answers: {}, section_durations: {},
          })
          .select()
          .single();
        if (error) {
          console.error("Could not start SAT attempt:", error);
          toast.error("Could not start the assessment. Please try again.");
          setRestoring(false);
          return;
        }
        attempt = created;
      } else {
        toast.success("Resuming your SAT assessment — picking up where you left off.");
      }

      attemptIdRef.current = attempt.id;

      await supabase.from("sat_attempts").update({
        active_session_id: SESSION_ID,
        session_claimed_at: new Date().toISOString(),
      }).eq("id", attempt.id);

      const restoredSection = (attempt.section ?? "reading") as SATSectionKey;
      setSection(restoredSection);
      setCurrentQuestionIndex(attempt.current_question_index ?? 0);
      setAnswers(attempt.answers ?? {});
      sectionDurationRef.current = { ...EMPTY_DURATIONS, ...(attempt.section_durations ?? {}) };

      sectionStartRef.current = { reading: null, math: null };
      sectionStartRef.current[restoredSection] = Date.now();

      setRestoring(false);
    };
    init();
  }, []);

  const activeQuestions = useMemo(() => {
    const cfg = SAT_SECTIONS.find((s) => s.key === section)!;
    return satQuestions.slice(cfg.start, cfg.end);
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

  const recordSectionEnd = (key: SATSectionKey) => {
    const start = sectionStartRef.current[key];
    if (start) {
      sectionDurationRef.current[key] += Math.round((Date.now() - start) / 1000);
      sectionStartRef.current[key] = null;
    }
  };

  const proceedToMath = () => {
    recordSectionEnd("reading");
    sectionStartRef.current.math = Date.now();
    setSection("math");
    setCurrentQuestionIndex(0);
    setShowSatModal(false);
    setShowConfirmModal(false);
  };

  // ── Section submit ──────────────────────────────────────────────────────
  const handleSectionSubmit = () => {
    const unanswered = activeQuestions.filter((q) => !answers[q.question]).length;

    if (section === "reading") {
      if (unanswered > 0) { setUnansweredCount(unanswered); setShowConfirmModal(true); return; }
      setShowSatModal(true);
    } else {
      if (unanswered > 0) { setUnansweredCount(unanswered); setShowConfirmSubmissionModal(true); return; }
      finalizeSubmit();
    }
  };

  const handleTimeUp = () => {
    if (section === "reading") proceedToMath();
    else finalizeSubmit();
  };

  // ── Autosave — debounced, ownership-checked ────────────────────────────────
  const flushAttempt = useCallback(async () => {
    if (!attemptIdRef.current) return;

    const { data: owner, error } = await supabase
      .from("sat_attempts")
      .select("active_session_id, status")
      .eq("id", attemptIdRef.current)
      .single();

    if (error) { console.error("SAT ownership check failed:", error); return; }
    if (owner.status !== "in_progress") return;

    if (owner.active_session_id !== SESSION_ID) {
      setLocked(true);
      toast.error(
        "This SAT assessment is open in another tab. Continue there — your answers are saving from that tab.",
        { id: "sat-tab-conflict", duration: 8000 }
      );
      return;
    }

    const { error: saveErr } = await supabase.from("sat_attempts").update({
      section,
      current_question_index: currentQuestionIndex,
      answers,
      section_durations: sectionDurationRef.current,
      updated_at: new Date().toISOString(),
    }).eq("id", attemptIdRef.current);

    if (saveErr) console.error("SAT autosave failed:", saveErr);
  }, [section, currentQuestionIndex, answers]);

  useEffect(() => {
    if (restoring || submitted || locked) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { flushAttempt(); }, 1200);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [section, currentQuestionIndex, answers, restoring, submitted, locked, flushAttempt]);

  // ── Save final result ──────────────────────────────────────────────────────
  const saveToLeaderboard = async (durations: SectionDurations) => {
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

    const readingScore = calculateSATSectionScore("reading", satQuestions, answers);
    const mathScore    = calculateSATSectionScore("math", satQuestions, answers);
    const overall       = calculateSATOverallScore(satQuestions, answers);
    const totalTime = durations.reading + durations.math;

    const payload = {
      full_name: student.fullName,
      email: student.email,
      grade: "SAT",
      math_score: Number(mathScore),
      ela_score: Number(readingScore), // reading & writing stored in the ela_score column
      science_score: 0,
      overall_score: Number(overall),
      total_time: totalTime,
      math_duration: durations.math,
      ela_duration: durations.reading,
      science_duration: null,
      test_type: "sat",
      gender: student.gender,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("leaderboard").insert([payload]);

    if (error) {
      console.error("SAT leaderboard save error:", error);
      hasSavedRef.current = false;
      toast.error("Could not save your result. Please contact SmartMathz.");
      return;
    }

    toast.success("Result saved ✓");

    const { error: subError } = await supabase.from("test_submissions").insert([{
      user_id: student.id,
      full_name: student.fullName,
      email: student.email,
      grade: "SAT",
      test_type: "sat",
      questions: satQuestions,
      answers,
      math_score: Number(mathScore),
      ela_score: Number(readingScore),
      science_score: null,
      overall_score: Number(overall),
      durations: {
        totalDuration: totalTime,
        mathDuration: durations.math,
        elaDuration: durations.reading,
      },
    }]);
    if (subError) console.error("SAT test sheet save error:", subError);
  };

  const finalizeSubmit = () => {
    recordSectionEnd(section);
    setShowConfirmModal(false);
    setShowSatModal(false);
    setShowConfirmSubmissionModal(false);
    setSubmitted(true);

    if (attemptIdRef.current) {
      supabase.from("sat_attempts")
        .update({ status: "submitted", updated_at: new Date().toISOString() })
        .eq("id", attemptIdRef.current);
    }

    setTimeout(() => {
      saveToLeaderboard({ ...sectionDurationRef.current });
    }, 100);
  };

  const handleGoHome = () => {
    localStorage.removeItem("activeStudent");
    router.push("/");
  };

  const handleReview = () => {
    router.push("/quiz/sat/review");
  };

  const readingScore = calculateSATSectionScore("reading", satQuestions, answers);
  const mathScore    = calculateSATSectionScore("math", satQuestions, answers);
  const correctCount = satQuestions.filter((q) => answers[q.question] === q.correctAnswer).length;

  const answeredCount = Object.keys(answers).filter((k) => satQuestions.find((q) => q.question === k)).length;

  if (restoring) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Open in another tab</h2>
          <p className="text-sm text-gray-500 mb-6">
            This SAT assessment is currently open in a different tab or window. Please continue there —
            your answers are being saved from that tab, not this one.
          </p>
          <button onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#7FB509] hover:bg-[#6a9a07] text-white font-bold text-sm rounded-xl cursor-pointer transition-colors">
            I've closed the other tab — try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!submitted ? (
        <QuizBody
          testid="sat"
          stateParam={undefined}
          gradeParam="sat"
          normalizedGrade="sat"
          isSATQuiz={true}
          isGrade9Or10={false}
          isSat={true}
          quizSection="math"           // unused when isSat is true — harmless placeholder
          satSection={section === "reading" ? "reading" : "math"}
          isSatReading={section === "reading"}
          activeQuestions={activeQuestions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          answers={answers}
          timerDuration={SECTION_TIME[section] - (sectionDurationRef.current[section] ?? 0)}
          timerIdentifier={`sat-${section}`}
          onTimeUp={handleTimeUp}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSectionSubmit}
          unansweredCount={unansweredCount}
          showConfirmModal={showConfirmModal}
          showConfirmElaModal={false}
          showConfirmSubmissionModal={showConfirmSubmissionModal}
          showGradeModal={false}
          showScienceModal={false}
          showSatModal={showSatModal}
          onCancelConfirm={() => setShowConfirmModal(false)}
          onConfirmMathSubmit={() => { setShowConfirmModal(false); setShowSatModal(true); }}
          onCancelElaConfirm={() => {}}
          onConfirmElaSubmit={() => {}}
          onCancelSubmission={() => setShowConfirmSubmissionModal(false)}
          onConfirmFinalSubmit={finalizeSubmit}
          onSkipEla={() => {}}
          onTakeEla={() => {}}
          onTakeScience={() => {}}
          onContinueMath={proceedToMath}
        />
      ) : (
        <ResultsScreen
          isGrade9Or10={false}
          isSat={true}
          satReadingScore={Number(readingScore)}
          satMathScore={Number(mathScore)}
          satCorrectCount={correctCount}
          calculateSectionScore={() => null}
          calculateScore={() => ({ combined: calculateSATOverallScore(satQuestions, answers) })}
          totalQuestions={satQuestions.length}
          answeredCount={answeredCount}
          onGoHome={handleGoHome}
          onReview={handleReview}
        />
      )}
    </div>
  );
}