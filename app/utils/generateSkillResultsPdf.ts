import jsPDF from 'jspdf';
import type { SkillBreakdown, SkillDomainRow } from '@/app/utils/skillBreakdown';

export type SkillResultsPdfParams = {
  studentName: string;
  gradeLabel: string;
  breakdown: SkillBreakdown;
  date?: Date;
};

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/logo.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function bandColor(key: string): [number, number, number] {
  if (key === 'strong') return [5, 150, 105];
  if (key === 'growing') return [217, 119, 6];
  return [225, 29, 72];
}

function drawDomainBlock(
  doc: jsPDF,
  title: string,
  rows: SkillDomainRow[],
  y: number,
  margin: number,
  contentW: number,
  pageH: number
): number {
  if (!rows.length) return y;

  const ensureSpace = (need: number) => {
    if (y + need > pageH - 18) {
      doc.addPage();
      return 18;
    }
    return y;
  };

  y = ensureSpace(16);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(title.toUpperCase(), margin, y);
  y += 6;

  for (const row of rows) {
    y = ensureSpace(22);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentW, 18, 2, 2, 'FD');

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(row.domain, margin + 4, y + 6);

    const [br, bg, bb] = bandColor(row.band.key);
    doc.setFillColor(br, bg, bb);
    const labelW = doc.getTextWidth(row.band.label) + 6;
    doc.roundedRect(margin + contentW - labelW - 4, y + 2.5, labelW, 5.5, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text(row.band.label, margin + contentW - labelW / 2 - 4, y + 6.2, { align: 'center' });

    // meter background
    const meterX = margin + 4;
    const meterY = y + 10;
    const meterW = contentW - 8;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(meterX, meterY, meterW, 2.5, 1, 1, 'F');
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(meterX, meterY, Math.max(1, (meterW * row.percent) / 100), 2.5, 1, 1, 'F');

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`${row.correct} of ${row.total} correct`, meterX, y + 16);

    y += 22;
  }

  return y + 2;
}

function drawSubjectCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  label: string,
  correct: number,
  total: number,
  percent: number,
  rgb: [number, number, number]
) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(x, y, w, 28, 2, 2, 'FD');

  // ring-ish score badge
  doc.setFillColor(...rgb);
  doc.circle(x + 12, y + 14, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(`${percent}%`, x + 12, y + 15.2, { align: 'center' });

  doc.setTextColor(...rgb);
  doc.setFontSize(7.5);
  doc.text(label.toUpperCase(), x + 24, y + 11);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text(`${correct} / ${total}`, x + 24, y + 20);
}

/** Build and download a one-page (or multi-page) skill-results PDF. */
export async function downloadSkillResultsPdf(params: SkillResultsPdfParams) {
  const { studentName, gradeLabel, breakdown } = params;
  const when = params.date || new Date();
  const dateStr = when.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - margin * 2;

  // Header
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageW, 34, 'F');

  const logo = await loadLogoDataUrl();
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margin, 5, 22, 22);
    } catch {
      /* logo optional */
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SmartMathz', logo ? margin + 26 : margin, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Assessment Results', logo ? margin + 26 : margin, 21);

  doc.setFontSize(8);
  doc.text(dateStr, pageW - margin, 14, { align: 'right' });

  // Student info
  let y = 42;
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(margin, y, contentW, 20, 2, 2, 'F');
  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('STUDENT', margin + 4, y + 6);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(studentName || 'Student', margin + 4, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(gradeLabel || 'Assessment', margin + 4, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.text('Date', pageW - margin - 4, y + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(dateStr, pageW - margin - 4, y + 14, { align: 'right' });

  y += 28;

  // Overall score banner
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(margin, y, contentW, 28, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(`${breakdown.correct} / ${breakdown.total}`, pageW / 2, y + 13, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${breakdown.percent}% correct`, pageW / 2, y + 21, { align: 'center' });
  y += 34;

  // Subject cards
  const subjects: Array<{
    label: string;
    stats: { correct: number; total: number; percent: number };
    rgb: [number, number, number];
  }> = [];
  if (breakdown.math) {
    subjects.push({ label: 'Math', stats: breakdown.math, rgb: [79, 70, 229] });
  }
  if (breakdown.ela) {
    subjects.push({
      label: 'Reading and language',
      stats: breakdown.ela,
      rgb: [5, 150, 105],
    });
  }
  if (breakdown.science) {
    subjects.push({ label: 'Science', stats: breakdown.science, rgb: [217, 119, 6] });
  }

  if (subjects.length) {
    const gap = 4;
    const cardW = (contentW - gap * (subjects.length - 1)) / subjects.length;
    subjects.forEach((s, i) => {
      drawSubjectCard(
        doc,
        margin + i * (cardW + gap),
        y,
        cardW,
        s.label,
        s.stats.correct,
        s.stats.total,
        s.stats.percent,
        s.rgb
      );
    });
    y += 34;
  }

  const mathRows = breakdown.domains.filter((d) => d.subject === 'math');
  const elaRows = breakdown.domains.filter((d) => d.subject === 'ela');
  const scienceRows = breakdown.domains.filter((d) => d.subject === 'science');

  y = drawDomainBlock(doc, 'Math by skill area', mathRows, y, margin, contentW, pageH);
  y = drawDomainBlock(
    doc,
    'Reading and language by skill area',
    elaRows,
    y,
    margin,
    contentW,
    pageH
  );
  y = drawDomainBlock(doc, 'Science by skill area', scienceRows, y, margin, contentW, pageH);

  // Footer note
  if (y > pageH - 24) {
    doc.addPage();
    y = 20;
  }
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const note =
    'This short check-in shows how the student did on these questions. It is not a full diagnosis or placement evaluation.';
  doc.text(doc.splitTextToSize(note, contentW), margin, y + 4);

  doc.setFontSize(7);
  doc.text('© SmartMathz', pageW / 2, pageH - 8, { align: 'center' });

  const safeName = (studentName || 'Student').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
  const safeGrade = (gradeLabel || 'assessment')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  doc.save(`SmartMathz_Results_${safeName}_${safeGrade}.pdf`);
}
