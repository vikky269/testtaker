"use client";
import NewUI from "./newUI";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';


export default function Home() {

const ADMIN_EMAIL = 'info@smartmathz.com';


  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {


    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');

      } else if (user.email?.toLowerCase() === ADMIN_EMAIL) {
        router.push('/admin/dashboard');  
        setLoading(false);
      }
      else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Checking auth...</p>;

   return (
    <div className="min-h-screen">
      <NewUI />
    </div>
  )
}



