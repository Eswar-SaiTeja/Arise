import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Dumbbell, 
  Bell, 
  Flame, 
  Trophy, 
  Plus, 
  Trash2, 
  Check, 
  Save, 
  History, 
  Users,
  Sparkles
} from 'lucide-react';
import { HunterRankTier, DailyMission } from '../../types/hunter';
import { hunterService, RANK_DEFINITIONS, RANK_ORDER, BASE_XP_PER_LEVEL, ModeDifficultyConfig } from '../../services/hunterService';
import { RankEmblem } from '../hunter/RankEmblem';

export const RankManagementPanel: React.FC = () => {
  const [missions, setMissions] = useState<DailyMission[]>(() => hunterService.getDailyMissions());
  const [preferences, setPreferences] = useState(() => hunterService.getNotificationPreferences());
  const [modeConfig, setModeConfig] = useState<ModeDifficultyConfig>(() => hunterService.getModeDifficultyConfig());
  const [xpPerLevel, setXpPerLevel] = useState<Record<HunterRankTier, number>>({ ...BASE_XP_PER_LEVEL });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [modeSavedSuccess, setModeSavedSuccess] = useState(false);

  // New Mission Modal
  const [showAddMission, setShowAddMission] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mCategory, setMCategory] = useState<'strength' | 'cardio' | 'endurance' | 'recovery' | 'knowledge'>('strength');
  const [mDifficulty, setMDifficulty] = useState<DailyMission['difficulty']>('D-Rank');
  const [mXP, setMXP] = useState(50);
  const [mDuration, setMDuration] = useState(10);
  const [mIsRecovery, setMIsRecovery] = useState(false);

  // Mock global rank distribution data
  const rankDistribution = [
    { rank: 'F', count: 480, pct: '32%' },
    { rank: 'E', count: 350, pct: '24%' },
    { rank: 'D', count: 280, pct: '19%' },
    { rank: 'C', count: 170, pct: '11%' },
    { rank: 'B', count: 110, pct: '7%' },
    { rank: 'A', count: 62, pct: '4%' },
    { rank: 'S', count: 24, pct: '1.6%' },
    { rank: 'SS', count: 8, pct: '0.5%' },
    { rank: 'SSS', count: 3, pct: '0.2%' },
    { rank: 'SSS+', count: 1, pct: '0.07%' },
  ];

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    hunterService.saveNotificationPreferences(preferences);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) return;

    const newM: DailyMission = {
      id: 'msn-adm-' + Date.now(),
      title: mTitle,
      description: mDesc,
      category: mCategory,
      difficulty: mDifficulty,
      xpReward: mXP,
      estimatedDurationMin: mDuration,
      targetMetric: 'general',
      targetValue: 1,
      isRecovery: mIsRecovery,
      isCompleted: false
    };

    const updated = [newM, ...missions];
    setMissions(updated);
    localStorage.setItem('kinetix_hunter_daily_missions', JSON.stringify(updated));
    setShowAddMission(false);
    setMTitle('');
    setMDesc('');
  };

  const handleDeleteMission = (id: string) => {
    const updated = missions.filter(m => m.id !== id);
    setMissions(updated);
    localStorage.setItem('kinetix_hunter_daily_missions', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#252D3E]">
        <div>
          <h2 className="text-xl font-black text-white font-display flex items-center gap-2">
            <Trophy className="w-5 h-5 text-lime-accent" />
            <span>Hunter Rank & Mission Governance</span>
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            Configure rank tiers, level XP costs, recurring notification intervals, and daily directives.
          </p>
        </div>
      </div>

      {/* Global Rank Distribution Matrix */}
      <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Active Athlete Rank Distribution</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {rankDistribution.map(d => {
            const def = RANK_DEFINITIONS[d.rank as HunterRankTier];
            return (
              <div 
                key={d.rank}
                className="p-3 rounded-2xl bg-[#181E2B] border border-[#252D3E] text-center space-y-1"
              >
                <RankEmblem rank={d.rank as HunterRankTier} level={1} size="sm" animate={false} className="mx-auto" />
                <div className="text-xs font-mono font-bold text-white mt-1">{d.count}</div>
                <div className="text-[10px] font-mono text-gray-400">{d.pct}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Directives Manager */}
      <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-lime-accent" />
              <span>Published Daily Fitness Missions ({missions.length})</span>
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Directives dispatched to athlete dashboards each calendar day
            </p>
          </div>

          <button
            onClick={() => setShowAddMission(true)}
            className="px-3.5 py-2 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-lime"
          >
            <Plus className="w-4 h-4" />
            <span>Create Mission</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {missions.map(m => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-[#181E2B] border border-[#252D3E] flex items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-lime-accent font-bold">
                    {m.difficulty}
                  </span>
                  <span className="text-white font-bold">{m.title}</span>
                  {m.isRecovery && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                      Recovery Day
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-[11px] truncate max-w-xl">{m.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-lime-accent font-bold">+{m.xpReward} XP</span>
                <button
                  onClick={() => handleDeleteMission(m.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rank Penalty & Notification Frequency Configurations */}
      <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-400" />
            <span>Notification Cadence & Streak Rules</span>
          </h3>
          {savedSuccess && (
            <span className="text-xs font-mono font-bold text-lime-accent flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4 max-w-xl font-mono text-xs">
          <div className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-bold block">Recurring 3-Hour Pending Reminders</span>
                <span className="text-[11px] text-gray-400">
                  Sends recurring alerts until daily directives are checked off
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.enabled}
                onChange={(e) => setPreferences({ ...preferences, enabled: e.target.checked })}
                className="w-4 h-4 accent-lime-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Interval Frequency (Hours)
                </label>
                <select
                  value={preferences.intervalHours}
                  onChange={(e) => setPreferences({ ...preferences, intervalHours: parseInt(e.target.value) })}
                  className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                >
                  <option value={1}>Every 1 Hour</option>
                  <option value={2}>Every 2 Hours</option>
                  <option value={3}>Every 3 Hours (Default)</option>
                  <option value={4}>Every 4 Hours</option>
                  <option value={6}>Every 6 Hours</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                  Grace Days Limit
                </label>
                <div className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-2 text-lime-accent font-bold">
                  3 Grace Days (Strict)
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save System Governance</span>
          </button>
          {savedSuccess && (
            <span className="text-emerald-400 font-bold ml-2">Preferences saved successfully!</span>
          )}
        </form>
      </div>

      {/* Mode Difficulty & Progression Governance (Easy, Normal, Hell Modes) */}
      <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252D3E]">
          <div>
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Settings className="w-5 h-5 text-lime-accent" />
              <span>Mode Progression & Difficulty Governance</span>
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Tune baseline daily mission metrics and XP multipliers across Easy, Normal, and Hell Modes
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              hunterService.saveModeDifficultyConfig(modeConfig);
              setModeSavedSuccess(true);
              setTimeout(() => setModeSavedSuccess(false), 2500);
            }}
            className="px-5 py-2 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-lime transition-all self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Mode Difficulty</span>
          </button>
        </div>

        {modeSavedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Mode difficulty configuration successfully persisted across all modes!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Easy Mode Config Card */}
          <div className="p-5 rounded-2xl bg-[#181E2B] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#252D3E] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan" />
                <span className="text-white font-bold text-sm">EASY MODE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 font-bold">
                Beginner
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              Manageable daily directives and gradual progression for newcomers.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 uppercase text-[10px] block mb-1">Push-Up Target</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={modeConfig.easy.pushupTarget}
                  onChange={(e) => setModeConfig({
                    ...modeConfig,
                    easy: { ...modeConfig.easy, pushupTarget: parseInt(e.target.value) || 15 }
                  })}
                  className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-gray-400 uppercase text-[10px] block mb-1">Squats Target</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={modeConfig.easy.squatTarget}
                  onChange={(e) => setModeConfig({
                    ...modeConfig,
                    easy: { ...modeConfig.easy, squatTarget: parseInt(e.target.value) || 25 }
                  })}
                  className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 uppercase text-[10px] block mb-1">Cardio (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={modeConfig.easy.cardioMinutes}
                    onChange={(e) => setModeConfig({
                      ...modeConfig,
                      easy: { ...modeConfig.easy, cardioMinutes: parseInt(e.target.value) || 10 }
                    })}
                    className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400 uppercase text-[10px] block mb-1">Mobility (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={modeConfig.easy.mobilityMinutes}
                    onChange={(e) => setModeConfig({
                      ...modeConfig,
                      easy: { ...modeConfig.easy, mobilityMinutes: parseInt(e.target.value) || 8 }
                    })}
                    className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Normal Mode Config Card */}
          <div className="p-5 rounded-2xl bg-[#181E2B] border border-lime-accent/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#252D3E] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-lime-accent shadow-glow-lime" />
                <span className="text-white font-bold text-sm">NORMAL MODE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-lime-accent/20 text-lime-accent font-bold">
                Intermediate
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              Standard athletic intensity, balanced daily missions, regular difficulty.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 uppercase text-[10px] block mb-1">Push-Up Target</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={modeConfig.normal.pushupTarget}
                  onChange={(e) => setModeConfig({
                    ...modeConfig,
                    normal: { ...modeConfig.normal, pushupTarget: parseInt(e.target.value) || 25 }
                  })}
                  className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-gray-400 uppercase text-[10px] block mb-1">Squats Target</label>
                <input
                  type="number"
                  min="15"
                  max="150"
                  value={modeConfig.normal.squatTarget}
                  onChange={(e) => setModeConfig({
                    ...modeConfig,
                    normal: { ...modeConfig.normal, squatTarget: parseInt(e.target.value) || 40 }
                  })}
                  className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 uppercase text-[10px] block mb-1">Cardio (Mins)</label>
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={modeConfig.normal.cardioMinutes}
                    onChange={(e) => setModeConfig({
                      ...modeConfig,
                      normal: { ...modeConfig.normal, cardioMinutes: parseInt(e.target.value) || 15 }
                    })}
                    className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400 uppercase text-[10px] block mb-1">Mobility (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={modeConfig.normal.mobilityMinutes}
                    onChange={(e) => setModeConfig({
                      ...modeConfig,
                      normal: { ...modeConfig.normal, mobilityMinutes: parseInt(e.target.value) || 10 }
                    })}
                    className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hell Mode Config Card */}
          <div className="p-5 rounded-2xl bg-[#181E2B] border border-red-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#252D3E] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-glow-red" />
                <span className="text-white font-bold text-sm">HELL MODE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-bold">
                Advanced
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              Demanding challenges, strict volume density, and +25% bonus XP multiplier.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 uppercase text-[10px] block mb-1">Push-Up Target</label>
                <input
                  type="number"
                  min="20"
                  max="200"
                  value={modeConfig.hell.pushupTarget}
                  onChange={(e) => setModeConfig({
                    ...modeConfig,
                    hell: { ...modeConfig.hell, pushupTarget: parseInt(e.target.value) || 45 }
                  })}
                  className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-gray-400 uppercase text-[10px] block mb-1">Squats Target</label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={modeConfig.hell.squatTarget}
                  onChange={(e) => setModeConfig({
                    ...modeConfig,
                    hell: { ...modeConfig.hell, squatTarget: parseInt(e.target.value) || 65 }
                  })}
                  className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 uppercase text-[10px] block mb-1">Cardio (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    value={modeConfig.hell.cardioMinutes}
                    onChange={(e) => setModeConfig({
                      ...modeConfig,
                      hell: { ...modeConfig.hell, cardioMinutes: parseInt(e.target.value) || 25 }
                    })}
                    className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400 uppercase text-[10px] block mb-1">XP Multiplier</label>
                  <div className="w-full bg-[#111622] border border-[#252D3E] rounded-xl px-3 py-1.5 text-lime-accent font-bold">
                    {modeConfig.hell.xpMultiplier}x (+25%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Mission Modal */}
      {showAddMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black text-white font-display">Create Daily Mission</h3>

            <form onSubmit={handleAddMission} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-gray-400 uppercase block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  placeholder="e.g. 50 Jump Squats Burst"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 uppercase block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  placeholder="Describe execution cues..."
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 uppercase block mb-1">Difficulty</label>
                  <select
                    value={mDifficulty}
                    onChange={(e) => setMDifficulty(e.target.value as any)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="F-Rank">F-Rank</option>
                    <option value="E-Rank">E-Rank</option>
                    <option value="D-Rank">D-Rank</option>
                    <option value="C-Rank">C-Rank</option>
                    <option value="B-Rank">B-Rank</option>
                    <option value="A-Rank">A-Rank</option>
                    <option value="S-Rank">S-Rank</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 uppercase block mb-1">XP Reward</label>
                  <input
                    type="number"
                    value={mXP}
                    onChange={(e) => setMXP(parseInt(e.target.value) || 50)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isRec"
                  checked={mIsRecovery}
                  onChange={(e) => setMIsRecovery(e.target.checked)}
                  className="w-4 h-4 accent-lime-accent"
                />
                <label htmlFor="isRec" className="text-gray-300">
                  Valid Scheduled Recovery Day Directive
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMission(false)}
                  className="px-4 py-2 rounded-xl border border-[#252D3E] text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black uppercase"
                >
                  Publish Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
