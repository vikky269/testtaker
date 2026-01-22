
// "use client";
// import { useQuiz } from "@/app/context/QuizContext";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import quizData from "@/app/data/quizdata";
// import standardsData from "@/app/data/statetestdata";
// import { quizAssessmentData } from "@/app/data/quizassessmentdata";
// import { useEffect, useState } from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { supabase } from "@/lib/supabaseClient";
// import { useRef } from "react";

// export default function ReviewPage() {
//   const { answers, setAnswers } = useQuiz();
//   const { testId } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const hasSavedRef = useRef(false);

  
//   const stateParam = searchParams.get("state")?.toLowerCase();
//   const gradeParam = searchParams.get("grade")?.toLowerCase().replace(/\s+/g, "");


//   //new state variables added to my component

//   const mathScoreParam = searchParams.get("mathScore");
//   const elaScoreParam = searchParams.get("elaScore");
//   const mathScore = mathScoreParam ? parseFloat(mathScoreParam) : null;
//   const elaScore = elaScoreParam ? parseFloat(elaScoreParam) : null;

//   const [userName, setUserName] = useState<string>("");
//   const [userEmail, setUserEmail] = useState("");
//   const [selectedQuiz, setSelectedQuiz] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showSolutionIndex, setShowSolutionIndex] = useState<number | null>(null);
//   const [elaSkipped, setElaSkipped] = useState(false);


// // Fetch the logged-in user's profile
// useEffect(() => {
//   const getUserProfile = async () => {
//     const { data: { session } } = await supabase.auth.getSession();
//     const user = session?.user;

//     if (user) {
//       // Fetch profile from student_profile
//       const { data: profile, error } = await supabase
//         .from("student_profile")
//         .select("full_name")
//         .eq("id", user.id)
//         .single();

//       if (!error && profile) {
//         setUserName(profile.full_name);
//         console.log("User's full name from profile:", profile.full_name);
//       } else {
//         // fallback to email or placeholder
//         setUserName(user.email ?? "Student");
//       }
//       setUserEmail(user.email ?? "");
//     } else {
//       setUserName("Guest");
//       setUserEmail("");
//     }

//   };

//   getUserProfile();
// }, []);




//   // Add state for time data
//   const [timeData, setTimeData] = useState<{
//     mathDuration?: number;
//     elaDuration?: number;
//     totalDuration?: number;
//     actualTestTime?: number;
//   }>({});

//   // Determine if user skipped ELA (for Grade 9 or 10)
//   const isGrade9Or10 = gradeParam === "9th-grade" || gradeParam === "10th-grade" || 
//     gradeParam === "8th-grade" || gradeParam === "7th-grade" || gradeParam === "6th-grade" || 
//     gradeParam === "5th-grade" || gradeParam === "4th-grade" || gradeParam === "3rd-grade" || 
//     gradeParam === "11th-grade" || gradeParam === "12th-grade" || gradeParam === "2nd-grade" || 
//     gradeParam === "1st-grade"|| gradeParam === "pre-k" || gradeParam === "kindergarten";


// // Check if ELA was skipped
// useEffect(() => {
//   const skipped = localStorage.getItem("elaSkipped") === "true";
//   setElaSkipped(skipped);
//   console.log("ELA skipped:", skipped);
// }, []);




//   // Retrieve time data on mount
//   useEffect(() => {
//     // Try to get time data from URL params first
//     const mathTime = searchParams.get("mathTime");
//     const elaTime = searchParams.get("elaTime");
//     const totalTime = searchParams.get("totalTime");
//     const actualTime = searchParams.get("actualTime");

//     if (mathTime || elaTime || totalTime || actualTime) {
//       setTimeData({
//         mathDuration: mathTime ? parseInt(mathTime) : undefined,
//         elaDuration: elaTime ? parseInt(elaTime) : undefined,
//         totalDuration: totalTime ? parseInt(totalTime) : undefined,
//         actualTestTime: actualTime ? parseInt(actualTime) : undefined,
//       });
//     } else {
//       // Fallback to localStorage
//       const storedDurations = localStorage.getItem("testDurations");
//       if (storedDurations) {
//         setTimeData(JSON.parse(storedDurations));
//       }
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "");

//     let quiz: any[] = [];

//     if (testId === "state-test" && stateParam && gradeParam) {
//       const key = `${stateParam}-${gradeParam}`;
//       quiz = standardsData[key] || [];
//     } else if (testId === "quiz-assessment" && gradeParam) {
//       const found = quizAssessmentData.find(
//         (q) => normalize(q.grade) === gradeParam
//       );
//       quiz = found?.questions || [];
//     } else {
//       quiz = quizData[testId as string] || [];
//     }

//     const mathScoreParam = searchParams.get("mathScore");
//     const elaScoreParam = searchParams.get("elaScore");

//     console.log("Math Score from query:", mathScoreParam);
//     console.log("ELA Score from query:", elaScoreParam);

//     const mathScore = mathScoreParam ? parseFloat(mathScoreParam) : null;
//     const elaScore = elaScoreParam ? parseFloat(elaScoreParam) : null;

//     const mathQuestions = quiz.slice(0, 10);
//     const elaQuestions = quiz.slice(10);

//     // Only apply skip logic for grades 9 or 10
//     if (isGrade9Or10) {
//       if (elaScore !== null) {
//         // Use score from query string
//         setSelectedQuiz(elaScore === 0 ? mathQuestions : quiz);
//       } else {
//         // Fallback logic based on whether any ELA questions were answered
//         const elaAnswered = elaQuestions.some((q) => {
//           const ans = answers[q.question];
//           return ans && ans.trim() !== "";
//         });
//         setSelectedQuiz(elaAnswered ? quiz : mathQuestions);
//       }
//     } else {
//       // All other grades: show full quiz
//       setSelectedQuiz(quiz);
//     }

//     setLoading(false);
//   }, [testId, stateParam, gradeParam, answers, searchParams]);

//   const handleFinishReview = () => {
//     localStorage.removeItem("quizState");
//     localStorage.removeItem("mathScore");
//     localStorage.removeItem("elaScore");
//     localStorage.removeItem("quizTimeData");
//     localStorage.removeItem("testDurations");
//     localStorage.removeItem("quizDurations");
//     localStorage.removeItem("elaSkipped"); // Clean up the skip flag

    
//     // Clear all quiz-end-time keys
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith("quiz-end-time")) {
//         localStorage.removeItem(key);
//       }
//     });
    
//     setAnswers({});
//     router.push("/");
//   };

//   const correctAnswersCount = selectedQuiz.filter(
//     (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
//   ).length;

//   const totalQuestions = selectedQuiz.length;
//   const score = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);

//   // Helper function to format time
//   const formatDuration = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${minutes}m ${remainingSeconds}s`;
//   };


// const getFormattedTimeData = () => {
//   // Get time from URL params first, then fallback to state
//   const mathTimeFromParams = searchParams.get("mathTime");
//   const elaTimeFromParams = searchParams.get("elaTime");
//   const totalTimeFromParams = searchParams.get("totalTime");

//   const mathTime = mathTimeFromParams ? parseInt(mathTimeFromParams) : timeData.mathDuration || 0;
//   const elaTime = elaTimeFromParams ? parseInt(elaTimeFromParams) : timeData.elaDuration || 0;
//   const totalTime = totalTimeFromParams ? parseInt(totalTimeFromParams) : timeData.totalDuration || 0;

//   const tookMath = mathTime > 0;
//   const tookELA = elaTime > 0;

//   // Calculate total time
//   const calculatedTotalTime = (tookMath || tookELA) ? (mathTime + elaTime) : totalTime;

//   // Format values
//   const mathFormatted = tookMath ? formatDuration(mathTime) : "0m 0s";
//   const elaFormatted = tookELA ? formatDuration(elaTime) : "0m 0s";
//   const totalFormatted = calculatedTotalTime > 0 ? formatDuration(calculatedTotalTime) : "Time not available";

//   // Return all three as an object
//   return {
//     math: mathFormatted,
//     ela: elaFormatted,
//     total: totalFormatted
//   };
// };



//  // Function to generate and download PDF report


//   const handleDownloadReport = () => {
//   const wrongAnswers = totalQuestions - correctAnswersCount;
//   const nameToUse = userName || "Student";

//   // Get time data - use both URL params and localStorage as fallback
//   const mathTimeFromParams = searchParams.get("mathTime");
//   const elaTimeFromParams = searchParams.get("elaTime");
//   const totalTimeFromParams = searchParams.get("totalTime");
  
//   const mathDuration = mathTimeFromParams ? parseInt(mathTimeFromParams) : timeData.mathDuration;
//   const elaDuration = elaTimeFromParams ? parseInt(elaTimeFromParams) : timeData.elaDuration;
//   const totalDuration = totalTimeFromParams ? parseInt(totalTimeFromParams) : timeData.totalDuration;

//   const doc = new jsPDF();

//   // === HEADER WITH LOGO (GREEN) ===
//   doc.setFillColor(34, 139, 34);
//   doc.rect(0, 0, 210, 50, "F");
//   doc.setTextColor(255, 255, 255);

//   // Load the logo
//   const logo = "/logo.png";
//   const logoWidth = 40;
//   const logoHeight = 40;
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const logoX = (pageWidth - logoWidth) / 2;
//   const logoY = 10;
//   doc.addImage(logo, "PNG", logoX, 5, logoWidth, logoHeight);

//   const marginBelowLogo = 6;
//   const textY = logoY + logoHeight + marginBelowLogo;

//   // Report title
//   doc.setFontSize(18);
//   doc.text("SmartMathz Evaluation Assessment Report", 105, 40, { align: "center" });

//   // === STUDENT INFORMATION TABLE ===
//   const studentInfo: any[] = [
//     ["Name", nameToUse],
//     ["Email", userEmail || "N/A"],
//     ["Grade", gradeParam?.toUpperCase() || "N/A"],
//     ["Test Type", testId === "state-test" ? "State Test" : testId === "quiz-assessment" ? "Evaluation" : testId],
//   ];

//   // Add scores and timing information
//   if (isGrade9Or10) {
//     // Math Score and Time
//     studentInfo.push(["Math Score", mathScore !== null ? `${mathScore.toFixed(2)}%` : "N/A"]);
//     if (mathDuration) {
//       studentInfo.push(["Math Time", formatDuration(mathDuration)]);
//     }


//     // Handle ELA score - show "Skipped" if skipped, otherwise show percentage
//     studentInfo.push(["ELA Score", elaSkipped ? "Skipped" : (elaScore !== null ? `${elaScore}%` : "N/A")]);

//     if (elaDuration && !elaSkipped) {
//       studentInfo.push(["ELA Time", formatDuration(elaDuration)]);
//     } else if (elaSkipped) {
//       studentInfo.push(["ELA Time", "Skipped"]);
//     } else {
//       studentInfo.push(["ELA Time", "Not recorded"]);
//     }

    
//   } else {
//     // For non-Grade 9/10 tests, show overall score and total time
//     studentInfo.push(["Overall Score", `${score}%`]);
//     if (totalDuration) {
//       studentInfo.push(["Total Time", formatDuration(totalDuration)]);
//     }
//   }

//    const times = getFormattedTimeData();


//   // Add general performance metrics
//   studentInfo.push(
//     ["Overall Score", `${score}%`],
//     ["Correct Answers", `${correctAnswersCount}`],
//     ["Wrong Answers", `${wrongAnswers}`],
//     ["Total Questions", `${totalQuestions}`],
//     ["Total Time Taken", times.total],
//     //["Test Duration", getFormattedTimeData() ? getFormattedTimeData() : "N/A"],
//     ["Date", new Date().toLocaleString()]
//   );

//   // Add section times if available for all test types
//   if (mathDuration && !isGrade9Or10) {
//     studentInfo.push(["Math Section Time", formatDuration(mathDuration)]);
//   }
//   if (elaDuration && !isGrade9Or10) {
//     studentInfo.push(["ELA Section Time", formatDuration(elaDuration)]);
//   }

//   autoTable(doc, {
//     startY: 60,
//     head: [["Category", "Data"]],
//     body: studentInfo,
//     theme: "striped",
//     headStyles: { fillColor: [34, 139, 34] },
//     styles: { fontSize: 12, cellPadding: 4 },
//     columnStyles: {
//       0: { fontStyle: "bold" },
//     },
//   });

//   // === DETAILED SECTION PERFORMANCE (FOR GRADE 9/10) ===
//   if (isGrade9Or10 && (mathScore !== null || elaScore !== null)) {
//     const sectionData = [];
    

//     if (mathScore !== null) {
//       sectionData.push([
//         "Math", 
//         `${mathScore}%`, 
//         mathDuration ? formatDuration(mathDuration) : "Not recorded",
//         mathScore >= 70 ? "Good" : "Needs Improvement"
//       ]);
//     }
    
//     if (elaSkipped) {
//       sectionData.push(["ELA", "Skipped", "Skipped", "Skipped"]);
//     } else if (elaScore !== null) {
//       sectionData.push([
//         "ELA", 
//         `${elaScore}%`, 
//         elaDuration ? formatDuration(elaDuration) : "Not recorded",
//         elaScore >= 70 ? "Good" : "Needs Improvement"
//       ]);
//     }

//     autoTable(doc, {
//       startY: (doc as any).lastAutoTable.finalY + 20,
//       head: [["Section", "Score", "Time", "Performance"]],
//       body: sectionData,
//       theme: "striped",
//       headStyles: { fillColor: [34, 139, 34] },
//       styles: { fontSize: 10, cellPadding: 3 },
//     });
//   }

//   // === FOOTER WITH LOGO & TEXT ===
//   const footerY = doc.internal.pageSize.getHeight() - 25;
//   doc.setFontSize(12);
//   doc.setTextColor(100);
 
//   // Add logo at footer
//   const footerLogoWidth = 20;
//   const footerLogoHeight = 20;
//   const footerLogoX = (pageWidth - footerLogoWidth) / 2;
//   doc.addImage(logo, "PNG", footerLogoX, footerY - 2, footerLogoWidth, footerLogoHeight);

//   // Add footer text
//   doc.text("Generated by SmartMathz", pageWidth / 2, footerY + 16, { align: "center" });

//   doc.save("SmartMathz_Evaluation_Report.pdf");

// };


// // 🏁 Save results to leaderboard once everything is ready
// // useEffect(() => {
// //   console.log("🔥 Leaderboard useEffect triggered");

// //   console.log("DEBUG VALUES:", {
// //     userName,
// //     userEmail,
// //     gradeParam,
// //     loading,
// //   });


// //   // Prevent duplicates
// //   const hasSaved = sessionStorage.getItem("leaderboardSaved");
   
// //   if (hasSaved) {
// //     console.warn("⚠️ Leaderboard already saved for this session.");
// //     return;
// //   }

// //   // Check data readiness
// //   if (!userName || !userEmail || !gradeParam|| loading) {
// //     console.log("⏸ Waiting for user/profile data before saving leaderboard...");
// //     return;
// //   }

// //   const saveToLeaderboard = async () => {
// //     console.log("⚙️ Running saveToLeaderboard()...");

// //     // Get raw times
// //     const mathSeconds =
// //       parseInt(searchParams.get("mathTime") || "") ||
// //       timeData.mathDuration ||
// //       0;
// //     const elaSeconds =
// //       parseInt(searchParams.get("elaTime") || "") ||
// //       timeData.elaDuration ||
// //       0;
// //     const totalSeconds =
// //       parseInt(searchParams.get("totalTime") || "") ||
// //       timeData.totalDuration ||
// //       0;

// //     const leaderboardEntry = {
// //       full_name: userName,
// //       email: userEmail,
// //       grade: gradeParam,
// //       math_score: mathScore ?? 0,
// //       ela_score: elaScore ?? 0,
// //       overall_score: parseFloat(score),
// //       total_time: totalSeconds,
// //       test_type: testId,
// //       created_at: new Date().toISOString(),
// //     };

// //     console.log("📤 Data being sent to Supabase:", leaderboardEntry);

// //     const {
// //       data: { user },
// //     } = await supabase.auth.getUser();
// //     console.log("👤 Current Supabase auth user:", user);


// //     const { data, error } = await supabase
// //       .from("leaderboard")
// //       .insert([leaderboardEntry])
// //       .select();

// //     if (error) {
// //       console.error("❌ Supabase insert error:", error);
// //     } else {
// //       console.log("✅ Saved to leaderboard:", data);
// //       sessionStorage.setItem("leaderboardSaved", "true");
// //     }
// //   };

// //   saveToLeaderboard();
// // }, [
// //   userName,
// //   userEmail,
// //   gradeParam,
// //   loading,
// //   score,
// //   mathScore,
// //   elaScore,
// //   timeData,
// //   testId,
// // ]);

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
//       console.error("🔥 Supabase error:", error);
//     } else {
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



// if (loading) return <p className="text-center text-gray-600">Loading quiz data...</p>;
//   if (!selectedQuiz || selectedQuiz.length === 0)
//     return (
//       <p className="text-center text-red-500 mt-10">
//         No review data found for this test.
//       </p>
//     );

//   return (
//     <div className="container mx-auto p-5">
//       <h1 className="text-center text-2xl font-bold capitalize">
//         Review{" "}
//         {testId === "state-test" && stateParam && gradeParam
//           ? `State Test - ${stateParam.toUpperCase()} - ${gradeParam.toUpperCase()}`
//           : testId === "quiz-assessment"
//           ? `Assessment - ${gradeParam?.toUpperCase()}`
//           : `Test`}
//       </h1>

//       {/* {isGrade9Or10 && (
//         <p className="text-center text-sm italic text-gray-600">
//           {searchParams.get("elaScore") === "0.00"
//             ? "Only Math section attempted — showing Math Review"
//             : "Showing Full Review"}
//         </p>
//       )} */}
 

//       {isGrade9Or10 && (
//         <p className="text-center text-sm italic text-gray-600">
//           {localStorage.getItem("elaSkipped") === "true"
//             ? "Only Math section attempted — showing Math Review"
//             : "Showing Full Review"}
//         </p>
//       )}


//       {isGrade9Or10 && (
//         <div className="mt-2 text-center">
//           <p className="text-sm text-gray-700">
//             Math: {mathScore}%{elaSkipped ? " | ELA: Skipped" : ` | ELA: ${elaScore}%`}
//           </p>
//         </div>
//       )}

//       {/* Score */}
//       <div className="text-center my-4 p-4 bg-blue-100 border border-blue-400 rounded-lg">
//         <h2 className="text-xl font-semibold text-blue-700">Your Score: {score}%</h2>
//         <p className="text-gray-600">
//           {correctAnswersCount} out of {totalQuestions} questions correct
//         </p>
//         <p className="text-sm text-gray-500 mt-2">
//           Time Taken: {getFormattedTimeData().total} |  Math time: {getFormattedTimeData().math} | ELA time: {getFormattedTimeData().ela}
//         </p>
//       </div>

//       {/* Questions Review */}
//       {selectedQuiz.map((questionData, index) => {
//         const selectedAnswer = answers?.[questionData.question];
//         const correct = questionData.correctAnswer || questionData.answer;

//         return (
//           <div key={index} className="my-6 p-4 border rounded-lg shadow">
//             <p className="font-semibold mb-5">Question {index + 1}:</p>

//             {questionData.question.startsWith("https://res.cloudinary.com") ? (
//               <img
//                 src={questionData.question}
//                 alt={`Question ${index + 1}`}
//                 className="w-full max-w-2xl mb-6"
//               />
//             ) : (
//               <p className="leading-12 mb-5 text-xl" dangerouslySetInnerHTML={{ __html: questionData.question }}></p>
//             )}

//             <ul className="grid grid-cols-2 gap-2 mt-2">
//               {questionData.options.map((option: string, i: number) => {
//                 const isCorrect = option === correct;
//                 const isSelected = option === selectedAnswer;
//                 const noAnswerSelected = !selectedAnswer;

//                 return (
//                   <li
//                     key={i}
//                     className={`p-2 text-center border rounded-lg
//                      ${isCorrect && noAnswerSelected ? "bg-green-200 text-green-800"
//                         : isCorrect ? "bg-green-500 text-white"
//                           : isSelected ? "bg-red-500 text-white"
//                             : "bg-gray-200"}`}
//                   >
//                     <span
//                       className="text-lg"
//                       dangerouslySetInnerHTML={{
//                         __html: `${option}
//               ${isSelected ? " (Your Answer)" : ""}
//               ${isCorrect ? " ✅" : ""}`
//                       }}
//                     />
//                   </li>
//                 );
//               })}
//             </ul>

//             {!selectedAnswer && (
//               <p className="mt-2 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
//                 ⚠️ You did not select an answer for this question.
//               </p>
//             )}

//             <button
//               className={`mt-5 cursor-pointer px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-200
//     ${showSolutionIndex === index
//                   ? "bg-green-600 hover:bg-green-700 text-white"
//                   : "bg-green-400 hover:bg-green-500 text-white"
//                 }`}
//               onClick={() =>
//                 setShowSolutionIndex(showSolutionIndex === index ? null : index)
//               }
//             >
//               {showSolutionIndex === index ? "Hide Solution" : "Show Solution"}
//             </button>

//             {showSolutionIndex === index && (
//               <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
//                 <h3 className="font-semibold mb-2">Solution:</h3>
//                 <p dangerouslySetInnerHTML={{ __html: questionData.solution }} className="leading-9"></p>
//               </div>
//             )}
//           </div>
//         );
//       })}

//       {/* Finish Review Button */}
//       <div className="flex justify-center items-center">
//         <button
//           className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg hover:translate-y-[-1px] transition-transform duration-200"
//           onClick={handleFinishReview}
//         >
//           Finish Review
//         </button>

//         <button
//           className="mt-4 ml-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg hover:translate-y-[-1px] transition-transform duration-200"
//           onClick={handleDownloadReport}
//         >
//           Download Assessment Report
//         </button>
//       </div>
//     </div>
//   );
// }






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

  const isYear7 = gradeParam === "year-7";

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
    totalDuration?: number;
    actualTestTime?: number;
  }>({});

  // Determine if user skipped ELA (for Grade 9 or 10)
  const isGrade9Or10 = gradeParam === "9th-grade" || gradeParam === "10th-grade" || 
    gradeParam === "8th-grade" || gradeParam === "7th-grade" || gradeParam === "6th-grade" || 
    gradeParam === "5th-grade" || gradeParam === "4th-grade" || gradeParam === "3rd-grade" || 
    gradeParam === "11th-grade" || gradeParam === "12th-grade" || gradeParam === "2nd-grade" || 
    gradeParam === "1st-grade"|| gradeParam === "pre-k" || gradeParam === "kindergarten";


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
    const totalTime = searchParams.get("totalTime");
    const actualTime = searchParams.get("actualTime");

    if (mathTime || elaTime || totalTime || actualTime) {
      setTimeData({
        mathDuration: mathTime ? parseInt(mathTime) : undefined,
        elaDuration: elaTime ? parseInt(elaTime) : undefined,
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
  // Get time from URL params first, then fallback to state
  const mathTimeFromParams = searchParams.get("mathTime");
  const elaTimeFromParams = searchParams.get("elaTime");
  const totalTimeFromParams = searchParams.get("totalTime");

  const mathTime = mathTimeFromParams ? parseInt(mathTimeFromParams) : timeData.mathDuration || 0;
  const elaTime = elaTimeFromParams ? parseInt(elaTimeFromParams) : timeData.elaDuration || 0;
  const totalTime = totalTimeFromParams ? parseInt(totalTimeFromParams) : timeData.totalDuration || 0;

  const tookMath = mathTime > 0;
  const tookELA = elaTime > 0;

  // Calculate total time
  const calculatedTotalTime = (tookMath || tookELA) ? (mathTime + elaTime) : totalTime;

  // Format values
  const mathFormatted = tookMath ? formatDuration(mathTime) : "0m 0s";
  const elaFormatted = tookELA ? formatDuration(elaTime) : "0m 0s";
  const totalFormatted = calculatedTotalTime > 0 ? formatDuration(calculatedTotalTime) : "Time not available";

  // Return all three as an object
  return {
    math: mathFormatted,
    ela: elaFormatted,
    total: totalFormatted
  };
};



 // Function to generate and download PDF report


  const handleDownloadReport = () => {
  const wrongAnswers = totalQuestions - correctAnswersCount;
  const nameToUse = userName || "Student";

  // Get time data - use both URL params and localStorage as fallback
  const mathTimeFromParams = searchParams.get("mathTime");
  const elaTimeFromParams = searchParams.get("elaTime");
  const totalTimeFromParams = searchParams.get("totalTime");
  
  const mathDuration = mathTimeFromParams ? parseInt(mathTimeFromParams) : timeData.mathDuration;
  const elaDuration = elaTimeFromParams ? parseInt(elaTimeFromParams) : timeData.elaDuration;
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

    // Science (Year 7 only)
    if (isYear7 && scienceScore !== null) {
      studentInfo.push(["Science Score", `${scienceScore}%`]);
    }


    if (elaDuration && !elaSkipped) {
      studentInfo.push(["ELA Time", formatDuration(elaDuration)]);
    } else if (elaSkipped) {
      studentInfo.push(["ELA Time", "Skipped"]);
    } else {
      studentInfo.push(["ELA Time", "Not recorded"]);
    }

    
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


    if (isYear7 && scienceScore !== null) {
      sectionData.push([
        "Science",
        `${scienceScore}%`,
        "Not recorded",
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



useEffect(() => {
  console.log("🔥 Leaderboard useEffect triggered");

  if (hasSavedRef.current) {
    console.log("⚠️ Already saved — skipping");
    return;
  }

  if (!userName || !userEmail || !gradeParam || loading) {
    console.log("⏸ Waiting for user/profile data…");
    return;
  }

  const saveToLeaderboard = async () => {
    console.log("⚙️ Running saveToLeaderboard()...");

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
      science_score: isYear7 ? scienceScore ?? 0 : null,
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
      console.error("🔥 Supabase error:", error);
    } else {
      console.log("✅ Saved to leaderboard:", data);
      hasSavedRef.current = true; // 🔥 prevents duplicates
    }
  };

  saveToLeaderboard();
}, [
  userName,
  userEmail,
  gradeParam,
  loading,
  score,
  mathScore,
  elaScore,
  timeData,
  testId,
]);



if (loading) return <p className="text-center text-gray-600">Loading quiz data...</p>;
  if (!selectedQuiz || selectedQuiz.length === 0)
    return (
      <p className="text-center text-red-500 mt-10">
        No review data found for this test.
      </p>
    );

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-center text-2xl font-bold capitalize">
        Review{" "}
        {testId === "state-test" && stateParam && gradeParam
          ? `State Test - ${stateParam.toUpperCase()} - ${gradeParam.toUpperCase()}`
          : testId === "quiz-assessment"
          ? `Assessment - ${gradeParam?.toUpperCase()}`
          : `Test`}
      </h1>

      {/* {isGrade9Or10 && (
        <p className="text-center text-sm italic text-gray-600">
          {searchParams.get("elaScore") === "0.00"
            ? "Only Math section attempted — showing Math Review"
            : "Showing Full Review"}
        </p>
      )} */}
 

      {isGrade9Or10 && (
        <p className="text-center text-sm italic text-gray-600">
          {localStorage.getItem("elaSkipped") === "true"
            ? "Only Math section attempted — showing Math Review"
            : "Showing Full Review"}
        </p>
      )}


      {/* {isGrade9Or10 && (
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-700">
            Math: {mathScore}%{elaSkipped ? " | ELA: Skipped" : ` | ELA: ${elaScore}%`}
          </p>
        </div>
      )} */}



      {isGrade9Or10 && (
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-700">
            Math: {mathScore}%
            {elaSkipped ? " | ELA: Skipped" : ` | ELA: ${elaScore}%`}
            {isYear7 && scienceScore !== null ? ` | Science: ${scienceScore}%` : ""}
          </p>
        </div>
      )}


      {/* Score */}
      <div className="text-center my-4 p-4 bg-blue-100 border border-blue-400 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700">Your Score: {score}%</h2>
        <p className="text-gray-600">
          {correctAnswersCount} out of {totalQuestions} questions correct
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Time Taken: {getFormattedTimeData().total} |
          Math time: {getFormattedTimeData().math} |
          ELA time: {getFormattedTimeData().ela}
          {isYear7 ? " | Science time: N/A" : ""}
        </p>

      </div>

      {/* Questions Review */}
      {selectedQuiz.map((questionData, index) => {
        const selectedAnswer = answers?.[questionData.question];
        const correct = questionData.correctAnswer || questionData.answer;

        return (
          <div key={index} className="my-6 p-4 border rounded-lg shadow">
            <p className="font-semibold mb-5">Question {index + 1}:</p>

            {questionData.question.startsWith("https://res.cloudinary.com") ? (
              <img
                src={questionData.question}
                alt={`Question ${index + 1}`}
                className="w-full max-w-2xl mb-6"
              />
            ) : (
              <p className="leading-12 mb-5 text-xl" dangerouslySetInnerHTML={{ __html: questionData.question }}></p>
            )}

            <ul className="grid grid-cols-2 gap-2 mt-2">
              {questionData.options.map((option: string, i: number) => {
                const isCorrect = option === correct;
                const isSelected = option === selectedAnswer;
                const noAnswerSelected = !selectedAnswer;

                return (
                  <li
                    key={i}
                    className={`p-2 text-center border rounded-lg
                     ${isCorrect && noAnswerSelected ? "bg-green-200 text-green-800"
                        : isCorrect ? "bg-green-500 text-white"
                          : isSelected ? "bg-red-500 text-white"
                            : "bg-gray-200"}`}
                  >
                    <span
                      className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: `${option}
              ${isSelected ? " (Your Answer)" : ""}
              ${isCorrect ? " ✅" : ""}`
                      }}
                    />
                  </li>
                );
              })}
            </ul>

            {!selectedAnswer && (
              <p className="mt-2 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                ⚠️ You did not select an answer for this question.
              </p>
            )}

            <button
              className={`mt-5 cursor-pointer px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-200
    ${showSolutionIndex === index
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-400 hover:bg-green-500 text-white"
                }`}
              onClick={() =>
                setShowSolutionIndex(showSolutionIndex === index ? null : index)
              }
            >
              {showSolutionIndex === index ? "Hide Solution" : "Show Solution"}
            </button>

            {showSolutionIndex === index && (
              <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
                <h3 className="font-semibold mb-2">Solution:</h3>
                <p dangerouslySetInnerHTML={{ __html: questionData.solution }} className="leading-9"></p>
              </div>
            )}
          </div>
        );
      })}

      {/* Finish Review Button */}
      <div className="flex justify-center items-center">
        <button
          className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg hover:translate-y-[-1px] transition-transform duration-200"
          onClick={handleFinishReview}
        >
          Finish Review
        </button>

        <button
          className="mt-4 ml-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg hover:translate-y-[-1px] transition-transform duration-200"
          onClick={handleDownloadReport}
        >
          Download Assessment Report
        </button>
      </div>
    </div>
  );
}