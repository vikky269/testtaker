// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   formatDuration,
//   getPerformanceBand,
//   getSectionPerformanceLabel,
// } from "./reviewUtils";

// interface ReportParams {
//   userName: string;
//   userEmail: string;
//   gradeParam: string | null | undefined;
//   testId: string | string[] | undefined;
//   score: string;
//   correctAnswersCount: number;
//   totalQuestions: number;
//   mathScore: number | null;
//   elaScore: number | null;
//   scienceScore: number | null;
//   elaSkipped: boolean;
//   isGrade9Or10: boolean;
//   isSat?: boolean;
//   satReadingScore?: number | null;
//   satMathScore?: number | null;
//   satCorrectCount?: number;
//   mathDuration?: number;
//   elaDuration?: number;
//   scienceDuration?: number;
//   totalDuration?: number;
//   times: { math: string; ela: string; science: string; total: string };
// }

// function getSatReadinessBandForReport(correctCount: number): {
//   label: string; fullComment: string; color: [number, number, number];
// } {
//   if (correctCount >= 18) return { label: "Strong — Competitive",    fullComment: "You are on track for a competitive SAT score. Focus on refining pacing and eliminating careless errors to maximise your performance.", color: [22, 101, 52] };
//   if (correctCount >= 14) return { label: "Solid Foundation",         fullComment: "You have a solid foundation. Review the question types you missed — particularly any recurring patterns — and refine your approach with targeted practice.", color: [37, 99, 235] };
//   if (correctCount >= 10) return { label: "Developing",               fullComment: "Core concepts in both the Reading & Writing and Math sections need reinforcement before moving to full-length timed practice tests.", color: [146, 64, 14] };
//   return                         { label: "Foundational Review Needed", fullComment: "A thorough foundational review of key SAT concepts is recommended before attempting timed practice. Start with untimed section drills.", color: [153, 27, 27] };
// }

// export const generateReport = (params: ReportParams) => {
//   const {
//     userName, userEmail, gradeParam, testId,
//     score, correctAnswersCount, totalQuestions,
//     mathScore, elaScore, scienceScore,
//     elaSkipped, isGrade9Or10,
//     isSat = false,
//     satReadingScore, satMathScore, satCorrectCount = 0,
//     mathDuration, elaDuration, scienceDuration, totalDuration,
//     times,
//   } = params;

//   const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//   const pageW = doc.internal.pageSize.getWidth();
//   const pageH = doc.internal.pageSize.getHeight();
//   const margin = 14;
//   const contentW = pageW - margin * 2;

//   // ── HEADER ─────────────────────────────────────────────
//   doc.setFillColor(22, 101, 52);
//   doc.rect(0, 0, pageW, 36, "F");
//   doc.addImage("/logo.png", "PNG", margin, 4, 28, 28);
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(15); doc.setFont("helvetica", "bold");
//   doc.text("SmartMathz", margin + 32, 14);
//   doc.setFontSize(9); doc.setFont("helvetica", "normal");
//   doc.text(isSat ? "SAT Practice Assessment Report" : "Evaluation Assessment Report", margin + 32, 20);
//   doc.setFontSize(8);
//   doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageW - margin, 14, { align: "right" });

//   // ── STUDENT INFO ────────────────────────────────────────
//   let y = 44;
//   doc.setFillColor(240, 253, 244);
//   doc.roundedRect(margin, y, contentW, 22, 2, 2, "F");
//   doc.setTextColor(22, 101, 52); doc.setFontSize(9); doc.setFont("helvetica", "bold");
//   doc.text("STUDENT INFORMATION", margin + 4, y + 6);
//   doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
//   const col1x = margin + 4, col2x = pageW / 2 + 2;
//   doc.setFont("helvetica", "bold"); doc.text("Name:",  col1x, y + 13); doc.setFont("helvetica", "normal"); doc.text(userName || "Student", col1x + 18, y + 13);
//   doc.setFont("helvetica", "bold"); doc.text("Grade:", col2x, y + 13); doc.setFont("helvetica", "normal"); doc.text(gradeParam?.toUpperCase() || "N/A", col2x + 18, y + 13);
//   doc.setFont("helvetica", "bold"); doc.text("Email:", col1x, y + 19); doc.setFont("helvetica", "normal"); doc.text(userEmail || "N/A", col1x + 18, y + 19);
//   doc.setFont("helvetica", "bold"); doc.text("Test:",  col2x, y + 19); doc.setFont("helvetica", "normal");
//   const testLabel = isSat ? `SAT Practice (${gradeParam?.toUpperCase()})` : testId === "state-test" ? "State Test" : testId === "quiz-assessment" ? "Evaluation" : String(testId);
//   doc.text(testLabel, col2x + 14, y + 19);
//   y += 28;

//   // ── OVERALL PERFORMANCE ─────────────────────────────────
//   const overallScore = parseFloat(score);
//   if (isSat) {
//     const satBand = getSatReadinessBandForReport(satCorrectCount);
//     doc.setFillColor(...satBand.color);
//     doc.roundedRect(margin, y, 44, 28, 2, 2, "F");
//     doc.setTextColor(0, 0, 0); doc.setFontSize(18); doc.setFont("helvetica", "bold");
//     doc.text(`${satCorrectCount}/20`, margin + 22, y + 12, { align: "center" });
//     doc.setFontSize(7); doc.setFont("helvetica", "normal");
//     doc.text("CORRECT ANSWERS", margin + 22, y + 19, { align: "center" });
//     doc.text(`${overallScore.toFixed(0)}% overall`, margin + 22, y + 24, { align: "center" });
//     const cx = margin + 48, cw = contentW - 48;
//     doc.setTextColor(...satBand.color); doc.setFontSize(10); doc.setFont("helvetica", "bold");
//     doc.text(satBand.label, cx, y + 7);
//     doc.setTextColor(31, 41, 55); doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
//     doc.text(doc.splitTextToSize(satBand.fullComment, cw).slice(0, 4), cx, y + 13);
//   } else {
//     const band = getPerformanceBand(overallScore);
//     doc.setFillColor(...band.color);
//     doc.roundedRect(margin, y, 44, 28, 2, 2, "F");
//     doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.setFont("helvetica", "bold");
//     doc.text(`${overallScore.toFixed(0)}%`, margin + 22, y + 14, { align: "center" });
//     doc.setFontSize(7); doc.setFont("helvetica", "normal");
//     doc.text("OVERALL SCORE", margin + 22, y + 20, { align: "center" });
//     doc.text(`${correctAnswersCount}/${totalQuestions} correct`, margin + 22, y + 25, { align: "center" });
//     const cx = margin + 48, cw = contentW - 48;
//     doc.setTextColor(...band.color); doc.setFontSize(10); doc.setFont("helvetica", "bold");
//     doc.text(band.label, cx, y + 7);
//     doc.setTextColor(31, 41, 55); doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
//     doc.text(doc.splitTextToSize(band.fullComment, cw).slice(0, 4), cx, y + 13);
//   }
//   y += 34;

//   // ── TIME SUMMARY ────────────────────────────────────────
//   doc.setFillColor(249, 250, 251); doc.roundedRect(margin, y, contentW, 14, 2, 2, "F");
//   doc.setDrawColor(229, 231, 235); doc.roundedRect(margin, y, contentW, 14, 2, 2, "S");
//   const timeItems = isSat
//     ? [{ label: "Total Time", val: times.total }, { label: "R&W Time", val: times.ela }, { label: "Math Time", val: times.math }]
//     : [{ label: "Total Time", val: times.total }, { label: "Math Time", val: times.math }, { label: "ELA Time", val: elaSkipped ? "Skipped" : times.ela }, { label: "Science", val: times.science }];
//   const colW = contentW / timeItems.length;
//   timeItems.forEach((item, i) => {
//     const cx = margin + colW * i + colW / 2;
//     doc.setTextColor(107, 114, 128); doc.setFontSize(6.5); doc.setFont("helvetica", "normal");
//     doc.text(item.label.toUpperCase(), cx, y + 5, { align: "center" });
//     doc.setTextColor(17, 24, 39); doc.setFontSize(8.5); doc.setFont("helvetica", "bold");
//     doc.text(item.val, cx, y + 11, { align: "center" });
//   });
//   y += 20;

//   // ── SECTION SCORES TABLE ────────────────────────────────
//   if (isSat) {
//     doc.setTextColor(17, 24, 39); doc.setFontSize(9); doc.setFont("helvetica", "bold");
//     doc.text("SAT SECTION BREAKDOWN", margin, y); y += 4;
//     const satBandLabel = getSatReadinessBandForReport(satCorrectCount).label;
//     autoTable(doc, {
//       startY: y,
//       head: [["Section", "Score", "Time Taken", "Readiness Band"]],
//       body: [
//         ["Reading & Writing", satReadingScore != null ? `${satReadingScore.toFixed(0)}%` : "—", elaDuration ? formatDuration(elaDuration) : "—", satBandLabel],
//         ["Mathematics",       satMathScore    != null ? `${satMathScore.toFixed(0)}%`    : "—", mathDuration ? formatDuration(mathDuration) : "—", satBandLabel],
//       ],
//       theme: "plain",
//       headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold", cellPadding: 3 },
//       bodyStyles: { fontSize: 8, cellPadding: 3 },
//       alternateRowStyles: { fillColor: [240, 253, 244] },
//       columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 }, 1: { halign: "center", cellWidth: 20 }, 2: { halign: "center", cellWidth: 28 }, 3: { cellWidth: contentW - 103 } },
//       didParseCell: (data) => {
//         if (data.section === "body" && data.column.index === 1) {
//           const val = parseFloat(data.cell.raw as string);
//           if (!isNaN(val)) { data.cell.styles.textColor = val >= 80 ? [22, 101, 52] : val >= 50 ? [146, 64, 14] : [153, 27, 27]; data.cell.styles.fontStyle = "bold"; }
//         }
//       },
//     });
//     y = (doc as any).lastAutoTable.finalY + 6;
//   } else if (isGrade9Or10) {
//     doc.setTextColor(17, 24, 39); doc.setFontSize(9); doc.setFont("helvetica", "bold");
//     doc.text("SECTION BREAKDOWN", margin, y); y += 4;
//     const sectionRows: any[] = [];
//     if (mathScore    !== null) { const b = getPerformanceBand(mathScore);    sectionRows.push(["Mathematics",           `${mathScore.toFixed(0)}%`,    mathDuration    ? formatDuration(mathDuration)    : "—", b.label]); }
//     if (elaSkipped)            { sectionRows.push(["English Language Arts", "—", "Skipped", "Skipped"]); }
//     else if (elaScore !== null){ const b = getPerformanceBand(elaScore);     sectionRows.push(["English Language Arts", `${elaScore.toFixed(0)}%`,     elaDuration     ? formatDuration(elaDuration)     : "—", b.label]); }
//     if (scienceScore !== null) { const b = getPerformanceBand(scienceScore); sectionRows.push(["Science",               `${scienceScore.toFixed(0)}%`, scienceDuration ? formatDuration(scienceDuration) : "—", b.label]); }
//     autoTable(doc, {
//       startY: y, head: [["Section", "Score", "Time Taken", "Performance Band"]], body: sectionRows,
//       theme: "plain",
//       headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontSize: 8, fontStyle: "bold", cellPadding: 3 },
//       bodyStyles: { fontSize: 8, cellPadding: 3 },
//       alternateRowStyles: { fillColor: [240, 253, 244] },
//       columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 }, 1: { halign: "center", cellWidth: 20 }, 2: { halign: "center", cellWidth: 28 }, 3: { cellWidth: contentW - 103 } },
//       didParseCell: (data) => {
//         if (data.section === "body" && data.column.index === 1) {
//           const val = parseFloat(data.cell.raw as string);
//           if (!isNaN(val)) { data.cell.styles.textColor = val >= 80 ? [22, 101, 52] : val >= 50 ? [146, 64, 14] : [153, 27, 27]; data.cell.styles.fontStyle = "bold"; }
//         }
//       },
//     });
//     y = (doc as any).lastAutoTable.finalY + 6;
//   }

//   // ── PERFORMANCE SCALE LEGEND ────────────────────────────
//   // Updated to 5 bands for non-SAT, 4 for SAT
//   // doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
//   // doc.text(isSat ? "SAT READINESS SCALE" : "PERFORMANCE SCALE", margin, y); y += 4;
//   // const bands = isSat
//   //   ? [
//   //       { range: "18–20 correct", label: "Strong",            color: [22, 101, 52]   as [number,number,number] },
//   //       { range: "14–17 correct", label: "Solid Foundation",  color: [37, 99, 235]   as [number,number,number] },
//   //       { range: "10–13 correct", label: "Developing",        color: [146, 64, 14]   as [number,number,number] },
//   //       { range: "Below 10",      label: "Foundational",      color: [153, 27, 27]   as [number,number,number] },
//   //     ]
//   //   : [
//   //       { range: "95–100%", label: "Excellent Mastery",           color: [22, 101, 52]   as [number,number,number] },
//   //       { range: "80–94%",  label: "Strong Performance",           color: [102, 178, 255] as [number,number,number] },
//   //       { range: "61–79%",  label: "Developing Progress",          color: [255, 235, 102] as [number,number,number] },
//   //       { range: "31–60%",  label: "Steady Progress",              color: [250, 204, 21]  as [number,number,number] },
//   //       { range: "0–30%",   label: "Foundational Support Needed",  color: [153, 27, 27]   as [number,number,number] },
//   //     ];
//   // const bw = (contentW - (bands.length - 1) * 2) / bands.length;
//   // bands.forEach((b, i) => {
//   //   const bx = margin + i * (bw + 2);
//   //   doc.setFillColor(...b.color); doc.roundedRect(bx, y, bw, 12, 1, 1, "F");
//   //   doc.setTextColor(0, 0, 0); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
//   //   doc.text(b.range, bx + bw / 2, y + 4.5, { align: "center" });
//   //   doc.setFontSize(5.5); doc.setFont("helvetica", "normal");
//   //   doc.text(doc.splitTextToSize(b.label, bw - 3), bx + bw / 2, y + 8.5, { align: "center" });
//   // });
//   // y += 17;


//   // ── PERFORMANCE / READINESS SCALE LEGEND ───────────────
// doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
// doc.text(isSat ? "SAT READINESS SCALE" : "PERFORMANCE SCALE", margin, y);
// y += 4;

// if (isSat) {
//   // SAT: 4 bands in a single row (fits fine)
//   const satBands = [
//     { range: "18–20 correct", label: "Strong",           color: [22, 101, 52]   as [number,number,number] },
//     { range: "14–17 correct", label: "Solid Foundation", color: [37, 99, 235]   as [number,number,number] },
//     { range: "10–13 correct", label: "Developing",       color: [146, 64, 14]   as [number,number,number] },
//     { range: "Below 10",      label: "Foundational",     color: [153, 27, 27]   as [number,number,number] },
//   ];
//   const bw = (contentW - 6) / 4;
//   satBands.forEach((b, i) => {
//     const bx = margin + i * (bw + 2);
//     doc.setFillColor(...b.color); doc.roundedRect(bx, y, bw, 12, 1, 1, "F");
//     doc.setTextColor(0, 0, 0); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
//     doc.text(b.range, bx + bw / 2, y + 4.5, { align: "center" });
//     doc.setFontSize(5.5); doc.setFont("helvetica", "normal");
//     doc.text(doc.splitTextToSize(b.label, bw - 3), bx + bw / 2, y + 8.5, { align: "center" });
//   });
//   y += 17;
// } else {
//   // Non-SAT: 5 bands — 3 on top row, 2 on bottom to prevent overflow
//   // Colors match the band chart: dark green, light green, very light green, yellow, pink
//   const row1 = [
//     { range: "95–100%", label: "Excellent Mastery", category:"Whizzes",  color: [22, 101, 52]   as [number,number,number] },
//     { range: "80–94%",  label: "Strong Performance", category:"Aces",  color: [144, 238, 144] as [number,number,number] },
//     { range: "61–79%",  label: "Developing Progress", category:"Explorers",  color: [220, 237, 200] as [number,number,number] },
//   ];
//   const row2 = [
//     { range: "31–60%", label: "Steady Progress",   category:"Risers",            color: [255, 235, 0]   as [number,number,number] },
//     { range: "0–30%",  label: "Foundational Support Needed", category:"Adapters",  color: [255, 105, 180] as [number,number,number] },
//   ];

//   const bw3 = (contentW - 4) / 3;
//   row1.forEach((b, i) => {
//     const bx = margin + i * (bw3 + 2);
//     doc.setFillColor(...b.color); doc.roundedRect(bx, y, bw3, 13, 1, 1, "F");
//     doc.setTextColor(0, 0, 0); doc.setFontSize(7); doc.setFont("helvetica", "bold");
//     doc.text(b.range, bx + bw3 / 2, y + 5, { align: "center" });
//     doc.setFontSize(5.8); doc.setFont("helvetica", "normal");
//     doc.text(doc.splitTextToSize(b.label, bw3 - 4), bx + bw3 / 2, y + 9.5, { align: "center" });
//   });

//   const bw2 = (contentW - 2) / 2;
//   row2.forEach((b, i) => {
//     const bx = margin + i * (bw2 + 2);
//     doc.setFillColor(...b.color); doc.roundedRect(bx, y + 15, bw2, 13, 1, 1, "F");
//     doc.setTextColor(0, 0, 0); doc.setFontSize(7); doc.setFont("helvetica", "bold");
//     doc.text(b.range, bx + bw2 / 2, y + 20, { align: "center" });
//     doc.setFontSize(5.8); doc.setFont("helvetica", "normal");
//     doc.text(doc.splitTextToSize(b.label, bw2 - 4), bx + bw2 / 2, y + 24.5, { align: "center" });
//   });

//   y += 32;
// }



//   // ── RECOMMENDATIONS ─────────────────────────────────────
//   doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
//   doc.text("RECOMMENDATIONS", margin, y); y += 4;
//   doc.setFillColor(254, 252, 232); doc.roundedRect(margin, y, contentW, 24, 2, 2, "F");
//   doc.setDrawColor(234, 179, 8);   doc.roundedRect(margin, y, contentW, 24, 2, 2, "S");
//   doc.setTextColor(92, 76, 3); doc.setFontSize(7.5); doc.setFont("helvetica", "normal");

//   let recs: (string | null)[];
//   if (isSat) {
//     recs = [
//       satReadingScore != null && satReadingScore < 70 ? "• Focus on passage comprehension, grammar rules, and vocabulary in context for the Reading & Writing section." : null,
//       satMathScore    != null && satMathScore    < 70 ? "• Review algebra fundamentals, problem-solving strategies, and learn when to use your calculator effectively." : null,
//       satCorrectCount < 14 ? "• Start with untimed section drills to build understanding before attempting full timed practice." : null,
//       "• Practice full-length timed SAT sections regularly to build stamina, pacing, and test-day confidence.",
//       "• Consult with your SmartMathz tutor to build a personalised SAT improvement plan.",
//     ].filter(Boolean);
//   } else if (isGrade9Or10) {
//     recs = [
//       mathScore    !== null && mathScore    < 61 ? "• Focus on strengthening foundational math skills through daily practice." : null,
//       !elaSkipped && elaScore !== null && elaScore < 61 ? "• Dedicate time to reading comprehension and vocabulary building." : null,
//       scienceScore !== null && scienceScore < 61 ? "• Review core science concepts and practice application-based questions." : null,
//       "• Schedule regular review sessions and attempt timed practice tests.",
//       "• Consult with your SmartMathz tutor to build a personalised improvement plan.",
//     ].filter(Boolean);
//   } else {
//     recs = [
//       parseFloat(score) < 61 ? "• Focus on reviewing missed topics and reinforcing foundational concepts." : null,
//       "• Attempt additional practice tests to build speed and accuracy.",
//       "• Consult with your SmartMathz tutor to identify your strongest areas and gaps.",
//     ].filter(Boolean);
//   }

//   doc.text(doc.splitTextToSize((recs as string[]).join("\n"), contentW - 8).slice(0, 6), margin + 4, y + 6);
//   y += 29;

//   // ── FOOTER ──────────────────────────────────────────────
//   doc.setFillColor(22, 101, 52); doc.rect(0, pageH - 12, pageW, 12, "F");
//   doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont("helvetica", "normal");
//   doc.text("Generated by SmartMathz  |  www.smartmathz.com", pageW / 2, pageH - 5, { align: "center" });

//   doc.save("SmartMathz_Evaluation_Report.pdf");
// };




// app/quiz/[testId]/review/utils/generateReport.ts
// Generates the SmartMathz evaluation PDF.
// - generateReport(params)         → saves PDF to disk (existing behaviour)
// - generateReportBase64(params)   → returns base64 string (for email attachment)

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDuration, getPerformanceBand } from "./reviewUtils";

interface ReportParams {
  userName:            string;
  userEmail:           string;
  gradeParam:          string | null | undefined;
  testId:              string | string[];
  score:               string;
  correctAnswersCount: number;
  totalQuestions:      number;
  mathScore:           number | null;
  elaScore:            number | null;
  scienceScore:        number | null;
  elaSkipped:          boolean;
  isGrade9Or10:        boolean;
  isSat?:              boolean;
  mathDuration?:       number;
  elaDuration?:        number;
  scienceDuration?:    number;
  totalDuration?:      number;
  times: { math: string; ela: string; science: string; total: string };
}

// ── Internal builder — returns the jsPDF doc ──────────────────────────────────
const buildDoc = (params: ReportParams): jsPDF => {
  const {
    userName, userEmail, gradeParam, testId,
    score, correctAnswersCount, totalQuestions,
    mathScore, elaScore, scienceScore,
    elaSkipped, isGrade9Or10, isSat = false,
    mathDuration, elaDuration, scienceDuration,
    times,
  } = params;

  const doc      = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW    = doc.internal.pageSize.getWidth();
  const pageH    = doc.internal.pageSize.getHeight();
  const margin   = 14;
  const contentW = pageW - margin * 2;

  // ── HEADER ──────────────────────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 36, "F");

  try { doc.addImage("/logo.png", "PNG", margin, 4, 28, 28); } catch {}

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15); doc.setFont("helvetica", "bold");
  doc.text("SmartMathz", margin + 32, 14);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(isSat ? "SAT Practice Assessment Report" : "Evaluation Assessment Report", margin + 32, 20);

  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.setFontSize(8);
  doc.text(`Generated: ${dateStr}`, pageW - margin, 14, { align: "right" });

  // ── STUDENT INFO ─────────────────────────────────────────────────────────────
  let y = 44;

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentW, 22, 2, 2, "F");
  doc.setTextColor(22, 101, 52); doc.setFontSize(9); doc.setFont("helvetica", "bold");
  doc.text("STUDENT INFORMATION", margin + 4, y + 6);

  const col1x = margin + 4, col2x = pageW / 2 + 2;
  doc.setTextColor(30, 30, 30); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);

  doc.setFont("helvetica", "bold"); doc.text("Name:",  col1x,  y + 13);
  doc.setFont("helvetica", "normal"); doc.text(userName || "Student", col1x + 18, y + 13);
  doc.setFont("helvetica", "bold"); doc.text("Grade:", col2x,  y + 13);
  doc.setFont("helvetica", "normal"); doc.text(gradeParam?.toUpperCase() || "N/A", col2x + 18, y + 13);

  doc.setFont("helvetica", "bold"); doc.text("Email:", col1x,  y + 19);
  doc.setFont("helvetica", "normal"); doc.text(userEmail || "N/A", col1x + 18, y + 19);
  doc.setFont("helvetica", "bold"); doc.text("Test:",  col2x,  y + 19);
  doc.setFont("helvetica", "normal");
  const testLabel = testId === "state-test" ? "State Test"
    : testId === "quiz-assessment" ? "Evaluation"
    : isSat ? "SAT Practice" : String(testId);
  doc.text(testLabel, col2x + 14, y + 19);

  y += 28;

  // ── OVERALL SCORE ─────────────────────────────────────────────────────────────
  const overallScore = parseFloat(score);
  const band         = getPerformanceBand(overallScore);

  doc.setFillColor(...band.color);
  doc.roundedRect(margin, y, 44, 28, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22); doc.setFont("helvetica", "bold");
  doc.text(`${overallScore.toFixed(0)}%`, margin + 22, y + 14, { align: "center" });
  doc.setFontSize(7); doc.setFont("helvetica", "normal");
  doc.text("OVERALL SCORE", margin + 22, y + 20, { align: "center" });
  doc.text(`${correctAnswersCount}/${totalQuestions} correct`, margin + 22, y + 25, { align: "center" });

  const commentX = margin + 48;
  const commentW = contentW - 48;
  doc.setTextColor(...band.color); doc.setFontSize(10); doc.setFont("helvetica", "bold");
  doc.text(band.label, commentX, y + 7);
  doc.setTextColor(31, 41, 55); doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(band.fullComment, commentW).slice(0, 4), commentX, y + 13);

  y += 34;

  // ── TIME STRIP ────────────────────────────────────────────────────────────────
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, "F");
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, "S");

  const timeItems = isSat
    ? [
        { label: "Total Time",        val: times.total },
        { label: "Reading & Writing", val: times.ela   },
        { label: "Math Time",         val: times.math  },
      ]
    : [
        { label: "Total Time", val: times.total },
        { label: "Math Time",  val: times.math  },
        { label: "ELA Time",   val: elaSkipped ? "Skipped" : times.ela },
        { label: "Science",    val: times.science },
      ];

  const colW = contentW / timeItems.length;
  timeItems.forEach((item, i) => {
    const cx = margin + colW * i + colW / 2;
    doc.setTextColor(107, 114, 128); doc.setFontSize(6.5); doc.setFont("helvetica", "normal");
    doc.text(item.label.toUpperCase(), cx, y + 5,  { align: "center" });
    doc.setTextColor(17, 24, 39);    doc.setFontSize(8.5); doc.setFont("helvetica", "bold");
    doc.text(item.val,                cx, y + 11, { align: "center" });
  });

  y += 20;

  // ── SECTION BREAKDOWN ─────────────────────────────────────────────────────────
  if (isGrade9Or10 || isSat) {
    doc.setTextColor(17, 24, 39); doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.text("SECTION BREAKDOWN", margin, y);
    y += 4;

    const rows: any[] = [];

    if (isSat) {
      if (elaScore   !== null) rows.push(["Reading & Writing", `${elaScore.toFixed(0)}%`,   elaDuration  ? formatDuration(elaDuration)  : "—", getPerformanceBand(elaScore).label]);
      if (mathScore  !== null) rows.push(["Mathematics",       `${mathScore.toFixed(0)}%`,   mathDuration ? formatDuration(mathDuration) : "—", getPerformanceBand(mathScore).label]);
    } else {
      if (mathScore  !== null) rows.push(["Mathematics",           `${mathScore.toFixed(0)}%`,    mathDuration    ? formatDuration(mathDuration)    : "—", getPerformanceBand(mathScore).label]);
      if (elaSkipped)          rows.push(["English Language Arts", "—",                          "Skipped",                                                "Skipped"]);
      else if (elaScore !== null) rows.push(["English Language Arts", `${elaScore.toFixed(0)}%`, elaDuration ? formatDuration(elaDuration) : "—", getPerformanceBand(elaScore).label]);
      if (scienceScore !== null)  rows.push(["Science",              `${scienceScore.toFixed(0)}%`, scienceDuration ? formatDuration(scienceDuration) : "—", getPerformanceBand(scienceScore).label]);
    }

    autoTable(doc, {
      startY: y,
      head: [["Section", "Score", "Time Taken", "Performance Band"]],
      body: rows,
      theme: "plain",
      headStyles: { fillColor: [22,101,52], textColor: [255,255,255], fontSize: 8, fontStyle: "bold", cellPadding: 3 },
      bodyStyles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240,253,244] },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 55 },
        1: { halign: "center", cellWidth: 20 },
        2: { halign: "center", cellWidth: 28 },
        3: { cellWidth: contentW - 103 },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          const v = parseFloat(data.cell.raw as string);
          if (!isNaN(v)) {
            data.cell.styles.textColor = v >= 80 ? [22,101,52] : v >= 50 ? [146,64,14] : [153,27,27];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // ── PERFORMANCE SCALE ─────────────────────────────────────────────────────────
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
  doc.text(isSat ? "SAT READINESS SCALE" : "PERFORMANCE SCALE", margin, y);
  y += 4;

  const scaleBands = isSat
    ? [
        { range: "18–20 correct", label: "Strong",             color: [22,101,52]  as [number,number,number] },
        { range: "14–17 correct", label: "Solid Foundation",   color: [21,128,61]  as [number,number,number] },
        { range: "10–13 correct", label: "Developing",         color: [146,64,14]  as [number,number,number] },
        { range: "Below 10",      label: "Foundational Review",color: [153,27,27]  as [number,number,number] },
      ]
    : [
        { range: "91–100%", label: "Excellent Mastery",          color: [22,101,52]  as [number,number,number] },
        { range: "80–90%",  label: "Strong Performance",          color: [21,128,61]  as [number,number,number] },
        { range: "50–79%",  label: "Developing Progress",         color: [146,64,14]  as [number,number,number] },
        { range: "0–49%",   label: "Foundational Support Needed", color: [153,27,27]  as [number,number,number] },
      ];

  const bw = (contentW - 6) / 4;
  scaleBands.forEach((b, i) => {
    const bx = margin + i * (bw + 2);
    doc.setFillColor(...b.color);
    doc.roundedRect(bx, y, bw, 12, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
    doc.text(b.range, bx + bw / 2, y + 4.5, { align: "center" });
    doc.setFontSize(5.5); doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(b.label, bw - 3), bx + bw / 2, y + 8.5, { align: "center" });
  });

  y += 17;

  // ── RECOMMENDATIONS ───────────────────────────────────────────────────────────
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(17, 24, 39);
  doc.text("RECOMMENDATIONS", margin, y);
  y += 4;

  doc.setFillColor(254, 252, 232);
  doc.roundedRect(margin, y, contentW, 20, 2, 2, "F");
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(margin, y, contentW, 20, 2, 2, "S");
  doc.setTextColor(92, 76, 3); doc.setFontSize(7.5); doc.setFont("helvetica", "normal");

  const recs = isGrade9Or10
    ? [
        mathScore  !== null && mathScore  < 70 ? "• Focus on strengthening foundational math skills through daily practice." : null,
        !elaSkipped && elaScore !== null && elaScore < 70 ? "• Dedicate time to reading comprehension and vocabulary building." : null,
        scienceScore !== null && scienceScore < 70 ? "• Review core science concepts and practice application-based questions." : null,
        "• Schedule regular review sessions and attempt timed practice tests.",
        "• Consult with your SmartMathz tutor to build a personalised improvement plan.",
      ].filter(Boolean)
    : isSat
    ? [
        "• Attempt at least two full-length SAT practice tests under timed conditions.",
        "• Focus on time management — each section has a strict time limit.",
        overallScore < 70 ? "• Review core concepts in both Reading & Writing and Mathematics." : null,
        "• Consult with your SmartMathz tutor for a personalised SAT prep plan.",
      ].filter(Boolean)
    : [
        overallScore < 70 ? "• Focus on reviewing missed topics and reinforcing foundational concepts." : null,
        "• Attempt additional practice tests to build speed and accuracy.",
        "• Consult with your SmartMathz tutor to identify your strongest areas and gaps.",
      ].filter(Boolean);

  doc.text(doc.splitTextToSize((recs as string[]).join("\n"), contentW - 8).slice(0, 5), margin + 4, y + 6);

  // ── FOOTER ────────────────────────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, pageH - 12, pageW, 12, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont("helvetica", "normal");
  doc.text("Generated by SmartMathz  |  www.smartmathz.com", pageW / 2, pageH - 5, { align: "center" });

  return doc;
};

// ── Public: save to disk (existing behaviour — no change needed in review page) ──
export const generateReport = (params: ReportParams): void => {
  const doc = buildDoc(params);
  doc.save("SmartMathz_Evaluation_Report.pdf");
};

// ── Public: return base64 string (used for email attachment) ──────────────────
export const generateReportBase64 = (params: ReportParams): string => {
  const doc = buildDoc(params);
  // jsPDF output('datauristring') returns "data:application/pdf;base64,<b64>"
  // We strip the prefix to get just the raw base64
  const dataUri  = doc.output("datauristring");
  const base64   = dataUri.split(",")[1];
  return base64;
};