// src/pages/TraineeDashboard.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import quotes from '../data/quotes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TrainingCard from '../components/TrainingCard';
import TrainingFilterBar from '../components/TrainingFilterBar';
import AllCertificatesModal from '../components/AllCertificatesModal';
import NotificationBell from '../components/NotificationBell';
// src/pages/TraineeDashboard.jsx
import { polytechnics } from '../data/polytechnics';
import { branches } from '../data/branches';
import designations from '../data/designations';
import logo from "../assets/irdt-logo.png";


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
  const [pastTrainingsFromAPI, setPastTrainingsFromAPI] = useState([]);
  const [showPastTrainingsModal, setShowPastTrainingsModal] = useState(false);




  const [user, setUser] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [enrolledTrainings, setEnrolledTrainings] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // const today = new Date();
  // const quoteIndex = today.getDate() % quotes.length;
  // const dailyQuote = quotes[quoteIndex];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  // Edit Profile modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    mobile_number: '',
    institute_name: '',
    branch: '',
    designation: '',
    designationOption: '',
    date_of_joining: ""
  });




  // const [showPanel, setShowPanel] = useState(false);
  const [filters, setFilters] = useState({ venue: '', target_group: '', mode: '', start_date: '', faculty: '' });

  const [visibleCounts, setVisibleCounts] = useState({
    '🟢 Trainings This Week': 6,
    '🟡 Upcoming Week Trainings': 8,
    '🔴 Past Trainings': 8,
  });
  const navigate = useNavigate();
  let clickTimeout = null;

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

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

  // const openEditModal = () => {
  //   if (!user) return;
  //   setEditForm({
  //     email: user.email || '',
  //     mobile_number: user.mobile_number || '',
  //     institute_name: user.institute_name || '',
  //     branch: user.branch || '',
  //     designation: user.designation || '',
  //     date_of_joining: user.date_of_joining || '',
  //   });
  //   setShowEditModal(true);
  // };
  const openEditModal = () => {
    if (!user) return;
    setEditForm({
      email: user.email || '',
      mobile_number: user.mobile_number || '',
      institute_name: user.institute_name || '',
      branch: user.branch || '',
      designation: user.designation || '',
      date_of_joining: user.date_of_joining
        ? user.date_of_joining.split("T")[0]   // 👈 ensures correct YYYY-MM-DD format
        : '',
      otherDesignation:
        user.designation &&
          !designations.includes(user.designation) // 👈 if user's designation is not in dropdown
          ? user.designation
          : '',
    });
    setShowEditModal(true);
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!user?.ehrms_code) return;

    // Minimal validations
    if (!editForm.email) {
      toast.error('Email is required');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email);
    if (!emailOk) {
      toast.error('Please enter a valid email');
      return;
    }
    const digits = (editForm.mobile_number || '').replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    let designationValue = editForm.designation;
    if (designationValue === "Others" && editForm.designation_other?.trim()) {
      designationValue = editForm.designation_other.trim();
    }


    const payload = {
      email: editForm.email.trim(),
      mobile_number: editForm.mobile_number.trim(),
      institute_name: editForm.institute_name,
      branch: editForm.branch,
      designation: designationValue,
      date_of_joining: editForm.date_of_joining,
    };

    setIsSavingProfile(true);
    try {
      // IMPORTANT: Keep the same base path your admin UI uses
      await axiosInstance.put(`/login/users/${user.ehrms_code}/`, payload);
      toast.success('Profile updated');
      setShowEditModal(false);
      await fetchUser(); // refresh UI with updated details
    } catch (err) {
      const msg =
        err?.response?.data
          ? typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data)
          : 'Failed to update profile';
      toast.error(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };


  const fetchPastTrainings = async () => {
    try {
      setShowProfileModal(false);
      const res = await axiosInstance.get('/training/past-trainings/');
      setPastTrainingsFromAPI(res.data);
      setShowPastTrainingsModal(true);
    } catch (err) {
      toast.error("Failed to load past trainings");
    }
  };


  // 🧾 Fetch all certificates
  const fetchAllCertificates = async () => {
    try {
      setShowProfileModal(false);  // ✅ Close profile modal first
      const res = await axiosInstance.get('/certificate/my-certificates/');
      setAllCertificates(res.data);
      setShowAllCertificatesModal(true);
    } catch (err) {
      toast.error("Failed to load certificates");
    }
  };


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
    // fetchAssignedTrainings();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get('/login/user/profile/');
      setUser(res.data);
      if (res.data.profile_picture) {
        setProfilePhoto(`${import.meta.env.VITE_BACKEND_URL}${res.data.profile_picture}`);
      } else {
        setProfilePhoto(`${import.meta.env.VITE_BACKEND_URL}/media/profile_pictures/default.jpg`);
      }

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
      const matchCoordinator = filters.faculty ? t.faculty?.trim() === filters.faculty.trim() : true;
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

  const handleShowMore = (sectionName) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName] + 8,
    }));
  };

  const handleClear = () => {
    setFilters({ venue: '', target_group: '', mode: '', start_date: '', faculty: '' });
  };

  return (
    <>
      <nav
        className="navbar navbar-dark px-4 d-flex justify-content-between align-items-center shadow-sm"
        style={{
          background: "linear-gradient(to right, #004d4d, #006666, #009999)",
          height: "70px",
        }}
      >
        {/* Left Section: Logo + Title */}
        <div className="d-flex align-items-center gap-3">
          <img
            src={logo}
            alt="IRDT Logo"
            style={{ height: "80px", width: "80px", borderRadius: "8px", filter: "invert(1) brightness(2)" }}
          />
          <span className="navbar-brand text-white fw-bold fs-2 mb-0"
            style={{ letterSpacing: "0.5px" }}>
            Trainee Dashboard
          </span>
        </div>

        {/* Right Section: Actions */}
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="btn btn-sm"
            style={{
              backgroundColor: "#ffffff",
              color: "#006666",
              fontWeight: "500",
              borderRadius: "6px",
              padding: "6px 14px",
              border: "none",
              transition: "0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#006666";
              e.target.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.color = "#006666";
            }}
          >
            Home
          </button>

          <button
            className="btn btn-sm"
            onClick={handleLogout}
            style={{
              backgroundColor: "#cc0000",
              color: "#fff",
              fontWeight: "500",
              borderRadius: "6px",
              padding: "6px 14px",
              border: "none",
              transition: "0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#990000";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#cc0000";
            }}
          >
            Logout
          </button>

          <NotificationBell />

          {/* Profile Photo */}
          <label onClick={handleProfileClick} style={{ cursor: "pointer", marginBottom: 0 }}>
            <img
              src={profilePhoto}
              alt="Profile"
              className="rounded-circle border border-light"
              style={{ height: "45px", width: "45px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = `${import.meta.env.VITE_BACKEND_URL}/media/profile_pictures/default.jpg`;
              }}
            />
          </label>
        </div>
      </nav>

      {showProfileModal && (
        <div
          className="modal d-block fade show"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title text-primary">👤 Profile Info</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseProfileModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="rounded-circle border"
                  style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = `${import.meta.env.VITE_BACKEND_URL}/media/profile_pictures/default.jpg`;
                  }}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-3"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('profile_picture', file);

                    try {
                      const res = await axiosInstance.put('/login/upload-profile-picture/', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      });
                      setProfilePhoto(`${import.meta.env.VITE_BACKEND_URL}${res.data.url}?t=${Date.now()}`);


                      toast.success("✅ Profile picture updated!");
                    } catch (err) {
                      toast.error("Failed to upload profile picture");
                    }
                  }}
                />

                <div className="text-start">
                  <p><strong>Name:</strong> {`${user?.first_name || ''} ${user?.middle_name || ''} ${user?.last_name || ''}`}</p>
                  <p><strong>EHRMS:</strong> {user?.ehrms_code}</p>
                  <p><strong>Designation:</strong> {user?.designation}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Mobile:</strong> {user?.mobile_number}</p>
                  <p><strong>Date of Joining:</strong> {user?.date_of_joining}</p>
                  <p><strong>Institute:</strong> {user?.institute_name}</p>
                  <p><strong>Branch:</strong> {user?.branch}</p>
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={fetchAllCertificates}
                  >
                    View Certificates
                  </button>
                  {/* <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() => {
                      handleCloseProfileModal();
                      setTimeout(() => {
                        document
                          .querySelector('#past-trainings-section')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    📚 Past Trainings
                  </button> */}
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={fetchPastTrainings}
                  >
                    Past Trainings
                  </button>

                  {/* NEW: Edit Profile */}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      handleCloseProfileModal();
                      openEditModal();
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-secondary" onClick={handleCloseProfileModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="container py-4">
        <h3 className="text-center mb-4">IRDT Training Calendar 2025–26</h3>
        <TrainingFilterBar filters={filters} setFilters={setFilters} handleClear={handleClear} trainings={trainings} />

        <div className="row">
          {/* First Row: Trainings This Week + Announcements */}
          <div className="row">
            {/* Left: Trainings This Week */}
            <div className="col-md-8">
              {filteredTrainings
                .filter((group) => group.section === '🟢 Trainings This Week')
                .map((group, idx) => (
                  <div key={idx} className="mb-4">
                    <h5 className="border-bottom pb-2">{group.section}</h5>
                    <div className="row">
                      {group.items.slice(0, visibleCounts[group.section]).map((training, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4">
                          <TrainingCard
                            training={training}
                            showEnrollButton={false}
                            enrolledTrainings={enrolledTrainings}
                            ehrmsCode={user?.ehrms_code}
                          />
                        </div>
                      ))}
                    </div>
                    {group.items.length > visibleCounts[group.section] && (
                      <div className="text-center mt-2">
                        <button className="btn btn-outline-primary btn-sm" style={{
                          borderColor: "#006666",
                          color: "#006666",
                        }} onClick={() => handleShowMore(group.section)}>
                          Show More
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Right: Announcement + Quote */}
            <div className="col-md-4">
              {/* <div className="card shadow border-info mb-3 bg-info-subtle p-3">
                <h5 className="text-info">📢 Announcements</h5>
                <ul>
                  <li>📅 AI in Education begins July 7</li>
                  <li>📝 OBE Workshop due July 10</li>
                  <li>🎓 Cert Review July 12</li>
                </ul>
              </div> */}
              <div className="card bg-light shadow-sm border border-primary p-3">
                <h6 className="text-primary">🌟 Quote of the Moment</h6>
                <p className="mb-0">"{randomQuote}"</p>
              </div>
            </div>
          </div>

          {/* Second Row: Upcoming & Past Trainings (Full-width) */}
          {filteredTrainings
            .filter((group) => group.section !== '🟢 Trainings This Week')
            .map((group, idx) => (
              <div key={idx} className="mb-5">
                <h5 className="border-bottom pb-2">{group.section}</h5>
                <div className="row">
                  {group.items.slice(0, visibleCounts[group.section]).map((training, index) => (
                    <div
                      key={index}
                      className={
                        group.section === '🟢 Trainings This Week'
                          ? 'col-12 col-md-6 col-lg-4 mb-4'
                          : 'col-12 col-md-6 col-lg-4 col-xl-3 mb-4'
                      }
                    >
                      <TrainingCard
                        training={training}
                        showEnrollButton={group.section.includes("Upcoming Week")}
                        enrolledTrainings={enrolledTrainings}
                        ehrmsCode={user?.ehrms_code}
                        onEnrollSuccess={(code) => setEnrolledTrainings([...enrolledTrainings, code])}
                      />
                    </div>
                  ))}
                </div>
                {group.items.length > visibleCounts[group.section] && (
                  <div className="text-center mt-2">
                    <button className="btn btn-outline-primary btn-sm" style={{
                          borderColor: "#006666",
                          color: "#006666",
                        }} onClick={() => handleShowMore(group.section)}>
                      Show More
                    </button>
                  </div>
                )}
              </div>
            ))}

        </div>
        {/* Past Trainings Modal */}
        {showPastTrainingsModal && (
          <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content p-3">
                <div className="modal-header">
                  <h5 className="modal-title text-info">📚 Past Trainings</h5>
                  <button className="btn-close" onClick={() => setShowPastTrainingsModal(false)}></button>
                </div>
                <div className="modal-body">
                  {pastTrainingsFromAPI.length === 0 ? (
                    <p>No past trainings found.</p>
                  ) : (
                    <ul className="list-group">
                      {pastTrainingsFromAPI.map((t) => (
                        <li key={t.id} className="list-group-item">
                          <strong>{t.name}</strong><br />
                          {t.start_date} to {t.end_date} @ {t.venue}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" style={{
                          borderColor: "#006666",
                          color: "#006666",
                        }} onClick={() => setShowPastTrainingsModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📋 All Certificates Modal */}
        <AllCertificatesModal
          show={showAllCertificatesModal}
          onClose={() => setShowAllCertificatesModal(false)}
          certificates={allCertificates}
        />


        {showEditModal && (
          <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-3">
                <div className="modal-header">
                  <h5 className="modal-title text-primary">✏ Edit Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
                </div>

                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* Mobile */}
                    <div className="mb-3">
                      <label className="form-label">Mobile</label>
                      <input
                        name="mobile_number"
                        type="tel"
                        className="form-control"
                        value={editForm.mobile_number}
                        onChange={handleEditChange}
                        placeholder="e.g., 98XXXXXX12"
                        required
                      />
                    </div>

                    {/* Institute */}
                    <div className="mb-3">
                      <label className="form-label">Institute</label>
                      <select
                        name="institute_name"
                        className="form-select"
                        value={editForm.institute_name}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Select Institute</option>
                        {polytechnics.map((inst, i) => (
                          <option key={i} value={inst}>{inst}</option>
                        ))}
                      </select>
                    </div>

                    {/* Branch */}
                    <div className="mb-3">
                      <label className="form-label">Branch</label>
                      <select
                        name="branch"
                        className="form-select"
                        value={editForm.branch}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Select Branch</option>
                        {branches.map((b, i) => (
                          <option key={i} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Designation */}
                    <div className="mb-3">
                      <label className="form-label">
                        Designation
                        {editForm.designation === "Others" && (
                          <span style={{ color: "red" }}> *</span>
                        )}
                      </label>

                      <select
                        name="designation"
                        className="form-select"
                        value={editForm.designation}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Select Designation</option>
                        {designations.map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}

                      </select>

                      {editForm.designation === "Others" && (
                        <input
                          type="text"
                          name="designation_other"
                          className="form-control mt-2"
                          value={editForm.designation_other || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, designation_other: e.target.value }))
                          }
                          placeholder="Enter your designation"
                          required
                        />
                      )}
                    </div>




                    {/* Date of Joining */}
                    <div className="mb-3">
                      <label className="form-label">Date of Joining</label>
                      <input
                        name="date_of_joining"
                        type="date"
                        className="form-control"
                        value={editForm.date_of_joining}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                      disabled={isSavingProfile}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary"style={{
                          borderColor: "#006666",
                          color: "#006666",
                        }} disabled={isSavingProfile}>
                      {isSavingProfile ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
      {/* ✅ Certificate Module Ends Here */}

    </>

  );
};

export default TraineeDashboard;
