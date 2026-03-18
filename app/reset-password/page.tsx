'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Outfit } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword]       = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [showCPw, setShowCPw]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [done, setDone]               = useState(false);

  // Supabase sends the user back with a token in the URL hash.
  // We need to listen for the PASSWORD_RECOVERY event to get a valid session.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionReady(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    setError('');

    if (!password || !confirmPw) {
      setError('Please fill in both fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPw) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      toast.error('Failed to update password.');
    } else {
      setDone(true);
      toast.success('Password updated successfully!');
      // Sign out so user logs in fresh with the new password
      await supabase.auth.signOut();
      setTimeout(() => router.push('/login'), 3000);
    }

    setLoading(false);
  };

  // Strength bar
  const getStrength = (pw: string) => {
    if (pw.length >= 12) return 4;
    if (pw.length >= 8)  return 3;
    if (pw.length >= 6)  return 2;
    if (pw.length > 0)   return 1;
    return 0;
  };
  const strength = getStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-[#7FB509]', 'bg-green-500'][strength];

  return (
    <div className={`${outfit.variable} min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 font-[var(--font-outfit)]`}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/SmartMathz.png" alt="SmartMathz" width={140} height={48} className="h-10 w-auto" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          {!done ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#7FB509" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {sessionReady
                    ? 'Choose a strong new password for your account.'
                    : 'Waiting for verification link... make sure you opened this page from your email.'}
                </p>
              </div>

              {/* Not yet verified warning */}
              {!sessionReady && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 text-center">
                  <p className="text-amber-700 text-sm font-semibold">⚠️ Verification pending</p>
                  <p className="text-amber-600 text-xs mt-1 leading-relaxed">
                    Please click the reset link in your email first. This page will unlock automatically.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* New password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Min. 6 characters"
                      disabled={!sessionReady}
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                                 placeholder:text-gray-400 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <button type="button" onClick={() => setShowPw((p) => !p)} disabled={!sessionReady}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7FB509] cursor-pointer transition-colors disabled:cursor-not-allowed">
                      {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1.5 mb-1">
                        {[1,2,3,4].map((lvl) => (
                          <div key={lvl} className={`h-1 flex-1 rounded-full transition-all duration-300
                            ${lvl <= strength ? strengthColor : 'bg-gray-100'}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-semibold ${
                        strength <= 1 ? 'text-red-500' : strength <= 2 ? 'text-amber-500' : 'text-[#7FB509]'
                      }`}>
                        {strengthLabel}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showCPw ? 'text' : 'password'}
                      value={confirmPw}
                      onChange={(e) => { setConfirmPw(e.target.value); setError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                      placeholder="Repeat your password"
                      disabled={!sessionReady}
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                                 placeholder:text-gray-400 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <button type="button" onClick={() => setShowCPw((p) => !p)} disabled={!sessionReady}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7FB509] cursor-pointer transition-colors disabled:cursor-not-allowed">
                      {showCPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {confirmPw && (
                    <p className={`text-xs font-semibold mt-1 ${password === confirmPw ? 'text-[#7FB509]' : 'text-red-500'}`}>
                      {password === confirmPw ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <button
                  onClick={handleReset}
                  disabled={loading || !sessionReady}
                  className="w-full py-3 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm
                             flex items-center justify-center gap-2 cursor-pointer mt-2
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Updating...
                    </span>
                  ) : 'Update Password'}
                </button>
              </div>

              <div className="mt-5 text-center">
                <Link href="/login" className="text-sm text-gray-400 hover:text-[#7FB509] transition-colors">
                  ← Back to login
                </Link>
              </div>
            </>
          ) : (
            /* ── SUCCESS STATE ── */
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#7FB509" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password updated!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Your password has been changed successfully. Redirecting you to login...
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-[#7FB509] rounded-full animate-[grow_3s_linear_forwards]" style={{ animation: 'grow 3s linear forwards' }} />
              </div>
              <Link href="/login" className="inline-block mt-6 text-sm text-[#7FB509] font-semibold hover:underline">
                Go to login now →
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes grow {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}