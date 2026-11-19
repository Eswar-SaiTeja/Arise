import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Dumbbell, 
  CalendarRange, 
  Play, 
  TrendingUp, 
  Award, 
  User, 
  ShieldCheck, 
  Flame,
  Zap,
  Swords,
  Trophy,
  UtensilsCrossed,
  Timer,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../context/WorkoutContext';
import { useBrand } from '../../context/BrandContext';
import { hunterService, RANK_DEFINITIONS } from '../../services/hunterService';
import { RankEmblem } from '../hunter/RankEmblem';

export type NavTab = 
  | 'dashboard'
  | 'rank'
  | 'challenges'
  | 'nutrition'
  | 'manual'
  | 'exercises'
  | 'programs'
  | 'workouts'
  | 'progress'
  | 'achievements'
  | 'profile'
  | 'admin'
  | 'timer';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onStartTodayWorkout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onStartTodayWorkout,
  isCollapsed: controlledCollapsed,
  onToggleCollapse: controlledToggle
}) => {
  const { profile, isAdmin } = useAuth();
  const { isWorkoutActive } = useWorkout();
  const { currentTheme, experienceMode } = useBrand();
  const rankProgress = hunterService.getRankProgress();
  const rankDef = RANK_DEFINITIONS[rankProgress.currentRank];

  const [localCollapsed, setLocalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kinetix_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : localCollapsed;

  const toggleCollapsed = () => {
    if (controlledToggle) {
      controlledToggle();
    } else {
      setLocalCollapsed(prev => {
        const next = !prev;
        try {
          localStorage.setItem('kinetix_sidebar_collapsed', String(next));
        } catch {}
        return next;
      });
    }
  };

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'rank' as NavTab, 
      label: experienceMode === 'hunter' ? 'Hunter Rank' : 'Progression Rank', 
      icon: Swords, 
      badge: `${rankProgress.currentRank}·${rankProgress.currentLevel}`, 
      color: rankDef.color 
    },
    { id: 'challenges' as NavTab, label: 'Guild Trials', icon: Trophy, badge: 'NEW', color: '#F59E0B' },
    { id: 'nutrition' as NavTab, label: 'Diet & Nutrition', icon: UtensilsCrossed, badge: 'PRO', color: '#00F050' },
    { id: 'manual' as NavTab, label: 'Training Manual', icon: BookOpen },
    { id: 'exercises' as NavTab, label: 'Exercise Library', icon: Dumbbell },
    { id: 'programs' as NavTab, label: 'Workout Plans', icon: CalendarRange },
    { id: 'timer' as NavTab, label: 'Timer & Chrono', icon: Timer, badge: 'PRO', color: '#06B6D4' },
    { id: 'progress' as NavTab, label: 'Progress & Stats', icon: TrendingUp },
    { id: 'achievements' as NavTab, label: 'Achievements', icon: Award },
    { id: 'profile' as NavTab, label: 'Athlete Profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin' as NavTab, label: 'Admin Portal', icon: ShieldCheck, badge: 'SECURE', color: '#A855F7' });
  }

  return (
    <aside 
      className={`hidden lg:flex flex-col bg-[#0A0D14] border-r border-[#1F2636] select-none shrink-0 h-screen sticky top-0 justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-[74px] p-2' : 'w-64 p-4'
      }`}
    >
      {/* Top Section: Brand & Nav */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Brand Logo & Header */}
        <div className={`flex items-center gap-3 mb-5 ${isCollapsed ? 'justify-center py-2' : 'px-2 py-3'}`}>
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.accentColor}, ${currentTheme.secondaryAccent})`,
              boxShadow: `0 0 20px -3px ${currentTheme.glowColor}`
            }}
            onClick={() => onSelectTab('dashboard')}
            title={`${currentTheme.name} (${experienceMode.toUpperCase()})`}
          >
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-black tracking-wider text-white flex items-center gap-1 font-display truncate">
                {currentTheme.name}
                <span 
                  className="text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold"
                  style={{ 
                    color: currentTheme.accentColor, 
                    backgroundColor: `${currentTheme.accentColor}15`,
                    borderColor: `${currentTheme.accentColor}40`
                  }}
                >
                  {experienceMode.toUpperCase()}
                </span>
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono truncate">
                {currentTheme.tagline}
              </p>
            </div>
          )}
        </div>

        {/* Start / Resume Workout Action Button */}
        <div className="mb-4">
          <button
            onClick={onStartTodayWorkout}
            style={!isWorkoutActive ? {
              backgroundColor: currentTheme.accentColor,
              boxShadow: `0 0 20px -3px ${currentTheme.glowColor}`
            } : undefined}
            title={isWorkoutActive ? 'Resume Active Session' : 'Start Today\'s Workout'}
            className={`w-full rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isCollapsed ? 'h-11 p-0' : 'py-2.5 px-3'
            } ${
              isWorkoutActive 
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25 animate-pulse' 
                : 'text-black hover:scale-[1.02]'
            }`}
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            {!isCollapsed && (
              <span className="tracking-wide text-xs font-black truncate">
                {isWorkoutActive ? 'RESUME SESSION' : 'START WORKOUT'}
              </span>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onSelectTab(item.id)}
                  style={isActive ? {
                    backgroundColor: `${currentTheme.accentColor}15`,
                    color: currentTheme.accentColor,
                    borderColor: `${currentTheme.accentColor}40`,
                    borderWidth: '1px'
                  } : undefined}
                  className={`w-full flex items-center rounded-xl font-medium text-xs transition-all ${
                    isCollapsed ? 'justify-center h-10 p-0' : 'justify-between px-3 py-2 text-left'
                  } ${
                    isActive
                      ? 'font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                  }`}
                >
                  <div className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''}`}>
                    <Icon 
                      className="w-4 h-4 transition-colors shrink-0" 
                      style={isActive ? { color: currentTheme.accentColor } : { color: '#9CA3AF' }}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span 
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0"
                      style={{ 
                        color: item.color || '#00F050',
                        borderColor: `${item.color || '#00F050'}40`,
                        backgroundColor: `${item.color || '#00F050'}15`
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Floating Tooltip when Collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-[#0E131F] text-white text-xs font-medium rounded-xl border border-white/10 shadow-2xl z-50 whitespace-nowrap pointer-events-none animate-fade-in">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span 
                        className="text-[9px] font-mono font-bold px-1 rounded"
                        style={{ color: item.color || '#00F050', backgroundColor: `${item.color || '#00F050'}20` }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Section: Rank Card, Profile, and Collapse Button */}
      <div className="pt-3 border-t border-[#1F2636] space-y-2 shrink-0">
        {/* Hunter Rank Quick Widget */}
        {!isCollapsed ? (
          <div 
            onClick={() => onSelectTab('rank')}
            className="bg-[#141923] border border-[#252D3E] hover:border-lime-accent/40 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RankEmblem rank={rankProgress.currentRank} level={rankProgress.currentLevel} size="sm" animate={false} showLevel={false} />
              <div>
                <div className="text-[9px] text-gray-400 font-mono uppercase">HUNTER RANK</div>
                <div className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                  <span style={{ color: rankDef.color }}>{rankProgress.currentRank}</span>
                  <span>• Lv.{rankProgress.currentLevel}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-mono text-gray-400">Streak</div>
              <div className="text-xs font-mono font-bold text-orange-400 flex items-center gap-0.5 justify-end">
                <Flame className="w-3 h-3 fill-orange-400" />
                <span>4d</span>
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => onSelectTab('rank')}
            className="flex justify-center p-1 rounded-xl hover:bg-white/5 cursor-pointer relative group"
          >
            <RankEmblem rank={rankProgress.currentRank} level={rankProgress.currentLevel} size="sm" animate={false} showLevel={false} />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:flex flex-col px-3 py-1.5 bg-[#0E131F] text-white text-xs font-medium rounded-xl border border-white/10 shadow-2xl z-50 whitespace-nowrap pointer-events-none">
              <span className="font-bold text-amber-400">{rankProgress.currentRank} Rank • Lv.{rankProgress.currentLevel}</span>
              <span className="text-[10px] text-gray-400">Streak: 4 days</span>
            </div>
          </div>
        )}

        {/* Athlete Mini Profile */}
        {!isCollapsed ? (
          <div 
            onClick={() => onSelectTab('profile')}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
          >
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={profile.fullName}
              className="w-8 h-8 rounded-full object-cover border border-lime-accent/40 shrink-0"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{profile.fullName}</div>
              <div className="text-[10px] text-gray-400 truncate capitalize font-mono">{profile.fitnessLevel} Hunter</div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => onSelectTab('profile')}
            className="flex justify-center p-1 rounded-xl hover:bg-white/5 cursor-pointer relative group"
          >
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={profile.fullName}
              className="w-8 h-8 rounded-full object-cover border border-lime-accent/40"
            />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:flex flex-col px-3 py-1.5 bg-[#0E131F] text-white text-xs font-medium rounded-xl border border-white/10 shadow-2xl z-50 whitespace-nowrap pointer-events-none">
              <span className="font-bold">{profile.fullName}</span>
              <span className="text-[10px] text-gray-400 capitalize">{profile.fitnessLevel} Hunter</span>
            </div>
          </div>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={toggleCollapsed}
          className={`w-full py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 flex items-center transition-colors text-xs ${
            isCollapsed ? 'justify-center' : 'justify-between px-2.5'
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {!isCollapsed && <span className="text-[11px] font-mono text-gray-400">Collapse Panel</span>}
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
