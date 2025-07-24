// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Topbar = ({ profilePhoto, user, showPanel, handleProfileClick }) => {
//   const navigate = useNavigate();

//   return (
//     <>
//       {/* Top Navbar */}
//       <nav
//         className="navbar navbar-dark px-4"
//         style={{
//           background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
//           height: '70px',
//         }}
//       >
//         <span className="navbar-brand text-info fw-bold fs-4">
//           📘 ADMIN DASHBOARD
//         </span>
//       </nav>
//     </>
//   );
// };

// export default Topbar;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Topbar = ({ profilePhoto, user, role }) => {
  const navigate = useNavigate();

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

  const getHeading = () => {
    if (role === 'admin') return '📘 ADMIN DASHBOARD';
    if (role === 'coordinator') return '📘 COORDINATOR DASHBOARD';
    if (role === 'user' && user)
      return `📘 ${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} DASHBOARD`;
    return '📘 DASHBOARD';
  };

  return (
    <nav
      className="navbar navbar-dark px-4"
      style={{
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        height: '70px',
      }}
    >
      <span className="navbar-brand text-info fw-bold fs-4">{getHeading()}</span>
      <div>
        <button onClick={() => navigate('/')} className="btn btn-sm btn-outline-light me-2">
          🏠 Home
        </button>
        <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Topbar;
