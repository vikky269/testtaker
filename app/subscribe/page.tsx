'use client';

// app/subscribe/page.tsx — SmartMathz 7-Step Enrollment Form
// 1 Policy · 2 Media Consent (optional) · 3 Student Info · 4 Parent Details
// 5 Program & Billing · 6 Scheduling · 7 Review & Submit

import { useEffect, useState } from 'react';
import { supabase, withTimeout } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { Outfit, Great_Vibes } from 'next/font/google';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { type ComputedPrice } from '@/app/utils/pricingData';

const outfit        = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const signatureFont = Great_Vibes({ subsets: ['latin'], weight: '400' });

// ── Constants ──────────────────────────────────────────────────────────────────
const GRADES        = ['Pre-K','Kindergarten','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','Other'];
const GENDERS       = ['Male','Female','Genderqueer/Non-binary','Prefer not to disclose','Other'];
const RELATIONSHIPS = ['I am the student','Parent','Guardian','Other'];
const REFERRALS     = ['Google Search','Social Media','Friend / Family Referral','School','Advertisement','Other'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const TIME_OPTIONS = (() => {
  const out: string[] = [];
  for (let h = 6; h <= 22; h++) {
    for (const m of ['00', '30']) {
      if (h === 22 && m === '30') continue;
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm   = h < 12 ? 'AM' : 'PM';
      out.push(`${hour12}:${m} ${ampm}`);
    }
  }
  return out;
})();

const STEPS = [
  { num: 1, title: 'Policy',            subtitle: 'Student & parent guidelines' },
  { num: 2, title: 'Media Consent',     subtitle: 'Optional photo/video consent' },
  { num: 3, title: 'Student Info',      subtitle: 'Tell us about the student' },
  { num: 4, title: 'Parent Details',    subtitle: 'Your contact information' },
  { num: 5, title: 'Program & Billing', subtitle: 'Your personalized program' },
  { num: 6, title: 'Scheduling',        subtitle: 'Availability & start date' },
  { num: 7, title: 'Review & Submit',   subtitle: 'Confirm everything is correct' },
];
const TOTAL_STEPS = STEPS.length;

// ── Policy content (from SmartMathz Student & Parent Guidelines) ──────────────
const POLICY_SECTIONS: { title: string; intro?: string; items?: string[]; outro?: string }[] = [
  {
    title: '1. Attendance & Punctuality',
    items: [
      'Students are expected to join each session on time and ready to learn.',
      'If a student is unable to attend, please notify SmartMathz at least one (1) hour before the scheduled session.',
      'We understand that emergencies happen. However, sessions missed without prior notice ("no-call, no-show") may not be eligible for rescheduling, as tutors have reserved that time specifically for your child.',
      'Consistent attendance helps students make steady academic progress.',
    ],
  },
  {
    title: '2. Creating a Productive Learning Environment',
    intro: 'To maximize learning during each session, we encourage students to:',
    items: [
      'Join from a quiet, distraction-free space.',
      'Be seated at a desk or table rather than on a bed or couch.',
      'Keep background noise to a minimum.',
      'Avoid eating during class whenever possible.',
      'Minimize interruptions from siblings, family members, television, or other distractions.',
      'Focus on the lesson and avoid unrelated use of phones, tablets, or other devices during class.',
    ],
    outro: 'A dedicated learning environment helps students stay engaged and get the most from every session.',
  },
  {
    title: '3. Technology Requirements',
    intro: 'For the best learning experience, students should have:',
    items: [
      'A laptop or desktop computer (recommended).',
      'A notebook or writing pad and pencil.',
      'A stable internet connection.',
      'A working webcam and microphone.',
      'An external mouse is highly recommended to improve ease of use during lessons.',
    ],
    outro: 'To support engagement, students are expected to remain on camera throughout each session, unless otherwise agreed upon with their tutor.',
  },
  {
    title: '4. Student Conduct & Respect',
    intro: 'At SmartMathz, we believe that respect is the foundation of great learning. Students are expected to treat tutors, classmates, parents, and staff with kindness and respect; use polite and appropriate language at all times; follow tutor instructions during lessons; and participate positively. The following behaviors are not appropriate during SmartMathz sessions:',
    items: [
      'Disrespectful or abusive language.',
      'Vulgar or explicit language.',
      'Bullying, harassment, or inappropriate behavior toward others.',
      'Repeated disruptive conduct that prevents learning.',
    ],
    outro: 'Our tutors are committed to creating a safe, encouraging environment where every student feels respected and valued.',
  },
  {
    title: '5. Dress Code & Professional Learning Environment',
    intro: 'Although classes are virtual, we encourage students to approach each session as they would an in-person classroom. Students should:',
    items: [
      'Be appropriately dressed for class.',
      'Participate from a suitable learning space.',
      'Avoid attending sessions while lying in bed or in situations that may distract from learning.',
    ],
  },
  {
    title: '6. Parent Communication',
    intro: 'Strong communication helps us better support your child. Parents/guardians are encouraged to:',
    items: [
      'Provide reliable phone numbers and email addresses.',
      'Be reasonably available if tutors or SmartMathz staff need to communicate important updates.',
      'Share questions or concerns promptly so we can address them quickly.',
      'Inform us of schedule changes or anticipated absences as early as possible.',
    ],
    outro: 'We value open communication and welcome parent feedback at any time.',
  },
  {
    title: '7. Tuition & Billing',
    intro: 'Timely tuition payments allow us to continue providing high-quality instruction and maintain consistent scheduling for both students and tutors. If you anticipate any challenges with payment, we encourage you to communicate with us in advance so we can discuss possible arrangements.',
  },
  {
    title: '8. Enrollment & Participation',
    intro: 'Our goal is always to help every student succeed. In rare situations, SmartMathz may discontinue services when continued participation is no longer in the best interest of the student, tutors, or learning community. Examples may include:',
    items: [
      'Repeated disrespectful or inappropriate behavior.',
      'Persistent disruption of learning despite intervention.',
      'Ongoing non-payment of tuition without prior communication or an agreed payment arrangement.',
    ],
    outro: 'Whenever possible, SmartMathz will communicate concerns with parents first and work collaboratively toward a positive resolution before any decision is made. Parents may also discontinue tutoring at any time — we simply ask for reasonable advance notice to allow us to adjust tutor schedules and ensure a smooth transition.',
  },
];

// ── Types ──────────────────────────────────────────────────────────────────────
interface AvailabilitySlot { day: string; from: string; to: string; }

interface Recommendation {
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

interface Billing {
  frequency: '' | 'once' | 'twice';
  mode: '' | 'standard' | 'preferred';   // only for 'once'
  preferredDay: number | null;
  firstDay: number | null;
  secondDay: number | null;
}

interface FormData {
  email: string;
  studentFirstName: string; studentLastName: string; studentEmail: string;
  studentGender: string; studentGenderOther: string;
  studentSchool: string; gradeLevel: string; gradeLevelOther: string; gpa: string;
  relationship: string; relationshipOther: string;
  parentFirstName: string; parentLastName: string;
  parentPhone: string; parentEmail: string; householdAddress: string;
  hasSecondParent: boolean;
  parent2FirstName: string; parent2LastName: string;
  parent2Phone: string; parent2Email: string;
  startDate: string;
  additionalInfo: string; referralSource: string; referralOther: string;
}

const EMPTY: FormData = {
  email:'', studentFirstName:'', studentLastName:'', studentEmail:'',
  studentGender:'', studentGenderOther:'', studentSchool:'', gradeLevel:'', gradeLevelOther:'', gpa:'',
  relationship:'', relationshipOther:'',
  parentFirstName:'', parentLastName:'', parentPhone:'', parentEmail:'', householdAddress:'',
  hasSecondParent: false, parent2FirstName:'', parent2LastName:'', parent2Phone:'', parent2Email:'',
  startDate:'',
  additionalInfo:'', referralSource:'', referralOther:'',
};

// ── Validation helpers ─────────────────────────────────────────────────────────
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());
const isName  = (v: string) => /^[a-zA-Z][a-zA-Z\s'.-]{1,49}$/.test(v.trim());

// ── Reusable UI ────────────────────────────────────────────────────────────────
const inputCls = `w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
  focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
  placeholder:text-gray-400 transition-all`;

const Field = ({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-gray-700">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const Radio = ({ options, value, onChange, showOther, otherValue, onOtherChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
  showOther?: boolean; otherValue?: string; onOtherChange?: (v: string) => void;
}) => (
  <div className="space-y-2">
    {options.map(opt => (
      <button key={opt} type="button" onClick={() => onChange(opt)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all cursor-pointer
          ${value === opt
            ? 'border-[#7FB509] bg-[#7FB509]/5 text-[#3a5a09] font-semibold'
            : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          ${value === opt ? 'border-[#7FB509]' : 'border-gray-300'}`}>
          {value === opt && <div className="w-2 h-2 rounded-full bg-[#7FB509]" />}
        </div>
        {opt}
      </button>
    ))}
    {showOther && value === 'Other' && (
      <input type="text" placeholder="Please specify..."
        value={otherValue ?? ''} onChange={e => onOtherChange?.(e.target.value)}
        className={`${inputCls} mt-1`} />
    )}
  </div>
);

// Day-of-month dropdown (1–31)
const ord = (d: number) => {
  if (d % 100 >= 11 && d % 100 <= 13) return 'th';
  return d % 10 === 1 ? 'st' : d % 10 === 2 ? 'nd' : d % 10 === 3 ? 'rd' : 'th';
};
const DaySelect = ({ value, onChange, placeholder }: {
  value: number | null; onChange: (v: number) => void; placeholder: string;
}) => (
  <select value={value ?? ''} onChange={e => onChange(parseInt(e.target.value))}
    className={`${inputCls} cursor-pointer`}>
    <option value="" disabled>{placeholder}</option>
    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
      <option key={d} value={d}>{d}{ord(d)} of the month</option>
    ))}
  </select>
);

// Signature input — renders the typed name in a handwritten script font
const SignatureInput = ({ value, onChange, error }: {
  value: string; onChange: (v: string) => void; error?: string;
}) => (
  <div className="space-y-1.5">
    <div className="bg-white border border-gray-200 rounded-xl px-5 pt-3 pb-2 focus-within:ring-2 focus-within:ring-[#7FB509]/30 focus-within:border-[#7FB509] transition-all">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Electronic Signature — type your full name</p>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder="Your full name"
        className={`${signatureFont.className} w-full text-3xl text-gray-800 outline-none bg-transparent
                    border-b-2 border-dashed border-gray-300 focus:border-[#7FB509] py-1 placeholder:text-gray-300`}
      />
      <p className="text-[11px] text-gray-400 mt-1.5">
        Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

// ── Day/Time Availability Picker ───────────────────────────────────────────────
function AvailabilityPicker({ slots, onChange }: {
  slots: AvailabilitySlot[]; onChange: (slots: AvailabilitySlot[]) => void;
}) {
  const selectedDays = slots.map(s => s.day);
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) onChange(slots.filter(s => s.day !== day));
    else onChange([...slots, { day, from: '3:00 PM', to: '5:00 PM' }]);
  };
  const updateSlot = (day: string, field: 'from' | 'to', value: string) =>
    onChange(slots.map(s => s.day === day ? { ...s, [field]: value } : s));
  const removeDay = (day: string) => onChange(slots.filter(s => s.day !== day));
  const orderedSlots = DAYS.map(day => slots.find(s => s.day === day))
    .filter((s): s is AvailabilitySlot => !!s);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
        {DAYS.map(day => {
          const isSelected = selectedDays.includes(day);
          return (
            <button key={day} type="button" onClick={() => toggleDay(day)}
              className={`px-2 py-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all
                ${isSelected
                  ? 'border-[#7FB509] bg-[#7FB509] text-white shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}>
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>
      {orderedSlots.length > 0 ? (
        <div className="space-y-2 pt-1">
          {orderedSlots.map(slot => (
            <div key={slot.day}
              className="flex items-center gap-2 bg-[#7FB509]/5 border border-[#7FB509]/20 rounded-xl px-3 py-2.5">
              <span className="text-sm font-semibold text-[#3a5a09] w-20 flex-shrink-0">{slot.day}</span>
              <select value={slot.from} onChange={e => updateSlot(slot.day, 'from', e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30">
                {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
              <span className="text-xs text-gray-400 flex-shrink-0">to</span>
              <select value={slot.to} onChange={e => updateSlot(slot.day, 'to', e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30">
                {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
              <button type="button" onClick={() => removeDay(slot.day)}
                className="text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors">
                ✕
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-400 pt-1">All times shown are Eastern Time (ET).</p>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic px-1">Select one or more days above to set time slots.</p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SubscribePage() {
  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState<FormData>(EMPTY);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [loading, setLoading]       = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [animDir, setAnimDir]       = useState<'left'|'right'>('right');
  const [visible, setVisible]       = useState(true);
  const [returnToReview, setReturnToReview] = useState(false);

  // Step 1 — Policy
  const [policyAgreed, setPolicyAgreed]       = useState(false);
  const [policySignature, setPolicySignature] = useState('');
  // Step 2 — Media Consent (optional)
  const [mediaConsent, setMediaConsent]       = useState(false);
  const [mediaSignature, setMediaSignature]   = useState('');
  // Step 5 — Recommendation + Billing
  const [rec, setRec]               = useState<Recommendation | null>(null);
  const [recStatus, setRecStatus]   = useState<'loading' | 'found' | 'none' | 'nologin'>('loading');
  const [billing, setBilling]       = useState<Billing>({ frequency: '', mode: '', preferredDay: null, firstDay: null, secondDay: null });

  const set  = (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));
  const setR = (f: keyof FormData) => (v: string) => setForm(p => ({ ...p, [f]: v }));

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

  // ── Per-step validation ────────────────────────────────────────────────────
  const validateStep = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
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
  };

  const goToStep = (target: number) => {
    setAnimDir(target > step ? 'right' : 'left');
    setVisible(false);
    setTimeout(() => { setStep(target); setVisible(true); window.scrollTo({ top: 0 }); }, 180);
  };

  const navigate = (dir: 'next'|'prev') => {
    if (dir === 'next') {
      const e = validateStep(step);
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
      const e = validateStep(s);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        toast.error(`Please fix ${STEPS[s-1].title}: ${Object.values(e)[0]}`);
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
      email:              form.email,
      student_first_name: form.studentFirstName,
      student_last_name:  form.studentLastName,
      student_email:      form.studentEmail,
      student_gender:     form.studentGender === 'Other' ? form.studentGenderOther : form.studentGender,
      student_school:     form.studentSchool,
      grade_level:        form.gradeLevel === 'Other' ? form.gradeLevelOther : form.gradeLevel,
      gpa:                form.gpa || null,
      relationship:       form.relationship === 'Other' ? form.relationshipOther : form.relationship,
      parent_first_name:  form.parentFirstName,
      parent_last_name:   form.parentLastName,
      parent_phone:       form.parentPhone,
      parent_email:       form.parentEmail,
      household_address:  form.householdAddress,
      has_second_parent:  form.hasSecondParent,
      parent2_first_name: form.hasSecondParent ? form.parent2FirstName : null,
      parent2_last_name:  form.hasSecondParent ? form.parent2LastName  : null,
      parent2_phone:      form.hasSecondParent ? form.parent2Phone     : null,
      parent2_email:      form.hasSecondParent ? form.parent2Email     : null,
      programme_package:  programLabel,
      availability:       availabilityText,
      availability_slots: availability,
      start_date:         form.startDate,
      additional_info:    form.additionalInfo || null,
      referral_source:    form.referralSource === 'Other' ? form.referralOther : form.referralSource,
      policy_agreed:      true,
      policy_signature:   policySignature.trim(),
      policy_agreed_at:   new Date().toISOString(),
      media_consent:      mediaConsent,
      media_signature:    mediaConsent ? mediaSignature.trim() : null,
      recommendation_id:  rec?.id ?? null,
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
      await supabase.functions.invoke('send-enrollment-email', {
        body: {
          ...payload,
          program_summary: rec?.computed_price ? {
            monthly:  rec.computed_price.smMonthlyFee,
            biweekly: rec.computed_price.smBiweekly,
            hourly:   rec.computed_price.smHourlyRate,
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

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className={`${outfit.variable} min-h-screen bg-gray-50 flex items-center justify-center p-6 font-[var(--font-outfit)]`}>
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#7FB509]/10 flex items-center justify-center mx-auto mb-6"
            style={{ animation: 'pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
            <svg className="w-10 h-10 text-[#7FB509]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">You're enrolled! 🎉</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Thank you for joining SmartMathz. A confirmation email is on its way to <strong>{form.email}</strong>.
            Our team will reach out within 48 hours to confirm your schedule.
          </p>
          <a href="/" className="mt-8 inline-block bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition-colors shadow-sm">
            ← Back to Home
          </a>
        </div>
        <style>{`@keyframes pop { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }`}</style>
      </div>
    );
  }

  const prog = (step / TOTAL_STEPS) * 100;
  const cp = rec?.computed_price;

  const ReviewSection = ({ title, targetStep, children }: {
    title: string; targetStep: number; children: React.ReactNode;
  }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <button type="button" onClick={() => editFromReview(targetStep)}
          className="flex items-center gap-1 text-xs font-semibold text-[#3a5a09] bg-[#7FB509]/10 hover:bg-[#7FB509]/20 px-2.5 py-1 rounded-lg cursor-pointer transition-colors">
          ✏️ Edit
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
  const RRow = ({ label, value }: { label: string; value: React.ReactNode }) =>
    value ? (
      <div className="flex justify-between gap-4 text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold text-gray-800 text-right">{value}</span>
      </div>
    ) : null;

  const billingSummary =
    billing.frequency === 'once'
      ? billing.mode === 'standard' ? 'Once monthly · standard (start of period)'
        : billing.preferredDay ? `Once monthly · ${billing.preferredDay}${ord(billing.preferredDay)} of the month` : 'Once monthly'
      : billing.frequency === 'twice'
        ? `Twice monthly · ${billing.firstDay}${ord(billing.firstDay ?? 0)} & ${billing.secondDay}${ord(billing.secondDay ?? 0)}`
        : '';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`${outfit.variable} min-h-screen font-[var(--font-outfit)] bg-gray-50`}>

      {/* Slim brand header (replaces the old left panel) */}
      <header className="bg-[#1a2e05] text-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <Image src="/SmartMathz.png" alt="SmartMathz" width={34} height={34} className="object-contain" />
          <div>
            <p className="font-bold text-sm leading-tight">SmartMathz Enrollment</p>
            <p className="text-white/50 text-xs">Helping every student learn, grow, and succeed</p>
          </div>
          <span className="ml-auto text-white/40 text-xs">Step {step} of {TOTAL_STEPS}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col min-h-[calc(100vh-72px)]">

        {/* Progress + step tabs */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full mb-5 overflow-hidden">
            <div className="h-full rounded-full bg-[#7FB509] transition-all duration-500" style={{ width: `${prog}%` }} />
          </div>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {STEPS.map(s => (
              <div key={s.num}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all
                  ${s.num === step ? 'bg-[#7FB509] text-white' : s.num < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${s.num === step ? 'bg-white/20' : s.num < step ? 'bg-green-200' : 'bg-gray-200'}`}>
                  {s.num < step ? '✓' : s.num}
                </span>
                {s.title}
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{STEPS[step-1].title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{STEPS[step-1].subtitle}</p>
        </div>

        <div className="flex-1 space-y-5"
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : `translateX(${animDir === 'right' ? '24px' : '-24px'})`,
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}>

          {/* ══ STEP 1: POLICY ══ */}
          {step === 1 && (
            <>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-1">SmartMathz Student & Parent Guidelines</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Welcome to SmartMathz! Our goal is to create a positive, engaging, and respectful learning environment
                  where every student can thrive. The following guidelines help ensure that students, parents, and tutors
                  have the best possible experience together.
                </p>
                <div className="space-y-5">
                  {POLICY_SECTIONS.map(sec => (
                    <div key={sec.title}>
                      <h3 className="text-sm font-bold text-[#1a2e05] mb-1.5">{sec.title}</h3>
                      {sec.intro && <p className="text-sm text-gray-600 leading-relaxed mb-1.5">{sec.intro}</p>}
                      {sec.items && (
                        <ul className="space-y-1 ml-1">
                          {sec.items.map(item => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                              <span className="text-[#7FB509] font-bold mt-0.5 flex-shrink-0">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {sec.outro && <p className="text-sm text-gray-600 leading-relaxed mt-1.5">{sec.outro}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`bg-white border rounded-2xl p-5 shadow-sm ${errors.policy ? 'border-red-300' : 'border-gray-100'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={policyAgreed}
                    onChange={e => setPolicyAgreed(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-gray-300 accent-[#7FB509] cursor-pointer" />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I have read and understand the SmartMathz Student & Parent Guidelines. I agree to support these
                    expectations to help create a positive and productive learning experience for my child.
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                {errors.policy && <p className="text-red-500 text-xs mt-2">{errors.policy}</p>}
                <div className="mt-4">
                  <SignatureInput value={policySignature} onChange={setPolicySignature} error={errors.policySignature} />
                </div>
              </div>
            </>
          )}

          {/* ══ STEP 2: MEDIA CONSENT (optional) ══ */}
          {step === 2 && (
            <>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-1">📸 Optional Media Consent</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  At SmartMathz, we love celebrating our students' learning journey. From time to time, we may take photos
                  or short videos during tutoring sessions, workshops, or special events to showcase student engagement
                  and achievements. With your permission, images or videos that include your child may be used for:
                </p>
                <ul className="space-y-1.5 mb-4">
                  {[
                    'Documenting classes, activities, and special events.',
                    'Sharing student achievements and learning experiences.',
                    'Promoting SmartMathz through our website, social media, newsletters, and other marketing materials.',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                      <span className="text-[#7FB509] font-bold mt-0.5 flex-shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your child's privacy is important to us. All images and videos will be used responsibly and only for the
                  purposes outlined above. If you believe any image has been used inappropriately, please contact us immediately.
                </p>
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 font-medium">
                  This consent is completely optional and is not required for your child's enrollment or participation in
                  the SmartMathz program. You may skip this step.
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={mediaConsent}
                    onChange={e => setMediaConsent(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-gray-300 accent-[#7FB509] cursor-pointer" />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I give SmartMathz permission to photograph or record my child and use these images/videos for the
                    educational and promotional purposes described above. <span className="text-gray-400">(Optional)</span>
                  </span>
                </label>
                {mediaConsent && (
                  <div className="mt-4">
                    <SignatureInput value={mediaSignature} onChange={setMediaSignature} error={errors.mediaSignature} />
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ STEP 3: STUDENT INFO ══ */}
          {step === 3 && (
            <>
              <Field label="Your Email" required error={errors.email}>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Student's First Name" required error={errors.studentFirstName}>
                  <input type="text" placeholder="First name" value={form.studentFirstName} onChange={set('studentFirstName')} className={inputCls} />
                </Field>
                <Field label="Student's Last Name" required error={errors.studentLastName}>
                  <input type="text" placeholder="Last name" value={form.studentLastName} onChange={set('studentLastName')} className={inputCls} />
                </Field>
              </div>
              <Field label="Student's Email" required error={errors.studentEmail}>
                <input type="email" placeholder="student@example.com" value={form.studentEmail} onChange={set('studentEmail')} className={inputCls} />
              </Field>
              <Field label="Student Identifies As" required error={errors.studentGender}>
                <Radio options={GENDERS} value={form.studentGender} onChange={setR('studentGender')}
                  showOther otherValue={form.studentGenderOther} onOtherChange={v => setForm(p => ({ ...p, studentGenderOther: v }))} />
              </Field>
              <Field label="Student's School" required error={errors.studentSchool}>
                <input type="text" placeholder="School name" value={form.studentSchool} onChange={set('studentSchool')} className={inputCls} />
              </Field>
              <Field label="Grade Level" required error={errors.gradeLevel}>
                <div className="grid grid-cols-3 gap-2">
                  {GRADES.filter(g => g !== 'Other').map(grade => (
                    <button key={grade} type="button" onClick={() => setR('gradeLevel')(grade)}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-center cursor-pointer transition-all
                        ${form.gradeLevel === grade
                          ? 'border-[#7FB509] bg-[#7FB509]/8 text-[#3a5a09] font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'}`}>
                      {grade}
                    </button>
                  ))}
                  <button type="button" onClick={() => setR('gradeLevel')('Other')}
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
                <input type="text" placeholder="e.g. 3.5 or B+" value={form.gpa} onChange={set('gpa')} className={inputCls} />
              </Field>
            </>
          )}

          {/* ══ STEP 4: PARENT DETAILS ══ */}
          {step === 4 && (
            <>
              <Field label="Your Relationship to the Student" required error={errors.relationship}>
                <Radio options={RELATIONSHIPS} value={form.relationship} onChange={setR('relationship')}
                  showOther otherValue={form.relationshipOther} onOtherChange={v => setForm(p => ({ ...p, relationshipOther: v }))} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Parent/Guardian First Name" required error={errors.parentFirstName}>
                  <input type="text" placeholder="First name" value={form.parentFirstName} onChange={set('parentFirstName')} className={inputCls} />
                </Field>
                <Field label="Parent/Guardian Last Name" required error={errors.parentLastName}>
                  <input type="text" placeholder="Last name" value={form.parentLastName} onChange={set('parentLastName')} className={inputCls} />
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
                <input type="email" placeholder="parent@example.com" value={form.parentEmail} onChange={set('parentEmail')} className={inputCls} />
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
                      <input type="text" placeholder="First name" value={form.parent2FirstName} onChange={set('parent2FirstName')} className={inputCls} />
                    </Field>
                    <Field label="Last Name" required error={errors.parent2LastName}>
                      <input type="text" placeholder="Last name" value={form.parent2LastName} onChange={set('parent2LastName')} className={inputCls} />
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
                    <input type="email" placeholder="parent2@example.com" value={form.parent2Email} onChange={set('parent2Email')} className={inputCls} />
                  </Field>
                </div>
              )}

              <Field label="Household Address (or your city)" required error={errors.householdAddress}>
                <textarea placeholder="123 Main St, City, State" value={form.householdAddress} onChange={set('householdAddress')} rows={3}
                  className={`${inputCls} resize-none`} />
              </Field>
            </>
          )}

          {/* ══ STEP 5: PROGRAM & BILLING ══ */}
          {step === 5 && (
            <>
              {recStatus === 'loading' && (
                <div className="flex flex-col items-center py-16 gap-3">
                  <ClipLoader size={28} color="#7FB509" />
                  <p className="text-sm text-gray-400">Loading your personalized program...</p>
                </div>
              )}

              {recStatus === 'nologin' && (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                  <div className="text-4xl mb-3">🔐</div>
                  <h3 className="font-bold text-gray-900 mb-2">Please log in to continue</h3>
                  <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
                    Your personalized program is linked to your SmartMathz account — the one your child used for the
                    evaluation test. Log in to see your recommended program and pricing.
                  </p>
                  <Link href="/login"
                    className="inline-block bg-[#7FB509] hover:bg-[#6b970a] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
                    Log In
                  </Link>
                </div>
              )}

              {recStatus === 'none' && (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                  <div className="text-4xl mb-3">⏳</div>
                  <h3 className="font-bold text-gray-900 mb-2">Your personalized program is being prepared</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Our academic team is reviewing your child's evaluation results and preparing a tailored program
                    recommendation. You'll receive an email as soon as it's ready — then you can return here to
                    complete enrollment. If your child hasn't taken the evaluation yet, that's the first step!
                  </p>
                </div>
              )}

              {recStatus === 'found' && rec && (
                <>
                  {/* Recommendation card — read-only, set by the SmartMathz team */}
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="bg-[#1a2e05] text-white px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3d926] mb-0.5">
                        Recommended for {rec.student_name}
                      </p>
                      <p className="font-bold text-lg">
                        {rec.package_id === 'custom' ? 'Custom Package' : `Package ${rec.package_id}`}
                      </p>
                      <p className="text-white/60 text-xs mt-0.5">
                        {rec.package_id === 'custom'
                          ? (rec.custom_subjects ?? []).map(s => s.name).join(' + ')
                          : rec.package_id === 'I'
                            ? 'Math Tutoring Only'
                            : `Math Tutoring${(rec.additional_programs ?? []).length ? ' + ' + (rec.additional_programs ?? []).join(' + ') : ''} + Virtual Library`}
                      </p>
                    </div>
                    <div className="bg-white p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Sessions / Mo</p>
                        <p className="font-bold text-gray-900">{rec.sessions ?? cp?.sessions ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Hourly Rate</p>
                        <p className="font-bold text-gray-900">{cp ? `$${cp.smHourlyRate.toFixed(2)}` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Monthly</p>
                        <p className="font-bold text-green-700 text-lg">{cp ? `$${cp.smMonthlyFee}` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Bi-Weekly</p>
                        <p className="font-bold text-gray-900">{cp ? `$${cp.smBiweekly.toFixed(1)}` : '—'}</p>
                      </div>
                    </div>
                    {cp && cp.savingsPercent > 0 && (
                      <div className="bg-green-50 border-t border-green-100 px-5 py-2.5 text-center">
                        <p className="text-xs font-bold text-green-700">
                          🎉 You're saving {cp.savingsPercent}% (${cp.smInvestment}/month) with your SmartMathz offer
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Billing frequency */}
                  <Field label="Payment Frequency" required error={errors.billing}>
                    <select
                      value={billing.frequency}
                      onChange={e => setBilling({ frequency: e.target.value as Billing['frequency'], mode: '', preferredDay: null, firstDay: null, secondDay: null })}
                      className={`${inputCls} cursor-pointer`}>
                      <option value="" disabled>Select how often you'd like to pay...</option>
                      <option value="once">Once per month</option>
                      <option value="twice">Twice per month</option>
                    </select>
                  </Field>

                  {billing.frequency === 'once' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'standard',  title: 'Standard',              sub: 'Billed at the start of each period' },
                          { id: 'preferred', title: 'Preferred payment day', sub: 'Choose the day of the month you pay' },
                        ].map(opt => (
                          <button key={opt.id} type="button"
                            onClick={() => setBilling(b => ({ ...b, mode: opt.id as Billing['mode'], preferredDay: opt.id === 'standard' ? null : b.preferredDay }))}
                            className={`text-left px-4 py-3.5 rounded-xl border transition-all cursor-pointer
                              ${billing.mode === opt.id
                                ? 'border-[#7FB509] bg-[#7FB509]/5'
                                : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                            <p className={`text-sm font-bold ${billing.mode === opt.id ? 'text-[#3a5a09]' : 'text-gray-800'}`}>{opt.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                          </button>
                        ))}
                      </div>
                      {billing.mode === 'preferred' && (
                        <DaySelect value={billing.preferredDay}
                          onChange={d => setBilling(b => ({ ...b, preferredDay: d }))}
                          placeholder="Select your preferred payment day..." />
                      )}
                    </div>
                  )}

                  {billing.frequency === 'twice' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="First Payment Day" required>
                        <DaySelect value={billing.firstDay}
                          onChange={d => setBilling(b => ({ ...b, firstDay: d }))}
                          placeholder="Select first payment day..." />
                      </Field>
                      <Field label="Second Payment Day" required>
                        <DaySelect value={billing.secondDay}
                          onChange={d => setBilling(b => ({ ...b, secondDay: d }))}
                          placeholder="Select second payment day..." />
                      </Field>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ══ STEP 6: SCHEDULING ══ */}
          {step === 6 && (
            <>
              <Field label="Days and times the student is available" required error={errors.availability}>
                <AvailabilityPicker slots={availability} onChange={setAvailability} />
              </Field>
              <Field label="Potential start date" required error={errors.startDate}>
                <input type="date" value={form.startDate} onChange={set('startDate')} className={inputCls} />
              </Field>
              <Field label="Any additional information?">
                <textarea placeholder="Learning needs, goals, anything else we should know..."
                  value={form.additionalInfo} onChange={set('additionalInfo')} rows={3}
                  className={`${inputCls} resize-none`} />
              </Field>
              <Field label="How did you hear about SmartMathz?" required error={errors.referralSource}>
                <Radio options={REFERRALS} value={form.referralSource} onChange={setR('referralSource')}
                  showOther otherValue={form.referralOther} onOtherChange={v => setForm(p => ({ ...p, referralOther: v }))} />
              </Field>
            </>
          )}

          {/* ══ STEP 7: REVIEW & SUBMIT ══ */}
          {step === 7 && (
            <>
              <ReviewSection title="📋 Policy Agreement" targetStep={1}>
                <RRow label="Guidelines accepted" value={policyAgreed ? 'Yes' : 'No'} />
                <RRow label="Signed by" value={
                  <span className={`${signatureFont.className} text-xl`}>{policySignature}</span>
                } />
              </ReviewSection>

              <ReviewSection title="📸 Media Consent" targetStep={2}>
                <RRow label="Consent given" value={mediaConsent ? 'Yes' : 'No (skipped)'} />
                {mediaConsent && (
                  <RRow label="Signed by" value={
                    <span className={`${signatureFont.className} text-xl`}>{mediaSignature}</span>
                  } />
                )}
              </ReviewSection>

              <ReviewSection title="🎓 Student" targetStep={3}>
                <RRow label="Name" value={`${form.studentFirstName} ${form.studentLastName}`} />
                <RRow label="Email" value={form.studentEmail} />
                <RRow label="Gender" value={form.studentGender === 'Other' ? form.studentGenderOther : form.studentGender} />
                <RRow label="School" value={form.studentSchool} />
                <RRow label="Grade" value={form.gradeLevel === 'Other' ? form.gradeLevelOther : form.gradeLevel} />
                <RRow label="GPA" value={form.gpa} />
                <RRow label="Contact email" value={form.email} />
              </ReviewSection>

              <ReviewSection title="👨‍👩‍👧 Parent / Guardian" targetStep={4}>
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

              <ReviewSection title="📦 Program & Billing" targetStep={5}>
                <RRow label="Package" value={rec ? (rec.package_id === 'custom' ? 'Custom Package' : `Package ${rec.package_id}`) : '—'} />
                {(rec?.additional_programs ?? []).length > 0 && (
                  <RRow label="Programs" value={(rec!.additional_programs ?? []).join(', ')} />
                )}
                <RRow label="Sessions / month" value={rec?.sessions ?? cp?.sessions} />
                <RRow label="Monthly fee" value={cp ? `$${cp.smMonthlyFee}` : undefined} />
                <RRow label="Bi-weekly" value={cp ? `$${cp.smBiweekly.toFixed(1)}` : undefined} />
                <RRow label="Payment plan" value={billingSummary} />
              </ReviewSection>

              <ReviewSection title="🗓️ Scheduling" targetStep={6}>
                <RRow label="Availability" value={availability.map(s => `${s.day.slice(0,3)} ${s.from}–${s.to}`).join(', ')} />
                <RRow label="Start date" value={form.startDate} />
                <RRow label="Referral" value={form.referralSource === 'Other' ? form.referralOther : form.referralSource} />
                <RRow label="Notes" value={form.additionalInfo} />
              </ReviewSection>
            </>
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