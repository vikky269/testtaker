// import { notFound } from "next/navigation";

// const quizTests = [
//   { id: "sat", name: "SAT" },
//   { id: "asvab", name: "ASVAB" },
//   { id: "ssat", name: "SSAT" },
//   { id: "shat", name: "SHAT" },
//   { id: "state-test", name: "STATE TEST" },
//   { id: "algebra-1-regent", name: "ALGEBRA 1 REGENT" },
//   { id: "algebra-2-regent", name: "ALGEBRA 2 REGENT" },
//   { id: "geometry-regent", name: "GEOMETRY REGENT" },
//   { id: "ap-calculus", name: "AP CALCULUS" },
//   { id: "ap-calculus-ab", name: "AP CALCULUS AB" },
//   { id: "psat", name: "PSAT" },
// ];

// export default function QuizPage({ params }: { params: { testId: string } }) {
//   const test = quizTests.find((t) => t.id === params.testId);

//   if (!test) {
//     return notFound();
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">
//           {test.name} Test
//         </h1>
//         <p className="text-gray-700">
//           Welcome to the {test.name} test. Click below to begin.
//         </p>
//         <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
//           Start Test
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import quizData from "@/app/data/quizdata";
import { useQuiz } from "@/app/context/QuizContext";
import Timer from "@/app/components/Timer/Timer";

export default function Quiz() {
  const pathname = usePathname();
  const router = useRouter()
  const testid = pathname.split("/").pop(); // Extract test ID from URL
  const { answers, setAnswers } = useQuiz();

  // Get quiz questions dynamically
  const quizQuestions = quizData[testid as string];

  // Handle case when testid is invalid
  if (!quizQuestions) {
    return <div className="text-center text-red-500 my-30 text-7xl">Quiz not found!</div>;
  }

 // const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index

 const handleSelect = (question: string, option: string) => {
    setAnswers({ ...answers, [question]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizQuestions.forEach(q => {
      if (answers[q.question] === q.answer) correctAnswers++;
    });
    return (correctAnswers / quizQuestions.length) * 100;
  };

  const handleReview = () => {
    router.push(`/quiz/${testid}/review`);
  };



  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto my-20 p-5 text-gray-900 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4 capitalize">
        {testid} Practice Test
      </h1>

      {!submitted && <Timer duration={660} onTimeUp={handleSubmit}  />}

      {!submitted ? (
        <div>
          {/* Question Tracker */}
          <div className="text-center text-lg font-semibold mt-6 mb-3">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </div>

          {/* Current Question */}
          {/* <p className="font-semibold">{currentQuestion.question}</p> */}

          {/* Current Question */}
          
           {currentQuestion.question.startsWith("https://res.cloudinary.com/") ? (
            <img src={currentQuestion.question} alt="Quiz Question" className="w-full max-w-2xl" />
          ) : (
             <p className="font-semibold">{currentQuestion.question}</p>
            )} 


          {/* Options */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`p-2 border rounded-lg ${
                  answers[currentQuestion.question] === option
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleSelect(currentQuestion.question, option)}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              className={`p-2 cursor-pointer bg-gray-500 text-white rounded-lg ${
                currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>

            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button
                className="py-2 px-6 bg-blue-600 text-white rounded-lg cursor-pointer"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="py-2 px-6 bg-red-600 text-white rounded-lg cursor-pointer"
                onClick={handleSubmit}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Your Score: {calculateScore()}%</h2>
          <button className="mt-4 p-2 bg-green-600 text-white rounded-lg" onClick={handleReview}>
            Review Test
          </button>
        </div>
      )}
    </div>
  );
}
