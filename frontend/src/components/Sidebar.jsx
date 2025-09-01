import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaClipboardCheck,
} from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    marginBottom: '16px',
    borderRadius: '10px',
    textDecoration: 'none',
    backgroundColor: '#ffffff',
    color: '#333',
    fontSize: '16px',
    fontWeight: 500,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    gap: '12px',
  };

  const activeStyle = {
    backgroundColor: '#e6f9f9',
    borderLeft: '5px solid #ffffff',
    color: '#006666',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(0, 102, 102, 0.3)',
  };

  return (
    <>
      {/* Backdrop (mobile only) */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1049,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className="p-3 sidebar"
        style={{
          width: '240px',
          backgroundColor: '#006666',
          fontFamily: 'Segoe UI, sans-serif',
          borderRight: '1px solid #ddd',
          height: '100vh',
          position: 'fixed',
          top: 0,
          // Always show on desktop, slide in/out on mobile
          left:
            window.innerWidth >= 768
              ? 0
              : sidebarOpen
                ? 0
                : '-240px',
          overflowY: 'auto',
          transition: 'left 0.3s ease',
          zIndex: 1050,
        }}
      >
        <br />
        <h2 className="mb-4 fw-bold text-center text-white">IRDT ADMIN</h2>
        <br />

        {[
          { to: '/admin-dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
          { to: '/manage-users', icon: <FaUsers />, label: 'Manage Users' },
          { to: '/admin-trainings', icon: <FaCalendarAlt />, label: 'Trainings' },
          { to: '/training-calendar', icon: <FaCalendarAlt />, label: 'Training Calendar' },
          { to: '/admin-nominations', icon: <FaClipboardCheck />, label: 'Nominations' },
        ].map(({ to, icon, label }) => (
          <NavLink
            to={to}
            key={label}
            className="nav-item"
            style={({ isActive }) => ({
              ...baseStyle,
              ...(isActive ? activeStyle : {}),
            })}
            // On mobile, close sidebar when link clicked
            onClick={() => {
              if (window.innerWidth < 768) toggleSidebar();
            }}
          >
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;


