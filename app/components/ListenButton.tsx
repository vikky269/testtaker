'use client';

import { useEffect, useState } from 'react';

/** Same speech settings as visual-assessment: slower, slightly higher pitch. */
export function speakText(text: string) {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
  if (!text?.trim()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.trim());
  u.rate = 0.85;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

export function canUseSpeech(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/** Pre-K through Grade 1 only — matches the visual-assessment Listen control. */
export function showVoiceListen(grade?: string) {
  const key = (grade ?? '').toLowerCase().replace(/\s+/g, '');
  return (
    key === 'pre-k' ||
    key === 'prek' ||
    key === 'kindergarten' ||
    key === 'k' ||
    key === '1' ||
    key === '1stgrade' ||
    key === '1st-grade' ||
    key === 'grade1'
  );
}

export default function ListenButton({
  text,
  label = 'Read aloud',
  className = '',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(canUseSpeech());
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported || !text?.trim()) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        speakText(text);
      }}
      aria-label={label}
      className={`va-listen inline-flex items-center gap-1.5 rounded-full border-[3px] border-indigo-500 bg-indigo-50 px-3.5 py-2 text-sm font-extrabold text-indigo-800 transition hover:bg-indigo-100 ${className}`}
    >
      <svg
        className="h-5 w-5 shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
        <path
          d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="va-listen-label">Listen</span>
    </button>
  );
}
