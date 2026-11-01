/**
 * SmartMathz SHSAT Readiness Diagnostic Report (jsPDF).
 * Student review + admin downloads regenerate from stored questions/answers.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  SHSAT_SECTIONS,
  SECTION_TITLE,
  ELA_TOTAL,
  MATH_TOTAL,
  type SHSATSectionKey,
} from '@/app/data/shsatConfig';
import { annotateShsatQuestionsForSkills } from '@/app/utils/shsatSkillAreas';
import { buildSkillBreakdown, skillBand } from '@/app/utils/skillBreakdown';

interface ShsatQuestion {
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
  domain?: string;
  subtopic?: string;
  subject?: string;
}

export interface ShsatReportParams {
  studentName: string;
  studentEmail?: string;
  testDate: string;
  questions: ShsatQuestion[];
  answers: Record<string, string>;
  durations?: {
    totalDuration?: number;
    mathDuration?: number;
    elaDuration?: number;
  };
  elaScore?: number | null;
  mathScore?: number | null;
  overallScore?: number | null;
}

const SECTION_COLOR: Record<SHSATSectionKey, [number, number, number]> = {
  ela: [5, 150, 105],
  math: [79, 70, 229],
};
const SECTION_TINT: Record<SHSATSectionKey, [number, number, number]> = {
  ela: [236, 253, 245],
  math: [238, 242, 255],
};

const fmtDuration = (s?: number) => {
  if (!s || s <= 0) return '—';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
};

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/logo.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function bandRgb(key: string): [number, number, number] {
  if (key === 'strong') return [5, 150, 105];
  if (key === 'growing') return [217, 119, 6];
  return [225, 29, 72];
}

export async function generateShsatReport(params: ShsatReportParams): Promise<void> {
  const {
    studentName,
    studentEmail,
    testDate,
    questions,
    answers,
    durations,
  } = params;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 14;
  const cW = pageW - M * 2;
  const FOOTER_CLEAR = 14;
  let y = 0;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - FOOTER_CLEAR) {
      doc.addPage();
      y = 18;
    }
  };

  const elaQs = questions.slice(0, ELA_TOTAL);
  const mathQs = questions.slice(ELA_TOTAL, ELA_TOTAL + MATH_TOTAL);
  const annotated = annotateShsatQuestionsForSkills(questions, elaQs);
  const breakdown = buildSkillBreakdown(annotated, answers);

  const sectionResults = SHSAT_SECTIONS.map((sec) => {
    const qs = questions.slice(sec.start, sec.end);
    const correct = qs.filter(
      (q) => answers?.[q.question] === (q.correctAnswer || q.answer)
    ).length;
    const score = qs.length ? Math.round((correct / qs.length) * 100) : 0;
    return {
      key: sec.key as SHSATSectionKey,
      label: SECTION_TITLE[sec.key],
      correct,
      total: qs.length,
      score,
    };
  });

  const totalCorrect = breakdown.correct;
  const totalQuestions = breakdown.total || questions.length;
  const overallScore =
    params.overallScore != null
      ? Math.round(params.overallScore)
      : breakdown.percent;
  const overallBand = skillBand(overallScore);

  const logo = await loadLogoDataUrl();

  // ── Header band ──────────────────────────────────────────────────────────
  doc.setFillColor(26, 46, 5);
  doc.rect(0, 0, pageW, 36, 'F');
  doc.setFillColor(127, 181, 9);
  doc.rect(0, 36, pageW, 1.4, 'F');

  if (logo) {
    try {
      doc.addImage(logo, 'PNG', M, 7, 14, 14);
    } catch {
      /* ignore logo decode issues */
    }
  }

  const titleX = logo ? M + 18 : M;
  doc.setTextColor(163, 217, 38);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SMARTMATHZ', titleX, 12);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.text('SHSAT Readiness Diagnostic Report', titleX, 20);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 230, 200);
  doc.text('ELA · Mathematics · Skill-area breakdown', titleX, 26.5);

  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${testDate}`, pageW - M, 12, { align: 'right' });

  y = 44;

  // ── Student strip ────────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 245);
  doc.roundedRect(M, y, cW, 18, 2.5, 2.5, 'F');
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Student', M + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(studentName || 'Student', M + 22, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.text('Email', M + 4, y + 12.5);
  doc.setFont('helvetica', 'normal');
  doc.text(studentEmail || 'N/A', M + 22, y + 12.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Total time', pageW - M - 48, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(fmtDuration(durations?.totalDuration), pageW - M - 4, y + 6, {
    align: 'right',
  });
  doc.setFont('helvetica', 'bold');
  doc.text('Assessment', pageW - M - 48, y + 12.5);
  doc.setFont('helvetica', 'normal');
  doc.text('SHSAT', pageW - M - 4, y + 12.5, { align: 'right' });

  y += 26;

  // ── Hero score ───────────────────────────────────────────────────────────
  const badgeR = 18;
  const badgeCx = M + badgeR;
  const badgeCy = y + badgeR;
  const [br, bg, bb] = bandRgb(overallBand.key);
  doc.setFillColor(br, bg, bb);
  doc.circle(badgeCx, badgeCy, badgeR, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${overallScore}%`, badgeCx, badgeCy + 1.5, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('OVERALL', badgeCx, badgeCy + 7.5, { align: 'center' });

  const heroX = M + badgeR * 2 + 8;
  doc.setTextColor(br, bg, bb);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(overallBand.label, heroX, y + 8);
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${totalCorrect} of ${totalQuestions} questions correct across ELA (${ELA_TOTAL}) and Math (${MATH_TOTAL}).`,
    heroX,
    y + 15,
    { maxWidth: cW - badgeR * 2 - 12 }
  );
  doc.setFontSize(7.5);
  doc.setTextColor(120, 128, 140);
  doc.text(
    'SmartMathz SHSAT readiness diagnostic — not an official DOE exam.',
    heroX,
    y + 22
  );

  y += badgeR * 2 + 10;

  // ── Section scores ───────────────────────────────────────────────────────
  ensureSpace(8 + sectionResults.length * 14);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('SECTION SCORES', M, y);
  y += 6;

  const barX = M + 52;
  const barW = cW - 52 - 20;
  const barH = 6;

  sectionResults.forEach((r) => {
    const color = SECTION_COLOR[r.key];
    const duration =
      r.key === 'ela' ? durations?.elaDuration : durations?.mathDuration;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(r.label, M, y + barH - 0.5, { maxWidth: 48 });

    doc.setFillColor(240, 240, 244);
    doc.roundedRect(barX, y, barW, barH, 1.5, 1.5, 'F');
    const fillW = Math.max(3, (r.score / 100) * barW);
    doc.setFillColor(...color);
    doc.roundedRect(barX, y, fillW, barH, 1.5, 1.5, 'F');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(`${r.score}%`, barX + barW + 3, y + barH - 0.5);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 128, 140);
    doc.text(
      `${r.correct}/${r.total} correct · ${fmtDuration(duration)}`,
      M,
      y + barH + 4
    );

    y += 13;
  });

  y += 4;

  // ── Skill-area tables ────────────────────────────────────────────────────
  const elaDomains = breakdown.domains.filter((d) => d.subject === 'ela');
  const mathDomains = breakdown.domains.filter((d) => d.subject === 'math');

  (
    [
      ['ENGLISH LANGUAGE ARTS — SKILL AREAS', elaDomains, 'ela'],
      ['MATHEMATICS — SKILL AREAS', mathDomains, 'math'],
    ] as const
  ).forEach(([title, rows, key]) => {
    if (!rows.length) return;
    const color = SECTION_COLOR[key];
    const tint = SECTION_TINT[key];

    ensureSpace(22 + rows.length * 10);
    doc.setFillColor(...color);
    doc.roundedRect(M, y, cW, 9, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title, M + 3.5, y + 6);
    y += 12;

    autoTable(doc, {
      startY: y,
      head: [['Skill area', 'Correct', 'Score', 'Band']],
      body: rows.map((d) => [
        d.domain,
        `${d.correct} / ${d.total}`,
        `${d.percent}%`,
        d.band.label,
      ]),
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: { top: 3.2, bottom: 3.2, left: 3, right: 3 },
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.25,
        valign: 'middle',
      },
      headStyles: {
        fillColor: tint,
        textColor: color,
        fontStyle: 'bold',
        fontSize: 7.5,
        halign: 'left',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 72, fontStyle: 'bold' },
        1: { cellWidth: 28, halign: 'center', fontStyle: 'normal' },
        2: { cellWidth: 26, halign: 'center' },
        3: { cellWidth: 40, halign: 'center' },
      },
      margin: { left: M, right: M },
      didParseCell: (data) => {
        if (data.section === 'head' && data.column.index > 0) {
          data.cell.styles.halign = 'center';
        }
        if (data.section === 'body' && data.column.index === 2) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = color;
        }
        // Hide default band text — drawn as a pill in didDrawCell.
        if (data.section === 'body' && data.column.index === 3) {
          data.cell.styles.textColor = [255, 255, 255];
        }
      },
      didDrawCell: (data) => {
        if (data.section !== 'body' || data.column.index !== 3) return;
        const label = String(data.cell.raw || '');
        const rgb = bandRgb(
          label === 'Strong' ? 'strong' : label === 'Growing' ? 'growing' : 'practice'
        );
        const padX = 2.2;
        const x = data.cell.x + padX;
        const w = data.cell.width - padX * 2;
        const h = 5.2;
        const cy = data.cell.y + (data.cell.height - h) / 2;
        doc.setFillColor(...rgb);
        doc.roundedRect(x, cy, w, h, 1.4, 1.4, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.text(label, data.cell.x + data.cell.width / 2, cy + 3.5, {
          align: 'center',
        });
      },
    });

    y = ((doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? y) + 10;
  });

  // ── Focus tips ───────────────────────────────────────────────────────────
  const weak = [...breakdown.domains].sort((a, b) => a.percent - b.percent).slice(0, 3);
  const strong = [...breakdown.domains].sort((a, b) => b.percent - a.percent).slice(0, 2);

  ensureSpace(36);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('COACHING NOTES', M, y);
  y += 6;

  doc.setFillColor(255, 251, 235);
  doc.roundedRect(M, y, cW / 2 - 2, 28, 2, 2, 'F');
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Prioritize next', M + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(7.5);
  weak.forEach((d, i) => {
    doc.text(
      `${i + 1}. ${d.domain} (${d.percent}%)`,
      M + 3,
      y + 11 + i * 5,
      { maxWidth: cW / 2 - 8 }
    );
  });

  doc.setFillColor(236, 253, 245);
  doc.roundedRect(M + cW / 2 + 2, y, cW / 2 - 2, 28, 2, 2, 'F');
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Keep growing', M + cW / 2 + 5, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.setFontSize(7.5);
  strong.forEach((d, i) => {
    doc.text(
      `${i + 1}. ${d.domain} (${d.percent}%)`,
      M + cW / 2 + 5,
      y + 11 + i * 5,
      { maxWidth: cW / 2 - 8 }
    );
  });

  y += 34;

  // ── Footer on each page ──────────────────────────────────────────────────
  const pageCount = (doc as any).getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.line(M, pageH - 10, pageW - M, pageH - 10);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('SmartMathz · SHSAT Readiness Diagnostic', M, pageH - 5);
    doc.text(`Page ${p} of ${pageCount}`, pageW - M, pageH - 5, { align: 'right' });
  }

  const safeName = (studentName || 'Student').replace(/[^\w\s-]/g, '').trim() || 'Student';
  doc.save(`SmartMathz_SHSAT_Report_${safeName.replace(/\s+/g, '_')}.pdf`);
}
