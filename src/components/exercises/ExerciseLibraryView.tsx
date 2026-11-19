import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Dumbbell, 
  SlidersHorizontal, 
  Sparkles, 
  Plus, 
  Bookmark, 
  Play, 
  ArrowRight, 
  Home, 
  Repeat,
  ChevronLeft,
  ChevronRight,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { Exercise } from '../../types';
import { WorkoutItem, WorkoutPageResult } from '../../types/workoutLibrary';
import { workoutLibraryService } from '../../services/workoutLibraryService';
import { environmentService } from '../../services/environmentService';
import { storageService } from '../../services/storageService';
import { ExerciseAnimation } from '../common/ExerciseAnimation';
import { ExerciseDetailModal } from './ExerciseDetailModal';

interface ExerciseLibraryViewProps {
  onStartExercise: (exercise: Exercise) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  onStartExercise,
}) => {
  const profile = storageService.getProfile();
  const currentEnv = environmentService.getCurrentEnvironment();
  const categories = workoutLibraryService.getCategories();

  // Query & Filter States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'all' | 'home' | 'gym'>(currentEnv || 'all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => workoutLibraryService.getFavorites());

  // Data & Modal States
  const [pageResult, setPageResult] = useState<WorkoutPageResult>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 24,
    totalPages: 1
  });
  const [recommendations, setRecommendations] = useState<WorkoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);

  // Load Library Data
  const loadWorkouts = async () => {
    setIsLoading(true);
    try {
      const res = await workoutLibraryService.getWorkoutsPage({
        page,
        pageSize,
        search: searchQuery,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        environment: selectedEnvironment,
        status: 'published'
      });

      // If favorites only filter is active
      if (favoritesOnly) {
        const favSet = new Set(favorites);
        res.data = res.data.filter(w => favSet.has(w.id));
        res.total = res.data.length;
        res.totalPages = Math.max(1, Math.ceil(res.total / pageSize));
      }

      setPageResult(res);

      // Load personalized recommendations (top 3 matching user's goal & environment)
      if (recommendations.length === 0) {
        const all = await workoutLibraryService.getAllCached();
        const recs = all.filter(w => {
          const matchEnv = w.environment === currentEnv || w.environment === 'hybrid';
          const matchGoal = profile.primaryGoal === 'fat_loss' ? (w.category === 'Cardio' || w.category === 'Full Body') :
                            profile.primaryGoal === 'muscle_gain' ? (w.category === 'Chest' || w.category === 'Legs' || w.category === 'Back') :
                            true;
          return matchEnv && matchGoal && w.isPublished;
        }).slice(0, 3);
        setRecommendations(recs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [page, pageSize, searchQuery, selectedCategory, selectedDifficulty, selectedEnvironment, favoritesOnly]);

  const handleToggleFav = (workoutId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFav = workoutLibraryService.toggleFavorite(workoutId);
    setFavorites(workoutLibraryService.getFavorites());
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141A28] via-[#101520] to-[#0E121A] border border-[#252D3E] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold mb-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>PRECISION MOVEMENT REPOSITORY ({pageResult.total.toLocaleString()} Indexed Entries)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Scalable Biomechanical Workout Library
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              Evidence-based kinetic demonstrations, calibrated rest intervals, and clinical execution cues across 16 movement domains.
            </p>
          </div>

          <div className="text-xs font-mono text-gray-400 bg-[#181E2B] border border-[#252D3E] px-4 py-3 rounded-2xl shrink-0 space-y-1">
            <div>Total Indexed: <strong className="text-cyan-400 font-bold">{pageResult.total.toLocaleString()}</strong></div>
            <div className="text-[10px] text-gray-500">Active Environment: <strong className="text-white uppercase">{currentEnv} MODE</strong></div>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations Shelf */}
      {recommendations.length > 0 && !searchQuery && (
        <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Recommended For You ({profile.primaryGoal.replace(/_/g, ' ')})</span>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">Calibrated to {currentEnv.toUpperCase()} MODE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.map(rec => (
              <div
                key={rec.id}
                onClick={() => setActiveModalExercise(rec as any)}
                className="bg-[#141923] border border-[#252D3E] hover:border-cyan-400/50 p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 uppercase">
                    <span>{rec.category}</span>
                    <span>•</span>
                    <span>{rec.difficulty}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {rec.name}
                  </h4>
                  <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                    {rec.equipmentRequired.join(', ')}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="space-y-3 bg-[#141923] border border-[#252D3E] rounded-3xl p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search by exercise name, target muscle, equipment, or tags..."
              className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
              className="bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="elite">Elite</option>
            </select>

            {/* Favorites Toggle */}
            <button
              onClick={() => { setFavoritesOnly(!favoritesOnly); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all ${
                favoritesOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-[#181E2B] text-gray-400 border-[#252D3E] hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
            </button>
          </div>
        </div>

        {/* Environment Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#252D3E]">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Ground:
          </span>
          <button
            onClick={() => { setSelectedEnvironment('all'); setPage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
              selectedEnvironment === 'all'
                ? 'bg-white/10 text-white border-white/30 font-bold'
                : 'bg-black/20 text-gray-400 border-transparent hover:text-white'
            }`}
          >
            All Environments
          </button>
          <button
            onClick={() => { setSelectedEnvironment('home'); setPage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              selectedEnvironment === 'home'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                : 'bg-black/20 text-gray-400 border-transparent hover:text-cyan-300'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>🏠 Home Mode (Calisthenics)</span>
          </button>
          <button
            onClick={() => { setSelectedEnvironment('gym'); setPage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              selectedEnvironment === 'gym'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold shadow-sm'
                : 'bg-black/20 text-gray-400 border-transparent hover:text-emerald-300'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>🏋️ Gym Mode (Iron & Machines)</span>
          </button>
        </div>

        {/* 16 Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-[#252D3E]">
          <button
            onClick={() => { setSelectedCategory('All'); setPage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === 'All'
                ? 'bg-cyan-400 text-black border-cyan-400 font-bold'
                : 'bg-[#181E2B] text-gray-400 border-[#252D3E] hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.filter(c => c.isActive).map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-cyan-400 text-black border-cyan-400 font-bold shadow-sm'
                    : 'bg-[#181E2B] text-gray-400 border-[#252D3E] hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercises Cards Grid */}
      {isLoading ? (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-16 text-center space-y-3">
          <Dumbbell className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-white">Indexing movements...</h3>
        </div>
      ) : pageResult.data.length === 0 ? (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-12 text-center space-y-3">
          <Dumbbell className="w-8 h-8 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No exercises found</h3>
          <p className="text-xs text-gray-400">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pageResult.data.map(ex => {
            const isFav = favorites.includes(ex.id);
            const sub = environmentService.getSubstitutionForExercise(ex.id);

            return (
              <div
                key={ex.id}
                onClick={() => setActiveModalExercise(ex as any)}
                className="bg-[#141923] border border-[#252D3E] rounded-2xl overflow-hidden hover:border-cyan-400/50 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group shadow-sm"
              >
                {/* Visual Demonstration Canvas */}
                <div className="relative">
                  <ExerciseAnimation type={ex.animationType} targetMuscle={ex.primaryMuscle} className="h-40" />

                  <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border backdrop-blur-md ${
                      ex.environment === 'home'
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                        : ex.environment === 'gym'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                    }`}>
                      {ex.environment === 'home' ? '🏠 Home' : ex.environment === 'gym' ? '🏋️ Gym' : '⚡ Hybrid'}
                    </span>
                    <span className="text-[10px] font-mono capitalize px-2 py-0.5 rounded-full bg-black/60 text-gray-200 border border-white/10 backdrop-blur-md">
                      {ex.difficulty}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleToggleFav(ex.id, e)}
                      className={`p-1.5 rounded-lg border backdrop-blur-md transition-colors ${
                        isFav 
                          ? 'bg-amber-500/30 text-amber-300 border-amber-500/50' 
                          : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                        {ex.category}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 truncate max-w-[130px]">
                        {ex.equipmentRequired.join(', ')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {ex.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">
                      {ex.description}
                    </p>

                    {sub && (
                      <div className="mt-2 text-[10px] text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-1 rounded-md flex items-center gap-1.5 font-mono">
                        <Repeat className="w-3 h-3 shrink-0 text-cyan-400" />
                        <span className="truncate">Alt: {sub.substituteExerciseName}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#252D3E] flex items-center justify-between font-mono text-xs text-gray-400">
                    <span>{ex.recommendedSets} Sets × {ex.recommendedReps}</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      <span>View Form</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-gray-400 pt-2 border-t border-[#252D3E]">
        <div>
          Showing <span className="font-bold text-white">{Math.min(pageResult.total, (pageResult.page - 1) * pageResult.pageSize + 1)}</span> to <span className="font-bold text-white">{Math.min(pageResult.total, pageResult.page * pageResult.pageSize)}</span> of <span className="font-bold text-white">{pageResult.total.toLocaleString()}</span> workouts
        </div>

        <div className="flex items-center gap-2">
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

      {/* Modal Detail Sheet */}
      <ExerciseDetailModal
        exercise={activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
        onStartExercise={onStartExercise}
      />
    </div>
  );
};
