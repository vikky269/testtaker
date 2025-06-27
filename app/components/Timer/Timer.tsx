"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  duration: number; // duration in seconds
  onTimeUp: () => void;
}

export default function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Unique key for the quiz session
    const timerKey = "quiz-end-time";

    // Check if there's an end time already stored
    let storedEndTime = localStorage.getItem(timerKey);

    if (!storedEndTime) {
      // If not, set new end time and save to localStorage
      const endTime = Date.now() + duration * 1000;
      localStorage.setItem(timerKey, endTime.toString());
      storedEndTime = endTime.toString();
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = Math.floor(
        (parseInt(storedEndTime!) - now) / 1000
      );

      if (timeRemaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(timerKey); // cleanup
        onTimeUp();
      } else {
        setTimeLeft(timeRemaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-2 text-center text-lg font-semibold bg-red-100 text-red-600 rounded-md w-fit mx-auto">
      ⏳ Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
