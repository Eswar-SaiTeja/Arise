import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  Play, 
  ShieldCheck, 
  Check, 
  Trash2, 
  X,
  Swords, 
  ChevronDown, 
  Home, 
  Dumbbell, 
  Timer, 
  Sparkles,
  Zap,
  Flame,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../context/WorkoutContext';
import { useBrand } from '../../context/BrandContext';
import { storageService } from '../../services/storageService';
import { hunterService, RANK_DEFINITIONS } from '../../services/hunterService';
import { environmentService } from '../../services/environmentService';
import { EnvironmentSelectorModal } from '../environment/EnvironmentSelectorModal';
import { DifficultySelectionModal } from '../theme/DifficultySelectionModal';
import { AppNotification } from '../../types';

interface HeaderProps {
  title: string;
  onOpenActiveWorkout: () => void;
  onNavigateTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenActiveWorkout,
  onNavigateTab,
}) => {
  const { profile, isAdmin, loginDemo } = useAuth();
  const { isWorkoutActive, activeSession } = useWorkout();
  const { currentTheme } = useBrand();

  const [notifications, setNotifications] = useState<AppNotification[]>(() => storageService.getNotifications());
  const [showNotifDrawer, setShowNotifDrawer] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showEnvModal, setShowEnvModal] = useState<boolean>(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState<boolean>(false);
  const [currentEnv, setCurrentEnv] = useState(() => environmentService.getCurrentEnvironment());

  const rankProgress = hunterService.getRankProgress();
  const rankDef = RANK_DEFINITIONS[rankProgress.currentRank];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    notifications.forEach(n => storageService.markNotificationRead(n.id));
    setNotifications(storageService.getNotifications());
  };

  const clearAll = () => {
    storageService.clearAllNotifications();
    setNotifications([]);
  };

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Close overflow menu on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowOverflowMenu(false);
        setShowNotifDrawer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#0A0D14]/95 backdrop-blur-xl border-b border-[#1F2636] w-full max-w-full overflow-x-hidden select-none">
      
      {/* =========================================================================
          TIER 1: MOBILE COMMAND CENTER (< 768px: 360px, 390px, 480px)
          Strictly organized into 3 purpose-built rows: Top, Second, Quick Actions
          ========================================================================= */}
      <div className="block md:hidden px-3.5 py-3 space-y-2.5">
        {/* Mobile Row 1: Brand / Title on Left, Notifications & Profile on Right */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${currentTheme.accentColor}20`,
                borderColor: `${currentTheme.accentColor}40`,
                boxShadow: `0 0 10px -2px ${currentTheme.glowColor}`
              }}
            >
              <Zap className="w-4 h-4" style={{ color: currentTheme.accentColor }} />
            </div>
            <h1 className="text-sm font-black text-white tracking-tight font-display truncate">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifDrawer(true)}
              className="p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/5 relative min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span 
                  style={{ backgroundColor: currentTheme.accentColor }}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full text-black font-mono font-bold text-[9px] flex items-center justify-center shadow"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={() => onNavigateTab('profile')}
              className="relative p-0.5 rounded-xl border-2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              style={{ borderColor: `${currentTheme.accentColor}60` }}
              aria-label="View profile"
            >
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={profile.fullName}
                className="w-8 h-8 rounded-lg object-cover"
              />
            </button>
          </div>
        </div>

        {/* Mobile Row 2: Rank Badge on Left, Difficulty Mode Indicator on Right */}
        <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-white/5">
          {/* Hunter Rank Badge */}
          <button
            type="button"
            onClick={() => onNavigateTab('rank')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold cursor-pointer transition-all active:scale-95 min-h-[38px]"
            style={{ 
              backgroundColor: `${rankDef.color}15`, 
              color: rankDef.color, 
              borderColor: `${rankDef.color}40`,
              boxShadow: `0 0 12px -3px ${rankDef.glow}`
            }}
            title="Hunter Rank Hub"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>{rankProgress.currentRank} RANK</span>
            <span className="text-[10px] text-gray-400 font-normal">LV.{rankProgress.currentLevel}</span>
          </button>

          {/* Difficulty Theme Indicator Pill */}
          <button
            type="button"
            onClick={() => setShowThemeModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold cursor-pointer transition-all active:scale-95 min-h-[38px]"
            style={{ 
              backgroundColor: `${currentTheme.accentColor}15`, 
              color: currentTheme.accentColor, 
              borderColor: `${currentTheme.accentColor}40`,
              boxShadow: `0 0 12px -3px ${currentTheme.glowColor}`
            }}
            title="Change Difficulty Mode"
          >
            <span 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ backgroundColor: currentTheme.accentColor }} 
            />
            <span>{currentTheme.name}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>

        {/* Mobile Row 3: Quick Action Section (3 Compact Action Cards) */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          {/* 1. TRAIN NOW / ACTIVE RESUME */}
          <button
            type="button"
            onClick={onOpenActiveWorkout}
            style={!isWorkoutActive ? {
              backgroundColor: currentTheme.accentColor,
              boxShadow: `0 0 14px -3px ${currentTheme.glowColor}`
            } : undefined}
            className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl font-bold text-xs tracking-tight transition-all active:scale-95 cursor-pointer min-h-[44px] ${
              isWorkoutActive 
                ? 'bg-amber-500 text-black shadow-amber-500/30 animate-pulse' 
                : 'text-black'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="truncate">
              {isWorkoutActive ? formatElapsed(activeSession?.elapsedSeconds || 0) : 'TRAIN NOW'}
            </span>
          </button>

          {/* 2. TIMER & CHRONO */}
          <button
            type="button"
            onClick={() => onNavigateTab('timer')}
            className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-bold text-xs font-mono tracking-tight transition-all active:scale-95 cursor-pointer min-h-[44px]"
            title="Launch Fitness Timers"
          >
            <Timer className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">TIMER</span>
          </button>

          {/* 3. GYM / HOME ENVIRONMENT SWITCHER */}
          <button
            type="button"
            onClick={() => setShowEnvModal(true)}
            className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border font-bold text-xs font-mono tracking-tight transition-all active:scale-95 cursor-pointer min-h-[44px] ${
              currentEnv === 'home'
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
            }`}
            title="Toggle Training Environment (Home / Gym)"
          >
            {currentEnv === 'home' ? <Home className="w-3.5 h-3.5 shrink-0" /> : <Dumbbell className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{currentEnv === 'home' ? 'HOME' : 'GYM'}</span>
          </button>
        </div>
      </div>


      {/* =========================================================================
          TIER 2: TABLET AND SMALL LAPTOP COMMAND CENTER (768px <= width < 1280px)
          Organized into Two Clean Rows with an Overflow Menu
          ========================================================================= */}
      <div className="hidden md:block xl:hidden px-6 py-3 space-y-2.5">
        {/* Tablet Row 1: Title, Rank, Difficulty, Notifications, Profile, Overflow */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-lg font-black text-white tracking-tight font-display truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Rank Badge */}
            <button
              type="button"
              onClick={() => onNavigateTab('rank')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all hover:scale-105 min-h-[44px]"
              style={{ 
                backgroundColor: `${rankDef.color}15`, 
                color: rankDef.color, 
                borderColor: `${rankDef.color}40`,
                boxShadow: `0 0 12px -3px ${rankDef.glow}`
              }}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{rankProgress.currentRank} RANK</span>
              <span className="text-[10px] text-gray-400 font-normal">LV.{rankProgress.currentLevel}</span>
            </button>

            {/* Difficulty Selector */}
            <button
              type="button"
              onClick={() => setShowThemeModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all hover:scale-105 min-h-[44px]"
              style={{ 
                backgroundColor: `${currentTheme.accentColor}15`, 
                color: currentTheme.accentColor, 
                borderColor: `${currentTheme.accentColor}40`,
                boxShadow: `0 0 12px -3px ${currentTheme.glowColor}`
              }}
            >
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: currentTheme.accentColor, boxShadow: `0 0 8px ${currentTheme.glowColor}` }} 
              />
              <span>{currentTheme.name}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Notifications Bell */}
            <button
              type="button"
              onClick={() => setShowNotifDrawer(true)}
              className="p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10 relative min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span 
                  style={{ backgroundColor: currentTheme.accentColor }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-black font-mono font-bold text-[9px] flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <button
              type="button"
              onClick={() => onNavigateTab('profile')}
              className="relative p-0.5 rounded-xl border min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              style={{ borderColor: `${currentTheme.accentColor}50` }}
            >
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={profile.fullName}
                className="w-8 h-8 rounded-lg object-cover"
              />
            </button>

            {/* Overflow Menu Trigger for Tablet */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 border border-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-colors"
                title="More Actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Overflow Dropdown */}
              {showOverflowMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-[#121622] border border-[#252E42] rounded-2xl shadow-2xl p-2 z-50 animate-fade-in divide-y divide-white/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        loginDemo(isAdmin ? 'athlete' : 'admin');
                        setShowOverflowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-mono text-purple-300 hover:bg-purple-500/15 cursor-pointer text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Switch to Athlete Mode</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('profile');
                      setShowOverflowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs text-gray-300 hover:bg-white/5 cursor-pointer text-left"
                  >
                    <span>Account Settings</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tablet Row 2: Quick Action Strip */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            {/* TRAIN NOW */}
            <button
              type="button"
              onClick={onOpenActiveWorkout}
              style={!isWorkoutActive ? {
                backgroundColor: currentTheme.accentColor,
                boxShadow: `0 0 15px -3px ${currentTheme.glowColor}`
              } : undefined}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer min-h-[44px] ${
                isWorkoutActive 
                  ? 'bg-amber-500 text-black shadow-amber-500/30 animate-pulse' 
                  : 'text-black hover:scale-105'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isWorkoutActive ? `ACTIVE: ${formatElapsed(activeSession?.elapsedSeconds || 0)}` : 'TRAIN NOW'}</span>
            </button>

            {/* TIMER */}
            <button
              type="button"
              onClick={() => onNavigateTab('timer')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-mono text-xs font-bold transition-all hover:scale-105 cursor-pointer min-h-[44px]"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>TIMER & CHRONO</span>
            </button>
          </div>

          {/* ENVIRONMENT PILL */}
          <button
            type="button"
            onClick={() => setShowEnvModal(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all hover:scale-105 cursor-pointer min-h-[44px] ${
              currentEnv === 'home'
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
            }`}
          >
            {currentEnv === 'home' ? <Home className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
            <span>{currentEnv === 'home' ? 'HOME MODE' : 'GYM MODE'}</span>
          </button>
        </div>
      </div>


      {/* =========================================================================
          TIER 3: LARGE DESKTOP COMMAND CENTER (>= 1280px: 1280px, 1440px, 1920px)
          Streamlined Horizontal Row with Grouped Action Clusters & Zero Overflow
          ========================================================================= */}
      <div className="hidden xl:flex items-center justify-between px-8 py-3.5 gap-6">
        {/* Left: Application Title */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <h2 className="text-xl font-black text-white tracking-tight font-display truncate">
            {title}
          </h2>
        </div>

        {/* Right: Grouped Action Clusters */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Action Group: Train Now & Timer */}
          <div className="flex items-center gap-2 pr-2 border-r border-white/10">
            {/* Train Now CTA */}
            <button
              type="button"
              onClick={onOpenActiveWorkout}
              style={!isWorkoutActive ? {
                backgroundColor: currentTheme.accentColor,
                boxShadow: `0 0 16px -3px ${currentTheme.glowColor}`
              } : undefined}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer min-h-[44px] ${
                isWorkoutActive 
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30 animate-pulse' 
                  : 'text-black hover:scale-105'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isWorkoutActive ? `ACTIVE: ${formatElapsed(activeSession?.elapsedSeconds || 0)}` : 'TRAIN NOW'}</span>
            </button>

            {/* Timer */}
            <button
              type="button"
              onClick={() => onNavigateTab('timer')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-mono text-xs font-bold transition-all hover:scale-105 cursor-pointer min-h-[44px]"
              title="Launch Fitness Timers & Stopwatch"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>TIMER</span>
            </button>
          </div>

          {/* Preferences Group: Environment & Difficulty */}
          <div className="flex items-center gap-2 pr-2 border-r border-white/10">
            {/* Environment Switcher */}
            <button
              type="button"
              onClick={() => setShowEnvModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all hover:scale-105 cursor-pointer min-h-[44px] ${
                currentEnv === 'home'
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              }`}
              title="Training Environment: Home vs Gym Mode"
            >
              {currentEnv === 'home' ? <Home className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
              <span>{currentEnv === 'home' ? 'HOME MODE' : 'GYM MODE'}</span>
            </button>

            {/* Difficulty Selector */}
            <button
              type="button"
              onClick={() => setShowThemeModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all hover:scale-105 cursor-pointer min-h-[44px]"
              style={{ 
                backgroundColor: `${currentTheme.accentColor}15`, 
                color: currentTheme.accentColor, 
                borderColor: `${currentTheme.accentColor}40`,
                boxShadow: `0 0 12px -3px ${currentTheme.glowColor}`
              }}
              title="Change Difficulty Mode (Normal / Easy / Hard)"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: currentTheme.accentColor, boxShadow: `0 0 8px ${currentTheme.glowColor}` }} 
              />
              <span>{currentTheme.name}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* Status & Profile Group: Rank, Admin (if admin), Notifications, Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Rank Badge */}
            <button
              type="button"
              onClick={() => onNavigateTab('rank')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all hover:scale-105 cursor-pointer min-h-[44px]"
              style={{ 
                backgroundColor: `${rankDef.color}15`, 
                color: rankDef.color, 
                borderColor: `${rankDef.color}40`,
                boxShadow: `0 0 15px -4px ${rankDef.glow}`
              }}
              title="Hunter Rank Hub"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{rankProgress.currentRank} RANK</span>
              <span className="text-[10px] text-gray-400 font-normal">LV.{rankProgress.currentLevel}</span>
            </button>

            {/* Admin Switcher (conditionally rendered for admins) */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => loginDemo('athlete')}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-mono border bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold cursor-pointer min-h-[44px]"
                title="Toggle Admin Mode"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin</span>
              </button>
            )}

            {/* Notifications Bell */}
            <button
              type="button"
              onClick={() => setShowNotifDrawer(true)}
              className="p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors relative cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent hover:border-white/10"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span 
                  style={{ backgroundColor: currentTheme.accentColor }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-black font-mono font-bold text-[9px] flex items-center justify-center shadow"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <button
              type="button"
              onClick={() => onNavigateTab('profile')}
              className="relative p-0.5 rounded-xl border-2 transition-transform hover:scale-105 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ borderColor: `${currentTheme.accentColor}60` }}
              aria-label="View profile"
            >
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={profile.fullName}
                className="w-8 h-8 rounded-lg object-cover"
              />
            </button>
          </div>
        </div>
      </div>


      {/* =========================================================================
          GLOBAL MODALS & DRAWERS (Portaled to document.body for Zero Stacking Traps)
          ========================================================================= */}

      {/* 1. Notifications Drawer Modal (Portaled) */}
      {showNotifDrawer && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in select-none"
          onClick={() => setShowNotifDrawer(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#0E131F] h-full border-l border-[#1F2636] p-5 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1F2636]">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-300" />
                  <h3 className="font-bold text-base text-white">System Directives</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowNotifDrawer(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 text-xs text-gray-400 border-b border-white/5">
                <span>{notifications.length} Total Alerts</span>
                <div className="flex gap-3">
                  <button type="button" onClick={markAllRead} className="hover:text-white flex items-center gap-1 text-[11px] cursor-pointer">
                    <Check className="w-3 h-3" /> Mark Read
                  </button>
                  <button type="button" onClick={clearAll} className="hover:text-red-400 flex items-center gap-1 text-[11px] cursor-pointer">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    No active notifications or alerts.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        notif.isRead 
                          ? 'bg-white/[0.02] border-white/5 text-gray-400' 
                          : 'bg-[#151C2C] border-white/10 text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                        <span className="text-[10px] font-mono text-gray-500 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-400">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setShowNotifDrawer(false); onNavigateTab('dashboard'); }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer min-h-[44px]"
            >
              Close Notifications
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* 2. Premium Difficulty & Theme Selection Modal */}
      <DifficultySelectionModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />

      {/* 3. Training Environment Selector Modal */}
      <EnvironmentSelectorModal
        isOpen={showEnvModal}
        onClose={() => {
          setShowEnvModal(false);
          setCurrentEnv(environmentService.getCurrentEnvironment());
        }}
        onEnvironmentChanged={(env) => setCurrentEnv(env)}
      />
    </header>
  );
};
