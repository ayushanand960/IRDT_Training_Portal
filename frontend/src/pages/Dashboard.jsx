// import React from 'react';

// const Dashboard = () => {
//   return (
//     <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '2rem' }}>
//       <h1>Welcome to Dashboard</h1>
//     </div>
//   );
// };

// export default Dashboard;



// import React from "react";
// import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
// import { FaUserFriends, FaCalendarAlt, FaCertificate, FaCog, FaBell } from "react-icons/fa";

// const Dashboard = () => {
//   return (



    
//     <Container fluid style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }} className="p-4">

//       {/* Top Navbar */}
//       <Row className="mb-4">
//         <Col><h4 className="fw-bold">Administrator Dashboard</h4></Col>
//         <Col className="text-end">
//           <FaBell className="me-3" size={20} />
//           <FaCog size={20} />
//         </Col>
//       </Row>

//       {/* Stat Cards */}
//       <Row className="g-4">
//         <Col md={3}>
//           <Card className="shadow-sm border-0">
//             <Card.Body className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="text-muted">Total Staff</div>
//                 <h3 className="fw-bold">1,247</h3>
//                 <div className="text-success small">+12%</div>
//               </div>
//               <FaUserFriends size={30} className="text-primary" />
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3}>
//           <Card className="shadow-sm border-0">
//             <Card.Body className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="text-muted">Active Training Programs</div>
//                 <h3 className="fw-bold">23</h3>
//                 <div className="text-success small">+5%</div>
//               </div>
//               <FaCalendarAlt size={30} className="text-success" />
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3}>
//           <Card className="shadow-sm border-0">
//             <Card.Body className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="text-muted">Certificates Issued</div>
//                 <h3 className="fw-bold">856</h3>
//                 <div className="text-success small">+18%</div>
//               </div>
//               <FaCertificate size={30} className="text-purple" />
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3}>
//           <Card className="shadow-sm border-0">
//             <Card.Body className="d-flex justify-content-between align-items-center">
//               <div>
//                 <div className="text-muted">Training Coordinators</div>
//                 <h3 className="fw-bold">15</h3>
//                 <div className="text-success small">+2%</div>
//               </div>
//               <FaCog size={30} className="text-warning" />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Tabs */}
//       <Nav variant="tabs" defaultActiveKey="/overview" className="mt-5 mb-3">
//         <Nav.Item><Nav.Link active>Overview</Nav.Link></Nav.Item>
//         <Nav.Item><Nav.Link>Users</Nav.Link></Nav.Item>
//         <Nav.Item><Nav.Link>Trainings</Nav.Link></Nav.Item>
//         <Nav.Item><Nav.Link>Reports</Nav.Link></Nav.Item>
//         <Nav.Item><Nav.Link>Settings</Nav.Link></Nav.Item>
//       </Nav>

//       {/* Recent Activities */}
//       <Card className="mb-4 border-0 shadow-sm">
//         <Card.Header className="bg-white fw-bold">🔔 Recent Activities</Card.Header>
//         <Card.Body>
//           <ul className="list-unstyled mb-0">
//             <li><span className="text-primary">●</span> New staff registration – <strong>Dr. Rajesh Kumar</strong> <small className="text-muted">2 hours ago</small></li>
//             <li><span className="text-success">●</span> Training completed – <strong>Prof. Sunita Singh</strong> <small className="text-muted">4 hours ago</small></li>
//             <li><span className="text-info">●</span> Certificate uploaded – <strong>Mr. Amit Sharma</strong> <small className="text-muted">6 hours ago</small></li>
//             <li><span className="text-warning">●</span> Training nominated – <strong>Dr. Priya Gupta</strong> <small className="text-muted">8 hours ago</small></li>
//           </ul>
//         </Card.Body>
//       </Card>

//       {/* Upcoming Trainings */}
//       <Card className="border-0 shadow-sm">
//         <Card.Header className="bg-white fw-bold">📅 Upcoming Trainings</Card.Header>
//         <Card.Body>
//           <div className="mb-4">
//             <h6 className="mb-1 fw-bold">Advanced Manufacturing Techniques</h6>
//             <small className="text-muted">2024-07-15 • IRDT Campus • </small>
//             <span className="badge bg-secondary">25 participants</span>
//           </div>
//           <div className="mb-4">
//             <h6 className="mb-1 fw-bold">Digital Learning Methods</h6>
//             <small className="text-muted">2024-07-20 • NITTTR Chandigarh • </small>
//             <span className="badge bg-secondary">30 participants</span>
//           </div>
//           <div>
//             <h6 className="mb-1 fw-bold">Research Methodology</h6>
//             <small className="text-muted">2024-07-25 • NITTTR Bhopal • </small>
//             <span className="badge bg-secondary">20 participants</span>
//           </div>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default Dashboard;


import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import { FaUserFriends, FaCalendarAlt, FaCertificate, FaCog, FaBell } from "react-icons/fa";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Container fluid style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }} className="p-4">

      {/* Top Navbar */}
      <Row className="mb-4">
        <Col><h4 className="fw-bold">Administrator Dashboard</h4></Col>
        <Col className="text-end">
          <FaBell className="me-3" size={20} />
          <FaCog size={20} />
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Nav variant="tabs" className="mb-4">
        <Nav.Item><Nav.Link active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link active={activeTab === "users"} onClick={() => setActiveTab("users")}>Users</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link active={activeTab === "trainings"} onClick={() => setActiveTab("trainings")}>Trainings</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link active={activeTab === "reports"} onClick={() => setActiveTab("reports")}>Reports</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>Settings</Nav.Link></Nav.Item>
      </Nav>

      {/* === Conditional Tab Content === */}
      {activeTab === "overview" && (
        <>
          {/* Stat Cards */}
          <Row className="g-4">
            <Col md={3}>
              <Card className="shadow-sm border-0">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted">Total Staff</div>
                    <h3 className="fw-bold">1,247</h3>
                    <div className="text-success small">+12%</div>
                  </div>
                  <FaUserFriends size={30} className="text-primary" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted">Active Training Programs</div>
                    <h3 className="fw-bold">23</h3>
                    <div className="text-success small">+5%</div>
                  </div>
                  <FaCalendarAlt size={30} className="text-success" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted">Certificates Issued</div>
                    <h3 className="fw-bold">856</h3>
                    <div className="text-success small">+18%</div>
                  </div>
                  <FaCertificate size={30} className="text-purple" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted">Training Coordinators</div>
                    <h3 className="fw-bold">15</h3>
                    <div className="text-success small">+2%</div>
                  </div>
                  <FaCog size={30} className="text-warning" />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activities */}
          <Card className="my-4 border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">🔔 Recent Activities</Card.Header>
            <Card.Body>
              <ul className="list-unstyled mb-0">
                <li><span className="text-primary">●</span> New staff registration – <strong>Dr. Rajesh Kumar</strong> <small className="text-muted">2 hours ago</small></li>
                <li><span className="text-success">●</span> Training completed – <strong>Prof. Sunita Singh</strong> <small className="text-muted">4 hours ago</small></li>
                <li><span className="text-info">●</span> Certificate uploaded – <strong>Mr. Amit Sharma</strong> <small className="text-muted">6 hours ago</small></li>
                <li><span className="text-warning">●</span> Training nominated – <strong>Dr. Priya Gupta</strong> <small className="text-muted">8 hours ago</small></li>
              </ul>
            </Card.Body>
          </Card>

          {/* Upcoming Trainings */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">📅 Upcoming Trainings</Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6 className="mb-1 fw-bold">Advanced Manufacturing Techniques</h6>
                <small className="text-muted">2024-07-15 • IRDT Campus • </small>
                <span className="badge bg-secondary">25 participants</span>
              </div>
              <div className="mb-4">
                <h6 className="mb-1 fw-bold">Digital Learning Methods</h6>
                <small className="text-muted">2024-07-20 • NITTTR Chandigarh • </small>
                <span className="badge bg-secondary">30 participants</span>
              </div>
              <div>
                <h6 className="mb-1 fw-bold">Research Methodology</h6>
                <small className="text-muted">2024-07-25 • NITTTR Bhopal • </small>
                <span className="badge bg-secondary">20 participants</span>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {activeTab === "users" && (
        <Card className="p-4 border-0 shadow-sm">
          <h5>👤 Users</h5>
          <ul>
            <li>Rajesh Kumar – Admin</li>
            <li>Sunita Singh – Trainer</li>
            <li>Amit Sharma – Staff</li>
          </ul>
        </Card>
      )}

      {activeTab === "trainings" && (
        <Card className="p-4 border-0 shadow-sm">
          <h5>🎓 Trainings</h5>
          <ul>
            <li>AI in Education – 45 Participants</li>
            <li>Research Methodology – 20 Participants</li>
            <li>Digital Skills – 38 Participants</li>
          </ul>
        </Card>
      )}

      {activeTab === "reports" && (
        <Card className="p-4 border-0 shadow-sm">
          <h5>📊 Reports</h5>
          <p>Weekly Report generated on: <strong>2024-07-01</strong></p>
          <Button variant="outline-primary">Download Report</Button>
        </Card>
      )}

      {activeTab === "settings" && (
        <Card className="p-4 border-0 shadow-sm">
          <h5>⚙️ Settings</h5>
          <p>Configure admin preferences, change password, and manage access levels here.</p>
          <Button variant="outline-secondary">Open Settings</Button>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;


