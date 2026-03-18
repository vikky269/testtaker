'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const NAV_LINKS = [
  { label: 'Home',        href: '/'            },
  { label: 'Learning',    href: '/'            },
  { label: 'Services',    href: '/'            },
  { label: 'SM Academy',  href: '/'            },
  { label: 'Contact Us',  href: '/'            },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export default function Navbar() {
  const [user, setUser]             = useState<any>(null);
  const [profile, setProfile]       = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        const { data, error } = await supabase
          .from('student_profile').select('full_name, grade').eq('id', currentUser.id).single();
        if (!error) setProfile(data);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        supabase.from('student_profile').select('full_name, grade').eq('id', currentUser.id)
          .single().then(({ data, error }) => { if (!error) setProfile(data); });
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null);
    window.location.href = '/login';
  };

  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <nav className={`${outfit.variable} sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/SmartMathz.png" alt="SmartMathz" width={140} height={48} className="h-9 w-auto object-contain" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="relative px-3 py-1.5 text-sm font-semibold text-gray-600 rounded-lg
                         hover:text-[#7FB509] hover:bg-green-50 transition-all duration-150
                         after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5
                         after:bg-[#7FB509] after:scale-x-0 hover:after:scale-x-100
                         after:transition-transform after:duration-200 after:rounded-full"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: avatar / login + mobile toggle */}
        <div className="flex items-center gap-3">

          {/* Avatar / Login */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="w-9 h-9 rounded-full bg-[#7FB509] text-white text-sm font-bold
                                 flex items-center justify-center shadow-sm ring-2 ring-white
                                 hover:ring-[#7FB509] transition-all duration-150 cursor-pointer">
                {initials}
              </button>

              {mounted && showDropdown &&  (
                <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-gray-100
                                py-4 px-5 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="font-semibold text-sm text-gray-900 truncate">{profile?.full_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                  {profile?.grade && (
                    <span className="inline-block mt-2 text-xs bg-green-50 text-[#7FB509] font-semibold px-2 py-0.5 rounded-full">
                      {profile.grade}
                    </span>
                  )}
                  <hr className="my-3 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full bg-[#7FB509] hover:bg-[#6b970a] text-white text-sm font-semibold
                               py-2 rounded-xl cursor-pointer transition-colors duration-150"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#7FB509] hover:bg-[#6b970a] text-white text-sm font-semibold
                         px-4 py-2 rounded-xl transition-colors duration-150 shadow-sm"
            >
              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-gray-700 rounded transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 rounded transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 rounded transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mounted && mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-gray-700
                         rounded-xl hover:bg-green-50 hover:text-[#7FB509] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
