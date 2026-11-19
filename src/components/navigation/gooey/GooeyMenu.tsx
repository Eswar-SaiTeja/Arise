import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Dumbbell, 
  Swords, 
  TrendingUp, 
  User, 
  Grid, 
  BookOpen, 
  UtensilsCrossed, 
  Scale, 
  Sparkles, 
  Hourglass, 
  Clock, 
  Award, 
  Settings, 
  ShieldCheck,
  ChevronUp
} from 'lucide-react';
import { NavTab } from '../../layout/Sidebar';
import { useAuth } from '../../../context/AuthContext';
import { useBrand } from '../../../context/BrandContext';
import { GooeyMenuAnimation } from './GooeyMenuAnimation';
import { GooeyMenuOverlay } from './GooeyMenuOverlay';
import { GooeyMenuButton } from './GooeyMenuButton';
import { GooeyMenuItem } from './GooeyMenuItem';

export interface GooeyMenuProps {
  currentTab: NavTab;
  onNavigateTab: (tab: NavTab) => void;
  onOpenBMICalculator: () => void;
  onOpenActiveWorkout?: () => void;
  className?: string;
}

interface DestinationItem {
  id: string;
  tabId?: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  badge?: string;
  category: 'main' | 'additional';
  customAction?: () => void;
}

export const GooeyMenu: React.FC<GooeyMenuProps> = ({
  currentTab,
  onNavigateTab,
  onOpenBMICalculator,
  onOpenActiveWorkout,
  className = '',
}) => {
  const { isAdmin } = useAuth();
  const { currentTheme } = useBrand();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'main' | 'tools'>('all');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive Viewport detection
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // 14 Required Destinations
  const destinations: DestinationItem[] = [
    // --- MAIN DESTINATIONS (5) ---
    {
      id: 'home',
      tabId: 'dashboard',
      label: 'Home',
      icon: Home,
      color: currentTheme.accentColor, // Primary Theme Color (Purple / Blue / Red)
      category: 'main',
    },
    {
      id: 'workouts',
      tabId: 'workouts',
      label: 'Workouts',
      icon: Dumbbell,
      color: currentTheme.secondaryAccent, // Secondary Theme Color
      category: 'main',
    },
    {
      id: 'missions',
      tabId: 'rank',
      label: 'Daily Missions',
      icon: Swords,
      color: currentTheme.accentColor,
      category: 'main',
    },
    {
      id: 'progress',
      tabId: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      color: currentTheme.secondaryAccent,
      category: 'main',
    },
    {
      id: 'profile',
      tabId: 'profile',
      label: 'Profile',
      icon: User,
      color: currentTheme.accentColor,
      category: 'main',
    },

    // --- ADDITIONAL DESTINATIONS (9) ---
    {
      id: 'exercises',
      tabId: 'exercises',
      label: 'Exercise Library',
      icon: Grid,
      color: '#38BDF8',
      category: 'additional',
    },
    {
      id: 'manual',
      tabId: 'manual',
      label: 'Training Manual',
      icon: BookOpen,
      color: '#A78BFA',
      category: 'additional',
    },
    {
      id: 'nutrition',
      tabId: 'nutrition',
      label: 'Nutrition',
      icon: UtensilsCrossed,
      color: '#10B981',
      category: 'additional',
    },
    {
      id: 'bmi',
      label: 'BMI Calculator',
      icon: Scale,
      color: '#F43F5E',
      category: 'additional',
      customAction: onOpenBMICalculator,
    },
    {
      id: 'diet',
      tabId: 'nutrition',
      label: 'Diet Plan',
      icon: Sparkles,
      color: '#34D399',
      category: 'additional',
    },
    {
      id: 'timer',
      tabId: 'timer',
      label: 'Timer',
      icon: Hourglass,
      color: '#F59E0B',
      category: 'additional',
    },
    {
      id: 'stopwatch',
      tabId: 'timer',
      label: 'Stopwatch',
      icon: Clock,
      color: '#06B6D4',
      category: 'additional',
    },
    {
      id: 'achievements',
      tabId: 'achievements',
      label: 'Achievements',
      icon: Award,
      color: '#EAB308',
      category: 'additional',
    },
    {
      id: 'settings',
      tabId: isAdmin ? 'admin' : 'profile',
      label: isAdmin ? 'Admin / Settings' : 'Settings',
      icon: isAdmin ? ShieldCheck : Settings,
      color: isAdmin ? '#A855F7' : '#94A3B8',
      badge: isAdmin ? 'ADMIN' : undefined,
      category: 'additional',
    },
  ];

  // Helper to find the active item name
  const getActiveItemName = () => {
    const match = destinations.find(d => d.tabId === currentTab);
    return match ? match.label : 'Navigation';
  };

  // Toggle open/close with animation debounce
  const toggleMenu = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(prev => !prev);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 250);
  };

  // Handle destination selection
  const handleSelect = (item: DestinationItem) => {
    if (isAnimating) return;
    
    // Execute custom action or tab navigation
    if (item.customAction) {
      item.customAction();
    } else if (item.tabId) {
      onNavigateTab(item.tabId);
    }

    // Close gooey menu smoothly
    handleClose();
  };

  // Filter items based on activeCategory on mobile
  const visibleDestinations = destinations.filter(item => {
    if (!isMobile) return true;
    if (activeCategory === 'main') return item.category === 'main';
    if (activeCategory === 'tools') return item.category === 'additional';
    return true; // 'all'
  });

  // Calculate layout coordinates for each bubble:
  // Desktop: Dual concentric upward semi-circle
  // Mobile: Ergonomic upward-left quadrant fan from right-bottom FAB (fits inside 360px-430px)
  const calculateCoordinates = (item: DestinationItem) => {
    if (!isMobile) {
      // --- DESKTOP RADIAL DUAL-ORBIT ---
      if (item.category === 'main') {
        // Inner Orbit: 5 Main Destinations (-155deg to -25deg)
        const mainIndex = destinations.filter(d => d.category === 'main').indexOf(item);
        const startAngle = -155;
        const endAngle = -25;
        const angleDeg = startAngle + (mainIndex * (endAngle - startAngle)) / 4;
        const rad = (angleDeg * Math.PI) / 180;
        const radius = 135;
        return {
          x: Math.round(radius * Math.cos(rad)),
          y: Math.round(radius * Math.sin(rad)),
          delay: mainIndex * 0.03,
          size: 54,
        };
      } else {
        // Outer Orbit: 9 Additional Destinations (-170deg to -10deg)
        const addIndex = destinations.filter(d => d.category === 'additional').indexOf(item);
        const startAngle = -170;
        const endAngle = -10;
        const angleDeg = startAngle + (addIndex * (endAngle - startAngle)) / 8;
        const rad = (angleDeg * Math.PI) / 180;
        const radius = 240;
        return {
          x: Math.round(radius * Math.cos(rad)),
          y: Math.round(radius * Math.sin(rad)),
          delay: 0.08 + addIndex * 0.02,
          size: 46,
        };
      }
    } else {
      // --- MOBILE ADAPTIVE QUADRANT FAN (Right-Bottom Anchor) ---
      // When expanding from right-5 bottom-[76px], all angles are in [-172deg, -98deg]
      // This projects everything UPWARDS and to the LEFT into the center of the mobile screen.
      const indexInVisible = visibleDestinations.indexOf(item);
      if (indexInVisible === -1) return { x: 0, y: 0, delay: 0, size: 44, hidden: true };

      if (activeCategory === 'main') {
        // 5 items in a comfortable single fan arc
        const startAngle = -170;
        const endAngle = -100;
        const angleDeg = startAngle + (indexInVisible * (endAngle - startAngle)) / 4;
        const rad = (angleDeg * Math.PI) / 180;
        const radius = 135;
        return {
          x: Math.round(radius * Math.cos(rad)),
          y: Math.round(radius * Math.sin(rad)),
          delay: indexInVisible * 0.03,
          size: 48,
        };
      } else if (activeCategory === 'tools') {
        // 9 items in 2 compact tiers
        if (indexInVisible < 4) {
          const startAngle = -165;
          const endAngle = -105;
          const angleDeg = startAngle + (indexInVisible * (endAngle - startAngle)) / 3;
          const rad = (angleDeg * Math.PI) / 180;
          return {
            x: Math.round(110 * Math.cos(rad)),
            y: Math.round(110 * Math.sin(rad)),
            delay: indexInVisible * 0.03,
            size: 44,
          };
        } else {
          const t2 = indexInVisible - 4;
          const startAngle = -172;
          const endAngle = -98;
          const angleDeg = startAngle + (t2 * (endAngle - startAngle)) / 4;
          const rad = (angleDeg * Math.PI) / 180;
          return {
            x: Math.round(190 * Math.cos(rad)),
            y: Math.round(190 * Math.sin(rad)),
            delay: 0.1 + t2 * 0.025,
            size: 42,
          };
        }
      } else {
        // 'all' (14 items on mobile: 2 tiered quadrant fan)
        if (indexInVisible < 6) {
          const startAngle = -165;
          const endAngle = -100;
          const angleDeg = startAngle + (indexInVisible * (endAngle - startAngle)) / 5;
          const rad = (angleDeg * Math.PI) / 180;
          return {
            x: Math.round(115 * Math.cos(rad)),
            y: Math.round(115 * Math.sin(rad)),
            delay: indexInVisible * 0.02,
            size: 42,
          };
        } else {
          const t2 = indexInVisible - 6;
          const startAngle = -172;
          const endAngle = -96;
          const angleDeg = startAngle + (t2 * (endAngle - startAngle)) / 7;
          const rad = (angleDeg * Math.PI) / 180;
          return {
            x: Math.round(205 * Math.cos(rad)),
            y: Math.round(205 * Math.sin(rad)),
            delay: 0.08 + t2 * 0.02,
            size: 40,
          };
        }
      }
    }
  };

  return (
    <>
      {/* 1. Global SVG Filter Definition for Liquid Morphing */}
      <GooeyMenuAnimation id="gooey-morph-filter" blurRadius={10} contrast={24} />

      {/* 2. Interactive Backdrop Overlay */}
      <GooeyMenuOverlay isOpen={isOpen} onClose={handleClose} zIndex={45} />

      {/* 3. Floating Gooey Navigation Dock */}
      <div 
        ref={containerRef}
        className={`fixed z-50 select-none ${className}`}
        style={
          isMobile
            ? {
                bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))',
                right: '20px',
              }
            : {
                bottom: '28px',
                left: '50%',
                transform: 'translateX(-50%)',
              }
        }
      >
        {/* Mobile Filter Category Pill (Visible on Mobile when Menu is Open) */}
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-14 right-0 flex items-center gap-1 p-1 rounded-full bg-[#0D121F]/95 border border-white/15 backdrop-blur-xl shadow-2xl z-40 whitespace-nowrap"
          >
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                activeCategory === 'all' 
                  ? 'bg-purple-600 text-white shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All (14)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('main')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                activeCategory === 'main' 
                  ? 'bg-cyan-500 text-black shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Main (5)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('tools')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                activeCategory === 'tools' 
                  ? 'bg-emerald-500 text-black shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tools (9)
            </button>
          </motion.div>
        )}

        {/* Liquid Morphing Hulls Layer (Filtered by SVG Gooey Filter) */}
        <div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ filter: 'url(#gooey-morph-filter)' }}
          aria-hidden="true"
        >
          {/* Central Liquid Core Base */}
          <div 
            className="rounded-full border"
            style={{ 
              width: isMobile ? 56 : 68, 
              height: isMobile ? 56 : 68,
              backgroundColor: currentTheme.cardBg,
              borderColor: `${currentTheme.accentColor}60`
            }}
          />

          {/* Morphing Liquid Bubble Pods */}
          <AnimatePresence>
            {isOpen && visibleDestinations.map((item) => {
              const coords = calculateCoordinates(item);
              if (coords.hidden) return null;

              return (
                <motion.div
                  key={`goo-${item.id}`}
                  initial={{ x: 0, y: 0, scale: 0.2, opacity: 0 }}
                  animate={{ x: coords.x, y: coords.y, scale: 1, opacity: 1 }}
                  exit={{ x: 0, y: 0, scale: 0.1, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 340,
                    damping: 24,
                    mass: 0.8,
                    delay: coords.delay,
                  }}
                  style={{
                    width: coords.size,
                    height: coords.size,
                    backgroundColor: '#0E1322',
                  }}
                  className="absolute rounded-full"
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Foreground Sharp Interactive Items (Zero Distortion, Crisp Icons & Labels) */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {isOpen && visibleDestinations.map((item) => {
              const coords = calculateCoordinates(item);
              if (coords.hidden) return null;
              const isActive = item.tabId === currentTab;

              return (
                <GooeyMenuItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive}
                  onClick={() => handleSelect(item)}
                  x={coords.x}
                  y={coords.y}
                  delay={coords.delay}
                  badge={item.badge}
                  category={item.category}
                  color={item.color}
                  size={coords.size}
                />
              );
            })}
          </AnimatePresence>

          {/* Central Gooey Menu Trigger Button */}
          <div className="flex items-center gap-2">
            <GooeyMenuButton
              isOpen={isOpen}
              onClick={toggleMenu}
              activeLabel={getActiveItemName()}
              size={isMobile ? 56 : 66}
            />

            {/* Desktop Closed State Active Section Floating Indicator Pill */}
            {!isOpen && !isMobile && (
              <motion.button
                type="button"
                onClick={toggleMenu}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0A0D15]/90 border border-white/10 hover:border-white/25 shadow-2xl backdrop-blur-xl text-xs font-semibold text-gray-200 transition-colors"
                title="Click to open Project Ascend Gooey Navigation"
              >
                <span 
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: currentTheme.accentColor }} 
                />
                <span className="font-mono text-gray-400 text-[10px] uppercase">ACTIVE:</span>
                <span className="text-white font-bold">{getActiveItemName()}</span>
                <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
