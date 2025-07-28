// src/pages/TraineeDashboard.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import AllCertificatesModal from '../components/AllCertificatesModal';
import { useNavigate } from 'react-router-dom';
import TrainingCard from '../components/TrainingCard';
import TrainingFilterBar from '../components/TrainingFilterBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'animate.css';

const TraineeDashboard = () => {
  const [assignedTrainings, setAssignedTrainings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [certificateURL, setCertificateURL] = useState(null);

  const [showAllCertificatesModal, setShowAllCertificatesModal] = useState(false);
  const [allCertificates, setAllCertificates] = useState([]);
  const [user, setUser] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [enrolledTrainings, setEnrolledTrainings] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [filters, setFilters] = useState({ venue: '', target_group: '', mode: '', start_date: '' });
  const navigate = useNavigate();
  let clickTimeout = null;



  const handleLogout = async () => {
    try {
      await axiosInstance.post('/login/logout/'); // Invalidate session on backend
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      navigate('/', { replace: true }); // Replace history to prevent back button
    }
  };


  const handleProfileClick = () => {
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      document.getElementById('profileUpload').click();
    } else {
      clickTimeout = setTimeout(() => {
        setShowPanel(!showPanel);
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }, 250);
    }
  };


  const fetchAssignedTrainings = async () => {
    try {
      const res = await axiosInstance.get('/trainings/assigned/');
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
    fetchUser();
    fetchTrainings();
    fetchEnrollments();
    fetchAssignedTrainings();
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

  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day + 6) % 7;
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  useEffect(() => {
    const filterDate = filters.start_date ? new Date(filters.start_date) : null;
    const baseMonday = getMonday(filterDate || new Date());
    const nextMonday = new Date(baseMonday);
    nextMonday.setDate(baseMonday.getDate() + 7);

    const filtered = trainings.filter((t) => {
      const matchVenue = filters.venue ? t.venue === filters.venue : true;
      const matchBranch = filters.target_group ? t.target_group?.toLowerCase().includes(filters.target_group.toLowerCase()) : true;
      const matchMode = filters.mode ? t.mode?.toLowerCase() === filters.mode.toLowerCase() : true;
      return matchVenue && matchBranch && matchMode;
    });

    const thisWeek = [], upcoming = [], past = [];
    filtered.forEach((t) => {
      const start = new Date(t.start_date);
      start.setHours(0, 0, 0, 0);
      if (start >= baseMonday && start < nextMonday) thisWeek.push(t);
      else if (start >= nextMonday) upcoming.push(t);
      else past.push(t);
    });

    thisWeek.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    upcoming.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    past.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    setFilteredTrainings([
      { section: '🟢 Trainings This Week', items: thisWeek },
      { section: '🟡 Upcoming Week Trainings', items: upcoming },
      { section: '🔴 Past Trainings', items: past },
    ]);
  }, [filters, trainings]);

  const handleClear = () => {
    setFilters({ venue: '', target_group: '', mode: '', start_date: '' });
  };

  return (
    <>
      <nav className="navbar navbar-dark px-4" style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', height: '70px' }}>
        <span className="navbar-brand text-info fw-bold fs-4">📘 TRAINEE DASHBOARD</span>
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => navigate('/')} className="btn btn-sm btn-outline-light me-2">
            🏠 Home
          </button>
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={handleLogout}>
            🚪 Logout
          </button>
          <label onClick={handleProfileClick} style={{ cursor: 'pointer', marginBottom: 0 }}>
            <img
              src={profilePhoto || 'https://placehold.co/100x120?text=Upload'}
              alt="Profile"
              className="profile-passport"
              style={{ height: '60px', width: '48px', borderRadius: '6px', border: '2px solid #fff' }}
            />
          </label>
          <input id="profileUpload" type="file" accept="image/*" onChange={() => { }} style={{ display: 'none' }} />
        </div>
      </nav>

      {showPanel && (
        <div className="profile-slide-panel animate__animated animate__slideInRight" style={{ position: 'fixed', top: '70px', right: '0', width: '360px', height: 'calc(100vh - 70px)', background: '#fff', borderLeft: '1px solid #dee2e6', zIndex: 1050, boxShadow: '-3px 0 10px rgba(0,0,0,0.08)', overflowY: 'auto', padding: '20px' }}>
          <h6 className="text-primary mb-3">👤 Personal Details</h6>
          <p><strong>Name:</strong> {`${user?.first_name || ''} ${user?.middle_name || ''} ${user?.last_name || ''}`}</p>
          <p><strong>EHRMS:</strong> {user?.ehrms_code}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Mobile:</strong> {user?.mobile_number}</p>
          <p><strong>Institute:</strong> {user?.institute_name}</p>
          <button className="btn btn-outline-danger btn-sm mt-3" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}

      <div className="container py-4">
        <h3 className="text-center mb-4">IRDT Training Calendar 2025–26</h3>
        <TrainingFilterBar filters={filters} setFilters={setFilters} handleClear={handleClear} trainings={trainings} />

        <div className="row">
          <div className="col-md-8">
            {filteredTrainings.map((group, idx) => (
              <div key={idx} className="mb-5">
                <h5 className="border-bottom pb-2">{group.section}</h5>
                {group.items.map((training, index) => (
                  <TrainingCard
                    key={index}
                    training={training}
                    showEnrollButton={group.section.includes("Upcoming Week")}
                    enrolledTrainings={enrolledTrainings}
                    ehrmsCode={user?.ehrms_code}
                    onEnrollSuccess={(code) => setEnrolledTrainings([...enrolledTrainings, code])}
                  />
                ))}
              </div>
            ))}
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

        {/* ✅ Certificate Module Starts Here */}
        <div className="mt-5">
          <h4>Your Trainings & Certificates</h4>

          <div className="text-end mb-3">
            <button className="btn btn-primary" onClick={fetchAllCertificates}>
              View All Certificates
            </button>
          </div>

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

          {/* 📋 All Certificates Modal */}
          <AllCertificatesModal
            show={showAllCertificatesModal}
            onClose={() => setShowAllCertificatesModal(false)}
            certificates={allCertificates}
          />
        </div>
        {/* ✅ Certificate Module Ends Here */}
      </div>
    </>

  );
};

export default Dashboard;
