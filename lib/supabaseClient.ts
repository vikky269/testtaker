import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// Never wait more than `ms` for an auth call — return null instead of hanging
export const withTimeout = <T,>(p: Promise<T>, ms = 3000): Promise<T | null> =>
  Promise.race([p, new Promise<null>(res => setTimeout(() => res(null), ms))]);