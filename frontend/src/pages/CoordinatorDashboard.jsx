// // src/pages/CoordinatorDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import { toast } from 'react-toastify';

// const CoordinatorDashboard = () => {
//   const [trainings, setTrainings] = useState([]);
//   const [newTraining, setNewTraining] = useState({ title: '', description: '' });

//   const fetchTrainings = async () => {
//     try {
//       const res = await axiosInstance.get('/trainings/');
//       setTrainings(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch training data");
//     }
//   };

//   const handleAssign = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.post('/trainings/create/', newTraining);
//       toast.success("Training assigned successfully");
//       setNewTraining({ title: '', description: '' });
//       fetchTrainings();
//     } catch (err) {
//       toast.error("Error assigning training");
//     }
//   };

//   useEffect(() => {
//     fetchTrainings();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2>Coordinator Dashboard</h2>
//       <form className="mb-4" onSubmit={handleAssign}>
//         <input
//           className="form-control mb-2"
//           placeholder="Training Title"
//           value={newTraining.title}
//           onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
//           required
//         />
//         <textarea
//           className="form-control mb-2"
//           placeholder="Training Description"
//           value={newTraining.description}
//           onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
//           required
//         />
//         <button className="btn btn-primary">Assign Training</button>
//       </form>

//       <h4>Assigned Trainings</h4>
//       <ul className="list-group">
//         {trainings.map((t) => (
//           <li key={t.id} className="list-group-item">
//             <strong>{t.title}</strong>: {t.description}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CoordinatorDashboard;



// src/pages/CoordinatorDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
// import axiosInstance from "../utils/axiosInstance";
// import CoordinatorProfile from "../components/CoordinatorProfile";
// import AssignedTrainings from "../components/AssignedTrainings";
// import TraineeManager from "../components/TraineeManager";

// const CoordinatorDashboard = () => {
//   const [coordinator, setCoordinator] = useState(null);
//   const [trainings, setTrainings] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const profileRes = await axiosInstance.get(`/login/user/profile/`);
//         const ehrms_code = profileRes.data.ehrms_code;

//         const [trainingsRes, usersRes] = await Promise.all([
//           axiosInstance.get(`/login/trainings/?coordinator=${ehrms_code}`),
//           axiosInstance.get(`/login/users/`)
//         ]);

//         setCoordinator(profileRes.data);
//         setTrainings(trainingsRes.data);
//         setUsers(usersRes.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching coordinator dashboard:", err);
//         setError("Failed to load coordinator dashboard.");
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) return <Spinner animation="border" className="m-5" />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Container fluid>
//       <Row>
//         <Col md={3}>
//           <CoordinatorProfile coordinator={coordinator} />
//         </Col>
//         <Col md={9}>
//           <AssignedTrainings trainings={trainings} />
//           <TraineeManager
//             users={users}
//             trainings={trainings}
//             coordinatorId={coordinator?.ehrms_code}
//           />
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default CoordinatorDashboard;
// src/pages/CoordinatorDashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Card, Button } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";
import CoordinatorProfile from "../components/CoordinatorProfile";
import AssignedTrainings from "../components/AssignedTrainings";
import Topbar from "../components/Topbar";
import TraineeManager from "../components/TraineeManager";
import { useNavigate } from "react-router-dom"; // ✅ NEW IMPORT

const CoordinatorDashboard = () => {
  const [coordinator, setCoordinator] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Hook for navigation

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await axiosInstance.get(`/login/user/profile/`);
        const ehrms_code = profileRes.data.ehrms_code;

        const [trainingsRes, usersRes] = await Promise.all([
          axiosInstance.get(`/login/trainings/?coordinator=${ehrms_code}`),
          axiosInstance.get(`/login/users/`)
        ]);

        setCoordinator(profileRes.data);
        setTrainings(trainingsRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching coordinator dashboard:", err);
        setError("Failed to load coordinator dashboard.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
    {/* 🔝 Topbar component */}
      <Topbar user={coordinator} role="coordinator" />
    <Container fluid className="py-4 px-3 bg-light min-vh-100">
      <Row>
        {/* Left Column - Assigned Trainings */}
        <Col xs={12} lg={9} className="mb-4 mb-lg-0">
          <Card
            className="shadow-sm w-100"
            style={{ backgroundColor: "#ffffff", borderRadius: "12px" }}
          >
            <Card.Body>
              <h2 className="fw-bold text-secondary mb-4">Assigned Trainings</h2>
              <AssignedTrainings trainings={trainings} />
            </Card.Body>
          </Card>
          
        </Col>

        {/* Right Column - Profile + Nominate */}
        <Col xs={12} lg={3}>
          <div style={{ position: "sticky", top: "20px" }}>
            <CoordinatorProfile coordinator={coordinator} />

            {/* <div className="mt-4 d-grid">
              
              <Button
                variant="success"
                className="mt-2"
                onClick={() => navigate("/generate-certificates")} // ✅ Route path to CoordinatorCertificatePage
              >
                🧾 Generate Certificates
              </Button>
            </div> */}
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default CoordinatorDashboard;
