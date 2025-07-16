// import React from 'react';
// import { Badge, ProgressBar } from 'react-bootstrap';
// import {
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaBullseye,
//   FaChalkboardTeacher,
//   FaUsers,
//   FaLaptop,
// } from 'react-icons/fa';

// const TrainingCard = ({ training }) => {
//   const {
//     title,
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
//     <div className="card mb-4 shadow-sm border-0 rounded-4" style={{ backgroundColor: '#f8f9fd' }}>
//       <div className="card-body p-4">
//         {/* Title & Badges */}
//         <div className="d-flex justify-content-between align-items-start mb-3">
//           <h4 className="fw-semibold text-primary">{title}</h4>
//           <div className="text-end">
//             {remarks?.toLowerCase().includes('technical') && (
//               <Badge bg="info" className="me-1">Technical</Badge>
//             )}
//             {remarks?.toLowerCase().includes('pedagogy') && (
//               <Badge bg="danger" className="me-1">Pedagogy</Badge>
//             )}
//             {status === 'Open' && (
//               <Badge bg="success">Open</Badge>
//             )}
//           </div>
//         </div>

//         {/* Description */}
//         <p className="text-secondary fs-6 mb-3 fst-italic">
//           Training for <strong>{target_group}</strong>
//         </p>

//         {/* Training Info */}
//         <div className="row text-dark fs-6 mb-3">
//           <div className="col-md-6 col-lg-4 mb-2 d-flex align-items-center">
//             <FaCalendarAlt className="me-2" style={{ color: '#6f42c1' }} />
//             {formatDate(start_date)} - {formatDate(end_date)} ({totalDays} days)
//           </div>
//           <div className="col-md-6 col-lg-4 mb-2 d-flex align-items-center">
//             <FaMapMarkerAlt className="me-2" style={{ color: '#d63384' }} />
//             {venue}
//           </div>
//           <div className="col-md-6 col-lg-4 mb-2 d-flex align-items-center">
//             <FaBullseye className="me-2" style={{ color: '#198754' }} />
//             {target_group}
//           </div>
//           <div className="col-md-6 col-lg-4 mb-2 d-flex align-items-center">
//             <FaChalkboardTeacher className="me-2" style={{ color: '#fd7e14' }} />
//             {faculty_name_display || faculty}
//           </div>
//           <div className="col-md-6 col-lg-4 mb-2 d-flex align-items-center">
//             <FaUsers className="me-2" style={{ color: '#0d6efd' }} />
//             {registered_count}/{number_of_participants} participants
//           </div>
//           <div className="col-md-6 col-lg-4 mb-2 d-flex align-items-center">
//             <FaLaptop className="me-2" style={{ color: '#20c997' }} />
//             {mode}
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <ProgressBar
//           variant={isFull ? 'danger' : 'primary'}
//           now={progress}
//           className="rounded-pill shadow-sm"
//           label={isFull ? 'Training is full' : `${seatsLeft} seats available`}
//         />
//       </div>
//     </div>
//   );
// };
import React from 'react';
import { Badge, ProgressBar } from 'react-bootstrap';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBullseye,
  FaChalkboardTeacher,
  FaUsers,
  FaLaptop,
} from 'react-icons/fa';

const TrainingCard = ({ training }) => {
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
  } = training;

  const totalDays =
    Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) + 1;

  const seatsLeft = number_of_participants - registered_count;
  const isFull = seatsLeft <= 0;
  const progress = Math.min(100, (registered_count / number_of_participants) * 100);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

  return (
    <div
      className="card mb-4 border-0 rounded-4 shadow-sm h-100"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e6f0',
      }}
    >
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        {/* Title & Badges */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-start">
            {/* <h5 className="fw-bold text-dark mb-3 text-truncate" name={name}>
              {name}
            </h5> */}    
          <h5
  className="fw-bold text-dark mb-3"
  style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
>
  {name}
</h5>

                     
            <div className="text-end">
              {remarks?.toLowerCase().includes('technical') && (
                <Badge bg="info" className="me-1 fw-semibold">Tech</Badge>
              )}
              {remarks?.toLowerCase().includes('pedagogy') && (
                <Badge bg="danger" className="me-1 fw-semibold">Ped</Badge>
              )}
              {status === 'Open' && (
                <Badge bg="success" className="fw-semibold">Open</Badge>
              )}
            </div>
          </div>
          <p className="text-muted small mb-0">
            For <strong className="text-dark">{target_group}</strong>
          </p>
        </div>

        {/* Info Section */}
        <div className="mb-3 text-dark small fw-medium">
          <div className="d-flex align-items-center mb-2">
            <FaCalendarAlt className="me-2 text-primary" />
            <span>{formatDate(start_date)} – {formatDate(end_date)} ({totalDays} days)</span>
          </div>
          <div className="d-flex align-items-center mb-2 text-truncate">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <span title={venue}>{venue}</span>
          </div>
          <div className="d-flex align-items-center mb-2 text-truncate">
            <FaChalkboardTeacher className="me-2 text-warning" />
            <span title={faculty_name_display || faculty}>
              {faculty_name_display || faculty}
            </span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <FaUsers className="me-2 text-success" />
            <span>{registered_count}/{number_of_participants} participants</span>
          </div>
          <div className="d-flex align-items-center">
            <FaLaptop className="me-2 text-info" />
            <span>{mode}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          {/* <ProgressBar
            now={progress}
            variant={isFull ? 'danger' : 'primary'}
            className="rounded-pill"
            style={{ height: '10px' }}
          /> */}
          {/* <div className="text-end mt-1 fw-semibold small">
            {isFull ? (
              <span className="text-danger">Training is full</span>
            ) : (
              <span className="text-success">{seatsLeft} seats available</span>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;
