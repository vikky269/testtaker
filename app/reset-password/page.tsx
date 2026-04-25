
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

// Isolated client — separate storageKey = separate IndexedDB lock
// This prevents the race with the Navbar's global supabase client
const resetClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken:   true,
      persistSession:     false,
      detectSessionInUrl: true,
      storageKey: 'sb-reset-auth',
    },
  }
);

export default function ResetPasswordPage() {
  const router = useRouter();
  const [verified,  setVerified]  = useState(false);
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [showCPw,   setShowCPw]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const params       = new URLSearchParams(hash.replace('#', ''));
    const accessToken  = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type         = params.get('type');
    if (type === 'recovery' && accessToken && refreshToken) {
      resetClient.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) {
            setError('Invalid or expired reset link. Please request a new one.');
          } else {
            setVerified(true);
            window.history.replaceState(null, '', window.location.pathname);
          }
        });
    }
  }, []);

  const passwordStrength =
    password.length >= 12 ? 4 : password.length >= 8 ? 3 :
    password.length >= 6  ? 2 : password.length > 0  ? 1 : 0;

  const strengthColor =
    passwordStrength >= 4 ? 'bg-green-500' : passwordStrength >= 3 ? 'bg-[#7FB509]' :
    passwordStrength >= 2 ? 'bg-amber-400' : 'bg-red-400';

  const strengthLabel =
    passwordStrength >= 4 ? 'Strong' : passwordStrength >= 3 ? 'Good' :
    passwordStrength >= 2 ? 'Weak'   : 'Too short';

  const handleUpdatePassword = async () => {
    setError('');
    if (!password || !confirm) { setError('Please fill in both fields.'); return; }
    if (password.length < 6)   { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error: updateError } = await resetClient.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message || 'Failed to update password. Please try again.');
      setLoading(false);
      return;
    }
    toast.success('Password updated! Please log in.', { duration: 4000 });
    await resetClient.auth.signOut();
    router.push('/login');
  };

  return (
    <div className={`${outfit.variable} min-h-screen bg-gray-50 flex items-center justify-center px-4 font-[var(--font-outfit)]`}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex justify-center mb-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${verified ? 'bg-[#7FB509]/10' : 'bg-amber-50'}`}>
            <FaShieldAlt size={28} className={verified ? 'text-[#7FB509]' : 'text-amber-500'} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Set new password</h1>

        {!verified ? (
          <>
            <p className="text-sm text-gray-500 text-center mb-6">
              Waiting for verification... make sure you opened this page from your email link.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center mb-5">
              <p className="text-amber-700 font-semibold text-sm mb-1">⚠️ Verification pending</p>
              <p className="text-amber-600 text-sm">Click the reset link in your email. This page will unlock automatically.</p>
            </div>
            <div className="flex justify-center mb-6"><ClipLoader size={24} color="#7FB509" /></div>
            {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 text-center">⚠️ {error}</div>}
            <button onClick={() => router.push('/forgot-password')}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer transition-all">
              ← Request a new reset link
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 text-center mb-5">Identity verified! Choose a strong new password.</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center mb-5">
              <p className="text-green-700 font-semibold text-sm">✓ Email verified successfully</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509] placeholder:text-gray-400 transition-all" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7FB509] cursor-pointer">
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {[1,2,3,4].map(lvl => (
                      <div key={lvl} className={`h-1 flex-1 rounded-full transition-all duration-300 ${lvl <= passwordStrength ? strengthColor : 'bg-gray-100'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-semibold mt-1 ${passwordStrength >= 3 ? 'text-[#7FB509]' : passwordStrength >= 2 ? 'text-amber-500' : 'text-red-500'}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input type={showCPw ? 'text' : 'password'} value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                  placeholder="Repeat your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509] placeholder:text-gray-400 transition-all" />
                <button type="button" onClick={() => setShowCPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7FB509] cursor-pointer">
                  {showCPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {confirm.length > 0 && (
                <p className={`text-xs font-semibold mt-1.5 ${password === confirm ? 'text-[#7FB509]' : 'text-red-500'}`}>
                  {password === confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">⚠️ {error}</div>}

            <button onClick={handleUpdatePassword} disabled={loading}
              className="w-full py-3 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.98]">
              {loading ? <><ClipLoader size={18} color="#fff" /><span>Updating...</span></> : 'Update Password'}
            </button>
          </>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <a href="/login" className="text-xs text-gray-400 hover:text-[#7FB509] transition-colors">← Back to login</a>
        </div>
      </div>
    </div>
  );
}