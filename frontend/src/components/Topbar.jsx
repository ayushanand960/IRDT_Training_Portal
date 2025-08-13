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



// // src/components/Topbar.jsx
// import React from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axiosInstance from '../utils/axiosInstance';
// import logo from "../assets/irdt-logo.png";

// const Topbar = ({ profilePhoto, user, role }) => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await axiosInstance.post('/login/logout/');
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       localStorage.removeItem('access');
//       localStorage.removeItem('refresh');
//       navigate('/', { replace: true });
//     }
//   };

//   const getHeading = () => {
//     if (role === 'admin') return 'ADMIN DASHBOARD';
//     if (role === 'coordinator') return 'COORDINATOR DASHBOARD';
//     if (role === 'user' && user)
//       return `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} DASHBOARD`;
//     return 'DASHBOARD';
//   };
// return (
//   <div
//     className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom shadow-sm"
//     style={{ backgroundColor: '#006666' }}
//   >
//     {/* Left: Logo + Title */}
//     <div className="d-flex align-items-center gap-3">
//       <img
//         src={logo}
//         alt="IRDT Logo"
//         style={{ height: "7vw", filter: "invert(1) brightness(2)" }}
//       />
//       <div>
//         <h2 className="fw-bold mb-0 text-white">
//           Institute for Research, Development & Training (IRDT)
//         </h2>
//         <big className="fw-semibold text-white">
//           Government of Uttar Pradesh
//         </big>
//       </div>
//     </div>

//     {/* Right: Buttons */}
//     <div className="d-flex align-items-center gap-3">
//       <Link
//         to="/"
//         className="btn btn-outline-light fw-semibold px-4 py-2"
//         style={{ minWidth: "100px", textAlign: "center" }}
//       >
//         Home
//       </Link>
//       <button
//         onClick={handleLogout}
//         className="btn btn-outline-light fw-semibold px-4 py-2"
//         style={{ minWidth: "100px", textAlign: "center" }}
//       >
//         Logout
//       </button>
//     </div>
//   </div>
// );

// };

// export default Topbar;


