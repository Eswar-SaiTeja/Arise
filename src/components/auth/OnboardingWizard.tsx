import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  Dumbbell, 
  Clock, 
  Calendar, 
  Sparkles,
  Zap,
  Activity,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FitnessLevel, WorkoutPreference } from '../../types';
import { useBrand } from '../../context/BrandContext';
import { environmentService } from '../../services/environmentService';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { profile, completeOnboarding } = useAuth();
  const { currentTheme, setThemeId } = useBrand();
  const [step, setStep] = useState<number>(1);

  // Form states
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [age, setAge] = useState<number>(profile.age || 26);
  const [gender, setGender] = useState<string>(profile.gender || 'Male');
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 180);
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 80);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(profile.fitnessLevel || 'intermediate');
  const [primaryGoal, setPrimaryGoal] = useState<string>(profile.primaryGoal || 'muscle_gain');
  const [workoutPreference, setWorkoutPreference] = useState<WorkoutPreference>(profile.workoutPreference || 'gym');
  const [trainingEnvironment, setTrainingEnvironment] = useState<'home' | 'gym'>(profile.trainingEnvironment || 'gym');
  const [developmentLevel, setDevelopmentLevel] = useState<'basic' | 'beginner' | 'advanced'>(profile.developmentLevel || 'beginner');
  const [exerciseLimitations, setExerciseLimitations] = useState<string>('');
  const [equipmentAvailable, setEquipmentAvailable] = useState<string[]>(profile.equipmentAvailable || ['Barbell', 'Dumbbells', 'Bench']);
  const [preferredDurationMin, setPreferredDurationMin] = useState<number>(profile.preferredDurationMin || 45);
  const [weeklyFrequency, setWeeklyFrequency] = useState<number>(profile.weeklyFrequency || 4);

  const toggleEquipment = (eq: string) => {
    if (equipmentAvailable.includes(eq)) {
      setEquipmentAvailable(equipmentAvailable.filter(item => item !== eq));
    } else {
      setEquipmentAvailable([...equipmentAvailable, eq]);
    }
  };

  const handleFinish = () => {
    environmentService.setEnvironment(trainingEnvironment);
    environmentService.setDevelopmentLevel(developmentLevel);
    completeOnboarding({
      fullName: fullName || 'Athlete',
      age,
      gender,
      heightCm,
      weightKg,
      fitnessLevel,
      primaryGoal,
      workoutPreference: trainingEnvironment === 'home' ? 'home' : 'gym',
      trainingEnvironment,
      developmentLevel,
      equipmentAvailable,
      preferredDurationMin,
      weeklyFrequency,
      isOnboarded: true,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090B10] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#141923] border border-[#252D3E] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 my-8">
        {/* Step Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="text-lime-accent font-bold uppercase tracking-wider">
              ATHLETE INITIALIZATION: STEP {step} OF 5
            </span>
            <span>{Math.round((step / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-[#0E121A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-accent to-emerald-400 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white font-display">
                Welcome to the Training System. Who is training?
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Your physical telemetry will calibrate starting exercise loads and target volume.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Athlete Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Age</label>
                  <input
                    type="number"
                    min="14"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-400 uppercase block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-accent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary / Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Body Stats */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white font-display">
                Baseline Body Anthropometry
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Used to calculate metabolic expenditure, relative strength thresholds, and volume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase block">Height (Centimeters)</label>
                <div className="text-3xl font-black text-white font-display flex items-baseline gap-1">
                  <input
                    type="number"
                    step="0.5"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 180)}
                    className="w-24 bg-transparent border-b border-lime-accent text-lime-accent focus:outline-none"
                  />
                  <span className="text-sm font-normal text-gray-400">cm</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#181E2B] border border-[#252D3E] space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase block">Weight (Kilograms)</label>
                <div className="text-3xl font-black text-white font-display flex items-baseline gap-1">
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 80)}
                    className="w-24 bg-transparent border-b border-lime-accent text-lime-accent focus:outline-none"
                  />
                  <span className="text-sm font-normal text-gray-400">kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Fitness Experience Level */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white font-display">
                Current Training Experience
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Calibrates recovery kinetics, volume, and neurological intensity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'beginner', title: 'Beginner', desc: '< 1 year consistent resistance lifting. Learning movement motor patterns.' },
                { id: 'intermediate', title: 'Intermediate', desc: '1 to 3 years lifting. Solid form on squats, presses, and rows.' },
                { id: 'advanced', title: 'Advanced', desc: '3 to 5+ years serious training. Familiar with RPE and periodization.' },
                { id: 'elite', title: 'Elite / Athlete', desc: 'Competitive powerlifter, bodybuilder, or varsity athlete.' },
              ].map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setFitnessLevel(lvl.id as FitnessLevel)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    fitnessLevel === lvl.id
                      ? 'bg-lime-accent/15 border-lime-accent text-white shadow-glow-lime/10'
                      : 'bg-[#181E2B] border-[#252D3E] text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base text-white">{lvl.title}</h3>
                    {fitnessLevel === lvl.id && <Check className="w-4 h-4 text-lime-accent" />}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{lvl.desc}</p>
                </div>
              ))}
            </div>

            {/* Select Training Mode in Step 3 */}
            <div className="pt-4 border-t border-[#252D3E] space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-gray-400 block font-bold">
                  Choose Training Mode & Difficulty
                </label>
                <p className="text-[11px] text-gray-400">
                  Select your starting experience. You can switch modes at any time in the app header or settings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'easy' as const, name: 'EASY MODE', desc: 'Beginner-friendly progression & manageable missions.', color: '#06B6D4', diff: 'Beginner' },
                  { id: 'normal' as const, name: 'NORMAL MODE', desc: 'Balanced intensity & standard athletic missions.', color: '#00F050', diff: 'Intermediate' },
                  { id: 'hell' as const, name: 'HELL MODE', desc: 'Advanced challenges, strict rest & demanding goals.', color: '#EF4444', diff: 'Advanced' },
                ].map(mode => {
                  const isSelected = currentTheme.name === mode.name;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setThemeId(mode.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white/10 border-white/40 shadow-lg ring-1 ring-white/20'
                          : 'bg-[#181E2B] border-[#252D3E] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: mode.color, boxShadow: `0 0 8px ${mode.color}60` }}
                          />
                          <span className="text-xs font-bold text-white font-display">{mode.name}</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase" style={{ backgroundColor: `${mode.color}20`, color: mode.color }}>
                          {mode.diff}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">{mode.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Primary Goal */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white font-display">
                Primary Athletic Objective
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Your entire program schedule and exercise recommendations will anchor around this.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'fat_loss', title: 'Fat Loss & Athletic Conditioning', desc: 'Caloric density, high metabolic output, preserved lean mass.' },
                { id: 'muscle_gain', title: 'Muscle Hypertrophy & Density', desc: 'Maximal mechanical tension, muscle growth, and aesthetic shape.' },
                { id: 'pure_strength', title: 'Pure Neural Strength (Powerlifting)', desc: 'Maximal 1-Rep Max force production on Squat, Bench, and Deadlift.' },
                { id: 'home_agility', title: 'Calisthenics & Bodyweight Dominance', desc: 'Relative strength, gymnastic levers, tendon resilience.' },
              ].map((g) => (
                <div
                  key={g.id}
                  onClick={() => setPrimaryGoal(g.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    primaryGoal === g.id
                      ? 'bg-lime-accent/15 border-lime-accent text-white'
                      : 'bg-[#181E2B] border-[#252D3E] text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-sm text-white">{g.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{g.desc}</p>
                  </div>
                  {primaryGoal === g.id && <Check className="w-5 h-5 text-lime-accent shrink-0 ml-3" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Training Environment, Equipment & Schedule */}
        {step === 5 && (
          <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <h2 className="text-2xl font-black text-white font-display">
                Environment & Equipment Setup
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Configure your physical training grounds, starting development tier, and available gear.
              </p>
            </div>

            {/* Primary Environment Selection: Home vs Gym */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 block font-bold">
                Primary Training Ground
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTrainingEnvironment('home')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    trainingEnvironment === 'home'
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-md ring-1 ring-cyan-400/50'
                      : 'border-[#252D3E] bg-[#181E2B] text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">HOME MODE</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Bodyweight mastery, calisthenics & gravitational resistance.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTrainingEnvironment('gym')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    trainingEnvironment === 'gym'
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-md ring-1 ring-emerald-400/50'
                      : 'border-[#252D3E] bg-[#181E2B] text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Dumbbell className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">GYM MODE</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Guided machines, barbell power racks & free weight tonnage.</p>
                </button>
              </div>
            </div>

            {/* Development Tier */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-400 block font-bold">
                Starting Development Tier ({trainingEnvironment.toUpperCase()})
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'basic', label: 'Basic Body Dev', sub: 'Foundational movement' },
                  { id: 'beginner', label: 'Beginner Dev', sub: 'Progressive overload' },
                  { id: 'advanced', label: 'Advanced Dev', sub: 'Peak hypertrophy & power' }
                ].map(tier => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setDevelopmentLevel(tier.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      developmentLevel === tier.id
                        ? 'border-white/40 bg-white/10 text-white font-bold'
                        : 'border-[#252D3E] bg-[#181E2B] text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.label}</div>
                    <div className="text-[10px] text-gray-400 truncate">{tier.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Grid */}
            <div>
              <label className="text-xs font-mono text-gray-400 uppercase block mb-2 font-bold">
                Available Equipment Checklist
              </label>
              <div className="flex flex-wrap gap-2">
                {['Barbell', 'Dumbbells', 'Bench', 'Squat Rack', 'Pull-up Bar', 'Cables', 'Resistance Bands', 'Sturdy Chair', 'Jump Rope', 'Bodyweight Only'].map(eq => {
                  const isChecked = equipmentAvailable.includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => toggleEquipment(eq)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all ${
                        isChecked
                          ? 'bg-lime-accent text-black border-lime-accent font-bold'
                          : 'bg-[#181E2B] text-gray-300 border-[#252D3E] hover:border-white/20'
                      }`}
                    >
                      {isChecked ? `✓ ${eq}` : `+ ${eq}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Limitations or Injuries */}
            <div>
              <label className="text-xs font-mono text-gray-400 uppercase block mb-1 font-bold">
                Exercise Limitations or Injuries (Optional)
              </label>
              <input
                type="text"
                value={exerciseLimitations}
                onChange={(e) => setExerciseLimitations(e.target.value)}
                placeholder="e.g. Lower back sensitivity, right shoulder impingement, no overhead pressing"
                className="w-full bg-[#181E2B] border border-[#252D3E] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Frequency & Duration Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#181E2B] border border-[#252D3E] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400 uppercase">Weekly Frequency</span>
                  <span className="text-lime-accent font-bold">{weeklyFrequency} Days/Wk</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={weeklyFrequency}
                  onChange={(e) => setWeeklyFrequency(parseInt(e.target.value))}
                  className="w-full accent-lime-accent"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181E2B] border border-[#252D3E] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400 uppercase">Session Duration</span>
                  <span className="text-lime-accent font-bold">{preferredDurationMin} Mins</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={preferredDurationMin}
                  onChange={(e) => setPreferredDurationMin(parseInt(e.target.value))}
                  className="w-full accent-lime-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-[#252D3E]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-[#252D3E] text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-glow-lime"
            >
              <span>Proceed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-8 py-3 rounded-xl bg-lime-accent hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-glow-lime hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>INITIALIZE ATHLETE PROFILE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
