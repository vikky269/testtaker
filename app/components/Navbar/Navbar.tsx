'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profileData, error } = await supabase
          .from('student_profile')
          .select('full_name, grade')
          .eq('id', currentUser.id)
          .single();

        if (!error) {
          setProfile(profileData);
        }
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        supabase
          .from('student_profile')
          .select('full_name, grade')
          .eq('id', currentUser.id)
          .single()
          .then(({ data, error }) => {
            if (!error) setProfile(data);
          });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = '/login';
  };

  return (
    <nav
      className={`${outfit.variable} flex items-center justify-between lg:px-16 md:px-12 p-4 bg-white shadow-md`}
    >
      {/* Logo */}
      <Link href="/" className="cursor-pointer">
        <Image src="/SmartMathz.png" alt="Logo" width={150} height={100} />
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center space-x-12 font-semibold text-[#181818]">
        <Link className='hover:text-green-700 hover:border-b-2 border-green-700 transition-all' href="/">Home</Link>
        <Link className='hover:text-green-700 hover:border-b-2 border-green-700 transition-all' href="/">Learning</Link>
        <Link className='hover:text-green-700 hover:border-b-2 border-green-700 transition-all' href="/">Services</Link>
        <Link className='hover:text-green-700 hover:border-b-2 border-green-700 transition-all' href="/">SM Academy</Link>
        <Link className='hover:text-green-700 hover:border-b-2 border-green-700 transition-all' href="/">Contact Us</Link>
         <Link className='hover:text-green-700 hover:border-b-2 border-green-700 transition-all' href="/leaderboard">Leaderboard</Link>
      </div>

      
      <div className="relative flex items-center">
        {user ? (
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
        
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold cursor-pointer">
              {user.email?.charAt(0).toUpperCase()}
            </div>

            
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded py-6 px-4 w-56 z-50 border">
                <p className="font-semibold text-sm mb-1">{profile?.full_name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>

                <button
                  onClick={handleLogout}
                  className="mt-2 w-full bg-[#7FB509] text-white px-4 py-1 rounded hover:bg-[#6b970a] text-sm cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-[#7FB509] text-white px-4 py-2 rounded-md hover:bg-[#6ca108]"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
