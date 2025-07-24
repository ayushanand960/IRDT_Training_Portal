import React from 'react';
import { Badge } from 'react-bootstrap';
import EnrollButton from './EnrollButton';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

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
      style={{ backgroundColor: '#f8f9fd', height: '100%' }}
    >
      <div className="card-body px-3 py-2 d-flex flex-column h-100">

        {/* Title - Centered */}
        <h6 className="fw-bold text-primary text-center mb-2" style={{ fontSize: '1rem' }}>
          {name}
        </h6>

        {/* Badges - Right aligned */}
        <div className="d-flex justify-content-end mb-2">
          {remarks?.toLowerCase().includes('technical') && (
            <Badge bg="info" className="me-1">Technical</Badge>
          )}
          {remarks?.toLowerCase().includes('pedagogy') && (
            <Badge bg="danger" className="me-1">Pedagogy</Badge>
          )}
          {status === 'Open' && <Badge bg="success">Open</Badge>}
        </div>

        {/* Info - All Left aligned */}
        <div className="flex-grow-1 text-start">
          <p className="mb-1">
            <FaMapMarkerAlt className="me-1 text-danger" />
            <strong>Venue:</strong> {venue}
          </p>
          <p className="mb-1">
            <FaCalendarAlt className="me-1 text-success" />
            <strong>Dates:</strong> {formatDate(start_date)} to {formatDate(end_date)}
          </p>
          <p className="mb-1">
            <FaUsers className="me-1 text-warning" />
            <strong>Group:</strong> {target_group}
          </p>
          <p className="mb-1">
            <strong>🧑🏻‍💻 Faculty:</strong> {faculty_name_display || faculty || 'N/A'}
          </p>
          <p className="mb-2">
            <strong>📈 Participants:</strong> {registered_count}/{number_of_participants}
          </p>
           <p className="mb-1">
            <FaUsers className="me-1 text-warning" />
            <strong>Mode:</strong> {mode}
          </p>
          
        </div>

        {/* Enroll Button */}
        {showEnrollButton && (
          <EnrollButton
            trainingCode={code}
            enrolledTrainings={enrolledTrainings}
            ehrmsCode={ehrmsCode}
            onEnrollSuccess={onEnrollSuccess}
            trainingDetails={training} 
          />
        )}
      </div>
    </div>
  );
};

export default TrainingCard;





