// ==============================================================================
// KINETIX FITNESS PLATFORM: UNIFIED TYPESCRIPT TYPE DEFINITIONS
// ==============================================================================

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';
export type FitnessGoalSlug = 'fat_loss' | 'muscle_gain' | 'pure_strength' | 'athletic' | 'home_agility';
export type WorkoutPreference = 'gym' | 'home' | 'bodyweight' | 'hybrid' | 'cardio';
export type UnitPreference = 'metric' | 'imperial';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  fitnessLevel: FitnessLevel;
  primaryGoal: string;
  workoutPreference: WorkoutPreference;
  equipmentAvailable: string[];
  preferredDurationMin: number;
  weeklyFrequency: number;
  isAdmin: boolean;
  isOnboarded: boolean;
  streakCount: number;
  lastActiveDate: string;
  unitPreference: UnitPreference;
  soundEnabled: boolean;
  trainingEnvironment?: 'home' | 'gym';
  developmentLevel?: 'basic' | 'beginner' | 'advanced';
  selected_difficulty_mode?: 'normal' | 'easy' | 'hard';
  theme_preference?: 'purple' | 'blue' | 'red';
  updated_at?: string;
  createdAt: string;
}

export type ExerciseCategoryType = 
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Abs'
  | 'Full Body'
  | 'Cardio'
  | 'Stretching'
  | 'Mobility';

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  category: ExerciseCategoryType;
  targetMuscle: string;
  secondaryMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipmentRequired: string;
  startingPosition: string;
  stepByStepExecution: string[];
  breathingTechnique: string;
  recommendedSets: number;
  recommendedReps: string;
  restDurationSec: number;
  commonMistakes: string[];
  safetyInstructions: string[];
  thumbnailUrl?: string;
  animationType: 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'core' | 'cardio' | 'stretch';
  isPublished: boolean;
  viewsCount?: number;
  environment?: 'home' | 'gym' | 'hybrid';
  developmentLevel?: 'basic' | 'beginner' | 'advanced';
}

export interface ManualSection {
  title: string;
  content: string;
  tips?: string[];
  commonMistakes?: string[];
  safetyGuidelines?: string[];
}

export interface ManualChapter {
  id: string;
  chapterNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  estimatedReadTimeMin: number;
  overview: string;
  sections: ManualSection[];
  keyTakeaways: string[];
  isPublished: boolean;
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  targetReps: string;
  restSec: number;
  targetWeightKg?: number;
  notes?: string;
}

export interface WorkoutDayPlan {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  targetFocus: string;
  estimatedDurationMin: number;
  isRestDay: boolean;
  exercises: WorkoutExerciseItem[];
}

export interface WorkoutProgram {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationWeeks: number;
  daysPerWeek: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  primaryGoal: string;
  targetAudience: string;
  equipmentRequired: string[];
  progressionNotes: string;
  coverImageUrl?: string;
  isCustom: boolean;
  isPublished: boolean;
  enrolledCount: number;
  days: WorkoutDayPlan[];
}

export interface LoggedSet {
  setNumber: number;
  weightKg: number;
  targetReps: number;
  completedReps: number;
  isCompleted: boolean;
  rpe?: number;
}

export interface ActiveExerciseSession {
  exerciseId: string;
  exercise: Exercise;
  sets: LoggedSet[];
  notes?: string;
}

export interface ActiveWorkoutSession {
  id: string;
  programId?: string;
  dayId?: string;
  title: string;
  startedAt: string;
  elapsedSeconds: number;
  currentExerciseIndex: number;
  exercises: ActiveExerciseSession[];
  isPaused: boolean;
  isCompleted: boolean;
}

export interface WorkoutLogEntry {
  id: string;
  title: string;
  programTitle?: string;
  completedAt: string;
  durationSeconds: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  totalRepsCompleted: number;
  rating?: number;
  notes?: string;
  exercises: {
    exerciseName: string;
    targetMuscle: string;
    sets: { setNumber: number; weightKg: number; completedReps: number }[];
  }[];
}

export interface BodyMeasurementEntry {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercentage?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  recordType: '1rm' | 'max_weight' | 'max_reps';
  value: number;
  unit: string;
  achievedAt: string;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'workouts' | 'streak' | 'volume' | 'mastery' | 'knowledge';
  icon: string;
  points: number;
  threshold: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
}

export interface AppNotification {
  id: string;
  type: 'reminder' | 'streak' | 'achievement' | 'system' | 'workout';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export type ChallengeCategory = 'tonnage' | 'streak' | 'endurance' | 'calisthenics' | 'guild';

export interface FitnessChallenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  xpReward: number;
  badgeIcon: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  duration: string;
  endDate: string;
  participantsCount: number;
  isJoined: boolean;
  isCompleted: boolean;
  tierRequirement: string;
}
