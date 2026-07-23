// components/subscribe/steps/ParentDetailsStep.tsx
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { inputCls } from '@/lib/subscribe/style';
import { RELATIONSHIPS } from '@/lib/subscribe/constants';
import { type FormData, type FormErrors } from '@/lib/subscribe/types';
import { Field } from '../ui/Field';
import { Radio } from '../ui/Radio';

export function ParentDetailsStep({ form, setField, setForm, errors }: {
  form: FormData;
  setField: (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
}) {
  const setRadio = (f: keyof FormData) => (v: string) => setForm(p => ({ ...p, [f]: v }));

  return (
    <>
      <Field label="Your Relationship to the Student" required error={errors.relationship}>
        <Radio options={RELATIONSHIPS} value={form.relationship} onChange={setRadio('relationship')}
          showOther otherValue={form.relationshipOther} onOtherChange={v => setForm(p => ({ ...p, relationshipOther: v }))} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Parent/Guardian First Name" required error={errors.parentFirstName}>
          <input type="text" placeholder="First name" value={form.parentFirstName} onChange={setField('parentFirstName')} className={inputCls} />
        </Field>
        <Field label="Parent/Guardian Last Name" required error={errors.parentLastName}>
          <input type="text" placeholder="Last name" value={form.parentLastName} onChange={setField('parentLastName')} className={inputCls} />
        </Field>
      </div>
      <Field label="Phone Number" required error={errors.parentPhone}>
        <PhoneInput
          international defaultCountry="US"
          value={form.parentPhone}
          onChange={v => setForm(p => ({ ...p, parentPhone: v ?? '' }))}
          className="sm-phone"
          placeholder="Enter phone number"
        />
      </Field>
      <Field label="Parent/Guardian Email" required error={errors.parentEmail}>
        <input type="email" placeholder="parent@example.com" value={form.parentEmail} onChange={setField('parentEmail')} className={inputCls} />
      </Field>

      {!form.hasSecondParent ? (
        <button type="button"
          onClick={() => setForm(p => ({ ...p, hasSecondParent: true }))}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#7FB509]/40
                     text-[#3a5a09] text-sm font-semibold hover:bg-[#7FB509]/5 cursor-pointer transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Second Parent / Guardian
        </button>
      ) : (
        <div className="border border-[#7FB509]/20 bg-[#7FB509]/5 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#3a5a09]">Second Parent / Guardian</p>
            <button type="button"
              onClick={() => setForm(p => ({
                ...p, hasSecondParent: false,
                parent2FirstName: '', parent2LastName: '', parent2Phone: '', parent2Email: '',
              }))}
              className="text-red-400 hover:text-red-600 cursor-pointer text-xs font-semibold flex items-center gap-1">
              ✕ Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" required error={errors.parent2FirstName}>
              <input type="text" placeholder="First name" value={form.parent2FirstName} onChange={setField('parent2FirstName')} className={inputCls} />
            </Field>
            <Field label="Last Name" required error={errors.parent2LastName}>
              <input type="text" placeholder="Last name" value={form.parent2LastName} onChange={setField('parent2LastName')} className={inputCls} />
            </Field>
          </div>
          <Field label="Phone Number" required error={errors.parent2Phone}>
            <PhoneInput
              international defaultCountry="US"
              value={form.parent2Phone}
              onChange={v => setForm(p => ({ ...p, parent2Phone: v ?? '' }))}
              className="sm-phone"
              placeholder="Enter phone number"
            />
          </Field>
          <Field label="Email" required error={errors.parent2Email}>
            <input type="email" placeholder="parent2@example.com" value={form.parent2Email} onChange={setField('parent2Email')} className={inputCls} />
          </Field>
        </div>
      )}

      <Field label="Household Address (or your city)" required error={errors.householdAddress}>
        <textarea placeholder="123 Main St, City, State" value={form.householdAddress} onChange={setField('householdAddress')} rows={3}
          className={`${inputCls} resize-none`} />
      </Field>
    </>
  );
}