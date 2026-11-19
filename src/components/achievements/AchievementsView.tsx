import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Flame, 
  Zap, 
  Dumbbell, 
  Shield, 
  BookOpen, 
  Feather, 
  Sun, 
  TrendingUp, 
  Activity, 
  Crown,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Achievement } from '../../types';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Trophy,
  Flame,
  Zap,
  Award,
  Dumbbell,
  Shield,
  BookOpen,
  Feather,
  Sun,
  TrendingUp,
  Activity,
  Crown
};

export const AchievementsView: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'streak', label: 'Streak' },
    { id: 'volume', label: 'Volume' },
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'mastery', label: 'Mastery' },
  ];

  const filtered = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const totalPoints = achievements
    .filter(a => a.isUnlocked)
    .reduce((acc, curr) => acc + curr.points, 0);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141A28] to-[#0E121A] border border-[#252D3E] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-mono text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>HONORS & MILESTONES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Athlete Achievement Badges
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Unlock distinct commendations across consistency, total tonnage lifted, manual literacy, and personal records.
            </p>
          </div>

          {/* Points Card */}
          <div className="bg-[#181E2B] border border-[#252D3E] rounded-2xl p-5 min-w-[200px] text-center">
            <div className="text-xs font-mono text-gray-400 uppercase">Total Athlete Score</div>
            <div className="text-3xl font-black text-lime-accent font-display mt-1">
              {totalPoints} <span className="text-sm font-normal text-gray-400">PTS</span>
            </div>
            <div className="text-xs font-mono text-gray-400 mt-1">
              {unlockedCount} of {achievements.length} Unlocked
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? 'bg-lime-accent text-black border-lime-accent font-bold shadow-sm'
                : 'bg-[#141923] text-gray-400 border-[#252D3E] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(ach => {
          const IconComp = ICON_MAP[ach.icon] || Award;
          const isUnlocked = ach.isUnlocked;

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isUnlocked
                  ? 'bg-[#141923] border-lime-accent/40 shadow-glow-lime/10'
                  : 'bg-[#10141E] border-[#252D3E] opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isUnlocked
                    ? 'bg-lime-accent/20 border-lime-accent text-lime-accent shadow-glow-lime'
                    : 'bg-[#181E2B] border-[#252D3E] text-gray-500'
                }`}>
                  <IconComp className="w-7 h-7" />
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-lime-accent bg-lime-accent/10 px-2.5 py-1 rounded-full border border-lime-accent/20">
                    +{ach.points} PTS
                  </span>
                  <div className="text-[10px] font-mono text-gray-500 mt-1 uppercase">
                    {ach.category}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-display">
                    {ach.title}
                  </h3>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-lime-accent shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress Bar / Unlocked At */}
              <div className="pt-4 mt-4 border-t border-[#252D3E]">
                {isUnlocked ? (
                  <div className="text-[11px] font-mono text-lime-accent flex items-center justify-between">
                    <span>STATUS: UNLOCKED</span>
                    <span className="text-gray-400">
                      {ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                      <span>PROGRESS</span>
                      <span>{ach.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#090B10] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-lime-accent/60 rounded-full transition-all duration-500"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
