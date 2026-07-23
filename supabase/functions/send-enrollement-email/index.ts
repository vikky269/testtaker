// supabase/functions/send-enrollement-email/index.ts
// Sends enrollment confirmation to the parent + full details to the admins via Resend.
// Deploy:  supabase functions deploy send-enrollement-email --no-verify-jwt
// Secret:  supabase secrets set RESEND_API_KEY=re_xxx

// ── Sender + recipients ───────────────────────────────────────────────────────
// TESTING: Resend only allows sending FROM onboarding@resend.dev and TO your own
// account email until the smartmathz.com domain is verified. Once verified, change
// FROM_ADDRESS to 'SmartMathz <info@smartmathz.com>' and the real recipients work.
const FROM_ADDRESS = 'SmartMathz <info@smartmathz.com>';

const ADMIN_RECIPIENTS = [
  'abdul.muktar@smartmathz.com',
  'isaac.salako@smartmathz.com',
  'victoramune2001@gmail.com',
];

// While unverified, Resend rejects any recipient that isn't your account email.
// Set this to true ONLY after the domain is verified in Resend.
const DOMAIN_VERIFIED = true;
// Your Resend account email — the only address allowed to receive during testing.
const TEST_INBOX = 'viktorefi2001@gmail.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Resend send helper ────────────────────────────────────────────────────────
async function sendEmail(to: string[], subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const p = await req.json();
    const studentName = `${p.student_first_name ?? ''} ${p.student_last_name ?? ''}`.trim();
    const parentName  = `${p.parent_first_name ?? ''} ${p.parent_last_name ?? ''}`.trim();
    const ps          = p.program_summary;

    const billingText = (() => {
      const b = p.billing ?? {};
      if (b.frequency === 'once') {
        return b.mode === 'preferred' && b.preferredDay
          ? `Once per month — day ${b.preferredDay} of the month`
          : 'Once per month — standard (start of period)';
      }
      if (b.frequency === 'twice') return `Twice per month — days ${b.firstDay} & ${b.secondDay}`;
      return '—';
    })();

    const row = (label: string, value: unknown) =>
      value ? `<tr>
        <td style="padding:6px 12px;color:#9ca3af;font-size:13px;white-space:nowrap">${label}</td>
        <td style="padding:6px 12px;color:#111827;font-size:13px;font-weight:600">${value}</td>
      </tr>` : '';

    const detailsTable = `
      <table style="border-collapse:collapse;width:100%;background:#f9fafb;border-radius:12px">
        ${row('Student', studentName)}
        ${row('Grade', p.grade_level)}
        ${row('Student Email', p.student_email)}
        ${row('School', p.student_school)}
        ${row('Parent/Guardian', parentName)}
        ${row('Parent Phone', p.parent_phone)}
        ${row('Parent Email', p.parent_email)}
        ${p.has_second_parent ? row('Second Parent', `${p.parent2_first_name} ${p.parent2_last_name} · ${p.parent2_phone} · ${p.parent2_email}`) : ''}
        ${row('Address', p.household_address)}
        ${row('Program', p.programme_package)}
        ${ps ? row('Monthly Fee', `$${ps.monthly}`) : ''}
        ${ps ? row('Bi-Weekly', `$${Number(ps.biweekly).toFixed(1)}`) : ''}
        ${ps ? row('Sessions / Month', ps.sessions) : ''}
        ${row('Payment Plan', billingText)}
        ${row('Availability', p.availability)}
        ${row('Start Date', p.start_date)}
        ${row('Referral', p.referral_source)}
        ${row('Additional Info', p.additional_info)}
        ${row('Policy Signed By', p.policy_signature)}
        ${row('Media Consent', p.media_consent ? `Yes — signed by ${p.media_signature}` : 'No')}
      </table>`;

    const wrap = (title: string, intro: string, body: string) => `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto">
        <div style="background:#1a2e05;padding:22px 28px;border-radius:14px 14px 0 0">
          <p style="color:#a3d926;font-size:11px;font-weight:bold;letter-spacing:2px;margin:0 0 4px">SMARTMATHZ</p>
          <h1 style="color:#fff;font-size:20px;margin:0">${title}</h1>
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:26px 28px;border-radius:0 0 14px 14px">
          <p style="color:#374151;font-size:14px;line-height:1.6">${intro}</p>
          ${body}
          <p style="color:#9ca3af;font-size:12px;margin-top:22px">
            SmartMathz · www.smartmathz.com · This is an automated message.
          </p>
        </div>
      </div>`;

    const parentHtml = wrap(
      `Enrollment Received — ${studentName}`,
      `Hi ${p.parent_first_name || 'there'},<br/><br/>
       Thank you for enrolling <strong>${studentName}</strong> with SmartMathz!
       We've received your enrollment and our team will reach out within 48 hours to confirm
       your schedule and next steps. Here's a summary of what you submitted:`,
      detailsTable
    );

    const adminHtml = wrap(
      `🆕 New Enrollment — ${studentName}`,
      `A new enrollment has been submitted through the website. Full details below —
       it's also available on the Subscriptions page of the admin dashboard.`,
      detailsTable
    );

    // ── Recipients ────────────────────────────────────────────────────────────
    // Parent confirmation: form contact email + parent email (deduped).
    const parentRecipients = [...new Set([p.email, p.parent_email].filter(Boolean))] as string[];

    if (DOMAIN_VERIFIED) {
      // Production: send to the real people.
      if (parentRecipients.length) {
        await sendEmail(parentRecipients,
          `🎓 Enrollment Received — ${studentName} | SmartMathz`, parentHtml);
      }
      await sendEmail(ADMIN_RECIPIENTS,
        `🆕 New Enrollment: ${studentName} (${p.grade_level ?? ''})`, adminHtml);
    } else {
      // Testing: Resend only allows your own account email as recipient.
      // Send BOTH emails to the test inbox so you can verify content + formatting.
      await sendEmail([TEST_INBOX],
        `[TEST · parent] Enrollment Received — ${studentName}`, parentHtml);
      await sendEmail([TEST_INBOX],
        `[TEST · admin] New Enrollment — ${studentName}`, adminHtml);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-enrollement-email error:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});