// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import { toast } from 'react-toastify';

// const EnrollButton = ({
//   trainingCode,
//   enrolledTrainings = [],
//   onEnrollSuccess,
//   ehrmsCode,
//   label = 'Apply' // ✅ Default label
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [enrolled, setEnrolled] = useState(false);

//   // Sync prop with local state
//   useEffect(() => {
//     setEnrolled(enrolledTrainings.includes(trainingCode));
//   }, [enrolledTrainings, trainingCode]);

//   const handleEnroll = async () => {
//     if (enrolled) {
//       toast.info('✅ applied.');
//       return;
//     }

//     setLoading(true);
//     try {
//       await axiosInstance.post('/enrollment/enroll/', {
//         trainee: ehrmsCode,
//         training: trainingCode,
//       });

//       toast.success('✅ Applied!');
//       setEnrolled(true);
//       if (onEnrollSuccess) onEnrollSuccess(trainingCode);
//     } catch (error) {
//       console.error('Enrollment error:', error.response?.data || error);
//       toast.error(
//         '⚠️ ' +
//           (error.response?.data?.trainee ||
//             error.response?.data?.training ||
//             'You have already applied.')
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleEnroll}
//       disabled={enrolled || loading}
//       className={`btn btn-${enrolled ? 'success' : 'outline-primary'} btn-sm`}
//     >
//       {enrolled ? '✅ Applied' : loading ? 'Processing...' : label}
//     </button>
//   );
// };

// export default EnrollButton;









import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import EnrollModal from "./EnrollModal";

const EnrollButton = ({
  trainingCode,
  enrolledTrainings = [],
  onEnrollSuccess,
  ehrmsCode,
  label = "Apply",
  trainingDetails // ✅ Pass full training object here
}) => {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setEnrolled(enrolledTrainings.includes(trainingCode));
  }, [enrolledTrainings, trainingCode]);

  const confirmEnroll = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/enrollment/enroll/", {
        trainee: ehrmsCode,
        training: trainingCode,
      });
      toast.success("✅ Applied!");
      setEnrolled(true);
      setShowModal(false);
      if (onEnrollSuccess) onEnrollSuccess(trainingCode);
    } catch (error) {
      console.error("Enrollment error:", error.response?.data || error);
      toast.error(
        "⚠️ " +
          (error.response?.data?.trainee ||
            error.response?.data?.training ||
            "You have already applied.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!enrolled) setShowModal(true);
          else toast.info("✅ Already applied.");
        }}
        disabled={enrolled}
        className={`btn btn-${enrolled ? "success" : "outline-primary"} btn-sm`}
      >
        {enrolled ? "✅ Applied" : loading ? "Processing..." : label}
      </button>

      <EnrollModal
        show={showModal}
        onHide={() => setShowModal(false)}
        training={trainingDetails}
        ehrmsCode={ehrmsCode}
        onConfirm={confirmEnroll}
      />
    </>
  );
};

export default EnrollButton;
