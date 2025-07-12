


// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Outfit } from 'next/font/google';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';

// const outfit = Outfit({
//   subsets: ['latin'],
//   variable: '--font-outfit',
// });

// const Navbar = () => {
//   const [user, setUser] = useState<any>(null);
//   const [profile, setProfile] = useState<any>(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         setUser(user);
//         const { data: profileData, error } = await supabase
//           .from('student_profile')
//           .select('*')
//           .eq('id', user.id)
//           .single();

//         if (!error) {
//           setProfile(profileData);
//         }
//       }
//     };

//     getUser();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setProfile(null);
//     router.push('/login');
//   };

//   return (
//     <nav className={`${outfit.variable} flex items-center justify-between lg:px-16 md:px-12 p-4 bg-white shadow-md`}>
//       {/* Logo */}
//       <Link href="/" className="cursor-pointer">
//         <Image src="/SmartMathz.png" alt="Logo" width={150} height={100} />
//       </Link>

//       {/* Navigation Links */}
//       <div className="hidden md:flex items-center">
//         <ul className="flex space-x-4 text-[#181818] font-semibold font-main">
//           {["Home", "Learning", "Services", "SM Academy", "Contact Us"].map((item, idx) => (
//             <li key={idx} className="relative group">
//               <Link href="/" className="cursor-pointer">
//                 {item}
//                 <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#7FB509] transition-all duration-300 group-hover:w-full"></span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Auth Section */}
//       <div className="relative ml-4" ref={dropdownRef}>
//         {user && profile ? (
//           <div>
//             <button
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               className="focus:outline-none"
//               aria-label="Open user menu"
//             >
//               <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold hover:opacity-90">
//                 {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
//               </div>
//             </button>

//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-50 p-4">
//                 <p className="text-sm font-medium">{profile.full_name}</p>
//                 <p className="text-xs text-gray-500">{profile.email}</p>
//                 <p className="text-xs mt-1">Grade: {profile.grade}</p>

//                 <button
//                   onClick={handleLogout}
//                   className="mt-3 w-full bg-red-500 text-white text-sm py-1.5 rounded hover:bg-red-600"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <Link href="/login" className="text-[#181818] font-semibold hover:text-[#7FB509] transition-colors">
//             Account
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Outfit } from 'next/font/google';

// const outfit = Outfit({
//   subsets: ['latin'],
//   variable: '--font-outfit',
// });

// export default function Navbar() {
//   const [user, setUser] = useState<any>(null);
//   const [showDropdown, setShowDropdown] = useState(false);

//   useEffect(() => {
//     const getUser = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       setUser(session?.user || null);
//     };

//     getUser();

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     window.location.href = '/login';
//   };

//   return (
//     <nav
//       className={`${outfit.variable} flex items-center justify-between lg:px-16 md:px-12 p-4 bg-white shadow-md`}
//     >
//       {/* Logo */}
//       <Link href="/" className="cursor-pointer">
//         <Image src="/SmartMathz.png" alt="Logo" width={150} height={100} />
//       </Link>

//       {/* Nav Links */}
//       <div className="hidden md:flex items-center space-x-12 font-semibold text-[#181818]">
//         <Link href="/">Home</Link>
//         <Link href="/learning">Learning</Link>
//         <Link href="/services">Services</Link>
//         <Link href="/academy">SM Academy</Link>
//         <Link href="/contact">Contact Us</Link>
//       </div>

//       {/* Auth Section */}
//       <div className="relative flex items-center">
//         {user ? (
//           <div
//             className="relative"
//             onMouseEnter={() => setShowDropdown(true)}
//             onMouseLeave={() => setShowDropdown(false)}
//           >
//             {/* Avatar */}
//             <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold cursor-pointer">
//               {user.email?.charAt(0).toUpperCase()}
//             </div>

//             {/* Dropdown */}
//             {showDropdown && (
//               <div className="absolute right-0 top-12 bg-white shadow-lg rounded p-4 w-52 z-50 border">
//                 <p className="font-semibold text-sm mb-1">{user.email}</p>
//                 <p className="font-semibold text-sm mb-1">{user.full_name}</p>
//                 <p className="font-semibold text-sm mb-1">{user.grade}</p>
//                 <button
//                   onClick={handleLogout}
//                   className="mt-2 w-full bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <Link
//             href="/login"
//             className="bg-[#7FB509] text-white px-4 py-2 rounded-md hover:bg-[#6ca108]"
//           >
//             Login
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }

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
        <Link href="/">Home</Link>
        <Link href="/learning">Learning</Link>
        <Link href="/services">Services</Link>
        <Link href="/academy">SM Academy</Link>
        <Link href="/contact">Contact Us</Link>
      </div>

      {/* Auth Section */}
      <div className="relative flex items-center">
        {user ? (
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold cursor-pointer">
              {user.email?.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded p-4 w-52 z-50 border">
                <p className="font-semibold text-sm mb-1">{profile?.full_name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs mt-1">Grade: {profile?.grade}</p>

                <button
                  onClick={handleLogout}
                  className="mt-2 w-full bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
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
