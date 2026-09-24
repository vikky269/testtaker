"use client";

// app/quiz/psat/page.tsx
// SmartMathz PSAT Readiness Diagnostic — 4 modules (R&W x2, Math x2), each
// module's question set randomly drawn ONCE per attempt and locked into the
// psat_attempts row, so a refresh/resume never reshuffles what the student
// already saw. Same DB-backed ownership/tab-locking pattern as GED and SAT.

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, withTimeout } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

import {
  MODULE_ORDER, MODULE_TITLE, MODULE_TIME, RW_TOTAL, MATH_TOTAL,
  type PSATModuleKey,
} from "@/app/data/pSatconfig";
import { drawFullAttempt, lookupByIds, idsOf, type PSATQuestion } from "@/app/utils/pSatRandomizer";
import { calculateArrayScore } from "@/app/utils/ScoreUtils";
import QuizBody from "@/app/quizBody/quizBody";
import ResultsScreen from "@/app/modals/resultScreen";

const SESSION_ID = typeof crypto !== "undefined" && crypto.randomUUID
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2);

type ModuleDurations = Record<PSATModuleKey, number>;
const EMPTY_DURATIONS: ModuleDurations = { rw1: 0, rw2: 0, math1: 0, math2: 0 };

export default function PsatQuizPage() {
  const router = useRouter();

  const [currentModule, setCurrentModule] = useState<PSATModuleKey>("rw1");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // The drawn (or resumed/reconstructed) question sets for each module
  const [moduleQuestions, setModuleQuestions] = useState<Record<PSATModuleKey, PSATQuestion[]> | null>(null);

  const [transitionModal, setTransitionModal] = useState<{ fromLabel: string; toLabel: string; next: PSATModuleKey } | null>(null);
  const [unansweredModal, setUnansweredModal] = useState<{ count: number; toLabel: string; isFinal: boolean } | null>(null);

  const [restoring, setRestoring] = useState(true);
  const [locked, setLocked] = useState(false);
  const attemptIdRef = useRef<string | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hasSavedRef = useRef(false);
  const studentInfoRef = useRef<{ id: string; fullName: string; email: string; gender: string } | null>(null);

  const moduleStartRef = useRef<Record<PSATModuleKey, number | null>>({ rw1: null, rw2: null, math1: null, math2: null });
  const moduleDurationRef = useRef<ModuleDurations>({ ...EMPTY_DURATIONS });

  // ── Mount: snapshot student, then resume or draw-and-create the attempt ────
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
        .from("psat_attempts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "in_progress")
        .maybeSingle();

      let attempt = existing;

      if (!attempt) {
        // Brand-new attempt — draw all 4 modules ONCE, lock the ids into the row
        const drawn = drawFullAttempt();
        const { data: created, error } = await supabase
          .from("psat_attempts")
          .insert({
            user_id: user.id, status: "in_progress",
            module: "rw1", current_question_index: 0,
            rw_module1_ids: idsOf(drawn.rw1),
            rw_module2_ids: idsOf(drawn.rw2),
            math_module1_ids: idsOf(drawn.math1),
            math_module2_ids: idsOf(drawn.math2),
            answers: {}, module_durations: {},
          })
          .select()
          .single();
        if (error) {
          console.error("Could not start PSAT attempt:", error);
          toast.error("Could not start the assessment. Please try again.");
          setRestoring(false);
          return;
        }
        attempt = created;
        setModuleQuestions(drawn);
      } else {
        toast.success("Resuming your PSAT assessment — picking up where you left off.");
        // Rebuild each module's questions from the STORED ids — never re-draw
        setModuleQuestions({
          rw1: lookupByIds("rw1", attempt.rw_module1_ids ?? []),
          rw2: lookupByIds("rw2", attempt.rw_module2_ids ?? []),
          math1: lookupByIds("math1", attempt.math_module1_ids ?? []),
          math2: lookupByIds("math2", attempt.math_module2_ids ?? []),
        });
      }

      attemptIdRef.current = attempt.id;

      await supabase.from("psat_attempts").update({
        active_session_id: SESSION_ID,
        session_claimed_at: new Date().toISOString(),
      }).eq("id", attempt.id);

      const restoredModule = (attempt.module ?? "rw1") as PSATModuleKey;
      setCurrentModule(restoredModule);
      setCurrentQuestionIndex(attempt.current_question_index ?? 0);
      setAnswers(attempt.answers ?? {});
      moduleDurationRef.current = { ...EMPTY_DURATIONS, ...(attempt.module_durations ?? {}) };

      moduleStartRef.current = { rw1: null, rw2: null, math1: null, math2: null };
      moduleStartRef.current[restoredModule] = Date.now();

      setRestoring(false);
    };
    init();
  }, []);

  const activeQuestions = useMemo(() => {
    if (!moduleQuestions) return [];
    return moduleQuestions[currentModule];
  }, [moduleQuestions, currentModule]);

  const handleSelect = (question: string, option: string) => {
    if (answers[question] === option) {
      const u = { ...answers }; delete u[question]; setAnswers(u);
    } else {
      setAnswers({ ...answers, [question]: option });
    }
  };
  const handleNext = () => { if (currentQuestionIndex < activeQuestions.length - 1) setCurrentQuestionIndex((p) => p + 1); };
  const handlePrev = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex((p) => p - 1); };

  const recordModuleEnd = (key: PSATModuleKey) => {
    const start = moduleStartRef.current[key];
    if (start) {
      moduleDurationRef.current[key] += Math.round((Date.now() - start) / 1000);
      moduleStartRef.current[key] = null;
    }
  };

  const proceedToModule = (next: PSATModuleKey) => {
    recordModuleEnd(currentModule);
    moduleStartRef.current[next] = Date.now();
    setCurrentModule(next);
    setCurrentQuestionIndex(0);
    setTransitionModal(null);
    setUnansweredModal(null);
  };

  const handleModuleSubmit = () => {
    const unanswered = activeQuestions.filter((q) => !answers[q.question]).length;
    const nextIndex = MODULE_ORDER.indexOf(currentModule) + 1;
    const next = MODULE_ORDER[nextIndex];

    if (unanswered > 0) {
      setUnansweredModal({ count: unanswered, toLabel: next ? MODULE_TITLE[next] : "", isFinal: !next });
      return;
    }
    if (next) setTransitionModal({ fromLabel: MODULE_TITLE[currentModule], toLabel: MODULE_TITLE[next], next });
    else finalizeSubmit();
  };

  const confirmUnanswered = () => {
    const nextIndex = MODULE_ORDER.indexOf(currentModule) + 1;
    const next = MODULE_ORDER[nextIndex];
    setUnansweredModal(null);
    if (next) proceedToModule(next);
    else finalizeSubmit();
  };

  const confirmTransition = () => { if (transitionModal) proceedToModule(transitionModal.next); };

  const handleTimeUp = () => {
    const nextIndex = MODULE_ORDER.indexOf(currentModule) + 1;
    const next = MODULE_ORDER[nextIndex];
    if (next) proceedToModule(next);
    else finalizeSubmit();
  };

  // ── Autosave — debounced, ownership-checked ────────────────────────────────
  const flushAttempt = useCallback(async () => {
    if (!attemptIdRef.current) return;

    const { data: owner, error } = await supabase
      .from("psat_attempts")
      .select("active_session_id, status")
      .eq("id", attemptIdRef.current)
      .single();

    if (error) { console.error("PSAT ownership check failed:", error); return; }
    if (owner.status !== "in_progress") return;

    if (owner.active_session_id !== SESSION_ID) {
      setLocked(true);
      toast.error(
        "This PSAT assessment is open in another tab. Continue there — your answers are saving from that tab.",
        { id: "psat-tab-conflict", duration: 8000 }
      );
      return;
    }

    const { error: saveErr } = await supabase.from("psat_attempts").update({
      module: currentModule,
      current_question_index: currentQuestionIndex,
      answers,
      module_durations: moduleDurationRef.current,
      updated_at: new Date().toISOString(),
    }).eq("id", attemptIdRef.current);

    if (saveErr) console.error("PSAT autosave failed:", saveErr);
  }, [currentModule, currentQuestionIndex, answers]);

  useEffect(() => {
    if (restoring || submitted || locked || !moduleQuestions) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { flushAttempt(); }, 1200);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [currentModule, currentQuestionIndex, answers, restoring, submitted, locked, moduleQuestions, flushAttempt]);

  // ── Final save ──────────────────────────────────────────────────────────────
  const saveToLeaderboard = async (durations: ModuleDurations) => {
    if (hasSavedRef.current || !moduleQuestions) return;
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

    // Concatenated order matches PSAT_SECTIONS in psatConfig.ts: rw1, rw2, math1, math2
    const allQuestions = [...moduleQuestions.rw1, ...moduleQuestions.rw2, ...moduleQuestions.math1, ...moduleQuestions.math2];
    const rwQuestions = [...moduleQuestions.rw1, ...moduleQuestions.rw2];
    const mathQuestions = [...moduleQuestions.math1, ...moduleQuestions.math2];

    const rwScore = calculateArrayScore(rwQuestions, answers);
    const mathScore = calculateArrayScore(mathQuestions, answers);
    const overall = calculateArrayScore(allQuestions, answers);

    const totalTime = durations.rw1 + durations.rw2 + durations.math1 + durations.math2;

    const payload = {
      full_name: student.fullName,
      email: student.email,
      grade: "PSAT",
      math_score: Number(mathScore),
      ela_score: Number(rwScore), // Reading & Writing stored in the ela_score column
      science_score: 0,
      overall_score: Number(overall),
      total_time: totalTime,
      math_duration: durations.math1 + durations.math2,
      ela_duration: durations.rw1 + durations.rw2,
      science_duration: null,
      test_type: "psat",
      gender: student.gender,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("leaderboard").insert([payload]);

    if (error) {
      console.error("PSAT leaderboard save error:", error);
      hasSavedRef.current = false;
      toast.error("Could not save your result. Please contact SmartMathz.");
      return;
    }

    toast.success("Result saved ✓");

    const { error: subError } = await supabase.from("test_submissions").insert([{
      user_id: student.id,
      full_name: student.fullName,
      email: student.email,
      grade: "PSAT",
      test_type: "psat",
      questions: allQuestions, // full 98 drawn question objects, self-contained
      answers,
      math_score: Number(mathScore),
      ela_score: Number(rwScore),
      science_score: null,
      overall_score: Number(overall),
      durations: {
        totalDuration: totalTime,
        mathDuration: durations.math1 + durations.math2,
        elaDuration: durations.rw1 + durations.rw2,
        rw1Duration: durations.rw1, rw2Duration: durations.rw2,
        math1Duration: durations.math1, math2Duration: durations.math2,
      },
    }]);
    if (subError) console.error("PSAT test sheet save error:", subError);
  };

  const finalizeSubmit = () => {
    recordModuleEnd(currentModule);
    setTransitionModal(null);
    setUnansweredModal(null);
    setSubmitted(true);

    if (attemptIdRef.current) {
      supabase.from("psat_attempts")
        .update({ status: "submitted", updated_at: new Date().toISOString() })
        .eq("id", attemptIdRef.current);
    }

    setTimeout(() => {
      saveToLeaderboard({ ...moduleDurationRef.current });
    }, 100);
  };

  const handleGoHome = () => {
    localStorage.removeItem("activeStudent");
    router.push("/");
  };

  const handleReview = () => {
    router.push("/quiz/psat/review");
  };

  // ── Guards ─────────────────────────────────────────────────────────────
  if (restoring || !moduleQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Preparing your assessment...</p>
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
            This PSAT assessment is currently open in a different tab or window. Please continue there —
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

  if (submitted) {
    const rwQuestions = [...moduleQuestions.rw1, ...moduleQuestions.rw2];
    const mathQuestions = [...moduleQuestions.math1, ...moduleQuestions.math2];
    const overallScore = calculateArrayScore([...rwQuestions, ...mathQuestions], answers);
    const answeredCount = Object.keys(answers).filter((k) =>
      [...rwQuestions, ...mathQuestions].find((q) => q.question === k)
    ).length;

    return (
      <ResultsScreen
        isGrade9Or10={false}
        isSat={true} // reuses the native SAT readiness-band UI — same 2-score-card layout fits PSAT
        satReadingScore={Number(calculateArrayScore(rwQuestions, answers))}
        satMathScore={Number(calculateArrayScore(mathQuestions, answers))}
        satCorrectCount={[...rwQuestions, ...mathQuestions].filter((q) => answers[q.question] === q.correctAnswer).length}
        calculateSectionScore={() => null}
        calculateScore={() => ({ combined: overallScore })}
        totalQuestions={rwQuestions.length + mathQuestions.length}
        answeredCount={answeredCount}
        onGoHome={handleGoHome}
        onReview={handleReview}
      />
    );
  }

  return (
    <QuizBody
      testid="psat"
      stateParam={undefined}
      gradeParam="psat"
      normalizedGrade="psat"
      isSATQuiz={false}
      isGrade9Or10={false}
      isSat={false}
      isPsat={true}
      quizSection={currentModule as any}
      satSection="reading"
      isSatReading={false}
      activeQuestions={activeQuestions}
      currentQuestionIndex={currentQuestionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      answers={answers}
      timerDuration={MODULE_TIME[currentModule] - (moduleDurationRef.current[currentModule] ?? 0)}
      timerIdentifier={`psat-${currentModule}`}
      onTimeUp={handleTimeUp}
      onSelect={handleSelect}
      onNext={handleNext}
      onPrev={handlePrev}
      onSubmit={handleModuleSubmit}
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
  );
}