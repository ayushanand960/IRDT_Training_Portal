import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'animate.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();

  let clickTimeout = null;

  const handleProfileClick = () => {
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      document.getElementById('profileUpload').click(); // double click
    } else {
      clickTimeout = setTimeout(() => {
        setShowPanel(!showPanel); // single click
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }, 250);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_photo', file);

    try {
      const res = await axiosInstance.put('/login/user/profile/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfilePhoto(res.data.profile_photo);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

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
      const res = await axiosInstance.get('/training/list/');
      if (res.data?.length) setTrainings(res.data);
      else setTrainings(getDefaultTrainings());
    } catch {
      setTrainings(getDefaultTrainings());
    }
  };

  const getDefaultTrainings = () => [
    {
      title: "AI in Technical Education",
      description: "Explore AI integration in teaching.",
      start_date: "2025-07-10",
      end_date: "2025-07-13"
    },
    {
      title: "Digital Assessment Tools",
      description: "Learn to use online tools.",
      start_date: "2025-07-05",
      end_date: "2025-07-07"
    },
    {
      title: "Finished Past Training",
      description: "Completed training module.",
      start_date: "2025-06-01",
      end_date: "2025-06-05"
    }
  ];

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

  useEffect(() => {
    fetchUser();
    fetchTrainings();
  }, []);

  const { upcoming, ongoing, past } = categorizeTrainings();
  const fullName = `${user?.first_name || ''} ${user?.middle_name || ''} ${user?.last_name || ''}`.trim();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark px-4" style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}>
        <span className="navbar-brand text-info fw-bold fs-4">📘 TRAINEE DASHBOARD</span>
        <div className="d-flex align-items-center">
          <label onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <img
              src={profilePhoto || "https://placehold.co/100x120?text=Upload"}
              alt="Profile"
              className="profile-passport"
              style={{ height: "60px", width: "48px", borderRadius: "6px", border: "2px solid #fff" }}
            />
          </label>
          <input id="profileUpload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>
      </nav>

      {/* Profile Panel */}
 {showPanel && (
  <div
    className="profile-slide-panel animate__animated animate__slideInRight"
    style={{
      position: 'fixed',
      top: '70px',
      right: '0',
      width: '360px',
      height: 'calc(100vh - 70px)',
      background: '#fff',
      borderLeft: '1px solid #dee2e6',
      zIndex: 1050,
      boxShadow: '-3px 0 10px rgba(0,0,0,0.08)',
      overflowY: 'auto',
      padding: '20px'
    }}
  >
    {/* Tabs Navigation (now including Logout) */}
    <div className="d-flex flex-column gap-2 mb-4">
      {['details', 'past', 'certs', 'upload', 'logout'].map(tab => (
        <button
          key={tab}
          className={`btn btn-sm w-100 text-start ${activeTab === tab ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => {
            if (tab === 'logout') handleLogout();
            else setActiveTab(tab);
          }}
        >
          {tab === 'details' && '👤 Personal Details'}
          {tab === 'past' && '📚 Past Trainings'}
          {tab === 'certs' && '📜 Certificates'}
          {tab === 'upload' && '📤 Upload Certificate'}
          {tab === 'logout' && '🚪 Logout'}
        </button>
      ))}
    </div>

    {/* Section Content */}
    <div className="pt-1">
      {activeTab === 'details' && (
        <div>
          <h6 className="text-primary mb-3">👤 Personal Details</h6>
          <p><strong>Name:</strong> {fullName}</p>
          <p><strong>EHRMS:</strong> {user?.ehrms_code}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Mobile:</strong> {user?.mobile_number}</p>
          <p><strong>Institute:</strong> {user?.institute_name}</p>
        </div>
      )}

      {activeTab === 'past' && (
        <div>
          <h6 className="text-success mb-3">📚 Past Trainings</h6>
          <ul className="ps-3 small">
            {past.map((t, i) => (
              <li key={i} className="mb-1">
                <strong>{t.title}</strong><br />
                <span className="text-muted">{t.start_date} - {t.end_date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'certs' && (
        <div>
          <h6 className="text-info mb-3">📜 Certificates</h6>
          <p className="text-muted small">No certificates uploaded yet.</p>
        </div>
      )}

      {activeTab === 'upload' && (
        <div>
          <h6 className="text-warning mb-3">📤 Upload Certificate</h6>
          <form>
            <div className="mb-2">
              <input type="text" placeholder="Training Name" className="form-control form-control-sm" />
            </div>
            <div className="mb-2">
              <input type="text" placeholder="Subject" className="form-control form-control-sm" />
            </div>
            <div className="mb-2">
              <input type="text" placeholder="Duration" className="form-control form-control-sm" />
            </div>
            <div className="mb-2">
              <input type="text" placeholder="Certificate Number" className="form-control form-control-sm" />
            </div>
            <div className="mb-2">
              <input type="file" className="form-control form-control-sm" />
            </div>
            <button className="btn btn-success btn-sm w-100 mt-2">Submit</button>
          </form>
        </div>
      )}
    </div>
  </div>
)}


      {/* Main Trainings & Announcements */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            <TrainingSection title="Ongoing Trainings" items={ongoing} color="primary" />
            <TrainingSection title="Upcoming Trainings" items={upcoming} color="info" showEnroll />
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

const TrainingSection = ({ title, items, color, showEnroll = false }) => {
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
        {items.map((training, idx) => (
          <div key={idx} className="col-12 mb-3">
            <div
              className="card training-card shadow-sm"
              style={{ borderLeft: `6px solid ${borderColors[color] || '#007bff'}` }}
            >
              <div className="card-body">
                <h6 className="training-title">{training.title}</h6>
                <p className="mb-1"><strong>📅 Start:</strong> {training.start_date}</p>
                <p className="mb-1"><strong>🏁 End:</strong> {training.end_date}</p>
                <p className="mb-2"><strong>📝 Description:</strong> {training.description}</p>
                {showEnroll && <button className="btn btn-outline-primary btn-sm">Enroll</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Dashboard;
