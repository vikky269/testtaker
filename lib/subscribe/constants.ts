// lib/subscribe/constants.ts
import { type FormData } from './types';

export const GRADES = [
  'Pre-K', 'Kindergarten', '1st', '2nd', '3rd', '4th', '5th', '6th',
  '7th', '8th', '9th', '10th', '11th', '12th', 'Other',
];
export const GENDERS = ['Male', 'Female', 'Genderqueer/Non-binary', 'Prefer not to disclose', 'Other'];
export const RELATIONSHIPS = ['I am the student', 'Parent', 'Guardian', 'Other'];
export const REFERRALS = ['Google Search', 'Social Media', 'Friend / Family Referral', 'School', 'Advertisement', 'Other'];
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TIME_OPTIONS = (() => {
  const out: string[] = [];
  for (let h = 6; h <= 22; h++) {
    for (const m of ['00', '30']) {
      if (h === 22 && m === '30') continue;
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      out.push(`${hour12}:${m} ${ampm}`);
    }
  }
  return out;
})();

export interface StepMeta {
  num: number;
  title: string;
  subtitle: string;
}

export const STEPS: StepMeta[] = [
  { num: 1, title: 'Policy', subtitle: 'Review & agree to our guidelines' },
  { num: 2, title: 'Media Consent', subtitle: 'Optional' },
  { num: 3, title: 'Student Info', subtitle: 'Tell us about the student' },
  { num: 4, title: 'Parent Details', subtitle: 'Your contact information' },
  { num: 5, title: 'Programme & Billing', subtitle: 'Your plan & payment schedule' },
  { num: 6, title: 'Scheduling', subtitle: 'Availability & start date' },
  { num: 7, title: 'Review & Submit', subtitle: 'Confirm everything looks right' },
];
export const TOTAL_STEPS = STEPS.length;

export const EMPTY_FORM: FormData = {
  email: '', studentFirstName: '', studentLastName: '', studentEmail: '',
  studentGender: '', studentGenderOther: '', studentSchool: '', gradeLevel: '', gradeLevelOther: '', gpa: '',
  relationship: '', relationshipOther: '',
  parentFirstName: '', parentLastName: '', parentPhone: '', parentEmail: '', householdAddress: '',
  hasSecondParent: false, parent2FirstName: '', parent2LastName: '', parent2Phone: '', parent2Email: '',
  startDate: '',
  additionalInfo: '', referralSource: '', referralOther: '',
};

// Day-of-month ordinal suffix helper (1st, 2nd, 3rd, 4th...)
export const ord = (d: number) => {
  if (d % 100 >= 11 && d % 100 <= 13) return 'th';
  return d % 10 === 1 ? 'st' : d % 10 === 2 ? 'nd' : d % 10 === 3 ? 'rd' : 'th';
};