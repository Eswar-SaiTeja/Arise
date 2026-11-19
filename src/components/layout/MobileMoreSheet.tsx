import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  BookOpen, 
  Dumbbell, 
  UtensilsCrossed, 
  Scale, 
  Timer, 
  Clock, 
  Award, 
  User, 
  Settings, 
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Flame,
  Swords
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenBMICalculator: () => void;
  onOpenActiveWorkout: () => void;
}

export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenBMICalculator,
  onOpenActiveWorkout
}) => {
  const { isAdmin, profile } = useAuth();
  const { currentTheme } = useBrand();

  if (!isOpen || typeof document === 'undefined') return null;

  const handleItemClick = (tab: NavTab) => {
    onNavigateTab(tab);
    onClose();
  };

  const sections = [
    {
      group: 'TRAINING & SCIENCE',
      items: [
        {
          id: 'manual' as NavTab,
          label: 'Training Manual',
          desc: 'Biomechanics, anatomy & hypertrophy manuals',
          icon: BookOpen,
          color: '#8B5CF6',
          action: () => handleItemClick('manual')
        },
        {
          id: 'exercises' as NavTab,
          label: 'Exercise Library',
          desc: '3,245+ movements across 16 categories',
          icon: Dumbbell,
          color: '#06B6D4',
          action: () => handleItemClick('exercises')
        }
      ]
    },
    {
      group: 'HEALTH & NUTRITION',
      items: [
        {
          id: 'nutrition' as NavTab,
          label: 'Nutrition & Diet Plans',
          desc: 'Personalized calories, macros & food logs',
          icon: UtensilsCrossed,
          color: '#00F050',
          action: () => handleItemClick('nutrition')
        },
        {
          id: 'bmi' as any,
          label: 'BMI Calculator',
          desc: 'Interactive Quetelet index & target ranges',
          icon: Scale,
          color: '#38BDF8',
          action: () => {
            onClose();
            onOpenBMICalculator();
          }
        }
      ]
    },
    {
      group: 'TOOLS & CHRONO',
      items: [
        {
          id: 'timer' as NavTab,
          label: 'Timer & Rest Intervals',
          desc: 'Circular countdowns & custom presets',
          icon: Clock,
          color: '#06B6D4',
          action: () => handleItemClick('timer')
        },
        {
          id: 'stopwatch' as any,
          label: 'Precision Stopwatch & Laps',
          desc: 'Millisecond chrono with lap split telemetry',
          icon: Timer,
          color: '#F59E0B',
          action: () => handleItemClick('timer')
        }
      ]
    },
    {
      group: 'PROGRESSION & ACCOUNT',
      items: [
        {
          id: 'achievements' as NavTab,
          label: 'Achievements & Trophies',
          desc: 'Earned honors, medals & consistency shields',
          icon: Award,
          color: '#EC4899',
          action: () => handleItemClick('achievements')
        },
        {
          id: 'profile' as NavTab,
          label: 'Athlete Profile',
          desc: 'Bio metrics, training grounds & records',
          icon: User,
          color: '#3B82F6',
          action: () => handleItemClick('profile')
        },
        {
          id: 'settings' as any,
          label: 'Preferences & Audio',
          desc: 'Sound effects, theme modes & environments',
          icon: Settings,
          color: '#94A3B8',
          action: () => handleItemClick('profile')
        }
      ]
    }
  ];

  if (isAdmin) {
    sections.push({
      group: 'ADMINISTRATION',
      items: [
        {
          id: 'admin' as NavTab,
          label: 'Super Admin Portal',
          desc: 'Bulk import (.xlsx), category governance & audit history',
          icon: ShieldCheck,
          color: '#EAB308',
          action: () => handleItemClick('admin')
        }
      ]
    });
  }

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-h-[88vh] overflow-y-auto bg-gradient-to-b from-[#141A28] to-[#0A0D14] border-t border-cyan-500/30 rounded-t-3xl shadow-2xl p-5 pb-safe space-y-5 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-black font-bold"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-display">
                Tactical Directory & Modules
              </h3>
              <p className="text-[11px] text-gray-400 font-mono">
                All features, calculators & utilities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categorized Items */}
        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 px-1 font-bold">
                {sec.group}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {sec.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={item.action}
                      className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 flex items-center justify-between text-left transition-all active:scale-[0.98] group touch-target"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: `${item.color}15`,
                            borderColor: `${item.color}40`,
                            color: item.color
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-gray-400 leading-tight">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};
