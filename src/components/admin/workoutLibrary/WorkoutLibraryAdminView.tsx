import React, { useState, useEffect, useTransition } from 'react';
import * as XLSX from 'xlsx';
import { 
  Dumbbell, 
  Search, 
  Filter, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  History, 
  Download, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Home, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { WorkoutItem, WorkoutPageResult, WorkoutStatus, WorkoutDifficulty } from '../../../types/workoutLibrary';
import { workoutLibraryService } from '../../../services/workoutLibraryService';
import { BulkImportModal } from './BulkImportModal';
import { WorkoutEditModal } from './WorkoutEditModal';
import { CategoryManagerModal } from './CategoryManagerModal';
import { AuditLogsModal } from './AuditLogsModal';

export const WorkoutLibraryAdminView: React.FC = () => {
  const [isPending, startTransition] = useTransition();

  // Query & Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'home' | 'gym' | 'hybrid' | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<WorkoutStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'difficulty' | 'updatedAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Page result
  const [pageResult, setPageResult] = useState<WorkoutPageResult>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 25,
    totalPages: 1
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Selected Row IDs for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const categories = workoutLibraryService.getCategories();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await workoutLibraryService.getWorkoutsPage({
        page,
        pageSize,
        search,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        environment: selectedEnvironment,
        status: selectedStatus,
        sortBy,
        sortOrder
      });
      setPageResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, search, selectedCategory, selectedDifficulty, selectedEnvironment, selectedStatus, sortBy, sortOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allOnPage = pageResult.data.map(w => w.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...allOnPage])));
    } else {
      const pageIdSet = new Set(pageResult.data.map(w => w.id));
      setSelectedIds(selectedIds.filter(id => !pageIdSet.has(id)));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllOnPageSelected = pageResult.data.length > 0 && pageResult.data.every(w => selectedIds.includes(w.id));

  // Bulk Actions
  const handleBulkPublish = async (publish: boolean) => {
    const status: WorkoutStatus = publish ? 'published' : 'draft';
    await workoutLibraryService.bulkUpdateStatus(selectedIds, status, publish);
    showToast(`Updated ${selectedIds.length} workouts to ${status.toUpperCase()}`);
    setSelectedIds([]);
    loadData();
  };

  const handleBulkChangeCategory = async () => {
    if (!bulkCategoryTarget) return;
    await workoutLibraryService.bulkUpdateCategory(selectedIds, bulkCategoryTarget);
    showToast(`Reassigned ${selectedIds.length} workouts to category ${bulkCategoryTarget}`);
    setSelectedIds([]);
    setBulkCategoryTarget('');
    loadData();
  };

  const handleBulkDelete = async () => {
    await workoutLibraryService.bulkDelete(selectedIds);
    showToast(`Deleted ${selectedIds.length} workouts`);
    setSelectedIds([]);
    setShowDeleteConfirm(false);
    loadData();
  };

  const handleDeleteSingle = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await workoutLibraryService.deleteWorkout(id);
      showToast(`Deleted "${name}"`);
      loadData();
    }
  };

  const handleSeedDatabase = async () => {
    if (confirm('This will seed the library with 3,245+ verified exercises across all 16 categories. Proceed?')) {
      setIsSeeding(true);
      try {
        localStorage.removeItem('kinetix_library_is_seeded');
        await workoutLibraryService.ensureInitialized();
        showToast('Library seeded with 3,245+ workout entries!');
        loadData();
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const handleExportFiltered = () => {
    workoutLibraryService.getAllCached().then(all => {
      const rows = all.map(w => ({
        id: w.id,
        name: w.name,
        category: w.category,
        primaryMuscle: w.primaryMuscle,
        secondaryMuscles: w.secondaryMuscles.join(', '),
        equipmentRequired: w.equipmentRequired.join(', '),
        difficulty: w.difficulty,
        exerciseType: w.exerciseType,
        sets: w.recommendedSets,
        reps: w.recommendedReps,
        restSec: w.restDurationSec,
        environment: w.environment,
        status: w.status,
        updatedAt: w.updatedAt
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Workout_Library_Export');
      XLSX.writeFile(wb, `kinetix_workout_library_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast(`Exported ${rows.length} workouts to Excel!`);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-black font-mono font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-4">
          <span className="text-xs text-gray-400 uppercase block">Total Workout Entries</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {pageResult.total.toLocaleString()}
          </div>
          <span className="text-[10px] text-cyan-400 mt-1 block">Indexed in Local Engine</span>
        </div>

        <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-4">
          <span className="text-xs text-gray-400 uppercase block">Active Categories</span>
          <div className="text-2xl sm:text-3xl font-black text-lime-accent mt-1">
            {categories.filter(c => c.isActive).length}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">16 Core Domains</span>
        </div>

        <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-4">
          <span className="text-xs text-gray-400 uppercase block">Storage Scale</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">
            50K+
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">Scalable Architecture</span>
        </div>

        <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-4">
          <span className="text-xs text-gray-400 uppercase block">Batch Ingestion</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
            XLSX / CSV
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">Transactional & Idempotent</span>
        </div>
      </div>

      {/* Main Operations Header & Action Toolbar */}
      <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white font-display flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-cyan-400" />
              Workout Library Master Registry
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage, search, bulk import, and calibrate thousands of exercises across all categories.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              title="Populate initial seed database with 3,000+ exercises"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Seeding Library...' : 'Seed 3,000+ Entries'}</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Bulk Upload</span>
            </button>

            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setShowAuditModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit History</span>
            </button>

            <button
              onClick={handleExportFiltered}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => { setEditingWorkout(null); setShowEditModal(true); }}
              className="px-3.5 py-2 rounded-xl bg-lime-accent hover:bg-lime-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-glow-lime"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-[#252D3E] text-xs">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, muscle, equipment, or tag..."
              className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Environment Filter */}
          <div>
            <select
              value={selectedEnvironment}
              onChange={(e) => { setSelectedEnvironment(e.target.value as any); setPage(1); }}
              className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Environments</option>
              <option value="home">🏠 Home Mode</option>
              <option value="gym">🏋️ Gym Mode</option>
              <option value="hybrid">⚡ Hybrid</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
              className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="elite">Elite</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Floating Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in font-mono">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <span>{selectedIds.length} Workouts Selected</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
              >
                Publish All
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
              >
                Move to Draft
              </button>

              <div className="flex items-center gap-1.5">
                <select
                  value={bulkCategoryTarget}
                  onChange={(e) => setBulkCategoryTarget(e.target.value)}
                  className="bg-black/40 border border-white/20 rounded-lg px-2 py-1.5 text-white text-[11px]"
                >
                  <option value="">Move to Category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleBulkChangeCategory}
                  disabled={!bulkCategoryTarget}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-40"
                >
                  Apply
                </button>
              </div>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="text-gray-400 hover:text-white underline ml-2"
              >
                Deselect
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-between gap-3 text-xs animate-pulse">
            <div className="flex items-center gap-2 text-red-200">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>
                Permanently delete <strong>{selectedIds.length}</strong> selected workouts? This action cannot be reversed.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}

        {/* Master Registry Table */}
        <div className="overflow-x-auto border border-[#252D3E] rounded-2xl bg-black/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181E2B] text-gray-400 font-mono uppercase text-[10px] border-b border-[#252D3E]">
              <tr>
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={isAllOnPageSelected}
                    onChange={handleSelectAll}
                    className="accent-cyan-400 rounded"
                  />
                </th>
                <th className="py-3 px-4">Workout Movement</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Primary Muscle</th>
                <th className="py-3 px-3">Equipment</th>
                <th className="py-3 px-3">Difficulty</th>
                <th className="py-3 px-3">Environment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D3E] font-mono text-[11px]">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    Loading indexed workouts...
                  </td>
                </tr>
              ) : pageResult.data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400 space-y-2">
                    <div>No workouts found matching active criteria.</div>
                    <button
                      onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
                      className="text-cyan-400 underline"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              ) : (
                pageResult.data.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr key={item.id} className={`hover:bg-white/[0.02] ${isSelected ? 'bg-cyan-950/20' : ''}`}>
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(item.id)}
                          className="accent-cyan-400 rounded"
                        />
                      </td>

                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-white text-xs">{item.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5 line-clamp-1">
                          {item.id} • {item.recommendedSets} sets × {item.recommendedReps}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-cyan-300">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-300">
                        {item.primaryMuscle}
                      </td>

                      <td className="py-3 px-3 text-gray-400 max-w-[140px] truncate">
                        {item.equipmentRequired.join(', ')}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] capitalize ${
                          item.difficulty === 'elite' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                          item.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                          item.difficulty === 'intermediate' ? 'bg-lime-500/20 text-lime-300 border border-lime-500/40' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {item.difficulty}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          item.environment === 'home' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30' :
                          item.environment === 'gym' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' :
                          'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                        }`}>
                          {item.environment === 'home' ? '🏠 Home' : item.environment === 'gym' ? '🏋️ Gym' : '⚡ Hybrid'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          item.status === 'published' ? 'text-emerald-400 font-bold' : 'text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingWorkout(item); setShowEditModal(true); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                            title="Edit workout"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(item.id, item.name)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                            title="Delete workout"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-gray-400 pt-2">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-bold text-white">
              {Math.min(pageResult.total, (pageResult.page - 1) * pageResult.pageSize + 1)}
            </span>
            <span>to</span>
            <span className="font-bold text-white">
              {Math.min(pageResult.total, pageResult.page * pageResult.pageSize)}
            </span>
            <span>of</span>
            <span className="font-bold text-white">{pageResult.total.toLocaleString()}</span>
            <span>workouts</span>

            <span className="mx-2 text-gray-600">|</span>

            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }}
              className="bg-[#181E2B] border border-[#252D3E] rounded-lg px-2 py-1 text-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <span className="px-3 py-1 font-bold text-white">
              Page {pageResult.page} of {pageResult.totalPages}
            </span>

            <button
              onClick={() => setPage(Math.min(pageResult.totalPages, page + 1))}
              disabled={page >= pageResult.totalPages}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BulkImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={() => {
          showToast('Batch import finished successfully!');
          loadData();
        }}
      />

      <WorkoutEditModal
        isOpen={showEditModal}
        workout={editingWorkout}
        onClose={() => setShowEditModal(false)}
        onSaved={() => {
          showToast(editingWorkout ? 'Workout updated successfully!' : 'New workout created!');
          loadData();
        }}
      />

      <CategoryManagerModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategoriesChanged={() => {
          showToast('Categories updated.');
          loadData();
        }}
      />

      <AuditLogsModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
      />
    </div>
  );
};
