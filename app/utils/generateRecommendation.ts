// app/utils/generateRecommendation.ts

import jsPDF from 'jspdf';

export interface StudentData {
  full_name: string;
  email: string;
  grade: string;
  gender?: string | null;
  overall_score: number;
  math_score: number;
  ela_score: number | null;
  science_score: number | null;
  total_time: number;
  test_type: string;
  created_at: string;
}

// ── Learning Category ────────────────────────────────────────
export interface LearningCategory {
  name: string;
  color: [number, number, number];
  description: string;
}

export const getLearningCategory = (overallScore: number): LearningCategory => {
  if (overallScore >= 85) return {
    name: 'WHIZZES',
    color: [34, 139, 34],
    description: 'These are the students who excel exceptionally in mathematics. They grasp complex concepts quickly and can solve challenging problems with ease. Whizzes often display an innate talent for math and might even find traditional classroom content to be relatively straightforward.',
  };
  if (overallScore >= 70) return {
    name: 'ACES',
    color: [0, 128, 0],
    description: 'Aces are students who consistently perform very well in mathematics. They have a strong grasp of the subject matter and consistently work to achieve high scores on assignments, tests, and exams.',
  };
  if (overallScore >= 55) return {
    name: 'EXPLORERS',
    color: [0, 100, 0],
    description: 'This category includes students who have a keen interest in mathematics and are eager to explore its various aspects. They might not always score at the top, but they actively engage with the subject and enjoy delving into mathematical concepts.',
  };
  if (overallScore >= 40) return {
    name: 'RISERS',
    color: [184, 134, 11],
    description: 'Risers are students who might not have initially shown exceptional math skills but are steadily improving over time. They put in consistent effort to enhance their mathematical abilities and gradually move up in performance.',
  };
  return {
    name: 'ADAPTERS',
    color: [180, 0, 180],
    description: 'These students can adapt when presented with the right methods. While they might resist learning math initially, they have the potential to change their perspective if exposed to different teaching techniques or real-world applications.',
  };
};

// ── Package Definitions ──────────────────────────────────────
export type PackageKey = 'package1' | 'package2' | 'package3' | 'package4';

export interface Package {
  key: PackageKey;
  name: string;
  displayName: string;
  subjects: string[];
  hours: { subject: string; hours: string }[];
  totalHours: string;
  rationale: string;
}

export const ALL_PACKAGES: Package[] = [
  {
    key: 'package1',
    name: 'Package I – Mathematics Only',
    displayName: 'Package I – Math Only',
    subjects: ['Mathematics'],
    hours: [
      { subject: 'Mathematics', hours: '2 hours per week (1-hour sessions twice weekly)' },
    ],
    totalHours: '2 hours per week',
    rationale: 'This package provides focused, dedicated Mathematics support. The student will receive structured sessions designed to strengthen core concepts, build problem-solving skills, and improve overall mathematical confidence.',
  },
  {
    key: 'package2',
    name: 'Package II – Mathematics & ELA + Virtual Library',
    displayName: 'Package II – Math & ELA + Virtual Library',
    subjects: ['Mathematics', 'English Language Arts', 'Virtual Library'],
    hours: [
      { subject: 'Mathematics',           hours: '2 hours per week (1-hour sessions twice weekly)' },
      { subject: 'English Language Arts', hours: '1 hour per week' },
      { subject: 'Virtual Library',       hours: 'Unlimited access' },
    ],
    totalHours: '3 hours per week + Virtual Library',
    rationale: 'This package combines structured Mathematics and English Language Arts support with access to our Virtual Library, addressing both numerical and literacy skills across core subjects.',
  },
  {
    key: 'package3',
    name: 'Package III – Mathematics, ELA, Science/Coding + Virtual Library',
    displayName: 'Package III – Math, ELA & Science/Coding + Virtual Library',
    subjects: ['Mathematics', 'English Language Arts', 'Science / Coding', 'Virtual Library'],
    hours: [
      { subject: 'Mathematics',           hours: '2 hours per week (1-hour sessions twice weekly)' },
      { subject: 'English Language Arts', hours: '1 hour per week' },
      { subject: 'Science / Coding',      hours: '1 hour per week' },
      { subject: 'Virtual Library',       hours: 'Unlimited access' },
    ],
    totalHours: '4 hours per week + Virtual Library',
    rationale: 'This STEM-focused package covers Mathematics, English Language Arts, and Science or Coding alongside Virtual Library access, building well-rounded academic skills and logical thinking.',
  },
  {
    key: 'package4',
    name: 'Package IV – Mathematics, ELA, Science & Coding + Virtual Library',
    displayName: 'Package IV – Full Programme + Virtual Library',
    subjects: ['Mathematics', 'English Language Arts', 'Science', 'Coding', 'Virtual Library'],
    hours: [
      { subject: 'Mathematics',           hours: '2 hours per week (1-hour sessions twice weekly)' },
      { subject: 'English Language Arts', hours: '1 hour per week' },
      { subject: 'Science',               hours: '1 hour per week' },
      { subject: 'Coding',                hours: '1 hour per week' },
      { subject: 'Virtual Library',       hours: 'Unlimited access' },
    ],
    totalHours: '5 hours per week + Virtual Library',
    rationale: 'Our most comprehensive programme covering all four subjects alongside full Virtual Library access, ensuring no learning gap is left unaddressed.',
  },
];

export const getSuggestedPackage = (s: StudentData): Package => {
  const ela     = s.ela_score ?? 0;
  const science = s.science_score ?? 0;
  const needsEla     = ela > 0 && ela < 70;
  const needsScience = science > 0 && science < 70;
  if (needsEla && needsScience) return ALL_PACKAGES.find(p => p.key === 'package4')!;
  if (needsEla || needsScience) return ALL_PACKAGES.find(p => p.key === 'package3')!;
  if (ela > 0 && ela < 80)      return ALL_PACKAGES.find(p => p.key === 'package2')!;
  return ALL_PACKAGES.find(p => p.key === 'package1')!;
};

// ── Short subject comments (kept tight for single-page fit) ──
const getSubjectComment = (subject: string, score: number, name: string): string => {
  const n = name.split(' ')[0];
  if (subject === 'math') {
    if (score >= 80) return `${n} performed exceptionally well in Mathematics, demonstrating strong conceptual understanding and the ability to apply mathematical reasoning effectively.`;
    if (score >= 60) return `${n} shows a developing understanding of Mathematics. With targeted support on core concepts, significant improvement is expected.`;
    return `${n} is still developing foundational math skills and would benefit from structured support to strengthen core concepts and build problem-solving confidence.`;
  }
  if (subject === 'ela') {
    if (score >= 80) return `${n} performed very well in ELA, demonstrating solid comprehension, reasoning, and communication skills that support overall academic confidence.`;
    if (score >= 60) return `${n} shows a fair understanding of ELA. With consistent reading practice and vocabulary development, performance can improve significantly.`;
    return `${n} requires additional ELA support. Focused attention on reading comprehension, writing structure, and vocabulary will help bridge current gaps.`;
  }
  if (subject === 'science') {
    if (score >= 80) return `${n}'s science performance reflects strong understanding of scientific concepts with excellent application of analytical thinking.`;
    if (score >= 60) return `${n} shows good understanding of science. With guided practice, analytical thinking and problem-solving skills can be further improved.`;
    return `${n} would benefit from additional science support to strengthen understanding of key concepts and develop stronger analytical skills.`;
  }
  return '';
};

// ── pronoun helper ───────────────────────────────────────────
const getPronoun = (gender?: string | null) => {
  if (!gender) return { sub: 'The student', pos: 'their', obj: 'them' };
  const g = gender.toLowerCase();
  if (g === 'male' || g === 'boy')   return { sub: 'He',  pos: 'his',  obj: 'him'  };
  if (g === 'female' || g === 'girl') return { sub: 'She', pos: 'her',  obj: 'her'  };
  return { sub: 'They', pos: 'their', obj: 'them' };
};

// ── Main PDF Generator ───────────────────────────────────────
export const generateRecommendationPDF = (
  s: StudentData,
  selectedPackage: Package,
  instructorName = 'Isaac Salako'
) => {
  const doc     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW   = doc.internal.pageSize.getWidth();
  const pageH   = doc.internal.pageSize.getHeight();
  const margin  = 14;
  const cW      = pageW - margin * 2;
  const category = getLearningCategory(s.overall_score);
  const pkg      = selectedPackage;
  const firstName = s.full_name.split(' ')[0];
  const pronoun   = getPronoun(s.gender);

  let y = 0;

  // ── HEADER ──────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 32, 'F');
  try { doc.addImage('/logo.png', 'PNG', margin, 3, 24, 24); } catch {}
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('SmartMathz', margin + 28, 12);
  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  doc.text('Evaluation Summary & Program Recommendation', margin + 28, 19);
  doc.setFontSize(7);
  doc.text('CONFIDENTIAL — For SmartMathz use only', margin + 28, 25);
  doc.setFontSize(7.5);
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageW - margin, 12, { align: 'right' });

  y = 38;

  // ── STUDENT INFO ─────────────────────────────────────────────
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cW, 20, 2, 2, 'F');
  doc.setTextColor(22, 101, 52); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text('STUDENT INFORMATION', margin + 3, y + 5.5);
  doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);

  const c1 = margin + 3, c2 = pageW / 2 + 2, c3 = pageW * 0.75;
  const row1y = y + 12, row2y = y + 17;

  doc.setFont('helvetica', 'bold'); doc.text('Name:',   c1, row1y);
  doc.setFont('helvetica', 'normal'); doc.text(s.full_name, c1 + 16, row1y);
  doc.setFont('helvetica', 'bold'); doc.text('Grade:',  c2, row1y);
  doc.setFont('helvetica', 'normal'); doc.text(s.grade?.toUpperCase() || 'N/A', c2 + 17, row1y);
  doc.setFont('helvetica', 'bold'); doc.text('Gender:', c3, row1y);
  doc.setFont('helvetica', 'normal'); doc.text(s.gender || 'N/A', c3 + 18, row1y);

  doc.setFont('helvetica', 'bold'); doc.text('Email:',  c1, row2y);
  doc.setFont('helvetica', 'normal'); doc.text(s.email || 'N/A', c1 + 16, row2y);
  doc.setFont('helvetica', 'bold'); doc.text('Date:',   c2, row2y);
  doc.setFont('helvetica', 'normal'); doc.text(new Date(s.created_at).toLocaleDateString(), c2 + 17, row2y);

  y += 24;

  // ── SCORE STRIP ──────────────────────────────────────────────
  const scoreItems = [
    { label: 'OVERALL', val: s.overall_score,     color: [22, 101, 52]  as [number,number,number] },
    { label: 'MATH',    val: s.math_score,         color: [79, 70, 229]  as [number,number,number] },
    { label: 'ELA',     val: s.ela_score ?? 0,     color: [5, 150, 105]  as [number,number,number] },
    { label: 'SCIENCE', val: s.science_score ?? 0, color: [217, 119, 6]  as [number,number,number] },
  ];
  const sw = (cW - 9) / 4;
  scoreItems.forEach(({ label, val, color }, i) => {
    const bx = margin + i * (sw + 3);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(bx, y, sw, 16, 2, 2, 'F');
    doc.setDrawColor(...color); doc.setLineWidth(0.7);
    doc.roundedRect(bx, y, sw, 16, 2, 2, 'S');
    doc.setTextColor(...color); doc.setFontSize(6); doc.setFont('helvetica', 'bold');
    doc.text(label, bx + sw / 2, y + 5.5, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${Math.round(val)}%`, bx + sw / 2, y + 13, { align: 'center' });
  });

  y += 20;

  // ── SUBJECT PERFORMANCE OVERVIEW ─────────────────────────────
  // Redesigned: 3-column table layout — Subject | Score bar | Comment
  // Much more compact than stacked boxes

  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('SUBJECT PERFORMANCE OVERVIEW', margin, y);
  y += 3;

  // light header row
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cW, 6, 1, 1, 'F');
  doc.setTextColor(22, 101, 52); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
  doc.text('SUBJECT', margin + 3, y + 4.2);
  doc.text('SCORE', margin + 47, y + 4.2);
  doc.text('PERFORMANCE SUMMARY', margin + 72, y + 4.2);
  y += 7;

  const subjectRows: {
    name: string; score: number | null;
    key: 'math' | 'ela' | 'science';
    color: [number,number,number]; bg: [number,number,number]
  }[] = [
    { name: 'Mathematics',           score: s.math_score,    key: 'math',    color: [79, 70, 229],  bg: [238, 242, 255] },
    { name: 'English Language Arts', score: s.ela_score,     key: 'ela',     color: [5, 150, 105],  bg: [236, 253, 245] },
    { name: 'Science',               score: s.science_score, key: 'science', color: [217, 119, 6],  bg: [255, 251, 235] },
  ];

  const commentColX  = margin + 72;
  const commentColW  = cW - 72 + margin - margin;  // = cW - 72
  const rowH = 14; // fixed row height for each subject

  subjectRows.forEach(({ name, score, key, color, bg }) => {
    if (score == null || score === 0) return;

    // row background
    doc.setFillColor(...bg);
    doc.roundedRect(margin, y, cW, rowH, 1, 1, 'F');

    // left accent line
    doc.setFillColor(...color);
    doc.rect(margin, y, 2, rowH, 'F');

    // subject name col (col 1) — max ~40mm wide
    doc.setTextColor(...color); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text(name, margin + 4, y + rowH / 2 + 1.5, { maxWidth: 42 });

    // score pill (col 2) — centered in ~22mm
    doc.setFillColor(...color);
    doc.roundedRect(margin + 46, y + 3, 20, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text(`${Math.round(score)}%`, margin + 56, y + 8.5, { align: 'center' });

    // comment (col 3)
    const comment = getSubjectComment(key, score, s.full_name);
    const commentLines = doc.splitTextToSize(comment, cW - 74);
    doc.setTextColor(55, 65, 81); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    // vertically centre the comment lines
    const textBlockH = commentLines.length * 3.8;
    const textStartY = y + (rowH - textBlockH) / 2 + 3.5;
    doc.text(commentLines.slice(0, 3), commentColX, textStartY);

    y += rowH + 2;
  });

  y += 3;

  // ── LEARNING CATEGORY ────────────────────────────────────────
  // Redesigned: single compact row — badge on left, short text on right

  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('LEARNING CATEGORY', margin, y);
  y += 3;

  // Short category description (1–2 lines max)
  const shortCatDesc = doc.splitTextToSize(category.description, cW - 52).slice(0, 2);
  const catBoxH = 16;

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cW, catBoxH, 2, 2, 'F');
  doc.setDrawColor(...category.color); doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, cW, catBoxH, 2, 2, 'S');

  // badge
  doc.setFillColor(...category.color);
  doc.roundedRect(margin + 3, y + 3, 40, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text(category.name, margin + 23, y + 9.5, { align: 'center' });

  // text
  doc.setTextColor(30, 60, 30); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  doc.text(
    `${firstName} fits well within our ${category.name} group. ${shortCatDesc.join(' ')}`,
    margin + 47, y + 6,
    { maxWidth: cW - 50 }
  );

  y += catBoxH + 5;

  // ── PROGRAMME RECOMMENDATION ─────────────────────────────────
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('PROGRAMME RECOMMENDATION', margin, y);
  y += 4;

  // Package name banner
  doc.setFillColor(22, 101, 52);
  doc.roundedRect(margin, y, cW, 9, 2, 2, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.text(pkg.name, margin + cW / 2, y + 6, { align: 'center' });
  y += 12;

  // Rationale box
  const ratLines = doc.splitTextToSize(pkg.rationale, cW - 8);
  const ratH = Math.min(ratLines.length, 3) * 4.2 + 7;
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(margin, y, cW, ratH, 2, 2, 'F');
  doc.setDrawColor(234, 179, 8); doc.setLineWidth(0.4);
  doc.line(margin + 1, y + 1, margin + 1, y + ratH - 1);
  doc.setTextColor(92, 76, 3); doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text(ratLines.slice(0, 3), margin + 5, y + 5.5);
  y += ratH + 5;

  // Session schedule — compact inline rows
  doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Session Schedule:', margin, y);
  y += 4;

  pkg.hours.forEach(({ subject, hours }) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, cW, 7.5, 1, 1, 'F');
    doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, cW, 7.5, 1, 1, 'S');
    doc.setTextColor(22, 101, 52); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text(`• ${subject}`, margin + 4, y + 5.2);
    doc.setTextColor(55, 65, 81); doc.setFont('helvetica', 'normal');
    doc.text(hours, margin + cW - 3, y + 5.2, { align: 'right' });
    y += 9;
  });

  // Total row
  doc.setFillColor(22, 101, 52);
  doc.roundedRect(margin, y, cW, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
  doc.text('Total:', margin + 4, y + 5.5);
  doc.text(pkg.totalHours, margin + cW - 3, y + 5.5, { align: 'right' });
  y += 12;

  // ── SIGN OFF ─────────────────────────────────────────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(75, 85, 99);
  doc.text('Please do not hesitate to reach out if you have any questions or concerns.', margin, y);
  y += 5;
  doc.text('Best regards,', margin, y); y += 5;
  doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 101, 52); doc.setFontSize(8.5);
  doc.text(instructorName, margin, y); y += 5;
  doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128); doc.setFontSize(7.5);
  doc.text('Lead Instructor, SmartMathz', margin, y);

  // ── FOOTER ───────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, pageH - 10, pageW, 10, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
  doc.text(
    'CONFIDENTIAL — SmartMathz Evaluation Report  |  www.smartmathz.com',
    pageW / 2, pageH - 3.5, { align: 'center' }
  );

  doc.save(`SmartMathz_Recommendation_${s.full_name.replace(/\s+/g, '_')}.pdf`);
};