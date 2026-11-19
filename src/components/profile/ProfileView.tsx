import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Dumbbell, 
  BookOpen, 
  History, 
  Bell, 
  Volume2, 
  VolumeX, 
  Download, 
  ShieldCheck, 
  LogOut, 
  Check, 
  Bookmark, 
  Calendar, 
  Clock, 
  Activity,
  Trash2,
  Edit3,
  Timer,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Exercise, ManualChapter } from '../../types';
import { useBrand } from '../../context/BrandContext';
import { BRAND_THEMES, BrandThemeId } from '../../../packages/design-system/branding';
import { environmentService } from '../../services/environmentService';
import { EnvironmentSelectorModal } from '../environment/EnvironmentSelectorModal';
import { TrainingEnvironment, DevelopmentLevel } from '../../types/environment';
import { Home, Repeat } from 'lucide-react';

interface ProfileViewProps {
  onSelectExercise: (ex: Exercise) => void;
  onSelectChapter: (chapterId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onSelectExercise,
  onSelectChapter,
  onNavigateTab,
}) => {
  const { profile, updateProfile, logout, isAdmin, loginDemo } = useAuth();
  const { currentTheme, themeId, experienceMode, setThemeId, setExperienceMode } = useBrand();
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'saved' | 'settings'>('info');

  // Form states for profile edit
  const [fullName, setFullName] = useState(profile.fullName);
  const [age, setAge] = useState(profile.age);
  const [heightCm, setHeightCm] = useState(profile.heightCm);
  const [weightKg, setWeightKg] = useState(profile.weightKg);
  const [unitPref, setUnitPref] = useState(profile.unitPreference);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [envProgress, setEnvProgress] = useState(() => environmentService.getProgress());
  const [showEnvModal, setShowEnvModal] = useState(false);

  const workoutLogs = storageService.getWorkoutLogs();
  const bookmarks = storageService.getBookmarks();
  const allExercises = storageService.getExercises();
  const allChapters = storageService.getManualChapters();

  const savedExercises = allExercises.filter(ex => bookmarks.some(b => b.type === 'exercise' && b.id === ex.id));
  const savedChapters = allChapters.filter(ch => bookmarks.some(b => b.type === 'chapter' && b.id === ch.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      age,
      heightCm,
      weightKg,
      unitPreference: unitPref,
      soundEnabled,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportCSV = () => {
    const csvContent = storageService.exportWorkoutsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `training_workouts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-[#141A28] to-[#0E121A] border border-[#252D3E] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={profile.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-lime-accent shadow-glow-lime"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white font-display">
                  {profile.fullName}
                </h1>
                {profile.isAdmin && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold border border-purple-500/30">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {profile.email} • Member since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-mono capitalize bg-white/5 px-2.5 py-0.5 rounded text-gray-300 border border-white/10">
                  {profile.fitnessLevel} Level
                </span>
                <span className="text-[11px] font-mono capitalize bg-lime-accent/10 px-2.5 py-0.5 rounded text-lime-accent border border-lime-accent/30 font-semibold">
                  Goal: {profile.primaryGoal.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#181E2B] border border-[#252D3E] text-gray-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-lime-accent" />
              <span>Export History</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tactical Suite Quick Launch */}
      {onNavigateTab && (
        <div className="bg-[#10141F] border border-white/10 rounded-3xl p-5 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tactical Suite & Fitness Tools</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab('timer')}
              className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all active:scale-95 group touch-target"
            >
              <Timer className="w-5 h-5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Timer & Chrono</div>
              <div className="text-[10px] text-gray-400">Rest, Laps & HIIT</div>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('nutrition')}
              className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all active:scale-95 group touch-target"
            >
              <UtensilsCrossed className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Diet & Nutrition</div>
              <div className="text-[10px] text-gray-400">TDEE & Macros</div>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('manual')}
              className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 text-left transition-all active:scale-95 group touch-target"
            >
              <BookOpen className="w-5 h-5 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Training Manual</div>
              <div className="text-[10px] text-gray-400">Biomechanical Guide</div>
            </button>
            {profile.isAdmin && (
              <button
                type="button"
                onClick={() => onNavigateTab('admin')}
                className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 hover:border-amber-400 text-left transition-all active:scale-95 group touch-target"
              >
                <ShieldCheck className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">Admin Control</div>
                <div className="text-[10px] text-gray-400">Library & Ingest</div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#252D3E] pb-3">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'info'
              ? 'bg-lime-accent text-black font-bold shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Info</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-lime-accent text-black font-bold shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Workout History ({workoutLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'saved'
              ? 'bg-lime-accent text-black font-bold shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved & Bookmarks</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-lime-accent text-black font-bold shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Preferences</span>
        </button>
      </div>

      {/* Tab: Personal Info Form */}
      {activeTab === 'info' && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-display">Edit Athlete Profile</h3>
            {saveSuccess && (
              <span className="text-xs font-mono font-bold text-lime-accent flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile Updated Successfully
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 180)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 80)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider shadow-glow-lime"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Workout History */}
      {activeTab === 'history' && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">Completed Workout Logbook</h3>

          <div className="space-y-3">
            {workoutLogs.map(log => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-mono text-gray-400">
                    {new Date(log.completedAt).toLocaleDateString()} at {new Date(log.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <h4 className="text-base font-bold text-white font-display">{log.title}</h4>
                  {log.notes && (
                    <p className="text-xs text-gray-300 italic mt-0.5">"{log.notes}"</p>
                  )}
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Duration</span>
                    <span className="text-white font-bold">{Math.round(log.durationSeconds / 60)} min</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Volume</span>
                    <span className="text-lime-accent font-bold">{log.totalVolumeKg} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Sets Done</span>
                    <span className="text-white font-bold">{log.totalSetsCompleted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Saved Exercises and Bookmarked Chapters */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {/* Bookmarked Chapters */}
          <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-lime-accent" />
              <span>Bookmarked Training Manual Chapters</span>
            </h3>

            {savedChapters.length === 0 ? (
              <p className="text-xs text-gray-400">No bookmarked chapters yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedChapters.map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => onSelectChapter(ch.id)}
                    className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] hover:border-lime-accent/50 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] font-mono text-lime-accent font-bold uppercase">Chapter {ch.chapterNumber}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{ch.title}</h4>
                    <span className="text-xs font-mono text-gray-400 mt-2 block">{ch.estimatedReadTimeMin} min read</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarked Exercises */}
          <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-lime-accent" />
              <span>Saved Exercises</span>
            </h3>

            {savedExercises.length === 0 ? (
              <p className="text-xs text-gray-400">No saved exercises yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedExercises.map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => onSelectExercise(ex)}
                    className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] hover:border-lime-accent/50 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] font-mono text-lime-accent font-bold uppercase">{ex.category}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{ex.name}</h4>
                    <span className="text-xs font-mono text-gray-400 mt-1 block">Target: {ex.targetMuscle}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Settings & System Preferences */}
      {activeTab === 'settings' && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white font-display">System & App Preferences</h3>

          <div className="space-y-5 max-w-xl">
            {/* Training Difficulty & Dynamic Color Theme Selection */}
            <div className="p-5 rounded-2xl bg-[#181E2B] border border-[#252D3E] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white block">Training Difficulty & Dynamic Theme</span>
                  <span className="text-xs text-gray-400 font-mono">Select your progression experience: Normal (Purple), Easy (Blue), or Hard (Red)</span>
                </div>
                <span 
                  className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-full border uppercase"
                  style={{
                    backgroundColor: `${currentTheme.accentColor}15`,
                    color: currentTheme.accentColor,
                    borderColor: `${currentTheme.accentColor}40`
                  }}
                >
                  Active: {currentTheme.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { 
                    id: 'normal' as const, 
                    name: 'NORMAL MODE', 
                    theme: 'Purple',
                    tagline: 'Standard Protocol', 
                    desc: 'Balanced training for consistent progression.', 
                    color: '#A855F7', 
                    diff: 'Intermediate' 
                  },
                  { 
                    id: 'easy' as const, 
                    name: 'EASY MODE', 
                    theme: 'Blue',
                    tagline: 'Gentle Directives', 
                    desc: 'Comfortable training for beginners and gradual improvement.', 
                    color: '#3B82F6', 
                    diff: 'Beginner' 
                  },
                  { 
                    id: 'hard' as const, 
                    name: 'HARD MODE', 
                    theme: 'Red',
                    tagline: 'Relentless Iron', 
                    desc: 'Challenging training for experienced users seeking advanced progression.', 
                    color: '#EF4444', 
                    diff: 'Advanced' 
                  },
                ].map((mode) => {
                  const isSelected = currentTheme.id === mode.id || (mode.id === 'hard' && currentTheme.id === 'hell');
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setThemeId(mode.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-white/50 shadow-xl ring-2'
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${mode.color}15` : undefined,
                        borderColor: isSelected ? mode.color : undefined,
                        boxShadow: isSelected ? `0 0 20px -3px ${mode.color}50` : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: mode.color, boxShadow: `0 0 10px ${mode.color}80` }}
                          />
                          <span className="text-xs font-bold text-white font-display">{mode.name}</span>
                        </div>
                        <span 
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase" 
                          style={{ backgroundColor: `${mode.color}20`, color: mode.color }}
                        >
                          {mode.theme}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium" style={{ color: mode.color }}>{mode.diff} Level</div>
                      <div className="text-[10px] text-gray-300 mt-1 leading-snug">{mode.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Training Environment & Development Tier */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#181E2B] border border-[#252D3E] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white block">Training Environment & Development Tiers</span>
                  <span className="text-xs text-gray-400 font-mono">
                    Currently: {envProgress.environment === 'home' ? '🏠 HOME MODE' : '🏋️ GYM MODE'} • {envProgress.developmentLevel.toUpperCase()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEnvModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    environmentService.setEnvironment('home');
                    setEnvProgress(environmentService.getProgress());
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    envProgress.environment === 'home'
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-md ring-1 ring-cyan-400/40'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Home className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">HOME MODE</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Zero mandatory gym gear. Bodyweight leverage and calisthenics progressions.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    environmentService.setEnvironment('gym');
                    setEnvProgress(environmentService.getProgress());
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    envProgress.environment === 'gym'
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-md ring-1 ring-emerald-400/40'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Dumbbell className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">GYM MODE</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Commercial facilities. Selectorized machines, barbell stations, and free weights.</p>
                </button>
              </div>

              {/* Development Level Selection */}
              <div className="pt-3 border-t border-white/10">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
                  Development Category ({envProgress.environment.toUpperCase()}):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['basic', 'beginner', 'advanced'] as DevelopmentLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        environmentService.setDevelopmentLevel(lvl);
                        setEnvProgress(environmentService.getProgress());
                      }}
                      className={`py-2 px-2.5 rounded-lg text-xs font-mono capitalize transition-all border text-center ${
                        envProgress.developmentLevel === lvl
                          ? 'bg-white/15 text-white font-bold border-white/40 shadow-sm'
                          : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Mode Selector */}
            <div className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] space-y-3">
              <div>
                <span className="text-sm font-semibold text-white block">Visual Experience Mode</span>
                <span className="text-xs text-gray-400 font-mono">Switch between Gamified RPG progression and Clean Studio mode</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExperienceMode('hunter')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    experienceMode === 'hunter'
                      ? 'bg-lime-accent/10 border-lime-accent/40 shadow-glow-lime'
                      : 'bg-white/5 border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-lime-accent">HUNTER RPG MODE</div>
                  <div className="text-[11px] text-gray-300 mt-1">Missions, rank tiers, glowing emblems, boss raids & sound fanfare.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setExperienceMode('pro')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    experienceMode === 'pro'
                      ? 'bg-blue-500/10 border-blue-500/40 shadow-lg'
                      : 'bg-white/5 border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-blue-400">CLEAN PRO FITNESS</div>
                  <div className="text-[11px] text-gray-300 mt-1">Minimalist studio aesthetics, clean data cards, and periodization metrics.</div>
                </button>
              </div>
            </div>

            {/* Unit Preference */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E]">
              <div>
                <span className="text-sm font-semibold text-white block">Measurement Units</span>
                <span className="text-xs text-gray-400 font-mono">Metric (kg, cm) vs Imperial (lbs, in)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUnitPref('metric');
                    updateProfile({ unitPreference: 'metric' });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    unitPref === 'metric' ? 'bg-lime-accent text-black' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  Metric
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnitPref('imperial');
                    updateProfile({ unitPreference: 'imperial' });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    unitPref === 'imperial' ? 'bg-lime-accent text-black' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>

            {/* Audio Effects */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E]">
              <div>
                <span className="text-sm font-semibold text-white block">Acoustic Feedback</span>
                <span className="text-xs text-gray-400 font-mono">Rest timer countdown and set completion chimes</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !soundEnabled;
                  setSoundEnabled(nextVal);
                  updateProfile({ soundEnabled: nextVal });
                }}
                className={`p-2.5 rounded-xl border transition-colors ${
                  soundEnabled 
                    ? 'bg-lime-accent/20 text-lime-accent border-lime-accent/30' 
                    : 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            {/* Admin Mode Switcher */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E]">
              <div>
                <span className="text-sm font-semibold text-white block">Administrator Rights</span>
                <span className="text-xs text-gray-400 font-mono">Manage exercises, programs, and user directory</span>
              </div>
              <button
                type="button"
                onClick={() => loginDemo(isAdmin ? 'athlete' : 'admin')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                  isAdmin ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {isAdmin ? 'Admin Active' : 'Enable Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Environment Selector Modal */}
      <EnvironmentSelectorModal
        isOpen={showEnvModal}
        onClose={() => {
          setShowEnvModal(false);
          setEnvProgress(environmentService.getProgress());
        }}
        onEnvironmentChanged={(env, lvl) => {
          setEnvProgress(environmentService.getProgress());
        }}
      />
    </div>
  );
};
