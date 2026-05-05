// import jsPDF from 'jspdf';

// export interface StudentData {
//   full_name: string;
//   email: string;
//   grade: string;
//   gender?: string | null;
//   overall_score: number;
//   math_score: number;
//   ela_score: number | null;
//   science_score: number | null;
//   total_time: number;
//   test_type: string;
//   created_at: string;
// }

// // ── Learning Category ────────────────────────────────────────
// // Updated thresholds to match:
// //   WHIZZES   95–100%
// //   ACES      80–94%
// //   EXPLORERS 61–79%
// //   RISERS    31–60%
// //   ADAPTERS  0–30%

// export interface LearningCategory {
//   name: string;
//   color: [number, number, number];
//   description: string;
// }

// export const getLearningCategory = (overallScore: number): LearningCategory => {
//   if (overallScore >= 95) return {
//     name: 'WHIZZES',
//     color: [22, 101, 52],
//     description: 'Students who demonstrate exceptional ability across Mathematics, ELA, and Science. They quickly grasp complex concepts, think critically, and solve challenging problems with ease. These students often show advanced reasoning and may find grade-level material relatively straightforward.',
//   };
//   if (overallScore >= 80) return {
//     name: 'ACES',
//     color: [0, 128, 0],
//     description: 'Students who consistently perform very well across Mathematics, ELA, and Science. They have a strong understanding of core concepts and regularly achieve high scores on assignments, projects, and assessments through focus and consistent effort.',
//   };
//   if (overallScore >= 61) return {
//     name: 'EXPLORERS',
//     color: [0, 100, 0],
//     description: 'Students who show strong curiosity and engagement in Mathematics, ELA, and Science. They ask thoughtful questions, participate actively, and enjoy exploring ideas beyond the standard curriculum, even if they do not always score at the top.',
//   };
//   if (overallScore >= 31) return {
//     name: 'RISERS',
//     color: [184, 134, 11],
//     description: 'Students who are steadily improving in Mathematics, ELA, and Science. While they may not yet demonstrate advanced mastery, they show commitment, effort, and noticeable progress in their understanding and academic performance.',
//   };
//   return {
//     name: 'ADAPTERS',
//     color: [180, 0, 180],
//     description: 'Students who may initially struggle or show hesitation toward Mathematics, ELA, or Science but can improve significantly when exposed to the right learning strategies, practical examples, and supportive instruction.',
//   };
// };

// // ── Package Definitions ──────────────────────────────────────
// export type PackageKey = 'package1' | 'package2' | 'package3' | 'custom';

// export interface PackageHourEntry {
//   subject: string;
//   hours: string;
// }

// export interface Package {
//   key: PackageKey;
//   name: string;
//   displayName: string;
//   subjects: string[];
//   hours: PackageHourEntry[];
//   totalHours: string;
//   rationale: string;
// }

// // Available subjects for custom package
// export const CUSTOM_SUBJECT_OPTIONS: { label: string; defaultHours: string }[] = [
//   { label: 'Mathematics',           defaultHours: '2 hours per week (1-hour sessions twice weekly)' },
//   { label: 'English Language Arts', defaultHours: '1 hour per week' },
//   { label: 'Science',               defaultHours: '1 hour per week' },
//   { label: 'Coding',                defaultHours: '1 hour per week' },
//   { label: 'Virtual Library',       defaultHours: 'Unlimited access' },
// ];

// export const ALL_PACKAGES: Package[] = [
//   {
//     key: 'package1',
//     name: 'Package I – Mathematics Only',
//     displayName: 'Package I – Math Only',
//     subjects: ['Mathematics'],
//     hours: [
//       { subject: 'Mathematics', hours: '2 hours per week (1-hour sessions twice weekly)' },
//     ],
//     totalHours: '2 hours per week',
//     rationale: 'This package provides focused, dedicated Mathematics support. The student will receive structured sessions designed to strengthen core concepts, build problem-solving skills, and improve overall mathematical confidence.',
//   },
//   {
//     key: 'package2',
//     name: 'Package II – Mathematics & ELA + Virtual Library',
//     displayName: 'Package II – Math & ELA + Virtual Library',
//     subjects: ['Mathematics', 'English Language Arts', 'Virtual Library'],
//     hours: [
//       { subject: 'Mathematics',           hours: '2 hours per week (1-hour sessions twice weekly)' },
//       { subject: 'English Language Arts', hours: '1 hour per week' },
//       { subject: 'Virtual Library',       hours: 'Unlimited access' },
//     ],
//     totalHours: '3 hours per week + Virtual Library',
//     rationale: 'This package combines structured Mathematics and English Language Arts support with access to our Virtual Library, addressing both numerical and literacy skills across core subjects.',
//   },
//   {
//     key: 'package3',
//     name: 'Package III – Mathematics, ELA, Science/Coding + Virtual Library',
//     displayName: 'Package III – Math, ELA & Science/Coding + Virtual Library',
//     subjects: ['Mathematics', 'English Language Arts', 'Science / Coding', 'Virtual Library'],
//     hours: [
//       { subject: 'Mathematics',           hours: '2 hours per week (1-hour sessions twice weekly)' },
//       { subject: 'English Language Arts', hours: '1 hour per week' },
//       { subject: 'Science / Coding',      hours: '1 hour per week' },
//       { subject: 'Virtual Library',       hours: 'Unlimited access' },
//     ],
//     totalHours: '4 hours per week + Virtual Library',
//     rationale: 'This STEM-focused package covers Mathematics, English Language Arts, and Science or Coding alongside Virtual Library access, building well-rounded academic skills and logical thinking.',
//   },
//   {
//     key: 'custom',
//     name: 'Custom Package – Tailored Programme',
//     displayName: 'Custom Package – Tailored',
//     subjects: [],
//     hours: [],
//     totalHours: 'Custom',
//     rationale: 'This bespoke package has been tailored specifically to address the individual needs of the student, combining selected subjects and session hours to provide the most targeted and effective support.',
//   },
// ];

// // Build a resolved Package object from custom selections
// export function buildCustomPackage(selections: PackageHourEntry[]): Package {
//   const subjectNames = selections.map(s => s.subject);
//   const hasVirtualLib = subjectNames.includes('Virtual Library');
//   const timedSubjects = selections.filter(s => s.subject !== 'Virtual Library');
//   const totalHoursNum = timedSubjects.reduce((acc, s) => {
//     const match = s.hours.match(/(\d+)\s*hour/);
//     return acc + (match ? parseInt(match[1]) : 0);
//   }, 0);
//   const totalHoursStr = hasVirtualLib
//     ? `${totalHoursNum} hour${totalHoursNum !== 1 ? 's' : ''} per week + Virtual Library`
//     : `${totalHoursNum} hour${totalHoursNum !== 1 ? 's' : ''} per week`;

//   return {
//     key: 'custom',
//     name: 'Custom Package – Tailored Programme',
//     displayName: 'Custom Package – Tailored',
//     subjects: subjectNames,
//     hours: selections,
//     totalHours: totalHoursStr,
//     rationale: 'This bespoke package has been tailored specifically to address the individual needs of the student, combining selected subjects and session hours to provide the most targeted and effective support.',
//   };
// }

// export const getSuggestedPackage = (s: StudentData): Package => {
//   const ela     = s.ela_score ?? 0;
//   const science = s.science_score ?? 0;
//   const needsEla     = ela > 0 && ela < 70;
//   const needsScience = science > 0 && science < 70;
//   if (needsEla && needsScience) return ALL_PACKAGES.find(p => p.key === 'package3')!;
//   if (needsEla || needsScience) return ALL_PACKAGES.find(p => p.key === 'package3')!;
//   if (ela > 0 && ela < 80)      return ALL_PACKAGES.find(p => p.key === 'package2')!;
//   return ALL_PACKAGES.find(p => p.key === 'package1')!;
// };

// // ── Short subject comments ───────────────────────────────────
// const getSubjectComment = (subject: string, score: number, name: string): string => {
//   const n = name.split(' ')[0];
//   if (subject === 'math') {
//     if (score >= 80) return `${n} performed exceptionally well in Mathematics, demonstrating strong conceptual understanding and the ability to apply mathematical reasoning effectively.`;
//     if (score >= 60) return `${n} shows a developing understanding of Mathematics. With targeted support on core concepts, significant improvement is expected.`;
//     return `${n} is still developing foundational math skills and would benefit from structured support to strengthen core concepts and build problem-solving confidence.`;
//   }
//   if (subject === 'ela') {
//     if (score >= 80) return `${n} performed very well in ELA, demonstrating solid comprehension, reasoning, and communication skills that support overall academic confidence.`;
//     if (score >= 60) return `${n} shows a fair understanding of ELA. With consistent reading practice and vocabulary development, performance can improve significantly.`;
//     return `${n} requires additional ELA support. Focused attention on reading comprehension, writing structure, and vocabulary will help bridge current gaps.`;
//   }
//   if (subject === 'science') {
//     if (score >= 80) return `${n}'s science performance reflects strong understanding of scientific concepts with excellent application of analytical thinking.`;
//     if (score >= 60) return `${n} shows good understanding of science. With guided practice, analytical thinking and problem-solving skills can be further improved.`;
//     return `${n} would benefit from additional science support to strengthen understanding of key concepts and develop stronger analytical skills.`;
//   }
//   return '';
// };

// // ── Pronoun helper ───────────────────────────────────────────
// const getPronoun = (gender?: string | null) => {
//   if (!gender) return { sub: 'The student', pos: 'their', obj: 'them' };
//   const g = gender.toLowerCase();
//   if (g === 'male'   || g === 'boy')  return { sub: 'He',   pos: 'his',  obj: 'him' };
//   if (g === 'female' || g === 'girl') return { sub: 'She',  pos: 'her',  obj: 'her' };
//   return { sub: 'They', pos: 'their', obj: 'them' };
// };

// // ── Main PDF Generator ───────────────────────────────────────
// export const generateRecommendationPDF = (
//   s: StudentData,
//   selectedPackage: Package,
//   instructorName = 'Isaac Salako'
// ) => {
//   const doc      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//   const pageW    = doc.internal.pageSize.getWidth();
//   const pageH    = doc.internal.pageSize.getHeight();
//   const margin   = 14;
//   const cW       = pageW - margin * 2;
//   const category = getLearningCategory(s.overall_score);
//   const pkg      = selectedPackage;
//   const firstName = s.full_name.split(' ')[0];
//   const pronoun   = getPronoun(s.gender);

//   let y = 0;

//   // ── HEADER ──────────────────────────────────────────────────
//   doc.setFillColor(22, 101, 52);
//   doc.rect(0, 0, pageW, 32, 'F');
//   try { doc.addImage('/logo.png', 'PNG', margin, 3, 24, 24); } catch {}
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(14); doc.setFont('helvetica', 'bold');
//   doc.text('SmartMathz', margin + 28, 12);
//   doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
//   doc.text('Evaluation Summary & Program Recommendation', margin + 28, 19);
//   doc.setFontSize(7);
//   doc.text('CONFIDENTIAL — For SmartMathz use only', margin + 28, 25);
//   doc.setFontSize(7.5);
//   doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageW - margin, 12, { align: 'right' });

//   y = 38;

//   // ── STUDENT INFO ─────────────────────────────────────────────
//   doc.setFillColor(240, 253, 244);
//   doc.roundedRect(margin, y, cW, 20, 2, 2, 'F');
//   doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
//   doc.text('STUDENT INFORMATION', margin + 3, y + 5.5);
//   doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);

//   const c1 = margin + 3, c2 = pageW / 2 + 2, c3 = pageW * 0.75;
//   const row1y = y + 12, row2y = y + 17;

//   doc.setFont('helvetica', 'bold'); doc.text('Name:',   c1, row1y);
//   doc.setFont('helvetica', 'normal'); doc.text(s.full_name, c1 + 16, row1y);
//   doc.setFont('helvetica', 'bold'); doc.text('Grade:',  c2, row1y);
//   doc.setFont('helvetica', 'normal'); doc.text(s.grade?.toUpperCase() || 'N/A', c2 + 17, row1y);
//   doc.setFont('helvetica', 'bold'); doc.text('Gender:', c3, row1y);
//   doc.setFont('helvetica', 'normal'); doc.text(s.gender || 'N/A', c3 + 18, row1y);

//   doc.setFont('helvetica', 'bold'); doc.text('Email:',  c1, row2y);
//   doc.setFont('helvetica', 'normal'); doc.text(s.email || 'N/A', c1 + 16, row2y);
//   doc.setFont('helvetica', 'bold'); doc.text('Date:',   c2, row2y);
//   doc.setFont('helvetica', 'normal'); doc.text(new Date(s.created_at).toLocaleDateString(), c2 + 17, row2y);

//   y += 24;

//   // ── SCORE STRIP ──────────────────────────────────────────────
//   const scoreItems = [
//     { label: 'OVERALL', val: s.overall_score,     color: [22, 101, 52]  as [number,number,number] },
//     { label: 'MATH',    val: s.math_score,         color: [79, 70, 229]  as [number,number,number] },
//     { label: 'ELA',     val: s.ela_score ?? 0,     color: [5, 150, 105]  as [number,number,number] },
//     { label: 'SCIENCE', val: s.science_score ?? 0, color: [217, 119, 6]  as [number,number,number] },
//   ];
//   const sw = (cW - 9) / 4;
//   scoreItems.forEach(({ label, val, color }, i) => {
//     const bx = margin + i * (sw + 3);
//     doc.setFillColor(249, 250, 251);
//     doc.roundedRect(bx, y, sw, 16, 2, 2, 'F');
//     doc.setDrawColor(...color); doc.setLineWidth(0.7);
//     doc.roundedRect(bx, y, sw, 16, 2, 2, 'S');
//     doc.setTextColor(...color); doc.setFontSize(6); doc.setFont('helvetica', 'bold');
//     doc.text(label, bx + sw / 2, y + 5.5, { align: 'center' });
//     doc.setFontSize(12);
//     doc.text(`${Math.round(val)}%`, bx + sw / 2, y + 13, { align: 'center' });
//   });

//   y += 20;

//   // ── SUBJECT PERFORMANCE OVERVIEW ─────────────────────────────
//   doc.setFontSize(9); doc.setFont('helvetica', 'bold');
//   doc.setTextColor(17, 24, 39);
//   doc.text('SUBJECT PERFORMANCE OVERVIEW', margin, y);
//   y += 3;

//   doc.setFillColor(240, 253, 244);
//   doc.roundedRect(margin, y, cW, 6, 1, 1, 'F');
//   doc.setTextColor(22, 101, 52); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
//   doc.text('SUBJECT', margin + 3, y + 4.2);
//   doc.text('SCORE', margin + 47, y + 4.2);
//   doc.text('PERFORMANCE SUMMARY', margin + 72, y + 4.2);
//   y += 7;

//   const subjectRows: {
//     name: string; score: number | null;
//     key: 'math' | 'ela' | 'science';
//     color: [number,number,number]; bg: [number,number,number]
//   }[] = [
//     { name: 'Mathematics',           score: s.math_score,    key: 'math',    color: [79, 70, 229],  bg: [238, 242, 255] },
//     { name: 'English Language Arts', score: s.ela_score,     key: 'ela',     color: [5, 150, 105],  bg: [236, 253, 245] },
//     { name: 'Science',               score: s.science_score, key: 'science', color: [217, 119, 6],  bg: [255, 251, 235] },
//   ];

//   const commentColX = margin + 72;
//   const rowH = 14;

//   subjectRows.forEach(({ name, score, key, color, bg }) => {
//     if (score == null || score === 0) return;

//     doc.setFillColor(...bg);
//     doc.roundedRect(margin, y, cW, rowH, 1, 1, 'F');
//     doc.setFillColor(...color);
//     doc.rect(margin, y, 2, rowH, 'F');

//     doc.setTextColor(...color); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
//     doc.text(name, margin + 4, y + rowH / 2 + 1.5, { maxWidth: 42 });

//     doc.setFillColor(...color);
//     doc.roundedRect(margin + 46, y + 3, 20, 8, 2, 2, 'F');
//     doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
//     doc.text(`${Math.round(score)}%`, margin + 56, y + 8.5, { align: 'center' });

//     const comment = getSubjectComment(key, score, s.full_name);
//     const commentLines = doc.splitTextToSize(comment, cW - 74);
//     doc.setTextColor(55, 65, 81); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
//     const textBlockH = commentLines.length * 3.8;
//     const textStartY = y + (rowH - textBlockH) / 2 + 3.5;
//     doc.text(commentLines.slice(0, 3), commentColX, textStartY);

//     y += rowH + 2;
//   });

//   y += 3;

//   // ── LEARNING CATEGORY ────────────────────────────────────────
//   doc.setFontSize(9); doc.setFont('helvetica', 'bold');
//   doc.setTextColor(17, 24, 39);
//   doc.text('LEARNING CATEGORY', margin, y);
//   y += 3;

//   const shortCatDesc = doc.splitTextToSize(category.description, cW - 52).slice(0, 2);
//   const catBoxH = 16;

//   doc.setFillColor(240, 253, 244);
//   doc.roundedRect(margin, y, cW, catBoxH, 2, 2, 'F');
//   doc.setDrawColor(...category.color); doc.setLineWidth(0.4);
//   doc.roundedRect(margin, y, cW, catBoxH, 2, 2, 'S');

//   doc.setFillColor(...category.color);
//   doc.roundedRect(margin + 3, y + 3, 40, 10, 2, 2, 'F');
//   doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
//   doc.text(category.name, margin + 23, y + 9.5, { align: 'center' });

//   doc.setTextColor(30, 60, 30); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
//   doc.text(
//     `${firstName} fits well within our ${category.name} group. ${shortCatDesc.join(' ')}`,
//     margin + 47, y + 6,
//     { maxWidth: cW - 50 }
//   );

//   y += catBoxH + 5;

//   // ── PROGRAMME RECOMMENDATION ─────────────────────────────────
//   doc.setFontSize(9); doc.setFont('helvetica', 'bold');
//   doc.setTextColor(17, 24, 39);
//   doc.text('PROGRAMME RECOMMENDATION', margin, y);
//   y += 4;

//   doc.setFillColor(22, 101, 52);
//   doc.roundedRect(margin, y, cW, 9, 2, 2, 'F');
//   doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
//   doc.text(pkg.name, margin + cW / 2, y + 6, { align: 'center' });
//   y += 12;

//   const ratLines = doc.splitTextToSize(pkg.rationale, cW - 8);
//   const ratH = Math.min(ratLines.length, 3) * 4.2 + 7;
//   doc.setFillColor(254, 252, 232);
//   doc.roundedRect(margin, y, cW, ratH, 2, 2, 'F');
//   doc.setDrawColor(234, 179, 8); doc.setLineWidth(0.4);
//   doc.line(margin + 1, y + 1, margin + 1, y + ratH - 1);
//   doc.setTextColor(92, 76, 3); doc.setFontSize(8); doc.setFont('helvetica', 'normal');
//   doc.text(ratLines.slice(0, 3), margin + 5, y + 5.5);
//   y += ratH + 5;

//   doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
//   doc.setTextColor(17, 24, 39);
//   doc.text('Session Schedule:', margin, y);
//   y += 4;

//   pkg.hours.forEach(({ subject, hours }) => {
//     doc.setFillColor(248, 250, 252);
//     doc.roundedRect(margin, y, cW, 7.5, 1, 1, 'F');
//     doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.2);
//     doc.roundedRect(margin, y, cW, 7.5, 1, 1, 'S');
//     doc.setTextColor(22, 101, 52); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
//     doc.text(`• ${subject}`, margin + 4, y + 5.2);
//     doc.setTextColor(55, 65, 81); doc.setFont('helvetica', 'normal');
//     doc.text(hours, margin + cW - 3, y + 5.2, { align: 'right' });
//     y += 9;
//   });

//   doc.setFillColor(22, 101, 52);
//   doc.roundedRect(margin, y, cW, 8, 1, 1, 'F');
//   doc.setTextColor(255, 255, 255); doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
//   doc.text('Total:', margin + 4, y + 5.5);
//   doc.text(pkg.totalHours, margin + cW - 3, y + 5.5, { align: 'right' });
//   y += 12;

//   // ── SIGN OFF ─────────────────────────────────────────────────
//   doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(75, 85, 99);
//   doc.text('Please do not hesitate to reach out if you have any questions or concerns.', margin, y);
//   y += 5;
//   doc.text('Best regards,', margin, y); y += 5;
//   doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 101, 52); doc.setFontSize(8.5);
//   doc.text(instructorName, margin, y); y += 5;
//   doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128); doc.setFontSize(7.5);
//   doc.text('Lead Instructor, SmartMathz', margin, y);

//   // ── FOOTER ───────────────────────────────────────────────────
//   doc.setFillColor(22, 101, 52);
//   doc.rect(0, pageH - 10, pageW, 10, 'F');
//   doc.setTextColor(255, 255, 255); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
//   doc.text(
//     'CONFIDENTIAL — SmartMathz Evaluation Report  |  www.smartmathz.com',
//     pageW / 2, pageH - 3.5, { align: 'center' }
//   );

//   doc.save(`SmartMathz_Recommendation_${s.full_name.replace(/\s+/g, '_')}.pdf`);
// };




// app/utils/generateRecommendation.ts
// Recommendation PDF generator — supports Packages I, II, III, and Custom Package
// Custom Package: admin selects subjects + hours, reflected in the PDF

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getLearningCategory, getPerformanceBand } from './reviewUtils';

// ── Package definitions ────────────────────────────────────────────────────────
// Package IV is now "Custom Package" — admin builds it from a subject dropdown

export interface CustomPackageSubject {
  name: string;   // e.g. "Mathematics", "ELA", "Science", "Coding", "Virtual Library"
  hours: number;  // hours per week for this subject
}

export interface PackageOption {
  id: 'I' | 'II' | 'III' | 'custom';
  label: string;
  subjects: string[];
  hoursPerWeek: number | null; // null = custom (calculated from subjects)
  description: string;
}

export const PACKAGES: PackageOption[] = [
  {
    id: 'I',
    label: 'Package I',
    subjects: ['Mathematics'],
    hoursPerWeek: 2,
    description: 'Mathematics only — 2 hrs/week',
  },
  {
    id: 'II',
    label: 'Package II',
    subjects: ['Mathematics', 'English Language Arts', 'Virtual Library'],
    hoursPerWeek: 5,
    description: 'Math + ELA + Virtual Library — 5 hrs/week',
  },
  {
    id: 'III',
    label: 'Package III',
    subjects: ['Mathematics', 'English Language Arts', 'Science/Coding', 'Virtual Library'],
    hoursPerWeek: 6,
    description: 'Math + ELA + Science/Coding + Virtual Library — 6 hrs/week',
  },
  {
    id: 'custom',
    label: 'Custom Package',
    subjects: [],           // filled at runtime
    hoursPerWeek: null,     // calculated from selected subjects
    description: 'Customised programme — subjects and hours set by admin',
  },
];

// Available subjects for the custom package dropdown
export const CUSTOM_PACKAGE_SUBJECTS = [
  { name: 'Mathematics',             defaultHours: 1 },
  { name: 'English Language Arts',   defaultHours: 1 },
  { name: 'Science',                 defaultHours: 1 },
  { name: 'Coding',                  defaultHours: 1 },
  { name: 'Virtual Library',         defaultHours: 1 },
];

// ── Auto-suggest package based on section scores ───────────────────────────────
export const getSuggestedPackage = (scores: {
  math: number | null;
  ela: number | null;
  science: number | null;
}): PackageOption => {
  const below70 = [scores.math, scores.ela, scores.science].filter(s => s !== null && s < 70).length;
  if (below70 === 0 && (scores.math ?? 0) >= 80) return PACKAGES[0]; // Package I
  if (below70 <= 1) return PACKAGES[1]; // Package II
  if (below70 <= 2) return PACKAGES[2]; // Package III
  return PACKAGES[2]; // Package III (worst case)
};

// ── Pronouns helper ────────────────────────────────────────────────────────────
const getPronoun = (gender?: string) => {
  if (gender?.toLowerCase() === 'male')   return { sub: 'He', obj: 'him', pos: 'his' };
  if (gender?.toLowerCase() === 'female') return { sub: 'She', obj: 'her', pos: 'her' };
  return { sub: 'They', obj: 'them', pos: 'their' };
};

// ── Main PDF generator ─────────────────────────────────────────────────────────

interface RecommendationParams {
  studentName: string;
  studentEmail?: string;
  grade: string;
  gender?: string;
  mathScore: number | null;
  elaScore: number | null;
  scienceScore: number | null;
  overallScore: number;
  selectedPackage: PackageOption;
  customSubjects?: CustomPackageSubject[]; // only used when selectedPackage.id === 'custom'
  instructorName?: string;
  testDate?: string;
}

export const generateRecommendationPDF = (params: RecommendationParams) => {
  const {
    studentName, studentEmail, grade, gender,
    mathScore, elaScore, scienceScore, overallScore,
    selectedPackage, customSubjects = [], instructorName,
    testDate,
  } = params;

  const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW  = doc.internal.pageSize.getWidth();
  const pageH  = doc.internal.pageSize.getHeight();
  const margin = 14;
  const cW     = pageW - margin * 2;

  const category = getLearningCategory(overallScore);
  const pronoun  = getPronoun(gender);
  const dateStr  = testDate ?? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // ── Build custom package display ──────────────────────────────────────────
  const isCustom = selectedPackage.id === 'custom';
  const packageSubjects: string[] = isCustom
    ? customSubjects.map(s => s.name)
    : selectedPackage.subjects;
  const packageHours: number = isCustom
    ? customSubjects.reduce((sum, s) => sum + s.hours, 0)
    : (selectedPackage.hoursPerWeek ?? 0);
  const packageLabel = isCustom ? 'Custom Package' : selectedPackage.label;
  const packageDesc  = isCustom
    ? `Customised programme — ${packageSubjects.join(', ')} — ${packageHours}hrs/week`
    : selectedPackage.description;

  // ── HEADER ─────────────────────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 30, 'F');

  try { doc.addImage('/logo.png', 'PNG', margin, 3, 22, 22); } catch {}

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13); doc.setFont('helvetica', 'bold');
  doc.text('SmartMathz', margin + 26, 12);
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text('Personalised Programme Recommendation', margin + 26, 18);

  doc.setFontSize(7.5);
  doc.text(`Date: ${dateStr}`, pageW - margin, 12, { align: 'right' });

  // ── STUDENT INFO ───────────────────────────────────────────────────────────
  let y = 36;

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cW, 18, 2, 2, 'F');

  doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text('STUDENT', margin + 4, y + 5.5);

  doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  const c1 = margin + 4, c2 = pageW / 2;

  doc.setFont('helvetica', 'bold'); doc.text('Name:',  c1,  y + 11);
  doc.setFont('helvetica', 'normal'); doc.text(studentName, c1 + 16, y + 11);

  doc.setFont('helvetica', 'bold'); doc.text('Grade:', c2, y + 11);
  doc.setFont('helvetica', 'normal'); doc.text(grade?.toUpperCase() ?? 'N/A', c2 + 17, y + 11);

  if (studentEmail) {
    doc.setFont('helvetica', 'bold'); doc.text('Email:', c1, y + 16);
    doc.setFont('helvetica', 'normal'); doc.text(studentEmail, c1 + 16, y + 16);
  }
  if (gender) {
    doc.setFont('helvetica', 'bold'); doc.text('Gender:', c2, y + 16);
    doc.setFont('helvetica', 'normal'); doc.text(gender, c2 + 19, y + 16);
  }

  y += 23;

  // ── SCORE STRIP ────────────────────────────────────────────────────────────
  const scoreItems = [
    { label: 'OVERALL', val: `${overallScore.toFixed(0)}%`, color: category.pdfTextColor },
    { label: 'MATH',    val: mathScore    != null ? `${mathScore.toFixed(0)}%`    : '—', color: [31,41,55] as [number,number,number] },
    { label: 'ELA',     val: elaScore     != null ? `${elaScore.toFixed(0)}%`     : '—', color: [31,41,55] as [number,number,number] },
    { label: 'SCIENCE', val: scienceScore != null ? `${scienceScore.toFixed(0)}%` : '—', color: [31,41,55] as [number,number,number] },
  ];

  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, y, cW, 14, 2, 2, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, cW, 14, 2, 2, 'S');

  const sw = cW / scoreItems.length;
  scoreItems.forEach((item, i) => {
    const cx = margin + sw * i + sw / 2;
    doc.setTextColor(107, 114, 128); doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
    doc.text(item.label, cx, y + 4.5, { align: 'center' });
    doc.setTextColor(...item.color); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text(item.val, cx, y + 10.5, { align: 'center' });
  });

  y += 18;

  // ── SUBJECT PERFORMANCE TABLE ──────────────────────────────────────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
  doc.text('SUBJECT PERFORMANCE OVERVIEW', margin, y); y += 4;

  const subjectRows: any[] = [];
  if (mathScore    != null) subjectRows.push(['Mathematics',          `${mathScore.toFixed(0)}%`,    getSubjectComment('math',    mathScore,    pronoun)]);
  if (elaScore     != null) subjectRows.push(['English Language Arts', `${elaScore.toFixed(0)}%`,   getSubjectComment('ela',     elaScore,     pronoun)]);
  if (scienceScore != null) subjectRows.push(['Science',               `${scienceScore.toFixed(0)}%`, getSubjectComment('science', scienceScore, pronoun)]);

  autoTable(doc, {
    startY: y,
    head: [['Subject', 'Score', 'Comment']],
    body: subjectRows,
    theme: 'plain',
    headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold', cellPadding: 2.5 },
    bodyStyles: { fontSize: 7, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42 },
      1: { halign: 'center', cellWidth: 16 },
      2: { cellWidth: cW - 58 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const val = parseFloat(data.cell.raw as string);
        if (!isNaN(val)) {
          if (val >= 80) data.cell.styles.textColor = [22, 101, 52];
          else if (val >= 50) data.cell.styles.textColor = [146, 64, 14];
          else data.cell.styles.textColor = [153, 27, 27];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 5;

  // ── LEARNING CATEGORY ─────────────────────────────────────────────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
  doc.text('LEARNING CATEGORY', margin, y); y += 3;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, cW, 13, 2, 2, 'F');
  doc.setDrawColor(...category.pdfTextColor);
  doc.roundedRect(margin, y, cW, 13, 2, 2, 'S');

  // Category badge
  doc.setFillColor(...category.pdfTextColor);
  doc.roundedRect(margin + 3, y + 2.5, 28, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text(category.name, margin + 17, y + 7.5, { align: 'center' });

  // Range
  doc.setTextColor(107, 114, 128); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
  doc.text(category.range, margin + 34, y + 5);

  // Short description snippet
  doc.setTextColor(31, 41, 55); doc.setFontSize(6.5);
  const shortDesc = doc.splitTextToSize(category.description.substring(0, 120) + '…', cW - 52);
  doc.text(shortDesc.slice(0, 2), margin + 34, y + 9);

  y += 17;

  // ── PROGRAMME RECOMMENDATION ──────────────────────────────────────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
  doc.text('PROGRAMME RECOMMENDATION', margin, y); y += 3;

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cW, isCustom ? 28 : 22, 2, 2, 'F');
  doc.setDrawColor(22, 101, 52);
  doc.roundedRect(margin, y, cW, isCustom ? 28 : 22, 2, 2, 'S');

  // Package badge
  doc.setFillColor(22, 101, 52);
  doc.roundedRect(margin + 3, y + 3, 30, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text(packageLabel, margin + 18, y + 8, { align: 'center' });

  // Package details
  doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text(packageDesc, margin + 36, y + 8);

  // Subjects list
  doc.setTextColor(31, 41, 55); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text('Subjects included:', margin + 4, y + 15);

  if (isCustom && customSubjects.length > 0) {
    // Custom: show each subject with its hours
    customSubjects.forEach((s, i) => {
      const col = i % 2 === 0 ? margin + 4 : margin + cW / 2;
      const row = y + 19 + Math.floor(i / 2) * 4;
      doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 101, 52);
      doc.text(`• ${s.name}`, col, row);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128);
      doc.text(`(${s.hours}hr/wk)`, col + doc.getTextWidth(`• ${s.name}`) + 2, row);
    });
  } else {
    // Standard package
    const subjectText = packageSubjects.map(s => `• ${s}`).join('   ');
    doc.setFont('helvetica', 'normal'); doc.setTextColor(31, 41, 55);
    const subLines = doc.splitTextToSize(subjectText, cW - 8);
    doc.text(subLines.slice(0, 2), margin + 4, y + 19);
  }

  y += (isCustom ? 28 : 22) + 5;

  // ── SESSION SCHEDULE ──────────────────────────────────────────────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
  doc.text('RECOMMENDED SESSION SCHEDULE', margin, y); y += 3;

  const sessions = buildSessionSchedule(packageSubjects, packageHours, isCustom, customSubjects);

  autoTable(doc, {
    startY: y,
    head: [['Subject', 'Sessions/Week', 'Duration', "Focus Area"]],
    body: sessions,
    theme: 'plain',
    headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold', cellPadding: 2 },
    bodyStyles: { fontSize: 7, cellPadding: 2 },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 44 },
      1: { halign: 'center', cellWidth: 24 },
      2: { halign: 'center', cellWidth: 22 },
      3: { cellWidth: cW - 90 },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 5;

  

  //Instructor sign-off
  if (instructorName) {
    doc.setTextColor(31, 41, 55); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
     doc.text('Please do not hesitate to reach out if you have any questions or concerns.', margin, y);
     y+=5
    doc.text('Best regards,', margin, y); y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(instructorName, margin + 36, y);
    doc.line(margin + 36, y + 0.5, margin + 36 + doc.getTextWidth(instructorName), y + 0.5);
    doc.text('Lead Instructor, SmartMathz', margin, y);

  }


y += 9;


// ── SIGN-OFF ──────────────────────────────────────────────────────────────
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(margin, y, cW, 14, 2, 2, 'F');
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(margin, y, cW, 14, 2, 2, 'S');
  doc.setTextColor(92, 76, 3); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  const signOff = `This recommendation has been prepared by the SmartMathz academic team based on ${pronoun.pos} assessment results. ${pronoun.sub} is encouraged to attend all scheduled sessions consistently for optimal improvement.`;
  const signLines = doc.splitTextToSize(signOff, cW - 8);
  doc.text(signLines.slice(0, 3), margin + 4, y + 5);

  
  // ── FOOTER ────────────────────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, pageH - 10, pageW, 10, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text('SmartMathz  |  www.smartmathz.com  |  Confidential Student Report', pageW / 2, pageH - 4, { align: 'center' });

  doc.save(`SmartMathz_Recommendation_${studentName.replace(/\s+/g, '_')}.pdf`);
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function getSubjectComment(
  subject: 'math' | 'ela' | 'science',
  score: number,
  pronoun: { sub: string; obj: string; pos: string }
): string {
  const band = score >= 91 ? 'excellent' : score >= 80 ? 'strong' : score >= 50 ? 'developing' : 'foundational';

  const comments: Record<string, Record<string, string>> = {
    math: {
      excellent:    `${pronoun.sub} demonstrates outstanding mathematical ability and strong problem-solving skills.`,
      strong:       `${pronoun.sub} has a solid grasp of mathematical concepts with good consistency.`,
      developing:   `${pronoun.sub} shows progress in mathematics; targeted practice will help consolidate skills.`,
      foundational: `${pronoun.sub} requires foundational support in mathematics to build core numerical skills.`,
    },
    ela: {
      excellent:    `${pronoun.sub} excels in reading comprehension and language arts with exceptional fluency.`,
      strong:       `${pronoun.sub} performs well in ELA; reading and writing skills are developing strongly.`,
      developing:   `${pronoun.sub} shows fair comprehension; continued reading practice will boost performance.`,
      foundational: `${pronoun.sub} needs targeted ELA support to strengthen reading and writing foundations.`,
    },
    science: {
      excellent:    `${pronoun.sub} demonstrates exceptional understanding of scientific concepts and applications.`,
      strong:       `${pronoun.sub} has a strong grasp of core science topics with good analytical thinking.`,
      developing:   `${pronoun.sub} is developing science skills; concept review will aid further progress.`,
      foundational: `${pronoun.sub} needs focused science support to build conceptual understanding.`,
    },
  };

  return comments[subject][band];
}

function buildSessionSchedule(
  subjects: string[],
  totalHours: number,
  isCustom: boolean,
  customSubjects: CustomPackageSubject[]
): string[][] {
  const focusMap: Record<string, string> = {
    'Mathematics':          'Problem solving, number sense, algebra fundamentals',
    'English Language Arts':'Reading comprehension, grammar, vocabulary, writing',
    'Science':              'Core concepts, experiments, application questions',
    'Science/Coding':       'Scientific method, coding fundamentals, logic',
    'Coding':               'Computational thinking, programming basics',
    'Virtual Library':      'Self-paced reading, research, supplementary resources',
  };


  const STANDARD_SUBJECT_CONFIG: Record<string, { sessions: string; duration: string }> = {
  'Mathematics': { sessions: '2x/week', duration: '2hr' },
  'English Language Arts': { sessions: '1x/week', duration: '1hr' },
  'Science/Coding': { sessions: '1x/week', duration: '1hr' },
  'Science': { sessions: '1x/week', duration: '1hr' },
  'Coding': { sessions: '1x/week', duration: '1hr' },
  'Virtual Library': { sessions: '1x/week', duration: '2hr' },
};

  if (isCustom) {
    return customSubjects.map(s => [
      s.name,
      '1x/week',
      `${s.hours}hr`,
      focusMap[s.name] ?? 'Core concepts and applied practice',
    ]);
  }

  return subjects.map(s => {
  const config = STANDARD_SUBJECT_CONFIG[s];

  return [
    s,
    config?.sessions ?? '1x/week',
    config?.duration ?? '1hr',
    focusMap[s] ?? 'Core concepts and applied practice',
  ];
});
}