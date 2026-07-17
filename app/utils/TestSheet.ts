// app/utils/testSheet.ts
// Generates a downloadable PDF "test sheet" — every question the student saw,
// their answer, and the correct answer, section by section.

import jsPDF from 'jspdf';

export interface SubmissionQuestion {
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
  solution?: string;
  subject?: string;
}

export interface TestSubmission {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  grade: string | null;
  test_type: string | null;
  questions: SubmissionQuestion[];
  answers: Record<string, string>;
  math_score: number | null;
  ela_score: number | null;
  science_score: number | null;
  overall_score: number | null;
  durations: any;
}

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// Split the stored question array into named sections.
// Uses subject tags when present; falls back to the block convention.
export function splitSections(sub: TestSubmission) {
  const qs = sub.questions ?? [];
  const hasTags = qs.some(q => q.subject);
  const isSat = sub.test_type === 'sat' || sub.test_type === 'ssat';

  if (hasTags) {
    const by = (names: string[]) => qs.filter(q => names.includes(q.subject ?? ''));
    return isSat
      ? [
          { name: 'Reading & Writing', qs: by(['reading', 'ela']) },
          { name: 'Mathematics',       qs: by(['math']) },
        ].filter(s => s.qs.length)
      : [
          { name: 'Mathematics', qs: by(['math']) },
          { name: 'ELA',         qs: by(['ela']) },
          { name: 'Science',     qs: by(['science']) },
        ].filter(s => s.qs.length);
  }

  return isSat
    ? [
        { name: 'Reading & Writing', qs: qs.slice(0, 10) },
        { name: 'Mathematics',       qs: qs.slice(10, 20) },
      ].filter(s => s.qs.length)
    : [
        { name: 'Mathematics', qs: qs.slice(0, 10) },
        { name: 'ELA',         qs: qs.slice(10, 20) },
        { name: 'Science',     qs: qs.slice(20, 30) },
      ].filter(s => s.qs.length);
}

export function isCorrect(q: SubmissionQuestion, answers: Record<string, string>) {
  return answers?.[q.question] === (q.correctAnswer || q.answer);
}

export function generateTestSheetPDF(sub: TestSubmission) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 14;
  const cW = pageW - M * 2;
  let y = 0;

  const ensure = (needed: number) => {
    if (y + needed > pageH - 16) { doc.addPage(); y = 16; }
  };

  // ── Header band ──
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('SmartMathz — Test Sheet', M, 11);
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  doc.text(
    `${sub.full_name ?? 'Student'}  ·  ${(sub.grade ?? '').toUpperCase()}  ·  ${new Date(sub.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`,
    M, 18
  );
  const overall = sub.overall_score != null ? `${Math.round(sub.overall_score)}%` : '—';
  doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text(`Overall: ${overall}`, pageW - M, 14, { align: 'right' });
  y = 34;

  const sections = splitSections(sub);

  sections.forEach(section => {
    const correctCount = section.qs.filter(q => isCorrect(q, sub.answers)).length;

    ensure(14);
    // Section header
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(M, y, cW, 9, 1.5, 1.5, 'F');
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(section.name.toUpperCase(), M + 3, y + 6);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.text(`${correctCount} / ${section.qs.length} correct`, pageW - M - 3, y + 6, { align: 'right' });
    y += 13;

    section.qs.forEach((q, i) => {
      const student = sub.answers?.[q.question];
      const correct = q.correctAnswer || q.answer || '';
      const right   = student === correct;

      doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
      const qLines = doc.splitTextToSize(`${i + 1}. ${stripHtml(q.question)}`, cW - 6);

      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      const yourLines = doc.splitTextToSize(
        `Your answer: ${student != null ? stripHtml(student) : '(no answer)'}`, cW - 10);
      const corrLines = right ? [] :
        doc.splitTextToSize(`Correct answer: ${stripHtml(correct)}`, cW - 10);

      const blockH = qLines.length * 3.8 + yourLines.length * 3.4 + corrLines.length * 3.4 + 7;
      ensure(blockH);

      // status dot
      doc.setFillColor(right ? 34 : 239, right ? 197 : 68, right ? 94 : 68);
      doc.circle(M + 1.5, y + 1.2, 1.5, 'F');

      // question
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
      doc.text(qLines, M + 5, y + 2.5);
      y += qLines.length * 3.8 + 1.5;

      // student's answer
      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.setTextColor(right ? 21 : 185, right ? 128 : 28, right ? 61 : 28);
      doc.text(yourLines, M + 5, y + 2);
      y += yourLines.length * 3.4;

      // correct answer (only when wrong)
      if (corrLines.length) {
        doc.setTextColor(21, 128, 61);
        doc.text(corrLines, M + 5, y + 2);
        y += corrLines.length * 3.4;
      }

      y += 3.5;
    });

    y += 3;
  });

  // Footer on every page
  const pages = (doc as any).getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(`SmartMathz  ·  Confidential Test Sheet  ·  Page ${p} of ${pages}`,
      pageW / 2, pageH - 6, { align: 'center' });
  }

  const safeName = (sub.full_name ?? 'Student').replace(/\s+/g, '_');
  doc.save(`SmartMathz_TestSheet_${safeName}.pdf`);
}