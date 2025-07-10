// // Dashboard_sample.jsx
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../App.css';
// import 'animate.css';

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [trainings, setTrainings] = useState([]);
//   const [enrolledTrainings, setEnrolledTrainings] = useState([]);
//   const [profilePhoto, setProfilePhoto] = useState('');
//   const [showPanel, setShowPanel] = useState(false);
//   const [activeTab, setActiveTab] = useState('details');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUser();
//     fetchTrainings();
//     fetchEnrollments();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await axiosInstance.get('/login/user/profile/');
//       setUser(res.data);
//       setProfilePhoto(res.data.profile_photo);
//     } catch {
//       navigate('/login');
//     }
//   };

//   const fetchTrainings = async () => {
//     try {
//       const res = await axiosInstance.get('/training/training-programs/');
//       setTrainings(res.data);
//     } catch (error) {
//       console.error('Error fetching trainings:', error);
//     }
//   };

//   const fetchEnrollments = async () => {
//     try {
//       const res = await axiosInstance.get('/enrollment/my-enrollments/');
//       const codes = res.data.map((e) => e.training.code);
//       setEnrolledTrainings(codes);
//     } catch (error) {
//       console.error('Error fetching enrollments:', error);
//     }
//   };

//   const handleEnroll = async (code) => {
//     try {
//       if (!user?.ehrms_code) {
//         toast.error("EHRMS code not found.");
//         return;
//       }

//       if (enrolledTrainings.includes(code)) {
//         toast.info("⚠️ Already enrolled.");
//         return;
//       }

//       await axiosInstance.post('/enrollment/enroll/', {
//         ehrms_code: user.ehrms_code,
//         training: code
//       });

//       setEnrolledTrainings([...enrolledTrainings, code]);
//       toast.success("✅ Successfully enrolled!");
//     } catch (error) {
//       if (error.response?.status === 400) {
//         toast.error("⚠️ Already enrolled or invalid training.");
//       } else {
//         toast.error("Enrollment failed.");
//       }
//     }
//   };

//   const categorizeTrainings = () => {
//     const now = new Date();
//     const upcoming = [], ongoing = [], past = [];

//     trainings.forEach(t => {
//       const start = new Date(t.start_date);
//       const end = new Date(t.end_date);
//       if (end < now) past.push(t);
//       else if (start > now) upcoming.push(t);
//       else ongoing.push(t);
//     });

//     return { upcoming, ongoing, past };
//   };

//   const { upcoming, ongoing, past } = categorizeTrainings();
//   const fullName = `${user?.first_name || ''} ${user?.middle_name || ''} ${user?.last_name || ''}`.trim();

//   return (
//     <>
//       {/* Navbar */}
//       <nav className="navbar navbar-dark px-4" style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}>
//         <span className="navbar-brand text-info fw-bold fs-4">📘 TRAINEE DASHBOARD</span>
//         <div className="d-flex align-items-center">
//           <label onClick={() => document.getElementById('profileUpload').click()} style={{ cursor: 'pointer' }}>
//             <img
//               src={profilePhoto || "https://placehold.co/100x120?text=Upload"}
//               alt="Profile"
//               className="profile-passport"
//               style={{ height: "60px", width: "48px", borderRadius: "6px", border: "2px solid #fff" }}
//             />
//           </label>
//           <input id="profileUpload" type="file" accept="image/*" onChange={() => {}} style={{ display: 'none' }} />
//         </div>
//       </nav>

//       {/* Main Trainings */}
//       <div className="container mt-4">
//         <div className="row">
//           <div className="col-md-8">
//             <TrainingSection title="Ongoing Trainings" items={ongoing} color="primary" />
//             <TrainingSection
//               title="Upcoming Trainings"
//               items={upcoming}
//               color="info"
//               showEnroll
//               handleEnroll={handleEnroll}
//               enrolledTrainings={enrolledTrainings}
//             />
//             <TrainingSection title="Past Trainings" items={past} color="secondary" />
//           </div>
//           <div className="col-md-4">
//             <div className="card shadow border-info mb-3 bg-info-subtle p-3">
//               <h5 className="text-info">📢 Announcements</h5>
//               <ul>
//                 <li>📅 AI in Education begins July 7</li>
//                 <li>📝 OBE Workshop due July 10</li>
//                 <li>🎓 Cert Review July 12</li>
//               </ul>
//             </div>
//             <div className="card bg-light shadow-sm border border-primary p-3">
//               <h6 className="text-primary">🌟 Quote of the Day</h6>
//               <p className="mb-0">"Success is no accident. It’s hard work, perseverance, and love of what you are doing."</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const TrainingSection = ({ title, items, color, showEnroll = false, handleEnroll, enrolledTrainings = [] }) => {
//   if (!items.length) return null;

//   const borderColors = {
//     primary: '#007bff',
//     info: '#17a2b8',
//     secondary: '#6c757d'
//   };

//   return (
//     <div className="mb-4">
//       <h5 className={`text-${color} fw-bold mb-3`}>{title}</h5>
//       <div className="row">
//         {items.map((training, idx) => {
//           const isEnrolled = enrolledTrainings.includes(training.code);

//           return (
//             <div key={idx} className="col-12 mb-3">
//               <div className="card training-card shadow-sm" style={{ borderLeft: `6px solid ${borderColors[color]}` }}>
//                 <div className="card-body">
//                   <h6 className="training-title">{training.name || training.title}</h6>
//                   <p className="mb-1"><strong>📅 Start:</strong> {training.start_date}</p>
//                   <p className="mb-1"><strong>🏁 End:</strong> {training.end_date}</p>
//                   <p className="mb-2"><strong>📝 Description:</strong> {training.description || "—"}</p>

//                   {showEnroll && (
//                     <button
//                       className={`btn btn-${isEnrolled ? "success" : "outline-primary"} btn-sm`}
//                       onClick={() => !isEnrolled && handleEnroll(training.code)}
//                       disabled={isEnrolled}
//                     >
//                       {isEnrolled ? "✅ Enrolled" : "Enroll"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EnrollButton from '../components/EnrollButton'; // ✅ make sure you have this file
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'animate.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [enrolledTrainings, setEnrolledTrainings] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchTrainings();
    fetchEnrollments();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get('/login/user/profile/');
      setUser(res.data);
      setProfilePhoto(res.data.profile_photo);
    } catch {
      navigate('/login');
    }
  };

  const fetchTrainings = async () => {
    try {
      const res = await axiosInstance.get('/training/training-programs/');
      setTrainings(res.data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await axiosInstance.get('/enrollment/my-enrollments/');
      const codes = res.data.map((e) => e.training.code);
      setEnrolledTrainings(codes);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const categorizeTrainings = () => {
    const now = new Date();
    const upcoming = [], ongoing = [], past = [];

    trainings.forEach(t => {
      const start = new Date(t.start_date);
      const end = new Date(t.end_date);
      if (end < now) past.push(t);
      else if (start > now) upcoming.push(t);
      else ongoing.push(t);
    });

    return { upcoming, ongoing, past };
  };

  const { upcoming, ongoing, past } = categorizeTrainings();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark px-4" style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}>
        <span className="navbar-brand text-info fw-bold fs-4">📘 TRAINEE DASHBOARD</span>
        <div className="d-flex align-items-center">
          <label onClick={() => document.getElementById('profileUpload').click()} style={{ cursor: 'pointer' }}>
            <img
              src={profilePhoto || "https://placehold.co/100x120?text=Upload"}
              alt="Profile"
              className="profile-passport"
              style={{ height: "60px", width: "48px", borderRadius: "6px", border: "2px solid #fff" }}
            />
          </label>
          <input id="profileUpload" type="file" accept="image/*" onChange={() => {}} style={{ display: 'none' }} />
        </div>
      </nav>

      {/* Main Trainings */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            <TrainingSection title="Ongoing Trainings" items={ongoing} color="primary" />
            <TrainingSection
              title="Upcoming Trainings"
              items={upcoming}
              color="info"
              showEnroll
              enrolledTrainings={enrolledTrainings}
              ehrmsCode={user?.ehrms_code}
              onEnrollSuccess={(code) => setEnrolledTrainings([...enrolledTrainings, code])}
            />
            <TrainingSection title="Past Trainings" items={past} color="secondary" />
          </div>
          <div className="col-md-4">
            <div className="card shadow border-info mb-3 bg-info-subtle p-3">
              <h5 className="text-info">📢 Announcements</h5>
              <ul>
                <li>📅 AI in Education begins July 7</li>
                <li>📝 OBE Workshop due July 10</li>
                <li>🎓 Cert Review July 12</li>
              </ul>
            </div>
            <div className="card bg-light shadow-sm border border-primary p-3">
              <h6 className="text-primary">🌟 Quote of the Day</h6>
              <p className="mb-0">"Success is no accident. It’s hard work, perseverance, and love of what you are doing."</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TrainingSection = ({ title, items, color, showEnroll = false, enrolledTrainings = [], ehrmsCode, onEnrollSuccess }) => {
  if (!items.length) return null;

  const borderColors = {
    primary: '#007bff',
    info: '#17a2b8',
    secondary: '#6c757d'
  };

  return (
    <div className="mb-4">
      <h5 className={`text-${color} fw-bold mb-3`}>{title}</h5>
      <div className="row">
        {items.map((training, idx) => {
          const isEnrolled = enrolledTrainings.includes(training.code);

          return (
            <div key={idx} className="col-12 mb-3">
              <div className="card training-card shadow-sm" style={{ borderLeft: `6px solid ${borderColors[color]}` }}>
                <div className="card-body">
                  <h6 className="training-title">{training.name || training.title}</h6>
                  <p className="mb-1"><strong>📅 Start:</strong> {training.start_date}</p>
                  <p className="mb-1"><strong>🏁 End:</strong> {training.end_date}</p>
                  <p className="mb-2"><strong>📝 Description:</strong> {training.description || "—"}</p>

                  {showEnroll && ehrmsCode && (
                    <EnrollButton
                      trainingCode={training.code}
                      enrolledTrainings={enrolledTrainings}
                      ehrmsCode={ehrmsCode}
                      onEnrollSuccess={onEnrollSuccess}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
