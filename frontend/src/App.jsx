  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from './pages/Home';
         
import Login from "./pages/Login";
import RegisterTemplate from './pages/RegisterTemplate';
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import TraineeDashboard from "./pages/TraineeDashboard";

import Dashboard from "./pages/Dashboard_sample";
import ForgotPassword from "./pages/ForgotPassword";
import AdminCoordinatorLogin from "./pages/AdminCoordinatorLogin";
import ManageTrainings from "./pages/ManageTrainings";
// import ManageUsers from "./pages/ManageUsers";
import AdminDashboard from "./pages/AdminDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router> 
        <ToastContainer position="top-center" autoClose={3000} />
     <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/register/staff" element={<RegisterTemplate  />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/coordinator-dashboard" element={<CoordinatorDashboard />} />
        <Route path="/dashboard" element={<TraineeDashboard />} />
        <Route path="/admin-coordinator-login" element={<AdminCoordinatorLogin />} />
        <Route path="/admin-trainings" element={<ManageTrainings />  }/>
        {/* <Route path="/manage-users" element={<ManageUsers />  }/> */}
        <Route path="/admin-dashboard" element={<AdminDashboard />  }/>
      </Routes>
      
     </Router>
    
  );
}
