// ==============================================================================
// NUTRITION & BODY INTELLIGENCE COMPUTATION ENGINE
// Mifflin-St Jeor BMR, TDEE, Dynamic Macro Splits, Indian/Global Meal Planner
// ==============================================================================

import { 
  BodyProfile, 
  BMIRecord, 
  BMICategory, 
  EnergyTargets, 
  MacroTargets, 
  DailyMealPlan, 
  DietMealPlanItem, 
  FoodItem, 
  NutritionTrendAdvice,
  AINutritionMessage 
} from '../types/nutrition';
import { INITIAL_FOODS } from '../data/initialFoods';

export const NUTRITION_ENGINE = {
  // ----------------------------------------------------------------------------
  // 1. BMI CALCULATOR & SCREENING
  // Formula: BMI = weight (kg) / [height (m)]^2
  // ----------------------------------------------------------------------------
  calculateBMI(weightKg: number, heightCm: number, age: number): BMIRecord {
    const heightM = heightCm / 100;
    const bmiRaw = heightM > 0 ? weightKg / (heightM * heightM) : 0;
    const bmi = Math.round(bmiRaw * 10) / 10;

    let category: BMICategory = 'healthy';
    if (bmi < 18.5) category = 'underweight';
    else if (bmi < 25.0) category = 'healthy';
    else if (bmi < 30.0) category = 'overweight';
    else category = 'obesity';

    // Healthy reference range (18.5 to 24.9 kg/m^2)
    const minHealthyKg = Math.round(18.5 * heightM * heightM * 10) / 10;
    const maxHealthyKg = Math.round(24.9 * heightM * heightM * 10) / 10;

    const isUnder18 = age < 18;

    return {
      id: 'bmi-' + Date.now(),
      bmi,
      category,
      healthyWeightRange: [minHealthyKg, maxHealthyKg],
      date: new Date().toISOString().split('T')[0],
      weightKg,
      heightCm,
      isUnder18,
      notes: isUnder18 
        ? 'Advisory: For individuals under 18, standard adult BMI cutoffs do not apply directly. Use CDC/WHO pediatric BMI-for-age percentiles.'
        : 'Note: BMI is a population screening tool, not a diagnostic measure of body composition or visceral adiposity.'
    };
  },

  // ----------------------------------------------------------------------------
  // 2. BASAL METABOLIC RATE (BMR) & TOTAL DAILY ENERGY EXPENDITURE (TDEE)
  // Equation: Mifflin-St Jeor
  // ----------------------------------------------------------------------------
  calculateEnergyTargets(profile: BodyProfile): EnergyTargets {
    const { age, biologicalSex, heightCm, currentWeightKg, activityLevel, fitnessGoal } = profile;

    // 1. Basal Metabolic Rate via Mifflin-St Jeor
    // Men: BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
    // Women: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
    let bmr = (10 * currentWeightKg) + (6.25 * heightCm) - (5 * age);
    if (biologicalSex === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    bmr = Math.round(bmr);

    // 2. Physical Activity Multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,          // Little or no exercise
      lightly_active: 1.375,   // Exercise 1-3 times/week
      moderately_active: 1.55, // Exercise 3-5 times/week
      very_active: 1.725,      // Hard exercise 6-7 times/week
      extremely_active: 1.9,   // Very hard exercise, physical job or 2x/day
    };
    const multiplier = activityMultipliers[activityLevel] || 1.375;
    const tdee = Math.round(bmr * multiplier);

    // 3. Goal Adjustment Factor
    let calorieDelta = 0;
    let adjustmentReason = '';

    switch (fitnessGoal) {
      case 'weight_loss':
        // Safe, sustainable 18-20% deficit (approx 350-500 kcal)
        calorieDelta = -Math.min(500, Math.round(tdee * 0.18));
        adjustmentReason = 'Sustainable 18% caloric deficit calibrated to preserve lean skeletal mass while oxidizing adipose tissue.';
        break;
      case 'muscle_gain':
        // Moderate hypercaloric surplus (+12-15% or approx 300 kcal)
        calorieDelta = Math.min(400, Math.round(tdee * 0.12));
        adjustmentReason = 'Hypercaloric lean surplus (+12%) providing amino acids and glycogen for myofibrillar hypertrophy.';
        break;
      case 'lean_muscle':
        // Lean recomposition (+7% or approx 180 kcal)
        calorieDelta = Math.round(tdee * 0.07);
        adjustmentReason = 'Lean recomposition surplus optimizing Muscle Protein Synthesis while preventing excess fat gain.';
        break;
      case 'strength':
        // Slight surplus (+10%) for neuromuscular recovery
        calorieDelta = Math.round(tdee * 0.10);
        adjustmentReason = 'Neuromuscular recovery surplus to maintain peak central nervous system output on heavy axial loads.';
        break;
      case 'endurance':
        calorieDelta = 0;
        adjustmentReason = 'Isocaloric maintenance target paired with high glycogen replenishment to support aerobic VO2 capacity.';
        break;
      case 'maintenance':
      case 'general_fitness':
      default:
        calorieDelta = 0;
        adjustmentReason = 'Neutral energy balance matched to daily Total Daily Energy Expenditure (TDEE).';
        break;
    }

    // Safety Floor: Never drop below 1500 kcal (male) or 1200 kcal (female)
    const minSafeCalories = biologicalSex === 'male' ? 1500 : 1200;
    const dailyCalorieTarget = Math.max(minSafeCalories, tdee + calorieDelta);
    const calorieRange: [number, number] = [dailyCalorieTarget - 75, dailyCalorieTarget + 75];

    return {
      bmr,
      tdee,
      dailyCalorieTarget,
      calorieRange,
      calculationFormula: 'Mifflin-St Jeor Equation [BMR = 10W + 6.25H - 5A ± s] × Activity Factor',
      goalAdjustmentReason: adjustmentReason
    };
  },

  // ----------------------------------------------------------------------------
  // 3. PERSONALIZED MACRONUTRIENT ALLOCATION
  // Protein, Carbs, Fats, Fiber, and Hydration
  // ----------------------------------------------------------------------------
  calculateMacroTargets(profile: BodyProfile, calorieTarget: number): MacroTargets {
    const { currentWeightKg, fitnessGoal, dietaryPreference } = profile;

    // 1. Protein Grams (g/kg):
    // Weight loss (deficit): 2.0 - 2.2 g/kg (protect lean mass)
    // Muscle gain / Strength: 1.8 - 2.0 g/kg
    // General fitness / Maintenance: 1.5 - 1.8 g/kg
    let proteinPerKg = 1.6;
    if (fitnessGoal === 'weight_loss') {
      proteinPerKg = 2.0;
    } else if (fitnessGoal === 'muscle_gain' || fitnessGoal === 'strength' || fitnessGoal === 'lean_muscle') {
      proteinPerKg = 1.9;
    } else if (dietaryPreference === 'high_protein') {
      proteinPerKg = 2.1;
    }

    let proteinGrams = Math.round(currentWeightKg * proteinPerKg);
    const proteinCalories = proteinGrams * 4;

    // 2. Dietary Fats:
    // Essential for hormonal health (testosterone, cell membranes).
    // Allocate 22-25% of total calories to fats, but never below 0.7g/kg.
    const fatCalorieShare = calorieTarget * 0.24;
    let fatsGrams = Math.round(fatCalorieShare / 9);
    const minFatGrams = Math.round(currentWeightKg * 0.75);
    fatsGrams = Math.max(minFatGrams, fatsGrams);
    const fatsCalories = fatsGrams * 9;

    // 3. Carbohydrates:
    // The remaining calories are allocated to carbs (primary anaerobic lifting fuel)
    const remainingCalories = Math.max(200, calorieTarget - (proteinCalories + fatsCalories));
    const carbsGrams = Math.round(remainingCalories / 4);
    const carbsCalories = carbsGrams * 4;

    // 4. Fiber:
    // 14 grams per 1,000 kcal (standard nutritional consensus)
    const fiberGrams = Math.round((calorieTarget / 1000) * 14);

    // 5. Water Intake:
    // 35-45 ml per kg bodyweight + 500ml exercise base
    const waterIntakeMl = Math.round(currentWeightKg * 40 + 500);

    return {
      proteinGrams,
      proteinCalories,
      carbsGrams,
      carbsCalories,
      fatsGrams,
      fatsCalories,
      fiberGrams,
      waterIntakeMl
    };
  },

  // ----------------------------------------------------------------------------
  // 4. PERSONALIZED DIET PLAN GENERATOR (INDIAN & GLOBAL DUAL COMPLIANCE)
  // Generates 5 structured meals with real ingredients and substitutions
  // ----------------------------------------------------------------------------
  generatePersonalizedMealPlan(profile: BodyProfile, calorieTarget: number): DailyMealPlan {
    const { dietaryPreference, budget } = profile;
    const isVeg = dietaryPreference === 'vegetarian' || dietaryPreference === 'vegan';
    const isEggetarian = dietaryPreference === 'eggetarian';
    const isVegan = dietaryPreference === 'vegan';

    // Proportional Meal Distribution:
    // Breakfast: 25% | Mid-Morning: 10% | Lunch: 35% | Evening Snack: 10% | Dinner: 20%
    const bFastCal = Math.round(calorieTarget * 0.25);
    const midMornCal = Math.round(calorieTarget * 0.10);
    const lunchCal = Math.round(calorieTarget * 0.35);
    const eveSnackCal = Math.round(calorieTarget * 0.10);
    const dinnerCal = Math.round(calorieTarget * 0.20);

    const meals: DietMealPlanItem[] = [];

    // --- 1. BREAKFAST ---
    if (isVeg || isEggetarian) {
      if (budget === 'budget') {
        meals.push({
          id: 'meal-bfast-1',
          slot: 'breakfast',
          slotName: 'Breakfast',
          timeEstimate: '08:00 AM',
          dishName: 'Moong Dal Pesarattu & Spiced Mint Chutney',
          portionSize: '2 medium pesarattus (200g) + 2 tbsp chutney',
          calories: bFastCal,
          protein: Math.round(bFastCal * 0.05),
          carbs: Math.round(bFastCal * 0.13),
          fat: Math.round(bFastCal * 0.03),
          fiber: 7,
          ingredients: ['Green gram (moong dal) soaked overnight', 'Ginger, green chili, cumin seeds', 'Mint leaves, coriander, lemon juice', '1 tsp cold-pressed oil'],
          preparationInstructions: 'Grind soaked moong with ginger and green chili into a smooth batter. Spread thinly on a hot seasoned tawa. Cook until golden crisp without excess oil.',
          suitableAlternatives: ['Steamed Idli (3 pcs) + Sambar', 'Vegetable Rava Upma with Roasted Peanuts', 'Besan Chilla with Grated Paneer']
        });
      } else {
        meals.push({
          id: 'meal-bfast-2',
          slot: 'breakfast',
          slotName: 'Breakfast',
          timeEstimate: '08:00 AM',
          dishName: 'Rolled Oats Porridge with Whey, Chia Seeds & Almonds',
          portionSize: '60g rolled oats + 1 scoop protein + 15 almonds',
          calories: bFastCal,
          protein: Math.round(bFastCal * 0.07),
          carbs: Math.round(bFastCal * 0.11),
          fat: Math.round(bFastCal * 0.03),
          fiber: 8,
          ingredients: ['Rolled oats', 'Whey isolate / Plant protein', '15 crushed raw almonds', '1 tsp chia seeds', '1 pinch Ceylon cinnamon powder'],
          preparationInstructions: 'Simmer oats in 250ml water or unsweetened almond milk for 4 minutes. Stir in protein powder post-heat. Garnish with almonds and chia seeds.',
          suitableAlternatives: ['Paneer Stuffed Whole Wheat Paratha (dry-toasted)', 'Sprouts & Poha Bowl']
        });
      }
    } else {
      // Non-veg / High-protein
      meals.push({
        id: 'meal-bfast-3',
        slot: 'breakfast',
        slotName: 'Breakfast',
        timeEstimate: '08:00 AM',
        dishName: 'Masala Scrambled Whole Eggs & 2 Multigrain Toasts',
        portionSize: '2 whole eggs + 2 egg whites + 2 toasted slices',
        calories: bFastCal,
        protein: Math.round(bFastCal * 0.065),
        carbs: Math.round(bFastCal * 0.10),
        fat: Math.round(bFastCal * 0.04),
        fiber: 5,
        ingredients: ['2 whole farm eggs + 2 egg whites', 'Finely chopped onion, tomato, cilantro', '2 slices 100% whole grain bread', 'Black pepper & turmeric'],
        preparationInstructions: 'Whisk eggs with turmeric and onions. Scramble lightly on non-stick pan with minimal oil. Serve with toasted multigrain bread.',
        suitableAlternatives: ['Egg White Bhurji with 2 Chapatis', 'Oatmeal with Boiled Eggs on side']
      });
    }

    // --- 2. MID-MORNING SNACK ---
    meals.push({
      id: 'meal-midmorn',
      slot: 'mid_morning',
      slotName: 'Mid-Morning Refuel',
      timeEstimate: '11:00 AM',
      dishName: 'Fresh Robusta Banana & Roasted Peanuts',
      portionSize: '1 medium banana + 25g roasted peanuts',
      calories: midMornCal,
      protein: Math.round(midMornCal * 0.04),
      carbs: Math.round(midMornCal * 0.15),
      fat: Math.round(midMornCal * 0.04),
      fiber: 4,
      ingredients: ['1 fresh ripe banana', '25g unsalted roasted peanuts with skin'],
      preparationInstructions: 'Zero cooking required. Consume together for an optimal blend of fast glycogen and sustained monounsaturated fats.',
      suitableAlternatives: ['1 Apple + 10 Almonds', '1 Glass Warm Ragi Malt with Buttermilk', 'Papaya Bowl']
    });

    // --- 3. LUNCH (MAIN MACRO ANCHOR) ---
    if (isVeg || isVegan) {
      meals.push({
        id: 'meal-lunch-1',
        slot: 'lunch',
        slotName: 'Nutritional Anchor Lunch',
        timeEstimate: '01:30 PM',
        dishName: 'Ragi Mudde / 2 Phulkas + Soya Chunks Curry + Curd',
        portionSize: '1 Ragi Ball (or 2 Chapatis) + 150g Soya Curry + 1 katori Curd',
        calories: lunchCal,
        protein: Math.round(lunchCal * 0.065),
        carbs: Math.round(lunchCal * 0.12),
        fat: Math.round(lunchCal * 0.03),
        fiber: 10,
        ingredients: ['50g dry soya chunks (boiled & squeezed)', 'Whole wheat or ragi flour', 'Tomato-onion curry base with cumin and garam masala', '150g fresh probiotic curd'],
        preparationInstructions: 'Boil soya chunks in salted water for 5 minutes, rinse and squeeze firmly. Sauté with onion, tomato, and spices. Serve with warm ragi mudde or chapatis and chilled curd.',
        suitableAlternatives: ['Punjabi Rajma Curry with Brown Basmati Rice', 'Paneer Bhurji with 2 Chapatis & Cucumber Salad', 'Kala Chana with Brown Rice']
      });
    } else {
      meals.push({
        id: 'meal-lunch-2',
        slot: 'lunch',
        slotName: 'Nutritional Anchor Lunch',
        timeEstimate: '01:30 PM',
        dishName: 'Tawa Grilled Chicken Breast, Steamed Basmati & Tadka Dal',
        portionSize: '150g grilled chicken + 1 cup rice + 1 bowl yellow dal',
        calories: lunchCal,
        protein: Math.round(lunchCal * 0.075),
        carbs: Math.round(lunchCal * 0.11),
        fat: Math.round(lunchCal * 0.025),
        fiber: 6,
        ingredients: ['150g skinless chicken breast', '1 cup steamed basmati rice', 'Yellow moong dal with turmeric & cumin tadka', 'Raw cucumber & carrot salad'],
        preparationInstructions: 'Marinate chicken breast with yogurt, ginger-garlic paste, and roasted cumin. Sear on a hot tawa for 4-5 mins each side until juicy. Serve alongside dal and rice.',
        suitableAlternatives: ['Steamed Fish Curry with Brown Rice', 'Chicken Keema with 2 Phulkas', 'Boiled Eggs Curry with Rice']
      });
    }

    // --- 4. EVENING SNACK (PRE-WORKOUT POWER) ---
    meals.push({
      id: 'meal-snack',
      slot: 'evening_snack',
      slotName: 'Pre-Workout Activation',
      timeEstimate: '05:30 PM',
      dishName: 'Sprouted Green Moong Chaat with Lemon & Roasted Chana',
      portionSize: '1 medium bowl (120g) + 30g roasted chana',
      calories: eveSnackCal,
      protein: Math.round(eveSnackCal * 0.06),
      carbs: Math.round(eveSnackCal * 0.14),
      fat: Math.round(eveSnackCal * 0.02),
      fiber: 6,
      ingredients: ['Steamed moong sprouts', 'Roasted Bengal gram (chana)', 'Finely diced onion, cucumber, and fresh lemon squeeze', 'Black salt & chaat masala'],
      preparationInstructions: 'Toss sprouts with roasted chana, lemon juice, diced cucumber, and black salt. Provides sustained branch-chain amino acids and complex starch prior to training.',
      suitableAlternatives: ['1 Boiled Egg + 1 Black Coffee', 'Sattu Drink (Roasted Gram Flour with water & lemon)', 'Handful of Walnuts + Green Tea']
    });

    // --- 5. DINNER (RECOVERY & CELLULAR REPAIR) ---
    if (isVeg || isVegan) {
      meals.push({
        id: 'meal-dinner-1',
        slot: 'dinner',
        slotName: 'Recovery Dinner',
        timeEstimate: '08:30 PM',
        dishName: 'Paneer / Tofu Tikka Stir-Fry with Steamed Vegetables & 1 Phulka',
        portionSize: '100g paneer/tofu + 1 cup stir-fried greens + 1 phulka',
        calories: dinnerCal,
        protein: Math.round(dinnerCal * 0.06),
        carbs: Math.round(dinnerCal * 0.10),
        fat: Math.round(dinnerCal * 0.045),
        fiber: 6,
        ingredients: ['100g low-fat fresh paneer or firm tofu cubes', 'Capsicum, broccoli, onions, and mushrooms', '1 whole wheat chapati (dry)', '1 tsp olive oil or ghee'],
        preparationInstructions: 'Toss paneer and vegetables in a wok with oregano, pepper, and pink salt. Keep vegetables crunchy to preserve heat-sensitive micronutrients. Enjoy with 1 warm phulka.',
        suitableAlternatives: ['Lauki (Bottle Gourd) Chana Dal with 1 Chapati', 'Palak Paneer with Jowar Roti']
      });
    } else {
      meals.push({
        id: 'meal-dinner-2',
        slot: 'dinner',
        slotName: 'Recovery Dinner',
        timeEstimate: '08:30 PM',
        dishName: 'Pan-Seared Fish Fillet (Rohu/Salmon) & Steamed Veggies',
        portionSize: '150g fish fillet + 1 cup steamed green beans & carrots + 1 phulka',
        calories: dinnerCal,
        protein: Math.round(dinnerCal * 0.075),
        carbs: Math.round(dinnerCal * 0.08),
        fat: Math.round(dinnerCal * 0.035),
        fiber: 5,
        ingredients: ['150g fresh fish fillet', 'Steamed carrots, green peas, and spinach', 'Lemon herb seasoning with cracked black pepper', '1 chapati'],
        preparationInstructions: 'Season fish fillet with lemon, garlic, and sea salt. Pan-sear on medium heat for 3 minutes per side. Lightly steam mixed greens with olive oil drizzle.',
        suitableAlternatives: ['Grilled Chicken Salad with Olive Oil Vinaigrette', 'Egg White Omelet with Sautéed Spinach & 1 Toast']
      });
    }

    const totalPlanCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
    const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);
    const totalFiber = meals.reduce((sum, m) => sum + m.fiber, 0);

    return {
      id: 'plan-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: `${dietaryPreference.replace('_', ' ').toUpperCase()} High-Efficiency Protocol`,
      summary: `Tailored ${calorieTarget} kcal daily nutrition blueprint emphasizing regional Indian staples, bioavailable proteins, and sustained glycemic index carbs.`,
      targetCalories: calorieTarget,
      totalPlanCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      meals
    };
  },

  // ----------------------------------------------------------------------------
  // 5. TREND INTELLIGENCE & ADAPTIVE PLAN REVIEWS
  // Analyzes weekly weigh-ins to provide constructive feedback
  // ----------------------------------------------------------------------------
  evaluateWeightTrend(
    initialWeightKg: number, 
    currentWeightKg: number, 
    daysElapsed: number, 
    goal: string
  ): NutritionTrendAdvice {
    const weightDiff = currentWeightKg - initialWeightKg;
    const weeklyRate = daysElapsed > 0 ? (weightDiff / (daysElapsed / 7)) : 0;

    if (goal === 'weight_loss') {
      if (weeklyRate < -1.2) {
        // Dropping weight too fast (>1.2 kg/week = risk of lean mass and metabolic slowdown)
        return {
          trendType: 'weight_dropping_fast',
          title: 'Weight Loss Velocity Too Aggressive',
          recommendation: `You are losing approximately ${Math.abs(Math.round(weeklyRate * 10) / 10)} kg per week. Losing faster than 1.0 kg/week increases muscle catabolism and downregulates thyroid T3.`,
          suggestedCalorieDelta: +200,
          action: 'Increase daily intake by +200 kcal from complex carbs and healthy fats.'
        };
      } else if (weeklyRate > 0.2) {
        return {
          trendType: 'weight_rising_fast',
          title: 'Weight Plateau / Upward Fluctuation',
          recommendation: 'Weight has trended upwards slightly over the last period. Verify weekend snacking, liquid calories, and cooking oil measurements.',
          suggestedCalorieDelta: -150,
          action: 'Reduce daily intake by -150 kcal or increase daily non-exercise steps (NEAT) by 2,000 steps.'
        };
      }
    } else if (goal === 'muscle_gain') {
      if (weeklyRate > 0.6) {
        return {
          trendType: 'weight_rising_fast',
          title: 'Surplus Exceeding Muscle Synthesis Rate',
          recommendation: `Weight is increasing at ${Math.round(weeklyRate * 10) / 10} kg per week. Maximum natural muscle synthesis rate is roughly 0.25-0.4 kg/week; the remainder is adipose tissue.`,
          suggestedCalorieDelta: -150,
          action: 'Tighten caloric surplus by -150 kcal to keep gains strictly lean.'
        };
      }
    }

    return {
      trendType: 'weight_stable',
      title: 'Optimal Physiological Trajectory',
      recommendation: 'Your body weight rate of change is in harmony with your primary physiological goal. Maintain current caloric and macronutrient targets.',
      suggestedCalorieDelta: 0,
      action: 'Maintain current nutrition plan and continue logging daily compliance.'
    };
  },

  // ----------------------------------------------------------------------------
  // 6. AI NUTRITION ASSISTANT (CONTEXT-AWARE QUERY PROCESSOR)
  // ----------------------------------------------------------------------------
  processAIQuery(query: string, profile: BodyProfile, energy: EnergyTargets, macros: MacroTargets): AINutritionMessage {
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('pre-workout') || q.includes('before workout') || q.includes('before my workout')) {
      reply = `**Optimal Pre-Workout Protocol for your ${profile.fitnessGoal.replace('_', ' ')} goal:**\n\n` +
        `• **Timing:** 45 to 75 minutes prior to training.\n` +
        `• **Fuel:** 30–50g of easily digestible complex carbohydrates paired with 10–15g lean protein. Low in fat and fiber to prevent gastric distress.\n` +
        `• **Recommended Indian options:** 1 ripe banana with 1 tbsp peanut butter, or 2 steamed idlis with a light pinch of salt, or a warm cup of oatmeal with half a scoop of whey.\n` +
        `• **Hydration:** 400–500ml water with a pinch of Himalayan salt for muscular cell volumization and intracellular pump.`;
    } else if (q.includes('post-workout') || q.includes('after exercising') || q.includes('after workout')) {
      reply = `**Post-Workout Anabolic Recovery Protocol:**\n\n` +
        `• **Timing:** Within 45 to 90 minutes post-training to capitalize on the heightened insulin sensitivity window.\n` +
        `• **Target:** At least 25–35g of bioavailable protein with 2.5g+ leucine to trigger Muscle Protein Synthesis (MPS) via the mTOR pathway.\n` +
        `• **Recommended Options:**\n` +
        `  - *Vegetarian:* 1 scoop Whey Isolate or 150g fresh Curd + 50g Soya Chunks curry with rice.\n` +
        `  - *Non-Vegetarian:* 150g grilled chicken breast or 4 egg whites + 1 whole egg with sweet potato/rice.\n` +
        `  - *Vegan:* Soya protein isolate or Sprouts & Tofu stir-fry.`;
    } else if (q.includes('protein') || q.includes('how much protein')) {
      reply = `Based on your body weight of **${profile.currentWeightKg} kg** and your goal of **${profile.fitnessGoal.replace('_', ' ')}**, your personalized target is **${macros.proteinGrams}g of protein per day** (${Math.round((macros.proteinGrams/profile.currentWeightKg)*10)/10}g per kg).\n\n` +
        `• Distribute this across your ${profile.mealsPerDay || 4} daily meals (approx ${Math.round(macros.proteinGrams / (profile.mealsPerDay || 4))}g per meal).\n` +
        `• High-yield Indian sources: Soya chunks (52g protein/100g dry), Low-fat Paneer (18g/100g), Moong dal (24g/100g raw), Eggs (6g per egg), Chicken breast (31g/100g).`;
    } else if (q.includes('vegetarian') && (q.includes('high protein') || q.includes('meal'))) {
      reply = `**Top Budget-Friendly Indian Vegetarian High-Protein Combinations:**\n\n` +
        `1. **Soya Chunks Bhurji + 2 Whole Wheat Chapatis:** ~32g Protein, 380 kcal. (Extremely affordable).\n` +
        `2. **Sprouted Moong & Paneer Salad:** ~26g Protein, 320 kcal. Tossed with cucumber, lemon, and cumin.\n` +
        `3. **Pesarattu (Moong Dal Dosa) stuffed with Paneer:** ~24g Protein, 350 kcal.\n` +
        `4. **Rajma / Chana Curry + 1 cup Brown Basmati Rice + 1 katori Curd:** ~22g Protein, 460 kcal.`;
    } else if (q.includes('replace') || q.includes('substitute') || q.includes('paneer')) {
      reply = `**Smart Nutritional Substitutions:**\n\n` +
        `• **Replacing 100g Paneer (265 kcal, 18g P, 19g F):**\n` +
        `  - *To save calories and fats:* 100g Firm Tofu (85 kcal, 10g P, 4g F) or 40g dry Soya Chunks (140 kcal, 21g P, 0.5g F).\n` +
        `  - *Non-veg alternative:* 4 Egg Whites (68 kcal, 15g P, 0.2g F) or 100g Chicken Breast (165 kcal, 31g P, 3.5g F).\n` +
        `• **Replacing White Rice:** Equal weight of Quinoa, Foxtail Millet, Ragi Mudde, or Broken Wheat Dalia.`;
    } else if (q.includes('affordable') || q.includes('budget') || q.includes('cheap')) {
      reply = `**Elite Nutrition on a Student / Economy Budget:**\n\n` +
        `You do NOT need expensive imported supplements or exotic berries to achieve an elite physique!\n\n` +
        `1. **Soya Chunks (Nutrela):** ~₹50 for 200g providing a staggering 104g of complete protein.\n` +
        `2. **Roasted Bengal Gram (Chana) & Peanuts:** Exceptional shelf-stable protein and monounsaturated fats.\n` +
        `3. **Eggs:** One of the highest biological value proteins on Earth at ~₹7 per egg.\n` +
        `4. **Local Millets (Ragi, Jowar):** Packed with calcium, magnesium, and slow-burning complex fiber.\n` +
        `5. **Curd (Dahi):** Probiotic gut support and casein protein.`;
    } else {
      reply = `Based on your profile (${profile.currentWeightKg} kg, ${profile.heightCm} cm, Goal: ${profile.fitnessGoal.replace('_', ' ')}):\n\n` +
        `• **Daily Calorie Target:** ${energy.dailyCalorieTarget} kcal\n` +
        `• **Protein Target:** ${macros.proteinGrams}g | **Carbs:** ${macros.carbsGrams}g | **Fats:** ${macros.fatsGrams}g\n` +
        `• **Daily Hydration:** ${Math.round(macros.waterIntakeMl/1000 * 10)/10} Liters\n\n` +
        `Feel free to ask about pre-workout fueling, post-workout recovery, meal substitutions, vegetarian protein hacks, or grocery budgeting!\n\n` +
        `*Disclaimer: This guidance is for fitness performance education and is not a medical diagnosis or clinical prescription. Please consult a qualified registered dietitian or physician for clinical conditions.*`;
    }

    return {
      id: 'ai-msg-' + Date.now(),
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};
