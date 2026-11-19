import React, { useState } from 'react';
import { 
  Flame, 
  Utensils, 
  Droplet, 
  Scale, 
  Sparkles, 
  Plus, 
  Bot, 
  ChefHat, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Trash2,
  AlertTriangle,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import { useWorkout } from '../../context/WorkoutContext';
import { NUTRITION_ENGINE } from '../../services/nutritionEngine';
import { nutritionStorage } from '../../services/nutritionStorage';
import { MealSlot, DailyNutritionLog, DailyMealPlan, BMIRecord } from '../../types/nutrition';
import { BMICalculatorCard } from './BMICalculatorCard';
import { DietPlanGeneratorModal } from './DietPlanGeneratorModal';
import { LogMealModal } from './LogMealModal';
import { AINutritionChatModal } from './AINutritionChatModal';
import { AdminFoodManagerModal } from './AdminFoodManagerModal';

export const NutritionDashboard: React.FC = () => {
  const { profile, isAdmin } = useAuth();
  const { currentTheme, experienceMode } = useBrand();
  const { isWorkoutActive } = useWorkout();

  // State management
  const [bodyProfile, setBodyProfile] = useState(() => nutritionStorage.getBodyProfile());
  const [todayLog, setTodayLog] = useState<DailyNutritionLog>(() => nutritionStorage.getTodayLog());
  const [activePlan, setActivePlan] = useState<DailyMealPlan>(() => nutritionStorage.getActiveMealPlan());
  const [bmiHistory, setBmiHistory] = useState<BMIRecord[]>(() => nutritionStorage.getBMIHistory());

  // Modal controls
  const [isBMIModalOpen, setIsBMIModalOpen] = useState(false);
  const [isPlanGeneratorOpen, setIsPlanGeneratorOpen] = useState(false);
  const [isLogMealOpen, setIsLogMealOpen] = useState(false);
  const [logMealSlot, setLogMealSlot] = useState<MealSlot>('breakfast');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAdminFoodOpen, setIsAdminFoodOpen] = useState(false);

  // Dynamic calculations
  const energy = NUTRITION_ENGINE.calculateEnergyTargets(bodyProfile);
  const macros = NUTRITION_ENGINE.calculateMacroTargets(bodyProfile, energy.dailyCalorieTarget);
  const currentBMI = NUTRITION_ENGINE.calculateBMI(bodyProfile.currentWeightKg, bodyProfile.heightCm, bodyProfile.age);
  const trendAdvice = NUTRITION_ENGINE.evaluateWeightTrend(
    bodyProfile.currentWeightKg + 0.5, // Reference baseline
    bodyProfile.currentWeightKg,
    14,
    bodyProfile.fitnessGoal
  );

  // Progress metrics
  const remainingCalories = Math.max(0, energy.dailyCalorieTarget - todayLog.caloriesConsumed);
  const caloriePercent = Math.min(100, Math.round((todayLog.caloriesConsumed / energy.dailyCalorieTarget) * 100));

  const proteinPercent = Math.min(100, Math.round((todayLog.proteinConsumed / macros.proteinGrams) * 100));
  const carbsPercent = Math.min(100, Math.round((todayLog.carbsConsumed / macros.carbsGrams) * 100));
  const fatPercent = Math.min(100, Math.round((todayLog.fatConsumed / macros.fatsGrams) * 100));
  const fiberPercent = Math.min(100, Math.round((todayLog.fiberConsumed / macros.fiberGrams) * 100));
  const waterPercent = Math.min(100, Math.round((todayLog.waterConsumedMl / macros.waterIntakeMl) * 100));

  const handleAddWater = (amountMl: number) => {
    const updated = nutritionStorage.addWater(amountMl);
    setTodayLog({ ...updated });
  };

  const handleDeleteFood = (entryId: string) => {
    const updated = nutritionStorage.deleteFoodEntry(entryId);
    setTodayLog({ ...updated });
  };

  const handleOpenLogModal = (slot: MealSlot) => {
    setLogMealSlot(slot);
    setIsLogMealOpen(true);
  };

  const slots: { id: MealSlot; name: string; time: string }[] = [
    { id: 'breakfast', name: 'Breakfast', time: '08:00 AM' },
    { id: 'mid_morning', name: 'Mid-Morning Refuel', time: '11:00 AM' },
    { id: 'lunch', name: 'Nutritional Anchor Lunch', time: '01:30 PM' },
    { id: 'evening_snack', name: 'Pre-Workout Activation', time: '05:30 PM' },
    { id: 'dinner', name: 'Cellular Recovery Dinner', time: '08:30 PM' },
  ];

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#121624] via-[#0E121D] to-[#0A0D15] border border-[#232B3E] p-6 sm:p-8">
        <div 
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: `${currentTheme.accentColor}15` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div 
              style={{
                backgroundColor: `${currentTheme.accentColor}15`,
                color: currentTheme.accentColor,
                borderColor: `${currentTheme.accentColor}30`
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{experienceMode === 'hunter' ? 'HUNTER BODY & METABOLIC INTELLIGENCE' : 'PERSONALIZED NUTRITION & BIOENERGETICS'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Fueling Protocol & Biometrics
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
              Mifflin-St Jeor metabolic tracking calibrated to your body weight ({bodyProfile.currentWeightKg} kg), training split, and regional culinary preferences.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
            >
              <Bot className="w-4 h-4 text-lime-accent" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => setIsPlanGeneratorOpen(true)}
              style={{
                backgroundColor: currentTheme.accentColor,
                boxShadow: `0 0 15px -3px ${currentTheme.glowColor}`
              }}
              className="px-5 py-2.5 rounded-xl text-black font-bold text-xs flex items-center gap-2 transition-all hover:scale-105"
            >
              <ChefHat className="w-4 h-4 stroke-[2.5]" />
              <span>Generate Meal Plan</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsAdminFoodOpen(true)}
                className="px-3 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                title="Manage food database"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Admin Foods</span>
              </button>
            )}
          </div>
        </div>

        {/* Workout Synchronization Status Bar */}
        <div className="mt-6 pt-4 border-t border-[#1F2636] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-400">Workout Sync:</span>
            <span className="font-bold text-white">
              {isWorkoutActive ? 'TRAINING ACTIVE (Hypertrophic Glycogen Priority)' : 'REST & ADAPTATION WINDOW (High-Protein Cellular Repair)'}
            </span>
          </div>
          <span className="text-gray-400">
            Formula: {energy.calculationFormula}
          </span>
        </div>
      </div>

      {/* Primary KPI Dash: Calories, Remaining, Burned */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Target */}
        <div className="bg-[#141926] border border-[#232B3E] rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase tracking-wider">
            <span>Daily Target</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {energy.dailyCalorieTarget} <span className="text-xs text-gray-400 font-normal">kcal</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            TDEE ({energy.tdee}) {energy.dailyCalorieTarget > energy.tdee ? `+${energy.dailyCalorieTarget - energy.tdee}` : energy.dailyCalorieTarget - energy.tdee} kcal
          </p>
        </div>

        {/* Calories Consumed */}
        <div className="bg-[#141926] border border-[#232B3E] rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase tracking-wider">
            <span>Consumed Today</span>
            <Utensils className="w-4 h-4 text-lime-accent" />
          </div>
          <div className="text-3xl font-black text-lime-accent font-mono">
            {todayLog.caloriesConsumed} <span className="text-xs text-gray-400 font-normal">kcal</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-lime-accent rounded-full transition-all"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
        </div>

        {/* Remaining Calories */}
        <div className="bg-[#141926] border border-[#232B3E] rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase tracking-wider">
            <span>Remaining Budget</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-sky-400 font-mono">
            {remainingCalories} <span className="text-xs text-gray-400 font-normal">kcal</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            {caloriePercent}% of daily budget utilized
          </p>
        </div>

        {/* BMI & Biometric Screening Quick Card */}
        <div 
          onClick={() => setIsBMIModalOpen(true)}
          className="bg-[#141926] border border-[#232B3E] hover:border-lime-accent/50 rounded-2xl p-5 space-y-2 relative overflow-hidden cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase tracking-wider">
            <span>Current BMI Index</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-lime-accent transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{currentBMI.bmi}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-lime-accent/15 text-lime-accent border border-lime-accent/30 uppercase">
              {currentBMI.category}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">
            Target Range: {currentBMI.healthyWeightRange[0]}–{currentBMI.healthyWeightRange[1]} kg
          </p>
        </div>
      </div>

      {/* Macronutrient Telemetry & Hydration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* 4 Macros Bar Gauges */}
        <div className="lg:col-span-3 bg-[#141926] border border-[#232B3E] rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
            <div>
              <h3 className="text-base font-bold text-white font-display">Target Macronutrient Distribution</h3>
              <p className="text-xs text-gray-400">Calibrated to {bodyProfile.currentWeightKg} kg bodyweight and {bodyProfile.fitnessGoal.replace('_', ' ')}</p>
            </div>
            <span className="text-xs font-mono text-gray-400 hidden sm:inline">
              Protein 4 kcal/g • Carbs 4 kcal/g • Fat 9 kcal/g
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Protein */}
            <div className="bg-[#0E121E] border border-[#1E2538] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-blue-400 font-bold">Protein</span>
                <span className="text-gray-400">{todayLog.proteinConsumed} / {macros.proteinGrams}g</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-400 rounded-full transition-all duration-500" 
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>{proteinPercent}%</span>
                <span>{macros.proteinCalories} kcal</span>
              </div>
            </div>

            {/* Carbohydrates */}
            <div className="bg-[#0E121E] border border-[#1E2538] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">Carbohydrates</span>
                <span className="text-gray-400">{todayLog.carbsConsumed} / {macros.carbsGrams}g</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>{carbsPercent}%</span>
                <span>{macros.carbsCalories} kcal</span>
              </div>
            </div>

            {/* Dietary Fats */}
            <div className="bg-[#0E121E] border border-[#1E2538] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-400 font-bold">Dietary Fats</span>
                <span className="text-gray-400">{todayLog.fatConsumed} / {macros.fatsGrams}g</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-400 rounded-full transition-all duration-500" 
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>{fatPercent}%</span>
                <span>{macros.fatsCalories} kcal</span>
              </div>
            </div>

            {/* Dietary Fiber */}
            <div className="bg-[#0E121E] border border-[#1E2538] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">Dietary Fiber</span>
                <span className="text-gray-400">{todayLog.fiberConsumed} / {macros.fiberGrams}g</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                  style={{ width: `${fiberPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>{fiberPercent}%</span>
                <span>14g / 1k kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Water Tracker Widget */}
        <div className="bg-[#141926] border border-[#232B3E] rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-sky-400 fill-sky-400/30" />
                <h3 className="font-bold text-white text-sm font-display">Hydration Tracker</h3>
              </div>
              <span className="text-xs font-mono text-sky-400 font-bold">{waterPercent}%</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {(todayLog.waterConsumedMl / 1000).toFixed(1)} <span className="text-xs text-gray-400 font-normal">/ {(macros.waterIntakeMl / 1000).toFixed(1)} L</span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono mt-1">
              Maintains blood volume and intramuscular ATP synthesis.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2">
              <button
                onClick={() => handleAddWater(250)}
                className="py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-xs font-bold transition-all"
              >
                +250ml
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-xs font-bold transition-all"
              >
                +500ml
              </button>
              <button
                onClick={() => handleAddWater(1000)}
                className="py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-xs font-bold transition-all"
              >
                +1.0L
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Trend Advice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121724] border border-[#232B3E] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent flex items-center justify-center shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <span>{trendAdvice.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                14-Day Trajectory
              </span>
            </h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-3xl">
              {trendAdvice.recommendation}
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-lime-accent font-bold shrink-0 bg-lime-accent/10 border border-lime-accent/30 px-3 py-2 rounded-xl">
          {trendAdvice.action}
        </div>
      </div>

      {/* Today's Structured Meal Schedule (5 Slots) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-white font-display">Daily Nutrition Directives</h2>
            <p className="text-xs text-gray-400">Track and log food entries across your 5 scheduled meal windows</p>
          </div>
          <button
            onClick={() => handleOpenLogModal('breakfast')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold flex items-center gap-2 border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Food Search</span>
          </button>
        </div>

        <div className="space-y-4">
          {slots.map((slot) => {
            const plannedMeal = activePlan.meals.find(m => m.slot === slot.id);
            const slotEntries = todayLog.entries.filter(e => e.slot === slot.id);
            const slotCalories = slotEntries.reduce((sum, e) => sum + e.calories, 0);

            return (
              <div 
                key={slot.id}
                className="bg-[#141926] border border-[#232B3E] rounded-2xl p-5 space-y-4 transition-all hover:border-[#323D56]"
              >
                {/* Slot Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232B3E] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white font-display">{slot.name}</span>
                    <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {slot.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      Logged: {slotCalories} kcal
                    </span>
                    <button
                      onClick={() => handleOpenLogModal(slot.id)}
                      className="px-3 py-1.5 rounded-lg bg-lime-accent/10 hover:bg-lime-accent/20 text-lime-accent border border-lime-accent/30 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Food</span>
                    </button>
                  </div>
                </div>

                {/* Planned Recipe Recommendation (from Active Plan) */}
                {plannedMeal && (
                  <div className="p-3.5 rounded-xl bg-[#0E121E] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-lime-accent block">
                        Recommended Plan Option
                      </span>
                      <span className="font-bold text-white text-sm">{plannedMeal.dishName}</span>
                      <span className="text-gray-400 block font-mono text-[11px] mt-0.5">Portion: {plannedMeal.portionSize}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                      <span className="text-amber-400">{plannedMeal.calories} kcal</span>
                      <span className="text-blue-400">{plannedMeal.protein}g P</span>
                      <span className="text-emerald-400">{plannedMeal.carbs}g C</span>
                      <span className="text-purple-400">{plannedMeal.fat}g F</span>
                    </div>
                  </div>
                )}

                {/* Logged Foods List for this Slot */}
                {slotEntries.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Logged Consumptions:</span>
                    <div className="divide-y divide-white/5 bg-[#0A0D15] rounded-xl border border-white/5">
                      {slotEntries.map((entry) => (
                        <div key={entry.id} className="p-3 flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="font-bold text-white">{entry.foodName}</span>
                            <span className="text-gray-400 text-[11px] block">{entry.portionQuantity}x {entry.servingUnit} ({entry.timestamp})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-bold">{entry.calories} kcal</span>
                            <span className="text-blue-400">{entry.protein}g P</span>
                            <span className="text-emerald-400">{entry.carbs}g C</span>
                            <span className="text-purple-400">{entry.fat}g F</span>
                            <button
                              onClick={() => handleDeleteFood(entry.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-500 font-mono italic">
                    No items logged for this window yet. Click "+ Log Food" to record consumption.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {isBMIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <BMICalculatorCard
              initialWeightKg={bodyProfile.currentWeightKg}
              initialHeightCm={bodyProfile.heightCm}
              age={bodyProfile.age}
              onUpdateWeight={(newW) => {
                setBodyProfile(prev => ({ ...prev, currentWeightKg: newW }));
              }}
              onClose={() => setIsBMIModalOpen(false)}
            />
          </div>
        </div>
      )}

      <DietPlanGeneratorModal
        isOpen={isPlanGeneratorOpen}
        onClose={() => setIsPlanGeneratorOpen(false)}
        onPlanApplied={(plan) => {
          setActivePlan(plan);
          setBodyProfile(nutritionStorage.getBodyProfile());
        }}
      />

      <LogMealModal
        isOpen={isLogMealOpen}
        initialSlot={logMealSlot}
        onClose={() => setIsLogMealOpen(false)}
        onLogged={() => {
          setTodayLog(nutritionStorage.getTodayLog());
        }}
      />

      <AINutritionChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      <AdminFoodManagerModal
        isOpen={isAdminFoodOpen}
        onClose={() => setIsAdminFoodOpen(false)}
        onDatabaseUpdated={() => {
          // Food database refreshed
        }}
      />
    </div>
  );
};
