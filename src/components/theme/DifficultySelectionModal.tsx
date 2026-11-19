import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Check, 
  Swords, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Info,
  Zap,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useBrand } from '../../context/BrandContext';
import { BrandConfig, BrandThemeId } from '../../../packages/design-system/branding';

interface DifficultySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentTheme, themeId, setThemeId, selectableModes } = useBrand();

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSelectMode = (id: BrandThemeId) => {
    setThemeId(id);
  };

  const getModeIcon = (id: string) => {
    switch (id) {
      case 'easy':
        return Sparkles;
      case 'hard':
      case 'hell':
        return Flame;
      case 'normal':
      default:
        return Swords;
    }
  };

  const getDifficultyLevelLabel = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'Level 1/3 • Beginner Intensity';
      case 'Advanced':
        return 'Level 3/3 • Advanced Intensity';
      case 'Intermediate':
      default:
        return 'Level 2/3 • Intermediate Intensity';
    }
  };

  const getModePerks = (id: string) => {
    switch (id) {
      case 'easy':
        return [
          'Comfortable starting workout volume',
          'Generous 90s rest intervals between sets',
          'Beginner-friendly daily mission targets',
          'Calm electric blue & cyan interface'
        ];
      case 'hard':
      case 'hell':
        return [
          'Challenging progression targets (+40% volume)',
          'Strict 45s rest recovery intervals',
          '+30% boosted Hunter XP reward multiplier',
          'Competitive crimson & fiery dark interface'
        ];
      case 'normal':
      default:
        return [
          'Standard periodized athletic progression',
          'Balanced 60s rest recovery intervals',
          'Standard daily RPG directive targets',
          'Electric violet & deep purple interface'
        ];
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gradient-to-b from-[#110D1E] via-[#0E0A1A] to-[#080511] border border-white/15 rounded-3xl shadow-2xl p-6 md:p-8 text-white space-y-6 my-auto select-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 0 50px -10px ${currentTheme.glowColor}`
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="px-2.5 py-1 text-xs font-black tracking-widest uppercase rounded-full border"
              style={{
                backgroundColor: `${currentTheme.accentColor}20`,
                color: currentTheme.accentColor,
                borderColor: `${currentTheme.accentColor}40`
              }}
            >
              PROJECT ASCEND • DIFFICULTY PROTOCOL
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Active Mode: <span className="font-bold uppercase" style={{ color: currentTheme.accentColor }}>{currentTheme.name}</span>
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5 font-display">
            Select Training Difficulty & Theme
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mt-1 leading-relaxed">
            Choose your training intensity experience. Switching modes updates visual styling, mission scaling, and rest protocols. Your Hunter Rank, XP, streaks, and workout history are 100% preserved.
          </p>
        </div>

        {/* 3 Interactive Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {selectableModes.map((mode) => {
            const isSelected = currentTheme.id === mode.id || (mode.id === 'hard' && currentTheme.id === 'hell');
            const Icon = getModeIcon(mode.id);
            const perks = getModePerks(mode.id);

            return (
              <div
                key={mode.id}
                onClick={() => handleSelectMode(mode.id)}
                className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'shadow-2xl scale-[1.02]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
                }`}
                style={{
                  borderColor: isSelected ? mode.accentColor : undefined,
                  backgroundColor: isSelected ? `${mode.accentColor}12` : undefined,
                  boxShadow: isSelected ? `0 0 35px -5px ${mode.glowColor}` : undefined,
                }}
              >
                {/* Selected Status Badge */}
                {isSelected && (
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider text-black flex items-center gap-1 shadow-lg"
                    style={{ backgroundColor: mode.accentColor }}
                  >
                    <Check className="w-3 h-3 stroke-[3]" /> Active Selection
                  </div>
                )}

                <div>
                  {/* Top Bar with Icon & Color Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner"
                      style={{
                        backgroundColor: `${mode.accentColor}20`,
                        borderColor: `${mode.accentColor}50`,
                        color: mode.accentColor,
                        boxShadow: `0 0 20px -5px ${mode.glowColor}`
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <span 
                        className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${mode.accentColor}15`,
                          color: mode.accentColor,
                          borderColor: `${mode.accentColor}40`
                        }}
                      >
                        {mode.colorName} Theme
                      </span>
                      <div className="text-[10px] font-mono text-gray-400 mt-1">
                        {getDifficultyLevelLabel(mode.difficulty)}
                      </div>
                    </div>
                  </div>

                  {/* Mode Title & Description */}
                  <h3 className="text-lg font-black text-white tracking-wide font-display mb-1">
                    {mode.name}
                  </h3>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed mb-4">
                    {mode.description}
                  </p>

                  {/* Mode Traits & Benefits */}
                  <div className="space-y-2 border-t border-white/10 pt-3">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                      Training Architecture:
                    </div>
                    {perks.map((perk, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-gray-300">
                        <span 
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                          style={{ backgroundColor: mode.accentColor }} 
                        />
                        <span className="leading-snug">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-5 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMode(mode.id);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'text-black shadow-lg'
                        : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    style={isSelected ? { backgroundColor: mode.accentColor } : undefined}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>CURRENTLY ACTIVE</span>
                      </>
                    ) : (
                      <span>ACTIVATE {mode.name}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety & Integrity Guarantee Footer */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-gray-400">
          <Info className="w-5 h-5 text-gray-300 shrink-0" />
          <p className="leading-relaxed">
            <span className="font-bold text-gray-200">Safety & Progress Guarantee:</span> You can switch difficulty at any time. Hard Mode scales training volume responsibly without extreme calorie restriction. Ranks, badges, and workout history are always preserved.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};
