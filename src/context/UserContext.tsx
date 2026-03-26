import React, { createContext, useContext, useState, useEffect } from 'react';

export type VacationType = 'kota' | 'alam' | 'pantai' | 'gunung';
export type VacationStyle = 'backpacker' | 'keluarga' | 'luxury';
export type UserGoal = 'hemat' | 'balance' | 'healing' | 'luxury';

export interface UserProfile {
  name: string;
  email?: string;
  photo?: string;
  vacationType?: VacationType;
  vacationStyle?: VacationStyle;
  userGoal?: UserGoal;
}

export type AuthState = 'loading' | 'unauthenticated' | 'onboarding' | 'authenticated';

interface UserContextType {
  authState: AuthState;
  user: UserProfile | null;
  login: (name: string) => void;
  logout: () => void;
  savePreferences: (prefs: Partial<UserProfile>) => void;
  completeOnboarding: (prefs: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = '@kapanlibur_user';
const PREFS_KEY = '@kapanlibur_preferences';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    const savedPrefs = localStorage.getItem(PREFS_KEY);

    if (savedUser) {
      const parsed: UserProfile = JSON.parse(savedUser);
      const prefs = savedPrefs ? JSON.parse(savedPrefs) : {};
      const merged = { ...parsed, ...prefs };
      setUser(merged);
      if (!merged.vacationType) {
        setAuthState('onboarding');
      } else {
        setAuthState('authenticated');
      }
    } else {
      setAuthState('unauthenticated');
    }
  }, []);

  function login(name: string) {
    const profile: UserProfile = { name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    setAuthState('onboarding');
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PREFS_KEY);
    setUser(null);
    setAuthState('unauthenticated');
  }

  function savePreferences(prefs: Partial<UserProfile>) {
    const existing = localStorage.getItem(PREFS_KEY);
    const current = existing ? JSON.parse(existing) : {};
    const updated = { ...current, ...prefs };
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    setUser(prev => prev ? { ...prev, ...updated } : null);
  }

  function completeOnboarding(prefs: Partial<UserProfile>) {
    savePreferences(prefs);
    setAuthState('authenticated');
  }

  return (
    <UserContext.Provider value={{ authState, user, login, logout, savePreferences, completeOnboarding }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
