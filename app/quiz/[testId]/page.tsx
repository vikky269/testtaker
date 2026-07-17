
"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import quizData from "@/app/data/quizdata";
import standardsData from "@/app/data/statetestdata";
import { quizAssessmentData } from "@/app/data/quizassessmentdata";
import { useQuiz } from "@/app/context/QuizContext";

import { calculateScore, calculateSectionScore } from "@/app/utils/ScoreUtils";
import { useQuizTimer } from "@/app/hooks/useQuizTimer";
import QuizBody from "@/app/quizBody/quizBody";
import ResultsScreen from "@/app/modals/resultScreen";
import { supabase, withTimeout } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

type QuizSection = "math" | "ela" | "science";
type SatSection  = "reading" | "math";

export default function Quiz() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const router       = useRouter();
   const params = useParams();
   const testId = params.testId as string;

  const testid          = pathname.split("/").pop();
  const stateParam      = searchParams.get("state")?.toLowerCase();
  const gradeParam      = searchParams.get("grade");
  const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "") ?? "";
  const isSATQuiz       = ["sat", "ssat"].includes(normalizedGrade) && testid !== "state-test";
  const { answers, setAnswers } = useQuiz();

  const [quizQuestions, setQuizQuestions]               = useState<any[]>([]);
  const [submitted, setSubmitted]                       = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSection, setQuizSection]                   = useState<QuizSection>("math");
  const [satSection, setSatSection]                     = useState<SatSection>("reading");
  const [isSatReading, setIsSatReading]                 = useState(true);

  // SAT section scores
  const [satReadingScore, setSatReadingScore] = useState<number | null>(null);
  const [satMathScore, setSatMathScore]       = useState<number | null>(null);

  const [showConfirmModal, setShowConfirmModal]                     = useState(false);
  const [showConfirmElaModal, setShowConfirmElaModal]               = useState(false);
  const [showConfirmSubmissionModal, setShowConfirmSubmissionModal] = useState(false);
  const [showGradeModal, setShowGradeModal]                         = useState(false);
  const [showScienceModal, setShowScienceModal]                     = useState(false);
  const [showSatModal, setShowSatModal]                             = useState(false);
  const [unansweredCount, setUnansweredCount]                       = useState(0);

  const questionRef = useRef<HTMLDivElement | null>(null);
  const hasSavedRef = useRef(false);

  const isSat = ["sat", "ssat"].includes(normalizedGrade);
  const isGrade9Or10 = [
    "9th-grade","10th-grade","8th-grade","7th-grade","6th-grade",
    "5th-grade","4th-grade","3rd-grade","11th-grade","12th-grade",
    "2nd-grade","1st-grade","pre-k","kindergarten",
  ].includes(normalizedGrade);

  const mathSectionQuestions    = isGrade9Or10 ? quizQuestions.slice(0, 10)  : [];
  const elaSectionQuestions     = isGrade9Or10 ? quizQuestions.slice(10, 20) : [];
  const scienceSectionQuestions = isGrade9Or10 ? quizQuestions.slice(20)     : [];
  const readingQuestions        = isSat        ? quizQuestions.slice(0, 10)  : [];
  const satMathQuestions        = isSat        ? quizQuestions.slice(10)     : [];

  const activeQuestions = isSat
    ? (satSection === "reading" ? readingQuestions : satMathQuestions)
    : isGrade9Or10
    ? (quizSection === "math"  ? mathSectionQuestions
       : quizSection === "ela" ? elaSectionQuestions
       : scienceSectionQuestions)
    : quizQuestions;

  const {
    timeState, getDurations,
    setMathStartTime, setMathEndTime,
    setElaStartTime,  setElaEndTime,
    setScienceStartTime, setTotalTestEndTime,
  } = useQuizTimer({ testid, gradeParam, isGrade9Or10, isSat, quizSection, submitted });

  const {
    mathStartTime, mathEndTime,
    elaStartTime,  elaEndTime,
    scienceStartTime, scienceEndTime,
    totalTestStartTime, totalTestEndTime,
  } = timeState;

  useEffect(() => {
    if (questionRef.current)
      questionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentQuestionIndex]);

  // ── Restore state from localStorage on mount ──────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("quizState");
    if (saved) {
      const p = JSON.parse(saved);
      if (p.testid === testid && p.gradeParam === gradeParam) {
        setAnswers(p.answers || {});
        setCurrentQuestionIndex(p.currentQuestionIndex || 0);
        setSubmitted(p.submitted || false);
        setSatSection(p.satSection || "reading");
        setQuizSection(p.quizSection || "math");
        setIsSatReading(p.isSatReading ?? true); // restore SAT section on refresh
      }
    }
  }, [testid, gradeParam, setAnswers]);

// Snapshot of the logged-in student, captured ONCE at quiz start.
  // Written to localStorage so the review page can read it without
  // ever needing a live auth call.
  const studentInfoRef = useRef<{
    id: string; fullName: string; email: string; gender: string;
  } | null>(null);

  useEffect(() => {
    const captureStudent = async () => {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (!user) return;
      const { data: profile } = await supabase
        .from("student_profile").select("full_name, gender").eq("id", user.id).maybeSingle();
      studentInfoRef.current = {
        id:       user.id,
        fullName: profile?.full_name || user.email || "Student",
        email:    user.email ?? "",
        gender:   profile?.gender || "N/A",
      };
      localStorage.setItem("activeStudent", JSON.stringify(studentInfoRef.current));
    };
    captureStudent();
  }, []);


  // ── Load quiz questions ───────────────────────────────────────────────────
  useEffect(() => {
    const saved  = localStorage.getItem("quizState");
    const parsed = saved ? JSON.parse(saved) : {};
    if (testid === "state-test" && stateParam && gradeParam) {
      setQuizQuestions(standardsData[`${stateParam}-${gradeParam.toLowerCase().replace(/\s+/g, "")}`] || []);
    } else if (testid === "quiz-assessment" && gradeParam) {
      const norm = gradeParam.toLowerCase().replace(/\s+/g, "-");
      setQuizQuestions(quizAssessmentData.find((e) => e.grade.toLowerCase().replace(/\s+/g, "-") === norm)?.questions || []);
    } else {
      setQuizQuestions(quizData[testid as string] || []);
    }
    if (!parsed.answers || parsed.submitted) { setAnswers({}); localStorage.removeItem("quiz-end-time"); }
  }, [testid, stateParam, gradeParam, setAnswers]);

  // ── Persist state to localStorage on every change ────────────────────────
  useEffect(() => {
    localStorage.setItem("quizState", JSON.stringify({
      testid, gradeParam, answers, currentQuestionIndex,
      submitted, satSection, quizSection,
      isSatReading, // persist so refresh mid-SAT-math restores correctly
    }));
  }, [testid, gradeParam, answers, currentQuestionIndex, submitted, satSection, quizSection, isSatReading]);

  // ── Answer selection ──────────────────────────────────────────────────────
  const handleSelect = (question: string, option: string) => {
    if (answers[question] === option) { const u = { ...answers }; delete u[question]; setAnswers(u); }
    else setAnswers({ ...answers, [question]: option });
  };

  const handleNext = () => { if (currentQuestionIndex < activeQuestions.length - 1) setCurrentQuestionIndex((p) => p + 1); };
  const handlePrev = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex((p) => p - 1); };

  // ── Submit logic ──────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const now = Date.now();
    if (isGrade9Or10) {
      if (quizSection === "math" && !mathEndTime) setMathEndTime(now);
      else if (quizSection === "ela" && !elaEndTime) setElaEndTime(now);
    } else if (isSat) {
      if (satSection === "reading" && !elaEndTime) setElaEndTime(now);
      else if (satSection === "math" && !mathEndTime) setMathEndTime(now);
    }
    const unanswered = activeQuestions.filter((q) => !answers[q.question]);
    if (isGrade9Or10 && quizSection === "math") {
      if (unanswered.length > 0) { setUnansweredCount(unanswered.length); setShowConfirmModal(true); return; }
      setShowGradeModal(true); return;
    }
    if (isGrade9Or10 && quizSection === "ela") {
      if (unanswered.length > 0) { setUnansweredCount(unanswered.length); setShowConfirmElaModal(true); return; }
      setShowScienceModal(true); return;
    }
    if (isGrade9Or10 && quizSection === "science") {
      if (unanswered.length > 0) { setUnansweredCount(unanswered.length); setShowConfirmSubmissionModal(true); return; }
      finalizeSubmit(); return;
    }
    if (isSat && satSection === "reading") {
      if (unanswered.length > 0) { setUnansweredCount(unanswered.length); setShowConfirmModal(true); return; }
      setShowSatModal(true); return;
    }
    if (isSat && satSection === "math") {
      if (unanswered.length > 0) { setUnansweredCount(unanswered.length); setShowConfirmSubmissionModal(true); return; }
      finalizeSubmit(); return;
    }
    finalizeSubmit();
  };

  const handleSubmitAfterConfirm2 = () => {
    setShowConfirmModal(false);
    if (isGrade9Or10 && quizSection === "math") { setShowGradeModal(true); return; }
    if (isSat && satSection === "reading") { setShowSatModal(true); return; }
    finalizeSubmit();
  };
  const handleSubmitAfterConfirm3 = () => {
    setShowConfirmElaModal(false);
    if (isGrade9Or10 && quizSection === "ela") { setShowScienceModal(true); return; }
    finalizeSubmit();
  };

  const handleTakeEla = () => {
    const now = Date.now();
    if (!mathEndTime) setMathEndTime(now);
    setShowGradeModal(false); setShowConfirmModal(false);
    setQuizSection("ela"); setCurrentQuestionIndex(0);
    setElaStartTime(Date.now());
  };
  const handleSkipEla = () => {
    const now = Date.now();
    if (!mathEndTime) setMathEndTime(now);
    setShowGradeModal(false); setTotalTestEndTime(now);
    localStorage.setItem("elaSkipped", "true"); finalizeSubmit();
  };
  const handleTakeScience = () => {
    if (quizSection === "ela" && !elaEndTime) setElaEndTime(Date.now());
    setShowScienceModal(false); setQuizSection("science"); setCurrentQuestionIndex(0);
    setScienceStartTime(Date.now());
  };
  const handleContinueMath = () => {
    const now = Date.now();
    if (!elaEndTime && isSat) setElaEndTime(now);
    setShowSatModal(false); setIsSatReading(false); setSatSection("math"); setCurrentQuestionIndex(0);
    setMathStartTime(now);
  };

  const handletimeupSubmit = () => {
    const now = Date.now();
    if (isGrade9Or10) {
      if (quizSection === "math") { setMathEndTime(now); setShowGradeModal(true); }
      else { setElaEndTime(now); setTotalTestEndTime(now); finalizeSubmit(); }
    } else if (isSat) {
      if (satSection === "reading") { setElaEndTime(now); setShowSatModal(true); }
      else { setMathEndTime(now); setTotalTestEndTime(now); finalizeSubmit(); }
    } else { setTotalTestEndTime(now); finalizeSubmit(); }
  };


// ── Save results to leaderboard (runs once, at final submission) ──────────
  const saveToLeaderboard = async (durations: any) => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    // Fetch the logged-in student's profile at submit time
    // const { data: { session } } = await supabase.auth.getSession();
    // const user = session?.user;
    // if (!user) return; // guests aren't saved — same behaviour as before

    // const { data: profile } = await supabase
    //   .from("student_profile").select("full_name, gender").eq("id", user.id).single();

    // const fullName = profile?.full_name || user.email || "Student";
    // const gender   = profile?.gender || "N/A";




    // Prefer the snapshot from quiz start; fall back to live auth (with timeout)
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
          id:       user.id,
          fullName: profile?.full_name || user.email || "Student",
          email:    user.email ?? "",
          gender:   profile?.gender || "N/A",
        };
      }
    }
    if (!student) {
      toast.error("You're not logged in — this result will NOT be saved!", { duration: 8000 });
      hasSavedRef.current = false;
      return;
    }

    const fullName = student.fullName;
    const gender   = student.gender;

    // Section scores
    const mathScore    = calculateSectionScore("math",    quizQuestions, answers);
    const elaScore     = calculateSectionScore("ela",     quizQuestions, answers);
    const scienceScore = calculateSectionScore("science", quizQuestions, answers);

    // SAT: reading maps to the "ela" slot, math to "math"
    const satReading = isSat ? Number(calculateSectionScore("ela",  quizQuestions, answers) ?? 0) : null;
    const satMath    = isSat ? Number(calculateSectionScore("math", quizQuestions, answers) ?? 0) : null;

    // Overall score — mirror the review page: if ELA was skipped (grade flow),
    // score only the math questions the student actually attempted
    const elaSkipped = localStorage.getItem("elaSkipped") === "true";
    const scoredQs   = isGrade9Or10 && elaSkipped ? quizQuestions.slice(0, 10) : quizQuestions;
    const correct    = scoredQs.filter(
      (q) => answers[q.question] === (q.correctAnswer || q.answer)
    ).length;
    const overall = scoredQs.length > 0 ? (correct / scoredQs.length) * 100 : 0;

    // const { error } = await supabase.from("leaderboard").insert([{
    //   full_name:        fullName,
    //   email:            student.email ?? "",
    //   grade:            normalizedGrade,
    //   math_score:       isSat ? (satMath    ?? 0) : (mathScore    != null ? Number(mathScore)    : 0),
    //   ela_score:        isSat ? (satReading ?? 0) : (elaScore     != null ? Number(elaScore)     : 0),
    //   science_score:    isSat ? 0                 : (scienceScore != null ? Number(scienceScore) : 0),
    //   overall_score:    parseFloat(overall.toFixed(2)),
    //   total_time:       durations?.totalDuration ?? 0,
    //   math_duration:    durations?.mathDuration    ?? null,
    //   ela_duration:     durations?.elaDuration     ?? null,
    //   science_duration: durations?.scienceDuration ?? null,
    //   test_type:        testid,
    //   gender,
    //   created_at:       new Date().toISOString(),
    // }]);

    // Build the payload once — used for BOTH the leaderboard and the test sheet
    const payload = {
      full_name:        fullName,
      email:            student.email ?? "",
      grade:            normalizedGrade,
      math_score:       isSat ? (satMath    ?? 0) : (mathScore    != null ? Number(mathScore)    : 0),
      ela_score:        isSat ? (satReading ?? 0) : (elaScore     != null ? Number(elaScore)     : 0),
      science_score:    isSat ? 0                 : (scienceScore != null ? Number(scienceScore) : 0),
      overall_score:    parseFloat(overall.toFixed(2)),
      total_time:       durations?.totalDuration ?? 0,
      math_duration:    durations?.mathDuration    ?? null,
      ela_duration:     durations?.elaDuration     ?? null,
      science_duration: durations?.scienceDuration ?? null,
      test_type:        testid,
      gender,
      created_at:       new Date().toISOString(),
    };

    const { error } = await supabase.from("leaderboard").insert([payload]);

    if (error) {
      console.error("Leaderboard save error:", error);
      hasSavedRef.current = false; // allow retry if it failed
    } else {
      toast.success("Result saved ✓");

      // ── Persist the full test sheet (questions + answers) for "My Tests" ──
      const { error: subError } = await supabase.from("test_submissions").insert([{
        user_id:       student.id,
        full_name:     fullName,
        email:         student.email ?? "",
        grade:         normalizedGrade,
        test_type:     testid,
        questions:     quizQuestions,   // the exact randomized set this student saw
        answers:       answers,         // their chosen options, keyed by question text
        math_score:    payload.math_score,
        ela_score:     payload.ela_score,
        science_score: payload.science_score,
        overall_score: payload.overall_score,
        durations,
      }]);
      if (subError) console.error("Test sheet save error:", subError);
    }
    };

    // if (error) {
    //   console.error("Leaderboard save error:", error);
    //   hasSavedRef.current = false; // allow retry if it failed
    // }
    
  
 // ── Finalize and compute all scores ──────────────────────────────────────
  const finalizeSubmit = () => {
    const now = Date.now();
    if (!mathEndTime && mathStartTime)           setMathEndTime(now);
    if (!elaEndTime && elaStartTime)             setElaEndTime(now);
    if (scienceStartTime && !scienceEndTime)     setScienceStartTime(now);
    if (!totalTestEndTime && totalTestStartTime) setTotalTestEndTime(now);
    setTimeout(() => {
      const durations = getDurations();
      localStorage.setItem("quizDurations", JSON.stringify(durations));
      localStorage.setItem("testDurations", JSON.stringify(durations));
      saveToLeaderboard(durations)

      // ── SAT: compute and persist section scores ───────────────────────
      if (isSat) {
        // Q 0–9 = Reading & Writing (mapped to "ela" slot in calculateSectionScore)
        // Q 10–19 = Math (mapped to "math" slot)
        const rScore = calculateSectionScore("ela",  quizQuestions, answers);
        const mScore = calculateSectionScore("math", quizQuestions, answers);
        const rNum   = rScore != null ? Number(rScore) : 0;
        const mNum   = mScore != null ? Number(mScore) : 0;
        setSatReadingScore(rNum);
        setSatMathScore(mNum);
        localStorage.setItem("satReadingScore", rNum.toString());
        localStorage.setItem("satMathScore",    mNum.toString());
        // Raw correct count out of 20 — used for readiness band
        const totalCorrect = quizQuestions.filter(
          (q) => answers[q.question] === (q.correctAnswer || q.answer)
        ).length;
        localStorage.setItem("satCorrectCount", totalCorrect.toString());
      }
      // ─────────────────────────────────────────────────────────────────

      setSubmitted(true);
      localStorage.removeItem("quizState");
      localStorage.removeItem("quiz-end-time");
      localStorage.removeItem("quiz-end-time-sat-reading");
      localStorage.removeItem("quiz-end-time-sat-math");
    }, 100);
  };





  const handleGoHome = () => {
    localStorage.removeItem("quizState"); localStorage.removeItem("quiz-end-time");
    setAnswers({}); setCurrentQuestionIndex(0); setSubmitted(false); router.push("/");
  };

  // ── Build review URL with all section scores ──────────────────────────────
  const handleReview = () => {
    const url = new URLSearchParams();
    if (testid === "state-test" && stateParam && gradeParam) { url.append("state", stateParam); url.append("grade", gradeParam); }
    else if (testid === "quiz-assessment" && gradeParam) url.append("grade", gradeParam);

    const mathScore    = calculateSectionScore("math",    quizQuestions, answers);
    const elaScore     = calculateSectionScore("ela",     quizQuestions, answers);
    const scienceScore = calculateSectionScore("science", quizQuestions, answers);

    // Read durations from localStorage (avoids stale React state)
    const savedDurations = localStorage.getItem("testDurations");
    const dur = savedDurations ? JSON.parse(savedDurations) : {};

    if (dur.mathDuration)    url.append("mathTime",    dur.mathDuration.toString());
    if (dur.elaDuration)     url.append("elaTime",     dur.elaDuration.toString());
    if (dur.scienceDuration) url.append("scienceTime", dur.scienceDuration.toString());
    if (dur.totalDuration)   url.append("totalTime",   dur.totalDuration.toString());

    // Grade 1–10 section scores
    if (isGrade9Or10) {
      if (mathScore    != null) url.append("mathScore",    mathScore.toString());
      if (elaScore     != null) url.append("elaScore",     elaScore.toString());
      if (scienceScore != null) url.append("scienceScore", scienceScore.toString());
    }
    if (mathScore    != null) localStorage.setItem("mathScore",    mathScore.toString());
    if (elaScore     != null) localStorage.setItem("elaScore",     elaScore.toString());
    if (scienceScore != null) localStorage.setItem("scienceScore", scienceScore.toString());

    // ── SAT section scores ────────────────────────────────────────────────
    if (isSat) {
      // Prefer fresh React state; fall back to localStorage if state hasn't settled
      const rScore = satReadingScore ?? Number(localStorage.getItem("satReadingScore") ?? 0);
      const mScore = satMathScore    ?? Number(localStorage.getItem("satMathScore")    ?? 0);
      const count  = Number(localStorage.getItem("satCorrectCount") ?? 0);
      url.append("satReadingScore", rScore.toString());
      url.append("satMathScore",    mScore.toString());
      url.append("satCorrectCount", count.toString());
      // elaTime = reading time, mathTime = math time (already appended above from durations)
    }
    // ─────────────────────────────────────────────────────────────────────

    router.push(`/quiz/${testid}/review?${url.toString()}`);
  };

  const totalQuestions = (submitted && isSATQuiz) || (submitted && isGrade9Or10)
    ? quizQuestions.length : activeQuestions.length;
  const answeredCount  = (submitted && isSATQuiz) || (submitted && isGrade9Or10)
    ? Object.keys(answers).filter((k) => quizQuestions.find((q) => q.question === k)).length
    : Object.keys(answers).filter((k) => activeQuestions.find((q) => q.question === k)).length;

  const timerDuration = isSATQuiz
    ? (isSatReading ? 960 : 720)
    : isGrade9Or10
    ? (quizSection === "math" ? 960 : quizSection === "ela" ? 720 : 900)
    : 1200;

  const timerIdentifier = isSATQuiz
    ? (isSatReading ? "sat-reading" : "sat-math")
    : isGrade9Or10
    ? (quizSection === "math" ? "grade-math" : quizSection === "ela" ? "grade-ela" : "grade-science")
    : "regular";

  if (!quizQuestions || quizQuestions.length === 0)
    return <div className="text-center text-red-500 my-20 text-4xl">No quiz found for this test.</div>;

  // ── Derive SAT correct count for ResultsScreen readiness band ─────────────
  const satCorrectCount = isSat
    ? quizQuestions.filter((q) => answers[q.question] === (q.correctAnswer || q.answer)).length
    : 0;

console.log("satSection:", satSection, "isSat:", isSat, "normalizedGrade:", normalizedGrade);


  return (
    <div ref={questionRef}>
      {!submitted ? (
        <QuizBody
          testid={testid}
          stateParam={stateParam}
          gradeParam={gradeParam}
          normalizedGrade={normalizedGrade}
          isSATQuiz={isSATQuiz}
          isGrade9Or10={isGrade9Or10}
          isSat={isSat}
          quizSection={quizSection}
          satSection={satSection}
          isSatReading={isSatReading}
          activeQuestions={activeQuestions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          answers={answers}
          timerDuration={timerDuration}
          timerIdentifier={timerIdentifier}
          onTimeUp={handletimeupSubmit}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
          unansweredCount={unansweredCount}
          showConfirmModal={showConfirmModal}
          showConfirmElaModal={showConfirmElaModal}
          showConfirmSubmissionModal={showConfirmSubmissionModal}
          showGradeModal={showGradeModal}
          showScienceModal={showScienceModal}
          showSatModal={showSatModal}
          onCancelConfirm={() => setShowConfirmModal(false)}
          onConfirmMathSubmit={handleSubmitAfterConfirm2}
          onCancelElaConfirm={() => setShowConfirmElaModal(false)}
          onConfirmElaSubmit={handleSubmitAfterConfirm3}
          onCancelSubmission={() => setShowConfirmSubmissionModal(false)}
          onConfirmFinalSubmit={finalizeSubmit}
          onSkipEla={handleSkipEla}
          onTakeEla={handleTakeEla}
          onTakeScience={handleTakeScience}
          onContinueMath={handleContinueMath}
        />
      ) : (
        <ResultsScreen
          isGrade9Or10={isGrade9Or10}
          isSat={isSat}
          satReadingScore={satReadingScore}
          satMathScore={satMathScore}
          satCorrectCount={satCorrectCount}
          calculateSectionScore={(s) => calculateSectionScore(s, quizQuestions, answers)}
          calculateScore={() => calculateScore(quizQuestions, answers, gradeParam)}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          onGoHome={handleGoHome}
          onReview={handleReview}
        />
      )}
    </div>
  );
}