

// --------------------------------------------------------------------------------


// import React from "react";
// import { Card, Row, Col } from "react-bootstrap";
// import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
// import TraineeListCollapse from "./TraineeListCollapse"; // ✅ make sure this is imported

// const AssignedTrainings = ({ trainings }) => {
//   if (trainings.length === 0) {
//     return <p>No trainings assigned yet.</p>;
//   }

//   return (
//     <Row className="g-4">
//       {trainings.map((training) => (
//         <Col md={6} key={training.code}> {/* Make sure key is consistent with .code */}
//           <Card
//             className="h-100 shadow-sm border-0"
//             style={{
//               backgroundColor: "#f9fbfd",
//               borderRadius: "12px",
//               padding: "10px",
//             }}
//           >
//             <Card.Body>
//               <h5 className="fw-bold mb-2 text-primary">{training.name}</h5>

//               <p className="mb-1">
//                 <FaMapMarkerAlt className="me-2 text-danger" />
//                 <strong>Venue:</strong> {training.venue}
//               </p>

//               <p className="mb-1">
//                 <FaCalendarAlt className="me-2 text-success" />
//                 <strong>Dates:</strong> {training.start_date} to{" "}
//                 {training.end_date}
//               </p>

//               <p className="mb-3">
//                 <FaUsers className="me-2 text-warning" />
//                 <strong>Target Group:</strong> {training.target_group}
//               </p>

//               {/* Add collapsible trainee list component here */}
//               <TraineeListCollapse trainingCode={training.code} />
//             </Card.Body>
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default AssignedTrainings;
  
// import React from "react";
// import { Card, Row, Col } from "react-bootstrap";
// import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const AssignedTrainings = ({ trainings }) => {
//   const navigate = useNavigate();

//   if (trainings.length === 0) {
//     return <p>No trainings assigned yet.</p>;
//   }

//   const handleCardClick = (code) => {
//     navigate(`/trainings/${code}`);
//   };
//    const handleShowAllUsers = (e) => {
//     e.stopPropagation();
//     navigate("/users/all");
//   };

//   return (
//     <Row className="g-4">
//       {trainings.map((training) => (
//         <Col md={6} key={training.code}>
//           <Card
//             className="h-100 shadow-sm border-0"
//             style={{
//               backgroundColor: "#f9fbfd",
//               borderRadius: "12px",
//               padding: "10px",
//               cursor: "pointer",
//             }}
//             onClick={() => handleCardClick(training.code)}
//           >
//             <Card.Body>
//               <h5 className="fw-bold mb-2 text-primary">{training.name}</h5>

//               <p className="mb-1">
//                 <FaMapMarkerAlt className="me-2 text-danger" />
//                 <strong>Venue:</strong> {training.venue}
//               </p>

//               <p className="mb-1">
//                 <FaCalendarAlt className="me-2 text-success" />
//                 <strong>Dates:</strong> {training.start_date} to{" "}
//                 {training.end_date}
//               </p>

//               <p className="mb-0">
//                 <FaUsers className="me-2 text-warning" />
//                 <strong>Target Group:</strong> {training.target_group}
//               </p>
//                <div className="text-end">
//                 <Button
//                   variant="outline-secondary"
//                   size="sm"
//                   onClick={handleShowAllUsers}
//                 >
//                   Show All Users
//                 </Button>
//               </div>


              
//             </Card.Body>
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default AssignedTrainings;






import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap"; // ✅ Button added here
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AssignedTrainings = ({ trainings }) => {
  const navigate = useNavigate();

  const handleCardClick = (code) => {
    navigate(`/trainings/${code}`);
  };


  // ✅ Prevent crash if trainings is undefined or not an array
  if (!Array.isArray(trainings) || trainings.length === 0) {
    return <p>No trainings assigned yet.</p>;
  }

  return (
    <Row className="g-4">
      {trainings.map((training) => (
        <Col md={6} key={training.code}>
          <Card
            className="h-100 shadow-sm border-0"
            style={{
              backgroundColor: "#f9fbfd",
              borderRadius: "12px",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => handleCardClick(training.code)}
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

              <p className="mb-3">
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
