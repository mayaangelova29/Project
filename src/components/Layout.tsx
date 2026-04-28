import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Compass, Trophy, User, Users } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <div className="app-container layout-wrapper">
      <nav className="main-nav">
        <NavLink 
          to="/app" 
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <Compass size={24} />
          <span>Discover</span>
        </NavLink>
        
        <NavLink 
          to="/app/clubs" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <Users size={24} />
          <span>My Clubs</span>
        </NavLink>

        <NavLink 
          to="/app/leaderboard" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <Trophy size={24} />
          <span>Leaderboard</span>
        </NavLink>
        
        <NavLink 
          to="/app/profile" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
