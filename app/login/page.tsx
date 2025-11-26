'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { Outfit } from 'next/font/google';
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error('Login failed');
    } else {
      toast.success('Login successful!');
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex md:items-center md:justify-center bg-gray-100 p-6 ${outfit.variable}`}>

       <div className=' hidden md:block w-[55%] min-h-screen bg-[#698e19] justify-center items-center'>
        <img src="/login.png" alt="" className='h-[490px] mx-auto' />
        <p className='text-[#ffffff] -mt-16 font-bold text-4xl font-main text-center'>SmartMathz Test Taker</p>
          <p className='text-[#ffffff] mt-7 font-main  text-center'>Login to take your test........</p>
      </div>
      
      <div className="bg-white p-8 rounded shadow-md w-full md:w-[45%] h-[400px] md:min-h-screen space-y-4 flex md:justify-center md:items-center flex-col font-main">
        <h2 className="text-2xl font-semibold text-[#7FB509]">Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={` cursor-pointer w-full flex items-center justify-center gap-2 py-2 rounded text-white ${
            loading ? 'bg-[#6c9612de] cursor-not-allowed' : 'bg-[#7FB509] hover:bg-[#7fb509de]'
          }`}
        >
          {loading ? (
            <>
              <ClipLoader size={20} color="#ffffff" />
              <span>Logging in...</span>
            </>
          ) : (
            'Login'
          )}
        </button>

        <p className="text-sm text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-[#7FB509] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

