export interface TimerPreset {
  id: string;
  label: string;
  durationSeconds: number;
  isCustom: boolean;
  category?: 'rest' | 'quick' | 'hiit' | 'custom';
}

export interface StopwatchLap {
  lapNumber: number;
  lapDurationMs: number;
  totalElapsedMs: number;
  isFastest?: boolean;
  isSlowest?: boolean;
  deltaMs?: number;
}

export interface IntervalConfig {
  prepSeconds: number;
  workSeconds: number;
  restSeconds: number;
  totalRounds: number;
  cooldownSeconds: number;
}

export type IntervalPhase = 'idle' | 'prep' | 'work' | 'rest' | 'cooldown' | 'complete';

export interface IntervalState {
  currentRound: number;
  totalRounds: number;
  phase: IntervalPhase;
  phaseSecondsRemaining: number;
  totalSecondsElapsed: number;
  isRunning: boolean;
  isPaused: boolean;
}

export type ActiveToolType = 'none' | 'timer' | 'stopwatch' | 'interval' | 'rest';

export interface FloatingTimerHUDState {
  type: ActiveToolType;
  title: string;
  formattedTime: string;
  isRunning: boolean;
  progressPercent: number; // 0 to 100
}
