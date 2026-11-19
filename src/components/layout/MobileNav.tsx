import React from 'react';
import { 
  Home, 
  Dumbbell, 
  Swords, 
  TrendingUp, 
  Grid
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useWorkout } from '../../context/WorkoutContext';
import { useBrand } from '../../context/BrandContext';
import { hunterService, RANK_DEFINITIONS } from '../../services/hunterService';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenActiveWorkout: () => void;
  onOpenMore: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenActiveWorkout,
  onOpenMore,
}) => {
  const { isWorkoutActive } = useWorkout();
  const { currentTheme } = useBrand();
  const rankProgress = hunterService.getRankProgress();
  const rankDef = RANK_DEFINITIONS[rankProgress.currentRank];

  const isWorkoutsActive = currentTab === 'workouts' || currentTab === 'exercises' || currentTab === 'programs';
  const isMissionsActive = currentTab === 'rank' || currentTab === 'challenges';

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D14]/95 backdrop-blur-xl border-t border-[#1F2636] px-2 py-1.5 pb-safe flex items-center justify-around select-none">
      {/* 1. HOME */}
      <button
        onClick={() => onSelectTab('dashboard')}
        style={currentTab === 'dashboard' ? { color: currentTheme.accentColor } : undefined}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-target ${
          currentTab === 'dashboard' ? 'scale-105 font-bold' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Home</span>
      </button>

      {/* 2. WORKOUTS (Unified Plans + Exercise Library) */}
      <button
        onClick={() => {
          if (isWorkoutActive) {
            onOpenActiveWorkout();
          } else {
            onSelectTab('workouts');
          }
        }}
        style={isWorkoutsActive ? { color: currentTheme.accentColor } : undefined}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative touch-target ${
          isWorkoutsActive ? 'scale-105 font-bold' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <div className="relative">
          <Dumbbell className="w-5 h-5 mb-0.5" />
          {isWorkoutActive && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0A0D14] animate-ping" />
          )}
        </div>
        <span className="text-[10px] tracking-tight">
          {isWorkoutActive ? 'Active' : 'Workouts'}
        </span>
      </button>

      {/* 3. MISSIONS (Hunter Rank & Quests) */}
      <button
        onClick={() => onSelectTab('rank')}
        style={isMissionsActive ? { color: currentTheme.accentColor } : undefined}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative touch-target ${
          isMissionsActive ? 'scale-105 font-bold' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <div className="relative">
          <Swords className="w-5 h-5 mb-0.5" />
          <span 
            className="absolute -top-1.5 -right-3 text-[8px] font-mono font-bold px-1 rounded shadow"
            style={{ backgroundColor: `${rankDef.color}30`, color: rankDef.color, borderColor: `${rankDef.color}50` }}
          >
            {rankProgress.currentRank}
          </span>
        </div>
        <span className="text-[10px] tracking-tight">Missions</span>
      </button>

      {/* 4. PROGRESS (Stats, PRs & Telemetry) */}
      <button
        onClick={() => onSelectTab('progress')}
        style={currentTab === 'progress' ? { color: currentTheme.accentColor } : undefined}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-target ${
          currentTab === 'progress' ? 'scale-105 font-bold' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <TrendingUp className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Progress</span>
      </button>

      {/* 5. MORE (Directory of all tools, manual, nutrition, BMI, timer, profile, settings) */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-400 hover:text-white transition-all touch-target"
      >
        <Grid className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight font-medium">More</span>
      </button>
    </nav>
  );
};
