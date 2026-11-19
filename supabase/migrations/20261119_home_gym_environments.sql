-- ==============================================================================
-- KINETIX FITNESS PLATFORM: TRAINING ENVIRONMENTS & DEVELOPMENT TIERS MIGRATION
-- Adds HOME MODE and GYM MODE orthogonal environments, progression tracking,
-- and biomechanical exercise substitution engine.
-- ==============================================================================

-- 1. Extend user_profiles with training_environment and development_level
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'training_environment'
  ) THEN
    ALTER TABLE user_profiles 
      ADD COLUMN training_environment VARCHAR(20) DEFAULT 'gym' 
      CHECK (training_environment IN ('home', 'gym'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'development_level'
  ) THEN
    ALTER TABLE user_profiles 
      ADD COLUMN development_level VARCHAR(20) DEFAULT 'beginner' 
      CHECK (development_level IN ('basic', 'beginner', 'advanced'));
  END IF;
END $$;

-- 2. Extend exercises with environment and development_level
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exercises' AND column_name = 'environment'
  ) THEN
    ALTER TABLE exercises 
      ADD COLUMN environment VARCHAR(20) DEFAULT 'hybrid' 
      CHECK (environment IN ('home', 'gym', 'hybrid'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exercises' AND column_name = 'development_level'
  ) THEN
    ALTER TABLE exercises 
      ADD COLUMN development_level VARCHAR(20) DEFAULT 'beginner' 
      CHECK (development_level IN ('basic', 'beginner', 'advanced'));
  END IF;
END $$;

-- 3. Environment Progression Table
CREATE TABLE IF NOT EXISTS environment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  environment VARCHAR(20) NOT NULL CHECK (environment IN ('home', 'gym')),
  development_level VARCHAR(20) NOT NULL CHECK (development_level IN ('basic', 'beginner', 'advanced')),
  workouts_completed INTEGER DEFAULT 0,
  workouts_required INTEGER DEFAULT 12,
  technique_verified BOOLEAN DEFAULT false,
  streak_days_at_level INTEGER DEFAULT 0,
  benchmarks_passed JSONB DEFAULT '[]'::jsonb,
  unlocked_levels JSONB DEFAULT '["basic"]'::jsonb,
  last_promoted_at TIMESTAMPTZ,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, environment)
);

-- 4. Exercise Substitutions Table
CREATE TABLE IF NOT EXISTS exercise_substitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_exercise_id VARCHAR(100) NOT NULL,
  original_exercise_name TEXT NOT NULL,
  substitute_exercise_id VARCHAR(100) NOT NULL,
  substitute_exercise_name TEXT NOT NULL,
  environment VARCHAR(20) NOT NULL CHECK (environment IN ('home', 'gym')),
  equipment_condition TEXT NOT NULL,
  biomechanical_match TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Row Level Security (RLS)
ALTER TABLE environment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_substitutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own environment progress"
  ON environment_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can read exercise substitutions"
  ON exercise_substitutions
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage exercise substitutions"
  ON exercise_substitutions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()::text AND user_profiles.is_admin = true
    )
  );

-- 6. Seed Initial Substitutions
INSERT INTO exercise_substitutions (
  original_exercise_id, original_exercise_name,
  substitute_exercise_id, substitute_exercise_name,
  environment, equipment_condition, biomechanical_match
) VALUES
  (
    'ex-pullup', 'Strict Overhand Pull-Up',
    'ex-doorframe-row', 'Doorframe Towel Row / Table Inverted Row',
    'home', 'When no overhead pull-up bar is available at home',
    'Latissimus dorsi and rhomboid horizontal/vertical pulling action'
  ),
  (
    'ex-parallel-bar-dips', 'Parallel Bar Triceps & Chest Dips',
    'ex-chair-dips', 'Elevated Chair / Bench Dips',
    'home', 'When parallel dip bars are unavailable at home',
    'Triceps brachii and sternal pectoralis extension'
  ),
  (
    'ex-barbell-back-squat', 'Barbell Back Squat',
    'ex-bulgarian-split-squat', 'Elevated Bulgarian Split Squats',
    'home', 'When heavy barbell rack is unavailable at home',
    'Quadriceps and gluteus maximus unilateral overload'
  ),
  (
    'ex-barbell-bench', 'Barbell Flat Bench Press',
    'ex-decline-pushup', 'Decline Feet-Elevated Push-Ups / Floor Press',
    'home', 'When bench press station is unavailable at home',
    'Horizontal pressing with clavicular and sternal pectoral focus'
  ),
  (
    'ex-barbell-back-squat', 'Barbell Back Squat',
    'ex-leg-press', '45-Degree Machine Leg Press',
    'gym', 'When squat racks are occupied or lower back deload is required',
    'Quadriceps and glute extension with reduced lumbar shear'
  ),
  (
    'ex-barbell-bench', 'Barbell Flat Bench Press',
    'ex-machine-chest-press', 'Selectorized Machine Chest Press',
    'gym', 'When flat barbell stations are occupied or solo training without spotter',
    'Guided pectoral horizontal adduction with safety lockout'
  ),
  (
    'ex-cable-face-pull', 'Cable Face Pull with External Rotation',
    'ex-standing-mobility', 'Standing Thoracic Rotations & Prone Raises',
    'gym', 'When cable columns are busy',
    'Posterior deltoid and rotator cuff infraspinatus external rotation'
  )
ON CONFLICT DO NOTHING;
