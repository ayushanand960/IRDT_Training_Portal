
import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import ZoneTable from "./ZoneTable";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../components/AuthContext";
import dayjs from "dayjs";

const Home = () => {
  const { user, setUser } = useAuth();
  const logoutDone = useRef(false);
  const navigate = useNavigate();
  const [upcomingTrainings, setUpcomingTrainings] = useState([]);

  useEffect(() => {
    const handleUser = async () => {
      if (logoutDone.current || !user) return;

      try {
        const res = await axiosInstance.get("/login/user/profile/");
        const { is_superuser, is_coordinator } = res.data;

        if (is_superuser || is_coordinator) {
          logoutDone.current = true;
          await axiosInstance.post("/login/logout/");
          setUser(null);
          navigate("/");
        }
      } catch (err) {
        logoutDone.current = true;
      }
    };

    handleUser();
  }, [user, setUser, navigate]);

  // ✅ Fetch upcoming trainings (next 30 days)
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await axiosInstance.get("/training/curriculum/");
        const today = dayjs();
        const oneMonthLater = today.add(30, "day");

        const filtered = res.data.filter((t) => {
          const start = dayjs(t.start_date);
          return start.isAfter(today) && start.isBefore(oneMonthLater);
        });

        setUpcomingTrainings(filtered);
      } catch (err) {
        console.error("Error fetching trainings:", err);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <div className="home-page">
      {/* Top Bar */}
      <div className="top-bar">
        <p>Email: irdtkanpur@gmail.com | Latest Updates: New Curriculum Released</p>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/images/banner1.png.png" />
        </div>
      </header>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/aboutus">About Us</Link>
          <Link to="/curriculum" className="nav-link">Trainings</Link>
          <Link to="/photogallery">Gallery</Link>
          <Link to="/learningresources">LRDC</Link>
          <Link to="/trainingcell">TrainingCell</Link>
          <Link to="/curriculumdevelopment">CDC</Link>
          <Link to="/login">Login</Link>
        </div>

        <button
          className="info-btn"
          title="Information"
          onClick={() => navigate("/info1")}
        >
          Meet our Developers
        </button>
      </nav>

      {/* ✅ Slideshow + Upcoming Trainings in one section */}
      <section className="hero-section flex-container">
        {/* Left: Slideshow */}
        <div className="hero-slideshow">
          <div className="slideshow-container">
            <img src="/images/slide1.png" alt="Slide 1" className="slide" />
            <img src="/images/slide2.png" alt="Slide 2" className="slide" />
            <img src="/images/slide3.png" alt="Slide 3" className="slide" />
          </div>
        </div>

        {/* Right: Upcoming Trainings */}
        <div className="upcoming-trainings">
          <h2>Upcoming Trainings (Next 30 Days)</h2>
          {upcomingTrainings.length === 0 ? (
            <p>No trainings scheduled in the next month.</p>
          ) : (
            <ul className="trainings-list">
              {upcomingTrainings.map((t) => {
                const start = dayjs(t.start_date);
                const end = dayjs(t.end_date);
                return (
                  <li key={t.code} className="training-card">
                    <div className="date-box">
                      <span className="day">{start.format("DD")}</span>
                      <span className="month">{start.format("MMM")}</span>
                    </div>
                    <div className="training-details">
                      <h3>{t.name}</h3>
                      <p className="date-range">
                        {start.format("DD MMM")} - {end.format("DD MMM YYYY")}
                      </p>
                      <p className="venue">{t.venue}</p>
                      <p className="target">{t.target_group}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ✅ Marquee right after slideshow + trainings */}
      <div className="marquee-container">
        <div className="marquee-content">
          <strong>Welcome to IRDT Kanpur</strong> — The Nodal Training Institute
          for 147 Government Polytechnics across Uttar Pradesh, empowering faculty
          development and technical education.
        </div>
      </div>

      {/* Programs Section */}
      <section className="programs">
        <div className="program">
          <div className="program-img-box">
            <img src="/images/yogi2.png" alt="ap sir" />
          </div>
          <p><b>Shri Yogi Aditya Nath</b><br />Hon'ble Chief Minister, U.P. </p>
        </div>
        <div className="program">
          <div className="program-img-box">
            <img src="/images/patel2.png" alt="patel" />
          </div>
          <p>
            <b>Shri Ashish Patel</b><br />
            Hon'ble Cabinet Minister<br />
            Technical Education Department U.P.
          </p>
        </div>

        <div className="program">
          <div className="program-img-box">
            <img src="/images/ias33.png" alt="ias" />
          </div>
          <p>
            <b>Shri Narendra Bhooshan, IAS</b><br />
            Additional Chief Secretary<br />
            Technical Education Department U.P.
          </p>
        </div>

        <div className="program">
          <div className="program-img-box">
            <img src="/images/fr1.png" alt="fr" />
          </div>
          <p>
            <b>Shri F.R. Khan</b><br />
            Director IRDT U.P. Kanpur
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <button
          className="link-btn"
          onClick={() => window.open("https://bteup.ac.in", "_blank")}
        >
          BTEUP Portal
        </button>
        <button
          className="link-btn"
          onClick={() => window.open("http://upted.gov.in/directorate", "_blank")}
        >
          Directorate
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>
          <h3>Contact Us</h3>
          <p>IRDT, Kanpur, Uttar Pradesh</p>
          <p>Email: director_irdt@rediffmail.com, director.irdt@gmail.com</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/admin-coordinator-login">Administration</Link></li>
            <li><Link to="/curriculum">Trainings</Link></li>
            <li><Link to="/ELearning">E-Learning</Link></li>
            <li><Link to="/info1">Developers</Link></li>
          </ul>
        </div>
        <div>
          <h3>Locate Us</h3>
          <iframe
            title="IRDT Location"
            src="https://maps.google.com/maps?q=Kanpur%20IRDT&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="250"
            height="150"
            style={{ border: 0 }}
          ></iframe>
        </div>
      </footer>
    </div>
  );
};

export default Home;


// import React from "react";
// import { Link } from "react-router-dom";
// import "./Home.css";
// import ZoneTable from "./ZoneTable";
// import axiosInstance from '../utils/axiosInstance';
// import { useAuth } from '../components/AuthContext';
// import { useRef, useEffect } from "react"; // ✅ Add this line
// import { useNavigate } from "react-router-dom"; // ✅ Add this line



// const Home = () => {

//   const { user, setUser } = useAuth();
//   const logoutDone = useRef(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleUser = async () => {
//       if (logoutDone.current || !user) return;

//       try {
//         const res = await axiosInstance.get("/login/user/profile/");
//         const { is_superuser, is_coordinator } = res.data;

//         if (is_superuser || is_coordinator) {
//           logoutDone.current = true;
//           await axiosInstance.post("/login/logout/");
//           setUser(null);
//           // Redirect with session_expired message
//           navigate("/");
//         }
//       } catch (err) {
//         logoutDone.current = true;
//         // ❌ Don't force logout for guests
//       }
//     };

//     handleUser();
//   }, [user, setUser, navigate]);
//   return (
//     <div className="home-page">
//       {/* Top Bar */}
//       <div className="top-bar">
//         <p>Email: irdtkanpur@gmail.com | Latest Updates: New Curriculum Released</p>
//       </div>

//       {/* Header */}
//       <header className="header">
//         <div className="logo">
//           <img src="/images/banner1.png.png" />

//         </div>
//       </header>
//       <nav className="navbar">
//         <div className="nav-links">
//           <Link to="/">Home</Link>
//           <Link to="/aboutus">About Us</Link>
//           <Link to="/curriculum" className="nav-link">Trainings</Link>
//           {/* <Link to="/zonetable">Polytechnics</Link> */}
//           <a
//             href="http://upted.gov.in/directorate/en/page/polytechnic-list"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Polytechnics
//           </a>

//           <Link to="/photogallery">Gallery</Link>
//           <Link to="/learningresources">LRDC</Link>
//           <Link to="/trainingcell">TrainingCell</Link>
//           <Link to="/curriculumdevelopment">CDC</Link>
//           <Link to="/login">Login</Link>
//         </div>

//         {/* Info Button */}
//         <button className="info-btn" title="Information"
//           onClick={() => navigate("/info1")}>Meet our Developers
//         </button>
//       </nav>




//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-slideshow">
//           <div className="slideshow-container">
//             <img src="/images/slide1.png" alt="Slide 1" className="slide" />
//             <img src="/images/slide2.png" alt="Slide 2" className="slide" />
//             <img src="/images/slide3.png" alt="Slide 3" className="slide" />
//           </div>
//         </div>

//         {/* <div className="hero-image">
//           <figure>
//             <img src="/images/yogi2.png" alt="Shri Yogi Aditya Nath" />
//             <figcaption className="hero-caption">
//               <b>Shri Yogi Aditya Nath</b> <br />
//               <span>Hon'ble Chief Minister, U.P.</span>
//             </figcaption>
//           </figure>
//         </div> */}
//       </section>

//       <div className="marquee-container">
//         <div className="marquee-content">
//           <strong>Welcome to IRDT Kanpur</strong> — The Nodal Training Institute for 147 Government Polytechnics across Uttar Pradesh, empowering faculty development and technical education.
//         </div>
//       </div>

//       {/* Programs Section */}
//       <section className="programs">

//         <div className="program">
//           <div className="program-img-box">
//             <img src="/images/yogi2.png" alt="ap sir" />
//           </div>
//           <p><b>Shri Yogi Aditya Nath</b><br></br>Hon'ble Chief Minister, U.P. </p>
//         </div>
//         <div className="program">
//           <div className="program-img-box">
//             <img src="/images/patel2.png" alt="patel" />
//           </div>
//           <p>
//             <b>Shri Ashish Patel</b><br />
//             Hon'ble Cabinet Minister<br />
//             Technical Education Department U.P.
//           </p>
//         </div>

//         <div className="program">
//           <div className="program-img-box">
//             <img src="/images/ias33.png" alt="ias" />
//           </div>
//           <p>
//             <b>Shri Narendra Bhooshan, IAS</b><br />
//             Additional Chief Secretary<br />
//             Technical Education Department U.P.
//           </p>
//         </div>

//         <div className="program">
//           <div className="program-img-box">
//             <img src="/images/fr1.png" alt="fr" />
//           </div>
//           <p>
//             <b>Shri F.R. Khan</b><br />
//             Director IRDT U.P. Kanpur
//           </p>
//         </div>

//       </section>






//       {/* Quick Links */}
//       <section className="quick-links">
//         {/* <button className="link-btn">New Curriculum 2025</button> */}
//         <button
//           className="link-btn"
//           onClick={() => window.open("https://bteup.ac.in", "_blank")}
//         >
//           BTEUP Portal
//         </button>
//         <button
//           className="link-btn"
//           onClick={() => window.open("http://upted.gov.in/directorate", "_blank")}
//         >
//           Directorate
//         </button>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         <div>
//           <h3>Contact Us</h3>
//           <p>IRDT, Kanpur, Uttar Pradesh</p>
//           <p>Email: director_irdt@rediffmail.com, director.irdt@gmail.com</p>
//         </div>
//         <div>
//           <h3>Quick Links</h3>
//           <ul>
//             {/* <li><Link to="/curriculum">Curriculum</Link></li> */}
//             <li><Link to="/admin-coordinator-login">Administration</Link></li>
//             <li><Link to="/curriculum">Trainings</Link></li>
//             <li><Link to="/ELearning">E-Learning</Link></li>
//             <li><Link to="/info1">Developers</Link></li>
//             {/* <li>
//               <Link className="info-btn" title="Information"
//                 onClick={() => navigate("/info1")}>Developers
//               </Link>
//             </li> */}
//           </ul>
//         </div>
//         <div>
//           <h3>Locate Us</h3>
//           <iframe
//             title="IRDT Location"
//             src="https://maps.google.com/maps?q=Kanpur%20IRDT&t=&z=13&ie=UTF8&iwloc=&output=embed"
//             width="250"
//             height="150"
//             style={{ border: 0 }}
//           ></iframe>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;





