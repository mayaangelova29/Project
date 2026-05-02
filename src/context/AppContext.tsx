import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Coordinates } from '../utils/geolocation';

interface CheckIn {
  venueId: string;
  timestamp: string;
}

interface AppState {
  id: string | null;
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
  loginUser: (user: Partial<AppState>) => void;
  setAuthenticated: (status: boolean, name?: string, email?: string) => void;
  setUserName: (name: string) => void;
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
  id: null,
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
    
    // Sync to backend if authenticated and we have an ID
    if (state.isAuthenticated && state.id) {
       fetch(`http://localhost:3001/users/${state.id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           points: state.points,
           checkIns: state.checkIns,
           joinedClubs: state.joinedClubs,
           userKeywords: state.userKeywords,
           profilePhoto: state.profilePhoto,
           name: state.userName
         })
       }).catch(console.error);
    }
  }, [state]);

  // Recovery mechanism for existing sessions missing an ID
  useEffect(() => {
    if (state.isAuthenticated && !state.id && state.email) {
      fetch(`http://localhost:3001/users?email=${state.email}`)
        .then(res => res.json())
        .then(users => {
          if (users.length > 0) {
            const user = users[0];
            loginUser({
              id: user.id,
              checkIns: user.checkIns || [],
              points: user.points || 0,
              joinedClubs: user.joinedClubs || [],
              userKeywords: user.userKeywords || [],
              profilePhoto: user.profilePhoto || null,
            });
          }
        })
        .catch(console.error);
    }
  }, [state.isAuthenticated, state.id, state.email]);

  const loginUser = (user: Partial<AppState>) => {
    setState((s) => ({ ...s, isAuthenticated: true, ...user }));
  };

  const setAuthenticated = (isAuthenticated: boolean, userName?: string, email?: string) => {
    setState((s) => ({ ...s, isAuthenticated, userName: userName || s.userName, email: email || s.email }));
  };
  const setUserName = (userName: string) => setState((s) => ({ ...s, userName }));
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
    <AppContext.Provider value={{ state, loginUser, setAuthenticated, setUserName, setProfilePhoto, setOnboarded, setUserCoords, setUserKeywords, addCheckIn, joinClub, leaveClub, resetState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
