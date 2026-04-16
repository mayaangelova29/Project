import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { Quiz } from './components/Quiz';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { VenueDetail } from './views/VenueDetail';
import { Leaderboard } from './views/Leaderboard';

// Protected Route Wrapper
const RequireOnboarding = ({ children }: { children: JSX.Element }) => {
  const { state } = useAppContext();
  if (!state.hasOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/onboarding" element={<Quiz />} />
      
      {/* Protected Routes wrapped in common shell */}
      <Route path="/" element={
        <RequireOnboarding>
          <Layout />
        </RequireOnboarding>
      }>
        <Route index element={<Dashboard />} />
        <Route path="venue/:id" element={<VenueDetail />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
