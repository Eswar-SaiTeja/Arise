-- ==============================================================================
-- KINETIX FITNESS PLATFORM: COMPLETE POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Inspired by ARISE Training Experience with Full Multi-Tenant & RLS Support
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FITNESS GOALS LOOKUP
CREATE TABLE IF NOT EXISTS public.fitness_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    avatar_url TEXT,
    age INT CHECK (age >= 13 AND age <= 120),
    gender VARCHAR(50),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    fitness_level VARCHAR(50) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    primary_goal_id UUID REFERENCES public.fitness_goals(id),
    workout_preference VARCHAR(50) CHECK (workout_preference IN ('gym', 'home', 'bodyweight', 'hybrid', 'cardio')),
    equipment_available TEXT[], -- e.g. ['dumbbells', 'barbell', 'bench', 'pullup_bar']
    preferred_duration_min INT DEFAULT 45,
    weekly_frequency INT DEFAULT 4 CHECK (weekly_frequency BETWEEN 1 AND 7),
    is_admin BOOLEAN DEFAULT FALSE,
    is_onboarded BOOLEAN DEFAULT FALSE,
    streak_count INT DEFAULT 0,
    last_active_at TIMESTAMPTZ,
    unit_preference VARCHAR(20) DEFAULT 'metric' CHECK (unit_preference IN ('metric', 'imperial')),
    sound_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMIN ROLES
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'content_editor', 'coach', 'support')),
    permissions JSONB DEFAULT '{"all": true}'::jsonb,
    granted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 4. EXERCISE CATEGORIES
CREATE TABLE IF NOT EXISTS public.exercise_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(60) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(60),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXERCISES
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.exercise_categories(id) ON DELETE SET NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    target_muscle VARCHAR(100) NOT NULL,
    secondary_muscles TEXT[], -- e.g. ['Triceps', 'Shoulders']
    difficulty VARCHAR(30) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    equipment_required VARCHAR(100) NOT NULL, -- e.g. 'Dumbbells', 'Barbell', 'Bodyweight', etc.
    starting_position TEXT NOT NULL,
    step_by_step_execution TEXT[] NOT NULL,
    breathing_technique TEXT NOT NULL,
    recommended_sets INT DEFAULT 3,
    recommended_reps VARCHAR(50) DEFAULT '8-12',
    rest_duration_sec INT DEFAULT 60,
    common_mistakes TEXT[] NOT NULL,
    safety_instructions TEXT[] NOT NULL,
    thumbnail_url TEXT,
    video_url TEXT,
    animation_type VARCHAR(50) DEFAULT 'svg_vector',
    is_published BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EXERCISE MEDIA
CREATE TABLE IF NOT EXISTS public.exercise_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    media_type VARCHAR(30) CHECK (media_type IN ('image', 'video', 'gif', 'vector')),
    url TEXT NOT NULL,
    caption VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRAINING MANUALS
CREATE TABLE IF NOT EXISTS public.training_manuals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle TEXT,
    description TEXT,
    cover_image_url TEXT,
    pdf_download_url TEXT,
    version VARCHAR(20) DEFAULT '1.0',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MANUAL CHAPTERS
CREATE TABLE IF NOT EXISTS public.manual_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manual_id UUID REFERENCES public.training_manuals(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    estimated_read_time_min INT DEFAULT 10,
    overview TEXT NOT NULL,
    content_sections JSONB NOT NULL, -- Array of structured sections { title, content, tips, mistakes, safety, image_url }
    key_takeaways TEXT[],
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. WORKOUT PROGRAMS
CREATE TABLE IF NOT EXISTS public.workout_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    duration_weeks INT NOT NULL DEFAULT 4,
    days_per_week INT NOT NULL DEFAULT 4,
    difficulty VARCHAR(30) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    primary_goal_id UUID REFERENCES public.fitness_goals(id),
    target_audience TEXT,
    equipment_required TEXT[],
    progression_notes TEXT,
    cover_image_url TEXT,
    is_custom BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT TRUE,
    enrolled_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. WORKOUT DAYS
CREATE TABLE IF NOT EXISTS public.workout_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.workout_programs(id) ON DELETE CASCADE,
    day_number INT NOT NULL, -- e.g. 1 to 7
    week_number INT DEFAULT 1,
    title VARCHAR(150) NOT NULL, -- e.g. 'Day 1: Chest & Triceps Hypertrophy'
    description TEXT,
    target_focus VARCHAR(100),
    estimated_duration_min INT DEFAULT 50,
    is_rest_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. WORKOUT EXERCISES
CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_day_id UUID NOT NULL REFERENCES public.workout_days(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    order_in_day INT NOT NULL,
    sets INT NOT NULL DEFAULT 3,
    reps_target VARCHAR(50) NOT NULL DEFAULT '10-12',
    rest_sec INT NOT NULL DEFAULT 60,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. WORKOUT SESSIONS (Logs of actual training)
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.workout_programs(id) ON DELETE SET NULL,
    workout_day_id UUID REFERENCES public.workout_days(id) ON DELETE SET NULL,
    custom_title VARCHAR(150),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    total_volume_kg NUMERIC(10,2) DEFAULT 0,
    total_sets_completed INT DEFAULT 0,
    total_reps_completed INT DEFAULT 0,
    notes TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. WORKOUT SETS (Granular logged sets)
CREATE TABLE IF NOT EXISTS public.workout_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    weight_kg NUMERIC(6,2) DEFAULT 0,
    target_reps INT,
    completed_reps INT NOT NULL DEFAULT 0,
    rpe NUMERIC(3,1), -- Rate of Perceived Exertion (1.0 to 10.0)
    is_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. EXERCISE RECORDS (PRs)
CREATE TABLE IF NOT EXISTS public.exercise_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    record_type VARCHAR(50) DEFAULT '1rm' CHECK (record_type IN ('1rm', 'max_weight', 'max_reps', 'max_volume')),
    value NUMERIC(8,2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    achieved_at TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID REFERENCES public.workout_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, exercise_id, record_type)
);

-- 15. BODY MEASUREMENTS
CREATE TABLE IF NOT EXISTS public.body_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    weight_kg NUMERIC(5,2),
    body_fat_percentage NUMERIC(4,2),
    chest_cm NUMERIC(5,2),
    waist_cm NUMERIC(5,2),
    hips_cm NUMERIC(5,2),
    left_arm_cm NUMERIC(5,2),
    right_arm_cm NUMERIC(5,2),
    left_thigh_cm NUMERIC(5,2),
    right_thigh_cm NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('exercise', 'manual_chapter', 'workout_program')),
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- 17. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('reminder', 'streak', 'achievement', 'system', 'workout')),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(60) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    icon VARCHAR(60) NOT NULL,
    points INT DEFAULT 50,
    requirement_type VARCHAR(50) NOT NULL, -- e.g. 'workouts_completed', 'streak_days', 'total_volume'
    requirement_threshold NUMERIC(10,2) NOT NULL,
    badge_color VARCHAR(30) DEFAULT '#00F050',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 20. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_workout_days_program ON public.workout_days(program_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_day ON public.workout_exercises(workout_day_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_status ON public.workout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_workout_sets_session ON public.workout_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user ON public.body_measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- User Profile Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public Read for Catalog Data
ALTER TABLE public.fitness_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read fitness goals" ON public.fitness_goals FOR SELECT USING (true);

ALTER TABLE public.exercise_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exercise categories" ON public.exercise_categories FOR SELECT USING (true);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exercises" ON public.exercises FOR SELECT USING (is_published = true);

ALTER TABLE public.training_manuals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read manuals" ON public.training_manuals FOR SELECT USING (is_published = true);

ALTER TABLE public.manual_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read chapters" ON public.manual_chapters FOR SELECT USING (is_published = true);

ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published programs" ON public.workout_programs FOR SELECT USING (is_published = true OR created_by = auth.uid());

ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read workout days" ON public.workout_days FOR SELECT USING (true);

ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read workout exercises" ON public.workout_exercises FOR SELECT USING (true);

-- User workout data policies
CREATE POLICY "Users view own sessions" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own sets" ON public.workout_sets FOR SELECT 
    USING (session_id IN (SELECT id FROM public.workout_sessions WHERE user_id = auth.uid()));
CREATE POLICY "Users insert own sets" ON public.workout_sets FOR INSERT 
    WITH CHECK (session_id IN (SELECT id FROM public.workout_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users view own records" ON public.exercise_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own measurements" ON public.body_measurements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- Admin Bypass Trigger / Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
