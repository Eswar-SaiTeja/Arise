import React from 'react';
import { HunterRankTier } from '../../types/hunter';
import { RANK_DEFINITIONS } from '../../services/hunterService';

interface RankEmblemProps {
  rank: HunterRankTier;
  level?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
  animate?: boolean;
  className?: string;
}

export const RankEmblem: React.FC<RankEmblemProps> = ({
  rank,
  level = 1,
  size = 'md',
  showLevel = true,
  animate = true,
  className = '',
}) => {
  const def = RANK_DEFINITIONS[rank] || RANK_DEFINITIONS['F'];

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-40 h-40 text-4xl',
    xl: 'w-56 h-56 text-6xl',
  };

  const isHighTier = ['S', 'SS', 'SSS', 'SSS+'].includes(rank);
  const isGodTier = rank === 'SSS+';

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Outer Glow Ring for High Tiers */}
      {isHighTier && (
        <div 
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none ${animate ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: def.glow }}
        />
      )}

      {/* SVG Emblem Shield */}
      <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={def.color} />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>

          <filter id={`emblem-glow-${rank}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Geometric Frame / Aegis Crest */}
        {rank === 'F' && (
          // Iron Riveted Hexagon
          <g>
            <polygon points="60,10 105,35 105,85 60,110 15,85 15,35" stroke="#4B5563" strokeWidth="4" fill="#1F2937" />
            <polygon points="60,16 99,38 99,82 60,104 21,82 21,38" stroke="#374151" strokeWidth="2" fill="#111827" />
            <circle cx="21" cy="38" r="3" fill="#6B7280" />
            <circle cx="99" cy="38" r="3" fill="#6B7280" />
            <circle cx="60" cy="16" r="3" fill="#6B7280" />
            <circle cx="60" cy="104" r="3" fill="#6B7280" />
          </g>
        )}

        {(rank === 'E' || rank === 'D') && (
          // Bronze / Silver Vanguard Shield
          <g>
            <path d="M60 8 L108 28 V72 C108 95 60 114 60 114 C60 114 12 95 12 72 V28 Z" stroke={def.color} strokeWidth="4" fill="#181F2E" />
            <path d="M60 16 L100 32 V68 C100 86 60 102 60 102 C60 102 20 86 20 68 V32 Z" stroke={def.color} strokeWidth="1.5" strokeOpacity="0.4" fill="#0F141F" />
            <line x1="60" y1="20" x2="60" y2="98" stroke={def.color} strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 3" />
          </g>
        )}

        {(rank === 'C' || rank === 'B') && (
          // Cobalt / Crimson Knight Crest with Chevron Horns
          <g>
            <polygon points="60,6 112,30 96,92 60,116 24,92 8,30" stroke={def.color} strokeWidth="4" fill="#151A26" />
            <polygon points="60,14 102,34 88,86 60,106 32,86 18,34" stroke={def.color} strokeWidth="2" fill="#0C1017" />
            {/* Energy Sigil */}
            <path d="M60 25 L80 60 H40 Z" stroke={def.color} strokeWidth="2" fill="none" />
            <circle cx="60" cy="60" r="14" stroke={def.color} strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          </g>
        )}

        {rank === 'A' && (
          // Imperial Gold Sovereign with Eagle Wings
          <g>
            <path d="M60 6 L110 32 L95 90 L60 116 L25 90 L10 32 Z" stroke="#F59E0B" strokeWidth="4" fill="#18150E" />
            {/* Wing Accents */}
            <path d="M10 32 L35 48 L25 70 M110 32 L85 48 L95 70" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="60" r="28" stroke="#F59E0B" strokeWidth="2" fill="#241B08" />
            <circle cx="60" cy="60" r="32" stroke="#F59E0B" strokeWidth="1" strokeDasharray="6 3" />
          </g>
        )}

        {rank === 'S' && (
          // Electric Neon Lime Apex Ascendant (Lightning Arcs)
          <g>
            <circle cx="60" cy="60" r="50" stroke="#00F050" strokeWidth="3" strokeDasharray="16 8" className={animate ? 'animate-spin' : ''} style={{ transformOrigin: 'center', animationDuration: '20s' }} />
            <polygon points="60,6 110,32 94,96 60,116 26,96 10,32" stroke="#00F050" strokeWidth="4" fill="#0B1A0F" filter={`url(#emblem-glow-${rank})`} />
            {/* Lightning Sigil */}
            <path d="M64 18 L50 56 H68 L56 102" stroke="#00F050" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {rank === 'SS' && (
          // Ultraviolet Mythic Shadow Crest
          <g>
            <circle cx="60" cy="60" r="52" stroke="#A855F7" strokeWidth="2" strokeDasharray="8 6" className={animate ? 'animate-spin' : ''} style={{ transformOrigin: 'center', animationDuration: '15s', animationDirection: 'reverse' }} />
            <polygon points="60,4 114,30 100,100 60,118 20,100 6,30" stroke="#A855F7" strokeWidth="4" fill="#180B26" filter={`url(#emblem-glow-${rank})`} />
            <polygon points="60,16 98,38 86,90 60,104 34,90 22,38" stroke="#D8B4FE" strokeWidth="1.5" fill="#0F051A" />
            {/* Shadow Orbit Nodes */}
            <circle cx="60" cy="18" r="4" fill="#A855F7" />
            <circle cx="98" cy="60" r="4" fill="#A855F7" />
            <circle cx="60" cy="102" r="4" fill="#A855F7" />
            <circle cx="22" cy="60" r="4" fill="#A855F7" />
          </g>
        )}

        {rank === 'SSS' && (
          // Celestial Cyan Paragon (Double Rotating Astral Rims)
          <g>
            <circle cx="60" cy="60" r="54" stroke="#06B6D4" strokeWidth="2" strokeDasharray="10 5" className={animate ? 'animate-spin' : ''} style={{ transformOrigin: 'center', animationDuration: '12s' }} />
            <circle cx="60" cy="60" r="48" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="4 6" className={animate ? 'animate-spin' : ''} style={{ transformOrigin: 'center', animationDuration: '8s', animationDirection: 'reverse' }} />
            <polygon points="60,6 112,32 98,98 60,118 22,98 8,32" stroke="#06B6D4" strokeWidth="4" fill="#081822" filter={`url(#emblem-glow-${rank})`} />
            {/* Celestial 8-Point Star */}
            <path d="M60 22 L66 48 L92 54 L66 60 L60 86 L54 60 L28 54 L54 48 Z" stroke="#67E8F9" strokeWidth="2" fill="none" />
          </g>
        )}

        {rank === 'SSS+' && (
          // God-Tier Transcendent Prime (Solar Flame Vortex & Crown)
          <g>
            <circle cx="60" cy="60" r="55" stroke="#FF5E1E" strokeWidth="3" strokeDasharray="14 7" className={animate ? 'animate-spin' : ''} style={{ transformOrigin: 'center', animationDuration: '6s' }} />
            <circle cx="60" cy="60" r="48" stroke="#FBBF24" strokeWidth="2" strokeDasharray="6 4" className={animate ? 'animate-spin' : ''} style={{ transformOrigin: 'center', animationDuration: '4s', animationDirection: 'reverse' }} />
            <polygon points="60,2 116,28 102,102 60,120 18,102 4,28" stroke="#FF5E1E" strokeWidth="4" fill="#240A02" filter={`url(#emblem-glow-${rank})`} />
            {/* Blazing Crown */}
            <path d="M38 32 L46 54 L60 38 L74 54 L82 32 L86 64 H34 Z" stroke="#FDE047" strokeWidth="2" fill="#451A03" />
            <circle cx="60" cy="60" r="6" fill="#FF5E1E" />
          </g>
        )}
      </svg>

      {/* Center Rank Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center font-display font-black leading-none drop-shadow-lg pointer-events-none">
        <span 
          className="tracking-tighter"
          style={{ 
            color: def.color,
            textShadow: `0 0 16px ${def.glow}`
          }}
        >
          {rank}
        </span>
        {showLevel && size !== 'sm' && (
          <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-300 mt-0.5 tracking-wider uppercase">
            LV.{level}
          </span>
        )}
      </div>
    </div>
  );
};
