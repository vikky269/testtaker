// app/data/gedDomains.ts
// Topic-level diagnostic mapping — SmartMathz GED Proficiency Framework
// (source: "GED Comprehensive Diagnostic Assessment", Sections 7 & 8)
// Ranges are relative to the START of each section (0-based), matching
// GED_SECTIONS' start/end in geddata.ts — e.g. Math domain ranges assume
// index 0 = the first Math question (absolute Q1 in the source doc).

import { type GEDSectionKey } from "./geddata";

export interface GedDomain {
  name: string;
  start: number; // relative index within the section, inclusive
  end: number;   // exclusive
}

export const GED_DOMAINS: Record<GEDSectionKey, GedDomain[]> = {
  math: [
    { name: "Number Operations",                    start: 0,  end: 4  },
    { name: "Ratios, Proportions & Percent",         start: 4,  end: 7  },
    { name: "Algebraic Expressions",                 start: 7,  end: 10 },
    { name: "Equations & Inequalities",              start: 10, end: 13 },
    { name: "Functions & Linear Relationships",      start: 13, end: 17 },
    { name: "Geometry & Measurement",                start: 17, end: 21 },
    { name: "Statistics & Probability",              start: 21, end: 24 },
  ],
  rla: [
    { name: "Informational Reading",  start: 0,  end: 4  },
    { name: "Literary Analysis",      start: 4,  end: 8  },
    { name: "Argument & Evidence",    start: 8,  end: 12 },
    { name: "Vocabulary in Context",  start: 12, end: 14 },
    { name: "Grammar & Language",     start: 14, end: 22 },
  ],
  science: [
    { name: "Life Science",                              start: 0,  end: 5  },
    { name: "Physical Science",                          start: 5,  end: 10 },
    { name: "Earth & Space Science",                     start: 10, end: 14 },
    { name: "Experimental Design",                       start: 14, end: 17 },
    { name: "Data Interpretation & Scientific Reasoning", start: 17, end: 19 },
  ],
  social: [
    { name: "Civics & Government",       start: 0,  end: 4  },
    { name: "U.S. History",              start: 4,  end: 8  },
    { name: "Economics",                 start: 8,  end: 12 },
    { name: "Geography",                 start: 12, end: 13 },
    { name: "Data & Evidence Analysis",  start: 13, end: 15 },
  ],
};

export interface DomainResult {
  name: string;
  correct: number;
  total: number;
  score: number; // 0–100
  level: string; // Strong / Proficient / Developing / Emerging / Foundational
}

// SmartMathz Proficiency Framework bands (doc Section 8)
export function getProficiencyLevel(score: number): { label: string; color: [number, number, number] } {
  if (score >= 85) return { label: "Strong",       color: [22, 101, 52]  };
  if (score >= 70) return { label: "Proficient",   color: [37, 99, 235]  };
  if (score >= 50) return { label: "Developing",   color: [217, 119, 6]  };
  if (score >= 30) return { label: "Emerging",     color: [234, 88, 12]  };
  return              { label: "Foundational", color: [185, 28, 28]  };
}

export function computeSectionDomains(
  sectionKey: GEDSectionKey,
  sectionQuestions: { question: string; correctAnswer?: string; answer?: string }[],
  answers: Record<string, string>
): DomainResult[] {
  const domains = GED_DOMAINS[sectionKey];
  return domains.map((d) => {
    const qs = sectionQuestions.slice(d.start, d.end);
    const total = qs.length;
    const correct = qs.filter((q) => answers?.[q.question] === (q.correctAnswer || (q as any).answer)).length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { name: d.name, correct, total, score, level: getProficiencyLevel(score).label };
  });
}