"use client";

/**
 * PREVIEW ONLY — sleek quiz UI mock.
 * Does not wire into live quiz logic. Safe to delete after review.
 * Open: /quiz-ui-preview
 */

import { useMemo, useState } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const GREEN = "#7FB509";
const GREEN_DARK = "#6a9a07";
const GREEN_SOFT = "#f0fce8";
const AMBER = "#F59E0B";
const MUSTARD = "#C4A035";

const QUESTIONS = [
  {
    id: "q1",
    prompt:
      "A typist types 240 words in 4 minutes. What is the typing speed in words per minute?",
    options: [
      "50 words per minute",
      "60 words per minute",
      "70 words per minute",
      "80 words per minute",
    ],
  },
  {
    id: "q2",
    prompt: "What is 15% of 80?",
    options: ["8", "10", "12", "15"],
  },
  {
    id: "q3",
    prompt: "A rectangle has length 12 cm and width 5 cm. What is its perimeter?",
    options: ["17 cm", "34 cm", "60 cm", "24 cm"],
  },
  {
    id: "q4",
    prompt: "Which number is a prime number?",
    options: ["21", "27", "29", "33"],
  },
  {
    id: "q5",
    prompt: "Solve: 3x + 6 = 21. What is x?",
    options: ["3", "5", "7", "9"],
  },
  {
    id: "q6",
    prompt: "Round 3.678 to the nearest hundredth.",
    options: ["3.67", "3.68", "3.70", "3.6"],
  },
  {
    id: "q7",
    prompt: "A bag has 3 red and 5 blue marbles. Probability of drawing red?",
    options: ["3/5", "3/8", "5/8", "1/3"],
  },
  {
    id: "q8",
    prompt: "Convert 2.5 hours to minutes.",
    options: ["120", "140", "150", "180"],
  },
  {
    id: "q9",
    prompt: "What is the median of 2, 7, 4, 9, 4?",
    options: ["4", "5", "7", "9"],
  },
  {
    id: "q10",
    prompt: "A triangle has angles 40° and 65°. What is the third angle?",
    options: ["65°", "75°", "85°", "95°"],
  },
];

const SECTIONS = [
  { key: "math", label: "Math" },
  { key: "ela", label: "ELA" },
  { key: "science", label: "Science" },
] as const;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuizUiPreviewPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [navOpen, setNavOpen] = useState(false);
  const [section] = useState<(typeof SECTIONS)[number]["key"]>("math");
  // Static preview timer (does not tick — keeps the mock calm)
  const timeLeft = 15 * 60 + 36;

  const current = QUESTIONS[index];
  const answeredCount = useMemo(
    () => QUESTIONS.filter((q) => answers[q.id]).length,
    [answers]
  );
  const progress = (answeredCount / QUESTIONS.length) * 100;

  const select = (option: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
  };

  return (
    <div
      className={`${outfit.className} min-h-screen`}
      style={{
        background:
          "linear-gradient(180deg, #f4f6f3 0%, #eef1ec 45%, #f7f8f6 100%)",
      }}
    >
      {/* Preview banner */}
      <div
        className="sticky top-0 z-50 border-b px-4 py-2 text-center text-xs font-semibold tracking-wide"
        style={{
          background: GREEN_SOFT,
          borderColor: `${GREEN}33`,
          color: GREEN_DARK,
        }}
      >
        UI PREVIEW ONLY — not connected to the live quiz ·{" "}
        <a href="/quiz-ui-preview" className="underline underline-offset-2">
          /quiz-ui-preview
        </a>
        {" · "}colors preserved · live quiz untouched
      </div>

      {/* Slim sticky header */}
      <header className="sticky top-8 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="min-w-0 text-center md:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              SmartMathz Assessment
            </p>
            <h1 className="truncate text-lg font-bold tracking-tight text-neutral-900 md:text-xl">
              Quiz Assessment — 6th Grade
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white"
              style={{ background: GREEN }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
              Math Section
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600">
              {answeredCount} / {QUESTIONS.length} answered
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white"
              style={{ background: MUSTARD }}
            >
              <span aria-hidden className="opacity-90">
                ⏳
              </span>
              Time Left: {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-8">
        {/* Question panel */}
        <section className="rounded-3xl border border-black/[0.04] bg-white p-5 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-white"
              style={{ background: GREEN }}
            >
              {index + 1}
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Question {index + 1} of {QUESTIONS.length}
              </p>
              <div className="mt-1 h-1 w-28 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((index + 1) / QUESTIONS.length) * 100}%`,
                    background: GREEN,
                  }}
                />
              </div>
            </div>
          </div>

          <h2 className="mb-7 text-xl font-semibold leading-snug tracking-tight text-neutral-900 md:text-2xl">
            {current.prompt}
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {current.options.map((option, oi) => {
              const selected = answers[current.id] === option;
              const letter = String.fromCharCode(65 + oi);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => select(option)}
                  className="group relative flex items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-150 md:px-5 md:py-5"
                  style={
                    selected
                      ? {
                          background: GREEN,
                          borderColor: GREEN,
                          color: "#fff",
                          boxShadow: `0 0 0 1px ${GREEN}`,
                        }
                      : {
                          background: "#fafafa",
                          borderColor: "#e8e8e8",
                          color: "#374151",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = GREEN;
                      e.currentTarget.style.background = GREEN_SOFT;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = "#e8e8e8";
                      e.currentTarget.style.background = "#fafafa";
                    }
                  }}
                >
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={
                      selected
                        ? { background: "rgba(255,255,255,0.22)", color: "#fff" }
                        : { background: "#ebebeb", color: "#525252" }
                    }
                  >
                    {letter}
                  </span>
                  <span className="text-base font-medium leading-snug md:text-[17px]">
                    {option}
                  </span>
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
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300"
              style={
                index === 0
                  ? undefined
                  : { background: GREEN, color: "#fff" }
              }
            >
              ← Previous
            </button>

            {index < QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(QUESTIONS.length - 1, i + 1))}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-95"
                style={{ background: GREEN }}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </section>

        {/* Side navigator */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <button
            type="button"
            onClick={() => setNavOpen((p) => !p)}
            className="mb-2 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white lg:hidden"
            style={{ background: GREEN }}
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
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: AMBER }}
                />
                Current
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: GREEN }}
                />
                Answered
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-neutral-300 bg-white" />
                Unanswered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {QUESTIONS.map((q, i) => {
                const answered = !!answers[q.id];
                const isCurrent = i === index;
                return (
                  <button
                    key={q.id}
                    type="button"
                    title={answered ? `Q${i + 1} — Answered` : `Q${i + 1} — Unanswered`}
                    onClick={() => {
                      setIndex(i);
                      setNavOpen(false);
                    }}
                    className="aspect-square rounded-xl text-xs font-bold transition-all"
                    style={
                      isCurrent
                        ? {
                            background: AMBER,
                            color: "#fff",
                            boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${AMBER}`,
                          }
                        : answered
                        ? { background: GREEN, color: "#fff" }
                        : {
                            background: "#f5f5f5",
                            color: "#737373",
                            border: "1px solid #e5e5e5",
                          }
                    }
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
                  {answeredCount}/{QUESTIONS.length}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: GREEN }}
                />
              </div>
            </div>

            <div className="mt-5 border-t border-neutral-100 pt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                Sections
              </p>
              <div className="flex flex-col gap-1">
                {SECTIONS.map(({ key, label }) => {
                  const active = key === section;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-semibold"
                      style={
                        active
                          ? {
                              background: GREEN_SOFT,
                              color: GREEN_DARK,
                              boxShadow: `inset 0 0 0 1px ${GREEN}55`,
                            }
                          : { color: "#a3a3a3" }
                      }
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: active ? GREEN : "#e5e5e5",
                        }}
                      />
                      {label}
                      {active && (
                        <span
                          className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                          style={{ background: GREEN }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-3 hidden text-center text-[11px] text-neutral-400 lg:block">
            Interactive mock · pick answers & jump around
          </p>
        </aside>
      </main>
    </div>
  );
}
