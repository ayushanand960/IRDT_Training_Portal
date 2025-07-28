// // src/pages/TraineeDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import { toast } from 'react-toastify';

// const TraineeDashboard = () => {
//   const [assignedTrainings, setAssignedTrainings] = useState([]);

//   const fetchAssignedTrainings = async () => {
//     try {
//       const res = await axiosInstance.get('/trainings/assigned/');
//       setAssignedTrainings(res.data);
//     } catch (err) {
//       toast.error("Failed to load assigned trainings");
//     }
//   };
//     // ✅ NEW: Download certificate for a given training code
//   const handleDownload = async (code) => {
//     try {
//       const res = await axiosInstance.get(`/certificate/download/${code}/`, {
//         responseType: 'blob',
//       });

//       const blob = new Blob([res.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${code}_certificate.pdf`;
//       a.click();
//     } catch (error) {
//       toast.error("Failed to download certificate");
//     }
//   };

//   useEffect(() => {
//     fetchAssignedTrainings();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2>Trainee Dashboard</h2>
//       <h4>Your Trainings</h4>
//       <ul className="list-group">
//         {assignedTrainings.map((training) => (
//           <li key={training.id} className="list-group-item d-flex justify-content-between align-items-center">
//             <div>
//               <strong>{training.name}</strong><br />
//               <span>{training.venue} | {training.start_date} to {training.end_date}</span>
//             </div>

//             {/* ✅ NEW: Certificate Download Button */}
//             <button
//               className="btn btn-sm btn-primary"
//               onClick={() => handleDownload(training.code)}
//             >
//               Download Certificate
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TraineeDashboard;

 
// src/pages/TraineeDashboard.jsx


// --------------------------------------------------------------------------------------------------------
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import { toast } from 'react-toastify';
// import AllCertificatesModal from '../components/AllCertificatesModal'; // ✅ NEW

// const TraineeDashboard = () => {
//   const [assignedTrainings, setAssignedTrainings] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCode, setSelectedCode] = useState(null);
//   const [certificateURL, setCertificateURL] = useState(null);

//   const [allCertificates, setAllCertificates] = useState([]); // ✅ NEW
//   const [showAllModal, setShowAllModal] = useState(false);     // ✅ NEW

//   // 🔁 Fetch trainings assigned to user
//   const fetchAssignedTrainings = async () => {
//     try {
//       const res = await axiosInstance.get('training/trainings/assigned/');
//       setAssignedTrainings(res.data);
//     } catch (err) {
//       toast.error("Failed to load assigned trainings");
//     }
//   };

//   // 🔁 Fetch all certificates (for "View All" modal)
//   const fetchAllCertificates = async () => {
//     try {
//       const res = await axiosInstance.get('certificate/list/');
//       setAllCertificates(res.data);
//       setShowAllModal(true);
//     } catch (error) {
//       toast.error("Failed to load certificates");
//     }
//   };

//   // 👁️ Open modal with certificate preview
//   const handlePreview = async (code) => {
//     setSelectedCode(code);
//     try {
//       const res = await axiosInstance.get(`/certificate/download/${code}/`, {
//         responseType: 'blob',
//       });
//       const blob = new Blob([res.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       setCertificateURL(url);
//       setShowModal(true);
//     } catch (error) {
//       toast.error("Failed to load certificate preview");
//     }
//   };

//   // ⬇️ Trigger browser download
//   const handleDownload = () => {
//     if (!certificateURL || !selectedCode) return;
//     const a = document.createElement('a');
//     a.href = certificateURL;
//     a.download = `${selectedCode}_certificate.pdf`;
//     a.click();
//   };

//   // 🧠 Load data on mount
//   useEffect(() => {
//     fetchAssignedTrainings();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2>Trainee Dashboard</h2>
//         {/* 🔘 View All Certificates Button */}
//         <button className="btn btn-primary" onClick={fetchAllCertificates}>
//           View All Certificates
//         </button>
//       </div>

//       <h4 className="mt-4">Your Trainings</h4>

//       <ul className="list-group">
//         {assignedTrainings.length === 0 && (
//           <li className="list-group-item text-muted">No trainings assigned.</li>
//         )}

//         {assignedTrainings.map((training) => (
//           <li
//             key={training.id}
//             className="list-group-item d-flex justify-content-between align-items-center"
//           >
//             <div>
//               <strong>{training.name}</strong><br />
//               <span>{training.venue} | {training.start_date} to {training.end_date}</span>
//             </div>

//             {/* 🎓 Only show View Certificate if generated */}
//             {training.certificate_generated && (
//               <button
//                 className="btn btn-sm btn-success"
//                 onClick={() => handlePreview(training.code)}
//               >
//                 View Certificate
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>

//       {/* 📄 Modal for viewing & downloading single certificate */}
//       <CertificateModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         certificateURL={certificateURL}
//         onDownload={handleDownload}
//       />

//       {/* 🧾 Modal for viewing all certificates */}
//       <AllCertificatesModal
//         show={showAllModal}
//         onClose={() => setShowAllModal(false)}
//         certificates={allCertificates}
//       />
//     </div>
//   );
// };

// export default TraineeDashboard;




import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import AllCertificatesModal from '../components/AllCertificatesModal';

const TraineeDashboard = () => {
  const [assignedTrainings, setAssignedTrainings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [certificateURL, setCertificateURL] = useState(null);

  const [showAllCertificatesModal, setShowAllCertificatesModal] = useState(false);
  const [allCertificates, setAllCertificates] = useState([]);

  // 🔁 Fetch all trainings where user is registered
  const fetchAssignedTrainings = async () => {
    try {
      const res = await axiosInstance.get('training/trainings/assigned/');
      setAssignedTrainings(res.data);
    } catch (err) {
      toast.error("Failed to load assigned trainings");
    }
  };

  // 🧾 Fetch all certificates
  const fetchAllCertificates = async () => {
    try {
      const res = await axiosInstance.get('/certificate/my-certificates/');
      setAllCertificates(res.data);
      setShowAllCertificatesModal(true);
    } catch (err) {
      toast.error("Failed to load certificates");
    }
  };

  // 👁️ Open modal with certificate preview
  const handlePreview = async (code) => {
    setSelectedCode(code);
    try {
      const res = await axiosInstance.get(`/certificate/download/${code}/`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setCertificateURL(url);
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to load certificate preview");
    }
  };

  // ⬇️ Trigger browser download
  const handleDownload = () => {
    if (!certificateURL || !selectedCode) return;
    const a = document.createElement('a');
    a.href = certificateURL;
    a.download = `${selectedCode}_certificate.pdf`;
    a.click();
  };

  useEffect(() => {
    fetchAssignedTrainings();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Trainee Dashboard</h2>

      {/* ✅ Top-level View All Certificates button */}
      <div className="text-end mb-3">
        <button className="btn btn-primary" onClick={fetchAllCertificates}>
          View All Certificates
        </button>
      </div>

      <h4 className="mt-4">Your Trainings</h4>

      <ul className="list-group">
        {assignedTrainings.length === 0 && (
          <li className="list-group-item text-muted">No trainings assigned.</li>
        )}

        {assignedTrainings.map((training) => (
          <li
            key={training.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{training.name}</strong><br />
              <span>{training.venue} | {training.start_date} to {training.end_date}</span>
            </div>

            {training.certificate_generated && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => handlePreview(training.code)}
              >
                View Certificate
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* 📄 Single certificate modal */}
      {/* <CertificateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        certificateURL={certificateURL}
        onDownload={handleDownload}
      /> */}

      {/* 📋 All certificates modal */}
      <AllCertificatesModal
        show={showAllCertificatesModal}
        onClose={() => setShowAllCertificatesModal(false)}
        certificates={allCertificates}
      />
    </div>
  );
};

export default TraineeDashboard;
