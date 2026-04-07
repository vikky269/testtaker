// app/utils/generateRecommendation.ts
// Generates the SmartMathz Program Recommendation PDF for a student

import jsPDF from 'jspdf';

export interface StudentData {
  full_name: string;
  email: string;
  grade: string;
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
    description: 'This category includes students who have a keen interest in mathematics and are eager to explore its various aspects. They might not always score at the top, but they actively engage with the subject, ask insightful questions, and enjoy delving into mathematical concepts beyond the standard curriculum.',
  };
  if (overallScore >= 40) return {
    name: 'RISERS',
    color: [184, 134, 11],
    description: 'The "Risers" category refers to students who might not have initially shown exceptional math skills but are steadily improving over time. They put in consistent effort to enhance their mathematical abilities and gradually move up in terms of their performance and understanding of the subject.',
  };
  return {
    name: 'ADAPTERS',
    color: [180, 0, 180],
    description: 'These students exhibit a certain rigidity in their approach to learning, but they can also adapt when presented with the right methods. While they might resist learning math initially, they have the potential to change their perspective and approach if they\'re exposed to different teaching techniques or real-world applications that resonate with them.',
  };
};

// ── Package Definitions ──────────────────────────────────────
export type PackageKey = 'package1' | 'package2' | 'package3' | 'package4';

export interface Package {
  key: PackageKey;
  name: string;
  displayName: string;   // short label for dropdown
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
    rationale: 'This package provides focused, dedicated Mathematics support. The student will receive structured, one-on-one sessions designed to strengthen core concepts, build problem-solving skills, and improve overall mathematical confidence.',
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
    rationale: 'This package combines structured Mathematics and English Language Arts support with access to our Virtual Library. The balanced programme addresses both numerical and literacy skills, giving the student a strong academic foundation across core subjects.',
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
    rationale: 'This comprehensive STEM-focused package covers Mathematics, English Language Arts, and Science or Coding alongside Virtual Library access. It is designed to build well-rounded academic skills, introduce logical thinking through coding, and nurture scientific curiosity.',
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
    rationale: 'Our most comprehensive programme, covering all four subjects — Mathematics, English Language Arts, Science, and Coding — alongside full Virtual Library access. This package ensures no learning gap is left unaddressed, providing the student with a complete, structured academic development experience.',
  },
];

// ── Suggested package based on scores ───────────────────────
export const getSuggestedPackage = (s: StudentData): Package => {
  const math    = s.math_score ?? 0;
  const ela     = s.ela_score ?? 0;
  const science = s.science_score ?? 0;

  const needsEla     = ela > 0 && ela < 70;
  const needsScience = science > 0 && science < 70;

  // Package IV: needs everything
  if (needsEla && needsScience)
    return ALL_PACKAGES.find(p => p.key === 'package4')!;

  // Package III: needs ELA + science or coding
  if (needsEla || needsScience)
    return ALL_PACKAGES.find(p => p.key === 'package3')!;

  // Package II: ELA support useful even if passing
  if (ela > 0 && ela < 80)
    return ALL_PACKAGES.find(p => p.key === 'package2')!;

  // Package I: math only focus
  return ALL_PACKAGES.find(p => p.key === 'package1')!;
};

// ── Subject Performance Comment ──────────────────────────────
const getSubjectComment = (subject: string, score: number, name: string): string => {
  const firstName = name.split(' ')[0];
  if (subject === 'math') {
    if (score >= 80) return `${firstName} performed exceptionally well in Mathematics, demonstrating strong conceptual understanding and the ability to apply mathematical reasoning effectively.`;
    if (score >= 60) return `${firstName} shows a developing understanding of Mathematics. With targeted support on core concepts, significant improvement is expected.`;
    return `${firstName} is still developing foundational math skills and would benefit from structured support to strengthen core concepts. While this score indicates areas of need, attentiveness and willingness to attempt problems show strong learning potential.`;
  }
  if (subject === 'ela') {
    if (score >= 80) return `${firstName} performed very well in ELA, demonstrating solid comprehension, reasoning, and communication skills. This strength supports overall academic confidence and the ability to understand instructions across subjects.`;
    if (score >= 60) return `${firstName} shows a fair understanding of ELA concepts. With consistent reading practice and vocabulary development, performance can improve significantly.`;
    return `${firstName} requires additional support in English Language Arts. Focused attention on reading comprehension, writing structure, and vocabulary will help bridge current gaps.`;
  }
  if (subject === 'science') {
    if (score >= 80) return `${firstName}'s science performance reflects strong understanding and curiosity about scientific concepts, with excellent application of analytical thinking.`;
    if (score >= 60) return `${firstName}'s science performance reflects good understanding and curiosity about scientific concepts. With guided practice, analytical thinking and problem-solving skills in this area can be further improved.`;
    return `${firstName} would benefit from additional support in Science to strengthen understanding of key concepts and develop stronger analytical and application-based skills.`;
  }
  return '';
};

// ── Main PDF Generator ───────────────────────────────────────
export const generateRecommendationPDF = (
  s: StudentData,
  selectedPackage: Package,
  instructorName = 'Isaac Salako'
) => {
  const doc      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW    = doc.internal.pageSize.getWidth();
  const pageH    = doc.internal.pageSize.getHeight();
  const margin   = 16;
  const cW       = pageW - margin * 2;
  const category = getLearningCategory(s.overall_score);
  const pkg      = selectedPackage;
  const firstName = s.full_name.split(' ')[0];

  // ── HEADER ──────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 38, 'F');
  try { doc.addImage('/logo.png', 'PNG', margin, 4, 28, 28); } catch {}
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15); doc.setFont('helvetica', 'bold');
  doc.text('SmartMathz', margin + 32, 14);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Evaluation Summary & Program Recommendation', margin + 32, 21);
  doc.setFontSize(7.5);
  doc.text('CONFIDENTIAL — For SmartMathz use only', margin + 32, 28);
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFontSize(8);
  doc.text(`Date: ${dateStr}`, pageW - margin, 14, { align: 'right' });

  let y = 46;

  // ── STUDENT INFO ─────────────────────────────────────────────
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cW, 22, 2, 2, 'F');
  doc.setTextColor(22, 101, 52); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  doc.text('STUDENT INFORMATION', margin + 4, y + 6);
  doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  const c1 = margin + 4, c2 = pageW / 2 + 2;
  doc.setFont('helvetica', 'bold');   doc.text('Name:',  c1, y + 14);
  doc.setFont('helvetica', 'normal'); doc.text(s.full_name, c1 + 18, y + 14);
  doc.setFont('helvetica', 'bold');   doc.text('Grade:', c2, y + 14);
  doc.setFont('helvetica', 'normal'); doc.text(s.grade?.toUpperCase() || 'N/A', c2 + 18, y + 14);
  doc.setFont('helvetica', 'bold');   doc.text('Email:', c1, y + 20);
  doc.setFont('helvetica', 'normal'); doc.text(s.email || 'N/A', c1 + 18, y + 20);
  doc.setFont('helvetica', 'bold');   doc.text('Date:',  c2, y + 20);
  doc.setFont('helvetica', 'normal'); doc.text(new Date(s.created_at).toLocaleDateString(), c2 + 16, y + 20);

  y += 28;

  // ── SCORE SUMMARY STRIP ──────────────────────────────────────
  const sections = [
    { label: 'Overall', val: s.overall_score,     color: [22, 101, 52]  as [number,number,number] },
    { label: 'Math',    val: s.math_score,         color: [79, 70, 229]  as [number,number,number] },
    { label: 'ELA',     val: s.ela_score ?? 0,     color: [5, 150, 105]  as [number,number,number] },
    { label: 'Science', val: s.science_score ?? 0, color: [217, 119, 6]  as [number,number,number] },
  ];
  const sw = (cW - 9) / 4;
  sections.forEach(({ label, val, color }, i) => {
    const bx = margin + i * (sw + 3);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(bx, y, sw, 18, 2, 2, 'F');
    doc.setDrawColor(...color); doc.setLineWidth(0.8);
    doc.roundedRect(bx, y, sw, 18, 2, 2, 'S');
    doc.setTextColor(...color); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
    doc.text(label.toUpperCase(), bx + sw / 2, y + 6, { align: 'center' });
    doc.setFontSize(13);
    doc.text(`${Math.round(val)}%`, bx + sw / 2, y + 14, { align: 'center' });
  });

  y += 24;

  // ── SUBJECT PERFORMANCE OVERVIEW ─────────────────────────────
  doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('SUBJECT PERFORMANCE OVERVIEW', margin, y);
  y += 4;

  const subjects: {
    name: string; score: number | null;
    key: 'math' | 'ela' | 'science';
    color: [number,number,number]; bg: [number,number,number]
  }[] = [
    { name: 'Mathematics',           score: s.math_score,    key: 'math',    color: [79, 70, 229],  bg: [238, 242, 255] },
    { name: 'English Language Arts', score: s.ela_score,     key: 'ela',     color: [5, 150, 105],  bg: [236, 253, 245] },
    { name: 'Science',               score: s.science_score, key: 'science', color: [217, 119, 6],  bg: [255, 251, 235] },
  ];

  subjects.forEach(({ name, score, key, color, bg }) => {
    if (score == null || score === 0) return;
    const comment      = getSubjectComment(key, score, s.full_name);
    const commentLines = doc.splitTextToSize(comment, cW - 30);
    const boxH         = 8 + commentLines.length * 4.5;

    doc.setFillColor(...bg);
    doc.roundedRect(margin, y, cW, boxH, 2, 2, 'F');
    doc.setDrawColor(...color); doc.setLineWidth(0.5);
    doc.line(margin, y, margin, y + boxH);

    doc.setFillColor(...color);
    doc.roundedRect(margin + 4, y + 2.5, 22, 7, 1, 1, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(7); doc.setFont('helvetica','bold');
    doc.text(`${Math.round(score)}%`, margin + 15, y + 7.5, { align: 'center' });

    doc.setTextColor(...color); doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text(name, margin + 30, y + 7.5);

    doc.setTextColor(55, 65, 81); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    doc.text(commentLines, margin + 4, y + 14);

    y += boxH + 3;
  });

  y += 2;

  // ── LEARNING CATEGORY ────────────────────────────────────────
  doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('LEARNING CATEGORY', margin, y);
  y += 4;

  const catLines = doc.splitTextToSize(
    `${firstName} fits well within our ${category.name} category — ${category.description}`,
    cW - 50
  );
  const catH = Math.max(24, 12 + catLines.length * 4.5);

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cW, catH, 2, 2, 'F');
  doc.setFillColor(...category.color);
  doc.roundedRect(margin + 4, y + 3, 36, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
  doc.text(category.name, margin + 22, y + 9.5, { align: 'center' });
  doc.setTextColor(30, 60, 30); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  doc.text(catLines, margin + 44, y + 8);

  y += catH + 6;

  if (y > pageH - 80) { doc.addPage(); y = 20; }

  // ── PROGRAMME RECOMMENDATION ─────────────────────────────────
  doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('PROGRAMME RECOMMENDATION', margin, y);
  y += 4;

  doc.setFillColor(22, 101, 52);
  doc.roundedRect(margin, y, cW, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.text(pkg.name, margin + cW / 2, y + 6.5, { align: 'center' });
  y += 14;

  const ratLines = doc.splitTextToSize(pkg.rationale, cW - 8);
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(margin, y, cW, ratLines.length * 4.5 + 8, 2, 2, 'F');
  doc.setDrawColor(234, 179, 8); doc.setLineWidth(0.5);
  doc.line(margin, y, margin, y + ratLines.length * 4.5 + 8);
  doc.setTextColor(92, 76, 3); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  doc.text(ratLines, margin + 4, y + 6);
  y += ratLines.length * 4.5 + 14;

  // Session schedule
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Session Schedule:', margin, y);
  y += 5;

  pkg.hours.forEach(({ subject, hours }) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, cW, 8, 1, 1, 'F');
    doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, cW, 8, 1, 1, 'S');
    doc.setTextColor(22, 101, 52); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text(`• ${subject}`, margin + 4, y + 5.5);
    doc.setTextColor(55, 65, 81); doc.setFont('helvetica', 'normal');
    doc.text(hours, margin + cW - 4, y + 5.5, { align: 'right' });
    y += 10;
  });

  doc.setFillColor(22, 101, 52);
  doc.roundedRect(margin, y, cW, 9, 1, 1, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
  doc.text('Total:', margin + 4, y + 6);
  doc.text(pkg.totalHours, margin + cW - 4, y + 6, { align: 'right' });
  y += 15;

  // ── SIGN OFF ─────────────────────────────────────────────────
  if (y > pageH - 40) { doc.addPage(); y = 20; }

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(55, 65, 81);
  doc.text('Please do not hesitate to reach out if you have any questions or concerns.', margin, y);
  y += 6;
  doc.text('Best regards,', margin, y); y += 5;
  doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 101, 52);
  doc.text(instructorName, margin, y); y += 5;
  doc.setFont('helvetica', 'normal'); doc.setTextColor(107, 114, 128);
  doc.text('Lead Instructor, SmartMathz', margin, y);

  // ── FOOTER ───────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, pageH - 12, pageW, 12, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text(
    'CONFIDENTIAL — SmartMathz Evaluation Report  |  www.smartmathz.com',
    pageW / 2, pageH - 5, { align: 'center' }
  );

  doc.save(`SmartMathz_Recommendation_${s.full_name.replace(/\s+/g, '_')}.pdf`);
};