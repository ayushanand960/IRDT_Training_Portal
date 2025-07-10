
// import React, { useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import { toast } from 'react-toastify';

// const EnrollButton = ({ trainingCode, enrolledTrainings, onEnrollSuccess, ehrmsCode }) => {
//   const [loading, setLoading] = useState(false);

//   const isAlreadyEnrolled = enrolledTrainings?.includes(trainingCode);

//   const handleEnroll = async () => {
//     if (isAlreadyEnrolled) {
//       toast.info('ℹ️ Already enrolled.');
//       return;
//     }

//     setLoading(true);
//     try {
//       await axiosInstance.post('/enrollment/enroll/', {
//         trainee: ehrmsCode,
//         training: trainingCode,
//       });
//       toast.success('✅ Enrolled!');
//       if (onEnrollSuccess) onEnrollSuccess(trainingCode);
//     } catch (error) {
//       console.error("Enrollment error:", error.response?.data);
//       toast.error("⚠️ " + (error.response?.data?.trainee || error.response?.data?.training || "You have already enrolled."));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleEnroll}
//       disabled={isAlreadyEnrolled || loading}
//       className={`btn btn-${isAlreadyEnrolled ? "success" : "outline-primary"} btn-sm`}
//     >
//       {isAlreadyEnrolled ? '✅ Enrolled' : loading ? 'Processing...' : 'Enroll'}
//     </button>
//   );
// };

// export default EnrollButton;






import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const EnrollButton = ({ trainingCode, enrolledTrainings = [], onEnrollSuccess, ehrmsCode }) => {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  // Sync prop with local state
  useEffect(() => {
    setEnrolled(enrolledTrainings.includes(trainingCode));
  }, [enrolledTrainings, trainingCode]);

  const handleEnroll = async () => {
    if (enrolled) {
      toast.info('ℹ️ Already enrolled.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/enrollment/enroll/', {
        trainee: ehrmsCode,
        training: trainingCode,
      });

      toast.success('✅ Enrolled!');
      setEnrolled(true); // Local UI update
      if (onEnrollSuccess) onEnrollSuccess(trainingCode); // Propagate change to parent
    } catch (error) {
      console.error('Enrollment error:', error.response?.data || error);
      toast.error(
        '⚠️ ' +
          (error.response?.data?.trainee ||
            error.response?.data?.training ||
            'You have already enrolled.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={enrolled || loading}
      className={`btn btn-${enrolled ? 'success' : 'outline-primary'} btn-sm`}
    >
      {enrolled ? '✅ Enrolled' : loading ? 'Processing...' : 'Enroll'}
    </button>
  );
};

export default EnrollButton;
