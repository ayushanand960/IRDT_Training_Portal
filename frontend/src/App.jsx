  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
         
import Login from "./pages/Login";
import RegisterTemplate from './pages/RegisterTemplate';

import Dashboard from "./pages/Dashboard_sample";
import ForgotPassword from "./pages/ForgotPassword";
import AdminCoordinatorLogin from "./pages/AdminCoordinatorLogin";

export default function App() {
  return (
    <Router>
    <Routes>
        {/* Home and Login */}
        <Route path="/" element={<Home />} />  
        <Route path="/register/staff" element={<RegisterTemplate  />} />
        <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      {/* <Route path="/register/staff" element={<RegisterTemplate />} /> */}


      <Route path="/admin-coordinator-login" element={<AdminCoordinatorLogin />} />
      </Routes>
      </Router>
    
  );
}
