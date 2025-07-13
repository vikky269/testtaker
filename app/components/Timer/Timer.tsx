// "use client";

// import { useState, useEffect } from "react";

// interface TimerProps {
//   duration: number; // duration in seconds
//   onTimeUp: () => void;
// }

// export default function Timer({ duration, onTimeUp }: TimerProps) {
//   const [timeLeft, setTimeLeft] = useState(duration);

//   useEffect(() => {
//     // Unique key for the quiz session
//     const timerKey = "quiz-end-time";

//     // Check if there's an end time already stored
//     let storedEndTime = localStorage.getItem(timerKey);

//     if (!storedEndTime) {
//       // If not, set new end time and save to localStorage
//       const endTime = Date.now() + duration * 1000;
//       localStorage.setItem(timerKey, endTime.toString());
//       storedEndTime = endTime.toString();
//     }

//     const interval = setInterval(() => {
//       const now = Date.now();
//       const timeRemaining = Math.floor(
//         (parseInt(storedEndTime!) - now) / 1000
//       );

//       if (timeRemaining <= 0) {
//         clearInterval(interval);
//         localStorage.removeItem(timerKey); // cleanup
//         onTimeUp();
//       } else {
//         setTimeLeft(timeRemaining);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [duration, onTimeUp]);

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <div className="p-2 text-center text-lg font-semibold bg-red-100 text-red-600 rounded-md w-fit mx-auto">
//       ⏳ Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//     </div>
//   );
// }


// "use client";
// import { useEffect, useState } from "react";

// type TimerProps = {
//   duration: number; // seconds
//   onTimeUp: () => void;
// };

// export default function Timer({ duration, onTimeUp }: TimerProps) {
//   const [timeLeft, setTimeLeft] = useState(duration);

//   useEffect(() => {
//     setTimeLeft(duration); // 💥 reset every time duration changes
//   }, [duration]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onTimeUp();
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft]); // 👈 this is fine to stay

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   const progressPercent = ((duration - timeLeft) / duration) * 100;

//   return (
//     <div className="w-full max-w-md mx-auto mt-4">
//       <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
//         <span className="text-red-600 text-xl font-semibold">
//           Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
//         </span>
//         <span>{Math.round(progressPercent)}%</span>
//       </div>
//       <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
//         <div
//           className="h-full bg-[#7FB509] transition-all duration-500 ease-linear"
//           style={{ width: `${100 - progressPercent}%` }}
//         />
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  identifier?: string; // e.g., "sat-reading", "sat-math", "regular"
}

export default function Timer({ duration, onTimeUp, identifier = "default" }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const storageKey = `quiz-end-time-${identifier}`;

  useEffect(() => {
    let storedEndTime = localStorage.getItem(storageKey);

    if (!storedEndTime) {
      const newEndTime = Date.now() + duration * 1000;
      localStorage.setItem(storageKey, newEndTime.toString());
      storedEndTime = newEndTime.toString();
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = Math.floor((parseInt(storedEndTime!) - now) / 1000);

      if (timeRemaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(storageKey);
        onTimeUp();
      } else {
        setTimeLeft(timeRemaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, identifier, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
        <span className="bg-[#7FB509] text-white px-2 py-1 rounded-md text-xl">
          ⏳ Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#7FB509] transition-all duration-500 ease-linear"
          style={{ width: `${100 - progress}%` }}
        />
      </div>
    </div>
  );
}


