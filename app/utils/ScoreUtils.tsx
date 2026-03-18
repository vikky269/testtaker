// app/utils/scoreUtils.ts
// Pure score calculation functions — no React dependencies

type Answers = Record<string, string>;

interface Question {
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
  solution?: string;
}

/**
 * Calculates the combined score for non-sectioned quizzes,
 * or per-section scores for Grade 9/10 quizzes.
 */
export const calculateScore = (
  quizQuestions: Question[],
  answers: Answers,
  gradeParam: string | null
) => {
  const isGrade9Or10 = gradeParam === "grade9" || gradeParam === "grade10";

  if (!isGrade9Or10) {
    const total = quizQuestions.length;
    const correct = quizQuestions.filter(
      (q) => answers[q.question] === (q.correctAnswer || q.answer)
    ).length;
    return { combined: ((correct / total) * 100).toFixed(2) };
  }

  const mathQs = quizQuestions.slice(0, 10);
  const elaQs = quizQuestions.slice(10, 20);

  const mathCorrect = mathQs.filter(
    (q) => answers[q.question] === (q.correctAnswer || q.answer)
  ).length;

  const mathScore = ((mathCorrect / mathQs.length) * 100).toFixed(2);

  const elaAnsweredCount = elaQs.filter((q) => q.question in answers).length;

  const elaScore =
    elaAnsweredCount > 0
      ? (
          (elaQs.filter(
            (q) => answers[q.question] === (q.correctAnswer || q.answer)
          ).length /
            elaQs.length) *
          100
        ).toFixed(2)
      : "0.00";

  return {
    mathScore,
    elaScore,
    combinedScore: (
      ((mathCorrect +
        (elaAnsweredCount > 0
          ? (parseFloat(elaScore) / 100) * elaQs.length
          : 0)) /
        (elaAnsweredCount > 0 ? 20 : 10)) *
      100
    ).toFixed(2),
  };
};

/**
 * Calculates score for a single section (math / ela / science).
 * Returns null for ELA if it was skipped.
 * Always slices directly from quizQuestions to avoid double-slicing bugs.
 */
export const calculateSectionScore = (
  section: "math" | "ela" | "science",
  quizQuestions: Question[],
  answers: Answers
): string | null => {
  const elaSkipped = localStorage.getItem("elaSkipped") === "true";
  if (section === "ela" && elaSkipped) return null;

  const sectionQuestions =
    section === "math"
      ? quizQuestions.slice(0, 10)
      : section === "ela"
      ? quizQuestions.slice(10, 20)
      : quizQuestions.slice(20); // science

  const total = sectionQuestions.length;
  if (total === 0) return "0.00";

  const correct = sectionQuestions.filter(
    (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
  ).length;

  return ((correct / total) * 100).toFixed(2);
};