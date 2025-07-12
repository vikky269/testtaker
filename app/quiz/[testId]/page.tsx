// "use client";

// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import quizData from "@/app/data/quizdata"; // regular quizzes
// import standardsData from "@/app/data/statetestdata"; // state tests
// import { useQuiz } from "@/app/context/QuizContext";
// import Timer from "@/app/components/Timer/Timer";
// import { quizAssessmentData } from "@/app/data/quizassessmentdata";
// import { useRef } from "react";


// export default function Quiz() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const testid = pathname.split("/").pop(); // e.g. 'math' or 'state-test'
//   const stateParam = searchParams.get("state")?.toLowerCase(); // e.g. 'ohio'
//   const gradeParam = searchParams.get("grade"); // e.g. 'K-2'

//   const { answers, setAnswers } = useQuiz();
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [unansweredCount, setUnansweredCount] = useState(0);


//   const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
//   const [submitted, setSubmitted] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   const questionRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//   if (questionRef.current) {
//     questionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//   }
// }, [currentQuestionIndex]);



//   useEffect(() => {
//   const savedState = localStorage.getItem("quizState");
//   if (savedState) {
//     const parsed = JSON.parse(savedState);
//     if (
//       parsed.testid === testid &&
//       parsed.gradeParam === gradeParam
//     ) {
//       setAnswers(parsed.answers || {});
//       setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
//       setSubmitted(parsed.submitted || false);
//     }
//   }
// }, [testid, gradeParam, setAnswers]);



// useEffect(() => {
//   const savedState = localStorage.getItem("quizState");
//   const hasSavedAnswers = savedState
//     ? JSON.parse(savedState).answers
//     : null;

//   if (testid === "state-test" && stateParam && gradeParam) {
//     const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "");
//     const key = `${stateParam}-${normalizedGrade}`;
//     const regularQuiz = standardsData[key];
//     setQuizQuestions(regularQuiz || []);
//     if (!hasSavedAnswers) {
//       setAnswers({});
//       localStorage.removeItem("quiz-end-time"); // 🧼 Clear stale timer
//     }
//   } else if (testid === "quiz-assessment" && gradeParam) {
//     const normalizedGrade = gradeParam.toLowerCase().replace(/\s+/g, "-");

//     const gradeQuiz = quizAssessmentData.find(
//       (entry) => entry.grade.toLowerCase().replace(/\s+/g, "-") === normalizedGrade
//     );

//     setQuizQuestions(gradeQuiz?.questions || []);
//     if (!hasSavedAnswers) {
//       setAnswers({});
//       localStorage.removeItem("quiz-end-time"); // 🧼 Clear stale timer
//     }
//   } else {
//     const regularQuiz = quizData[testid as string];
//     setQuizQuestions(regularQuiz || []);
//     if (!hasSavedAnswers) {
//       setAnswers({});
//       localStorage.removeItem("quiz-end-time"); // 🧼 Clear stale timer
//     }
//   }
// }, [testid, stateParam, gradeParam]);




//  useEffect(() => {
//   const quizState = {
//     testid,
//     gradeParam,
//     answers,
//     currentQuestionIndex,
//     submitted,
//   };
//   localStorage.setItem("quizState", JSON.stringify(quizState));
// }, [testid, gradeParam, answers, currentQuestionIndex, submitted]);


//   // Handle invalid quiz
//   if (!quizQuestions || quizQuestions.length === 0) {
//     return (
//       <div className="text-center text-red-500 my-20 text-4xl">
//         No quiz found for this test.
//       </div>
//     );
//   }

//   const currentQuestion = quizQuestions[currentQuestionIndex];

//   const handleSelect = (question: string, option: string) => {
//     setAnswers({ ...answers, [question]: option });
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < quizQuestions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1);
//     }
//   };

// const handleSubmit = () => {
//   const unanswered = quizQuestions.filter(q => !answers[q.question]);

//   if (unanswered.length > 0) {
//     setUnansweredCount(unanswered.length);
//     setShowConfirmModal(true); // 👈 Show custom modal
//     return;
//   }

//   // If all questions are answered, just submit
//   finalizeSubmit();
// };

// const handletimeupSubmit = ()=> {
//   finalizeSubmit();
// }

// const finalizeSubmit = () => {
//   setSubmitted(true);
//   localStorage.removeItem("quizState");
//   localStorage.removeItem("quiz-end-time");
// };

//   const calculateScore = () => {
//     let correctAnswers = 0;

//     quizQuestions.forEach((q) => {
//       const userAnswer = answers[q.question];
//       const correct = q.correctAnswer || q.answer;

//       if (userAnswer && userAnswer === correct) {
//         correctAnswers++;
//       }
//     });

//     const attemptedQuestions = Object.keys(answers || {}).length;
//     if (attemptedQuestions === 0) return 0; // Explicitly return 0 if no question was answered

//     return (correctAnswers / quizQuestions.length) * 100;
//   };


//   const handleGoHome = () => {
//   localStorage.removeItem("quizState");
//   localStorage.removeItem("quiz-end-time"); // reset timer on exit
//   setAnswers({});
//   setCurrentQuestionIndex(0);
//   setSubmitted(false);
//   router.push("/");
// };



//   const handleReview = () => {
//     const url = new URLSearchParams();

//     if (testid === "state-test" && stateParam && gradeParam) {
//       url.append("state", stateParam);
//       url.append("grade", gradeParam);
//       router.push(`/quiz/${testid}/review?${url.toString()}`);
//     } else if (testid === "quiz-assessment" && gradeParam) {
//       url.append("grade", gradeParam);
//       router.push(`/quiz/${testid}/review?${url.toString()}`);
//     } else {
//       router.push(`/quiz/${testid}/review`);
//     }
//   };

//   const totalQuestions = quizQuestions.length;
//   const answeredCount = Object.keys(answers).filter((key) =>
//     quizQuestions.find((q) => q.question === key)
//   ).length;


//   return (
//     <div ref={questionRef} className="mx-5 my-10 px-5 py-10 text-gray-900 border-2 border-black rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold text-center mb-4 capitalize">
//         {testid === "state-test" && stateParam && gradeParam
//           ? `${stateParam.toUpperCase()} ${gradeParam} Practice Test`
//           : testid === "quiz-assessment" && gradeParam
//             ? `Quiz Assessment for ${gradeParam.replace(/-/g, " ").toUpperCase()}`
//             : `${testid} Practice Test`}
//       </h1>

//       <div className="text-center font-medium text-md text-gray-600 mt-4 mb-8">
//         {answeredCount} of {totalQuestions} questions answered
//       </div>

//       {/* <div className="fixed top-54 right-8  px-4 py-2 rounded-lg z-50">
//         <Timer duration={7200} onTimeUp={handletimeupSubmit} />
//       </div> */}

//       {!submitted && <Timer duration={1200} onTimeUp={handletimeupSubmit} />}

//       {!submitted ? (
//         <div>
//           <div className="text-center text-lg md:text-3xl font-semibold mt-6 mb-6">
//             Question {currentQuestionIndex + 1} of {quizQuestions.length}
//           </div>



//           {currentQuestion.question.startsWith("https://res.cloudinary.com/") ? (
//             <img
//               src={currentQuestion.question}
//               alt="Quiz Question"
//               className="w-full max-w-5xl h-full mx-auto block mt-6"
//             />
//           ) : (
//             <p className="leading-12 text-xl md:text-2xl" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></p>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//             {currentQuestion.options.map((option: any) => (
//               <button
//                 key={option}
//                 className={`px-4 py-8 border rounded-lg cursor-pointer ${answers[currentQuestion.question] === option
//                     ? "bg-[#7FB509] text-white"
//                     : "bg-gray-200"
//                   }`}
//                 onClick={() => handleSelect(currentQuestion.question, option)}
//               >
//                 {/* {option} */}
//                 <p className="text-2xl leading-11" dangerouslySetInnerHTML={{ __html: option }}></p>
//               </button>
//             ))}
//           </div>

//           <div className="flex flex-col space-y-4 md:flex-row justify-between items-center mt-8">
//             <button
//               className={`py-2 px-6 cursor-pointer bg-[#7FB509] text-white rounded-lg ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               onClick={handlePrev}
//               disabled={currentQuestionIndex === 0}
//             >
//               Previous
//             </button>

//             {currentQuestionIndex < quizQuestions.length - 1 ? (
//               <button
//                 className="py-2 px-6 bg-[#7FB509] text-white rounded-lg cursor-pointer"
//                 onClick={handleNext}
//               >
//                 Next
//               </button>
//             ) : (
//               <div className="flex gap-6 items-center">
//                 <button
//                   className="py-3 px-6 bg-yellow-500 text-white rounded-lg cursor-pointer"
//                   onClick={() => setCurrentQuestionIndex(0)} // Start review from Q1
//                 >
//                   Review All
//                 </button>

//                 <button
//                   className="py-3 px-6 bg-red-600 text-white rounded-lg cursor-pointer"
//                   onClick={handleSubmit}
//                 >
//                   Submit Quiz
//                 </button>
//               </div>

//             )}
//           </div>
// {/* 
//           <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 justify-between items-center mt-8 px-4 py-4">
//             <button
//               className={`py-2  px-6 cursor-pointer bg-[#7FB509] text-white rounded-lg ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               onClick={handlePrev}
//               disabled={currentQuestionIndex === 0}
//             >
//               Previous
//             </button>

//             {currentQuestionIndex < quizQuestions.length - 1 ? (
//               <button
//                 className="py-2 px-6 bg-[#7FB509] text-white rounded-lg cursor-pointer"
//                 onClick={handleNext}
//               >
//                 Next
//               </button>
//             ) : (
//               <>
//                 <button
//                   className="py-3 px-6 bg-[#7FB509] text-white rounded-lg cursor-pointer"
//                   onClick={() => setCurrentQuestionIndex(0)}
//                 >
//                   Review All
//                 </button>

//                 <button
//                   className="py-3 px-6 bg-red-600 text-white rounded-lg cursor-pointer"
//                   onClick={handleSubmit}
//                 >
//                   Submit Quiz
//                 </button>
//               </>
//             )}
//           </div> */}


//           {showConfirmModal && (
//             <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
//                 <h2 className="text-lg font-semibold mb-4">Unanswered Questions</h2>
//                 <p className="mb-4 text-gray-700">
//                   You have <strong>{unansweredCount}</strong> unanswered question{unansweredCount > 1 ? "s" : ""}.
//                   Are you sure you want to submit?
//                 </p>
//                 <div className="flex justify-end gap-4">
//                   <button
//                     onClick={() => setShowConfirmModal(false)}
//                     className="px-4 py-2 bg-gray-300 text-gray-800 rounded cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowConfirmModal(false);
//                       finalizeSubmit();
//                     }}
//                     className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
//                   >
//                     Yes, Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}



//         </div>
//       ) : (
//         <div className="text-center">
//           <h2 className="text-xl font-bold">Your Score: {calculateScore()}%</h2>

//           {calculateScore() === 100 ? (
//             <button
//               className="mt-4 p-2 bg-blue-600 cursor-pointer text-white rounded-lg"
//               onClick={handleGoHome}
//             >
//               Back to Home
//             </button>
//           ) : (
//             <button
//               className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg"
//               onClick={handleReview}
//             >
//               Review Test
//             </button>
//           )}
//         </div>
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
  const isSATQuiz = gradeParam?.toLowerCase() === "sat" && testid !== "state-test";

  const { answers, setAnswers } = useQuiz();
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [satSection, setSatSection] = useState<'reading' | 'math'>('reading');
  const [showSatModal, setShowSatModal] = useState(false);
  const [isSatReading, setIsSatReading] = useState(true);

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
    const hasSavedAnswers = savedState
      ? JSON.parse(savedState).answers
      : null;

    if (testid === "state-test" && stateParam && gradeParam) {
      const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "");
      const key = `${stateParam}-${normalizedGrade}`;
      const regularQuiz = standardsData[key];
      setQuizQuestions(regularQuiz || []);
      if (!hasSavedAnswers) {
        setAnswers({});
        localStorage.removeItem("quiz-end-time");
      }
    } else if (testid === "quiz-assessment" && gradeParam) {
      const normalizedGrade = gradeParam.toLowerCase().replace(/\s+/g, "-");

      const gradeQuiz = quizAssessmentData.find(
        (entry) => entry.grade.toLowerCase().replace(/\s+/g, "-") === normalizedGrade
      );

      setQuizQuestions(gradeQuiz?.questions || []);
      if (!hasSavedAnswers) {
        setAnswers({});
        localStorage.removeItem("quiz-end-time");
      }
    } else {
      const regularQuiz = quizData[testid as string];
      setQuizQuestions(regularQuiz || []);
      if (!hasSavedAnswers) {
        setAnswers({});
        localStorage.removeItem("quiz-end-time");
      }
    }
  }, [testid, stateParam, gradeParam]);

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

  const isSat = gradeParam?.toLowerCase() === 'sat';
  const readingQuestions = isSat ? quizQuestions.slice(0, 10) : quizQuestions;
  const mathQuestions = isSat ? quizQuestions.slice(10) : [];
  const activeQuestions = isSat ? (satSection === 'reading' ? readingQuestions : mathQuestions) : quizQuestions;
  const currentQuestion = activeQuestions[currentQuestionIndex];

  const handleSelect = (question: string, option: string) => {
    setAnswers({ ...answers, [question]: option });
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

  const handleSubmit = () => {
    const unanswered = activeQuestions.filter(q => !answers[q.question]);
    if (unanswered.length > 0) {
      setUnansweredCount(unanswered.length);
      setShowConfirmModal(true);
      return;
    }

    if (isSat && satSection === 'reading') {
      setShowSatModal(true);
    } else {
      finalizeSubmit();
    }
  };

  const handleContinueMath = () => {
    setShowSatModal(false);
    setIsSatReading(false);
    setSatSection('math');
    setCurrentQuestionIndex(0);
  };

  const handletimeupSubmit = () => finalizeSubmit();

  const finalizeSubmit = () => {
    setSubmitted(true);
    localStorage.removeItem("quizState");
    localStorage.removeItem("quiz-end-time");
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizQuestions.forEach((q) => {
      const userAnswer = answers[q.question];
      const correct = q.correctAnswer || q.answer;
      if (userAnswer && userAnswer === correct) {
        correctAnswers++;
      }
    });
    return (correctAnswers / quizQuestions.length) * 100;
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
    const url = new URLSearchParams();
    if (testid === "state-test" && stateParam && gradeParam) {
      url.append("state", stateParam);
      url.append("grade", gradeParam);
      router.push(`/quiz/${testid}/review?${url.toString()}`);
    } else if (testid === "quiz-assessment" && gradeParam) {
      url.append("grade", gradeParam);
      router.push(`/quiz/${testid}/review?${url.toString()}`);
    } else {
      router.push(`/quiz/${testid}/review`);
    }
  };

  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(answers).filter((key) =>
    activeQuestions.find((q) => q.question === key)
  ).length;

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

      {isSATQuiz && !submitted && (
        <div className="text-center text-lg text-blue-700 font-semibold mt-2 mb-4">
          {isSatReading ? "SAT Section: Reading & Verbal" : "SAT Section: Math"}
        </div>
      )}

      <div className="text-center font-medium text-md text-gray-600 mt-4 mb-8">
        {answeredCount} of {totalQuestions} questions answered
      </div>

      {!submitted && <Timer duration={1680} onTimeUp={handletimeupSubmit} />}

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
                  <button onClick={() => { setShowConfirmModal(false); handleSubmit(); }} className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer">
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

        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Your Score: {calculateScore()}%</h2>
          {calculateScore() === 100 ? (
            <button className="mt-4 p-2 bg-blue-600 cursor-pointer text-white rounded-lg" onClick={handleGoHome}>
              Back to Home
            </button>
          ) : (
            <button className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg" onClick={handleReview}>
              Review Test
            </button>
          )}
        </div>
      )}
    </div>
  );
}


// "use client";

// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState, useRef } from "react";
// import quizData from "@/app/data/quizdata"; // regular quizzes
// import standardsData from "@/app/data/statetestdata"; // state tests
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

//   const { answers, setAnswers } = useQuiz();
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [unansweredCount, setUnansweredCount] = useState(0);
//   const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
//   const [submitted, setSubmitted] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [isSatReading, setIsSatReading] = useState(true);
//   const [showMathStartModal, setShowMathStartModal] = useState(false);

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
//       if (parsed.testid === testid && parsed.gradeParam === gradeParam) {
//         setAnswers(parsed.answers || {});
//         setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
//         setSubmitted(parsed.submitted || false);
//       }
//     }
//   }, [testid, gradeParam, setAnswers]);

//   useEffect(() => {
//     const savedState = localStorage.getItem("quizState");
//     const hasSavedAnswers = savedState ? JSON.parse(savedState).answers : null;

//     if (testid === "state-test" && stateParam && gradeParam) {
//       const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "");
//       const key = `${stateParam}-${normalizedGrade}`;
//       const regularQuiz = standardsData[key];
//       setQuizQuestions(regularQuiz || []);
//       if (!hasSavedAnswers) {
//         setAnswers({});
//         localStorage.removeItem("quiz-end-time");
//       }
//     } else if (testid === "quiz-assessment" && gradeParam) {
//       const normalizedGrade = gradeParam.toLowerCase().replace(/\s+/g, "-");
//       const gradeQuiz = quizAssessmentData.find(
//         (entry) => entry.grade.toLowerCase().replace(/\s+/g, "-") === normalizedGrade
//       );
//       setQuizQuestions(gradeQuiz?.questions || []);
//       if (!hasSavedAnswers) {
//         setAnswers({});
//         localStorage.removeItem("quiz-end-time");
//       }
//     } else {
//       const regularQuiz = quizData[testid as string];
//       setQuizQuestions(regularQuiz || []);
//       if (!hasSavedAnswers) {
//         setAnswers({});
//         localStorage.removeItem("quiz-end-time");
//       }
//     }
//   }, [testid, stateParam, gradeParam]);

//   useEffect(() => {
//     const quizState = {
//       testid,
//       gradeParam,
//       answers,
//       currentQuestionIndex,
//       submitted,
//     };
//     localStorage.setItem("quizState", JSON.stringify(quizState));
//   }, [testid, gradeParam, answers, currentQuestionIndex, submitted]);

//   const isSATQuiz = gradeParam?.toLowerCase() === "sat" && testid !== "state-test";

//   useEffect(() => {
//     if (isSATQuiz && currentQuestionIndex === 10) {
//       setShowMathStartModal(true);
//     }
//   }, [currentQuestionIndex, isSATQuiz]);

//   const startMathSection = () => {
//     setShowMathStartModal(false);
//     setIsSatReading(false);
//     setCurrentQuestionIndex(10);
//   };

//   const handleSelect = (question: string, option: string) => {
//     setAnswers({ ...answers, [question]: option });
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < quizQuestions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1);
//     }
//   };

//   const handleSubmit = () => {
//     const unanswered = quizQuestions.filter(q => !answers[q.question]);
//     if (unanswered.length > 0) {
//       setUnansweredCount(unanswered.length);
//       setShowConfirmModal(true);
//       return;
//     }
//     finalizeSubmit();
//   };

//   const handletimeupSubmit = () => {
//     finalizeSubmit();
//   };

//   const finalizeSubmit = () => {
//     setSubmitted(true);
//     localStorage.removeItem("quizState");
//     localStorage.removeItem("quiz-end-time");
//   };

//   const calculateScore = () => {
//     let correctAnswers = 0;
//     quizQuestions.forEach((q) => {
//       const userAnswer = answers[q.question];
//       const correct = q.correctAnswer || q.answer;
//       if (userAnswer && userAnswer === correct) {
//         correctAnswers++;
//       }
//     });
//     const attemptedQuestions = Object.keys(answers || {}).length;
//     if (attemptedQuestions === 0) return 0;
//     return (correctAnswers / quizQuestions.length) * 100;
//   };

//   const handleGoHome = () => {
//     localStorage.removeItem("quizState");
//     localStorage.removeItem("quiz-end-time");
//     setAnswers({});
//     setCurrentQuestionIndex(0);
//     setSubmitted(false);
//     router.push("/");
//   };

//   const handleReview = () => {
//     const url = new URLSearchParams();
//     if (testid === "state-test" && stateParam && gradeParam) {
//       url.append("state", stateParam);
//       url.append("grade", gradeParam);
//       router.push(`/quiz/${testid}/review?${url.toString()}`);
//     } else if (testid === "quiz-assessment" && gradeParam) {
//       url.append("grade", gradeParam);
//       router.push(`/quiz/${testid}/review?${url.toString()}`);
//     } else {
//       router.push(`/quiz/${testid}/review`);
//     }
//   };

//   const totalQuestions = quizQuestions.length;
//   const answeredCount = Object.keys(answers).filter((key) =>
//     quizQuestions.find((q) => q.question === key)
//   ).length;

//   const currentQuestion = quizQuestions[currentQuestionIndex];

//   return (
//     <div ref={questionRef} className="mx-5 my-10 px-5 py-10 text-gray-900 border-2 border-black rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold text-center mb-4 capitalize">
//         {testid === "state-test" && stateParam && gradeParam
//           ? `${stateParam.toUpperCase()} ${gradeParam} Practice Test`
//           : testid === "quiz-assessment" && gradeParam
//             ? `Quiz Assessment for ${gradeParam.replace(/-/g, " ").toUpperCase()}`
//             : `${testid} Practice Test`}
//       </h1>

//       {isSATQuiz && !submitted && (
//         <div className="text-center text-lg text-blue-700 font-semibold mt-2 mb-4">
//           {isSatReading ? "SAT Section: Reading & Verbal" : "SAT Section: Math"}
//         </div>
//       )}

//       <div className="text-center font-medium text-md text-gray-600 mt-4 mb-8">
//         {answeredCount} of {totalQuestions} questions answered
//       </div>

//       {!submitted && <Timer duration={1200} onTimeUp={handletimeupSubmit} />}

//       {showMathStartModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
//             <h2 className="text-xl font-semibold mb-4">Reading Section Complete</h2>
//             <p className="mb-4">You have completed the SAT Reading section. Click below to start the Math section.</p>
//             <button
//               onClick={startMathSection}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Start Math Section
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Existing quiz UI continues here... */}
//     </div>
//   );
// }

