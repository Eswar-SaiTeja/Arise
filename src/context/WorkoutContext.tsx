import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ActiveWorkoutSession, 
  WorkoutDayPlan, 
  Exercise, 
  WorkoutLogEntry, 
  LoggedSet, 
  ActiveExerciseSession 
} from '../types';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { hunterService } from '../services/hunterService';

interface WorkoutContextType {
  activeSession: ActiveWorkoutSession | null;
  isWorkoutActive: boolean;
  restSecondsRemaining: number;
  restTotalDuration: number;
  isRestActive: boolean;
  completedWorkoutSummary: WorkoutLogEntry | null;
  startWorkoutFromDay: (dayPlan: WorkoutDayPlan, programTitle?: string) => void;
  startQuickExercise: (exercise: Exercise) => void;
  updateSet: (exerciseIndex: number, setIndex: number, updates: Partial<LoggedSet>) => void;
  toggleSetComplete: (exerciseIndex: number, setIndex: number) => void;
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  startRestTimer: (seconds: number) => void;
  addRestSeconds: (seconds: number) => void;
  skipRestTimer: () => void;
  swapExercise: (exerciseIndex: number, newExercise: Exercise) => void;
  setCurrentExerciseIndex: (index: number) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  finishWorkout: (rating?: number, notes?: string) => void;
  discardWorkout: () => void;
  dismissSummaryModal: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(() => storageService.getActiveWorkout());
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(0);
  const [restTotalDuration, setRestTotalDuration] = useState<number>(60);
  const [isRestActive, setIsRestActive] = useState<boolean>(false);
  const [completedWorkoutSummary, setCompletedWorkoutSummary] = useState<WorkoutLogEntry | null>(null);

  const workoutTimerRef = useRef<number | null>(null);
  const restTimerRef = useRef<number | null>(null);

  // Auto-save active workout to storage whenever session changes
  useEffect(() => {
    if (activeSession) {
      storageService.saveActiveWorkout(activeSession);
    } else {
      storageService.clearActiveWorkout();
    }
  }, [activeSession]);

  // Main workout elapsed timer
  useEffect(() => {
    if (activeSession && !activeSession.isPaused && !activeSession.isCompleted) {
      workoutTimerRef.current = window.setInterval(() => {
        setActiveSession(prev => {
          if (!prev || prev.isPaused) return prev;
          return { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 };
        });
      }, 1000);
    } else {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    }

    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    };
  }, [activeSession?.isPaused, !!activeSession]);

  // Rest timer countdown
  useEffect(() => {
    if (isRestActive && restSecondsRemaining > 0) {
      restTimerRef.current = window.setInterval(() => {
        setRestSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsRestActive(false);
            audioService.playRestFinished();
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate([100, 50, 100]); } catch {}
            }
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            audioService.playCountdownTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isRestActive, restSecondsRemaining]);

  const startWorkoutFromDay = (dayPlan: WorkoutDayPlan, programTitle: string = 'Custom Protocol') => {
    const allExercises = storageService.getExercises();
    const activeExercises: ActiveExerciseSession[] = dayPlan.exercises.map(item => {
      const ex = allExercises.find(e => e.id === item.exerciseId) || allExercises[0];
      const targetRepsNum = parseInt(item.targetReps.split('-')[0]) || 10;
      
      const sets: LoggedSet[] = Array.from({ length: item.sets }, (_, i) => ({
        setNumber: i + 1,
        weightKg: item.targetWeightKg || 0,
        targetReps: targetRepsNum,
        completedReps: targetRepsNum,
        isCompleted: false,
      }));

      return {
        exerciseId: ex.id,
        exercise: ex,
        sets,
        notes: item.notes,
      };
    });

    const newSession: ActiveWorkoutSession = {
      id: 'session-' + Date.now(),
      dayId: dayPlan.id,
      title: dayPlan.title,
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      currentExerciseIndex: 0,
      exercises: activeExercises,
      isPaused: false,
      isCompleted: false,
    };

    setActiveSession(newSession);
    storageService.saveActiveWorkout(newSession);
  };

  const startQuickExercise = (exercise: Exercise) => {
    const sets: LoggedSet[] = Array.from({ length: exercise.recommendedSets || 3 }, (_, i) => ({
      setNumber: i + 1,
      weightKg: 20,
      targetReps: 10,
      completedReps: 10,
      isCompleted: false,
    }));

    const newSession: ActiveWorkoutSession = {
      id: 'session-' + Date.now(),
      title: `${exercise.name} Training`,
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      currentExerciseIndex: 0,
      exercises: [
        {
          exerciseId: exercise.id,
          exercise,
          sets,
        }
      ],
      isPaused: false,
      isCompleted: false,
    };

    setActiveSession(newSession);
    storageService.saveActiveWorkout(newSession);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, updates: Partial<LoggedSet>) => {
    if (!activeSession) return;
    const exercisesCopy = [...activeSession.exercises];
    const targetEx = exercisesCopy[exerciseIndex];
    if (!targetEx) return;

    targetEx.sets[setIndex] = { ...targetEx.sets[setIndex], ...updates };
    setActiveSession({ ...activeSession, exercises: exercisesCopy });
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    if (!activeSession) return;
    const exercisesCopy = [...activeSession.exercises];
    const targetEx = exercisesCopy[exerciseIndex];
    if (!targetEx) return;

    const currentSet = targetEx.sets[setIndex];
    const nextCompleted = !currentSet.isCompleted;
    targetEx.sets[setIndex] = { ...currentSet, isCompleted: nextCompleted };

    setActiveSession({ ...activeSession, exercises: exercisesCopy });

    if (nextCompleted) {
      audioService.playSetCompleted();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(50); } catch {}
      }
      const restSec = targetEx.exercise.restDurationSec || 60;
      startRestTimer(restSec);

      // Check if user set a personal record with this set
      if (currentSet.weightKg > 0) {
        storageService.updatePersonalRecord({
          id: 'pr-' + Date.now(),
          exerciseId: targetEx.exerciseId,
          exerciseName: targetEx.exercise.name,
          recordType: '1rm',
          value: currentSet.weightKg,
          unit: 'kg',
          achievedAt: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const addSet = (exerciseIndex: number) => {
    if (!activeSession) return;
    const exercisesCopy = [...activeSession.exercises];
    const targetEx = exercisesCopy[exerciseIndex];
    if (!targetEx) return;

    const prevSet = targetEx.sets[targetEx.sets.length - 1];
    targetEx.sets.push({
      setNumber: targetEx.sets.length + 1,
      weightKg: prevSet ? prevSet.weightKg : 20,
      targetReps: prevSet ? prevSet.targetReps : 10,
      completedReps: prevSet ? prevSet.completedReps : 10,
      isCompleted: false,
    });

    setActiveSession({ ...activeSession, exercises: exercisesCopy });
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    if (!activeSession) return;
    const exercisesCopy = [...activeSession.exercises];
    const targetEx = exercisesCopy[exerciseIndex];
    if (!targetEx || targetEx.sets.length <= 1) return;

    targetEx.sets.splice(setIndex, 1);
    targetEx.sets.forEach((s, idx) => { s.setNumber = idx + 1; });
    setActiveSession({ ...activeSession, exercises: exercisesCopy });
  };

  const startRestTimer = (seconds: number) => {
    setRestTotalDuration(seconds);
    setRestSecondsRemaining(seconds);
    setIsRestActive(true);
  };

  const addRestSeconds = (seconds: number) => {
    setRestSecondsRemaining(prev => Math.max(0, prev + seconds));
    setRestTotalDuration(prev => Math.max(prev, prev + seconds));
  };

  const skipRestTimer = () => {
    setIsRestActive(false);
    setRestSecondsRemaining(0);
  };

  const swapExercise = (exerciseIndex: number, newExercise: Exercise) => {
    if (!activeSession) return;
    const exercisesCopy = [...activeSession.exercises];
    const targetEx = exercisesCopy[exerciseIndex];
    if (!targetEx) return;

    const newSets: LoggedSet[] = targetEx.sets.map((s, idx) => ({
      setNumber: idx + 1,
      weightKg: s.weightKg,
      targetReps: parseInt(newExercise.recommendedReps) || 10,
      completedReps: s.completedReps || parseInt(newExercise.recommendedReps) || 10,
      isCompleted: s.isCompleted
    }));

    exercisesCopy[exerciseIndex] = {
      exerciseId: newExercise.id,
      exercise: newExercise,
      sets: newSets,
      notes: `Substituted from ${targetEx.exercise.name}`
    };

    setActiveSession({ ...activeSession, exercises: exercisesCopy });
  };

  const setCurrentExerciseIndex = (index: number) => {
    if (!activeSession) return;
    if (index >= 0 && index < activeSession.exercises.length) {
      setActiveSession({ ...activeSession, currentExerciseIndex: index });
    }
  };

  const pauseWorkout = () => {
    if (!activeSession) return;
    setActiveSession({ ...activeSession, isPaused: true });
  };

  const resumeWorkout = () => {
    if (!activeSession) return;
    setActiveSession({ ...activeSession, isPaused: false });
  };

  const finishWorkout = (rating: number = 5, notes: string = '') => {
    if (!activeSession) return;

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;

    const logExercises = activeSession.exercises.map(ex => {
      const completedSets = ex.sets.filter(s => s.isCompleted);
      completedSets.forEach(s => {
        totalVolume += (s.weightKg * s.completedReps);
        totalSets += 1;
        totalReps += s.completedReps;
      });

      return {
        exerciseName: ex.exercise.name,
        targetMuscle: ex.exercise.targetMuscle,
        sets: completedSets.map(s => ({
          setNumber: s.setNumber,
          weightKg: s.weightKg,
          completedReps: s.completedReps
        }))
      };
    });

    const summaryEntry: WorkoutLogEntry = {
      id: 'log-' + Date.now(),
      title: activeSession.title,
      programTitle: activeSession.programId ? 'Periodized Training Protocol' : 'Athletic Architecture',
      completedAt: new Date().toISOString(),
      durationSeconds: activeSession.elapsedSeconds,
      totalVolumeKg: Math.round(totalVolume),
      totalSetsCompleted: totalSets,
      totalRepsCompleted: totalReps,
      rating,
      notes,
      exercises: logExercises,
    };

    // Save to storage
    storageService.logWorkout(summaryEntry);
    storageService.clearActiveWorkout();

    // AWARD HUNTER XP (+100 XP base + volume bonus XP)
    const volumeBonusXP = Math.min(50, Math.floor(totalVolume / 250));
    hunterService.awardXP(
      100 + volumeBonusXP, 
      'workout', 
      `Completed Session: ${activeSession.title} (+${Math.round(totalVolume)}kg volume)`
    );

    // Trigger visual confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F050', '#FFFFFF', '#FF5E1E', '#06B6D4']
      });
    } catch {}

    audioService.playWorkoutComplete();

    storageService.unlockAchievement('ach-first-workout');
    if (totalVolume >= 10000) {
      storageService.unlockAchievement('ach-tonnage-10k');
    }

    setCompletedWorkoutSummary(summaryEntry);
    setActiveSession(null);
  };

  const discardWorkout = () => {
    if (window.confirm('Are you sure you want to discard this workout? Current session data will be lost.')) {
      storageService.clearActiveWorkout();
      setActiveSession(null);
      setIsRestActive(false);
      setRestSecondsRemaining(0);
    }
  };

  const dismissSummaryModal = () => {
    setCompletedWorkoutSummary(null);
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeSession,
        isWorkoutActive: !!activeSession,
        restSecondsRemaining,
        restTotalDuration,
        isRestActive,
        completedWorkoutSummary,
        startWorkoutFromDay,
        startQuickExercise,
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
        dismissSummaryModal,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
