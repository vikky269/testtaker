// app/quiz/[testId]/review/utils/reviewUtils.ts
// Pure helper functions for the review page

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export const getFormattedTimeData = (
  searchParams: URLSearchParams | ReturnType<typeof import("next/navigation").useSearchParams>,
  timeData: {
    mathDuration?: number;
    elaDuration?: number;
    scienceDuration?: number;
    totalDuration?: number;
  }
) => {
  const mathTime = searchParams.get("mathTime")
    ? parseInt(searchParams.get("mathTime")!)
    : timeData.mathDuration || 0;
  const elaTime = searchParams.get("elaTime")
    ? parseInt(searchParams.get("elaTime")!)
    : timeData.elaDuration || 0;
  const scienceTime = searchParams.get("scienceTime")
    ? parseInt(searchParams.get("scienceTime")!)
    : timeData.scienceDuration || 0;
  const calculatedTotal = mathTime + elaTime + scienceTime;

  return {
    math: mathTime ? formatDuration(mathTime) : "0m 0s",
    ela: elaTime ? formatDuration(elaTime) : "0m 0s",
    science: scienceTime ? formatDuration(scienceTime) : "0m 0s",
    total: calculatedTotal ? formatDuration(calculatedTotal) : "N/A",
  };
};

// ── Performance band logic ──────────────────────────────────

export interface PerformanceBand {
  range: string;
  label: string;
  color: [number, number, number]; // RGB for jsPDF
  shortComment: string;
  fullComment: string;
}

export const getPerformanceBand = (score: number): PerformanceBand => {
  if (score >= 91) {
    return {
      range: "91 – 100%",
      label: "Excellent Mastery",
      color: [22, 101, 52],  // deep green
      shortComment: "Outstanding",
      fullComment:
        "The student demonstrates outstanding understanding and mastery of the subject. Concepts are applied accurately and confidently, with strong problem-solving skills. This performance reflects high academic potential, and we recommend enrichment activities to further challenge and sustain this level of excellence.",
    };
  }
  if (score >= 80) {
    return {
      range: "80 – 90%",
      label: "Strong Performance",
      //color: [21, 128, 61],  // green
      color: [102, 178, 255],  // blue
      shortComment: "Strong",
      fullComment:
        "The student shows a solid grasp of the subject matter and applies concepts effectively. Performance at this level reflects good study habits and growing confidence. Continued practice and exposure to slightly more challenging problems will help push performance toward excellence.",
    };
  }
  if (score >= 50) {
    return {
      range: "50 – 79%",
      label: "Developing Progress",
      //color: [146, 64, 14],  // amber
      color: [255, 235, 102],  // yellow
      shortComment: "Developing",
      fullComment:
        "The student demonstrates a fair understanding of the subject with noticeable strengths in some areas. While progress is evident, there are still concepts that need reinforcement. With regular practice and targeted support, the student is well-positioned to achieve stronger and more consistent results.",
    };
  }
  return {
    range: "0 – 49%",
    label: "Foundational Support Needed",
    color: [153, 27, 27],  // red
    shortComment: "Needs Support",
    fullComment:
      "The student is currently developing basic understanding of key concepts and requires significant support. This score indicates gaps in foundational skills, and we recommend focused revision, guided practice, and consistent tutoring sessions to help strengthen confidence and improve performance over time.",
  };
};

export const getSectionPerformanceLabel = (score: number | null): string => {
  if (score === null) return "Skipped";
  if (score >= 91) return "Excellent Mastery";
  if (score >= 80) return "Strong Performance";
  if (score >= 50) return "Developing Progress";
  return "Foundational Support Needed";
};