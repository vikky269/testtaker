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

  const [showSolutionIndex, setShowSolutionIndex] = useState<number | null>(null);


  // Determine if user skipped ELA (for Grade 9 or 10)
  const isGrade9Or10 = gradeParam === "9th-grade" || gradeParam === "10th-grade" || gradeParam === "8th-grade" || gradeParam === "7th-grade" || gradeParam === "6th-grade" || gradeParam === "5th-grade" || gradeParam === "4th-grade" || gradeParam === "3rd-grade" || gradeParam === "11th-grade" || gradeParam === "12th-grade" || gradeParam === "2nd-grade" || gradeParam === "1st-grade"|| gradeParam === "pre-k" || gradeParam === "kindergarten";


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
    localStorage.removeItem("quizState");        // Clear quiz answers + index
    localStorage.removeItem("mathScore");
    localStorage.removeItem("elaScore");

    //localStorage.removeItem("quiz-end-time");    // Clear saved timer end time
    Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("quiz-end-time")) {
      localStorage.removeItem(key);
    }
  });
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

      {isGrade9Or10 && (
        <p className="text-center text-sm italic text-gray-600">
          {searchParams.get("elaScore") === "0.00"
            ? "Only Math section attempted — showing Math Review"
            : "Showing Full Review"}
        </p>
      )}

     

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

            {/* Show a message if no answer was selected */}
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
          className="mt-4 p-2 bg-green-600 cursor-pointer text-white rounded-lg"
          onClick={handleFinishReview}
        >
          Finish Review
        </button>
      </div>
    </div>
  );
}
