'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { Outfit } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const NAV_LINKS = [
  { label: 'Home',        href: '/'            },
  {label: 'Enroll now',    href:'/subscribe'  },
  { label: 'Programs', href: '/programs' },
  { label: 'My-test', href: '/my-tests' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const isAdmin = user?.email === 'info@smartmathz.com';
  const [profile, setProfile]       = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   const router = useRouter();

   const dropdownRef = useRef<HTMLDivElement | null>(null);


useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    setUser(user || null);

    // 🚫 Skip admin (VERY IMPORTANT)
    if (!user || user.email === 'info@smartmathz.com') return;

    const { data, error } = await supabase
      .from('student_profile')
      .select('full_name, grade')
      .eq('id', user.id)
      .maybeSingle(); // ✅ FIX HERE

    if (error) {
      console.log('Profile fetch error:', error.message);
      return;
    }

    setProfile(data);
  };

  getUser();

  const { data: listener } = supabase.auth.onAuthStateChange(async (_e, session) => {
    const user = session?.user || null;
    setUser(user);

    // 🚫 Skip admin again
    if (!user || user.email === 'info@smartmathz.com') return;

    const { data, error } = await supabase
      .from('student_profile')
      .select('full_name, grade')
      .eq('id', user.id)
      .maybeSingle(); // ✅ FIX HERE TOO

    if (!error) setProfile(data);
  });

  return () => listener.subscription.unsubscribe();
}, []);


 const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.replace('/login');
  } catch (err) {
    console.error("Logout error:", err);
  }
};

useEffect(() => {
  const handleClickOutside = (event:any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);


  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';


  const pathname = usePathname();

if (pathname.startsWith('/admin')) return null;

  return (
    <nav className={`${outfit.variable} sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/SmartMathz.png" alt="SmartMathz" width={140} height={48} className="h-9 w-auto object-contain" />
        </Link>


        {!isAdmin && (
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="relative px-3 py-1.5 text-sm font-semibold text-gray-600 rounded-lg
                   hover:text-[#7FB509] hover:bg-green-50 transition-all duration-150"
              >
                {label}
              </Link>
            ))}





          
            {/* ── My Tests — only when logged in ── */}
            {user && (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-600 rounded-lg
                                   hover:text-[#7FB509] hover:bg-green-50 transition-all duration-150 cursor-pointer">
                  My Tests
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Single-level dropdown — right-aligned so it can never overflow */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-56">
                    <p className="px-4 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Test Sheet
                    </p>
                    <Link href="/my-tests"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7FB509]">
                      👁️ View Test Sheet
                    </Link>
                    <Link href="/my-tests?download=sheet"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7FB509]">
                      ⬇️ Download Test Sheet
                    </Link>
                    <hr className="my-1.5 border-gray-100" />
                    <Link href="/my-tests?download=report"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7FB509]">
                      📊 Performance Report
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right: avatar / login + mobile toggle */}
        <div className="flex items-center gap-3">

          {/* Avatar / Login */}
          {user ? (
            <div
              className="relative"
              ref={dropdownRef}
            >
              <button className="w-9 h-9 rounded-full bg-[#7FB509] text-white text-sm font-bold
                                 flex items-center justify-center shadow-sm ring-2 ring-white
                                 hover:ring-[#7FB509] transition-all duration-150 cursor-pointer"
                       onClick={() => setShowDropdown(p => !p)}          
                                 
                                 >
                {initials}
              </button>

              {mounted && showDropdown &&  (
                <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-gray-100
                                py-4 px-5 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                                
                      //onClick={(e) => e.stopPropagation()}
                >
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
      {mounted && mobileOpen && !isAdmin &&  (
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

          {user && (
            <>
              <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">My Tests</p>
              {[
                { label: '👁️ View Test Sheet', href: '/my-tests' },
                { label: '⬇️ Download Test Sheet', href: '/my-tests?download=sheet' },
                { label: '📊 Performance Report', href: '/my-tests?download=report' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-gray-700 rounded-xl hover:bg-green-50 hover:text-[#7FB509] transition-colors">
                  {label}
                </Link>
              ))}
            </>
          )}


        </div>
      )}
    </nav>
  );
}
