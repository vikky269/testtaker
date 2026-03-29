'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Outfit } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const MATH_SYMBOLS = [
    { sym: '÷', x: 10, y: 15, size: 26, delay: 0, dur: 6 },
    { sym: 'π', x: 78, y: 8, size: 22, delay: 0.8, dur: 7 },
    { sym: '∑', x: 88, y: 55, size: 24, delay: 1.5, dur: 5 },
    { sym: '√', x: 18, y: 70, size: 20, delay: 0.3, dur: 8 },
    { sym: '∞', x: 60, y: 80, size: 18, delay: 2, dur: 6 },
    { sym: '×', x: 45, y: 20, size: 16, delay: 1.1, dur: 7 },
    { sym: 'Δ', x: 5, y: 45, size: 20, delay: 0.6, dur: 5 },
    { sym: '∫', x: 70, y: 30, size: 22, delay: 1.8, dur: 6 },
    { sym: '∝', x: 30, y: 60, size: 18, delay: 0.4, dur: 7 },
    { sym: '∈', x: 50, y: 40, size: 20, delay: 1.3, dur: 5, },
    { sym: '∉', x: 80, y: 70, size: 18, delay: 0.9, dur: 6, },
    { sym: '∋', x: 20, y: 30, size: 22, delay: 1.6, dur: 7, },
    { sym: '∌', x: 65, y: 60, size: 20, delay: 0.7, dur: 5, },
    { sym: '∎', x: 40, y: 80, size: 18, delay: 1.2, dur: 6, },
    { sym: '∐', x: 55, y: 15, size: 22, delay: 0.5, dur: 7, },
    { sym: '∑', x: 25, y: 50, size: 20, delay: 1.4, dur: 5, },
    { sym: '∏', x: 75, y: 25, size: 18, delay: 0.2, dur: 6, },
    { sym: '∐', x: 35, y: 65, size: 22, delay: 1.7, dur: 7, },
    { sym: '∑', x: 15, y: 20, size: 20, delay: 0.8, dur: 5, },
    { sym: '∏', x: 85, y: 50, size: 18, delay: 1.9, dur: 6, },
    { sym: '∐', x: 45, y: 35, size: 22, delay: 0.3, dur: 7, },
];

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      // This is the URL Supabase will redirect to after the user clicks the link.
      // Make sure this route exists in your app (we'll create it below).
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      toast.error('Failed to send reset email.');
    } else {
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    }

    setLoading(false);
  };

  return (
    <div className={`${outfit.variable} min-h-screen flex font-[var(--font-outfit)]`}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex relative w-[52%] bg-[#3a5a09] overflow-hidden flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        {mounted && MATH_SYMBOLS.map(({ sym, x, y, size, delay, dur }, i) => (
          <span key={i} className="absolute font-bold text-white/20 select-none pointer-events-none"
            style={{ left: `${x}%`, top: `${y}%`, fontSize: size, animation: `floatUp ${dur}s ease-in-out ${delay}s infinite alternate` }}>
            {sym}
          </span>
        ))}

        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#7FB509]/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-lime-300/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* <div className="mb-8 p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
            <Image src="/SmartMathz.png" alt="SmartMathz" width={160} height={56} className="h-12 w-auto object-contain brightness-0 invert" />
          </div> */}

          {/* Lock icon illustration */}
          <div style={{ animation: 'floatUp 4s ease-in-out infinite alternate' }}>
            <div className="w-40 h-40 rounded-full bg-white/10 flex items-center justify-center mb-6 mx-auto">
              <svg viewBox="0 0 100 100" width="100" height="100">
                <rect x="20" y="45" width="60" height="45" rx="8" fill="#7FB509"/>
                <path d="M 30 45 L 30 30 Q 30 10 50 10 Q 70 10 70 30 L 70 45" fill="none" stroke="#c8e46b" strokeWidth="8" strokeLinecap="round"/>
                <circle cx="50" cy="65" r="8" fill="white"/>
                <rect x="46" y="65" width="8" height="14" rx="3" fill="white"/>
              </svg>
            </div>
          </div>

          <h2 className="text-white text-3xl font-bold leading-tight">Forgot your<br />password?</h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-xs">
            No worries — enter your email and we&apos;ll send you a secure reset link right away.
          </p>

          <div className="mt-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm max-w-xs w-full">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-[#c8e46b] text-lg">1</span>
              <p className="text-white/80 text-sm">Enter your registered email address</p>
            </div>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-[#c8e46b] text-lg">2</span>
              <p className="text-white/80 text-sm">Check your inbox for the reset link</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c8e46b] text-lg">3</span>
              <p className="text-white/80 text-sm">Set a new password and log in</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/SmartMathz.png" alt="SmartMathz" width={140} height={48} className="h-10 w-auto" />
          </div>

          {!sent ? (
            <>
              {/* Heading */}
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#7FB509" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Reset password</h1>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                  Enter the email address linked to your account and we&apos;ll send you a password reset link.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                               placeholder:text-gray-400 transition-all duration-150"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm
                             flex items-center justify-center gap-2 cursor-pointer
                             disabled:opacity-60 disabled:cursor-not-allowed
                             transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-[#7FB509] transition-colors inline-flex items-center gap-1">
                  ← Back to login
                </Link>
              </div>
            </>
          ) : (
            /* ── SUCCESS STATE ── */
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#7FB509" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.1 3.4 2 2 0 0 1 3.08 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
                  <polyline points="16 2 19 5 22 2"/>
                  <line x1="19" y1="5" x2="19" y2="12"/>
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                We&apos;ve sent a password reset link to
              </p>
              <p className="font-semibold text-gray-900 text-sm mb-6 break-all">{email}</p>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8 text-left">
                <p className="text-amber-700 text-xs font-semibold mb-1">Didn&apos;t receive it?</p>
                <p className="text-amber-600 text-xs leading-relaxed">
                  Check your spam/junk folder. The link expires in 1 hour.
                  If it still doesn&apos;t arrive, try again with the button below.
                </p>
              </div>

              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="w-full py-3 rounded-xl border-2 border-[#7FB509] text-[#7FB509] font-bold text-sm
                           hover:bg-[#7FB509] hover:text-white cursor-pointer transition-all duration-150 mb-4"
              >
                Try a different email
              </button>

              <Link
                href="/login"
                className="block w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm
                           text-center cursor-pointer transition-all duration-150"
              >
                ← Back to login
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <a href="https://smartmathz.com"
              className="text-xs text-gray-400 hover:text-[#7FB509] transition-colors">
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