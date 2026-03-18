// app/quiz/[testId]/review/components/SectionBlock.tsx
// Renders a labelled section (Math / ELA / Science) with its question cards

import QuestionCard from "@/app/components/QuestionCard/QuestionCard";

interface SectionBlockProps {
  label: string;
  emoji: string;
  color: "indigo" | "emerald" | "amber";
  questions: any[];
  allQuestions: any[];   // selectedQuiz — needed for globalIndex
  answers: Record<string, string>;
}

const BORDER_MAP = {
  indigo:  "border-indigo-200",
  emerald: "border-emerald-200",
  amber:   "border-amber-200",
};

const ICON_BG_MAP = {
  indigo:  "bg-indigo-50",
  emerald: "bg-emerald-50",
  amber:   "bg-amber-50",
};

const TITLE_MAP = {
  indigo:  "text-indigo-600",
  emerald: "text-emerald-600",
  amber:   "text-amber-600",
};

const PILL_MAP = {
  indigo:  "bg-indigo-50 text-indigo-500",
  emerald: "bg-emerald-50 text-emerald-500",
  amber:   "bg-amber-50 text-amber-500",
};

export default function SectionBlock({
  label, emoji, color, questions, allQuestions, answers,
}: SectionBlockProps) {
  if (questions.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Section header */}
      <div className={`flex items-center gap-3 mb-5 pb-3 border-b-2 ${BORDER_MAP[color]}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${ICON_BG_MAP[color]}`}>
          {emoji}
        </div>
        <h2 className={`text-xl font-extrabold ${TITLE_MAP[color]}`}>{label}</h2>
        <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${PILL_MAP[color]}`}>
          {questions.length} questions
        </span>
      </div>

      {/* Question cards */}
      {questions.map((questionData, i) => {
        const globalIndex = allQuestions.indexOf(questionData);
        const selectedAnswer = answers?.[questionData.question];
        return (
          <QuestionCard
            key={i}
            questionData={questionData}
            index={i}
            globalIndex={globalIndex}
            selectedAnswer={selectedAnswer}
            color={color}
          />
        );
      })}
    </div>
  );
}