import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaCertificate,
  FaBell,
  FaChartBar,
  FaCog,
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-dark text-white p-3 vh-100 text-start" style={{ width: '240px' }}>
      <h4 className="mb-4">IRDT Admin</h4>

      <NavLink to="/admin-dashboard" className="d-flex align-items-center mb-2 text-white text-decoration-none">
        <FaTachometerAlt className="me-2" /> <span>Dashboard</span>
      </NavLink>

      <NavLink to="/manage-users" className="d-flex align-items-center mb-2 text-white text-decoration-none">
        <FaUsers className="me-2" /> <span>Manage Users</span>
      </NavLink>

      <NavLink to="/admin-trainings" className="d-flex align-items-center mb-2 text-white text-decoration-none">
        <FaCalendarAlt className="me-2" /> <span>Trainings</span>
      </NavLink>

      <NavLink to="/training-calendar" className="d-flex align-items-center mb-2 text-white text-decoration-none">
        <FaCalendarAlt className="me-2" /> <span>Training Calendar</span>
      </NavLink>

      <NavLink to="/notifications" className="d-flex align-items-center mb-2 text-white text-decoration-none">
        <FaBell className="me-2" /> <span>Notifications</span>
      </NavLink>

      
    </div>
  );
};

export default Sidebar;
