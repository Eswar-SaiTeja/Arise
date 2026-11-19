import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Sparkles, 
  Flame, 
  Zap, 
  Layers,
  Settings,
  ChevronRight
} from 'lucide-react';
import { timerService, DEFAULT_INTERVAL_PRESETS } from '../../services/timerService';
import { audioService } from '../../services/audioService';
import { IntervalConfig, IntervalPhase, IntervalState } from '../../types/timer';
import { useBrand } from '../../context/BrandContext';

export const IntervalTab: React.FC = () => {
  const { currentTheme } = useBrand();

  const [config, setConfig] = useState<IntervalConfig>({
    prepSeconds: 5,
    workSeconds: 20,
    restSeconds: 10,
    totalRounds: 8,
    cooldownSeconds: 30
  });

  const [state, setState] = useState<IntervalState>({
    currentRound: 1,
    totalRounds: 8,
    phase: 'idle',
    phaseSecondsRemaining: 5,
    totalSecondsElapsed: 0,
    isRunning: false,
    isPaused: false
  });

  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Sync with global floating HUD
  useEffect(() => {
    if (state.isRunning) {
      timerService.updateFloatingHUD({
        type: 'interval',
        title: `HIIT ${state.phase.toUpperCase()} (R${state.currentRound}/${state.totalRounds})`,
        formattedTime: timerService.formatSeconds(state.phaseSecondsRemaining),
        isRunning: !state.isPaused,
        progressPercent: state.totalRounds > 0 ? Math.round((state.currentRound / state.totalRounds) * 100) : 0
      });
    }
  }, [state.isRunning, state.isPaused, state.phase, state.phaseSecondsRemaining, state.currentRound, state.totalRounds]);

  // Main Interval Engine Loop
  useEffect(() => {
    if (state.isRunning && !state.isPaused && state.phase !== 'complete') {
      timerService.requestWakeLock().then(lock => {
        wakeLockRef.current = lock;
      });

      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          if (prev.phaseSecondsRemaining <= 1) {
            // Transition to next phase
            return transitionPhase(prev);
          }

          if (prev.phaseSecondsRemaining <= 4 && prev.phaseSecondsRemaining > 1) {
            audioService.playCountdownTick();
            timerService.triggerHaptic('countdown');
          }

          return {
            ...prev,
            phaseSecondsRemaining: prev.phaseSecondsRemaining - 1,
            totalSecondsElapsed: prev.totalSecondsElapsed + 1
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wakeLockRef.current) {
        try { wakeLockRef.current.release(); } catch {}
        wakeLockRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wakeLockRef.current) {
        try { wakeLockRef.current.release(); } catch {}
      }
    };
  }, [state.isRunning, state.isPaused, state.phase]);

  const transitionPhase = (prev: IntervalState): IntervalState => {
    if (prev.phase === 'prep') {
      audioService.playIntervalWork();
      timerService.triggerHaptic('finish');
      return {
        ...prev,
        phase: 'work',
        phaseSecondsRemaining: config.workSeconds
      };
    }

    if (prev.phase === 'work') {
      if (prev.currentRound >= prev.totalRounds) {
        // Workout complete!
        audioService.playWorkoutComplete();
        timerService.triggerHaptic('finish');
        return {
          ...prev,
          phase: 'complete',
          phaseSecondsRemaining: 0,
          isRunning: false
        };
      }

      audioService.playIntervalRest();
      timerService.triggerHaptic('lap');
      return {
        ...prev,
        phase: 'rest',
        phaseSecondsRemaining: config.restSeconds
      };
    }

    if (prev.phase === 'rest') {
      audioService.playIntervalWork();
      timerService.triggerHaptic('finish');
      return {
        ...prev,
        currentRound: prev.currentRound + 1,
        phase: 'work',
        phaseSecondsRemaining: config.workSeconds
      };
    }

    return prev;
  };

  const handleStart = () => {
    setState({
      currentRound: 1,
      totalRounds: config.totalRounds,
      phase: config.prepSeconds > 0 ? 'prep' : 'work',
      phaseSecondsRemaining: config.prepSeconds > 0 ? config.prepSeconds : config.workSeconds,
      totalSecondsElapsed: 0,
      isRunning: true,
      isPaused: false
    });
    audioService.playCountdownTick();
    timerService.triggerHaptic('tap');
  };

  const handlePause = () => {
    setState(prev => ({ ...prev, isPaused: true }));
    timerService.triggerHaptic('tap');
  };

  const handleResume = () => {
    setState(prev => ({ ...prev, isPaused: false }));
    timerService.triggerHaptic('tap');
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState({
      currentRound: 1,
      totalRounds: config.totalRounds,
      phase: 'idle',
      phaseSecondsRemaining: config.prepSeconds > 0 ? config.prepSeconds : config.workSeconds,
      totalSecondsElapsed: 0,
      isRunning: false,
      isPaused: false
    });
    timerService.triggerHaptic('tap');
    timerService.updateFloatingHUD({
      type: 'none',
      title: '',
      formattedTime: '00:00',
      isRunning: false,
      progressPercent: 0
    });
  };

  const handleSkipPhase = () => {
    setState(prev => transitionPhase({ ...prev, phaseSecondsRemaining: 1 }));
    timerService.triggerHaptic('tap');
  };

  const handleSelectTemplate = (template: typeof DEFAULT_INTERVAL_PRESETS[0]) => {
    setConfig(template.config);
    setState({
      currentRound: 1,
      totalRounds: template.config.totalRounds,
      phase: 'idle',
      phaseSecondsRemaining: template.config.prepSeconds,
      totalSecondsElapsed: 0,
      isRunning: false,
      isPaused: false
    });
  };

  // Phase color mapping
  const getPhaseStyles = () => {
    switch (state.phase) {
      case 'prep':
        return {
          title: 'PREPARE',
          sub: 'Get in position & focus',
          bg: 'from-cyan-950/80 via-[#0A1A24] to-[#071119]',
          border: 'border-cyan-500/50',
          textColor: 'text-cyan-400',
          badgeBg: 'bg-cyan-500/20 text-cyan-300'
        };
      case 'work':
        return {
          title: 'WORK INTERVAL',
          sub: 'Maximum effort & cadence',
          bg: 'from-emerald-950/80 via-[#0E2416] to-[#08140C]',
          border: 'border-emerald-400 shadow-emerald-500/20 shadow-2xl',
          textColor: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300'
        };
      case 'rest':
        return {
          title: 'REST & RECOVER',
          sub: 'Deep oxygenation & shakeout',
          bg: 'from-amber-950/80 via-[#24170E] to-[#140C08]',
          border: 'border-amber-400 shadow-amber-500/20 shadow-2xl',
          textColor: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300'
        };
      case 'complete':
        return {
          title: 'WORKOUT CRUSHED!',
          sub: 'Interval protocol completed with honor',
          bg: 'from-lime-950/80 via-[#182810] to-[#0A1408]',
          border: 'border-lime-400 shadow-lime-500/30 shadow-2xl',
          textColor: 'text-lime-400',
          badgeBg: 'bg-lime-500/20 text-lime-300'
        };
      default:
        return {
          title: 'HIIT PROTOCOL READY',
          sub: `${config.totalRounds} Rounds | ${config.workSeconds}s Work / ${config.restSeconds}s Rest`,
          bg: 'from-[#111622] to-[#0A0D14]',
          border: 'border-white/10',
          textColor: 'text-white',
          badgeBg: 'bg-white/10 text-gray-300'
        };
    }
  };

  const phaseStyle = getPhaseStyles();

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Dynamic Interval Arena Display */}
      <div className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${phaseStyle.bg} border-2 ${phaseStyle.border} transition-all duration-300`}>
        {/* Round Badge Indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider ${phaseStyle.badgeBg}`}>
            {state.phase === 'complete' ? 'COMPLETED' : `ROUND ${state.currentRound} OF ${state.totalRounds}`}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            Elapsed: {timerService.formatSeconds(state.totalSecondsElapsed)}
          </span>
        </div>

        {/* Phase Name */}
        <h2 className={`text-2xl sm:text-3xl font-black font-display tracking-wider uppercase ${phaseStyle.textColor}`}>
          {phaseStyle.title}
        </h2>
        <p className="text-xs text-gray-300 mt-0.5">
          {phaseStyle.sub}
        </p>

        {/* Giant Phase Countdown */}
        <div className="my-6">
          <span className={`text-6xl sm:text-8xl font-mono font-black tracking-tight ${phaseStyle.textColor}`}>
            {state.phase === 'complete' ? 'DONE' : timerService.formatSeconds(state.phaseSecondsRemaining)}
          </span>
        </div>

        {/* Round Progress Tracker Dots */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm mb-6">
          {Array.from({ length: state.totalRounds }, (_, i) => {
            const roundNum = i + 1;
            const isFinished = roundNum < state.currentRound || state.phase === 'complete';
            const isCurrent = roundNum === state.currentRound && state.phase !== 'complete';
            return (
              <div
                key={roundNum}
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold font-mono transition-all ${
                  isFinished
                    ? 'bg-lime-500 text-black'
                    : isCurrent
                    ? 'bg-white text-black ring-4 ring-white/20 scale-125 animate-pulse'
                    : 'bg-white/10 text-gray-500'
                }`}
              >
                {roundNum}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {!state.isRunning ? (
            <button
              onClick={handleStart}
              style={{
                backgroundColor: currentTheme.accentColor,
                boxShadow: `0 0 25px -4px ${currentTheme.glowColor}`
              }}
              className="px-8 py-3.5 rounded-2xl text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 touch-target"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{state.phase === 'complete' ? 'Restart' : 'Start Interval'}</span>
            </button>
          ) : (
            <>
              {state.isPaused ? (
                <button
                  onClick={handleResume}
                  className="px-6 py-3.5 rounded-2xl bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 touch-target"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 touch-target"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={handleSkipPhase}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors touch-target"
                title="Skip to next phase"
              >
                <FastForward className="w-4 h-4" />
                <span>Skip</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3.5 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors touch-target"
              >
                Reset
              </button>
            </>
          )}

          {!state.isRunning && (
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors touch-target"
            >
              <Settings className="w-4 h-4" />
              <span>Adjust</span>
            </button>
          )}
        </div>
      </div>

      {/* Interval Config Panel */}
      {showConfigDrawer && !state.isRunning && (
        <div className="p-5 rounded-3xl bg-[#10141F] border border-white/10 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Custom Interval Timers
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Work Time (s)</label>
              <input
                type="number"
                min="5"
                max="600"
                value={config.workSeconds}
                onChange={e => setConfig({ ...config, workSeconds: Math.max(5, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Rest Time (s)</label>
              <input
                type="number"
                min="5"
                max="300"
                value={config.restSeconds}
                onChange={e => setConfig({ ...config, restSeconds: Math.max(5, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Total Rounds</label>
              <input
                type="number"
                min="1"
                max="50"
                value={config.totalRounds}
                onChange={e => setConfig({ ...config, totalRounds: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Prep Time (s)</label>
              <input
                type="number"
                min="0"
                max="60"
                value={config.prepSeconds}
                onChange={e => setConfig({ ...config, prepSeconds: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Built-in HIIT Protocols */}
      <div className="p-5 rounded-3xl bg-[#10141F] border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Preset HIIT Protocols</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEFAULT_INTERVAL_PRESETS.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTemplate(tmpl)}
              className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                    {tmpl.config.totalRounds}R • {tmpl.config.workSeconds}s/{tmpl.config.restSeconds}s
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {tmpl.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
