# KINETIX — Elite Fitness Training Architecture
> *Inspired by the comprehensive athletic experience of ARISE with an original, luxury fitness studio aesthetic and cross-platform architecture.*

---

## ⚡ Overview

**KINETIX** is a full-stack, production-ready fitness training ecosystem designed for serious athletes, coaches, and fitness enthusiasts. Built from the ground up to operate seamlessly across **Web, Android, iOS, Windows PC, and macOS**, KINETIX combines clinical biomechanical instruction, structured periodized training plans, interactive live workout telemetry, and deep athletic knowledge.

---

## 💎 Design & Aesthetic Direction

- **Theme**: Luxury Dark Studio Aesthetic (Obsidian Deep `#090B10`, Stealth Charcoal `#141923`, Brushed Steel `#252D3E`).
- **Accents**: High-voltage **Electric Lime Green** (`#00F050`) and **Flame Neon Orange** (`#FF5E1E`).
- **Typography**: Precision Modern Display (`Cabinet Grotesk` & `Inter`) paired with clean tabular numerals (`JetBrains Mono`).
- **Animations**: Subtle glassmorphism, dynamic SVG biomechanical illustrations showing muscle activation in real time, and celebratory workout completion confetti.

---

## 🚀 Key Modules & Capabilities

### 1. 📖 Comprehensive Training Manual (7 Core Chapters)
- **Chapter 1: Getting Started** — Fitness fundamentals, the biological law of progressive overload, and setting measurable goals.
- **Chapter 2: Warm-up and Mobility** — Synovial fluid release, dynamic stretches vs. static risks, and R.A.M.P. protocols.
- **Chapter 3: Strength Training** — Push/pull biomechanics, squat & hip hinge patterns, arm isolation, and anti-extension core bracing.
- **Chapter 4: Bodyweight & Calisthenics** — Perfect push-up ladder, dead-hang pull-ups, Bulgarian split squats, and hollow body holds.
- **Chapter 5: Cardio & Metabolic Conditioning** — Zone 2 aerobic base building, Tabata HIIT, and speed jump rope cadence.
- **Chapter 6: Recovery, Sleep & Flexibility** — Parasympathetic downregulation, Stage 3/4 NREM sleep architecture, foam rolling, and planned deload cycles.
- **Chapter 7: Nutrition & Fueling** — Energy balance thermodynamics, protein synthesis thresholds, electrolyte hydration, and peri-workout nutrient timing.
- *Features*: Live reading progress bar, chapter bookmarks, searchable curriculum, and key coaching takeaways.

### 2. 🏋️ Precision Biomechanical Exercise Library
- **11 Categories**: Chest, Back, Shoulders, Biceps, Triceps, Legs, Abs, Full Body, Cardio, Stretching, Mobility.
- **Over 35+ Fully Illustrated Movements**: Dynamic SVG vector movement animations showing active primary and secondary muscle activation.
- **Full Form Analysis**: Starting position, step-by-step execution cues, breathing technique, recommended sets & reps, rest durations, common errors, and joint safety warnings.
- **Multi-Filter Engine**: Filter by search query, category, difficulty (Beginner, Intermediate, Advanced), and equipment.

### 3. ⏱️ Live Workout Execution Engine (Distraction-Free HUD)
- Full-screen interactive workout mode with live stopwatch.
- Current exercise illustration and form cues.
- Set-by-set tracker: Log target weight, completed reps, and RPE.
- Integrated **Rest Interval Timer** with +15s/+30s controls, auto-advance, and Web Audio API countdown ticks and completion chimes.
- Auto-persistence: Workout session state is preserved across reloads and device switches.
- Post-workout celebration summary with total volume tonnage calculation, sets completed, and session rating.

### 4. 📅 Periodized Workout Programs & Custom Plan Builder
- 7 Predefined Programs:
  1. *Beginner Fitness Foundation (4 Weeks, 3 Days/Wk)*
  2. *Hypertrophy Matrix: Muscle Building (8 Weeks, 5 Days/Wk)*
  3. *Metabolic Lean & Calorie Burner (6 Weeks, 4 Days/Wk)*
  4. *Absolute Strength: The 5x5 System (10 Weeks, 4 Days/Wk)*
  5. *Zero-Equipment Calisthenics Mastery (6 Weeks, 4 Days/Wk)*
  6. *Full Body Athletic Iron (8 Weeks, 3 Days/Wk)*
  7. *Advanced Periodized Beast Protocol (12 Weeks, 5 Days/Wk)*
- **Custom Plan Builder**: Create and configure custom weekly microcycles with targeted exercises, sets, reps, and rest periods.

### 5. 📈 Progress Telemetry & Biometrics
- **Recharts Data Visualizations**: Body weight progression curve and training volume (tonnage) history.
- **Personal Records (PR) Hall of Fame**: 1RM tracking for Squat, Bench, Deadlift, Overhead Press, and max pull-ups.
- **Body Anthropometry Logger**: Track chest, waist, hips, arms, thighs, and body fat percentage.
- **Data Export**: Export workout history to CSV spreadsheets and raw JSON data anytime.

### 6. 🏆 Honors & Milestone Badges
- 12 unlockable achievements (First Blood, Momentum Spark, Iron Discipline, 10,000 kg Club, Tactical Scholar, etc.).
- Real-time progress trackers towards thresholds.

### 7. 🛡️ Secure Admin Portal
- Platform analytics (Total users, active workouts, completed sessions, library volume).
- Exercise library management (create new movements, edit descriptions, toggle publish status).
- Program editor and chapter governance.
- Global system announcement broadcaster.
- User directory monitoring with role-based access control.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19 + TypeScript (Vite 8) |
| **Styling & Theme** | Tailwind CSS with custom glassmorphism and glowing accents |
| **Icons & Typography** | Lucide React, Cabinet Grotesk, Inter, JetBrains Mono |
| **Animations & Celebration** | Framer Motion & Canvas-Confetti |
| **Analytics Charts** | Recharts |
| **Audio Synthesis** | Web Audio API (zero external audio dependencies, works 100% offline) |
| **Cross-Platform Mobile** | Capacitor (Android & iOS native support) |
| **Desktop Packaging** | Electron / Tauri compatible architecture |
| **Database & Backend** | Supabase (PostgreSQL with RLS policies) + Offline-first Local Storage |

---

## 📂 Project Structure

```
ARISE/
├── public/
│   └── manifest.json             # PWA Web Manifest
├── electron/
│   └── main.cjs                  # Electron desktop launcher
├── supabase/
│   └── migrations/
│       └── 20261119_initial_schema.sql # 20 PostgreSQL tables with RLS & indexes
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── achievements/
│   │   │   └── AchievementsView.tsx
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx
│   │   ├── auth/
│   │   │   ├── AuthModal.tsx
│   │   │   └── OnboardingWizard.tsx
│   │   ├── common/
│   │   │   └── ExerciseAnimation.tsx
│   │   ├── dashboard/
│   │   │   └── UserDashboard.tsx
│   │   ├── exercises/
│   │   │   ├── ExerciseDetailModal.tsx
│   │   │   └── ExerciseLibraryView.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── manual/
│   │   │   └── TrainingManualView.tsx
│   │   ├── profile/
│   │   │   └── ProfileView.tsx
│   │   ├── programs/
│   │   │   └── ProgramsView.tsx
│   │   ├── progress/
│   │   │   └── ProgressView.tsx
│   │   └── workout/
│   │       ├── ActiveWorkoutHUD.tsx
│   │       └── WorkoutSummaryModal.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── WorkoutContext.tsx
│   ├── data/
│   │   ├── initialAchievements.ts
│   │   ├── initialExercises.ts
│   │   ├── initialManual.ts
│   │   └── initialPrograms.ts
│   ├── services/
│   │   ├── audioService.ts
│   │   ├── storageService.ts
│   │   └── supabase.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── capacitor.config.ts           # Capacitor cross-platform mobile config
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🌐 Platform Deployment Guide

### 1. Web Browser & PWA
```bash
# Run local development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

### 2. Android Smartphone & Tablet (Capacitor)
```bash
# Build the web bundle
npm run build

# Add Android native platform (first time only)
npx cap add android

# Sync web assets to Android Studio project
npm run cap:sync

# Open in Android Studio to build APK or run on emulator
npm run cap:open:android
```

### 3. iOS iPhone & iPad (Capacitor)
```bash
# Build the web bundle
npm run build

# Add iOS native platform (macOS with Xcode required)
npx cap add ios

# Sync web assets to Xcode project
npm run cap:sync

# Open in Xcode to run on iOS Simulator or deploy to device
npm run cap:open:ios
```

### 4. Windows PC & macOS Desktop (Electron)
```bash
# Build the production bundle
npm run build

# Launch desktop window via Electron
npx electron electron/main.cjs
```

---

## 🗄️ Database & Supabase Configuration

KINETIX includes an enterprise-grade PostgreSQL database migration script at:
`supabase/migrations/20261119_initial_schema.sql`

It provisions:
1. `users` & `user_profiles` (with RLS for secure profile isolation)
2. `admin_roles` (role-based access control)
3. `fitness_goals` & `exercise_categories`
4. `exercises` & `exercise_media`
5. `training_manuals` & `manual_chapters`
6. `workout_programs`, `workout_days`, and `workout_exercises`
7. `workout_sessions` & `workout_sets` (granular set logging)
8. `exercise_records` (PRs) & `body_measurements`
9. `bookmarks`, `notifications`, `achievements`, and `user_achievements`

### Connecting to Supabase
Copy `.env.example` to `.env` and fill in your Supabase project keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
If these credentials are not provided, KINETIX automatically runs in resilient **Local-First Offline Mode**, storing all athlete records, exercises, programs, and manual chapters in local storage with instant synchronization capability!
