"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import quizData from "@/app/data/quizdata"; // regular quizzes
import standardsData from "@/app/data/statetestdata"; // state tests
import { useQuiz } from "@/app/context/QuizContext";
import Timer from "@/app/components/Timer/Timer";

export default function Quiz() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const testid = pathname.split("/").pop(); // e.g. 'math' or 'state-test'
  const stateParam = searchParams.get("state")?.toLowerCase(); // e.g. 'ohio'
  const gradeParam = searchParams.get("grade"); // e.g. 'K-2'

  const { answers, setAnswers } = useQuiz();

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


  useEffect(() => {
    if (testid === "state-test" && stateParam && gradeParam) {
      const normalizedGrade = gradeParam?.toLowerCase().replace(/\s+/g, "");
      const key = `${stateParam}-${normalizedGrade}`;
      console.log("Looking for key:", key); // Debugging
      const regularQuiz = standardsData[key];
      setQuizQuestions(regularQuiz || []);
      setAnswers({}); // Reset answers when loading a new quiz
    } else {
      const regularQuiz = quizData[testid as string];
      setQuizQuestions(regularQuiz || []);
    }
  }, [testid, stateParam, gradeParam]);
  
 

  // Handle invalid quiz
  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="text-center text-red-500 my-20 text-4xl">
        No quiz found for this test.
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

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
    quizQuestions.forEach((q) => {
      if (answers[q.question] === q.answer) correctAnswers++;
    });
    return (correctAnswers / quizQuestions.length) * 100;
  };

  const handleGoHome = () => router.push("/");
  const handleReview = () => {
    if (testid === "state-test" && stateParam && gradeParam) {
      const url = new URLSearchParams();
      url.append("state", stateParam);
      url.append("grade", gradeParam);
      router.push(`/quiz/${testid}/review?${url.toString()}`);
    } else {
      router.push(`/quiz/${testid}/review`);
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto my-20 p-5 text-gray-900 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4 capitalize">
        {testid === "state-test" && stateParam && gradeParam
          ? `${stateParam.toUpperCase()} ${gradeParam} Practice Test`
          : `${testid} Practice Test`}
      </h1>

      {!submitted && <Timer duration={1200} onTimeUp={handleSubmit} />}

      {!submitted ? (
        <div>
          <div className="text-center text-lg font-semibold mt-6 mb-3">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </div>

          {currentQuestion.question.startsWith("https://res.cloudinary.com/") ? (
            <img
              src={currentQuestion.question}
              alt="Quiz Question"
              className="w-full max-w-2xl"
            />
          ) : (
            <p className="font-semibold">{currentQuestion.question}</p>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4">
            {currentQuestion.options.map((option:any) => (
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

          {calculateScore() === 100 ? (
            <button
              className="mt-4 p-2 bg-blue-600 cursor-pointer text-white rounded-lg"
              onClick={handleGoHome}
            >
              Back to Home
            </button>
          ) : (
            <button
              className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg"
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
