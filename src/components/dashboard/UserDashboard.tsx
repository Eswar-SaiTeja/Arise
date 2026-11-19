import React, { useState } from 'react';
import { 
  Play, 
  Flame, 
  Dumbbell, 
  Trophy, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Clock, 
  Activity, 
  ArrowRight, 
  BookOpen,
  Swords,
  ShieldCheck,
  Utensils,
  Droplet,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Zap,
  Award,
  Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkout } from '../../context/WorkoutContext';
import { storageService } from '../../services/storageService';
import { hunterService, RANK_DEFINITIONS } from '../../services/hunterService';
import { nutritionStorage } from '../../services/nutritionStorage';
import { NUTRITION_ENGINE } from '../../services/nutritionEngine';
import { Exercise, WorkoutProgram } from '../../types';
import { ExerciseAnimation } from '../common/ExerciseAnimation';
import { RankEmblem } from '../hunter/RankEmblem';
import { DailyMissionsCard } from '../hunter/DailyMissionsCard';
import { useBrand } from '../../context/BrandContext';
import { EnvironmentProgressionCard } from '../environment/EnvironmentProgressionCard';
import { environmentService } from '../../services/environmentService';

interface UserDashboardProps {
  onStartWorkout: () => void;
  onNavigateTab: (tab: any) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onStartWorkout,
  onNavigateTab,
  onSelectExercise,
}) => {
  const { profile } = useAuth();
  const { isWorkoutActive } = useWorkout();
  const { currentTheme, experienceMode } = useBrand();

  const enrolledProgramId = storageService.getEnrolledProgramId();
  const programs = storageService.getPrograms();
  const enrolledProgram: WorkoutProgram = programs.find(p => p.id === enrolledProgramId) || programs[0];
  const exercises = storageService.getExercises();
  const logs = storageService.getWorkoutLogs();

  const [rankProgress, setRankProgress] = useState(() => hunterService.getRankProgress());
  const [streak, setStreak] = useState(() => hunterService.getStreak());
  const [dailyMissions, setDailyMissions] = useState(() => hunterService.getDailyMissions());
  const [todayNutrition, setTodayNutrition] = useState(() => nutritionStorage.getTodayLog());
  const [bodyProfile, setBodyProfile] = useState(() => nutritionStorage.getBodyProfile());
  const [envProgress, setEnvProgress] = useState(() => environmentService.getProgress());

  // Collapsible panel toggles
  const [isNutritionPanelExpanded, setIsNutritionPanelExpanded] = useState(true);
  const [isUpcomingPanelExpanded, setIsUpcomingPanelExpanded] = useState(true);

  const rankDef = RANK_DEFINITIONS[rankProgress.currentRank];
  const energy = NUTRITION_ENGINE.calculateEnergyTargets(bodyProfile);
  const macros = NUTRITION_ENGINE.calculateMacroTargets(bodyProfile, energy.dailyCalorieTarget);
  const currentBMI = NUTRITION_ENGINE.calculateBMI(bodyProfile.currentWeightKg, bodyProfile.heightCm, bodyProfile.age);

  // Time-of-day dynamic greeting
  const currentHour = new Date().getHours();
  let timeOfDayGreeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) {
    timeOfDayGreeting = 'Good afternoon';
  } else if (currentHour >= 17) {
    timeOfDayGreeting = 'Good evening';
  }

  // Daily Directives Metrics
  const completedMissionsCount = dailyMissions.filter(m => m.isCompleted).length;
  const missionPercent = Math.round((completedMissionsCount / Math.max(1, dailyMissions.length)) * 100);

  // Level Progression XP
  const levelXPPercent = Math.min(100, Math.round((rankProgress.rankXP / rankProgress.xpForNextLevel) * 100));
  const xpNeeded = Math.max(0, rankProgress.xpForNextLevel - rankProgress.rankXP);

  // Nutrition Metrics
  const caloriePercent = Math.min(100, Math.round((todayNutrition.caloriesConsumed / energy.dailyCalorieTarget) * 100));
  const remainingCalories = Math.max(0, energy.dailyCalorieTarget - todayNutrition.caloriesConsumed);
  const proteinPercent = Math.min(100, Math.round((todayNutrition.proteinConsumed / macros.proteinGrams) * 100));
  const carbsPercent = Math.min(100, Math.round((todayNutrition.carbsConsumed / macros.carbsGrams) * 100));
  const fatPercent = Math.min(100, Math.round((todayNutrition.fatConsumed / macros.fatsGrams) * 100));
  const waterPercent = Math.min(100, Math.round((todayNutrition.waterConsumedMl / macros.waterIntakeMl) * 100));

  // Find today's workout day (e.g. Day 1)
  const todayWorkoutDay = enrolledProgram.days[0] || {
    id: 'day-today',
    dayNumber: 1,
    title: 'Full Body Power Prep',
    description: 'Foundational strength and core tension.',
    targetFocus: 'Chest, Quads & Back',
    estimatedDurationMin: 50,
    isRestDay: false,
    exercises: [
      { exerciseId: 'ex-barbell-bench', exerciseName: 'Barbell Flat Bench Press', sets: 4, targetReps: '6-8', restSec: 120 },
      { exerciseId: 'ex-barbell-back-squat', exerciseName: 'Barbell Back Squat', sets: 4, targetReps: '6-8', restSec: 120 },
      { exerciseId: 'ex-pullup', exerciseName: 'Strict Overhand Pull-Up', sets: 4, targetReps: '8', restSec: 90 }
    ]
  };

  const recommendedExercises = exercises.slice(0, 4);
  const totalWorkouts = logs.length;
  const totalVolumeKg = logs.reduce((acc, curr) => acc + curr.totalVolumeKg, 0);

  const quotes = [
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { text: "The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.", author: "Arnold Schwarzenegger" },
    { text: "We do not rise to the level of our expectations; we fall to the level of our training.", author: "Archilochus" },
  ];
  const dailyQuote = quotes[new Date().getDay() % quotes.length];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  const handleQuickAddWater = () => {
    const updated = nutritionStorage.addWater(250);
    setTodayNutrition({ ...updated });
  };

  return (
    <div className="space-y-7 pb-16">
      {/* 1. ATHLETE COMMAND CENTER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141A28] via-[#10141F] to-[#0D1017] border border-white/10 p-6 sm:p-8">
        <div 
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none" 
          style={{ backgroundColor: `${currentTheme.accentColor}15` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div 
                style={{
                  backgroundColor: `${currentTheme.accentColor}15`,
                  color: currentTheme.accentColor,
                  borderColor: `${currentTheme.accentColor}30`
                }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{experienceMode === 'hunter' ? `${currentTheme.name} • HUNTER COMMAND PROTOCOL` : `${currentTheme.name} • ATHLETE COMMAND CENTER`}</span>
              </div>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-xs font-semibold ${
                envProgress.environment === 'home'
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}>
                <span>{envProgress.environment === 'home' ? '🏠 HOME MODE' : '🏋️ GYM MODE'}</span>
                <span className="text-gray-400">•</span>
                <span className="capitalize">{envProgress.developmentLevel} Tier</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight">
              {timeOfDayGreeting}, {profile.fullName.split(' ')[0]}.
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 italic max-w-xl">
              "{dailyQuote.text}" — <span className="text-gray-400 not-italic">{dailyQuote.author}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigateTab('rank')}
              className="px-4 py-3 rounded-xl border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all hover:scale-105"
              style={{ 
                backgroundColor: `${rankDef.color}15`,
                color: rankDef.color,
                borderColor: `${rankDef.color}40`,
                boxShadow: `0 0 15px -4px ${rankDef.glow}`
              }}
            >
              <Swords className="w-4 h-4" />
              <span>{experienceMode === 'hunter' ? 'Hunter Hub' : 'Rank Hub'} ({rankProgress.currentRank})</span>
            </button>
            <button
              onClick={onStartWorkout}
              style={!isWorkoutActive ? {
                backgroundColor: currentTheme.accentColor,
                boxShadow: `0 0 20px -3px ${currentTheme.glowColor}`
              } : undefined}
              className={`px-6 py-3.5 rounded-xl font-black text-sm tracking-wide flex items-center gap-2.5 transition-all shadow-lg ${
                isWorkoutActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30 animate-pulse'
                  : 'text-black hover:scale-105'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isWorkoutActive ? 'RESUME SESSION' : 'START TODAY\'S WORKOUT'}</span>
            </button>
          </div>
        </div>

        {/* Level Progression & Daily Directive Status Bar */}
        <div className="mt-6 pt-5 border-t border-[#1F2636] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Level Progress */}
          <div className="space-y-1.5 bg-[#0E121E]/60 p-3 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-lime-accent" />
                <span>Tier Progression: {rankProgress.currentRank}·LV.{rankProgress.currentLevel}</span>
              </span>
              <span className="text-white font-bold">{rankProgress.rankXP} / {rankProgress.xpForNextLevel} XP ({levelXPPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${levelXPPercent}%`,
                  backgroundColor: rankDef.color
                }}
              />
            </div>
            <div className="text-[10px] text-gray-400 flex justify-between">
              <span>Next Threshold</span>
              <span>{xpNeeded} XP to Level {rankProgress.currentLevel + 1}</span>
            </div>
          </div>

          {/* Daily Missions Completion */}
          <div className="space-y-1.5 bg-[#0E121E]/60 p-3 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Daily Directives Status</span>
              </span>
              <span className="text-white font-bold">{completedMissionsCount} / {dailyMissions.length} Complete ({missionPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-lime-accent rounded-full transition-all duration-500"
                style={{ width: `${missionPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-400 flex justify-between">
              <span>Today's Directive Completion</span>
              <span className="text-lime-accent">+{completedMissionsCount * 80} XP Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY METRIC KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hunter Rank KPI */}
        <div 
          onClick={() => onNavigateTab('rank')}
          className="bg-[#141923] border border-[#252D3E] hover:border-lime-accent/50 rounded-2xl p-4 sm:p-5 relative overflow-hidden group cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Hunter Rank</span>
            <RankEmblem rank={rankProgress.currentRank} level={rankProgress.currentLevel} size="sm" animate={false} showLevel={false} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display flex items-baseline gap-1.5 font-mono">
            <span style={{ color: rankDef.color }}>{rankProgress.currentRank}</span>
            <span className="text-sm text-gray-400 font-normal">Lv.{rankProgress.currentLevel}</span>
          </div>
          <div className="mt-2 text-xs text-lime-accent font-medium flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{streak.graceDaysRemaining}/3 Grace Shields Active</span>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-orange-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Active Streak</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400 border border-orange-500/30">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display font-mono">
            {streak.currentStreak} <span className="text-sm font-normal text-gray-400">Days</span>
          </div>
          <div className="mt-2 text-xs text-orange-400 font-medium flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ironclad Consistency</span>
          </div>
        </div>

        {/* Daily Calorie Budget */}
        <div 
          onClick={() => onNavigateTab('nutrition')}
          className="bg-[#141923] border border-[#252D3E] hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 relative overflow-hidden group cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Nutrition Budget</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/30">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display font-mono">
            {todayNutrition.caloriesConsumed} <span className="text-xs text-gray-400 font-normal">/ {energy.dailyCalorieTarget} kcal</span>
          </div>
          <div className="mt-2 text-xs text-amber-400 font-medium font-mono flex items-center justify-between">
            <span>{caloriePercent}% Consumed</span>
            <span className="text-gray-400">{remainingCalories} kcal left</span>
          </div>
        </div>

        {/* Daily Hydration */}
        <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-sky-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Daily Hydration</span>
            <button
              onClick={handleQuickAddWater}
              className="px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold hover:bg-sky-500/30 transition-all"
              title="Add 250ml water"
            >
              +250ml
            </button>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-400 font-display font-mono">
            {(todayNutrition.waterConsumedMl / 1000).toFixed(1)} <span className="text-sm font-normal text-gray-400">/ {(macros.waterIntakeMl / 1000).toFixed(1)} L</span>
          </div>
          <div className="mt-2 text-xs text-sky-400 font-medium font-mono">
            <span>{waterPercent}% of Daily Target</span>
          </div>
        </div>
      </div>

      {/* 3. COLLAPSIBLE NUTRITION & BIOENERGETICS QUICK CARD */}
      <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-lime-accent/15 flex items-center justify-center text-lime-accent">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Daily Bioenergetics & Fueling Progress</h3>
              <p className="text-xs text-gray-400 font-mono">Synchronized with {bodyProfile.fitnessGoal.replace('_', ' ')} protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('nutrition')}
              className="text-xs font-mono font-bold text-lime-accent hover:underline flex items-center gap-1"
            >
              <span>Full Diet Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsNutritionPanelExpanded(!isNutritionPanelExpanded)}
              className="p-1 text-gray-400 hover:text-white"
            >
              {isNutritionPanelExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isNutritionPanelExpanded && (
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            {/* Protein */}
            <div className="bg-[#0E121E] p-3.5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-bold">Protein</span>
                <span className="text-white">{todayNutrition.proteinConsumed} / {macros.proteinGrams}g ({proteinPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-[#0E121E] p-3.5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">Carbohydrates</span>
                <span className="text-white">{todayNutrition.carbsConsumed} / {macros.carbsGrams}g ({carbsPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            {/* Fats */}
            <div className="bg-[#0E121E] p-3.5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold">Dietary Fats</span>
                <span className="text-white">{todayNutrition.fatConsumed} / {macros.fatsGrams}g ({fatPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. TRAINING ENVIRONMENT & DEVELOPMENT TIER PROGRESSION */}
      <EnvironmentProgressionCard
        onUpdate={() => {
          setEnvProgress(environmentService.getProgress());
          setRankProgress(hunterService.getRankProgress());
          setStreak(hunterService.getStreak());
        }}
      />

      {/* 5. DAILY DIRECTIVES & TODAY'S SCHEDULED WORKOUT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Daily Missions Directives (6 cols) */}
        <div className="lg:col-span-6">
          <DailyMissionsCard
            onMissionCompleted={() => {
              setRankProgress(hunterService.getRankProgress());
              setStreak(hunterService.getStreak());
              setDailyMissions(hunterService.getDailyMissions());
            }}
            onStartWorkoutCTA={onStartWorkout}
          />
        </div>

        {/* Right: Today's Scheduled Workout Session (6 cols) */}
        <div className="lg:col-span-6 bg-[#141923] border border-[#252D3E] rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-accent animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-lime-accent">
                  TODAY'S SCHEDULED SESSION
                </span>
              </div>
              <span className="text-xs font-mono text-gray-400">
                Estimated Duration: {todayWorkoutDay.estimatedDurationMin} min
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-black text-white font-display">
                {todayWorkoutDay.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                {todayWorkoutDay.description}
              </p>
            </div>

            {/* Exercise List Preview */}
            <div className="space-y-2">
              {todayWorkoutDay.exercises.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#181E2B] border border-[#252D3E]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-lime-accent/10 text-lime-accent font-mono font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-white">{item.exerciseName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                    <span>{item.sets} Sets</span>
                    <span>{item.targetReps}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#252D3E]">
            <button
              onClick={() => onNavigateTab('programs')}
              className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1"
            >
              <span>View full schedule</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStartWorkout}
              className="py-2.5 px-5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-glow-lime hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START SESSION (+100 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. WEEKLY ACTIVITY HEATMAP & UPCOMING SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6">
          <h3 className="font-display font-bold text-base text-white mb-1">Weekly Activity</h3>
          <p className="text-xs text-gray-400 mb-4 font-mono">Training consistency this week</p>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {daysOfWeek.map((day, idx) => {
              const isPast = idx < currentDayIndex;
              const isToday = idx === currentDayIndex;
              const isCompleted = idx === 0 || idx === 2 || idx === 3;

              return (
                <div key={day} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400">{day}</span>
                  <div 
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                      isCompleted 
                        ? 'bg-lime-accent text-black shadow-glow-lime' 
                        : isToday 
                        ? 'bg-white/10 text-white border-2 border-lime-accent animate-pulse'
                        : isPast 
                        ? 'bg-white/5 text-gray-500' 
                        : 'bg-white/5 text-gray-600'
                    }`}
                  >
                    {isCompleted ? '✓' : isToday ? '•' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Sessions List (2 cols) */}
        <div className="lg:col-span-2 bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white">Upcoming Program Sessions</h3>
            <Calendar className="w-4 h-4 text-lime-accent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enrolledProgram.days.slice(1, 3).map((day) => (
              <div
                key={day.id}
                className="p-3.5 rounded-2xl bg-[#181E2B] border border-[#252D3E] flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-gray-400">Day {day.dayNumber}</div>
                  <div className="text-sm font-semibold text-white truncate max-w-[160px]">{day.title}</div>
                </div>
                <span className="text-xs font-mono text-lime-accent bg-lime-accent/10 px-2 py-0.5 rounded-full border border-lime-accent/20">
                  {day.isRestDay ? 'Rest' : `${day.estimatedDurationMin}m`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. RECOMMENDED BIOMECHANICAL EXERCISES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-white font-display">Recommended Biomechanics</h3>
            <p className="text-xs text-gray-400 font-mono">Curated movements targeting your primary goals</p>
          </div>
          <button
            onClick={() => onNavigateTab('exercises')}
            className="text-xs font-bold text-lime-accent hover:text-lime-300 flex items-center gap-1"
          >
            <span>Explore All 35+ Exercises</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedExercises.map(ex => (
            <div
              key={ex.id}
              onClick={() => onSelectExercise(ex)}
              className="bg-[#141923] border border-[#252D3E] rounded-2xl overflow-hidden hover:border-lime-accent/50 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <ExerciseAnimation type={ex.animationType} targetMuscle={ex.targetMuscle} className="h-36" />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                    {ex.category}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-lime-accent font-semibold">
                    {ex.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-display line-clamp-1">{ex.name}</h4>
                <p className="text-xs text-gray-400 line-clamp-1 font-mono">Primary: {ex.targetMuscle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
