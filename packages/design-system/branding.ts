export type BrandThemeId = 'normal' | 'easy' | 'hard' | 'hell' | 'ascend' | 'kinetix' | 'titan';
export type VisualExperienceMode = 'hunter' | 'pro';
export type DifficultyMode = 'normal' | 'easy' | 'hard';
export type ThemeColor = 'purple' | 'blue' | 'red';

export interface BrandConfig {
  id: BrandThemeId;
  name: 'NORMAL MODE' | 'EASY MODE' | 'HARD MODE' | string;
  colorName: 'Purple' | 'Blue' | 'Red' | string;
  themeColor: ThemeColor;
  tagline: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyMode: DifficultyMode;
  accentColor: string;
  secondaryAccent: string;
  glowColor: string;
  badgeClass: string;
  darkBg: string;
  cardBg: string;
  borderColor: string;
  missionTargetMultiplier: number;
  xpMultiplier: number;
  restIntervalMultiplier: number;
}

// ----------------------------------------------------------------------------
// 1. NORMAL MODE — PURPLE THEME (Default Experience)
// ----------------------------------------------------------------------------
export const NORMAL_MODE_CONFIG: BrandConfig = {
  id: 'normal',
  name: 'NORMAL MODE',
  colorName: 'Purple',
  themeColor: 'purple',
  tagline: 'Balanced Workout Intensity & Standard Protocol',
  description: 'Balanced training for consistent progression.',
  difficulty: 'Intermediate',
  difficultyMode: 'normal',
  accentColor: '#A855F7', // Electric Violet
  secondaryAccent: '#C4B5FD', // Subtle Lavender Highlight
  glowColor: 'rgba(168, 85, 247, 0.45)',
  badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
  darkBg: '#0A0713',
  cardBg: '#120D22',
  borderColor: '#25183E',
  missionTargetMultiplier: 1.0,
  xpMultiplier: 1.0,
  restIntervalMultiplier: 1.0,
};

// ----------------------------------------------------------------------------
// 2. EASY MODE — BLUE THEME
// ----------------------------------------------------------------------------
export const EASY_MODE_CONFIG: BrandConfig = {
  id: 'easy',
  name: 'EASY MODE',
  colorName: 'Blue',
  themeColor: 'blue',
  tagline: 'Beginner-Friendly Progression & Gentle Directives',
  description: 'Comfortable training for beginners and gradual improvement.',
  difficulty: 'Beginner',
  difficultyMode: 'easy',
  accentColor: '#3B82F6', // Electric Sky Blue
  secondaryAccent: '#06B6D4', // Cyan Highlight
  glowColor: 'rgba(59, 130, 246, 0.45)',
  badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  darkBg: '#060B14',
  cardBg: '#0B1424',
  borderColor: '#16284D',
  missionTargetMultiplier: 0.75,
  xpMultiplier: 1.0,
  restIntervalMultiplier: 1.2,
};

// ----------------------------------------------------------------------------
// 3. HARD MODE — RED THEME
// ----------------------------------------------------------------------------
export const HARD_MODE_CONFIG: BrandConfig = {
  id: 'hard',
  name: 'HARD MODE',
  colorName: 'Red',
  themeColor: 'red',
  tagline: 'Advanced Challenges & Relentless Iron Intensity',
  description: 'Challenging training for experienced users seeking advanced progression.',
  difficulty: 'Advanced',
  difficultyMode: 'hard',
  accentColor: '#EF4444', // Crimson Red
  secondaryAccent: '#F87171', // Bright Red Highlight
  glowColor: 'rgba(239, 68, 68, 0.55)',
  badgeClass: 'bg-red-500/15 text-red-400 border-red-500/40',
  darkBg: '#0B0405',
  cardBg: '#16080A',
  borderColor: '#2F1014',
  missionTargetMultiplier: 1.4,
  xpMultiplier: 1.3,
  restIntervalMultiplier: 0.85,
};

export const BRAND_THEMES: Record<string, BrandConfig> = {
  normal: NORMAL_MODE_CONFIG,
  easy: EASY_MODE_CONFIG,
  hard: HARD_MODE_CONFIG,
  // Seamless backward-compatibility aliases
  hell: { ...HARD_MODE_CONFIG, id: 'hell' },
  titan: { ...HARD_MODE_CONFIG, id: 'titan' },
  ascend: { ...EASY_MODE_CONFIG, id: 'ascend' },
  kinetix: { ...NORMAL_MODE_CONFIG, id: 'kinetix' },
};

export const SELECTABLE_MODES: BrandConfig[] = [
  NORMAL_MODE_CONFIG,
  EASY_MODE_CONFIG,
  HARD_MODE_CONFIG,
];
