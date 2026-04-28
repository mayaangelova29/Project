import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const VenueLayout: React.FC = () => {
  const { resetState } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    resetState();
    navigate('/');
  };

  return (
    <div className="app-container layout-wrapper">
      <nav className="main-nav">
        <NavLink
          to="/venue-dashboard"
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <LayoutDashboard size={24} />
          <span>My Listing</span>
        </NavLink>

        <NavLink
          to="/venue-dashboard/members"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          <Users size={24} />
          <span>Members</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', width: '100%' }}
        >
          <LogOut size={24} />
          <span>Log Out</span>
        </button>
      </nav>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
