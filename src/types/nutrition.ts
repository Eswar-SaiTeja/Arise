// ==============================================================================
// PROJECT ASCEND / KINETIX: NUTRITION & BODY INTELLIGENCE TYPES
// Part 17 Engineering Specifications
// ==============================================================================

export type ActivityLevel = 
  | 'sedentary'          // Desk job, little to no exercise
  | 'lightly_active'     // 1-3 days/week light training
  | 'moderately_active'  // 3-5 days/week moderate lifting/cardio
  | 'very_active'        // 6-7 days/week hard training
  | 'extremely_active';  // Twice daily training or physical labor

export type DietaryPreference = 
  | 'vegetarian'
  | 'non_vegetarian'
  | 'vegan'
  | 'eggetarian'
  | 'high_protein'
  | 'balanced';

export type NutritionGoal = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'lean_muscle'
  | 'maintenance'
  | 'general_fitness'
  | 'strength'
  | 'endurance';

export type FoodBudget = 'budget' | 'standard' | 'premium';

export type MealSlot = 'breakfast' | 'mid_morning' | 'lunch' | 'evening_snack' | 'dinner';

export interface BodyProfile {
  age: number;
  biologicalSex: 'male' | 'female';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
  activityLevel: ActivityLevel;
  fitnessGoal: NutritionGoal;
  dietaryPreference: DietaryPreference;
  foodAllergies: string[];
  foodIntolerances: string[];
  medicalRestrictions: string[];
  budget: FoodBudget;
  mealsPerDay: number;
  workoutSchedule: string;
}

export type BMICategory = 'underweight' | 'healthy' | 'overweight' | 'obesity';

export interface BMIRecord {
  id: string;
  bmi: number;
  category: BMICategory;
  healthyWeightRange: [number, number]; // [minKg, maxKg]
  date: string;
  weightKg: number;
  heightCm: number;
  isUnder18: boolean;
  notes?: string;
}

export interface EnergyTargets {
  bmr: number;
  tdee: number;
  dailyCalorieTarget: number;
  calorieRange: [number, number];
  calculationFormula: string;
  goalAdjustmentReason: string;
}

export interface MacroTargets {
  proteinGrams: number;
  proteinCalories: number;
  carbsGrams: number;
  carbsCalories: number;
  fatsGrams: number;
  fatsCalories: number;
  fiberGrams: number;
  waterIntakeMl: number;
}

export interface FoodItem {
  id: string;
  name: string;
  regionalName?: string;
  category: 'grains' | 'proteins' | 'dairy' | 'vegetables' | 'fruits' | 'nuts_seeds' | 'oils_fats' | 'snacks';
  cuisine: 'indian' | 'global';
  isVegetarian: boolean;
  isVegan: boolean;
  isEggetarian: boolean;
  servingUnit: string;
  servingGrams: number;
  caloriesPerServing: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  affordability: FoodBudget;
  commonSubstitutions: string[];
  imageUrl?: string;
}

export interface DietMealPlanItem {
  id: string;
  slot: MealSlot;
  slotName: string;
  timeEstimate: string;
  dishName: string;
  portionSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  preparationInstructions: string;
  suitableAlternatives: string[];
  isEaten?: boolean;
}

export interface DailyMealPlan {
  id: string;
  date: string;
  title: string;
  summary: string;
  targetCalories: number;
  totalPlanCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  meals: DietMealPlanItem[];
}

export interface LoggedFoodEntry {
  id: string;
  slot: MealSlot;
  foodId: string;
  foodName: string;
  portionQuantity: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  timestamp: string;
}

export interface DailyNutritionLog {
  date: string;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  fiberConsumed: number;
  waterConsumedMl: number;
  entries: LoggedFoodEntry[];
}

export interface NutritionTrendAdvice {
  trendType: 'weight_stable' | 'weight_dropping_fast' | 'weight_rising_fast' | 'under_eating' | 'low_protein';
  title: string;
  recommendation: string;
  suggestedCalorieDelta: number;
  action: string;
}

export interface AINutritionMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mealSuggestions?: DietMealPlanItem[];
}
