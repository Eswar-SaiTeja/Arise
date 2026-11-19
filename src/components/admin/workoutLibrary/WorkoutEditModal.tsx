import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Save, 
  Dumbbell, 
  Plus, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { WorkoutItem, WorkoutDifficulty, WorkoutExerciseType, WorkoutStatus } from '../../../types/workoutLibrary';
import { workoutLibraryService } from '../../../services/workoutLibraryService';
import { ExerciseAnimation } from '../../common/ExerciseAnimation';

interface WorkoutEditModalProps {
  isOpen: boolean;
  workout: WorkoutItem | null;
  onClose: () => void;
  onSaved: () => void;
}

export const WorkoutEditModal: React.FC<WorkoutEditModalProps> = ({
  isOpen,
  workout,
  onClose,
  onSaved
}) => {
  const isEditing = !!workout;
  const categories = workoutLibraryService.getCategories();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Chest');
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [secondaryMuscles, setSecondaryMuscles] = useState('');
  const [equipmentRequired, setEquipmentRequired] = useState('');
  const [difficulty, setDifficulty] = useState<WorkoutDifficulty>('intermediate');
  const [exerciseType, setExerciseType] = useState<WorkoutExerciseType>('compound');
  const [environment, setEnvironment] = useState<'home' | 'gym' | 'hybrid'>('hybrid');
  const [developmentLevel, setDevelopmentLevel] = useState<'basic' | 'beginner' | 'advanced'>('beginner');
  const [recommendedSets, setRecommendedSets] = useState(3);
  const [recommendedReps, setRecommendedReps] = useState('8-12');
  const [restDurationSec, setRestDurationSec] = useState(60);
  const [status, setStatus] = useState<WorkoutStatus>('published');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);
  const [mistakes, setMistakes] = useState<string[]>(['']);
  const [safety, setSafety] = useState<string[]>(['']);
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (workout) {
      setName(workout.name);
      setDescription(workout.description);
      setCategory(workout.category);
      setPrimaryMuscle(workout.primaryMuscle);
      setSecondaryMuscles(workout.secondaryMuscles.join(', '));
      setEquipmentRequired(workout.equipmentRequired.join(', '));
      setDifficulty(workout.difficulty);
      setExerciseType(workout.exerciseType);
      setEnvironment(workout.environment);
      setDevelopmentLevel(workout.developmentLevel || 'beginner');
      setRecommendedSets(workout.recommendedSets);
      setRecommendedReps(workout.recommendedReps);
      setRestDurationSec(workout.restDurationSec);
      setStatus(workout.status);
      setImageUrl(workout.demonstrationImageUrl || '');
      setVideoUrl(workout.demonstrationVideoUrl || '');
      setSteps(workout.stepByStepExecution.length > 0 ? workout.stepByStepExecution : ['']);
      setMistakes(workout.commonMistakes.length > 0 ? workout.commonMistakes : ['']);
      setSafety(workout.safetyInstructions.length > 0 ? workout.safetyInstructions : ['']);
      setTags(workout.tags.join(', '));
    } else {
      setName('');
      setDescription('');
      setCategory('Chest');
      setPrimaryMuscle('');
      setSecondaryMuscles('');
      setEquipmentRequired('Barbell, Bench');
      setDifficulty('intermediate');
      setExerciseType('compound');
      setEnvironment('hybrid');
      setDevelopmentLevel('beginner');
      setRecommendedSets(3);
      setRecommendedReps('8-12');
      setRestDurationSec(60);
      setStatus('published');
      setImageUrl('');
      setVideoUrl('');
      setSteps(['Set up baseline position with core engaged.']);
      setMistakes(['Rushing through concentric and eccentric phases.']);
      setSafety(['Ensure safety catches or pins are properly engaged.']);
      setTags('strength, hypertrophy');
    }
  }, [workout, isOpen]);

  if (!isOpen) return null;

  const handleStepChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const handleAddStep = () => setSteps([...steps, '']);
  const handleRemoveStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));

  const handleMistakeChange = (index: number, val: string) => {
    const updated = [...mistakes];
    updated[index] = val;
    setMistakes(updated);
  };
  const handleAddMistake = () => setMistakes([...mistakes, '']);
  const handleRemoveMistake = (index: number) => setMistakes(mistakes.filter((_, i) => i !== index));

  const handleSafetyChange = (index: number, val: string) => {
    const updated = [...safety];
    updated[index] = val;
    setSafety(updated);
  };
  const handleAddSafety = () => setSafety([...safety, '']);
  const handleRemoveSafety = (index: number) => setSafety(safety.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedSecMuscles = secondaryMuscles.split(',').map(s => s.trim()).filter(Boolean);
    const parsedEq = equipmentRequired.split(',').map(s => s.trim()).filter(Boolean);
    const parsedTags = tags.split(',').map(s => s.trim()).filter(Boolean);
    const filteredSteps = steps.map(s => s.trim()).filter(Boolean);
    const filteredMistakes = mistakes.map(s => s.trim()).filter(Boolean);
    const filteredSafety = safety.map(s => s.trim()).filter(Boolean);

    const animationType = name.toLowerCase().includes('squat') ? 'squat'
      : name.toLowerCase().includes('lunge') ? 'lunge'
      : name.toLowerCase().includes('deadlift') || name.toLowerCase().includes('hinge') ? 'hinge'
      : category === 'Back' || category === 'Biceps' ? 'pull'
      : category === 'Chest' || category === 'Shoulders' || category === 'Triceps' ? 'push'
      : category === 'Abs and Core' ? 'core'
      : category === 'Cardio' ? 'cardio' : 'stretch';

    if (isEditing && workout) {
      await workoutLibraryService.updateWorkout(workout.id, {
        name,
        description,
        category,
        primaryMuscle: primaryMuscle || 'Target Muscle',
        targetMuscle: primaryMuscle || 'Target Muscle',
        secondaryMuscles: parsedSecMuscles,
        equipmentRequired: parsedEq.length > 0 ? parsedEq : ['Bodyweight'],
        difficulty,
        exerciseType,
        environment,
        developmentLevel,
        recommendedSets,
        recommendedReps,
        restDurationSec,
        status,
        isPublished: status === 'published',
        demonstrationImageUrl: imageUrl || undefined,
        demonstrationVideoUrl: videoUrl || undefined,
        stepByStepExecution: filteredSteps,
        commonMistakes: filteredMistakes,
        safetyInstructions: filteredSafety,
        tags: parsedTags,
        animationType
      });
    } else {
      await workoutLibraryService.createWorkout({
        name,
        description,
        category,
        primaryMuscle: primaryMuscle || 'Target Muscle',
        targetMuscle: primaryMuscle || 'Target Muscle',
        secondaryMuscles: parsedSecMuscles,
        equipmentRequired: parsedEq.length > 0 ? parsedEq : ['Bodyweight'],
        difficulty,
        exerciseType,
        environment,
        developmentLevel,
        recommendedSets,
        recommendedReps,
        restDurationSec,
        status,
        isPublished: status === 'published',
        demonstrationImageUrl: imageUrl || undefined,
        demonstrationVideoUrl: videoUrl || undefined,
        stepByStepExecution: filteredSteps,
        commonMistakes: filteredMistakes,
        safetyInstructions: filteredSafety,
        alternativeExerciseIds: [],
        tags: parsedTags,
        animationType,
        importedFrom: 'Manual Administrator Entry'
      });
    }

    onSaved();
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#111927] to-[#0A0E17] border border-cyan-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-white space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-black tracking-widest uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              WORKOUT EDITOR & TELEMETRY
            </span>
            {isEditing && (
              <span className="text-xs text-gray-400 font-mono">
                ID: {workout?.id}
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            {isEditing ? `Edit: ${workout?.name}` : 'Create New Workout Entry'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-mono text-gray-300 uppercase block mb-1 font-bold">
                Workout Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Incline Dumbbell Bench Press"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-mono text-gray-300 uppercase block mb-1 font-bold">
                Clinical Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief anatomical and kinetic focus of this movement..."
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-300 uppercase block mb-1 font-bold">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-300 uppercase block mb-1 font-bold">
                Primary Muscle Group *
              </label>
              <input
                type="text"
                required
                value={primaryMuscle}
                onChange={(e) => setPrimaryMuscle(e.target.value)}
                placeholder="e.g. Pectoralis Major (Clavicular Head)"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-300 uppercase block mb-1 font-bold">
                Secondary Muscle Groups (Comma separated)
              </label>
              <input
                type="text"
                value={secondaryMuscles}
                onChange={(e) => setSecondaryMuscles(e.target.value)}
                placeholder="e.g. Anterior Deltoids, Triceps Brachii"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-300 uppercase block mb-1 font-bold">
                Required Equipment (Comma separated)
              </label>
              <input
                type="text"
                value={equipmentRequired}
                onChange={(e) => setEquipmentRequired(e.target.value)}
                placeholder="e.g. Dumbbells, Adjustable Incline Bench"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Section 2: Mechanics & Progression Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
            <div>
              <label className="font-mono text-gray-400 uppercase block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as WorkoutDifficulty)}
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="elite">Elite</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-gray-400 uppercase block mb-1">Exercise Type</label>
              <select
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value as WorkoutExerciseType)}
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
              >
                <option value="compound">Compound</option>
                <option value="isolation">Isolation</option>
                <option value="isometric">Isometric</option>
                <option value="cardiovascular">Cardiovascular</option>
                <option value="mobility">Mobility</option>
                <option value="plyometric">Plyometric</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-gray-400 uppercase block mb-1">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
              >
                <option value="home">Home Mode</option>
                <option value="gym">Gym Mode</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-gray-400 uppercase block mb-1">Development Tier</label>
              <select
                value={developmentLevel}
                onChange={(e) => setDevelopmentLevel(e.target.value as any)}
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
              >
                <option value="basic">Basic Body Dev</option>
                <option value="beginner">Beginner Dev</option>
                <option value="advanced">Advanced Dev</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-gray-400 uppercase block mb-1">Recommended Sets</label>
              <input
                type="number"
                min="1"
                max="20"
                value={recommendedSets}
                onChange={(e) => setRecommendedSets(parseInt(e.target.value) || 3)}
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="font-mono text-gray-400 uppercase block mb-1">Target Reps</label>
              <input
                type="text"
                value={recommendedReps}
                onChange={(e) => setRecommendedReps(e.target.value)}
                placeholder="e.g. 8-12"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="font-mono text-gray-400 uppercase block mb-1">Rest Duration (Sec)</label>
              <input
                type="number"
                min="0"
                max="300"
                step="15"
                value={restDurationSec}
                onChange={(e) => setRestDurationSec(parseInt(e.target.value) || 60)}
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="font-mono text-gray-400 uppercase block mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkoutStatus)}
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Section 3: Step-by-Step Instructions */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-gray-300 uppercase font-bold">
                Step-by-Step Execution Sequence
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono flex items-center gap-1 hover:bg-cyan-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {steps.map((st, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-white/10 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={st}
                    onChange={(e) => handleStepChange(i, e.target.value)}
                    placeholder={`Step ${i + 1} execution instruction...`}
                    className="flex-1 bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-xs text-white"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(i)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Mistakes, Safety & Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-gray-300 uppercase font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Common Mistakes:
                </span>
                <button type="button" onClick={handleAddMistake} className="text-cyan-400 text-[11px]">+ Add</button>
              </div>
              <div className="space-y-1.5">
                {mistakes.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => handleMistakeChange(i, e.target.value)}
                      placeholder="e.g. Bouncing weight off ribcage"
                      className="flex-1 bg-[#181E2B] border border-[#252D3E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    {mistakes.length > 1 && (
                      <button type="button" onClick={() => handleRemoveMistake(i)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-gray-300 uppercase font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Safety Instructions:
                </span>
                <button type="button" onClick={handleAddSafety} className="text-cyan-400 text-[11px]">+ Add</button>
              </div>
              <div className="space-y-1.5">
                {safety.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={s}
                      onChange={(e) => handleSafetyChange(i, e.target.value)}
                      placeholder="e.g. Always set safety stops properly"
                      className="flex-1 bg-[#181E2B] border border-[#252D3E] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    {safety.length > 1 && (
                      <button type="button" onClick={() => handleRemoveSafety(i)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="font-mono text-gray-300 uppercase block mb-1 font-bold">
                Tags & Search Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="chest, incline, dumbbell, hypertrophy, push"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Workout'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
