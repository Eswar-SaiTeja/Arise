import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { TrainingEnvironment, DevelopmentLevel } from '../../types/environment';
import { environmentService } from '../../services/environmentService';
import { useBrand } from '../../context/BrandContext';
import { Check, Dumbbell, Home, Shield, Award, Sparkles, ChevronRight, X, Info } from 'lucide-react';

interface EnvironmentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnvironmentChanged?: (newEnv: TrainingEnvironment, newLevel: DevelopmentLevel) => void;
}

export const EnvironmentSelectorModal: React.FC<EnvironmentSelectorModalProps> = ({
  isOpen,
  onClose,
  onEnvironmentChanged
}) => {
  const { currentTheme } = useBrand();
  const currentProgress = environmentService.getProgress();
  
  const [selectedEnv, setSelectedEnv] = useState<TrainingEnvironment>(currentProgress.environment);
  const [selectedLevel, setSelectedLevel] = useState<DevelopmentLevel>(currentProgress.developmentLevel);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['bodyweight', 'sturdy_chair']);

  if (!isOpen) return null;

  const homeDef = environmentService.getEnvironmentDefinition('home');
  const gymDef = environmentService.getEnvironmentDefinition('gym');

  const activeDef = selectedEnv === 'home' ? homeDef : gymDef;
  const activeLevelDef = activeDef.levels[selectedLevel];

  const handleToggleEquipment = (eqId: string) => {
    setSelectedEquipment(prev => 
      prev.includes(eqId) ? prev.filter(id => id !== eqId) : [...prev, eqId]
    );
  };

  const handleConfirm = () => {
    environmentService.setEnvironment(selectedEnv);
    if (selectedLevel !== currentProgress.developmentLevel) {
      environmentService.setDevelopmentLevel(selectedLevel);
    }
    if (onEnvironmentChanged) {
      onEnvironmentChanged(selectedEnv, selectedLevel);
    }
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#111927] to-[#0A0E17] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 md:p-8 text-white space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-black tracking-widest uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              TRAINING ENVIRONMENT ARCHITECTURE
            </span>
            <span className="text-xs text-gray-400">
              Active Difficulty: <span className="font-bold text-amber-400 uppercase">{currentTheme.name}</span>
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Select Training Environment
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Choose where you forge your strength. Switch anytime—your Hunter Rank, XP, streaks, and workout history are 100% preserved.
          </p>
        </div>

        {/* Primary Environment Cards: HOME MODE vs GYM MODE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HOME MODE CARD */}
          <div
            onClick={() => setSelectedEnv('home')}
            className={`cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-300 ${
              selectedEnv === 'home'
                ? 'border-cyan-400 bg-gradient-to-br from-cyan-950/60 via-[#0B1A24] to-[#070D14] shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                : 'border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-white/[0.04]'
            }`}
          >
            {selectedEnv === 'home' && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-black flex items-center gap-1 shadow">
                <Check className="w-3 h-3 stroke-[3]" /> Selected
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-wider text-white">HOME MODE</h3>
                <p className="text-xs text-cyan-400/90 font-medium">Bodyweight Mastery & Calisthenics</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Zero mandatory gym gear. Engineered for living rooms, floors, and doorway anchors using gravity, leverage, and bodyweight progressions.
            </p>
            <div className="space-y-1.5 border-t border-white/10 pt-3">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Includes 3 Body Tiers:</div>
              <div className="flex flex-wrap gap-1.5 text-xs text-cyan-200">
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-[11px]">Basic</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-[11px]">Beginner</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-[11px]">Advanced Calisthenics</span>
              </div>
            </div>
          </div>

          {/* GYM MODE CARD */}
          <div
            onClick={() => setSelectedEnv('gym')}
            className={`cursor-pointer relative p-5 rounded-xl border-2 transition-all duration-300 ${
              selectedEnv === 'gym'
                ? 'border-emerald-400 bg-gradient-to-br from-emerald-950/60 via-[#102417] to-[#0A140E] shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                : 'border-white/10 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-white/[0.04]'
            }`}
          >
            {selectedEnv === 'gym' && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-black flex items-center gap-1 shadow">
                <Check className="w-3 h-3 stroke-[3]" /> Selected
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-wider text-white">GYM MODE</h3>
                <p className="text-xs text-emerald-400/90 font-medium">Iron, Machines & Free Weights</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Full commercial facility access. Utilizes Olympic barbells, selectorized machines, dual cable columns, dumbbells, and periodized tonnage.
            </p>
            <div className="space-y-1.5 border-t border-white/10 pt-3">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Includes 3 Body Tiers:</div>
              <div className="flex flex-wrap gap-1.5 text-xs text-emerald-200">
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-[11px]">Guided Machines</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-[11px]">Barbell PPL</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-[11px]">Heavy Compound Power</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Level Selection */}
        <div className="space-y-3 bg-white/[0.03] border border-white/10 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black tracking-wider uppercase text-gray-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Development Category in {selectedEnv.toUpperCase()} MODE:
            </h4>
            <span className="text-xs text-gray-400">
              Workouts required for next tier: <span className="font-bold text-white">{activeLevelDef.workoutsRequiredForPromotion}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['basic', 'beginner', 'advanced'] as DevelopmentLevel[]).map((level) => {
              const def = activeDef.levels[level];
              const isSelected = selectedLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    isSelected
                      ? selectedEnv === 'home'
                        ? 'border-cyan-400 bg-cyan-950/50 shadow-md ring-1 ring-cyan-400/40'
                        : 'border-emerald-400 bg-emerald-950/50 shadow-md ring-1 ring-emerald-400/40'
                      : 'border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      {def.name}
                    </span>
                    {isSelected && (
                      <span className={`w-2 h-2 rounded-full ${selectedEnv === 'home' ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mb-2">{def.subtitle}</p>
                  <div className="text-[10px] text-gray-500">
                    Target: {def.targetAudience.slice(0, 48)}...
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Level Details & Key Movements */}
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Core Movement Focus:
              </span>
              <ul className="space-y-1 text-gray-300">
                {activeLevelDef.focus.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Benchmark Criteria for Promotion:
              </span>
              <ul className="space-y-1 text-gray-300">
                {activeLevelDef.benchmarkRequirements.map((b, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="font-medium text-white">{b.testExercise}:</span>
                    <span className="text-gray-400">{b.targetBenchmark}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Equipment Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Available Gear Checklist ({selectedEnv.toUpperCase()}):
            </span>
            <span className="text-[11px] text-gray-500">Substitutions automatically engage if items are unchecked</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeDef.equipmentOptions.map(eq => {
              const isChecked = selectedEquipment.includes(eq.id);
              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => handleToggleEquipment(eq.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                    isChecked
                      ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-200'
                      : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isChecked ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-gray-500'}`}>
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  {eq.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Mode Synergy Callout */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <span className="font-bold text-white uppercase tracking-wider">{currentTheme.name} Synergy: </span>
            Volume, sets, reps, and RPE are automatically scaled based on your active difficulty mode ({currentTheme.name}), while the exercise library adapts to your chosen training environment ({selectedEnv.toUpperCase()} MODE).
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Confirm & Activate {selectedEnv.toUpperCase()} MODE
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
