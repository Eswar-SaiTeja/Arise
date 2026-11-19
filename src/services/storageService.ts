import { 
  UserProfile, 
  Exercise, 
  ManualChapter, 
  WorkoutProgram, 
  WorkoutLogEntry, 
  BodyMeasurementEntry, 
  PersonalRecord, 
  Achievement, 
  AppNotification,
  ActiveWorkoutSession,
  FitnessChallenge
} from '../types';
import { INITIAL_MANUAL_CHAPTERS } from '../data/initialManual';
import { INITIAL_EXERCISES } from '../data/initialExercises';
import { INITIAL_PROGRAMS } from '../data/initialPrograms';
import { INITIAL_ACHIEVEMENTS } from '../data/initialAchievements';
import { INITIAL_CHALLENGES } from '../data/initialChallenges';
import { hunterService } from './hunterService';

const STORAGE_KEYS = {
  PROFILE: 'kinetix_profile',
  EXERCISES: 'kinetix_exercises',
  MANUAL: 'kinetix_manual_chapters',
  PROGRAMS: 'kinetix_programs',
  WORKOUT_LOGS: 'kinetix_workout_logs',
  MEASUREMENTS: 'kinetix_body_measurements',
  PRS: 'kinetix_personal_records',
  ACHIEVEMENTS: 'kinetix_achievements',
  NOTIFICATIONS: 'kinetix_notifications',
  BOOKMARKS: 'kinetix_bookmarks',
  READING_PROGRESS: 'kinetix_reading_progress',
  ACTIVE_WORKOUT: 'kinetix_active_workout_session',
  ENROLLED_PROGRAM: 'kinetix_enrolled_program_id',
  CHALLENGES: 'kinetix_challenges',
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-athlete-01',
  email: 'athlete@fitness.pro',
  fullName: 'Marcus Vance',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  age: 28,
  gender: 'Male',
  heightCm: 182,
  weightKg: 81.5,
  fitnessLevel: 'intermediate',
  primaryGoal: 'muscle_gain',
  workoutPreference: 'gym',
  equipmentAvailable: ['Barbell', 'Dumbbells', 'Bench', 'Pull-up Bar', 'Cables'],
  preferredDurationMin: 55,
  weeklyFrequency: 4,
  isAdmin: true, // Gives access to admin dashboard for testing & managing
  isOnboarded: true,
  streakCount: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unitPreference: 'metric',
  soundEnabled: true,
  trainingEnvironment: 'gym',
  developmentLevel: 'beginner',
  selected_difficulty_mode: 'normal',
  theme_preference: 'purple',
  createdAt: '2026-10-15T08:00:00Z',
};

const INITIAL_MEASUREMENTS: BodyMeasurementEntry[] = [
  { id: 'm-1', date: '2026-10-15', weightKg: 84.0, bodyFatPercentage: 18.2, chestCm: 104, waistCm: 86, hipsCm: 99, armsCm: 37.5, thighsCm: 59 },
  { id: 'm-2', date: '2026-10-22', weightKg: 83.4, bodyFatPercentage: 17.8, chestCm: 104.5, waistCm: 85.5, hipsCm: 98.5, armsCm: 37.8, thighsCm: 59.2 },
  { id: 'm-3', date: '2026-10-29', weightKg: 82.8, bodyFatPercentage: 17.3, chestCm: 105, waistCm: 85, hipsCm: 98, armsCm: 38.0, thighsCm: 59.5 },
  { id: 'm-4', date: '2026-11-05', weightKg: 82.2, bodyFatPercentage: 16.8, chestCm: 105.5, waistCm: 84.2, hipsCm: 97.5, armsCm: 38.2, thighsCm: 60.0 },
  { id: 'm-5', date: '2026-11-12', weightKg: 81.8, bodyFatPercentage: 16.4, chestCm: 106, waistCm: 83.8, hipsCm: 97, armsCm: 38.5, thighsCm: 60.2 },
  { id: 'm-6', date: '2026-11-18', weightKg: 81.5, bodyFatPercentage: 16.0, chestCm: 106.5, waistCm: 83.2, hipsCm: 96.8, armsCm: 38.8, thighsCm: 60.5 },
];

const INITIAL_PRS: PersonalRecord[] = [
  { id: 'pr-1', exerciseId: 'ex-barbell-bench', exerciseName: 'Barbell Flat Bench Press', recordType: '1rm', value: 115, unit: 'kg', achievedAt: '2026-11-14' },
  { id: 'pr-2', exerciseId: 'ex-barbell-back-squat', exerciseName: 'Barbell Back Squat', recordType: '1rm', value: 150, unit: 'kg', achievedAt: '2026-11-12' },
  { id: 'pr-3', exerciseId: 'ex-barbell-deadlift', exerciseName: 'Conventional Barbell Deadlift', recordType: '1rm', value: 190, unit: 'kg', achievedAt: '2026-11-08' },
  { id: 'pr-4', exerciseId: 'ex-overhead-barbell-press', exerciseName: 'Standing Overhead Military Press', recordType: '1rm', value: 75, unit: 'kg', achievedAt: '2026-11-10' },
  { id: 'pr-5', exerciseId: 'ex-pullup', exerciseName: 'Strict Overhand Pull-Up', recordType: 'max_reps', value: 16, unit: 'reps', achievedAt: '2026-11-16' },
];

const INITIAL_WORKOUT_LOGS: WorkoutLogEntry[] = [
  {
    id: 'log-1',
    title: 'Upper Body Power & Chest Dominance',
    programTitle: 'Hypertrophy Matrix: Muscle Building',
    completedAt: '2026-11-18T18:30:00Z',
    durationSeconds: 3120, // 52 mins
    totalVolumeKg: 6480,
    totalSetsCompleted: 17,
    totalRepsCompleted: 142,
    rating: 5,
    notes: 'Incredible pump on the incline dumbbell press. Managed 36kg for 10 reps.',
    exercises: [
      {
        exerciseName: 'Barbell Flat Bench Press',
        targetMuscle: 'Pectoralis Major',
        sets: [
          { setNumber: 1, weightKg: 90, completedReps: 8 },
          { setNumber: 2, weightKg: 95, completedReps: 7 },
          { setNumber: 3, weightKg: 95, completedReps: 6 },
          { setNumber: 4, weightKg: 100, completedReps: 5 }
        ]
      },
      {
        exerciseName: 'Strict Overhand Pull-Up',
        targetMuscle: 'Latissimus Dorsi',
        sets: [
          { setNumber: 1, weightKg: 0, completedReps: 10 },
          { setNumber: 2, weightKg: 0, completedReps: 9 },
          { setNumber: 3, weightKg: 0, completedReps: 8 },
          { setNumber: 4, weightKg: 0, completedReps: 8 }
        ]
      }
    ]
  },
  {
    id: 'log-2',
    title: 'Quad Dominance & Posterior Chain',
    programTitle: 'Hypertrophy Matrix: Muscle Building',
    completedAt: '2026-11-16T17:45:00Z',
    durationSeconds: 3360,
    totalVolumeKg: 7820,
    totalSetsCompleted: 16,
    totalRepsCompleted: 128,
    rating: 4,
    notes: 'Squats felt fast and explosive out of the hole.',
    exercises: [
      {
        exerciseName: 'Barbell Back Squat',
        targetMuscle: 'Quadriceps',
        sets: [
          { setNumber: 1, weightKg: 120, completedReps: 8 },
          { setNumber: 2, weightKg: 130, completedReps: 7 },
          { setNumber: 3, weightKg: 135, completedReps: 6 },
          { setNumber: 4, weightKg: 140, completedReps: 5 }
        ]
      }
    ]
  },
  {
    id: 'log-3',
    title: 'Shoulders, Back & Arms Hypertrophy',
    programTitle: 'Hypertrophy Matrix: Muscle Building',
    completedAt: '2026-11-14T18:15:00Z',
    durationSeconds: 2880,
    totalVolumeKg: 5240,
    totalSetsCompleted: 18,
    totalRepsCompleted: 164,
    rating: 5,
    notes: 'Shoulder pump was insane.',
    exercises: [
      {
        exerciseName: 'Standing Overhead Military Press',
        targetMuscle: 'Anterior & Lateral Deltoids',
        sets: [
          { setNumber: 1, weightKg: 60, completedReps: 8 },
          { setNumber: 2, weightKg: 65, completedReps: 6 },
          { setNumber: 3, weightKg: 65, completedReps: 6 }
        ]
      }
    ]
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'reminder',
    title: "Today's Mission: Day 1 Push Power",
    message: 'Your scheduled session is waiting. Hydrate and prepare your mind for mechanical tension.',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'streak',
    title: '4-Day Streak Burning Hot! 🔥',
    message: 'You have logged 4 consecutive days of athletic progress. 3 more days to unlock Iron Discipline.',
    timestamp: 'Yesterday',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'Achievement Unlocked: 10,000 kg Club 🏆',
    message: 'You surpassed 10,000 kilograms in total recorded training volume!',
    timestamp: '2 days ago',
    isRead: true
  }
];

export const storageService = {
  // PROFILE
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    this.saveProfile(DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  // EXERCISES
  getExercises(): Exercise[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
      if (data) {
        const stored: Exercise[] = JSON.parse(data);
        if (stored.length < INITIAL_EXERCISES.length || !stored.some(e => e.environment)) {
          const customExercises = stored.filter(e => !INITIAL_EXERCISES.some(ie => ie.id === e.id));
          const updated = [...INITIAL_EXERCISES, ...customExercises];
          localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(updated));
          return updated;
        }
        return stored;
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
    return INITIAL_EXERCISES;
  },

  saveExercise(exercise: Exercise): void {
    const list = this.getExercises();
    const idx = list.findIndex(e => e.id === exercise.id);
    if (idx >= 0) {
      list[idx] = exercise;
    } else {
      list.unshift(exercise);
    }
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(list));
  },

  deleteExercise(id: string): void {
    const list = this.getExercises().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(list));
  },

  // MANUAL CHAPTERS
  getManualChapters(): ManualChapter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MANUAL);
      if (data) {
        const storedChapters: ManualChapter[] = JSON.parse(data);
        if (storedChapters.length < INITIAL_MANUAL_CHAPTERS.length) {
          const missing = INITIAL_MANUAL_CHAPTERS.filter(ic => !storedChapters.some(sc => sc.id === ic.id));
          const updated = [...storedChapters, ...missing].sort((a, b) => a.chapterNumber - b.chapterNumber);
          localStorage.setItem(STORAGE_KEYS.MANUAL, JSON.stringify(updated));
          return updated;
        }
        return storedChapters;
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.MANUAL, JSON.stringify(INITIAL_MANUAL_CHAPTERS));
    return INITIAL_MANUAL_CHAPTERS;
  },

  saveChapter(chapter: ManualChapter): void {
    const list = this.getManualChapters();
    const idx = list.findIndex(c => c.id === chapter.id);
    if (idx >= 0) {
      list[idx] = chapter;
    } else {
      list.push(chapter);
    }
    localStorage.setItem(STORAGE_KEYS.MANUAL, JSON.stringify(list));
  },

  deleteChapter(id: string): void {
    const list = this.getManualChapters().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.MANUAL, JSON.stringify(list));
  },

  // WORKOUT PROGRAMS
  getPrograms(): WorkoutProgram[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(INITIAL_PROGRAMS));
    return INITIAL_PROGRAMS;
  },

  saveProgram(program: WorkoutProgram): void {
    const list = this.getPrograms();
    const idx = list.findIndex(p => p.id === program.id);
    if (idx >= 0) {
      list[idx] = program;
    } else {
      list.unshift(program);
    }
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(list));
  },

  deleteProgram(id: string): void {
    const list = this.getPrograms().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(list));
  },

  getEnrolledProgramId(): string {
    return localStorage.getItem(STORAGE_KEYS.ENROLLED_PROGRAM) || 'prog-hypertrophy-elite';
  },

  setEnrolledProgramId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ENROLLED_PROGRAM, id);
  },

  // WORKOUT LOGS
  getWorkoutLogs(): WorkoutLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(INITIAL_WORKOUT_LOGS));
    return INITIAL_WORKOUT_LOGS;
  },

  logWorkout(entry: WorkoutLogEntry): void {
    const logs = this.getWorkoutLogs();
    logs.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs));

    // Update streak and profile stats
    const profile = this.getProfile();
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      profile.streakCount += 1;
      profile.lastActiveDate = today;
      this.saveProfile(profile);
    }
  },

  // MEASUREMENTS
  getBodyMeasurements(): BodyMeasurementEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(INITIAL_MEASUREMENTS));
    return INITIAL_MEASUREMENTS;
  },

  addBodyMeasurement(entry: BodyMeasurementEntry): void {
    const list = this.getBodyMeasurements();
    list.push(entry);
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(list));

    // Also update current profile weight
    const profile = this.getProfile();
    profile.weightKg = entry.weightKg;
    this.saveProfile(profile);
  },

  // PERSONAL RECORDS
  getPersonalRecords(): PersonalRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(INITIAL_PRS));
    return INITIAL_PRS;
  },

  updatePersonalRecord(record: PersonalRecord): void {
    const list = this.getPersonalRecords();
    const idx = list.findIndex(r => r.exerciseId === record.exerciseId && r.recordType === record.recordType);
    if (idx >= 0) {
      if (record.value > list[idx].value) {
        list[idx] = record;
      }
    } else {
      list.push(record);
    }
    localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(list));
  },

  // ACHIEVEMENTS
  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
    return INITIAL_ACHIEVEMENTS;
  },

  unlockAchievement(id: string): void {
    const list = this.getAchievements();
    const target = list.find(a => a.id === id);
    if (target && !target.isUnlocked) {
      target.isUnlocked = true;
      target.unlockedAt = new Date().toISOString();
      target.progress = 100;
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(list));

      this.addNotification({
        id: 'ach-notif-' + Date.now(),
        type: 'achievement',
        title: `Achievement Unlocked: ${target.title}! 🏆`,
        message: target.description,
        timestamp: 'Just now',
        isRead: false
      });
    }
  },

  // NOTIFICATIONS
  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  },

  addNotification(notif: AppNotification): void {
    const list = this.getNotifications();
    list.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  markNotificationRead(id: string): void {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  clearAllNotifications(): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  },

  // BOOKMARKS
  getBookmarks(): { type: string; id: string }[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return [
      { type: 'chapter', id: 'ch-3' },
      { type: 'exercise', id: 'ex-barbell-bench' },
      { type: 'exercise', id: 'ex-barbell-deadlift' }
    ];
  },

  toggleBookmark(type: 'chapter' | 'exercise' | 'program', id: string): boolean {
    const list = this.getBookmarks();
    const idx = list.findIndex(b => b.type === type && b.id === id);
    let bookmarked = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      bookmarked = false;
    } else {
      list.push({ type, id });
      bookmarked = true;
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    return bookmarked;
  },

  isBookmarked(type: 'chapter' | 'exercise' | 'program', id: string): boolean {
    return this.getBookmarks().some(b => b.type === type && b.id === id);
  },

  // READING PROGRESS
  getReadingProgress(): Record<string, number> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return {
      'ch-1': 100,
      'ch-2': 100,
      'ch-3': 65,
    };
  },

  saveReadingProgress(chapterId: string, percentage: number): void {
    const progress = this.getReadingProgress();
    progress[chapterId] = Math.max(progress[chapterId] || 0, Math.min(100, percentage));
    localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(progress));
  },

  // ACTIVE WORKOUT ENGINE PERSISTENCE
  getActiveWorkout(): ActiveWorkoutSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return null;
  },

  saveActiveWorkout(session: ActiveWorkoutSession): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(session));
  },

  clearActiveWorkout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  },

  // CHALLENGES SYSTEM
  getChallenges(): FitnessChallenge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
    return INITIAL_CHALLENGES;
  },

  joinChallenge(challengeId: string): void {
    const list = this.getChallenges();
    const challenge = list.find(c => c.id === challengeId);
    if (challenge && !challenge.isJoined) {
      challenge.isJoined = true;
      challenge.participantsCount += 1;
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(list));
    }
  },

  claimChallengeReward(challengeId: string): { success: boolean; xpAwarded: number } {
    const list = this.getChallenges();
    const challenge = list.find(c => c.id === challengeId);
    if (challenge && challenge.isCompleted) {
      // Reward XP via hunterService
      hunterService.awardXP(challenge.xpReward, 'weekly_challenge', `Completed Challenge: ${challenge.title}`);
      // Mark as rewarded or notification
      this.addNotification({
        id: 'notif-' + Date.now(),
        type: 'achievement',
        title: '🏆 Challenge Completed!',
        message: `Claimed +${challenge.xpReward} XP for completing ${challenge.title}!`,
        timestamp: 'Just now',
        isRead: false
      });
      return { success: true, xpAwarded: challenge.xpReward };
    }
    return { success: false, xpAwarded: 0 };
  },

  updateChallengeProgress(challengeId: string, delta: number): void {
    const list = this.getChallenges();
    const challenge = list.find(c => c.id === challengeId);
    if (challenge && challenge.isJoined && !challenge.isCompleted) {
      challenge.currentValue = Math.min(challenge.targetValue, challenge.currentValue + delta);
      if (challenge.currentValue >= challenge.targetValue) {
        challenge.isCompleted = true;
      }
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(list));
    }
  },

  // EXPORT UTILITIES (CSV & JSON)
  exportWorkoutsCSV(): string {
    const logs = this.getWorkoutLogs();
    let csv = 'Workout ID,Title,Program,Completed At,Duration (Minutes),Total Volume (kg),Sets Completed,Reps Completed,Rating,Notes\n';
    logs.forEach(l => {
      const durationMin = Math.round(l.durationSeconds / 60);
      const cleanNotes = (l.notes || '').replace(/,/g, ' ');
      csv += `"${l.id}","${l.title}","${l.programTitle || 'Custom'}","${l.completedAt}",${durationMin},${l.totalVolumeKg},${l.totalSetsCompleted},${l.totalRepsCompleted},${l.rating || ''},"${cleanNotes}"\n`;
    });
    return csv;
  },

  exportWorkoutsJSON(): string {
    const data = {
      profile: this.getProfile(),
      workoutLogs: this.getWorkoutLogs(),
      personalRecords: this.getPersonalRecords(),
      bodyMeasurements: this.getBodyMeasurements(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }
};
