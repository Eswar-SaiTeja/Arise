import { 
  HunterRankTier, 
  RankTierDefinition, 
  UserRankProgress, 
  DailyMission, 
  HunterStreak, 
  RankHistoryEntry, 
  XPTransaction,
  HunterNotificationPreferences
} from '../types/hunter';
import { storageService } from './storageService';
import { audioService } from './audioService';

export const RANK_DEFINITIONS: Record<HunterRankTier, RankTierDefinition> = {
  'F': {
    tier: 'F',
    name: 'Novice Initiate',
    subtitle: 'Unawakened Potential',
    tierOrder: 1,
    minLevel: 1,
    maxLevel: 10,
    color: '#9CA3AF', // Slate Silver
    glow: 'rgba(156, 163, 175, 0.4)',
    badgeBg: 'from-gray-700/40 to-gray-900/80',
    borderStyle: 'border-gray-500/40',
    description: 'The foundation of the discipline. Forged in routine and fundamental movement mastery.'
  },
  'E': {
    tier: 'E',
    name: 'Bronze Vanguard',
    subtitle: 'Physical Resilience',
    tierOrder: 2,
    minLevel: 1,
    maxLevel: 10,
    color: '#D97706', // Burnished Bronze
    glow: 'rgba(217, 119, 6, 0.5)',
    badgeBg: 'from-amber-800/40 to-amber-950/80',
    borderStyle: 'border-amber-600/40',
    description: 'Toughness taking root. Consistent mechanical effort and aerobic adaptation.'
  },
  'D': {
    tier: 'D',
    name: 'Silver Striker',
    subtitle: 'Kinetic Awakening',
    tierOrder: 3,
    minLevel: 1,
    maxLevel: 10,
    color: '#CBD5E1', // Polished Silver
    glow: 'rgba(203, 213, 225, 0.5)',
    badgeBg: 'from-slate-600/40 to-slate-900/80',
    borderStyle: 'border-slate-400/50',
    description: 'Neuromuscular pathways firing with rapid intent, force generation, and rhythm.'
  },
  'C': {
    tier: 'C',
    name: 'Cobalt Specialist',
    subtitle: 'Disciplined Power',
    tierOrder: 4,
    minLevel: 1,
    maxLevel: 10,
    color: '#3B82F6', // Cobalt Electric Blue
    glow: 'rgba(59, 130, 246, 0.6)',
    badgeBg: 'from-blue-800/40 to-blue-950/80',
    borderStyle: 'border-blue-500/50',
    description: 'Mastery over compound trajectories and scheduled weekly training density.'
  },
  'B': {
    tier: 'B',
    name: 'Crimson Veteran',
    subtitle: 'Relentless Force',
    tierOrder: 5,
    minLevel: 1,
    maxLevel: 10,
    color: '#EF4444', // Crimson Bloodstone
    glow: 'rgba(239, 68, 68, 0.65)',
    badgeBg: 'from-red-900/40 to-red-950/80',
    borderStyle: 'border-red-500/50',
    description: 'High-volume work capacity and heavy multi-joint resistance capability.'
  },
  'A': {
    tier: 'A',
    name: 'Golden Sovereign',
    subtitle: 'Peak Physicality',
    tierOrder: 6,
    minLevel: 1,
    maxLevel: 10,
    color: '#F59E0B', // Radiant Imperial Gold
    glow: 'rgba(245, 158, 11, 0.75)',
    badgeBg: 'from-yellow-700/40 to-amber-950/80',
    borderStyle: 'border-yellow-400/60',
    description: 'Sovereign conditioning and muscular symmetry across all energy pathways.'
  },
  'S': {
    tier: 'S',
    name: 'Apex Ascendant',
    subtitle: 'Transformed Biomass',
    tierOrder: 7,
    minLevel: 1,
    maxLevel: 10,
    color: '#00F050', // Electric Neon Lime
    glow: 'rgba(0, 240, 80, 0.85)',
    badgeBg: 'from-emerald-900/50 via-[#102816] to-[#0A140E]',
    borderStyle: 'border-lime-accent/70 shadow-glow-lime',
    description: 'Elite physical specimen. Boundless stamina and extraordinary force output.'
  },
  'SS': {
    tier: 'SS',
    name: 'Mythic Shadow',
    subtitle: 'Domain of Dominance',
    tierOrder: 8,
    minLevel: 1,
    maxLevel: 10,
    color: '#A855F7', // Ultraviolet Nebula
    glow: 'rgba(168, 85, 247, 0.9)',
    badgeBg: 'from-purple-900/50 via-[#220E38] to-[#0D0517]',
    borderStyle: 'border-purple-500/70 shadow-glow-purple',
    description: 'Superhuman training capacity and unwavering central nervous system resilience.'
  },
  'SSS': {
    tier: 'SSS',
    name: 'Celestial Paragon',
    subtitle: 'The Absolute Pinnacle',
    tierOrder: 9,
    minLevel: 1,
    maxLevel: 10,
    color: '#06B6D4', // Celestial Cyan Prismatic
    glow: 'rgba(6, 182, 212, 0.95)',
    badgeBg: 'from-cyan-900/50 via-[#0E2833] to-[#051117]',
    borderStyle: 'border-cyan-400/80',
    description: 'An indomitable living engine of pure athletic hegemony.'
  },
  'SSS+': {
    tier: 'SSS+',
    name: 'Transcendent Prime',
    subtitle: 'God-Tier Sovereign',
    tierOrder: 10,
    minLevel: 1,
    maxLevel: 99,
    color: '#FF5E1E', // Blazing Solar Flare
    glow: 'rgba(255, 94, 30, 1.0)',
    badgeBg: 'from-orange-900/60 via-[#331105] to-[#140602]',
    borderStyle: 'border-orange-500 shadow-glow-orange ring-1 ring-orange-400/80',
    description: 'Beyond standard biological limits. Infinite discipline and ultimate kinetic authority.'
  }
};

export const RANK_ORDER: HunterRankTier[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'SSS+'];

const STORAGE_KEYS = {
  RANK_PROGRESS: 'kinetix_hunter_rank_progress',
  STREAK: 'kinetix_hunter_streak',
  MISSIONS: 'kinetix_hunter_daily_missions',
  MISSIONS_DATE: 'kinetix_hunter_missions_date',
  HISTORY: 'kinetix_hunter_rank_history',
  TRANSACTIONS: 'kinetix_hunter_xp_transactions',
  PREFERENCES: 'kinetix_hunter_preferences',
  MODE_DIFFICULTY: 'kinetix_mode_difficulty_config',
};

export interface ModeDifficultyParams {
  name: string;
  targetMultiplier: number;
  xpMultiplier: number;
  pushupTarget: number;
  squatTarget: number;
  cardioMinutes: number;
  mobilityMinutes: number;
}

export interface ModeDifficultyConfig {
  easy: ModeDifficultyParams;
  normal: ModeDifficultyParams;
  hell: ModeDifficultyParams;
  hard: ModeDifficultyParams;
}

export const DEFAULT_MODE_DIFFICULTY: ModeDifficultyConfig = {
  easy: {
    name: 'EASY MODE',
    targetMultiplier: 0.75,
    xpMultiplier: 1.0,
    pushupTarget: 15,
    squatTarget: 25,
    cardioMinutes: 10,
    mobilityMinutes: 8,
  },
  normal: {
    name: 'NORMAL MODE',
    targetMultiplier: 1.0,
    xpMultiplier: 1.0,
    pushupTarget: 25,
    squatTarget: 40,
    cardioMinutes: 15,
    mobilityMinutes: 10,
  },
  hell: {
    name: 'HARD MODE',
    targetMultiplier: 1.4,
    xpMultiplier: 1.3,
    pushupTarget: 40,
    squatTarget: 60,
    cardioMinutes: 25,
    mobilityMinutes: 15,
  },
  hard: {
    name: 'HARD MODE',
    targetMultiplier: 1.4,
    xpMultiplier: 1.3,
    pushupTarget: 40,
    squatTarget: 60,
    cardioMinutes: 25,
    mobilityMinutes: 15,
  },
};

// Configurable base XP per level for each rank tier
export const BASE_XP_PER_LEVEL: Record<HunterRankTier, number> = {
  'F': 150,
  'E': 250,
  'D': 400,
  'C': 600,
  'B': 850,
  'A': 1200,
  'S': 1800,
  'SS': 2600,
  'SSS': 3800,
  'SSS+': 5500,
};

export class HunterService {
  // 1. GET RANK PROGRESS
  public getRankProgress(): UserRankProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RANK_PROGRESS);
      if (data) return JSON.parse(data);
    } catch {}

    // Default Starting State: F Rank, Level 1, 0 XP
    const initial: UserRankProgress = {
      currentRank: 'F',
      currentLevel: 1,
      rankXP: 0,
      xpForNextLevel: BASE_XP_PER_LEVEL['F'],
      lifetimeXP: 0,
      highestRankAchieved: 'F',
      promotionsCount: 0,
      demotionsCount: 0,
      updatedAt: new Date().toISOString()
    };
    this.saveRankProgress(initial);
    return initial;
  }

  public saveRankProgress(progress: UserRankProgress): void {
    progress.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.RANK_PROGRESS, JSON.stringify(progress));
  }

  // 2. GET STREAK & GRACE DAYS
  public getStreak(): HunterStreak {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (data) return JSON.parse(data);
    } catch {}

    const initial: HunterStreak = {
      currentStreak: 4,
      longestStreak: 4,
      graceDaysRemaining: 3, // Full 3 grace days by default
      lastCompletedDate: new Date().toISOString().split('T')[0],
      lastEvaluatedDate: new Date().toISOString().split('T')[0],
      isPenaltyTriggered: false
    };
    this.saveStreak(initial);
    return initial;
  }

  public saveStreak(streak: HunterStreak): void {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
  }

  // 2.5 GET & SAVE MODE DIFFICULTY CONFIG
  public getModeDifficultyConfig(): ModeDifficultyConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MODE_DIFFICULTY);
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_MODE_DIFFICULTY;
  }

  public saveModeDifficultyConfig(cfg: ModeDifficultyConfig): void {
    localStorage.setItem(STORAGE_KEYS.MODE_DIFFICULTY, JSON.stringify(cfg));
  }

  // 3. DAILY MISSIONS CATALOG & DATE EVALUATION
  public getDailyMissions(): DailyMission[] {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem(STORAGE_KEYS.MISSIONS_DATE);

    if (storedDate === today) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.MISSIONS);
        if (stored) return JSON.parse(stored);
      } catch {}
    }

    // New day or first run: Generate tailored missions for today
    const missions = this.generateMissionsForToday();
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    localStorage.setItem(STORAGE_KEYS.MISSIONS_DATE, today);
    return missions;
  }

  public generateMissionsForToday(): DailyMission[] {
    const profile = storageService.getProfile();
    const rankProgress = this.getRankProgress();
    const isRest = profile.workoutPreference === 'cardio' ? false : false;

    // Detect active mode
    const storedTheme = (localStorage.getItem('ascend_brand_theme') || 'normal').toLowerCase();
    const modeKey = (storedTheme === 'easy' || storedTheme === 'ascend') ? 'easy' : (storedTheme === 'hard' || storedTheme === 'hell' || storedTheme === 'titan') ? 'hard' : 'normal';
    const config = this.getModeDifficultyConfig()[modeKey] || DEFAULT_MODE_DIFFICULTY[modeKey];
    const modePrefix = config.name;

    const missions: DailyMission[] = [
      {
        id: 'msn-1-' + Date.now(),
        title: `${modePrefix}: Upper Push & Core`,
        description: `Execute ${config.pushupTarget} strict push-ups with locked hollow-body spinal alignment (${modePrefix} protocol).`,
        category: 'strength',
        difficulty: modeKey === 'easy' ? 'F-Rank' : modeKey === 'hard' ? 'B-Rank' : 'D-Rank',
        xpReward: Math.round(50 * config.xpMultiplier),
        estimatedDurationMin: modeKey === 'easy' ? 5 : modeKey === 'hard' ? 10 : 6,
        targetMetric: 'pushups',
        targetValue: config.pushupTarget,
        isRecovery: false,
        isCompleted: false,
      },
      {
        id: 'msn-2-' + Date.now(),
        title: `${modePrefix}: Lower Kinetic Tension`,
        description: `Perform ${config.squatTarget} continuous deep air squats (hip crease passing parallel).`,
        category: 'strength',
        difficulty: modeKey === 'easy' ? 'E-Rank' : modeKey === 'hard' ? 'B-Rank' : 'C-Rank',
        xpReward: Math.round(60 * config.xpMultiplier),
        estimatedDurationMin: modeKey === 'easy' ? 6 : modeKey === 'hard' ? 12 : 8,
        targetMetric: 'squats',
        targetValue: config.squatTarget,
        isRecovery: false,
        isCompleted: false,
      },
      {
        id: 'msn-3-' + Date.now(),
        title: `${modePrefix}: Aerobic Conditioning`,
        description: `Complete ${config.cardioMinutes} minutes of continuous elevated cardio or speed jump rope intervals.`,
        category: 'cardio',
        difficulty: modeKey === 'easy' ? 'E-Rank' : modeKey === 'hard' ? 'A-Rank' : 'C-Rank',
        xpReward: Math.round(75 * config.xpMultiplier),
        estimatedDurationMin: config.cardioMinutes,
        targetMetric: 'cardio_minutes',
        targetValue: config.cardioMinutes,
        isRecovery: false,
        isCompleted: false,
      },
      {
        id: 'msn-4-' + Date.now(),
        title: 'Tactical Curriculum Mastery',
        description: 'Read or review at least 1 chapter of the Training Manual.',
        category: 'knowledge',
        difficulty: 'E-Rank',
        xpReward: Math.round(40 * config.xpMultiplier),
        estimatedDurationMin: 10,
        targetMetric: 'manual_chapters',
        targetValue: 1,
        isRecovery: false,
        isCompleted: false,
      },
      {
        id: 'msn-5-' + Date.now(),
        title: 'Parasympathetic Downregulation',
        description: `${config.mobilityMinutes} minutes of hip mobility (pigeon pose, thoracic rotation) and deep diaphragmatic breathing.`,
        category: 'recovery',
        difficulty: 'F-Rank',
        xpReward: Math.round(45 * config.xpMultiplier),
        estimatedDurationMin: config.mobilityMinutes,
        targetMetric: 'recovery_minutes',
        targetValue: config.mobilityMinutes,
        isRecovery: true, // Recovery mission is always valid
        isCompleted: false,
      }
    ];

    return missions;
  }

  // 4. COMPLETE DAILY MISSION & REWARD XP
  public completeMission(missionId: string): { 
    xpEarned: number; 
    rankPromoted: boolean; 
    levelUp: boolean;
    previousRank?: HunterRankTier;
    newRank?: HunterRankTier;
    newLevel?: number;
  } {
    const missions = this.getDailyMissions();
    const target = missions.find(m => m.id === missionId);
    if (!target || target.isCompleted) {
      return { xpEarned: 0, rankPromoted: false, levelUp: false };
    }

    target.isCompleted = true;
    target.completedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));

    // Award XP atomically
    const result = this.awardXP(target.xpReward, 'daily_mission', `Completed Mission: ${target.title}`);

    // Update streak if all required missions are now complete
    this.evaluateStreakCompletion();

    return {
      xpEarned: target.xpReward,
      ...result
    };
  }

  // 5. EVALUATE STREAK UPON DAILY COMPLETION
  public evaluateStreakCompletion(): void {
    const missions = this.getDailyMissions();
    const requiredMissions = missions.filter(m => !m.isRecovery);
    const allCompleted = requiredMissions.length > 0 && requiredMissions.every(m => m.isCompleted);

    if (allCompleted) {
      const streak = this.getStreak();
      const today = new Date().toISOString().split('T')[0];

      if (streak.lastCompletedDate !== today) {
        streak.currentStreak += 1;
        streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
        streak.lastCompletedDate = today;
        streak.lastEvaluatedDate = today;
        this.saveStreak(streak);

        // Check 7-day consistency achievement & bonus XP
        if (streak.currentStreak % 7 === 0) {
          this.awardXP(150, 'consistency', `${streak.currentStreak}-Day Consistency Mastery Milestone!`);
        }
      }
    }
  }

  // 6. PROCESS MISSED DAY / GRACE DAY CONSUMPTION / RANK PENALTY RESET
  public processMissedDayCheck(): {
    penaltyTriggered: boolean;
    graceDaysLeft: number;
    demotionDetails?: RankHistoryEntry;
  } {
    const streak = this.getStreak();
    const today = new Date().toISOString().split('T')[0];

    // If already evaluated for today, skip
    if (streak.lastEvaluatedDate === today) {
      return { penaltyTriggered: false, graceDaysLeft: streak.graceDaysRemaining };
    }

    // Check if yesterday had completed missions
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const wasCompletedYesterday = streak.lastCompletedDate === yesterday || streak.lastCompletedDate === today;

    streak.lastEvaluatedDate = today;

    if (!wasCompletedYesterday) {
      // Day was missed! Check grace days
      if (streak.graceDaysRemaining > 0) {
        streak.graceDaysRemaining -= 1;
        this.saveStreak(streak);

        storageService.addNotification({
          id: 'notif-grace-' + Date.now(),
          type: 'reminder',
          title: 'Grace Shield Deployed 🛡️',
          message: `You missed a required training day. 1 Grace Shield was consumed to protect your streak. ${streak.graceDaysRemaining} Grace Days remaining.`,
          timestamp: 'Just now',
          isRead: false
        });

        return { penaltyTriggered: false, graceDaysLeft: streak.graceDaysRemaining };
      } else {
        // EXHAUSTED ALL 3 GRACE DAYS! TRIGGER RANK RESET & DEMOTION
        const rankProgress = this.getRankProgress();
        const prevRank = rankProgress.currentRank;
        const prevLevel = rankProgress.currentLevel;

        // Reset streak
        streak.currentStreak = 0;
        streak.graceDaysRemaining = 3; // Reset grace days for the new journey
        this.saveStreak(streak);

        // Reset rank to F Rank Level 1, Wipe rankXP, PRESERVE lifetimeXP
        rankProgress.currentRank = 'F';
        rankProgress.currentLevel = 1;
        rankProgress.rankXP = 0;
        rankProgress.xpForNextLevel = BASE_XP_PER_LEVEL['F'];
        rankProgress.demotionsCount += 1;
        this.saveRankProgress(rankProgress);

        const demotionEntry: RankHistoryEntry = {
          id: 'dem-' + Date.now(),
          date: today,
          eventType: 'penalty_reset',
          fromRank: prevRank,
          toRank: 'F',
          fromLevel: prevLevel,
          toLevel: 1,
          reason: 'All 3 Grace Days were exhausted without daily mission completion. Active streak broken and rank reset to F1. Lifetime XP preserved.',
          lifetimeXPSnapshot: rankProgress.lifetimeXP
        };

        this.addRankHistory(demotionEntry);

        // Dispatch critical alert notification
        storageService.addNotification({
          id: 'notif-demotion-' + Date.now(),
          type: 'streak',
          title: 'Hunter Rank Demotion Incurred ⚠️',
          message: 'All 3 Grace Days were exhausted. Your streak was broken and Rank reset to F1. Your Lifetime XP and workout records remain intact. Rise again, Hunter!',
          timestamp: 'Just now',
          isRead: false
        });

        audioService.playCountdownTick(); // Audio cue

        return {
          penaltyTriggered: true,
          graceDaysLeft: 3,
          demotionDetails: demotionEntry
        };
      }
    }

    this.saveStreak(streak);
    return { penaltyTriggered: false, graceDaysLeft: streak.graceDaysRemaining };
  }

  // 7. AWARD XP (Handles Level-Ups and Rank Promotions)
  public awardXP(
    amount: number, 
    source: XPTransaction['source'], 
    description: string
  ): { 
    rankPromoted: boolean; 
    levelUp: boolean;
    previousRank?: HunterRankTier;
    newRank?: HunterRankTier;
    newLevel?: number;
  } {
    const progress = this.getRankProgress();
    const prevRank = progress.currentRank;
    const prevLevel = progress.currentLevel;

    // Record XP Transaction
    this.addXPTransaction({
      id: 'xp-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      amount,
      source,
      description,
      timestamp: new Date().toISOString()
    });

    // Add to lifetime XP (never wiped) and rank progression XP
    progress.lifetimeXP += amount;
    progress.rankXP += amount;

    let rankPromoted = false;
    let levelUp = false;

    // Check if rankXP passes the threshold for current level
    while (progress.rankXP >= progress.xpForNextLevel) {
      progress.rankXP -= progress.xpForNextLevel;

      if (progress.currentLevel < 10) {
        progress.currentLevel += 1;
        levelUp = true;
      } else {
        // Current Level is 10! PROMOTE TO NEXT RANK TIER!
        const currentTierIdx = RANK_ORDER.indexOf(progress.currentRank);
        if (currentTierIdx < RANK_ORDER.length - 1) {
          const nextRank = RANK_ORDER[currentTierIdx + 1];
          progress.currentRank = nextRank;
          progress.currentLevel = 1;
          progress.promotionsCount += 1;
          rankPromoted = true;

          // Check if highest rank achieved
          const highestTierIdx = RANK_ORDER.indexOf(progress.highestRankAchieved);
          if (currentTierIdx + 1 > highestTierIdx) {
            progress.highestRankAchieved = nextRank;
          }

          // Record in history
          this.addRankHistory({
            id: 'prom-' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            eventType: 'promotion',
            fromRank: prevRank,
            toRank: nextRank,
            fromLevel: 10,
            toLevel: 1,
            reason: `Accumulated sufficient XP to transcend into ${RANK_DEFINITIONS[nextRank].name}!`,
            lifetimeXPSnapshot: progress.lifetimeXP
          });

          storageService.addNotification({
            id: 'notif-prom-' + Date.now(),
            type: 'achievement',
            title: `RANK PROMOTION: ${nextRank} RANK! 🏆`,
            message: `Congratulations! You have awakened into ${RANK_DEFINITIONS[nextRank].name} (${nextRank} Rank).`,
            timestamp: 'Just now',
            isRead: false
          });
        } else {
          // At SSS+ Pinnacle (Level increments up to 99)
          progress.currentLevel += 1;
          levelUp = true;
        }
      }

      // Update XP threshold for the new level/rank
      progress.xpForNextLevel = BASE_XP_PER_LEVEL[progress.currentRank];
    }

    this.saveRankProgress(progress);

    return {
      rankPromoted,
      levelUp,
      previousRank: prevRank,
      newRank: progress.currentRank,
      newLevel: progress.currentLevel
    };
  }

  // 8. RANK HISTORY AUDIT LOG
  public getRankHistory(): RankHistoryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch {}

    const initial: RankHistoryEntry[] = [
      {
        id: 'hist-init',
        date: '2026-10-15',
        eventType: 'promotion',
        fromRank: 'F',
        toRank: 'E',
        fromLevel: 10,
        toLevel: 1,
        reason: 'Completed 4-Week Beginner Foundation and 1,500 XP threshold.',
        lifetimeXPSnapshot: 1520
      },
      {
        id: 'hist-d',
        date: '2026-11-01',
        eventType: 'promotion',
        fromRank: 'E',
        toRank: 'D',
        fromLevel: 10,
        toLevel: 1,
        reason: 'Mastered Kinetic Movement protocols and surpassed 4,000 Lifetime XP.',
        lifetimeXPSnapshot: 4120
      }
    ];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(initial));
    return initial;
  }

  public addRankHistory(entry: RankHistoryEntry): void {
    const list = this.getRankHistory();
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(list));
  }

  // 9. XP TRANSACTIONS
  public getXPTransactions(): XPTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch {}

    const initial: XPTransaction[] = [
      {
        id: 'tx-1',
        amount: 100,
        source: 'workout',
        description: 'Completed Upper Body Power & Chest Dominance session',
        timestamp: 'Today, 08:30 AM'
      },
      {
        id: 'tx-2',
        amount: 80,
        source: 'daily_mission',
        description: 'Completed Tactical Curriculum Mastery directive',
        timestamp: 'Today, 09:15 AM'
      },
      {
        id: 'tx-3',
        amount: 50,
        source: 'consistency',
        description: '4-Day Ironclad Consistency Streak milestone',
        timestamp: 'Yesterday, 07:00 PM'
      },
      {
        id: 'tx-4',
        amount: 45,
        source: 'bonus_workout',
        description: 'Volume bonus: 4,500 kg total session tonnage',
        timestamp: '2 days ago'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initial));
    return initial;
  }

  public addXPTransaction(tx: XPTransaction): void {
    const list = this.getXPTransactions();
    list.unshift(tx);
    if (list.length > 100) list.pop(); // Keep recent 100
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
  }

  // 10. NOTIFICATION PREFERENCES
  public getNotificationPreferences(): HunterNotificationPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (data) return JSON.parse(data);
    } catch {}

    const defaultPrefs: HunterNotificationPreferences = {
      enabled: true,
      intervalHours: 3,
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(defaultPrefs));
    return defaultPrefs;
  }

  public saveNotificationPreferences(prefs: HunterNotificationPreferences): void {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  }

  // 11. TIME UNTIL DAILY DEADLINE (Midnight)
  public getTimeUntilDailyDeadline(): { hours: number; minutes: number; seconds: number; formatted: string } {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diffMs = Math.max(0, midnight.getTime() - now.getTime());

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return { hours, minutes, seconds, formatted };
  }
}

export const hunterService = new HunterService();
