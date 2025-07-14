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





import React from "react";
import { Row, Col } from "react-bootstrap";
import { FaUsers, FaCalendarAlt, FaCertificate, FaBell } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MetricCard from "../components/MetricCard";
import UpcomingTrainings from "../components/UpcomingTrainings"; // ✅ import this

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Users",
      value: 128,
      icon: <FaUsers size={30} />,
      bg: "primary",
    },
    {
      title: "Trainings Conducted",
      value: 24,
      icon: <FaCalendarAlt size={30} />,
      bg: "success",
    },
    {
      title: "Certificates Issued",
      value: 310,
      icon: <FaCertificate size={30} />,
      bg: "warning",
    },
    {
      title: "New Notifications",
      value: 5,
      icon: <FaBell size={30} />,
      bg: "danger",
    },
  ];

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
          <Row>
            {metrics.map((metric, index) => (
              <Col key={index} md={6} lg={3} className="mb-4">
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  icon={metric.icon}
                  bg={metric.bg}
                />
              </Col>
            ))}
          </Row>

          {/* ✅ Add upcoming trainings section here */}
          <UpcomingTrainings />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
