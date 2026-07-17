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
      :[
        { range: "95–100%", label: "Excellent Mastery",           color:  [22, 101, 52]  as [number,number,number] },
        { range: "80–94%",  label: "Strong Performance",          color: [144, 238, 144]  as [number,number,number] },
        { range: "61–79%",  label: "Developing Progress",         color: [220, 237, 200]  as [number,number,number] },
        { range: "31–60%",   label: "Steady Progress",            color: [255, 235, 0]  as [number,number,number] },
        { range: "0–30%",   label: "Foundational Support Needed", color: [255, 105, 180]  as [number,number,number] },
        
        
      ];


    // Row 1: first 3 bands
    const row1 = scaleBands.slice(0, 3);
    const bw3  = (contentW - 4) / 3;
    row1.forEach((b, i) => {
      const bx = margin + i * (bw3 + 2);
      doc.setFillColor(...b.color);
      doc.roundedRect(bx, y, bw3, 13, 1, 1, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7); doc.setFont('helvetica', 'bold');
      doc.text(b.range, bx + bw3 / 2, y + 5, { align: 'center' });
      doc.setFontSize(5.8); doc.setFont('helvetica', 'normal');
      doc.text(doc.splitTextToSize(b.label, bw3 - 4), bx + bw3 / 2, y + 9.5, { align: 'center' });
    });

    // Row 2: last 2 bands
    const row2 = scaleBands.slice(3);
    const bw2  = (contentW - 2) / 2;
    row2.forEach((b, i) => {
      const bx = margin + i * (bw2 + 2);
      doc.setFillColor(...b.color);
      doc.roundedRect(bx, y + 15, bw2, 13, 1, 1, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7); doc.setFont('helvetica', 'bold');
      doc.text(b.range, bx + bw2 / 2, y + 20, { align: 'center' });
      doc.setFontSize(5.8); doc.setFont('helvetica', 'normal');
      doc.text(doc.splitTextToSize(b.label, bw2 - 4), bx + bw2 / 2, y + 24.5, { align: 'center' });
    });

    y += 32;


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