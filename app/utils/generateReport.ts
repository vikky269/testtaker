// app/quiz/[testId]/review/utils/generateReport.ts
// All jsPDF logic extracted from ReviewPage

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  formatDuration,
  getPerformanceBand,
  getSectionPerformanceLabel,
} from "./reviewUtils";

interface ReportParams {
  userName: string;
  userEmail: string;
  gradeParam: string | null | undefined;
  testId: string | string[] | undefined;
  score: string;
  correctAnswersCount: number;
  totalQuestions: number;
  mathScore: number | null;
  elaScore: number | null;
  scienceScore: number | null;
  elaSkipped: boolean;
  isGrade9Or10: boolean;
  mathDuration?: number;
  elaDuration?: number;
  scienceDuration?: number;
  totalDuration?: number;
  times: { math: string; ela: string; science: string; total: string };
}

export const generateReport = (params: ReportParams) => {
  const {
    userName, userEmail, gradeParam, testId,
    score, correctAnswersCount, totalQuestions,
    mathScore, elaScore, scienceScore,
    elaSkipped, isGrade9Or10,
    mathDuration, elaDuration, scienceDuration, totalDuration,
    times,
  } = params;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - margin * 2;

  // ── HEADER ─────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 36, "F");

  const logo = "/logo.png";
  doc.addImage(logo, "PNG", margin, 4, 28, 28);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("SmartMathz", margin + 32, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Evaluation Assessment Report", margin + 32, 20);

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  doc.setFontSize(8);
  doc.text(`Generated: ${dateStr}`, pageW - margin, 14, { align: "right" });

  // ── STUDENT INFO BLOCK ──────────────────────────────────
  let y = 44;

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentW, 22, 2, 2, "F");
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT INFORMATION", margin + 4, y + 6);

  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const col1x = margin + 4;
  const col2x = pageW / 2 + 2;

  doc.setFont("helvetica", "bold"); doc.text("Name:", col1x, y + 13);
  doc.setFont("helvetica", "normal"); doc.text(userName || "Student", col1x + 18, y + 13);

  doc.setFont("helvetica", "bold"); doc.text("Grade:", col2x, y + 13);
  doc.setFont("helvetica", "normal"); doc.text(gradeParam?.toUpperCase() || "N/A", col2x + 18, y + 13);

  doc.setFont("helvetica", "bold"); doc.text("Email:", col1x, y + 19);
  doc.setFont("helvetica", "normal"); doc.text(userEmail || "N/A", col1x + 18, y + 19);

  doc.setFont("helvetica", "bold"); doc.text("Test:", col2x, y + 19);
  doc.setFont("helvetica", "normal");
  const testLabel = testId === "state-test" ? "State Test" : testId === "quiz-assessment" ? "Evaluation" : String(testId);
  doc.text(testLabel, col2x + 14, y + 19);

  y += 28;

  // ── OVERALL PERFORMANCE ─────────────────────────────────
  const overallScore = parseFloat(score);
  const band = getPerformanceBand(overallScore);

  // Score hero box
  doc.setFillColor(...band.color);
  doc.roundedRect(margin, y, 44, 28, 2, 2, "F");
 // doc.setTextColor(255, 255, 255);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${overallScore.toFixed(0)}%`, margin + 22, y + 14, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("OVERALL SCORE", margin + 22, y + 20, { align: "center" });
  doc.text(`${correctAnswersCount}/${totalQuestions} correct`, margin + 22, y + 25, { align: "center" });

  // Performance band label + comment
  const commentX = margin + 48;
  const commentW = contentW - 48;

  doc.setTextColor(...band.color);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(band.label, commentX, y + 7);

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(band.fullComment, commentW);
  doc.text(lines.slice(0, 4), commentX, y + 13);

  y += 34;

  // ── TIME SUMMARY ────────────────────────────────────────
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, "F");
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, "S");

  const timeItems = [
    { label: "Total Time", val: times.total },
    { label: "Math Time", val: times.math },
    { label: "ELA Time",  val: elaSkipped ? "Skipped" : times.ela },
    { label: "Science",   val: times.science },
  ];
  const colW = contentW / timeItems.length;
  timeItems.forEach((item, i) => {
    const cx = margin + colW * i + colW / 2;
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(item.label.toUpperCase(), cx, y + 5, { align: "center" });
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(item.val, cx, y + 11, { align: "center" });
  });

  y += 20;

  // ── SECTION SCORES TABLE ────────────────────────────────
  if (isGrade9Or10) {
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("SECTION BREAKDOWN", margin, y);
    y += 4;

    const sectionRows: any[] = [];

    if (mathScore !== null) {
      const b = getPerformanceBand(mathScore);
      sectionRows.push([
        "Mathematics",
        `${mathScore.toFixed(0)}%`,
        mathDuration ? formatDuration(mathDuration) : "—",
        b.label,
      ]);
    }

    if (elaSkipped) {
      sectionRows.push(["English Language Arts", "—", "Skipped", "Skipped"]);
    } else if (elaScore !== null) {
      const b = getPerformanceBand(elaScore);
      sectionRows.push([
        "English Language Arts",
        `${elaScore.toFixed(0)}%`,
        elaDuration ? formatDuration(elaDuration) : "—",
        b.label,
      ]);
    }

    if (scienceScore !== null) {
      const b = getPerformanceBand(scienceScore);
      sectionRows.push([
        "Science",
        `${scienceScore.toFixed(0)}%`,
        scienceDuration ? formatDuration(scienceDuration) : "—",
        b.label,
      ]);
    }

    autoTable(doc, {
      startY: y,
      head: [["Section", "Score", "Time Taken", "Performance Band"]],
      body: sectionRows,
      theme: "plain",
      headStyles: {
        fillColor: [22, 101, 52],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        cellPadding: 3,
      },
      bodyStyles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 55 },
        1: { halign: "center", cellWidth: 20 },
        2: { halign: "center", cellWidth: 28 },
        3: { cellWidth: contentW - 103 },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          const val = parseFloat(data.cell.raw as string);
          if (!isNaN(val)) {
            if (val >= 80) data.cell.styles.textColor = [22, 101, 52];
            else if (val >= 50) data.cell.styles.textColor = [146, 64, 14];
            else data.cell.styles.textColor = [153, 27, 27];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // ── PERFORMANCE SCALE LEGEND ────────────────────────────
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("PERFORMANCE SCALE", margin, y);
  y += 4;

  const bands = [
    { range: "91–100%", label: "Excellent Mastery",          color: [22, 101, 52]  as [number,number,number] },
    { range: "80–90%",  label: "Strong Performance",          color: [102, 178, 255]  as [number,number,number] },
    { range: "50–79%",  label: "Developing Progress",         color: [255, 235, 102]  as [number,number,number] },
    { range: "0–49%",   label: "Foundational Support Needed", color: [153, 27, 27]  as [number,number,number] },
  ];

  const bw = (contentW - 6) / 4;
  bands.forEach((b, i) => {
    const bx = margin + i * (bw + 2);
    doc.setFillColor(...b.color);
    doc.roundedRect(bx, y, bw, 12, 1, 1, "F");
    //doc.setTextColor(255, 255, 255);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text(b.range, bx + bw / 2, y + 4.5, { align: "center" });
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    const labelLines = doc.splitTextToSize(b.label, bw - 3);
    doc.text(labelLines, bx + bw / 2, y + 8.5, { align: "center" });
  });

  y += 17;

  // ── RECOMMENDATIONS ─────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("RECOMMENDATIONS", margin, y);
  y += 4;

  doc.setFillColor(254, 252, 232);
  doc.roundedRect(margin, y, contentW, 20, 2, 2, "F");
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(margin, y, contentW, 20, 2, 2, "S");
  doc.setTextColor(92, 76, 3);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");

  const recs = isGrade9Or10
    ? [
        mathScore !== null && mathScore < 70 ? "• Focus on strengthening foundational math skills through daily practice." : null,
        !elaSkipped && elaScore !== null && elaScore < 70 ? "• Dedicate time to reading comprehension and vocabulary building." : null,
        scienceScore !== null && scienceScore < 70 ? "• Review core science concepts and practice application-based questions." : null,
        "• Schedule regular review sessions and attempt timed practice tests.",
        "• Consult with your SmartMathz tutor to build a personalised improvement plan.",
      ].filter(Boolean)
    : [
        parseFloat(score) < 70 ? "• Focus on reviewing missed topics and reinforcing foundational concepts." : null,
        "• Attempt additional practice tests to build speed and accuracy.",
        "• Consult with your SmartMathz tutor to identify your strongest areas and gaps.",
      ].filter(Boolean);

  const recText = recs.join("\n");
  const recLines = doc.splitTextToSize(recText, contentW - 8);
  doc.text(recLines.slice(0, 5), margin + 4, y + 6);

  y += 25;

  // ── FOOTER ──────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, pageH - 12, pageW, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Generated by SmartMathz  |  www.smartmathz.com", pageW / 2, pageH - 5, { align: "center" });

  doc.save("SmartMathz_Evaluation_Report.pdf");
};