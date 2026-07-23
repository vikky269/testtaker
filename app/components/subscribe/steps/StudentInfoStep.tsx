// components/subscribe/steps/StudentInfoStep.tsx
import { inputCls } from '@/lib/subscribe/style';
import { GENDERS, GRADES } from '@/lib/subscribe/constants';
import { type FormData, type FormErrors } from '@/lib/subscribe/types';
import { Field } from '../ui/Field';
import { Radio } from '../ui/Radio';

export function StudentInfoStep({ form, setField, setForm, errors }: {
  form: FormData;
  setField: (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
}) {
  const setRadio = (f: keyof FormData) => (v: string) => setForm(p => ({ ...p, [f]: v }));

  return (
    <>
      <Field label="Your Email" required error={errors.email}>
        <input type="email" placeholder="you@example.com" value={form.email} onChange={setField('email')} className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Student's First Name" required error={errors.studentFirstName}>
          <input type="text" placeholder="First name" value={form.studentFirstName} onChange={setField('studentFirstName')} className={inputCls} />
        </Field>
        <Field label="Student's Last Name" required error={errors.studentLastName}>
          <input type="text" placeholder="Last name" value={form.studentLastName} onChange={setField('studentLastName')} className={inputCls} />
        </Field>
      </div>
      <Field label="Student's Email" required error={errors.studentEmail}>
        <input type="email" placeholder="student@example.com" value={form.studentEmail} onChange={setField('studentEmail')} className={inputCls} />
      </Field>
      <Field label="Student Identifies As" required error={errors.studentGender}>
        <Radio options={GENDERS} value={form.studentGender} onChange={setRadio('studentGender')}
          showOther otherValue={form.studentGenderOther} onOtherChange={v => setForm(p => ({ ...p, studentGenderOther: v }))} />
      </Field>
      <Field label="Student's School" required error={errors.studentSchool}>
        <input type="text" placeholder="School name" value={form.studentSchool} onChange={setField('studentSchool')} className={inputCls} />
      </Field>
      <Field label="Grade Level" required error={errors.gradeLevel}>
        <div className="grid grid-cols-3 gap-2">
          {GRADES.filter(g => g !== 'Other').map(grade => (
            <button key={grade} type="button" onClick={() => setRadio('gradeLevel')(grade)}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-center cursor-pointer transition-all
                ${form.gradeLevel === grade
                  ? 'border-[#7FB509] bg-[#7FB509]/8 text-[#3a5a09] font-semibold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'}`}>
              {grade}
            </button>
          ))}
          <button type="button" onClick={() => setRadio('gradeLevel')('Other')}
            className={`col-span-3 px-3 py-2.5 rounded-xl border text-sm font-medium text-center cursor-pointer transition-all
              ${form.gradeLevel === 'Other'
                ? 'border-[#7FB509] bg-[#7FB509]/8 text-[#3a5a09] font-semibold'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'}`}>
            Other
          </button>
          {form.gradeLevel === 'Other' && (
            <div className="col-span-3">
              <input type="text" placeholder="Please specify..."
                value={form.gradeLevelOther}
                onChange={e => setForm(p => ({ ...p, gradeLevelOther: e.target.value }))}
                className={inputCls} />
            </div>
          )}
        </div>
      </Field>
      <Field label="GPA or Average Grade">
        <input type="text" placeholder="e.g. 3.5 or B+" value={form.gpa} onChange={setField('gpa')} className={inputCls} />
      </Field>
    </>
  );
}