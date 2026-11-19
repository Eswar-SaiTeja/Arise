import React, { useState } from 'react';
import { TimerTab } from './TimerTab';
import { StopwatchTab } from './StopwatchTab';
import { IntervalTab } from './IntervalTab';
import { Timer, Zap, Clock, Sparkles } from 'lucide-react';
import { useBrand } from '../../context/BrandContext';

export type TimerSubTab = 'timer' | 'stopwatch' | 'interval';

interface TimerViewProps {
  initialTab?: TimerSubTab;
}

export const TimerView: React.FC<TimerViewProps> = ({ initialTab = 'timer' }) => {
  const [activeTab, setActiveTab] = useState<TimerSubTab>(initialTab);
  const { currentTheme } = useBrand();

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141A28] via-[#10141F] to-[#0D1017] border border-white/10 p-6 sm:p-8">
        <div 
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: currentTheme.accentColor }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CHRONOMETRIC PERFORMANCE ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Fitness Timers & Precision Chrono
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Precision rest intervals, lap split telemetries, and HIIT circuit cadences for apex athletic pacing.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-black/60 p-1 border border-white/10 self-start sm:self-center shrink-0">
            <button
              onClick={() => setActiveTab('timer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'timer'
                  ? 'bg-white/15 text-white shadow-md border border-white/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Timer</span>
            </button>

            <button
              onClick={() => setActiveTab('stopwatch')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'stopwatch'
                  ? 'bg-white/15 text-white shadow-md border border-white/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Timer className="w-4 h-4 text-lime-400" />
              <span>Stopwatch</span>
            </button>

            <button
              onClick={() => setActiveTab('interval')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'interval'
                  ? 'bg-white/15 text-white shadow-md border border-white/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>HIIT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'timer' && <TimerTab />}
        {activeTab === 'stopwatch' && <StopwatchTab />}
        {activeTab === 'interval' && <IntervalTab />}
      </div>
    </div>
  );
};
