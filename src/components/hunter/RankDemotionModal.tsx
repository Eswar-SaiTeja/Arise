import React from 'react';
import { createPortal } from 'react-dom';
import { 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { RankEmblem } from './RankEmblem';
import { RankHistoryEntry } from '../../types/hunter';

interface RankDemotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  demotionDetails: RankHistoryEntry | null;
}

export const RankDemotionModal: React.FC<RankDemotionModalProps> = ({
  isOpen,
  onClose,
  demotionDetails,
}) => {
  if (!isOpen || !demotionDetails || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#141923] border border-red-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200 my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-red-500/10 rounded-3xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* Headlines */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
            DISCIPLINE PROTOCOL ENFORCED
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-2">
            Grace Shields Depleted
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
            You missed consecutive daily training missions and exhausted all 3 Grace Shields. The Rank Reset penalty has been applied.
          </p>
        </div>

        {/* Demotion Transition Visual */}
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="text-center opacity-60">
            <RankEmblem rank={demotionDetails.fromRank} level={demotionDetails.fromLevel} size="sm" animate={false} />
            <span className="text-[10px] font-mono text-gray-400 mt-1 block">Previous ({demotionDetails.fromRank})</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-red-400 font-bold">RESET TO</span>
            <RotateCcw className="w-6 h-6 text-red-400 animate-spin mt-1" style={{ animationDuration: '6s' }} />
          </div>

          <div className="text-center">
            <RankEmblem rank="F" level={1} size="md" animate={true} />
            <span className="text-xs font-mono text-red-400 font-bold mt-1 block">F Rank (Lv.1)</span>
          </div>
        </div>

        {/* Preserved Data Confirmation Card */}
        <div className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] text-left text-xs font-mono space-y-2">
          <div className="text-lime-accent font-bold uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-lime-accent" />
            <span>Preserved Lifetime Telemetry:</span>
          </div>
          <p className="text-gray-300 text-[11px] leading-relaxed">
            Your <strong>Lifetime XP ({demotionDetails.lifetimeXPSnapshot.toLocaleString()} XP)</strong>, workout history, completed sets, personal records, and achievements were <strong>not</strong> wiped.
          </p>
          <div className="pt-1 text-[11px] text-gray-400 border-t border-[#252D3E] flex items-center justify-between">
            <span>Grace Shields Replenished:</span>
            <span className="text-lime-accent font-bold">3 of 3 Available</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
        >
          <span>ACCEPT DISCIPLINE & REIGNITE JOURNEY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};
