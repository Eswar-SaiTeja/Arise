// ==============================================================================
// NUTRITION & BODY INTELLIGENCE STORAGE SERVICE
// Persistent local-first management with audit logs and duplicate prevention
// ==============================================================================

import { 
  BodyProfile, 
  BMIRecord, 
  DailyMealPlan, 
  DailyNutritionLog, 
  LoggedFoodEntry, 
  FoodItem, 
  AINutritionMessage 
} from '../types/nutrition';
import { INITIAL_FOODS } from '../data/initialFoods';
import { NUTRITION_ENGINE } from './nutritionEngine';

const STORAGE_KEYS = {
  BODY_PROFILE: 'kinetix_body_profile',
  BMI_HISTORY: 'kinetix_bmi_history',
  FOOD_DATABASE: 'kinetix_food_database',
  DAILY_LOGS: 'kinetix_daily_nutrition_logs',
  ACTIVE_MEAL_PLAN: 'kinetix_active_meal_plan',
  AI_CHAT_HISTORY: 'kinetix_ai_nutrition_chat',
};

const DEFAULT_BODY_PROFILE: BodyProfile = {
  age: 28,
  biologicalSex: 'male',
  heightCm: 182,
  currentWeightKg: 81.5,
  targetWeightKg: 85.0,
  waistCm: 83.2,
  chestCm: 106.5,
  hipsCm: 96.8,
  armsCm: 38.8,
  thighsCm: 60.5,
  activityLevel: 'very_active',
  fitnessGoal: 'muscle_gain',
  dietaryPreference: 'high_protein',
  foodAllergies: [],
  foodIntolerances: ['Lactose (Mild)'],
  medicalRestrictions: [],
  budget: 'budget',
  mealsPerDay: 5,
  workoutSchedule: 'Morning 4-Day Upper/Lower Split',
};

const INITIAL_BMI_HISTORY: BMIRecord[] = [
  { id: 'bmi-1', bmi: 25.4, category: 'overweight', healthyWeightRange: [61.3, 82.5], date: '2026-10-15', weightKg: 84.0, heightCm: 182, isUnder18: false },
  { id: 'bmi-2', bmi: 25.0, category: 'healthy', healthyWeightRange: [61.3, 82.5], date: '2026-10-29', weightKg: 82.8, heightCm: 182, isUnder18: false },
  { id: 'bmi-3', bmi: 24.6, category: 'healthy', healthyWeightRange: [61.3, 82.5], date: '2026-11-18', weightKg: 81.5, heightCm: 182, isUnder18: false },
];

export const nutritionStorage = {
  // ----------------------------------------------------------------------------
  // BODY PROFILE
  // ----------------------------------------------------------------------------
  getBodyProfile(): BodyProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BODY_PROFILE);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(STORAGE_KEYS.BODY_PROFILE, JSON.stringify(DEFAULT_BODY_PROFILE));
    return DEFAULT_BODY_PROFILE;
  },

  saveBodyProfile(profile: BodyProfile): void {
    localStorage.setItem(STORAGE_KEYS.BODY_PROFILE, JSON.stringify(profile));
    // Automatically record a BMI measurement whenever weight or height changes
    this.recordBMIMeasurement(profile.currentWeightKg, profile.heightCm, profile.age);
  },

  // ----------------------------------------------------------------------------
  // BMI HISTORY & RECORDS
  // ----------------------------------------------------------------------------
  getBMIHistory(): BMIRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BMI_HISTORY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(STORAGE_KEYS.BMI_HISTORY, JSON.stringify(INITIAL_BMI_HISTORY));
    return INITIAL_BMI_HISTORY;
  },

  recordBMIMeasurement(weightKg: number, heightCm: number, age: number): BMIRecord {
    const history = this.getBMIHistory();
    const newRecord = NUTRITION_ENGINE.calculateBMI(weightKg, heightCm, age);
    
    // Check if entry for today exists to avoid duplicate entries on the same day
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = history.findIndex(r => r.date === today);
    if (existingIndex >= 0) {
      history[existingIndex] = newRecord;
    } else {
      history.push(newRecord);
    }

    localStorage.setItem(STORAGE_KEYS.BMI_HISTORY, JSON.stringify(history));
    return newRecord;
  },

  // ----------------------------------------------------------------------------
  // FOOD DATABASE CATALOG (Verified + Admin Custom)
  // ----------------------------------------------------------------------------
  getFoodDatabase(): FoodItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOOD_DATABASE);
      if (data) {
        const stored: FoodItem[] = JSON.parse(data);
        if (stored.length < INITIAL_FOODS.length) {
          const missing = INITIAL_FOODS.filter(f => !stored.some(s => s.id === f.id));
          const updated = [...stored, ...missing];
          localStorage.setItem(STORAGE_KEYS.FOOD_DATABASE, JSON.stringify(updated));
          return updated;
        }
        return stored;
      }
    } catch {}
    localStorage.setItem(STORAGE_KEYS.FOOD_DATABASE, JSON.stringify(INITIAL_FOODS));
    return INITIAL_FOODS;
  },

  saveFoodItem(item: FoodItem): void {
    const list = this.getFoodDatabase();
    const idx = list.findIndex(f => f.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.FOOD_DATABASE, JSON.stringify(list));
  },

  deleteFoodItem(id: string): void {
    const list = this.getFoodDatabase().filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FOOD_DATABASE, JSON.stringify(list));
  },

  // ----------------------------------------------------------------------------
  // DAILY NUTRITION LOGS & WATER TRACKER
  // ----------------------------------------------------------------------------
  getTodayLog(): DailyNutritionLog {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getAllDailyLogs();
    if (!logs[today]) {
      logs[today] = {
        date: today,
        caloriesConsumed: 0,
        proteinConsumed: 0,
        carbsConsumed: 0,
        fatConsumed: 0,
        fiberConsumed: 0,
        waterConsumedMl: 1250, // Initial sample water logged for day
        entries: [
          {
            id: 'init-entry-1',
            slot: 'breakfast',
            foodId: 'food-idli',
            foodName: 'Steamed Idli (2 pieces)',
            portionQuantity: 2,
            servingUnit: '2 medium idlis (100g)',
            calories: 280,
            protein: 8.4,
            carbs: 57.0,
            fat: 1.2,
            fiber: 4.2,
            timestamp: '08:15 AM'
          },
          {
            id: 'init-entry-2',
            slot: 'breakfast',
            foodId: 'food-curd',
            foodName: 'Homemade Fresh Curd',
            portionQuantity: 1,
            servingUnit: '1 medium katori (150g)',
            calories: 95,
            protein: 5.5,
            carbs: 6.8,
            fat: 4.8,
            fiber: 0.0,
            timestamp: '08:20 AM'
          }
        ]
      };
      // Recalculate totals
      this.recalculateDailyTotals(logs[today]);
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    }
    return logs[today];
  },

  getAllDailyLogs(): Record<string, DailyNutritionLog> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      if (data) return JSON.parse(data);
    } catch {}
    return {};
  },

  logFoodEntry(entry: LoggedFoodEntry): DailyNutritionLog {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getAllDailyLogs();
    const todayLog = logs[today] || {
      date: today,
      caloriesConsumed: 0,
      proteinConsumed: 0,
      carbsConsumed: 0,
      fatConsumed: 0,
      fiberConsumed: 0,
      waterConsumedMl: 0,
      entries: []
    };

    // Prevent accidental duplicate rapid submissions within 3 seconds
    const isDuplicate = todayLog.entries.some(e => 
      e.foodId === entry.foodId && 
      e.slot === entry.slot && 
      Math.abs(new Date(e.timestamp).getTime() - new Date(entry.timestamp).getTime()) < 3000
    );
    if (!isDuplicate) {
      todayLog.entries.unshift(entry);
      this.recalculateDailyTotals(todayLog);
      logs[today] = todayLog;
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    }
    return todayLog;
  },

  deleteFoodEntry(entryId: string): DailyNutritionLog {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getAllDailyLogs();
    const todayLog = logs[today];
    if (todayLog) {
      todayLog.entries = todayLog.entries.filter(e => e.id !== entryId);
      this.recalculateDailyTotals(todayLog);
      logs[today] = todayLog;
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    }
    return todayLog;
  },

  addWater(amountMl: number): DailyNutritionLog {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getAllDailyLogs();
    const todayLog = this.getTodayLog();
    todayLog.waterConsumedMl = Math.max(0, todayLog.waterConsumedMl + amountMl);
    logs[today] = todayLog;
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    return todayLog;
  },

  recalculateDailyTotals(log: DailyNutritionLog): void {
    log.caloriesConsumed = log.entries.reduce((sum, e) => sum + e.calories, 0);
    log.proteinConsumed = Math.round(log.entries.reduce((sum, e) => sum + e.protein, 0) * 10) / 10;
    log.carbsConsumed = Math.round(log.entries.reduce((sum, e) => sum + e.carbs, 0) * 10) / 10;
    log.fatConsumed = Math.round(log.entries.reduce((sum, e) => sum + e.fat, 0) * 10) / 10;
    log.fiberConsumed = Math.round(log.entries.reduce((sum, e) => sum + e.fiber, 0) * 10) / 10;
  },

  // ----------------------------------------------------------------------------
  // ACTIVE MEAL PLAN
  // ----------------------------------------------------------------------------
  getActiveMealPlan(): DailyMealPlan {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_MEAL_PLAN);
      if (data) return JSON.parse(data);
    } catch {}

    const profile = this.getBodyProfile();
    const energy = NUTRITION_ENGINE.calculateEnergyTargets(profile);
    const generated = NUTRITION_ENGINE.generatePersonalizedMealPlan(profile, energy.dailyCalorieTarget);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MEAL_PLAN, JSON.stringify(generated));
    return generated;
  },

  saveActiveMealPlan(plan: DailyMealPlan): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MEAL_PLAN, JSON.stringify(plan));
  },

  // ----------------------------------------------------------------------------
  // AI CHAT HISTORY
  // ----------------------------------------------------------------------------
  getAIChatHistory(): AINutritionMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_CHAT_HISTORY);
      if (data) return JSON.parse(data);
    } catch {}

    const initial: AINutritionMessage[] = [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Greetings, Hunter! I am your AI Nutrition & Body Intelligence Advisor. How can I optimize your fuel today? Ask me about pre-workout meals, high-protein Indian alternatives, hydration targets, or substitutions!',
        timestamp: '10:00 AM'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.AI_CHAT_HISTORY, JSON.stringify(initial));
    return initial;
  },

  addAIChatMessage(message: AINutritionMessage): void {
    const list = this.getAIChatHistory();
    list.push(message);
    localStorage.setItem(STORAGE_KEYS.AI_CHAT_HISTORY, JSON.stringify(list));
  },

  clearAIChatHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.AI_CHAT_HISTORY);
  }
};
