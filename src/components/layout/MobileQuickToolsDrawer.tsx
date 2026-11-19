import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Timer, 
  UtensilsCrossed, 
  BookOpen, 
  ShieldCheck, 
  Trophy, 
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

interface MobileQuickToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const MobileQuickToolsDrawer: React.FC<MobileQuickToolsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { isAdmin } = useAuth();
  const { currentTheme } = useBrand();

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSelect = (tab: NavTab) => {
    onNavigateTab(tab);
    onClose();
  };

  const tools = [
    {
      id: 'timer' as NavTab,
      title: 'Timer, Stopwatch & HIIT',
      desc: 'Rest intervals, millisecond lap chronometer, and circuit timers',
      icon: Timer,
      color: '#06B6D4',
      badge: 'NEW'
    },
    {
      id: 'nutrition' as NavTab,
      title: 'Nutrition & Diet Intelligence',
      desc: 'TDEE calories, macro distribution, and personalized food logging',
      icon: UtensilsCrossed,
      color: '#00F050',
      badge: '17.0'
    },
    {
      id: 'manual' as NavTab,
      title: 'Digital Training Manual',
      desc: 'Foundational biomechanics, hypertrophy science, and form guides',
      icon: BookOpen,
      color: '#8B5CF6',
      badge: undefined
    },
    {
      id: 'challenges' as NavTab,
      title: 'Guild Trials & Missions',
      desc: 'Weekly community missions, boss quests, and badge rewards',
      icon: Trophy,
      color: '#F59E0B',
      badge: 'XP'
    },
    {
      id: 'achievements' as NavTab,
      title: 'Honors & Trophies',
      desc: 'Milestones, streak badges, and apex rank awards',
      icon: Award,
      color: '#EC4899',
      badge: undefined
    }
  ];

  if (isAdmin) {
    tools.push({
      id: 'admin' as NavTab,
      title: 'Super Admin Portal',
      desc: 'Workout library bulk import (.xlsx), categories & audit logs',
      icon: ShieldCheck,
      color: '#EAB308',
      badge: 'ADMIN'
    });
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#141A28] to-[#0A0D14] border-t border-cyan-500/30 rounded-t-3xl shadow-2xl p-5 pb-safe space-y-4 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle Pill */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-2" />

        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Tactical Fitness Toolkit</span>
            </h3>
            <p className="text-xs text-gray-400">Quick launch secondary modules & telemetry</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools List */}
        <div className="space-y-2">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool.id)}
                className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between text-left transition-all active:scale-[0.98] group touch-target"
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${tool.color}15`,
                      borderColor: `${tool.color}40`,
                      color: tool.color
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {tool.title}
                      </span>
                      {tool.badge && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                          style={{ backgroundColor: `${tool.color}25`, color: tool.color }}
                        >
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-tight mt-0.5">{tool.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};
