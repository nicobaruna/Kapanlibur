import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  loadStoredUser,
  savePreferences,
  signOut as authSignOut,
  type UserProfile,
  type UserPreferences,
} from '../services/AuthService';

type AuthState = 'loading' | 'unauthenticated' | 'onboarding' | 'authenticated';

interface UserContextValue {
  authState: AuthState;
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  completeOnboarding: (prefs: UserPreferences) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({children}: {children: React.ReactNode}) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [user, setUserState] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadStoredUser().then(stored => {
      if (!stored) {
        setAuthState('unauthenticated');
      } else if (!stored.preferences) {
        setUserState(stored);
        setAuthState('onboarding');
      } else {
        setUserState(stored);
        setAuthState('authenticated');
      }
    });
  }, []);

  const setUser = (u: UserProfile) => {
    setUserState(u);
    setAuthState(u.preferences ? 'authenticated' : 'onboarding');
  };

  const completeOnboarding = async (prefs: UserPreferences) => {
    await savePreferences(prefs);
    setUserState(prev => (prev ? {...prev, preferences: prefs} : null));
    setAuthState('authenticated');
  };

  const signOut = async () => {
    await authSignOut();
    setUserState(null);
    setAuthState('unauthenticated');
  };

  return (
    <UserContext.Provider value={{authState, user, setUser, completeOnboarding, signOut}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {throw new Error('useUser must be used inside UserProvider');}
  return ctx;
}
