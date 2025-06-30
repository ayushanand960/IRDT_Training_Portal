  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
//import Login from './pages/Login';
// import Signup from "./pages/Signup";          
import Login from "./pages/Login";
import RegisterTemplate from './pages/RegisterTemplate';
//import DashboardAdmin from './pages/DashboardAdmin';
//import DashboardStaff from './pages/DashboardStaff';
//import DashboardCoordinator from './pages/DashboardCoordinator';
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import AdminCoordinatorLogin from "./pages/AdminCoordinatorLogin";

export default function App() {
  return (
    <Router>
    <Routes>
        {/* Home and Login */}
        <Route path="/" element={<Home />} />
        {/*<Route path="/login" element={<Login />} />*/}

        {/* Registration pages */}
        {/*<Route path="/register/admin" element={<RegisterTemplate role="Admin" />} />*/}
        <Route path="/register/staff" element={<RegisterTemplate role="Teaching Staff" />} />
       {/* <Route path="/register/coordinator" element={<RegisterTemplate role="Coordinator" />} />*/}

        {/* Dashboards */}
        {/*<Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/staff" element={<DashboardStaff />} />
        <Route path="/dashboard/coordinator" element={<DashboardCoordinator />} />*/}
        <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/register/staff" element={<RegisterTemplate />} />


      <Route path="/admin-coordinator-login" element={<AdminCoordinatorLogin />} />
      </Routes>
      </Router>
    
  );
}
