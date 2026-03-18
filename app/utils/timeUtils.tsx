// app/utils/timeUtils.ts
// Time formatting and duration calculation helpers

export interface TimeState {
  mathStartTime: number | null;
  mathEndTime: number | null;
  elaStartTime: number | null;
  elaEndTime: number | null;
  scienceStartTime: number | null;
  scienceEndTime: number | null;
  totalTestStartTime: number | null;
  totalTestEndTime: number | null;
}

export interface Durations {
  mathDuration?: number;
  elaDuration?: number;
  scienceDuration?: number;
  totalDuration?: number;
  actualTestTime?: number;
}

/** Converts a seconds value into "Xm Ys" display string */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Computes all section durations from raw timestamps.
 * Falls back gracefully when start/end times are missing.
 */
export const calculateDurations = (times: TimeState): Durations => {
  const durations: Durations = {};
  const now = Date.now();

  const {
    mathStartTime, mathEndTime,
    elaStartTime, elaEndTime,
    scienceStartTime, scienceEndTime,
    totalTestStartTime, totalTestEndTime,
  } = times;

  // Math — estimate start if missing
  if (mathEndTime) {
    const startTime =
      mathStartTime ||
      mathEndTime - (elaStartTime ? elaStartTime - (totalTestStartTime ?? 0) : 600000);
    durations.mathDuration = Math.round((mathEndTime - startTime) / 1000);
  } else if (mathStartTime) {
    durations.mathDuration = Math.round((now - mathStartTime) / 1000);
  }

  // ELA
  if (elaStartTime) {
    durations.elaDuration = Math.round(((elaEndTime || now) - elaStartTime) / 1000);
  }

  // Science
  if (scienceStartTime) {
    durations.scienceDuration = Math.round(((scienceEndTime || now) - scienceStartTime) / 1000);
  }

  // Total
  if (totalTestStartTime) {
    durations.totalDuration = Math.round(((totalTestEndTime || now) - totalTestStartTime) / 1000);
  }

  return durations;
};