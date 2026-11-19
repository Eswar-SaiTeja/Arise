import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Play, 
  Bookmark, 
  Wind, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Repeat, 
  Layers, 
  Dumbbell, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Exercise } from '../../types';
import { ExerciseAnimation } from '../common/ExerciseAnimation';
import { storageService } from '../../services/storageService';
import { useWorkout } from '../../context/WorkoutContext';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onStartExercise: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onStartExercise,
}) => {
  if (!exercise || typeof document === 'undefined') return null;

  const isBookmarked = storageService.isBookmarked('exercise', exercise.id);

  const toggleBookmark = () => {
    storageService.toggleBookmark('exercise', exercise.id);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#141923] border border-[#252D3E] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-[#252D3E] flex items-center justify-between bg-[#0E121A]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-semibold">
              {exercise.category}
            </span>
            <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
              {exercise.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
              title="Bookmark exercise"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Title & Muscle Anatomy Badges */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-2">
              {exercise.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-semibold text-lime-accent bg-lime-accent/10 px-3 py-1 rounded-lg border border-lime-accent/30">
                Primary: {exercise.targetMuscle}
              </span>
              {exercise.secondaryMuscles.map((sec, idx) => (
                <span key={idx} className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  Sec: {sec}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Animated Demonstration */}
          <div className="rounded-2xl overflow-hidden border border-[#252D3E]">
            <ExerciseAnimation type={exercise.animationType} targetMuscle={exercise.targetMuscle} className="h-60" />
          </div>

          {/* Key Prescription Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#181E2B] border border-[#252D3E] rounded-xl p-3 text-center">
              <Layers className="w-4 h-4 text-lime-accent mx-auto mb-1" />
              <div className="text-[10px] font-mono text-gray-400 uppercase">Recommended Sets</div>
              <div className="text-base font-bold text-white font-display">{exercise.recommendedSets} Sets</div>
            </div>

            <div className="bg-[#181E2B] border border-[#252D3E] rounded-xl p-3 text-center">
              <Repeat className="w-4 h-4 text-lime-accent mx-auto mb-1" />
              <div className="text-[10px] font-mono text-gray-400 uppercase">Target Reps</div>
              <div className="text-base font-bold text-white font-display">{exercise.recommendedReps}</div>
            </div>

            <div className="bg-[#181E2B] border border-[#252D3E] rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-lime-accent mx-auto mb-1" />
              <div className="text-[10px] font-mono text-gray-400 uppercase">Rest Interval</div>
              <div className="text-base font-bold text-white font-display">{exercise.restDurationSec}s</div>
            </div>

            <div className="bg-[#181E2B] border border-[#252D3E] rounded-xl p-3 text-center">
              <Dumbbell className="w-4 h-4 text-lime-accent mx-auto mb-1" />
              <div className="text-[10px] font-mono text-gray-400 uppercase">Equipment</div>
              <div className="text-sm font-bold text-white font-display truncate">{exercise.equipmentRequired}</div>
            </div>
          </div>

          {/* Starting Position */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              1. Setup & Starting Position
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed bg-[#181E2B] p-4 rounded-xl border border-[#252D3E]">
              {exercise.startingPosition}
            </p>
          </div>

          {/* Step-by-Step Execution */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              2. Step-by-Step Biomechanical Execution
            </h4>
            <div className="space-y-2">
              {exercise.stepByStepExecution.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#181E2B] border border-[#252D3E]">
                  <span className="w-5 h-5 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breathing Technique */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
            <Wind className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Breathing Cadence
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">{exercise.breathingTechnique}</p>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Common Execution Mistakes</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-200">
              {exercise.commonMistakes.map((m, idx) => (
                <li key={idx} className="leading-relaxed">{m}</li>
              ))}
            </ul>
          </div>

          {/* Safety Guidelines */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Joint & Spine Safety Guidelines</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-200">
              {exercise.safetyInstructions.map((s, idx) => (
                <li key={idx} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-[#252D3E] bg-[#0E121A] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#252D3E] text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onStartExercise(exercise);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-glow-lime hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>TRAIN THIS EXERCISE NOW</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
