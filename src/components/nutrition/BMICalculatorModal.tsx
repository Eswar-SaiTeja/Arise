import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Scale, 
  Activity, 
  Check, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { NUTRITION_ENGINE } from '../../services/nutritionEngine';
import { nutritionStorage } from '../../services/nutritionStorage';
import { storageService } from '../../services/storageService';
import { useBrand } from '../../context/BrandContext';

interface BMICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const BMICalculatorModal: React.FC<BMICalculatorModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const { currentTheme } = useBrand();
  const profile = storageService.getProfile();
  const bodyProfile = nutritionStorage.getBodyProfile();

  const [weightKg, setWeightKg] = useState<number>(bodyProfile.currentWeightKg || profile.weightKg || 75);
  const [heightCm, setHeightCm] = useState<number>(bodyProfile.heightCm || profile.heightCm || 175);
  const [age, setAge] = useState<number>(bodyProfile.age || profile.age || 26);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || typeof document === 'undefined') return null;

  const bmiRecord = NUTRITION_ENGINE.calculateBMI(weightKg, heightCm, age);
  const [minHealthyKg, maxHealthyKg] = bmiRecord.healthyWeightRange;

  const handleApplyToProfile = () => {
    const existingBodyProfile = nutritionStorage.getBodyProfile();
    nutritionStorage.saveBodyProfile({
      ...existingBodyProfile,
      currentWeightKg: weightKg,
      heightCm,
      age
    });

    const existingProfile = storageService.getProfile();
    storageService.saveProfile({
      ...existingProfile,
      weightKg,
      heightCm,
      age
    });

    setSaveSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  const getCategoryStyles = () => {
    switch (bmiRecord.category) {
      case 'underweight':
        return {
          label: 'Underweight',
          color: '#38BDF8',
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          advice: 'Focus on caloric surplus with progressive resistance loading.'
        };
      case 'healthy':
        return {
          label: 'Healthy Weight',
          color: '#22C55E',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          advice: 'Optimal baseline body composition. Maintain balance or lean mass focus.'
        };
      case 'overweight':
        return {
          label: 'Overweight Range',
          color: '#F59E0B',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          advice: 'Slight caloric deficit with high protein density recommended.'
        };
      case 'obesity':
        return {
          label: 'Obesity Class Range',
          color: '#EF4444',
          bg: 'bg-red-500/10 text-red-400 border-red-500/30',
          advice: 'Prioritize structured caloric management and cardiovascular adaptation.'
        };
    }
  };

  const catStyle = getCategoryStyles();

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#141926] to-[#0A0D15] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 my-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              BIO-METRIC INTELLIGENCE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-cyan-400" />
            <span>Interactive BMI Calculator</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Biomechanical Quetelet Index calculation: <code className="text-cyan-300">BMI = Weight (kg) / Height (m)²</code>
          </p>
        </div>

        {/* Interactive Sliders & Inputs */}
        <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-white/5">
          {/* Weight */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-gray-400">Body Weight</span>
              <span className="text-white font-bold">{weightKg} kg ({(weightKg * 2.20462).toFixed(1)} lbs)</span>
            </div>
            <input
              type="range"
              min="35"
              max="200"
              step="0.5"
              value={weightKg}
              onChange={e => setWeightKg(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-gray-400">Stature / Height</span>
              <span className="text-white font-bold">{heightCm} cm ({Math.floor(heightCm / 30.48)}' {Math.round((heightCm % 30.48) / 2.54)}")</span>
            </div>
            <input
              type="range"
              min="120"
              max="230"
              step="1"
              value={heightCm}
              onChange={e => setHeightCm(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-gray-400">Age</span>
              <span className="text-white font-bold">{age} years</span>
            </div>
            <input
              type="range"
              min="12"
              max="90"
              step="1"
              value={age}
              onChange={e => setAge(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* BMI Result Showcase */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-black/60 to-[#0A121E] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Computed Quetelet BMI
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white mt-1">
              {bmiRecord.bmi}
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Healthy Target Range: <span className="text-emerald-400 font-bold">{minHealthyKg} - {maxHealthyKg} kg</span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1.5">
            <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border ${catStyle.bg}`}>
              {catStyle.label}
            </span>
            <p className="text-[11px] text-gray-300 max-w-xs text-center sm:text-right">
              {catStyle.advice}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleApplyToProfile}
            style={{
              backgroundColor: currentTheme.accentColor,
              boxShadow: `0 0 20px -3px ${currentTheme.glowColor}`
            }}
            className="px-6 py-2.5 rounded-xl text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Profile Updated!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save to Profile & Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
