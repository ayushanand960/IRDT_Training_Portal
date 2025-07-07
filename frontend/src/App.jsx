// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from './pages/Home';
import Login from "./pages/Login";
import RegisterTemplate from './pages/RegisterTemplate';
import Dashboard from "./pages/Dashboard_sample";           // renamed properly
import TraineeDashboard from "./pages/TraineeDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import AdminCoordinatorLogin from "./pages/AdminCoordinatorLogin";
// import CoordinatorDashboard from "./pages/CoordinatorDashboard"; // Uncomment if this file exists

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router> 
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/register/staff" element={<RegisterTemplate />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trainee-dashboard" element={<TraineeDashboard />} />
        {/* <Route path="/coordinator-dashboard" element={<CoordinatorDashboard />} /> */}
        <Route path="/admin-coordinator-login" element={<AdminCoordinatorLogin />} />
      </Routes>
    </Router>
  );
}
