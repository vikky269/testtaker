// supabase/functions/notify-new-student/index.ts
// Triggered when a new student signs up to the SmartMathz Test Portal
// Sends: (1) welcome email to student, (2) notification email to admin
// Transport: Gmail SMTP via info@smartmathz.com

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
    const { fullName, email, grade, gender } = await req.json();

    if (!fullName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const GMAIL_USER  = Deno.env.get("GMAIL_USER");   // info@smartmathz.com
    const GMAIL_PASS  = Deno.env.get("GMAIL_PASS");   // Gmail App Password
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");  // info@smartmathz.com

    if (!GMAIL_USER || !GMAIL_PASS || !ADMIN_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ── Connect to Gmail SMTP ──────────────────────────────────────────────
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: GMAIL_USER,
      password: GMAIL_PASS,
    });

    const year = new Date().getFullYear();

    // ── 1. Welcome email → student ────────────────────────────────────────
    await client.send({
      from: `SmartMathz <${GMAIL_USER}>`,
      to:   email,
      subject: "Welcome to SmartMathz Test Portal 🎓",
      content: "plain text fallback",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a2e05,#3a7a12);padding:32px 24px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:26px;letter-spacing:-0.5px;">SmartMathz</h1>
    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Test Portal</p>
  </div>

  <!-- Body -->
  <div style="padding:32px 28px;color:#333;">
    <h2 style="margin-top:0;font-size:20px;color:#1a2e05;">Welcome, ${fullName}! 🎉</h2>
    <p style="font-size:15px;line-height:1.7;color:#555;">
      You've successfully created your SmartMathz account. We're thrilled to have you on board and can't wait to support your learning journey!
    </p>

    <!-- Info card -->
    <div style="background:#f8fdf0;border:1px solid #d4edaa;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;font-weight:bold;color:#3a5a09;font-size:13px;width:40%;">Grade Level</td>
          <td style="padding:6px 0;font-size:13px;color:#333;">${grade || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-weight:bold;color:#3a5a09;font-size:13px;">Email</td>
          <td style="padding:6px 0;font-size:13px;color:#333;">${email}</td>
        </tr>
      </table>
    </div>

    <p style="font-size:15px;line-height:1.7;color:#555;">Here's what you can do on the portal:</p>
    <ul style="line-height:2;color:#555;font-size:14px;padding-left:20px;">
      <li>📘 Take grade-level practice assessments</li>
      <li>📊 See your results instantly with section breakdowns</li>
      <li>📄 Download your personalised evaluation report</li>
      <li>🏆 Track your rank on the leaderboard</li>
    </ul>

    <!-- CTA -->
    <div style="text-align:center;margin:30px 0;">
      <a href="https://smartmathztest-taker.netlify.app/login"
        style="background:#7FB509;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;">
        Start Learning →
      </a>
    </div>

    <p style="font-size:13px;color:#888;margin-top:24px;">
      If you have any questions, reply to this email or reach out to us at
      <a href="mailto:info@smartmathz.com" style="color:#7FB509;">info@smartmathz.com</a>
    </p>

    <p style="margin-top:24px;font-size:14px;color:#333;">
      Best regards,<br/>
      <strong>The SmartMathz Team</strong><br/>
      <span style="font-size:12px;color:#999;">Lead Instructor: Isaac Salako</span>
    </p>
  </div>

  <!-- Footer -->
  <div style="background:#f8f8f8;border-top:1px solid #eee;padding:16px 24px;text-align:center;">
    <p style="font-size:11px;color:#aaa;margin:0;">© ${year} SmartMathz. All rights reserved.</p>
    <p style="font-size:11px;color:#aaa;margin:4px 0 0;">
      <a href="https://smartmathz.com" style="color:#7FB509;text-decoration:none;">www.smartmathz.com</a>
    </p>
  </div>

</div>
</body>
</html>
      `,
    });

    // ── 2. Admin notification ──────────────────────────────────────────────
    await client.send({
      from: `SmartMathz <${GMAIL_USER}>`,
      to:   ADMIN_EMAIL,
      subject: `🎉 New Student Signup — ${fullName}`,
      content: "plain text fallback",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

  <div style="background:linear-gradient(135deg,#1a2e05,#3a7a12);padding:24px;text-align:center;">
    <h2 style="color:#fff;margin:0;font-size:20px;">🎉 New Student Registered</h2>
  </div>

  <div style="padding:28px;color:#333;">
    <p style="font-size:15px;margin-top:0;">A new student has signed up on the SmartMathz Test Portal:</p>

    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <tr style="background:#f8fdf0;">
        <td style="padding:10px 14px;font-weight:bold;font-size:13px;color:#3a5a09;border-radius:4px;">Name</td>
        <td style="padding:10px 14px;font-size:13px;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:bold;font-size:13px;color:#3a5a09;">Email</td>
        <td style="padding:10px 14px;font-size:13px;">${email}</td>
      </tr>
      <tr style="background:#f8fdf0;">
        <td style="padding:10px 14px;font-weight:bold;font-size:13px;color:#3a5a09;">Grade</td>
        <td style="padding:10px 14px;font-size:13px;">${grade || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:bold;font-size:13px;color:#3a5a09;">Gender</td>
        <td style="padding:10px 14px;font-size:13px;">${gender || 'Not specified'}</td>
      </tr>
      <tr style="background:#f8fdf0;">
        <td style="padding:10px 14px;font-weight:bold;font-size:13px;color:#3a5a09;">Signed Up</td>
        <td style="padding:10px 14px;font-size:13px;">${new Date().toLocaleString('en-US', { dateStyle:'long', timeStyle:'short' })}</td>
      </tr>
    </table>

    <div style="text-align:center;margin:24px 0;">
      <a href="https://smartmathztest-taker.netlify.app/admin/dashboard/students"
        style="background:#1a2e05;color:#fff;padding:12px 28px;text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;display:inline-block;">
        View in Admin Dashboard →
      </a>
    </div>

    <p style="font-size:12px;color:#aaa;margin:0;">This is an automated notification from SmartMathz.</p>
  </div>

  <div style="background:#f8f8f8;border-top:1px solid #eee;padding:12px 24px;text-align:center;">
    <p style="font-size:11px;color:#aaa;margin:0;">© ${year} SmartMathz. All rights reserved.</p>
  </div>

</div>
</body>
</html>
      `,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err: any) {
    console.error("Email error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});