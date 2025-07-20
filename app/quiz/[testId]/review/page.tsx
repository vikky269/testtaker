"use client";

import { useQuiz } from "@/app/context/QuizContext";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import quizData from "@/app/data/quizdata";
import standardsData from "@/app/data/statetestdata";
import { quizAssessmentData } from "@/app/data/quizassessmentdata";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const { answers, setAnswers } = useQuiz();
  const { testId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const stateParam = searchParams.get("state")?.toLowerCase();
  const gradeParam = searchParams.get("grade")?.toLowerCase().replace(/\s+/g, "");

  const [selectedQuiz, setSelectedQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 


  // useEffect(() => {
  //   let quiz;

  //   if (testId === "state-test" && stateParam && gradeParam) {
  //     const key = `${stateParam}-${gradeParam}`;
  //     quiz = standardsData[key];
  //   } else if (testId === "quiz-assessment" && gradeParam) {
  //     const found = quizAssessmentData.find(q => q.grade === gradeParam);
  //     quiz = found?.questions || [];
  //   } else {
  //     quiz = quizData[testId as string];
  //   }

  //   setSelectedQuiz(quiz || []);
  //   setLoading(false);
  // }, [testId, stateParam, gradeParam]);

  useEffect(() => {
    const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "");

    let quiz;

    if (testId === "state-test" && stateParam && gradeParam) {
      const key = `${stateParam}-${gradeParam}`;
      quiz = standardsData[key];
    } else if (testId === "quiz-assessment" && gradeParam) {
      const found = quizAssessmentData.find(
        (q) => normalize(q.grade) === gradeParam
      );
      quiz = found?.questions || [];
    } else {
      quiz = quizData[testId as string];
    }

    setSelectedQuiz(quiz || []);
    setLoading(false);
  }, [testId, stateParam, gradeParam]);


  const handleFinishReview = () => {
    localStorage.removeItem("quizState");        // Clear quiz answers + index
    localStorage.removeItem("quiz-end-time");    // Clear saved timer end time
    setAnswers({});                              // Clear context answers
    router.push("/");                            // Navigate back home
  };


  const correctAnswersCount = selectedQuiz.filter(
    (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
  ).length;

  const totalQuestions = selectedQuiz.length;
  const score = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);

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

      {/* Score */}
      <div className="text-center my-4 p-4 bg-blue-100 border border-blue-400 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-700">Your Score: {score}%</h2>
        <p className="text-gray-600">
          {correctAnswersCount} out of {totalQuestions} questions correct
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
                return (
                  <li
                    key={i}
                    className={`p-2 text-center border rounded-lg ${isCorrect
                        ? "bg-green-500 text-white"
                        : isSelected
                          ? "bg-red-500 text-white"
                          : "bg-gray-200"
                      }`}
                  >
                    <span
                    className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: `${option} ${isSelected ? "(Your Answer)" : ""} ${isCorrect ? "✅" : ""}`,
                      }}
                    />
                  </li>
                );
              })}
            </ul>

          </div>
        );
      })}

      <div className="flex justify-center items-center">
        <button
          className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg"
          onClick={handleFinishReview}
        >
          Finish Review
        </button>
      </div>
    </div>
  );
}
