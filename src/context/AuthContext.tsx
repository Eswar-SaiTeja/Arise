import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';

interface AuthContextType {
  profile: UserProfile;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isAdmin: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, fullName: string) => Promise<void>;
  loginDemo: (role?: 'athlete' | 'admin') => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    audioService.setSoundEnabled(profile.soundEnabled);
  }, [profile.soundEnabled]);

  const login = async (email: string) => {
    const updated = { ...profile, email };
    storageService.saveProfile(updated);
    setProfile(updated);
    setIsAuthenticated(true);
  };

  const signup = async (email: string, fullName: string) => {
    const newProfile: UserProfile = {
      ...profile,
      email,
      fullName,
      isOnboarded: false,
    };
    storageService.saveProfile(newProfile);
    setProfile(newProfile);
    setIsAuthenticated(true);
  };

  const loginDemo = (role: 'athlete' | 'admin' = 'athlete') => {
    const demo = storageService.getProfile();
    demo.isAdmin = role === 'admin';
    demo.fullName = role === 'admin' ? 'Coach Victor Sterling' : 'Marcus Vance';
    demo.email = role === 'admin' ? 'admin@training.fit' : 'athlete@training.fit';
    storageService.saveProfile(demo);
    setProfile({ ...demo });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    storageService.saveProfile(updated);
    setProfile(updated);
    if (updates.soundEnabled !== undefined) {
      audioService.setSoundEnabled(updates.soundEnabled);
    }
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...profile,
      ...data,
      isOnboarded: true,
    };
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAuthenticated,
        isOnboarded: profile.isOnboarded,
        isAdmin: profile.isAdmin,
        login,
        signup,
        loginDemo,
        logout,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
