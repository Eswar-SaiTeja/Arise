import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface GooeyMenuItemProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  isActive: boolean;
  onClick: () => void;
  x: number;
  y: number;
  delay?: number;
  badge?: string;
  category?: 'main' | 'additional';
  color?: string;
  size?: number;
}

export const GooeyMenuItem: React.FC<GooeyMenuItemProps> = ({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
  x,
  y,
  delay = 0,
  badge,
  category = 'main',
  color = '#00F050',
  size = 52,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0.2, opacity: 0 }}
      animate={{ 
        x, 
        y, 
        scale: 1, 
        opacity: 1 
      }}
      exit={{ 
        x: 0, 
        y: 0, 
        scale: 0.1, 
        opacity: 0 
      }}
      transition={{
        type: 'spring',
        stiffness: 340,
        damping: 24,
        mass: 0.8,
        delay,
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none z-30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Liquid Bubble Button */}
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.14 }}
        whileTap={{ scale: 0.92 }}
        style={{
          width: size,
          height: size,
          backgroundColor: isActive ? '#141E2E' : '#0D111A',
          borderColor: isActive ? color : isHovered ? `${color}90` : 'rgba(255, 255, 255, 0.16)',
          boxShadow: isActive
            ? `0 0 24px ${color}60, inset 0 0 10px ${color}30`
            : isHovered
            ? `0 0 20px ${color}40, inset 0 0 8px rgba(255, 255, 255, 0.1)`
            : '0 8px 24px -4px rgba(0, 0, 0, 0.7)',
        }}
        className={`relative rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors duration-200 backdrop-blur-xl group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090B10]`}
        title={label}
        aria-label={label}
      >
        {/* Active Ring Pulse */}
        {isActive && (
          <span 
            className="absolute -inset-1 rounded-full animate-ping opacity-30 pointer-events-none"
            style={{ backgroundColor: color }}
          />
        )}

        {/* Liquid Surface Sheen */}
        <div 
          className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.45), transparent 60%)',
          }}
        />

        {/* High-Contrast Crisp Icon */}
        <Icon 
          className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 relative z-10"
          style={{ color: isActive ? color : isHovered ? '#FFFFFF' : '#D1D5DB' }}
        />

        {/* Badge Indicator (if any) */}
        {badge && (
          <span 
            className="absolute -top-1 -right-1 text-[8px] font-mono font-bold px-1 py-0.2 rounded-full border shadow z-20 pointer-events-none"
            style={{ 
              backgroundColor: '#0E1726', 
              color, 
              borderColor: `${color}60` 
            }}
          >
            {badge}
          </span>
        )}
      </motion.button>

      {/* Floating Text Pill Tooltip / Label */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ 
          opacity: isHovered || isActive ? 1 : 0.85, 
          y: 0 
        }}
        className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide pointer-events-none whitespace-nowrap transition-all duration-200 shadow-lg border backdrop-blur-md ${
          isActive 
            ? 'bg-[#151D2A] text-white border-white/20' 
            : 'bg-[#0B0F19]/90 text-gray-300 border-white/10 group-hover:text-white group-hover:border-white/20'
        }`}
        style={isActive ? { borderColor: `${color}60` } : undefined}
      >
        <span>{label}</span>
      </motion.div>
    </motion.div>
  );
};
