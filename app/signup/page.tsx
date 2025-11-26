'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader'; 
import { Outfit } from 'next/font/google';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // optional

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    grade: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // loading state

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  setError("");
  setLoading(true);

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  // Check if all fields are filled
  if (!formData.fullName || !formData.email  || !formData.password || !formData.confirmPassword) {
    setError("Please fill in all fields");
    toast.error("Please fill in all fields");
    setLoading(false);
    return;
  }

  // 1. Sign up the user with metadata
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        grade: formData.grade,
      },
    },
  });

    if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
            setError('This email is already in use. Please log in instead.');
        } else {
            setError(signUpError.message);
        }
        return;
    }

  // 2. Wait for the user to be authenticated
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    setError("User session not found after signup.");
    return;
  }

  const userId = session.user.id;

  // 3. Insert into student_profile table
  const { error: profileInsertError } = await supabase.from("student_profile").insert([
    {
      id: userId,
      full_name: formData.fullName,
      email: formData.email,
      grade: formData.grade,
    },
  ]);

  if (profileInsertError) {
    setError(`Profile insert failed: ${profileInsertError.message}`);
    return;
  }
   
  toast.success("Signup successful! Please log in to access your test.");
  router.push("/login");
};

  return (
    <div className={`flex items-center justify-center bg-gray-100 p-6 ${outfit.variable}`}>
      <div className='hidden md:block w-[55%] min-h-screen bg-[#698e19] justify-center items-center'>
        <img src="/login.png" alt="" className='h-[490px] mx-auto' />
        <p className='text-[#ffffff] -mt-16 font-bold text-4xl font-main text-center'>SmartMathz Test Taker</p>
          <p className='text-[#ffffff] mt-7 font-main  text-center'>Sign up to ur account here........</p>
      </div>


      <div className="p-8 rounded shadow-md w-screen md:w-[45%] md:min-h-screen space-y-4 bg-white flex justify-center items-center font-main flex-col">
        <h2 className="text-2xl font-semibold text-[#7FB509] font-main">Sign Up</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {/* <select
          name="grade"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Grade</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={`Grade ${i + 1}`}>
              Grade {i + 1}
            </option>
          ))}
        </select> */}

        {/* <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        /> */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-2 rounded pr-10"
            required
          />
          <span
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative w-full mt-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full border p-2 rounded pr-10"
            required
          />
          <span
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>


        {error && <p className="text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          className="cursor-pointer w-full bg-[#7FB509] text-white py-2 rounded hover:bg-[#7fb509de]"
        >
          {loading ? (
            <>
              <ClipLoader size={20} color="#ffffff" />
              <span>Creating Account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-[#7FB509] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
