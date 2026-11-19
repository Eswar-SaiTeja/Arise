-- ==============================================================================
-- PROJECT ASCEND / KINETIX: PART 17 NUTRITION & BODY INTELLIGENCE MIGRATION
-- 18 Normalized PostgreSQL Tables with Foreign Keys, Constraints, Indexes & RLS
-- ==============================================================================

-- 1. DIETARY PREFERENCES ENUM & LOOKUP
CREATE TABLE IF NOT EXISTS dietary_preferences (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO dietary_preferences (id, name, description) VALUES
('vegetarian', 'Vegetarian', 'Plant foods, dairy products, no animal flesh or seafood'),
('non_vegetarian', 'Non-Vegetarian', 'Includes poultry, meats, seafood, eggs, dairy, and plants'),
('vegan', 'Vegan', 'Exclusively plant-based foods; zero animal products or dairy'),
('eggetarian', 'Eggetarian', 'Vegetarian diet enriched with whole eggs and egg whites'),
('high_protein', 'High-Protein Performance', 'Protein intake prioritized between 1.8g to 2.2g per kg bodyweight'),
('balanced', 'Balanced Standard', 'Balanced distribution of whole complex starches, lean proteins, and fats')
ON CONFLICT (id) DO NOTHING;

-- 2. FOOD ALLERGIES LOOKUP
CREATE TABLE IF NOT EXISTS food_allergies (
    id VARCHAR(64) PRIMARY KEY,
    allergen_name VARCHAR(128) NOT NULL,
    severity_level VARCHAR(32) DEFAULT 'moderate',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO food_allergies (id, allergen_name, severity_level) VALUES
('peanuts', 'Peanuts & Groundnuts', 'severe'),
('tree_nuts', 'Tree Nuts (Almonds, Walnuts, Cashews)', 'moderate'),
('dairy_lactose', 'Dairy / Lactose Intolerance', 'moderate'),
('gluten', 'Gluten / Celiac Sensitivity', 'severe'),
('soy', 'Soy & Soya Byproducts', 'moderate'),
('shellfish', 'Crustaceans & Shellfish', 'severe'),
('eggs', 'Eggs & Ovalbumin', 'moderate')
ON CONFLICT (id) DO NOTHING;

-- 3. BODY PROFILES (Individual physical anthropometry and goals)
CREATE TABLE IF NOT EXISTS body_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    age INT NOT NULL CHECK (age >= 10 AND age <= 120),
    biological_sex VARCHAR(16) NOT NULL CHECK (biological_sex IN ('male', 'female')),
    height_cm NUMERIC(5, 2) NOT NULL CHECK (height_cm > 50 AND height_cm < 300),
    current_weight_kg NUMERIC(5, 2) NOT NULL CHECK (current_weight_kg > 20 AND current_weight_kg < 500),
    target_weight_kg NUMERIC(5, 2) NOT NULL,
    activity_level VARCHAR(32) NOT NULL DEFAULT 'moderately_active',
    fitness_goal VARCHAR(32) NOT NULL DEFAULT 'muscle_gain',
    dietary_preference_id VARCHAR(64) REFERENCES dietary_preferences(id),
    budget_tier VARCHAR(32) NOT NULL DEFAULT 'budget' CHECK (budget_tier IN ('budget', 'standard', 'premium')),
    meals_per_day INT NOT NULL DEFAULT 4 CHECK (meals_per_day BETWEEN 2 AND 7),
    workout_schedule TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_body_profile UNIQUE (user_id)
);

-- 4. BODY MEASUREMENTS (Periodic anthropometric dimensions)
CREATE TABLE IF NOT EXISTS body_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5, 2) NOT NULL,
    waist_cm NUMERIC(5, 2),
    chest_cm NUMERIC(5, 2),
    hips_cm NUMERIC(5, 2),
    arms_cm NUMERIC(5, 2),
    thighs_cm NUMERIC(5, 2),
    progress_photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BMI HISTORY
CREATE TABLE IF NOT EXISTS bmi_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    weight_kg NUMERIC(5, 2) NOT NULL,
    height_cm NUMERIC(5, 2) NOT NULL,
    bmi_value NUMERIC(4, 1) NOT NULL,
    category VARCHAR(32) NOT NULL CHECK (category IN ('underweight', 'healthy', 'overweight', 'obesity')),
    min_healthy_weight_kg NUMERIC(5, 2) NOT NULL,
    max_healthy_weight_kg NUMERIC(5, 2) NOT NULL,
    is_pediatric BOOLEAN DEFAULT FALSE,
    advisory_notice TEXT
);

-- 6. NUTRITION PROFILES
CREATE TABLE IF NOT EXISTS nutrition_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    bmr_kcal INT NOT NULL,
    tdee_kcal INT NOT NULL,
    daily_calorie_target INT NOT NULL,
    calorie_floor INT NOT NULL,
    calorie_ceiling INT NOT NULL,
    formula_used VARCHAR(128) DEFAULT 'Mifflin-St Jeor',
    sync_with_workouts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_nutrition_profile UNIQUE (user_id)
);

-- 7. CALORIE TARGETS
CREATE TABLE IF NOT EXISTS calorie_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    training_day_calories INT NOT NULL,
    rest_day_calories INT NOT NULL,
    deficit_surplus_delta INT NOT NULL,
    reasoning TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MACRO TARGETS
CREATE TABLE IF NOT EXISTS macro_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    protein_grams INT NOT NULL,
    carbs_grams INT NOT NULL,
    fat_grams INT NOT NULL,
    fiber_grams INT NOT NULL,
    water_ml INT NOT NULL DEFAULT 3500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FOOD DATABASE
CREATE TABLE IF NOT EXISTS food_database (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    regional_name VARCHAR(255),
    category VARCHAR(64) NOT NULL,
    cuisine VARCHAR(64) NOT NULL DEFAULT 'indian',
    is_vegetarian BOOLEAN NOT NULL DEFAULT TRUE,
    is_vegan BOOLEAN NOT NULL DEFAULT FALSE,
    is_eggetarian BOOLEAN NOT NULL DEFAULT TRUE,
    serving_unit VARCHAR(128) NOT NULL,
    serving_grams NUMERIC(6, 2) NOT NULL,
    affordability VARCHAR(32) NOT NULL DEFAULT 'budget',
    image_url TEXT,
    verified_by_nutritionist BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FOOD NUTRIENTS (Per serving)
CREATE TABLE IF NOT EXISTS food_nutrients (
    food_id VARCHAR(64) PRIMARY KEY REFERENCES food_database(id) ON DELETE CASCADE,
    calories INT NOT NULL,
    protein_grams NUMERIC(5, 2) NOT NULL,
    carbs_grams NUMERIC(5, 2) NOT NULL,
    fat_grams NUMERIC(5, 2) NOT NULL,
    fiber_grams NUMERIC(5, 2) NOT NULL DEFAULT 0,
    sodium_mg NUMERIC(6, 2),
    potassium_mg NUMERIC(6, 2),
    calcium_mg NUMERIC(6, 2)
);

-- 11. MEAL PLANS
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    target_calories INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. MEAL PLAN DAYS
CREATE TABLE IF NOT EXISTS meal_plan_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    day_name VARCHAR(32) NOT NULL DEFAULT 'Daily Template',
    total_day_calories INT NOT NULL
);

-- 13. MEAL PLAN ITEMS
CREATE TABLE IF NOT EXISTS meal_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_day_id UUID NOT NULL REFERENCES meal_plan_days(id) ON DELETE CASCADE,
    meal_slot VARCHAR(32) NOT NULL CHECK (meal_slot IN ('breakfast', 'mid_morning', 'lunch', 'evening_snack', 'dinner')),
    time_estimate VARCHAR(32),
    dish_name VARCHAR(255) NOT NULL,
    portion_size VARCHAR(128) NOT NULL,
    calories INT NOT NULL,
    protein_g NUMERIC(5, 1) NOT NULL,
    carbs_g NUMERIC(5, 1) NOT NULL,
    fat_g NUMERIC(5, 1) NOT NULL,
    fiber_g NUMERIC(5, 1) NOT NULL DEFAULT 0,
    ingredients JSONB DEFAULT '[]'::jsonb,
    prep_instructions TEXT,
    suitable_alternatives JSONB DEFAULT '[]'::jsonb
);

-- 14. FOOD SUBSTITUTIONS
CREATE TABLE IF NOT EXISTS food_substitutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_food_id VARCHAR(64) REFERENCES food_database(id) ON DELETE CASCADE,
    replacement_food_id VARCHAR(64) REFERENCES food_database(id) ON DELETE CASCADE,
    substitution_reason VARCHAR(128),
    conversion_ratio NUMERIC(4, 2) DEFAULT 1.0
);

-- 15. DAILY FOOD LOGS
CREATE TABLE IF NOT EXISTS daily_food_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_slot VARCHAR(32) NOT NULL CHECK (meal_slot IN ('breakfast', 'mid_morning', 'lunch', 'evening_snack', 'dinner')),
    food_id VARCHAR(64) REFERENCES food_database(id),
    food_name VARCHAR(255) NOT NULL,
    portion_quantity NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
    serving_unit VARCHAR(128) NOT NULL,
    calories INT NOT NULL,
    protein_g NUMERIC(5, 1) NOT NULL,
    carbs_g NUMERIC(5, 1) NOT NULL,
    fat_g NUMERIC(5, 1) NOT NULL,
    fiber_g NUMERIC(5, 1) NOT NULL DEFAULT 0,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. DAILY NUTRITION SUMMARIES
CREATE TABLE IF NOT EXISTS daily_nutrition_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    summary_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_calories INT NOT NULL DEFAULT 0,
    total_protein_g NUMERIC(6, 1) NOT NULL DEFAULT 0,
    total_carbs_g NUMERIC(6, 1) NOT NULL DEFAULT 0,
    total_fat_g NUMERIC(6, 1) NOT NULL DEFAULT 0,
    total_fiber_g NUMERIC(6, 1) NOT NULL DEFAULT 0,
    total_water_ml INT NOT NULL DEFAULT 0,
    calorie_goal_met BOOLEAN DEFAULT FALSE,
    protein_goal_met BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_user_daily_summary UNIQUE (user_id, summary_date)
);

-- 17. WATER INTAKE LOGS
CREATE TABLE IF NOT EXISTS water_intake_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount_ml INT NOT NULL CHECK (amount_ml > 0),
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. NUTRITION RECOMMENDATIONS (AI & Clinical Algorithmic Advices)
CREATE TABLE IF NOT EXISTS nutrition_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    trend_type VARCHAR(64) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    recommendation_body TEXT NOT NULL,
    suggested_calorie_delta INT DEFAULT 0,
    action_prompt VARCHAR(255),
    is_acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR LOW-LATENCY QUERYING
CREATE INDEX IF NOT EXISTS idx_body_measurements_user ON body_measurements(user_id, measurement_date DESC);
CREATE INDEX IF NOT EXISTS idx_bmi_history_user ON bmi_history(user_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_food_logs_user_date ON daily_food_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_water_intake_user_date ON water_intake_logs(user_id, log_date);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE body_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmi_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calorie_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE macro_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_nutrition_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own body profile" ON body_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own body measurements" ON body_measurements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own bmi history" ON bmi_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own nutrition profile" ON nutrition_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own calorie targets" ON calorie_targets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own macro targets" ON macro_targets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meal plans" ON meal_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily food logs" ON daily_food_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily nutrition summary" ON daily_nutrition_summaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own water intake" ON water_intake_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own nutrition recommendations" ON nutrition_recommendations FOR ALL USING (auth.uid() = user_id);
