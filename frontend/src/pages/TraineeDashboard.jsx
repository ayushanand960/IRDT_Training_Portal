import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import TrainingCard from '../components/TrainingCard';
import TrainingFilterBar from '../components/TrainingFilterBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'animate.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [enrolledTrainings, setEnrolledTrainings] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [filters, setFilters] = useState({ venue: '', target_group: '', mode: '', start_date: '',faculty: '' });
  const navigate = useNavigate();

  let clickTimeout = null;

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
      const matchCoordinator = filters.faculty? t.faculty?.trim() === filters.faculty.trim() : true;
      return matchVenue && matchBranch && matchMode && matchCoordinator;
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
    setFilters({ venue: '', target_group: '', mode: '', start_date: '', faculty:'' });
  };

  return (
    <>
      <nav className="navbar navbar-dark px-4" style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}>
        <span className="navbar-brand text-info fw-bold fs-4">📘 TRAINEE DASHBOARD</span>
        <div className="d-flex align-items-center">
          <label onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <img
              src={profilePhoto || 'https://placehold.co/100x120?text=Upload'}
              alt="Profile"
              className="profile-passport"
              style={{ height: '60px', width: '48px', borderRadius: '6px', border: '2px solid #fff' }}
            />
          </label>
          <input id="profileUpload" type="file" accept="image/*" onChange={() => {}} style={{ display: 'none' }} />
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
          <button className="btn btn-outline-danger btn-sm mt-3" onClick={() => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            navigate('/login');
          }}>🚪 Logout</button>
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
      </div>
    </>
  );
};

export default Dashboard;
