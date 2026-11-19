import React, { useState, useEffect } from 'react';
import { Timer, Zap, Play, Pause, ChevronRight, X } from 'lucide-react';
import { timerService } from '../../services/timerService';
import { FloatingTimerHUDState } from '../../types/timer';
import { useWorkout } from '../../context/WorkoutContext';

interface FloatingMiniTimerProps {
  onOpenTimer: () => void;
  onOpenWorkout: () => void;
  currentTab: string;
}

export const FloatingMiniTimer: React.FC<FloatingMiniTimerProps> = ({
  onOpenTimer,
  onOpenWorkout,
  currentTab
}) => {
  const [hudState, setHudState] = useState<FloatingTimerHUDState>(() => timerService.getFloatingHUD());
  const { isRestActive, restSecondsRemaining } = useWorkout();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    return timerService.subscribeHUD(newHUD => {
      setHudState(newHUD);
      setIsDismissed(false);
    });
  }, []);

  // Check if workout rest is running while on other tabs
  const hasWorkoutRest = isRestActive && restSecondsRemaining > 0;
  const hasActiveTool = hudState.type !== 'none';

  // Don't show floating mini timer if the user is already on the timer tab
  if (currentTab === 'timer' && !hasWorkoutRest) return null;
  if (!hasWorkoutRest && !hasActiveTool) return null;
  if (isDismissed) return null;

  const handleClick = () => {
    if (hasWorkoutRest) {
      onOpenWorkout();
    } else {
      onOpenTimer();
    }
  };

  const displayTitle = hasWorkoutRest ? 'Rest Interval' : hudState.title;
  const displayTime = hasWorkoutRest ? `${restSecondsRemaining}s` : hudState.formattedTime;
  const isInterval = hudState.type === 'interval';

  return (
    <div className="fixed bottom-20 right-4 z-40 animate-in slide-in-from-bottom-3 duration-300">
      <div 
        onClick={handleClick}
        className="cursor-pointer group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#101622]/95 hover:bg-[#141C2B] border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-white transition-all transform hover:scale-105 active:scale-95"
      >
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            {isInterval ? (
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <Timer className="w-4 h-4 text-cyan-400 animate-pulse" />
            )}
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-lime-400 ring-2 ring-[#0A0D14] animate-ping" />
        </div>

        {/* Text and Time */}
        <div className="text-left">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold truncate max-w-[120px]">
            {displayTitle}
          </div>
          <div className="text-sm font-black font-mono tracking-tight text-white">
            {displayTime}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="p-1 text-gray-500 hover:text-white transition-colors"
          title="Minimize"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
