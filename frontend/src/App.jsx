import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from './components/AuthContext';

// Pages
import Home from './pages/Home';
import Login from "./pages/Login";
import RegisterTemplate from './pages/RegisterTemplate';
import Dashboard from "./pages/TraineeDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import AdminCoordinatorLogin from "./pages/AdminCoordinatorLogin";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import ManageTrainings from "./pages/ManageTrainings";
import ManageUsers from "./pages/ManageUsers";
import AdminDashboard from "./pages/AdminDashboard";
import TrainingCalendar from "./pages/TrainingCalendar";
import Logout from "./pages/Logout";
import CoordinatorCertificatePage from './pages/CoordinatorCertificatePage';
import TrainingNominationPage from "./pages/TrainingNominationPage";


// Components
import PrivateRoute from './components/PrivateRoute';
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const { loading } = useAuth(); // ✅ useAuth here

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading application...</h4>
      </div>
    );
  }
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/register/staff" element={<RegisterTemplate />} />
        <Route path="/admin-coordinator-login" element={<AdminCoordinatorLogin />} />
        <Route path="/logout" element={<Logout />} />

        {/* Trainee Routes */}
        <Route element={<PrivateRoute allowedRoles={['trainee']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Coordinator Routes */}
        <Route element={<PrivateRoute allowedRoles={['coordinator']} />}>
          <Route path="/coordinator-dashboard/:ehrms_code" element={<CoordinatorDashboard />} />
         <Route path="/trainings/:code" element={<TrainingNominationPage />} /> 
         <Route path="/generate-certificates" element={<CoordinatorCertificatePage />} /> 
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-trainings" element={<ManageTrainings />} />
          <Route path="/training-calendar" element={<TrainingCalendar />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          </Route>
      </Routes>
    </Router>
  );
}
