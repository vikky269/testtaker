// utils/scoreUtils.ts

export const calculateScore = (
  quizQuestions: any[],
  answers: Record<string, string>,
  gradeParam?: string
) => {
  const isGrade9Or10 =
    gradeParam === "grade9" || gradeParam === "grade10";

  if (!isGrade9Or10) {
    const total = quizQuestions.length;

    const correct = quizQuestions.filter(
      (q) => answers[q.question] === (q.correctAnswer || q.answer)
    ).length;

    return {
      combined: ((correct / total) * 100).toFixed(2),
    };
  }

  const mathQuestions = quizQuestions.slice(0, 10);
  const elaQuestions = quizQuestions.slice(10, 20);

  const mathCorrect = mathQuestions.filter(
    (q) => answers[q.question] === (q.correctAnswer || q.answer)
  ).length;

  const elaCorrect = elaQuestions.filter(
    (q) => answers[q.question] === (q.correctAnswer || q.answer)
  ).length;

  return {
    mathScore: ((mathCorrect / mathQuestions.length) * 100).toFixed(2),
    elaScore: ((elaCorrect / elaQuestions.length) * 100).toFixed(2),
    combined: (
      ((mathCorrect + elaCorrect) /
        (mathQuestions.length + elaQuestions.length)) *
      100
    ).toFixed(2),
  };
};



export const calculateSectionScore = (
  quizQuestions: any[],
  answers: Record<string, string>,
  section: "math" | "ela",
  gradeParam?: string
) => {
  const isGrade9Or10 =
    gradeParam === "grade9" || gradeParam === "grade10";

  if (!isGrade9Or10) return null;

  const sectionQuestions =
    section === "math"
      ? quizQuestions.slice(0, 10)
      : quizQuestions.slice(10, 20);

  if (sectionQuestions.length === 0) return "0.00";

  const correct = sectionQuestions.filter(
    (q) => answers[q.question] === (q.correctAnswer || q.answer)
  ).length;

  return ((correct / sectionQuestions.length) * 100).toFixed(2);
};