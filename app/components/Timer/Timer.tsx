

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
    // Clear any previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Check localStorage for saved end time
    const savedEndTime = localStorage.getItem(storageKey);
    const now = Date.now();
    let endTime: number;

    // If saved time is valid and in the future, use it; otherwise, reset
    if (savedEndTime && parseInt(savedEndTime) > now) {
      endTime = parseInt(savedEndTime);
    } else {
      endTime = now + duration * 1000;
      localStorage.setItem(storageKey, endTime.toString());
    }

    // Start interval
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

    // Clear interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, identifier, onTimeUp]); // Triggers re-init if quiz changes

  // UI
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <div className="flex justify-center items-center text-sm font-medium text-gray-700 mb-2">
        <span className="bg-[#7FB509] text-white px-2 py-1 rounded-md text-xl">
          ⏳ Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
        {/* <span>{Math.round(progress)}%</span> */}
      </div>
    
        {/* <div
          className="h-full bg-[#7FB509] transition-all duration-500 ease-linear"
          style={{ width: `${100 - progress}%` }}
        />
      </div> */}
   
    </div>
  );
}



