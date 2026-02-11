// import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// serve(async (req) => {
//   try {
//     const { fullName, email, grade } = await req.json();

//     if (!fullName || !email) {
//       return new Response(
//         JSON.stringify({ error: "Missing required fields" }),
//         { status: 400 }
//       );
//     }

//     const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
//     const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

//     if (!RESEND_API_KEY || !ADMIN_EMAIL) {
//       return new Response(
//         JSON.stringify({ error: "Missing environment variables" }),
//         { status: 500 }
//       );
//     }

//     /* ---------------- ADMIN EMAIL ---------------- */
//     await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${RESEND_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: "SmartMathz <no-reply@smartmathz.com>",
//         to: ADMIN_EMAIL,
//         subject: "🎉 New Student Signup",
//         html: `
//           <h3>New Student Registered</h3>
//           <p><strong>Name:</strong> ${fullName}</p>
//           <p><strong>Email:</strong> ${email}</p>`,
//       }),
//     });

//     /* ---------------- STUDENT WELCOME EMAIL ---------------- */
//     await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${RESEND_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: "SmartMathz <no-reply@smartmathz.com>",
//         to: email,
//         subject: "Welcome to SmartMathz 🎓",
//         html: `
//           <h2>Welcome to SmartMathz, ${fullName}!</h2>
//           <p>We’re excited to have you on the SmartMathz Test Portal.</p>

//           <p>You can now:</p>
//           <ul>
//             <li>Take practice assessments</li>
//             <li>Track your progress</li>
//             <li>Improve your Math, ELA, and Science skills</li>
//           </ul>

//           <p><strong>Your Grade:</strong> ${grade}</p>

//           <p>👉 Log in anytime to get started.</p>

//           <p>Best of luck,<br/>
//           <strong>SmartMathz Team</strong></p>
//         `,
//       }),
//     });

//     return new Response(
//       JSON.stringify({ success: true }),
//       { status: 200 }
//     );
//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: err.message }),
//       { status: 500 }
//     );
//   }
// });


import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

/* ---------------- CORS HEADERS ---------------- */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // you can replace * with your domain in production
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle preflight requests (very important)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fullName, email, grade } = await req.json();

    if (!fullName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

    if (!RESEND_API_KEY || !ADMIN_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: corsHeaders }
      );
    }

    /* ---------------- ADMIN EMAIL ---------------- */
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SmartMathz <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: "🎉 New Student Signup",
        html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">

      <div style="background-color: #7FB509; padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">🎉 New Student Signup</h2>
      </div>

      <div style="padding: 20px; color: #333;">
        <p style="font-size: 16px;">A new student has registered on the SmartMathz Test Portal:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Name:</td>
            <td style="padding: 8px;">${fullName}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; font-size: 14px; color: #777;">
          This is an automated notification from SmartMathz.
        </p>
      </div>

    </div>
  </div>
`
,
      }),
    });

    /* ---------------- STUDENT WELCOME EMAIL ---------------- */
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SmartMathz <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to SmartMathz Test Portal🎓",
       html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">

      <div style="background-color: #7FB509; padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to SmartMathz 🎓</h1>
      </div>

      <div style="padding: 25px; color: #333;">
        <h2 style="margin-top: 0;">Hi ${fullName},</h2>

        <p style="font-size: 16px; line-height: 1.6;">
          We're excited to have you join the <strong>SmartMathz Test Portal</strong>!
        </p>

        <p style="font-size: 16px;">Here’s what you can do:</p>

        <ul style="line-height: 1.8;">
          <li>📘 Take practice assessments</li>
          <li>📊 Track your progress</li>
          <li>🚀 Improve your Math, ELA, and Science skills</li>
        </ul>

       
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://smartmathztest-taker.netlify.app/login"
            style="
              background-color: #7FB509;
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 6px;
              font-size: 16px;
              display: inline-block;
            ">
            Login to Start Learning
          </a>
        </div>

        <p style="font-size: 14px; color: #777;">
          If you have any questions, feel free to reach out to our support team.
        </p>

        <p style="margin-top: 25px;">
          Best of luck,<br/>
          <strong>The SmartMathz Team</strong>
        </p>
      </div>

      <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} SmartMathz. All rights reserved.
      </div>

    </div>
  </div>
`
,
      }),
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
