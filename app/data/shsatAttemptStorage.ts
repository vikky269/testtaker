/**
 * Local attempt lock for SHSAT (drawn ids + progress).
 * Survives refresh without requiring a dedicated Supabase attempts table.
 */
import type { SHSATSectionKey } from '@/app/data/shsatConfig';

const KEY = 'shsatAttempt';

export type ShsatAttemptState = {
  status: 'in_progress' | 'submitted';
  section: SHSATSectionKey;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  elaIds: string[];
  mathIds: string[];
  sectionDurations: Record<SHSATSectionKey, number>;
  updatedAt: number;
};

export function loadShsatAttempt(): ShsatAttemptState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ShsatAttemptState;
  } catch {
    return null;
  }
}

export function saveShsatAttempt(state: ShsatAttemptState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
}

export function clearShsatAttempt() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
