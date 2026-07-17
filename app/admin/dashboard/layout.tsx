'use client';

// app/admin/dashboard/layout.tsx
// Changes:
// 1. Admin info in top bar is now clickable → routes to /admin/dashboard/settings
// 2. Sign out button moved to just below the nav items (not stuck at bottom)

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase,withTimeout } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard, Users, FileText, ClipboardList,
  BarChart2, LogOut, X, Menu, Shield, Settings, GraduationCap, FileCheck2
} from 'lucide-react';

const ADMIN_EMAIL = 'info@smartmathz.com';

 
const NAV_ITEMS = [
  { href: '/admin/dashboard',                       icon: LayoutDashboard, label: 'Overview'             },
  { href: '/admin/dashboard/students',              icon: Users,           label: 'Students'             },
  { href: '/admin/dashboard/results',               icon: FileText,        label: 'Results'              },
  { href: '/admin/dashboard/completed-recommendations', icon: FileCheck2,  label: 'Completed Recommendations'  },
  { href: '/admin/dashboard/subscriptions',         icon: ClipboardList,   label: 'Subscriptions'        },
  { href: '/admin/dashboard/learning-categories',   icon: GraduationCap,   label: 'Learning Categories'  },
  { href: '/admin/dashboard/analytics',             icon: BarChart2,       label: 'Analytics'            },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking]       = useState(true);

  useEffect(() => {
    const check = async () => {
      // const { data: { session } } = await supabase.auth.getSession();
      const result = await withTimeout(supabase.auth.getSession());
      const session = result?.data?.session ?? null;
      if (!session || session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
        router.replace('/admin/login');
      } else {
        setChecking(false);
      }
    };
    check();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  const currentLabel = NAV_ITEMS.find(n =>
    pathname === n.href || pathname.startsWith(n.href + '/')
  )?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen flex bg-[#f8faf4]">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#1a2e05] flex flex-col
                         transition-transform duration-300 lg:translate-x-0
                         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7FB509] flex items-center justify-center">
              <Shield className="text-white w-4 h-4" />
            </div>

            <div>
              <p className="text-white font-bold text-sm leading-none">SmartMathz</p>
              <p className="text-white/50 text-xs mt-0.5">Admin Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/50 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="px-3 pt-4 space-y-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href ||
              (href !== '/admin/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                            transition-all duration-150
                  ${active
                    ? 'bg-[#7FB509] text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        

        {/* Settings link — just below sign out */}
        <div className="px-3 pb-4">
          <Link href="/admin/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                        transition-all duration-150
              ${pathname === '/admin/dashboard/settings'
                ? 'bg-[#7FB509] text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
            <Settings size={16} />
            Settings
          </Link>
        </div>


        {/* ── Sign out — directly below nav, not stuck at bottom ── */}
        <div className="px-3 pt-3 pb-2">
          <div className="h-px bg-white/10 mb-3" />
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                       text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
            <LogOut size={16} />
            Sign out
          </button>
        </div>

      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 h-14 flex items-center
                           justify-between sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-[#3a5a09] cursor-pointer p-1">
            <Menu size={18} />
          </button>

          <div className="hidden lg:block justify-between items-center">
             <div className=''>
              {/* <Link href={"/"} className='flex items-center'>
                <Image src="/logo2.png" width={200} height={100} alt='SmartMathz Logo' />
              </Link> */}
              </div>
            <p className="text-sm font-semibold text-gray-900">{currentLabel}</p>
          </div>

          {/* ── Admin info — clickable, routes to settings ── */}
          <Link
            href="/admin/dashboard/settings"
            className="flex items-center gap-2 ml-auto rounded-xl px-3 py-1.5
                       hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-[#3a5a09] flex items-center justify-center
                            group-hover:bg-[#7FB509] transition-colors">
              <Shield className="text-white w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 group-hover:text-[#3a5a09] transition-colors">
                Admin
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[140px]">{ADMIN_EMAIL}</p>
            </div>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}