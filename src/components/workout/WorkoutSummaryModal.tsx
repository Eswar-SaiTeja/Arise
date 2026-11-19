import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Trophy, 
  Clock, 
  Dumbbell, 
  Flame, 
  Star, 
  CheckCircle2, 
  Share2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { WorkoutLogEntry } from '../../types';

interface WorkoutSummaryModalProps {
  summary: WorkoutLogEntry | null;
  onClose: () => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  summary,
  onClose,
}) => {
  if (!summary) return null;

  const [rating, setRating] = useState<number>(summary.rating || 5);
  const [notes, setNotes] = useState<string>(summary.notes || '');

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Estimated calories: approx 7.5 kcal per minute of high intensity resistance training
  const estCalories = Math.round((summary.durationSeconds / 60) * 7.5);

  if (!summary || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#141923] border border-lime-accent/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-3xl bg-lime-accent/5 pointer-events-none" />

        {/* Victory Icon Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-lime-accent to-emerald-400 flex items-center justify-center shadow-glow-lime">
          <Trophy className="w-10 h-10 text-black fill-black" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
            <Flame className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* Headline */}
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-lime-accent bg-lime-accent/10 px-3 py-1 rounded-full border border-lime-accent/30">
            SESSION COMPLETE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-2">
            Outstanding Performance!
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            {summary.title} has been logged to your athlete history.
          </p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#181E2B] border border-[#252D3E] rounded-2xl p-4">
          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Duration</div>
            <div className="text-base font-bold text-white font-display flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-lime-accent" />
              {formatDuration(summary.durationSeconds)}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Total Volume</div>
            <div className="text-base font-bold text-lime-accent font-display mt-0.5">
              {summary.totalVolumeKg.toLocaleString()} <span className="text-xs font-normal text-gray-400">kg</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Sets Done</div>
            <div className="text-base font-bold text-white font-display mt-0.5">
              {summary.totalSetsCompleted} <span className="text-xs font-normal text-gray-400">sets</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-gray-400 uppercase">Est. Burn</div>
            <div className="text-base font-bold text-orange-400 font-display mt-0.5">
              {estCalories} <span className="text-xs font-normal text-gray-400">kcal</span>
            </div>
          </div>
        </div>

        {/* Session Rating */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-400 uppercase">Rate Session Intensity & Quality</label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-gray-600 hover:text-amber-400 transition-colors"
              >
                <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Close & Continue */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-sm tracking-wide transition-all shadow-glow-lime flex items-center justify-center gap-2"
        >
          <span>CONTINUE TO DASHBOARD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};
