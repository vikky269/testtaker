// lib/subscribe/validation.ts
import { isValidPhoneNumber } from 'react-phone-number-input';
import { type AvailabilitySlot, type Billing, type FormData, type FormErrors, type RecStatus } from './types';

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());
export const isName = (v: string) => /^[a-zA-Z][a-zA-Z\s'.-]{1,49}$/.test(v.trim());

export interface ValidateStepArgs {
  step: number;
  form: FormData;
  policyAgreed: boolean;
  policySignature: string;
  mediaConsent: boolean;
  mediaSignature: string;
  recStatus: RecStatus;
  billing: Billing;
  availability: AvailabilitySlot[];
}

export function validateStep(args: ValidateStepArgs): FormErrors {
  const { step: s, form, policyAgreed, policySignature, mediaConsent, mediaSignature, recStatus, billing, availability } = args;
  const e: FormErrors = {};

  const req = (f: keyof FormData, label: string) => { if (!form[f]) e[f] = `${label} is required`; };
  const email = (f: keyof FormData, label: string) => {
    if (!form[f]) e[f] = `${label} is required`;
    else if (!isEmail(form[f] as string)) e[f] = 'Please enter a valid email address';
  };
  const name = (f: keyof FormData, label: string) => {
    if (!form[f]) e[f] = `${label} is required`;
    else if (!isName(form[f] as string)) e[f] = 'Please enter a valid name (letters only)';
  };

  if (s === 1) {
    if (!policyAgreed) e.policy = 'Please read and agree to the guidelines to continue.';
    if (!policySignature.trim() || policySignature.trim().length < 3)
      e.policySignature = 'Please type your full name as your electronic signature.';
  }
  if (s === 2) {
    if (mediaConsent && (!mediaSignature.trim() || mediaSignature.trim().length < 3))
      e.mediaSignature = 'Please sign to confirm your media consent, or untick the box.';
  }
  if (s === 3) {
    email('email', 'Your email');
    name('studentFirstName', 'First name');
    name('studentLastName', 'Last name');
    email('studentEmail', "Student's email");
    req('studentGender', 'Gender'); req('studentSchool', 'School'); req('gradeLevel', 'Grade level');
  }
  if (s === 4) {
    req('relationship', 'Relationship');
    name('parentFirstName', 'First name');
    name('parentLastName', 'Last name');
    if (!form.parentPhone) e.parentPhone = 'Phone number is required';
    else if (!isValidPhoneNumber(form.parentPhone)) e.parentPhone = 'Please enter a valid phone number for the selected country';
    email('parentEmail', 'Email');
    req('householdAddress', 'Address');
    if (form.hasSecondParent) {
      name('parent2FirstName', 'First name');
      name('parent2LastName', 'Last name');
      if (!form.parent2Phone) e.parent2Phone = 'Phone number is required';
      else if (!isValidPhoneNumber(form.parent2Phone)) e.parent2Phone = 'Please enter a valid phone number for the selected country';
      email('parent2Email', 'Email');
    }
  }
  if (s === 5) {
    if (recStatus !== 'found') e.rec = 'Your personalized program must be ready before you can continue.';
    if (!billing.frequency) e.billing = 'Please choose a payment frequency.';
    else if (billing.frequency === 'once') {
      if (!billing.mode) e.billing = 'Please choose standard billing or a preferred payment day.';
      else if (billing.mode === 'preferred' && !billing.preferredDay) e.billing = 'Please select your preferred payment day.';
    } else if (billing.frequency === 'twice') {
      if (!billing.firstDay || !billing.secondDay) e.billing = 'Please select both payment days.';
      else if (billing.firstDay === billing.secondDay) e.billing = 'The two payment days must be different.';
    }
  }
  if (s === 6) {
    if (availability.length === 0) e.availability = 'Please select at least one day and time.';
    req('startDate', 'Start date');
    req('referralSource', 'Referral source');
  }
  return e;
}