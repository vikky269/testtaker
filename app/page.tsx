"use client";
import NewUI from "./newUI";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const ADMIN_EMAIL = 'info@smartmathz.com';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // No session — redirect to login but also stop loading
          // so the page doesn't hang if redirect is slow
          setLoading(false);
          router.push('/login');
          return;
        }

        const userEmail = session.user?.email?.toLowerCase();

        if (userEmail === ADMIN_EMAIL) {
          // Admin — redirect to dashboard
          router.push('/admin/dashboard');
          // Don't setLoading(false) here — page is navigating away
          return;
        }

        // Regular student — show the page
        setLoading(false);

      } catch (err) {
        // If anything fails, unblock the page
        console.error('Auth check failed:', err);
        setLoading(false);
      }
    };

    checkAuth();

    // Also listen for auth state changes (handles reload/tab restore)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <NewUI />
    </div>
  );
}


