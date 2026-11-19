import { EnvironmentDefinition, ExerciseSubstitution } from '../types/environment';

export const INITIAL_ENVIRONMENTS: Record<'home' | 'gym', EnvironmentDefinition> = {
  home: {
    id: 'home',
    name: 'HOME MODE',
    subtitle: 'Bodyweight Mastery & Calisthenics Architecture',
    description: 'Scientifically engineered home resistance protocols. Zero mandatory gym machines—utilize bodyweight mechanics, gravitational leverage, and optional home gear.',
    accentColor: '#06B6D4', // Vibrant Cyber Cyan
    badgeBg: 'from-cyan-900/40 via-[#0B1A24] to-[#070D14]',
    equipmentOptions: [
      { id: 'bodyweight', label: 'Bodyweight Only (Zero Gear)', description: 'Floor, wall, and gravity only. No equipment needed.', isEssential: true },
      { id: 'pull_up_bar', label: 'Doorway Pull-up Bar', description: 'Permits vertical pulling, hanging core, and calisthenics levers.', isEssential: false },
      { id: 'resistance_bands', label: 'Resistance Loop Bands', description: 'Adds variable elastic resistance for pulls, presses, and mobility.', isEssential: false },
      { id: 'dumbbells', label: 'Adjustable Dumbbells', description: 'Enables progressive loading for shoulders, arms, and lunges.', isEssential: false },
      { id: 'sturdy_chair', label: 'Sturdy Chair / Elevated Box', description: 'Used for assisted lunges, step-ups, and elevated push-ups.', isEssential: true },
    ],
    levels: {
      basic: {
        level: 'basic',
        name: 'Basic Body Development',
        subtitle: 'Foundational Motor Pathways & Movement Readiness',
        focus: [
          'Building foundational strength without joint strain',
          'Developing full-range thoracic, hip, and ankle mobility',
          'Improving cardiovascular stamina and oxygen kinetics',
          'Learning safe, locked-core exercise mechanics',
        ],
        description: 'Engineered for newcomers and individuals rebuilding fitness after a prolonged break. Focuses on low-impact, high-feedback motor patterns.',
        targetAudience: 'Beginners, seniors, or athletes returning from injury/hiatus with zero lifting background.',
        workoutsRequiredForPromotion: 8,
        benchmarkRequirements: [
          { testExercise: 'Wall Push-Ups', targetBenchmark: '15 continuous strict repetitions', repsOrDuration: 15 },
          { testExercise: 'Assisted Bodyweight Squats', targetBenchmark: '15 parallel repetitions with steady cadence', repsOrDuration: 15 },
          { testExercise: 'Incline Knee Plank', targetBenchmark: '30 seconds solid core lock', repsOrDuration: 30 },
        ],
        keyMovements: [
          'Wall Push-Ups',
          'Bodyweight Box Squats',
          'Assisted Static Lunges',
          'Knee Planks',
          'Glute Bridges',
          'Standing Thoracic Rotations',
          'Brisk Stepping March',
          'Pigeon Stretch',
        ]
      },
      beginner: {
        level: 'beginner',
        name: 'Beginner Body Development',
        subtitle: 'Structured Progressive Overload & Core Resilience',
        focus: [
          'Progressive bodyweight overload across horizontal/vertical trajectories',
          'Muscular hypertrophy in chest, deltoids, back, and quads',
          'Core anti-extension and anti-rotation stability',
          'Sustained aerobic and work-capacity endurance',
        ],
        description: 'For individuals with basic mobility who are ready to build lean muscle, increase push/pull capacity, and master compound calisthenics.',
        targetAudience: 'Athletes with 2-6 months of movement consistency ready for structured progressive resistance.',
        workoutsRequiredForPromotion: 14,
        benchmarkRequirements: [
          { testExercise: 'Floor Push-Ups', targetBenchmark: '12 strict chest-to-floor repetitions', repsOrDuration: 12 },
          { testExercise: 'Deep Bodyweight Squats', targetBenchmark: '25 continuous repetitions (below parallel)', repsOrDuration: 25 },
          { testExercise: 'Full Forearm Plank', targetBenchmark: '60 seconds unbroken core lock', repsOrDuration: 60 },
        ],
        keyMovements: [
          'Standard Floor Push-Ups',
          'Bodyweight Air Squats',
          'Reverse Walking Lunges',
          'Forearm Planks & Side Planks',
          'High-Knee Mountain Climbers',
          'Incline Pike Push-Ups',
          'Bird-Dog & Deadbug',
          'Single-Leg Glute Bridges',
        ]
      },
      advanced: {
        level: 'advanced',
        name: 'Advanced Body Development',
        subtitle: 'Elite Calisthenics Mastery & Unilateral Power',
        focus: [
          'Advanced bodyweight strength and mechanical leverage alteration',
          'Unilateral leg hypertrophy and stabilizer activation',
          'Progressive gymnastics push/pull mastery',
          'High-density anaerobic work capacity and strength endurance',
        ],
        description: 'High-intensity calisthenics architecture. Utilizes mechanical disadvantages (levers, unilateral angles) to stimulate severe muscle growth without gym weights.',
        targetAudience: 'Experienced bodyweight athletes and calisthenics practitioners with strong baseline strength.',
        workoutsRequiredForPromotion: 22,
        benchmarkRequirements: [
          { testExercise: 'Diamond Push-Ups', targetBenchmark: '20 strict lockout repetitions', repsOrDuration: 20 },
          { testExercise: 'Bulgarian Split Squats', targetBenchmark: '15 controlled repetitions per leg', repsOrDuration: 15 },
          { testExercise: 'Hollow Body Hold', targetBenchmark: '45 seconds unbroken hollow tension', repsOrDuration: 45 },
          { testExercise: 'Pike Push-Ups (Feet Elevated)', targetBenchmark: '10 vertical push repetitions', repsOrDuration: 10 },
        ],
        keyMovements: [
          'Diamond & Archer Push-Ups',
          'Decline Feet-Elevated Push-Ups',
          'Bulgarian Split Squats',
          'Pike Push-Ups to Handstand Progression',
          'Hollow Body Rocks & L-Sit Holds',
          'Doorframe Inverted Body Rows',
          'Chair / Bench Parallel Dips',
          'Burpee Tuck Jumps',
        ]
      }
    }
  },
  gym: {
    id: 'gym',
    name: 'GYM MODE',
    subtitle: 'Biomechanical Iron & Resistance Platform',
    description: 'Complete commercial gym ecosystem. Utilizes full barbell stations, selectorized machines, cable columns, dumbbells, and periodized progressive overload.',
    accentColor: '#00F050', // Electric Lime
    badgeBg: 'from-emerald-950/40 via-[#102417] to-[#0A140E]',
    equipmentOptions: [
      { id: 'barbell_rack', label: 'Olympic Barbells & Power Racks', description: 'Standard 20kg bars, bumper plates, and adjustable safety pins.', isEssential: true },
      { id: 'dumbbells', label: 'Dumbbell Rack (2kg - 50kg)', description: 'Full range of pairs for presses, rows, lunges, and isolation.', isEssential: true },
      { id: 'cables', label: 'Dual Cable Cross Columns', description: 'Constant resistance through all planes of movement.', isEssential: true },
      { id: 'machines', label: 'Selectorized Pin-Loaded Machines', description: 'Chest press, leg press, lat pulldown, leg extension/curl.', isEssential: true },
      { id: 'benches', label: 'Adjustable Flat/Incline Benches', description: 'Multi-angle stability for pressing and row variations.', isEssential: true },
    ],
    levels: {
      basic: {
        level: 'basic',
        name: 'Basic Body Development',
        subtitle: 'Machine-Based Guided Resistance & Neuromuscular Safety',
        focus: [
          'Safe introduction to guided gym machines and selectorized pins',
          'Establishing proper breathing mechanics under external load',
          'Building baseline muscular endurance across all major groups',
          'Joint adaptation and connective tissue preparation',
        ],
        description: 'Designed for athletes entering a gym setting for the first time. Guided machine trajectories remove balance complexity so you can safely build neuromuscular capacity.',
        targetAudience: 'First-time gym members, individuals intimidated by free barbells, or anyone learning resistance paths.',
        workoutsRequiredForPromotion: 8,
        benchmarkRequirements: [
          { testExercise: 'Machine Chest Press', targetBenchmark: '12 smooth repetitions at 50% bodyweight', repsOrDuration: 12 },
          { testExercise: 'Seated Cable Row', targetBenchmark: '12 controlled reps with full scapular retraction', repsOrDuration: 12 },
          { testExercise: 'Machine Leg Press', targetBenchmark: '15 repetitions at 75% bodyweight', repsOrDuration: 15 },
        ],
        keyMovements: [
          'Machine Chest Press',
          'Seated Cable Row',
          'Lat Pulldown Machine',
          '45-Degree Leg Press Machine',
          'Seated Leg Extension',
          'Lying / Seated Leg Curl',
          'Dumbbell Goblet Squat (Light)',
          'Treadmill Incline Walking',
        ]
      },
      beginner: {
        level: 'beginner',
        name: 'Beginner Body Development',
        subtitle: 'Free Weight Fundamentals & Push-Pull-Legs Structure',
        focus: [
          'Mastering barbell and dumbbell compound movement trajectories',
          'Implementing standard weekly progressive overload (adding weight/reps)',
          'Push / Pull / Legs and Upper / Lower weekly split management',
          'Systematic recovery tracking and RPE self-regulation',
        ],
        description: 'Transitioning from guided machines to free barbells and dumbbells. Develops structural balance, grip strength, and core stabilization.',
        targetAudience: 'Gym members with 3-12 months of machine experience ready for serious barbell/dumbbell progression.',
        workoutsRequiredForPromotion: 16,
        benchmarkRequirements: [
          { testExercise: 'Barbell Flat Bench Press', targetBenchmark: '8 clean repetitions at 75% bodyweight', repsOrDuration: 8 },
          { testExercise: 'Barbell Back Squat', targetBenchmark: '8 full-depth repetitions at 100% bodyweight', repsOrDuration: 8 },
          { testExercise: 'Conventional Deadlift', targetBenchmark: '6 strict repetitions at 120% bodyweight', repsOrDuration: 6 },
        ],
        keyMovements: [
          'Barbell Flat Bench Press',
          'Incline Dumbbell Press',
          'Barbell Back Squat',
          'Dumbbell Romanian Deadlift (RDL)',
          'Standing Dumbbell Overhead Press',
          'Bent-Over Barbell Row',
          'Cable Face Pulls',
          'Parallel Bar Dips',
        ]
      },
      advanced: {
        level: 'advanced',
        name: 'Advanced Body Development',
        subtitle: 'Maximal Compound Hypertrophy & Periodized Hegemony',
        focus: [
          'Heavy multi-joint force generation (Squat, Bench, Deadlift, OHP)',
          'Periodized training waves (hypertrophy, strength, and peaking phases)',
          'Advanced overload techniques (drop sets, rest-pause, tempo eccentrics)',
          'Maximal CNS resilience and individualized kinetic adaptation',
        ],
        description: 'Elite iron architecture. Designed for experienced lifters capable of handling high tonnage, high RPE (8.5-9.5), and dense work capacities.',
        targetAudience: 'Experienced lifters, strength athletes, and bodybuilders with 2+ years of consistent heavy barbell lifting.',
        workoutsRequiredForPromotion: 24,
        benchmarkRequirements: [
          { testExercise: 'Barbell Flat Bench Press', targetBenchmark: '5 paused reps at 120% bodyweight', repsOrDuration: 5 },
          { testExercise: 'Barbell Back Squat', targetBenchmark: '5 full-depth reps at 150% bodyweight', repsOrDuration: 5 },
          { testExercise: 'Conventional Deadlift', targetBenchmark: '5 strict reps at 180% bodyweight', repsOrDuration: 5 },
          { testExercise: 'Weighted Pull-Ups', targetBenchmark: '5 strict reps with +20kg load', repsOrDuration: 5 },
        ],
        keyMovements: [
          'Heavy Barbell Back Squat (RPE 8.5+)',
          'Paused Competition Bench Press',
          'Conventional Barbell Deadlift',
          'Standing Military Barbell Press',
          'Weighted Strict Pull-Ups',
          'Weighted Chest & Triceps Dips',
          'Power Clean & Push Press',
          'Cable Fly Crossover Drop Sets',
        ]
      }
    }
  }
};

export const INITIAL_EXERCISE_SUBSTITUTIONS: ExerciseSubstitution[] = [
  {
    id: 'sub-pullup-home',
    originalExerciseId: 'ex-pullup',
    originalExerciseName: 'Strict Overhand Pull-Up',
    substituteExerciseId: 'ex-doorframe-row',
    substituteExerciseName: 'Doorframe Towel Row / Table Inverted Row',
    environment: 'home',
    equipmentCondition: 'When no overhead pull-up bar is available at home',
    biomechanicalMatch: 'Latissimus dorsi and rhomboid horizontal/vertical pulling action'
  },
  {
    id: 'sub-dip-home',
    originalExerciseId: 'ex-dips',
    originalExerciseName: 'Parallel Bar Triceps & Chest Dips',
    substituteExerciseId: 'ex-chair-dips',
    substituteExerciseName: 'Elevated Chair / Bench Dips',
    environment: 'home',
    equipmentCondition: 'When parallel dip bars are unavailable at home',
    biomechanicalMatch: 'Triceps brachii and sternal pectoralis extension'
  },
  {
    id: 'sub-barbell-squat-home',
    originalExerciseId: 'ex-barbell-squat',
    originalExerciseName: 'Barbell Back Squat',
    substituteExerciseId: 'ex-bulgarian-split-squat',
    substituteExerciseName: 'Elevated Bulgarian Split Squats',
    environment: 'home',
    equipmentCondition: 'When heavy barbell rack is unavailable at home',
    biomechanicalMatch: 'Quadriceps and gluteus maximus unilateral overload'
  },
  {
    id: 'sub-bench-home',
    originalExerciseId: 'ex-bench-press',
    originalExerciseName: 'Barbell Flat Bench Press',
    substituteExerciseId: 'ex-decline-pushup',
    substituteExerciseName: 'Decline Feet-Elevated Push-Ups / Floor Press',
    environment: 'home',
    equipmentCondition: 'When bench press station is unavailable at home',
    biomechanicalMatch: 'Horizontal pressing with clavicular and sternal pectoral focus'
  },
  {
    id: 'sub-squat-rack-gym',
    originalExerciseId: 'ex-barbell-squat',
    originalExerciseName: 'Barbell Back Squat',
    substituteExerciseId: 'ex-leg-press',
    substituteExerciseName: '45-Degree Machine Leg Press',
    environment: 'gym',
    equipmentCondition: 'When squat racks are occupied or lower back deload is required',
    biomechanicalMatch: 'Quadriceps and glute extension with reduced lumbar shear'
  },
  {
    id: 'sub-bench-gym',
    originalExerciseId: 'ex-bench-press',
    originalExerciseName: 'Barbell Flat Bench Press',
    substituteExerciseId: 'ex-machine-chest-press',
    substituteExerciseName: 'Selectorized Machine Chest Press',
    environment: 'gym',
    equipmentCondition: 'When flat barbell stations are occupied or solo training without spotter',
    biomechanicalMatch: 'Guided pectoral horizontal adduction with safety lockout'
  },
  {
    id: 'sub-cable-facepull-gym',
    originalExerciseId: 'ex-cable-face-pull',
    originalExerciseName: 'Cable Face Pull with External Rotation',
    substituteExerciseId: 'ex-dumbbell-prone-raise',
    substituteExerciseName: 'Incline Bench Prone Y-T-W Raises',
    environment: 'gym',
    equipmentCondition: 'When cable columns are busy',
    biomechanicalMatch: 'Posterior deltoid and rotator cuff infraspinatus external rotation'
  }
];
