"use client";

// ─────────────────────────────────────────────────────────────
// app/quiz/[testId]/review/page.tsx
//
// Extracted files:
//   utils/reviewUtils.ts       — formatDuration, getFormattedTimeData,
//                                getPerformanceBand, getSectionPerformanceLabel
//   utils/generateReport.ts    — all jsPDF logic (single-page compact report)
//   components/QuestionCard.tsx — single question card with solution toggle
//   components/SectionBlock.tsx — labelled section with question cards
// ─────────────────────────────────────────────────────────────

// import { useQuiz } from "@/app/context/QuizContext";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import quizData from "@/app/data/quizdata";
// import standardsData from "@/app/data/statetestdata";
// import { quizAssessmentData } from "@/app/data/quizassessmentdata";
// import { useEffect, useState, useRef } from "react";
// import { supabase } from "@/lib/supabaseClient";

// import { formatDuration, getFormattedTimeData } from "@/app/utils/reviewUtils";
// import { generateReport } from "@/app/utils/generateReport";
// import SectionBlock from "@/app/components/SectionBlock/SectionBlock";

// export default function ReviewPage() {
//   const { answers, setAnswers } = useQuiz();
//   const { testId } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const hasSavedRef = useRef(false);
  

//   // ── URL params ──────────────────────────────────────────
//   const stateParam   = searchParams.get("state")?.toLowerCase();
//   const gradeParam   = searchParams.get("grade")?.toLowerCase().replace(/\s+/g, "");
//   const mathScore    = searchParams.get("mathScore")    ? parseFloat(searchParams.get("mathScore")!)    : null;
//   const elaScore     = searchParams.get("elaScore")     ? parseFloat(searchParams.get("elaScore")!)     : null;
//   const scienceScore = searchParams.get("scienceScore") ? parseFloat(searchParams.get("scienceScore")!) : null;

//   // ── State ───────────────────────────────────────────────
//   const [userName, setUserName]       = useState("");
//   const [userEmail, setUserEmail]     = useState("");
//   const [selectedQuiz, setSelectedQuiz] = useState<any[]>([]);
//   const [loading, setLoading]         = useState(true);
//   const [elaSkipped, setElaSkipped]   = useState(false);
//   const [gender, setGender] = useState("");
//   const [timeData, setTimeData]       = useState<{
//     mathDuration?: number;
//     elaDuration?: number;
//     scienceDuration?: number;
//     totalDuration?: number;
//     actualTestTime?: number;
//   }>({});

//   // ── Derived ─────────────────────────────────────────────
//   const isGrade9Or10 = [
//     "9th-grade","10th-grade","8th-grade","7th-grade","6th-grade",
//     "5th-grade","4th-grade","3rd-grade","11th-grade","12th-grade",
//     "2nd-grade","1st-grade","pre-k","kindergarten","year-7",
//   ].includes(gradeParam ?? "");

//   const correctAnswersCount = selectedQuiz.filter(
//     (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
//   ).length;
//   const totalQuestions = selectedQuiz.length;
//   const score = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);
//   const times = getFormattedTimeData(searchParams as any, timeData);

//   // ── Effects ─────────────────────────────────────────────

//   // Fetch user profile
//   useEffect(() => {
//     const getUserProfile = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       const user = session?.user;
//       if (user) {
//         const { data: profile, error } = await supabase
//           .from("student_profile").select("full_name, gender").eq("id", user.id).single();
//         setUserName(!error && profile ? profile.full_name : (user.email ?? "Student"));
//         setUserEmail(user.email ?? "");
//         setGender(profile?.gender || "");
//       } else {
//         setUserName("Guest");
//       }
//     };
//     getUserProfile();
//   }, []);

//   // Restore ELA skipped flag
//   useEffect(() => {
//     setElaSkipped(localStorage.getItem("elaSkipped") === "true");
//   }, []);

//   // Restore time data
//   useEffect(() => {
//     const mathTime    = searchParams.get("mathTime");
//     const elaTime     = searchParams.get("elaTime");
//     const scienceTime = searchParams.get("scienceTime");
//     const totalTime   = searchParams.get("totalTime");
//     const actualTime  = searchParams.get("actualTime");

//     if (mathTime || elaTime || totalTime || actualTime) {
//       setTimeData({
//         mathDuration:    mathTime    ? parseInt(mathTime)    : undefined,
//         elaDuration:     elaTime     ? parseInt(elaTime)     : undefined,
//         scienceDuration: scienceTime ? parseInt(scienceTime) : undefined,
//         totalDuration:   totalTime   ? parseInt(totalTime)   : undefined,
//         actualTestTime:  actualTime  ? parseInt(actualTime)  : undefined,
//       });
//     } else {
//       const stored = localStorage.getItem("testDurations");
//       if (stored) setTimeData(JSON.parse(stored));
//     }
//   }, [searchParams]);

//   // Load quiz questions
//   useEffect(() => {
//     const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
//     let quiz: any[] = [];

//     if (testId === "state-test" && stateParam && gradeParam) {
//       quiz = standardsData[`${stateParam}-${gradeParam}`] || [];
//     } else if (testId === "quiz-assessment" && gradeParam) {
//       quiz = quizAssessmentData.find((q) => normalize(q.grade) === gradeParam)?.questions || [];
//     } else {
//       quiz = quizData[testId as string] || [];
//     }

//     const localElaScore = searchParams.get("elaScore") ? parseFloat(searchParams.get("elaScore")!) : null;
//     const mathQs = quiz.slice(0, 10);
//     const elaQs  = quiz.slice(10);

//     if (isGrade9Or10) {
//       if (localElaScore !== null) {
//         setSelectedQuiz(localElaScore === 0 ? mathQs : quiz);
//       } else {
//         const elaAnswered = elaQs.some((q) => answers[q.question]?.trim());
//         setSelectedQuiz(elaAnswered ? quiz : mathQs);
//       }
//     } else {
//       setSelectedQuiz(quiz);
//     }

//     setLoading(false);
//   }, [testId, stateParam, gradeParam, answers, searchParams]);

//   // Save to leaderboard (once, after all data is ready)
//   useEffect(() => {
//     if (hasSavedRef.current) return;
//     if (!userName || !userEmail || !gradeParam || loading) return;
//     if (!score || score === "NaN") return;

//     hasSavedRef.current = true;

//     const saveToLeaderboard = async () => {
//       const totalSeconds =
//         parseInt(searchParams.get("totalTime") || "") || timeData.totalDuration || 0;

//       const { error } = await supabase.from("leaderboard").insert([{
//         full_name:     userName,
//         email:         userEmail,
//         grade:         gradeParam,
//         math_score:    mathScore    ?? 0,
//         ela_score:     elaScore     ?? 0,
//         science_score: scienceScore ?? 0,
//         overall_score: parseFloat(score),
//         total_time:    totalSeconds,
//         test_type:     testId,
//         gender:        gender || 'N/A',
//         created_at:    new Date().toISOString(),

//       }]).select();

//       if (error) {
//         console.error("Supabase error:", error);
//         hasSavedRef.current = false;
//       }
//     };

//     saveToLeaderboard();
//   }, [userName, userEmail, gradeParam, loading, score]);

//   // ── Handlers ────────────────────────────────────────────

//   // const handleFinishReview = () => {
//   //   ["quizState","mathScore","elaScore","quizTimeData","testDurations",
//   //    "quizDurations","elaSkipped"].forEach((k) => localStorage.removeItem(k));
//   //   Object.keys(localStorage)
//   //     .filter((k) => k.startsWith("quiz-end-time"))
//   //     .forEach((k) => localStorage.removeItem(k));
//   //   setAnswers({});
//   //   router.push("/");
//   // };


//   const handleFinishReview = () => {
//   ["quizState","mathScore","elaScore","quizTimeData","testDurations",
//    "quizDurations","elaSkipped"].forEach((k) => localStorage.removeItem(k));

//   Object.keys(localStorage)
//     .filter((k) => k.startsWith("quiz-end-time"))
//     .forEach((k) => localStorage.removeItem(k));

//   setAnswers({});

//   // ✅ allow React to settle before navigation
//   setTimeout(() => {
//     router.push('/');
//   }, 100);
// };

//   const handleDownloadReport = () => {
//     const mathDuration    = searchParams.get("mathTime")    ? parseInt(searchParams.get("mathTime")!)    : timeData.mathDuration;
//     const elaDuration     = searchParams.get("elaTime")     ? parseInt(searchParams.get("elaTime")!)     : timeData.elaDuration;
//     const scienceDuration = searchParams.get("scienceTime") ? parseInt(searchParams.get("scienceTime")!) : timeData.scienceDuration;
//     const totalDuration   = searchParams.get("totalTime")   ? parseInt(searchParams.get("totalTime")!)   : timeData.totalDuration;

//     generateReport({
//       userName, userEmail, gradeParam, testId,
//       score, correctAnswersCount, totalQuestions,
//       mathScore, elaScore, scienceScore,
//       elaSkipped, isGrade9Or10,
//       mathDuration, elaDuration, scienceDuration, totalDuration,
//       times,
//     });

//     handleFinishReview();
//   };

//   // ── Guards ──────────────────────────────────────────────
//   if (loading && selectedQuiz.length === 0)
//   return <p className="text-center mt-20">Loading quiz data...</p>;

//   if (!selectedQuiz || selectedQuiz.length === 0)
//     return <p className="text-center text-red-500 mt-10">No review data found for this test.</p>;

//   // ── Render ──────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 pb-16 mt-12">

//       {/* ── HEADER ── */}
//       <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-6 text-center">
//         <span className="inline-block bg-indigo-600 text-white text-lg font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
//           Test Review
//         </span>
//         <h1 className="text-2xl font-extrabold text-gray-900 capitalize">
//           {testId === "state-test" && stateParam && gradeParam
//             ? `State Test · ${stateParam.toUpperCase()} · ${gradeParam.toUpperCase()}`
//             : testId === "quiz-assessment"
//             ? `Assessment · ${gradeParam?.toUpperCase()}`
//             : `Test Review`}
//         </h1>
//         {isGrade9Or10 && (
//           <p className="text-sm text-gray-400 italic mt-1">
//             {elaSkipped ? "Only Math section attempted" : "Full Review"}
//           </p>
//         )}
//       </div>

//       <div className="max-w-6xl mx-auto px-4 pt-8">

//         {/* ── SCORE CARDS ── */}
//         {isGrade9Or10 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//             {/* Math */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
//               <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
//               <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-1">Math</p>
//               <p className="text-4xl font-extrabold text-indigo-600 leading-none">{mathScore}%</p>
//               <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
//                 <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${mathScore}%` }} />
//               </div>
//             </div>
//             {/* ELA */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
//               <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
//               <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-1">ELA</p>
//               {elaSkipped ? (
//                 <p className="text-xl font-bold text-gray-300 mt-2">Skipped</p>
//               ) : (
//                 <>
//                   <p className="text-4xl font-extrabold text-emerald-600 leading-none">{elaScore}%</p>
//                   <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
//                     <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${elaScore}%` }} />
//                   </div>
//                 </>
//               )}
//             </div>
//             {/* Science */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
//               <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mx-auto mb-3">🔬</div>
//               <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-1">Science</p>
//               <p className="text-4xl font-extrabold text-amber-600 leading-none">{scienceScore}%</p>
//               <div className="mt-3 h-1.5 rounded-full bg-amber-100 overflow-hidden">
//                 <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${scienceScore}%` }} />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center mb-8">
//             <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-2">Overall Score</p>
//             <p className="text-6xl font-extrabold text-indigo-600">{score}%</p>
//             <div className="mt-4 h-2 rounded-full bg-indigo-100 overflow-hidden max-w-xs mx-auto">
//               <div className="h-full rounded-full bg-indigo-500" style={{ width: `${score}%` }} />
//             </div>
//           </div>
//         )}

//         {/* ── STATS STRIP ── */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-wrap justify-center gap-6 md:gap-12 text-center">
//           {[
//             { label: "Score",       val: `${score}%`,                          cls: "text-gray-800" },
//             { label: "Correct",     val: `${correctAnswersCount} / ${totalQuestions}`, cls: "text-gray-800" },
//             { label: "Total Time",  val: times.total,                          cls: "text-gray-800" },
//             { label: "Math",        val: times.math,                           cls: "text-indigo-600" },
//             { label: "ELA",         val: elaSkipped ? "Skipped" : times.ela,  cls: "text-emerald-600" },
//             { label: "Science",     val: times.science,                        cls: "text-amber-600" },
//           ].map(({ label, val, cls }) => (
//             <div key={label}>
//               <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
//               <p className={`text-lg font-extrabold ${cls}`}>{val}</p>
//             </div>
//           ))}
//         </div>

//         {/* ── SECTIONED QUESTIONS ── */}
//         {[
//           { label: "Mathematics",           emoji: "🔢", color: "indigo"  as const, qs: selectedQuiz.slice(0, 10)  },
//           { label: "English Language Arts", emoji: "📖", color: "emerald" as const, qs: selectedQuiz.slice(10, 20) },
//           { label: "Science",               emoji: "🔬", color: "amber"   as const, qs: selectedQuiz.slice(20, 30) },
//         ].map(({ label, emoji, color, qs }) => (
//           <SectionBlock
//             key={label}
//             label={label}
//             emoji={emoji}
//             color={color}
//             questions={qs}
//             allQuestions={selectedQuiz}
//             answers={answers}
//           />
//         ))}

//         {/* ── FOOTER BUTTONS ── */}
//         <div className="flex justify-center gap-4 flex-wrap mt-4">
//           <button
//             className="px-6 py-3 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
//             onClick={handleDownloadReport}
//           >
//             📄 Download Report
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }





import { useQuiz } from "@/app/context/QuizContext";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import quizData from "@/app/data/quizdata";
import standardsData from "@/app/data/statetestdata";
import { quizAssessmentData } from "@/app/data/quizassessmentdata";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

import { formatDuration, getFormattedTimeData } from "@/app/utils/reviewUtils";
import { generateReport } from "@/app/utils/generateReport";
import SectionBlock from "@/app/components/SectionBlock/SectionBlock";

// SAT readiness band (raw correct out of 20)
function getSatReadinessBand(correctCount: number): {
  label: string;
  desc: string;
  colorClass: string;
} {
  if (correctCount >= 18) return { label: "Strong",           desc: "On track for a competitive SAT score.",                                          colorClass: "text-emerald-700" };
  if (correctCount >= 14) return { label: "Solid Foundation", desc: "Focus on missed question types for refinement.",                                  colorClass: "text-blue-700"    };
  if (correctCount >= 10) return { label: "Developing",       desc: "Review core concepts in both sections before full-length practice tests.",         colorClass: "text-amber-700"   };
  return                         { label: "Foundational",     desc: "Foundational review recommended before timed practice.",                           colorClass: "text-red-700"     };
}

export default function ReviewPage() {
  const { answers, setAnswers } = useQuiz();
  const { testId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasSavedRef = useRef(false);

  // ── URL params ──────────────────────────────────────────
  const stateParam   = searchParams.get("state")?.toLowerCase();
  const gradeParam   = searchParams.get("grade")?.toLowerCase().replace(/\s+/g, "");
  const mathScore    = searchParams.get("mathScore")    ? parseFloat(searchParams.get("mathScore")!)    : null;
  const elaScore     = searchParams.get("elaScore")     ? parseFloat(searchParams.get("elaScore")!)     : null;
  const scienceScore = searchParams.get("scienceScore") ? parseFloat(searchParams.get("scienceScore")!) : null;

  // SAT-specific score params
  const satReadingScore = searchParams.get("satReadingScore") ? parseFloat(searchParams.get("satReadingScore")!) : null;
  const satMathScore    = searchParams.get("satMathScore")    ? parseFloat(searchParams.get("satMathScore")!)    : null;
  const satCorrectCount = searchParams.get("satCorrectCount") ? parseInt(searchParams.get("satCorrectCount")!)   : 0;

  // ── State ───────────────────────────────────────────────
  const [userName, setUserName]         = useState("");
  const [userEmail, setUserEmail]       = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [elaSkipped, setElaSkipped]     = useState(false);
  const [gender, setGender]             = useState("");
  const [timeData, setTimeData]         = useState<{
    mathDuration?: number;
    elaDuration?: number;
    scienceDuration?: number;
    totalDuration?: number;
    actualTestTime?: number;
  }>({});

  // ── Derived ─────────────────────────────────────────────
  const isSat = ["sat", "ssat"].includes(gradeParam ?? "");

  const isGrade9Or10 = [
    "9th-grade","10th-grade","8th-grade","7th-grade","6th-grade",
    "5th-grade","4th-grade","3rd-grade","11th-grade","12th-grade",
    "2nd-grade","1st-grade","pre-k","kindergarten","year-7",
  ].includes(gradeParam ?? "");

  const correctAnswersCount = selectedQuiz.filter(
    (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
  ).length;
  const totalQuestions = selectedQuiz.length;
  const score = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);
  const times = getFormattedTimeData(searchParams as any, timeData);

  // SAT readiness band
  const satBand = isSat ? getSatReadinessBand(satCorrectCount) : null;

  // ── Effects ─────────────────────────────────────────────

  // Fetch user profile
  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        const { data: profile, error } = await supabase
          .from("student_profile").select("full_name, gender").eq("id", user.id).single();
        setUserName(!error && profile ? profile.full_name : (user.email ?? "Student"));
        setUserEmail(user.email ?? "");
        setGender(profile?.gender || "");
      } else {
        setUserName("Guest");
      }
    };
    getUserProfile();
  }, []);

  // Restore ELA skipped flag
  useEffect(() => {
    setElaSkipped(localStorage.getItem("elaSkipped") === "true");
  }, []);

  // Restore time data
  useEffect(() => {
    const mathTime    = searchParams.get("mathTime");
    const elaTime     = searchParams.get("elaTime");
    const scienceTime = searchParams.get("scienceTime");
    const totalTime   = searchParams.get("totalTime");
    const actualTime  = searchParams.get("actualTime");

    if (mathTime || elaTime || totalTime || actualTime) {
      setTimeData({
        mathDuration:    mathTime    ? parseInt(mathTime)    : undefined,
        elaDuration:     elaTime     ? parseInt(elaTime)     : undefined,
        scienceDuration: scienceTime ? parseInt(scienceTime) : undefined,
        totalDuration:   totalTime   ? parseInt(totalTime)   : undefined,
        actualTestTime:  actualTime  ? parseInt(actualTime)  : undefined,
      });
    } else {
      const stored = localStorage.getItem("testDurations");
      if (stored) setTimeData(JSON.parse(stored));
    }
  }, [searchParams]);

  // Load quiz questions
  useEffect(() => {
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
    let quiz: any[] = [];

    if (testId === "state-test" && stateParam && gradeParam) {
      quiz = standardsData[`${stateParam}-${gradeParam}`] || [];
    } else if (testId === "quiz-assessment" && gradeParam) {
      quiz = quizAssessmentData.find((q) => normalize(q.grade) === gradeParam)?.questions || [];
    } else {
      quiz = quizData[testId as string] || [];
    }

    if (isSat) {
      // SAT always shows all 20 questions (10 reading + 10 math)
      setSelectedQuiz(quiz);
    } else if (isGrade9Or10) {
      const localElaScore = searchParams.get("elaScore") ? parseFloat(searchParams.get("elaScore")!) : null;
      const mathQs = quiz.slice(0, 10);
      const elaQs  = quiz.slice(10);
      if (localElaScore !== null) {
        setSelectedQuiz(localElaScore === 0 ? mathQs : quiz);
      } else {
        const elaAnswered = elaQs.some((q) => answers[q.question]?.trim());
        setSelectedQuiz(elaAnswered ? quiz : mathQs);
      }
    } else {
      setSelectedQuiz(quiz);
    }

    setLoading(false);
  }, [testId, stateParam, gradeParam, answers, searchParams, isSat]);

  // Save to leaderboard (once, after all data is ready)
  useEffect(() => {
    if (hasSavedRef.current) return;
    if (!userName || !userEmail || !gradeParam || loading) return;
    if (!score || score === "NaN") return;

    hasSavedRef.current = true;

    const saveToLeaderboard = async () => {
      const totalSeconds =
        parseInt(searchParams.get("totalTime") || "") || timeData.totalDuration || 0;

      const { error } = await supabase.from("leaderboard").insert([{
        full_name:     userName,
        email:         userEmail,
        grade:         gradeParam,
        math_score:    isSat ? (satMathScore    ?? 0) : (mathScore    ?? 0),
        ela_score:     isSat ? (satReadingScore  ?? 0) : (elaScore     ?? 0),
        science_score: isSat ? 0                       : (scienceScore ?? 0),
        overall_score: parseFloat(score),
        total_time:    totalSeconds,
        test_type:     testId,
        gender:        gender || "N/A",
        created_at:    new Date().toISOString(),
      }]).select();

      if (error) {
        console.error("Supabase error:", error);
        hasSavedRef.current = false;
      }
    };

    saveToLeaderboard();
  }, [userName, userEmail, gradeParam, loading, score]);

  // ── Handlers ────────────────────────────────────────────
  const handleFinishReview = () => {
    ["quizState","mathScore","elaScore","quizTimeData","testDurations",
     "quizDurations","elaSkipped","satReadingScore","satMathScore","satCorrectCount",
    ].forEach((k) => localStorage.removeItem(k));

    Object.keys(localStorage)
      .filter((k) => k.startsWith("quiz-end-time"))
      .forEach((k) => localStorage.removeItem(k));

    setAnswers({});
    setTimeout(() => { router.push("/"); }, 100);
  };

  const handleDownloadReport = () => {
    const mathDuration    = searchParams.get("mathTime")    ? parseInt(searchParams.get("mathTime")!)    : timeData.mathDuration;
    const elaDuration     = searchParams.get("elaTime")     ? parseInt(searchParams.get("elaTime")!)     : timeData.elaDuration;
    const scienceDuration = searchParams.get("scienceTime") ? parseInt(searchParams.get("scienceTime")!) : timeData.scienceDuration;
    const totalDuration   = searchParams.get("totalTime")   ? parseInt(searchParams.get("totalTime")!)   : timeData.totalDuration;

    generateReport({
      userName, userEmail, gradeParam, testId,
      score, correctAnswersCount, totalQuestions,
      mathScore, elaScore, scienceScore,
      elaSkipped, isGrade9Or10,
      // SAT-specific
      isSat,
      satReadingScore,
      satMathScore,
      satCorrectCount,
      mathDuration, elaDuration, scienceDuration, totalDuration,
      times,
    });

    handleFinishReview();
  };

  // ── Guards ──────────────────────────────────────────────
  if (loading && selectedQuiz.length === 0)
    return <p className="text-center mt-20">Loading quiz data...</p>;

  if (!selectedQuiz || selectedQuiz.length === 0)
    return <p className="text-center text-red-500 mt-10">No review data found for this test.</p>;

  // ── Stats strip config ──────────────────────────────────
  // For SAT: elaTime = reading time, mathTime = math time; no science
  const statsStrip = isSat
    ? [
        { label: "Score",           val: `${score}%`,   cls: "text-gray-800"    },
        { label: "Correct",         val: `${correctAnswersCount} / ${totalQuestions}`, cls: "text-gray-800" },
        { label: "Total Time",      val: times.total,   cls: "text-gray-800"    },
        { label: "R&W Time",        val: times.ela,     cls: "text-emerald-600" },
        { label: "Math Time",       val: times.math,    cls: "text-indigo-600"  },
      ]
    : [
        { label: "Score",           val: `${score}%`,   cls: "text-gray-800"    },
        { label: "Correct",         val: `${correctAnswersCount} / ${totalQuestions}`, cls: "text-gray-800" },
        { label: "Total Time",      val: times.total,   cls: "text-gray-800"    },
        { label: "Math",            val: times.math,    cls: "text-indigo-600"  },
        { label: "ELA",             val: elaSkipped ? "Skipped" : times.ela, cls: "text-emerald-600" },
        { label: "Science",         val: times.science, cls: "text-amber-600"   },
      ];

  // ── SAT section blocks ──────────────────────────────────
  const satSections = [
    { label: "Reading & Writing", emoji: "📖", color: "emerald" as const, qs: selectedQuiz.slice(0, 10)  },
    { label: "Mathematics",       emoji: "🔢", color: "indigo"  as const, qs: selectedQuiz.slice(10, 20) },
  ];

  const gradeSections = [
    { label: "Mathematics",           emoji: "🔢", color: "indigo"  as const, qs: selectedQuiz.slice(0, 10)  },
    { label: "English Language Arts", emoji: "📖", color: "emerald" as const, qs: selectedQuiz.slice(10, 20) },
    { label: "Science",               emoji: "🔬", color: "amber"   as const, qs: selectedQuiz.slice(20, 30) },
  ];

  const sectionBlocks = isSat ? satSections : gradeSections;

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-16 mt-12">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-6 text-center">
        <span className="inline-block bg-indigo-600 text-white text-lg font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
          Test Review
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900 capitalize">
          {testId === "state-test" && stateParam && gradeParam
            ? `State Test · ${stateParam.toUpperCase()} · ${gradeParam.toUpperCase()}`
            : testId === "quiz-assessment"
            ? `Assessment · ${gradeParam?.toUpperCase()}`
            : isSat
            ? `SAT Practice · ${gradeParam?.toUpperCase()}`
            : `Test Review`}
        </h1>
        {isGrade9Or10 && (
          <p className="text-sm text-gray-400 italic mt-1">
            {elaSkipped ? "Only Math section attempted" : "Full Review"}
          </p>
        )}
        {isSat && satBand && (
          <p className={`text-sm font-semibold mt-1 ${satBand.colorClass}`}>
            {satBand.label} — {satBand.desc}
          </p>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">

        {/* ── SCORE CARDS ── */}
        {isSat ? (
          /* SAT: two section score cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Reading & Writing */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-1">Mathematics</p>
              <p className="text-4xl font-extrabold text-emerald-600 leading-none">{satReadingScore ?? "—"}%</p>
              {satReadingScore != null && (
                <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${satReadingScore}%` }} />
                </div>
              )}
            </div>
            {/* SAT Math */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-1">Reading and writing</p>
              <p className="text-4xl font-extrabold text-indigo-600 leading-none">{satMathScore ?? "—"}%</p>
              {satMathScore != null && (
                <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${satMathScore}%` }} />
                </div>
              )}
            </div>
          </div>

        ) : isGrade9Or10 ? (
          /* Grade 1–10: three section score cards (unchanged) */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-1">Math</p>
              <p className="text-4xl font-extrabold text-indigo-600 leading-none">{mathScore}%</p>
              <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${mathScore}%` }} />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mx-auto mb-3">📖</div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-1">ELA</p>
              {elaSkipped ? (
                <p className="text-xl font-bold text-gray-300 mt-2">Skipped</p>
              ) : (
                <>
                  <p className="text-4xl font-extrabold text-emerald-600 leading-none">{elaScore}%</p>
                  <div className="mt-3 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${elaScore}%` }} />
                  </div>
                </>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mx-auto mb-3">🔬</div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-1">Science</p>
              <p className="text-4xl font-extrabold text-amber-600 leading-none">{scienceScore}%</p>
              <div className="mt-3 h-1.5 rounded-full bg-amber-100 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${scienceScore}%` }} />
              </div>
            </div>
          </div>

        ) : (
          /* Non-grade overall score (unchanged) */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center mb-8">
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-2">Overall Score</p>
            <p className="text-6xl font-extrabold text-indigo-600">{score}%</p>
            <div className="mt-4 h-2 rounded-full bg-indigo-100 overflow-hidden max-w-xs mx-auto">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${score}%` }} />
            </div>
          </div>
        )}

        {/* ── SAT READINESS BAND (review page) ── */}
        {isSat && satBand && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-1">
              SAT Readiness · {satCorrectCount} / 20 correct
            </p>
            <p className={`text-2xl font-extrabold ${satBand.colorClass}`}>{satBand.label}</p>
            <p className={`text-sm font-medium mt-1 ${satBand.colorClass}`}>{satBand.desc}</p>
          </div>
        )}

        {/* ── STATS STRIP ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-wrap justify-center gap-6 md:gap-12 text-center">
          {statsStrip.map(({ label, val, cls }) => (
            <div key={label}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-extrabold ${cls}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* ── SECTIONED QUESTIONS ── */}
        {sectionBlocks.map(({ label, emoji, color, qs }) => (
          <SectionBlock
            key={label}
            label={label}
            emoji={emoji}
            color={color}
            questions={qs}
            allQuestions={selectedQuiz}
            answers={answers}
          />
        ))}

        {/* ── FOOTER BUTTONS ── */}
        <div className="flex justify-center gap-4 flex-wrap mt-4">
          <button
            className="px-6 py-3 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={handleDownloadReport}
          >
            📄 Download Report
          </button>
        </div>

      </div>
    </div>
  );
}