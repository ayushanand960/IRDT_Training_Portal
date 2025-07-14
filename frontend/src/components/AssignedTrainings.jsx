// import React from "react";
// import { Card, ListGroup } from "react-bootstrap";

// const AssignedTrainings = ({ trainings }) => {
//   return (
//     <Card className="mb-4 shadow">
//       <Card.Body>
//         <h5 className="mb-3">Assigned Trainings</h5>
//         {trainings.length === 0 ? (
//           <p>No trainings assigned yet.</p>
//         ) : (
//           <ListGroup>
//             {trainings.map((training) => (
//               <ListGroup.Item key={training.id}>
//                 <strong>{training.title}</strong><br />
//                 📍 <strong>Venue:</strong> {training.venue} <br />
//                   📅 <strong>Dates:</strong> {training.start_date} to {training.end_date}<br />
//                 🏬 <strong>Target Group:</strong> {training.target_group} <br />
//                 📚 <strong>Training Name:</strong> {training.name}
              
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default AssignedTrainings;



// src/components/AssignedTrainings.jsx
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";

const AssignedTrainings = ({ trainings }) => {
  if (trainings.length === 0) {
    return <p>No trainings assigned yet.</p>;
  }

  return (
    <Row className="g-4">
      {trainings.map((training) => (
        <Col md={6} key={training.id}>
          <Card
            className="h-100 shadow-sm border-0"
            style={{
              backgroundColor: "#f9fbfd",
              borderRadius: "12px",
              padding: "10px",
            }}
          >
            <Card.Body>
              <h5 className="fw-bold mb-2 text-primary">{training.name}</h5>

              <p className="mb-1">
                <FaMapMarkerAlt className="me-2 text-danger" />
                <strong>Venue:</strong> {training.venue}
              </p>

              <p className="mb-1">
                <FaCalendarAlt className="me-2 text-success" />
                <strong>Dates:</strong> {training.start_date} to{" "}
                {training.end_date}
              </p>

              <p className="mb-1">
                <FaUsers className="me-2 text-warning" />
                <strong>Target Group:</strong> {training.target_group}
              </p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AssignedTrainings;
