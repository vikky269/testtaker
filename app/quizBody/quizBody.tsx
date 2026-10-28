"use client";

// ── QuizBody.tsx ─────────────────────────────────────────────
// UPDATED: adds support for a 4th quiz type (GED) alongside the
// existing grade-quiz (math/ela/science) and SAT (reading/math) flows.
// Every existing prop, branch, and behaviour for those two is unchanged —
// GED is handled through new optional props and additive lookups.

import { useState, useEffect } from "react";
import { Outfit } from "next/font/google";
import Timer from "@/app/components/Timer/Timer";
import QuizModals from "@/app/modals/quizModals";
import MathHtml from "@/app/components/MathHtml";
import QuestionDiagram, { diagramForQuestion } from "@/app/components/QuestionDiagram";
import PicturePrompt, {
  isPictureQuestion,
  pictureLabel,
  usesLargePictureChoices,
  usesVaPictureOptions,
} from "@/app/components/PicturePrompt";
import { ChoiceFace, isPictureChoice } from "@/app/components/KinderArt";
import VisualFigure from "@/app/components/VisualFigure";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface QuizBodyProps {
  // Meta
  testid: string | undefined;
  stateParam: string | null | undefined;
  gradeParam: string | null | undefined;
  normalizedGrade: string;
  isSATQuiz: boolean;
  isGrade9Or10: boolean;
  includeScience?: boolean;
  isSat: boolean;
  isGed?: boolean; // NEW
  isPsat?: boolean;

  // Section state — widened to include GED's "rla" | "social"
  quizSection: "math" | "ela" | "science" | "rla" | "social";
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

  // NEW — generic GED transition/unanswered modals, forwarded to QuizModals
  gedTransitionModal?: { fromLabel: string; toLabel: string } | null;
  onGedTransitionContinue?: () => void;
  gedUnansweredModal?: { count: number; toLabel: string; isFinal: boolean } | null;
  onGedUnansweredCancel?: () => void;
  onGedUnansweredConfirm?: () => void;
}

// Section colour tokens — "rla" and "social" added for GED, everything else unchanged
const SECTION_THEME = {
  math:    { bg: "bg-[#f0fce8]", border: "border-[#7FB509]", active: "bg-[#7FB509]", label: "text-[#5a8508]", dot: "bg-[#7FB509]" },
  ela:     { bg: "bg-[#f0fce8]", border: "border-[#7FB509]", active: "bg-[#7FB509]", label: "text-[#5a8508]", dot: "bg-[#7FB509]" },
  science: { bg: "bg-[#f0fce8]", border: "border-[#7FB509]", active: "bg-[#7FB509]", label: "text-[#5a8508]", dot: "bg-[#7FB509]" },
  reading: { bg: "bg-teal-50",   border: "border-teal-300",  active: "bg-teal-600",  label: "text-teal-700",  dot: "bg-teal-500"  },
  // NEW — GED-only keys
  rla:     { bg: "bg-[#f0fce8]", border: "border-[#7FB509]", active: "bg-[#7FB509]", label: "text-[#5a8508]", dot: "bg-[#7FB509]" },
  social:  { bg: "bg-violet-50", border: "border-violet-300", active: "bg-violet-600", label: "text-violet-700", dot: "bg-violet-500" },

  //PSAT SECTIONS
  rw1:   { bg: "bg-emerald-50", border: "border-emerald-300", active: "bg-emerald-600", label: "text-emerald-700", dot: "bg-emerald-500" },
  rw2:   { bg: "bg-emerald-50", border: "border-emerald-300", active: "bg-emerald-600", label: "text-emerald-700", dot: "bg-emerald-500" },
  math1: { bg: "bg-indigo-50",  border: "border-indigo-300",  active: "bg-indigo-600",  label: "text-indigo-700",  dot: "bg-indigo-500"  },
  math2: { bg: "bg-indigo-50",  border: "border-indigo-300",  active: "bg-indigo-600",  label: "text-indigo-700",  dot: "bg-indigo-500"  },
};

const SECTION_NAME_MAP: Record<string, string> = {
  math: "Math", ela: "ELA", science: "Science", rla: "RLA", social: "Social Studies",
  rw1: "R&W Module 1", rw2: "R&W Module 2", math1: "Math Module 1", math2: "Math Module 2",
};

function getCurrentTheme(quizSection: string, satSection: string, isSat: boolean) {
  if (isSat) return satSection === "reading" ? SECTION_THEME.reading : SECTION_THEME.math;
  return SECTION_THEME[quizSection as keyof typeof SECTION_THEME] || SECTION_THEME.ela;
}

function quizTitle({
  testid, stateParam, gradeParam,
}: {
  testid: string | undefined;
  stateParam: string | null | undefined;
  gradeParam: string | null | undefined;
}) {
  if (testid === "state-test" && stateParam && gradeParam) {
    return `${stateParam.toUpperCase()} ${gradeParam} Practice Test`;
  }
  if (testid === "quiz-assessment" && gradeParam) {
    return `Quiz Assessment — ${gradeParam.replace(/-/g, " ").toUpperCase()}`;
  }
  if (testid === "ged") return "SmartMathz GED Readiness Diagnostic";
  if (testid === "psat") return "SmartMathz PSAT Readiness Diagnostic";
  return `${testid} Practice Test`;
}

function SectionListItem({
  label,
  active,
  theme: t,
}: {
  label: string;
  active: boolean;
  theme: (typeof SECTION_THEME)[keyof typeof SECTION_THEME];
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-semibold
        ${active ? `${t.bg} ${t.label} ring-1 ${t.border}` : "text-neutral-400"}`}
    >
      <span className={`h-2 w-2 rounded-full ${active ? t.dot : "bg-neutral-200"}`} />
      {label}
      {active && (
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${t.active}`}>
          Active
        </span>
      )}
    </div>
  );
}

export default function QuizBody({
  testid, stateParam, gradeParam, normalizedGrade,
  isSATQuiz, isGrade9Or10, isSat, isPsat = false, isGed = false,
  includeScience = true,
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
  gedTransitionModal, onGedTransitionContinue,
  gedUnansweredModal, onGedUnansweredCancel, onGedUnansweredConfirm,
}: QuizBodyProps) {
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQuestionIndex]);

  const theme = getCurrentTheme(quizSection, satSection, isSat);
  const currentQuestion = activeQuestions[currentQuestionIndex];

  const sectionLabel = isSATQuiz
    ? normalizedGrade === "2nd-grade"
      ? `${satSection === "reading" ? "ELA" : "Math"} Section`
      : `${normalizedGrade === "sat" ? "SAT" : "SSAT"} Section: ${satSection === "reading" ? "Reading & Verbal" : "Math"}`
    : `${SECTION_NAME_MAP[quizSection] ?? quizSection} Section`;

  const answeredCount = Object.keys(answers).filter((k) =>
    activeQuestions.find((q) => q.question === k)
  ).length;

  const isAnswered = (q: any) => !!answers[q.question];
  const progressPct = activeQuestions.length
    ? (answeredCount / activeQuestions.length) * 100
    : 0;
  const questionPct = activeQuestions.length
    ? ((currentQuestionIndex + 1) / activeQuestions.length) * 100
    : 0;

  const showSectionBadge = isSATQuiz || isGrade9Or10 || isGed || isPsat;
  const title = quizTitle({ testid, stateParam, gradeParam });

  if (!currentQuestion) return null;

  const diagram = diagramForQuestion(currentQuestion);

  return (
    <div
      className={`${outfit.className} min-h-screen`}
      style={{
        background:
          "linear-gradient(180deg, #f4f6f3 0%, #eef1ec 45%, #f7f8f6 100%)",
      }}
    >
      {/* ── Slim sticky header ─────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="min-w-0 text-center md:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              SmartMathz Assessment
            </p>
            <h1 className="truncate text-lg font-bold tracking-tight text-neutral-900 capitalize md:text-xl">
              {title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            {showSectionBadge && (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white ${theme.active}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                {sectionLabel}
              </span>
            )}
            <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600">
              {answeredCount} / {activeQuestions.length} answered
            </span>
            <Timer duration={timerDuration} onTimeUp={onTimeUp} identifier={timerIdentifier} />
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ────────────────────────────────────── */}
      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-8">
        {/* ── LEFT: Question card ──────────────────────────── */}
        <section className="min-w-0 rounded-3xl border border-black/[0.04] bg-white p-5 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-white ${theme.active}`}
            >
              {currentQuestionIndex + 1}
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </p>
              <div className="mt-1 h-1 w-28 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${theme.active}`}
                  style={{ width: `${questionPct}%` }}
                />
              </div>
            </div>
          </div>

          {diagram && <QuestionDiagram spec={diagram} />}

          {isPictureQuestion(currentQuestion) ? (
            <PicturePrompt
              stimulus={currentQuestion.stimulus}
              prompt={currentQuestion.question}
              grade={currentQuestion.grade || gradeParam || undefined}
              visual={currentQuestion.visual}
              story={currentQuestion.story}
              passage={currentQuestion.passage}
              alt={currentQuestion.alt}
              speech={currentQuestion.speech}
            />
          ) : currentQuestion.question.startsWith("https://") ? (
            <img
              src={currentQuestion.question}
              alt={`Question ${currentQuestionIndex + 1}`}
              className="mb-6 w-full max-w-2xl rounded-2xl"
            />
          ) : (
            <MathHtml
              as="div"
              text={currentQuestion.question}
              className="katex-question mb-7 text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-2xl"
            />
          )}

          <div
            className={`grid gap-3 ${
              currentQuestion.optionLayout === "stack"
                ? "grid-cols-1"
                : usesVaPictureOptions(currentQuestion)
                ? currentQuestion.options.length === 4
                  ? "grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-3"
                : usesLargePictureChoices(currentQuestion.options)
                ? "grid-cols-2 sm:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {currentQuestion.options.map((option: string, oi: number) => {
              const selected = answers[currentQuestion.question] === option;
              const optionVisual = currentQuestion.optionVisuals?.[oi] || null;
              const showOptLabel =
                currentQuestion.optionShowLabels?.[oi] ?? !optionVisual;
              const largeChoice =
                usesVaPictureOptions(currentQuestion) ||
                usesLargePictureChoices(currentQuestion.options);
              return (
                <button
                  key={oi}
                  type="button"
                  onClick={() => onSelect(currentQuestion.question, option)}
                  className={`group relative flex gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-150 md:px-5 md:py-5 cursor-pointer
                    ${largeChoice || optionVisual ? "min-h-28 flex-col items-center justify-center text-center" : "items-start"}
                    ${selected
                      ? `${theme.active} border-transparent text-white`
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-[#7FB509] hover:bg-[#f0fce8]"
                    }`}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold
                      ${selected ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"}`}
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {optionVisual ? (
                    <>
                      <VisualFigure visual={optionVisual} compact alt={pictureLabel(option)} />
                      {showOptLabel ? (
                        <span className="mt-1 text-sm font-semibold leading-snug">
                          {pictureLabel(option)}
                        </span>
                      ) : null}
                    </>
                  ) : isPictureChoice(option) ? (
                    <ChoiceFace option={option} />
                  ) : largeChoice ? (
                    <span className="w-full text-center text-4xl leading-tight md:text-5xl">{pictureLabel(option)}</span>
                  ) : (
                    <MathHtml
                      as="span"
                      text={option}
                      className="text-base font-medium leading-snug md:text-[17px]"
                    />
                  )}
                  {selected && (
                    <span className="absolute right-3 top-3 text-[11px] font-semibold uppercase tracking-wide text-white/75">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-5">
            <button
              type="button"
              onClick={onPrev}
              disabled={currentQuestionIndex === 0}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-150
                ${currentQuestionIndex === 0
                  ? "cursor-not-allowed bg-neutral-100 text-neutral-300"
                  : "cursor-pointer bg-[#7FB509] text-white hover:bg-[#6a9a07]"
                }`}
            >
              ← Previous
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                type="button"
                onClick={onNext}
                className="cursor-pointer rounded-full bg-[#7FB509] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#6a9a07]"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                className="cursor-pointer rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-red-600"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </section>

        {/* ── RIGHT: Question navigator ────────────────────── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <button
            type="button"
            onClick={() => setNavOpen((p) => !p)}
            className={`mb-2 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white lg:hidden ${theme.active}`}
          >
            <span>Question Navigator</span>
            <span>{navOpen ? "Hide" : "Show"}</span>
          </button>

          <div
            className={`rounded-3xl border border-black/[0.04] bg-white p-5 ${
              navOpen ? "block" : "hidden lg:block"
            }`}
          >
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Jump to Question
            </p>
            <div className="mb-4 flex flex-wrap gap-3 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Current
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7FB509]" />
                Answered
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-neutral-300 bg-white" />
                Unanswered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {activeQuestions.map((q, i) => {
                const answered = isAnswered(q);
                const isCurrent = i === currentQuestionIndex;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIndex(i);
                      setNavOpen(false);
                    }}
                    title={answered ? `Q${i + 1} — Answered` : `Q${i + 1} — Not answered`}
                    className={`
                      relative aspect-square rounded-xl text-xs font-bold
                      flex items-center justify-center transition-all duration-150 cursor-pointer
                      ${isCurrent
                        ? "z-10 bg-amber-500 text-white ring-2 ring-amber-500 ring-offset-2"
                        : answered
                        ? "bg-[#7FB509] text-white hover:bg-[#6a9a07]"
                        : "border border-neutral-200 bg-neutral-100 text-neutral-500 hover:border-[#7FB509] hover:text-[#7FB509]"
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs font-medium text-neutral-400">
                <span>Progress</span>
                <span>
                  {answeredCount}/{activeQuestions.length}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-[#7FB509] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {isGrade9Or10 && (
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                  Sections
                </p>
                <div className="flex flex-col gap-1">
                  {[
                    { key: "math", label: "Math", theme: SECTION_THEME.math },
                    { key: "ela", label: "ELA", theme: SECTION_THEME.ela },
                    ...(includeScience
                      ? [{ key: "science", label: "Science", theme: SECTION_THEME.science }]
                      : []),
                  ].map(({ key, label, theme: t }) => (
                    <SectionListItem
                      key={key}
                      label={label}
                      active={quizSection === key}
                      theme={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {isSat && (
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                  Sections
                </p>
                <div className="flex flex-col gap-1">
                  {[
                    { key: "reading", label: "Reading & Writing", theme: SECTION_THEME.reading },
                    { key: "math", label: "Math", theme: SECTION_THEME.math },
                  ].map(({ key, label, theme: t }) => (
                    <SectionListItem
                      key={key}
                      label={label}
                      active={satSection === key}
                      theme={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {isGed && (
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                  Sections
                </p>
                <div className="flex flex-col gap-1">
                  {[
                    { key: "math", label: "Math", theme: SECTION_THEME.math },
                    { key: "rla", label: "RLA", theme: SECTION_THEME.rla },
                    { key: "science", label: "Science", theme: SECTION_THEME.science },
                    { key: "social", label: "Social Studies", theme: SECTION_THEME.social },
                  ].map(({ key, label, theme: t }) => (
                    <SectionListItem
                      key={key}
                      label={label}
                      active={quizSection === key}
                      theme={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {isPsat && (
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                  Modules
                </p>
                <div className="flex flex-col gap-1">
                  {[
                    { key: "rw1", label: "R&W Module 1", theme: SECTION_THEME.rw1 },
                    { key: "rw2", label: "R&W Module 2", theme: SECTION_THEME.rw2 },
                    { key: "math1", label: "Math Module 1", theme: SECTION_THEME.math1 },
                    { key: "math2", label: "Math Module 2", theme: SECTION_THEME.math2 },
                  ].map(({ key, label, theme: t }) => (
                    <SectionListItem
                      key={key}
                      label={label}
                      active={quizSection === key}
                      theme={t}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

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
        gedTransitionModal={gedTransitionModal}
        onGedTransitionContinue={onGedTransitionContinue}
        gedUnansweredModal={gedUnansweredModal}
        onGedUnansweredCancel={onGedUnansweredCancel}
        onGedUnansweredConfirm={onGedUnansweredConfirm}
      />
    </div>
  );
}
