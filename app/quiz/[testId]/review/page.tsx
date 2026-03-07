"use client";
import { useQuiz } from "@/app/context/QuizContext";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import quizData from "@/app/data/quizdata";
import standardsData from "@/app/data/statetestdata";
import { quizAssessmentData } from "@/app/data/quizassessmentdata";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabaseClient";
import { useRef } from "react";

export default function ReviewPage() {
  const { answers, setAnswers } = useQuiz();
  const { testId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasSavedRef = useRef(false);

  
  const stateParam = searchParams.get("state")?.toLowerCase();
  const gradeParam = searchParams.get("grade")?.toLowerCase().replace(/\s+/g, "");


  //new state variables added to my component

  const mathScoreParam = searchParams.get("mathScore");
  const elaScoreParam = searchParams.get("elaScore");
  const scienceScoreParam = searchParams.get("scienceScore");

  const mathScore = mathScoreParam ? parseFloat(mathScoreParam) : null;
  const elaScore = elaScoreParam ? parseFloat(elaScoreParam) : null;
  const scienceScore = scienceScoreParam ? parseFloat(scienceScoreParam) : null;

  const isYear7 = gradeParam === "year-7" || gradeParam === "7th-grade";

  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSolutionIndex, setShowSolutionIndex] = useState<number | null>(null);
  const [elaSkipped, setElaSkipped] = useState(false);


// Fetch the logged-in user's profile
useEffect(() => {
  const getUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
      // Fetch profile from student_profile
      const { data: profile, error } = await supabase
        .from("student_profile")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (!error && profile) {
        setUserName(profile.full_name);
        console.log("User's full name from profile:", profile.full_name);
      } else {
        // fallback to email or placeholder
        setUserName(user.email ?? "Student");
      }
      setUserEmail(user.email ?? "");
    } else {
      setUserName("Guest");
      setUserEmail("");
    }

  };

  getUserProfile();
}, []);




  // Add state for time data
  const [timeData, setTimeData] = useState<{
    mathDuration?: number;
    elaDuration?: number;
    scienceDuration?: number;
    totalDuration?: number;
    actualTestTime?: number;
  }>({});

  // Determine if user skipped ELA (for Grade 9 or 10)
  const isGrade9Or10 = gradeParam === "9th-grade" || gradeParam === "10th-grade" || 
    gradeParam === "8th-grade" || gradeParam === "7th-grade" || gradeParam === "6th-grade" || 
    gradeParam === "5th-grade" || gradeParam === "4th-grade" || gradeParam === "3rd-grade" || 
    gradeParam === "11th-grade" || gradeParam === "12th-grade" || gradeParam === "2nd-grade" || 
    gradeParam === "1st-grade"|| gradeParam === "pre-k" || gradeParam === "kindergarten" || gradeParam ==="year-7";


// Check if ELA was skipped
useEffect(() => {
  const skipped = localStorage.getItem("elaSkipped") === "true";
  setElaSkipped(skipped);
  console.log("ELA skipped:", skipped);
}, []);




  // Retrieve time data on mount
  useEffect(() => {
    // Try to get time data from URL params first
    const mathTime = searchParams.get("mathTime");
    const elaTime = searchParams.get("elaTime");
    const scienceTime = searchParams.get("scienceTime");

    const totalTime = searchParams.get("totalTime");
    const actualTime = searchParams.get("actualTime");

    if (mathTime || elaTime || totalTime || actualTime) {
      setTimeData({
        mathDuration: mathTime ? parseInt(mathTime) : undefined,
        elaDuration: elaTime ? parseInt(elaTime) : undefined,
        scienceDuration: scienceTime ? parseInt(scienceTime) : undefined,
        totalDuration: totalTime ? parseInt(totalTime) : undefined,
        actualTestTime: actualTime ? parseInt(actualTime) : undefined,
      });

    } else {
      // Fallback to localStorage
      const storedDurations = localStorage.getItem("testDurations");
      if (storedDurations) {
        setTimeData(JSON.parse(storedDurations));
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "");

    let quiz: any[] = [];

    if (testId === "state-test" && stateParam && gradeParam) {
      const key = `${stateParam}-${gradeParam}`;
      quiz = standardsData[key] || [];
    } else if (testId === "quiz-assessment" && gradeParam) {
      const found = quizAssessmentData.find(
        (q) => normalize(q.grade) === gradeParam
      );
      quiz = found?.questions || [];
    } else {
      quiz = quizData[testId as string] || [];
    }

    const mathScoreParam = searchParams.get("mathScore");
    const elaScoreParam = searchParams.get("elaScore");
    const scienceScoreParam = searchParams.get("scienceScore");
    const scienceTimeFromParams = searchParams.get("scienceTime");
    const scienceDuration = scienceTimeFromParams
      ? parseInt(scienceTimeFromParams)
      : timeData.scienceDuration;


    console.log("Math Score from query:", mathScoreParam);
    console.log("ELA Score from query:", elaScoreParam);

    const mathScore = mathScoreParam ? parseFloat(mathScoreParam) : null;
    const elaScore = elaScoreParam ? parseFloat(elaScoreParam) : null;

    const mathQuestions = quiz.slice(0, 10);
    const elaQuestions = quiz.slice(10);

    // Only apply skip logic for grades 9 or 10
    if (isGrade9Or10) {
      if (elaScore !== null) {
        // Use score from query string
        setSelectedQuiz(elaScore === 0 ? mathQuestions : quiz);
      } else {
        // Fallback logic based on whether any ELA questions were answered
        const elaAnswered = elaQuestions.some((q) => {
          const ans = answers[q.question];
          return ans && ans.trim() !== "";
        });
        setSelectedQuiz(elaAnswered ? quiz : mathQuestions);
      }
    } else {
      // All other grades: show full quiz
      setSelectedQuiz(quiz);
    }

    setLoading(false);
  }, [testId, stateParam, gradeParam, answers, searchParams]);

  const handleFinishReview = () => {
    localStorage.removeItem("quizState");
    localStorage.removeItem("mathScore");
    localStorage.removeItem("elaScore");
    localStorage.removeItem("quizTimeData");
    localStorage.removeItem("testDurations");
    localStorage.removeItem("quizDurations");
    localStorage.removeItem("elaSkipped"); // Clean up the skip flag

    
    // Clear all quiz-end-time keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("quiz-end-time")) {
        localStorage.removeItem(key);
      }
    });
    
    setAnswers({});
    router.push("/");
  };

  const correctAnswersCount = selectedQuiz.filter(
    (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
  ).length;

  const totalQuestions = selectedQuiz.length;
  const score = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);

  // Helper function to format time
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };




 const getFormattedTimeData = () => {
  const mathTimeFromParams = searchParams.get("mathTime");
  const elaTimeFromParams = searchParams.get("elaTime");
  const scienceTimeFromParams = searchParams.get("scienceTime");
  const totalTimeFromParams = searchParams.get("totalTime");

  const mathTime = mathTimeFromParams ? parseInt(mathTimeFromParams) : timeData.mathDuration || 0;
  const elaTime = elaTimeFromParams ? parseInt(elaTimeFromParams) : timeData.elaDuration || 0;
  const scienceTime = scienceTimeFromParams
    ? parseInt(scienceTimeFromParams)
    : timeData.scienceDuration || 0;

  const calculatedTotalTime = mathTime + elaTime + scienceTime;

  return {
    math: mathTime ? formatDuration(mathTime) : "0m 0s",
    ela: elaTime ? formatDuration(elaTime) : "0m 0s",
    science: scienceTime ? formatDuration(scienceTime) : "0m 0s",
    total: calculatedTotalTime
      ? formatDuration(calculatedTotalTime)
      : "Time not available",
  };
};


  const handleDownloadReport = () => {
    handleFinishReview(); // Clear data and redirect to home after downloading report
  const wrongAnswers = totalQuestions - correctAnswersCount;
  const nameToUse = userName || "Student";

  // Get time data - use both URL params and localStorage as fallback
    const mathTimeFromParams = searchParams.get("mathTime");
    const elaTimeFromParams = searchParams.get("elaTime");
    const scienceTimeFromParams = searchParams.get("scienceTime");
    const totalTimeFromParams = searchParams.get("totalTime");
    
    const mathDuration = mathTimeFromParams ? parseInt(mathTimeFromParams) : timeData.mathDuration;
    const elaDuration = elaTimeFromParams ? parseInt(elaTimeFromParams) : timeData.elaDuration;
    const scienceDuration = scienceTimeFromParams ? parseInt(scienceTimeFromParams) : timeData.scienceDuration;
    const totalDuration = totalTimeFromParams ? parseInt(totalTimeFromParams) : timeData.totalDuration;

  const doc = new jsPDF();

  // === HEADER WITH LOGO (GREEN) ===
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, 210, 50, "F");
  doc.setTextColor(255, 255, 255);

  // Load the logo
  const logo = "/logo.png";
  const logoWidth = 40;
  const logoHeight = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoX = (pageWidth - logoWidth) / 2;
  const logoY = 10;
  doc.addImage(logo, "PNG", logoX, 5, logoWidth, logoHeight);

  const marginBelowLogo = 6;
  const textY = logoY + logoHeight + marginBelowLogo;

  // Report title
  doc.setFontSize(18);
  doc.text("SmartMathz Evaluation Assessment Report", 105, 40, { align: "center" });

  // === STUDENT INFORMATION TABLE ===
  const studentInfo: any[] = [
    ["Name", nameToUse],
    ["Email", userEmail || "N/A"],
    ["Grade", gradeParam?.toUpperCase() || "N/A"],
    ["Test Type", testId === "state-test" ? "State Test" : testId === "quiz-assessment" ? "Evaluation" : testId],
  ];

  // Add scores and timing information
  if (isGrade9Or10) {
    // Math Score and Time
    studentInfo.push(["Math Score", mathScore !== null ? `${mathScore.toFixed(2)}%` : "N/A"]);
    if (mathDuration) {
      studentInfo.push(["Math Time", formatDuration(mathDuration)]);
    }


    // Handle ELA score - show "Skipped" if skipped, otherwise show percentage
        studentInfo.push(["ELA Score", elaSkipped ? "Skipped" : (elaScore !== null ? `${elaScore}%` : "N/A")]);

        
        if (elaDuration && !elaSkipped) {
          studentInfo.push(["ELA Time", formatDuration(elaDuration)]);
        } else if (elaSkipped) {
          studentInfo.push(["ELA Time", "Skipped"]);
        } else {
          studentInfo.push(["ELA Time", "Not recorded"]);
        }

    studentInfo.push(["Science Score", scienceScore !== null ? `${scienceScore.toFixed(2)}%` : "N/A"]);

    studentInfo.push(["Science Time", scienceDuration ? formatDuration(scienceDuration) : "Not recorded"]);
    
    
  } else {
    // For non-Grade 9/10 tests, show overall score and total time
    studentInfo.push(["Overall Score", `${score}%`]);
    if (totalDuration) {
      studentInfo.push(["Total Time", formatDuration(totalDuration)]);
    }
  }

   const times = getFormattedTimeData();


  // Add general performance metrics
  studentInfo.push(
    ["Overall Score", `${score}%`],
    ["Correct Answers", `${correctAnswersCount}`],
    ["Wrong Answers", `${wrongAnswers}`],
    ["Total Questions", `${totalQuestions}`],
    ["Total Time Taken", times.total],
    //["Test Duration", getFormattedTimeData() ? getFormattedTimeData() : "N/A"],
    ["Date", new Date().toLocaleString()]
  );

  // Add section times if available for all test types
  if (mathDuration && !isGrade9Or10) {
    studentInfo.push(["Math Section Time", formatDuration(mathDuration)]);
  }
  if (elaDuration && !isGrade9Or10) {
    studentInfo.push(["ELA Section Time", formatDuration(elaDuration)]);
  }

  autoTable(doc, {
    startY: 60,
    head: [["Category", "Data"]],
    body: studentInfo,
    theme: "striped",
    headStyles: { fillColor: [34, 139, 34] },
    styles: { fontSize: 12, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold" },
    },
  });

  // === DETAILED SECTION PERFORMANCE (FOR GRADE 9/10) ===
  if (isGrade9Or10 && (mathScore !== null || elaScore !== null)) {
    const sectionData = [];
    

    if (mathScore !== null) {
      sectionData.push([
        "Math", 
        `${mathScore}%`, 
        mathDuration ? formatDuration(mathDuration) : "Not recorded",
        mathScore >= 70 ? "Good" : "Needs Improvement"
      ]);
    }
    
    if (elaSkipped) {
      sectionData.push(["ELA", "Skipped", "Skipped", "Skipped"]);
    } else if (elaScore !== null) {
      sectionData.push([
        "ELA", 
        `${elaScore}%`, 
        elaDuration ? formatDuration(elaDuration) : "Not recorded",
        elaScore >= 70 ? "Good" : "Needs Improvement"
      ]);
    }


    if (scienceScore !== null) {
      sectionData.push([
        "Science",
        `${scienceScore}%`,
        scienceDuration ? formatDuration(scienceDuration) : "Not recorded",
        scienceScore >= 70 ? "Good" : "Needs Improvement"
      ]);
    }





    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Section", "Score", "Time", "Performance"]],
      body: sectionData,
      theme: "striped",
      headStyles: { fillColor: [34, 139, 34] },
      styles: { fontSize: 10, cellPadding: 3 },
    });
  }

  // === FOOTER WITH LOGO & TEXT ===
  const footerY = doc.internal.pageSize.getHeight() - 25;
  doc.setFontSize(12);
  doc.setTextColor(100);
 
  // Add logo at footer
  const footerLogoWidth = 20;
  const footerLogoHeight = 20;
  const footerLogoX = (pageWidth - footerLogoWidth) / 2;
  doc.addImage(logo, "PNG", footerLogoX, footerY - 2, footerLogoWidth, footerLogoHeight);

  // Add footer text
  doc.text("Generated by SmartMathz", pageWidth / 2, footerY + 16, { align: "center" });

  doc.save("SmartMathz_Evaluation_Report.pdf");

};



// useEffect(() => {
//   console.log("🔥 Leaderboard useEffect triggered");

//   if (hasSavedRef.current) {
//     console.log("⚠️ Already saved — skipping");
//     return;
//   }

//   if (!userName || !userEmail || !gradeParam || loading) {
//     console.log("⏸ Waiting for user/profile data…");
//     return;
//   }

//   const saveToLeaderboard = async () => {
//     console.log("⚙️ Running saveToLeaderboard()...");

//     const totalSeconds =
//       parseInt(searchParams.get("totalTime") || "") ||
//       timeData.totalDuration ||
//       0;

//     const entry = {
//       full_name: userName,
//       email: userEmail,
//       grade: gradeParam,
//       math_score: mathScore ?? 0,
//       ela_score: elaScore ?? 0,
//       science_score:  scienceScore ?? 0 ,
//       overall_score: parseFloat(score),
//       total_time: totalSeconds,
//       test_type: testId,
//       created_at: new Date().toISOString(),
//     };


//     const { data, error } = await supabase
//       .from("leaderboard")
//       .insert([entry])
//       .select();
 
//     if (error) {
//       console.error("🔥 Supabase error FULL:", JSON.stringify(error, null, 2));
//     }
//     else {
//       console.log("✅ Saved to leaderboard:", data);
//       hasSavedRef.current = true; // 🔥 prevents duplicates
//     }
//   };

//   saveToLeaderboard();
// }, [
//   userName,
//   userEmail,
//   gradeParam,
//   loading,
//   score,
//   mathScore,
//   elaScore,
//   timeData,
//   testId,
// ]);

useEffect(() => {
  // Guard: don't run until all data is ready
  if (hasSavedRef.current) return;
  if (!userName || !userEmail || !gradeParam || loading) return;
  if (!score || score === "NaN") return; // wait for score to be valid

  hasSavedRef.current = true; // ✅ Set BEFORE the async call to prevent race conditions

  const saveToLeaderboard = async () => {
    const totalSeconds =
      parseInt(searchParams.get("totalTime") || "") ||
      timeData.totalDuration ||
      0;

    const entry = {
      full_name: userName,
      email: userEmail,
      grade: gradeParam,
      math_score: mathScore ?? 0,
      ela_score: elaScore ?? 0,
      science_score: scienceScore ?? 0,
      overall_score: parseFloat(score),
      total_time: totalSeconds,
      test_type: testId,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("leaderboard")
      .insert([entry])
      .select();

    if (error) {
      console.error("🔥 Supabase error:", JSON.stringify(error, null, 2));
      hasSavedRef.current = false; // ✅ Reset on failure so it can retry
    } else {
      console.log("✅ Saved to leaderboard:", data);
    }
  };

  saveToLeaderboard();
}, [userName, userEmail, gradeParam, loading, score]); // ✅ Remove timeData — it changes too often


if (loading) return <p className="text-center text-gray-600">Loading quiz data...</p>;
  if (!selectedQuiz || selectedQuiz.length === 0)
    return (
      <p className="text-center text-red-500 mt-10">
        No review data found for this test.
      </p>
    );


  return (
    <div className="min-h-screen bg-gray-50 pb-16 mt-12">

      {/* ── TOP HEADER ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-6 text-center">
        <span className="inline-block bg-indigo-600 text-white text-lg font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
          Test Review
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900 capitalize">
          {testId === "state-test" && stateParam && gradeParam
            ? `State Test · ${stateParam.toUpperCase()} · ${gradeParam.toUpperCase()}`
            : testId === "quiz-assessment"
              ? `Assessment · ${gradeParam?.toUpperCase()}`
              : `Test Review`}
        </h1>
        {isGrade9Or10 && (
          <p className="text-sm text-gray-400 italic mt-1">
            {localStorage.getItem("elaSkipped") === "true"
              ? "Only Math section attempted"
              : "Full Review"}
          </p>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">

        {/* ── SCORE CARDS ── */}
        {isGrade9Or10 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            {/* Math */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mx-auto mb-3">🔢</div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-1">Math</p>
              <p className="text-4xl font-extrabold text-indigo-600 leading-none">{mathScore}%</p>
              <div className="mt-3 h-1.5 rounded-full bg-indigo-100 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${mathScore}%` }} />
              </div>
            </div>

            {/* ELA */}
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

            {/* Science */}
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
          /* Overall score for non-9/10 grades */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center mb-8">
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-2">Overall Score</p>
            <p className="text-6xl font-extrabold text-indigo-600">{score}%</p>
            <div className="mt-4 h-2 rounded-full bg-indigo-100 overflow-hidden max-w-xs mx-auto">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${score}%` }} />
            </div>
          </div>
        )}

        {/* ── OVERALL STATS STRIP ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-wrap justify-center gap-12 text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Score</p>
            <p className="text-lg font-extrabold text-gray-800">{score}%</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Correct</p>
            <p className="text-lg font-extrabold text-gray-800">{correctAnswersCount} / {totalQuestions}</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Time</p>
            <p className="text-lg font-extrabold text-gray-800">{getFormattedTimeData().total}</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Math</p>
            <p className="text-lg font-extrabold text-indigo-600">{getFormattedTimeData().math}</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">ELA</p>
            <p className="text-lg font-extrabold text-emerald-600">{getFormattedTimeData().ela}</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Science</p>
            <p className="text-lg font-extrabold text-amber-600">{getFormattedTimeData().science}</p>
          </div>
        </div>

        {/* ── SECTIONED QUESTIONS ── */}
        {[
          { label: "Mathematics", emoji: "🔢", color: "indigo", qs: selectedQuiz.slice(0, 10) },
          { label: "English Language Arts", emoji: "📖", color: "emerald", qs: selectedQuiz.slice(10, 20) },
          { label: "Science", emoji: "🔬", color: "amber", qs: selectedQuiz.slice(20, 30) },
        ].map(({ label, emoji, color, qs }) =>
          qs.length === 0 ? null : (
            <div key={label} className="mb-12">

              {/* Section Header */}
              <div className={`flex items-center gap-3 mb-5 pb-3 border-b-2 ${color === "indigo" ? "border-indigo-200" :
                  color === "emerald" ? "border-emerald-200" : "border-amber-200"
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color === "indigo" ? "bg-indigo-50" :
                    color === "emerald" ? "bg-emerald-50" : "bg-amber-50"
                  }`}>{emoji}</div>
                <h2 className={`text-xl font-extrabold ${color === "indigo" ? "text-indigo-600" :
                    color === "emerald" ? "text-emerald-600" : "text-amber-600"
                  }`}>{label}</h2>
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${color === "indigo" ? "bg-indigo-50 text-indigo-500" :
                    color === "emerald" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
                  }`}>{qs.length} questions</span>
              </div>

              {/* Questions */}
              {qs.map((questionData, i) => {
                const globalIndex = selectedQuiz.indexOf(questionData);
                const selectedAnswer = answers?.[questionData.question];
                const correct = questionData.correctAnswer || questionData.answer;

                return (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 hover:shadow-md transition-shadow duration-200">

                    {/* Q number + status */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold ${color === "indigo" ? "bg-indigo-50 text-indigo-500" :
                          color === "emerald" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
                        }`}>{i + 1}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question {globalIndex + 1}</span>
                      <span className="ml-auto">
                        {!selectedAnswer
                          ? <span className="text-xs font-bold bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">⚠️ Skipped</span>
                          : selectedAnswer === correct
                            ? <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full">✅ Correct</span>
                            : <span className="text-xs font-bold bg-red-50 text-red-500 px-2 py-1 rounded-full">❌ Incorrect</span>
                        }
                      </span>
                    </div>

                    {/* Question text or image */}
                    {questionData.question.startsWith("https://res.cloudinary.com") ? (
                      <img src={questionData.question} alt={`Question ${globalIndex + 1}`} className="w-full max-w-2xl mb-5 rounded-lg" />
                    ) : (
                      <p className="text-gray-800 text-base font-semibold mb-5 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: questionData.question }} />
                    )}

                    {/* Options grid */}
                    <ul className="grid grid-cols-2 gap-2">
                      {questionData.options.map((option: string, oi: number) => {
                        const isCorrect = option === correct;
                        const isSelected = option === selectedAnswer;
                        const noAnswer = !selectedAnswer;

                        return (
                          <li key={oi} className={`p-3 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all
                          ${isCorrect && noAnswer ? "bg-green-50 border-green-200 text-green-800"
                              : isCorrect ? "bg-green-500 border-green-500 text-white"
                                : isSelected ? "bg-red-500 border-red-500 text-white"
                                  : "bg-gray-50 border-gray-100 text-gray-600"}`}>
                            <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0
                            ${isCorrect ? "bg-white/30" : "bg-white/60 text-gray-500"}`}>
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: option }} />
                            {isCorrect && <span className="ml-auto">✅</span>}
                            {isSelected && !isCorrect && <span className="ml-auto text-xs opacity-80">(Your Answer)</span>}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Skipped warning */}
                    {!selectedAnswer && (
                      <p className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-100 px-3 py-2 rounded-xl">
                        ⚠️ You did not select an answer for this question.
                      </p>
                    )}

                    {/* Show/Hide Solution */}
                    <button
                      className={`mt-4 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer
                      ${showSolutionIndex === globalIndex
                          ? "bg-green-600 text-white"
                          : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                      onClick={() => setShowSolutionIndex(showSolutionIndex === globalIndex ? null : globalIndex)}
                    >
                      {showSolutionIndex === globalIndex ? "Hide Solution ▲" : "Show Solution ▼"}
                    </button>

                    {showSolutionIndex === globalIndex && (
                      <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <h3 className="text-sm font-extrabold text-gray-700 mb-2">Solution</h3>
                        <p className="text-gray-700 leading-8 text-sm"
                          dangerouslySetInnerHTML={{ __html: questionData.solution }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── FOOTER BUTTONS ── */}
        <div className="flex justify-center gap-4 flex-wrap mt-4">
          {/* <button
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={handleFinishReview}
          >
            ✅ Finish Review
          </button> */}
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