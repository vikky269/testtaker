// 'use client';

// // app/subscribe/page.tsx — Multi-step SmartMathz Enrollment Form

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import Image from 'next/image';
// import { toast } from 'react-hot-toast';
// import ClipLoader from 'react-spinners/ClipLoader';
// import { Outfit } from 'next/font/google';

// const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

// // ── Constants ──────────────────────────────────────────────────────────────────
// const GRADES       = ['Pre-K','Kindergarten','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','Other'];
// const GENDERS      = ['Male','Female','Genderqueer/Non-binary','Prefer not to disclose','Other'];
// const RELATIONSHIPS= ['I am the student','Parent','Guardian','Other'];
// const REFERRALS    = ['Google Search','Social Media','Friend / Family Referral','School','Advertisement','Other'];
// const PACKAGES     = [
//   'Package 1 — Math Tutoring Only',
//   'Package 2 — Math Tutoring, 1 Additional Program & Weekend Virtual Library',
//   'Package 3 — Math Tutoring, 2 Additional Programs & Weekend Virtual Library',
//   'Other',
// ];

// const STEPS = [
//   { num: 1, title: 'Student Info',    subtitle: 'Tell us about the student' },
//   { num: 2, title: 'Parent Details',  subtitle: 'Your contact information'  },
//   { num: 3, title: 'Programme',       subtitle: 'Choose your package'       },
//   { num: 4, title: 'Scheduling',      subtitle: 'Availability & start date' },
// ];

// // Left panel content per step
// const PANEL_CONTENT = [
//   {
//     heading: 'Welcome to SmartMathz!',
//     body: "Start your child's learning journey today. We provide personalised tutoring that builds confidence, closes gaps, and unlocks potential.",
//     stat1: { val: '300+', label: 'Students Enrolled' },
//     stat2: { val: '100%',  label: 'Parent Satisfaction' },
//   },
//   {
//     heading: "We're a family here.",
//     body: 'Your involvement is key to your child\'s success. We keep parents informed, engaged, and empowered every step of the way.',
//     stat1: { val: '1-on-1', label: 'Personalised Sessions' },
//     stat2: { val: '3',      label: 'Flexible Packages'    },
//   },
//   {
//     heading: 'Built around your child.',
//     body: 'Our programmes are tailored to each student\'s grade, pace, and goals — from foundational maths to advanced science and coding.',
//     stat1: { val: 'Pre-K–12', label: 'All Grade Levels' },
//     stat2: { val: '4+',       label: 'Subject Areas'    },
//   },
//   {
//     heading: 'Almost there!',
//     body: "Tell us when your child is available and when you'd like to start. We'll match you with the right tutor and schedule.",
//     stat1: { val: '48hr',  label: 'Response Time' },
//     stat2: { val: 'Flex',  label: 'Scheduling'    },
//   },
// ];

// interface FormData {
//   email: string;
//   studentFirstName: string; studentLastName: string; studentEmail: string;
//   studentGender: string; studentGenderOther: string;
//   studentSchool: string; gradeLevel: string; gradeLevelOther: string; gpa: string;
//   relationship: string; relationshipOther: string;
//   parentFirstName: string; parentLastName: string;
//   parentPhone: string; parentEmail: string; householdAddress: string;
//   programmePackage: string; packageOther: string;
//   availability: string; startDate: string;
//   additionalInfo: string; referralSource: string; referralOther: string;
// }

// const EMPTY: FormData = {
//   email:'', studentFirstName:'', studentLastName:'', studentEmail:'',
//   studentGender:'', studentGenderOther:'', studentSchool:'', gradeLevel:'', gradeLevelOther:'', gpa:'',
//   relationship:'', relationshipOther:'',
//   parentFirstName:'', parentLastName:'', parentPhone:'', parentEmail:'', householdAddress:'',
//   programmePackage:'', packageOther:'',
//   availability:'', startDate:'',
//   additionalInfo:'', referralSource:'', referralOther:'',
// };

// // ── Reusable UI ────────────────────────────────────────────────────────────────
// const inputCls = `w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
//   focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
//   placeholder:text-gray-400 transition-all`;

// const Field = ({ label, required, error, children }: {
//   label: string; required?: boolean; error?: string; children: React.ReactNode;
// }) => (
//   <div className="space-y-1.5">
//     <label className="block text-sm font-semibold text-gray-700">
//       {label}{required && <span className="text-red-500 ml-1">*</span>}
//     </label>
//     {children}
//     {error && <p className="text-red-500 text-xs">{error}</p>}
//   </div>
// );

// const Radio = ({ options, value, onChange, showOther, otherValue, onOtherChange }: {
//   options: string[]; value: string; onChange: (v: string) => void;
//   showOther?: boolean; otherValue?: string; onOtherChange?: (v: string) => void;
// }) => (
//   <div className="space-y-2">
//     {options.map(opt => (
//       <button key={opt} type="button" onClick={() => onChange(opt)}
//         className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all cursor-pointer
//           ${value === opt
//             ? 'border-[#7FB509] bg-[#7FB509]/5 text-[#3a5a09] font-semibold'
//             : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
//         <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
//           ${value === opt ? 'border-[#7FB509]' : 'border-gray-300'}`}>
//           {value === opt && <div className="w-2 h-2 rounded-full bg-[#7FB509]" />}
//         </div>
//         {opt}
//       </button>
//     ))}
//     {showOther && value === 'Other' && (
//       <input type="text" placeholder="Please specify..."
//         value={otherValue ?? ''} onChange={e => onOtherChange?.(e.target.value)}
//         className={`${inputCls} mt-1`} />
//     )}
//   </div>
// );

// // ── Main Component ─────────────────────────────────────────────────────────────
// export default function SubscribePage() {
//   const [step, setStep]           = useState(1);
//   const [form, setForm]           = useState<FormData>(EMPTY);
//   const [errors, setErrors]       = useState<Partial<Record<keyof FormData, string>>>({});
//   const [loading, setLoading]     = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [animDir, setAnimDir]     = useState<'left'|'right'>('right');
//   const [visible, setVisible]     = useState(true);

//   const set  = (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
//     setForm(p => ({ ...p, [f]: e.target.value }));
//   const setR = (f: keyof FormData) => (v: string) => setForm(p => ({ ...p, [f]: v }));

//   // Step validation
//   const validateStep = (s: number): Partial<Record<keyof FormData, string>> => {
//     const e: Partial<Record<keyof FormData, string>> = {};
//     const req = (f: keyof FormData, label: string) => { if (!form[f]) e[f] = `${label} is required`; };
//     if (s === 1) {
//       req('email', 'Email'); req('studentFirstName', 'First name');
//       req('studentLastName', 'Last name'); req('studentEmail', "Student's email");
//       req('studentGender', 'Gender'); req('studentSchool', 'School'); req('gradeLevel', 'Grade level');
//     }
//     if (s === 2) {
//       req('relationship', 'Relationship'); req('parentFirstName', 'First name');
//       req('parentLastName', 'Last name'); req('parentPhone', 'Phone');
//       req('parentEmail', 'Email'); req('householdAddress', 'Address');
//     }
//     if (s === 3) { req('programmePackage', 'Programme package'); }
//     if (s === 4) { req('availability', 'Availability'); req('startDate', 'Start date'); req('referralSource', 'Referral source'); }
//     return e;
//   };

//   const navigate = (dir: 'next'|'prev') => {
//     if (dir === 'next') {
//       const e = validateStep(step);
//       if (Object.keys(e).length > 0) { setErrors(e); toast.error('Please fill in all required fields.'); return; }
//       setErrors({});
//     }
//     setAnimDir(dir === 'next' ? 'right' : 'left');
//     setVisible(false);
//     setTimeout(() => {
//       setStep(p => dir === 'next' ? p + 1 : p - 1);
//       setVisible(true);
//     }, 180);
//   };

//   const handleSubmit = async () => {
//     const e = validateStep(4);
//     if (Object.keys(e).length > 0) { setErrors(e); toast.error('Please fill in all required fields.'); return; }

//     setLoading(true);
//     const { error } = await supabase.from('subscriptions').insert([{
//       email:              form.email,
//       student_first_name: form.studentFirstName,
//       student_last_name:  form.studentLastName,
//       student_email:      form.studentEmail,
//       student_gender:     form.studentGender === 'Other' ? form.studentGenderOther : form.studentGender,
//       student_school:     form.studentSchool,
//       grade_level:        form.gradeLevel === 'Other' ? form.gradeLevelOther : form.gradeLevel,
//       gpa:                form.gpa || null,
//       relationship:       form.relationship === 'Other' ? form.relationshipOther : form.relationship,
//       parent_first_name:  form.parentFirstName,
//       parent_last_name:   form.parentLastName,
//       parent_phone:       form.parentPhone,
//       parent_email:       form.parentEmail,
//       household_address:  form.householdAddress,
//       programme_package:  form.programmePackage === 'Other' ? form.packageOther : form.programmePackage,
//       availability:       form.availability,
//       start_date:         form.startDate,
//       additional_info:    form.additionalInfo || null,
//       referral_source:    form.referralSource === 'Other' ? form.referralOther : form.referralSource,
//     }]);

//     if (error) { toast.error('Something went wrong. Please try again.'); setLoading(false); return; }
//     setSubmitted(true);
//     setLoading(false);
//   };

//   // ── Success ────────────────────────────────────────────────────────────────
//   if (submitted) {
//     return (
//       <div className={`${outfit.variable} min-h-screen bg-gray-50 flex items-center justify-center p-6 font-[var(--font-outfit)]`}>
//         <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-md w-full text-center">
//           <div className="w-20 h-20 rounded-full bg-[#7FB509]/10 flex items-center justify-center mx-auto mb-6"
//             style={{ animation: 'pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
//             <svg className="w-10 h-10 text-[#7FB509]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">You're enrolled! 🎉</h2>
//           <p className="text-gray-500 text-sm leading-relaxed">
//             Thank you for joining SmartMathz. Our team will review your application and reach out within 48 hours to confirm your schedule.
//           </p>
//           <a href="/" className="mt-8 inline-block bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition-colors shadow-sm">
//             ← Back to Home
//           </a>
//         </div>
//         <style>{`@keyframes pop { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }`}</style>
//       </div>
//     );
//   }

//   const panel = PANEL_CONTENT[step - 1];
//   const prog  = (step / 4) * 100;

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className={`${outfit.variable} min-h-screen font-[var(--font-outfit)] flex`}>

//       {/* ════════════════════════════════════════════════════════
//           LEFT PANEL — fixed, decorative
//       ════════════════════════════════════════════════════════ */}
//       <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] flex-shrink-0 relative overflow-hidden"
//         style={{ background: 'linear-gradient(145deg, #1a2e05 0%, #2d5a0e 50%, #3a7a12 100%)' }}>

//         {/* Grid texture */}
//         <div className="absolute inset-0 opacity-[0.06]"
//           style={{ backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize:'32px 32px' }} />

//         {/* Decorative circles */}
//         <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10"
//           style={{ background:'radial-gradient(circle, #7FB509, transparent)' }} />
//         <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
//           style={{ background:'radial-gradient(circle, #a3d926, transparent)' }} />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
//           style={{ background:'radial-gradient(circle, #fff, transparent)' }} />

//         {/* Floating math symbols */}
//         {['∑','π','√','∞','÷','²','Δ','∫'].map((sym, i) => (
//           <span key={i} className="absolute font-bold text-white select-none pointer-events-none"
//             style={{
//               opacity: 0.08 + (i % 3) * 0.04,
//               fontSize: 20 + (i % 4) * 8,
//               left: `${8 + (i * 11) % 80}%`,
//               top:  `${5 + (i * 13) % 85}%`,
//               animation: `float ${5 + i * 0.7}s ease-in-out ${i * 0.4}s infinite alternate`,
//             }}>{sym}</span>
//         ))}

//         {/* Content */}
//         <div className="relative z-10 flex flex-col justify-between h-full px-10 py-12 w-full">

//           {/* Logo */}
//           <div>
//             {/* <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
//               <Image src="/SmartMathz.png" alt="SmartMathz" width={36} height={36} className="object-contain" />
//             </div> */}
//             <p className="text-white/50 text-4xl font-semibold uppercase tracking-widest mb-[-12]">Enrollment Form</p>
//           </div>

//           {/* Dynamic content — animates with step */}
//           <div key={step} style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
//             <h2 className="text-3xl xl:text-6xl font-bold text-white leading-tight mb-4">
//               {panel.heading}
//             </h2>
//             <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs">
//               {panel.body}
//             </p>

//             {/* Stats */}
//             <div className="flex gap-6">
//               <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
//                 <p className="text-2xl font-bold text-[#a3d926]">{panel.stat1.val}</p>
//                 <p className="text-white/50 text-xs mt-0.5">{panel.stat1.label}</p>
//               </div>
//               <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
//                 <p className="text-2xl font-bold text-[#a3d926]">{panel.stat2.val}</p>
//                 <p className="text-white/50 text-xs mt-0.5">{panel.stat2.label}</p>
//               </div>
//             </div>
//           </div>

//           {/* Step dots */}
//           <div className="flex items-center gap-3">
//             {STEPS.map(s => (
//               <div key={s.num} className={`rounded-full transition-all duration-300
//                 ${s.num === step ? 'w-8 h-2 bg-[#7FB509]' : s.num < step ? 'w-2 h-2 bg-white/40' : 'w-2 h-2 bg-white/15'}`} />
//             ))}
//             <span className="text-white/30 text-xs ml-2">{step} of 4</span>
//           </div>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════════
//           RIGHT PANEL — scrollable form
//       ════════════════════════════════════════════════════════ */}
//       <div className="flex-1 bg-gray-50 overflow-y-auto">
//         <div className="max-w-lg mx-auto px-6 py-10 min-h-full flex flex-col">

//           {/* Mobile logo */}
//           <div className="lg:hidden flex items-center gap-3 mb-8">
//             <Image src="/SmartMathz.png" alt="SmartMathz" width={32} height={32} className="object-contain" />
//             <span className="text-sm font-bold text-gray-700">SmartMathz Enrollment</span>
//           </div>

//           {/* Step header */}
//           <div className="mb-6">
//             {/* Progress bar */}
//             <div className="h-1.5 bg-gray-200 rounded-full mb-5 overflow-hidden">
//               <div className="h-full rounded-full bg-[#7FB509] transition-all duration-500"
//                 style={{ width: `${prog}%` }} />
//             </div>

//             {/* Step tabs */}
//             <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
//               {STEPS.map(s => (
//                 <div key={s.num}
//                   className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all
//                     ${s.num === step ? 'bg-[#7FB509] text-white' : s.num < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
//                   <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
//                     ${s.num === step ? 'bg-white/20' : s.num < step ? 'bg-green-200' : 'bg-gray-200'}`}>
//                     {s.num < step ? '✓' : s.num}
//                   </span>
//                   {s.title}
//                 </div>
//               ))}
//             </div>

//             <h1 className="text-2xl font-bold text-gray-900">{STEPS[step-1].title}</h1>
//             <p className="text-sm text-gray-400 mt-0.5">{STEPS[step-1].subtitle}</p>
//           </div>

//           {/* ── Form content ── */}
//           <div
//             className="flex-1 space-y-5"
//             style={{
//               opacity:   visible ? 1 : 0,
//               transform: visible ? 'translateX(0)' : `translateX(${animDir === 'right' ? '24px' : '-24px'})`,
//               transition: 'opacity 0.18s ease, transform 0.18s ease',
//             }}>

//             {/* ── STEP 1: Student Info ── */}
//             {step === 1 && (
//               <>
//                 <Field label="Your Email" required error={errors.email}>
//                   <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} className={inputCls} />
//                 </Field>

//                 <div className="grid grid-cols-2 gap-4">
//                   <Field label="Student's First Name" required error={errors.studentFirstName}>
//                     <input type="text" placeholder="First name" value={form.studentFirstName} onChange={set('studentFirstName')} className={inputCls} />
//                   </Field>
//                   <Field label="Student's Last Name" required error={errors.studentLastName}>
//                     <input type="text" placeholder="Last name" value={form.studentLastName} onChange={set('studentLastName')} className={inputCls} />
//                   </Field>
//                 </div>

//                 <Field label="Student's Email" required error={errors.studentEmail}>
//                   <input type="email" placeholder="student@example.com" value={form.studentEmail} onChange={set('studentEmail')} className={inputCls} />
//                 </Field>

//                 <Field label="Student Identifies As" required error={errors.studentGender}>
//                   <Radio options={GENDERS} value={form.studentGender} onChange={setR('studentGender')}
//                     showOther otherValue={form.studentGenderOther} onOtherChange={v => setForm(p => ({ ...p, studentGenderOther: v }))} />
//                 </Field>

//                 <Field label="Student's School" required error={errors.studentSchool}>
//                   <input type="text" placeholder="School name" value={form.studentSchool} onChange={set('studentSchool')} className={inputCls} />
//                 </Field>

//                 {/* <Field label="Grade Level" required error={errors.gradeLevel}>
//                   <Radio options={GRADES} value={form.gradeLevel} onChange={setR('gradeLevel')}
//                     showOther otherValue={form.gradeLevelOther} onOtherChange={v => setForm(p => ({ ...p, gradeLevelOther: v }))} />
//                 </Field> */}


//                 {/* Replace the Grade Level Field in Step 1 with this */}
//                               <Field label="Grade Level" required error={errors.gradeLevel}>
//                                   <div className="grid grid-cols-3 gap-2">
//                                       {GRADES.filter(g => g !== 'Other').map(grade => (
//                                           <button key={grade} type="button" onClick={() => setR('gradeLevel')(grade)}
//                                               className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-center cursor-pointer transition-all
//           ${form.gradeLevel === grade
//                                                       ? 'border-[#7FB509] bg-[#7FB509]/8 text-[#3a5a09] font-semibold'
//                                                       : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'}`}>
//                                               {grade}
//                                           </button>
//                                       ))}
//                                       {/* Other option spans full width */}
//                                       <button type="button" onClick={() => setR('gradeLevel')('Other')}
//                                           className={`col-span-3 px-3 py-2.5 rounded-xl border text-sm font-medium text-center cursor-pointer transition-all
//         ${form.gradeLevel === 'Other'
//                                                   ? 'border-[#7FB509] bg-[#7FB509]/8 text-[#3a5a09] font-semibold'
//                                                   : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'}`}>
//                                           Other
//                                       </button>
//                                       {form.gradeLevel === 'Other' && (
//                                           <div className="col-span-3">
//                                               <input type="text" placeholder="Please specify..."
//                                                   value={form.gradeLevelOther}
//                                                   onChange={e => setForm(p => ({ ...p, gradeLevelOther: e.target.value }))}
//                                                   className={inputCls} />
//                                           </div>
//                                       )}
//                                   </div>
//                               </Field>

//                 <Field label="GPA or Average Grade">
//                   <input type="text" placeholder="e.g. 3.5 or B+" value={form.gpa} onChange={set('gpa')} className={inputCls} />
//                 </Field>
//               </>
//             )}

//             {/* ── STEP 2: Parent Info ── */}
//             {step === 2 && (
//               <>
//                 <Field label="Your Relationship to the Student" required error={errors.relationship}>
//                   <Radio options={RELATIONSHIPS} value={form.relationship} onChange={setR('relationship')}
//                     showOther otherValue={form.relationshipOther} onOtherChange={v => setForm(p => ({ ...p, relationshipOther: v }))} />
//                 </Field>

//                 <div className="grid grid-cols-2 gap-4">
//                   <Field label="Parent/Guardian First Name" required error={errors.parentFirstName}>
//                     <input type="text" placeholder="First name" value={form.parentFirstName} onChange={set('parentFirstName')} className={inputCls} />
//                   </Field>
//                   <Field label="Parent/Guardian Last Name" required error={errors.parentLastName}>
//                     <input type="text" placeholder="Last name" value={form.parentLastName} onChange={set('parentLastName')} className={inputCls} />
//                   </Field>
//                 </div>

//                 <Field label="Phone Number" required error={errors.parentPhone}>
//                   <input type="tel" placeholder="+1 (555) 000-0000" value={form.parentPhone} onChange={set('parentPhone')} className={inputCls} />
//                 </Field>

//                 <Field label="Parent/Guardian Email" required error={errors.parentEmail}>
//                   <input type="email" placeholder="parent@example.com" value={form.parentEmail} onChange={set('parentEmail')} className={inputCls} />
//                 </Field>

//                 <Field label="Household Address (or your city)" required error={errors.householdAddress}>
//                   <textarea placeholder="123 Main St, City, State" value={form.householdAddress} onChange={set('householdAddress')} rows={3}
//                     className={`${inputCls} resize-none`} />
//                 </Field>
//               </>
//             )}

//             {/* ── STEP 3: Programme ── */}
//             {step === 3 && (
//               <>
//                 {/* Brochure */}
//                 <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-2">
//                   <div className="bg-[#1a2e05] px-4 py-3">
//                     <p className="text-white font-semibold text-sm">SmartMathz Programme Brochure</p>
//                     <p className="text-white/50 text-xs mt-0.5">Review our packages before selecting below</p>
//                   </div>
//                   <div className="bg-gray-50 p-3">
//                     <Image src="/brochure.jpg" alt="SmartMathz Programme Brochure"
//                       width={620} height={880} className="w-full h-auto object-contain rounded-xl"
//                       onError={() => {}} />
//                   </div>
//                 </div>

//                 <Field label="Select the program your student is enrolled in" required error={errors.programmePackage}>
//                   <Radio options={PACKAGES} value={form.programmePackage} onChange={setR('programmePackage')}
//                     showOther otherValue={form.packageOther} onOtherChange={v => setForm(p => ({ ...p, packageOther: v }))} />
//                 </Field>
//               </>
//             )}

//             {/* ── STEP 4: Scheduling + Submit ── */}
//             {step === 4 && (
//               <>
//                 <Field label="Days and times the student is available" required error={errors.availability}>
//                   <textarea placeholder="e.g. Monday 4–6pm, Wednesday 5–7pm, Saturday morning"
//                     value={form.availability} onChange={set('availability')} rows={4}
//                     className={`${inputCls} resize-none`} />
//                 </Field>

//                 <Field label="Potential start date" required error={errors.startDate}>
//                   <input type="date" value={form.startDate} onChange={set('startDate')} className={inputCls} />
//                 </Field>

//                 <Field label="Any additional information?">
//                   <textarea placeholder="Learning needs, goals, anything else we should know..."
//                     value={form.additionalInfo} onChange={set('additionalInfo')} rows={3}
//                     className={`${inputCls} resize-none`} />
//                 </Field>

//                 <Field label="How did you hear about SmartMathz?" required error={errors.referralSource}>
//                   <Radio options={REFERRALS} value={form.referralSource} onChange={setR('referralSource')}
//                     showOther otherValue={form.referralOther} onOtherChange={v => setForm(p => ({ ...p, referralOther: v }))} />
//                 </Field>

//                 {/* Summary card */}
//                 <div className="bg-[#1a2e05]/5 border border-[#7FB509]/20 rounded-2xl p-4 space-y-2">
//                   <p className="text-xs font-bold text-[#3a5a09] uppercase tracking-wide mb-3">Application Summary</p>
//                   {[
//                     { label: 'Student',  val: `${form.studentFirstName} ${form.studentLastName}` },
//                     { label: 'Grade',    val: form.gradeLevel },
//                     { label: 'Package',  val: form.programmePackage.split('—')[0].trim() },
//                     { label: 'Start',    val: form.startDate },
//                   ].map(({ label, val }) => val && (
//                     <div key={label} className="flex justify-between text-sm">
//                       <span className="text-gray-400">{label}</span>
//                       <span className="font-semibold text-gray-800 text-right max-w-[60%]">{val}</span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>

//           {/* ── Navigation buttons ── */}
//           <div className={`flex gap-3 mt-8 pt-6 border-t border-gray-100 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
//             {step > 1 && (
//               <button onClick={() => navigate('prev')}
//                 className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold
//                            hover:bg-gray-50 cursor-pointer transition-all">
//                 ← Back
//               </button>
//             )}

//             {step < 4 ? (
//               <button onClick={() => navigate('next')}
//                 className="px-8 py-3 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white text-sm font-bold
//                            cursor-pointer transition-all shadow-sm active:scale-[0.98] ml-auto">
//                 Continue →
//               </button>
//             ) : (
//               <button onClick={handleSubmit} disabled={loading}
//                 className="flex-1 py-3.5 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm
//                            flex items-center justify-center gap-2 cursor-pointer
//                            disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]">
//                 {loading
//                   ? <><ClipLoader size={18} color="#fff" /><span>Submitting...</span></>
//                   : '🎓 Submit Enrollment Form'}
//               </button>
//             )}
//           </div>

//           <p className="text-center text-xs text-gray-400 mt-4">
//             By submitting you agree SmartMathz may contact you regarding your enrolment.
//           </p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes float {
//           0%   { transform: translateY(0px) rotate(0deg); }
//           100% { transform: translateY(-12px) rotate(5deg); }
//         }
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }





'use client';

// app/subscribe/page.tsx — Multi-step SmartMathz Enrollment Form
// Updated: optional second parent/guardian + structured day/time availability picker

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

// ── Constants ──────────────────────────────────────────────────────────────────
const GRADES        = ['Pre-K','Kindergarten','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','Other'];
const GENDERS       = ['Male','Female','Genderqueer/Non-binary','Prefer not to disclose','Other'];
const RELATIONSHIPS = ['I am the student','Parent','Guardian','Other'];
const REFERRALS     = ['Google Search','Social Media','Friend / Family Referral','School','Advertisement','Other'];
const PACKAGES      = [
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
  { num: 1, title: 'Student Info',   subtitle: 'Tell us about the student' },
  { num: 2, title: 'Parent Details', subtitle: 'Your contact information'  },
  { num: 3, title: 'Programme',      subtitle: 'Choose your package'       },
  { num: 4, title: 'Scheduling',     subtitle: 'Availability & start date' },
];

const PANEL_CONTENT = [
  {
    heading: 'Welcome to SmartMathz!',
    body: "Start your child's learning journey today. We provide personalised tutoring that builds confidence, closes gaps, and unlocks potential.",
    stat1: { val: '300+', label: 'Students Enrolled' },
    stat2: { val: '100%',  label: 'Parent Satisfaction' },
  },
  {
    heading: "We're a family here.",
    body: "Your involvement is key to your child's success. We keep parents informed, engaged, and empowered every step of the way.",
    stat1: { val: '1-on-1', label: 'Personalised Sessions' },
    stat2: { val: '3',      label: 'Flexible Packages'    },
  },
  {
    heading: 'Built around your child.',
    body: "Our programmes are tailored to each student's grade, pace, and goals — from foundational maths to advanced science and coding.",
    stat1: { val: 'Pre-K–12', label: 'All Grade Levels' },
    stat2: { val: '4+',       label: 'Subject Areas'    },
  },
  {
    heading: 'Almost there!',
    body: "Tell us when your child is available and when you'd like to start. We'll match you with the right tutor and schedule.",
    stat1: { val: '48hr',  label: 'Response Time' },
    stat2: { val: 'Flex',  label: 'Scheduling'    },
  },
];

// ── Types ──────────────────────────────────────────────────────────────────────
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
  hasSecondParent:      boolean;
  parent2FirstName:     string;
  parent2LastName:      string;
  parent2Phone:         string;
  parent2Email:         string;

  programmePackage: string; packageOther: string;
  startDate: string;
  additionalInfo: string; referralSource: string; referralOther: string;
}

const EMPTY: FormData = {
  email:'', studentFirstName:'', studentLastName:'', studentEmail:'',
  studentGender:'', studentGenderOther:'', studentSchool:'', gradeLevel:'', gradeLevelOther:'', gpa:'',
  relationship:'', relationshipOther:'',
  parentFirstName:'', parentLastName:'', parentPhone:'', parentEmail:'', householdAddress:'',
  hasSecondParent: false, parent2FirstName:'', parent2LastName:'', parent2Phone:'', parent2Email:'',
  programmePackage:'', packageOther:'',
  startDate:'',
  additionalInfo:'', referralSource:'', referralOther:'',
};

// ── Reusable UI ────────────────────────────────────────────────────────────────
const inputCls = `w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
  focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
  placeholder:text-gray-400 transition-all`;

const selectCls = `${inputCls} cursor-pointer`;

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

// ── Day/Time Availability Picker ────────────────────────────────────────────────
function AvailabilityPicker({
  slots, onChange,
}: {
  slots: AvailabilitySlot[];
  onChange: (slots: AvailabilitySlot[]) => void;
}) {
  const selectedDays = slots.map(s => s.day);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      // Remove all slots for this day
      onChange(slots.filter(s => s.day !== day));
    } else {
      // Add a new slot with default time range
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
    <div className="space-y-3">
      {/* Day toggle buttons */}
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

      {/* Time slot rows for selected days */}
      {orderedSlots.length > 0 && (
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
      )}

      {orderedSlots.length === 0 && (
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
  const [errors, setErrors]         = useState<Partial<Record<keyof FormData, string>>>({});
  const [availError, setAvailError] = useState('');
  const [loading, setLoading]       = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [animDir, setAnimDir]       = useState<'left'|'right'>('right');
  const [visible, setVisible]       = useState(true);

  const set  = (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));
  const setR = (f: keyof FormData) => (v: string) => setForm(p => ({ ...p, [f]: v }));

  // Step validation
  const validateStep = (s: number): Partial<Record<keyof FormData, string>> => {
    const e: Partial<Record<keyof FormData, string>> = {};
    const req = (f: keyof FormData, label: string) => { if (!form[f]) e[f] = `${label} is required`; };
    if (s === 1) {
      req('email', 'Email'); req('studentFirstName', 'First name');
      req('studentLastName', 'Last name'); req('studentEmail', "Student's email");
      req('studentGender', 'Gender'); req('studentSchool', 'School'); req('gradeLevel', 'Grade level');
    }
    if (s === 2) {
      req('relationship', 'Relationship'); req('parentFirstName', 'First name');
      req('parentLastName', 'Last name'); req('parentPhone', 'Phone');
      req('parentEmail', 'Email'); req('householdAddress', 'Address');
      // Second parent fields only required if toggle is on
      if (form.hasSecondParent) {
        if (!form.parent2FirstName) e.parent2FirstName = 'First name is required';
        if (!form.parent2LastName)  e.parent2LastName  = 'Last name is required';
        if (!form.parent2Phone)     e.parent2Phone     = 'Phone is required';
        if (!form.parent2Email)     e.parent2Email     = 'Email is required';
      }
    }
    if (s === 3) { req('programmePackage', 'Programme package'); }
    if (s === 4) { req('startDate', 'Start date'); req('referralSource', 'Referral source'); }
    return e;
  };

  const navigate = (dir: 'next'|'prev') => {
    if (dir === 'next') {
      const e = validateStep(step);
      if (Object.keys(e).length > 0) { setErrors(e); toast.error('Please fill in all required fields.'); return; }
      if (step === 4 && availability.length === 0) {
        setAvailError('Please select at least one day and time.');
        toast.error('Please select at least one day and time.');
        return;
      }
      setErrors({}); setAvailError('');
    }
    setAnimDir(dir === 'next' ? 'right' : 'left');
    setVisible(false);
    setTimeout(() => {
      setStep(p => dir === 'next' ? p + 1 : p - 1);
      setVisible(true);
    }, 180);
  };

  const handleSubmit = async () => {
    const e = validateStep(4);
    if (availability.length === 0) {
      setAvailError('Please select at least one day and time.');
    }
    if (Object.keys(e).length > 0 || availability.length === 0) {
      setErrors(e);
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);

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

    if (error) { toast.error('Something went wrong. Please try again.'); setLoading(false); return; }
    setSubmitted(true);
    setLoading(false);
  };

  // ── Success ────────────────────────────────────────────────────────────────
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
            Thank you for joining SmartMathz. Our team will review your application and reach out within 48 hours to confirm your schedule.
          </p>
          <a href="/" className="mt-8 inline-block bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition-colors shadow-sm">
            ← Back to Home
          </a>
        </div>
        <style>{`@keyframes pop { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }`}</style>
      </div>
    );
  }

  const panel = PANEL_CONTENT[step - 1];
  const prog  = (step / 4) * 100;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`${outfit.variable} min-h-screen font-[var(--font-outfit)] flex`}>

      {/* ════════════════════════════════════════════════════════
          LEFT PANEL
      ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[47%] flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1a2e05 0%, #2d5a0e 50%, #3a7a12 100%)' }}>

        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize:'32px 32px' }} />

        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10"
          style={{ background:'radial-gradient(circle, #7FB509, transparent)' }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
          style={{ background:'radial-gradient(circle, #a3d926, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background:'radial-gradient(circle, #fff, transparent)' }} />

        {['∑','π','√','∞','÷','²','Δ','∫'].map((sym, i) => (
          <span key={i} className="absolute font-bold text-white select-none pointer-events-none"
            style={{
              opacity: 0.08 + (i % 3) * 0.04,
              fontSize: 20 + (i % 4) * 8,
              left: `${8 + (i * 11) % 80}%`,
              top:  `${5 + (i * 13) % 85}%`,
              animation: `float ${5 + i * 0.7}s ease-in-out ${i * 0.4}s infinite alternate`,
            }}>{sym}</span>
        ))}

        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-12 w-full">
          <div>
            {/* <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
              <Image src="/SmartMathz.png" alt="SmartMathz" width={36} height={36} className="object-contain" />
            </div> */}
            <p className="text-white/50 text-5xl font-semibold uppercase tracking-widest mb-2">Enrollment Form</p>
          </div>

          <div key={step} style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
            <h2 className="text-3xl xl:text-7xl font-bold text-white leading-tight mb-4">
              {panel.heading}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs">
              {panel.body}
            </p>
            <div className="flex gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
                <p className="text-3xl font-bold text-[#a3d926]">{panel.stat1.val}</p>
                <p className="text-white/50 text-xs mt-0.5">{panel.stat1.label}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
                <p className="text-3xl font-bold text-[#a3d926]">{panel.stat2.val}</p>
                <p className="text-white/50 text-xs mt-0.5">{panel.stat2.label}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {STEPS.map(s => (
              <div key={s.num} className={`rounded-full transition-all duration-300
                ${s.num === step ? 'w-8 h-2 bg-[#7FB509]' : s.num < step ? 'w-2 h-2 bg-white/40' : 'w-2 h-2 bg-white/15'}`} />
            ))}
            <span className="text-white/30 text-xs ml-2">{step} of 4</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          RIGHT PANEL
      ════════════════════════════════════════════════════════ */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-10 min-h-full flex flex-col">

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Image src="/SmartMathz.png" alt="SmartMathz" width={32} height={32} className="object-contain" />
            <span className="text-sm font-bold text-gray-700">SmartMathz Enrollment</span>
          </div>

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

          <div
            className="flex-1 space-y-5"
            style={{
              opacity:   visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : `translateX(${animDir === 'right' ? '24px' : '-24px'})`,
              transition: 'opacity 0.18s ease, transform 0.18s ease',
            }}>

            {/* ── STEP 1: Student Info ── */}
            {step === 1 && (
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

            {/* ── STEP 2: Parent Info ── */}
            {step === 2 && (
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
                  <input type="tel" placeholder="+1 (555) 000-0000" value={form.parentPhone} onChange={set('parentPhone')} className={inputCls} />
                </Field>

                <Field label="Parent/Guardian Email" required error={errors.parentEmail}>
                  <input type="email" placeholder="parent@example.com" value={form.parentEmail} onChange={set('parentEmail')} className={inputCls} />
                </Field>

                {/* ── Add second parent toggle ── */}
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
                      <input type="tel" placeholder="+1 (555) 000-0000" value={form.parent2Phone} onChange={set('parent2Phone')} className={inputCls} />
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

            {/* ── STEP 3: Programme ── */}
            {step === 3 && (
              <>
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-2">
                  <div className="bg-[#1a2e05] px-4 py-3">
                    <p className="text-white font-semibold text-sm">SmartMathz Programme Brochure</p>
                    <p className="text-white/50 text-xs mt-0.5">Review our packages before selecting below</p>
                  </div>
                  <div className="bg-gray-50 p-3">
                    <Image src="/brochure.jpg" alt="SmartMathz Programme Brochure"
                      width={620} height={880} className="w-full h-auto object-contain rounded-xl"
                      onError={() => {}} />
                  </div>
                </div>

                <Field label="Select the program your student is enrolled in" required error={errors.programmePackage}>
                  <Radio options={PACKAGES} value={form.programmePackage} onChange={setR('programmePackage')}
                    showOther otherValue={form.packageOther} onOtherChange={v => setForm(p => ({ ...p, packageOther: v }))} />
                </Field>
              </>
            )}

            {/* ── STEP 4: Scheduling + Submit ── */}
            {step === 4 && (
              <>
                <Field label="Days and times the student is available" required error={availError}>
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

                {/* Summary card */}
                <div className="bg-[#1a2e05]/5 border border-[#7FB509]/20 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-[#3a5a09] uppercase tracking-wide mb-3">Application Summary</p>
                  {[
                    { label: 'Student',  val: `${form.studentFirstName} ${form.studentLastName}` },
                    { label: 'Grade',    val: form.gradeLevel },
                    { label: 'Package',  val: form.programmePackage.split('—')[0].trim() },
                    { label: 'Start',    val: form.startDate },
                    { label: 'Parent 2', val: form.hasSecondParent ? `${form.parent2FirstName} ${form.parent2LastName}` : '' },
                  ].map(({ label, val }) => val && (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-semibold text-gray-800 text-right max-w-[60%]">{val}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={`flex gap-3 mt-8 pt-6 border-t border-gray-100 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button onClick={() => navigate('prev')}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold
                           hover:bg-gray-50 cursor-pointer transition-all">
                ← Back
              </button>
            )}

            {step < 4 ? (
              <button onClick={() => navigate('next')}
                className="px-8 py-3 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white text-sm font-bold
                           cursor-pointer transition-all shadow-sm active:scale-[0.98] ml-auto">
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3.5 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm
                           flex items-center justify-center gap-2 cursor-pointer
                           disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]">
                {loading
                  ? <><ClipLoader size={18} color="#fff" /><span>Submitting...</span></>
                  : '🎓 Submit Enrollment Form'}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            By submitting you agree SmartMathz may contact you regarding your enrolment.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}