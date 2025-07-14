// // src/pages/Dashboard.jsx
// import React from "react";
// import { Row, Col } from "react-bootstrap";
// import { FaUsers, FaCalendarAlt, FaCertificate, FaBell } from "react-icons/fa";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import MetricCard from "../components/MetricCard";

// const Dashboard = () => {
//   const metrics = [
//     {
//       title: "Total Users",
//       value: 128,
//       icon: <FaUsers size={30} />,
//       bg: "primary",
//     },
//     {
//       title: "Trainings Conducted",
//       value: 24,
//       icon: <FaCalendarAlt size={30} />,
//       bg: "success",
//     },
//     {
//       title: "Certificates Issued",
//       value: 310,
//       icon: <FaCertificate size={30} />,
//       bg: "warning",
//     },
//     {
//       title: "New Notifications",
//       value: 5,
//       icon: <FaBell size={30} />,
//       bg: "danger",
//     },
//   ];

//   return (
//     <div className="d-flex" style={{ minHeight: "100vh" }}>
//       <Sidebar />
//       <div className="flex-grow-1" style={{ width: "100%" }}>
//         <Topbar />
//         <div className="p-4" style={{ background: "#f8f9fa", minHeight: "calc(100vh - 56px)" }}>
//           <h3 className="mb-4">Welcome to the IRDT Admin Dashboard</h3>
//           <Row>
//             {metrics.map((metric, index) => (
//               <Col key={index} md={6} lg={3} className="mb-4">
//                 <MetricCard
//                   title={metric.title}
//                   value={metric.value}
//                   icon={metric.icon}
//                   bg={metric.bg}
//                 />
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;








// src/pages/adminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaUsers, FaCalendarAlt, FaCertificate } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MetricCard from "../components/MetricCard";
import UpcomingTrainings from "../components/UpcomingTrainings";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosInstance.get("/training/dashboard/metrics/");
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err);
        setError("Unable to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
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

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1" style={{ width: "100%" }}>
        <Topbar />
        <div
          className="p-4"
          style={{ background: "#f8f9fa", minHeight: "calc(100vh - 56px)" }}
        >
          <h3 className="mb-4">Welcome to the IRDT Admin Dashboard</h3>

          {loading ? (
            <Spinner animation="border" />
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

          {/* ✅ Restore Upcoming Trainings Section */}
          <div className="mt-5">
            <UpcomingTrainings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
