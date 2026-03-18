// app/hooks/useQuizTimer.ts
// Encapsulates all time-tracking state and localStorage persistence

import { useState, useEffect } from "react";
import { calculateDurations, type TimeState, type Durations } from "@/app/utils/timeUtils";

interface UseQuizTimerProps {
  testid: string | undefined;
  gradeParam: string | null;
  isGrade9Or10: boolean;
  isSat: boolean;
  quizSection: "math" | "ela" | "science";
  submitted: boolean;
}

export function useQuizTimer({
  testid,
  gradeParam,
  isGrade9Or10,
  isSat,
  quizSection,
  submitted,
}: UseQuizTimerProps) {
  const [mathStartTime, setMathStartTime] = useState<number | null>(null);
  const [mathEndTime, setMathEndTime] = useState<number | null>(null);
  const [elaStartTime, setElaStartTime] = useState<number | null>(null);
  const [elaEndTime, setElaEndTime] = useState<number | null>(null);
  const [scienceStartTime, setScienceStartTime] = useState<number | null>(null);
  const [scienceEndTime, setScienceEndTime] = useState<number | null>(null);
  const [totalTestStartTime, setTotalTestStartTime] = useState<number | null>(null);
  const [totalTestEndTime, setTotalTestEndTime] = useState<number | null>(null);

  // Restore or initialise timing on mount
  useEffect(() => {
    const saved = localStorage.getItem("quizTimeData");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.testid === testid && parsed.gradeParam === gradeParam && !parsed.completed) {
        setMathStartTime(parsed.mathStartTime);
        setMathEndTime(parsed.mathEndTime);
        setElaStartTime(parsed.elaStartTime);
        setElaEndTime(parsed.elaEndTime);
        setScienceStartTime(parsed.scienceStartTime);
        setScienceEndTime(parsed.scienceEndTime);
        setTotalTestStartTime(parsed.totalTestStartTime);
        setTotalTestEndTime(parsed.totalTestEndTime);
        return;
      }
    }
    // Fresh session
    const now = Date.now();
    setTotalTestStartTime(now);
    if (isGrade9Or10) setMathStartTime(now);
    else if (isSat) setElaStartTime(now);
  }, [testid, gradeParam, isGrade9Or10, isSat]);

  // Persist timing to localStorage whenever any value changes
  useEffect(() => {
    localStorage.setItem(
      "quizTimeData",
      JSON.stringify({
        testid, gradeParam,
        mathStartTime, mathEndTime,
        elaStartTime, elaEndTime,
        scienceStartTime, scienceEndTime,
        totalTestStartTime, totalTestEndTime,
        completed: submitted,
      })
    );
  }, [
    testid, gradeParam,
    mathStartTime, mathEndTime,
    elaStartTime, elaEndTime,
    scienceStartTime, scienceEndTime,
    totalTestStartTime, totalTestEndTime,
    submitted,
  ]);

  // Auto-initialise section start times when quizSection changes
  useEffect(() => {
    if (!isGrade9Or10) return;
    const now = Date.now();
    if (quizSection === "math" && mathStartTime === null) {
      setMathStartTime(now);
      if (totalTestStartTime === null) setTotalTestStartTime(now);
    }
    if (quizSection === "ela" && elaStartTime === null) setElaStartTime(now);
    if (quizSection === "science" && scienceStartTime === null) setScienceStartTime(now);
  }, [isGrade9Or10, quizSection, mathStartTime, elaStartTime, scienceStartTime, totalTestStartTime]);

  const timeState: TimeState = {
    mathStartTime, mathEndTime,
    elaStartTime, elaEndTime,
    scienceStartTime, scienceEndTime,
    totalTestStartTime, totalTestEndTime,
  };

  /** Computes durations synchronously from current state */
  const getDurations = (): Durations => calculateDurations(timeState);

  return {
    timeState,
    getDurations,
    setMathStartTime, setMathEndTime,
    setElaStartTime, setElaEndTime,
    setScienceStartTime, setScienceEndTime,
    setTotalTestStartTime, setTotalTestEndTime,
  };
}