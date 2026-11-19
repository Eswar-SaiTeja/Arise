import { WorkoutProgram } from '../types';

export const INITIAL_PROGRAMS: WorkoutProgram[] = [
  // 1. Beginner Fitness Program
  {
    id: 'prog-beginner-foundation',
    slug: 'beginner-fitness-foundation',
    title: 'Beginner Fitness Foundation',
    description: 'A bulletproof 4-week protocol establishing neuromuscular coordination, joint stability, and foundational movement patterns. Zero prior lifting experience needed.',
    durationWeeks: 4,
    daysPerWeek: 3,
    difficulty: 'beginner',
    primaryGoal: 'General Conditioning & Foundation',
    targetAudience: 'Individuals new to structured resistance training or returning after a prolonged hiatus.',
    equipmentRequired: ['Dumbbells', 'Bodyweight', 'Bench'],
    progressionNotes: 'Focus on perfect form. Increase load by 1-2kg only when all target repetitions in all sets are achieved with strict cadence.',
    isCustom: false,
    isPublished: true,
    enrolledCount: 1420,
    days: [
      {
        id: 'day-bg-1',
        dayNumber: 1,
        title: 'Day 1: Full-Body Movement Prep',
        description: 'Foundational squat and upper-body push/pull mechanics.',
        targetFocus: 'Full Body Stability',
        estimatedDurationMin: 45,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-worlds-greatest-stretch', exerciseName: "The World's Greatest Stretch", sets: 2, targetReps: '6 each', restSec: 45 },
          { exerciseId: 'ex-barbell-back-squat', exerciseName: 'Barbell Back Squat', sets: 3, targetReps: '8-10', restSec: 90 },
          { exerciseId: 'ex-incline-dumbbell-press', exerciseName: 'Incline Dumbbell Press', sets: 3, targetReps: '10-12', restSec: 60 },
          { exerciseId: 'ex-pullup', exerciseName: 'Strict Overhand Pull-Up', sets: 3, targetReps: '6-8', restSec: 90 },
          { exerciseId: 'ex-dumbbell-lateral-raise', exerciseName: 'Standing Dumbbell Lateral Raise', sets: 3, targetReps: '12-15', restSec: 45 }
        ]
      },
      {
        id: 'day-bg-2',
        dayNumber: 2,
        title: 'Day 2: Active Recovery & Mobility',
        description: 'Low intensity joint mobility and aerobic flow.',
        targetFocus: 'Recovery',
        estimatedDurationMin: 25,
        isRestDay: true,
        exercises: []
      },
      {
        id: 'day-bg-3',
        dayNumber: 3,
        title: 'Day 3: Posterior Chain & Core',
        description: 'Hinge patterns, hamstring stability, and horizontal pulling.',
        targetFocus: 'Back, Hamstrings & Core',
        estimatedDurationMin: 45,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-romanian-deadlift', exerciseName: 'Dumbbell Romanian Deadlift (RDL)', sets: 3, targetReps: '10-12', restSec: 90 },
          { exerciseId: 'ex-bent-over-barbell-row', exerciseName: 'Bent-Over Barbell Row', sets: 3, targetReps: '8-10', restSec: 90 },
          { exerciseId: 'ex-overhead-barbell-press', exerciseName: 'Standing Overhead Military Press', sets: 3, targetReps: '8-10', restSec: 90 },
          { exerciseId: 'ex-hanging-leg-raise', exerciseName: 'Hanging Leg Raise', sets: 3, targetReps: '10-12', restSec: 60 }
        ]
      },
      {
        id: 'day-bg-4',
        dayNumber: 4,
        title: 'Day 4: Rest & Hydration',
        description: 'Complete systemic rest.',
        targetFocus: 'Rest',
        estimatedDurationMin: 0,
        isRestDay: true,
        exercises: []
      },
      {
        id: 'day-bg-5',
        dayNumber: 5,
        title: 'Day 5: Total Body Athletic Capacity',
        description: 'Cardio conditioning combined with compound strength.',
        targetFocus: 'Full Body Conditioning',
        estimatedDurationMin: 45,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-bulgarian-split-squat', exerciseName: 'Bulgarian Split Squat', sets: 3, targetReps: '8 each', restSec: 75 },
          { exerciseId: 'ex-cable-crossover-fly', exerciseName: 'Standing Cable Fly Crossover', sets: 3, targetReps: '12-15', restSec: 60 },
          { exerciseId: 'ex-incline-dumbbell-curl', exerciseName: 'Incline Bench Dumbbell Curl', sets: 3, targetReps: '10-12', restSec: 60 },
          { exerciseId: 'ex-overhead-cable-triceps', exerciseName: 'Overhead Cable Triceps Extension', sets: 3, targetReps: '12-15', restSec: 60 },
          { exerciseId: 'ex-jump-rope-intervals', exerciseName: 'Speed Jump Rope Intervals', sets: 4, targetReps: '45s on / 30s off', restSec: 30 }
        ]
      }
    ]
  },

  // 2. Muscle Building Program (Hypertrophy)
  {
    id: 'prog-hypertrophy-elite',
    slug: 'muscle-building-hypertrophy',
    title: 'Hypertrophy Matrix: Muscle Building',
    description: 'An intensive 8-week Upper/Lower hypertrophy split engineered to maximize mechanical tension, muscle protein synthesis, and metabolic fatigue.',
    durationWeeks: 8,
    daysPerWeek: 5,
    difficulty: 'intermediate',
    primaryGoal: 'Muscle Hypertrophy & Mass',
    targetAudience: 'Lifters looking to add lean muscle mass with high-volume isolation and compound combinations.',
    equipmentRequired: ['Barbell', 'Dumbbells', 'Cables', 'Bench', 'Pull-up Bar'],
    progressionNotes: 'Target an RPE of 8-9 on all working sets (1-2 reps shy of absolute technical failure).',
    isCustom: false,
    isPublished: true,
    enrolledCount: 2840,
    days: [
      {
        id: 'day-hyp-1',
        dayNumber: 1,
        title: 'Day 1: Upper Body Power & Chest Dominance',
        description: 'Heavy horizontal pressing paired with vertical pulling.',
        targetFocus: 'Chest, Back & Shoulders',
        estimatedDurationMin: 55,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-bench', exerciseName: 'Barbell Flat Bench Press', sets: 4, targetReps: '6-8', restSec: 120 },
          { exerciseId: 'ex-pullup', exerciseName: 'Strict Overhand Pull-Up', sets: 4, targetReps: '8-10', restSec: 90 },
          { exerciseId: 'ex-incline-dumbbell-press', exerciseName: 'Incline Dumbbell Press', sets: 3, targetReps: '8-12', restSec: 75 },
          { exerciseId: 'ex-cable-face-pull', exerciseName: 'Cable Face Pull with External Rotation', sets: 3, targetReps: '15', restSec: 60 },
          { exerciseId: 'ex-parallel-bar-dips', exerciseName: 'Parallel Bar Triceps & Chest Dips', sets: 3, targetReps: '10-12', restSec: 75 }
        ]
      },
      {
        id: 'day-hyp-2',
        dayNumber: 2,
        title: 'Day 2: Quad Dominance & Posterior Chain',
        description: 'Squat mechanics and deep hamstring stretch.',
        targetFocus: 'Quadriceps, Hamstrings & Calves',
        estimatedDurationMin: 55,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-back-squat', exerciseName: 'Barbell Back Squat', sets: 4, targetReps: '6-8', restSec: 120 },
          { exerciseId: 'ex-romanian-deadlift', exerciseName: 'Dumbbell Romanian Deadlift (RDL)', sets: 3, targetReps: '8-10', restSec: 90 },
          { exerciseId: 'ex-bulgarian-split-squat', exerciseName: 'Bulgarian Split Squat', sets: 3, targetReps: '10 each', restSec: 90 },
          { exerciseId: 'ex-ab-wheel-rollout', exerciseName: 'Kneeling Ab Wheel Rollout', sets: 3, targetReps: '10-12', restSec: 60 }
        ]
      },
      {
        id: 'day-hyp-3',
        dayNumber: 3,
        title: 'Day 3: Deload Mobility & Rest',
        description: 'Foam rolling, deep stretching, and active parasympathetic recovery.',
        targetFocus: 'Recovery',
        estimatedDurationMin: 20,
        isRestDay: true,
        exercises: []
      },
      {
        id: 'day-hyp-4',
        dayNumber: 4,
        title: 'Day 4: Upper Body Density & Arm Sculpting',
        description: 'Overhead pressing, barbell rows, and arm supersets.',
        targetFocus: 'Shoulders, Back & Arms',
        estimatedDurationMin: 50,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-overhead-barbell-press', exerciseName: 'Standing Overhead Military Press', sets: 4, targetReps: '6-8', restSec: 90 },
          { exerciseId: 'ex-bent-over-barbell-row', exerciseName: 'Bent-Over Barbell Row', sets: 4, targetReps: '8-10', restSec: 90 },
          { exerciseId: 'ex-dumbbell-lateral-raise', exerciseName: 'Standing Dumbbell Lateral Raise', sets: 4, targetReps: '12-15', restSec: 45 },
          { exerciseId: 'ex-incline-dumbbell-curl', exerciseName: 'Incline Bench Dumbbell Curl', sets: 3, targetReps: '10-12', restSec: 60 },
          { exerciseId: 'ex-overhead-cable-triceps', exerciseName: 'Overhead Cable Triceps Extension', sets: 3, targetReps: '12-15', restSec: 60 }
        ]
      },
      {
        id: 'day-hyp-5',
        dayNumber: 5,
        title: 'Day 5: Posterior Chain Max & Core Strength',
        description: 'Deadlift power and hamstring focus.',
        targetFocus: 'Back, Glutes & Abs',
        estimatedDurationMin: 55,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-deadlift', exerciseName: 'Conventional Barbell Deadlift', sets: 4, targetReps: '5', restSec: 150 },
          { exerciseId: 'ex-cable-crossover-fly', exerciseName: 'Standing Cable Fly Crossover', sets: 3, targetReps: '12-15', restSec: 60 },
          { exerciseId: 'ex-hanging-leg-raise', exerciseName: 'Hanging Leg Raise', sets: 3, targetReps: '12-15', restSec: 60 },
          { exerciseId: 'ex-jump-rope-intervals', exerciseName: 'Speed Jump Rope Intervals', sets: 3, targetReps: '60s', restSec: 30 }
        ]
      }
    ]
  },

  // 3. Weight Management & Shred Program
  {
    id: 'prog-weight-management',
    slug: 'weight-management-metabolic',
    title: 'Metabolic Lean & Calorie Burner',
    description: 'A high-density 6-week program combining compound resistance lifting with high-octane metabolic intervals to maximize caloric expenditure while preserving muscle mass.',
    durationWeeks: 6,
    daysPerWeek: 4,
    difficulty: 'intermediate',
    primaryGoal: 'Fat Loss & Conditioning',
    targetAudience: 'Athletes seeking body recomposition, subcutaneous fat reduction, and increased aerobic output.',
    equipmentRequired: ['Dumbbells', 'Jump Rope', 'Bodyweight'],
    progressionNotes: 'Shorten rest intervals by 5 seconds each week to boost metabolic density.',
    isCustom: false,
    isPublished: true,
    enrolledCount: 1980,
    days: [
      {
        id: 'day-wm-1',
        dayNumber: 1,
        title: 'Day 1: Full Body Metabolic Circuit',
        description: 'High tempo compound strength supersets.',
        targetFocus: 'Full Body & Heart Rate',
        estimatedDurationMin: 40,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-back-squat', exerciseName: 'Barbell Back Squat', sets: 4, targetReps: '10-12', restSec: 60 },
          { exerciseId: 'ex-incline-dumbbell-press', exerciseName: 'Incline Dumbbell Press', sets: 3, targetReps: '12', restSec: 45 },
          { exerciseId: 'ex-hiit-burpee', exerciseName: 'Athletic Chest-to-Floor Burpee', sets: 3, targetReps: '15', restSec: 45 },
          { exerciseId: 'ex-ab-wheel-rollout', exerciseName: 'Kneeling Ab Wheel Rollout', sets: 3, targetReps: '10', restSec: 45 }
        ]
      },
      {
        id: 'day-wm-2',
        dayNumber: 2,
        title: 'Day 2: Cardio Flush & Deep Flexibility',
        description: 'Active recovery and hip mobility.',
        targetFocus: 'Mobility & Recovery',
        estimatedDurationMin: 30,
        isRestDay: true,
        exercises: []
      },
      {
        id: 'day-wm-3',
        dayNumber: 3,
        title: 'Day 3: Posterior Chain & HIIT Tabata',
        description: 'Deadlifts and sprint jump-rope intervals.',
        targetFocus: 'Hamstrings, Back & Cardio',
        estimatedDurationMin: 45,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-romanian-deadlift', exerciseName: 'Dumbbell Romanian Deadlift (RDL)', sets: 4, targetReps: '12', restSec: 60 },
          { exerciseId: 'ex-bent-over-barbell-row', exerciseName: 'Bent-Over Barbell Row', sets: 3, targetReps: '10-12', restSec: 60 },
          { exerciseId: 'ex-jump-rope-intervals', exerciseName: 'Speed Jump Rope Intervals', sets: 5, targetReps: '60s', restSec: 30 },
          { exerciseId: 'ex-hanging-leg-raise', exerciseName: 'Hanging Leg Raise', sets: 3, targetReps: '12', restSec: 45 }
        ]
      },
      {
        id: 'day-wm-4',
        dayNumber: 4,
        title: 'Day 4: Athletic Density & Core Burn',
        description: 'Unilateral stability and rapid push/pull.',
        targetFocus: 'Full Body Agility',
        estimatedDurationMin: 40,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-bulgarian-split-squat', exerciseName: 'Bulgarian Split Squat', sets: 3, targetReps: '12 each', restSec: 60 },
          { exerciseId: 'ex-dumbbell-lateral-raise', exerciseName: 'Standing Dumbbell Lateral Raise', sets: 3, targetReps: '15', restSec: 45 },
          { exerciseId: 'ex-hiit-burpee', exerciseName: 'Athletic Chest-to-Floor Burpee', sets: 4, targetReps: '12', restSec: 45 },
          { exerciseId: 'ex-pigeon-stretch', exerciseName: 'Deep Pigeon Hip Stretch', sets: 2, targetReps: '60s', restSec: 30 }
        ]
      }
    ]
  },

  // 4. Strength Training Program (Power 5x5)
  {
    id: 'prog-absolute-strength',
    slug: 'pure-strength-power',
    title: 'Absolute Strength: The 5x5 System',
    description: 'A 10-week heavy iron regimen designed around the Big Three (Squat, Bench, Deadlift) and Overhead Press to develop bone-crushing absolute neural strength.',
    durationWeeks: 10,
    daysPerWeek: 4,
    difficulty: 'advanced',
    primaryGoal: 'Maximal Strength & Neural Drive',
    targetAudience: 'Experienced lifters aiming to set new 1-Rep Max personal records.',
    equipmentRequired: ['Barbell', 'Squat Rack', 'Plates', 'Flat Bench'],
    progressionNotes: 'Add 2.5kg to upper body lifts and 5kg to lower body lifts each week as long as 5 sets of 5 reps are locked cleanly.',
    isCustom: false,
    isPublished: true,
    enrolledCount: 1650,
    days: [
      {
        id: 'day-str-1',
        dayNumber: 1,
        title: 'Day 1: Heavy Squat & Bench Vol. 1',
        description: 'Maximal recruitment in knee extension and horizontal chest drive.',
        targetFocus: 'Squat & Bench Press',
        estimatedDurationMin: 65,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-back-squat', exerciseName: 'Barbell Back Squat', sets: 5, targetReps: '5', restSec: 180 },
          { exerciseId: 'ex-barbell-bench', exerciseName: 'Barbell Flat Bench Press', sets: 5, targetReps: '5', restSec: 180 },
          { exerciseId: 'ex-bent-over-barbell-row', exerciseName: 'Bent-Over Barbell Row', sets: 3, targetReps: '6', restSec: 120 }
        ]
      },
      {
        id: 'day-str-2',
        dayNumber: 2,
        title: 'Day 2: Rest & Central Nervous System Recovery',
        description: 'Complete rest to restore ATP and neural neurotransmitters.',
        targetFocus: 'Recovery',
        estimatedDurationMin: 0,
        isRestDay: true,
        exercises: []
      },
      {
        id: 'day-str-3',
        dayNumber: 3,
        title: 'Day 3: Heavy Deadlift & Overhead Drive',
        description: 'Maximum posterior chain pull and vertical press.',
        targetFocus: 'Deadlift & Overhead Press',
        estimatedDurationMin: 65,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-deadlift', exerciseName: 'Conventional Barbell Deadlift', sets: 5, targetReps: '3-5', restSec: 210 },
          { exerciseId: 'ex-overhead-barbell-press', exerciseName: 'Standing Overhead Military Press', sets: 5, targetReps: '5', restSec: 180 },
          { exerciseId: 'ex-pullup', exerciseName: 'Strict Overhand Pull-Up', sets: 3, targetReps: '6-8', restSec: 120 }
        ]
      },
      {
        id: 'day-str-4',
        dayNumber: 4,
        title: 'Day 4: Heavy Clean & Core Bracing',
        description: 'Explosive triple extension and heavy abdominal stabilization.',
        targetFocus: 'Power Clean & Core',
        estimatedDurationMin: 55,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-clean-and-press', exerciseName: 'Power Clean & Push Press', sets: 4, targetReps: '3-4', restSec: 180 },
          { exerciseId: 'ex-parallel-bar-dips', exerciseName: 'Parallel Bar Triceps & Chest Dips', sets: 4, targetReps: '6-8', restSec: 120 },
          { exerciseId: 'ex-ab-wheel-rollout', exerciseName: 'Kneeling Ab Wheel Rollout', sets: 3, targetReps: '8', restSec: 90 }
        ]
      }
    ]
  },

  // 5. Home Workout Program
  {
    id: 'prog-home-calisthenics',
    slug: 'home-calisthenics-mastery',
    title: 'Zero-Equipment Calisthenics Mastery',
    description: 'A 6-week gymnastics-inspired program designed to be executed anywhere with minimal to zero equipment. Build relative strength, balance, and lean definition.',
    durationWeeks: 6,
    daysPerWeek: 4,
    difficulty: 'beginner',
    primaryGoal: 'Relative Bodyweight Strength',
    targetAudience: 'Athletes who train at home, travel frequently, or master pure body control.',
    equipmentRequired: ['Bodyweight', 'Floor Space', 'Sturdy Door/Bar (Optional)'],
    progressionNotes: 'Slow down each repetition to a 3-second negative to increase mechanical tension.',
    isCustom: false,
    isPublished: true,
    enrolledCount: 2310,
    days: [
      {
        id: 'day-hm-1',
        dayNumber: 1,
        title: 'Day 1: Pushing Power & Core Control',
        description: 'Push-up variations and anti-extension core.',
        targetFocus: 'Chest, Triceps & Abs',
        estimatedDurationMin: 35,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-parallel-bar-dips', exerciseName: 'Parallel Bar Triceps & Chest Dips', sets: 3, targetReps: '10-12', restSec: 60 },
          { exerciseId: 'ex-hiit-burpee', exerciseName: 'Athletic Chest-to-Floor Burpee', sets: 4, targetReps: '12-15', restSec: 45 },
          { exerciseId: 'ex-ab-wheel-rollout', exerciseName: 'Kneeling Ab Wheel Rollout', sets: 3, targetReps: '10', restSec: 45 }
        ]
      },
      {
        id: 'day-hm-2',
        dayNumber: 2,
        title: 'Day 2: Unilateral Leg Endurance & Mobility',
        description: 'Single-leg stability and hip opener.',
        targetFocus: 'Quads, Glutes & Calves',
        estimatedDurationMin: 35,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-bulgarian-split-squat', exerciseName: 'Bulgarian Split Squat', sets: 4, targetReps: '12 each', restSec: 60 },
          { exerciseId: 'ex-jump-rope-intervals', exerciseName: 'Speed Jump Rope Intervals', sets: 4, targetReps: '60s', restSec: 30 },
          { exerciseId: 'ex-pigeon-stretch', exerciseName: 'Deep Pigeon Hip Stretch', sets: 2, targetReps: '60s each', restSec: 30 }
        ]
      },
      {
        id: 'day-hm-3',
        dayNumber: 3,
        title: 'Day 3: Active Rest Day',
        description: 'Walk and mobility.',
        targetFocus: 'Rest',
        estimatedDurationMin: 0,
        isRestDay: true,
        exercises: []
      },
      {
        id: 'day-hm-4',
        dayNumber: 4,
        title: 'Day 4: Total Body Flow & Stamina',
        description: 'Burpee cadence and thoracic stretch.',
        targetFocus: 'Conditioning',
        estimatedDurationMin: 35,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-hiit-burpee', exerciseName: 'Athletic Chest-to-Floor Burpee', sets: 4, targetReps: '15', restSec: 45 },
          { exerciseId: 'ex-worlds-greatest-stretch', exerciseName: "The World's Greatest Stretch", sets: 3, targetReps: '8 each', restSec: 30 }
        ]
      }
    ]
  },

  // 6. Full Body Workout Program
  {
    id: 'prog-full-body-iron',
    slug: 'full-body-athletic-iron',
    title: 'Full Body Athletic Iron',
    description: 'An efficient 8-week 3-day weekly split hitting all major muscle groups with heavy compound exercises every session. Maximum muscle stimulation with 48 hours recovery between bouts.',
    durationWeeks: 8,
    daysPerWeek: 3,
    difficulty: 'intermediate',
    primaryGoal: 'Athletic Symmetry & Power',
    targetAudience: 'Lifters with busy schedules who want the highest return on their training time.',
    equipmentRequired: ['Barbell', 'Dumbbells', 'Pull-Up Bar'],
    progressionNotes: 'Cycle through A/B workouts; strive to add 1 repetition to each compound set every session.',
    isCustom: false,
    isPublished: true,
    enrolledCount: 1870,
    days: [
      {
        id: 'day-fb-1',
        dayNumber: 1,
        title: 'Day 1: Full Body Pattern A',
        description: 'Squat, bench, and row triumvirate.',
        targetFocus: 'Full Body',
        estimatedDurationMin: 55,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-back-squat', exerciseName: 'Barbell Back Squat', sets: 4, targetReps: '6-8', restSec: 120 },
          { exerciseId: 'ex-barbell-bench', exerciseName: 'Barbell Flat Bench Press', sets: 4, targetReps: '6-8', restSec: 120 },
          { exerciseId: 'ex-bent-over-barbell-row', exerciseName: 'Bent-Over Barbell Row', sets: 3, targetReps: '8', restSec: 90 },
          { exerciseId: 'ex-hanging-leg-raise', exerciseName: 'Hanging Leg Raise', sets: 3, targetReps: '12', restSec: 60 }
        ]
      },
      {
        id: 'day-fb-2',
        dayNumber: 2,
        title: 'Day 2: Recovery Day',
        description: 'Walking and rest.',
        targetFocus: 'Recovery',
        estimatedDurationMin: 0,
        isRestDay: true,
        exercises: []
      },
      {
        id: 'day-fb-3',
        dayNumber: 3,
        title: 'Day 3: Full Body Pattern B',
        description: 'Deadlift, overhead press, and pull-up triad.',
        targetFocus: 'Full Body',
        estimatedDurationMin: 55,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-deadlift', exerciseName: 'Conventional Barbell Deadlift', sets: 4, targetReps: '5', restSec: 150 },
          { exerciseId: 'ex-overhead-barbell-press', exerciseName: 'Standing Overhead Military Press', sets: 4, targetReps: '6-8', restSec: 120 },
          { exerciseId: 'ex-pullup', exerciseName: 'Strict Overhand Pull-Up', sets: 3, targetReps: '8', restSec: 90 },
          { exerciseId: 'ex-dumbbell-lateral-raise', exerciseName: 'Standing Dumbbell Lateral Raise', sets: 3, targetReps: '12', restSec: 45 }
        ]
      }
    ]
  },

  // 7. Advanced Training Program
  {
    id: 'prog-advanced-periodized',
    slug: 'advanced-periodized-beast',
    title: 'Advanced Periodized Beast Protocol',
    description: 'A demanding 12-week undulating periodization program integrating high neurological threshold training, explosive power cleans, and high-volume isolation finishes.',
    durationWeeks: 12,
    daysPerWeek: 5,
    difficulty: 'advanced',
    primaryGoal: 'Elite Strength & Athletic Hegemony',
    targetAudience: 'Advanced athletes with 2+ years of consistent heavy barbell and conditioning experience.',
    equipmentRequired: ['Olympic Barbell', 'Plates', 'Dumbbells', 'Cables', 'Racks'],
    progressionNotes: 'Follow wave loading: Week 1 70% 1RM, Week 2 77.5%, Week 3 85%, Week 4 Deload.',
    isCustom: false,
    isPublished: true,
    enrolledCount: 920,
    days: [
      {
        id: 'day-adv-1',
        dayNumber: 1,
        title: 'Day 1: Explosive Power & Horizontal Press',
        description: 'Clean & press followed by heavy bench press.',
        targetFocus: 'Power & Chest',
        estimatedDurationMin: 60,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-clean-and-press', exerciseName: 'Power Clean & Push Press', sets: 4, targetReps: '3', restSec: 150 },
          { exerciseId: 'ex-barbell-bench', exerciseName: 'Barbell Flat Bench Press', sets: 4, targetReps: '5', restSec: 150 },
          { exerciseId: 'ex-bent-over-barbell-row', exerciseName: 'Bent-Over Barbell Row', sets: 4, targetReps: '6', restSec: 90 },
          { exerciseId: 'ex-cable-crossover-fly', exerciseName: 'Standing Cable Fly Crossover', sets: 3, targetReps: '12', restSec: 60 }
        ]
      },
      {
        id: 'day-adv-2',
        dayNumber: 2,
        title: 'Day 2: Lower Body Max Force Production',
        description: 'Heavy back squat and Romanian deadlifts.',
        targetFocus: 'Quadriceps & Hamstrings',
        estimatedDurationMin: 65,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-back-squat', exerciseName: 'Barbell Back Squat', sets: 5, targetReps: '4', restSec: 180 },
          { exerciseId: 'ex-romanian-deadlift', exerciseName: 'Dumbbell Romanian Deadlift (RDL)', sets: 4, targetReps: '8', restSec: 120 },
          { exerciseId: 'ex-bulgarian-split-squat', exerciseName: 'Bulgarian Split Squat', sets: 3, targetReps: '8 each', restSec: 90 },
          { exerciseId: 'ex-hanging-leg-raise', exerciseName: 'Hanging Leg Raise', sets: 3, targetReps: '15', restSec: 60 }
        ]
      },
      {
        id: 'day-adv-3',
        dayNumber: 3,
        title: 'Day 3: Mid-Week Active Recovery',
        description: 'Joint decompressions and mobility.',
        targetFocus: 'Recovery',
        estimatedDurationMin: 0,
        isRestDay: true,
        exercises: []
      },
      {
        id: 'day-adv-4',
        dayNumber: 4,
        title: 'Day 4: Overhead Strength & Vertical Pulling',
        description: 'Military press and weighted pull-ups.',
        targetFocus: 'Shoulders & Latissimus',
        estimatedDurationMin: 60,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-overhead-barbell-press', exerciseName: 'Standing Overhead Military Press', sets: 4, targetReps: '5', restSec: 150 },
          { exerciseId: 'ex-pullup', exerciseName: 'Strict Overhand Pull-Up', sets: 4, targetReps: '6-8', restSec: 120 },
          { exerciseId: 'ex-dumbbell-lateral-raise', exerciseName: 'Standing Dumbbell Lateral Raise', sets: 4, targetReps: '15', restSec: 45 },
          { exerciseId: 'ex-incline-dumbbell-curl', exerciseName: 'Incline Bench Dumbbell Curl', sets: 3, targetReps: '10', restSec: 60 },
          { exerciseId: 'ex-overhead-cable-triceps', exerciseName: 'Overhead Cable Triceps Extension', sets: 3, targetReps: '12', restSec: 60 }
        ]
      },
      {
        id: 'day-adv-5',
        dayNumber: 5,
        title: 'Day 5: Deadlift Peak & Metabolic Finisher',
        description: 'Heavy conventional deadlift and Tabata sprint finish.',
        targetFocus: 'Posterior Chain & Conditioning',
        estimatedDurationMin: 60,
        isRestDay: false,
        exercises: [
          { exerciseId: 'ex-barbell-deadlift', exerciseName: 'Conventional Barbell Deadlift', sets: 5, targetReps: '3', restSec: 180 },
          { exerciseId: 'ex-ab-wheel-rollout', exerciseName: 'Kneeling Ab Wheel Rollout', sets: 3, targetReps: '10', restSec: 60 },
          { exerciseId: 'ex-hiit-burpee', exerciseName: 'Athletic Chest-to-Floor Burpee', sets: 4, targetReps: '15', restSec: 45 },
          { exerciseId: 'ex-jump-rope-intervals', exerciseName: 'Speed Jump Rope Intervals', sets: 4, targetReps: '60s', restSec: 30 }
        ]
      }
    ]
  }
];
