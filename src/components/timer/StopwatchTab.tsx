import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Copy, 
  Check, 
  Flame, 
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import { timerService } from '../../services/timerService';
import { audioService } from '../../services/audioService';
import { StopwatchLap } from '../../types/timer';
import { useBrand } from '../../context/BrandContext';

export const StopwatchTab: React.FC = () => {
  const { currentTheme } = useBrand();

  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<{ lapNumber: number; lapDurationMs: number; totalElapsedMs: number }[]>([]);
  const [copiedLaps, setCopiedLaps] = useState(false);

  const startTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const requestAnimRef = useRef<number | null>(null);
  const lastLapTimestampRef = useRef<number>(0);
  const wakeLockRef = useRef<any>(null);

  // Sync with global floating HUD
  useEffect(() => {
    if (isRunning) {
      timerService.updateFloatingHUD({
        type: 'stopwatch',
        title: 'Stopwatch Active',
        formattedTime: timerService.formatMs(elapsedMs),
        isRunning: true,
        progressPercent: 100
      });
    } else if (elapsedMs > 0) {
      timerService.updateFloatingHUD({
        type: 'stopwatch',
        title: 'Stopwatch Paused',
        formattedTime: timerService.formatMs(elapsedMs),
        isRunning: false,
        progressPercent: 100
      });
    }
  }, [isRunning, elapsedMs]);

  // High-precision RAF loop
  const updateLoop = () => {
    const now = performance.now();
    const current = accumulatedMsRef.current + (now - startTimeRef.current);
    setElapsedMs(current);
    requestAnimRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    if (isRunning) {
      timerService.requestWakeLock().then(lock => {
        wakeLockRef.current = lock;
      });

      startTimeRef.current = performance.now();
      requestAnimRef.current = requestAnimationFrame(updateLoop);
    } else {
      if (requestAnimRef.current) cancelAnimationFrame(requestAnimRef.current);
      if (wakeLockRef.current) {
        try { wakeLockRef.current.release(); } catch {}
        wakeLockRef.current = null;
      }
    }

    return () => {
      if (requestAnimRef.current) cancelAnimationFrame(requestAnimRef.current);
      if (wakeLockRef.current) {
        try { wakeLockRef.current.release(); } catch {}
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    timerService.triggerHaptic('tap');
  };

  const handlePause = () => {
    if (isRunning) {
      const now = performance.now();
      accumulatedMsRef.current += (now - startTimeRef.current);
      setElapsedMs(accumulatedMsRef.current);
      setIsRunning(false);
      timerService.triggerHaptic('tap');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    accumulatedMsRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
    lastLapTimestampRef.current = 0;
    timerService.triggerHaptic('tap');
    timerService.updateFloatingHUD({
      type: 'none',
      title: '',
      formattedTime: '00:00',
      isRunning: false,
      progressPercent: 0
    });
  };

  const handleRecordLap = () => {
    if (!isRunning) return;
    const currentTotal = elapsedMs;
    const lapDuration = currentTotal - lastLapTimestampRef.current;
    lastLapTimestampRef.current = currentTotal;

    const newLapItem = {
      lapNumber: laps.length + 1,
      lapDurationMs: lapDuration,
      totalElapsedMs: currentTotal
    };

    setLaps(prev => [newLapItem, ...prev]);
    audioService.playLapBeep();
    timerService.triggerHaptic('lap');
  };

  const analyzedLaps: StopwatchLap[] = timerService.analyzeLaps(laps);

  const handleCopyLaps = () => {
    if (laps.length === 0) return;
    const text = laps.slice().reverse().map(l => 
      `Lap ${l.lapNumber.toString().padStart(2, '0')} | Split: ${timerService.formatMs(l.lapDurationMs)} | Total: ${timerService.formatMs(l.totalElapsedMs)}`
    ).join('\n');

    navigator.clipboard.writeText(`PROJECT ASCEND STOPWATCH LAP LOG\nTotal Time: ${timerService.formatMs(elapsedMs)}\n\n${text}`);
    setCopiedLaps(true);
    setTimeout(() => setCopiedLaps(false), 2500);
  };

  // Formatting minutes, seconds, milliseconds
  const minutes = Math.floor(elapsedMs / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);
  const hundredths = Math.floor((elapsedMs % 1000) / 10);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Stopwatch Giant Digital HUD Display */}
      <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-[#111622] to-[#0A0D14] border border-white/10 shadow-2xl overflow-hidden">
        <div 
          className="absolute -top-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: currentTheme.accentColor }}
        />

        <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-gray-400 mb-2">
          {isRunning ? 'PRECISION STOPWATCH ACTIVE' : 'STOPWATCH STANDBY'}
        </span>

        {/* Digital Readout */}
        <div className="flex items-baseline justify-center font-mono font-black text-white select-none">
          <span className="text-5xl sm:text-7xl tracking-tight">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span 
            className="text-2xl sm:text-4xl ml-2 font-bold opacity-90"
            style={{ color: currentTheme.accentColor }}
          >
            .{hundredths.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-3 mt-8">
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
              <span>{elapsedMs > 0 ? 'Resume' : 'Start'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 touch-target shadow-lg shadow-amber-500/20"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {/* Lap Button (active when running) */}
          <button
            onClick={handleRecordLap}
            disabled={!isRunning}
            className={`px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all touch-target ${
              isRunning
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95'
                : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            <Flag className="w-4 h-4 text-cyan-400" />
            <span>Lap</span>
          </button>

          {/* Reset Button */}
          {elapsedMs > 0 && !isRunning && (
            <button
              onClick={handleReset}
              className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors touch-target border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Lap Times History Table */}
      {analyzedLaps.length > 0 && (
        <div className="p-5 rounded-3xl bg-[#10141F] border border-white/10 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Lap Records ({analyzedLaps.length})
              </h3>
            </div>
            <button
              onClick={handleCopyLaps}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white border border-white/10 transition-colors"
            >
              {copiedLaps ? (
                <>
                  <Check className="w-3.5 h-3.5 text-lime-400" />
                  <span className="text-lime-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Laps</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/5 text-gray-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Lap</th>
                  <th className="py-2.5 px-3">Split</th>
                  <th className="py-2.5 px-3">Total Time</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {analyzedLaps.map(lap => (
                  <tr 
                    key={lap.lapNumber}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      lap.isFastest ? 'bg-emerald-950/20' : lap.isSlowest ? 'bg-red-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-white">
                      #{lap.lapNumber.toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-200">
                      {timerService.formatMs(lap.lapDurationMs)}
                    </td>
                    <td className="py-3 px-3 text-gray-400">
                      {timerService.formatMs(lap.totalElapsedMs)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {lap.isFastest && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Fastest
                        </span>
                      )}
                      {lap.isSlowest && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                          Slowest
                        </span>
                      )}
                      {!lap.isFastest && !lap.isSlowest && lap.deltaMs !== 0 && (
                        <span className={`text-[10px] ${lap.deltaMs! < 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                          {lap.deltaMs! < 0 ? '-' : '+'}{timerService.formatMs(Math.abs(lap.deltaMs!))}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
