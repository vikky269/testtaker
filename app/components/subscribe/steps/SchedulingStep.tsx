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