// components/subscribe/steps/SchedulingStep.tsx
import { inputCls } from '@/lib/subscribe/style';
import { REFERRALS } from '@/lib/subscribe/constants';
import { type AvailabilitySlot, type FormData, type FormErrors } from '@/lib/subscribe/types';
import { Field } from '../ui/Field';
import { Radio } from '../ui/Radio';
import { AvailabilityPicker } from '../ui/AvailabilityPicker';

export function SchedulingStep({ form, setField, setForm, availability, setAvailability, errors }: {
  form: FormData;
  setField: (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  availability: AvailabilitySlot[];
  setAvailability: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>;
  errors: FormErrors;
}) {
  const setRadio = (f: keyof FormData) => (v: string) => setForm(p => ({ ...p, [f]: v }));

  return (
    <>
      <Field label="Days and times the student is available" required error={errors.availability}>
        <p className="text-xs text-gray-400 italic mb-2 -mt-1">
          Example: tap <span className="font-medium">Mon</span>, <span className="font-medium">Wed</span> and <span className="font-medium">Fri</span>,
          then set each day&rsquo;s time range — e.g. 3:00 PM to 5:00 PM. Add as many days as work for your child.
        </p>
        <AvailabilityPicker slots={availability} onChange={setAvailability} />
      </Field>
      <Field label="Potential start date" required error={errors.startDate}>
        <input type="date" value={form.startDate} onChange={setField('startDate')} className={inputCls} />
      </Field>
      <Field label="Any additional information?">
        <textarea placeholder="Learning needs, goals, anything else we should know..."
          value={form.additionalInfo} onChange={setField('additionalInfo')} rows={3}
          className={`${inputCls} resize-none`} />
      </Field>
      <Field label="How did you hear about SmartMathz?" required error={errors.referralSource}>
        <Radio options={REFERRALS} value={form.referralSource} onChange={setRadio('referralSource')}
          showOther otherValue={form.referralOther} onOtherChange={v => setForm(p => ({ ...p, referralOther: v }))} />
      </Field>
    </>
  );
}