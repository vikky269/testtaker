// app/utils/generateSatReport.ts
// SmartMathz SAT Readiness Report — same visual language as the GED report
// (hero score badge, section bars, domain tables, auto-generated summary),
// scaled to SAT's 2-section / 8-domain structure.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SAT_SECTIONS, SAT_SECTION_LABELS, SAT_DOMAIN_TAGS, SAT_DOMAIN_LABELS, type SATSectionKey } from "@/app/data/satdata";

interface SatQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
}

export interface SatReportParams {
  studentName: string;
  studentEmail?: string;
  testDate: string;
  questions: SatQuestion[];
  answers: Record<string, string>;
  durations?: { totalDuration?: number; mathDuration?: number; elaDuration?: number };
}

const SECTION_COLOR: Record<SATSectionKey, [number, number, number]> = {
  reading: [5, 150, 105],  // emerald
  math:    [79, 70, 229],  // indigo
};
const SECTION_TINT: Record<SATSectionKey, [number, number, number]> = {
  reading: [236, 253, 245],
  math:    [238, 242, 255],
};

function getReadinessBand(correctOf20: number): { label: string; color: [number, number, number] } {
  if (correctOf20 >= 18) return { label: "Strong", color: [22, 101, 52] };
  if (correctOf20 >= 14) return { label: "Solid Foundation", color: [37, 99, 235] };
  if (correctOf20 >= 10) return { label: "Developing", color: [217, 119, 6] };
  return { label: "Foundational", color: [185, 28, 28] };
}

const fmtDuration = (s?: number) => {
  if (!s || s <= 0) return "—";
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}m ${sec}s`;
};

export function generateSatReport(params: SatReportParams): void {
  const { studentName, studentEmail, testDate, questions, answers, durations } = params;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 14;
  const cW = pageW - M * 2;
  const FOOTER_CLEAR = 12;
  let y = 0;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - FOOTER_CLEAR) { doc.addPage(); y = 18; }
  };

  const isCorrect = (q: SatQuestion) => answers?.[q.question] === (q.correctAnswer || q.answer);

  // ── Per-section + per-domain computation ──────────────────────────────────
  const sectionResults = SAT_SECTIONS.map((sec) => {
    const qs = questions.slice(sec.start, sec.end);
    const correct = qs.filter(isCorrect).length;
    const score = qs.length ? Math.round((correct / qs.length) * 100) : 0;

    const domainMap: Record<string, { correct: number; total: number }> = {};
    qs.forEach((q) => {
      const domain = SAT_DOMAIN_TAGS[q.id] ?? "other";
      if (!domainMap[domain]) domainMap[domain] = { correct: 0, total: 0 };
      domainMap[domain].total += 1;
      if (isCorrect(q)) domainMap[domain].correct += 1;
    });
    const domains = Object.entries(domainMap).map(([key, v]) => ({
      name: SAT_DOMAIN_LABELS[key] ?? key,
      correct: v.correct, total: v.total,
      score: v.total ? Math.round((v.correct / v.total) * 100) : 0,
    }));

    return { key: sec.key, label: SAT_SECTION_LABELS[sec.key], correct, total: qs.length, score, domains };
  });

  const totalCorrect = sectionResults.reduce((s, r) => s + r.correct, 0);
  const totalQuestions = sectionResults.reduce((s, r) => s + r.total, 0);
  const overallScore = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const band = getReadinessBand(totalCorrect);

  const allDomains = sectionResults.flatMap((r) => r.domains.map((d) => ({ ...d, section: r.label })));
  const weakest = [...allDomains].sort((a, b) => a.score - b.score).slice(0, 2);
  const strongest = [...allDomains].sort((a, b) => b.score - a.score).slice(0, 2);

  // ══════════════════════════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════════════════════════
  doc.setFillColor(26, 46, 5);
  doc.rect(0, 0, pageW, 34, "F");
  doc.setFillColor(127, 181, 9);
  doc.rect(0, 34, pageW, 1.2, "F");

  doc.setTextColor(163, 217, 38);
  doc.setFontSize(9); doc.setFont("helvetica", "bold");
  doc.text("SMARTMATHZ", M, 12);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text("SAT Readiness Diagnostic Report", M, 21);
  doc.setFontSize(8.5); doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 230, 200);
  doc.text("Reading & Writing and Math Readiness Assessment", M, 27.5);

  doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${testDate}`, pageW - M, 12, { align: "right" });

  y = 42;

  doc.setFillColor(248, 250, 245);
  doc.roundedRect(M, y, cW, 21, 2, 2, "F");
  doc.setTextColor(31, 41, 55); doc.setFontSize(9);
  doc.setFont("helvetica", "bold"); doc.text("Student:", M + 4, y + 6.5);
  doc.setFont("helvetica", "normal"); doc.text(studentName || "Student", M + 22, y + 6.5);
  doc.setFont("helvetica", "bold"); doc.text("Email:", M + 4, y + 12.5);
  doc.setFont("helvetica", "normal"); doc.text(studentEmail || "N/A", M + 22, y + 12.5);
  doc.setFont("helvetica", "bold"); doc.text("Total Time:", pageW - M - 45, y + 6.5);
  doc.setFont("helvetica", "normal"); doc.text(fmtDuration(durations?.totalDuration), pageW - M - 4, y + 6.5, { align: "right" });
  doc.setFontSize(7); doc.setTextColor(75, 85, 99);
  doc.text("SmartMathz SAT Readiness Diagnostic", M + 4, y + 19.5);

  y += 26;

  // ══════════════════════════════════════════════════════════════════════════
  // HERO — overall score badge
  // ══════════════════════════════════════════════════════════════════════════
  const badgeR = 17;
  const badgeCx = M + badgeR;
  const badgeCy = y + badgeR;

  doc.setFillColor(...band.color);
  doc.circle(badgeCx, badgeCy, badgeR, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20); doc.setFont("helvetica", "bold");
  doc.text(`${overallScore}%`, badgeCx, badgeCy + 2, { align: "center" });
  doc.setFontSize(6.5); doc.setFont("helvetica", "normal");
  doc.text("OVERALL", badgeCx, badgeCy + 7.5, { align: "center" });

  const heroTextX = M + badgeR * 2 + 8;
  doc.setTextColor(...band.color);
  doc.setFontSize(15); doc.setFont("helvetica", "bold");
  doc.text(band.label, heroTextX, y + 8);
  doc.setTextColor(75, 85, 99); doc.setFontSize(8.5); doc.setFont("helvetica", "normal");
  doc.text(`${totalCorrect} of ${totalQuestions} questions correct across Reading & Writing and Math.`, heroTextX, y + 15, { maxWidth: cW - badgeR * 2 - 12 });
  doc.setFontSize(7.5); doc.setTextColor(120, 128, 140);
  doc.text("This is a SmartMathz readiness diagnostic, not an official College Board SAT.", heroTextX, y + 22);

  y += badgeR * 2 + 8;

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION SCORE BARS
  // ══════════════════════════════════════════════════════════════════════════
  ensureSpace(6 + sectionResults.length * 11);
  doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
  doc.text("SECTION SCORES", M, y);
  y += 6;

  const barX = M + 48;
  const barW = cW - 48 - 18;
  const barH = 5.5;

  sectionResults.forEach((r) => {
    const color = SECTION_COLOR[r.key];
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(55, 65, 81);
    doc.text(r.label, M, y + barH - 1, { maxWidth: 44 });

    doc.setFillColor(240, 240, 244);
    doc.roundedRect(barX, y, barW, barH, 1.5, 1.5, "F");
    const fillW = Math.max(4, (r.score / 100) * barW);
    doc.setFillColor(...color);
    doc.roundedRect(barX, y, fillW, barH, 1.5, 1.5, "F");

    doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...color);
    doc.text(`${r.score}%`, barX + barW + 4, y + barH - 1);

    y += 10.5;
  });

  y += 4;

  // ══════════════════════════════════════════════════════════════════════════
  // PER-SECTION DOMAIN TABLES
  // ══════════════════════════════════════════════════════════════════════════
  sectionResults.forEach((r) => {
    const color = SECTION_COLOR[r.key];
    const tint = SECTION_TINT[r.key];

    ensureSpace(14 + r.domains.length * 8);

    doc.setFillColor(...tint);
    doc.roundedRect(M, y, cW, 8, 1.5, 1.5, "F");
    doc.setTextColor(...color); doc.setFontSize(8.5); doc.setFont("helvetica", "bold");
    doc.text(r.label.toUpperCase(), M + 3, y + 5.5);
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(90, 90, 90);
    doc.text(`${r.correct}/${r.total} correct · ${r.score}% overall`, pageW - M - 3, y + 5.5, { align: "right" });
    y += 11;

    autoTable(doc, {
      startY: y,
      head: [["Domain", "Score", "Correct"]],
      body: r.domains.map((d) => [d.name, `${d.score}%`, `${d.correct}/${d.total}`]),
      theme: "plain",
      styles: { fontSize: 7.8, cellPadding: 2.4 },
      headStyles: { fillColor: color, textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: tint },
      columnStyles: {
        0: { cellWidth: cW * 0.55, fontStyle: "bold" },
        1: { cellWidth: cW * 0.22, halign: "center" },
        2: { cellWidth: cW * 0.23, halign: "center" },
      },
      margin: { left: M, right: M },
    });

    y = (doc as any).lastAutoTable.finalY + 6;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  ensureSpace(34);
  doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
  doc.text("STUDY PRIORITIES", M, y);
  y += 5;

  doc.setFillColor(254, 252, 232);
  const summaryLines = [
    `Focus areas: ${weakest.map((d) => d.name).join(", ")}.`,
    `Current strengths: ${strongest.map((d) => d.name).join(", ")}.`,
    `Recommendation: attempt a full-length timed practice test once the focus-area domains above show consistent improvement.`,
  ];
  const wrapped = summaryLines.flatMap((line) => doc.splitTextToSize(line, cW - 8));
  const summaryH = wrapped.length * 4.2 + 8;
  doc.roundedRect(M, y, cW, summaryH, 2, 2, "F");
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(M, y, cW, summaryH, 2, 2, "S");
  doc.setTextColor(92, 76, 3); doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(wrapped, M + 4, y + 6);
  y += summaryH + 8;

  if (durations) {
    ensureSpace(18);
    doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
    doc.text("TIME BREAKDOWN", M, y);
    y += 5;
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(M, y, cW, 13, 2, 2, "F");
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(M, y, cW, 13, 2, 2, "S");
    const items = [
      { l: "Reading & Writing", v: fmtDuration(durations.elaDuration) },
      { l: "Math", v: fmtDuration(durations.mathDuration) },
      { l: "Total", v: fmtDuration(durations.totalDuration) },
    ];
    const colW = cW / items.length;
    items.forEach((it, i) => {
      const cx = M + colW * i + colW / 2;
      doc.setFontSize(6.5); doc.setTextColor(107, 114, 128);
      doc.text(it.l.toUpperCase(), cx, y + 5, { align: "center" });
      doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
      doc.text(it.v, cx, y + 10.5, { align: "center" });
      doc.setFont("helvetica", "normal");
    });
    y += 19;
  }

  const pageCount = (doc as any).getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(26, 46, 5);
    doc.rect(0, pageH - 10, pageW, 10, "F");
    doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.text("SmartMathz · SAT Readiness Diagnostic · www.smartmathz.com", M, pageH - 4);
    doc.text(`Page ${p} of ${pageCount}`, pageW - M, pageH - 4, { align: "right" });
  }

  const safeName = (studentName || "Student").replace(/\s+/g, "_");
  doc.save(`SmartMathz_SAT_Report_${safeName}.pdf`);
}