import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GooeyMenu } from './components/navigation/gooey/GooeyMenu';
import { MobileNav } from './components/layout/MobileNav';
import { MobileMoreSheet } from './components/layout/MobileMoreSheet';
import { BMICalculatorModal } from './components/nutrition/BMICalculatorModal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { HunterRankDashboard } from './components/hunter/HunterRankDashboard';
import { TrainingManualView } from './components/manual/TrainingManualView';
import { ExerciseLibraryView } from './components/exercises/ExerciseLibraryView';
import { ProgramsView } from './components/programs/ProgramsView';
import { ProgressView } from './components/progress/ProgressView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { ChallengesView } from './components/challenges/ChallengesView';
import { NutritionDashboard } from './components/nutrition/NutritionDashboard';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WorkoutsHubView } from './components/workouts/WorkoutsHubView';
import { TimerView } from './components/timer/TimerView';
import { FloatingMiniTimer } from './components/timer/FloatingMiniTimer';
import { ActiveWorkoutHUD } from './components/workout/ActiveWorkoutHUD';
import { WorkoutSummaryModal } from './components/workout/WorkoutSummaryModal';
import { ExerciseDetailModal } from './components/exercises/ExerciseDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { Exercise, WorkoutDayPlan } from './types';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';
import { mobileService } from './services/mobileService';
import { BrandProvider, useBrand } from './context/BrandContext';

const MainApp: React.FC = () => {
  const { profile, isOnboarded } = useAuth();
  const { currentTheme } = useBrand();
  const { 
    isWorkoutActive, 
    startWorkoutFromDay, 
    startQuickExercise, 
    completedWorkoutSummary, 
    dismissSummaryModal 
  } = useWorkout();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isWorkoutHUDOpen, setIsWorkoutHUDOpen] = useState<boolean>(false);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState<boolean>(false);
  const [isBMIModalOpen, setIsBMIModalOpen] = useState<boolean>(false);

  // Background recurring 3-hour reminder scheduler
  useEffect(() => {
    notificationService.startReminderScheduler();
    return () => notificationService.stopReminderScheduler();
  }, []);

  // Native Mobile runtime initialization (Status bar, splash screen, keyboard, network)
  useEffect(() => {
    mobileService.initialize();
  }, []);

  // Synchronize native Status Bar color with active theme
  useEffect(() => {
    mobileService.setStatusBarColor(currentTheme.accentColor);
  }, [currentTheme]);

  // If user is not yet onboarded, display the 5-step wizard
  if (!isOnboarded) {
    return <OnboardingWizard onComplete={() => setCurrentTab('dashboard')} />;
  }

  // Handle Starting Today's Workout from Sidebar or Dashboard
  const handleStartTodayWorkout = () => {
    if (isWorkoutActive) {
      setIsWorkoutHUDOpen(true);
      return;
    }
    const enrolledProgId = storageService.getEnrolledProgramId();
    const programs = storageService.getPrograms();
    const activeProgram = programs.find(p => p.id === enrolledProgId) || programs[0];
    const todayDay = activeProgram.days[0];
    startWorkoutFromDay(todayDay, activeProgram.title);
    setIsWorkoutHUDOpen(true);
  };

  const handleStartDayWorkout = (dayPlan: WorkoutDayPlan, programTitle: string) => {
    startWorkoutFromDay(dayPlan, programTitle);
    setIsWorkoutHUDOpen(true);
  };

  const handleStartQuickExercise = (exercise: Exercise) => {
    startQuickExercise(exercise);
    setIsWorkoutHUDOpen(true);
  };

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard': return 'Athlete Command Center';
      case 'rank': return 'Hunter Rank & Apex Ascension';
      case 'manual': return 'Training Manual';
      case 'exercises': return 'Exercise Library';
      case 'programs': return 'Periodized Workout Plans';
      case 'workouts': return 'Workouts & Exercise Library';
      case 'timer': return 'Fitness Timers & Chronometer';
      case 'progress': return 'Progression & Biometric Telemetry';
      case 'achievements': return 'Honors & Badges';
      case 'profile': return 'Athlete Profile & Settings';
      case 'admin': return 'Secure Admin Portal';
      default: return currentTheme.name;
    }
  };

  return (
    <div className="min-h-screen bg-[#090B10] text-gray-100 flex flex-col lg:flex-row antialiased font-sans relative">
      {/* Desktop Sidebar Navigation (Collapsible with Hover Tooltips) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onStartTodayWorkout={handleStartTodayWorkout}
      />

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Streamlined Executive Header (Replaces cluttered ribbon bar) */}
        <Header
          title={getPageTitle(currentTab)}
          onOpenActiveWorkout={() => {
            if (isWorkoutActive) {
              setIsWorkoutHUDOpen(true);
            } else {
              handleStartTodayWorkout();
            }
          }}
          onNavigateTab={(tab) => setCurrentTab(tab)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full pb-36 lg:pb-32">
          {currentTab === 'dashboard' && (
            <UserDashboard
              onStartWorkout={handleStartTodayWorkout}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSelectExercise={(ex) => setSelectedExerciseForModal(ex)}
            />
          )}

          {currentTab === 'rank' && (
            <HunterRankDashboard
              onStartTodayWorkout={handleStartTodayWorkout}
            />
          )}

          {currentTab === 'challenges' && (
            <ChallengesView />
          )}

          {currentTab === 'nutrition' && (
            <NutritionDashboard />
          )}

          {currentTab === 'manual' && (
            <TrainingManualView />
          )}

          {currentTab === 'workouts' && (
            <WorkoutsHubView
              onStartDayWorkout={handleStartDayWorkout}
              onStartExercise={(ex) => handleStartQuickExercise(ex)}
            />
          )}

          {currentTab === 'exercises' && (
            <ExerciseLibraryView
              onStartExercise={(ex) => handleStartQuickExercise(ex)}
            />
          )}

          {currentTab === 'programs' && (
            <ProgramsView
              onStartDayWorkout={handleStartDayWorkout}
            />
          )}

          {currentTab === 'timer' && (
            <TimerView />
          )}

          {currentTab === 'progress' && (
            <ProgressView />
          )}

          {currentTab === 'achievements' && (
            <AchievementsView />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              onSelectExercise={(ex) => setSelectedExerciseForModal(ex)}
              onSelectChapter={(chapId) => {
                setCurrentTab('manual');
              }}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboard />
          )}
        </main>
      </div>

      {/* Interactive Liquid Gooey Menu (All 14 Destinations with Spring Physics) */}
      <GooeyMenu
        currentTab={currentTab}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onOpenBMICalculator={() => setIsBMIModalOpen(true)}
        onOpenActiveWorkout={handleStartTodayWorkout}
      />

      {/* Mobile Bottom Navigation Bar (5 Primary Tabs: Home, Workouts, Missions, Progress, More) */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenActiveWorkout={() => {
          if (isWorkoutActive) {
            setIsWorkoutHUDOpen(true);
          } else {
            handleStartTodayWorkout();
          }
        }}
        onOpenMore={() => setIsMobileMoreOpen(true)}
      />

      {/* Mobile "More" Full Screen Sheet / Drawer */}
      <MobileMoreSheet
        isOpen={isMobileMoreOpen}
        onClose={() => setIsMobileMoreOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onOpenBMICalculator={() => setIsBMIModalOpen(true)}
        onOpenActiveWorkout={handleStartTodayWorkout}
      />

      {/* Interactive Global BMI Calculator Modal */}
      <BMICalculatorModal
        isOpen={isBMIModalOpen}
        onClose={() => setIsBMIModalOpen(false)}
        onSaved={() => {}}
      />

      {/* Floating Mini-Timer HUD (Active when timer/interval/rest is running and navigating) */}
      <FloatingMiniTimer
        onOpenTimer={() => setCurrentTab('timer')}
        onOpenWorkout={() => setIsWorkoutHUDOpen(true)}
        currentTab={currentTab}
      />

      {/* Live Full-Screen Active Workout HUD */}
      {isWorkoutActive && isWorkoutHUDOpen && (
        <ActiveWorkoutHUD
          onMinimize={() => setIsWorkoutHUDOpen(false)}
        />
      )}

      {/* Post-Workout Victory Summary Modal */}
      <WorkoutSummaryModal
        summary={completedWorkoutSummary}
        onClose={dismissSummaryModal}
      />

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        onStartExercise={handleStartQuickExercise}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrandProvider>
      <AuthProvider>
        <WorkoutProvider>
          <MainApp />
        </WorkoutProvider>
      </AuthProvider>
    </BrandProvider>
  );
};

export default App;
