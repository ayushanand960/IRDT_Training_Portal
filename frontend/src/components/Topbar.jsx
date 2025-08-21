import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import logo from "../assets/irdt-logo.png";
import { FaBars } from "react-icons/fa";

const Topbar = ({ profilePhoto, user, role, toggleSidebar }) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = windowWidth >= 992; // Bootstrap lg breakpoint

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/login/logout/');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      navigate('/', { replace: true });
    }
  };

  return (
    <div
      className="position-relative d-flex align-items-center justify-content-between px-3 border-bottom shadow-sm"
      style={{
        backgroundColor: '#006666',
        position: 'sticky',
        top: 0,
        zIndex: 1040,
        height: isDesktop ? '110px' : '80px',
        paddingTop: 0,
        paddingBottom: 0
      }}
    >
      {/* Left: Toggle Button + Logo */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-light d-md-none"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>
        <img
          src={logo}
          alt="IRDT Logo"
          style={{
            height: isDesktop ? "70px" : "50px",
            filter: "invert(1) brightness(2)"
          }}
        />
      </div>

      {/* Center: Heading (desktop only) */}
      {isDesktop && (
        <div
          className="position-absolute text-center w-100"
          style={{
            left: 0,
            top: '20px',
            pointerEvents: 'none' // allow clicks to pass through
          }}
        >
          <h6
            className="fw-bold mb-0 text-white"
            style={{
              fontSize: "1.75rem"
            }}
          >
            Institute for Research, Development & Training (IRDT)
          </h6>
          <small
            className="fw-semibold text-white"
            style={{
              fontSize: "1rem"
            }}
          >
            Government of Uttar Pradesh
          </small>
          <br></br>
          <small
            className="fw-semibold text-white"
            style={{
              fontSize: "1rem",
              fontStyle: "italic"
            }}
          >
           Shiksha Pragati - "Bridge of Education for Progress"
          </small>
        </div>
      )}

      {/* Right: Buttons */}
      <div className="d-flex align-items-center gap-2">
        <Link
          to="/"
          className="btn btn-outline-light fw-semibold px-3"
          style={{ height: '40px', display: 'flex', alignItems: 'center' }}
        >
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-outline-light fw-semibold px-3"
          style={{ height: '40px', display: 'flex', alignItems: 'center' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;


