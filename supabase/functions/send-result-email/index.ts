// supabase/functions/send-result-email/index.ts
// Receives a base64-encoded PDF and emails it to the student as an attachment
// Sends from info@smartmathz.com via Gmail SMTP

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      studentName,
      studentEmail,
      grade,
      testType,
      overallScore,
      mathScore,
      elaScore,
      scienceScore,
      totalTime,
      isSat,
      pdfBase64,        // base64-encoded PDF string
      pdfFileName,      // e.g. "SmartMathz_Evaluation_Report.pdf"
    } = await req.json();

    if (!studentEmail || !studentName || !pdfBase64) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const GMAIL_USER = Deno.env.get("GMAIL_USER");
    const GMAIL_PASS = Deno.env.get("GMAIL_PASS");

    if (!GMAIL_USER || !GMAIL_PASS) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ── Score band helper ──────────────────────────────────────────────────
    const getBand = (score: number, isSatMode = false): { label: string; color: string } => {
      if (isSatMode) {
        if (score >= 90) return { label: "Strong",            color: "#16a34a" };
        if (score >= 70) return { label: "Solid Foundation",  color: "#2563eb" };
        if (score >= 50) return { label: "Developing",        color: "#d97706" };
        return               { label: "Foundational Review", color: "#dc2626" };
      }
      if (score >= 91) return { label: "Excellent Mastery",          color: "#16a34a" };
      if (score >= 80) return { label: "Strong Performance",          color: "#2563eb" };
      if (score >= 50) return { label: "Developing Progress",         color: "#d97706" };
      return               { label: "Foundational Support Needed",  color: "#dc2626" };
    };

    const overall  = parseFloat(overallScore);
    const band     = getBand(overall, isSat);
    const year     = new Date().getFullYear();
    const dateStr  = new Date().toLocaleDateString("en-US", { dateStyle: "long" });
    const fileName = pdfFileName ?? "SmartMathz_Evaluation_Report.pdf";

    // ── Section rows for email body ────────────────────────────────────────
    const sections = isSat
      ? [ { label: "Reading & Writing", score: elaScore  },
          { label: "Mathematics",       score: mathScore } ]
      : [ { label: "Mathematics",           score: mathScore   },
          { label: "English Language Arts", score: elaScore    },
          { label: "Science",               score: scienceScore } ];

    const sectionHTML = sections
      .filter(s => s.score != null)
      .map((s, i) => {
        const sc    = parseFloat(s.score);
        const color = sc >= 80 ? "#16a34a" : sc >= 50 ? "#d97706" : "#dc2626";
        const bg    = i % 2 === 0 ? "#f8fdf0" : "#ffffff";
        return `
          <tr style="background:${bg};">
            <td style="padding:10px 16px;font-size:13px;font-weight:bold;color:#333;border-bottom:1px solid #f0f0f0;">${s.label}</td>
            <td style="padding:10px 16px;font-size:14px;font-weight:bold;color:${color};text-align:center;border-bottom:1px solid #f0f0f0;">${sc.toFixed(1)}%</td>
            <td style="padding:10px 16px;font-size:12px;color:#777;text-align:center;border-bottom:1px solid #f0f0f0;">${getBand(sc, isSat).label}</td>
          </tr>`;
      }).join("");

    // ── Connect to Gmail SMTP ──────────────────────────────────────────────
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: GMAIL_USER,
      password: GMAIL_PASS,
    });

    // ── Send email with PDF attachment ─────────────────────────────────────
    await client.send({
      from:    `SmartMathz <${GMAIL_USER}>`,
      to:      studentEmail,
      subject: `📊 Your SmartMathz Results — ${overall.toFixed(1)}% Overall`,
      content: "Please find your SmartMathz evaluation results attached.",

      // HTML body
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.10);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a2e05 0%,#3a7a12 100%);padding:32px 28px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:-0.5px;">SmartMathz</h1>
    <p style="color:rgba(255,255,255,0.65);margin:5px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Evaluation Results</p>
  </div>

  <!-- Greeting -->
  <div style="padding:30px 28px 0;">
    <h2 style="margin:0 0 8px;font-size:18px;color:#1a2e05;">Hi ${studentName},</h2>
    <p style="font-size:14px;color:#555;line-height:1.8;margin:0;">
      Here are your results for the <strong>${isSat ? "SAT Practice" : "SmartMathz Evaluation"}</strong> assessment
      completed on <strong>${dateStr}</strong>.
      Your full report is attached to this email as a PDF.
    </p>
  </div>

  <!-- Overall score hero -->
  <div style="margin:24px 28px 0;">
    <div style="background:linear-gradient(135deg,${band.color}18,${band.color}08);
                border:2px solid ${band.color}35;border-radius:12px;padding:22px;text-align:center;">
      <p style="margin:0;font-size:11px;font-weight:bold;color:${band.color};text-transform:uppercase;letter-spacing:1.5px;">Overall Score</p>
      <p style="margin:10px 0 6px;font-size:48px;font-weight:bold;color:${band.color};line-height:1;">${overall.toFixed(1)}%</p>
      <p style="margin:0;font-size:14px;font-weight:bold;color:#444;">${band.label}</p>
      ${grade        ? `<p style="margin:6px 0 0;font-size:12px;color:#888;">Grade: ${grade}</p>` : ""}
      ${totalTime    ? `<p style="margin:4px 0 0;font-size:12px;color:#aaa;">Total time: ${totalTime}</p>` : ""}
    </div>
  </div>

  <!-- Section breakdown table -->
  <div style="margin:24px 28px 0;">
    <p style="font-size:11px;font-weight:bold;color:#3a5a09;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 10px;">Section Breakdown</p>
    <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
      <thead>
        <tr style="background:#1a2e05;">
          <th style="padding:11px 16px;text-align:left;font-size:12px;color:#fff;">Subject</th>
          <th style="padding:11px 16px;text-align:center;font-size:12px;color:#fff;">Score</th>
          <th style="padding:11px 16px;text-align:center;font-size:12px;color:#fff;">Band</th>
        </tr>
      </thead>
      <tbody>${sectionHTML}</tbody>
    </table>
  </div>

  <!-- PDF attachment note -->
  <div style="margin:20px 28px 0;background:#f0f4ff;border:1px solid #c7d2fe;border-radius:8px;padding:14px 18px;display:flex;align-items:center;gap:12px;">
    <span style="font-size:22px;">📎</span>
    <div>
      <p style="margin:0;font-size:13px;font-weight:bold;color:#3730a3;">Your full report is attached</p>
      <p style="margin:3px 0 0;font-size:12px;color:#6366f1;">${fileName} — includes detailed breakdown, performance scale, and recommendations.</p>
    </div>
  </div>

  <!-- Next steps -->
  <div style="margin:20px 28px 0;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:bold;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;">What's Next?</p>
    <ul style="margin:0;padding-left:18px;font-size:13px;color:#78350f;line-height:2.2;">
      <li>Review your answers on the test portal</li>
      <li>Speak with your SmartMathz tutor about your results</li>
      <li>Sign up for a programme tailored to your level</li>
    </ul>
  </div>

  <!-- CTA -->
  <div style="text-align:center;padding:24px 28px;">
    <a href="https://smartmathztest-taker.netlify.app/"
      style="background:#7FB509;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;display:inline-block;">
      Go to Dashboard →
    </a>
  </div>

  <!-- Sign off -->
  <div style="padding:0 28px 24px;border-top:1px solid #f0f0f0;margin-top:8px;">
    <p style="font-size:13px;color:#333;margin:16px 0 0;">
      If you have any questions, reach out at
      <a href="mailto:info@smartmathz.com" style="color:#7FB509;text-decoration:none;">info@smartmathz.com</a>
    </p>
    <p style="font-size:13px;color:#333;margin:12px 0 0;">
      Best regards,<br/>
      <strong>Isaac Salako</strong><br/>
      <span style="font-size:12px;color:#999;">Lead Instructor, SmartMathz</span>
    </p>
  </div>

  <!-- Footer -->
  <div style="background:#f8f8f8;border-top:1px solid #eee;padding:14px 24px;text-align:center;">
    <p style="font-size:11px;color:#bbb;margin:0;">© ${year} SmartMathz. All rights reserved.</p>
    <p style="font-size:11px;margin:4px 0 0;">
      <a href="https://smartmathz.com" style="color:#7FB509;text-decoration:none;">www.smartmathz.com</a>
    </p>
  </div>

</div>
</body>
</html>`,

      // PDF as base64 attachment
      attachments: [
        {
          filename:    fileName,
          content:     pdfBase64,
          encoding:    "base64",
          contentType: "application/pdf",
        },
      ],
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err: any) {
    console.error("Result email error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});