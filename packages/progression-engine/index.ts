// ==============================================================================
// PROJECT ASCEND / KINETIX PROGRESSION ENGINE
// Pure domain logic for Hunter Ranks, Dual XP, Grace Days, & Demotions
// ==============================================================================

import { HunterRankTier, HunterRankProgress, StreakState } from '../shared-types';

export const RANK_TIER_ORDER: HunterRankTier[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'SSS+'];

export const BASE_LEVELS_PER_TIER = 10;

export const XP_FORMULAS = {
  calculateLevelThreshold(rank: HunterRankTier, level: number): number {
    const tierMultiplier: Record<HunterRankTier, number> = {
      F: 1.0,
      E: 1.25,
      D: 1.5,
      C: 1.85,
      B: 2.25,
      A: 2.75,
      S: 3.5,
      SS: 4.5,
      SSS: 6.0,
      'SSS+': 8.0,
    };
    const mult = tierMultiplier[rank] || 1.0;
    return Math.round((200 + level * 50) * mult);
  },

  calculateVolumeXP(totalVolumeKg: number): number {
    // 1 XP per 25 kg lifted
    return Math.min(250, Math.floor(totalVolumeKg / 25));
  },

  calculateStreakBonus(streakDays: number): number {
    if (streakDays >= 30) return 300;
    if (streakDays >= 14) return 150;
    if (streakDays >= 7) return 80;
    if (streakDays >= 3) return 30;
    return 10;
  }
};
