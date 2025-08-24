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
  //const isGrade9Or10 = ['grade9', 'grade10'].includes(normalizedGrade);


  const { answers, setAnswers } = useQuiz();
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [satSection, setSatSection] = useState<'reading' | 'math'>('reading');
  const [showSatModal, setShowSatModal] = useState(false);
  const [isSatReading, setIsSatReading] = useState(true);

  const [quizSection, setQuizSection] = useState<'math' | 'ela'>('math');
  const [showGradeModal, setShowGradeModal] = useState(false);
  

  // const [selectedQuiz, setSelectedQuiz] = useState<any[]>([]);




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


  localStorage.setItem(`quiz-${testid}-start-time`, Date.now().toString());
  

  
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
  const isGrade9Or10 = normalizedGrade === "9th-grade" || normalizedGrade === "10th-grade"|| normalizedGrade === "7th-grade" || normalizedGrade === "8th-grade" || normalizedGrade === "6th-grade" || normalizedGrade === "5th-grade" || normalizedGrade === "4th-grade" || normalizedGrade === "3rd-grade" || normalizedGrade === "11th-grade" || normalizedGrade === "12th-grade" || normalizedGrade === "2nd-grade" || normalizedGrade === "1st-grade" || normalizedGrade === "pre-k" || normalizedGrade === "kindergarten";

  // Slice up questions for SAT
  const readingQuestions = isSat ? quizQuestions.slice(0, 10) : [];
  const mathQuestions = isSat ? quizQuestions.slice(10) : [];

  // Slice up questions for Grade 9/10
  const mathSectionQuestions = isGrade9Or10 ? quizQuestions.slice(0, 10) : [];
  const elaSectionQuestions = isGrade9Or10 ? quizQuestions.slice(10) : [];

  // Determine which questions are active
  const activeQuestions = isSat
    ? (satSection === 'reading' ? readingQuestions : mathQuestions)
    : isGrade9Or10
      ? (quizSection === 'math' ? mathSectionQuestions : elaSectionQuestions)
      : quizQuestions;

  // Finally, get the current question
  const currentQuestion = activeQuestions[currentQuestionIndex];


  

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

  const handleSubmit = () => {
    const unanswered = activeQuestions.filter(q => !answers[q.question]);
    if (unanswered.length > 0 ) {
      setUnansweredCount(unanswered.length);
      setShowConfirmModal(true);
      return;
    }
    
    //if its grade 9 or 10, show modal
    if (isGrade9Or10 && quizSection === 'math') {
      setShowGradeModal(true);
      return;
    }



    if (isSat && satSection === 'reading') {
      setShowSatModal(true);
    } else {
      finalizeSubmit();
    }
  };

  const handleSubmitAfterConfirm = () => {
    setShowConfirmModal(false); 
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

  const handleContinueMath = () => {
    setShowSatModal(false);
    setIsSatReading(false);
    setSatSection('math');
    setCurrentQuestionIndex(0);
  };

  //const handletimeupSubmit = () => finalizeSubmit();
 
  const handletimeupSubmit = () => {
  if (isGrade9Or10 && quizSection === 'math') {
    setShowGradeModal(true); // show the modal to choose ELA or Skip
  } else {
    finalizeSubmit(); // submit immediately for other grades
  }
};


  const finalizeSubmit = () => {
    setSubmitted(true);
    localStorage.removeItem("quizState");
    localStorage.removeItem("quiz-end-time");
    localStorage.removeItem("quiz-end-time-sat-reading");
    localStorage.removeItem("quiz-end-time-sat-math");

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



const calculateSectionScore = (section: "math" | "ela") => {
  const isGrade9Or10 = gradeParam === "grade9" || gradeParam === "grade10";
  // const questions = selectedQuiz;
  const questions = isGrade9Or10
    ? section === "math"
      ? quizQuestions.slice(0, 10)
      : quizQuestions.slice(10, 20)
    : quizQuestions;

  // Handle based on how many questions are available
  const sectionQuestions =
    section === "math"
      ? questions.slice(0, Math.min(10, questions.length))
      : questions.length > 10
      ? questions.slice(10, 20)
      : [];

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
  console.log("Math Score:", mathScore);
  console.log("ELA Score:", elaScore);


 // const isGrade9Or10 = gradeParam === "grade9" || gradeParam === "grade10";

  const isGrade9Or10 =
    gradeParam === "9th-grade" || gradeParam === "10th-grade" ||  gradeParam === "8th-grade" || gradeParam === "7th-grade" || gradeParam === "6th-grade" || gradeParam === "5th-grade" || gradeParam === "4th-grade" || gradeParam === "3rd-grade" || gradeParam === "11th-grade" || gradeParam === "12th-grade" || gradeParam === "2nd-grade" || gradeParam === "1st-grade"|| gradeParam === "pre-k" || gradeParam === "kindergarten";

    console.log("isGrade9Or10:", isGrade9Or10);

  if (isGrade9Or10) {
    url.append("mathScore", mathScore.toString());
    url.append("elaScore", elaScore.toString());
  }

    localStorage.setItem("mathScore", mathScore.toString());
    localStorage.setItem("elaScore", elaScore.toString());


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
            : `${quizSection === 'math' ? 'Math' : 'ELA'} Section`}
        </div>
      )}

     <div className="text-center font-medium text-md text-gray-600 mt-4 mb-8">
        {answeredCount} of {totalQuestions} questions answered
      </div>


      {!submitted && (
       <Timer
          duration={
            isSATQuiz
              ? isSatReading ? 960 : 720
              : isGrade9Or10
                ? quizSection === 'math' ? 960 : 720
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
                    onClick={() => {
                      setShowGradeModal(false);
                      finalizeSubmit(); // Skip ELA
                    }}
                    className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
                  >
                    Skip ELA
                  </button>
                  <button
                    onClick={() => {
                      setShowGradeModal(false);
                      setShowConfirmModal(false);
                      setQuizSection('ela');
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                  >
                    Take ELA
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
          <div className="text-center">
            {isGrade9Or10 ? (
              <>
                <h2 className="text-xl font-bold mb-2">Section Scores:</h2>
                <div className="mb-4">
                  <p className="text-lg text-blue-700">
                    Math Score: {calculateSectionScore("math")}%
                  </p>
                  <p className="text-lg text-purple-700">
                    ELA Score: {calculateSectionScore("ela")}%
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* <h2 className="text-xl font-bold">Your Score: {Number(calculateScore())}%</h2> */}
                  <h2 className="text-xl font-bold">
                    Your Score: {Number(calculateScore().combined).toFixed(2)}%
                  </h2>

              </>
            )}

            {Number(calculateScore()) === 100 ? (
              <button
                className="mt-4 p-2 bg-blue-600 cursor-pointer text-white rounded-lg"
                onClick={handleGoHome}
              >
                Back to Home
              </button>
            ) : (
              <button
                className="mt-6 p-2 bg-green-600 cursor-pointer text-white rounded-lg"
                onClick={handleReview}
              >
                Review Test
              </button>
            )}
          </div>
      )}
    </div>
  );
}




