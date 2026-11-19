import React, { useState } from 'react';
import { 
  Home, 
  Dumbbell, 
  Award, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  Repeat, 
  Sparkles, 
  Settings2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { environmentService } from '../../services/environmentService';
import { storageService } from '../../services/storageService';
import { TrainingEnvironment, DevelopmentLevel, ExerciseSubstitution } from '../../types/environment';

export const EnvironmentManagementPanel: React.FC = () => {
  const [envDefs, setEnvDefs] = useState(() => environmentService.getEnvironmentDefinitions());
  const [substitutions, setSubstitutions] = useState<ExerciseSubstitution[]>(() => environmentService.getSubstitutions());
  const [exercises, setExercises] = useState(() => storageService.getExercises());
  const [activeEnv, setActiveEnv] = useState<TrainingEnvironment>('home');
  const [activeLevel, setActiveLevel] = useState<DevelopmentLevel>('basic');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Substitution Form State
  const [showAddSub, setShowAddSub] = useState(false);
  const [newOrigExId, setNewOrigExId] = useState('');
  const [newSubExId, setNewSubExId] = useState('');
  const [newSubEnv, setNewSubEnv] = useState<TrainingEnvironment>('home');
  const [newSubCondition, setNewSubCondition] = useState('');
  const [newSubBiomech, setNewSubBiomech] = useState('');

  // Editable threshold state for active level
  const currentLevelDef = envDefs[activeEnv].levels[activeLevel];
  const [editWorkouts, setEditWorkouts] = useState(currentLevelDef.workoutsRequiredForPromotion);

  const handleLevelChange = (lvl: DevelopmentLevel) => {
    setActiveLevel(lvl);
    setEditWorkouts(envDefs[activeEnv].levels[lvl].workoutsRequiredForPromotion);
  };

  const handleSaveThreshold = () => {
    const updated = { ...envDefs };
    updated[activeEnv].levels[activeLevel].workoutsRequiredForPromotion = editWorkouts;
    environmentService.saveEnvironmentDefinitions(updated);
    setEnvDefs(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddSubstitution = (e: React.FormEvent) => {
    e.preventDefault();
    const origEx = exercises.find(ex => ex.id === newOrigExId);
    const subEx = exercises.find(ex => ex.id === newSubExId);

    if (!origEx || !subEx) return;

    const newSub: ExerciseSubstitution = {
      id: 'sub-custom-' + Date.now(),
      originalExerciseId: origEx.id,
      originalExerciseName: origEx.name,
      substituteExerciseId: subEx.id,
      substituteExerciseName: subEx.name,
      environment: newSubEnv,
      equipmentCondition: newSubCondition || `When equipment for ${origEx.name} is unavailable`,
      biomechanicalMatch: newSubBiomech || 'Equivalent motor pattern and muscle group activation'
    };

    const updated = [newSub, ...substitutions];
    environmentService.saveSubstitutions(updated);
    setSubstitutions(updated);
    setShowAddSub(false);
    setNewOrigExId('');
    setNewSubExId('');
    setNewSubCondition('');
    setNewSubBiomech('');
  };

  const handleDeleteSubstitution = (id: string) => {
    const updated = substitutions.filter(s => s.id !== id);
    environmentService.saveSubstitutions(updated);
    setSubstitutions(updated);
  };

  const handleToggleExerciseEnv = (exerciseId: string, targetEnv: 'home' | 'gym' | 'hybrid') => {
    const updated = exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, environment: targetEnv };
      }
      return ex;
    });
    setExercises(updated);
    localStorage.setItem('kinetix_exercises', JSON.stringify(updated));
  };

  // Stats
  const homeCount = exercises.filter(e => e.environment === 'home').length;
  const gymCount = exercises.filter(e => e.environment === 'gym' || !e.environment).length;
  const hybridCount = exercises.filter(e => e.environment === 'hybrid').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141923] border border-cyan-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
            <span>HOME MODE</span>
            <Home className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{homeCount} Exercises</div>
          <span className="text-[10px] text-gray-400">Zero Mandatory Gear / Calisthenics</span>
        </div>

        <div className="bg-[#141923] border border-emerald-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
            <span>GYM MODE</span>
            <Dumbbell className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{gymCount} Exercises</div>
          <span className="text-[10px] text-gray-400">Barbells, Dumbbells & Machines</span>
        </div>

        <div className="bg-[#141923] border border-purple-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-purple-400 mb-1">
            <span>HYBRID CROSS</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{hybridCount} Exercises</div>
          <span className="text-[10px] text-gray-400">Usable in Both Environments</span>
        </div>

        <div className="bg-[#141923] border border-amber-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
            <span>SMART SUBSTITUTIONS</span>
            <Repeat className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-white">{substitutions.length} Active</div>
          <span className="text-[10px] text-gray-400">Automatic Fallbacks Configured</span>
        </div>
      </div>

      {/* Environment Selector Tabs */}
      <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252D3E] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveEnv('home')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                activeEnv === 'home'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md'
                  : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>HOME MODE ARCHITECTURE</span>
            </button>

            <button
              onClick={() => setActiveEnv('gym')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                activeEnv === 'gym'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-md'
                  : 'bg-white/5 text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>GYM MODE ARCHITECTURE</span>
            </button>
          </div>

          <div className="text-xs text-gray-400 font-mono">
            Platform Environment Governance & Tier Thresholds
          </div>
        </div>

        {/* Development Tier Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              Tier Promotion Thresholds ({activeEnv.toUpperCase()} MODE)
            </h3>
            {savedSuccess && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Changes saved to platform
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['basic', 'beginner', 'advanced'] as DevelopmentLevel[]).map(lvl => {
              const def = envDefs[activeEnv].levels[lvl];
              const isSelected = activeLevel === lvl;
              return (
                <div
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white/10 border-white/40 shadow-lg'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-white tracking-wider">{def.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-gray-300">
                      Req: {def.workoutsRequiredForPromotion} workouts
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{def.subtitle}</p>
                </div>
              );
            })}
          </div>

          {/* Active Tier Editor Panel */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black text-white">{currentLevelDef.name}</h4>
                <p className="text-xs text-gray-400">{currentLevelDef.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#141923] border border-[#252D3E] px-3 py-1.5 rounded-xl">
                  <span className="text-xs text-gray-400 font-mono">Workouts to Ascend:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editWorkouts}
                    onChange={(e) => setEditWorkouts(parseInt(e.target.value) || 8)}
                    className="w-16 bg-transparent text-white font-mono font-bold text-xs focus:outline-none border-b border-cyan-400"
                  />
                </div>
                <button
                  onClick={handleSaveThreshold}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Benchmarks List */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-xs font-mono text-gray-400 uppercase font-bold block">
                Required Promotion Benchmarks:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {currentLevelDef.benchmarkRequirements.map((b, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{b.testExercise}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">{b.targetBenchmark}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Substitutions Governance */}
      <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
              <Repeat className="w-5 h-5 text-cyan-400" />
              Biomechanical Exercise Substitutions
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Configure automatic fallback substitutions when home or gym equipment is unavailable.
            </p>
          </div>

          <button
            onClick={() => setShowAddSub(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Substitution Rule</span>
          </button>
        </div>

        {/* Add Substitution Modal */}
        {showAddSub && (
          <form onSubmit={handleAddSubstitution} className="bg-black/40 border border-cyan-500/40 rounded-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-sm font-bold text-white">Create New Substitution Rule</h4>
              <button type="button" onClick={() => setShowAddSub(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Original Exercise</label>
                <select
                  value={newOrigExId}
                  onChange={(e) => setNewOrigExId(e.target.value)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-xs text-white"
                  required
                >
                  <option value="">Select Original Exercise...</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Substitute Exercise</label>
                <select
                  value={newSubExId}
                  onChange={(e) => setNewSubExId(e.target.value)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-xs text-white"
                  required
                >
                  <option value="">Select Substitute Exercise...</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Target Environment</label>
                <select
                  value={newSubEnv}
                  onChange={(e) => setNewSubEnv(e.target.value as TrainingEnvironment)}
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="home">Home Mode</option>
                  <option value="gym">Gym Mode</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Equipment Condition</label>
                <input
                  type="text"
                  value={newSubCondition}
                  onChange={(e) => setNewSubCondition(e.target.value)}
                  placeholder="e.g. When pull-up bar is unavailable"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-mono text-gray-400 block mb-1">Biomechanical Match Reason</label>
                <input
                  type="text"
                  value={newSubBiomech}
                  onChange={(e) => setNewSubBiomech(e.target.value)}
                  placeholder="e.g. Latissimus dorsi horizontal pulling action with reduced equipment requirements"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSub(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
              >
                Save Substitution
              </button>
            </div>
          </form>
        )}

        {/* Substitutions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181E2B] text-gray-400 font-mono uppercase text-[10px] border-b border-[#252D3E]">
              <tr>
                <th className="py-3 px-4">Original Movement</th>
                <th className="py-3 px-4">Substitute Movement</th>
                <th className="py-3 px-4">Target Environment</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Biomechanical Match</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D3E]">
              {substitutions.map(sub => (
                <tr key={sub.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold text-white">{sub.originalExerciseName}</td>
                  <td className="py-3 px-4 text-cyan-300 font-semibold">{sub.substituteExerciseName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      sub.environment === 'home' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {sub.environment}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{sub.equipmentCondition}</td>
                  <td className="py-3 px-4 text-gray-400 italic max-w-xs truncate">{sub.biomechanicalMatch}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteSubstitution(sub.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete substitution rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
