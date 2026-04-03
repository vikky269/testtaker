'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Outfit } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const ADMIN_EMAIL = 'info@smartmathz.com';


const MATH_SYMBOLS = [
  { sym: '∑', x: 8,  y: 12, size: 26, delay: 0,   dur: 6 },
  { sym: 'π', x: 80, y: 8,  size: 22, delay: 0.8, dur: 7 },
  { sym: '√', x: 88, y: 55, size: 24, delay: 1.5, dur: 5 },
  { sym: 'Δ', x: 15, y: 68, size: 20, delay: 0.3, dur: 8 },
  { sym: '∞', x: 60, y: 82, size: 18, delay: 2,   dur: 6 },
  { sym: '÷', x: 42, y: 18, size: 16, delay: 1.1, dur: 7 },
  { sym: '%', x: 5,  y: 42, size: 20, delay: 0.6, dur: 5 },
];

export default function AdminLoginPage() {
  const router  = useRouter();
  const [email, setEmail]     = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async () => {
    if (!password) { setError('Please enter your password.'); return; }

    // Only allow the designated admin email
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError('Unauthorised. Admin access only.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid credentials. Please try again.');
      toast.error('Login failed');
      setLoading(false);
      return;
    }

    // Double-check the logged-in email matches admin
    if (data.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setError('Unauthorised. Admin access only.');
      setLoading(false);
      return;
    }

    toast.success('Welcome, Admin!');
    window.location.href = '/admin/dashboard'; 
    // router.refresh();
    //   setTimeout(() => {
    //       router.replace('/admin/dashboard');
    //   }, 300);
    // setLoading(false);
  };

  return (
    <div className={`${outfit.variable} min-h-screen flex font-[var(--font-outfit)]`}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex relative w-[52%] bg-[#1a2e05] overflow-hidden flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        {mounted && MATH_SYMBOLS.map(({ sym, x, y, size, delay, dur }, i) => (
          <span key={i} className="absolute font-bold text-white/15 select-none pointer-events-none"
            style={{ left: `${x}%`, top: `${y}%`, fontSize: size, animation: `floatUp ${dur}s ease-in-out ${delay}s infinite alternate` }}>
            {sym}
          </span>
        ))}

        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#7FB509]/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-lime-300/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
        
          {/* Shield icon */}
          <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-6"
            style={{ animation: 'floatUp 4s ease-in-out infinite alternate' }}>
            <FaShieldAlt className="text-[#7FB509] text-5xl" />
          </div>

          <h2 className="text-white text-3xl font-bold leading-tight">Admin Portal</h2>
          <p className="text-white/60 mt-3 text-sm leading-relaxed max-w-xs">
            Restricted access. Only authorised SmartMathz administrators may log in.
          </p>

          <div className="mt-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm max-w-xs w-full space-y-3">
            {[
              ['📊', 'View all student results & analytics'],
              ['👥', 'Manage student profiles'],
              ['📄', 'Download assessment reports'],
              ['📈', 'Track performance metrics'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-left">
                <span className="text-lg">{icon}</span>
                <p className="text-white/75 text-sm">{text}</p>
              </div>
            ))}
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

          {/* Header */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#1a2e05]/10 flex items-center justify-center mb-4">
              <FaShieldAlt className="text-[#3a5a09] text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 mt-1 text-sm">Authorised personnel only.</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email</label>
              <input
                type="email" value={email} readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#3a5a09]/30 focus:border-[#3a5a09]
                             placeholder:text-gray-400 transition-all duration-150"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3a5a09] cursor-pointer transition-colors">
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              onClick={handleLogin} disabled={loading}
              className="w-full py-3 mt-1 rounded-xl bg-[#3a5a09] hover:bg-[#2d4707] text-white font-bold text-sm
                         flex items-center justify-center gap-2 cursor-pointer
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <><FaShieldAlt size={14} /> Sign in as Admin</>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-400 hover:text-[#3a5a09] transition-colors">
              ← Back to student login
            </Link>
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








