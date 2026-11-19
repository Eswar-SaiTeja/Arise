import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Clock, 
  X, 
  ChevronRight,
  Flame,
  ArrowRight,
  DollarSign,
  Layers,
  ChefHat
} from 'lucide-react';
import { BodyProfile, DietaryPreference, FoodBudget, NutritionGoal, DailyMealPlan } from '../../types/nutrition';
import { NUTRITION_ENGINE } from '../../services/nutritionEngine';
import { nutritionStorage } from '../../services/nutritionStorage';
import { useBrand } from '../../context/BrandContext';

interface DietPlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanApplied: (plan: DailyMealPlan) => void;
}

export const DietPlanGeneratorModal: React.FC<DietPlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPlanApplied,
}) => {
  const { currentTheme } = useBrand();
  const currentProfile = nutritionStorage.getBodyProfile();

  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(currentProfile.dietaryPreference);
  const [budget, setBudget] = useState<FoodBudget>(currentProfile.budget);
  const [goal, setGoal] = useState<NutritionGoal>(currentProfile.fitnessGoal);
  
  // Calculate default calorie target for current selections
  const energy = NUTRITION_ENGINE.calculateEnergyTargets({
    ...currentProfile,
    dietaryPreference,
    budget,
    fitnessGoal: goal
  });

  const [calorieTarget, setCalorieTarget] = useState<number>(energy.dailyCalorieTarget);
  const [generatedPlan, setGeneratedPlan] = useState<DailyMealPlan>(() => 
    NUTRITION_ENGINE.generatePersonalizedMealPlan({
      ...currentProfile,
      dietaryPreference,
      budget,
      fitnessGoal: goal
    }, energy.dailyCalorieTarget)
  );

  if (!isOpen) return null;

  const handleGenerate = () => {
    const updatedProfile: BodyProfile = {
      ...currentProfile,
      dietaryPreference,
      budget,
      fitnessGoal: goal
    };
    const newPlan = NUTRITION_ENGINE.generatePersonalizedMealPlan(updatedProfile, calorieTarget);
    setGeneratedPlan(newPlan);
  };

  const handleApplyPlan = () => {
    nutritionStorage.saveActiveMealPlan(generatedPlan);
    nutritionStorage.saveBodyProfile({
      ...currentProfile,
      dietaryPreference,
      budget,
      fitnessGoal: goal
    });
    onPlanApplied(generatedPlan);
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#121624] border border-[#252E42] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#252E42] pb-5">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${currentTheme.accentColor}15`,
                color: currentTheme.accentColor,
                border: `1px solid ${currentTheme.accentColor}30`
              }}
            >
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white font-display">Personalized Diet Plan Generator</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-bold">
                  AI Tailored
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Synthesizes a 5-meal daily nutrition blueprint calibrated to your metabolism, regional cuisine, and budget.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Generator Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0A0D15] border border-[#1E2538] rounded-2xl p-4 sm:p-5">
          {/* Dietary Preference */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-1.5">
              Dietary Preference
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
              className="w-full bg-[#141A28] border border-[#252E42] text-white text-xs font-mono font-medium rounded-xl p-2.5 focus:outline-none focus:border-lime-accent"
            >
              <option value="vegetarian">Indian Vegetarian (No Meat/Fish)</option>
              <option value="non_vegetarian">Non-Vegetarian (Chicken/Fish/Eggs)</option>
              <option value="eggetarian">Eggetarian (Vegetarian + Eggs)</option>
              <option value="vegan">Vegan (Strict 100% Plant-Based)</option>
              <option value="high_protein">High-Protein Performance (2.0g/kg)</option>
              <option value="balanced">Balanced Macro Standard</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-1.5">
              Food Budget & Availability
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as FoodBudget)}
              className="w-full bg-[#141A28] border border-[#252E42] text-white text-xs font-mono font-medium rounded-xl p-2.5 focus:outline-none focus:border-lime-accent"
            >
              <option value="budget">Economy / Student Budget (Soya, Chana, Peanuts)</option>
              <option value="standard">Standard Household (Paneer, Eggs, Chicken)</option>
              <option value="premium">Premium (Salmon, Whey Isolate, Nuts)</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-1.5">
              Physiological Goal
            </label>
            <select
              value={goal}
              onChange={(e) => {
                const newGoal = e.target.value as NutritionGoal;
                setGoal(newGoal);
                const recalculated = NUTRITION_ENGINE.calculateEnergyTargets({
                  ...currentProfile,
                  fitnessGoal: newGoal
                });
                setCalorieTarget(recalculated.dailyCalorieTarget);
              }}
              className="w-full bg-[#141A28] border border-[#252E42] text-white text-xs font-mono font-medium rounded-xl p-2.5 focus:outline-none focus:border-lime-accent"
            >
              <option value="weight_loss">Weight Loss (Moderate Deficit)</option>
              <option value="muscle_gain">Muscle Gain (Hypertrophic Surplus)</option>
              <option value="lean_muscle">Lean Muscle Recomposition</option>
              <option value="maintenance">Maintenance (Isocaloric)</option>
              <option value="strength">Strength & Power Support</option>
              <option value="endurance">Endurance & Glycogen Base</option>
            </select>
          </div>
        </div>

        {/* Calorie Target Slider & Regenerate Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0E121D] border border-white/5">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-gray-400">Daily Calorie Target:</span>
            <input
              type="number"
              step="50"
              min="1200"
              max="4500"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(parseInt(e.target.value) || 2000)}
              className="w-24 px-2.5 py-1 rounded bg-[#181F2E] border border-[#28354E] text-white font-mono font-bold text-sm text-center focus:outline-none focus:border-lime-accent"
            />
            <span className="text-xs text-lime-accent font-mono font-bold">kcal</span>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/15"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Recipes</span>
          </button>
        </div>

        {/* Generated Plan Header Summary */}
        <div className="p-4 rounded-2xl bg-[#151B2A] border border-[#28334A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-sm font-display">{generatedPlan.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{generatedPlan.summary}</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <span className="text-amber-400 font-bold">{generatedPlan.totalPlanCalories} kcal</span>
            <span className="text-blue-400 font-bold">{generatedPlan.totalProtein}g P</span>
            <span className="text-emerald-400 font-bold">{generatedPlan.totalCarbs}g C</span>
            <span className="text-purple-400 font-bold">{generatedPlan.totalFat}g F</span>
          </div>
        </div>

        {/* 5 Meal Cards */}
        <div className="space-y-4">
          {generatedPlan.meals.map((meal) => (
            <div key={meal.id} className="bg-[#0E121E] border border-[#222A3E] rounded-2xl p-5 space-y-3 transition-colors hover:border-[#333E58]">
              {/* Slot Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white/10 text-gray-300">
                    {meal.slotName}
                  </span>
                  <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    {meal.timeEstimate}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-amber-300 font-bold">{meal.calories} kcal</span>
                  <span className="text-blue-300">{meal.protein}g Protein</span>
                  <span className="text-emerald-300">{meal.carbs}g Carbs</span>
                  <span className="text-purple-300">{meal.fat}g Fat</span>
                  <span className="text-gray-400">{meal.fiber}g Fiber</span>
                </div>
              </div>

              {/* Dish Name & Portion */}
              <div>
                <h4 className="text-base font-bold text-white font-display">{meal.dishName}</h4>
                <p className="text-xs text-lime-accent/90 font-mono mt-0.5">Portion: {meal.portionSize}</p>
              </div>

              {/* Ingredients and Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#141926] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Ingredients:</span>
                  <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                    {meal.ingredients.map((ing, idx) => (
                      <li key={idx} className="line-clamp-1">{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#141926] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Preparation Instructions:</span>
                  <p className="text-gray-300 leading-relaxed">{meal.preparationInstructions}</p>
                </div>
              </div>

              {/* Suitable Substitutions */}
              <div className="pt-1 flex items-center gap-2 text-xs flex-wrap font-mono">
                <span className="text-gray-400 text-[11px]">Substitutions:</span>
                {meal.suitableAlternatives.map((alt, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[11px]">
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#252E42] pt-5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-gray-400 hover:text-white text-xs font-mono font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyPlan}
            style={{
              backgroundColor: currentTheme.accentColor,
              boxShadow: `0 0 20px -3px ${currentTheme.glowColor}`
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-black font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Adopt As Active Daily Plan</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
