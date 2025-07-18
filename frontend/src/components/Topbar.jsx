import React from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ profilePhoto, user, showPanel, handleProfileClick }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="navbar navbar-dark px-4"
        style={{
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
          height: '70px',
        }}
      >
        <span className="navbar-brand text-info fw-bold fs-4">
          📘 ADMIN DASHBOARD
        </span>
      </nav>
    </>
  );
};

export default Topbar;
