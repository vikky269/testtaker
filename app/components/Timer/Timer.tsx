"use client";

import { useEffect, useRef, useState } from "react";

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  identifier?: string; // e.g., "sat-reading", "sat-math", "regular"
}

export default function Timer({ duration, onTimeUp, identifier = "default" }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const storageKey = `quiz-end-time-${identifier}`;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const savedEndTime = localStorage.getItem(storageKey);
    const now = Date.now();
    let endTime: number;

    if (savedEndTime && parseInt(savedEndTime) > now) {
      endTime = parseInt(savedEndTime);
    } else {
      endTime = now + duration * 1000;
      localStorage.setItem(storageKey, endTime.toString());
    }

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const timeRemaining = Math.floor((endTime - currentTime) / 1000);

      if (timeRemaining <= 0) {
        clearInterval(intervalRef.current!);
        localStorage.removeItem(storageKey);
        setTimeLeft(0);
        onTimeUp();
      } else {
        setTimeLeft(timeRemaining);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, identifier, onTimeUp, storageKey]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#C4A035] px-3.5 py-1.5 text-sm font-semibold text-white">
      <span aria-hidden className="opacity-90">
        ⏳
      </span>
      Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
