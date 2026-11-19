import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Trophy, 
  Clock, 
  ArrowRight, 
  History, 
  Sparkles, 
  ChevronRight, 
  Award,
  Layers,
  Activity,
  HeartHandshake,
  CheckCircle2,
  Circle,
  BarChart3,
  Target,
  Lock,
  Unlock,
  Filter,
  Search,
  Calendar,
  Compass,
  Check,
  AlertTriangle
} from 'lucide-react';
import { 
  HunterRankTier, 
  UserRankProgress, 
  HunterStreak, 
  RankHistoryEntry,
  XPTransaction 
} from '../../types/hunter';
import { Achievement } from '../../types';
import { hunterService, RANK_DEFINITIONS, RANK_ORDER, BASE_XP_PER_LEVEL } from '../../services/hunterService';
import { storageService } from '../../services/storageService';
import { RankEmblem } from './RankEmblem';
import { DailyMissionsCard } from './DailyMissionsCard';
import { RankUpModal } from './RankUpModal';
import { RankDemotionModal } from './RankDemotionModal';

interface HunterRankDashboardProps {
  onStartTodayWorkout: () => void;
}

export const HunterRankDashboard: React.FC<HunterRankDashboardProps> = ({
  onStartTodayWorkout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'achievements' | 'stats'>('overview');
  const [progress, setProgress] = useState<UserRankProgress>(() => hunterService.getRankProgress());
  const [streak, setStreak] = useState<HunterStreak>(() => hunterService.getStreak());
  const [history, setHistory] = useState<RankHistoryEntry[]>(() => hunterService.getRankHistory());
  const [xpTransactions, setXpTransactions] = useState<XPTransaction[]>(() => hunterService.getXPTransactions());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());

  // Ledger filter states
  const [ledgerFilter, setLedgerFilter] = useState<string>('all');
  const [ledgerSearch, setLedgerSearch] = useState<string>('');

  // Achievements filter states
  const [achievementCategory, setAchievementCategory] = useState<string>('all');

  // Promotion & Demotion modal states
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [demotionModalOpen, setDemotionModalOpen] = useState(false);
  const [prevRankForModal, setPrevRankForModal] = useState<HunterRankTier>('F');
  const [demotionDetailsForModal, setDemotionDetailsForModal] = useState<RankHistoryEntry | null>(null);

  // Run missed day evaluation on initial mount
  useEffect(() => {
    const result = hunterService.processMissedDayCheck();
    if (result.penaltyTriggered && result.demotionDetails) {
      setProgress(hunterService.getRankProgress());
      setStreak(hunterService.getStreak());
      setHistory(hunterService.getRankHistory());
      setDemotionDetailsForModal(result.demotionDetails);
      setDemotionModalOpen(true);
    }
  }, []);

  const handleMissionCompleted = (result: any) => {
    setProgress(hunterService.getRankProgress());
    setStreak(hunterService.getStreak());
    setHistory(hunterService.getRankHistory());
    setXpTransactions(hunterService.getXPTransactions());
    setAchievements(storageService.getAchievements());

    if (result.rankPromoted || result.levelUp) {
      setPrevRankForModal(result.previousRank || progress.currentRank);
      setPromotionModalOpen(true);
    }
  };

  const currentDef = RANK_DEFINITIONS[progress.currentRank];
  const nextRankTier = RANK_ORDER[RANK_ORDER.indexOf(progress.currentRank) + 1] || null;
  const nextDef = nextRankTier ? RANK_DEFINITIONS[nextRankTier] : null;

  // Percentage to next level
  const levelProgressPercent = Math.min(100, Math.round((progress.rankXP / progress.xpForNextLevel) * 100));

  // Filtered XP Transactions for Ledger
  const filteredTransactions = xpTransactions.filter(tx => {
    const matchesFilter = ledgerFilter === 'all' || tx.source === ledgerFilter;
    const matchesSearch = !ledgerSearch || 
      tx.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      tx.source.toLowerCase().includes(ledgerSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Achievements
  const filteredAchievements = achievements.filter(ach => {
    return achievementCategory === 'all' || ach.category === achievementCategory;
  });

  const unlockedAchievementsCount = achievements.filter(a => a.isUnlocked).length;
  const totalAchievementPoints = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0);

  // Next-Rank Unlock Requirements Checklist state calculation
  const nextRankRequirements = [
    {
      title: 'Attain Level 10 at Current Rank',
      description: `Ascend to Level 10 of ${currentDef.name}. Currently at Level ${progress.currentLevel}.`,
      isMet: progress.currentLevel >= 10,
      progressText: `${progress.currentLevel} / 10 Levels`
    },
    {
      title: 'Max Level XP Threshold Reached',
      description: `Accumulate ${progress.xpForNextLevel} XP at current level to unlock promotion gate.`,
      isMet: progress.rankXP >= progress.xpForNextLevel,
      progressText: `${progress.rankXP} / ${progress.xpForNextLevel} XP`
    },
    {
      title: 'Aegis Discipline Verification',
      description: 'Zero penalty resets incurred. Minimum 2 Grace Shields preserved.',
      isMet: streak.graceDaysRemaining >= 2,
      progressText: `${streak.graceDaysRemaining} / 3 Shields Intact`
    },
    {
      title: 'Sustained Training Velocity',
      description: 'Active consistency streak maintained for at least 3 consecutive days.',
      isMet: streak.currentStreak >= 3,
      progressText: `${streak.currentStreak} / 3 Active Days`
    }
  ];

  const requirementsMetCount = nextRankRequirements.filter(r => r.isMet).length;

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Hero Banner: Awakened Rank Emblem Showcase */}
      <div 
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-10 shadow-2xl transition-all"
        style={{
          background: `linear-gradient(135deg, ${currentDef.color}15 0%, #141923 60%, #090B10 100%)`,
          borderColor: `${currentDef.color}35`,
          boxShadow: `0 0 35px -10px ${currentDef.glow}`
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Rank Title & Details */}
          <div className="space-y-3 text-center md:text-left">
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: `${currentDef.color}15`,
                color: currentDef.color,
                borderColor: `${currentDef.color}40`
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>APEX HUNTER PROTOCOL 2.0</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight">
              {currentDef.name}
            </h1>
            <p className="text-sm text-gray-300 font-medium max-w-lg">
              {currentDef.description}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 font-mono text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                Tier {currentDef.tierOrder} of 10
              </span>
              <span 
                className="px-3 py-1 rounded-xl font-bold border"
                style={{ 
                  backgroundColor: `${currentDef.color}20`, 
                  color: currentDef.color, 
                  borderColor: `${currentDef.color}50` 
                }}
              >
                {progress.currentRank} Rank • Level {progress.currentLevel}
              </span>
              <span className="px-3 py-1 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-bold">
                Lifetime XP: {progress.lifetimeXP.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Right: Large Animated Rank Emblem */}
          <div className="shrink-0 flex flex-col items-center">
            <RankEmblem rank={progress.currentRank} level={progress.currentLevel} size="xl" animate={true} />
            <span 
              className="mt-3 font-mono text-xs font-black tracking-widest uppercase"
              style={{ color: currentDef.color }}
            >
              {currentDef.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#252D3E] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-lime-accent text-black shadow-glow-lime'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Apex Directives</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-lime-accent text-black shadow-glow-lime'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>XP Ledger ({xpTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'bg-lime-accent text-black shadow-glow-lime'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Badges & Achievements ({unlockedAchievementsCount}/{achievements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-lime-accent text-black shadow-glow-lime'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Progression Statistics</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & DIRECTIVES */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in-50">
          {/* Primary KPI Grid: XP Bar, Aegis Shields (Grace Days), Active Streak */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* XP Level Progress Bar */}
            <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400 uppercase">Rank Progression XP</span>
                  <span className="text-white font-bold">{levelProgressPercent}%</span>
                </div>
                <div className="text-2xl font-black text-white font-display">
                  {progress.rankXP} <span className="text-sm font-normal text-gray-400">/ {progress.xpForNextLevel} XP</span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-1">
                  {progress.xpForNextLevel - progress.rankXP} XP needed to reach {progress.currentLevel < 10 ? `Level ${progress.currentLevel + 1}` : (nextRankTier ? `${nextRankTier} Rank` : 'Max Level')}
                </p>
              </div>

              <div className="w-full h-3 bg-[#0A0D14] rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${levelProgressPercent}%`,
                    backgroundColor: currentDef.color,
                    boxShadow: `0 0 14px ${currentDef.glow}`
                  }}
                />
              </div>
            </div>

            {/* Grace Ward / Aegis Shields (3 Charges) */}
            <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400 uppercase">Aegis Grace Shields</span>
                  <h3 className="text-xl font-black text-white font-display">
                    {streak.graceDaysRemaining} of 3 Available
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Holographic Shield Indicators */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {[1, 2, 3].map(shieldIdx => {
                  const isCharged = shieldIdx <= streak.graceDaysRemaining;
                  return (
                    <div 
                      key={shieldIdx}
                      className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isCharged
                          ? 'bg-blue-950/40 border-blue-500 text-blue-400 shadow-sm'
                          : 'bg-[#181E2B] border-red-500/40 text-red-400/50 opacity-60'
                      }`}
                    >
                      <Shield className={`w-5 h-5 ${isCharged ? 'fill-blue-500/40' : ''}`} />
                      <span className="text-[10px] font-mono font-bold mt-1">
                        {isCharged ? 'CHARGED' : 'DEPLETED'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                Protects your streak when a daily mission is missed. If all 3 are exhausted, F1 Rank Reset penalty is enforced.
              </p>
            </div>

            {/* Streak Flame */}
            <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400 uppercase">Active Hunter Streak</span>
                  <h3 className="text-2xl font-black text-white font-display flex items-baseline gap-1">
                    {streak.currentStreak} <span className="text-sm font-normal text-gray-400">Days</span>
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Flame className="w-6 h-6 fill-orange-500" />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#181E2B] border border-[#252D3E] flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">All-Time Peak Record:</span>
                <span className="text-lime-accent font-bold">{streak.longestStreak} Days</span>
              </div>

              <div className="text-[11px] text-gray-400 font-mono">
                Next Milestone: {Math.ceil((streak.currentStreak + 1) / 7) * 7} Days (+150 Bonus XP)
              </div>
            </div>
          </div>

          {/* Main Grid: Daily Quests Hub + Next Promotion Requirements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Daily Directives (7 cols) */}
            <div className="lg:col-span-7">
              <DailyMissionsCard
                onMissionCompleted={handleMissionCompleted}
                onStartWorkoutCTA={onStartTodayWorkout}
              />
            </div>

            {/* Right Column: Next Promotion Requirements & RPG Radar (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Next-Rank Unlock Requirements Checklist */}
              <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252D3E]">
                  <div>
                    <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                      <Target className="w-4 h-4 text-lime-accent" />
                      <span>Next-Rank Unlock Criteria</span>
                    </h3>
                    <span className="text-xs font-mono text-gray-400">
                      Target: {nextRankTier ? `${nextRankTier} Rank (${nextDef?.name})` : 'SSS+ Pinnacle'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-mono text-xs font-bold">
                    {requirementsMetCount}/4 Met
                  </span>
                </div>

                <div className="space-y-3">
                  {nextRankRequirements.map((req, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        req.isMet 
                          ? 'bg-lime-950/20 border-lime-accent/40 text-gray-200' 
                          : 'bg-[#181E2B] border-[#252D3E] text-gray-400'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {req.isMet ? (
                          <CheckCircle2 className="w-4 h-4 text-lime-accent shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className={`font-bold ${req.isMet ? 'text-white' : 'text-gray-300'}`}>
                              {req.title}
                            </span>
                            <span className={req.isMet ? 'text-lime-accent font-bold' : 'text-gray-500'}>
                              {req.progressText}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                            {req.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RPG Athletic Attribute Radar Matrix */}
              <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Biomechanical Attribute Matrix</span>
                </h3>

                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { name: 'Strength & Force Output', stat: 84, color: '#EF4444' },
                    { name: 'Cardiovascular Endurance', stat: 78, color: '#06B6D4' },
                    { name: 'Kinetic Movement Discipline', stat: 92, color: '#00F050' },
                    { name: 'Joint Mobility & Resilience', stat: 70, color: '#A855F7' },
                    { name: 'Parasympathetic Recovery', stat: 86, color: '#F59E0B' },
                  ].map(attr => (
                    <div key={attr.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-300">{attr.name}</span>
                        <span className="font-bold text-white">{attr.stat}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0A0D14] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${attr.stat}%`, backgroundColor: attr.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED XP EARNING BREAKDOWN LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#252D3E]">
            <div>
              <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Zap className="w-5 h-5 text-lime-accent" />
                <span>Hunter XP Earning Ledger</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Cryptographically audited, idempotent record of all earned physical experience points
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                Lifetime: <span className="text-lime-accent font-bold">{progress.lifetimeXP.toLocaleString()} XP</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-bold">
                Today: +180 XP
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {[
                { id: 'all', label: 'All Sources' },
                { id: 'daily_mission', label: 'Daily Directives' },
                { id: 'workout', label: 'Workouts' },
                { id: 'bonus_workout', label: 'Volume Bonus' },
                { id: 'consistency', label: 'Consistency' },
                { id: 'weekly_challenge', label: 'Challenges' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setLedgerFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                    ledgerFilter === f.id
                      ? 'bg-lime-accent text-black font-bold shadow-glow-lime'
                      : 'bg-[#181E2B] text-gray-400 hover:text-white border border-[#252D3E]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search ledger entries..."
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent"
              />
            </div>
          </div>

          {/* Ledger Table */}
          <div className="space-y-2.5">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-gray-400">
                No XP transactions matched the selected filter criteria.
              </div>
            ) : (
              filteredTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] hover:border-lime-accent/30 transition-all flex items-center justify-between gap-4 font-mono text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">
                          {tx.description}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/5 border border-white/10 text-gray-300">
                          {tx.source.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {tx.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lime-accent font-black text-base">
                      +{tx.amount} XP
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS & BADGES COLLECTION */}
      {activeTab === 'achievements' && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Header Summary */}
          <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Hunter Badge & Milestone Collection</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Earn permanent prestige badges, unlock perks, and validate mastery of physical training
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                {totalAchievementPoints} Achievement Points
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-bold">
                {unlockedAchievementsCount} of {achievements.length} Unlocked
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Badges' },
              { id: 'workouts', label: 'Workout Directives' },
              { id: 'streak', label: 'Consistency Streaks' },
              { id: 'volume', label: 'Heavy Volume & Tonnage' },
              { id: 'mastery', label: 'Movement Mastery' },
              { id: 'knowledge', label: 'Curriculum & Theory' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setAchievementCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  achievementCategory === cat.id
                    ? 'bg-lime-accent text-black font-bold shadow-glow-lime'
                    : 'bg-[#141923] text-gray-400 hover:text-white border border-[#252D3E]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map(ach => (
              <div
                key={ach.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  ach.isUnlocked
                    ? 'bg-gradient-to-b from-[#18231D] to-[#12181F] border-lime-accent/40 shadow-glow-lime/20'
                    : 'bg-[#141923] border-[#252D3E] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                      ach.isUnlocked 
                        ? 'bg-lime-accent text-black shadow-glow-lime' 
                        : 'bg-[#1A2232] text-gray-500 border border-white/10'
                    }`}>
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`text-base font-bold font-display ${ach.isUnlocked ? 'text-white' : 'text-gray-300'}`}>
                        {ach.title}
                      </h4>
                      <span className="text-[11px] font-mono text-gray-400 uppercase">
                        {ach.category}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    ach.isUnlocked ? 'bg-lime-accent/20 text-lime-accent' : 'bg-white/5 text-gray-400'
                  }`}>
                    +{ach.points} pts
                  </span>
                </div>

                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  {ach.description}
                </p>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-1.5">
                    <span>{ach.isUnlocked ? 'UNLOCKED' : 'IN PROGRESS'}</span>
                    <span className="font-bold text-white">{ach.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#0A0D14] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${ach.progress}%`,
                        backgroundColor: ach.isUnlocked ? '#00F050' : '#3B82F6'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROGRESSION STATISTICS HUB */}
      {activeTab === 'stats' && (
        <div className="space-y-8 animate-in fade-in-50">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-5 space-y-1">
              <span className="text-xs font-mono text-gray-400 uppercase">Highest Rank</span>
              <div className="text-2xl font-black text-white font-display">
                {progress.highestRankAchieved} Rank
              </div>
              <span className="text-[11px] font-mono text-lime-accent">
                {RANK_DEFINITIONS[progress.highestRankAchieved].name}
              </span>
            </div>

            <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-5 space-y-1">
              <span className="text-xs font-mono text-gray-400 uppercase">Total Promotions</span>
              <div className="text-2xl font-black text-white font-display">
                {progress.promotionsCount}
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                Ascensions Recorded
              </span>
            </div>

            <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-5 space-y-1">
              <span className="text-xs font-mono text-gray-400 uppercase">Demotion Resets</span>
              <div className="text-2xl font-black text-white font-display">
                {progress.demotionsCount}
              </div>
              <span className="text-[11px] font-mono text-amber-400">
                Discipline Audits
              </span>
            </div>

            <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-5 space-y-1">
              <span className="text-xs font-mono text-gray-400 uppercase">Peak Streak Record</span>
              <div className="text-2xl font-black text-white font-display">
                {streak.longestStreak} Days
              </div>
              <span className="text-[11px] font-mono text-lime-accent">
                Current: {streak.currentStreak} Days
              </span>
            </div>
          </div>

          {/* Full 10-Tier Rank Progression Ladder */}
          <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Layers className="w-5 h-5 text-lime-accent" />
                <span>Hunter Apex 10-Tier Ascension Ladder</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Full hierarchical trajectory from Novice Initiate (F) to Transcendent Prime (SSS+)
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {RANK_ORDER.map((tier, idx) => {
                const def = RANK_DEFINITIONS[tier];
                const isCurrent = tier === progress.currentRank;
                const isPassed = RANK_ORDER.indexOf(tier) < RANK_ORDER.indexOf(progress.currentRank);

                return (
                  <div
                    key={tier}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-lime-950/40 via-[#18231C] to-[#12181F] border-lime-accent ring-1 ring-lime-accent/50 shadow-glow-lime'
                        : isPassed
                          ? 'bg-[#181E2B] border-[#252D3E] opacity-90'
                          : 'bg-[#11141E] border-[#1D2433] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black font-display text-base border"
                        style={{
                          backgroundColor: `${def.color}20`,
                          color: def.color,
                          borderColor: `${def.color}60`
                        }}
                      >
                        {tier}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{def.name}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-accent text-black">
                              CURRENT POSITION (LV.{progress.currentLevel})
                            </span>
                          )}
                          {isPassed && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-gray-400">
                              TRANSCENDED
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {def.subtitle} • {BASE_XP_PER_LEVEL[tier]} XP per level threshold
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-gray-400">
                        Tier {def.tierOrder} of 10
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rank History Audit Log Table */}
          <div className="bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#252D3E]">
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <History className="w-5 h-5 text-lime-accent" />
                  <span>Hunter Ascension & Demotion History</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Immutable ledger of all rank promotions, milestone level-ups, and discipline penalties
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {history.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
                    item.eventType === 'penalty_reset'
                      ? 'bg-red-950/20 border-red-500/40 text-red-200'
                      : 'bg-[#181E2B] border-[#252D3E] text-gray-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.eventType === 'penalty_reset'
                          ? 'bg-red-500 text-white'
                          : 'bg-lime-accent/20 text-lime-accent'
                      }`}>
                        {item.eventType === 'penalty_reset' ? 'DEMOTION PENALTY' : 'RANK PROMOTION'}
                      </span>
                      <span className="text-white font-bold">
                        {item.fromRank} Rank (Lv.{item.fromLevel}) → {item.toRank} Rank (Lv.{item.toLevel})
                      </span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {item.reason}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-gray-400 block text-[10px]">{item.date}</span>
                    <span className="text-lime-accent font-bold">
                      {item.lifetimeXPSnapshot.toLocaleString()} Lifetime XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rank Promotion Cinematic Modal */}
      <RankUpModal
        isOpen={promotionModalOpen}
        onClose={() => setPromotionModalOpen(false)}
        previousRank={prevRankForModal}
        newRank={progress.currentRank}
        newLevel={progress.currentLevel}
        isRankTierPromotion={prevRankForModal !== progress.currentRank}
      />

      {/* Rank Demotion Warning Modal */}
      <RankDemotionModal
        isOpen={demotionModalOpen}
        onClose={() => setDemotionModalOpen(false)}
        demotionDetails={demotionDetailsForModal}
      />
    </div>
  );
};
