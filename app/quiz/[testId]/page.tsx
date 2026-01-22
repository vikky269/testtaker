// "use client";

// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState, useRef } from "react";
// import quizData from "@/app/data/quizdata";
// import standardsData from "@/app/data/statetestdata";
// import { useQuiz } from "@/app/context/QuizContext";
// import Timer from "@/app/components/Timer/Timer";
// import { quizAssessmentData } from "@/app/data/quizassessmentdata";

// export default function Quiz() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const testid = pathname.split("/").pop();
//   const stateParam = searchParams.get("state")?.toLowerCase();
//   const gradeParam = searchParams.get("grade");
//   const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "") ?? "";
//   const isSATQuiz = ['sat', 'ssat'].includes(normalizedGrade) && testid !== "state-test";


//   const { answers, setAnswers } = useQuiz();
//   const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
//   const [submitted, setSubmitted] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [unansweredCount, setUnansweredCount] = useState(0);
//   const [satSection, setSatSection] = useState<'reading' | 'math'>('reading');
//   const [showSatModal, setShowSatModal] = useState(false);
//   const [isSatReading, setIsSatReading] = useState(true);

//   const [quizSection, setQuizSection] = useState<'math' | 'ela'>('math');
//   const [showGradeModal, setShowGradeModal] = useState(false);

//  //NEW STATE MANAGEMENT CODE ADDED HERE FOR TIME TRACKING
//   const [mathStartTime, setMathStartTime] = useState<number | null>(null);
//   const [mathEndTime, setMathEndTime] = useState<number | null>(null);
//   const [elaStartTime, setElaStartTime] = useState<number | null>(null);
//   const [elaEndTime, setElaEndTime] = useState<number | null>(null);
//   const [totalTestStartTime, setTotalTestStartTime] = useState<number | null>(null);
//   const [totalTestEndTime, setTotalTestEndTime] = useState<number | null>(null);

  
//   const questionRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (questionRef.current) {
//       questionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }, [currentQuestionIndex]);

//   useEffect(() => {
//     const savedState = localStorage.getItem("quizState");
//     if (savedState) {
//       const parsed = JSON.parse(savedState);
//       if (
//         parsed.testid === testid &&
//         parsed.gradeParam === gradeParam
//       ) {
//         setAnswers(parsed.answers || {});
//         setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
//         setSubmitted(parsed.submitted || false);
//         setSatSection(parsed.satSection || 'reading');
//       }
//     }
//   }, [testid, gradeParam, setAnswers]);


 
//   useEffect(() => {
//   const savedState = localStorage.getItem("quizState");
//   const parsed = savedState ? JSON.parse(savedState) : {};
//   const hasSavedAnswers = parsed.answers;
//   const wasSubmitted = parsed.submitted;

//   if (testid === "state-test" && stateParam && gradeParam) {
//     const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "");
//     const key = `${stateParam}-${normalizedGrade}`;
//     const regularQuiz = standardsData[key];
//     setQuizQuestions(regularQuiz || []);
//     if (!hasSavedAnswers || wasSubmitted) {
//       setAnswers({});
//       localStorage.removeItem("quiz-end-time");
//     }
//   } else if (testid === "quiz-assessment" && gradeParam) {
//     const normalizedGrade = gradeParam.toLowerCase().replace(/\s+/g, "-");
//     const gradeQuiz = quizAssessmentData.find(
//       (entry) => entry.grade.toLowerCase().replace(/\s+/g, "-") === normalizedGrade
//     );
//     setQuizQuestions(gradeQuiz?.questions || []);
//     if (!hasSavedAnswers || wasSubmitted) {
//       setAnswers({});
//       localStorage.removeItem("quiz-end-time");
//     }
//   } else {
//     const regularQuiz = quizData[testid as string];
//     setQuizQuestions(regularQuiz || []);
//     if (!hasSavedAnswers || wasSubmitted) {
//       setAnswers({});
//       localStorage.removeItem("quiz-end-time");
//     }
//   }
// }, [testid, stateParam, gradeParam, setAnswers]);

 
 
//   useEffect(() => {
//     const quizState = {
//       testid,
//       gradeParam,
//       answers,
//       currentQuestionIndex,
//       submitted,
//       satSection
//     };
//     localStorage.setItem("quizState", JSON.stringify(quizState));
//   }, [testid, gradeParam, answers, currentQuestionIndex, submitted, satSection]);

//   // Determine what quiz type we're dealing with
//   const isSat = ['sat', 'ssat'].includes(normalizedGrade);
//   const isGrade9Or10 = normalizedGrade === "9th-grade" || normalizedGrade === "10th-grade"|| normalizedGrade === "7th-grade" || normalizedGrade === "8th-grade" || normalizedGrade === "6th-grade" || normalizedGrade === "5th-grade" || normalizedGrade === "4th-grade" || normalizedGrade === "3rd-grade" || normalizedGrade === "11th-grade" || normalizedGrade === "12th-grade" || normalizedGrade === "2nd-grade" || normalizedGrade === "1st-grade" || normalizedGrade === "pre-k" || normalizedGrade === "kindergarten" || normalizedGrade === "year-7";

//   // Slice up questions for SAT
//   const readingQuestions = isSat ? quizQuestions.slice(0, 10) : [];
//   const mathQuestions = isSat ? quizQuestions.slice(10) : [];

//   // Slice up questions for Grade 9/10
//   const mathSectionQuestions = isGrade9Or10 ? quizQuestions.slice(0, 10) : [];
//   const elaSectionQuestions = isGrade9Or10 ? quizQuestions.slice(10) : [];

//   // Determine which questions are active
//   const activeQuestions = isSat
//     ? (satSection === 'reading' ? readingQuestions : mathQuestions)
//     : isGrade9Or10
//       ? (quizSection === 'math' ? mathSectionQuestions : elaSectionQuestions)
//       : quizQuestions;

//   // Finally, get the current question
//   const currentQuestion = activeQuestions[currentQuestionIndex];


//    //FIRST TIME TRACKING USEEFFECT
//    // Initialize test start time when component mounts


//   // useEffect(() => {
//   //   const savedTimeData = localStorage.getItem("quizTimeData");
//   //   if (savedTimeData) {
//   //     const parsed = JSON.parse(savedTimeData);
//   //     if (parsed.testid === testid && parsed.gradeParam === gradeParam && !parsed.completed) {
//   //       // Restore saved time data
//   //       setMathStartTime(parsed.mathStartTime);
//   //       setMathEndTime(parsed.mathEndTime);
//   //       setElaStartTime(parsed.elaStartTime);
//   //       setElaEndTime(parsed.elaEndTime);
//   //       setTotalTestStartTime(parsed.totalTestStartTime);
//   //       setTotalTestEndTime(parsed.totalTestEndTime);
//   //     } else {
//   //       // New test session
//   //       const now = Date.now();
//   //       setTotalTestStartTime(now);
//   //       if (isGrade9Or10 || isSat) {
//   //         setMathStartTime(now);
//   //       }
//   //     }
//   //   } else {
//   //     // First time starting
//   //     const now = Date.now();
//   //     setTotalTestStartTime(now);
//   //     if (isGrade9Or10 || isSat) {
//   //       setMathStartTime(now);
//   //     }
//   //   }
//   // }, [testid, gradeParam, isGrade9Or10, isSat]);

//  useEffect(() => {
//   const savedTimeData = localStorage.getItem("quizTimeData");
//   if (savedTimeData) {
//     const parsed = JSON.parse(savedTimeData);
//     if (parsed.testid === testid && parsed.gradeParam === gradeParam && !parsed.completed) {
//       // Restore saved time data
//       setMathStartTime(parsed.mathStartTime);
//       setMathEndTime(parsed.mathEndTime);
//       setElaStartTime(parsed.elaStartTime);
//       setElaEndTime(parsed.elaEndTime);
//       setTotalTestStartTime(parsed.totalTestStartTime);
//       setTotalTestEndTime(parsed.totalTestEndTime);
//     } else {
//       // New test session
//       const now = Date.now();
//       setTotalTestStartTime(now);
//       if (isGrade9Or10) {
//         setMathStartTime(now);
//       } else if (isSat) {
//         // For SAT, start with reading section
//         setElaStartTime(now);
//       }
//     }
//   } else {
//     // First time starting
//     const now = Date.now();
//     setTotalTestStartTime(now);
//     if (isGrade9Or10) {
//       setMathStartTime(now);
//     } else if (isSat) {
//       // For SAT, start with reading section
//       setElaStartTime(now);
//     }
//   }
// }, [testid, gradeParam, isGrade9Or10, isSat]);


// //TRACK MATH END TIME AND ELA START TIME
// // Save time data to localStorage
// useEffect(() => {
//   const timeData = {
//     testid,
//     gradeParam,
//     mathStartTime,
//     mathEndTime,
//     elaStartTime,
//     elaEndTime,
//     totalTestStartTime,
//     totalTestEndTime,
//     completed: submitted
//   };
//   localStorage.setItem("quizTimeData", JSON.stringify(timeData));
// }, [testid, gradeParam, mathStartTime, mathEndTime, elaStartTime, elaEndTime, totalTestStartTime, totalTestEndTime, submitted]);

// // Add this useEffect to properly initialize math start time
// useEffect(() => {
//   console.log("Checking math timing initialization...", {
//     isGrade9Or10,
//     quizSection,
//     mathStartTime
//   });

//   // Initialize math start time when math section begins
//   if (isGrade9Or10 && quizSection === 'math' && mathStartTime === null) {
//     const now = Date.now();
//     console.log("Initializing math start time:", now);
//     setMathStartTime(now);
    
//     // Also set total test start time if not set
//     if (totalTestStartTime === null) {
//       setTotalTestStartTime(now);
//     }
//   }

//   // Initialize ELA start time when ELA section begins  
//   if (isGrade9Or10 && quizSection === 'ela' && elaStartTime === null) {
//     const now = Date.now();
//     console.log("Initializing ELA start time:", now);
//     setElaStartTime(now);
//   }
// }, [isGrade9Or10, quizSection, mathStartTime, elaStartTime, totalTestStartTime]);

// //3RD TIME TRACKING USEEFFECT
// // Calculate time durations

// // const calculateDurations = () => {
// //   const durations: any = {};
// //   const now = Date.now();
  
// //  console.log("=== CALCULATE DURATIONS DEBUG ===");
// //   console.log("Current time state:", {
// //     mathStartTime,
// //     mathEndTime,
// //     elaStartTime, 
// //     elaEndTime,
// //     totalTestStartTime,
// //     totalTestEndTime,
// //     isGrade9Or10,
// //     isSat,
// //     quizSection,
// //     satSection
// //   });

// //   if (isGrade9Or10) {
// //     // For Grade 9/10: Math and ELA sections
// //     if (mathStartTime) {
// //       const endTime = mathEndTime || now;
// //       durations.mathDuration = Math.round((endTime - mathStartTime) / 1000);
// //     }
// //     if (elaStartTime) {
// //       const endTime = elaEndTime || now;
// //       durations.elaDuration = Math.round((endTime - elaStartTime) / 1000);
// //     }
// //   } else if (isSat) {
// //     // For SAT: Reading and Math sections
// //     if (elaStartTime) {
// //       const endTime = elaEndTime || now;
// //       durations.readingDuration = Math.round((endTime - elaStartTime) / 1000);
// //     }
// //     if (mathStartTime) {
// //       const endTime = mathEndTime || now;
// //       durations.mathDuration = Math.round((endTime - mathStartTime) / 1000);
// //     }
// //     durations.elaDuration = durations.readingDuration;
// //   }
  
// //   // Calculate total test duration
// //   if (totalTestStartTime) {
// //     const endTime = totalTestEndTime || now;
// //     durations.totalDuration = Math.round((endTime - totalTestStartTime) / 1000);
// //   }
  
// //   return durations;
// // };

// const calculateDurations = () => {
//   const durations: any = {};
//   const now = Date.now();
  
//   console.log("Calculating durations with:", {
//     mathStartTime, mathEndTime,
//     elaStartTime, elaEndTime,
//     totalTestStartTime, totalTestEndTime
//   });

//   // Calculate math duration - handle missing start time
//   if (mathEndTime) {
//     // If we have end time but no start time, estimate start time
//     const startTime = mathStartTime || (mathEndTime - (elaStartTime ? (elaStartTime - (totalTestStartTime ?? 0)) : 600000));
//     durations.mathDuration = Math.round((mathEndTime - startTime) / 1000);
//     console.log("Math duration (estimated):", durations.mathDuration, "seconds");
//   } else if (mathStartTime) {
//     // If we have start time but no end time, use current time
//     durations.mathDuration = Math.round((now - mathStartTime) / 1000);
//     console.log("Math duration (current):", durations.mathDuration, "seconds");
//   }

//   // Calculate ELA duration
//   if (elaStartTime) {
//     const endTime = elaEndTime || now;
//     durations.elaDuration = Math.round((endTime - elaStartTime) / 1000);
//     console.log("ELA duration:", durations.elaDuration, "seconds");
//   }

//   // Calculate total test duration
//   if (totalTestStartTime) {
//     const endTime = totalTestEndTime || now;
//     durations.totalDuration = Math.round((endTime - totalTestStartTime) / 1000);
//     console.log("Total duration:", durations.totalDuration, "seconds");
//   }

//   console.log("Final durations:", durations);
//   return durations;
// };


// const handleSelect = (question: string, option: string) => {
//   const currentAnswer = answers[question];
//   if (currentAnswer === option) {
//     const updatedAnswers = { ...answers };
//     delete updatedAnswers[question];
//     setAnswers(updatedAnswers);
//   } else {
//     setAnswers({
//       ...answers,
//       [question]: option,
//     });
//   }
// };

  
//   const handleNext = () => {
//     if (currentQuestionIndex < activeQuestions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1);
//     }
//   };

  
// //NEW HANDLE SUBMIT FUNCTION TO HANDLE GRADE 9/10 AND SAT MODALS



// const handleSubmit = () => {
//   const now = Date.now();
  
//   if (isGrade9Or10) {
//     if (quizSection === 'math' && !mathEndTime) {
//       setMathEndTime(now);
//     } else if (quizSection === 'ela' && !elaEndTime) {
//       setElaEndTime(now);
//     }
//   } else if (isSat) {
//     // Fixed SAT timing
//     if (satSection === 'reading' && !elaEndTime) {
//       setElaEndTime(now); // End reading section
//     } else if (satSection === 'math' && !mathEndTime) {
//       setMathEndTime(now); // End math section
//     }
//   }
  
//   const unanswered = activeQuestions.filter(q => !answers[q.question]);
//   if (unanswered.length > 0) {
//     setUnansweredCount(unanswered.length);
//     setShowConfirmModal(true);
//     return;
//   }
  
//   if (isGrade9Or10 && quizSection === 'math') {
//     setShowGradeModal(true);
//     return;
//   }

//   if (isSat && satSection === 'reading') {
//     setShowSatModal(true);
//   } else {
//     finalizeSubmit();
//   }
// };


// //handle take and skip ela functions


//   // Update grade modal handlers
//   const handleTakeEla = () => {
//      const now = Date.now();
//   if (!mathEndTime) {
//     setMathEndTime(now);
//   }
//     setShowGradeModal(false);
//     setShowConfirmModal(false);
//     setQuizSection('ela');
//     setCurrentQuestionIndex(0);

//     // Start ELA timing
//     setElaStartTime(Date.now());
//   };


//   const handleSkipEla = () => {
//   const now = Date.now();
//   if (!mathEndTime) {
//     setMathEndTime(now);
//   }
//   setShowGradeModal(false);
//   setTotalTestEndTime(now);

//  // Set a special flag to indicate ELA was skipped
//   localStorage.setItem("elaSkipped", "true");

//   finalizeSubmit();
// };


//   const handleSubmitAfterConfirm2 = () => {
//     // setShowConfirmModal(false); 
//     // finalizeSubmit();

//      if (isGrade9Or10 && quizSection === 'math') {
//       setShowGradeModal(true);
//       return;
//     }
//     finalizeSubmit();
//   };

//  //THE NEW FUCTION TO HANDLE CONTINUE MATH AND TIME TRACKING
//  const handleContinueMath = () => {
//   const now = Date.now();
  
//   // For SAT: End reading section time (store in elaEndTime)
//   if (!elaEndTime && isSat) {
//     setElaEndTime(now);
//   }
  
//   setShowSatModal(false);
//   setIsSatReading(false);
//   setSatSection('math');
//   setCurrentQuestionIndex(0);
  
//   // Start math section timing
//   setMathStartTime(now);
// };
  


// // const finalizeSubmit = () => {
// //   const now = Date.now();

// //   if (!totalTestEndTime) {
// //     setTotalTestEndTime(now);
// //   }

// //   if (isGrade9Or10) {
// //     if (quizSection === 'math' && !mathEndTime) {
// //       setMathEndTime(now);
// //     }
// //     if (quizSection === 'ela' && !elaEndTime) {
// //       setElaEndTime(now);
// //     }
// //   } else if (isSat) {
// //     if (satSection === 'reading' && !elaEndTime) {
// //       setElaEndTime(now);
// //     } else if (satSection === 'math' && !mathEndTime) {
// //       setMathEndTime(now);
// //     }
// //   }

// //   const durations = calculateDurations();
// //   console.log("Calculated durations:", durations); // Debug log
// //   localStorage.setItem("quizDurations", JSON.stringify(durations));
// //   localStorage.setItem("testDurations", JSON.stringify(durations));

// //   setSubmitted(true);
// //   localStorage.removeItem("quizState");
// //   localStorage.removeItem("quiz-end-time");
// //   localStorage.removeItem("quiz-end-time-sat-reading");
// //   localStorage.removeItem("quiz-end-time-sat-math");
// // };




// const finalizeSubmit = () => {
//   const now = Date.now();
//   console.log("Finalizing submit with current state:", {
//     mathStartTime, mathEndTime,
//     elaStartTime, elaEndTime,
//     totalTestStartTime, totalTestEndTime
//   });

//   // Ensure all end times are set
//   if (!mathEndTime && mathStartTime) {
//     setMathEndTime(now);
//     console.log("Set mathEndTime to now");
//   }

//   if (!elaEndTime && elaStartTime) {
//     setElaEndTime(now);
//     console.log("Set elaEndTime to now");
//   }

//   if (!totalTestEndTime && totalTestStartTime) {
//     setTotalTestEndTime(now);
//     console.log("Set totalTestEndTime to now");
//   }

//   // Use setTimeout to allow state updates to complete, then calculate
//   setTimeout(() => {
//     const durations = calculateDurations();
//     console.log("Final durations after state updates:", durations);
//     localStorage.setItem("quizDurations", JSON.stringify(durations));
//     localStorage.setItem("testDurations", JSON.stringify(durations));

//     setSubmitted(true);
//     localStorage.removeItem("quizState");
//     localStorage.removeItem("quiz-end-time");
//     localStorage.removeItem("quiz-end-time-sat-reading");
//     localStorage.removeItem("quiz-end-time-sat-math");
//   }, 100);
// };


// const handletimeupSubmit = () => {
//   const now = Date.now();
  
//   if (isGrade9Or10) {
//     if (quizSection === 'math') {
//       setMathEndTime(now);
//       setShowGradeModal(true);
//     } else {
//       setElaEndTime(now);
//       setTotalTestEndTime(now);
//       finalizeSubmit();
//     }
//   } else if (isSat) {
//     if (satSection === 'reading') {
//       setElaEndTime(now); // End reading section
//       setShowSatModal(true);
//     } else {
//       setMathEndTime(now); // End math section
//       setTotalTestEndTime(now);
//       finalizeSubmit();
//     }
//   } else {
//     setTotalTestEndTime(now);
//     finalizeSubmit();
//   }
// };

// const calculateScore = () => {
//   const isGrade9Or10 = gradeParam === "grade9" || gradeParam === "grade10";

//   if (!isGrade9Or10) {
//     const total = quizQuestions.length;
//     const correct = quizQuestions.filter(
//       (q) => answers[q.question] === (q.correctAnswer || q.answer)
//     ).length;
//     return { combined: ((correct / total) * 100).toFixed(2) };
//   }

//   const mathQuestions = quizQuestions.slice(0, 10);
//   const elaQuestions = quizQuestions.slice(10, 20);

//   const mathCorrect = mathQuestions.filter(
//     (q) => answers[q.question] === (q.correctAnswer || q.answer)
//   ).length;

//   const mathScore = ((mathCorrect / mathQuestions.length) * 100).toFixed(2);

//   const elaAnsweredCount = elaQuestions.filter(q => q.question in answers).length;

//   const elaScore = elaAnsweredCount > 0
//     ? (
//         (elaQuestions.filter(q => answers[q.question] === (q.correctAnswer || q.answer)).length /
//           elaQuestions.length) *
//         100
//       ).toFixed(2)
//     : "0.00";

//   return {
//     mathScore,
//     elaScore,
//     combinedScore: (
//       (mathCorrect + (elaAnsweredCount > 0 ? parseFloat(elaScore) / 100 * elaQuestions.length : 0)) /
//       (elaAnsweredCount > 0 ? 20 : 10) *
//       100
//     ).toFixed(2),
//   };
// };



// const calculateSectionScore = (section: "math" | "ela") => {

// // First, check if ELA was skipped
//   const elaSkipped = localStorage.getItem("elaSkipped") === "true";
  
//   // If it's the ELA section and it was skipped, return null instead of calculating
//   if (section === "ela" && elaSkipped) {
//     return null;
//   }


//   const isGrade9Or10 = gradeParam === "grade9" || gradeParam === "grade10";
//   // const questions = selectedQuiz;
//   const questions = isGrade9Or10
//     ? section === "math"
//       ? quizQuestions.slice(0, 10)
//       : quizQuestions.slice(10, 20)
//     : quizQuestions;

//   // Handle based on how many questions are available
//   const sectionQuestions =
//     section === "math"
//       ? questions.slice(0, Math.min(10, questions.length))
//       : questions.length > 10
//       ? questions.slice(10, 20)
//       : [];

//   const total = sectionQuestions.length;
//   if (total === 0) return "0.00";

//   const correct = sectionQuestions.filter(
//     (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
//   ).length;

//   return ((correct / total) * 100).toFixed(2);
// };




//   const handleGoHome = () => {
//     localStorage.removeItem("quizState");
//     localStorage.removeItem("quiz-end-time");
//     setAnswers({});
//     setCurrentQuestionIndex(0);
//     setSubmitted(false);
//     router.push("/");
//   };

// const handleReview = () => {
//   console.log("Handling review for testid:", testid);
//   const url = new URLSearchParams();

//   if (testid === "state-test" && stateParam && gradeParam) {
//     url.append("state", stateParam);
//     url.append("grade", gradeParam);
//   } else if (testid === "quiz-assessment" && gradeParam) {
//     url.append("grade", gradeParam);
//   }

//   const mathScore = calculateSectionScore("math");
//   const elaScore = calculateSectionScore("ela");
  
//   // Ensure we have the latest time data by calculating synchronously
//   const now = Date.now();
  
//   // For Grade 9/10: If math section was completed but end time not set
//   if (isGrade9Or10 && quizSection === 'ela' && mathEndTime === null && mathStartTime !== null) {
//     setMathEndTime(now);
//   }
  
//   // For SAT: If math section was completed but end time not set
//   if (isSat && satSection === 'math' && mathEndTime === null && mathStartTime !== null) {
//     setMathEndTime(now);
//   }

//   // Get time durations - use a synchronous calculation
//   const durations: any = {};
  
//   // Calculate math duration
//   if (mathStartTime && (mathEndTime || now)) {
//     const endTime = mathEndTime || now;
//     durations.mathDuration = Math.round((endTime - mathStartTime) / 1000);
//   }
  
//   // Calculate ELA duration
//   if (elaStartTime && (elaEndTime || now)) {
//     const endTime = elaEndTime || now;
//     durations.elaDuration = Math.round((endTime - elaStartTime) / 1000);
//   }
  
//   // Calculate total test duration
//   if (totalTestStartTime && (totalTestEndTime || now)) {
//     const endTime = totalTestEndTime || now;
//     durations.totalDuration = Math.round((endTime - totalTestStartTime) / 1000);
//   }
  
//   // Add time data to URL params
//   if (durations.mathDuration) {
//     url.append("mathTime", durations.mathDuration.toString());
//     console.log("Adding mathTime to URL:", durations.mathDuration);
//   }
  
//   if (durations.elaDuration) {
//     url.append("elaTime", durations.elaDuration.toString());
//   }
  
//   if (durations.totalDuration) {
//     url.append("totalTime", durations.totalDuration.toString());
//   }
  
//   if (durations.actualTestTime) {
//     url.append("actualTime", durations.actualTestTime.toString());
//   }

//   const isGrade9Or10Test = 
//     gradeParam === "9th-grade" || gradeParam === "10th-grade" ||  
//     gradeParam === "8th-grade" || gradeParam === "7th-grade" || 
//     gradeParam === "6th-grade" || gradeParam === "5th-grade" || 
//     gradeParam === "4th-grade" || gradeParam === "3rd-grade" || 
//     gradeParam === "11th-grade" || gradeParam === "12th-grade" || 
//     gradeParam === "2nd-grade" || gradeParam === "1st-grade" || 
//     gradeParam === "pre-k" || gradeParam === "kindergarten" || 
//     gradeParam === "year-7";

//   if (isGrade9Or10Test) {
//     if (mathScore !== null && mathScore !== undefined) {
//       url.append("mathScore", mathScore.toString());
//     }
//     if (elaScore !== null && elaScore !== undefined) {
//       url.append("elaScore", elaScore.toString());
//     }
//   }

//   if (mathScore !== null && mathScore !== undefined) {
//     localStorage.setItem("mathScore", mathScore.toString());
//   }
//   if (elaScore !== null && elaScore !== undefined) {
//     localStorage.setItem("elaScore", elaScore.toString());
//   }
//   localStorage.setItem("testDurations", JSON.stringify(durations));

//   router.push(`/quiz/${testid}/review?${url.toString()}`);
// };

//   const totalQuestions = submitted && isSATQuiz
//   ? quizQuestions.length
//   : activeQuestions.length;

// const answeredCount = submitted && isSATQuiz
//   ? Object.keys(answers).filter((key) =>
//       quizQuestions.find((q) => q.question === key)
//     ).length
//   : Object.keys(answers).filter((key) =>
//       activeQuestions.find((q) => q.question === key)
//     ).length;


  


//   // Helper function to format time for display
//   const formatDuration = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}m ${remainingSeconds}s`;
//   }


//   if (!quizQuestions || quizQuestions.length === 0) {
//     return <div className="text-center text-red-500 my-20 text-4xl">No quiz found for this test.</div>;
//   }

//   return (
//     <div ref={questionRef} className="mx-5 my-10 px-5 py-10 text-gray-900 border-2 border-black rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold text-center mb-4 capitalize">
//         {testid === "state-test" && stateParam && gradeParam
//           ? `${stateParam.toUpperCase()} ${gradeParam} Practice Test`
//           : testid === "quiz-assessment" && gradeParam
//           ? `Quiz Assessment for ${gradeParam.replace(/-/g, " ").toUpperCase()}`
//           : `${testid} Practice Test`}
//       </h1>


//        {(isSATQuiz || isGrade9Or10) && !submitted && (
//         <div className="text-center text-2xl text-[#7FB509] font-bold mt-2 mb-4">
//           {isSATQuiz
//             ? normalizedGrade === '2nd-grade'
//               ? `${satSection === 'reading' ? 'ELA' : 'Math'} Section`
//               : `${normalizedGrade === 'sat' ? 'SAT' : 'SSAT'} Section: ${satSection === 'reading' ? 'Reading & Verbal' : 'Math'}`
//             : `${quizSection === 'math' ? 'Math' : 'ELA'} Section`}
//         </div>
//       )}

//      <div className="text-center font-medium text-md text-gray-600 mt-4 mb-8">
//         {answeredCount} of {totalQuestions} questions answered
//       </div>


//       {!submitted && (
//        <Timer
//           duration={
//             isSATQuiz
//               ? isSatReading ? 960 : 720
//               : isGrade9Or10
//                 ? quizSection === 'math' ? 960 : 720
//                 : 1200
//           }
//           onTimeUp={handletimeupSubmit}
//           identifier={
//             isSATQuiz
//               ? isSatReading ? 'sat-reading' : 'sat-math'
//               : isGrade9Or10
//                 ? quizSection === 'math' ? 'grade-math' : 'grade-ela'
//                 : 'regular'
//           }
//         />

//       )}



//       {!submitted ? (
//         <div>
//           <div className="text-center text-lg md:text-3xl font-semibold mt-6 mb-6">
//             Question {currentQuestionIndex + 1} of {activeQuestions.length}
//           </div>

//           {currentQuestion.question.startsWith("https://") ? (
//             <img src={currentQuestion.question} alt="Quiz Question" className="w-full max-w-5xl h-full mx-auto block mt-6" />
//           ) : (
//             <p className="leading-12 text-xl md:text-2xl" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></p>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//             {currentQuestion.options.map((option: any) => (
//               <button
//                 key={option}
//                 className={`px-4 py-8 border rounded-lg cursor-pointer ${answers[currentQuestion.question] === option ? "bg-[#7FB509] text-white" : "bg-gray-200"}`}
//                 onClick={() => handleSelect(currentQuestion.question, option)}
//               >
//                 <p className="text-2xl leading-11" dangerouslySetInnerHTML={{ __html: option }}></p>
//               </button>
//             ))}
//           </div>

//           <div className="flex flex-col space-y-4 md:flex-row justify-between items-center mt-8">
//             <button
//               className={`py-2 px-6 cursor-pointer bg-[#7FB509] text-white rounded-lg ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
//               onClick={handlePrev}
//               disabled={currentQuestionIndex === 0}
//             >
//               Previous
//             </button>

//             {currentQuestionIndex < activeQuestions.length - 1 ? (
//               <button className="py-2 px-6 bg-[#7FB509] text-white rounded-lg cursor-pointer" onClick={handleNext}>
//                 Next
//               </button>
//             ) : (
//               <button className="py-3 px-6 bg-red-600 text-white rounded-lg cursor-pointer" onClick={handleSubmit}>
//                 Submit Quiz
//               </button>
//             )}
//           </div>

//           {showConfirmModal && (
//             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
//                 <h2 className="text-lg font-semibold mb-4">Unanswered Questions</h2>
//                 <p className="mb-4 text-gray-700">
//                   You have <strong>{unansweredCount}</strong> unanswered question{unansweredCount > 1 ? "s" : ""}. Are you sure you want to submit?
//                 </p>
//                 <div className="flex justify-end gap-4">
//                   <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded cursor-pointer">
//                     Cancel
//                   </button>
//                   <button onClick={() => handleSubmitAfterConfirm2() } className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer">
//                     Yes, Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {showSatModal && (
//             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
//                 <h2 className="text-xl font-bold mb-4">Continue to Math Section</h2>
//                 <p className="mb-4">You have completed the Reading & Verbal section. Ready to begin Math?</p>
//                 <div className="flex justify-end gap-4">
//                   <button onClick={handleContinueMath} className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
//                     Start Math Section
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}


//           {showGradeModal && (
//             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
//                 <h2 className="text-xl font-bold mb-4">Math Section Complete</h2>
//                 <p className="mb-4">You’ve finished the Math section. Would you like to continue with ELA?</p>
//                 <div className="flex justify-end gap-4">
//                   <button
//                     onClick={handleSkipEla}
//                     className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
//                   >
//                     Skip ELA
//                   </button>
//                   <button
//                     onClick={handleTakeEla}
//                     className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
//                   >
//                     Take ELA
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//           <div className="text-center">
//             {isGrade9Or10 ? (
//               <>
//                 <h2 className="text-xl font-bold mb-2">Section Scores:</h2>
//                 <div className="mb-4">
//                   <p className="text-lg text-blue-700">
//                     Math Score: {calculateSectionScore("math")}%
//                   </p>
//                   <p className="text-lg text-purple-700">
//                    {/* ELA Score: {calculateSectionScore("ela")}%
//                     ELA Score: {
//                       calculateSectionScore("ela") === "ELA Skipped"
//                         ? "Skipped"
//                         : `${calculateSectionScore("ela")}%`
//                     } */}
//                     {/* ELA Score:{" "}
//                     {calculateSectionScore("ela") === "ELA Skipped"
//                       ? "Skipped"
//                       : `${calculateSectionScore("ela")}%`} */}

//                     ELA Score:{" "}
//                     {localStorage.getItem("elaSkipped") === "true"
//                       ? "Skipped"
//                       : `${calculateSectionScore("ela")}%`}
//                   </p>
//                 </div>
//               </>
//             ) : (
//               <>
//                   <h2 className="text-xl font-bold">
//                     Your Score: {Number(calculateScore().combined).toFixed(2)}%
//                   </h2>

//               </>
//             )}

//             {Number(calculateScore()) === 100 ? (
//               <button
//                 className="mt-4 p-2 bg-blue-600 cursor-pointer text-white rounded-lg"
//                 onClick={handleGoHome}
//               >
//                 Back to Home
//               </button>
//             ) : (
//               <button
//                 className="mt-6 p-2 bg-green-600 cursor-pointer text-white rounded-lg"
//                 onClick={handleReview}
//               >
//                 Review Test
//               </button>
//             )}
//           </div>
//       )}
//     </div>
//   );
// }



"use client";


import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import quizData from "@/app/data/quizdata";
import standardsData from "@/app/data/statetestdata";
import { useQuiz } from "@/app/context/QuizContext";
import Timer from "@/app/components/Timer/Timer";
import { quizAssessmentData } from "@/app/data/quizassessmentdata";

export default function Quiz() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const testid = pathname.split("/").pop();
  const stateParam = searchParams.get("state")?.toLowerCase();
  const gradeParam = searchParams.get("grade");
  const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "") ?? "";
  const isSATQuiz = ['sat', 'ssat'].includes(normalizedGrade) && testid !== "state-test";


  const { answers, setAnswers } = useQuiz();
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [satSection, setSatSection] = useState<'reading' | 'math'>('reading');
  const [showSatModal, setShowSatModal] = useState(false);
  const [isSatReading, setIsSatReading] = useState(true);
  const [showScienceModal, setShowScienceModal] = useState(false);

  const [scienceStartTime, setScienceStartTime] = useState<number | null>(null);
  const [scienceEndTime, setScienceEndTime] = useState<number | null>(null);



  //const [quizSection, setQuizSection] = useState<'math' | 'ela'>('math');
  const [quizSection, setQuizSection] = useState<'math' | 'ela' | 'science'>('math');

  const [showGradeModal, setShowGradeModal] = useState(false);

 //NEW STATE MANAGEMENT CODE ADDED HERE FOR TIME TRACKING
  const [mathStartTime, setMathStartTime] = useState<number | null>(null);
  const [mathEndTime, setMathEndTime] = useState<number | null>(null);
  const [elaStartTime, setElaStartTime] = useState<number | null>(null);
  const [elaEndTime, setElaEndTime] = useState<number | null>(null);
  const [totalTestStartTime, setTotalTestStartTime] = useState<number | null>(null);
  const [totalTestEndTime, setTotalTestEndTime] = useState<number | null>(null);

  
  const questionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    const savedState = localStorage.getItem("quizState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (
        parsed.testid === testid &&
        parsed.gradeParam === gradeParam
      ) {
        setAnswers(parsed.answers || {});
        setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
        setSubmitted(parsed.submitted || false);
        setSatSection(parsed.satSection || 'reading');
      }
    }
  }, [testid, gradeParam, setAnswers]);


 
  useEffect(() => {
  const savedState = localStorage.getItem("quizState");
  const parsed = savedState ? JSON.parse(savedState) : {};
  const hasSavedAnswers = parsed.answers;
  const wasSubmitted = parsed.submitted;

  if (testid === "state-test" && stateParam && gradeParam) {
    const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "");
    const key = `${stateParam}-${normalizedGrade}`;
    const regularQuiz = standardsData[key];
    setQuizQuestions(regularQuiz || []);
    if (!hasSavedAnswers || wasSubmitted) {
      setAnswers({});
      localStorage.removeItem("quiz-end-time");
    }
  } else if (testid === "quiz-assessment" && gradeParam) {
    const normalizedGrade = gradeParam.toLowerCase().replace(/\s+/g, "-");
    const gradeQuiz = quizAssessmentData.find(
      (entry) => entry.grade.toLowerCase().replace(/\s+/g, "-") === normalizedGrade
    );
    setQuizQuestions(gradeQuiz?.questions || []);
    if (!hasSavedAnswers || wasSubmitted) {
      setAnswers({});
      localStorage.removeItem("quiz-end-time");
    }
  } else {
    const regularQuiz = quizData[testid as string];
    setQuizQuestions(regularQuiz || []);
    if (!hasSavedAnswers || wasSubmitted) {
      setAnswers({});
      localStorage.removeItem("quiz-end-time");
    }
  }
}, [testid, stateParam, gradeParam, setAnswers]);

 
 
  useEffect(() => {
    const quizState = {
      testid,
      gradeParam,
      answers,
      currentQuestionIndex,
      submitted,
      satSection
    };
    localStorage.setItem("quizState", JSON.stringify(quizState));
  }, [testid, gradeParam, answers, currentQuestionIndex, submitted, satSection]);

  // Determine what quiz type we're dealing with
  const isSat = ['sat', 'ssat'].includes(normalizedGrade);
  const isGrade9Or10 = normalizedGrade === "9th-grade" || normalizedGrade === "10th-grade"|| normalizedGrade === "7th-grade" || normalizedGrade === "8th-grade" || normalizedGrade === "6th-grade" || normalizedGrade === "5th-grade" || normalizedGrade === "4th-grade" || normalizedGrade === "3rd-grade" || normalizedGrade === "11th-grade" || normalizedGrade === "12th-grade" || normalizedGrade === "2nd-grade" || normalizedGrade === "1st-grade" || normalizedGrade === "pre-k" || normalizedGrade === "kindergarten" || normalizedGrade === "year-7";

  // Slice up questions for SAT
  const readingQuestions = isSat ? quizQuestions.slice(0, 10) : [];
  const mathQuestions = isSat ? quizQuestions.slice(10) : [];

  // Slice up questions for Grade 9/10
  // const mathSectionQuestions = isGrade9Or10 ? quizQuestions.slice(0, 10) : [];
  // const elaSectionQuestions = isGrade9Or10 ? quizQuestions.slice(10) : [];


  const isYear7 = normalizedGrade === "year-7";

const mathSectionQuestions = isGrade9Or10 || isYear7
  ? quizQuestions.slice(0, 10)
  : [];

const elaSectionQuestions = isGrade9Or10 || isYear7
  ? quizQuestions.slice(10, 20)
  : [];

const scienceSectionQuestions = isYear7
  ? quizQuestions.slice(20, 35)
  : [];


  const activeQuestions = isSat
  ? (satSection === 'reading' ? readingQuestions : mathQuestions)
  : isYear7
    ? quizSection === 'math'
      ? mathSectionQuestions
      : quizSection === 'ela'
      ? elaSectionQuestions
      : scienceSectionQuestions
    : isGrade9Or10
      ? quizSection === 'math'
        ? mathSectionQuestions
        : elaSectionQuestions
      : quizQuestions;






  // Finally, get the current question
  const currentQuestion = activeQuestions[currentQuestionIndex];


   //FIRST TIME TRACKING USEEFFECT
   // Initialize test start time when component mounts


  // useEffect(() => {
  //   const savedTimeData = localStorage.getItem("quizTimeData");
  //   if (savedTimeData) {
  //     const parsed = JSON.parse(savedTimeData);
  //     if (parsed.testid === testid && parsed.gradeParam === gradeParam && !parsed.completed) {
  //       // Restore saved time data
  //       setMathStartTime(parsed.mathStartTime);
  //       setMathEndTime(parsed.mathEndTime);
  //       setElaStartTime(parsed.elaStartTime);
  //       setElaEndTime(parsed.elaEndTime);
  //       setTotalTestStartTime(parsed.totalTestStartTime);
  //       setTotalTestEndTime(parsed.totalTestEndTime);
  //     } else {
  //       // New test session
  //       const now = Date.now();
  //       setTotalTestStartTime(now);
  //       if (isGrade9Or10 || isSat) {
  //         setMathStartTime(now);
  //       }
  //     }
  //   } else {
  //     // First time starting
  //     const now = Date.now();
  //     setTotalTestStartTime(now);
  //     if (isGrade9Or10 || isSat) {
  //       setMathStartTime(now);
  //     }
  //   }
  // }, [testid, gradeParam, isGrade9Or10, isSat]);

 useEffect(() => {
  const savedTimeData = localStorage.getItem("quizTimeData");
  if (savedTimeData) {
    const parsed = JSON.parse(savedTimeData);
    if (parsed.testid === testid && parsed.gradeParam === gradeParam && !parsed.completed) {
      // Restore saved time data
      setMathStartTime(parsed.mathStartTime);
      setMathEndTime(parsed.mathEndTime);
      setElaStartTime(parsed.elaStartTime);
      setElaEndTime(parsed.elaEndTime);
      setTotalTestStartTime(parsed.totalTestStartTime);
      setTotalTestEndTime(parsed.totalTestEndTime);
    } else {
      // New test session
      const now = Date.now();
      setTotalTestStartTime(now);
      if (isGrade9Or10) {
        setMathStartTime(now);
      } else if (isSat) {
        // For SAT, start with reading section
        setElaStartTime(now);
      }
    }
  } else {
    // First time starting
    const now = Date.now();
    setTotalTestStartTime(now);
    if (isGrade9Or10) {
      setMathStartTime(now);
    } else if (isSat) {
      // For SAT, start with reading section
      setElaStartTime(now);
    }
  }
}, [testid, gradeParam, isGrade9Or10, isSat]);


//TRACK MATH END TIME AND ELA START TIME
// Save time data to localStorage
useEffect(() => {
  const timeData = {
    testid,
    gradeParam,
    mathStartTime,
    mathEndTime,
    elaStartTime,
    elaEndTime,
    totalTestStartTime,
    totalTestEndTime,
    completed: submitted
  };
  localStorage.setItem("quizTimeData", JSON.stringify(timeData));
}, [testid, gradeParam, mathStartTime, mathEndTime, elaStartTime, elaEndTime, totalTestStartTime, totalTestEndTime, submitted]);

// Add this useEffect to properly initialize math start time
useEffect(() => {
  console.log("Checking math timing initialization...", {
    isGrade9Or10,
    quizSection,
    mathStartTime
  });

  // Initialize math start time when math section begins
  if (isGrade9Or10 && quizSection === 'math' && mathStartTime === null) {
    const now = Date.now();
    console.log("Initializing math start time:", now);
    setMathStartTime(now);
    
    // Also set total test start time if not set
    if (totalTestStartTime === null) {
      setTotalTestStartTime(now);
    }
  }

  // Initialize ELA start time when ELA section begins  
  if (isGrade9Or10 && quizSection === 'ela' && elaStartTime === null) {
    const now = Date.now();
    console.log("Initializing ELA start time:", now);
    setElaStartTime(now);
  }
}, [isGrade9Or10, quizSection, mathStartTime, elaStartTime, totalTestStartTime]);

//3RD TIME TRACKING USEEFFECT
// Calculate time durations

// const calculateDurations = () => {
//   const durations: any = {};
//   const now = Date.now();
  
//  console.log("=== CALCULATE DURATIONS DEBUG ===");
//   console.log("Current time state:", {
//     mathStartTime,
//     mathEndTime,
//     elaStartTime, 
//     elaEndTime,
//     totalTestStartTime,
//     totalTestEndTime,
//     isGrade9Or10,
//     isSat,
//     quizSection,
//     satSection
//   });

//   if (isGrade9Or10) {
//     // For Grade 9/10: Math and ELA sections
//     if (mathStartTime) {
//       const endTime = mathEndTime || now;
//       durations.mathDuration = Math.round((endTime - mathStartTime) / 1000);
//     }
//     if (elaStartTime) {
//       const endTime = elaEndTime || now;
//       durations.elaDuration = Math.round((endTime - elaStartTime) / 1000);
//     }
//   } else if (isSat) {
//     // For SAT: Reading and Math sections
//     if (elaStartTime) {
//       const endTime = elaEndTime || now;
//       durations.readingDuration = Math.round((endTime - elaStartTime) / 1000);
//     }
//     if (mathStartTime) {
//       const endTime = mathEndTime || now;
//       durations.mathDuration = Math.round((endTime - mathStartTime) / 1000);
//     }
//     durations.elaDuration = durations.readingDuration;
//   }
  
//   // Calculate total test duration
//   if (totalTestStartTime) {
//     const endTime = totalTestEndTime || now;
//     durations.totalDuration = Math.round((endTime - totalTestStartTime) / 1000);
//   }
  
//   return durations;
// };

const calculateDurations = () => {
  const durations: any = {};
  const now = Date.now();
  
  console.log("Calculating durations with:", {
    mathStartTime, mathEndTime,
    elaStartTime, elaEndTime,
    totalTestStartTime, totalTestEndTime
  });

  // Calculate math duration - handle missing start time
  if (mathEndTime) {
    // If we have end time but no start time, estimate start time
    const startTime = mathStartTime || (mathEndTime - (elaStartTime ? (elaStartTime - (totalTestStartTime ?? 0)) : 600000));
    durations.mathDuration = Math.round((mathEndTime - startTime) / 1000);
    console.log("Math duration (estimated):", durations.mathDuration, "seconds");
  } else if (mathStartTime) {
    // If we have start time but no end time, use current time
    durations.mathDuration = Math.round((now - mathStartTime) / 1000);
    console.log("Math duration (current):", durations.mathDuration, "seconds");
  }

  // Calculate ELA duration
  if (elaStartTime) {
    const endTime = elaEndTime || now;
    durations.elaDuration = Math.round((endTime - elaStartTime) / 1000);
    console.log("ELA duration:", durations.elaDuration, "seconds");
  }

  // Calculate total test duration
  if (totalTestStartTime) {
    const endTime = totalTestEndTime || now;
    durations.totalDuration = Math.round((endTime - totalTestStartTime) / 1000);
    console.log("Total duration:", durations.totalDuration, "seconds");
  }

  console.log("Final durations:", durations);
  return durations;
};


const handleSelect = (question: string, option: string) => {
  const currentAnswer = answers[question];
  if (currentAnswer === option) {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[question];
    setAnswers(updatedAnswers);
  } else {
    setAnswers({
      ...answers,
      [question]: option,
    });
  }
};

  
  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  
//NEW HANDLE SUBMIT FUNCTION TO HANDLE GRADE 9/10 AND SAT MODALS



const handleSubmit = () => {
  const now = Date.now();
  
  if (isGrade9Or10) {
    if (quizSection === 'math' && !mathEndTime) {
      setMathEndTime(now);
    } else if (quizSection === 'ela' && !elaEndTime) {
      setElaEndTime(now);
    }
  } else if (isSat) {
    // Fixed SAT timing
    if (satSection === 'reading' && !elaEndTime) {
      setElaEndTime(now); // End reading section
    } else if (satSection === 'math' && !mathEndTime) {
      setMathEndTime(now); // End math section
    }
  }
  
  const unanswered = activeQuestions.filter(q => !answers[q.question]);
  if (unanswered.length > 0) {
    setUnansweredCount(unanswered.length);
    setShowConfirmModal(true);
    return;
  }
  


  if (isYear7 && quizSection === 'math') {
  setShowGradeModal(true);
  return;
}

if (isYear7 && quizSection === 'ela') {
  setShowScienceModal(true);
  return;
}


  if (isSat && satSection === 'reading') {
    setShowSatModal(true);
  } else {
    finalizeSubmit();
  }
};


//handle take and skip ela functions


  // Update grade modal handlers
  const handleTakeEla = () => {
     const now = Date.now();
  if (!mathEndTime) {
    setMathEndTime(now);
  }
    setShowGradeModal(false);
    setShowConfirmModal(false);
    setQuizSection('ela');
    setCurrentQuestionIndex(0);

    // Start ELA timing
    setElaStartTime(Date.now());
  };


  const handleSkipEla = () => {
  const now = Date.now();
  if (!mathEndTime) {
    setMathEndTime(now);
  }
  setShowGradeModal(false);
  setTotalTestEndTime(now);

 // Set a special flag to indicate ELA was skipped
  localStorage.setItem("elaSkipped", "true");

  finalizeSubmit();
};



const handleTakeScience = () => {
  setScienceStartTime(Date.now());

  const now = Date.now();
  if (!elaEndTime) {
    setElaEndTime(now);
  }

  setShowScienceModal(false);
  setQuizSection('science');
  setCurrentQuestionIndex(0);
};

const handleSkipScience = () => {
  const now = Date.now();
  setTotalTestEndTime(now);
  finalizeSubmit();
};


  const handleSubmitAfterConfirm2 = () => {
    // setShowConfirmModal(false); 
    // finalizeSubmit();

     if (isGrade9Or10 && quizSection === 'math') {
      setShowGradeModal(true);
      return;
    }
    finalizeSubmit();
  };

 //THE NEW FUCTION TO HANDLE CONTINUE MATH AND TIME TRACKING
 const handleContinueMath = () => {
  const now = Date.now();
  
  // For SAT: End reading section time (store in elaEndTime)
  if (!elaEndTime && isSat) {
    setElaEndTime(now);
  }
  
  setShowSatModal(false);
  setIsSatReading(false);
  setSatSection('math');
  setCurrentQuestionIndex(0);
  
  // Start math section timing
  setMathStartTime(now);
};
  

const finalizeSubmit = () => {
  const now = Date.now();
  console.log("Finalizing submit with current state:", {
    mathStartTime, mathEndTime,
    elaStartTime, elaEndTime,
    totalTestStartTime, totalTestEndTime
  });

  // Ensure all end times are set
  if (!mathEndTime && mathStartTime) {
    setMathEndTime(now);
    console.log("Set mathEndTime to now");
  }

  if (!elaEndTime && elaStartTime) {
    setElaEndTime(now);
    console.log("Set elaEndTime to now");
  }

  if (!scienceEndTime && scienceStartTime) {
  setScienceEndTime(now);
}


  if (!totalTestEndTime && totalTestStartTime) {
    setTotalTestEndTime(now);
    console.log("Set totalTestEndTime to now");
  }

  // Use setTimeout to allow state updates to complete, then calculate
  setTimeout(() => {
    const durations = calculateDurations();
    console.log("Final durations after state updates:", durations);
    localStorage.setItem("quizDurations", JSON.stringify(durations));
    localStorage.setItem("testDurations", JSON.stringify(durations));

    setSubmitted(true);
    localStorage.removeItem("quizState");
    localStorage.removeItem("quiz-end-time");
    localStorage.removeItem("quiz-end-time-sat-reading");
    localStorage.removeItem("quiz-end-time-sat-math");
  }, 100);
};


const handletimeupSubmit = () => {
  const now = Date.now();
  
  if (isGrade9Or10) {
    if (quizSection === 'math') {
      setMathEndTime(now);
      setShowGradeModal(true);
    } else {
      setElaEndTime(now);
      setTotalTestEndTime(now);
      finalizeSubmit();
    }
  } else if (isSat) {
    if (satSection === 'reading') {
      setElaEndTime(now); // End reading section
      setShowSatModal(true);
    } else {
      setMathEndTime(now); // End math section
      setTotalTestEndTime(now);
      finalizeSubmit();
    }
  } else {
    setTotalTestEndTime(now);
    finalizeSubmit();
  }
};

const calculateScore = () => {
  const isGrade9Or10 = gradeParam === "grade9" || gradeParam === "grade10";

  if (!isGrade9Or10) {
    const total = quizQuestions.length;
    const correct = quizQuestions.filter(
      (q) => answers[q.question] === (q.correctAnswer || q.answer)
    ).length;
    return { combined: ((correct / total) * 100).toFixed(2) };
  }

  const mathQuestions = quizQuestions.slice(0, 10);
  const elaQuestions = quizQuestions.slice(10, 20);

  const mathCorrect = mathQuestions.filter(
    (q) => answers[q.question] === (q.correctAnswer || q.answer)
  ).length;

  const mathScore = ((mathCorrect / mathQuestions.length) * 100).toFixed(2);

  const elaAnsweredCount = elaQuestions.filter(q => q.question in answers).length;

  const elaScore = elaAnsweredCount > 0
    ? (
        (elaQuestions.filter(q => answers[q.question] === (q.correctAnswer || q.answer)).length /
          elaQuestions.length) *
        100
      ).toFixed(2)
    : "0.00";

  return {
    mathScore,
    elaScore,
    combinedScore: (
      (mathCorrect + (elaAnsweredCount > 0 ? parseFloat(elaScore) / 100 * elaQuestions.length : 0)) /
      (elaAnsweredCount > 0 ? 20 : 10) *
      100
    ).toFixed(2),
  };
};


const calculateSectionScore = (section: "math" | "ela" | "science") => {

  // Check if ELA was skipped
  const elaSkipped = localStorage.getItem("elaSkipped") === "true";

  if (section === "ela" && elaSkipped) {
    return null;
  }

  const isGrade9Or10 = gradeParam === "grade9" || gradeParam === "grade10";
  const isYear7 = gradeParam === "year-7";

  let sectionQuestions: any[] = [];

  // =========================
  // YEAR 7 LOGIC
  // Math = 0–9
  // ELA = 10–19
  // Science = 20–34
  // =========================
  if (isYear7) {
    if (section === "math") {
      sectionQuestions = quizQuestions.slice(0, 10);
    } else if (section === "ela") {
      sectionQuestions = quizQuestions.slice(10, 20);
    } else if (section === "science") {
      sectionQuestions = quizQuestions.slice(20, 35);
    }
  }

  // =========================
  // GRADE 9 / 10 LOGIC
  // Math = 0–9
  // ELA = 10–19
  // =========================
  else if (isGrade9Or10) {
    if (section === "math") {
      sectionQuestions = quizQuestions.slice(0, 10);
    } else if (section === "ela") {
      sectionQuestions = quizQuestions.slice(10, 20);
    }
  }

  // =========================
  // DEFAULT (Single section quizzes)
  // =========================
  else {
    sectionQuestions = quizQuestions;
  }

  const total = sectionQuestions.length;
  if (total === 0) return "0.00";

  const correct = sectionQuestions.filter(
    (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
  ).length;

  return ((correct / total) * 100).toFixed(2);
};



  const handleGoHome = () => {
    localStorage.removeItem("quizState");
    localStorage.removeItem("quiz-end-time");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    router.push("/");
  };


  const handleReview = () => {
    console.log("Handling review for testid:", testid);
    const url = new URLSearchParams();

    if (testid === "state-test" && stateParam && gradeParam) {
      url.append("state", stateParam);
      url.append("grade", gradeParam);
    } else if (testid === "quiz-assessment" && gradeParam) {
      url.append("grade", gradeParam);
    }

    const mathScore = calculateSectionScore("math");
    const elaScore = calculateSectionScore("ela");
    const scienceScore = calculateSectionScore("science");

    const isYear7 = gradeParam === "year-7";

    // -------------------------
    // TIME HANDLING
    // -------------------------
    const now = Date.now();

    if (isGrade9Or10 && quizSection === "ela" && mathEndTime === null && mathStartTime !== null) {
      setMathEndTime(now);
    }

    if (isSat && satSection === "math" && mathEndTime === null && mathStartTime !== null) {
      setMathEndTime(now);
    }

    const durations: any = {};

    if (mathStartTime && (mathEndTime || now)) {
      const endTime = mathEndTime || now;
      durations.mathDuration = Math.round((endTime - mathStartTime) / 1000);
    }

    if (elaStartTime && (elaEndTime || now)) {
      const endTime = elaEndTime || now;
      durations.elaDuration = Math.round((endTime - elaStartTime) / 1000);
    }

    if (totalTestStartTime && (totalTestEndTime || now)) {
      const endTime = totalTestEndTime || now;
      durations.totalDuration = Math.round((endTime - totalTestStartTime) / 1000);
    }

    if (durations.mathDuration) {
      url.append("mathTime", durations.mathDuration.toString());
    }

    if (durations.elaDuration) {
      url.append("elaTime", durations.elaDuration.toString());
    }

    if (durations.totalDuration) {
      url.append("totalTime", durations.totalDuration.toString());
    }

    // -------------------------
    // SCORE HANDLING
    // -------------------------
    const isGradeTest =
      gradeParam === "9th-grade" ||
      gradeParam === "10th-grade" ||
      gradeParam === "8th-grade" ||
      gradeParam === "7th-grade" ||
      gradeParam === "6th-grade" ||
      gradeParam === "5th-grade" ||
      gradeParam === "4th-grade" ||
      gradeParam === "3rd-grade" ||
      gradeParam === "11th-grade" ||
      gradeParam === "12th-grade" ||
      gradeParam === "2nd-grade" ||
      gradeParam === "1st-grade" ||
      gradeParam === "pre-k" ||
      gradeParam === "kindergarten" ||
      gradeParam === "year-7";

    if (isGradeTest) {
      if (mathScore !== null && mathScore !== undefined) {
        url.append("mathScore", mathScore.toString());
        localStorage.setItem("mathScore", mathScore.toString());
      }

      if (elaScore !== null && elaScore !== undefined) {
        url.append("elaScore", elaScore.toString());
        localStorage.setItem("elaScore", elaScore.toString());
      }

      // ✅ Science ONLY for Year 7
      if (isYear7 && scienceScore !== null && scienceScore !== undefined) {
        url.append("scienceScore", scienceScore.toString());
        localStorage.setItem("scienceScore", scienceScore.toString());
      }
    }

    localStorage.setItem("testDurations", JSON.stringify(durations));

    router.push(`/quiz/${testid}/review?${url.toString()}`);
  };

  const totalQuestions = submitted && isSATQuiz
  ? quizQuestions.length
  : activeQuestions.length;

const answeredCount = submitted && isSATQuiz
  ? Object.keys(answers).filter((key) =>
      quizQuestions.find((q) => q.question === key)
    ).length
  : Object.keys(answers).filter((key) =>
      activeQuestions.find((q) => q.question === key)
    ).length;


  // Helper function to format time for display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }


  if (!quizQuestions || quizQuestions.length === 0) {
    return <div className="text-center text-red-500 my-20 text-4xl">No quiz found for this test.</div>;
  }

  return (
    <div ref={questionRef} className="mx-5 my-10 px-5 py-10 text-gray-900 border-2 border-black rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4 capitalize">
        {testid === "state-test" && stateParam && gradeParam
          ? `${stateParam.toUpperCase()} ${gradeParam} Practice Test`
          : testid === "quiz-assessment" && gradeParam
          ? `Quiz Assessment for ${gradeParam.replace(/-/g, " ").toUpperCase()}`
          : `${testid} Practice Test`}
      </h1>


       {(isSATQuiz || isGrade9Or10) && !submitted && (
        <div className="text-center text-2xl text-[#7FB509] font-bold mt-2 mb-4">
          {isSATQuiz
            ? normalizedGrade === '2nd-grade'
              ? `${satSection === 'reading' ? 'ELA' : 'Math'} Section`
              : `${normalizedGrade === 'sat' ? 'SAT' : 'SSAT'} Section: ${satSection === 'reading' ? 'Reading & Verbal' : 'Math'}`
              :  `${quizSection === 'math' ? 'Math' : quizSection === 'ela' ? 'ELA': 'Science'} Section`}

        </div>
      )}

     {/* <div className="text-center font-medium text-md text-gray-600 mt-4 mb-8">
        {answeredCount} of {totalQuestions} questions answered
      </div> */}


      {!submitted && (
       <Timer
          duration={
            isSATQuiz
              ? isSatReading ? 960 : 720
              : isGrade9Or10
                ? quizSection === 'math' ? 960 : 1200
                : 1200
          }
          onTimeUp={handletimeupSubmit}
          identifier={
            isSATQuiz
              ? isSatReading ? 'sat-reading' : 'sat-math'
              : isGrade9Or10
                ? quizSection === 'math' ? 'grade-math' : 'grade-ela'
                : 'regular'
          }
        />

      )}



      {!submitted ? (
        <div>
          <div className="text-center text-lg md:text-3xl font-semibold mt-6 mb-6">
            Question {currentQuestionIndex + 1} of {activeQuestions.length}
          </div>

          {currentQuestion.question.startsWith("https://") ? (
            <img src={currentQuestion.question} alt="Quiz Question" className="w-full max-w-5xl h-full mx-auto block mt-6" />
          ) : (
            <p className="leading-12 text-xl md:text-2xl" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {currentQuestion.options.map((option: any) => (
              <button
                key={option}
                className={`px-4 py-8 border rounded-lg cursor-pointer ${answers[currentQuestion.question] === option ? "bg-[#7FB509] text-white" : "bg-gray-200"}`}
                onClick={() => handleSelect(currentQuestion.question, option)}
              >
                <p className="text-2xl leading-11" dangerouslySetInnerHTML={{ __html: option }}></p>
              </button>
            ))}
          </div>

          <div className="flex flex-col space-y-4 md:flex-row justify-between items-center mt-8">
            <button
              className={`py-2 px-6 cursor-pointer bg-[#7FB509] text-white rounded-lg ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button className="py-2 px-6 bg-[#7FB509] text-white rounded-lg cursor-pointer" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button className="py-3 px-6 bg-red-600 text-white rounded-lg cursor-pointer" onClick={handleSubmit}>
                Submit Quiz
              </button>
            )}
          </div>

          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Unanswered Questions</h2>
                <p className="mb-4 text-gray-700">
                  You have <strong>{unansweredCount}</strong> unanswered question{unansweredCount > 1 ? "s" : ""}. Are you sure you want to submit?
                </p>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={() => handleSubmitAfterConfirm2() } className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer">
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSatModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4">Continue to Math Section</h2>
                <p className="mb-4">You have completed the Reading & Verbal section. Ready to begin Math?</p>
                <div className="flex justify-end gap-4">
                  <button onClick={handleContinueMath} className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
                    Start Math Section
                  </button>
                </div>
              </div>
            </div>
          )}


          {showGradeModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4">Math Section Complete</h2>
                <p className="mb-4">You’ve finished the Math section. Would you like to continue with ELA?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleSkipEla}
                    className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
                  >
                    Skip ELA
                  </button>
                  <button
                    onClick={handleTakeEla}
                    className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                  >
                    Take ELA
                  </button>
                </div>
              </div>
            </div>
          )}

          {showScienceModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4">ELA Section Complete</h2>
                <p className="mb-4">Would you like to continue to Science?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleSkipScience}
                    className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
                  >
                    Skip Science
                  </button>
                  <button
                    onClick={handleTakeScience}
                    className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                  >
                    Take Science
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
          <div className="text-center">
            {isGrade9Or10 || gradeParam === "year-7" ? (
              <>
                <h2 className="text-xl font-bold mb-3">Section Scores</h2>

                {/* Math */}
                <p className="text-lg text-blue-700">
                  Math Score: {calculateSectionScore("math")}%
                </p>

                {/* ELA */}
                <p className="text-lg text-purple-700">
                  ELA Score:{" "}
                  {localStorage.getItem("elaSkipped") === "true"
                    ? "Skipped"
                    : `${calculateSectionScore("ela")}%`}
                </p>

                {/* Science — Year 7 only */}
                {gradeParam === "year-7" && (
                  <p className="text-lg text-green-700">
                    Science Score:{" "}
                    {localStorage.getItem("scienceSkipped") === "true"
                      ? "Skipped"
                      : `${calculateSectionScore("science")}%`}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">
                  Your Score: {Number(calculateScore().combined).toFixed(2)}%
                </h2>
              </>
            )}

            <button
              className="mt-6 p-2 bg-green-600 cursor-pointer text-white rounded-lg"
              onClick={handleReview}
            >
              Review Test
            </button>
          </div>
          
      )}
    </div>
  );
}
