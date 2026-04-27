import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Coordinates } from '../utils/geolocation';

interface CheckIn {
  venueId: string;
  timestamp: string;
}

interface AppState {
  isAuthenticated: boolean;
  userName: string | null;
  profilePhoto: string | null;
  hasOnboarded: boolean;
  userCoords: Coordinates | null;
  userKeywords: string[];
  checkIns: CheckIn[];
  points: number;
}

interface AppContextProps {
  state: AppState;
  setAuthenticated: (status: boolean, name?: string) => void;
  setProfilePhoto: (photo: string) => void;
  setOnboarded: (status: boolean) => void;
  setUserCoords: (coords: Coordinates) => void;
  setUserKeywords: (keywords: string[]) => void;
  addCheckIn: (venueId: string) => void;
  resetState: () => void;
}

const defaultState: AppState = {
  isAuthenticated: false,
  userName: null,
  profilePhoto: null,
  hasOnboarded: false,
  userCoords: null,
  userKeywords: [],
  checkIns: [],
  points: 0,
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('vibefit_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('vibefit_state', JSON.stringify(state));
  }, [state]);

  const setAuthenticated = (isAuthenticated: boolean, userName?: string) => {
    setState((s) => ({ ...s, isAuthenticated, userName: userName || s.userName }));
  };
  const setProfilePhoto = (profilePhoto: string) => setState((s) => ({ ...s, profilePhoto }));
  const setOnboarded = (hasOnboarded: boolean) => setState((s) => ({ ...s, hasOnboarded }));
  const setUserCoords = (userCoords: Coordinates) => setState((s) => ({ ...s, userCoords }));
  const setUserKeywords = (userKeywords: string[]) => setState((s) => ({ ...s, userKeywords }));
  const addCheckIn = (venueId: string) => {
    setState((s) => {
      // Prevent duplicates in same 24 hours just as a small gamification rule, or just add.
      // Earning 100 points per check-in
      return {
        ...s,
        checkIns: [...s.checkIns, { venueId, timestamp: new Date().toISOString() }],
        points: s.points + 100,
      };
    });
  };
  const resetState = () => {
    localStorage.removeItem('vibefit_state');
    setState(defaultState);
  };

  return (
    <AppContext.Provider value={{ state, setAuthenticated, setProfilePhoto, setOnboarded, setUserCoords, setUserKeywords, addCheckIn, resetState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
