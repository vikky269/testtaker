"use client";

import { useEffect, useRef, useState } from "react";

interface TimerProps {
  duration: number; // in seconds (initial section allotment)
  onTimeUp: () => void;
  identifier?: string;
  /** When true, countdown freezes and remaining time is preserved */
  paused?: boolean;
  /** Fires roughly every second with remaining seconds */
  onRemainingChange?: (seconds: number) => void;
  /**
   * After admin resume, restart from this remaining budget.
   * Pass a new object (or new `token`) each resume so identical seconds still apply.
   */
  resumeFromSeconds?: number | null;
  resumeToken?: number | null;
}

export default function Timer({
  duration,
  onTimeUp,
  identifier = "default",
  paused = false,
  onRemainingChange,
  resumeFromSeconds = null,
  resumeToken = null,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const storageKey = `quiz-end-time-${identifier}`;
  const budgetKey = `quiz-timer-budget-${identifier}`;
  const pausedRemainKey = `quiz-timer-paused-${identifier}`;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const onRemainingRef = useRef(onRemainingChange);
  const endTimeRef = useRef<number | null>(null);
  const timeLeftRef = useRef(duration);
  const wasPausedRef = useRef(paused);
  const lastResumeTokenRef = useRef<number | null>(null);
  const skipDurationExtendRef = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    onRemainingRef.current = onRemainingChange;
  }, [onRemainingChange]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const clearTicker = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTicker = (endTime: number) => {
    clearTicker();
    endTimeRef.current = endTime;

    const tick = () => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearTicker();
        localStorage.removeItem(storageKey);
        localStorage.removeItem(budgetKey);
        localStorage.removeItem(pausedRemainKey);
        timeLeftRef.current = 0;
        setTimeLeft(0);
        onRemainingRef.current?.(0);
        onTimeUpRef.current();
      } else {
        timeLeftRef.current = remaining;
        setTimeLeft(remaining);
        onRemainingRef.current?.(remaining);
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
  };

  const applyRemaining = (remainingSeconds: number, opts?: { asBudget?: boolean }) => {
    const remaining = Math.max(0, Math.floor(remainingSeconds));
    const endTime = Date.now() + remaining * 1000;
    endTimeRef.current = endTime;
    localStorage.setItem(storageKey, String(endTime));
    if (opts?.asBudget !== false) {
      // Keep the original section allotment as budget so "duration grew" logic
      // never mistakes a mid-test remaining value for a smaller section config.
      const existingBudget = parseInt(localStorage.getItem(budgetKey) || "", 10);
      if (!Number.isFinite(existingBudget) || existingBudget <= 0) {
        localStorage.setItem(budgetKey, String(duration));
      }
    }
    localStorage.removeItem(pausedRemainKey);
    timeLeftRef.current = remaining;
    setTimeLeft(remaining);
    onRemainingRef.current?.(remaining);
    if (!paused) startTicker(endTime);
    return endTime;
  };

  // Freeze on pause
  useEffect(() => {
    if (paused && !wasPausedRef.current) {
      const remaining =
        endTimeRef.current != null
          ? Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000))
          : timeLeftRef.current;
      localStorage.setItem(pausedRemainKey, String(remaining));
      localStorage.removeItem(storageKey);
      endTimeRef.current = null;
      timeLeftRef.current = remaining;
      setTimeLeft(remaining);
      onRemainingRef.current?.(remaining);
      clearTicker();
      skipDurationExtendRef.current = true;
    }
    wasPausedRef.current = paused;
  }, [paused, pausedRemainKey, storageKey]);

  // Admin resume: apply exact remaining from server
  useEffect(() => {
    if (paused) return;
    if (resumeFromSeconds == null) return;

    const token = resumeToken ?? resumeFromSeconds;
    if (lastResumeTokenRef.current === token) return;
    lastResumeTokenRef.current = token;

    skipDurationExtendRef.current = true;
    applyRemaining(resumeFromSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeFromSeconds, resumeToken, paused]);

  // Initial start / unpause without explicit resume value / section change
  useEffect(() => {
    if (paused) {
      clearTicker();
      return;
    }

    // If an admin-resume just applied, don't re-init from full duration
    if (resumeFromSeconds != null && lastResumeTokenRef.current != null) {
      const token = resumeToken ?? resumeFromSeconds;
      if (lastResumeTokenRef.current === token && endTimeRef.current != null) {
        if (!intervalRef.current) startTicker(endTimeRef.current);
        return;
      }
    }

    const now = Date.now();
    const pausedRemainRaw = localStorage.getItem(pausedRemainKey);
    const savedEnd = localStorage.getItem(storageKey);
    const savedBudget = localStorage.getItem(budgetKey);
    const prevBudget = savedBudget ? parseInt(savedBudget, 10) : NaN;

    let endTime: number;

    if (pausedRemainRaw != null) {
      // Coming out of local pause — continue from frozen remaining
      const remain = Math.max(0, parseInt(pausedRemainRaw, 10) || 0);
      endTime = now + remain * 1000;
      localStorage.removeItem(pausedRemainKey);
      localStorage.setItem(storageKey, String(endTime));
      skipDurationExtendRef.current = false;
    } else if (savedEnd && parseInt(savedEnd, 10) > now) {
      endTime = parseInt(savedEnd, 10);
      // Only extend when the allotted section length actually grew (config change),
      // never because we stored a mid-pause remaining as "budget".
      if (
        !skipDurationExtendRef.current &&
        Number.isFinite(prevBudget) &&
        duration > prevBudget + 1 &&
        // Guard: only treat as config growth when previous budget was near a full section
        prevBudget >= duration * 0.9
      ) {
        endTime += (duration - prevBudget) * 1000;
        localStorage.setItem(storageKey, String(endTime));
        localStorage.setItem(budgetKey, String(duration));
      }
      skipDurationExtendRef.current = false;
    } else if (wasPausedRef.current === false && timeLeftRef.current > 0 && timeLeftRef.current < duration) {
      // Safety: if storage was cleared mid-pause but React still has remaining, use it
      endTime = now + timeLeftRef.current * 1000;
      localStorage.setItem(storageKey, String(endTime));
    } else {
      endTime = now + duration * 1000;
      localStorage.setItem(storageKey, String(endTime));
      localStorage.setItem(budgetKey, String(duration));
    }

    startTicker(endTime);

    return () => {
      clearTicker();
    };
    // Intentionally depend on paused + duration + identifier so section changes still work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, identifier, storageKey, budgetKey, pausedRemainKey, paused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white ${
        paused ? "bg-amber-500" : "bg-[#C4A035]"
      }`}
    >
      <span aria-hidden className="opacity-90">
        {paused ? "⏸️" : "⏳"}
      </span>
      {paused ? "Paused: " : "Time Left: "}
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
