// lib/subscribe/types.ts
import { type ComputedPrice } from '@/app/utils/pricingData';

export interface AvailabilitySlot {
  day: string;
  from: string;
  to: string;
}

export interface Recommendation {
  id: string;
  student_name: string;
  student_email: string | null;
  grade: string;
  package_id: 'I' | 'II' | 'III' | 'custom';
  package_label: string | null;
  hours_per_week: number | null;
  custom_subjects: { name: string; hours: number }[] | null;
  additional_programs: string[] | null;
  sessions: number | null;
  computed_price: ComputedPrice | null;
  created_at: string;
}

export interface Billing {
  frequency: '' | 'once' | 'twice';
  mode: '' | 'standard' | 'preferred'; // only for 'once'
  preferredDay: number | null;
  firstDay: number | null;
  secondDay: number | null;
}

export interface FormData {
  email: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentGender: string;
  studentGenderOther: string;
  studentSchool: string;
  gradeLevel: string;
  gradeLevelOther: string;
  gpa: string;
  relationship: string;
  relationshipOther: string;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  parentEmail: string;
  householdAddress: string;
  hasSecondParent: boolean;
  parent2FirstName: string;
  parent2LastName: string;
  parent2Phone: string;
  parent2Email: string;
  startDate: string;
  additionalInfo: string;
  referralSource: string;
  referralOther: string;
}

export type RecStatus = 'loading' | 'found' | 'none' | 'nologin';
export type FormErrors = Record<string, string>;