'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { Outfit } from 'next/font/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const MATH_SYMBOLS = [
  { sym: '+',  x: 8,  y: 12, size: 30, delay: 0,    dur: 5  },
  { sym: '=',  x: 78, y: 10, size: 24, delay: 0.7,  dur: 7  },
  { sym: '∑',  x: 90, y: 50, size: 22, delay: 1.4,  dur: 6  },
  { sym: 'π',  x: 15, y: 65, size: 26, delay: 0.3,  dur: 8  },
  { sym: '²',  x: 55, y: 85, size: 20, delay: 1.9,  dur: 5  },
  { sym: '√',  x: 42, y: 18, size: 22, delay: 1.0,  dur: 7  },
  { sym: '∞',  x: 4,  y: 40, size: 18, delay: 0.5,  dur: 6  },
  { sym: 'Δ',  x: 85, y: 72, size: 24, delay: 1.7,  dur: 8  },
  { sym: '∫',  x: 30, y: 90, size: 20, delay: 0.2,  dur: 6  },
  { sym: '÷',  x: 65, y: 35, size: 18, delay: 2.1,  dur: 7  },
];

const GRADE_OPTIONS = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade',
  '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
  '11th Grade', '12th Grade',
];

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '', email: '', grade: '', password: '', confirmPassword: '',
  });
  const [showPw, setShowPw]         = useState(false);
  const [showCPw, setShowCPw]       = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [step, setStep]             = useState<1 | 2>(1); // step 1: basic info, step 2: password

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = () => {
    if (!formData.fullName || !formData.email) {
      setError('Please fill in all fields to continue.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false); return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.fullName, grade: formData.grade } },
    });

    if (signUpError) {
      setError(signUpError.message.includes('already registered')
        ? 'This email is already in use. Please log in instead.'
        : signUpError.message);
      setLoading(false);
      router.push('/login');
      return;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setError('Session not found after signup. Please try logging in.');
      setLoading(false); return;
    }

    const { error: profileError } = await supabase.from('student_profile').insert([{
      id: session.user.id,
      full_name: formData.fullName,
      email: formData.email,
      grade: formData.grade,
    }]);

    if (profileError) {
      setError(`Profile error: ${profileError.message}`);
      setLoading(false); return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notify-new-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ fullName: formData.fullName, email: formData.email, grade: formData.grade }),
    });

    toast.success('Account created! Please log in.', { duration: 4000 });
    toast.success('A confirmation email has been sent.', { duration: 8000 });
    router.push('/login');
    setLoading(false);
  };

  return (
    <div className={`${outfit.variable} min-h-screen flex font-[var(--font-outfit)]`}>

      {/* ── LEFT PANEL ──────────────────────────────────── */}
      <div className="hidden lg:flex relative w-[48%] bg-[#3a5a09] overflow-hidden flex-col items-center justify-center">

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Floating symbols */}
        {mounted && MATH_SYMBOLS.map(({ sym, x, y, size, delay, dur }, i) => (
          <span key={i} className="absolute font-bold text-white/20 select-none pointer-events-none"
            style={{ left: `${x}%`, top: `${y}%`, fontSize: size, animation: `floatUp ${dur}s ease-in-out ${delay}s infinite alternate` }}>
            {sym}
          </span>
        ))}

        {/* Orbs */}
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-[#7FB509]/20 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-lime-300/10 blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">
         

         

          <div style={{ animation: 'floatUp 4s ease-in-out infinite alternate' }}>
            <Image src="/login.png" alt="Students" width={300} height={260} className="w-64 h-auto drop-shadow-2xl" />
          </div>


            {/* svg illustration */}
           {/* <div className="mb-6 p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <Image src="/login-illustration.svg" alt="Students" width={340} height={300} className="w-72 h-auto drop-shadow-2xl" />
          </div> */}

          <h2 className="text-white text-3xl font-bold mt-6 leading-tight">
            Join SmartMathz<br />Today
          </h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-xs">
            Create your free account and start preparing for your assessments right away.
          </p>

          {/* Feature list */}
          <div className="mt-7 space-y-2.5 text-left w-full max-w-xs">
            {[
              'Personalised grade-level assessments',
              'Instant results with detailed review',
              'Track your progress over time',
            ].map((f) => (
              <div key={f} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-[#7FB509] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:px-14 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/SmartMathz.png" alt="SmartMathz" width={140} height={48} className="h-10 w-auto" />
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
            <p className="text-gray-500 mt-1 text-sm">Fill in your details to get started.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${step >= s ? 'bg-[#7FB509] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {step > s ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                <span className={`text-xs font-medium ${step >= s ? 'text-[#7FB509]' : 'text-gray-400'}`}>
                  {s === 1 ? 'Your Info' : 'Set Password'}
                </span>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > s ? 'bg-[#7FB509]' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text" name="fullName" value={formData.fullName}
                  onChange={handleChange} placeholder="e.g. Jane Smith"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                             placeholder:text-gray-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                             placeholder:text-gray-400 transition-all"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Grade Level</label>
                <select
                  name="grade" value={formData.grade} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
                             focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                             text-gray-700 transition-all cursor-pointer"
                >
                  <option value="">Select your grade</option>
                  {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div> */}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-3 mt-1 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm
                           cursor-pointer transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2: Password ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} name="password" value={formData.password}
                    onChange={handleChange} placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                               placeholder:text-gray-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7FB509] cursor-pointer transition-colors">
                    {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showCPw ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} placeholder="Repeat your password"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                               placeholder:text-gray-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowCPw((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7FB509] cursor-pointer transition-colors">
                    {showCPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password strength hint */}
              {formData.password && (
                <div className="flex gap-1.5">
                  {[1,2,3,4].map((lvl) => {
                    const strength = formData.password.length >= 12 ? 4
                      : formData.password.length >= 8 ? 3
                      : formData.password.length >= 6 ? 2 : 1;
                    return (
                      <div key={lvl} className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${lvl <= strength
                          ? strength >= 4 ? 'bg-green-500'
                          : strength >= 3 ? 'bg-[#7FB509]'
                          : strength >= 2 ? 'bg-amber-400' : 'bg-red-400'
                          : 'bg-gray-100'}`}
                      />
                    );
                  })}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setStep(1); setError(''); }}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold
                             hover:bg-gray-50 cursor-pointer transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit} disabled={loading}
                  className="flex-2 flex-grow py-3 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm
                             flex items-center justify-center gap-2 cursor-pointer
                             disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {loading ? <><ClipLoader size={18} color="#fff" /><span>Creating...</span></> : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#7FB509] font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {/* Back to academy */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <a href="https://smartmathz.com"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#7FB509] transition-colors">
              ← Go to SmartMathz
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg);   }
          100% { transform: translateY(-14px) rotate(6deg); }
        }
      `}</style>
    </div>
  );
}