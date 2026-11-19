// ==============================================================================
// KINETIX FITNESS PLATFORM: SCALABLE WORKOUT LIBRARY & BULK IMPORT TYPES
// Designed to scale from 3,000 to 50,000+ indexed exercise and workout entries.
// ==============================================================================

import { ExerciseCategoryType } from './index';
import { TrainingEnvironment, DevelopmentLevel } from './environment';

export type WorkoutDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type WorkoutExerciseType = 
  | 'compound'
  | 'isolation'
  | 'isometric'
  | 'cardiovascular'
  | 'mobility'
  | 'plyometric';

export type WorkoutStatus = 'draft' | 'published' | 'archived';

export interface WorkoutItem {
  id: string;
  name: string;
  normalizedName: string; // Lowercase, trimmed, alphanumeric for instant duplicate detection
  slug: string;
  description: string;
  primaryMuscle: string;
  targetMuscle: string; // Alias for primaryMuscle for seamless compatibility with Exercise
  secondaryMuscles: string[];
  category: string; // 16 configurable categories
  equipmentRequired: string[];
  difficulty: WorkoutDifficulty;
  exerciseType: WorkoutExerciseType;
  stepByStepExecution: string[];
  recommendedSets: number;
  recommendedReps: string;
  recommendedDurationSec?: number;
  restDurationSec: number;
  demonstrationImageUrl?: string;
  demonstrationVideoUrl?: string;
  commonMistakes: string[];
  safetyInstructions: string[];
  alternativeExerciseIds: string[];
  alternativeExercises?: { id: string; name: string }[];
  tags: string[];
  isPublished: boolean;
  status: WorkoutStatus;
  environment: TrainingEnvironment | 'hybrid';
  developmentLevel: DevelopmentLevel;
  animationType: 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'core' | 'cardio' | 'stretch';
  viewsCount?: number;
  importedFrom?: string;
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  workoutCount?: number;
  createdAt: string;
}

export interface WorkoutValidationError {
  rowNumber: number;
  field: string;
  message: string;
  originalValue?: any;
}

export interface WorkoutValidationResult {
  total: number;
  valid: WorkoutItem[];
  duplicates: { item: WorkoutItem; reason: string; existingId: string; rowNumber: number }[];
  invalid: { rowNumber: number; data: any; errors: WorkoutValidationError[] }[];
}

export interface WorkoutImportLog {
  id: string;
  filename: string;
  fileFormat: 'xlsx' | 'csv' | 'json';
  totalRows: number;
  importedCount: number;
  duplicateCount: number;
  failedCount: number;
  errorDetails: WorkoutValidationError[];
  importedBy: string;
  createdAt: string;
}

export interface WorkoutAuditLog {
  id: string;
  action: 
    | 'create'
    | 'update'
    | 'delete'
    | 'bulk_import'
    | 'bulk_publish'
    | 'bulk_unpublish'
    | 'bulk_category_change'
    | 'bulk_delete'
    | 'category_create'
    | 'category_merge';
  entityId: string;
  entityName: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface WorkoutQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  primaryMuscle?: string;
  equipment?: string;
  difficulty?: string;
  environment?: 'home' | 'gym' | 'hybrid' | 'all';
  status?: WorkoutStatus | 'all';
  sortBy?: 'name' | 'category' | 'difficulty' | 'updatedAt' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface WorkoutPageResult {
  data: WorkoutItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
