import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Clock, 
  Zap, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Play, 
  Activity,
  Heart
} from 'lucide-react';
import { DailyMission } from '../../types/hunter';
import { hunterService } from '../../services/hunterService';

interface DailyMissionsCardProps {
  onMissionCompleted?: (result: any) => void;
  onStartWorkoutCTA?: () => void;
  compact?: boolean;
}

export const DailyMissionsCard: React.FC<DailyMissionsCardProps> = ({
  onMissionCompleted,
  onStartWorkoutCTA,
  compact = false,
}) => {
  const [missions, setMissions] = useState<DailyMission[]>(() => hunterService.getDailyMissions());
  const [countdown, setCountdown] = useState(() => hunterService.getTimeUntilDailyDeadline());

  // Countdown timer to midnight
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(hunterService.getTimeUntilDailyDeadline());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleComplete = (mission: DailyMission) => {
    if (mission.isCompleted) return;
    const result = hunterService.completeMission(mission.id);
    setMissions(hunterService.getDailyMissions());
    if (onMissionCompleted) {
      onMissionCompleted(result);
    }
  };

  const completedCount = missions.filter(m => m.isCompleted).length;
  const totalCount = missions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allRequiredDone = missions.filter(m => !m.isRecovery).every(m => m.isCompleted);

  return (
    <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-5 sm:p-6 space-y-5 relative overflow-hidden">
      {/* Top Banner / Deadline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#252D3E]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-lime-accent/15 border border-lime-accent/30 text-lime-accent flex items-center justify-center font-black">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-white text-base">
                Daily Hunter Directives
              </h3>
              {allRequiredDone && (
                <span className="text-[10px] font-mono font-bold bg-lime-accent/20 text-lime-accent border border-lime-accent/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Streak Protected</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-mono">
              {completedCount} of {totalCount} completed • Protect your active streak
            </p>
          </div>
        </div>

        {/* Countdown Badge */}
        <div className="flex items-center gap-2 bg-[#181E2B] border border-[#252D3E] px-3.5 py-1.5 rounded-xl font-mono text-xs">
          <Clock className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span className="text-gray-400">Deadline:</span>
          <span className="text-orange-400 font-bold">{countdown.formatted}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">DAILY DIRECTIVE PROGRESS</span>
          <span className="text-lime-accent font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#0E121A] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-lime-accent to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-2.5">
        {missions.map(mission => (
          <div
            key={mission.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              mission.isCompleted
                ? 'bg-lime-950/20 border-lime-accent/30'
                : 'bg-[#181E2B] border-[#252D3E] hover:border-white/20'
            }`}
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                  mission.isRecovery 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-white/5 text-gray-300 border-white/10'
                }`}>
                  {mission.difficulty}
                </span>

                {mission.isRecovery && (
                  <span className="text-[10px] font-mono uppercase text-blue-400 flex items-center gap-1 font-semibold">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>Recovery Day</span>
                  </span>
                )}

                <h4 className={`text-sm font-bold truncate ${mission.isCompleted ? 'text-gray-300 line-through' : 'text-white'}`}>
                  {mission.title}
                </h4>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed line-clamp-1">
                {mission.description}
              </p>

              <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400 pt-0.5">
                <span className="text-lime-accent font-bold">+{mission.xpReward} XP</span>
                <span>•</span>
                <span>~{mission.estimatedDurationMin} mins</span>
              </div>
            </div>

            {/* Checkbox / Claim Action */}
            <button
              onClick={() => handleToggleComplete(mission)}
              disabled={mission.isCompleted}
              className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                mission.isCompleted
                  ? 'bg-lime-accent/10 border border-lime-accent/30 text-lime-accent cursor-default'
                  : 'bg-lime-accent hover:bg-lime-400 text-black shadow-glow-lime hover:scale-105'
              }`}
            >
              {mission.isCompleted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>DONE</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>CLAIM XP</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
