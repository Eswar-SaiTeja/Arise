import { TimerPreset, StopwatchLap, IntervalConfig, FloatingTimerHUDState } from '../types/timer';
import { audioService } from './audioService';

const PRESETS_STORAGE_KEY = 'kinetix_timer_presets';

export const DEFAULT_PRESETS: TimerPreset[] = [
  { id: 'p-15s', label: '15s Rest / Sprint', durationSeconds: 15, isCustom: false, category: 'rest' },
  { id: 'p-30s', label: '30s High Intensity', durationSeconds: 30, isCustom: false, category: 'rest' },
  { id: 'p-45s', label: '45s Density Set', durationSeconds: 45, isCustom: false, category: 'rest' },
  { id: 'p-60s', label: '60s Standard Rest', durationSeconds: 60, isCustom: false, category: 'rest' },
  { id: 'p-90s', label: '90s Hypertrophy', durationSeconds: 90, isCustom: false, category: 'rest' },
  { id: 'p-2m', label: '2 Min Strength Rest', durationSeconds: 120, isCustom: false, category: 'quick' },
  { id: 'p-3m', label: '3 Min Heavy Compound', durationSeconds: 180, isCustom: false, category: 'quick' },
  { id: 'p-5m', label: '5 Min Mobility / Cooldown', durationSeconds: 300, isCustom: false, category: 'quick' },
  { id: 'p-10m', label: '10 Min Meditation / Cardio', durationSeconds: 600, isCustom: false, category: 'quick' },
];

export const DEFAULT_INTERVAL_PRESETS: { name: string; desc: string; config: IntervalConfig }[] = [
  {
    name: 'Tabata Protocol',
    desc: 'Classic 20s maximum exertion followed by 10s active recovery for 8 rounds.',
    config: { prepSeconds: 5, workSeconds: 20, restSeconds: 10, totalRounds: 8, cooldownSeconds: 30 }
  },
  {
    name: 'Combat Rounds',
    desc: '3-minute championship rounds with 60s recovery.',
    config: { prepSeconds: 10, workSeconds: 180, restSeconds: 60, totalRounds: 5, cooldownSeconds: 60 }
  },
  {
    name: 'EMOM Power',
    desc: '45s work density, 15s transition per minute for 10 rounds.',
    config: { prepSeconds: 5, workSeconds: 45, restSeconds: 15, totalRounds: 10, cooldownSeconds: 45 }
  },
  {
    name: 'HIIT Sprint Circuit',
    desc: '30s sprint cadence with 45s aerobic recovery for 6 rounds.',
    config: { prepSeconds: 5, workSeconds: 30, restSeconds: 45, totalRounds: 6, cooldownSeconds: 60 }
  }
];

class TimerService {
  private customPresets: TimerPreset[] = [];
  private listeners: ((hud: FloatingTimerHUDState) => void)[] = [];
  private currentHUD: FloatingTimerHUDState = {
    type: 'none',
    title: '',
    formattedTime: '00:00',
    isRunning: false,
    progressPercent: 0
  };

  constructor() {
    this.loadCustomPresets();
  }

  private loadCustomPresets() {
    try {
      const data = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (data) {
        this.customPresets = JSON.parse(data);
      }
    } catch {
      this.customPresets = [];
    }
  }

  private saveCustomPresets() {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(this.customPresets));
    } catch {}
  }

  public getAllPresets(): TimerPreset[] {
    return [...DEFAULT_PRESETS, ...this.customPresets];
  }

  public getCustomPresets(): TimerPreset[] {
    return this.customPresets;
  }

  public addCustomPreset(label: string, durationSeconds: number): TimerPreset {
    const newPreset: TimerPreset = {
      id: 'custom-' + Date.now(),
      label: label.trim() || `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`,
      durationSeconds: Math.max(5, durationSeconds),
      isCustom: true,
      category: 'custom'
    };
    this.customPresets.push(newPreset);
    this.saveCustomPresets();
    return newPreset;
  }

  public editCustomPreset(id: string, updates: Partial<TimerPreset>): boolean {
    const idx = this.customPresets.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.customPresets[idx] = { ...this.customPresets[idx], ...updates };
    this.saveCustomPresets();
    return true;
  }

  public deleteCustomPreset(id: string): boolean {
    const prevLen = this.customPresets.length;
    this.customPresets = this.customPresets.filter(p => p.id !== id);
    if (this.customPresets.length !== prevLen) {
      this.saveCustomPresets();
      return true;
    }
    return false;
  }

  // Lap Analysis for Stopwatch
  public analyzeLaps(laps: { lapNumber: number; lapDurationMs: number; totalElapsedMs: number }[]): StopwatchLap[] {
    if (laps.length === 0) return [];
    if (laps.length === 1) {
      return [{ ...laps[0], isFastest: false, isSlowest: false, deltaMs: 0 }];
    }

    let minDuration = Infinity;
    let maxDuration = -Infinity;

    laps.forEach(l => {
      if (l.lapDurationMs < minDuration) minDuration = l.lapDurationMs;
      if (l.lapDurationMs > maxDuration) maxDuration = l.lapDurationMs;
    });

    return laps.map((l, i) => {
      const prevLap = i > 0 ? laps[i - 1] : null;
      const deltaMs = prevLap ? l.lapDurationMs - prevLap.lapDurationMs : 0;
      return {
        ...l,
        isFastest: l.lapDurationMs === minDuration,
        isSlowest: l.lapDurationMs === maxDuration && laps.length > 2,
        deltaMs
      };
    });
  }

  // Time formatters
  public formatMs(totalMs: number): string {
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const hundredths = Math.floor((totalMs % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  }

  public formatSeconds(totalSec: number): string {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Screen Wake Lock API to prevent phone screen from dimming/sleeping during timers
  public async requestWakeLock(): Promise<any> {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        return sentinel;
      } catch {
        return null;
      }
    }
    return null;
  }

  // Global Floating HUD state management
  public updateFloatingHUD(hud: FloatingTimerHUDState) {
    this.currentHUD = hud;
    this.listeners.forEach(fn => fn(this.currentHUD));
  }

  public getFloatingHUD(): FloatingTimerHUDState {
    return this.currentHUD;
  }

  public subscribeHUD(fn: (hud: FloatingTimerHUDState) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public triggerHaptic(type: 'tap' | 'lap' | 'finish' | 'countdown') {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'tap':
            navigator.vibrate(30);
            break;
          case 'lap':
            navigator.vibrate([40, 30, 40]);
            break;
          case 'countdown':
            navigator.vibrate(50);
            break;
          case 'finish':
            navigator.vibrate([200, 100, 200, 100, 400]);
            break;
        }
      } catch {}
    }
  }
}

export const timerService = new TimerService();
