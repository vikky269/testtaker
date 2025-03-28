"use client";

import { useQuiz } from "@/app/context/QuizContext";
import { useParams } from "next/navigation";

export default function ReviewPage() {
  const { answers, quizData } = useQuiz();
  const { testId } = useParams();

  console.log("Test ID:", testId);
  console.log("Quiz Data:", quizData);
  console.log("Answers:", answers);

  if (!quizData || quizData.length === 0) return <p>Loading quiz data...</p>;

  return (
    <div className="container">
      <h1>Review Test</h1>
      <p>Test ID: {testId}</p>

      {quizData.map((questionData, index) => {
        const selectedAnswer = answers[questionData.correctAnswer]; // Adjust based on actual key

        return (
          <div key={index} className="question">
            <p><strong>Q{index + 1}: {questionData.question}</strong></p>
            <ul>
              {questionData.options.map((option, i) => {
                const isCorrect = option === questionData.correctAnswer;
                const isSelected = option === selectedAnswer;

                return (
                  <li
                    key={i}
                    className={`option ${
                      isCorrect ? "correct" : isSelected ? "wrong" : ""
                    }`}
                  >
                    {option} {isSelected ? "(Your Answer)" : ""}
                    {isCorrect ? " ✅" : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}



