import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Dumbbell, 
  Activity, 
  Zap, 
  Swords, 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { FitnessChallenge, ChallengeCategory } from '../../types';
import { hunterService } from '../../services/hunterService';
import { audioService } from '../../services/audioService';

const CATEGORY_ICONS: Record<string, any> = {
  tonnage: Dumbbell,
  streak: Flame,
  endurance: Activity,
  calisthenics: Zap,
  guild: Swords,
};

export const ChallengesView: React.FC = () => {
  const [challenges, setChallenges] = useState<FitnessChallenge[]>(() => storageService.getChallenges());
  const [activeFilter, setActiveFilter] = useState<'all' | 'joined' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);

  const rankProgress = hunterService.getRankProgress();

  const handleJoin = (challengeId: string) => {
    storageService.joinChallenge(challengeId);
    setChallenges(storageService.getChallenges());
    audioService.playSetCompleted();
  };

  const handleClaim = (challengeId: string) => {
    const result = storageService.claimChallengeReward(challengeId);
    if (result.success) {
      audioService.playRankPromotionFanfare();
      setClaimSuccessMessage(`Claimed +${result.xpAwarded} XP!`);
      setTimeout(() => setClaimSuccessMessage(null), 4000);
      setChallenges(storageService.getChallenges());
    }
  };

  const filteredChallenges = challenges.filter(c => {
    if (activeFilter === 'joined' && !c.isJoined) return false;
    if (activeFilter === 'completed' && !c.isCompleted) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    return true;
  });

  const guildRaid = challenges.find(c => c.category === 'guild');
  const raidPercentage = guildRaid ? Math.min(100, Math.round((guildRaid.currentValue / guildRaid.targetValue) * 100)) : 77;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121624] via-[#0E121D] to-[#0A0D14] border border-[#232B3E] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent text-xs font-mono font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>HUNTER GUILD EXPEDITIONS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Seasonal Trials & Guild Raids
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              Accept high-stakes fitness contracts. Complete tonnage benchmarks, streak trials, and cooperative guild challenges to earn massive XP rewards and elevate your Hunter Rank.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141926]/80 backdrop-blur-md border border-[#252E42] p-4 rounded-2xl shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Hunter Status</span>
              <div className="text-lg font-black text-white font-mono">
                {rankProgress.currentRank} RANK <span className="text-xs text-lime-accent">LV.{rankProgress.currentLevel}</span>
              </div>
              <span className="text-xs text-gray-400">Active Quests: {challenges.filter(c => c.isJoined && !c.isCompleted).length}</span>
            </div>
          </div>
        </div>

        {/* Global World Boss / Guild Raid Progress Widget */}
        {guildRaid && (
          <div className="mt-8 pt-6 border-t border-[#1F2636] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">Active Guild World Boss</span>
                <span className="text-sm font-bold text-white">— {guildRaid.title}</span>
              </div>
              <div className="text-xs font-mono text-gray-300">
                {guildRaid.currentValue.toLocaleString()} / {guildRaid.targetValue.toLocaleString()} {guildRaid.unit} ({raidPercentage}%)
              </div>
            </div>

            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-red-500/20 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-1000 shadow-lg shadow-red-500/30"
                style={{ width: `${raidPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                {guildRaid.participantsCount.toLocaleString()} Hunters Contributing
              </span>
              <span>Reward: +{guildRaid.xpReward} XP to all contributors upon defeat</span>
            </div>
          </div>
        )}
      </div>

      {/* Claim Notification Banner */}
      {claimSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-mono font-bold text-sm">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
            <span>{claimSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Filter and Category Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141923] border border-[#252D3E]">
          {(['all', 'joined', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                activeFilter === tab
                  ? 'bg-lime-accent text-black font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Trials' : tab === 'joined' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'tonnage', label: 'Tonnage' },
            { id: 'streak', label: 'Consistency' },
            { id: 'endurance', label: 'Endurance' },
            { id: 'calisthenics', label: 'Calisthenics' },
            { id: 'guild', label: 'Guild Raids' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white/15 text-white border border-white/30 font-semibold'
                  : 'bg-[#141923] text-gray-400 border border-[#252D3E] hover:text-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChallenges.map(challenge => {
          const Icon = CATEGORY_ICONS[challenge.category] || Trophy;
          const progressPercent = Math.min(100, Math.round((challenge.currentValue / challenge.targetValue) * 100));

          return (
            <div
              key={challenge.id}
              className={`flex flex-col justify-between rounded-2xl bg-[#141926] border transition-all hover:border-[#38435C] p-5 relative overflow-hidden group ${
                challenge.isCompleted
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : challenge.isJoined
                  ? 'border-lime-accent/30 bg-lime-950/5'
                  : 'border-[#22293A]'
              }`}
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    challenge.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-lime-accent/10 text-lime-accent border border-lime-accent/30'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {challenge.tierRequirement}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-lime-accent transition-colors font-display">
                  {challenge.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              {/* Progress and Actions */}
              <div className="mt-5 pt-4 border-t border-[#1F2636] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-bold text-white">
                    {challenge.currentValue.toLocaleString()} / {challenge.targetValue.toLocaleString()} {challenge.unit} ({progressPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      challenge.isCompleted
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-lime-accent to-emerald-400'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    {challenge.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-500" />
                    {challenge.participantsCount.toLocaleString()} joined
                  </span>
                </div>

                {/* Button state */}
                <div className="pt-1">
                  {challenge.isCompleted ? (
                    <button
                      onClick={() => handleClaim(challenge.id)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CLAIM +{challenge.xpReward} XP</span>
                    </button>
                  ) : challenge.isJoined ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-default"
                    >
                      <span>IN PROGRESS ({progressPercent}%)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(challenge.id)}
                      className="w-full py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-lime"
                    >
                      <span>JOIN CONTRACT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
