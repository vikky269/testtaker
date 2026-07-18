// supabase/functions/send-enrollment-email/index.ts
// Sends enrollment confirmation to the parent + full details to the admin.
// Deploy:  supabase functions deploy send-enrollment-email
// Secrets: supabase secrets set GMAIL_USER=info@smartmathz.com GMAIL_APP_PASSWORD=xxxx

import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const ADMIN_EMAIL = 'info@smartmathz.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get('GMAIL_USER')!,
          password: Deno.env.get('GMAIL_APP_PASSWORD')!,
        },
      },
    });

    // Parent confirmation — sent to the form contact email + parent email (deduped)
    const parentRecipients = [...new Set([p.email, p.parent_email].filter(Boolean))];
    for (const to of parentRecipients) {
      await client.send({
        from: `SmartMathz <${Deno.env.get('GMAIL_USER')}>`,
        to,
        subject: `🎓 Enrollment Received — ${studentName} | SmartMathz`,
        html: parentHtml,
      });
    }

    // Admin notification
    await client.send({
      from: `SmartMathz <${Deno.env.get('GMAIL_USER')}>`,
      to: ADMIN_EMAIL,
      subject: `🆕 New Enrollment: ${studentName} (${p.grade_level ?? ''})`,
      html: adminHtml,
    });

    await client.close();
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-enrollment-email error:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});