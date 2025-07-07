import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaCertificate, FaBell, FaChartBar, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '240px' }}>
      <h4 className="mb-4">IRDT Admin</h4>
      <NavLink to="/" className="d-block mb-2 text-white text-decoration-none">
        <FaTachometerAlt className="me-2" /> Dashboard
      </NavLink>
      <NavLink to="/manage-users" className="d-block mb-2 text-white text-decoration-none">
        <FaUsers className="me-2" /> Manage Users
      </NavLink>
      <NavLink to="/admin-trainings" className="d-block mb-2 text-white text-decoration-none">
        <FaCalendarAlt className="me-2" /> Trainings
      </NavLink>
      <NavLink to="/certificates" className="d-block mb-2 text-white text-decoration-none">
        <FaCertificate className="me-2" /> Certificates
      </NavLink>
      <NavLink to="/notifications" className="d-block mb-2 text-white text-decoration-none">
        <FaBell className="me-2" /> Notifications
      </NavLink>
      <NavLink to="/reports" className="d-block mb-2 text-white text-decoration-none">
        <FaChartBar className="me-2" /> Reports
      </NavLink>
      <NavLink to="/settings" className="d-block mb-2 text-white text-decoration-none">
        <FaCog className="me-2" /> Settings
      </NavLink>
    </div>    


  );
};

export default Sidebar;
