import React from 'react';

interface ExerciseAnimationProps {
  type: 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'core' | 'cardio' | 'stretch';
  targetMuscle?: string;
  category?: string;
  className?: string;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  type,
  targetMuscle = 'Primary Muscle',
  className = 'w-full h-48',
}) => {
  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-b from-[#111622] to-[#0A0D14] rounded-2xl border border-white/5 overflow-hidden p-4 ${className}`}>
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #00F050 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Dynamic Animated Vector based on Movement Pattern */}
      <svg className="w-full h-full max-h-40" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F050" />
            <stop offset="100%" stopColor="#00C840" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {type === 'push' && (
          <g className="animate-pulse">
            {/* Bench / Platform */}
            <rect x="40" y="110" width="120" height="8" rx="4" fill="#252D3E" />
            <rect x="55" y="118" width="8" height="24" fill="#1C2333" />
            <rect x="137" y="118" width="8" height="24" fill="#1C2333" />
            
            {/* Athlete Torso on Bench */}
            <rect x="50" y="100" width="100" height="12" rx="6" fill="#4B5563" />
            <circle cx="45" cy="106" r="10" fill="#6B7280" />

            {/* Glowing Chest Target Activation */}
            <ellipse cx="85" cy="104" rx="14" ry="7" fill="url(#limeGrad)" filter="url(#glow)" opacity="0.85" />

            {/* Moving Barbell with CSS keyframe translation */}
            <g className="animate-bounce" style={{ animationDuration: '2.2s' }}>
              <rect x="25" y="60" width="150" height="5" rx="2.5" fill="#E5E7EB" />
              <rect x="30" y="46" width="10" height="32" rx="3" fill="#00F050" />
              <rect x="160" y="46" width="10" height="32" rx="3" fill="#00F050" />
              {/* Hands gripping bar */}
              <circle cx="70" cy="62" r="5" fill="#9CA3AF" />
              <circle cx="130" cy="62" r="5" fill="#9CA3AF" />
              {/* Force vector arrows */}
              <path d="M100 50 L100 35 M95 40 L100 35 L105 40" stroke="#00F050" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        )}

        {type === 'squat' && (
          <g>
            {/* Ground line */}
            <line x1="30" y1="145" x2="170" y2="145" stroke="#252D3E" strokeWidth="3" strokeLinecap="round" />
            {/* Squat Silhouette */}
            <g className="animate-pulse" style={{ animationDuration: '2.5s' }}>
              {/* Head */}
              <circle cx="100" cy="45" r="10" fill="#6B7280" />
              {/* Torso */}
              <path d="M100 55 L95 90" stroke="#4B5563" strokeWidth="12" strokeLinecap="round" />
              {/* Barbell across traps */}
              <line x1="60" y1="58" x2="140" y2="58" stroke="#E5E7EB" strokeWidth="4" />
              <rect x="56" y="48" width="8" height="20" rx="2" fill="#00F050" />
              <rect x="136" y="48" width="8" height="20" rx="2" fill="#00F050" />
              {/* Femur (Quads activated) */}
              <line x1="95" y1="90" x2="72" y2="115" stroke="url(#limeGrad)" strokeWidth="12" strokeLinecap="round" filter="url(#glow)" />
              {/* Tibia */}
              <line x1="72" y1="115" x2="80" y2="145" stroke="#4B5563" strokeWidth="10" strokeLinecap="round" />
              <line x1="95" y1="90" x2="118" y2="115" stroke="url(#limeGrad)" strokeWidth="12" strokeLinecap="round" filter="url(#glow)" />
              <line x1="118" y1="115" x2="110" y2="145" stroke="#4B5563" strokeWidth="10" strokeLinecap="round" />
            </g>
          </g>
        )}

        {type === 'hinge' && (
          <g className="animate-pulse" style={{ animationDuration: '2.4s' }}>
            {/* Ground line */}
            <line x1="20" y1="145" x2="180" y2="145" stroke="#252D3E" strokeWidth="3" />
            {/* Deadlift figure */}
            <circle cx="115" cy="48" r="10" fill="#6B7280" />
            {/* Back angle / Spine */}
            <line x1="115" y1="58" x2="88" y2="92" stroke="#4B5563" strokeWidth="10" strokeLinecap="round" />
            {/* Glowing Posterior Chain / Glutes & Hamstrings */}
            <line x1="88" y1="92" x2="84" y2="120" stroke="url(#limeGrad)" strokeWidth="12" strokeLinecap="round" filter="url(#glow)" />
            <line x1="84" y1="120" x2="90" y2="145" stroke="#374151" strokeWidth="10" strokeLinecap="round" />
            {/* Barbell */}
            <line x1="60" y1="115" x2="140" y2="115" stroke="#E5E7EB" strokeWidth="4" />
            <circle cx="65" cy="115" r="14" fill="#00F050" opacity="0.9" />
            <circle cx="135" cy="115" r="14" fill="#00F050" opacity="0.9" />
          </g>
        )}

        {type === 'pull' && (
          <g className="animate-pulse" style={{ animationDuration: '2.6s' }}>
            {/* Pull up Bar */}
            <line x1="30" y1="30" x2="170" y2="30" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" />
            <circle cx="70" cy="30" r="5" fill="#9CA3AF" />
            <circle cx="130" cy="30" r="5" fill="#9CA3AF" />
            {/* Head */}
            <circle cx="100" cy="48" r="10" fill="#6B7280" />
            {/* Glowing Latissimus Dorsi Wing Activation */}
            <path d="M85 60 C80 75 75 90 90 100 L100 102 L110 100 C125 90 120 75 115 60 Z" fill="url(#limeGrad)" filter="url(#glow)" opacity="0.85" />
            {/* Torso & Arms */}
            <line x1="70" y1="30" x2="85" y2="60" stroke="#4B5563" strokeWidth="8" strokeLinecap="round" />
            <line x1="130" y1="30" x2="115" y2="60" stroke="#4B5563" strokeWidth="8" strokeLinecap="round" />
            <line x1="100" y1="102" x2="96" y2="145" stroke="#374151" strokeWidth="10" strokeLinecap="round" />
          </g>
        )}

        {(type === 'lunge' || type === 'core' || type === 'cardio' || type === 'stretch') && (
          <g className="animate-pulse" style={{ animationDuration: '2.2s' }}>
            {/* Circular Cadence Arc */}
            <circle cx="100" cy="80" r="52" stroke="#252D3E" strokeWidth="3" strokeDasharray="6 6" />
            <circle cx="100" cy="80" r="52" stroke="#00F050" strokeWidth="3" strokeDasharray="80 200" strokeLinecap="round" />
            
            {/* Dynamic Kinetic Motion Nodes */}
            <circle cx="100" cy="50" r="10" fill="#6B7280" />
            <path d="M100 60 L100 95 L125 118" stroke="url(#limeGrad)" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />
            <path d="M100 95 L75 125" stroke="#4B5563" strokeWidth="8" strokeLinecap="round" />
            <circle cx="125" cy="118" r="6" fill="#00F050" />
            <circle cx="75" cy="125" r="5" fill="#9CA3AF" />
          </g>
        )}
      </svg>

      {/* Target Muscle Tag */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs font-mono">
        <span className="text-gray-400 truncate">{targetMuscle}</span>
        <span className="text-lime-accent flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px] bg-lime-accent/10 px-2 py-0.5 rounded-full border border-lime-accent/30">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-accent animate-ping" />
          Active Biomechanics
        </span>
      </div>
    </div>
  );
};
