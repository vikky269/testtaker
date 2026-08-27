"use client";

// app/quiz/ged/page.tsx
// SmartMathz GED Readiness Diagnostic — DB-backed progress (survives refresh,
// closed tabs, even a crashed browser), modeled on the AssessmentTaker
// pattern: an in-progress "attempt" row, claimed per tab via a session id,
// debounce-autosaved, with an ownership check before every write so a
// second tab can never silently overwrite the winning one's answers.
//
// Simplified vs. AssessmentTaker: GED is single-answer MCQ against a static
// question bank, so the whole answer map lives in one jsonb column instead
// of a per-question answers table — same durability, far less plumbing.

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, withTimeout } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

import { gedQuestions, GED_SECTIONS, type GEDSectionKey } from "@/app/data/geddata";
import { calculateGEDSectionScore, calculateGEDOverallScore } from "@/app/utils/ScoreUtils";
import QuizBody from "@/app/quizBody/quizBody";
import ResultsScreen from "@/app/modals/resultScreen";

// ── Section config ───────────────────────────────────────────────────────────
const SECTION_ORDER: GEDSectionKey[] = ["math", "rla", "science", "social"];

const SECTION_TITLE: Record<GEDSectionKey, string> = {
  math: "Mathematical Reasoning",
  rla: "Reasoning Through Language Arts",
  science: "Science",
  social: "Social Studies",
};

const SECTION_TIME: Record<GEDSectionKey, number> = {
  math: 2400, rla: 2100, science: 1500, social: 1200,
};

// Unique per tab, per page load — the same tab-locking mechanism AssessmentTaker uses
const SESSION_ID = typeof crypto !== "undefined" && crypto.randomUUID
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2);

type SectionDurations = Record<GEDSectionKey, number>;
const EMPTY_DURATIONS: SectionDurations = { math: 0, rla: 0, science: 0, social: 0 };

export default function GedQuizPage() {
  const router = useRouter();

  const [section, setSection] = useState<GEDSectionKey>("math");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [transitionModal, setTransitionModal] = useState<{ fromLabel: string; toLabel: string; next: GEDSectionKey } | null>(null);
  const [unansweredModal, setUnansweredModal] = useState<{ count: number; toLabel: string; isFinal: boolean } | null>(null);

  // ── DB attempt state ─────────────────────────────────────────────────────
  const [restoring, setRestoring] = useState(true);   // true until initial load/resume completes
  const [locked, setLocked] = useState(false);         // true if another tab has taken over this attempt
  const attemptIdRef = useRef<string | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hasSavedRef = useRef(false);
  const studentInfoRef = useRef<{ id: string; fullName: string; email: string; gender: string } | null>(null);

  const sectionStartRef = useRef<Record<GEDSectionKey, number | null>>({ math: null, rla: null, science: null, social: null });
  const sectionDurationRef = useRef<SectionDurations>({ ...EMPTY_DURATIONS });

  // ── Mount: snapshot student, then resume or create the attempt ─────────────
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

      // Look for an existing in-progress attempt for this student
      const { data: existing } = await supabase
        .from("ged_attempts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "in_progress")
        .maybeSingle();

      let attempt = existing;

      if (!attempt) {
        const { data: created, error } = await supabase
          .from("ged_attempts")
          .insert({
            user_id: user.id, status: "in_progress",
            section: "math", current_question_index: 0,
            answers: {}, section_durations: {},
          })
          .select()
          .single();
        if (error) {
          console.error("Could not start GED attempt:", error);
          toast.error("Could not start the assessment. Please try again.");
          setRestoring(false);
          return;
        }
        attempt = created;
      } else {
        toast.success("Resuming your GED assessment — picking up where you left off.");
      }

      attemptIdRef.current = attempt.id;

      // Claim it for this tab — any other tab holding it becomes locked out
      await supabase.from("ged_attempts").update({
        active_session_id: SESSION_ID,
        session_claimed_at: new Date().toISOString(),
      }).eq("id", attempt.id);

      // Restore state
      const restoredSection = (attempt.section ?? "math") as GEDSectionKey;
      setSection(restoredSection);
      setCurrentQuestionIndex(attempt.current_question_index ?? 0);
      setAnswers(attempt.answers ?? {});
      sectionDurationRef.current = { ...EMPTY_DURATIONS, ...(attempt.section_durations ?? {}) };

      sectionStartRef.current = { math: null, rla: null, science: null, social: null };
      sectionStartRef.current[restoredSection] = Date.now();

      setRestoring(false);
    };
    init();
  }, []);

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

  // ── Section submit ──────────────────────────────────────────────────────
  const handleSectionSubmit = () => {
    const unanswered = activeQuestions.filter((q) => !answers[q.question]).length;
    const nextIndex = SECTION_ORDER.indexOf(section) + 1;
    const next = SECTION_ORDER[nextIndex];

    if (unanswered > 0) {
      setUnansweredModal({ count: unanswered, toLabel: next ? SECTION_TITLE[next] : "", isFinal: !next });
      return;
    }
    if (next) setTransitionModal({ fromLabel: SECTION_TITLE[section], toLabel: SECTION_TITLE[next], next });
    else finalizeSubmit();
  };

  const confirmUnanswered = () => {
    const nextIndex = SECTION_ORDER.indexOf(section) + 1;
    const next = SECTION_ORDER[nextIndex];
    setUnansweredModal(null);
    if (next) proceedToSection(next);
    else finalizeSubmit();
  };

  const confirmTransition = () => { if (transitionModal) proceedToSection(transitionModal.next); };

  const handleTimeUp = () => {
    const nextIndex = SECTION_ORDER.indexOf(section) + 1;
    const next = SECTION_ORDER[nextIndex];
    if (next) proceedToSection(next);
    else finalizeSubmit();
  };

  // ── Autosave — debounced, ownership-checked before every write ────────────
  const flushAttempt = useCallback(async () => {
    if (!attemptIdRef.current) return;

    const { data: owner, error } = await supabase
      .from("ged_attempts")
      .select("active_session_id, status")
      .eq("id", attemptIdRef.current)
      .single();

    if (error) { console.error("GED ownership check failed:", error); return; }
    if (owner.status !== "in_progress") return; // already finalized (e.g. from another tab)

    if (owner.active_session_id !== SESSION_ID) {
      setLocked(true);
      toast.error(
        "This GED assessment is open in another tab. Continue there — your answers are saving from that tab.",
        { id: "ged-tab-conflict", duration: 8000 }
      );
      return;
    }

    const { error: saveErr } = await supabase.from("ged_attempts").update({
      section,
      current_question_index: currentQuestionIndex,
      answers,
      section_durations: sectionDurationRef.current,
      updated_at: new Date().toISOString(),
    }).eq("id", attemptIdRef.current);

    if (saveErr) console.error("GED autosave failed:", saveErr);
  }, [section, currentQuestionIndex, answers]);

  useEffect(() => {
    if (restoring || submitted || locked) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { flushAttempt(); }, 1200);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [section, currentQuestionIndex, answers, restoring, submitted, locked, flushAttempt]);

  // ── Save final result to leaderboard + test_submissions (unchanged) ───────
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

    const mathScore    = calculateGEDSectionScore("math", gedQuestions, answers);
    const rlaScore     = calculateGEDSectionScore("rla", gedQuestions, answers);
    const scienceScore = calculateGEDSectionScore("science", gedQuestions, answers);
    const socialScore  = calculateGEDSectionScore("social", gedQuestions, answers);
    const overall       = calculateGEDOverallScore(gedQuestions, answers);

    const totalTime = durations.math + durations.rla + durations.science + durations.social;

    const payload = {
      full_name: student.fullName,
      email: student.email,
      grade: "GED",
      math_score: Number(mathScore),
      ela_score: Number(rlaScore),
      science_score: Number(scienceScore),
      social_studies_score: Number(socialScore),
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

    if (attemptIdRef.current) {
      supabase.from("ged_attempts")
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
    router.push("/quiz/ged/review");
  };

  const gedScores = useMemo(() => ({
    math: calculateGEDSectionScore("math", gedQuestions, answers),
    rla: calculateGEDSectionScore("rla", gedQuestions, answers),
    science: calculateGEDSectionScore("science", gedQuestions, answers),
    social: calculateGEDSectionScore("social", gedQuestions, answers),
    overall: calculateGEDOverallScore(gedQuestions, answers),
  }), [answers]);

  const answeredCount = Object.keys(answers).filter((k) => gedQuestions.find((q) => q.question === k)).length;

  // ── Guards ─────────────────────────────────────────────────────────────
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
            This GED assessment is currently open in a different tab or window. Please continue there —
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
          timerDuration={SECTION_TIME[section] - (sectionDurationRef.current[section] ?? 0)}
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