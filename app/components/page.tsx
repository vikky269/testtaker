"use client"

import { useState } from "react";

const quizQuestions = [
  { question: "What is 5 + 3?", options: ["5", "8", "12", "15"], answer: "8" },
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { question: "Solve for x: 2x = 10", options: ["2", "5", "10", "20"], answer: "5" },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
  { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: "8" },
  { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Dickens", "Hemingway", "Tolkien"], answer: "Shakespeare" },
  { question: "What is 12 * 12?", options: ["124", "120", "144", "148"], answer: "144" },
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "What is the boiling point of water in Celsius?", options: ["50", "100", "150", "200"], answer: "100" },
  { question: "Who discovered gravity?", options: ["Newton", "Einstein", "Galileo", "Darwin"], answer: "Newton" },
];

export default function Quiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
  }

  interface Answers {
    [key: string]: string;
  }

  const handleSelect = (question: string, option: string): void => {
    setAnswers({ ...answers, [question]: option });
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

  return (
    <div className="max-w-xl mx-auto p-5 text-gray-900 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">ASVAB Practice Test</h1>
      {!submitted ? (
        <div>
          {quizQuestions.map((q, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{q.question}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {q.options.map((option) => (
                  <button
                    key={option}
                    className={`p-2 border rounded-lg ${answers[q.question] === option ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    onClick={() => handleSelect(q.question, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            className="w-full mt-4 p-2 bg-blue-600 text-white rounded-lg"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Your Score: {calculateScore()}%</h2>
        </div>
      )}
    </div>
  );
}

