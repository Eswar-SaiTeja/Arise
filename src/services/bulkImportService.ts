import * as XLSX from 'xlsx';
import { 
  WorkoutItem, 
  WorkoutValidationResult, 
  WorkoutValidationError, 
  WorkoutDifficulty,
  WorkoutExerciseType
} from '../types/workoutLibrary';

const TEMPLATE_HEADERS = [
  'id',
  'name',
  'description',
  'category',
  'primaryMuscle',
  'secondaryMuscles',
  'equipmentRequired',
  'difficulty',
  'exerciseType',
  'stepByStepExecution',
  'recommendedSets',
  'recommendedReps',
  'restDurationSec',
  'demonstrationImageUrl',
  'demonstrationVideoUrl',
  'commonMistakes',
  'safetyInstructions',
  'tags',
  'environment',
  'developmentLevel',
  'status'
];

const SAMPLE_ROWS = [
  {
    id: 'wl-import-001',
    name: 'Incline Dumbbell Chest Press',
    description: 'Upper pectoral development on a 30-degree incline bench with independent arm stabilization.',
    category: 'Chest',
    primaryMuscle: 'Pectoralis Major (Clavicular Upper Head)',
    secondaryMuscles: 'Anterior Deltoids, Triceps Brachii',
    equipmentRequired: 'Dumbbells, Incline Bench',
    difficulty: 'intermediate',
    exerciseType: 'compound',
    stepByStepExecution: 'Set bench to 30 degrees.|Kick dumbbells to shoulder height.|Lower under 2-second control.|Press upward converging slightly at top.',
    recommendedSets: 4,
    recommendedReps: '8-10',
    restDurationSec: 90,
    demonstrationImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    demonstrationVideoUrl: '',
    commonMistakes: 'Setting bench angle too high (>45 degrees).|Flaring elbows perpendicular to body.',
    safetyInstructions: 'Do not drop dumbbells carelessly from top lockout.|Bring to knees first.',
    tags: 'chest, upper-chest, dumbbells, hypertrophy',
    environment: 'gym',
    developmentLevel: 'beginner',
    status: 'published'
  },
  {
    id: 'wl-import-002',
    name: 'Elevated Doorframe Towel Row',
    description: 'Bodyweight horizontal pull utilizing gravitational leverage and doorframe anchor.',
    category: 'Back',
    primaryMuscle: 'Latissimus Dorsi & Rhomboids',
    secondaryMuscles: 'Biceps Brachii, Rear Deltoids, Core',
    equipmentRequired: 'Doorframe, Towel or Sturdy Table',
    difficulty: 'beginner',
    exerciseType: 'compound',
    stepByStepExecution: 'Wrap heavy bath towel securely around door handle.|Lean back at 45 degree angle.|Pull chest firmly toward door frame.|Lower back smoothly under control.',
    recommendedSets: 3,
    recommendedReps: '10-12',
    restDurationSec: 60,
    demonstrationImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    demonstrationVideoUrl: '',
    commonMistakes: 'Bending at hips instead of keeping body in a straight plank.|Jerky momentum.',
    safetyInstructions: 'Always test door latch stability before applying full bodyweight.',
    tags: 'back, home, calisthenics, lats, zero-gear',
    environment: 'home',
    developmentLevel: 'basic',
    status: 'published'
  },
  {
    id: 'wl-import-003',
    name: 'Standing Cable Face Pull with External Rotation',
    description: 'Rotator cuff and rear deltoid isolation for scapular health and postural balance.',
    category: 'Shoulders',
    primaryMuscle: 'Posterior Deltoids & Infraspinatus',
    secondaryMuscles: 'Rhomboids, Trapezius, Teres Minor',
    equipmentRequired: 'Cable Station, Rope Attachment',
    difficulty: 'beginner',
    exerciseType: 'isolation',
    stepByStepExecution: 'Set cable pulley at face height.|Grasp rope with neutral thumbs-back grip.|Pull rope to bridge of nose while separating hands.|Hold peak external rotation for 2 seconds.',
    recommendedSets: 3,
    recommendedReps: '15-20',
    restDurationSec: 60,
    demonstrationImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    demonstrationVideoUrl: '',
    commonMistakes: 'Dropping elbows below wrists.|Leaning backward aggressively.',
    safetyInstructions: 'Focus on mind-muscle external rotation rather than heavy stack load.',
    tags: 'shoulders, posture, rear-delts, rotator-cuff',
    environment: 'gym',
    developmentLevel: 'basic',
    status: 'published'
  }
];

export const bulkImportService = {
  // 1. TEMPLATE GENERATORS
  downloadExcelTemplate(): void {
    const ws = XLSX.utils.json_to_sheet(SAMPLE_ROWS, { header: TEMPLATE_HEADERS });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Workouts_Import_Template');
    XLSX.writeFile(wb, 'kinetix_workout_import_template.xlsx');
  },

  downloadCSVTemplate(): void {
    const ws = XLSX.utils.json_to_sheet(SAMPLE_ROWS, { header: TEMPLATE_HEADERS });
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kinetix_workout_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadJSONTemplate(): void {
    const jsonContent = JSON.stringify(SAMPLE_ROWS, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kinetix_workout_import_template.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // 2. PARSE UPLOADED FILE
  async parseFile(file: File): Promise<{ format: 'xlsx' | 'csv' | 'json'; rawRows: any[] }> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'json') {
      const text = await file.text();
      const rawRows = JSON.parse(text);
      if (!Array.isArray(rawRows)) {
        throw new Error('JSON file must contain an array of workout objects.');
      }
      return { format: 'json', rawRows };
    }

    // For XLSX, XLS, and CSV, use SheetJS (handles delimiters, encoding & types automatically)
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    const format: 'xlsx' | 'csv' = extension === 'csv' ? 'csv' : 'xlsx';
    return { format, rawRows };
  },

  // 3. VALIDATE ROWS & DETECT DUPLICATES
  validateRows(rawRows: any[], existingWorkouts: WorkoutItem[]): WorkoutValidationResult {
    const valid: WorkoutItem[] = [];
    const duplicates: { item: WorkoutItem; reason: string; existingId: string; rowNumber: number }[] = [];
    const invalid: { rowNumber: number; data: any; errors: WorkoutValidationError[] }[] = [];

    const existingById = new Map<string, WorkoutItem>(existingWorkouts.map(w => [w.id.toLowerCase(), w]));
    const existingByNormName = new Map<string, WorkoutItem>(existingWorkouts.map(w => [w.normalizedName, w]));

    const seenInBatchById = new Set<string>();
    const seenInBatchByNormName = new Set<string>();

    const validDifficulties = new Set(['beginner', 'intermediate', 'advanced', 'elite']);
    const validExerciseTypes = new Set(['compound', 'isolation', 'isometric', 'cardiovascular', 'mobility', 'plyometric']);

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const rowNumber = i + 2; // Row index matching spreadsheet (row 1 is header)
      const errors: WorkoutValidationError[] = [];

      // Validate Name
      const name = String(row.name || '').trim();
      if (!name || name.length < 3) {
        errors.push({ rowNumber, field: 'name', message: 'Workout name is required and must be at least 3 characters.', originalValue: row.name });
      }

      // Validate Category
      const category = String(row.category || '').trim();
      if (!category) {
        errors.push({ rowNumber, field: 'category', message: 'Category is required (e.g. Chest, Back, Legs, Mobility).', originalValue: row.category });
      }

      // Validate Primary Muscle
      const primaryMuscle = String(row.primaryMuscle || row.targetMuscle || '').trim();
      if (!primaryMuscle) {
        errors.push({ rowNumber, field: 'primaryMuscle', message: 'Primary muscle group is required.', originalValue: row.primaryMuscle });
      }

      // Validate Difficulty
      let difficulty: WorkoutDifficulty = 'intermediate';
      const rawDiff = String(row.difficulty || 'intermediate').trim().toLowerCase();
      if (validDifficulties.has(rawDiff)) {
        difficulty = rawDiff as WorkoutDifficulty;
      } else {
        errors.push({ rowNumber, field: 'difficulty', message: `Difficulty must be one of: beginner, intermediate, advanced, elite. Got: "${row.difficulty}"`, originalValue: row.difficulty });
      }

      // Validate Exercise Type
      let exerciseType: WorkoutExerciseType = 'compound';
      const rawExType = String(row.exerciseType || 'compound').trim().toLowerCase();
      if (validExerciseTypes.has(rawExType)) {
        exerciseType = rawExType as WorkoutExerciseType;
      } else {
        exerciseType = 'compound';
      }

      // Validate Numeric Sets & Rest
      const sets = parseInt(row.recommendedSets, 10);
      if (isNaN(sets) || sets <= 0) {
        errors.push({ rowNumber, field: 'recommendedSets', message: 'Recommended sets must be a positive number.', originalValue: row.recommendedSets });
      }

      const restSec = parseInt(row.restDurationSec, 10);
      if (isNaN(restSec) || restSec < 0) {
        errors.push({ rowNumber, field: 'restDurationSec', message: 'Rest duration must be 0 or more seconds.', originalValue: row.restDurationSec });
      }

      // Parse Arrays (handling comma or pipe separated strings)
      const secondaryMuscles = this.parseStringArray(row.secondaryMuscles);
      const equipmentRequired = this.parseStringArray(row.equipmentRequired);
      const stepByStepExecution = this.parseInstructionsArray(row.stepByStepExecution);
      const commonMistakes = this.parseStringArray(row.commonMistakes);
      const safetyInstructions = this.parseStringArray(row.safetyInstructions);
      const tags = this.parseStringArray(row.tags);

      // Environment & Development Level
      const envRaw = String(row.environment || 'hybrid').trim().toLowerCase();
      const environment: 'home' | 'gym' | 'hybrid' = (envRaw === 'home' || envRaw === 'gym') ? envRaw : 'hybrid';

      const devLvlRaw = String(row.developmentLevel || 'beginner').trim().toLowerCase();
      const developmentLevel: 'basic' | 'beginner' | 'advanced' = (devLvlRaw === 'basic' || devLvlRaw === 'advanced') ? devLvlRaw : 'beginner';

      // Status
      const statusRaw = String(row.status || 'published').trim().toLowerCase();
      const status = (statusRaw === 'draft' || statusRaw === 'archived') ? statusRaw : 'published';
      const isPublished = status === 'published';

      // If invalid, record and skip duplicate checks
      if (errors.length > 0) {
        invalid.push({ rowNumber, data: row, errors });
        continue;
      }

      // Prepare item
      const id = String(row.id || '').trim() || `wl-import-${Date.now()}-${i}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

      const item: WorkoutItem = {
        id,
        name,
        normalizedName,
        slug,
        description: String(row.description || `Targeted ${category.toLowerCase()} movement focusing on ${primaryMuscle}.`).trim(),
        primaryMuscle,
        targetMuscle: primaryMuscle,
        secondaryMuscles,
        category,
        equipmentRequired: equipmentRequired.length > 0 ? equipmentRequired : ['Bodyweight'],
        difficulty,
        exerciseType,
        stepByStepExecution: stepByStepExecution.length > 0 ? stepByStepExecution : ['Execute movement with clinical full range of motion under steady tempo.'],
        recommendedSets: isNaN(sets) ? 3 : sets,
        recommendedReps: String(row.recommendedReps || '8-12').trim(),
        restDurationSec: isNaN(restSec) ? 60 : restSec,
        demonstrationImageUrl: row.demonstrationImageUrl || undefined,
        demonstrationVideoUrl: row.demonstrationVideoUrl || undefined,
        commonMistakes,
        safetyInstructions,
        alternativeExerciseIds: [],
        tags: tags.length > 0 ? tags : [category.toLowerCase(), difficulty],
        isPublished,
        status: status as any,
        environment,
        developmentLevel,
        animationType: this.determineAnimationType(category, name),
        importedFrom: 'Bulk Import System',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Check Duplicates (by ID or normalized name in existing library OR within current batch)
      const existingMatch = existingById.get(id.toLowerCase()) || existingByNormName.get(normalizedName);
      const isDuplicateInBatch = seenInBatchById.has(id.toLowerCase()) || seenInBatchByNormName.has(normalizedName);

      if (existingMatch) {
        duplicates.push({
          item,
          rowNumber,
          reason: `Matches existing library entry "${existingMatch.name}" (${existingMatch.id})`,
          existingId: existingMatch.id
        });
      } else if (isDuplicateInBatch) {
        duplicates.push({
          item,
          rowNumber,
          reason: `Duplicate of another record within this upload batch ("${name}")`,
          existingId: id
        });
      } else {
        seenInBatchById.add(id.toLowerCase());
        seenInBatchByNormName.add(normalizedName);
        valid.push(item);
      }
    }

    return {
      total: rawRows.length,
      valid,
      duplicates,
      invalid
    };
  },

  // 4. EXPORT FAILED RECORDS AS SPREADSHEET FOR CORRECTION
  exportFailedRows(invalidRows: { rowNumber: number; data: any; errors: WorkoutValidationError[] }[]): void {
    const rowsToExport = invalidRows.map(inv => ({
      _error_reasons: inv.errors.map(e => `[${e.field}]: ${e.message}`).join(' | '),
      ...inv.data
    }));

    const ws = XLSX.utils.json_to_sheet(rowsToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Failed_Records_Review');
    XLSX.writeFile(wb, `kinetix_failed_imports_row_correction_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  // Helper parsers
  parseStringArray(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
    const str = String(val).trim();
    if (str.includes('|')) return str.split('|').map(s => s.trim()).filter(Boolean);
    if (str.includes(',')) return str.split(',').map(s => s.trim()).filter(Boolean);
    return [str];
  },

  parseInstructionsArray(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
    const str = String(val).trim();
    if (str.includes('|')) return str.split('|').map(s => s.trim()).filter(Boolean);
    if (str.includes('\n')) return str.split('\n').map(s => s.trim()).filter(Boolean);
    if (str.includes(';')) return str.split(';').map(s => s.trim()).filter(Boolean);
    return [str];
  },

  determineAnimationType(category: string, name: string): 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'core' | 'cardio' | 'stretch' {
    const n = name.toLowerCase();
    const c = category.toLowerCase();

    if (n.includes('squat')) return 'squat';
    if (n.includes('lunge') || n.includes('split squat')) return 'lunge';
    if (n.includes('deadlift') || n.includes('rdl') || n.includes('hinge') || n.includes('bridge') || n.includes('thrust')) return 'hinge';
    if (n.includes('press') || n.includes('push') || n.includes('dip') || c === 'chest') return 'push';
    if (n.includes('pull') || n.includes('row') || n.includes('curl') || c === 'back' || c === 'biceps') return 'pull';
    if (c === 'abs and core' || n.includes('plank') || n.includes('crunch')) return 'core';
    if (c === 'cardio' || n.includes('burpee') || n.includes('jump')) return 'cardio';
    return 'stretch';
  }
};
