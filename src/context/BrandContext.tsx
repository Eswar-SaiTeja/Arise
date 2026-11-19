import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BrandThemeId, 
  VisualExperienceMode, 
  BrandConfig, 
  DifficultyMode,
  ThemeColor,
  BRAND_THEMES,
  SELECTABLE_MODES
} from '../../packages/design-system/branding';
import { storageService } from '../services/storageService';

interface BrandContextType {
  currentTheme: BrandConfig;
  themeId: BrandThemeId;
  experienceMode: VisualExperienceMode;
  difficultyMode: DifficultyMode;
  themePreference: ThemeColor;
  selectableModes: BrandConfig[];
  setThemeId: (id: BrandThemeId) => void;
  setExperienceMode: (mode: VisualExperienceMode) => void;
  setDifficultyMode: (mode: DifficultyMode) => void;
  setThemePreference: (color: ThemeColor) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const STORAGE_KEY_THEME = 'ascend_brand_theme';
const STORAGE_KEY_MODE = 'ascend_experience_mode';
const STORAGE_KEY_DIFF = 'ascend_difficulty_mode';
const STORAGE_KEY_COLOR = 'ascend_theme_preference';

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize Theme ID (defaults to 'normal' - Purple)
  const [themeId, setThemeIdState] = useState<BrandThemeId>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME) as BrandThemeId;
      if (stored && BRAND_THEMES[stored]) return stored;
    } catch {}
    return 'normal';
  });

  // 2. Initialize Visual Experience Mode ('hunter' | 'pro')
  const [experienceMode, setExperienceModeState] = useState<VisualExperienceMode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY_MODE) as VisualExperienceMode) || 'hunter';
    } catch {
      return 'hunter';
    }
  });

  // 3. Initialize Training Difficulty ('normal' | 'easy' | 'hard')
  const [difficultyMode, setDifficultyModeState] = useState<DifficultyMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DIFF) as DifficultyMode;
      if (stored && ['normal', 'easy', 'hard'].includes(stored)) return stored;
    } catch {}
    return 'normal';
  });

  // 4. Initialize Theme Preference Color ('purple' | 'blue' | 'red')
  const [themePreference, setThemePreferenceState] = useState<ThemeColor>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COLOR) as ThemeColor;
      if (stored && ['purple', 'blue', 'red'].includes(stored)) return stored;
    } catch {}
    return 'purple';
  });

  // Active theme configuration object
  const currentTheme: BrandConfig = BRAND_THEMES[themeId] || BRAND_THEMES.normal;

  // Change theme ID and sync CSS variables & persistent storage
  const setThemeId = (id: BrandThemeId) => {
    const canonicalId = (id === 'hell' || id === 'titan') ? 'hard' : (id === 'ascend') ? 'easy' : (id === 'kinetix') ? 'normal' : id;
    setThemeIdState(canonicalId);
    
    // Set matching difficulty mode & theme color preference
    const matched = BRAND_THEMES[canonicalId] || BRAND_THEMES.normal;
    setDifficultyModeState(matched.difficultyMode);
    setThemePreferenceState(matched.themeColor);

    try {
      localStorage.setItem(STORAGE_KEY_THEME, canonicalId);
      localStorage.setItem(STORAGE_KEY_DIFF, matched.difficultyMode);
      localStorage.setItem(STORAGE_KEY_COLOR, matched.themeColor);

      // Sync into user profile via storageService
      const profile = storageService.getProfile();
      storageService.saveProfile({
        ...profile,
        selected_difficulty_mode: matched.difficultyMode,
        theme_preference: matched.themeColor,
        updated_at: new Date().toISOString(),
      });
    } catch {}
  };

  const setDifficultyMode = (mode: DifficultyMode) => {
    setDifficultyModeState(mode);
    setThemeId(mode);
  };

  const setThemePreference = (color: ThemeColor) => {
    setThemePreferenceState(color);
    if (color === 'purple') setThemeId('normal');
    else if (color === 'blue') setThemeId('easy');
    else if (color === 'red') setThemeId('hard');
  };

  const setExperienceMode = (mode: VisualExperienceMode) => {
    setExperienceModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY_MODE, mode);
    } catch {}
  };

  // Synchronize CSS Variables, HTML data attributes, and Document Title
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply centralized CSS variables
    root.style.setProperty('--color-accent', currentTheme.accentColor);
    root.style.setProperty('--color-secondary-accent', currentTheme.secondaryAccent);
    root.style.setProperty('--color-glow', currentTheme.glowColor);
    root.style.setProperty('--color-dark-bg', currentTheme.darkBg);
    root.style.setProperty('--color-card-bg', currentTheme.cardBg);
    root.style.setProperty('--color-border', currentTheme.borderColor);

    // Apply data-theme attribute on <html> element
    root.setAttribute('data-theme', currentTheme.themeColor);
    root.setAttribute('data-difficulty', currentTheme.difficultyMode);

    // Dynamic document title
    document.title = `${currentTheme.name} — Elite Fitness Training Architecture`;
  }, [currentTheme]);

  return (
    <BrandContext.Provider
      value={{
        currentTheme,
        themeId,
        experienceMode,
        difficultyMode,
        themePreference,
        selectableModes: SELECTABLE_MODES,
        setThemeId,
        setExperienceMode,
        setDifficultyMode,
        setThemePreference,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
