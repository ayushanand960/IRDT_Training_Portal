// src/components/UpcomingTrainings.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";
import dayjs from "dayjs";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLaptop,
  FaDoorOpen,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";

const UpcomingTrainings = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/training/training-programs");
        const now = dayjs();
        const cutoff = now.add(15, "day");

        const filtered = res.data.filter((training) => {
          const start = dayjs(training.start_date);
          return start.isAfter(now) && start.isBefore(cutoff);
        });

        setUpcoming(filtered);
      } catch (error) {
        console.error("Error fetching upcoming trainings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-4" />;

//   if (upcoming.length === 0) return <p>No upcoming trainings in next 15 days.</p>;

  return (
    <div className="mt-5">
      <div className="mb-4 py-2 px-3 bg-white rounded shadow-sm border-start border-4" style={{ borderColor: "#006666" }}>
        <h3 className="mb-0 fw-bold text-dark">
          📅 <span style={{ color: "#006666" }}>Upcoming Trainings</span> (Next 15 Days)
        </h3>
      </div>

      <Row className="g-4">
        {upcoming.map((training, index) => (
          <Col md={6} lg={4} key={training.id}>
            <Card
              className={`h-100 transition-card ${hoveredCard === index ? "hovered" : ""
                }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: "#006666",
                color: "#ffffff",
                border: "none",
                borderRadius: "14px",
                boxShadow: hoveredCard === index
                  ? "0 12px 30px rgba(0,0,0,0.3)"
                  : "0 6px 20px rgba(0,0,0,0.2)",
                transform: hoveredCard === index ? "scale(1.02)" : "scale(1)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <Card.Body>
                <h5 className="fw-bold mb-3 border-bottom pb-4" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                  <FaChalkboardTeacher className="me-2" />
                  {training.name}
                </h5>

                <p className="mb-2" style={{ fontSize: "1.05rem" }}>
                  <FaCalendarAlt className="me-2" />
                  <strong>Start:</strong> {training.start_date}
                </p>
                <p className="mb-2" style={{ fontSize: "1.05em" }}>
                  <FaCalendarAlt className="me-2" />
                  <strong>End:</strong> {training.end_date}
                </p>
                <p className="mb-2" style={{ fontSize: "1.05rem" }}>
                  <FaMapMarkerAlt className="me-2" />
                  <strong>Venue:</strong> {training.venue}
                </p>
                <p className="mb-2" style={{ fontSize: "1.05rem" }}>
                  <FaChalkboardTeacher className="me-2" />
                  <strong>Coordinator:</strong> {training.faculty_name_display || training.faculty || "N/A"}
                </p>


                <p className="mb-2" style={{ fontSize: "1.05rem" }}>
                  {training.mode === "Online" ? (
                    <FaLaptop className="me-2" />
                  ) : (
                    <FaDoorOpen className="me-2" />
                  )}
                  <strong>Mode:</strong> {training.mode}
                </p>
                <p className="mb-0" style={{ fontSize: "1.05rem" }}>
                  <FaUsers className="me-2" />
                  <strong>Participants:</strong> {training.number_of_participants || "N/A"}
                </p>
              </Card.Body>

            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UpcomingTrainings;


// src/components/UpcomingTrainings.jsx
// import React, { useEffect, useState } from "react";
// import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
// import axiosInstance from "../utils/axiosInstance";
// import dayjs from "dayjs";

// const UpcomingTrainings = () => {
//   const [upcoming, setUpcoming] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axiosInstance.get("/training/training-programs");
//         console.log("Fetched trainings:", res.data);

//         const now = dayjs();
//         const cutoff = now.add(15, "day");

//         const filtered = res.data.filter((training) => {
//           const start = dayjs(training.start_date);
//           return start.isAfter(now) && start.isBefore(cutoff);
//         });

//         console.log("Filtered upcoming trainings:", filtered);
//         setUpcoming(filtered);
//       } catch (error) {
//         console.error("Error fetching upcoming trainings", error.response?.data || error.message);
//         setError("Failed to load upcoming trainings. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <Spinner animation="border" className="mt-4" />;

//   return (
//     <div className="mt-5">
//       <h5 className="fw-bold text-dark mb-3">Upcoming Trainings (Next 15 Days)</h5>

//       {error && <Alert variant="danger">{error}</Alert>}

//       {upcoming.length === 0 ? (
//         <p>No upcoming trainings in the next 15 days.</p>
//       ) : (
//         <Row className="g-4">
//           {upcoming.map((training) => (
//             <Col md={6} lg={4} key={training.id}>
//               <Card className="h-100 shadow-sm">
//                 <Card.Body>
//                   <h6 className="fw-bold text-primary">{training.target_group}</h6>
//                   <p><strong>Start:</strong> {training.start_date}</p>
//                   <p><strong>End:</strong> {training.end_date}</p>
//                   <p><strong>Venue:</strong> {training.venue}</p>
//                   <p><strong>Mode:</strong> {training.mode}</p>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </div>
//   );
// };

// export default UpcomingTrainings;
