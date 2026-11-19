import React, { useState } from 'react';
import { ProgramsView } from '../programs/ProgramsView';
import { ExerciseLibraryView } from '../exercises/ExerciseLibraryView';
import { CalendarRange, Dumbbell, Play, Sparkles } from 'lucide-react';
import { Exercise, WorkoutDayPlan } from '../../types';
import { useBrand } from '../../context/BrandContext';

interface WorkoutsHubViewProps {
  onStartDayWorkout: (dayPlan: WorkoutDayPlan, programTitle: string) => void;
  onStartExercise: (exercise: Exercise) => void;
  initialTab?: 'programs' | 'library';
}

export const WorkoutsHubView: React.FC<WorkoutsHubViewProps> = ({
  onStartDayWorkout,
  onStartExercise,
  initialTab = 'programs'
}) => {
  const [subTab, setSubTab] = useState<'programs' | 'library'>(initialTab);
  const { currentTheme } = useBrand();

  return (
    <div className="space-y-6">
      {/* Mobile-Friendly Sub-Navigation Switcher */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-black/60 border border-white/10 max-w-md mx-auto">
        <button
          onClick={() => setSubTab('programs')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all touch-target ${
            subTab === 'programs'
              ? 'bg-white/15 text-white shadow-md border border-white/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <CalendarRange className="w-4 h-4 text-cyan-400" />
          <span>Training Plans</span>
        </button>

        <button
          onClick={() => setSubTab('library')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all touch-target ${
            subTab === 'library'
              ? 'bg-white/15 text-white shadow-md border border-white/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4 text-emerald-400" />
          <span>Exercise Library</span>
        </button>
      </div>

      {/* Active Tab View */}
      {subTab === 'programs' ? (
        <ProgramsView onStartDayWorkout={onStartDayWorkout} />
      ) : (
        <ExerciseLibraryView onStartExercise={onStartExercise} />
      )}
    </div>
  );
};
