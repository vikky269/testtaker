'use client';

// app/admin/dashboard/subscriptions/page.tsx
// Admin subscriptions table + "Add New Enrollment" 4-step modal
// Updated: optional second parent/guardian + structured day/time availability picker
// (now matches the public /subscribe enrollment form)

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Subscription {
  id:                 string;
  created_at:         string;
  email:              string;
  student_first_name: string;
  student_last_name:  string;
  student_email:      string;
  student_gender:     string;
  student_school:     string;
  grade_level:        string;
  gpa:                string | null;
  relationship:       string;
  parent_first_name:  string;
  parent_last_name:   string;
  parent_phone:       string;
  parent_email:       string;
  household_address:  string;

  // Second parent/guardian — may be null if not provided
  has_second_parent:  boolean | null;
  parent2_first_name: string | null;
  parent2_last_name:  string | null;
  parent2_phone:      string | null;
  parent2_email:      string | null;

  programme_package:  string;
  availability:        string;
  availability_slots:  { day: string; from: string; to: string }[] | null;
  start_date:         string;
  additional_info:    string | null;
  referral_source:    string;


  // New enrollment-form fields
  policy_agreed:      boolean | null;
  policy_signature:   string | null;
  policy_agreed_at:   string | null;
  media_consent:      boolean | null;
  media_signature:    string | null;
  recommendation_id:  string | null;
  billing: {
    frequency?: 'once' | 'twice';
    mode?: 'standard' | 'preferred';
    preferredDay?: number;
    firstDay?: number;
    secondDay?: number;
  } | null;
}

interface AvailabilitySlot {
  day:  string;
  from: string;
  to:   string;
}

interface FormData {
  email: string;
  studentFirstName: string; studentLastName: string; studentEmail: string;
  studentGender: string; studentGenderOther: string;
  studentSchool: string; gradeLevel: string; gradeLevelOther: string; gpa: string;
  relationship: string; relationshipOther: string;
  parentFirstName: string; parentLastName: string;
  parentPhone: string; parentEmail: string; householdAddress: string;

  // Second parent/guardian — optional
  hasSecondParent:  boolean;
  parent2FirstName: string;
  parent2LastName:  string;
  parent2Phone:     string;
  parent2Email:     string;

  programmePackage: string; packageOther: string;
  startDate: string;
  additionalInfo: string; referralSource: string; referralOther: string;
}

const EMPTY: FormData = {
  email:'', studentFirstName:'', studentLastName:'', studentEmail:'',
  studentGender:'', studentGenderOther:'', studentSchool:'',
  gradeLevel:'', gradeLevelOther:'', gpa:'',
  relationship:'', relationshipOther:'',
  parentFirstName:'', parentLastName:'', parentPhone:'', parentEmail:'', householdAddress:'',
  hasSecondParent: false, parent2FirstName:'', parent2LastName:'', parent2Phone:'', parent2Email:'',
  programmePackage:'', packageOther:'',
  startDate:'',
  additionalInfo:'', referralSource:'', referralOther:'',
};

// ── Constants ─────────────────────────────────────────────────────────────────
const GRADES       = ['Pre-K','Kindergarten','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','Other'];
const GENDERS      = ['Male','Female','Genderqueer/Non-binary','Prefer not to disclose','Other'];
const RELATIONSHIPS= ['I am the student','Parent','Guardian','Other'];
const REFERRALS    = ['Google Search','Social Media','Friend / Family Referral','School','Advertisement','Other'];
const PACKAGES     = [
  'Package 1 — Math Tutoring Only',
  'Package 2 — Math Tutoring, 1 Additional Program & Weekend Virtual Library',
  'Package 3 — Math Tutoring, 2 Additional Programs & Weekend Virtual Library',
  'Other',
];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

// 30-min increments from 6:00 AM to 10:00 PM, Eastern Time
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
  { num: 1, title: 'Student Info',   subtitle: 'Student details'         },
  { num: 2, title: 'Parent Details', subtitle: 'Parent/guardian contact' },
  { num: 3, title: 'Programme',      subtitle: 'Package selection'       },
  { num: 4, title: 'Scheduling',     subtitle: 'Availability & start'    },
];




const ord = (n: number) => {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const fmtBilling = (b: Subscription['billing']) => {
  if (!b?.frequency) return null;
  if (b.frequency === 'once') {
    return b.mode === 'preferred' && b.preferredDay
      ? `Once a month — ${ord(b.preferredDay)} of the month`
      : 'Once a month — standard (start of period)';
  }
  if (b.frequency === 'twice' && b.firstDay && b.secondDay) {
    return `Twice a month — ${ord(b.firstDay)} and ${ord(b.secondDay)}`;
  }
  return null;
};

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });


// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const packageColor = (pkg: string) => {
  if (pkg.includes('Package 1')) return 'bg-blue-50 text-blue-700';
  if (pkg.includes('Package 2')) return 'bg-green-50 text-green-700';
  if (pkg.includes('Package 3')) return 'bg-purple-50 text-purple-700';
  return 'bg-gray-100 text-gray-600';
};

const inputCls = `w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white
  focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
  placeholder:text-gray-400 transition-all`;

// ── Small reusable form pieces ────────────────────────────────────────────────
const Field = ({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-gray-700">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-[11px]">{error}</p>}
  </div>
);

const Radio = ({ options, value, onChange, showOther, otherValue, onOtherChange, grid }: {
  options: string[]; value: string; onChange: (v: string) => void;
  showOther?: boolean; otherValue?: string; onOtherChange?: (v: string) => void;
  grid?: boolean;
}) => (
  <div className={grid ? 'grid grid-cols-3 gap-1.5' : 'space-y-1.5'}>
    {options.filter(o => grid ? o !== 'Other' : true).map(opt => (
      <button key={opt} type="button" onClick={() => onChange(opt)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-left transition-all cursor-pointer
          ${value === opt
            ? 'border-[#7FB509] bg-[#7FB509]/8 text-[#3a5a09] font-semibold'
            : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'}`}>
        <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          ${value === opt ? 'border-[#7FB509]' : 'border-gray-300'}`}>
          {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-[#7FB509]" />}
        </div>
        {opt}
      </button>
    ))}
    {grid && (
      <button type="button" onClick={() => onChange('Other')}
        className={`col-span-3 flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer
          ${value === 'Other'
            ? 'border-[#7FB509] bg-[#7FB509]/8 text-[#3a5a09] font-semibold'
            : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'}`}>
        <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          ${value === 'Other' ? 'border-[#7FB509]' : 'border-gray-300'}`}>
          {value === 'Other' && <div className="w-1.5 h-1.5 rounded-full bg-[#7FB509]" />}
        </div>
        Other
      </button>
    )}
    {showOther && value === 'Other' && (
      <input type="text" placeholder="Please specify..."
        value={otherValue ?? ''} onChange={e => onOtherChange?.(e.target.value)}
        className={`${inputCls} ${grid ? 'col-span-3' : ''} mt-1`} />
    )}
  </div>
);

// ── Day/Time Availability Picker (compact, for the admin modal) ───────────────
function AvailabilityPicker({
  slots, onChange,
}: {
  slots: AvailabilitySlot[];
  onChange: (slots: AvailabilitySlot[]) => void;
}) {
  const selectedDays = slots.map(s => s.day);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      onChange(slots.filter(s => s.day !== day));
    } else {
      onChange([...slots, { day, from: '3:00 PM', to: '5:00 PM' }]);
    }
  };

  const updateSlot = (day: string, field: 'from' | 'to', value: string) => {
    onChange(slots.map(s => s.day === day ? { ...s, [field]: value } : s));
  };

  const removeDay = (day: string) => {
    onChange(slots.filter(s => s.day !== day));
  };

  // Keep slots ordered Mon → Sun regardless of click order
  const orderedSlots = DAYS
    .map(day => slots.find(s => s.day === day))
    .filter((s): s is AvailabilitySlot => !!s);

  return (
    <div className="space-y-2.5">
      {/* Day toggle buttons */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(day => {
          const isSelected = selectedDays.includes(day);
          return (
            <button key={day} type="button" onClick={() => toggleDay(day)}
              className={`px-1 py-2 rounded-lg border text-[11px] font-semibold text-center cursor-pointer transition-all
                ${isSelected
                  ? 'border-[#7FB509] bg-[#7FB509] text-white shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}>
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Time slot rows for selected days */}
      {orderedSlots.length > 0 ? (
        <div className="space-y-1.5">
          {orderedSlots.map(slot => (
            <div key={slot.day}
              className="flex items-center gap-2 bg-[#7FB509]/5 border border-[#7FB509]/20 rounded-xl px-2.5 py-2">
              <span className="text-xs font-semibold text-[#3a5a09] w-16 flex-shrink-0">{slot.day.slice(0, 3)}</span>

              <select value={slot.from} onChange={e => updateSlot(slot.day, 'from', e.target.value)}
                className="flex-1 min-w-0 px-1.5 py-1 text-[11px] border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30">
                {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>

              <span className="text-[10px] text-gray-400 flex-shrink-0">to</span>

              <select value={slot.to} onChange={e => updateSlot(slot.day, 'to', e.target.value)}
                className="flex-1 min-w-0 px-1.5 py-1 text-[11px] border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30">
                {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>

              <button type="button" onClick={() => removeDay(slot.day)}
                className="text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors text-xs">
                ✕
              </button>
            </div>
          ))}
          <p className="text-[10px] text-gray-400">All times shown are Eastern Time (ET).</p>
        </div>
      ) : (
        <p className="text-[11px] text-gray-400 italic px-1">Select one or more days above to set time slots.</p>
      )}
    </div>
  );
}

const DetailRow = ({ label, value }: { label: string; value: string | null | undefined }) =>
  value ? (
    <div className="py-2 border-b border-gray-50 last:border-0">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  ) : null;

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3a5a09] mt-4 mb-1 border-b border-green-100 pb-1">{title}</h3>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SubscriptionsPage() {
  const [subs, setSubs]         = useState<Subscription[]>([]);
  const [filtered, setFiltered] = useState<Subscription[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [pkgFilter, setPkgFilter] = useState('All');
  const [selected, setSelected] = useState<Subscription | null>(null);

  // Add enrollment modal state
  const [showAdd, setShowAdd]   = useState(false);
  const [step, setStep]         = useState(1);
  const [form, setForm]         = useState<FormData>(EMPTY);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [availError, setAvailError]     = useState('');
  const [errors, setErrors]     = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [animDir, setAnimDir]   = useState<'right'|'left'>('right');
  const [visible, setVisible]   = useState(true);

  // ── Load data ──────────────────────────────────────────────────────────────
  const loadSubs = async () => {
    const { data, error } = await supabase
      .from('subscriptions').select('*').order('created_at', { ascending: false });
    if (!error && data) { setSubs(data); setFiltered(data); }
    setLoading(false);
  };

  useEffect(() => { loadSubs(); }, []);

  useEffect(() => {
    let out = [...subs];
    if (pkgFilter !== 'All') out = out.filter(s => s.programme_package.includes(pkgFilter));
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(s =>
        `${s.student_first_name} ${s.student_last_name}`.toLowerCase().includes(q) ||
        s.parent_email.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }
    setFiltered(out);
  }, [subs, search, pkgFilter]);

  // ── Form helpers ───────────────────────────────────────────────────────────
  const setF  = (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));
  const setR  = (f: keyof FormData) => (v: string) => setForm(p => ({ ...p, [f]: v }));

  const validateStep = (s: number): Partial<Record<keyof FormData, string>> => {
    const e: Partial<Record<keyof FormData, string>> = {};
    const req = (f: keyof FormData, label: string) => { if (!form[f]) e[f] = `${label} is required`; };
    if (s === 1) {
      req('email','Email'); req('studentFirstName','First name'); req('studentLastName','Last name');
      req('studentEmail',"Student's email"); req('studentGender','Gender');
      req('studentSchool','School'); req('gradeLevel','Grade level');
    }
    if (s === 2) {
      req('relationship','Relationship'); req('parentFirstName','First name');
      req('parentLastName','Last name'); req('parentPhone','Phone');
      req('parentEmail','Email'); req('householdAddress','Address');
      // Second parent fields only required if toggle is on
      if (form.hasSecondParent) {
        if (!form.parent2FirstName) e.parent2FirstName = 'First name is required';
        if (!form.parent2LastName)  e.parent2LastName  = 'Last name is required';
        if (!form.parent2Phone)     e.parent2Phone     = 'Phone is required';
        if (!form.parent2Email)     e.parent2Email     = 'Email is required';
      }
    }
    if (s === 3) req('programmePackage','Programme package');
    if (s === 4) {
      req('startDate','Start date');
      req('referralSource','Referral source');
    }
    return e;
  };

  const navigate = (dir: 'next'|'prev') => {
    if (dir === 'next') {
      const e = validateStep(step);
      if (Object.keys(e).length > 0) { setErrors(e); toast.error('Please fill in all required fields.'); return; }
      setErrors({});
    }
    setAnimDir(dir === 'next' ? 'right' : 'left');
    setVisible(false);
    setTimeout(() => { setStep(p => dir === 'next' ? p + 1 : p - 1); setVisible(true); }, 160);
  };

  const openAdd = () => {
    setForm(EMPTY); setErrors({}); setAvailability([]); setAvailError('');
    setStep(1); setVisible(true); setShowAdd(true);
  };

  const handleAddSubmit = async () => {
    const e = validateStep(4);
    if (availability.length === 0) {
      setAvailError('Please select at least one day and time.');
    }
    if (Object.keys(e).length > 0 || availability.length === 0) {
      setErrors(e);
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    // Format availability as readable text for storage + display
    const availabilityText = availability
      .map(s => `${s.day} ${s.from} - ${s.to} ET`)
      .join(', ');

    const { error } = await supabase.from('subscriptions').insert([{
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

      // Second parent — null if not provided
      has_second_parent:  form.hasSecondParent,
      parent2_first_name: form.hasSecondParent ? form.parent2FirstName : null,
      parent2_last_name:  form.hasSecondParent ? form.parent2LastName  : null,
      parent2_phone:      form.hasSecondParent ? form.parent2Phone     : null,
      parent2_email:      form.hasSecondParent ? form.parent2Email     : null,

      programme_package:  form.programmePackage === 'Other' ? form.packageOther : form.programmePackage,
      availability:       availabilityText,
      availability_slots: availability,   // JSONB column — structured data
      start_date:         form.startDate,
      additional_info:    form.additionalInfo || null,
      referral_source:    form.referralSource === 'Other' ? form.referralOther : form.referralSource,
    }]);

    setSubmitting(false);

    if (error) { toast.error('Failed to save. Please try again.'); return; }

    toast.success('Enrollment added successfully!');
    setShowAdd(false);
    setForm(EMPTY);
    setAvailability([]);
    setStep(1);
    loadSubs(); // refresh table
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <div className="p-8 text-gray-500">Loading subscriptions...</div>;

  const prog = (step / 4) * 100;

  return (
    <div className=" max-w-7xl ">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">All enrolment form submissions from parents of newly enrolled students.</p>
        </div>
        {/* ← Add New Enrollment button */}
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2e05] hover:bg-[#2a4a09] text-white
                     text-sm font-semibold rounded-xl cursor-pointer transition-colors shadow-sm whitespace-nowrap flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Enrollment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total',     val: subs.length,                                                                    color: 'text-gray-800',   bg: 'bg-gray-50'   },
          { label: 'Package 1', val: subs.filter(s => s.programme_package.includes('Package 1')).length,             color: 'text-blue-700',   bg: 'bg-blue-50'   },
          { label: 'Package 2', val: subs.filter(s => s.programme_package.includes('Package 2')).length,             color: 'text-green-700',  bg: 'bg-green-50'  },
          { label: 'Package 3', val: subs.filter(s => s.programme_package.includes('Package 3')).length,             color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 text-center border border-white`}>
            <p className={`text-2xl font-extrabold ${color}`}>{val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={pkgFilter} onChange={e => setPkgFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none cursor-pointer">
          {['All','Package 1','Package 2','Package 3'].map(p => <option key={p}>{p}</option>)}
        </select>
        <span className="hidden sm:flex items-center text-xs text-gray-400 whitespace-nowrap">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#','STUDENT','GRADE','PARENT','PHONE','PACKAGE','START DATE','SUBMITTED','DETAILS'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No submissions found</td></tr>
              ) : filtered.map((s, idx) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 text-sm">{s.student_first_name} {s.student_last_name}</p>
                    <p className="text-xs text-gray-400">{s.student_email}</p>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.grade_level}</span></td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800 flex items-center gap-1.5">
                      {s.parent_first_name} {s.parent_last_name}
                      {s.has_second_parent && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full">+1</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{s.parent_email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.parent_phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${packageColor(s.programme_package)}`}>
                      {s.programme_package.split('—')[0].trim()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{fmt(s.start_date)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmt(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(s)}
                      className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ADD ENROLLMENT MODAL — 4 steps
      ══════════════════════════════════════════════════════════════ */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">

            {/* Modal header — sticky */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Add New Enrollment</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{STEPS[step-1].subtitle}</p>
                </div>
                <button onClick={() => setShowAdd(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400">✕</button>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full bg-[#7FB509] transition-all duration-400" style={{ width: `${prog}%` }} />
              </div>

              {/* Step tabs */}
              <div className="flex gap-1.5">
                {STEPS.map(s => (
                  <div key={s.num}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all
                      ${s.num === step ? 'bg-[#7FB509] text-white' : s.num < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold
                      ${s.num === step ? 'bg-white/20' : s.num < step ? 'bg-green-200' : 'bg-gray-200'}`}>
                      {s.num < step ? '✓' : s.num}
                    </span>
                    {s.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable form body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div
                className="space-y-3"
                style={{
                  opacity:   visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : `translateX(${animDir === 'right' ? '20px' : '-20px'})`,
                  transition: 'opacity 0.16s ease, transform 0.16s ease',
                }}>

                {/* ── STEP 1: Student Info ── */}
                {step === 1 && (
                  <>
                    <Field label="Contact Email" required error={errors.email}>
                      <input type="email" placeholder="Contact email" value={form.email} onChange={setF('email')} className={inputCls} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Student First Name" required error={errors.studentFirstName}>
                        <input type="text" placeholder="First name" value={form.studentFirstName} onChange={setF('studentFirstName')} className={inputCls} />
                      </Field>
                      <Field label="Student Last Name" required error={errors.studentLastName}>
                        <input type="text" placeholder="Last name" value={form.studentLastName} onChange={setF('studentLastName')} className={inputCls} />
                      </Field>
                    </div>
                    <Field label="Student Email" required error={errors.studentEmail}>
                      <input type="email" placeholder="student@example.com" value={form.studentEmail} onChange={setF('studentEmail')} className={inputCls} />
                    </Field>
                    <Field label="Student Identifies As" required error={errors.studentGender}>
                      <Radio options={GENDERS} value={form.studentGender} onChange={setR('studentGender')}
                        showOther otherValue={form.studentGenderOther} onOtherChange={v => setForm(p => ({ ...p, studentGenderOther: v }))} />
                    </Field>
                    <Field label="Student's School" required error={errors.studentSchool}>
                      <input type="text" placeholder="School name" value={form.studentSchool} onChange={setF('studentSchool')} className={inputCls} />
                    </Field>
                    <Field label="Grade Level" required error={errors.gradeLevel}>
                      <Radio options={GRADES} value={form.gradeLevel} onChange={setR('gradeLevel')} grid
                        showOther otherValue={form.gradeLevelOther} onOtherChange={v => setForm(p => ({ ...p, gradeLevelOther: v }))} />
                    </Field>
                    <Field label="GPA or Average Grade">
                      <input type="text" placeholder="e.g. 3.5 or B+" value={form.gpa} onChange={setF('gpa')} className={inputCls} />
                    </Field>
                  </>
                )}

                {/* ── STEP 2: Parent Info ── */}
                {step === 2 && (
                  <>
                    <Field label="Relationship to Student" required error={errors.relationship}>
                      <Radio options={RELATIONSHIPS} value={form.relationship} onChange={setR('relationship')}
                        showOther otherValue={form.relationshipOther} onOtherChange={v => setForm(p => ({ ...p, relationshipOther: v }))} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Parent First Name" required error={errors.parentFirstName}>
                        <input type="text" placeholder="First name" value={form.parentFirstName} onChange={setF('parentFirstName')} className={inputCls} />
                      </Field>
                      <Field label="Parent Last Name" required error={errors.parentLastName}>
                        <input type="text" placeholder="Last name" value={form.parentLastName} onChange={setF('parentLastName')} className={inputCls} />
                      </Field>
                    </div>
                    <Field label="Phone Number" required error={errors.parentPhone}>
                      <input type="tel" placeholder="+1 (555) 000-0000" value={form.parentPhone} onChange={setF('parentPhone')} className={inputCls} />
                    </Field>
                    <Field label="Parent Email" required error={errors.parentEmail}>
                      <input type="email" placeholder="parent@example.com" value={form.parentEmail} onChange={setF('parentEmail')} className={inputCls} />
                    </Field>

                    {/* ── Add second parent toggle ── */}
                    {!form.hasSecondParent ? (
                      <button type="button"
                        onClick={() => setForm(p => ({ ...p, hasSecondParent: true }))}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#7FB509]/40
                                   text-[#3a5a09] text-xs font-semibold hover:bg-[#7FB509]/5 cursor-pointer transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Second Parent / Guardian
                      </button>
                    ) : (
                      <div className="border border-[#7FB509]/20 bg-[#7FB509]/5 rounded-2xl p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#3a5a09]">Second Parent / Guardian</p>
                          <button type="button"
                            onClick={() => setForm(p => ({
                              ...p, hasSecondParent: false,
                              parent2FirstName: '', parent2LastName: '', parent2Phone: '', parent2Email: '',
                            }))}
                            className="text-red-400 hover:text-red-600 cursor-pointer text-[11px] font-semibold flex items-center gap-1">
                            ✕ Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="First Name" required error={errors.parent2FirstName}>
                            <input type="text" placeholder="First name" value={form.parent2FirstName} onChange={setF('parent2FirstName')} className={inputCls} />
                          </Field>
                          <Field label="Last Name" required error={errors.parent2LastName}>
                            <input type="text" placeholder="Last name" value={form.parent2LastName} onChange={setF('parent2LastName')} className={inputCls} />
                          </Field>
                        </div>

                        <Field label="Phone Number" required error={errors.parent2Phone}>
                          <input type="tel" placeholder="+1 (555) 000-0000" value={form.parent2Phone} onChange={setF('parent2Phone')} className={inputCls} />
                        </Field>

                        <Field label="Email" required error={errors.parent2Email}>
                          <input type="email" placeholder="parent2@example.com" value={form.parent2Email} onChange={setF('parent2Email')} className={inputCls} />
                        </Field>
                      </div>
                    )}

                    <Field label="Household Address" required error={errors.householdAddress}>
                      <textarea placeholder="123 Main St, City, State" value={form.householdAddress} onChange={setF('householdAddress')} rows={2}
                        className={`${inputCls} resize-none`} />
                    </Field>
                  </>
                )}

                {/* ── STEP 3: Programme ── */}
                {step === 3 && (
                  <Field label="Programme Package" required error={errors.programmePackage}>
                    <Radio options={PACKAGES} value={form.programmePackage} onChange={setR('programmePackage')}
                      showOther otherValue={form.packageOther} onOtherChange={v => setForm(p => ({ ...p, packageOther: v }))} />
                  </Field>
                )}

                {/* ── STEP 4: Scheduling + Summary ── */}
                {step === 4 && (
                  <>
                    <Field label="Days and times the student is available" required error={availError}>
                      <AvailabilityPicker slots={availability} onChange={setAvailability} />
                    </Field>
                    <Field label="Potential Start Date" required error={errors.startDate}>
                      <input type="date" value={form.startDate} onChange={setF('startDate')} className={inputCls} />
                    </Field>
                    <Field label="Additional Information">
                      <textarea placeholder="Any extra context or notes..."
                        value={form.additionalInfo} onChange={setF('additionalInfo')} rows={2}
                        className={`${inputCls} resize-none`} />
                    </Field>
                    <Field label="How did they hear about SmartMathz?" required error={errors.referralSource}>
                      <Radio options={REFERRALS} value={form.referralSource} onChange={setR('referralSource')}
                        showOther otherValue={form.referralOther} onOtherChange={v => setForm(p => ({ ...p, referralOther: v }))} />
                    </Field>

                    {/* Summary card */}
                    <div className="bg-[#1a2e05]/5 border border-[#7FB509]/20 rounded-xl p-3 space-y-1.5 mt-1">
                      <p className="text-[11px] font-bold text-[#3a5a09] uppercase tracking-wide mb-2">Enrollment Summary</p>
                      {[
                        { label: 'Student',      val: `${form.studentFirstName} ${form.studentLastName}` },
                        { label: 'Grade',        val: form.gradeLevel },
                        { label: 'Package',      val: form.programmePackage.split('—')[0].trim() },
                        { label: 'Parent',       val: `${form.parentFirstName} ${form.parentLastName}` },
                        { label: 'Parent 2',     val: form.hasSecondParent ? `${form.parent2FirstName} ${form.parent2LastName}` : '' },
                        { label: 'Availability', val: availability.map(s => s.day.slice(0, 3)).join(', ') },
                        { label: 'Start',        val: form.startDate },
                      ].filter(r => r.val.trim()).map(({ label, val }) => (
                        <div key={label} className="flex justify-between text-xs">
                          <span className="text-gray-400">{label}</span>
                          <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">{val}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer nav — sticky */}
            <div className={`px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
              {step > 1 && (
                <button onClick={() => navigate('prev')}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer transition-colors">
                  ← Back
                </button>
              )}
              {step < 4 ? (
                <button onClick={() => navigate('next')}
                  className="px-6 py-2.5 rounded-xl bg-[#1a2e05] hover:bg-[#2a4a09] text-white text-sm font-bold cursor-pointer transition-colors ml-auto">
                  Continue →
                </button>
              ) : (
                <button onClick={handleAddSubmit} disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#1a2e05] hover:bg-[#2a4a09] text-white text-sm font-bold
                             flex items-center justify-center gap-2 cursor-pointer transition-colors
                             disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting
                    ? <><ClipLoader size={16} color="#fff" /><span>Saving...</span></>
                    : '✅ Add Enrollment'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Detail view modal (existing) ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.student_first_name} {selected.student_last_name}</h2>
                <p className="text-sm text-gray-400 mt-0.5">Submitted {fmt(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 text-lg">✕</button>
            </div>
            <div className="px-6 py-5">
              <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full mb-4 ${packageColor(selected.programme_package)}`}>
                {selected.programme_package.split('—')[0].trim()}
              </span>
              <SectionTitle title="Student Information" />
              <DetailRow label="Full Name"       value={`${selected.student_first_name} ${selected.student_last_name}`} />
              <DetailRow label="Student Email"   value={selected.student_email} />
              <DetailRow label="Gender"          value={selected.student_gender} />
              <DetailRow label="School"          value={selected.student_school} />
              <DetailRow label="Grade Level"     value={selected.grade_level} />
              <DetailRow label="GPA / Avg Grade" value={selected.gpa} />
              <SectionTitle title="Parent / Guardian Information" />
              <DetailRow label="Relationship" value={selected.relationship} />
              <DetailRow label="Full Name"    value={`${selected.parent_first_name} ${selected.parent_last_name}`} />
              <DetailRow label="Phone"        value={selected.parent_phone} />
              <DetailRow label="Email"        value={selected.parent_email} />
              <DetailRow label="Address"      value={selected.household_address} />
              <DetailRow label="Form Email"   value={selected.email} />

              {/* Second parent/guardian — only shown if provided */}
              {selected.has_second_parent && (
                <>
                  <SectionTitle title="Second Parent / Guardian" />
                  <DetailRow label="Full Name" value={`${selected.parent2_first_name ?? ''} ${selected.parent2_last_name ?? ''}`.trim()} />
                  <DetailRow label="Phone"     value={selected.parent2_phone} />
                  <DetailRow label="Email"     value={selected.parent2_email} />
                </>
              )}

             <SectionTitle title="Programme Details" />
              <DetailRow label="Package Selected" value={selected.programme_package} />
              <DetailRow label="Payment Frequency" value={fmtBilling(selected.billing)} />
              {selected.recommendation_id && (
                <div className="py-2 border-b border-gray-50">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Linked Recommendation</p>
                  <a href={`/admin/dashboard/results?edit=${selected.recommendation_id}`}
                    className="text-sm text-green-700 font-semibold hover:underline cursor-pointer">
                    View saved recommendation →
                  </a>
                </div>
              )}


              {/* Structured availability — falls back to plain text if no slots */}
              {selected.availability_slots && selected.availability_slots.length > 0 ? (
                <div className="py-2 border-b border-gray-50 last:border-0">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Availability</p>
                  <div className="space-y-1.5">
                    {selected.availability_slots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
                        <span className="text-xs font-bold text-green-800 w-20">{slot.day}</span>
                        <span className="text-xs text-green-700">{slot.from} – {slot.to} ET</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <DetailRow label="Availability" value={selected.availability} />
              )}

              <DetailRow label="Potential Start"  value={fmt(selected.start_date)} />
              <SectionTitle title="Additional" />
              <DetailRow label="Additional Info"   value={selected.additional_info} />
              <DetailRow label="How They Found Us" value={selected.referral_source} />
               <SectionTitle title="Agreements" />
              <DetailRow label="Policy Agreed"
                value={selected.policy_agreed ? 'Yes — agreed to Student & Parent Guidelines' : 'No'} />
              <DetailRow label="Policy Signature" value={selected.policy_signature} />
              <DetailRow label="Signed At"
                value={selected.policy_agreed_at ? fmtDateTime(selected.policy_agreed_at) : null} />
              <DetailRow label="Media Consent"
                value={selected.media_consent ? 'Yes — consent given' : 'Not granted (optional)'} />
              <DetailRow label="Media Signature" value={selected.media_signature} />

              <button onClick={() => setSelected(null)}
                className="mt-5 w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}