import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Clock, 
  X, 
  SkipForward, 
  RotateCcw, 
  Dumbbell, 
  Flame, 
  Award,
  Sparkles,
  Minimize2,
  Maximize2,
  Repeat,
  Heart,
  Wind,
  Droplets,
  Zap,
  Info
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { ExerciseAnimation } from '../common/ExerciseAnimation';
import { storageService } from '../../services/storageService';
import { Exercise } from '../../types';

interface ActiveWorkoutHUDProps {
  onMinimize: () => void;
}

const RECOVERY_TIPS = [
  { icon: Wind, title: 'Parasympathetic Reset', text: '4s nasal inhale, 4s chest hold, 6s slow pursed-lip exhale to down-regulate heart rate.' },
  { icon: Droplets, title: 'Hydration Intake', text: 'Sip 100-150ml cool water to maintain muscle cell voluminosity and electrolyte balance.' },
  { icon: Zap, title: 'Neuromuscular Shakeout', text: 'Oscillate working limbs loosely for 10 seconds to dissipate local venous congestion.' },
  { icon: Sparkles, title: 'Trajectory Focus', text: 'Mentally rehearse your bar path and full muscle contraction for the upcoming set.' }
];

export const ActiveWorkoutHUD: React.FC<ActiveWorkoutHUDProps> = ({ onMinimize }) => {
  const { profile } = useAuth();
  const {
    activeSession,
    restSecondsRemaining,
    restTotalDuration,
    isRestActive,
    updateSet,
    toggleSetComplete,
    addSet,
    removeSet,
    startRestTimer,
    addRestSeconds,
    skipRestTimer,
    swapExercise,
    setCurrentExerciseIndex,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    discardWorkout,
  } = useWorkout();

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapSearchQuery, setSwapSearchQuery] = useState('');

  if (!activeSession) return null;

  const currentIdx = activeSession.currentExerciseIndex;
  const currentItem = activeSession.exercises[currentIdx];
  const totalExercises = activeSession.exercises.length;

  // Calculate overall workout set completion percentage
  let totalSets = 0;
  let completedSets = 0;
  activeSession.exercises.forEach(ex => {
    ex.sets.forEach(s => {
      totalSets += 1;
      if (s.isCompleted) completedSets += 1;
    });
  });
  const completionPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // Active set index for Focus Mode (first uncompleted set or last set)
  const activeSetIdx = currentItem.sets.findIndex(s => !s.isCompleted);
  const currentWorkingSetIdx = activeSetIdx !== -1 ? activeSetIdx : currentItem.sets.length - 1;
  const currentWorkingSet = currentItem.sets[currentWorkingSetIdx];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Available alternatives for swapping (matching category or target muscle)
  const allExercises = storageService.getExercises();
  const candidateSwaps = allExercises.filter(ex => 
    ex.id !== currentItem.exercise.id && 
    (ex.category === currentItem.exercise.category || ex.targetMuscle.toLowerCase().includes(currentItem.exercise.targetMuscle.toLowerCase())) &&
    (swapSearchQuery ? ex.name.toLowerCase().includes(swapSearchQuery.toLowerCase()) : true)
  );

  const activeRecoveryTip = RECOVERY_TIPS[(restSecondsRemaining) % RECOVERY_TIPS.length];

  return (
    <div className="fixed inset-0 z-50 bg-[#090B10] flex flex-col text-gray-100 overflow-hidden font-sans">
      {/* Top HUD Control Bar */}
      <div className="bg-[#10141E] border-b border-[#252D3E] px-4 lg:px-8 py-3.5 flex items-center justify-between shrink-0">
        {/* Workout Info & Stopwatch */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMinimize}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
            title="Minimize to background HUD"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-accent animate-ping" />
              <h2 className="text-sm font-bold text-white font-display truncate max-w-[180px] sm:max-w-md">
                {activeSession.title}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mt-0.5">
              <span className="text-lime-accent font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(activeSession.elapsedSeconds)}
              </span>
              <span>•</span>
              <span>{completedSets} of {totalSets} sets done ({completionPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Top Controls: Focus Mode, Pause/Resume, Discard, Finish */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isFocusMode 
                ? 'bg-lime-accent/20 border-lime-accent text-lime-accent shadow-glow-lime' 
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
            title={isFocusMode ? 'Exit Distraction-Free Focus Mode' : 'Enter Distraction-Free Focus Mode'}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isFocusMode ? 'Standard HUD' : 'Focus Mode'}</span>
          </button>

          {activeSession.isPaused ? (
            <button
              onClick={resumeWorkout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Resume</span>
            </button>
          ) : (
            <button
              onClick={pauseWorkout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 font-mono text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 transition-all"
            >
              <Pause className="w-4 h-4" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          )}

          <button
            onClick={discardWorkout}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-mono text-xs hover:bg-red-500/20 transition-all"
            title="Discard Workout"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden md:inline ml-1.5">Discard</span>
          </button>

          <button
            onClick={() => finishWorkout(5, '')}
            className="px-4 py-2 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-glow-lime hover:scale-105"
          >
            <Award className="w-4 h-4" />
            <span>Finish</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-1 bg-[#181E2B] shrink-0">
        <div
          className="h-full bg-gradient-to-r from-lime-accent to-emerald-400 transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Rest Timer Banner (With Dynamic Recovery Science Suggestions) */}
      {isRestActive && (
        <div className="bg-gradient-to-r from-[#18281C] via-[#122016] to-[#0A140E] border-b border-lime-accent/40 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-lime-accent/20 border border-lime-accent flex items-center justify-center font-mono font-black text-lime-accent text-xl shadow-glow-lime animate-pulse">
              {restSecondsRemaining}s
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-lime-accent font-bold">
                  REST INTERVAL IN PROGRESS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-accent/10 text-lime-accent border border-lime-accent/30 font-semibold">
                  Haptic Feedback Active 📳
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-300 mt-0.5">
                {React.createElement(activeRecoveryTip.icon, { className: "w-3.5 h-3.5 text-lime-accent shrink-0" })}
                <span className="font-semibold text-white">{activeRecoveryTip.title}:</span>
                <span className="text-gray-300 text-[11px] truncate max-w-sm sm:max-w-md">{activeRecoveryTip.text}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => addRestSeconds(-15)}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-semibold text-white transition-colors"
              title="Subtract 15 seconds"
            >
              -15s
            </button>
            <button
              onClick={() => addRestSeconds(15)}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-semibold text-white transition-colors"
              title="Add 15 seconds"
            >
              +15s
            </button>
            <button
              onClick={() => addRestSeconds(30)}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-semibold text-white transition-colors"
              title="Add 30 seconds"
            >
              +30s
            </button>
            <button
              onClick={skipRestTimer}
              className="px-3 py-1.5 rounded-lg bg-lime-accent text-black text-xs font-bold font-mono hover:bg-lime-400 transition-colors flex items-center gap-1 shadow-glow-lime"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip Rest</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW CONDITIONAL: DISTRACTION-FREE FOCUS MODE vs STANDARD SPLIT HUD */}
      {isFocusMode ? (
        /* DISTRACTION-FREE FOCUS MODE HUD */
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#090B10] via-[#0E121A] to-[#090B10] overflow-y-auto">
          <div className="max-w-lg w-full space-y-6 text-center">
            {/* Top Navigation in Focus Mode */}
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <button
                onClick={() => setCurrentExerciseIndex(currentIdx - 1)}
                disabled={currentIdx === 0}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-20 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <span className="text-lime-accent uppercase font-bold tracking-widest text-[11px]">
                FOCUS EXECUTION • EXERCISE {currentIdx + 1}/{totalExercises}
              </span>
              <button
                onClick={() => setCurrentExerciseIndex(currentIdx + 1)}
                disabled={currentIdx >= totalExercises - 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-20 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Giant Exercise Name */}
            <div>
              <span className="px-3 py-1 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-mono text-xs font-bold uppercase tracking-wider">
                {currentItem.exercise.targetMuscle} • {currentItem.exercise.equipmentRequired}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-display mt-2">
                {currentItem.exercise.name}
              </h1>
            </div>

            {/* Set Progression Pills */}
            <div className="flex items-center justify-center gap-2">
              {currentItem.sets.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleSetComplete(currentIdx, idx)}
                  className={`w-10 h-10 rounded-xl font-mono text-xs font-bold border transition-all flex items-center justify-center ${
                    s.isCompleted
                      ? 'bg-lime-accent text-black border-lime-accent shadow-glow-lime'
                      : idx === currentWorkingSetIdx
                        ? 'bg-[#18281C] text-lime-accent border-lime-accent/80 ring-2 ring-lime-accent/40 scale-105'
                        : 'bg-[#141923] text-gray-400 border-[#252D3E]'
                  }`}
                >
                  {s.isCompleted ? <Check className="w-4 h-4" /> : s.setNumber}
                </button>
              ))}
              <button
                onClick={() => addSet(currentIdx)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-mono text-xs flex items-center justify-center transition-colors"
                title="Add Set"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Big Active Working Set Controls */}
            {currentWorkingSet && (
              <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-3 border-b border-[#252D3E]">
                  <span>CURRENT ACTIVE SET: #{currentWorkingSet.setNumber}</span>
                  <span className="text-lime-accent font-bold">
                    Target: {currentItem.exercise.recommendedReps} Reps
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Weight Control */}
                  <div className="bg-[#111622] border border-[#252D3E] rounded-2xl p-4 text-center space-y-2">
                    <span className="text-[11px] font-mono uppercase text-gray-400">
                      Weight ({profile.unitPreference === 'metric' ? 'kg' : 'lbs'})
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => updateSet(currentIdx, currentWorkingSetIdx, { weightKg: Math.max(0, currentWorkingSet.weightKg - 2.5) })}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-base transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={currentWorkingSet.weightKg === 0 ? '' : currentWorkingSet.weightKg}
                        onChange={(e) => updateSet(currentIdx, currentWorkingSetIdx, { weightKg: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-20 bg-transparent text-center font-mono font-black text-2xl text-white focus:outline-none"
                      />
                      <button
                        onClick={() => updateSet(currentIdx, currentWorkingSetIdx, { weightKg: currentWorkingSet.weightKg + 2.5 })}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-base transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Reps Control */}
                  <div className="bg-[#111622] border border-[#252D3E] rounded-2xl p-4 text-center space-y-2">
                    <span className="text-[11px] font-mono uppercase text-gray-400">
                      Reps Completed
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => updateSet(currentIdx, currentWorkingSetIdx, { completedReps: Math.max(0, currentWorkingSet.completedReps - 1) })}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-base transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={currentWorkingSet.completedReps || ''}
                        onChange={(e) => updateSet(currentIdx, currentWorkingSetIdx, { completedReps: parseInt(e.target.value) || 0 })}
                        placeholder="10"
                        className="w-16 bg-transparent text-center font-mono font-black text-2xl text-lime-accent focus:outline-none"
                      />
                      <button
                        onClick={() => updateSet(currentIdx, currentWorkingSetIdx, { completedReps: currentWorkingSet.completedReps + 1 })}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-base transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Big Action Complete Button */}
                <button
                  onClick={() => toggleSetComplete(currentIdx, currentWorkingSetIdx)}
                  className={`w-full py-4 rounded-2xl font-black font-display text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                    currentWorkingSet.isCompleted
                      ? 'bg-lime-accent text-black shadow-glow-lime'
                      : 'bg-gradient-to-r from-lime-accent to-emerald-400 hover:from-lime-400 hover:to-emerald-300 text-black shadow-glow-lime scale-102 hover:scale-105'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>{currentWorkingSet.isCompleted ? 'SET RECORDED (TAP TO UNLOG)' : `COMPLETE SET #${currentWorkingSet.setNumber}`}</span>
                </button>
              </div>
            )}

            {/* Quick Swap & Form Trigger */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowSwapModal(true)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Repeat className="w-4 h-4 text-lime-accent" />
                <span>Substitute Exercise</span>
              </button>
              <button
                onClick={() => setIsFocusMode(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-mono font-semibold transition-colors"
              >
                Return to Overview
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD SPLIT HUD */
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Current Exercise Biomechanics & Overview (5 cols) */}
            <div className="lg:col-span-5 bg-[#141923] border border-[#252D3E] rounded-3xl p-5 space-y-4">
              {/* Exercise Pagination / Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-[#252D3E]">
                <span className="text-xs font-mono text-lime-accent font-semibold uppercase tracking-wider">
                  EXERCISE {currentIdx + 1} OF {totalExercises}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentExerciseIndex(currentIdx - 1)}
                    disabled={currentIdx === 0}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    title="Previous Exercise"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentExerciseIndex(currentIdx + 1)}
                    disabled={currentIdx >= totalExercises - 1}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    title="Next Exercise"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Muscle Tags + Swap Action */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                    {currentItem.exercise.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-lime-accent bg-lime-accent/10 px-2.5 py-0.5 rounded border border-lime-accent/30 font-semibold">
                      {currentItem.exercise.targetMuscle}
                    </span>
                    <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {currentItem.exercise.equipmentRequired}
                    </span>
                  </div>
                </div>

                {/* Exercise Replacement / Swap Button */}
                <button
                  onClick={() => setShowSwapModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-lime-accent/10 border border-white/10 hover:border-lime-accent/40 text-gray-300 hover:text-lime-accent font-mono text-xs flex items-center gap-1.5 transition-all shrink-0"
                  title="Substitute exercise with equivalent biomechanical movement"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Swap</span>
                </button>
              </div>

              {/* Biomechanical Vector Animation */}
              <div className="rounded-2xl overflow-hidden border border-[#252D3E]">
                <ExerciseAnimation
                  type={currentItem.exercise.animationType}
                  targetMuscle={currentItem.exercise.targetMuscle}
                  className="h-48"
                />
              </div>

              {/* Quick Cues & Form Tip */}
              <div className="text-xs text-gray-300 bg-[#181E2B] p-3.5 rounded-xl border border-[#252D3E] space-y-1">
                <span className="font-mono font-bold text-lime-accent uppercase block flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Clinical Form Cue:
                </span>
                <p className="leading-relaxed">
                  {currentItem.exercise.stepByStepExecution[0] || currentItem.exercise.startingPosition}
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Set Tracking Table (7 cols) */}
            <div className="lg:col-span-7 bg-[#141923] border border-[#252D3E] rounded-3xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Active Set Performance</h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Target: {currentItem.exercise.recommendedReps} Reps • {currentItem.exercise.restDurationSec}s Rest
                  </p>
                </div>

                <button
                  onClick={() => addSet(currentIdx)}
                  className="px-3 py-1.5 rounded-xl bg-lime-accent/10 hover:bg-lime-accent/20 border border-lime-accent/30 text-lime-accent text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Set</span>
                </button>
              </div>

              {/* Set Table Header */}
              <div className="grid grid-cols-12 gap-2 text-[11px] font-mono text-gray-400 uppercase tracking-wider px-3 pb-1 border-b border-[#252D3E]">
                <div className="col-span-2 text-center">Set</div>
                <div className="col-span-4 text-center">Weight ({profile.unitPreference === 'metric' ? 'kg' : 'lbs'})</div>
                <div className="col-span-3 text-center">Reps</div>
                <div className="col-span-3 text-center">Status</div>
              </div>

              {/* Sets Rows */}
              <div className="space-y-2.5">
                {currentItem.sets.map((set, sIdx) => (
                  <div
                    key={sIdx}
                    className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border transition-all ${
                      set.isCompleted
                        ? 'bg-lime-950/20 border-lime-accent/40 shadow-sm'
                        : 'bg-[#181E2B] border-[#252D3E] hover:border-white/20'
                    }`}
                  >
                    {/* Set Number */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        set.isCompleted 
                          ? 'bg-lime-accent text-black font-black' 
                          : 'bg-[#11141E] text-gray-300 border border-white/10'
                      }`}>
                        {set.setNumber}
                      </span>
                    </div>

                    {/* Weight Input */}
                    <div className="col-span-4">
                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={set.weightKg === 0 ? '' : set.weightKg}
                          onChange={(e) => updateSet(currentIdx, sIdx, { weightKg: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-2 text-center font-mono font-bold text-white text-sm focus:outline-none focus:border-lime-accent transition-colors"
                        />
                      </div>
                    </div>

                    {/* Reps Input */}
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="1"
                        value={set.completedReps || ''}
                        onChange={(e) => updateSet(currentIdx, sIdx, { completedReps: parseInt(e.target.value) || 0 })}
                        placeholder="10"
                        className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-2 text-center font-mono font-bold text-white text-sm focus:outline-none focus:border-lime-accent transition-colors"
                      />
                    </div>

                    {/* Checkbox Complete Button */}
                    <div className="col-span-3 flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => toggleSetComplete(currentIdx, sIdx)}
                        className={`w-full py-2 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all ${
                          set.isCompleted
                            ? 'bg-lime-accent text-black shadow-glow-lime'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                        }`}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        <span>{set.isCompleted ? 'DONE' : 'LOG'}</span>
                      </button>

                      {currentItem.sets.length > 1 && (
                        <button
                          onClick={() => removeSet(currentIdx, sIdx)}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete Set"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation to Next / Previous Exercise */}
              <div className="pt-4 border-t border-[#252D3E] flex items-center justify-between">
                <button
                  onClick={() => setCurrentExerciseIndex(currentIdx - 1)}
                  disabled={currentIdx === 0}
                  className="px-4 py-2.5 rounded-xl border border-[#252D3E] text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev Exercise</span>
                </button>

                {currentIdx < totalExercises - 1 ? (
                  <button
                    onClick={() => setCurrentExerciseIndex(currentIdx + 1)}
                    className="px-5 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-lime"
                  >
                    <span>Next Exercise</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => finishWorkout(5, '')}
                    className="px-6 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-glow-lime hover:scale-105"
                  >
                    <Award className="w-4 h-4" />
                    <span>COMPLETE WORKOUT</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXERCISE REPLACEMENT / SWAP MODAL */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141923] border border-[#252D3E] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#252D3E] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-lime-accent" />
                  <span>Substitute Exercise</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Replace <span className="text-white font-bold">{currentItem.exercise.name}</span> with equivalent movement
                </p>
              </div>
              <button
                onClick={() => setShowSwapModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-[#252D3E] bg-[#10141E]">
              <input
                type="text"
                value={swapSearchQuery}
                onChange={(e) => setSwapSearchQuery(e.target.value)}
                placeholder="Search equivalent exercises or equipment..."
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent transition-colors"
              />
            </div>

            {/* Alternatives List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {candidateSwaps.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-gray-400">
                  No matching alternative exercises found. Try a different search term.
                </div>
              ) : (
                candidateSwaps.map(altEx => (
                  <div
                    key={altEx.id}
                    className="p-3.5 rounded-2xl bg-[#181E2B] border border-[#252D3E] hover:border-lime-accent/50 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-lime-accent transition-colors">
                        {altEx.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-gray-400">
                        <span className="text-lime-accent">{altEx.targetMuscle}</span>
                        <span>•</span>
                        <span>{altEx.equipmentRequired}</span>
                        <span>•</span>
                        <span>{altEx.difficulty}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        swapExercise(currentIdx, altEx);
                        setShowSwapModal(false);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-lime-accent/10 hover:bg-lime-accent text-lime-accent hover:text-black border border-lime-accent/30 font-mono text-xs font-bold transition-all shrink-0"
                    >
                      Substitute
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#252D3E] bg-[#10141E] flex items-center justify-between text-xs font-mono text-gray-400">
              <span>{candidateSwaps.length} alternative exercises available</span>
              <button
                onClick={() => setShowSwapModal(false)}
                className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
