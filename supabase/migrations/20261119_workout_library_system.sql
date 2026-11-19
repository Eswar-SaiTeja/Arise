-- ==============================================================================
-- KINETIX FITNESS PLATFORM: SCALABLE WORKOUT LIBRARY & BULK INGESTION SYSTEM
-- Supports 3,000 to 50,000+ indexed exercise and workout entries with RLS,
-- GIN full-text search indexing, category governance, and import telemetry.
-- ==============================================================================

-- 1. Workout Categories Table
CREATE TABLE IF NOT EXISTS workout_categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Workout Library Master Table
CREATE TABLE IF NOT EXISTS workout_library (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  normalized_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  primary_muscle VARCHAR(100) NOT NULL,
  secondary_muscles JSONB DEFAULT '[]'::jsonb,
  category VARCHAR(100) NOT NULL,
  equipment_required JSONB DEFAULT '["Bodyweight"]'::jsonb,
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'elite')),
  exercise_type VARCHAR(50) DEFAULT 'compound' CHECK (exercise_type IN ('compound', 'isolation', 'isometric', 'cardiovascular', 'mobility', 'plyometric')),
  step_by_step_execution JSONB DEFAULT '[]'::jsonb,
  recommended_sets INTEGER DEFAULT 3,
  recommended_reps VARCHAR(50) DEFAULT '8-12',
  recommended_duration_sec INTEGER,
  rest_duration_sec INTEGER DEFAULT 60,
  demonstration_image_url TEXT,
  demonstration_video_url TEXT,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  safety_instructions JSONB DEFAULT '[]'::jsonb,
  alternative_exercise_ids JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  environment VARCHAR(50) DEFAULT 'hybrid' CHECK (environment IN ('home', 'gym', 'hybrid')),
  development_level VARCHAR(50) DEFAULT 'beginner' CHECK (development_level IN ('basic', 'beginner', 'advanced')),
  animation_type VARCHAR(50) DEFAULT 'push',
  views_count INTEGER DEFAULT 0,
  imported_from TEXT,
  source_id TEXT,
  search_tokens TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- High-Performance Indexes for 50,000+ Scalability
CREATE INDEX IF NOT EXISTS idx_workout_normalized_name ON workout_library (normalized_name);
CREATE INDEX IF NOT EXISTS idx_workout_category ON workout_library (category);
CREATE INDEX IF NOT EXISTS idx_workout_primary_muscle ON workout_library (primary_muscle);
CREATE INDEX IF NOT EXISTS idx_workout_difficulty ON workout_library (difficulty);
CREATE INDEX IF NOT EXISTS idx_workout_environment ON workout_library (environment);
CREATE INDEX IF NOT EXISTS idx_workout_status ON workout_library (status, is_published);
CREATE INDEX IF NOT EXISTS idx_workout_updated_at ON workout_library (updated_at DESC);

-- GIN Full-Text Search Index
CREATE INDEX IF NOT EXISTS idx_workout_search_tokens ON workout_library USING gin(search_tokens);

-- Trigger to auto-update full-text search tokens
CREATE OR REPLACE FUNCTION update_workout_search_tokens()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_tokens := setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
                       setweight(to_tsvector('english', coalesce(NEW.category, '')), 'B') ||
                       setweight(to_tsvector('english', coalesce(NEW.primary_muscle, '')), 'B') ||
                       setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_workout_search_tokens ON workout_library;
CREATE TRIGGER trigger_workout_search_tokens
  BEFORE INSERT OR UPDATE ON workout_library
  FOR EACH ROW
  EXECUTE FUNCTION update_workout_search_tokens();

-- 3. Workout Import Logs Table
CREATE TABLE IF NOT EXISTS workout_import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_format VARCHAR(20) NOT NULL,
  total_rows INTEGER NOT NULL,
  imported_count INTEGER NOT NULL,
  duplicate_count INTEGER NOT NULL,
  failed_count INTEGER NOT NULL,
  error_details JSONB DEFAULT '[]'::jsonb,
  imported_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Workout Audit Logs Table
CREATE TABLE IF NOT EXISTS workout_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  entity_name TEXT NOT NULL,
  details TEXT,
  performed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. User Favorite Workouts Table
CREATE TABLE IF NOT EXISTS user_favorite_workouts (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id VARCHAR(100) REFERENCES workout_library(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, workout_id)
);

-- 6. Row Level Security (RLS)
ALTER TABLE workout_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_workouts ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read for active categories"
  ON workout_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read for published workouts"
  ON workout_library FOR SELECT
  USING (is_published = true AND status = 'published');

CREATE POLICY "Users can manage own favorite workouts"
  ON user_favorite_workouts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins full management of categories"
  ON workout_categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()::text AND is_admin = true)
  );

CREATE POLICY "Admins full management of workouts"
  ON workout_library FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()::text AND is_admin = true)
  );

CREATE POLICY "Admins view and insert import logs"
  ON workout_import_logs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()::text AND is_admin = true)
  );

CREATE POLICY "Admins view and insert audit logs"
  ON workout_audit_logs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()::text AND is_admin = true)
  );

-- 7. Seed Initial 16 Categories
INSERT INTO workout_categories (id, name, slug, description, display_order) VALUES
  ('cat-chest', 'Chest', 'chest', 'Pectoralis major, minor, and pressing mechanics.', 1),
  ('cat-back', 'Back', 'back', 'Latissimus dorsi, rhomboids, trapezius, and posterior spine.', 2),
  ('cat-shoulders', 'Shoulders', 'shoulders', 'Anterior, lateral, and posterior deltoid force production.', 3),
  ('cat-biceps', 'Biceps', 'biceps', 'Biceps brachii, brachialis, and elbow flexors.', 4),
  ('cat-triceps', 'Triceps', 'triceps', 'Triceps brachii and elbow extension lockout.', 5),
  ('cat-legs', 'Legs', 'legs', 'Quadriceps, hamstrings, adductors, and calves.', 6),
  ('cat-glutes', 'Glutes', 'glutes', 'Gluteus maximus, medius, and hip extension.', 7),
  ('cat-abs-core', 'Abs and Core', 'abs-core', 'Rectus abdominis, obliques, and rotational core stabilization.', 8),
  ('cat-cardio', 'Cardio', 'cardio', 'Aerobic systems, VO2 max, and interval conditioning.', 9),
  ('cat-full-body', 'Full Body', 'full-body', 'Compound multi-joint kinematic chains.', 10),
  ('cat-calisthenics', 'Calisthenics', 'calisthenics', 'Bodyweight relative strength, gymnastic leverage, and bars.', 11),
  ('cat-mobility', 'Mobility', 'mobility', 'Active range of motion and articular joint control.', 12),
  ('cat-yoga', 'Yoga', 'yoga', 'Isometric poses, breath control, and kinetic balance.', 13),
  ('cat-stretching', 'Stretching', 'stretching', 'Static and PNF muscle lengthening protocols.', 14),
  ('cat-functional', 'Functional Training', 'functional-training', 'Multi-planar real-world athletic movement.', 15),
  ('cat-rehab-mobility', 'Rehabilitation-Oriented Mobility', 'rehabilitation-mobility', 'Corrective exercise and joint decompression under clinical guidelines.', 16)
ON CONFLICT (id) DO NOTHING;
