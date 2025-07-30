// // import React from "react";
// // import { Card, ListGroup } from "react-bootstrap";

// // const AssignedTrainings = ({ trainings }) => {
// //   return (
// //     <Card className="mb-4 shadow">
// //       <Card.Body>
// //         <h5 className="mb-3">Assigned Trainings</h5>
// //         {trainings.length === 0 ? (
// //           <p>No trainings assigned yet.</p>
// //         ) : (
// //           <ListGroup>
// //             {trainings.map((training) => (
// //               <ListGroup.Item key={training.id}>
// //                 <strong>{training.title}</strong><br />
// //                 📍 <strong>Venue:</strong> {training.venue} <br />
// //                   📅 <strong>Dates:</strong> {training.start_date} to {training.end_date}<br />
// //                 🏬 <strong>Target Group:</strong> {training.target_group} <br />
// //                 📚 <strong>Training Name:</strong> {training.name}
              
// //               </ListGroup.Item>
// //             ))}
// //           </ListGroup>
// //         )}
// //       </Card.Body>
// //     </Card>
// //   );
// // };

// // export default AssignedTrainings;



// // src/components/AssignedTrainings.jsx
// import React from "react";
// import { Card, Row, Col } from "react-bootstrap";
// import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
// import TraineeListCollapse from "./TraineeListCollapse"; 

// const AssignedTrainings = ({ trainings }) => {
//   if (trainings.length === 0) {
//     return <p>No trainings assigned yet.</p>;
//   }

//   return (
//     <Row className="g-4">
//       {trainings.map((training) => (
//         <Col md={6} key={training.id}>
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

//               <p className="mb-1">
//                 <FaUsers className="me-2 text-warning" />
//                 <strong>Target Group:</strong> {training.target_group}
//               </p>
//             </Card.Body>
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default AssignedTrainings;


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

// // Helper function to check week ranges
// const isThisWeek = (date) => {
//   const now = new Date();
//   const start = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
//   const end = new Date(now.setDate(start.getDate() + 6)); // Saturday
//   const check = new Date(date);
//   return check >= start && check <= end;
// };

// const AssignedTrainings = ({ trainings }) => {
//   const navigate = useNavigate();

//   if (trainings.length === 0) {
//     return <p>No trainings assigned yet.</p>;
//   }

//   const handleCardClick = (code) => {
//     navigate(`/trainings/${code}`);
//   };

//   // Convert to Date for sorting and filtering
//   const today = new Date();

//   const sortedTrainings = [...trainings].sort(
//     (a, b) => new Date(a.start_date) - new Date(b.start_date)
//   );

//   const thisWeekTrainings = sortedTrainings.filter((t) =>
//     isThisWeek(t.start_date)
//   );

//   const upcomingTrainings = sortedTrainings.filter(
//     (t) => new Date(t.start_date) > new Date() && !isThisWeek(t.start_date)
//   );

//   const pastTrainings = sortedTrainings.filter(
//     (t) => new Date(t.end_date) < new Date()
//   );

//   const renderSection = (title, list) => (
//     <>
//       {list.length > 0 && (
//         <>
//           <h4 className="fw-bold my-4">{title}</h4>
//           <Row className="g-4">
//             {list.map((training) => (
//               <Col md={6} key={training.code}>
//                 <Card
//                   className="h-100 shadow-sm border-0"
//                   style={{
//                     backgroundColor: "#f9fbfd",
//                     borderRadius: "12px",
//                     padding: "10px",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => handleCardClick(training.code)}
//                 >
//                   <Card.Body>
//                     <h5 className="fw-bold mb-2 text-primary">{training.name}</h5>

//                     <p className="mb-1">
//                       <FaMapMarkerAlt className="me-2 text-danger" />
//                       <strong>Venue:</strong> {training.venue}
//                     </p>

//                     <p className="mb-1">
//                       <FaCalendarAlt className="me-2 text-success" />
//                       <strong>Dates:</strong> {training.start_date} to{" "}
//                       {training.end_date}
//                     </p>

//                     <p className="mb-0">
//                       <FaUsers className="me-2 text-warning" />
//                       <strong>Target Group:</strong> {training.target_group}
//                     </p>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </>
//       )}
//     </>
//   );

//   return (
//     <div>
//       {renderSection("This Week Training", thisWeekTrainings)}
//       {renderSection("Upcoming Training", upcomingTrainings)}
//       {renderSection("Past Training", pastTrainings)}
//     </div>
//   );
// };

// export default AssignedTrainings;   








import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Helper function to check week ranges
const isThisWeek = (date) => {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
  const end = new Date(now.setDate(start.getDate() + 6)); // Saturday
  const check = new Date(date);
  return check >= start && check <= end;
};

const AssignedTrainings = ({ trainings }) => {
  const navigate = useNavigate();

  if (trainings.length === 0) {
    return <p>No trainings assigned yet.</p>;
  }

  const handleCardClick = (code) => {
    navigate(`/trainings/${code}`);
  };

  // Sort and categorize trainings
  const sortedTrainings = [...trainings].sort(
    (a, b) => new Date(a.start_date) - new Date(b.start_date)
  );

  const thisWeekTrainings = sortedTrainings.filter((t) =>
    isThisWeek(t.start_date)
  );

  const upcomingTrainings = sortedTrainings.filter(
    (t) => new Date(t.start_date) > new Date() && !isThisWeek(t.start_date)
  );

  const pastTrainings = sortedTrainings.filter(
    (t) => new Date(t.end_date) < new Date()
  );

  const renderSection = (title, list) => (
    <>
      {list.length > 0 && (
        <>
          <h4 className="fw-bold my-4">{title}</h4>
          <Row className="g-4">
            {list.map((training) => (
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

                    {/* ✅ Specific Generate Certificates button inside the card */}
                    <button
                      className="btn btn-outline-primary mt-2"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent full card click
                        navigate(`/generate-certificate/${training.code}`);
                      }}
                    >
                      Generate Certificates
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );

  return (
    <div>
      {renderSection("This Week Training", thisWeekTrainings)}
      {renderSection("Upcoming Training", upcomingTrainings)}
      {renderSection("Past Training", pastTrainings)}
    </div>
  );
};

export default AssignedTrainings;

