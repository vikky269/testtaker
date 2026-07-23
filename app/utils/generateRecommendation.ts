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
    subjects: ['Mathematics', '1 Additional Program', 'Virtual Library'],
    hoursPerWeek: 4,
    description: 'Math Tutoring + 1 Additional Program + Virtual Library — 4hrs/week · 16hrs/month',
  },
  {
    id: 'III',
    label: 'Package III',
    subjects: ['Mathematics', '2 Additional Programs', 'Virtual Library'],
    hoursPerWeek: 5,
    description: 'Math Tutoring + 2 Additional Programs + Virtual Library — 5hrs/week · 20hrs/month',
  },
  {
    id: 'custom',
    label: 'Custom Package',
    subjects: [],
    hoursPerWeek: null,
    description: 'Customized program — subjects and hours set by admin',
  },
];

// Programs the admin can attach to Package II (pick 1) or Package III (pick 2)
export const ADDITIONAL_PROGRAMS = [
  'Coding - Scratch / Snap',
  'Science',
  'English Language Arts',
  'Ms Excel',
  'Graphic Design',
  'Coding -  Html / Css',
];

export const CUSTOM_PACKAGE_SUBJECTS = [
  { name: 'Mathematics',           defaultHours: 1 },
  { name: 'English Language Arts', defaultHours: 1 },
  { name: 'Science',               defaultHours: 1 },
  { name: 'Coding',                defaultHours: 1 },
  { name: 'Virtual Library',       defaultHours: 1 },
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
  additionalPrograms?: string[];
  instructorName?:    string;
  instructorComment?: string;
  testDate?:          string;
  computedPrice?:     ComputedPrice;
  defaultSessions?:   number;
  times?: { math?: string; ela?: string; science?: string; total?: string };
}

export const generateRecommendationPDF = (params: RecommendationParams) => {
  const {
    studentName, studentEmail, grade, gender,
    mathScore, elaScore, scienceScore, overallScore,
    selectedPackage, customSubjects = [], additionalPrograms = [], instructorName, instructorComment,
    testDate, computedPrice, defaultSessions,
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
  //const packageSubjects = isCustom ? customSubjects.map(s => s.name) : selectedPackage.subjects;
  const packageSubjects = isCustom
    ? customSubjects.map(s => s.name)
    : additionalPrograms.length > 0
      ? selectedPackage.subjects.flatMap(s =>
          s.includes('Additional Program') ? additionalPrograms : [s])
      : selectedPackage.subjects;

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
  doc.text('Personalized Programme Recommendation', M + 27, 21);
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

  y += 22;

  // ── SCORE + TIME CARDS — colourful 4-column layout ────────────────────────
  const fmtSec = (s?: string) => s && s !== '—' ? s : '—';
  const t = params.times;

const scoreColor = (score: number | null): [number, number, number] => {
  if (score === null) return [100, 100, 100];
  if (score >= 95) return [22, 101, 52];
  if (score >= 80) return [144, 238, 144];
  if (score >= 61) return [220, 237, 200];
  if (score >= 31) return [255, 235, 0];
  return [255, 105, 180];
};


  const cards = [
  { label: 'OVERALL',     raw: overallScore, score: `${overallScore.toFixed(0)}%`,
    time: fmtSec(t?.total),   timeLabel: 'TOTAL TIME', fill: scoreColor(overallScore) },
  { label: 'MATHEMATICS', raw: mathScore,    score: mathScore    != null ? `${mathScore.toFixed(0)}%`    : '—',
    time: fmtSec(t?.math),    timeLabel: 'MATH TIME',  fill: scoreColor(mathScore) },
  { label: 'ELA',         raw: elaScore,     score: elaScore     != null ? `${elaScore.toFixed(0)}%`     : '—',
    time: fmtSec(t?.ela),     timeLabel: 'ELA TIME',   fill: scoreColor(elaScore) },
  { label: 'SCIENCE',     raw: scienceScore, score: scienceScore != null ? `${scienceScore.toFixed(0)}%` : '—',
    time: fmtSec(t?.science), timeLabel: 'SCI TIME',   fill: scoreColor(scienceScore) },
];

const cardW = (cW - 4.5) / 4;   // 4 cards, 1.5mm gaps between
const cardH = 23;

// White label on dark fills, black on light fills
const isDarkFill = (f: [number, number, number]) =>
  f[0] * 0.299 + f[1] * 0.587 + f[2] * 0.114 < 128;

cards.forEach((card, i) => {
  const cx  = M + i * (cardW + 1.5);
  const mid = cx + cardW / 2;

  // White card with a soft border
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(cx, y, cardW, cardH, 2, 2, 'FD');

  // Colored header strip (rounded top corners, squared bottom edge)
  doc.setFillColor(...card.fill);
  doc.roundedRect(cx, y, cardW, 5.5, 2, 2, 'F');
  doc.rect(cx, y + 3, cardW, 2.5, 'F');

  // Subject label inside the strip
  const dark = isDarkFill(card.fill);
  doc.setTextColor(dark ? 255 : 0, dark ? 255 : 0, dark ? 255 : 0);
  doc.setFontSize(5.5); doc.setFont('helvetica', 'bold');
  doc.text(card.label, mid, y + 3.8, { align: 'center' });

  // Score — large, dark, high contrast on white
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(13); doc.setFont('helvetica', 'bold');
  doc.text(card.score, mid, y + 13, { align: 'center' });

  // Thin progress bar in the score colour
  const barX = cx + 5, barW = cardW - 10, barY = y + 15.2, barH = 1.6;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(barX, barY, barW, barH, 0.8, 0.8, 'F');
  if (card.raw != null) {
    const fillW = Math.max(1.6, barW * Math.min(100, Math.max(0, card.raw)) / 100);
    doc.setFillColor(...card.fill);
    doc.roundedRect(barX, barY, fillW, barH, 0.8, 0.8, 'F');
  }

  // Time footer
  doc.setFontSize(5); doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128);
  doc.text(card.timeLabel, mid, y + 19, { align: 'center' });
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(31, 41, 55);
  doc.text(card.time, mid, y + 21.5, { align: 'center' });
});

y += cardH + 6;
    
  
 // ── LEARNING CATEGORY — box grows to fit the full description ─────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
  doc.text('LEARNING CATEGORY', M, y);
  y += 3;

  // Measure the FULL description at the render font (7.5pt normal)
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  const catDescLines = doc.splitTextToSize(category.description, cW - 52);
  const CAT_LINE_H   = 3.3; // mm per line at 7.5pt
  // Box must fit: range line + description lines, and never be shorter than the badge area
  const catBoxH = Math.max(16, 7.5 + catDescLines.length * CAT_LINE_H + 3);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(M, y, cW, catBoxH, 2, 2, 'F');
  doc.setDrawColor(...category.pdfTextColor);
  doc.roundedRect(M, y, cW, catBoxH, 2, 2, 'S');

  // Badge — vertically centred in the box
  doc.setFillColor(...category.pdfTextColor);
  doc.roundedRect(M + 3, y + catBoxH / 2 - 5, 30, 10, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text(category.name, M + 18, y + catBoxH / 2 + 1.5, { align: 'center' });

  // Range + full description
  doc.setTextColor(107, 114, 128); doc.setFontSize(7); doc.setFont('helvetica', 'bold');
  doc.text(category.range, M + 37, y + 4.5);
  doc.setTextColor(31, 41, 55); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
  doc.text(catDescLines, M + 37, y + 9, { lineHeightFactor: 1.25 });

  y += catBoxH + 6;

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
      head: [['', 'Standard Rate', 'SmartMathz Offer']],
      body: [
        ['Number of Sessions', `${defaultSessions ?? computedPrice.sessions}`, `${computedPrice.sessions}`],
        ['Hourly Rate',        `$${computedPrice.standardHourlyRate.toFixed(2)}`, `$${computedPrice.smHourlyRate.toFixed(2)}`],
        ['Monthly Fee',        `$${computedPrice.standardMonthlyFee}`,            `$${computedPrice.smMonthlyFee}`],
        ['Bi-Weekly',          `$${(computedPrice.standardMonthlyFee / 2).toFixed(0)}`, `$${computedPrice.smBiweekly.toFixed(1)}`],
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
        1: { halign: 'center', cellWidth: 40 },
        2: { halign: 'center', cellWidth: cW - 82, textColor: [22,101,52], fontStyle: 'bold' },
      },
      didParseCell: (d) => {
        if (d.section === 'head' && d.column.index === 2) d.cell.styles.fillColor = [22, 101, 52];
        // Center the head labels over their (already centered) body columns
        if (d.section === 'head' && (d.column.index === 1 || d.column.index === 2)) {
          d.cell.styles.halign = 'center';
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 3;

    // Savings strip
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(M, y, cW, 16, 2, 2, 'F');
    doc.setDrawColor(22, 101, 52);
    doc.roundedRect(M, y, cW, 16, 2, 2, 'S');

    const half = cW / 2;

    // Left: % Savings
    doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text('% Savings', M + 4, y + 6);
    doc.setFontSize(10); doc.setTextColor(31, 41, 55);
    doc.text(`${computedPrice.savingsPercent}%`, M + 4, y + 12.5);
    doc.setTextColor(107, 114, 128); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text('Per Month', M + 4 + doc.getTextWidth(`${computedPrice.savingsPercent}%`) + 4, y + 12.5);

    // Divider
    doc.setDrawColor(187, 247, 208);
    doc.line(M + half, y + 3, M + half, y + 13);

    // Right: SmartMathz Investment
    doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text('SmartMathz Investment', M + half + 4, y + 6);
    doc.setFontSize(10); doc.setTextColor(31, 41, 55);
    doc.text(`$${computedPrice.smInvestment}`, M + half + 4, y + 12.5);
    doc.setTextColor(107, 114, 128); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text('Per Month', M + half + 4 + doc.getTextWidth(`$${computedPrice.smInvestment}`) + 4, y + 12.5);

    y += 22;
  }



// ── Page-break guard: keeps content clear of the footer ──────────────────
  const FOOTER_CLEAR = 12; // mm reserved above footer
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - FOOTER_CLEAR) {
      doc.addPage();
      y = 16;
    }
  };

// ── EVALUATOR'S COMMENT — adaptive: always fits on the current page ───────
  if (instructorComment?.trim()) {
   const SIGNOFF_RESERVE = 12;  // compact horizontal sign-off (~10mm) + margin
    const LABEL_H         = 3;   // section label height
    const BOX_GAP         = 4;   // spacing after the comment box
    const available = (pageH - FOOTER_CLEAR) - y - LABEL_H - BOX_GAP - SIGNOFF_RESERVE;
    const text = instructorComment.trim();

    // Font-size ladder — try each until the comment fits the remaining space
    const SIZES = [
      { font: 9,   lineH: 4.0 },
      { font: 8.5, lineH: 3.7 },
      { font: 8,   lineH: 3.4 },
      { font: 7.5, lineH: 3.2 },
      { font: 7,   lineH: 3.0 },
      { font: 6.5, lineH: 2.8 },
    ];

    let chosen = SIZES[SIZES.length - 1];
    let lines: string[] = [];
    for (const s of SIZES) {
      doc.setFontSize(s.font); doc.setFont('helvetica', 'normal');
      const wrapped = doc.splitTextToSize(text, cW - 8);
      lines = wrapped;
      if (wrapped.length * s.lineH + 7 <= available) { chosen = s; break; }
      chosen = s; // keep smallest as fallback
    }

    // Last resort: truncate with an ellipsis rather than breaking the page
    const maxLines = Math.max(1, Math.floor((available - 7) / chosen.lineH));
    if (lines.length > maxLines) {
      lines = [...lines.slice(0, maxLines - 1), '…'];
    }

    const commentBoxH = lines.length * chosen.lineH + 7;

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(17, 24, 39);
    doc.text("EVALUATOR'S COMMENT", M, y); y += 3;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(M, y, cW, commentBoxH, 2, 2, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.roundedRect(M, y, cW, commentBoxH, 2, 2, 'S');

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(chosen.font); doc.setFont('helvetica', 'normal');
    // Convert desired mm line height into jsPDF's lineHeightFactor
    const lhFactor = chosen.lineH / (chosen.font * 0.3528);
    doc.text(lines, M + 4, y + 5, { lineHeightFactor: lhFactor });

   y += commentBoxH + BOX_GAP;
  
  }

  // ── FOOTER — drawn on every page ──────────────────────────────────────────
  const pageCount = (doc as any).getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(22, 101, 52);
    doc.rect(0, pageH - 10, pageW, 10, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text(
      'SmartMathz  |  www.smartmathz.com  |  Confidential Student Report',
      pageW / 2, pageH - 4, { align: 'center' }
    );
  }

  doc.save(`SmartMathz_Recommendation_${studentName.replace(/\s+/g, '_')}.pdf`)};
// // ── Subject comment helper ────────────────────────────────────────────────────
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