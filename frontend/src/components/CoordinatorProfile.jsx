// import React from "react";
// import { Card } from "react-bootstrap";

// const CoordinatorProfile = ({ coordinator }) => {
//   return (
//     <Card className="mb-4 shadow">
//       <Card.Body>
//         <h5 className="mb-3">Coordinator Profile</h5>
//         <p><strong>Name:</strong> {coordinator.first_name}</p>
//         <p><strong>Email:</strong> {coordinator.email}</p>
//         <p><strong>Institute:</strong> {coordinator.institute || "N/A"}</p>
//         <p><strong>EHRMS Code:</strong> {coordinator.ehrms_code}</p>
//       </Card.Body>
//     </Card>



// //     <Card className="mb-4 shadow-sm roune">
// //   <Card.Body>
// //     <Card.Title>Coordinator Profile</Card.Title>
// //     <p><strong>Name:</strong> {coordinator.name}</p>
// //     <p><strong>Email:</strong> {coordinator.email}</p>
// //     <p><strong>Institute:</strong> {coordinator.institute || "N/A"}</p>
// //     {/* <Badge bg="info">EHRMS Code: {coordinator.ehrms_code}</Badge> */}
// //   </Card.Body>
// // </Card>

//   );
// };

// export default CoordinatorProfile;

// src/components/CoordinatorProfile.jsx
import React from "react";
import { Card, Badge } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

const CoordinatorProfile = ({ coordinator }) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    institute,
    ehrms_code,
  } = coordinator || {};

  const fullName = [first_name, middle_name, last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <Card
      className="mb-4 shadow-sm rounded"
      style={{ backgroundColor: "#4DA8DA", color: "white" }}
    >
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <FaUserCircle size={40} className="me-3 text-white" />
          <h5 className="mb-0 fw-bold">Coordinator Profile</h5>
        </div>
        <hr className="mb-3 border-white" />
        <p>
          <strong>Name:</strong> {fullName || <span>N/A</span>}
        </p>
        <p>
          <strong>Email:</strong> {email || <span>N/A</span>}
        </p>
        <p>
          <strong>Institute:</strong> {institute || <span>N/A</span>}
        </p>
        <p>
          <strong>EHRMS Code:</strong>{" "}
          {ehrms_code ? (
            <Badge bg="light" text="dark" className="ms-1">
              {ehrms_code}
            </Badge>
          ) : (
            <span>N/A</span>
          )}
        </p>
      </Card.Body>
    </Card>
  );
};

export default CoordinatorProfile;
