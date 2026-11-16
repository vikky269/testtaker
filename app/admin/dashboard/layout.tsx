'use client';

// app/admin/dashboard/layout.tsx

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, withTimeout } from '@/lib/supabaseClient';
import Link from 'next/link';
import {
  LayoutDashboard, Users, FileText, ClipboardList,
  BarChart2, LogOut, X, Menu, Shield, Settings, GraduationCap, FileCheck2, BookOpen,
  MessageSquareHeart, Radio,
} from 'lucide-react';

const ADMIN_EMAIL = 'info@smartmathz.com';

const NAV_SECTIONS: {
  title?: string;
  items: { href: string; icon: typeof LayoutDashboard; label: string }[];
}[] = [
  {
    items: [
      { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { href: '/admin/dashboard/live-evaluations', icon: Radio, label: 'Live Evaluations' },
      { href: '/admin/dashboard/students', icon: Users, label: 'Students' },
      { href: '/admin/dashboard/results', icon: FileText, label: 'Pending Evaluations' },
      { href: '/admin/dashboard/completed-recommendations', icon: FileCheck2, label: 'Completed Evaluations' },
      { href: '/admin/dashboard/subscriptions', icon: ClipboardList, label: 'Subscriptions' },
    ],
  },
  {
    title: 'Learning',
    items: [
      { href: '/admin/dashboard/learning-categories', icon: GraduationCap, label: 'Learning Categories' },
      { href: '/admin/dashboard/programs', icon: BookOpen, label: 'Programs' },
    ],
  },
  {
    title: 'Assessments',
    items: [
      { href: '/admin/dashboard/ged-results', icon: GraduationCap, label: 'GED Assessments' },
      { href: '/admin/dashboard/psat-results', icon: FileCheck2, label: 'PSAT Assessments' },
      { href: '/admin/dashboard/shsat-results', icon: FileText, label: 'SHSAT Assessments' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { href: '/admin/dashboard/parent-feedback', icon: MessageSquareHeart, label: 'Parent Feedback' },
      { href: '/admin/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
    ],
  },
];

const ALL_NAV = NAV_SECTIONS.flatMap((s) => s.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [pauseRequestCount, setPauseRequestCount] = useState(0);

  const fetchPendingCount = async () => {
    const [lb, done] = await Promise.all([
      supabase.from('leaderboard').select('id'),
      supabase.from('completed_recommendations').select('leaderboard_id'),
    ]);
    if (!lb.data) return;
    const doneSet = new Set((done.data ?? []).map((r) => r.leaderboard_id).filter(Boolean));
    setPendingCount(lb.data.filter((r) => r.id && !doneSet.has(String(r.id))).length);
  };

  const fetchPauseRequests = async () => {
    const { data, error } = await supabase
      .from('live_evaluation_sessions')
      .select('id')
      .eq('status', 'pause_requested');
    if (!error) setPauseRequestCount(data?.length ?? 0);
  };

  useEffect(() => {
    fetchPendingCount();
    fetchPauseRequests();
  }, [pathname]);

  useEffect(() => {
    const handler = () => fetchPendingCount();
    window.addEventListener('pending-evals-changed', handler);
    const pausePoll = setInterval(fetchPauseRequests, 5000);
    return () => {
      window.removeEventListener('pending-evals-changed', handler);
      clearInterval(pausePoll);
    };
  }, []);

  useEffect(() => {
    const check = async () => {
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
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f1]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  const currentLabel =
    ALL_NAV.find(
      (n) => pathname === n.href || (n.href !== '/admin/dashboard' && pathname.startsWith(n.href))
    )?.label ??
    (pathname.startsWith('/admin/dashboard/settings') ? 'Settings' : 'Dashboard');

  const navLinkClass = (href: string) => {
    const active =
      pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
    return `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold
            transition-all duration-200
            ${
              active
                ? 'bg-[#7FB509] text-white shadow-[0_6px_16px_-8px_rgba(127,181,9,0.9)]'
                : 'text-white/55 hover:text-white hover:bg-white/[0.07]'
            }`;
  };

  return (
    <div className="min-h-screen flex bg-[#f4f7f1]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0f1a08]/60 backdrop-blur-[2px] z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-[260px] bg-[#14260a] flex flex-col
                    transition-transform duration-300 ease-out lg:translate-x-0 print:hidden
                    border-r border-white/[0.06]
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9fd12a] to-[#5f8a08] flex items-center justify-center shadow-inner flex-shrink-0">
              <Shield className="text-white w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-none tracking-tight">SmartMathz</p>
              <p className="text-white/40 text-[11px] mt-1 font-medium">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white cursor-pointer p-1.5 rounded-lg hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
          {NAV_SECTIONS.map((section, si) => (
            <div key={section.title ?? `sec-${si}`}>
              {section.title && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={navLinkClass(href)}
                  >
                    {(pathname === href ||
                      (href !== '/admin/dashboard' && pathname.startsWith(href))) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-white/90" />
                    )}
                    <Icon size={15} className="opacity-80 group-hover:opacity-100" />
                    <span className="flex-1 truncate">{label}</span>
                    {href === '/admin/dashboard/results' && (pendingCount ?? 0) > 0 && (
                      <span
                        className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold
                                    flex items-center justify-center flex-shrink-0
                                    ${
                                      pathname === href || pathname.startsWith(href + '/')
                                        ? 'bg-white text-[#3a5a09]'
                                        : 'bg-red-500 text-white'
                                    }`}
                      >
                        {pendingCount! > 99 ? '99+' : pendingCount}
                      </span>
                    )}
                    {href === '/admin/dashboard/live-evaluations' && pauseRequestCount > 0 && (
                      <span
                        className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold
                                    flex items-center justify-center flex-shrink-0
                                    ${
                                      pathname === href || pathname.startsWith(href + '/')
                                        ? 'bg-white text-[#3a5a09]'
                                        : 'bg-amber-500 text-white'
                                    }`}
                      >
                        {pauseRequestCount > 99 ? '99+' : pauseRequestCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Settings + Sign out — directly below nav (original placement) */}
          <div className="pt-1 space-y-0.5">
            <div className="h-px bg-white/[0.07] mx-2 mb-2" />
            <Link
              href="/admin/dashboard/settings"
              onClick={() => setSidebarOpen(false)}
              className={navLinkClass('/admin/dashboard/settings')}
            >
              <Settings size={15} />
              <span className="flex-1">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold
                         text-white/45 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header
          className="bg-white/80 backdrop-blur-md border-b border-[#e4ebe0] px-4 lg:px-7 h-[58px]
                     flex items-center justify-between sticky top-0 z-10 print:hidden
                     shadow-[0_1px_0_rgba(18,61,53,0.03)]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-[#3a5a09] cursor-pointer p-2 rounded-xl hover:bg-[#edf5e5]"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a8f7c] hidden sm:block">
                Admin
              </p>
              <p className="text-sm font-bold text-[#1a2e05] truncate leading-tight">{currentLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/dashboard/settings"
              className="flex items-center gap-2.5 rounded-2xl pl-1.5 pr-3 py-1.5
                         border border-transparent hover:border-[#e4ebe0] hover:bg-[#f7faf5]
                         transition-all cursor-pointer group"
            >
              <div
                className="w-8 h-8 rounded-xl bg-[#1a2e05] flex items-center justify-center
                           group-hover:bg-[#7FB509] transition-colors shadow-sm"
              >
                <Shield className="text-white w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 group-hover:text-[#3a5a09] transition-colors">
                  Admin
                </p>
                <p className="text-[11px] text-gray-400 truncate max-w-[150px]">{ADMIN_EMAIL}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e4ebe0] bg-white
                         px-3 py-2 text-xs font-semibold text-gray-600 hover:text-[#1a2e05]
                         hover:border-[#cfd9c8] hover:bg-[#f7faf5] transition-all cursor-pointer"
              title="Sign out"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-5 lg:p-7 overflow-auto">
          <div className="mx-auto w-full max-w-[1280px] animate-[fadeIn_0.25s_ease-out]">
            {children}
          </div>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `,
        }}
      />
    </div>
  );
}
