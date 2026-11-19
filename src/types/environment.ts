// ==============================================================================
// KINETIX FITNESS PLATFORM: TRAINING ENVIRONMENTS & DEVELOPMENT LEVELS
// ==============================================================================

export type TrainingEnvironment = 'home' | 'gym';
export type DevelopmentLevel = 'basic' | 'beginner' | 'advanced';
export type TrainingGoal = 
  | 'general_fitness'
  | 'muscle_building'
  | 'fat_loss'
  | 'strength_development'
  | 'endurance'
  | 'overall_body';

export interface DevelopmentLevelDefinition {
  level: DevelopmentLevel;
  name: string;
  subtitle: string;
  focus: string[];
  description: string;
  targetAudience: string;
  workoutsRequiredForPromotion: number;
  benchmarkRequirements: {
    testExercise: string;
    targetBenchmark: string;
    repsOrDuration: number;
  }[];
  keyMovements: string[];
}

export interface EnvironmentDefinition {
  id: TrainingEnvironment;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  levels: Record<DevelopmentLevel, DevelopmentLevelDefinition>;
  equipmentOptions: {
    id: string;
    label: string;
    description: string;
    isEssential: boolean;
  }[];
}

export interface UserEnvironmentProgress {
  environment: TrainingEnvironment;
  developmentLevel: DevelopmentLevel;
  workoutsCompleted: number;
  workoutsRequired: number;
  techniqueVerified: boolean;
  streakDaysAtLevel: number;
  benchmarksPassed: string[];
  unlockedLevels: DevelopmentLevel[];
  lastPromotedAt?: string;
  history: {
    id: string;
    date: string;
    fromLevel: DevelopmentLevel;
    toLevel: DevelopmentLevel;
    environment: TrainingEnvironment;
    notes: string;
  }[];
}

export interface ExerciseSubstitution {
  id: string;
  originalExerciseId: string;
  originalExerciseName: string;
  substituteExerciseId: string;
  substituteExerciseName: string;
  environment: TrainingEnvironment;
  equipmentCondition: string; // e.g. "When pull-up bar is unavailable"
  biomechanicalMatch: string;
}

export interface EnvironmentWorkoutTemplate {
  id: string;
  environment: TrainingEnvironment;
  developmentLevel: DevelopmentLevel;
  title: string;
  description: string;
  difficultyMode: 'easy' | 'normal' | 'hell';
  estimatedDurationMin: number;
  equipmentRequired: string[];
  exerciseIds: string[];
  coachingFocus: string;
}
