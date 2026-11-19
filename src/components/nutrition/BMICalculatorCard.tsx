import React, { useState } from 'react';
import { 
  Activity, 
  Info, 
  Scale, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Calendar,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import { BMIRecord, BMICategory } from '../../types/nutrition';
import { NUTRITION_ENGINE } from '../../services/nutritionEngine';
import { nutritionStorage } from '../../services/nutritionStorage';
import { useBrand } from '../../context/BrandContext';

interface BMICalculatorCardProps {
  initialWeightKg: number;
  initialHeightCm: number;
  age: number;
  onUpdateWeight?: (newWeightKg: number) => void;
  onClose?: () => void;
}

export const BMICalculatorCard: React.FC<BMICalculatorCardProps> = ({
  initialWeightKg,
  initialHeightCm,
  age,
  onUpdateWeight,
  onClose,
}) => {
  const { currentTheme } = useBrand();
  const [weightKg, setWeightKg] = useState<number>(initialWeightKg);
  const [heightCm, setHeightCm] = useState<number>(initialHeightCm);
  const [bmiHistory, setBmiHistory] = useState<BMIRecord[]>(() => nutritionStorage.getBMIHistory());
  const [recordedMessage, setRecordedMessage] = useState<string | null>(null);

  const currentBMI = NUTRITION_ENGINE.calculateBMI(weightKg, heightCm, age);

  const handleSaveMeasurement = () => {
    const record = nutritionStorage.recordBMIMeasurement(weightKg, heightCm, age);
    setBmiHistory(nutritionStorage.getBMIHistory());
    if (onUpdateWeight) {
      onUpdateWeight(weightKg);
    }
    setRecordedMessage(`Saved BMI ${record.bmi} (${record.category.toUpperCase()}) to history`);
    setTimeout(() => setRecordedMessage(null), 3000);
  };

  // Determine category color and badge
  const categoryStyles: Record<BMICategory, { label: string; color: string; bg: string; border: string }> = {
    underweight: { label: 'Underweight (<18.5)', color: '#38BDF8', bg: '#38BDF815', border: '#38BDF840' },
    healthy: { label: 'Healthy Weight (18.5–24.9)', color: '#00F050', bg: '#00F05015', border: '#00F05040' },
    overweight: { label: 'Overweight (25.0–29.9)', color: '#F59E0B', bg: '#F59E0B15', border: '#F59E0B40' },
    obesity: { label: 'Obesity Range (≥30.0)', color: '#EF4444', bg: '#EF444415', border: '#EF444440' },
  };

  const activeStyle = categoryStyles[currentBMI.category];

  // Visual Gauge Calculation: range 15 to 35
  const clampedBMI = Math.max(15, Math.min(35, currentBMI.bmi));
  const gaugePercent = ((clampedBMI - 15) / 20) * 100;

  return (
    <div className="bg-[#141926] border border-[#232B3E] rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#232B3E] pb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ 
              backgroundColor: `${currentTheme.accentColor}15`,
              color: currentTheme.accentColor,
              border: `1px solid ${currentTheme.accentColor}30`
            }}
          >
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-display">Biometric BMI Intelligence</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                Screening Index
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Calculates Body Mass Index against standardized adult epidemiological ranges.
            </p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main BMI Score & Visual Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Score Display */}
        <div className="bg-[#0E121D] border border-[#1E2538] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Calculated Score</span>
            <span 
              className="text-xs font-mono font-bold px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: activeStyle.bg,
                color: activeStyle.color,
                borderColor: activeStyle.border
              }}
            >
              {activeStyle.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span 
              className="text-4xl sm:text-5xl font-black font-mono tracking-tight"
              style={{ color: activeStyle.color }}
            >
              {currentBMI.bmi}
            </span>
            <span className="text-sm font-mono text-gray-400">kg/m²</span>
          </div>

          <div className="text-xs text-gray-300 font-mono flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-gray-400">Target Healthy Range:</span>
            <span className="font-bold text-white">
              {currentBMI.healthyWeightRange[0]} kg – {currentBMI.healthyWeightRange[1]} kg
            </span>
          </div>
        </div>

        {/* Visual Gauge Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>15.0</span>
            <span>18.5</span>
            <span>25.0</span>
            <span>30.0</span>
            <span>35.0+</span>
          </div>

          {/* Continuous Spectrum Bar */}
          <div className="relative w-full h-4 rounded-full overflow-hidden flex bg-black/60 border border-white/10">
            <div className="w-[17.5%] h-full bg-sky-400/80" title="Underweight (<18.5)" />
            <div className="w-[32.5%] h-full bg-emerald-400/80" title="Healthy (18.5 - 24.9)" />
            <div className="w-[25%] h-full bg-amber-400/80" title="Overweight (25.0 - 29.9)" />
            <div className="w-[25%] h-full bg-red-400/80" title="Obesity (≥30.0)" />

            {/* Pin pointer indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-lg transition-all duration-300 -translate-x-1/2"
              style={{ left: `${gaugePercent}%`, boxShadow: '0 0 8px #FFF' }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center text-gray-400">
            <span className="text-sky-400">Underweight</span>
            <span className="text-emerald-400">Healthy</span>
            <span className="text-amber-400">Overweight</span>
            <span className="text-red-400">Obesity</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls (Weight & Height Sliders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0E121D] border border-[#1E2538] rounded-2xl p-5">
        {/* Weight Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-gray-400">Body Weight</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded bg-[#181F2E] border border-[#28354E] text-white font-mono font-bold text-sm text-right focus:outline-none focus:border-lime-accent"
              />
              <span className="text-xs text-gray-400 font-mono">kg</span>
            </div>
          </div>
          <input
            type="range"
            min="40"
            max="160"
            step="0.5"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value))}
            className="w-full accent-lime-accent cursor-pointer h-2 bg-black/40 rounded-lg"
          />
        </div>

        {/* Height Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-gray-400">Stature / Height</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="1"
                min="100"
                max="230"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded bg-[#181F2E] border border-[#28354E] text-white font-mono font-bold text-sm text-right focus:outline-none focus:border-lime-accent"
              />
              <span className="text-xs text-gray-400 font-mono">cm</span>
            </div>
          </div>
          <input
            type="range"
            min="120"
            max="220"
            step="1"
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value))}
            className="w-full accent-lime-accent cursor-pointer h-2 bg-black/40 rounded-lg"
          />
        </div>
      </div>

      {/* Save Action & Notification */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {recordedMessage ? (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl w-full sm:w-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>{recordedMessage}</span>
          </div>
        ) : (
          <div className="text-[11px] text-gray-400 font-mono">
            Formula: BMI = Weight (kg) / [Height (m)]²
          </div>
        )}

        <button
          onClick={handleSaveMeasurement}
          style={{
            backgroundColor: currentTheme.accentColor,
            boxShadow: `0 0 15px -3px ${currentTheme.glowColor}`
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-black font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Scale className="w-4 h-4 fill-current" />
          <span>Record Measurement</span>
        </button>
      </div>

      {/* History Log Table */}
      {bmiHistory.length > 0 && (
        <div className="border-t border-[#1F2636] pt-4 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Measurement History & BMI Records</span>
          </h4>
          <div className="max-h-36 overflow-y-auto divide-y divide-white/5 pr-1">
            {bmiHistory.map((rec) => (
              <div key={rec.id} className="py-2 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">{rec.date}</span>
                <span className="text-gray-300">{rec.weightKg} kg ({rec.heightCm} cm)</span>
                <span className="font-bold text-white">{rec.bmi} kg/m²</span>
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-bold"
                  style={{ 
                    backgroundColor: categoryStyles[rec.category]?.bg || '#FFFFFF10',
                    color: categoryStyles[rec.category]?.color || '#FFF'
                  }}
                >
                  {rec.category.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific & Clinical Advisory Notice */}
      <div className="p-3.5 rounded-2xl bg-[#0E121D] border border-amber-500/20 text-[11px] text-gray-400 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 block mb-0.5">Biomechanical Limitation Notice:</strong>
          BMI does not directly differentiate between dense skeletal muscle mass and adipose tissue. Highly muscular resistance-trained athletes often fall into the "Overweight" BMI category despite possessing sub-12% body fat. Use body circumference measurements and performance progress alongside BMI screening.
          {age < 18 && (
            <p className="mt-1 text-sky-400">
              *Notice for Adolescents (&lt;18): Adult BMI categories are not diagnostic for children/teens; please refer to age- and sex-specific growth charts.*
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
