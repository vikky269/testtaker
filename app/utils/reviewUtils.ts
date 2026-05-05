// export const formatDuration = (seconds: number): string => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${minutes}m ${remainingSeconds}s`;
// };

// export const getFormattedTimeData = (
//   searchParams: URLSearchParams | ReturnType<typeof import("next/navigation").useSearchParams>,
//   timeData: {
//     mathDuration?: number;
//     elaDuration?: number;
//     scienceDuration?: number;
//     totalDuration?: number;
//   }
// ) => {
//   const mathTime = searchParams.get("mathTime")
//     ? parseInt(searchParams.get("mathTime")!)
//     : timeData.mathDuration || 0;
//   const elaTime = searchParams.get("elaTime")
//     ? parseInt(searchParams.get("elaTime")!)
//     : timeData.elaDuration || 0;
//   const scienceTime = searchParams.get("scienceTime")
//     ? parseInt(searchParams.get("scienceTime")!)
//     : timeData.scienceDuration || 0;
//   const calculatedTotal = mathTime + elaTime + scienceTime;

//   return {
//     math:    mathTime        ? formatDuration(mathTime)    : "0m 0s",
//     ela:     elaTime         ? formatDuration(elaTime)     : "0m 0s",
//     science: scienceTime     ? formatDuration(scienceTime) : "0m 0s",
//     total:   calculatedTotal ? formatDuration(calculatedTotal) : "N/A",
//   };
// };

// // ── Performance band logic ──────────────────────────────────
// // Updated thresholds:
// //   WHIZZES   95–100%
// //   ACES      80–94%
// //   EXPLORERS 61–79%
// //   RISERS    31–60%
// //   ADAPTERS  0–30%

// export interface PerformanceBand {
//   range: string;
//   label: string;
//   color: [number, number, number]; // RGB for jsPDF
//   shortComment: string;
//   fullComment: string;
// }

// export const getPerformanceBand = (score: number): PerformanceBand => {
//   if (score >= 95) {
//     return {
//       range: "95 – 100%",
//       label: "Excellent Mastery",
//       color: [22, 101, 52],
//       shortComment: "Outstanding",
//       fullComment:
//         "The student demonstrates outstanding understanding and mastery of the subject. Concepts are applied accurately and confidently, with strong problem-solving skills. This performance reflects high academic potential, and we recommend enrichment activities to further challenge and sustain this level of excellence.",
//     };
//   }
//   if (score >= 80) {
//     return {
//       range: "80 – 94%",
//       label: "Strong Performance",
//       color: [102, 178, 255],
//       shortComment: "Strong",
//       fullComment:
//         "The student shows a solid grasp of the subject matter and applies concepts effectively. Performance at this level reflects good study habits and growing confidence. Continued practice and exposure to slightly more challenging problems will help push performance toward excellence.",
//     };
//   }
//   if (score >= 61) {
//     return {
//       range: "61 – 79%",
//       label: "Developing Progress",
//       color: [255, 235, 102],
//       shortComment: "Developing",
//       fullComment:
//         "The student demonstrates a fair understanding of the subject with noticeable strengths in some areas. While progress is evident, there are still concepts that need reinforcement. With regular practice and targeted support, the student is well-positioned to achieve stronger and more consistent results.",
//     };
//   }
//   if (score >= 31) {
//     return {
//       range: "31 – 60%",
//       label: "Steady Progress",
//       color: [250, 204, 21],
//       shortComment: "Rising",
//       fullComment:
//         "The student is steadily improving and showing commitment to their learning. While mastery of core concepts is still developing, consistent effort and targeted practice will help build the skills needed to move into higher performance bands.",
//     };
//   }
//   return {
//     range: "0 – 30%",
//     label: "Foundational Support Needed",
//     color: [153, 27, 27],
//     shortComment: "Needs Support",
//     fullComment:
//       "The student is currently developing basic understanding of key concepts and requires significant support. This score indicates gaps in foundational skills, and we recommend focused revision, guided practice, and consistent tutoring sessions to help strengthen confidence and improve performance over time.",
//   };
// };

// export const getSectionPerformanceLabel = (score: number | null): string => {
//   if (score === null) return "Skipped";
//   if (score >= 95) return "Excellent Mastery";
//   if (score >= 80) return "Strong Performance";
//   if (score >= 61) return "Developing Progress";
//   if (score >= 31) return "Steady Progress";
//   return "Foundational Support Needed";
// };


// app/utils/reviewUtils.ts
// Pure helper functions — performance bands, categories, time formatting

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export const getFormattedTimeData = (
  searchParams: any,
  timeData: {
    mathDuration?: number;
    elaDuration?: number;
    scienceDuration?: number;
    totalDuration?: number;
  }
) => {
  const mathTime    = searchParams.get('mathTime')    ? parseInt(searchParams.get('mathTime')!)    : timeData.mathDuration    || 0;
  const elaTime     = searchParams.get('elaTime')     ? parseInt(searchParams.get('elaTime')!)     : timeData.elaDuration     || 0;
  const scienceTime = searchParams.get('scienceTime') ? parseInt(searchParams.get('scienceTime')!) : timeData.scienceDuration || 0;
  const calculatedTotal = mathTime + elaTime + scienceTime;

  return {
    math:    mathTime    ? formatDuration(mathTime)    : '0m 0s',
    ela:     elaTime     ? formatDuration(elaTime)     : '0m 0s',
    science: scienceTime ? formatDuration(scienceTime) : '0m 0s',
    total:   calculatedTotal ? formatDuration(calculatedTotal) : 'N/A',
  };
};

// ── Performance band (used in PDF report & review page) ───────────────────────
// Score ranges from boss's parameters:
//   91–100% → Excellent Mastery
//   80–90%  → Strong Performance
//   50–79%  → Developing Progress
//   0–49%   → Foundational Support Needed

export interface PerformanceBand {
  range: string;
  label: string;
  color: [number, number, number]; // RGB for jsPDF
  shortComment: string;
  fullComment: string;
}

export const getPerformanceBand = (score: number): PerformanceBand => {
  if (score >= 91) return {
    range: '91 – 100%',
    label: 'Excellent Mastery',
    color: [22, 101, 52],
    shortComment: 'Outstanding',
    fullComment: 'The student demonstrates outstanding understanding and mastery of the subject. Concepts are applied accurately and confidently, with strong problem-solving skills. This performance reflects high academic potential, and we recommend enrichment activities to further challenge and sustain this level of excellence.',
  };
  if (score >= 80) return {
    range: '80 – 90%',
    label: 'Strong Performance',
    color: [21, 128, 61],
    shortComment: 'Strong',
    fullComment: 'The student shows a solid grasp of the subject matter and applies concepts effectively. Performance at this level reflects good study habits and growing confidence. Continued practice and exposure to slightly more challenging problems will help push performance toward excellence.',
  };
  if (score >= 50) return {
    range: '50 – 79%',
    label: 'Developing Progress',
    color: [146, 64, 14],
    shortComment: 'Developing',
    fullComment: 'The student demonstrates a fair understanding of the subject with noticeable strengths in some areas. While progress is evident, there are still concepts that need reinforcement. With regular practice and targeted support, the student is well-positioned to achieve stronger and more consistent results.',
  };
  return {
    range: '0 – 49%',
    label: 'Foundational Support Needed',
    color: [153, 27, 27],
    shortComment: 'Needs Support',
    fullComment: 'The student is currently developing basic understanding of key concepts and requires significant support. This score indicates gaps in foundational skills, and we recommend focused revision, guided practice, and consistent tutoring sessions to help strengthen confidence and improve performance over time.',
  };
};

export const getSectionPerformanceLabel = (score: number | null): string => {
  if (score === null) return 'Skipped';
  if (score >= 91) return 'Excellent Mastery';
  if (score >= 80) return 'Strong Performance';
  if (score >= 50) return 'Developing Progress';
  return 'Foundational Support Needed';
};

// ── Learning Categories (used in admin Results page & recommendation PDF) ─────
// NEW bands from boss's image:
//   95–100% → WHIZZES
//   80–94%  → ACES
//   61–79%  → EXPLORERS
//   31–60%  → RISERS
//   0–30%   → ADAPTERS

export interface LearningCategory {
  name: 'WHIZZES' | 'ACES' | 'EXPLORERS' | 'RISERS' | 'ADAPTERS';
  range: string;
  description: string;
  color: string;       // Tailwind text color class
  bgColor: string;     // Tailwind bg color class
  badgeColor: string;  // hex for PDF
  pdfTextColor: [number, number, number];
}

export const LEARNING_CATEGORIES: LearningCategory[] = [
  {
    name: 'WHIZZES',
    range: '95–100%',
    description: 'Students who demonstrate exceptional ability across Mathematics, ELA, and Science. They quickly grasp complex concepts, think critically, and solve challenging problems with ease. These students often show advanced reasoning and may find grade-level material relatively straightforward.',
    color: 'text-green-900',
    bgColor: 'bg-green-100',
    badgeColor: '#14532d',
    pdfTextColor: [20, 83, 45],
  },
  {
    name: 'ACES',
    range: '80–94%',
    description: 'Students who consistently perform very well across Mathematics, ELA, and Science. They have a strong understanding of core concepts and regularly achieve high scores on assignments, projects, and assessments through focus and consistent effort.',
    color: 'text-green-800',
    bgColor: 'bg-green-50',
    badgeColor: '#166534',
    pdfTextColor: [22, 101, 52],
  },
  {
    name: 'EXPLORERS',
    range: '61–79%',
    description: 'Students who show strong curiosity and engagement in Mathematics, ELA, and Science. They ask thoughtful questions, participate actively, and enjoy exploring ideas beyond the standard curriculum, even if they do not always score at the top.',
    color: 'text-blue-800',
    bgColor: 'bg-blue-50',
    badgeColor: '#1e40af',
    pdfTextColor: [30, 64, 175],
  },
  {
    name: 'RISERS',
    range: '31–60%',
    description: 'Students who are steadily improving in Mathematics, ELA, and Science. While they may not yet demonstrate advanced mastery, they show commitment, effort, and noticeable progress in their understanding and academic performance.',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
    badgeColor: '#854d0e',
    pdfTextColor: [133, 77, 14],
  },
  {
    name: 'ADAPTERS',
    range: '0–30%',
    description: 'Students who may initially struggle or show hesitation toward Mathematics, ELA, or Science but can improve significantly when exposed to the right learning strategies, practical examples, and supportive instruction.',
    color: 'text-purple-800',
    bgColor: 'bg-purple-50',
    badgeColor: '#6b21a8',
    pdfTextColor: [107, 33, 168],
  },
];

export const getLearningCategory = (score: number): LearningCategory => {
  if (score >= 95) return LEARNING_CATEGORIES[0]; // WHIZZES
  if (score >= 80) return LEARNING_CATEGORIES[1]; // ACES
  if (score >= 61) return LEARNING_CATEGORIES[2]; // EXPLORERS
  if (score >= 31) return LEARNING_CATEGORIES[3]; // RISERS
  return LEARNING_CATEGORIES[4];                  // ADAPTERS
};