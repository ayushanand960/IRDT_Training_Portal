// // import React, { useState } from 'react';
// // import axiosInstance from '../utils/axiosInstance';
// // import { toast } from 'react-toastify';

// // const EnrollButton = ({ trainingCode, enrolledTrainings, onEnrollSuccess }) => {
// //   const [loading, setLoading] = useState(false);

// //   const isAlreadyEnrolled = enrolledTrainings?.includes(trainingCode);

// //   const handleEnroll = async () => {
// //     if (isAlreadyEnrolled) {
// //       toast.info('ℹ️ You are already enrolled.');
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       await axiosInstance.post('/enrollment/enroll/', { training: trainingCode });
// //       toast.success('✅ Enrolled successfully!');
// //       if (onEnrollSuccess) onEnrollSuccess(trainingCode); // notify parent
// //     } catch (error) {
// //       toast.error('⚠️ Already enrolled or enrollment failed.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <button
// //       onClick={handleEnroll}
// //       disabled={isAlreadyEnrolled || loading}
// //       className="btn btn-outline-primary btn-sm"
// //     >
// //       {isAlreadyEnrolled ? 'Enrolled' : loading ? 'Processing...' : 'Enroll'}
// //     </button>
// //   );
// // };

// // export default EnrollButton;



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
//       toast.error("⚠️ " + (error.response?.data?.trainee || error.response?.data?.training || "Enrollment failed."));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleEnroll}
//       disabled={isAlreadyEnrolled || loading}
//       className="btn btn-outline-primary btn-sm"
//     >
//       {isAlreadyEnrolled ? '✅ Enrolled' : loading ? 'Processing...' : 'Enroll'}
//     </button>
//   );
// };

// export default EnrollButton;


import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const EnrollButton = ({ trainingCode, enrolledTrainings, onEnrollSuccess, ehrmsCode }) => {
  const [loading, setLoading] = useState(false);

  const isAlreadyEnrolled = enrolledTrainings?.includes(trainingCode);

  const handleEnroll = async () => {
    if (isAlreadyEnrolled) {
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
      if (onEnrollSuccess) onEnrollSuccess(trainingCode);
    } catch (error) {
      console.error("Enrollment error:", error.response?.data);
      toast.error("⚠️ " + (error.response?.data?.trainee || error.response?.data?.training || "Enrollment failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={isAlreadyEnrolled || loading}
      className={`btn btn-${isAlreadyEnrolled ? "success" : "outline-primary"} btn-sm`}
    >
      {isAlreadyEnrolled ? '✅ Enrolled' : loading ? 'Processing...' : 'Enroll'}
    </button>
  );
};

export default EnrollButton;
