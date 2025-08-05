

import React from 'react';
import { Badge } from 'react-bootstrap';
import EnrollButton from './EnrollButton';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers , FaChalkboardTeacher, FaChartLine, FaLaptopHouse } from 'react-icons/fa';

const TrainingCard = ({
  training,
  showEnrollButton,
  enrolledTrainings,
  ehrmsCode,
  onEnrollSuccess,
}) => {
  const {
    name,
    target_group,
    venue,
    mode,
    start_date,
    end_date,
    faculty,
    faculty_name_display,
    number_of_participants,
    registered_count = 0,
    remarks,
    status,
    code,
  } = training;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

 return (
  <div
    className="card shadow-sm border-0 rounded-4"
    style={{
      backgroundColor: "#ffffff",
      height: "100%",
      borderLeft: "5px solid #006666",
    }}
  >
    <div className="card-body px-4 py-3 d-flex flex-column h-100">

      {/* Title */}
      <h6 className="fw-bold text-center mb-3" style={{ fontSize: '1.1rem', color: '#006666' }}>
        📚 ({code}) {name}
      </h6>

      {/* Badges */}
      <div className="d-flex justify-content-end mb-3 flex-wrap">
        {remarks?.toLowerCase().includes("technical") && (
          <Badge bg="info" className="me-1 mb-1 rounded-pill px-3">🛠️ Technical</Badge>
        )}
        {remarks?.toLowerCase().includes("pedagogy") && (
          <Badge bg="danger" className="me-1 mb-1 rounded-pill px-3">📖 Pedagogy</Badge>
        )}
        {status === "Open" && (
          <Badge bg="success" className="mb-1 rounded-pill px-3">✅ Open</Badge>
        )}
      </div>

      {/* Info */}
      <div className="flex-grow-1 text-start small text-dark">
        <p className="mb-2">
          <FaMapMarkerAlt className="me-2 text-danger" />
          <strong>Venue:</strong> {venue}
        </p>
        <p className="mb-2">
          <FaCalendarAlt className="me-2 text-success" />
          <strong>Dates:</strong> {formatDate(start_date)} to {formatDate(end_date)}
        </p>
        <p className="mb-2">
          <FaUsers className="me-2 text-warning" />
          <strong>Group:</strong> {target_group}
        </p>
        <p className="mb-2">
          <FaChalkboardTeacher className="me-2 text-primary" />
          <strong>Coordinator:</strong> {faculty_name_display || faculty || "N/A"}
        </p>
        <p className="mb-2">
          <FaChartLine className="me-2 text-success" />
          <strong>Participants:</strong> {registered_count}/{number_of_participants}
        </p>
        <p className="mb-1">
          <FaLaptopHouse className="me-2 text-info" />
          <strong>Mode:</strong> {mode}
        </p>


      </div>

      {/* Enroll Button */}
      {showEnrollButton && (
        <div className="text-center mt-3">
          <EnrollButton
            trainingCode={code}
            enrolledTrainings={enrolledTrainings}
            ehrmsCode={ehrmsCode}
            onEnrollSuccess={onEnrollSuccess}
            trainingDetails={training}
          />
        </div>
      )}
    </div>
  </div>
);
};
 export default TrainingCard;