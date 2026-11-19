import { 
  WorkoutItem, 
  WorkoutCategory, 
  WorkoutQueryParams, 
  WorkoutPageResult,
  WorkoutStatus,
  WorkoutImportLog,
  WorkoutAuditLog
} from '../types/workoutLibrary';
import { INITIAL_CATEGORIES } from '../data/initialCategories';
import { generateSeedWorkouts } from '../data/seedWorkoutLibrary';
import { INITIAL_EXERCISES } from '../data/initialExercises';

const DB_NAME = 'KinetixWorkoutDB';
const DB_VERSION = 1;
const STORE_NAME = 'workouts';

const STORAGE_KEYS = {
  CATEGORIES: 'kinetix_workout_categories',
  IMPORT_LOGS: 'kinetix_workout_import_logs',
  AUDIT_LOGS: 'kinetix_workout_audit_logs',
  FAVORITES: 'kinetix_favorite_workouts',
  IS_SEEDED: 'kinetix_library_is_seeded'
};

// Map initial curated exercises to WorkoutItem format
function convertInitialExercisesToWorkouts(): WorkoutItem[] {
  return INITIAL_EXERCISES.map((ex, i) => ({
    id: ex.id,
    name: ex.name,
    normalizedName: ex.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    slug: ex.slug,
    description: `Curated biomechanical exercise for ${ex.targetMuscle} with detailed step-by-step kinetic cues.`,
    primaryMuscle: ex.targetMuscle,
    targetMuscle: ex.targetMuscle,
    secondaryMuscles: ex.secondaryMuscles,
    category: ex.category,
    equipmentRequired: [ex.equipmentRequired],
    difficulty: ex.difficulty as any,
    exerciseType: 'compound',
    stepByStepExecution: ex.stepByStepExecution,
    recommendedSets: ex.recommendedSets,
    recommendedReps: ex.recommendedReps,
    restDurationSec: ex.restDurationSec,
    demonstrationImageUrl: ex.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    demonstrationVideoUrl: undefined,
    commonMistakes: ex.commonMistakes,
    safetyInstructions: ex.safetyInstructions,
    alternativeExerciseIds: [],
    tags: [ex.category.toLowerCase(), ex.difficulty, ex.environment || 'hybrid'],
    isPublished: ex.isPublished,
    status: ex.isPublished ? 'published' : 'draft',
    environment: ex.environment || 'hybrid',
    developmentLevel: ex.developmentLevel || 'beginner',
    animationType: ex.animationType,
    viewsCount: ex.viewsCount || 500 + i * 20,
    importedFrom: 'Kinetix Core Curated Library',
    createdAt: '2026-10-15T08:00:00Z',
    updatedAt: '2026-11-19T00:00:00Z'
  }));
}

// In-Memory cache for high-speed search and fallback if IndexedDB is blocked
let inMemoryCache: WorkoutItem[] | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('normalizedName', 'normalizedName', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('difficulty', 'difficulty', { unique: false });
        store.createIndex('environment', 'environment', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.warn('Failed to open IndexedDB, falling back to memory store:', request.error);
      reject(request.error);
    };
  });

  return dbPromise;
}

export const workoutLibraryService = {
  // INITIALIZATION & SEEDING (Generates 3,000+ entries)
  async ensureInitialized(): Promise<number> {
    const isSeeded = localStorage.getItem(STORAGE_KEYS.IS_SEEDED);
    if (isSeeded && inMemoryCache && inMemoryCache.length >= 3000) {
      return inMemoryCache.length;
    }

    try {
      const db = await getDB();
      const count = await this.count();
      if (count >= 3000) {
        localStorage.setItem(STORAGE_KEYS.IS_SEEDED, 'true');
        return count;
      }

      // Populate seed dataset (3,200 procedural items + 45 curated base items)
      const baseCurated = convertInitialExercisesToWorkouts();
      const generated = generateSeedWorkouts(3200);
      const allSeed = [...baseCurated, ...generated];

      await this.bulkInsertInternal(db, allSeed);
      inMemoryCache = allSeed;
      localStorage.setItem(STORAGE_KEYS.IS_SEEDED, 'true');
      this.addAuditLog('bulk_import', 'system', 'Seed Generator', `Initialized 3,245 base library workouts across 16 categories.`);
      return allSeed.length;
    } catch (e) {
      console.warn('IndexedDB initialization failed, seeding in-memory store:', e);
      if (!inMemoryCache || inMemoryCache.length < 3000) {
        const baseCurated = convertInitialExercisesToWorkouts();
        const generated = generateSeedWorkouts(3200);
        inMemoryCache = [...baseCurated, ...generated];
      }
      return inMemoryCache.length;
    }
  },

  async count(): Promise<number> {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(inMemoryCache ? inMemoryCache.length : 0);
      });
    } catch {
      return inMemoryCache ? inMemoryCache.length : 0;
    }
  },

  async bulkInsertInternal(db: IDBDatabase, items: WorkoutItem[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const item of items) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  // PAGINATED & FILTERED QUERY ENGINE
  async getWorkoutsPage(params: WorkoutQueryParams): Promise<WorkoutPageResult> {
    await this.ensureInitialized();
    const all = await this.getAllCached();

    const {
      page = 1,
      pageSize = 24,
      search = '',
      category,
      primaryMuscle,
      equipment,
      difficulty,
      environment,
      status,
      sortBy = 'name',
      sortOrder = 'asc'
    } = params;

    const query = search.trim().toLowerCase();

    // Filter
    let filtered = all.filter(item => {
      if (status && status !== 'all' && item.status !== status) return false;
      if (category && category !== 'All' && item.category !== category) return false;
      if (primaryMuscle && item.primaryMuscle !== primaryMuscle) return false;
      if (difficulty && difficulty !== 'All' && item.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
      if (environment && environment !== 'all') {
        if (item.environment !== 'hybrid' && item.environment !== environment) return false;
      }
      if (equipment && equipment !== 'All') {
        if (!item.equipmentRequired.some(eq => eq.toLowerCase().includes(equipment.toLowerCase()))) return false;
      }

      if (query) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesMuscle = item.primaryMuscle.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(query));
        const matchesEq = item.equipmentRequired.some(eq => eq.toLowerCase().includes(query));
        if (!matchesName && !matchesMuscle && !matchesCategory && !matchesTags && !matchesEq) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'difficulty':
          comparison = a.difficulty.localeCompare(b.difficulty);
          break;
        case 'updatedAt':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'name':
        default:
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (currentPage - 1) * pageSize;
    const paginatedData = filtered.slice(startIdx, startIdx + pageSize);

    return {
      data: paginatedData,
      total,
      page: currentPage,
      pageSize,
      totalPages
    };
  },

  async getAllCached(): Promise<WorkoutItem[]> {
    if (inMemoryCache && inMemoryCache.length > 0) {
      return inMemoryCache;
    }

    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          inMemoryCache = req.result;
          resolve(req.result);
        };
        req.onerror = () => {
          resolve(inMemoryCache || []);
        };
      });
    } catch {
      return inMemoryCache || [];
    }
  },

  async getWorkoutById(id: string): Promise<WorkoutItem | null> {
    const all = await this.getAllCached();
    return all.find(w => w.id === id) || null;
  },

  async createWorkout(item: Omit<WorkoutItem, 'id' | 'createdAt' | 'updatedAt' | 'normalizedName' | 'slug'>): Promise<WorkoutItem> {
    const id = 'wl-item-' + Date.now();
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const normalizedName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const now = new Date().toISOString();

    const newItem: WorkoutItem = {
      ...item,
      id,
      slug,
      normalizedName,
      createdAt: now,
      updatedAt: now
    };

    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(newItem);
    } catch {
      // fallback
    }

    if (inMemoryCache) {
      inMemoryCache.unshift(newItem);
    }

    this.addAuditLog('create', newItem.id, newItem.name, `Created single exercise entry in category ${newItem.category}.`);
    return newItem;
  },

  async updateWorkout(id: string, updates: Partial<WorkoutItem>): Promise<WorkoutItem | null> {
    const all = await this.getAllCached();
    const index = all.findIndex(w => w.id === id);
    if (index === -1) return null;

    const existing = all[index];
    const updatedName = updates.name || existing.name;
    const updated: WorkoutItem = {
      ...existing,
      ...updates,
      name: updatedName,
      normalizedName: updatedName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      slug: updatedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      updatedAt: new Date().toISOString()
    };

    all[index] = updated;

    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(updated);
    } catch {
      // fallback
    }

    this.addAuditLog('update', id, updated.name, `Updated fields: ${Object.keys(updates).join(', ')}`);
    return updated;
  },

  async deleteWorkout(id: string): Promise<boolean> {
    const all = await this.getAllCached();
    const target = all.find(w => w.id === id);
    if (!target) return false;

    inMemoryCache = all.filter(w => w.id !== id);

    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
    } catch {
      // fallback
    }

    this.addAuditLog('delete', id, target.name, `Permanently removed workout record from library.`);
    return true;
  },

  async bulkDelete(ids: string[]): Promise<number> {
    const all = await this.getAllCached();
    const idSet = new Set(ids);
    inMemoryCache = all.filter(w => !idSet.has(w.id));

    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const id of ids) {
        store.delete(id);
      }
    } catch {
      // fallback
    }

    this.addAuditLog('bulk_delete', 'multiple', `${ids.length} Workouts`, `Bulk deleted ${ids.length} workout records with confirmation.`);
    return ids.length;
  },

  async bulkUpdateStatus(ids: string[], status: WorkoutStatus, isPublished: boolean): Promise<number> {
    const all = await this.getAllCached();
    const idSet = new Set(ids);
    const now = new Date().toISOString();

    for (const item of all) {
      if (idSet.has(item.id)) {
        item.status = status;
        item.isPublished = isPublished;
        item.updatedAt = now;
      }
    }

    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const item of all.filter(w => idSet.has(w.id))) {
        store.put(item);
      }
    } catch {
      // fallback
    }

    this.addAuditLog(isPublished ? 'bulk_publish' : 'bulk_unpublish', 'multiple', `${ids.length} Workouts`, `Bulk set status to ${status.toUpperCase()}.`);
    return ids.length;
  },

  async bulkUpdateCategory(ids: string[], category: string): Promise<number> {
    const all = await this.getAllCached();
    const idSet = new Set(ids);
    const now = new Date().toISOString();

    for (const item of all) {
      if (idSet.has(item.id)) {
        item.category = category;
        item.updatedAt = now;
      }
    }

    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const item of all.filter(w => idSet.has(w.id))) {
        store.put(item);
      }
    } catch {
      // fallback
    }

    this.addAuditLog('bulk_category_change', 'multiple', `${ids.length} Workouts`, `Bulk reassigned category to ${category}.`);
    return ids.length;
  },

  // BULK IMPORT EXECUTION WITH CHUNKING
  async importBatch(
    items: WorkoutItem[], 
    options: { 
      overwriteExisting?: boolean; 
      batchSize?: number;
      onProgress?: (processed: number, total: number) => void 
    } = {}
  ): Promise<{ imported: number; updated: number; skipped: number }> {
    const { overwriteExisting = false, batchSize = 100, onProgress } = options;
    const all = await this.getAllCached();
    const existingById = new Map<string, WorkoutItem>(all.map(w => [w.id, w]));
    const existingByNormName = new Map<string, WorkoutItem>(all.map(w => [w.normalizedName, w]));

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    const toInsertOrUpdate: WorkoutItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      const match = existingById.get(row.id) || existingByNormName.get(row.normalizedName);

      if (match) {
        if (overwriteExisting) {
          const merged: WorkoutItem = { ...match, ...row, updatedAt: new Date().toISOString() };
          toInsertOrUpdate.push(merged);
          updatedCount++;
        } else {
          skippedCount++;
        }
      } else {
        toInsertOrUpdate.push(row);
        importedCount++;
      }

      if (onProgress && (i % 25 === 0 || i === items.length - 1)) {
        onProgress(i + 1, items.length);
      }
    }

    // Process chunked write to IndexedDB
    try {
      const db = await getDB();
      for (let i = 0; i < toInsertOrUpdate.length; i += batchSize) {
        const chunk = toInsertOrUpdate.slice(i, i + batchSize);
        await this.bulkInsertInternal(db, chunk);
        // Yield to prevent UI freeze
        await new Promise(r => setTimeout(r, 0));
      }
    } catch {
      // fallback
    }

    // Refresh memory cache
    inMemoryCache = null;
    await this.getAllCached();

    return { imported: importedCount, updated: updatedCount, skipped: skippedCount };
  },

  // CATEGORIES MANAGEMENT
  getCategories(): WorkoutCategory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  },

  saveCategories(categories: WorkoutCategory[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  addCategory(category: Omit<WorkoutCategory, 'id' | 'createdAt'>): WorkoutCategory {
    const list = this.getCategories();
    const id = 'cat-' + category.slug;
    const newCat: WorkoutCategory = {
      ...category,
      id,
      createdAt: new Date().toISOString()
    };
    list.push(newCat);
    this.saveCategories(list);
    this.addAuditLog('category_create', newCat.id, newCat.name, `Added new workout category: ${newCat.name}`);
    return newCat;
  },

  updateCategory(id: string, updates: Partial<WorkoutCategory>): WorkoutCategory | null {
    const list = this.getCategories();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return null;

    list[idx] = { ...list[idx], ...updates };
    this.saveCategories(list);
    return list[idx];
  },

  async mergeCategories(sourceSlug: string, targetSlug: string): Promise<{ affectedCount: number }> {
    const list = this.getCategories();
    const sourceCat = list.find(c => c.slug === sourceSlug);
    const targetCat = list.find(c => c.slug === targetSlug);

    if (!sourceCat || !targetCat) return { affectedCount: 0 };

    // Deactivate source category
    sourceCat.isActive = false;
    this.saveCategories(list);

    // Re-tag all workouts in sourceCat to targetCat
    const all = await this.getAllCached();
    let affected = 0;
    const affectedIds: string[] = [];

    for (const item of all) {
      if (item.category === sourceCat.name) {
        item.category = targetCat.name;
        affectedIds.push(item.id);
        affected++;
      }
    }

    if (affected > 0) {
      await this.bulkUpdateCategory(affectedIds, targetCat.name);
    }

    this.addAuditLog('category_merge', targetCat.id, `${sourceCat.name} ➔ ${targetCat.name}`, `Merged category ${sourceCat.name} into ${targetCat.name}, updating ${affected} workouts.`);
    return { affectedCount: affected };
  },

  // IMPORT LOGS
  getImportLogs(): WorkoutImportLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IMPORT_LOGS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  addImportLog(log: WorkoutImportLog): void {
    const list = this.getImportLogs();
    list.unshift(log);
    // Keep last 50 logs
    if (list.length > 50) list.pop();
    localStorage.setItem(STORAGE_KEYS.IMPORT_LOGS, JSON.stringify(list));
  },

  // AUDIT LOGS
  getAuditLogs(): WorkoutAuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  addAuditLog(action: WorkoutAuditLog['action'], entityId: string, entityName: string, details: string): void {
    const list = this.getAuditLogs();
    list.unshift({
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      action,
      entityId,
      entityName,
      details,
      performedBy: 'Super Admin',
      timestamp: new Date().toISOString()
    });
    if (list.length > 100) list.pop();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(list));
  },

  // USER FAVORITE / SAVED WORKOUTS
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  toggleFavorite(workoutId: string): boolean {
    const favs = this.getFavorites();
    const index = favs.indexOf(workoutId);
    let isFav = false;
    if (index >= 0) {
      favs.splice(index, 1);
      isFav = false;
    } else {
      favs.push(workoutId);
      isFav = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return isFav;
  },

  isFavorite(workoutId: string): boolean {
    return this.getFavorites().includes(workoutId);
  }
};
