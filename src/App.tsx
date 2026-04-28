import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { Quiz } from './components/Quiz';
import { Layout } from './components/Layout';
import { VenueLayout } from './components/VenueLayout';
import { Dashboard } from './views/Dashboard';
import { VenueDetail } from './views/VenueDetail';
import { Leaderboard } from './views/Leaderboard';
import { Profile } from './views/Profile';
import { Landing } from './views/Landing';
import { MyClubs } from './views/MyClubs';
import { ClubLeaderboard } from './views/ClubLeaderboard';
import { VenueDashboard } from './views/VenueDashboard';
import { VenueMembers } from './views/VenueMembers';

// Protected Route Wrapper for Auth
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppContext();
  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Protected Route Wrapper for Onboarding
const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppContext();
  if (!state.hasOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

// Require venue role
const RequireVenue = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppContext();
  if (!state.isAuthenticated) return <Navigate to="/" replace />;
  if (state.role !== 'venue') return <Navigate to="/app" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route path="/onboarding" element={
        <RequireAuth>
          <Quiz />
        </RequireAuth>
      } />
      
      {/* Athlete Routes */}
      <Route path="/app" element={
        <RequireAuth>
          <RequireOnboarding>
            <Layout />
          </RequireOnboarding>
        </RequireAuth>
      }>
        <Route index element={<Dashboard />} />
        <Route path="venue/:id" element={<VenueDetail />} />
        <Route path="clubs" element={<MyClubs />} />
        <Route path="club/:id/leaderboard" element={<ClubLeaderboard />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Venue Owner Routes */}
      <Route path="/venue-dashboard" element={
        <RequireVenue>
          <VenueLayout />
        </RequireVenue>
      }>
        <Route index element={<VenueDashboard />} />
        <Route path="members" element={<VenueMembers />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

