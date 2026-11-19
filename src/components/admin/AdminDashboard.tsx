import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Dumbbell, 
  CalendarRange, 
  BookOpen, 
  Bell, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Check, 
  Send, 
  Activity, 
  Layers, 
  Sparkles, 
  Lock, 
  Upload, 
  AlertCircle,
  Swords,
  Apple,
  Trophy,
  Utensils,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { nutritionStorage } from '../../services/nutritionStorage';
import { Exercise, WorkoutProgram, ManualChapter, ExerciseCategoryType, Achievement } from '../../types';
import { FoodItem } from '../../types/nutrition';
import { RankManagementPanel } from './RankManagementPanel';
import { AdminFoodManagerModal } from '../nutrition/AdminFoodManagerModal';
import { EnvironmentManagementPanel } from './EnvironmentManagementPanel';
import { WorkoutLibraryAdminView } from './workoutLibrary/WorkoutLibraryAdminView';
import { Home } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'hunter' | 'environments' | 'exercises' | 'programs' | 'manual' | 'announcements' | 'users' | 'nutrition' | 'achievements'>('analytics');

  const [exercises, setExercises] = useState<Exercise[]>(() => storageService.getExercises());
  const [programs, setPrograms] = useState<WorkoutProgram[]>(() => storageService.getPrograms());
  const [chapters, setChapters] = useState<ManualChapter[]>(() => storageService.getManualChapters());
  const [foods, setFoods] = useState<FoodItem[]>(() => nutritionStorage.getFoodDatabase());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');

  // Add Exercise Form State
  const [showAddExModal, setShowAddExModal] = useState(false);
  const [exName, setExName] = useState('');
  const [exCategory, setExCategory] = useState<ExerciseCategoryType>('Chest');
  const [exTargetMuscle, setExTargetMuscle] = useState('');
  const [exDifficulty, setExDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [exEquipment, setExEquipment] = useState('Dumbbells');
  const [exSets, setExSets] = useState(3);
  const [exReps, setExReps] = useState('10-12');
  const [exRest, setExRest] = useState(60);
  const [exStartPos, setExStartPos] = useState('');
  const [exStep1, setExStep1] = useState('');
  const [exBreathing, setExBreathing] = useState('Exhale on exertion; inhale on return.');

  // Announcement Form State
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceMessage, setAnnounceMessage] = useState('');
  const [announceSent, setAnnounceSent] = useState(false);

  // If not admin, block access with clear access denied message
  if (!isAdmin) {
    return (
      <div className="bg-[#141923] border border-red-500/30 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white font-display">Access Restricted</h2>
        <p className="text-xs text-gray-300 leading-relaxed">
          You need administrator privileges to enter the secure portal. Use the 'Admin Mode' badge in the header or profile settings to toggle privileges.
        </p>
      </div>
    );
  }

  // Handle Add Exercise
  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName.trim()) return;

    const newEx: Exercise = {
      id: 'ex-' + Date.now(),
      slug: exName.toLowerCase().replace(/\s+/g, '-'),
      name: exName,
      category: exCategory,
      targetMuscle: exTargetMuscle || 'Target Muscle Group',
      secondaryMuscles: ['Synergist Stabilizers'],
      difficulty: exDifficulty,
      equipmentRequired: exEquipment,
      startingPosition: exStartPos || 'Stand tall with core braced.',
      stepByStepExecution: [exStep1 || 'Perform the movement with full range of motion.'],
      breathingTechnique: exBreathing,
      recommendedSets: exSets,
      recommendedReps: exReps,
      restDurationSec: exRest,
      commonMistakes: ['Rushing the repetition cadence.'],
      safetyInstructions: ['Maintain neutral spine throughout.'],
      animationType: 'push',
      isPublished: true,
      viewsCount: 0,
    };

    storageService.saveExercise(newEx);
    setExercises(storageService.getExercises());
    setShowAddExModal(false);
    setExName('');
    setExTargetMuscle('');
  };

  const handleDeleteExercise = (id: string) => {
    if (window.confirm('Are you sure you want to delete this exercise from the library?')) {
      storageService.deleteExercise(id);
      setExercises(storageService.getExercises());
    }
  };

  const handleTogglePublishExercise = (ex: Exercise) => {
    const updated = { ...ex, isPublished: !ex.isPublished };
    storageService.saveExercise(updated);
    setExercises(storageService.getExercises());
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceTitle.trim() || !announceMessage.trim()) return;

    storageService.addNotification({
      id: 'notif-ann-' + Date.now(),
      type: 'system',
      title: announceTitle,
      message: announceMessage,
      timestamp: 'Just now',
      isRead: false,
    });

    setAnnounceSent(true);
    setAnnounceTitle('');
    setAnnounceMessage('');
    setTimeout(() => setAnnounceSent(false), 3000);
  };

  // Mock users directory
  const registeredUsers = [
    { id: 'usr-1', name: 'Marcus Vance', email: 'athlete@fitness.pro', role: 'Athlete', status: 'Active', workouts: 18, joined: '2026-10-15' },
    { id: 'usr-2', name: 'Elena Rostova', email: 'elena@biomech.io', role: 'Athlete', status: 'Active', workouts: 24, joined: '2026-10-22' },
    { id: 'usr-3', name: 'Victor Sterling', email: 'admin@fitness.pro', role: 'Super Admin', status: 'Active', workouts: 32, joined: '2026-10-01' },
    { id: 'usr-4', name: 'David Chen', email: 'd.chen@athletics.org', role: 'Athlete', status: 'Active', workouts: 9, joined: '2026-11-04' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950/40 via-[#141A28] to-[#0E121A] border border-purple-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SUPER ADMIN COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Content & Platform Administration
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl">
              Complete administrative governance over curriculum manuals, exercise database, periodized programs, announcements, and registered athletes.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#252D3E] pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'analytics', label: 'Platform Telemetry', icon: Activity },
          { id: 'hunter', label: 'Hunter Governance', icon: Swords },
          { id: 'environments', label: 'Environments & Tiers', icon: Home },
          { id: 'exercises', label: 'Workout Library & Bulk Import', icon: Dumbbell },
          { id: 'programs', label: `Programs (${programs.length})`, icon: CalendarRange },
          { id: 'nutrition', label: `Food Catalog (${foods.length})`, icon: Apple },
          { id: 'achievements', label: `Achievements (${achievements.length})`, icon: Trophy },
          { id: 'manual', label: `Manual Chapters (${chapters.length})`, icon: BookOpen },
          { id: 'announcements', label: 'Announcements', icon: Bell },
          { id: 'users', label: 'User Directory', icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-500 text-white font-bold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Platform Telemetry */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-5">
              <span className="text-xs font-mono text-gray-400 uppercase">Registered Athletes</span>
              <div className="text-3xl font-black text-white font-display mt-2">1,482</div>
              <span className="text-xs text-lime-accent font-mono mt-1 block">+12% this month</span>
            </div>

            <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-5">
              <span className="text-xs font-mono text-gray-400 uppercase">Total Sessions Executed</span>
              <div className="text-3xl font-black text-white font-display mt-2">18,940</div>
              <span className="text-xs text-cyan-400 font-mono mt-1 block">99.4% completion rate</span>
            </div>

            <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-5">
              <span className="text-xs font-mono text-gray-400 uppercase">Library Movements</span>
              <div className="text-3xl font-black text-lime-accent font-display mt-2">{exercises.length}</div>
              <span className="text-xs text-gray-400 font-mono mt-1 block">11 biomechanical categories</span>
            </div>

            <div className="bg-[#141923] border border-[#252D3E] rounded-2xl p-5">
              <span className="text-xs font-mono text-gray-400 uppercase">Manual Readers</span>
              <div className="text-3xl font-black text-purple-400 font-display mt-2">4,210</div>
              <span className="text-xs text-purple-300 font-mono mt-1 block">7 Core Chapters</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Hunter Governance */}
      {activeTab === 'hunter' && (
        <RankManagementPanel />
      )}

      {/* Tab: Environments & Progression Governance */}
      {activeTab === 'environments' && (
        <EnvironmentManagementPanel />
      )}

      {/* Tab: Exercises & Scalable Workout Library Management */}
      {activeTab === 'exercises' && (
        <WorkoutLibraryAdminView />
      )}

      {/* Tab: Training Programs */}
      {activeTab === 'programs' && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">Manage Training Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map(prog => (
              <div key={prog.id} className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-display">{prog.title}</h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {prog.durationWeeks} Weeks • {prog.daysPerWeek} Days/Wk • {prog.difficulty}
                  </p>
                </div>
                <span className="text-xs font-mono text-lime-accent bg-lime-accent/10 px-2 py-1 rounded">
                  {prog.days.length} Days
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Manual Chapters */}
      {activeTab === 'manual' && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">Manage Training Manual Chapters</h3>
          <div className="space-y-3">
            {chapters.map(ch => (
              <div key={ch.id} className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-lime-accent font-bold">Chapter {ch.chapterNumber}</span>
                  <h4 className="text-sm font-bold text-white font-display">{ch.title}</h4>
                  <span className="text-xs text-gray-400 font-mono">{ch.sections.length} Detailed Sections</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                  Published
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Announcements */}
      {activeTab === 'announcements' && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white font-display">Broadcast Global System Announcement</h3>
          <p className="text-xs text-gray-400">
            Announcements are instantly dispatched to all user dashboards and notification panels.
          </p>

          {announceSent && (
            <div className="p-4 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Announcement successfully dispatched to all active athlete accounts!</span>
            </div>
          )}

          <form onSubmit={handleSendAnnouncement} className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Headline</label>
              <input
                type="text"
                required
                value={announceTitle}
                onChange={(e) => setAnnounceTitle(e.target.value)}
                placeholder="e.g. New Squat Biomechanics Module Live"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Message Content</label>
              <textarea
                rows={4}
                required
                value={announceMessage}
                onChange={(e) => setAnnounceMessage(e.target.value)}
                placeholder="Detail the update or motivation for athletes..."
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-lime"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: User Directory */}
      {activeTab === 'users' && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">Registered Athlete Directory</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#252D3E] text-[11px] font-mono text-gray-400 uppercase">
                  <th className="py-3 px-3">Athlete</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Workouts Logged</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2636]">
                {registeredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors font-mono text-xs text-gray-300">
                    <td className="py-3 px-3 text-white font-semibold">{u.name}</td>
                    <td className="py-3 px-3">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'Super Admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-gray-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-lime-accent font-bold">{u.workouts}</td>
                    <td className="py-3 px-3 text-emerald-400">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Food Catalog & Nutrition Database Manager */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Apple className="w-5 h-5 text-lime-accent" />
                <span>Verified Nutrition & Food Database</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Indian and global culinary database with clinical Mifflin-St Jeor macro allocations
              </p>
            </div>

            <button
              onClick={() => setShowFoodModal(true)}
              className="px-4 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-lime transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Food Item</span>
            </button>
          </div>

          <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  placeholder="Search Indian or global dishes..."
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent"
                />
              </div>

              <span className="text-xs font-mono text-gray-400">
                {foods.filter(f => !foodSearch || f.name.toLowerCase().includes(foodSearch.toLowerCase()) || f.regionalName?.toLowerCase().includes(foodSearch.toLowerCase())).length} items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#252D3E] text-[11px] font-mono text-gray-400 uppercase">
                    <th className="py-3 px-3">Food Item</th>
                    <th className="py-3 px-3">Cuisine</th>
                    <th className="py-3 px-3">Serving</th>
                    <th className="py-3 px-3">Calories</th>
                    <th className="py-3 px-3">Protein</th>
                    <th className="py-3 px-3">Carbs</th>
                    <th className="py-3 px-3">Fat</th>
                    <th className="py-3 px-3">Budget</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2636]">
                  {foods
                    .filter(f => !foodSearch || f.name.toLowerCase().includes(foodSearch.toLowerCase()) || f.regionalName?.toLowerCase().includes(foodSearch.toLowerCase()))
                    .map(food => (
                      <tr key={food.id} className="hover:bg-white/5 transition-colors font-mono text-xs text-gray-300">
                        <td className="py-3 px-3">
                          <span className="text-white font-semibold block">{food.name}</span>
                          {food.regionalName && (
                            <span className="text-[10px] text-gray-400 block">{food.regionalName}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 uppercase text-[10px]">
                          <span className={`px-2 py-0.5 rounded ${food.cuisine === 'indian' ? 'bg-orange-500/20 text-orange-400 font-bold' : 'bg-blue-500/20 text-blue-400'}`}>
                            {food.cuisine}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-400">{food.servingUnit}</td>
                        <td className="py-3 px-3 font-bold text-white">{food.caloriesPerServing} kcal</td>
                        <td className="py-3 px-3 font-bold text-lime-accent">{food.proteinGrams}g</td>
                        <td className="py-3 px-3">{food.carbsGrams}g</td>
                        <td className="py-3 px-3">{food.fatGrams}g</td>
                        <td className="py-3 px-3 uppercase text-[10px] text-gray-400">{food.affordability}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              nutritionStorage.deleteFoodItem(food.id);
                              setFoods(nutritionStorage.getFoodDatabase());
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                            title="Delete food item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Achievements & Badges Governance */}
      {activeTab === 'achievements' && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Achievement Milestones & Gamification Governance</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Audit unlocked athlete achievements, point values, and trigger manual test evaluations
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3.5 py-1.5 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-bold">
                {achievements.filter(a => a.isUnlocked).length} Unlocked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className="bg-[#141923] border border-[#252D3E] rounded-3xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      ach.isUnlocked ? 'bg-lime-accent text-black shadow-glow-lime' : 'bg-white/5 text-gray-400'
                    }`}>
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{ach.title}</h4>
                      <span className="text-[10px] font-mono uppercase text-gray-400">{ach.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    +{ach.points} pts
                  </span>
                </div>

                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  {ach.description}
                </p>

                <div className="pt-2 border-t border-[#252D3E] flex items-center justify-between text-xs font-mono">
                  <span className={ach.isUnlocked ? 'text-lime-accent font-bold' : 'text-gray-400'}>
                    {ach.isUnlocked ? 'Status: UNLOCKED' : 'Status: LOCKED'}
                  </span>
                  <button
                    onClick={() => {
                      if (!ach.isUnlocked) {
                        storageService.unlockAchievement(ach.id);
                      }
                      setAchievements(storageService.getAchievements());
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      ach.isUnlocked
                        ? 'bg-white/5 text-gray-500 cursor-default'
                        : 'bg-lime-accent/20 hover:bg-lime-accent/40 text-lime-accent border border-lime-accent/40'
                    }`}
                  >
                    {ach.isUnlocked ? 'Unlocked' : 'Trigger Test'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Food Manager Modal */}
      <AdminFoodManagerModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        onDatabaseUpdated={() => setFoods(nutritionStorage.getFoodDatabase())}
      />
      {showAddExModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-white font-display">Add Exercise to Catalog</h3>

            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  placeholder="e.g. Incline Cable Chest Press"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Category</label>
                  <select
                    value={exCategory}
                    onChange={(e) => setExCategory(e.target.value as any)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                  >
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Biceps">Biceps</option>
                    <option value="Triceps">Triceps</option>
                    <option value="Legs">Legs</option>
                    <option value="Abs">Abs</option>
                    <option value="Full Body">Full Body</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Stretching">Stretching</option>
                    <option value="Mobility">Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Target Muscle</label>
                  <input
                    type="text"
                    value={exTargetMuscle}
                    onChange={(e) => setExTargetMuscle(e.target.value)}
                    placeholder="e.g. Upper Pectorals"
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Sets</label>
                  <input
                    type="number"
                    value={exSets}
                    onChange={(e) => setExSets(parseInt(e.target.value) || 3)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Reps</label>
                  <input
                    type="text"
                    value={exReps}
                    onChange={(e) => setExReps(e.target.value)}
                    placeholder="8-12"
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Rest (s)</label>
                  <input
                    type="number"
                    value={exRest}
                    onChange={(e) => setExRest(parseInt(e.target.value) || 60)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Starting Position</label>
                <textarea
                  rows={2}
                  value={exStartPos}
                  onChange={(e) => setExStartPos(e.target.value)}
                  placeholder="Set up bench at 30 degrees, retract shoulder blades..."
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Execution Cue</label>
                <textarea
                  rows={2}
                  value={exStep1}
                  onChange={(e) => setExStep1(e.target.value)}
                  placeholder="Press handles up in a converged arc..."
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#252D3E] text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider shadow-glow-lime"
                >
                  Publish Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
