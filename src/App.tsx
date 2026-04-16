import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { Quiz } from './components/Quiz';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { VenueDetail } from './views/VenueDetail';
import { Leaderboard } from './views/Leaderboard';
import { Profile } from './views/Profile';
import { Landing } from './views/Landing';

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

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route path="/onboarding" element={
        <RequireAuth>
          <Quiz />
        </RequireAuth>
      } />
      
      {/* Protected Routes wrapped in common shell */}
      <Route path="/app" element={
        <RequireAuth>
          <RequireOnboarding>
            <Layout />
          </RequireOnboarding>
        </RequireAuth>
      }>
        <Route index element={<Dashboard />} />
        <Route path="venue/:id" element={<VenueDetail />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
