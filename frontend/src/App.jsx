import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from './components/AuthContext';

// Pages
import Home from './pages/Home';
import Login from "./pages/Login";
import RegisterTemplate from './pages/RegisterTemplate';
import TraineeDashbaord from "./pages/TraineeDashboard";
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
import AllUsersPage from './pages/AllUsersPage';
import ZoneTable from "./pages/ZoneTable";
import AboutUs from "./pages/AboutUs";
import PhotoGallery from "./pages/PhotoGallery";
import ELearning from "./pages/ELearning";
import AdminNominationDashboard from "./pages/AdminNominationDashboard";
import UserTrainingsPage from "./pages/UserTrainingsPage";

import Info1 from "./pages/Info1"; 



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
        {/* <Route path="/home2" element={<Home2 />} /> */}
        <Route path="/zonetable" element={<ZoneTable />} />
        <Route path="/aboutus" element={<AboutUs />} />
         <Route path="/info1" element={<Info1 />} />
        <Route path="/PhotoGallery" element={<PhotoGallery />} />
        <Route path="/ELearning" element={<ELearning />} />

        {/* Trainee Routes */}
        <Route element={<PrivateRoute allowedRoles={['trainee']} />}>
          <Route path="/dashboard" element={<TraineeDashbaord />} />
        </Route>

        {/* Coordinator Routes */}
        <Route element={<PrivateRoute allowedRoles={['coordinator']} />}>
          <Route path="/coordinator-dashboard/:ehrms_code" element={<CoordinatorDashboard />} />
          <Route path="/trainings/:code" element={<TrainingNominationPage />} />
          {/* <Route path="/generate-certificates" element={<CoordinatorCertificatePage />} />  */}
          <Route path="/generate-certificate/:code" element={<CoordinatorCertificatePage />} />
          <Route path="/users/all/:code" element={<AllUsersPage />} />
          <Route path="/users/:ehrms_code/trainings" element={<UserTrainingsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-trainings" element={<ManageTrainings />} />
          <Route path="/training-calendar" element={<TrainingCalendar />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/admin-nominations" element={<AdminNominationDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
