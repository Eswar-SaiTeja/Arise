import React from 'react';
import { motion } from 'framer-motion';
import { Zap, X } from 'lucide-react';
import { useBrand } from '../../../context/BrandContext';

interface GooeyMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  activeLabel?: string;
  size?: number;
  className?: string;
}

export const GooeyMenuButton: React.FC<GooeyMenuButtonProps> = ({
  isOpen,
  onClick,
  activeLabel,
  size = 64,
  className = '',
}) => {
  const { currentTheme } = useBrand();

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Liquid Pulse Ring (active when closed) */}
      {!isOpen && (
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.6, 0.15, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size + 20,
            height: size + 20,
            background: `radial-gradient(circle, ${currentTheme.accentColor}35 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Main Trigger Orb */}
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{
          rotate: isOpen ? 90 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        style={{
          width: size,
          height: size,
          backgroundColor: '#0C101C',
          borderColor: isOpen ? '#A855F7' : currentTheme.accentColor,
          boxShadow: isOpen 
            ? '0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 15px rgba(168, 85, 247, 0.3)' 
            : `0 0 25px ${currentTheme.glowColor}, inset 0 0 12px ${currentTheme.accentColor}40`,
        }}
        className="relative z-20 rounded-full border-2 flex items-center justify-center cursor-pointer shadow-2xl transition-colors duration-300 backdrop-blur-xl group focus:outline-none focus:ring-2 focus:ring-purple-400/50"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Gooey Navigation Menu' : 'Open Gooey Navigation Menu'}
      >
        {/* Animated Inner Emblem (Zap <-> X) */}
        <div className="relative w-7 h-7 flex items-center justify-center">
          <motion.div
            initial={false}
            animate={{
              rotate: isOpen ? 180 : 0,
              scale: isOpen ? 0 : 1,
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Zap 
              className="w-6 h-6 fill-current transition-colors"
              style={{ color: currentTheme.accentColor }} 
            />
          </motion.div>

          <motion.div
            initial={false}
            animate={{
              rotate: isOpen ? 0 : -180,
              scale: isOpen ? 1 : 0,
              opacity: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center text-purple-300"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </motion.div>
        </div>

        {/* Outer Circular Accent Border Aura */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)`,
          }}
        />
      </motion.button>
    </div>
  );
};
