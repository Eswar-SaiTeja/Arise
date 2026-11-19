import React, { useState } from 'react';
import { 
  CalendarRange, 
  Dumbbell, 
  Clock, 
  Check, 
  Play, 
  Plus, 
  ChevronRight, 
  Target, 
  Flame, 
  Sparkles,
  Layers,
  X,
  Home
} from 'lucide-react';
import { WorkoutProgram, WorkoutDayPlan } from '../../types';
import { storageService } from '../../services/storageService';
import { useWorkout } from '../../context/WorkoutContext';

interface ProgramsViewProps {
  onStartDayWorkout: (dayPlan: WorkoutDayPlan, programTitle: string) => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({ onStartDayWorkout }) => {
  const [programs, setPrograms] = useState<WorkoutProgram[]>(() => storageService.getPrograms());
  const [enrolledProgramId, setEnrolledProgramId] = useState<string>(() => storageService.getEnrolledProgramId());
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(() => {
    const all = storageService.getPrograms();
    const enrolled = storageService.getEnrolledProgramId();
    return all.find(p => p.id === enrolled) || all[0];
  });
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [envFilter, setEnvFilter] = useState<'all' | 'home' | 'gym'>('all');

  // New Custom Program Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState(4);
  const [newDaysCount, setNewDaysCount] = useState(3);
  const [newDifficulty, setNewDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const allExercises = storageService.getExercises();

  const filteredPrograms = programs.filter(p => {
    if (envFilter === 'all') return true;
    const isHomeFriendly = 
      p.id === 'prog-home-calisthenics' || 
      p.id === 'prog-beginner-foundation' || 
      p.equipmentRequired.some(e => e.toLowerCase().includes('bodyweight'));
    if (envFilter === 'home') return isHomeFriendly;
    if (envFilter === 'gym') return !isHomeFriendly || p.equipmentRequired.some(e => e.toLowerCase().includes('barbell') || e.toLowerCase().includes('bench'));
    return true;
  });

  const handleEnroll = (progId: string) => {
    storageService.setEnrolledProgramId(progId);
    setEnrolledProgramId(progId);
    const target = programs.find(p => p.id === progId);
    if (target) {
      storageService.addNotification({
        id: 'notif-prog-' + Date.now(),
        type: 'workout',
        title: `Enrolled: ${target.title}`,
        message: `You are now following the ${target.title} program. Your daily workouts have been calibrated!`,
        timestamp: 'Just now',
        isRead: false
      });
    }
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Build sample days for this custom program
    const days: WorkoutDayPlan[] = Array.from({ length: newDaysCount }, (_, i) => ({
      id: 'cust-day-' + Date.now() + '-' + i,
      dayNumber: i + 1,
      title: `Day ${i + 1}: Custom Movement Session`,
      description: 'Personalized compound progression.',
      targetFocus: 'Full Body Conditioning',
      estimatedDurationMin: 45,
      isRestDay: false,
      exercises: [
        { exerciseId: allExercises[0].id, exerciseName: allExercises[0].name, sets: 3, targetReps: '10-12', restSec: 60 },
        { exerciseId: allExercises[1].id, exerciseName: allExercises[1].name, sets: 3, targetReps: '8-10', restSec: 90 },
        { exerciseId: allExercises[2].id, exerciseName: allExercises[2].name, sets: 3, targetReps: '12', restSec: 60 }
      ]
    }));

    const newProg: WorkoutProgram = {
      id: 'prog-custom-' + Date.now(),
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newTitle,
      description: newDesc || 'Tailored personal routine.',
      durationWeeks: newDuration,
      daysPerWeek: newDaysCount,
      difficulty: newDifficulty,
      primaryGoal: 'Custom Athletic Protocol',
      targetAudience: 'Self-coached athlete',
      equipmentRequired: ['Dumbbells', 'Bench', 'Bodyweight'],
      progressionNotes: 'Progressively increase weights by 1-2kg each cycle.',
      isCustom: true,
      isPublished: true,
      enrolledCount: 1,
      days
    };

    storageService.saveProgram(newProg);
    const updated = storageService.getPrograms();
    setPrograms(updated);
    setSelectedProgram(newProg);
    handleEnroll(newProg.id);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Banner & Create Custom Plan CTA */}
      <div className="bg-gradient-to-r from-[#141A28] to-[#0E121A] border border-[#252D3E] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-mono text-xs font-semibold">
              <CalendarRange className="w-3.5 h-3.5" />
              <span>PERIODIZED ATHLETIC PROTOCOLS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Personalized Workout Programs
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl">
              Choose from 7 evidence-based training programs or construct your own custom periodized plan tailored to your equipment and schedule.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-glow-lime hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Plan</span>
          </button>
        </div>
      </div>

      {/* Programs Cards Carousel / Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <span>Available Training Programs</span>
            <span className="text-xs font-mono text-gray-400 font-normal">({filteredPrograms.length} Options)</span>
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnvFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                envFilter === 'all'
                  ? 'bg-white/10 text-white border-white/30 font-bold'
                  : 'bg-black/20 text-gray-400 border-transparent hover:text-white'
              }`}
            >
              All Programs
            </button>
            <button
              onClick={() => setEnvFilter('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                envFilter === 'home'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-black/20 text-gray-400 border-transparent hover:text-cyan-300'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>🏠 Home Protocols</span>
            </button>
            <button
              onClick={() => setEnvFilter('gym')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                envFilter === 'gym'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                  : 'bg-black/20 text-gray-400 border-transparent hover:text-emerald-300'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>🏋️ Gym Iron & Racks</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => {
            const isEnrolled = prog.id === enrolledProgramId;
            const isSelected = selectedProgram?.id === prog.id;

            return (
              <div
                key={prog.id}
                onClick={() => setSelectedProgram(prog)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#181E2B] border-lime-accent/50 shadow-glow-lime/10 ring-1 ring-lime-accent/30'
                    : 'bg-[#141923] border-[#252D3E] hover:border-white/20'
                }`}
              >
                {/* Active Program Badge */}
                {isEnrolled && (
                  <div className="absolute top-0 right-0 bg-lime-accent text-black font-mono font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    CURRENT ACTIVE
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                      {prog.durationWeeks} Weeks
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-lime-accent/10 text-lime-accent border border-lime-accent/30 font-semibold">
                      {prog.daysPerWeek} Days/Wk
                    </span>
                    <span className="text-[10px] font-mono uppercase text-gray-400">
                      {prog.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white font-display leading-tight">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#252D3E] flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">
                    {prog.days.length} Routine Days
                  </span>
                  <span className="text-lime-accent font-semibold flex items-center gap-1">
                    <span>Inspect Schedule</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Program Detailed Breakdown */}
      {selectedProgram && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#252D3E]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase text-lime-accent">
                  PROGRAM OVERVIEW & SCHEDULE
                </span>
                {selectedProgram.id === enrolledProgramId && (
                  <span className="text-[10px] bg-lime-accent/20 text-lime-accent px-2 py-0.5 rounded font-mono font-bold">
                    ACTIVE ENROLLMENT
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                {selectedProgram.title}
              </h2>
              <p className="text-sm text-gray-300 mt-1 max-w-3xl">
                {selectedProgram.progressionNotes}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedProgram.id !== enrolledProgramId ? (
                <button
                  onClick={() => handleEnroll(selectedProgram.id)}
                  className="px-6 py-3 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-glow-lime"
                >
                  Set as Active Program
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-mono text-lime-accent font-semibold bg-lime-accent/10 px-4 py-2.5 rounded-xl border border-lime-accent/30">
                  <Check className="w-4 h-4" />
                  <span>Currently Enrolled</span>
                </div>
              )}
            </div>
          </div>

          {/* Days Schedule List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-display">
              Weekly Microcycle (Day by Day Breakdown)
            </h3>

            <div className="space-y-3">
              {selectedProgram.days.map((day) => (
                <div
                  key={day.id}
                  className="p-5 rounded-2xl bg-[#181E2B] border border-[#252D3E] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-mono font-bold text-xs flex items-center justify-center">
                        D{day.dayNumber}
                      </span>
                      <h4 className="text-base font-bold text-white font-display">
                        {day.title}
                      </h4>
                      {day.isRestDay && (
                        <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                          Rest & Mobility
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300">
                      {day.description} • Focus: <span className="text-white font-medium">{day.targetFocus}</span>
                    </p>

                    {/* Exercises Summary Pills */}
                    {!day.isRestDay && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {day.exercises.map((ex, exIdx) => (
                          <span
                            key={exIdx}
                            className="text-[11px] font-mono bg-[#111622] text-gray-300 px-2.5 py-1 rounded-lg border border-white/5"
                          >
                            {ex.exerciseName} ({ex.sets}x{ex.targetReps})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {!day.isRestDay && (
                    <button
                      onClick={() => onStartDayWorkout(day, selectedProgram.title)}
                      className="px-5 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-glow-lime hover:scale-105 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Train Day {day.dayNumber}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Program Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#252D3E] pb-4">
              <h3 className="text-xl font-black text-white font-display">Create Custom Workout Plan</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 4-Day Power Push/Pull Matrix"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Description & Focus</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe your training goals, target volume, and focus areas..."
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 4)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Days Per Week</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={newDaysCount}
                    onChange={(e) => setNewDaysCount(parseInt(e.target.value) || 3)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-lime-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Difficulty Level</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#252D3E] text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider shadow-glow-lime"
                >
                  Save & Launch Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
