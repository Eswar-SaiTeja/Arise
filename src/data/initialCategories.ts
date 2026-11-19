import { WorkoutCategory } from '../types/workoutLibrary';

export const INITIAL_CATEGORIES: WorkoutCategory[] = [
  {
    id: 'cat-chest',
    name: 'Chest',
    slug: 'chest',
    description: 'Pectoralis major, minor, and anterior thoracic pressing mechanics.',
    isActive: true,
    displayOrder: 1,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-back',
    name: 'Back',
    slug: 'back',
    description: 'Latissimus dorsi, rhomboids, trapezius, and posterior spinal erectors.',
    isActive: true,
    displayOrder: 2,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-shoulders',
    name: 'Shoulders',
    slug: 'shoulders',
    description: 'Anterior, lateral, and posterior deltoid force production and overhead stabilization.',
    isActive: true,
    displayOrder: 3,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-biceps',
    name: 'Biceps',
    slug: 'biceps',
    description: 'Biceps brachii (long and short heads), brachialis, and elbow flexors.',
    isActive: true,
    displayOrder: 4,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-triceps',
    name: 'Triceps',
    slug: 'triceps',
    description: 'Triceps brachii (lateral, long, medial heads) and elbow extension lockout.',
    isActive: true,
    displayOrder: 5,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-legs',
    name: 'Legs',
    slug: 'legs',
    description: 'Quadriceps, hamstrings, adductors, abductors, and calves.',
    isActive: true,
    displayOrder: 6,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-glutes',
    name: 'Glutes',
    slug: 'glutes',
    description: 'Gluteus maximus, medius, and minimus hip extension and stabilization.',
    isActive: true,
    displayOrder: 7,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-abs-core',
    name: 'Abs and Core',
    slug: 'abs-core',
    description: 'Rectus abdominis, transverse abdominis, obliques, and pelvic floor anti-rotation.',
    isActive: true,
    displayOrder: 8,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-cardio',
    name: 'Cardio',
    slug: 'cardio',
    description: 'Aerobic energy systems, VO2 max endurance, and high-intensity interval conditioning.',
    isActive: true,
    displayOrder: 9,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-full-body',
    name: 'Full Body',
    slug: 'full-body',
    description: 'Compound kinetic chains engaging multiple joint complexes simultaneously.',
    isActive: true,
    displayOrder: 10,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-calisthenics',
    name: 'Calisthenics',
    slug: 'calisthenics',
    description: 'Bodyweight relative strength, gymnastic leverage, bars, and floor acrobatics.',
    isActive: true,
    displayOrder: 11,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-mobility',
    name: 'Mobility',
    slug: 'mobility',
    description: 'Active range of motion, articular joint capsules, and dynamic movement control.',
    isActive: true,
    displayOrder: 12,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-yoga',
    name: 'Yoga',
    slug: 'yoga',
    description: 'Isometric poses, breath control, balance, and mind-body kinetic integration.',
    isActive: true,
    displayOrder: 13,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-stretching',
    name: 'Stretching',
    slug: 'stretching',
    description: 'Static and PNF muscle lengthening protocols for flexibility and parasympathetic recovery.',
    isActive: true,
    displayOrder: 14,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-functional',
    name: 'Functional Training',
    slug: 'functional-training',
    description: 'Multi-planar real-world athletic movement, rotational power, and loaded carries.',
    isActive: true,
    displayOrder: 15,
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'cat-rehab-mobility',
    name: 'Rehabilitation-Oriented Mobility',
    slug: 'rehabilitation-mobility',
    description: 'Low-impact corrective exercise and joint recovery designed with clinical safety parameters.',
    isActive: true,
    displayOrder: 16,
    createdAt: '2026-10-01T00:00:00Z'
  }
];
