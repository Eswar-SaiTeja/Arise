import React, { useState } from 'react';
import { TrainingEnvironment, DevelopmentLevel } from '../../types/environment';
import { environmentService } from '../../services/environmentService';
import { useBrand } from '../../context/BrandContext';
import { EnvironmentSelectorModal } from './EnvironmentSelectorModal';
import { 
  Home, 
  Dumbbell, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Circle, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp, 
  Repeat, 
  Sparkles,
  Zap
} from 'lucide-react';

interface EnvironmentProgressionCardProps {
  onUpdate?: () => void;
}

export const EnvironmentProgressionCard: React.FC<EnvironmentProgressionCardProps> = ({ onUpdate }) => {
  const { currentTheme } = useBrand();
  const [progress, setProgress] = useState(environmentService.getProgress());
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const envDef = environmentService.getEnvironmentDefinition(progress.environment);
  const currentLevelDef = envDef.levels[progress.developmentLevel];
  const isHome = progress.environment === 'home';

  const workoutsRequired = currentLevelDef?.workoutsRequiredForPromotion || 10;
  const progressPercent = Math.min(100, Math.round((progress.workoutsCompleted / workoutsRequired) * 100));
  const canAscend = environmentService.canPromote();

  const handleBenchmarkToggle = (exerciseName: string) => {
    environmentService.toggleBenchmark(exerciseName);
    const updated = environmentService.getProgress();
    setProgress(updated);
    if (onUpdate) onUpdate();
  };

  const handleAscend = () => {
    const result = environmentService.promoteToNextLevel();
    if (result.success) {
      setCelebrationMsg(result.message);
      setProgress(environmentService.getProgress());
      if (onUpdate) onUpdate();
      setTimeout(() => setCelebrationMsg(null), 6000);
    }
  };

  const handleEnvironmentChanged = (newEnv: TrainingEnvironment, newLevel: DevelopmentLevel) => {
    setProgress(environmentService.getProgress());
    if (onUpdate) onUpdate();
  };

  const substitutions = environmentService.getSubstitutions(progress.environment);

  return (
    <>
      <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 md:p-6 ${
        isHome
          ? 'border-cyan-500/30 bg-gradient-to-br from-[#0B1A24]/90 via-[#0A121A]/90 to-[#070D14] shadow-xl shadow-cyan-950/30'
          : 'border-emerald-500/30 bg-gradient-to-br from-[#102417]/90 via-[#0C1A12]/90 to-[#08100B] shadow-xl shadow-emerald-950/30'
      }`}>
        {/* Ambient background glow */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isHome ? 'bg-cyan-500' : 'bg-emerald-500'
        }`} />

        {/* Header Row: Badges & Environment Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border flex items-center justify-center ${
              isHome 
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' 
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }`}>
              {isHome ? <Home className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-black tracking-wide text-white uppercase">
                  {envDef.name}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                  isHome
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  {currentLevelDef.name}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Difficulty Synergy: <span className="font-bold text-amber-400 uppercase">{currentTheme.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSelectorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
            title="Switch between Home Mode and Gym Mode"
          >
            <Repeat className="w-3.5 h-3.5 text-cyan-400" />
            Switch Environment
          </button>
        </div>

        {/* Celebration Banner if Promoted */}
        {celebrationMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3 animate-pulse">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="font-bold">{celebrationMsg}</div>
          </div>
        )}

        {/* Progress Bar & Workout Count */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">
              Tier Progression ({currentLevelDef.name})
            </span>
            <span className="font-bold text-white">
              <span className={isHome ? 'text-cyan-400' : 'text-emerald-400'}>{progress.workoutsCompleted}</span> / {workoutsRequired} Workouts Completed
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-black/40 border border-white/10 p-0.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                isHome
                  ? 'bg-gradient-to-r from-cyan-600 via-cyan-400 to-sky-300'
                  : 'bg-gradient-to-r from-emerald-600 via-emerald-400 to-lime-300'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Key Movement Focus Chips */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Target Focus Patterns:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentLevelDef.keyMovements.slice(0, 6).map((move, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.04] border border-white/10 text-gray-300"
              >
                {move}
              </span>
            ))}
          </div>
        </div>

        {/* Benchmark Criteria Section */}
        <div className="space-y-2.5 bg-black/30 border border-white/10 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Promotion Benchmark Verifications
            </h4>
            <span className="text-[11px] text-gray-400">Tap to record verified benchmark</span>
          </div>

          <div className="space-y-2">
            {currentLevelDef.benchmarkRequirements.map((benchmark, idx) => {
              const isPassed = progress.benchmarksPassed.includes(benchmark.testExercise);
              return (
                <div
                  key={idx}
                  onClick={() => handleBenchmarkToggle(benchmark.testExercise)}
                  className={`cursor-pointer flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                    isPassed
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                      : 'border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-500 stroke-[1.5]" />
                    )}
                    <div>
                      <div className="text-xs font-bold">{benchmark.testExercise}</div>
                      <div className="text-[11px] text-gray-400">{benchmark.targetBenchmark}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-gray-500'
                  }`}>
                    {isPassed ? 'PASSED (+75 XP)' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Promotion Action Button */}
        {progress.developmentLevel !== 'advanced' && (
          <div className="mb-4">
            <button
              onClick={handleAscend}
              disabled={!canAscend}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                canAscend
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/30 transform hover:scale-[1.01] active:scale-95 animate-pulse'
                  : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4" />
              {canAscend 
                ? `Ascend to ${progress.developmentLevel === 'basic' ? 'Beginner' : 'Advanced'} Tier (+400 XP)`
                : `Complete Workouts & Benchmarks to Unlock Next Tier`}
            </button>
          </div>
        )}

        {/* Smart Equipment Substitutions Drawer Toggle */}
        <div className="border-t border-white/10 pt-3">
          <button
            onClick={() => setShowSubstitutions(!showSubstitutions)}
            className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span className="font-semibold flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-cyan-400" />
              Smart Equipment Substitutions ({substitutions.length} active)
            </span>
            {showSubstitutions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSubstitutions && (
            <div className="mt-3 space-y-2 text-xs animate-fade-in">
              {substitutions.map(sub => (
                <div key={sub.id} className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{sub.originalExerciseName}</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      ➔ {sub.substituteExerciseName}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">{sub.equipmentCondition}</div>
                  <div className="text-[10px] text-gray-500 italic">{sub.biomechanicalMatch}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selector Modal */}
      <EnvironmentSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onEnvironmentChanged={handleEnvironmentChanged}
      />
    </>
  );
};
