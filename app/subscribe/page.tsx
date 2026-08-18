'use client';

// app/subscribe/page.tsx — SmartMathz 7-Step Enrollment Form
// 1 Policy · 2 Media Consent (optional) · 3 Student Info · 4 Parent Details
// 5 Program & Billing · 6 Scheduling · 7 Review & Submit

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { supabase, withTimeout } from '@/lib/supabaseClient';

import { outfit } from '@/lib/subscribe/style';
import { STEPS, TOTAL_STEPS, EMPTY_FORM, ord } from '@/lib/subscribe/constants';
import { validateStep } from '@/lib/subscribe/validation';
import { type AvailabilitySlot, type Billing, type FormData, type Recommendation, type RecStatus } from '@/lib/subscribe/types';

import { StepSidebar } from '@/app/components/subscribe/StepSidebar';
import { SuccessScreen } from '@/app/components/subscribe/SuccessScreen';
import { PolicyStep } from '@/app/components/subscribe/steps/PolicyStep';
import { MediaConsentStep } from '@/app/components/subscribe/steps/MediaConsentStep';
import { StudentInfoStep } from '@/app/components/subscribe/steps/StudentInfoStep';
import { ParentDetailsStep } from '@/app/components/subscribe/steps/ParentDetailStep';
import { ProgramBillingStep } from '@/app/components/subscribe/steps/ProgramBillingStep';
import { SchedulingStep } from '@/app/components/subscribe/steps/SchedulingStep';
import { ReviewStep } from '@/app/components/subscribe/steps/ReviewStep';

export default function SubscribePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
  const [visible, setVisible] = useState(true);
  const [returnToReview, setReturnToReview] = useState(false);

  // Step 1 — Policy
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [policySignature, setPolicySignature] = useState('');
  // Step 2 — Media Consent (optional)
  const [mediaConsent, setMediaConsent] = useState(false);
  const [mediaSignature, setMediaSignature] = useState('');
  // Step 5 — Recommendation + Billing
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [recStatus, setRecStatus] = useState<RecStatus>('loading');
  const [billing, setBilling] = useState<Billing>({ frequency: '', mode: '', preferredDay: null, firstDay: null, secondDay: null });

  const setField = (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  // ── Fetch the logged-in student's saved recommendation ─────────────────────
  useEffect(() => {
    const loadRec = async () => {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (!user?.email) { setRecStatus('nologin'); return; }

      const { data, error } = await supabase
        .from('completed_recommendations')
        .select('id, student_name, student_email, grade, package_id, package_label, hours_per_week, custom_subjects, additional_programs, sessions, computed_price, created_at')
        .ilike('student_email', user.email)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) { console.error(error); setRecStatus('none'); return; }
      if (data && data.length > 0) {
        setRec(data[0] as Recommendation);
        setRecStatus('found');
        setForm(p => ({ ...p, email: p.email || user.email! }));
      } else {
        setRecStatus('none');
      }
    };
    loadRec();
  }, []);

  const runValidation = (s: number) => validateStep({
    step: s, form, policyAgreed, policySignature, mediaConsent, mediaSignature, recStatus, billing, availability,
  });

  const goToStep = (target: number) => {
    setAnimDir(target > step ? 'right' : 'left');
    setVisible(false);
    setTimeout(() => { setStep(target); setVisible(true); window.scrollTo({ top: 0 }); }, 180);
  };

  const navigate = (dir: 'next' | 'prev') => {
    if (dir === 'next') {
      const e = runValidation(step);
      if (Object.keys(e).length > 0) { setErrors(e); toast.error(Object.values(e)[0]); return; }
      setErrors({});
      if (returnToReview && step < 7) { setReturnToReview(false); goToStep(7); return; }
    }
    goToStep(dir === 'next' ? step + 1 : step - 1);
  };

  const editFromReview = (target: number) => { setReturnToReview(true); goToStep(target); };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    for (const s of [1, 2, 3, 4, 5, 6]) {
      const e = runValidation(s);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        toast.error(`Please fix ${STEPS[s - 1].title}: ${Object.values(e)[0]}`);
        editFromReview(s);
        return;
      }
    }
    setLoading(true);

    const availabilityText = availability.map(s => `${s.day} ${s.from} - ${s.to} ET`).join(', ');
    const programLabel = rec
      ? rec.package_id === 'custom'
        ? `Custom Package — ${(rec.custom_subjects ?? []).map(s => s.name).join(', ')}`
        : `Package ${rec.package_id}${(rec.additional_programs ?? []).length ? ` — Math Tutoring + ${(rec.additional_programs ?? []).join(' + ')} + Virtual Library` : ''}`
      : '';

    const payload = {
      email: form.email,
      student_first_name: form.studentFirstName,
      student_last_name: form.studentLastName,
      student_email: form.studentEmail,
      student_gender: form.studentGender === 'Other' ? form.studentGenderOther : form.studentGender,
      student_school: form.studentSchool,
      grade_level: form.gradeLevel === 'Other' ? form.gradeLevelOther : form.gradeLevel,
      gpa: form.gpa || null,
      relationship: form.relationship === 'Other' ? form.relationshipOther : form.relationship,
      parent_first_name: form.parentFirstName,
      parent_last_name: form.parentLastName,
      parent_phone: form.parentPhone,
      parent_email: form.parentEmail,
      household_address: form.householdAddress,
      has_second_parent: form.hasSecondParent,
      parent2_first_name: form.hasSecondParent ? form.parent2FirstName : null,
      parent2_last_name: form.hasSecondParent ? form.parent2LastName : null,
      parent2_phone: form.hasSecondParent ? form.parent2Phone : null,
      parent2_email: form.hasSecondParent ? form.parent2Email : null,
      programme_package: programLabel,
      availability: availabilityText,
      availability_slots: availability,
      start_date: form.startDate,
      additional_info: form.additionalInfo || null,
      referral_source: form.referralSource === 'Other' ? form.referralOther : form.referralSource,
      policy_agreed: true,
      policy_signature: policySignature.trim(),
      policy_agreed_at: new Date().toISOString(),
      media_consent: mediaConsent,
      media_signature: mediaConsent ? mediaSignature.trim() : null,
      recommendation_id: rec?.id ?? null,
      billing,
    };

    const { error } = await supabase.from('subscriptions').insert([payload]);
    if (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    // Email confirmation — must never fail the enrollment itself
    try {
      await supabase.functions.invoke('send-enrollement-email', {
        body: {
          ...payload,
          program_summary: rec?.computed_price ? {
            monthly: rec.computed_price.smMonthlyFee,
            biweekly: rec.computed_price.smBiweekly,
            hourly: rec.computed_price.smHourlyRate,
            sessions: rec.sessions,
          } : null,
        },
      });
    } catch (mailErr) {
      console.error('Enrollment email failed (enrollment still saved):', mailErr);
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return <SuccessScreen email={form.email} />;

  const prog = (step / TOTAL_STEPS) * 100;

  const billingSummary =
    billing.frequency === 'once'
      ? billing.mode === 'standard' ? 'Once monthly · standard (start of period)'
        : billing.preferredDay ? `Once monthly · ${billing.preferredDay}${ord(billing.preferredDay)} of the month` : 'Once monthly'
      : billing.frequency === 'twice'
        ? `Twice monthly · ${billing.firstDay}${ord(billing.firstDay ?? 0)} & ${billing.secondDay}${ord(billing.secondDay ?? 0)}`
        : '';

  return (
    <div className={`${outfit.variable} min-h-screen font-[var(--font-outfit)] bg-gray-50`}>

      {/* Slim brand header */}
      <header className="bg-[#1a2e05] text-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <Image src="/SmartMathz.png" alt="SmartMathz" width={34} height={34} className="object-contain" />
          <div>
            <p className="font-bold text-sm leading-tight">SmartMathz Enrollment</p>
            <p className="text-white/50 text-xs">Helping every student learn, grow, and succeed</p>
          </div>
          <span className="ml-auto text-white/40 text-xs">Step {step} of {TOTAL_STEPS}</span>
        </div>
        <div className="h-1 bg-white/10">
          <div className="h-full bg-[#7FB509] transition-all duration-500" style={{ width: `${prog}%` }} />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">

        <StepSidebar currentStep={step} />

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{STEPS[step - 1].title}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{STEPS[step - 1].subtitle}</p>
          </div>

          <div className="flex-1 space-y-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : `translateX(${animDir === 'right' ? '24px' : '-24px'})`,
              transition: 'opacity 0.18s ease, transform 0.18s ease',
            }}>

            {step === 1 && (
              <PolicyStep
                policyAgreed={policyAgreed} onPolicyAgreedChange={setPolicyAgreed}
                policySignature={policySignature} onPolicySignatureChange={setPolicySignature}
                error={errors.policy} signatureError={errors.policySignature}
              />
            )}

            {step === 2 && (
              <MediaConsentStep
                mediaConsent={mediaConsent} onMediaConsentChange={setMediaConsent}
                mediaSignature={mediaSignature} onMediaSignatureChange={setMediaSignature}
                signatureError={errors.mediaSignature}
              />
            )}

            {step === 3 && (
              <StudentInfoStep form={form} setField={setField} setForm={setForm} errors={errors} />
            )}

            {step === 4 && (
              <ParentDetailsStep form={form} setField={setField} setForm={setForm} errors={errors} />
            )}

            {step === 5 && (
              <ProgramBillingStep rec={rec} recStatus={recStatus} billing={billing} setBilling={setBilling} errors={errors} />
            )}

            {step === 6 && (
              <SchedulingStep
                form={form} setField={setField} setForm={setForm}
                availability={availability} setAvailability={setAvailability}
                errors={errors}
              />
            )}

            {step === 7 && (
              <ReviewStep
                form={form}
                policyAgreed={policyAgreed} policySignature={policySignature}
                mediaConsent={mediaConsent} mediaSignature={mediaSignature}
                rec={rec} billingSummary={billingSummary}
                availability={availability}
                onEdit={editFromReview}
              />
            )}
          </div>

          {/* ── Nav buttons ── */}
          <div className={`flex gap-3 mt-8 pt-6 border-t border-gray-100 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button onClick={() => navigate('prev')}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold
                           hover:bg-gray-50 cursor-pointer transition-all">
                ← Back
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button onClick={() => navigate('next')}
                className="px-8 py-3 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white text-sm font-bold
                           cursor-pointer transition-all shadow-sm active:scale-[0.98] ml-auto">
                {returnToReview ? 'Save & Return to Review →' : 'Continue →'}
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm
                           flex items-center justify-center gap-2 cursor-pointer
                           disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]">
                {loading
                  ? <><ClipLoader size={18} color="#fff" /><span>Submitting...</span></>
                  : '🎓 Submit Enrollment'}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            By submitting you agree SmartMathz may contact you regarding your enrolment.
          </p>
        </div>
      </div>

      {/* Phone input styling to match the form's inputs */}
      <style>{`
        .sm-phone { display: flex; gap: 8px; }
        .sm-phone .PhoneInputCountry {
          border: 1px solid #e5e7eb; border-radius: 12px; padding: 0 10px; background: #fff;
        }
        .sm-phone .PhoneInputInput {
          flex: 1; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; background: #fff; outline: none; transition: all .15s;
        }
        .sm-phone .PhoneInputInput:focus {
          border-color: #7FB509; box-shadow: 0 0 0 2px rgba(127,181,9,0.3);
        }
      `}</style>
    </div>
  );
}