-- ==============================================================================
-- KINETIX FITNESS PLATFORM: HUNTER RANK & FITNESS PROGRESSION SYSTEM SCHEMA
-- ==============================================================================

-- 1. RANK DEFINITIONS
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

-- 2. RANK XP THRESHOLDS (Configurable by Admins)
CREATE TABLE IF NOT EXISTS public.rank_xp_thresholds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rank_tier VARCHAR(10) REFERENCES public.rank_definitions(rank_tier) ON DELETE CASCADE,
    level INT NOT NULL,
    xp_required_for_next INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rank_tier, level)
);

-- 3. USER RANK PROGRESS
CREATE TABLE IF NOT EXISTS public.user_rank_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_rank VARCHAR(10) NOT NULL DEFAULT 'F' REFERENCES public.rank_definitions(rank_tier),
    current_level INT NOT NULL DEFAULT 1,
    rank_xp INT NOT NULL DEFAULT 0, -- Resettable on penalty
    lifetime_xp INT NOT NULL DEFAULT 0, -- NEVER wiped on demotion
    highest_rank_achieved VARCHAR(10) NOT NULL DEFAULT 'F',
    promotions_count INT DEFAULT 0,
    demotions_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DAILY MISSIONS CATALOG
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('strength', 'cardio', 'endurance', 'recovery', 'knowledge')),
    difficulty VARCHAR(20) DEFAULT 'D-Rank',
    xp_reward INT NOT NULL DEFAULT 50,
    estimated_duration_min INT DEFAULT 15,
    target_metric VARCHAR(50), -- e.g. 'pushups', 'squats', 'workout_minutes', 'recovery'
    target_value INT DEFAULT 1,
    is_recovery BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MISSION COMPLETIONS
CREATE TABLE IF NOT EXISTS public.mission_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.daily_missions(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    xp_awarded INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, mission_id, date) -- Prevents duplicate rewards for same mission on same date
);

-- 6. USER STREAKS & GRACE DAYS
CREATE TABLE IF NOT EXISTS public.user_streaks (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    grace_days_remaining INT NOT NULL DEFAULT 3 CHECK (grace_days_remaining BETWEEN 0 AND 3),
    last_completed_date DATE,
    last_evaluated_date DATE DEFAULT CURRENT_DATE,
    streak_frozen BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GRACE DAY USAGE LOG
CREATE TABLE IF NOT EXISTS public.grace_day_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason VARCHAR(255) DEFAULT 'Missed required daily mission',
    grace_days_remaining_after INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RANK HISTORY (Promotions and Demotions Audit)
CREATE TABLE IF NOT EXISTS public.rank_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('promotion', 'demotion', 'level_up', 'penalty_reset')),
    from_rank VARCHAR(10) NOT NULL,
    to_rank VARCHAR(10) NOT NULL,
    from_level INT NOT NULL,
    to_level INT NOT NULL,
    reason TEXT NOT NULL,
    lifetime_xp_snapshot INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. XP TRANSACTIONS (Granular accounting)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    source VARCHAR(50) NOT NULL CHECK (source IN ('daily_mission', 'workout', 'bonus_workout', 'weekly_challenge', 'consistency', 'manual', 'personal_record')),
    reference_id VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATION PREFERENCES & RECURRING LOGS
CREATE TABLE IF NOT EXISTS public.hunter_notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_reminders_enabled BOOLEAN DEFAULT TRUE,
    reminder_interval_hours INT DEFAULT 3 CHECK (reminder_interval_hours BETWEEN 1 AND 12),
    quiet_hours_enabled BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '07:00:00',
    web_push_token TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hunter_notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    reminder_type VARCHAR(50) DEFAULT '3_hour_pending_mission',
    deadline_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_mission_completions_user_date ON public.mission_completions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_rank_history_user ON public.rank_history(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON public.xp_transactions(user_id);

-- RLS POLICIES
ALTER TABLE public.user_rank_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grace_day_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hunter_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own rank progress" ON public.user_rank_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own streak" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own completions" ON public.mission_completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own rank history" ON public.rank_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own XP log" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage notification preferences" ON public.hunter_notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Public read for catalog
ALTER TABLE public.rank_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read rank definitions" ON public.rank_definitions FOR SELECT USING (true);
ALTER TABLE public.rank_xp_thresholds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read xp thresholds" ON public.rank_xp_thresholds FOR SELECT USING (true);
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read daily missions" ON public.daily_missions FOR SELECT USING (is_active = true);

-- SEED DATA: 10 RANK TIERS
INSERT INTO public.rank_definitions (rank_tier, name, subtitle, tier_order, min_level, max_level, base_color, glow_color, description)
VALUES 
    ('F', 'Novice Initiate', 'Unawakened Potential', 1, 1, 10, '#6B7280', 'rgba(107, 114, 128, 0.4)', 'The foundation of the discipline. Forged in routine and basic movement patterns.'),
    ('E', 'Bronze Vanguard', 'Developing Conditioning', 2, 1, 10, '#D97706', 'rgba(217, 119, 6, 0.5)', 'Toughness taking root. Consistent mechanical effort and aerobic adaptation.'),
    ('D', 'Silver Striker', 'Kinetic Awakening', 3, 1, 10, '#9CA3AF', 'rgba(156, 163, 175, 0.5)', 'Neuromuscular pathways firing with rapid intent and power.'),
    ('C', 'Cobalt Specialist', 'Disciplined Power', 4, 1, 10, '#2563EB', 'rgba(37, 99, 235, 0.6)', 'Mastery over compound trajectories and scheduled weekly training density.'),
    ('B', 'Crimson Veteran', 'Relentless Force', 5, 1, 10, '#DC2626', 'rgba(220, 38, 38, 0.6)', 'High-volume endurance and heavy resistance capability.'),
    ('A', 'Golden Sovereign', 'Peak Physicality', 6, 1, 10, '#EAB308', 'rgba(234, 179, 8, 0.7)', 'Sovereign conditioning and muscular symmetry across all energy pathways.'),
    ('S', 'Apex Ascendant', 'Transformed Biomass', 7, 1, 10, '#00F050', 'rgba(0, 240, 80, 0.8)', 'Elite physical specimen. Boundless stamina and extraordinary force output.'),
    ('SS', 'Mythic Shadow', 'Domain of Dominance', 8, 1, 10, '#A855F7', 'rgba(168, 85, 247, 0.85)', 'Superhuman training capacity and unwavering central nervous system resilience.'),
    ('SSS', 'Celestial Paragon', 'The Absolute Pinnacle', 9, 1, 10, '#06B6D4', 'rgba(6, 182, 212, 0.9)', 'An indomitable living engine of pure athletic hegemony.'),
    ('SSS+', 'Transcendent Prime', 'God-Tier Sovereign', 10, 1, 99, '#FF5E1E', 'rgba(255, 94, 30, 1.0)', 'Beyond standard human limitations. Infinite discipline and ultimate kinetic authority.')
ON CONFLICT (rank_tier) DO NOTHING;

-- SEED MISSIONS
INSERT INTO public.daily_missions (title, description, category, difficulty, xp_reward, estimated_duration_min, target_metric, target_value, is_recovery)
VALUES
    ('Morning Awakening Push-Ups', 'Execute 20 strict full-range push-ups with locked core and controlled cadence.', 'strength', 'E-Rank', 40, 5, 'pushups', 20, false),
    ('Deep Air Squat Barrage', 'Perform 30 continuous air squats with hip crease below knee parallel.', 'strength', 'D-Rank', 50, 6, 'squats', 30, false),
    ('Core Kinetic Plank Lock', 'Hold a strict hollow-body floor plank for 90 continuous seconds.', 'endurance', 'D-Rank', 45, 3, 'plank_seconds', 90, false),
    ('Rapid Metabolic Cardio Burst', 'Complete a 15-minute high intensity cardio or jump rope protocol.', 'cardio', 'C-Rank', 80, 15, 'cardio_minutes', 15, false),
    ('Scheduled Parasympathetic Recovery', 'Execute 15 minutes of deep hip opening mobility and nasal breathing regulation.', 'recovery', 'F-Rank', 60, 15, 'recovery_minutes', 15, true)
ON CONFLICT DO NOTHING;
