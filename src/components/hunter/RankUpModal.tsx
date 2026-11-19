import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Award, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { HunterRankTier } from '../../types/hunter';
import { RANK_DEFINITIONS } from '../../services/hunterService';
import { RankEmblem } from './RankEmblem';
import { audioService } from '../../services/audioService';

interface RankUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousRank: HunterRankTier;
  newRank: HunterRankTier;
  newLevel: number;
  isRankTierPromotion: boolean;
}

export const RankUpModal: React.FC<RankUpModalProps> = ({
  isOpen,
  onClose,
  previousRank,
  newRank,
  newLevel,
  isRankTierPromotion,
}) => {
  const newDef = RANK_DEFINITIONS[newRank];

  useEffect(() => {
    if (!isOpen) return;

    // Play fanfare
    audioService.playRankPromotionFanfare();

    // Trigger double confetti blast
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: [newDef.color, '#FFFFFF', '#00F050', '#FF5E1E']
      });
      setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: [newDef.color, '#FFD700']
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: [newDef.color, '#00F050']
        });
      }, 350);
    } catch {}
  }, [isOpen, newRank, newDef.color]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#141923] border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300 overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Glowing Background Radial */}
        <div 
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: newDef.color }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <div className="relative z-10">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border"
            style={{ 
              backgroundColor: `${newDef.color}15`, 
              color: newDef.color,
              borderColor: `${newDef.color}40`
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRankTierPromotion ? 'APEX RANK TRANSCENDENCE' : 'HUNTER LEVEL UPGRADED'}</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-white font-display mt-2">
            {isRankTierPromotion ? 'Rank Promoted!' : 'Level Up Achieved!'}
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            {isRankTierPromotion 
              ? `You have transcended into ${newDef.name} (${newRank} Rank).` 
              : `Your athletic kinetic conditioning increased to Level ${newLevel}.`}
          </p>
        </div>

        {/* Emblem Showcase */}
        <div className="relative z-10 py-2 flex items-center justify-center">
          <RankEmblem rank={newRank} level={newLevel} size="lg" animate={true} />
        </div>

        {/* Previous Rank -> New Rank Comparison Pill */}
        {isRankTierPromotion && (
          <div className="relative z-10 flex items-center justify-center gap-4 bg-[#181E2B] border border-[#252D3E] p-3 rounded-2xl max-w-xs mx-auto text-xs font-mono">
            <span className="text-gray-400 font-bold">{previousRank} Rank</span>
            <ArrowRight className="w-4 h-4 text-lime-accent" />
            <span className="font-bold text-white" style={{ color: newDef.color }}>
              {newRank} Rank (Lv.1)
            </span>
          </div>
        )}

        {/* Benefits Box */}
        <div className="relative z-10 p-4 rounded-2xl bg-[#0F141F] border border-[#252D3E] text-left text-xs space-y-1.5 font-mono">
          <div className="text-lime-accent font-bold uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Hunter Conditioning Perks:</span>
          </div>
          <div className="text-gray-300 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-accent" />
              <span>Full 3 Grace Shields replenished.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-accent" />
              <span>Higher difficulty missions with boosted XP rewards unlocked.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-accent" />
              <span>Promotion permanently logged in Hunter History.</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="relative z-10 w-full py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-lg text-black hover:scale-105"
          style={{ 
            backgroundColor: newDef.color,
            boxShadow: `0 0 25px -5px ${newDef.color}`
          }}
        >
          CLAIM GLORY & CONTINUE
        </button>
      </div>
    </div>,
    document.body
  );
};
