// import React from 'react';
// import { Badge } from 'react-bootstrap';
// import EnrollButton from './EnrollButton';
// import {
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaUsers,
// } from 'react-icons/fa';

// const TrainingCard = ({
//   training,
//   showEnrollButton,
//   enrolledTrainings,
//   ehrmsCode,
//   onEnrollSuccess,
// }) => {
//   const {
//     name,
//     target_group,
//     venue,
//     mode,
//     start_date,
//     end_date,
//     faculty,
//     faculty_name_display,
//     number_of_participants,
//     registered_count = 0,
//     remarks,
//     status,
//     code,
//   } = training;

//   const totalDays =
//     Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;
//   const seatsLeft = number_of_participants - registered_count;
//   const isFull = seatsLeft <= 0;
//   const progress = Math.min(100, (registered_count / number_of_participants) * 100);

//   const formatDate = (date) =>
//     new Date(date).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: '2-digit',
//     });

//   return (
//     <div
//       className="card mb-4 shadow-sm border-0 rounded-4 h-100"
//       style={{ backgroundColor: '#f8f9fd' }}
//     >
//       <div className="card-body p-4">
//         {/* Title */}
//         <div className="mb-3">
//           <h5
//             className="fw-bold text-primary text-center"
//             style={{ fontSize: '1.1rem', lineHeight: '1.4' }}
//           >
//             {name}
//           </h5>
//         </div>

//         {/* Badges */}
//         <div className="d-flex justify-content-end mb-3">
//           {remarks?.toLowerCase().includes('technical') && (
//             <Badge bg="info" className="me-1">
//               Technical
//             </Badge>
//           )}
//           {remarks?.toLowerCase().includes('pedagogy') && (
//             <Badge bg="danger" className="me-1">
//               Pedagogy
//             </Badge>
//           )}
//           {status === 'Open' && <Badge bg="success">Open</Badge>}
//         </div>

//         {/* Target Group Note */}
//         <p className="text-secondary fs-6 mb-3 fst-italic text-start">
//           Training for <strong>{target_group}</strong>
//         </p>

//         {/* Venue */}
//         <p className="mb-2 text-dark text-start">
//           <FaMapMarkerAlt className="me-2 text-danger" />
//           <strong>Venue:</strong> {venue}
//         </p>

//         {/* Dates */}
//         <p className="mb-2 text-dark text-start">
//           <FaCalendarAlt className="me-2 text-success" />
//           <strong>Dates:</strong> {formatDate(start_date)} to {formatDate(end_date)} (
//           {totalDays} days)
//         </p>

//         {/* Target Group */}
//         <p className="mb-2 text-dark text-start">
//           <FaUsers className="me-2 text-warning" />
//           <strong>Target Group:</strong> {target_group}
//         </p>

//         {/* Faculty */}
//         <p className="mb-2 text-dark text-start">
//           <strong>🧑🏻‍💻 Faculty:</strong>{' '}
//           {faculty_name_display || faculty || 'N/A'}
//         </p>

//         {/* Participants */}
//         <p className="mb-0 text-dark text-start">
//           <strong>📈 Participants:</strong> {registered_count}/
//           {number_of_participants}
//         </p>
//       </div>

//       {/* Enroll Button */}
//       {showEnrollButton && (
//         <div className="px-4 pb-4">
//           <EnrollButton
//             trainingCode={code}
//             enrolledTrainings={enrolledTrainings}
//             ehrmsCode={ehrmsCode}
//             onEnrollSuccess={onEnrollSuccess}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrainingCard;

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
          />
        )}
      </div>
    </div>
  );
};

export default TrainingCard;
