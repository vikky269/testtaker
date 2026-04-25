
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

export const dynamic = "force-dynamic"

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

// Floating math symbols for the animated left panel
const MATH_SYMBOLS = [
  { sym: '÷', x: 12, y: 15, size: 28, delay: 0,    dur: 6  },
  { sym: '∑', x: 75, y: 8,  size: 22, delay: 0.8,  dur: 7  },
  { sym: '√', x: 88, y: 55, size: 26, delay: 1.5,  dur: 5  },
  { sym: 'π', x: 20, y: 70, size: 24, delay: 0.3,  dur: 8  },
  { sym: '∞', x: 60, y: 80, size: 20, delay: 2,    dur: 6  },
  { sym: '×', x: 45, y: 20, size: 18, delay: 1.1,  dur: 7  },
  { sym: '±', x: 5,  y: 45, size: 20, delay: 0.6,  dur: 5  },
  { sym: 'Δ', x: 82, y: 28, size: 22, delay: 1.8,  dur: 8  },
  { sym: '∫', x: 35, y: 88, size: 24, delay: 0.4,  dur: 6  },
  { sym: '%', x: 68, y: 60, size: 18, delay: 2.2,  dur: 7  },
  { sym: '∝', x: 15, y: 30, size: 20, delay: 1.3,  dur: 5  },
  { sym: '∈', x: 50, y: 50, size: 26, delay: 0.9,  dur: 6  },
  { sym: '∉', x: 30, y: 65, size: 22, delay: 1.6,  dur: 7  },
  { sym: '∧', x: 80, y: 75, size: 18, delay: 0.2,  dur: 5  },
  { sym: '∨', x: 25, y: 40, size: 20, delay: 1.9,  dur: 8  },
  { sym: '∋', x: 55, y: 15, size: 24, delay: 0.7,  dur: 6  },
  { sym: '∌', x: 65, y: 60, size: 20, delay: 0.7,  dur: 5  },
  { sym: '∃', x: 40, y: 35, size: 22, delay: 1.4,  dur: 7  },
  { sym: '∀', x: 70, y: 45, size: 20, delay: 0.5,  dur: 6  },
  { sym: '∄', x: 10, y: 80, size: 18, delay: 1.7,  dur: 5  },
  { sym: '∂', x: 85, y: 20, size: 24, delay: 0.3,  dur: 7  },
  { sym: '∇', x: 50, y: 70, size: 22, delay: 1.2,  dur: 6  },
  { sym: '∈', x: 20, y: 50, size: 18, delay: 0.8,  dur: 5  },
  { sym: '∉', x: 75, y: 30, size: 20, delay: 1.5,  dur: 7  },
  { sym: '∪', x: 30, y: 20, size: 22, delay: 0.4,  dur: 6  },
  { sym: '∩', x: 60, y: 40, size: 18, delay: 1.6,  dur: 5  },
  { sym: '∖', x: 45, y: 80, size: 20, delay: 0.9,  dur: 7  },
  { sym: '∗', x: 15, y: 60, size: 22, delay: 1.3,  dur: 6  },
  { sym: '∎', x: 80, y: 10, size: 18, delay: 0.2,  dur: 5  },
  { sym: '∏', x: 75, y: 25, size: 18, delay: 0.2, dur: 6, },
  { sym: '∐', x: 35, y: 65, size: 22, delay: 1.7, dur: 7, },
  { sym: '∑', x: 15, y: 20, size: 20, delay: 0.8, dur: 5, },
  { sym: '∏', x: 85, y: 50, size: 18, delay: 1.9, dur: 6, },
  { sym: '∐', x: 45, y: 35, size: 22, delay: 0.3, dur: 7, },
  { sym: '∑', x: 25, y: 75, size: 20, delay: 1.4, dur: 5, },

];

export default function LoginPage() {
  const router  = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [mounted, setMounted]   = useState(false);

  
  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      toast.error('Login failed');
    } else {
      toast.success('Login successful!');
      router.push('/');
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className={`${outfit.variable} min-h-screen flex font-[var(--font-outfit)]`}>

      {/* ── LEFT PANEL ──────────────────────────────────── */}
      <div className="hidden lg:flex relative w-[52%] bg-[#3a5a09] overflow-hidden flex-col items-center justify-center">

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Animated floating symbols */}
        {mounted && MATH_SYMBOLS.map(({ sym, x, y, size, delay, dur }, i) => (
          <span
            key={i}
            className="absolute font-bold text-white/20 select-none pointer-events-none"
            style={{
              left: `${x}%`, top: `${y}%`,
              fontSize: size,
              animation: `floatUp ${dur}s ease-in-out ${delay}s infinite alternate`,
            }}
          >
            {sym}
          </span>
        ))}

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#7FB509]/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-lime-300/10 blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Logo */}
          

          {/* Illustration */}
          <div style={{ animation: 'floatUp 4s ease-in-out infinite alternate' }}>
            <Image src="/login.png" alt="Students" width={340} height={300} className="w-72 h-auto drop-shadow-2xl" />
          </div>

          <div className="mb-6 p-3 rounded-2xl backdrop-blur-sm">
            {/* <Image src="/SmartMathz.png" alt="SmartMathz" width={160} height={56} className="h-12 w-auto object-contain brightness-0 invert" /> */}
            <Image src="/login-illustration.svg" alt="Students" width={340} height={300} className="w-72 h-auto drop-shadow-2xl" />
          </div>

          <h2 className="text-white text-3xl font-bold mt-6 leading-tight">
            SmartMathz<br />Test Taker
          </h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-xs">
            Prepare smarter, score higher. Login to access your personalised assessments.
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex gap-6 text-center">
            {[['500+', 'Students'], ['30+', 'Test Types'], ['3', 'Sections']].map(([num, label]) => (
              <div key={label}>
                <p className="text-white font-bold text-xl">{num}</p>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/SmartMathz.png" alt="SmartMathz" width={140} height={48} className="h-10 w-auto" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back 👋</h1>
            <p className="text-gray-500 mt-1 text-sm">Enter your credentials to access your account.</p>
          </div>

          {/* Form */}
          <div className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                           placeholder:text-gray-400 transition-all duration-150"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#7FB509] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                             placeholder:text-gray-400 transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7FB509] cursor-pointer transition-colors"
                >
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-[#7FB509] hover:bg-[#6b970a] text-white font-bold text-sm
                         flex items-center justify-center gap-2 cursor-pointer
                         disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150
                         shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <><ClipLoader size={18} color="#fff" /><span>Signing in...</span></>
              ) : 'Sign In'}
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#7FB509] font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          {/* After the "Don't have an account?" line */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link href="/admin/login" className="text-xs text-gray-400 hover:text-[#3a5a09] transition-colors">
              🔒 Login as Admin
            </Link>
          </div>


          {/* Back to academy */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <a
              href="https://smartmathz.com"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#7FB509] transition-colors"
            >
              ← Go to SmartMathz
            </a>
          </div>
        </div>
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-14px) rotate(6deg); }
        }
      `}</style>
    </div>
  );
}