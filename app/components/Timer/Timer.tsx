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
  const budgetKey = `quiz-timer-budget-${identifier}`;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const now = Date.now();
    const savedEnd = localStorage.getItem(storageKey);
    const savedBudget = localStorage.getItem(budgetKey);
    const prevBudget = savedBudget ? parseInt(savedBudget, 10) : NaN;
    let endTime: number;

    if (savedEnd && parseInt(savedEnd, 10) > now) {
      endTime = parseInt(savedEnd, 10);
      // Only extend when the allotted section length actually grew (config change),
      // never because the parent re-rendered with the same remaining budget.
      if (Number.isFinite(prevBudget) && duration > prevBudget + 1) {
        endTime += (duration - prevBudget) * 1000;
        localStorage.setItem(storageKey, String(endTime));
        localStorage.setItem(budgetKey, String(duration));
      }
    } else {
      endTime = now + duration * 1000;
      localStorage.setItem(storageKey, String(endTime));
      localStorage.setItem(budgetKey, String(duration));
    }

    const tick = () => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        localStorage.removeItem(storageKey);
        localStorage.removeItem(budgetKey);
        setTimeLeft(0);
        onTimeUpRef.current();
      } else {
        setTimeLeft(remaining);
      }
    };

    tick(); // show correct remaining immediately (don't wait 1s)
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // Intentionally omit onTimeUp — use ref so answering a question doesn't restart the clock.
  }, [duration, identifier, storageKey, budgetKey]);

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
