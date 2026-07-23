// lib/subscribe/style.ts
import { Outfit, Great_Vibes } from 'next/font/google';

export const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
export const signatureFont = Great_Vibes({ subsets: ['latin'], weight: '400' });

export const inputCls = `w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
  focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
  placeholder:text-gray-400 transition-all`;