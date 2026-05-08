



// // app/utils/generateRecommendation.ts
// // Recommendation PDF — single A4 page, tight spacing, pricing + closing note

// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { getLearningCategory } from './reviewUtils';
// import { type ComputedPrice } from './pricingData';

// export interface CustomPackageSubject { name: string; hours: number; }

// export interface PackageOption {
//   id: 'I' | 'II' | 'III' | 'custom';
//   label: string;
//   subjects: string[];
//   hoursPerWeek: number | null;
//   description: string;
// }

// export const PACKAGES: PackageOption[] = [
//   {
//     id: 'I',
//     label: 'Package I',
//     subjects: ['Mathematics'],
//     hoursPerWeek: 2,
//     description: 'Math Tutoring Only — 2hrs/week · 1hr per session · 8hrs/month',
//   },
//   {
//     id: 'II',
//     label: 'Package II',
//     subjects: ['Mathematics', '1 Additional Programme', 'Virtual Library'],
//     hoursPerWeek: 4,
//     description: 'Math Tutoring + 1 Additional Programme + Virtual Library — 4hrs/week · 16hrs/month',
//   },
//   {
//     id: 'III',
//     label: 'Package III',
//     subjects: ['Mathematics', '2 Additional Programmes', 'Virtual Library'],
//     hoursPerWeek: 5,
//     description: 'Math Tutoring + 2 Additional Programmes + Virtual Library — 5hrs/week · 20hrs/month',
//   },
//   {
//     id: 'custom',
//     label: 'Custom Package',
//     subjects: [],
//     hoursPerWeek: null,
//     description: 'Customised programme — subjects and hours set by admin',
//   },
// ];

// export const CUSTOM_PACKAGE_SUBJECTS = [
//   { name: 'Mathematics',           defaultHours: 1 },
//   { name: 'English Language Arts', defaultHours: 1 },
//   { name: 'Science',               defaultHours: 1 },
//   { name: 'Coding',                defaultHours: 1 },
//   { name: 'Virtual Library',       defaultHours: 0.5 },
//   { name: 'Algebra',               defaultHours: 1 },
//   { name: 'Geometry',              defaultHours: 1 },
// ];

// export const getSuggestedPackage = (scores: {
//   math: number | null;
//   ela: number | null;
//   science: number | null;
// }): PackageOption => {
//   const below70 = [scores.math, scores.ela, scores.science]
//     .filter(s => s !== null && s < 70).length;
//   if (below70 === 0 && (scores.math ?? 0) >= 80) return PACKAGES[0];
//   if (below70 <= 1) return PACKAGES[1];
//   return PACKAGES[2];
// };

// const getPronoun = (gender?: string) => {
//   if (gender?.toLowerCase() === 'male')   return { sub: 'He',   obj: 'him',  pos: 'his' };
//   if (gender?.toLowerCase() === 'female') return { sub: 'She',  obj: 'her',  pos: 'her' };
//   return                                         { sub: 'They', obj: 'them', pos: 'their' };
// };

// interface RecommendationParams {
//   studentName:     string;
//   studentEmail?:   string;
//   grade:           string;
//   gender?:         string;
//   mathScore:       number | null;
//   elaScore:        number | null;
//   scienceScore:    number | null;
//   overallScore:    number;
//   selectedPackage: PackageOption;
//   customSubjects?: CustomPackageSubject[];
//   instructorName?: string;
//   testDate?:       string;
//   computedPrice?:  ComputedPrice;
// }

// export const generateRecommendationPDF = (params: RecommendationParams) => {
//   const {
//     studentName, studentEmail, grade, gender,
//     mathScore, elaScore, scienceScore, overallScore,
//     selectedPackage, customSubjects = [], instructorName, testDate,
//     computedPrice,
//   } = params;

//   const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//   const pageW = doc.internal.pageSize.getWidth();
//   const pageH = doc.internal.pageSize.getHeight();
//   const M     = 13;          // margin
//   const cW    = pageW - M * 2;

//   const category = getLearningCategory(overallScore);
//   const pronoun  = getPronoun(gender);
//   const dateStr  = testDate ?? new Date().toLocaleDateString('en-US', {
//     year: 'numeric', month: 'long', day: 'numeric',
//   });

//   const isCustom        = selectedPackage.id === 'custom';
//   const packageSubjects = isCustom
//     ? customSubjects.map(s => s.name)
//     : selectedPackage.subjects;
//   const packageHours = isCustom
//     ? customSubjects.reduce((s, c) => s + c.hours, 0)
//     : (selectedPackage.hoursPerWeek ?? 0);
//   const packageLabel = isCustom ? 'Custom Package' : selectedPackage.label;
//   const packageDesc  = isCustom
//     ? `Customised — ${packageSubjects.join(', ')} — ${packageHours}hrs/week`
//     : selectedPackage.description;

//   // helper: section heading
//   const sectionHead = (label: string, yPos: number) => {
//     doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
//     doc.text(label, M, yPos);
//   };

//   // ── HEADER ────────────────────────────────────────────────────────────────
//   doc.setFillColor(22, 101, 52);
//   doc.rect(0, 0, pageW, 23, 'F');

//   try { doc.addImage('/logo.png', 'PNG', M, 3, 17, 17); } catch {}

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(11); doc.setFont('helvetica', 'bold');
//   doc.text('SmartMathz', M + 21, 10);
//   doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
//   doc.text('Personalised Programme Recommendation', M + 21, 15.5);
//   doc.setFontSize(6.5);
//   doc.text(`Date: ${dateStr}`, pageW - M, 10, { align: 'right' });

//   // ── STUDENT INFO ──────────────────────────────────────────────────────────
//   let y = 27;

//   doc.setFillColor(240, 253, 244);
//   doc.roundedRect(M, y, cW, 13, 1.5, 1.5, 'F');

//   const c1 = M + 3, c2 = pageW / 2;

//   doc.setTextColor(22, 101, 52); doc.setFontSize(6); doc.setFont('helvetica', 'bold');
//   doc.text('STUDENT INFORMATION', c1, y + 4);

//   doc.setTextColor(30, 30, 30); doc.setFontSize(7.5);
//   doc.setFont('helvetica', 'bold');  doc.text('Name:',   c1,       y + 9);
//   doc.setFont('helvetica', 'normal'); doc.text(studentName,         c1 + 13,   y + 9);
//   doc.setFont('helvetica', 'bold');  doc.text('Grade:',  c2,       y + 9);
//   doc.setFont('helvetica', 'normal'); doc.text(grade?.toUpperCase() ?? 'N/A', c2 + 15, y + 9);

//   if (studentEmail) {
//     doc.setFont('helvetica', 'bold');  doc.text('Email:',  c1,  y + 12.5);
//     doc.setFont('helvetica', 'normal'); doc.text(studentEmail, c1 + 13, y + 12.5);
//   }

//   y += 16;

//   // ── SCORE STRIP ───────────────────────────────────────────────────────────
//   doc.setFillColor(249, 250, 251);
//   doc.roundedRect(M, y, cW, 10, 1.5, 1.5, 'F');
//   doc.setDrawColor(229, 231, 235);
//   doc.roundedRect(M, y, cW, 10, 1.5, 1.5, 'S');

//   const scoreItems = [
//     { label: 'OVERALL', val: `${overallScore.toFixed(0)}%`, color: category.pdfTextColor },
//     { label: 'MATH',    val: mathScore    != null ? `${mathScore.toFixed(0)}%`    : '—', color: [31,41,55] as [number,number,number] },
//     { label: 'ELA',     val: elaScore     != null ? `${elaScore.toFixed(0)}%`     : '—', color: [31,41,55] as [number,number,number] },
//     { label: 'SCIENCE', val: scienceScore != null ? `${scienceScore.toFixed(0)}%` : '—', color: [31,41,55] as [number,number,number] },
//   ];
//   const sw = cW / scoreItems.length;
//   scoreItems.forEach((item, i) => {
//     const cx = M + sw * i + sw / 2;
//     doc.setTextColor(107, 114, 128); doc.setFontSize(5); doc.setFont('helvetica', 'normal');
//     doc.text(item.label, cx, y + 3.5, { align: 'center' });
//     doc.setTextColor(...item.color); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
//     doc.text(item.val, cx, y + 8, { align: 'center' });
//   });

//   y += 13;

//   // ── SUBJECT PERFORMANCE ───────────────────────────────────────────────────
//   sectionHead('SUBJECT PERFORMANCE', y); y += 2.5;

//   const subjectRows: any[] = [];
//   if (mathScore    != null) subjectRows.push(['Mathematics',           `${mathScore.toFixed(0)}%`,     getSubjectComment('math',    mathScore,    pronoun)]);
//   if (elaScore     != null) subjectRows.push(['English Language Arts', `${elaScore.toFixed(0)}%`,     getSubjectComment('ela',     elaScore,     pronoun)]);
//   if (scienceScore != null) subjectRows.push(['Science',               `${scienceScore.toFixed(0)}%`, getSubjectComment('science', scienceScore, pronoun)]);

//   autoTable(doc, {
//     startY: y,
//     head: [['Subject', 'Score', 'Comment']],
//     body: subjectRows,
//     theme: 'plain',
//     headStyles: {
//       fillColor: [22, 101, 52], textColor: [255,255,255],
//       fontSize: 6, fontStyle: 'bold', cellPadding: 1.8,
//     },
//     bodyStyles: { fontSize: 6.5, cellPadding: 1.8 },
//     alternateRowStyles: { fillColor: [240, 253, 244] },
//     columnStyles: {
//       0: { fontStyle: 'bold', cellWidth: 37 },
//       1: { halign: 'center', cellWidth: 12 },
//       2: { cellWidth: cW - 49 },
//     },
//     didParseCell: (d) => {
//       if (d.section === 'body' && d.column.index === 1) {
//         const v = parseFloat(d.cell.raw as string);
//         if (!isNaN(v)) {
//           d.cell.styles.textColor = v >= 80 ? [22,101,52] : v >= 50 ? [146,64,14] : [153,27,27];
//           d.cell.styles.fontStyle = 'bold';
//         }
//       }
//     },
//   });

//   y = (doc as any).lastAutoTable.finalY + 3;

//   // ── LEARNING CATEGORY ─────────────────────────────────────────────────────
//   sectionHead('LEARNING CATEGORY', y); y += 2.5;

//   doc.setFillColor(248, 250, 252);
//   doc.roundedRect(M, y, cW, 10, 1.5, 1.5, 'F');
//   doc.setDrawColor(...category.pdfTextColor);
//   doc.roundedRect(M, y, cW, 10, 1.5, 1.5, 'S');

//   doc.setFillColor(...category.pdfTextColor);
//   doc.roundedRect(M + 2.5, y + 1.8, 25, 6.5, 1, 1, 'F');
//   doc.setTextColor(255, 255, 255); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
//   doc.text(category.name, M + 15, y + 5.8, { align: 'center' });

//   doc.setTextColor(107, 114, 128); doc.setFontSize(5.5); doc.setFont('helvetica', 'bold');
//   doc.text(category.range, M + 30, y + 4);
//   doc.setTextColor(31, 41, 55); doc.setFont('helvetica', 'normal'); doc.setFontSize(6);
//   const shortDesc = doc.splitTextToSize(category.description.substring(0, 170), cW - 46);
//   doc.text(shortDesc.slice(0, 2), M + 30, y + 7.5);

//   y += 13;

//   // ── PROGRAMME RECOMMENDATION ──────────────────────────────────────────────
//   sectionHead('PROGRAMME RECOMMENDATION', y); y += 2.5;

//   const pkgH = isCustom && customSubjects.length > 2 ? 22 : 16;
//   doc.setFillColor(240, 253, 244);
//   doc.roundedRect(M, y, cW, pkgH, 1.5, 1.5, 'F');
//   doc.setDrawColor(22, 101, 52);
//   doc.roundedRect(M, y, cW, pkgH, 1.5, 1.5, 'S');

//   doc.setFillColor(22, 101, 52);
//   doc.roundedRect(M + 2.5, y + 2, 26, 6.5, 1, 1, 'F');
//   doc.setTextColor(255, 255, 255); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
//   doc.text(packageLabel, M + 15.5, y + 6, { align: 'center' });

//   doc.setTextColor(22, 101, 52); doc.setFontSize(6); doc.setFont('helvetica', 'bold');
//   const descLines = doc.splitTextToSize(packageDesc, cW - 34);
//   doc.text(descLines.slice(0, 2), M + 31, y + 5.5);

//   doc.setTextColor(31, 41, 55); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
//   doc.text('Subjects:', M + 3, y + 11.5);

//   if (isCustom && customSubjects.length > 0) {
//     customSubjects.forEach((s, i) => {
//       const col = i % 2 === 0 ? M + 3 : M + cW / 2;
//       const row = y + 15 + Math.floor(i / 2) * 3.5;
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 101, 52);
//       doc.text(`• ${s.name}`, col, row);
//       doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128);
//       doc.text(`(${s.hours}hr/wk)`, col + doc.getTextWidth(`• ${s.name}`) + 1.5, row);
//     });
//   } else {
//     const subText = packageSubjects.map(s => `• ${s}`).join('    ');
//     const subLines = doc.splitTextToSize(subText, cW - 8);
//     doc.setTextColor(31, 41, 55);
//     doc.text(subLines.slice(0, 1), M + 20, y + 11.5);
//   }

//   y += pkgH + 3;

//   // ── INVESTMENT SUMMARY ────────────────────────────────────────────────────
//   if (computedPrice) {
//     sectionHead('INVESTMENT SUMMARY', y); y += 2.5;

//     autoTable(doc, {
//       startY: y,
//       head: [['', 'Standard Rate', 'SmartMathz Offer', '']],
//       body: [
//         ['Number of Sessions', `${computedPrice.sessions}`,                             `${computedPrice.sessions}`,                ''],
//         ['Hourly Rate',        `$${computedPrice.standardHourlyRate.toFixed(2)}`,       `$${computedPrice.smHourlyRate.toFixed(2)}`, '-$20'],
//         ['Monthly Fee',        `$${computedPrice.standardMonthlyFee}`,                  `$${computedPrice.smMonthlyFee}`,           ''],
//         ['Bi-Weekly',          `$${(computedPrice.standardMonthlyFee / 2).toFixed(0)}`, `$${computedPrice.smBiweekly.toFixed(1)}`,  ''],
//       ],
//       theme: 'plain',
//       headStyles: {
//         fillColor: [26, 46, 5], textColor: [255,255,255],
//         fontSize: 6.5, fontStyle: 'bold', cellPadding: 1.8,
//       },
//       bodyStyles: { fontSize: 7, cellPadding: 1.8 },
//       alternateRowStyles: { fillColor: [250, 253, 245] },
//       columnStyles: {
//         0: { fontStyle: 'bold', cellWidth: 36 },
//         1: { halign: 'center', cellWidth: 32 },
//         2: { halign: 'center', cellWidth: 32, textColor: [22,101,52], fontStyle: 'bold' },
//         3: { halign: 'center', cellWidth: 14, textColor: [153,27,27], fontStyle: 'bold' },
//       },
//       didParseCell: (d) => {
//         if (d.section === 'head' && d.column.index === 2) d.cell.styles.fillColor = [22, 101, 52];
//         if (d.section === 'body' && d.column.index === 3 && d.cell.raw === '-$20') {
//           d.cell.styles.textColor = [153, 27, 27];
//           d.cell.styles.fontStyle = 'bold';
//         }
//       },
//     });

//     y = (doc as any).lastAutoTable.finalY + 2;

//     // Savings strip
//     doc.setFillColor(240, 253, 244);
//     doc.roundedRect(M, y, cW, 10, 1.5, 1.5, 'F');
//     doc.setDrawColor(22, 101, 52);
//     doc.roundedRect(M, y, cW, 10, 1.5, 1.5, 'S');

//     const half = cW / 2;

//     // Left: % Savings
//     doc.setTextColor(22, 101, 52); doc.setFontSize(6); doc.setFont('helvetica', 'bold');
//     doc.text('% Savings', M + 3, y + 4);
//     doc.setFontSize(7.5); doc.setTextColor(31, 41, 55);
//     doc.text(`${computedPrice.savingsPercent}%`, M + 3, y + 8.5);
//     doc.setTextColor(107, 114, 128); doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
//     doc.text('Per Month', M + 3 + doc.getTextWidth(`${computedPrice.savingsPercent}%`) + 1.5, y + 8.5);

//     // Divider
//     doc.setDrawColor(187, 247, 208);
//     doc.line(M + half, y + 2, M + half, y + 8.5);

//     // Right: SmartMathz Investment
//     doc.setTextColor(22, 101, 52); doc.setFontSize(6); doc.setFont('helvetica', 'bold');
//     doc.text('SmartMathz Investment', M + half + 3, y + 4);
//     doc.setFontSize(7.5); doc.setTextColor(31, 41, 55);
//     doc.text(`$${computedPrice.smInvestment}`, M + half + 3, y + 8.5);
//     doc.setTextColor(107, 114, 128); doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
//     doc.text('Per Month', M + half + 3 + doc.getTextWidth(`$${computedPrice.smInvestment}`) + 1.5, y + 8.5);

//     y += 13;
//   }

//   // ── CLOSING NOTE ──────────────────────────────────────────────────────────
//   doc.setFillColor(254, 252, 232);
//   doc.roundedRect(M, y, cW, 10, 1.5, 1.5, 'F');
//   doc.setDrawColor(234, 179, 8);
//   doc.roundedRect(M, y, cW, 10, 1.5, 1.5, 'S');
//   doc.setTextColor(92, 76, 3); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
//   const noteText = `This recommendation was prepared by the SmartMathz academic team based on ${pronoun.pos} assessment results. ${pronoun.sub} is encouraged to attend all scheduled sessions consistently for optimal improvement.`;
//   doc.text(doc.splitTextToSize(noteText, cW - 6).slice(0, 3), M + 3, y + 4);

//   y += 13;

//   // ── SIGN-OFF ──────────────────────────────────────────────────────────────
//   doc.setTextColor(50, 50, 50); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
//   doc.text('If you have any questions do not hesitate to reach out.', M, y);

//   y += 4;
//   doc.text('Best regards,', M, y);

//   y += 4.5;
//   const sigName = instructorName?.trim() || 'SmartMathz Team';
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(17, 24, 39);
//   doc.text(sigName, M, y);

//   y += 4;
//   doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(107, 114, 128);
//   doc.text('Lead Instructor, SmartMathz', M, y);

//   // ── FOOTER ────────────────────────────────────────────────────────────────
//   doc.setFillColor(22, 101, 52);
//   doc.rect(0, pageH - 7, pageW, 7, 'F');
//   doc.setTextColor(255, 255, 255); doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
//   doc.text(
//     'SmartMathz  |  www.smartmathz.com  |  Confidential Student Report',
//     pageW / 2, pageH - 2.5, { align: 'center' }
//   );

//   doc.save(`SmartMathz_Recommendation_${studentName.replace(/\s+/g, '_')}.pdf`);
// };

// // ── Subject comment helper ────────────────────────────────────────────────────
// function getSubjectComment(
//   subject: 'math' | 'ela' | 'science',
//   score: number,
//   pronoun: { sub: string; obj: string; pos: string }
// ): string {
//   const band = score >= 91 ? 'excellent' : score >= 80 ? 'strong' : score >= 50 ? 'developing' : 'foundational';
//   const comments: Record<string, Record<string, string>> = {
//     math: {
//       excellent:    `${pronoun.sub} demonstrates outstanding mathematical ability.`,
//       strong:       `${pronoun.sub} has a solid grasp of mathematical concepts.`,
//       developing:   `${pronoun.sub} shows progress; targeted practice will consolidate skills.`,
//       foundational: `${pronoun.sub} requires foundational support to build core numerical skills.`,
//     },
//     ela: {
//       excellent:    `${pronoun.sub} excels in reading comprehension and language arts.`,
//       strong:       `${pronoun.sub} performs well; reading and writing skills are developing strongly.`,
//       developing:   `${pronoun.sub} shows fair comprehension; continued practice will boost performance.`,
//       foundational: `${pronoun.sub} needs targeted ELA support to strengthen reading and writing.`,
//     },
//     science: {
//       excellent:    `${pronoun.sub} demonstrates exceptional understanding of scientific concepts.`,
//       strong:       `${pronoun.sub} has a strong grasp of core science topics.`,
//       developing:   `${pronoun.sub} is developing science skills; concept review will aid progress.`,
//       foundational: `${pronoun.sub} needs focused science support to build conceptual understanding.`,
//     },
//   };
//   return comments[subject][band];
// }














// app/utils/generateRecommendation.ts
// Recommendation PDF — full A4 page, evenly spaced, legible

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getLearningCategory } from './reviewUtils';
import { type ComputedPrice } from './pricingData';

export interface CustomPackageSubject { name: string; hours: number; }

export interface PackageOption {
  id: 'I' | 'II' | 'III' | 'custom';
  label: string;
  subjects: string[];
  hoursPerWeek: number | null;
  description: string;
}

export const PACKAGES: PackageOption[] = [
  {
    id: 'I',
    label: 'Package I',
    subjects: ['Mathematics'],
    hoursPerWeek: 2,
    description: 'Math Tutoring Only — 2hrs/week · 1hr per session · 8hrs/month',
  },
  {
    id: 'II',
    label: 'Package II',
    subjects: ['Mathematics', '1 Additional Programme', 'Virtual Library'],
    hoursPerWeek: 4,
    description: 'Math Tutoring + 1 Additional Programme + Virtual Library — 4hrs/week · 16hrs/month',
  },
  {
    id: 'III',
    label: 'Package III',
    subjects: ['Mathematics', '2 Additional Programmes', 'Virtual Library'],
    hoursPerWeek: 5,
    description: 'Math Tutoring + 2 Additional Programmes + Virtual Library — 5hrs/week · 20hrs/month',
  },
  {
    id: 'custom',
    label: 'Custom Package',
    subjects: [],
    hoursPerWeek: null,
    description: 'Customised programme — subjects and hours set by admin',
  },
];

export const CUSTOM_PACKAGE_SUBJECTS = [
  { name: 'Mathematics',           defaultHours: 1 },
  { name: 'English Language Arts', defaultHours: 1 },
  { name: 'Science',               defaultHours: 1 },
  { name: 'Coding',                defaultHours: 1 },
  { name: 'Virtual Library',       defaultHours: 0.5 },
  { name: 'Algebra',               defaultHours: 1 },
  { name: 'Geometry',              defaultHours: 1 },
];

export const getSuggestedPackage = (scores: {
  math: number | null;
  ela: number | null;
  science: number | null;
}): PackageOption => {
  const below70 = [scores.math, scores.ela, scores.science]
    .filter(s => s !== null && s < 70).length;
  if (below70 === 0 && (scores.math ?? 0) >= 80) return PACKAGES[0];
  if (below70 <= 1) return PACKAGES[1];
  return PACKAGES[2];
};

const getPronoun = (gender?: string) => {
  if (gender?.toLowerCase() === 'male')   return { sub: 'He',   obj: 'him',  pos: 'his' };
  if (gender?.toLowerCase() === 'female') return { sub: 'She',  obj: 'her',  pos: 'her' };
  return                                         { sub: 'They', obj: 'them', pos: 'their' };
};

interface RecommendationParams {
  studentName:     string;
  studentEmail?:   string;
  grade:           string;
  gender?:         string;
  mathScore:       number | null;
  elaScore:        number | null;
  scienceScore:    number | null;
  overallScore:    number;
  selectedPackage: PackageOption;
  customSubjects?: CustomPackageSubject[];
  instructorName?: string;
  testDate?:       string;
  computedPrice?:  ComputedPrice;
}

export const generateRecommendationPDF = (params: RecommendationParams) => {
  const {
    studentName, studentEmail, grade, gender,
    mathScore, elaScore, scienceScore, overallScore,
    selectedPackage, customSubjects = [], instructorName, testDate,
    computedPrice,
  } = params;

  const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M     = 14;
  const cW    = pageW - M * 2;

  const category = getLearningCategory(overallScore);
  const pronoun  = getPronoun(gender);
  const dateStr  = testDate ?? new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const isCustom        = selectedPackage.id === 'custom';
  const packageSubjects = isCustom ? customSubjects.map(s => s.name) : selectedPackage.subjects;
  const packageHours    = isCustom
    ? customSubjects.reduce((s, c) => s + c.hours, 0)
    : (selectedPackage.hoursPerWeek ?? 0);
  const packageLabel = isCustom ? 'Custom Package' : selectedPackage.label;
  const packageDesc  = isCustom
    ? `Customised — ${packageSubjects.join(', ')} — ${packageHours}hrs/week`
    : selectedPackage.description;

  // ── HEADER ────────────────────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 32, 'F');

  try { doc.addImage('/logo.png', 'PNG', M, 5, 22, 22); } catch {}

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13); doc.setFont('helvetica', 'bold');
  doc.text('SmartMathz', M + 27, 14);
  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  doc.text('Personalised Programme Recommendation', M + 27, 21);
  doc.setFontSize(8);
  doc.text(`Date: ${dateStr}`, pageW - M, 14, { align: 'right' });

  // ── STUDENT INFO ──────────────────────────────────────────────────────────
  let y = 38;

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(M, y, cW, 20, 2, 2, 'F');

  const c1 = M + 4, c2 = pageW / 2 + 2;

  doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text('STUDENT INFORMATION', c1, y + 6);

  doc.setTextColor(30, 30, 30); doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');  doc.text('Name:',  c1,  y + 13);
  doc.setFont('helvetica', 'normal'); doc.text(studentName,  c1 + 17, y + 13);
  doc.setFont('helvetica', 'bold');  doc.text('Grade:', c2,  y + 13);
  doc.setFont('helvetica', 'normal'); doc.text(grade?.toUpperCase() ?? 'N/A', c2 + 18, y + 13);

  if (studentEmail) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');  doc.text('Email:', c1, y + 18.5);
    doc.setFont('helvetica', 'normal'); doc.text(studentEmail, c1 + 17, y + 18.5);
  }

  y += 26;

  // ── SCORE STRIP ───────────────────────────────────────────────────────────
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(M, y, cW, 16, 2, 2, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(M, y, cW, 16, 2, 2, 'S');

  const scoreItems = [
    { label: 'OVERALL', val: `${overallScore.toFixed(0)}%`, color: category.pdfTextColor },
    { label: 'MATH',    val: mathScore    != null ? `${mathScore.toFixed(0)}%`    : '—', color: [31,41,55] as [number,number,number] },
    { label: 'ELA',     val: elaScore     != null ? `${elaScore.toFixed(0)}%`     : '—', color: [31,41,55] as [number,number,number] },
    { label: 'SCIENCE', val: scienceScore != null ? `${scienceScore.toFixed(0)}%` : '—', color: [31,41,55] as [number,number,number] },
  ];
  const sw = cW / scoreItems.length;
  scoreItems.forEach((item, i) => {
    const cx = M + sw * i + sw / 2;
    doc.setTextColor(107, 114, 128); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
    doc.text(item.label, cx, y + 5, { align: 'center' });
    doc.setTextColor(...item.color); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(item.val, cx, y + 12.5, { align: 'center' });
  });

  y += 22;

  // ── SUBJECT PERFORMANCE ───────────────────────────────────────────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
  doc.text('SUBJECT PERFORMANCE', M, y);
  y += 3;

  const subjectRows: any[] = [];
  if (mathScore    != null) subjectRows.push(['Mathematics',           `${mathScore.toFixed(0)}%`,     getSubjectComment('math',    mathScore,    pronoun)]);
  if (elaScore     != null) subjectRows.push(['English Language Arts', `${elaScore.toFixed(0)}%`,     getSubjectComment('ela',     elaScore,     pronoun)]);
  if (scienceScore != null) subjectRows.push(['Science',               `${scienceScore.toFixed(0)}%`, getSubjectComment('science', scienceScore, pronoun)]);

  autoTable(doc, {
    startY: y,
    head: [['Subject', 'Score', 'Comment']],
    body: subjectRows,
    theme: 'plain',
    headStyles: {
      fillColor: [22, 101, 52], textColor: [255,255,255],
      fontSize: 8, fontStyle: 'bold', cellPadding: 3,
    },
    bodyStyles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 44 },
      1: { halign: 'center', cellWidth: 15 },
      2: { cellWidth: cW - 59 },
    },
    didParseCell: (d) => {
      if (d.section === 'body' && d.column.index === 1) {
        const v = parseFloat(d.cell.raw as string);
        if (!isNaN(v)) {
          d.cell.styles.textColor = v >= 80 ? [22,101,52] : v >= 50 ? [146,64,14] : [153,27,27];
          d.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 6;

 // ── LEARNING CATEGORY — replace the existing block with this ─────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
  doc.text('LEARNING CATEGORY', M, y);
  y += 3;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(M, y, cW, 18, 2, 2, 'F');
  doc.setDrawColor(...category.pdfTextColor);
  doc.roundedRect(M, y, cW, 18, 2, 2, 'S');

  // Badge — vertically centred in the 18mm block
  doc.setFillColor(...category.pdfTextColor);
  doc.roundedRect(M + 3, y + 3, 34, 12, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
  doc.text(category.name, M + 20, y + 10.5, { align: 'center' });

  // Range — same horizontal baseline as the first line of description
  const textX = M + 41;
  const textW  = cW - 47;

  doc.setTextColor(107, 114, 128); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text(category.range, textX, y + 7);

  // Description — one line below range, same left edge
  doc.setTextColor(31, 41, 55); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  const descLines2 = doc.splitTextToSize(category.description, textW);
  doc.text(descLines2.slice(0, 2), textX, y + 13);

  y += 24;

  // ── PROGRAMME RECOMMENDATION ──────────────────────────────────────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
  doc.text('PROGRAMME RECOMMENDATION', M, y);
  y += 3;

  const pkgH = isCustom && customSubjects.length > 2 ? 28 : 22;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(M, y, cW, pkgH, 2, 2, 'F');
  doc.setDrawColor(22, 101, 52);
  doc.roundedRect(M, y, cW, pkgH, 2, 2, 'S');

  // Badge
  doc.setFillColor(22, 101, 52);
  doc.roundedRect(M + 3, y + 3.5, 30, 9, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text(packageLabel, M + 18, y + 9.5, { align: 'center' });

  // Description
  doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  const descLines = doc.splitTextToSize(packageDesc, cW - 40);
  doc.text(descLines.slice(0, 2), M + 37, y + 9);

  // Subjects line
  doc.setTextColor(31, 41, 55); doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  const subText = packageSubjects.map(s => `• ${s}`).join('    ');
  doc.text('Subjects:', M + 4, y + 17.5);
  doc.setFont('helvetica', 'normal');
  if (isCustom && customSubjects.length > 0) {
    customSubjects.forEach((s, i) => {
      const col = i % 2 === 0 ? M + 4 : M + cW / 2;
      const row = y + 21 + Math.floor(i / 2) * 4;
      doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 101, 52);
      doc.text(`• ${s.name}`, col, row);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128);
      doc.text(`(${s.hours}hr/wk)`, col + doc.getTextWidth(`• ${s.name}`) + 2, row);
    });
  } else {
    const subLines = doc.splitTextToSize(subText, cW - 26);
    doc.setTextColor(31, 41, 55);
    doc.text(subLines.slice(0, 1), M + 22, y + 17.5);
  }

  y += pkgH + 6;

  // ── INVESTMENT SUMMARY ────────────────────────────────────────────────────
  if (computedPrice) {
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
    doc.text('INVESTMENT SUMMARY', M, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['', 'Standard Rate', 'SmartMathz Offer', '']],
      body: [
        ['Number of Sessions', `${computedPrice.sessions}`,                             `${computedPrice.sessions}`,                ''],
        ['Hourly Rate',        `$${computedPrice.standardHourlyRate.toFixed(2)}`,       `$${computedPrice.smHourlyRate.toFixed(2)}`, '-$20'],
        ['Monthly Fee',        `$${computedPrice.standardMonthlyFee}`,                  `$${computedPrice.smMonthlyFee}`,           ''],
        ['Bi-Weekly',          `$${(computedPrice.standardMonthlyFee / 2).toFixed(0)}`, `$${computedPrice.smBiweekly.toFixed(1)}`,  ''],
      ],
      theme: 'plain',
      headStyles: {
        fillColor: [26, 46, 5], textColor: [255,255,255],
        fontSize: 8, fontStyle: 'bold', cellPadding: 3,
      },
      bodyStyles: { fontSize: 8.5, cellPadding: 3 },
      alternateRowStyles: { fillColor: [250, 253, 245] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 42 },
        1: { halign: 'center', cellWidth: 36 },
        2: { halign: 'center', cellWidth: 36, textColor: [22,101,52], fontStyle: 'bold' },
        3: { halign: 'center', cellWidth: 14, textColor: [153,27,27], fontStyle: 'bold' },
      },
      didParseCell: (d) => {
        if (d.section === 'head' && d.column.index === 2) d.cell.styles.fillColor = [22, 101, 52];
        if (d.section === 'body' && d.column.index === 3 && d.cell.raw === '-$20') {
          d.cell.styles.textColor = [153, 27, 27];
          d.cell.styles.fontStyle = 'bold';
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 3;

    // Savings strip
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(M, y, cW, 18, 2, 2, 'F');
    doc.setDrawColor(22, 101, 52);
    doc.roundedRect(M, y, cW, 18, 2, 2, 'S');
 
    const half = cW / 2;
 
    // Left: % Savings
    doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text('% Savings', M + 4, y + 5.5);                         // label
    doc.setFontSize(10); doc.setTextColor(31, 41, 55);
    doc.text(`${computedPrice.savingsPercent}%`, M + 4, y + 11); // value — gap increased
    doc.setTextColor(107, 114, 128); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text('Per Month', M + 4 + doc.getTextWidth(`${computedPrice.savingsPercent}%`) + 4, y + 11);
 
    // Divider
    doc.setDrawColor(187, 247, 208);
    doc.line(M + half, y + 3, M + half, y + 15);
 
    // Right: SmartMathz Investment
    doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text('SmartMathz Investment', M + half + 4, y + 5.5);              // label
    doc.setFontSize(10); doc.setTextColor(31, 41, 55);
    doc.text(`$${computedPrice.smInvestment}`, M + half + 4, y + 11);   // value — gap increased
    doc.setTextColor(107, 114, 128); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text('Per Month', M + half + 4 + doc.getTextWidth(`$${computedPrice.smInvestment}`) + 4, y + 11);
 
    y += 24; 
  }

  // ── NOTE BOX ──────────────────────────────────────────────────────────────
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(M, y, cW, 14, 2, 2, 'F');
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(M, y, cW, 14, 2, 2, 'S');
  doc.setTextColor(92, 76, 3); doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  const noteText = `This recommendation was prepared by the SmartMathz academic team based on ${pronoun.pos} assessment results. ${pronoun.sub} is encouraged to attend all scheduled sessions consistently for optimal improvement.`;
  doc.text(doc.splitTextToSize(noteText, cW - 8).slice(0, 3), M + 4, y + 5.5);

  y += 20;

  // ── SIGN-OFF ──────────────────────────────────────────────────────────────
  doc.setTextColor(31, 41, 55); doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
  doc.text('If you have any questions do not hesitate to reach out.', M, y);

  y += 6;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  doc.text('Best regards,', M, y);

  y += 6;
  const sigName = instructorName?.trim() || 'SmartMathz Team';
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(17, 24, 39);
  doc.text(sigName, M, y);

  y += 5.5;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(107, 114, 128);
  doc.text('Lead Instructor, SmartMathz', M, y);

  // ── FOOTER ────────────────────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, pageH - 10, pageW, 10, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text(
    'SmartMathz  |  www.smartmathz.com  |  Confidential Student Report',
    pageW / 2, pageH - 4, { align: 'center' }
  );

  doc.save(`SmartMathz_Recommendation_${studentName.replace(/\s+/g, '_')}.pdf`);
};

// ── Subject comment helper ────────────────────────────────────────────────────
function getSubjectComment(
  subject: 'math' | 'ela' | 'science',
  score: number,
  pronoun: { sub: string; obj: string; pos: string }
): string {
  const band = score >= 91 ? 'excellent' : score >= 80 ? 'strong' : score >= 50 ? 'developing' : 'foundational';
  const comments: Record<string, Record<string, string>> = {
    math: {
      excellent:    `${pronoun.sub} demonstrates outstanding mathematical ability.`,
      strong:       `${pronoun.sub} has a solid grasp of mathematical concepts.`,
      developing:   `${pronoun.sub} shows progress; targeted practice will consolidate skills.`,
      foundational: `${pronoun.sub} requires foundational support to build core numerical skills.`,
    },
    ela: {
      excellent:    `${pronoun.sub} excels in reading comprehension and language arts.`,
      strong:       `${pronoun.sub} performs well; reading and writing skills are developing strongly.`,
      developing:   `${pronoun.sub} shows fair comprehension; continued practice will boost performance.`,
      foundational: `${pronoun.sub} needs targeted ELA support to strengthen reading and writing.`,
    },
    science: {
      excellent:    `${pronoun.sub} demonstrates exceptional understanding of scientific concepts.`,
      strong:       `${pronoun.sub} has a strong grasp of core science topics.`,
      developing:   `${pronoun.sub} is developing science skills; concept review will aid progress.`,
      foundational: `${pronoun.sub} needs focused science support to build conceptual understanding.`,
    },
  };
  return comments[subject][band];
}