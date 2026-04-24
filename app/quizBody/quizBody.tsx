"use client";

// ── QuizBody.tsx ─────────────────────────────────────────────
// Drop-in replacement for the quiz body render section.
// Props mirror what page.tsx already has — no logic changes.
// Features:
//   • Question navigator panel (numbered boxes, answered/unanswered colours)
//   • Click any box to jump directly to that question
//   • Collapsible navigator on mobile (toggle button)
//   • Retains all existing colours (#7FB509 green palette)
//   • Fully responsive

import { useState } from "react";
import Timer from "@/app/components/Timer/Timer";
import QuizModals from "@/app/modals/quizModals";

interface QuizBodyProps {
  // Meta
  testid: string | undefined;
  stateParam: string | null | undefined;
  gradeParam: string | null | undefined;
  normalizedGrade: string;
  isSATQuiz: boolean;
  isGrade9Or10: boolean;
  isSat: boolean;

  // Section state
  quizSection: "math" | "ela" | "science";
  satSection: "reading" | "math";
  isSatReading: boolean;

  // Questions
  activeQuestions: any[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (i: number) => void;
  answers: Record<string, string>;

  // Timer
  timerDuration: number;
  timerIdentifier: string;
  onTimeUp: () => void;

  // Handlers
  onSelect: (question: string, option: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;

  // Modal props
  unansweredCount: number;
  showConfirmModal: boolean;
  showConfirmElaModal: boolean;
  showConfirmSubmissionModal: boolean;
  showGradeModal: boolean;
  showScienceModal: boolean;
  showSatModal: boolean;
  onCancelConfirm: () => void;
  onConfirmMathSubmit: () => void;
  onCancelElaConfirm: () => void;
  onConfirmElaSubmit: () => void;
  onCancelSubmission: () => void;
  onConfirmFinalSubmit: () => void;
  onSkipEla: () => void;
  onTakeEla: () => void;
  onTakeScience: () => void;
  onContinueMath: () => void;
}

// Section colour tokens
const SECTION_THEME = {
  math:      { bg: "bg-[#f0fce8]",  border: "border-[#7FB509]",  active: "bg-[#7FB509]",   label: "text-[#5a8508]",   dot: "bg-[#7FB509]"   },
  ela:      { bg: "bg-[#f0fce8]",  border: "border-[#7FB509]",  active: "bg-[#7FB509]",   label: "text-[#5a8508]",   dot: "bg-[#7FB509]"   },
  science: { bg: "bg-[#f0fce8]",  border: "border-[#7FB509]",  active: "bg-[#7FB509]",   label: "text-[#5a8508]",   dot: "bg-[#7FB509]"   },
  reading:   { bg: "bg-teal-50",    border: "border-teal-300",   active: "bg-teal-600",    label: "text-teal-700",   dot: "bg-teal-500"   },
};

function getCurrentTheme(quizSection: string, satSection: string, isSat: boolean) {
  if (isSat) return satSection === "reading" ? SECTION_THEME.reading : SECTION_THEME.math;
  return SECTION_THEME[quizSection as keyof typeof SECTION_THEME] || SECTION_THEME.ela;
}

export default function QuizBody({
  testid, stateParam, gradeParam, normalizedGrade,
  isSATQuiz, isGrade9Or10, isSat,
  quizSection, satSection, isSatReading,
  activeQuestions, currentQuestionIndex, setCurrentQuestionIndex,
  answers,
  timerDuration, timerIdentifier, onTimeUp,
  onSelect, onNext, onPrev, onSubmit,
  unansweredCount,
  showConfirmModal, showConfirmElaModal, showConfirmSubmissionModal,
  showGradeModal, showScienceModal, showSatModal,
  onCancelConfirm, onConfirmMathSubmit,
  onCancelElaConfirm, onConfirmElaSubmit,
  onCancelSubmission, onConfirmFinalSubmit,
  onSkipEla, onTakeEla, onTakeScience, onContinueMath,
}: QuizBodyProps) {
  const [navOpen, setNavOpen] = useState(false);

  const theme = getCurrentTheme(quizSection, satSection, isSat);
  const currentQuestion = activeQuestions[currentQuestionIndex];

  const sectionLabel = isSATQuiz
    ? normalizedGrade === "2nd-grade"
      ? `${satSection === "reading" ? "ELA" : "Math"} Section`
      : `${normalizedGrade === "sat" ? "SAT" : "SSAT"} Section: ${satSection === "reading" ? "Reading & Verbal" : "Math"}`
    : `${quizSection === "math" ? "Math" : quizSection === "ela" ? "ELA" : "Science"} Section`;

  const answeredCount = Object.keys(answers).filter((k) =>
    activeQuestions.find((q) => q.question === k)
  ).length;

  const isAnswered = (q: any) => !!answers[q.question];

  return (
    <div className="min-h-screen bg-gray-200/50">

      {/* ── TOP HEADER STRIP ─────────────────────────────────── */}
      <div className="shadow-lg mt-2 bg-white" >
        <div className="max-w-6xl mx-auto py-10">

          {/* Title row */}
          <h1 className="text-lg md:text-xl font-extrabold text-center text-gray-900 capitalize mb-1">
            {testid === "state-test" && stateParam && gradeParam
              ? `${stateParam.toUpperCase()} ${gradeParam} Practice Test`
              : testid === "quiz-assessment" && gradeParam
              ? `Quiz Assessment — ${gradeParam.replace(/-/g, " ").toUpperCase()}`
              : `${testid} Practice Test`}
          </h1>

          {/* Section badge + progress + timer — one row */}
          <div className="flex flex-wrap items-center justify-center gap-3  mt-2">
            {(isSATQuiz || isGrade9Or10) && (
              <span className={`text-lg font-bold px-3 py-1 rounded-full ${theme.active} text-white`}>
                {sectionLabel}
              </span>
            )}
            <span className="text-lg font-semibold text-gray-500">
              {answeredCount} / {activeQuestions.length} answered
            </span>
            <Timer duration={timerDuration} onTimeUp={onTimeUp} identifier={timerIdentifier} />
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT: question area + navigator panel ─────── */}
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-6 md:my-1 my-20 flex flex-col lg:flex-row gap-5">

        {/* ── LEFT: Question card ───────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">

            {/* Question number pill */}
            <div className="flex items-center gap-3 mb-5">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-white ${theme.active}`}>
                {currentQuestionIndex + 1}
              </span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </span>
            </div>

            {/* Question content */}
            {currentQuestion.question.startsWith("https://") ? (
              <img
                src={currentQuestion.question}
                alt={`Question ${currentQuestionIndex + 1}`}
                className="w-full max-w-2xl mb-6 rounded-lg"
              />
            ) : (
              <p
                className="text-lg md:text-2xl leading-relaxed text-gray-800 font-medium mb-7"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />
            )}

            {/* Answer options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option: string, oi: number) => {
                const selected = answers[currentQuestion.question] === option;
                return (
                  <button
                    key={oi}
                    onClick={() => onSelect(currentQuestion.question, option)}
                    className={`group relative px-5 py-5 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer
                      ${selected
                        ? `${theme.active} border-transparent text-white shadow-md scale-[1.01]`
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#7FB509] hover:bg-[#f7fde8]"
                      }`}
                  >
                    {/* Letter badge */}
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 flex-shrink-0
                      ${selected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span
                      className="text-base md:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: option }}
                    />
                    {selected && (
                      <span className="absolute top-3 right-3 text-white/70 text-xs font-bold">✓ Selected</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next / Submit */}
            <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
              <button
                onClick={onPrev}
                disabled={currentQuestionIndex === 0}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150
                  ${currentQuestionIndex === 0
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-[#7FB509] text-white hover:bg-[#6a9a07] shadow-sm hover:shadow-md cursor-pointer"
                  }`}
              >
                ← Previous
              </button>

              {currentQuestionIndex < activeQuestions.length - 1 ? (
                <button
                  onClick={onNext}
                  className="px-5 py-2.5 bg-[#7FB509] hover:bg-[#6a9a07] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
                >
                  Submit Quiz ✓
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Question navigator panel ──────────────── */}
        <div className="lg:w-52 xl:w-70 flex-shrink-0">

          {/* Mobile toggle */}
          <button
            onClick={() => setNavOpen((p) => !p)}
            className={`lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm mb-2 ${theme.active} text-white`}
          >
            <span>📋 Question Navigator</span>
            <span>{navOpen ? "▲ Hide" : "▼ Show"}</span>
          </button>

          {/* Panel — always visible on desktop, toggled on mobile */}
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ${navOpen ? "block" : "hidden lg:block"}`}>

            {/* Legend */}
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">
              Jump to Question
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <span className={`w-3 h-3 rounded-sm ${theme.active}`} /> Current
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-[#7FB509]" /> Answered
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-300" /> Unanswered
              </span>
            </div>

            {/* Number grid */}
            <div className="grid grid-cols-5 gap-1.5">
              {activeQuestions.map((q, i) => {
                const answered  = isAnswered(q);
                const isCurrent = i === currentQuestionIndex;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentQuestionIndex(i);
                      setNavOpen(false);
                    }}
                    title={answered ? `Q${i + 1} — Answered` : `Q${i + 1} — Not answered`}
                    className={`
                      relative w-full aspect-square rounded-lg text-xs font-extrabold
                      flex items-center justify-center transition-all duration-150 cursor-pointer
                      ${isCurrent
                        ? `${theme.active} text-white ring-2 ring-offset-1 ring-current scale-110 shadow-md z-10`
                        : answered
                        ? "bg-[#7FB509] text-white hover:bg-[#6a9a07] shadow-sm"
                        : "bg-gray-100 text-gray-500 border border-gray-200 hover:border-[#7FB509] hover:text-[#7FB509]"
                      }
                    `}
                  >
                    {i + 1}
                    {/* Small dot indicator for answered */}
                    {answered && !isCurrent && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full border border-[#7FB509]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 font-semibold mb-1">
                <span>Progress</span>
                <span>{answeredCount}/{activeQuestions.length}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7FB509] transition-all duration-500"
                  style={{ width: `${(answeredCount / activeQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Section indicator chips (grade quizzes only) */}
            {isGrade9Or10 &&  (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">Sections</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { key: "math",    label: "Math",    theme: SECTION_THEME.math    },
                    { key: "ela",     label: "ELA",     theme: SECTION_THEME.ela     },
                    { key: "science", label: "Science", theme: SECTION_THEME.science },
                  ].map(({ key, label, theme: t }) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold
                        ${quizSection === key ? `${t.bg} ${t.label} ring-1 ${t.border}` : "text-gray-400"}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${quizSection === key ? t.dot : "bg-gray-200"}`} />
                      {label}
                      {quizSection === key && <span className="ml-auto text-[10px]">Active</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}





             {isSat &&  (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">Sections</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { key: "ela",    label: "Reading and writing",    theme: SECTION_THEME.math    },
                    { key: "math",     label: "Math",     theme: SECTION_THEME.ela     },
                  ].map(({ key, label, theme: t }) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold
                        ${quizSection === key ? `${t.bg} ${t.label} ring-1 ${t.border}` : "text-gray-400"}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${quizSection === key ? t.dot : "bg-gray-200"}`} />
                      {label}
                      {quizSection === key && <span className="ml-auto text-[10px]">Active</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All modals */}
      <QuizModals
        unansweredCount={unansweredCount}
        showConfirmModal={showConfirmModal}
        showConfirmElaModal={showConfirmElaModal}
        showConfirmSubmissionModal={showConfirmSubmissionModal}
        showGradeModal={showGradeModal}
        showScienceModal={showScienceModal}
        showSatModal={showSatModal}
        onCancelConfirm={onCancelConfirm}
        onConfirmMathSubmit={onConfirmMathSubmit}
        onCancelElaConfirm={onCancelElaConfirm}
        onConfirmElaSubmit={onConfirmElaSubmit}
        onCancelSubmission={onCancelSubmission}
        onConfirmFinalSubmit={onConfirmFinalSubmit}
        onSkipEla={onSkipEla}
        onTakeEla={onTakeEla}
        onTakeScience={onTakeScience}
        onContinueMath={onContinueMath}
      />
    </div>
  );
}