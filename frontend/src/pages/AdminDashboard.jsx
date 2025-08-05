
import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaUsers, FaCalendarAlt, FaCertificate } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MetricCard from "../components/MetricCard";
import UpcomingTrainings from "../components/UpcomingTrainings";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch admin user info
        const userRes = await axiosInstance.get("/login/user/profile/");
        setAdminUser(userRes.data);

        // ✅ Fetch dashboard metrics
        const metricsRes = await axiosInstance.get("/training/dashboard/metrics/");
        setMetrics(metricsRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const iconMap = {
    total_users: <FaUsers size={30} />,
    total_trainings: <FaCalendarAlt size={30} />,
    conducted_trainings: <FaCertificate size={30} />,
  };

  const colorMap = {
    total_users: "primary",
    total_trainings: "success",
    conducted_trainings: "warning",
  };

  const titleMap = {
    total_users: "Total Users",
    total_trainings: "Total Trainings",
    conducted_trainings: "Conducted Trainings",
  };

  //   return (
  //     <div className="d-flex" style={{ minHeight: "100vh" }}>
  //       <Sidebar />
  //       <div className="flex-grow-1" style={{ width: "100%" }}>
  //         {/* ✅ Render Topbar when adminUser is loaded */}
  //         {adminUser && <Topbar user={adminUser} role="admin" />}

  //         <div
  //           className="p-4"
  //           style={{ background: "#f8f9fa", minHeight: "calc(100vh - 70px)" }}
  //         >
  //           <h3 className="mb-4">Welcome to the IRDT Admin Dashboard</h3>

  //           {loading ? (
  //             <Spinner animation="border" />
  //           ) : error ? (
  //             <Alert variant="danger">{error}</Alert>
  //           ) : (
  //             <Row>
  //               {Object.keys(metrics).map((key) => (
  //                 <Col key={key} md={6} lg={3} className="mb-4">
  //                   <MetricCard
  //                     title={titleMap[key]}
  //                     value={metrics[key]}
  //                     icon={iconMap[key]}
  //                     bg={colorMap[key]}
  //                   />
  //                 </Col>
  //               ))}
  //             </Row>
  //           )}

  //           <div className="mt-5">
  //             <UpcomingTrainings />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // export default Dashboard;
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "240px", width: "calc(100% - 240px)" }}
      >
        <div style={{ position: "fixed", top: 0, left: 240, right: 0, zIndex: 1040 }}>
          <Topbar />
        </div>

        <br />
        <br />
        <br />
        <br />
        <br /><br /><br />
        {/* Dashboard Content */}
        <div
          className="p-4"
          style={{ background: "#f8f9fa", minHeight: "calc(100vh - 80px)" }}
        >
          <div className="mb-4 py-2 px-3 bg-white rounded shadow-sm border-start border-4">
            <h3 className="mb-1 fw-bold text-dark">
              Welcome to the <span style={{ color: "#006666" }}>IRDT Admin Dashboard</span>
            </h3>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Row>
              {Object.keys(metrics).map((key) => (
                <Col key={key} md={6} lg={3} className="mb-4">
                  <MetricCard
                    title={titleMap[key]}
                    value={metrics[key]}
                    icon={iconMap[key]}
                    bg={colorMap[key]}
                  />
                </Col>
              ))}
            </Row>
          )}

          {/* Upcoming Trainings */}
          <div className="mt-5">
            <UpcomingTrainings />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;