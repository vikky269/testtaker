"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  duration: number; // duration in seconds
  onTimeUp: () => void; // Callback function when time runs out
}

export default function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(); // Call function to submit quiz when time is up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [timeLeft, onTimeUp]);

  // Convert seconds into minutes and seconds format
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-2 text-center text-lg font-semibold bg-red-100 text-red-600 rounded-md w-fit mx-auto">
      ⏳ Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  )
}
