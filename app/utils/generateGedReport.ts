// app/utils/generateGedReport.ts
// SmartMathz GED Readiness Diagnostic Report — a dedicated, richer PDF than
// the standard evaluation report: hero score badge, per-section proficiency
// bars, full topic-level domain tables, and an auto-generated instructional
// summary — following the design described in Sections 7–9 of the GED
// diagnostic document (topic-level mapping, proficiency framework, and the
// recommended student report output).
//
// Used identically by the student (My Tests page) and the admin
// (GED Results page) — the report is always regenerated from the stored
// questions + answers, never saved as a static file, so it's always accurate.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { GED_SECTIONS, GED_SECTION_LABELS, type GEDSectionKey } from "@/app/data/geddata";
import { computeSectionDomains, getProficiencyLevel, type DomainResult } from "@/app/data/gedDomains";

interface GedQuestion {
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
}

export interface GedReportParams {
  studentName: string;
  studentEmail?: string;
  testDate: string; // pre-formatted, e.g. "Aug 27, 2026"
  questions: GedQuestion[]; // full 80, in original order
  answers: Record<string, string>;
  durations?: {
    totalDuration?: number;
    mathDuration?: number;
    elaDuration?: number;     // RLA
    scienceDuration?: number;
    socialDuration?: number;
  };
}

const SECTION_COLOR: Record<GEDSectionKey, [number, number, number]> = {
  math:    [79, 70, 229],   // indigo
  rla:     [5, 150, 105],   // emerald
  science: [217, 119, 6],   // amber
  social:  [124, 58, 237],  // violet
};
const SECTION_TINT: Record<GEDSectionKey, [number, number, number]> = {
  math:    [238, 242, 255],
  rla:     [236, 253, 245],
  science: [255, 251, 235],
  social:  [245, 243, 255],
};

const fmtDuration = (s?: number) => {
  if (!s || s <= 0) return "—";
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}m ${sec}s`;
};

export function generateGedReport(params: GedReportParams): void {
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

  // ── Per-section computation ────────────────────────────────────────────────
  const sectionResults = GED_SECTIONS.map((sec) => {
    const qs = questions.slice(sec.start, sec.end);
    const correct = qs.filter((q) => answers?.[q.question] === (q.correctAnswer || q.answer)).length;
    const score = qs.length ? Math.round((correct / qs.length) * 100) : 0;
    const domains = computeSectionDomains(sec.key, qs, answers);
    return { key: sec.key, label: GED_SECTION_LABELS[sec.key], correct, total: qs.length, score, domains };
  });

  const totalCorrect = sectionResults.reduce((s, r) => s + r.correct, 0);
  const totalQuestions = sectionResults.reduce((s, r) => s + r.total, 0);
  const overallScore = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const overallBand = getProficiencyLevel(overallScore);

  // Flatten all domains (with their section) for the instructional summary
  const allDomains: (DomainResult & { section: string })[] = sectionResults.flatMap((r) =>
    r.domains.map((d) => ({ ...d, section: r.label }))
  );
  const sortedAsc = [...allDomains].sort((a, b) => a.score - b.score);
  const primaryPriorities = sortedAsc.slice(0, 2);
  const secondaryPriorities = sortedAsc.slice(2, 4);
  const strengths = [...allDomains].sort((a, b) => b.score - a.score).slice(0, 2);

  // ══════════════════════════════════════════════════════════════════════════
  // HEADER — dark green band with a lighter accent strip underneath
  // ══════════════════════════════════════════════════════════════════════════
  doc.setFillColor(26, 46, 5); // #1a2e05
  doc.rect(0, 0, pageW, 34, "F");
  doc.setFillColor(127, 181, 9); // #7FB509 accent line
  doc.rect(0, 34, pageW, 1.2, "F");

  doc.setTextColor(163, 217, 38); // light green
  doc.setFontSize(9); doc.setFont("helvetica", "bold");
  doc.text("SMARTMATHZ", M, 12);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text("GED Readiness Diagnostic Report", M, 21);
  doc.setFontSize(8.5); doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 230, 200);
  doc.text("Student Readiness, Placement & Topic-Level Skills Evaluation", M, 27.5);

  doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${testDate}`, pageW - M, 12, { align: "right" });

  y = 42;

  // ── Student info strip ──────────────────────────────────────────────────────
  doc.setFillColor(248, 250, 245);
  doc.roundedRect(M, y, cW, 16, 2, 2, "F");
  doc.setTextColor(31, 41, 55); doc.setFontSize(9);
  doc.setFont("helvetica", "bold"); doc.text("Student:", M + 4, y + 6.5);
  doc.setFont("helvetica", "normal"); doc.text(studentName || "Student", M + 22, y + 6.5);
  doc.setFont("helvetica", "bold"); doc.text("Email:", M + 4, y + 12.5);
  doc.setFont("helvetica", "normal"); doc.text(studentEmail || "N/A", M + 22, y + 12.5);
   doc.setFont("helvetica", "bold"); doc.text("Total Time:", pageW - M - 45, y + 6.5);
  doc.setFont("helvetica", "normal"); doc.text(fmtDuration(durations?.totalDuration), pageW - M - 4, y + 6.5, { align: "right" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(75, 85, 99);
  doc.text("SmartMathz GED Readiness Diagnostic", M + 4, y + 19.5);

  y += 26;

  // ══════════════════════════════════════════════════════════════════════════
  // HERO — overall score badge (circle) + proficiency band
  // ══════════════════════════════════════════════════════════════════════════
  const badgeR = 17;
  const badgeCx = M + badgeR;
  const badgeCy = y + badgeR;

  doc.setFillColor(...overallBand.color);
  doc.circle(badgeCx, badgeCy, badgeR, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20); doc.setFont("helvetica", "bold");
  doc.text(`${overallScore}%`, badgeCx, badgeCy + 2, { align: "center" });
  doc.setFontSize(6.5); doc.setFont("helvetica", "normal");
  doc.text("OVERALL", badgeCx, badgeCy + 7.5, { align: "center" });

  const heroTextX = M + badgeR * 2 + 8;
  doc.setTextColor(...overallBand.color);
  doc.setFontSize(15); doc.setFont("helvetica", "bold");
  doc.text(overallBand.label, heroTextX, y + 8);
  doc.setTextColor(75, 85, 99); doc.setFontSize(8.5); doc.setFont("helvetica", "normal");
  doc.text(`${totalCorrect} of ${totalQuestions} questions correct across all four GED content areas.`, heroTextX, y + 15, { maxWidth: cW - badgeR * 2 - 12 });
  doc.setFontSize(7.5); doc.setTextColor(120, 128, 140);
  doc.text("This is a SmartMathz readiness diagnostic, not an official GED practice exam.", heroTextX, y + 22);

  y += badgeR * 2 + 8;

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION SCORE BARS — one per GED content area
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

    // Track
    doc.setFillColor(240, 240, 244);
    doc.roundedRect(barX, y, barW, barH, 1.5, 1.5, "F");
    // Fill
    const fillW = Math.max(4, (r.score / 100) * barW);
    doc.setFillColor(...color);
    doc.roundedRect(barX, y, fillW, barH, 1.5, 1.5, "F");

    doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...color);
    doc.text(`${r.score}%`, barX + barW + 4, y + barH - 1);

    y += 10.5;
  });

  y += 4;

  // ══════════════════════════════════════════════════════════════════════════
  // PER-SECTION DOMAIN TABLES — the real diagnostic value
  // ══════════════════════════════════════════════════════════════════════════
  sectionResults.forEach((r) => {
    const color = SECTION_COLOR[r.key];
    const tint = SECTION_TINT[r.key];

    ensureSpace(14 + r.domains.length * 8);

    doc.setFillColor(...tint);
    doc.roundedRect(M, y, cW, 8, 1.5, 1.5, "F");
    doc.setTextColor(...color); doc.setFontSize(8.5); doc.setFont("helvetica", "bold");
    doc.text(`${r.label.toUpperCase()}`, M + 3, y + 5.5);
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(90, 90, 90);
    doc.text(`${r.correct}/${r.total} correct · ${r.score}% overall`, pageW - M - 3, y + 5.5, { align: "right" });
    y += 11;

    autoTable(doc, {
      startY: y,
      head: [["Diagnostic Domain", "Score", "Proficiency"]],
      body: r.domains.map((d) => [d.name, `${d.correct}/${d.total} (${d.score}%)`, d.level]),
      theme: "plain",
      styles: { fontSize: 7.8, cellPadding: 2.4 },
      headStyles: { fillColor: color, textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: tint },
      columnStyles: {
        0: { cellWidth: cW * 0.5, fontStyle: "bold" },
        1: { cellWidth: cW * 0.27, halign: "center" },
        2: { cellWidth: cW * 0.23, halign: "center" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 2) {
          const lvl = String(data.cell.raw);
          const bandColor = getProficiencyLevel(
            lvl === "Strong" ? 90 : lvl === "Proficient" ? 75 : lvl === "Developing" ? 55 : lvl === "Emerging" ? 35 : 10
          ).color;
          data.cell.styles.textColor = bandColor;
          data.cell.styles.fontStyle = "bold";
        }
      },
      margin: { left: M, right: M },
    });

    y = (doc as any).lastAutoTable.finalY + 6;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // INSTRUCTIONAL SUMMARY — auto-generated, mirrors the doc's recommended format
  // ══════════════════════════════════════════════════════════════════════════
  ensureSpace(34);
  doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
  doc.text("INSTRUCTIONAL SUMMARY", M, y);
  y += 5;

  doc.setFillColor(254, 252, 232);
  const summaryLines = [
    `Primary instructional priorities: ${primaryPriorities.map((d) => d.name).join(", ")}.`,
    `Secondary priorities: ${secondaryPriorities.map((d) => d.name).join(", ")}.`,
    `Current strengths: ${strengths.map((d) => d.name).join(", ")}.`,
  ];
  const wrapped = summaryLines.flatMap((line) => doc.splitTextToSize(line, cW - 8));
  const summaryH = wrapped.length * 4.2 + 8;
  doc.roundedRect(M, y, cW, summaryH, 2, 2, "F");
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(M, y, cW, summaryH, 2, 2, "S");
  doc.setTextColor(92, 76, 3); doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(wrapped, M + 4, y + 6);
  y += summaryH + 8;

  // ── Section time breakdown ──────────────────────────────────────────────────
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
      { l: "Math", v: fmtDuration(durations.mathDuration) },
      { l: "RLA", v: fmtDuration(durations.elaDuration) },
      { l: "Science", v: fmtDuration(durations.scienceDuration) },
      { l: "Social Studies", v: fmtDuration(durations.socialDuration) },
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

  // ── Footer, every page ──────────────────────────────────────────────────────
  const pageCount = (doc as any).getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(26, 46, 5);
    doc.rect(0, pageH - 10, pageW, 10, "F");
    doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.text("SmartMathz · GED Readiness Diagnostic · www.smartmathz.com", M, pageH - 4);
    doc.text(`Page ${p} of ${pageCount}`, pageW - M, pageH - 4, { align: "right" });
  }

  const safeName = (studentName || "Student").replace(/\s+/g, "_");
  doc.save(`SmartMathz_GED_Report_${safeName}.pdf`);
}