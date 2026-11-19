export type HunterRankTier = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'SSS+';

export interface RankTierDefinition {
  tier: HunterRankTier;
  name: string;
  subtitle: string;
  tierOrder: number;
  minLevel: number;
  maxLevel: number;
  color: string;
  glow: string;
  badgeBg: string;
  borderStyle: string;
  description: string;
}

export interface UserRankProgress {
  currentRank: HunterRankTier;
  currentLevel: number;
  rankXP: number; // Resettable on demotion
  xpForNextLevel: number;
  lifetimeXP: number; // NEVER wiped
  highestRankAchieved: HunterRankTier;
  promotionsCount: number;
  demotionsCount: number;
  updatedAt: string;
}

export type MissionCategory = 'strength' | 'cardio' | 'endurance' | 'recovery' | 'knowledge';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: 'F-Rank' | 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank';
  xpReward: number;
  estimatedDurationMin: number;
  targetMetric: string;
  targetValue: number;
  isRecovery: boolean;
  isCompleted: boolean;
  completedAt?: string;
}

export interface HunterStreak {
  currentStreak: number;
  longestStreak: number;
  graceDaysRemaining: number; // Max 3
  lastCompletedDate?: string;
  lastEvaluatedDate: string;
  isPenaltyTriggered: boolean;
}

export interface RankHistoryEntry {
  id: string;
  date: string;
  eventType: 'promotion' | 'demotion' | 'level_up' | 'penalty_reset';
  fromRank: HunterRankTier;
  toRank: HunterRankTier;
  fromLevel: number;
  toLevel: number;
  reason: string;
  lifetimeXPSnapshot: number;
}

export interface XPTransaction {
  id: string;
  amount: number;
  source: 'daily_mission' | 'workout' | 'bonus_workout' | 'weekly_challenge' | 'consistency' | 'manual' | 'personal_record';
  description: string;
  timestamp: string;
}

export interface HunterNotificationPreferences {
  enabled: boolean;
  intervalHours: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  lastReminderSentAt?: string;
}
