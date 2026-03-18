// app/quiz/[testId]/review/components/QuestionCard.tsx
// Single question review card with options, status badge, and solution toggle

import { useState } from "react";

interface QuestionCardProps {
  questionData: any;
  index: number;         // 0-based index within its section
  globalIndex: number;   // 0-based index in selectedQuiz
  selectedAnswer: string | undefined;
  color: "indigo" | "emerald" | "amber";
}

const COLOR_MAP = {
  indigo:  { num: "bg-indigo-50 text-indigo-500",  solution: "border-indigo-100" },
  emerald: { num: "bg-emerald-50 text-emerald-500", solution: "border-emerald-100" },
  amber:   { num: "bg-amber-50 text-amber-500",     solution: "border-amber-100" },
};

export default function QuestionCard({
  questionData, index, globalIndex, selectedAnswer, color,
}: QuestionCardProps) {
  const [showSolution, setShowSolution] = useState(false);
  const correct = questionData.correctAnswer || questionData.answer;
  const { num: numCls } = COLOR_MAP[color];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 hover:shadow-md transition-shadow duration-200">

      {/* Header row: number + global label + status */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold ${numCls}`}>
          {index + 1}
        </span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Question {globalIndex + 1}
        </span>
        <span className="ml-auto">
          {!selectedAnswer ? (
            <span className="text-xs font-bold bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">
              ⚠️ Skipped
            </span>
          ) : selectedAnswer === correct ? (
            <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full">
              ✅ Correct
            </span>
          ) : (
            <span className="text-xs font-bold bg-red-50 text-red-500 px-2 py-1 rounded-full">
              ❌ Incorrect
            </span>
          )}
        </span>
      </div>

      {/* Question content */}
      {questionData.question.startsWith("https://res.cloudinary.com") ? (
        <img
          src={questionData.question}
          alt={`Question ${globalIndex + 1}`}
          className="w-full max-w-2xl mb-5 rounded-lg"
        />
      ) : (
        <p
          className="text-gray-800 text-base font-semibold mb-5 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: questionData.question }}
        />
      )}

      {/* Options */}
      <ul className="grid grid-cols-2 gap-2">
        {questionData.options.map((option: string, oi: number) => {
          const isCorrect  = option === correct;
          const isSelected = option === selectedAnswer;
          const noAnswer   = !selectedAnswer;

          return (
            <li
              key={oi}
              className={`p-3 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all
                ${isCorrect && noAnswer  ? "bg-green-50 border-green-200 text-green-800"
                : isCorrect             ? "bg-green-500 border-green-500 text-white"
                : isSelected            ? "bg-red-500 border-red-500 text-white"
                :                         "bg-gray-50 border-gray-100 text-gray-600"}`}
            >
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0
                ${isCorrect ? "bg-white/30" : "bg-white/60 text-gray-500"}`}>
                {String.fromCharCode(65 + oi)}
              </span>
              <span dangerouslySetInnerHTML={{ __html: option }} />
              {isCorrect && <span className="ml-auto">✅</span>}
              {isSelected && !isCorrect && (
                <span className="ml-auto text-xs opacity-80">(Your Answer)</span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Skipped warning */}
      {!selectedAnswer && (
        <p className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-100 px-3 py-2 rounded-xl">
          ⚠️ You did not select an answer for this question.
        </p>
      )}

      {/* Solution toggle */}
      <button
        className={`mt-4 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer
          ${showSolution ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
        onClick={() => setShowSolution((p) => !p)}
      >
        {showSolution ? "Hide Solution ▲" : "Show Solution ▼"}
      </button>

      {showSolution && (
        <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h3 className="text-sm font-extrabold text-gray-700 mb-2">Solution</h3>
          <p
            className="text-gray-700 leading-8 text-sm"
            dangerouslySetInnerHTML={{ __html: questionData.solution }}
          />
        </div>
      )}
    </div>
  );
}