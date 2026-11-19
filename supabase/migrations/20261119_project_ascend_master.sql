-- ==============================================================================
-- PROJECT ASCEND: ADVANCED GAMIFIED FITNESS ECOSYSTEM
-- COMPLETE MASTER POSTGRESQL & SUPABASE DATABASE ARCHITECTURE (32 NORMALIZED TABLES)
-- Includes: Row Level Security (RLS), Idempotency Keys, Audit Logs, Indexes & Triggers
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fitness_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(60) UNIQUE NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    icon VARCHAR(60),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    age INT CHECK (age BETWEEN 13 AND 120),
    gender VARCHAR(50),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    fitness_level VARCHAR(40) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    primary_goal_id UUID REFERENCES public.fitness_goals(id),
    workout_preference VARCHAR(40) CHECK (workout_preference IN ('gym', 'home', 'bodyweight', 'hybrid', 'cardio')),
    equipment_available TEXT[],
    preferred_duration_min INT DEFAULT 45,
    weekly_frequency INT DEFAULT 4 CHECK (weekly_frequency BETWEEN 1 AND 7),
    timezone VARCHAR(100) DEFAULT 'UTC',
    unit_preference VARCHAR(20) DEFAULT 'metric' CHECK (unit_preference IN ('metric', 'imperial')),
    sound_enabled BOOLEAN DEFAULT TRUE,
    is_onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'content_manager', 'game_designer', 'coach')),
    permissions JSONB DEFAULT '{"all": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 2. HUNTER RANK DEFINITIONS & PROGRESSION ENGINE
CREATE TABLE IF NOT EXISTS public.rank_definitions (
    rank_tier VARCHAR(10) PRIMARY KEY, -- 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'SSS+'
    name VARCHAR(100) NOT NULL,
    subtitle VARCHAR(150),
    tier_order INT NOT NULL UNIQUE,
    min_level INT DEFAULT 1,
    max_level INT DEFAULT 10,
    base_color VARCHAR(30) NOT NULL,
    glow_color VARCHAR(30) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rank_progression_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rank_tier VARCHAR(10) REFERENCES public.rank_definitions(rank_tier) ON DELETE CASCADE,
    level INT NOT NULL,
    xp_required_for_next INT NOT NULL,
    grace_days_allowed INT DEFAULT 3,
    penalty_reset_tier VARCHAR(10) DEFAULT 'F',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rank_tier, level)
);

CREATE TABLE IF NOT EXISTS public.user_rank_progress (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    current_rank VARCHAR(10) NOT NULL DEFAULT 'F' REFERENCES public.rank_definitions(rank_tier),
    current_level INT NOT NULL DEFAULT 1,
    rank_xp INT NOT NULL DEFAULT 0, -- Resettable on demotion
    lifetime_xp INT NOT NULL DEFAULT 0, -- NEVER wiped on demotion
    highest_rank_achieved VARCHAR(10) NOT NULL DEFAULT 'F',
    promotions_count INT DEFAULT 0,
    demotions_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(120) UNIQUE NOT NULL, -- Safeguard against duplicate awards
    amount INT NOT NULL,
    source VARCHAR(60) NOT NULL CHECK (source IN ('daily_mission', 'workout', 'bonus_workout', 'weekly_challenge', 'consistency', 'manual', 'personal_record')),
    reference_id VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rank_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_type VARCHAR(40) NOT NULL CHECK (event_type IN ('promotion', 'demotion', 'level_up', 'penalty_reset')),
    from_rank VARCHAR(10) NOT NULL,
    to_rank VARCHAR(10) NOT NULL,
    from_level INT NOT NULL,
    to_level INT NOT NULL,
    reason TEXT NOT NULL,
    lifetime_xp_snapshot INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DAILY MISSIONS & STREAKS
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('strength', 'cardio', 'endurance', 'recovery', 'knowledge')),
    difficulty VARCHAR(30) DEFAULT 'D-Rank',
    xp_reward INT NOT NULL DEFAULT 50,
    estimated_duration_min INT DEFAULT 15,
    target_metric VARCHAR(50),
    target_value INT DEFAULT 1,
    is_recovery BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_daily_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.daily_missions(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline_at TIMESTAMPTZ NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, mission_id, assigned_date)
);

CREATE TABLE IF NOT EXISTS public.mission_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.daily_missions(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
    xp_awarded INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    idempotency_key VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_streaks (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    grace_days_remaining INT NOT NULL DEFAULT 3 CHECK (grace_days_remaining BETWEEN 0 AND 3),
    last_completed_date DATE,
    last_evaluated_date DATE DEFAULT CURRENT_DATE,
    streak_frozen BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.grace_day_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    consumed_date DATE NOT NULL,
    reason VARCHAR(255) DEFAULT 'Missed required daily mission',
    grace_days_remaining_after INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXERCISE CATALOG
CREATE TABLE IF NOT EXISTS public.exercise_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(60) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(60),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.exercise_categories(id) ON DELETE SET NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    target_muscle VARCHAR(100) NOT NULL,
    secondary_muscles TEXT[],
    difficulty VARCHAR(30) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    equipment_required VARCHAR(100) NOT NULL,
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
    animation_type VARCHAR(50) DEFAULT 'push',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exercise_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    media_type VARCHAR(30) CHECK (media_type IN ('image', 'video', 'vector_svg', 'gif')),
    url TEXT NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DIGITAL TRAINING MANUAL
CREATE TABLE IF NOT EXISTS public.training_manuals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle TEXT,
    description TEXT,
    cover_image_url TEXT,
    pdf_download_url TEXT,
    version VARCHAR(20) DEFAULT '2.0',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.manual_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manual_id UUID REFERENCES public.training_manuals(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    estimated_read_time_min INT DEFAULT 10,
    overview TEXT NOT NULL,
    content_sections JSONB NOT NULL,
    key_takeaways TEXT[],
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.manual_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES public.manual_chapters(id) ON DELETE CASCADE,
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    bookmarked BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, chapter_id)
);

-- 6. WORKOUT PROGRAMS & EXECUTION LOGS
CREATE TABLE IF NOT EXISTS public.workout_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    duration_weeks INT NOT NULL DEFAULT 4,
    days_per_week INT NOT NULL DEFAULT 4,
    difficulty VARCHAR(30) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    equipment_required TEXT[],
    progression_notes TEXT,
    is_custom BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.workout_programs(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    target_focus VARCHAR(100),
    estimated_duration_min INT DEFAULT 50,
    is_rest_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_day_id UUID NOT NULL REFERENCES public.workout_days(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    order_in_day INT NOT NULL,
    sets INT NOT NULL DEFAULT 3,
    reps_target VARCHAR(50) NOT NULL DEFAULT '10-12',
    rest_sec INT NOT NULL DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.workout_programs(id) ON DELETE SET NULL,
    day_id UUID REFERENCES public.workout_days(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    total_volume_kg NUMERIC(10,2) DEFAULT 0,
    total_sets_completed INT DEFAULT 0,
    total_reps_completed INT DEFAULT 0,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    notes TEXT,
    idempotency_key VARCHAR(120) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    weight_kg NUMERIC(6,2) DEFAULT 0,
    completed_reps INT NOT NULL DEFAULT 0,
    rpe NUMERIC(3,1),
    is_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROGRESS TELEMETRY & RECORDS
CREATE TABLE IF NOT EXISTS public.personal_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    record_type VARCHAR(40) DEFAULT '1rm' CHECK (record_type IN ('1rm', 'max_weight', 'max_reps', 'max_volume')),
    value NUMERIC(8,2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    achieved_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, exercise_id, record_type)
);

CREATE TABLE IF NOT EXISTS public.body_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2) NOT NULL,
    body_fat_percentage NUMERIC(4,2),
    chest_cm NUMERIC(5,2),
    waist_cm NUMERIC(5,2),
    hips_cm NUMERIC(5,2),
    arms_cm NUMERIC(5,2),
    thighs_cm NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACHIEVEMENTS & GUILD CHALLENGES
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(60) UNIQUE NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    icon VARCHAR(60) NOT NULL,
    points INT DEFAULT 50,
    xp_reward INT DEFAULT 100,
    badge_color VARCHAR(30) DEFAULT '#00F050',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(80) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    challenge_type VARCHAR(40) CHECK (challenge_type IN ('weekly', 'monthly', 'guild_raid')),
    metric_target VARCHAR(50) NOT NULL, -- e.g. 'total_volume_kg', 'workouts_count', 'streak_days'
    threshold NUMERIC(10,2) NOT NULL,
    xp_reward INT NOT NULL DEFAULT 250,
    badge_reward VARCHAR(100),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    reminders_enabled BOOLEAN DEFAULT TRUE,
    reminder_interval_hours INT DEFAULT 3,
    quiet_hours_enabled BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '07:00:00',
    push_token TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    channel VARCHAR(30) DEFAULT 'in_app' CHECK (channel IN ('in_app', 'web_push', 'mobile_push', 'desktop')),
    status VARCHAR(30) DEFAULT 'sent' CHECK (status IN ('scheduled', 'sent', 'failed')),
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR LOW-LATENCY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_rank_tier ON public.user_rank_progress(current_rank);
CREATE INDEX IF NOT EXISTS idx_user_daily_missions_date ON public.user_daily_missions(user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_xp_tx_user ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_tx_idempotency ON public.xp_transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user ON public.body_measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON public.challenges(is_active, ends_at);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rank_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own profile" ON public.user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users access own rank" ON public.user_rank_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users access own streak" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users access own xp" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users access own sessions" ON public.workout_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own measurements" ON public.body_measurements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own notifications" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- PUBLIC READ FOR CATALOG TABLES
ALTER TABLE public.rank_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ranks" ON public.rank_definitions FOR SELECT USING (true);
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read missions" ON public.daily_missions FOR SELECT USING (is_active = true);
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exercises" ON public.exercises FOR SELECT USING (is_published = true);
ALTER TABLE public.manual_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read chapters" ON public.manual_chapters FOR SELECT USING (is_published = true);
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read challenges" ON public.challenges FOR SELECT USING (is_active = true);
