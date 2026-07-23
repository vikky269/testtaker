// components/subscribe/steps/ReviewStep.tsx
import { type ReactNode } from 'react';
import { signatureFont } from '@/lib/subscribe/style';
import { type AvailabilitySlot, type FormData, type Recommendation } from '@/lib/subscribe/types';

function ReviewSection({ title, targetStep, onEdit, children }: {
  title: string; targetStep: number; onEdit: (step: number) => void; children: ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <button type="button" onClick={() => onEdit(targetStep)}
          className="flex items-center gap-1 text-xs font-semibold text-[#3a5a09] bg-[#7FB509]/10 hover:bg-[#7FB509]/20 px-2.5 py-1 rounded-lg cursor-pointer transition-colors">
          ✏️ Edit
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function RRow({ label, value }: { label: string; value: ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold text-gray-800 text-right">{value}</span>
    </div>
  );
}

export function ReviewStep({
  form, policyAgreed, policySignature, mediaConsent, mediaSignature,
  rec, billingSummary, availability, onEdit,
}: {
  form: FormData;
  policyAgreed: boolean; policySignature: string;
  mediaConsent: boolean; mediaSignature: string;
  rec: Recommendation | null;
  billingSummary: string;
  availability: AvailabilitySlot[];
  onEdit: (step: number) => void;
}) {
  const cp = rec?.computed_price;

  return (
    <>
      <ReviewSection title="📋 Policy Agreement" targetStep={1} onEdit={onEdit}>
        <RRow label="Guidelines accepted" value={policyAgreed ? 'Yes' : 'No'} />
        <RRow label="Signed by" value={<span className={`${signatureFont.className} text-xl`}>{policySignature}</span>} />
      </ReviewSection>

      <ReviewSection title="📸 Media Consent" targetStep={2} onEdit={onEdit}>
        <RRow label="Consent given" value={mediaConsent ? 'Yes' : 'No (skipped)'} />
        {mediaConsent && (
          <RRow label="Signed by" value={<span className={`${signatureFont.className} text-xl`}>{mediaSignature}</span>} />
        )}
      </ReviewSection>

      <ReviewSection title="🎓 Student" targetStep={3} onEdit={onEdit}>
        <RRow label="Name" value={`${form.studentFirstName} ${form.studentLastName}`} />
        <RRow label="Email" value={form.studentEmail} />
        <RRow label="Gender" value={form.studentGender === 'Other' ? form.studentGenderOther : form.studentGender} />
        <RRow label="School" value={form.studentSchool} />
        <RRow label="Grade" value={form.gradeLevel === 'Other' ? form.gradeLevelOther : form.gradeLevel} />
        <RRow label="GPA" value={form.gpa} />
        <RRow label="Contact email" value={form.email} />
      </ReviewSection>

      <ReviewSection title="👨‍👩‍👧 Parent / Guardian" targetStep={4} onEdit={onEdit}>
        <RRow label="Relationship" value={form.relationship === 'Other' ? form.relationshipOther : form.relationship} />
        <RRow label="Name" value={`${form.parentFirstName} ${form.parentLastName}`} />
        <RRow label="Phone" value={form.parentPhone} />
        <RRow label="Email" value={form.parentEmail} />
        <RRow label="Address" value={form.householdAddress} />
        {form.hasSecondParent && (
          <>
            <RRow label="Second parent" value={`${form.parent2FirstName} ${form.parent2LastName}`} />
            <RRow label="Phone" value={form.parent2Phone} />
            <RRow label="Email" value={form.parent2Email} />
          </>
        )}
      </ReviewSection>

      <ReviewSection title="📦 Program & Billing" targetStep={5} onEdit={onEdit}>
        <RRow label="Package" value={rec ? (rec.package_id === 'custom' ? 'Custom Package' : `Package ${rec.package_id}`) : '—'} />
        {(rec?.additional_programs ?? []).length > 0 && (
          <RRow label="Programs" value={(rec!.additional_programs ?? []).join(', ')} />
        )}
        <RRow label="Sessions / month" value={rec?.sessions ?? cp?.sessions} />
        <RRow label="Monthly fee" value={cp ? `$${cp.smMonthlyFee}` : undefined} />
        <RRow label="Bi-weekly" value={cp ? `$${cp.smBiweekly.toFixed(1)}` : undefined} />
        <RRow label="Payment plan" value={billingSummary} />
      </ReviewSection>

      <ReviewSection title="🗓️ Scheduling" targetStep={6} onEdit={onEdit}>
        <RRow label="Availability" value={availability.map(s => `${s.day.slice(0, 3)} ${s.from}–${s.to}`).join(', ')} />
        <RRow label="Start date" value={form.startDate} />
        <RRow label="Referral" value={form.referralSource === 'Other' ? form.referralOther : form.referralSource} />
        <RRow label="Notes" value={form.additionalInfo} />
      </ReviewSection>
    </>
  );
}