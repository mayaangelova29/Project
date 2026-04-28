import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Coordinates } from '../utils/geolocation';

interface CheckIn {
  venueId: string;
  timestamp: string;
}

interface AppState {
  isAuthenticated: boolean;
  userName: string | null;
  email: string | null;
  profilePhoto: string | null;
  hasOnboarded: boolean;
  userCoords: Coordinates | null;
  userKeywords: string[];
  checkIns: CheckIn[];
  points: number;
  joinedClubs: string[];
  role: 'athlete' | 'venue';
  venueId: string | null;
}

interface AppContextProps {
  state: AppState;
  setAuthenticated: (status: boolean, name?: string, email?: string) => void;
  setProfilePhoto: (photo: string) => void;
  setOnboarded: (status: boolean) => void;
  setUserCoords: (coords: Coordinates) => void;
  setUserKeywords: (keywords: string[]) => void;
  addCheckIn: (venueId: string) => void;
  joinClub: (venueId: string) => void;
  leaveClub: (venueId: string) => void;
  resetState: () => void;
}

const defaultState: AppState = {
  isAuthenticated: false,
  userName: null,
  email: null,
  profilePhoto: null,
  hasOnboarded: false,
  userCoords: null,
  userKeywords: [],
  checkIns: [],
  points: 0,
  joinedClubs: [],
  role: 'athlete',
  venueId: null,
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('vibefit_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults so newly added fields (like joinedClubs) are never undefined
        return { ...defaultState, ...parsed };
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('vibefit_state', JSON.stringify(state));
  }, [state]);

  const setAuthenticated = (isAuthenticated: boolean, userName?: string, email?: string) => {
    setState((s) => ({ ...s, isAuthenticated, userName: userName || s.userName, email: email || s.email }));
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
  const joinClub = (venueId: string) => {
    setState((s) => {
      if (s.joinedClubs.includes(venueId)) return s;
      return {
        ...s,
        joinedClubs: [...s.joinedClubs, venueId],
        points: s.points + 200,
      };
    });
  };
  const leaveClub = (venueId: string) => {
    setState((s) => ({
      ...s,
      joinedClubs: s.joinedClubs.filter((id) => id !== venueId),
    }));
  };
  const resetState = () => {
    localStorage.removeItem('vibefit_state');
    setState(defaultState);
  };

  return (
    <AppContext.Provider value={{ state, setAuthenticated, setProfilePhoto, setOnboarded, setUserCoords, setUserKeywords, addCheckIn, joinClub, leaveClub, resetState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
