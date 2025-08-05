import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaClipboardCheck,
} from 'react-icons/fa';

const Sidebar = () => {
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
    <div
      className="p-3"
      style={{
        width: '240px',
        backgroundColor: '#006666',
        fontFamily: 'Segoe UI, sans-serif',
        borderRight: '1px solid #ddd',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
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
        // { to: '/notifications', icon: <FaBell />, label: 'Notifications' },
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
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains('active')) {
              e.currentTarget.style.backgroundColor = '#00cccc';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 204, 204, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains('active')) {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.1)';
            }
          }}
        >
          <span style={{ fontSize: '18px' }}>{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;


// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   FaTachometerAlt,
//   FaUsers,
//   FaCalendarAlt,
//   FaCertificate,
//   FaBell,
//   FaChartBar,
//   FaCog,
// } from 'react-icons/fa';

// const Sidebar = () => {
//   return (
//     <div className="bg-dark text-white p-3 vh-100 text-start" style={{ width: '240px' }}>
//       <h4 className="mb-4">IRDT Admin</h4>

//       <NavLink to="/admin-dashboard" className="d-flex align-items-center mb-2 text-white text-decoration-none">
//         <FaTachometerAlt className="me-2" /> <span>Dashboard</span>
//       </NavLink>

//       <NavLink to="/manage-users" className="d-flex align-items-center mb-2 text-white text-decoration-none">
//         <FaUsers className="me-2" /> <span>Manage Users</span>
//       </NavLink>

//       <NavLink to="/admin-trainings" className="d-flex align-items-center mb-2 text-white text-decoration-none">
//         <FaCalendarAlt className="me-2" /> <span>Trainings</span>
//       </NavLink>

//       <NavLink to="/training-calendar" className="d-flex align-items-center mb-2 text-white text-decoration-none">
//         <FaCalendarAlt className="me-2" /> <span>Training Calendar</span>
//       </NavLink>

//       <NavLink to="/admin-nominations" className="d-flex align-items-center mb-2 text-white text-decoration-none">
//         <FaBell className="me-2" /> <span>Nominations</span>
//       </NavLink>

      
//     </div>
//   );
// };

// export default Sidebar;
