import { 
  TrainingEnvironment, 
  DevelopmentLevel, 
  UserEnvironmentProgress, 
  EnvironmentDefinition,
  DevelopmentLevelDefinition,
  ExerciseSubstitution
} from '../types/environment';
import { INITIAL_ENVIRONMENTS, INITIAL_EXERCISE_SUBSTITUTIONS } from '../data/initialEnvironments';
import { storageService } from './storageService';
import { hunterService } from './hunterService';
import { Exercise } from '../types';

const STORAGE_KEYS = {
  ENVIRONMENT_PROGRESS: 'kinetix_environment_progress',
  ENVIRONMENT_CUSTOM_SUBSTITUTIONS: 'kinetix_custom_substitutions',
  ENVIRONMENT_DEFINITIONS: 'kinetix_environment_definitions',
};

const DEFAULT_PROGRESS: UserEnvironmentProgress = {
  environment: 'gym',
  developmentLevel: 'beginner',
  workoutsCompleted: 6,
  workoutsRequired: 16,
  techniqueVerified: true,
  streakDaysAtLevel: 14,
  benchmarksPassed: ['Barbell Flat Bench Press'],
  unlockedLevels: ['basic', 'beginner'],
  history: [
    {
      id: 'hist-1',
      date: '2026-10-25',
      fromLevel: 'basic',
      toLevel: 'beginner',
      environment: 'gym',
      notes: 'Passed Machine Form Foundation test with distinction. Promoted to Free-Weight Beginner.'
    }
  ]
};

export const environmentService = {
  // PROGRESSION STATE
  getProgress(): UserEnvironmentProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENVIRONMENT_PROGRESS);
      if (data) {
        const parsed: UserEnvironmentProgress = JSON.parse(data);
        // Sync with user profile if profile has updated trainingEnvironment
        const profile = storageService.getProfile();
        if (profile.trainingEnvironment && profile.trainingEnvironment !== parsed.environment) {
          parsed.environment = profile.trainingEnvironment;
        }
        if (profile.developmentLevel && profile.developmentLevel !== parsed.developmentLevel) {
          parsed.developmentLevel = profile.developmentLevel;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load environment progress:', e);
    }

    // Initialize with profile preference or default
    const profile = storageService.getProfile();
    const initial: UserEnvironmentProgress = {
      ...DEFAULT_PROGRESS,
      environment: profile.trainingEnvironment || 'gym',
      developmentLevel: profile.developmentLevel || 'beginner',
    };
    this.saveProgress(initial);
    return initial;
  },

  saveProgress(progress: UserEnvironmentProgress): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ENVIRONMENT_PROGRESS, JSON.stringify(progress));
      // Keep profile in sync
      const profile = storageService.getProfile();
      if (profile.trainingEnvironment !== progress.environment || profile.developmentLevel !== progress.developmentLevel) {
        profile.trainingEnvironment = progress.environment;
        profile.developmentLevel = progress.developmentLevel;
        storageService.saveProfile(profile);
      }
    } catch (e) {
      console.error('Failed to save environment progress:', e);
    }
  },

  getCurrentEnvironment(): TrainingEnvironment {
    return this.getProgress().environment;
  },

  getCurrentDevelopmentLevel(): DevelopmentLevel {
    return this.getProgress().developmentLevel;
  },

  getEnvironmentDefinitions(): Record<TrainingEnvironment, EnvironmentDefinition> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENVIRONMENT_DEFINITIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_ENVIRONMENTS;
  },

  saveEnvironmentDefinitions(defs: Record<TrainingEnvironment, EnvironmentDefinition>): void {
    localStorage.setItem(STORAGE_KEYS.ENVIRONMENT_DEFINITIONS, JSON.stringify(defs));
  },

  getEnvironmentDefinition(env?: TrainingEnvironment): EnvironmentDefinition {
    const targetEnv = env || this.getCurrentEnvironment();
    const defs = this.getEnvironmentDefinitions();
    return defs[targetEnv] || INITIAL_ENVIRONMENTS[targetEnv];
  },

  getCurrentLevelDefinition(): DevelopmentLevelDefinition {
    const progress = this.getProgress();
    const envDef = this.getEnvironmentDefinition(progress.environment);
    return envDef.levels[progress.developmentLevel];
  },

  // SWITCH ENVIRONMENT (Preserves user stats, rank, and history)
  setEnvironment(newEnv: TrainingEnvironment): void {
    const progress = this.getProgress();
    if (progress.environment === newEnv) return;

    progress.environment = newEnv;
    // Set required workouts for the current development level in this new environment
    const envDef = this.getEnvironmentDefinition(newEnv);
    progress.workoutsRequired = envDef.levels[progress.developmentLevel]?.workoutsRequiredForPromotion || 10;
    
    this.saveProgress(progress);

    // Notify user
    storageService.addNotification({
      id: 'notif-env-' + Date.now(),
      type: 'achievement',
      title: `Training Environment: ${newEnv === 'home' ? '🏠 HOME MODE' : '🏋️ GYM MODE'} Activated`,
      message: `Switched to ${newEnv === 'home' ? 'Home Mode (Bodyweight & Calisthenics)' : 'Gym Mode (Commercial Machines & Barbells)'}. Your XP, Rank, and workout history are preserved.`,
      timestamp: 'Just now',
      isRead: false
    });
  },

  // SWITCH OR SELECT DEVELOPMENT LEVEL
  setDevelopmentLevel(newLevel: DevelopmentLevel): void {
    const progress = this.getProgress();
    const prevLevel = progress.developmentLevel;
    progress.developmentLevel = newLevel;

    if (!progress.unlockedLevels.includes(newLevel)) {
      progress.unlockedLevels.push(newLevel);
    }

    const envDef = this.getEnvironmentDefinition(progress.environment);
    progress.workoutsRequired = envDef.levels[newLevel]?.workoutsRequiredForPromotion || 12;

    if (prevLevel !== newLevel) {
      progress.history.unshift({
        id: 'hist-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        fromLevel: prevLevel,
        toLevel: newLevel,
        environment: progress.environment,
        notes: `Manual adjustment to ${newLevel.toUpperCase()} body development.`
      });
    }

    this.saveProgress(progress);
  },

  // WORKOUT RECORDING & PROGRESSION CHECK
  recordWorkoutCompletion(): { promoted: boolean; nextLevel?: DevelopmentLevel; message: string } {
    const progress = this.getProgress();
    progress.workoutsCompleted += 1;
    this.saveProgress(progress);

    // Check if eligible for promotion
    if (this.canPromote()) {
      return {
        promoted: false,
        message: 'Milestone reached! You have completed all required workouts and are ready for Level Promotion.'
      };
    }

    return {
      promoted: false,
      message: `Workout logged in ${progress.environment.toUpperCase()} mode. (${progress.workoutsCompleted}/${progress.workoutsRequired} for next development level)`
    };
  },

  // BENCHMARKS
  toggleBenchmark(testExercise: string): boolean {
    const progress = this.getProgress();
    const index = progress.benchmarksPassed.indexOf(testExercise);
    let passed = false;

    if (index >= 0) {
      progress.benchmarksPassed.splice(index, 1);
      passed = false;
    } else {
      progress.benchmarksPassed.push(testExercise);
      passed = true;
      // Award minor XP for passing technique benchmark
      hunterService.awardXP(75, 'personal_record', `Benchmark Verified: ${testExercise}`);
    }

    this.saveProgress(progress);
    return passed;
  },

  isBenchmarkPassed(testExercise: string): boolean {
    return this.getProgress().benchmarksPassed.includes(testExercise);
  },

  canPromote(): boolean {
    const progress = this.getProgress();
    if (progress.developmentLevel === 'advanced') return false; // Already at peak

    const levelDef = this.getCurrentLevelDefinition();
    const workoutsMet = progress.workoutsCompleted >= (levelDef.workoutsRequiredForPromotion || 8);
    
    // Check if at least 2 benchmarks or all are passed
    const requiredBenchmarks = levelDef.benchmarkRequirements || [];
    const passedCount = requiredBenchmarks.filter(b => progress.benchmarksPassed.includes(b.testExercise)).length;
    const benchmarksMet = requiredBenchmarks.length === 0 || passedCount >= Math.min(2, requiredBenchmarks.length);

    return workoutsMet && benchmarksMet;
  },

  promoteToNextLevel(): { success: boolean; newLevel?: DevelopmentLevel; message: string } {
    const progress = this.getProgress();
    const currentLevel = progress.developmentLevel;

    let nextLevel: DevelopmentLevel | null = null;
    if (currentLevel === 'basic') nextLevel = 'beginner';
    else if (currentLevel === 'beginner') nextLevel = 'advanced';

    if (!nextLevel) {
      return { success: false, message: 'Already at the highest development level (Advanced)!' };
    }

    // Execute Promotion
    const prevLevel = currentLevel;
    progress.developmentLevel = nextLevel;
    progress.workoutsCompleted = 0; // Reset workout count for next tier
    progress.benchmarksPassed = [];
    if (!progress.unlockedLevels.includes(nextLevel)) {
      progress.unlockedLevels.push(nextLevel);
    }
    progress.lastPromotedAt = new Date().toISOString();

    const envDef = this.getEnvironmentDefinition(progress.environment);
    progress.workoutsRequired = envDef.levels[nextLevel]?.workoutsRequiredForPromotion || 16;

    // Log in history
    progress.history.unshift({
      id: 'hist-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      fromLevel: prevLevel,
      toLevel: nextLevel,
      environment: progress.environment,
      notes: `Ascended to ${nextLevel.toUpperCase()} Development tier in ${progress.environment.toUpperCase()} MODE.`
    });

    this.saveProgress(progress);

    // Award major progression XP (+400 XP)
    hunterService.awardXP(400, 'weekly_challenge', `Tier Promotion: Ascended to ${nextLevel.toUpperCase()} Body Development!`);

    // Add celebration notification
    storageService.addNotification({
      id: 'notif-promo-' + Date.now(),
      type: 'achievement',
      title: `⚡ PROMOTED: ${nextLevel.toUpperCase()} BODY DEVELOPMENT!`,
      message: `Outstanding dedication! You have unlocked ${nextLevel.toUpperCase()} tier in ${progress.environment.toUpperCase()} Mode. New compound progressions and routines available.`,
      timestamp: 'Just now',
      isRead: false
    });

    return {
      success: true,
      newLevel: nextLevel,
      message: `Congratulations! Promoted to ${nextLevel.toUpperCase()} Body Development.`
    };
  },

  // EXERCISE SUBSTITUTIONS
  getSubstitutions(environment?: TrainingEnvironment): ExerciseSubstitution[] {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.ENVIRONMENT_CUSTOM_SUBSTITUTIONS);
      const list: ExerciseSubstitution[] = custom ? JSON.parse(custom) : INITIAL_EXERCISE_SUBSTITUTIONS;
      if (environment) {
        return list.filter(s => s.environment === environment);
      }
      return list;
    } catch {
      return INITIAL_EXERCISE_SUBSTITUTIONS;
    }
  },

  saveSubstitutions(subs: ExerciseSubstitution[]): void {
    localStorage.setItem(STORAGE_KEYS.ENVIRONMENT_CUSTOM_SUBSTITUTIONS, JSON.stringify(subs));
  },

  getSubstitutionForExercise(exerciseId: string, env?: TrainingEnvironment): ExerciseSubstitution | undefined {
    const targetEnv = env || this.getCurrentEnvironment();
    const subs = this.getSubstitutions(targetEnv);
    return subs.find(s => s.originalExerciseId === exerciseId);
  },

  // EXERCISE FILTERING HELPER
  filterExercises(exercises: Exercise[], environment?: TrainingEnvironment, level?: DevelopmentLevel): Exercise[] {
    const targetEnv = environment || this.getCurrentEnvironment();
    return exercises.filter(ex => {
      // If exercise has explicit environment, match or hybrid
      if (ex.environment) {
        if (ex.environment !== 'hybrid' && ex.environment !== targetEnv) {
          return false;
        }
      }
      // If level is specified
      if (level && ex.developmentLevel) {
        if (ex.developmentLevel !== level) {
          return false;
        }
      }
      return true;
    });
  },

  // DIFFICULTY MODE SCALING MATRIX
  getModeAdjustedVolume(sets: number, reps: string, difficultyMode: 'easy' | 'normal' | 'hell' | 'hard') {
    switch (difficultyMode) {
      case 'easy':
        return {
          sets: Math.max(2, sets - 1),
          reps: reps.includes('-') 
            ? reps.split('-').map(r => Math.max(5, parseInt(r) - 2)).join('-') 
            : `${Math.max(5, parseInt(reps) - 2)}`,
          restSec: 90,
          targetRpe: 'RPE 6.0 - 7.0 (Moderate, 3-4 reps in reserve)',
          intensityLabel: 'Low Fatigue / Form Focus'
        };
      case 'hell':
      case 'hard':
        return {
          sets: sets + 1,
          reps: reps.includes('-')
            ? reps.split('-').map(r => parseInt(r) + 2).join('-')
            : `${parseInt(reps) + 4}`,
          restSec: 45,
          targetRpe: 'RPE 8.5 - 9.5 (Near-Failure, 0-1 rep in reserve)',
          intensityLabel: 'Max Mechanical Tension / Advanced Progression'
        };
      case 'normal':
      default:
        return {
          sets,
          reps,
          restSec: 60,
          targetRpe: 'RPE 7.5 - 8.0 (2 reps in reserve)',
          intensityLabel: 'Balanced Hypertrophy & Progressive Overload'
        };
    }
  }
};
