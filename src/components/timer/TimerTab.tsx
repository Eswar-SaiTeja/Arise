import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Sparkles, 
  Bell, 
  Clock, 
  ChevronUp, 
  ChevronDown,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { timerService } from '../../services/timerService';
import { audioService } from '../../services/audioService';
import { TimerPreset } from '../../types/timer';
import { useBrand } from '../../context/BrandContext';

export const TimerTab: React.FC = () => {
  const { currentTheme } = useBrand();
  
  // Custom picker state (Hours, Minutes, Seconds)
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);

  // Active Timer state
  const [totalDuration, setTotalDuration] = useState(90);
  const [remainingSeconds, setRemainingSeconds] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Presets state
  const [presets, setPresets] = useState<TimerPreset[]>(() => timerService.getAllPresets());
  const [showAddPresetModal, setShowAddPresetModal] = useState(false);
  const [newPresetLabel, setNewPresetLabel] = useState('');
  const [newPresetDuration, setNewPresetDuration] = useState(60);

  const timerRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Sync with global floating HUD
  useEffect(() => {
    if (isRunning) {
      const progress = totalDuration > 0 ? Math.round(((totalDuration - remainingSeconds) / totalDuration) * 100) : 0;
      timerService.updateFloatingHUD({
        type: 'timer',
        title: 'Countdown Timer',
        formattedTime: timerService.formatSeconds(remainingSeconds),
        isRunning: !isPaused,
        progressPercent: progress
      });
    } else {
      timerService.updateFloatingHUD({
        type: 'none',
        title: '',
        formattedTime: '00:00',
        isRunning: false,
        progressPercent: 0
      });
    }
  }, [isRunning, isPaused, remainingSeconds, totalDuration]);

  // Main countdown loop
  useEffect(() => {
    if (isRunning && !isPaused) {
      // Request screen wake lock
      timerService.requestWakeLock().then(lock => {
        wakeLockRef.current = lock;
      });

      timerRef.current = window.setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            audioService.playCountdownTick();
            timerService.triggerHaptic('countdown');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wakeLockRef.current) {
        try { wakeLockRef.current.release(); } catch {}
        wakeLockRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wakeLockRef.current) {
        try { wakeLockRef.current.release(); } catch {}
      }
    };
  }, [isRunning, isPaused]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    audioService.playTimerComplete();
    timerService.triggerHaptic('finish');
  };

  const handleStart = () => {
    const computedTotal = hours * 3600 + minutes * 60 + seconds;
    if (computedTotal <= 0) return;
    
    setTotalDuration(computedTotal);
    setRemainingSeconds(computedTotal);
    setIsRunning(true);
    setIsPaused(false);
    timerService.triggerHaptic('tap');
  };

  const handlePause = () => {
    setIsPaused(true);
    timerService.triggerHaptic('tap');
  };

  const handleResume = () => {
    setIsPaused(false);
    timerService.triggerHaptic('tap');
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setRemainingSeconds(totalDuration);
    timerService.triggerHaptic('tap');
  };

  const handleCancel = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const computedTotal = hours * 3600 + minutes * 60 + seconds;
    setRemainingSeconds(computedTotal);
    timerService.triggerHaptic('tap');
  };

  const handleAdjustTime = (deltaSeconds: number) => {
    setRemainingSeconds(prev => {
      const next = Math.max(5, prev + deltaSeconds);
      if (next > totalDuration) setTotalDuration(next);
      return next;
    });
    timerService.triggerHaptic('tap');
  };

  const handleSelectPreset = (p: TimerPreset) => {
    const h = Math.floor(p.durationSeconds / 3600);
    const m = Math.floor((p.durationSeconds % 3600) / 60);
    const s = p.durationSeconds % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setTotalDuration(p.durationSeconds);
    setRemainingSeconds(p.durationSeconds);
    setIsRunning(false);
    setIsPaused(false);
    timerService.triggerHaptic('tap');
  };

  const handleSaveCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetLabel.trim() || newPresetDuration <= 0) return;
    timerService.addCustomPreset(newPresetLabel, newPresetDuration);
    setPresets(timerService.getAllPresets());
    setShowAddPresetModal(false);
    setNewPresetLabel('');
  };

  const handleDeleteCustomPreset = (id: string) => {
    timerService.deleteCustomPreset(id);
    setPresets(timerService.getAllPresets());
  };

  // SVG Circular progress math
  const progressRatio = totalDuration > 0 ? (totalDuration - remainingSeconds) / totalDuration : 0;
  const strokeDashoffset = 753.98 * progressRatio; // 2 * PI * 120

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Visual Timer Display / Circular Gauge */}
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111622] to-[#0A0D14] border border-white/10 shadow-2xl">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
            {/* Background track circle */}
            <circle
              cx="130"
              cy="130"
              r="115"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Progress circle */}
            <circle
              cx="130"
              cy="130"
              r="115"
              stroke={currentTheme.accentColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={722.56}
              strokeDashoffset={722.56 * (1 - progressRatio)}
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{
                filter: `drop-shadow(0 0 12px ${currentTheme.glowColor})`
              }}
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            {isRunning ? (
              <>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-gray-400 mb-1">
                  {isPaused ? 'TIMER PAUSED' : 'TIME REMAINING'}
                </span>
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                  {timerService.formatSeconds(remainingSeconds)}
                </span>
                <span className="text-xs text-gray-400 mt-2 font-mono">
                  Total: {timerService.formatSeconds(totalDuration)}
                </span>
              </>
            ) : (
              /* Interactive Drum Spin Picker when not running */
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => setHours(h => (h + 1) % 24)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="w-12 py-1 text-center font-mono font-black text-2xl sm:text-3xl text-white bg-black/40 rounded-lg border border-white/10">
                    {hours.toString().padStart(2, '0')}
                  </span>
                  <button 
                    onClick={() => setHours(h => (h - 1 + 24) % 24)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-[9px] font-mono text-gray-400 uppercase mt-0.5">HR</span>
                </div>

                <span className="text-2xl font-mono text-gray-500 font-bold pb-4">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => setMinutes(m => (m + 1) % 60)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="w-12 py-1 text-center font-mono font-black text-2xl sm:text-3xl text-white bg-black/40 rounded-lg border border-white/10">
                    {minutes.toString().padStart(2, '0')}
                  </span>
                  <button 
                    onClick={() => setMinutes(m => (m - 1 + 60) % 60)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-[9px] font-mono text-gray-400 uppercase mt-0.5">MIN</span>
                </div>

                <span className="text-2xl font-mono text-gray-500 font-bold pb-4">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => setSeconds(s => (s + 5) % 60)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="w-12 py-1 text-center font-mono font-black text-2xl sm:text-3xl text-white bg-black/40 rounded-lg border border-white/10">
                    {seconds.toString().padStart(2, '0')}
                  </span>
                  <button 
                    onClick={() => setSeconds(s => (s - 5 + 60) % 60)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-[9px] font-mono text-gray-400 uppercase mt-0.5">SEC</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              style={{
                backgroundColor: currentTheme.accentColor,
                boxShadow: `0 0 25px -4px ${currentTheme.glowColor}`
              }}
              className="px-8 py-3.5 rounded-2xl text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 touch-target"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Timer</span>
            </button>
          ) : (
            <>
              {isPaused ? (
                <button
                  onClick={handleResume}
                  className="px-6 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 touch-target"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 touch-target"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors touch-target"
                title="Reset to total duration"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleCancel}
                className="px-4 py-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors touch-target"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Quick Add/Subtract while running */}
        {isRunning && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={() => handleAdjustTime(-15)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-colors"
            >
              -15s
            </button>
            <button
              onClick={() => handleAdjustTime(15)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-colors"
            >
              +15s
            </button>
            <button
              onClick={() => handleAdjustTime(30)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-colors"
            >
              +30s
            </button>
            <button
              onClick={() => handleAdjustTime(60)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-colors"
            >
              +1m
            </button>
          </div>
        )}
      </div>

      {/* Preset Quick Actions */}
      <div className="p-5 rounded-3xl bg-[#10141F] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Timer Presets
            </h3>
          </div>
          <button
            onClick={() => setShowAddPresetModal(true)}
            className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Preset</span>
          </button>
        </div>

        {/* Preset Chips Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {presets.map(p => (
            <div
              key={p.id}
              className="relative group"
            >
              <button
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`w-full py-2.5 px-2 rounded-xl text-xs font-mono font-bold transition-all border text-center flex flex-col items-center justify-center ${
                  totalDuration === p.durationSeconds
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-sm'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{timerService.formatSeconds(p.durationSeconds)}</span>
                <span className="text-[10px] text-gray-400 font-sans font-normal truncate max-w-full">
                  {p.label}
                </span>
              </button>
              {p.isCustom && (
                <button
                  type="button"
                  onClick={() => handleDeleteCustomPreset(p.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 shadow"
                  title="Delete custom preset"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Preset Modal */}
      {showAddPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-[#141A28] border border-cyan-500/30 p-5 space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white">Create Custom Preset</h4>
              <button onClick={() => setShowAddPresetModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCustomPreset} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Preset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Deadlift Rest"
                  value={newPresetLabel}
                  onChange={e => setNewPresetLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Duration (Seconds)</label>
                <input
                  type="number"
                  min="5"
                  max="7200"
                  value={newPresetDuration}
                  onChange={e => setNewPresetDuration(Math.max(5, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Formatted: {timerService.formatSeconds(newPresetDuration)}
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPresetModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
