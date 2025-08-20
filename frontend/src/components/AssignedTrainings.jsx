

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
  // ✅ Prevent crash if trainings is undefined or not an array
  if (!Array.isArray(trainings) || trainings.length === 0) {
    return <p>No trainings assigned yet.</p>;
  }

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
                    <h5 className="fw-bold mb-2" style={{ color: "#006666" }}>
                      ({training.code}) {training.name}
                    </h5>

                    <p className="mb-1 text-dark">
                      <FaMapMarkerAlt className="me-2" style={{ color: "#dc3545" }} /> {/* Bootstrap danger */}
                      <strong>Venue:</strong> {training.venue}
                    </p>

                    <p className="mb-1 text-dark">
                      <FaCalendarAlt className="me-2" style={{ color: "#28a745" }} /> {/* Bootstrap success */}
                      <strong>Dates:</strong> {training.start_date} to {training.end_date}
                    </p>

                    <p className="mb-3 text-dark">
                      <FaUsers className="me-2" style={{ color: "#ffc107" }} /> {/* Bootstrap warning */}
                      <strong>Target Group:</strong> {training.target_group}
                    </p>


                    {/* ✅ Specific Generate Certificates button inside the card */}
                    <button
                      className="btn btn-outline-primary mt-2"
                      style={{
                        borderColor: "#006666",
                        color: "#006666",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#006666";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#006666";
                      }}
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

