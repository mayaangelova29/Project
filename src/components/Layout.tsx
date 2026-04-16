import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Compass, Trophy, User } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <div className="app-container layout-wrapper">
      <nav className="main-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <Compass size={24} />
          <span>Discover</span>
        </NavLink>
        
        <NavLink 
          to="/leaderboard" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <Trophy size={24} />
          <span>Leaderboard</span>
        </NavLink>
        
        <div className="nav-item opacity-50 cursor-not-allowed">
          <User size={24} />
          <span>Profile</span>
        </div>
      </nav>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
