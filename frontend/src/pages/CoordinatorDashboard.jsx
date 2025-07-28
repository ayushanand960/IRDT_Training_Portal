


// // src/pages/CoordinatorDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Spinner, Alert, Card } from "react-bootstrap";
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
//   // const navigate = useNavigate();  // 👈 for programmatic navigation

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

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );

//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Container fluid className="py-4 px-3 bg-light min-vh-100">
//       <Row>
//         {/* Left Column - Assigned Trainings */}
//         <Col xs={12} lg={9} className="mb-4 mb-lg-0">
//           <Card
//             className="shadow-sm w-100"
//             style={{ backgroundColor: "#ffffff", borderRadius: "12px" }}
//           >
//             <Card.Body>
//               <h2 className="fw-bold text-secondary mb-4">Assigned Trainings</h2>
//               <AssignedTrainings trainings={trainings} />
//             </Card.Body>
//           </Card>
          
//         </Col>

//         {/* Right Column - Profile + Nominate */}
//         <Col xs={12} lg={3}>
//           <div style={{ position: "sticky", top: "20px" }}>
//             <CoordinatorProfile coordinator={coordinator} />

//             <div className="mt-4">
//               {/* <div
//                 className="px-4 py-2 mb-3 bg-secondary text-white rounded shadow-sm border"
//                 style={{
//                   fontWeight: "600",
//                   fontSize: "1.05rem",
//                   letterSpacing: "0.3px",
//                   borderLeft: "5px solid #0d6efd",
//                 }}
//               >
//                 Nominate Users to Trainings
//               </div> */}

//               {/* Only the Form component without extra card */}
//               {/* <TraineeManager
//                 users={users}
//                 trainings={trainings}
//                 coordinatorId={coordinator?.ehrms_code}
//               /> */}
//             </div>
//           </div>
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

        {/* Right Column - Profile + Certificate Generation Button */}
        <Col xs={12} lg={3}>
          <div style={{ position: "sticky", top: "20px" }}>
            <CoordinatorProfile coordinator={coordinator} />

            <div className="mt-4 d-grid">
              <Button
                variant="success"
                className="mt-2"
                onClick={() => navigate("/generate-certificates")} // ✅ Route path to CoordinatorCertificatePage
              >
                🧾 Generate Certificates
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CoordinatorDashboard;
