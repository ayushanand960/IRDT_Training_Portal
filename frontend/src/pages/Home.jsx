
// // import { useEffect, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axiosInstance from '../utils/axiosInstance';
// // import { useAuth } from '../components/AuthContext';
// // import Header from '../components/Header';
// // import Footer from '../components/Footer';
// // import FeatureCard from '../components/FeatureCard';

// // export default function Home() {
// //   const { user, setUser } = useAuth();
// //   const logoutDone = useRef(false);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const handleUser = async () => {

// //       // ✅ Skip if already handled
// //       if (logoutDone.current) return;

// //       try {
// //         const res = await axiosInstance.get("/login/user/profile/");
// //         const { is_superuser, is_coordinator, ehrms_code } = res.data;

// //         // ✅ Auto-logout admin/coordinator
// //         if (is_superuser || is_coordinator) {
// //           logoutDone.current = true;
// //           await axiosInstance.post("/login/logout/");
// //           setUser(null);
// //         } else {
// //           // ✅ Redirect trainee to dashboard
// //           logoutDone.current = true;
// //           // navigate("/dashboard");
// //           await axiosInstance.post("/login/logout/");

// //         }
// //       } catch (err) {
// //         logoutDone.current = true;
// //         setUser(null); // not logged in
// //       }
// //     };

// //     handleUser();
// //   }, [navigate, setUser]);

// //   return (
// //     <>
// //       <Header />
// //       <section className="bg-#f4f7fe text-center py-5">
// //         <div className="container">
// //           <img
// //             src="/images/irdt_logo_01.png"
// //             alt="IRDT Logo"
// //             style={{
// //               maxWidth: '250px',
// //               marginBottom: '20px',
// //               filter: 'brightness(0.3) contrast(1.6)',
// //             }}
// //           />

// //           <h1 className="display-5 fw-bold" style={{ color: '#4DA8DA' }}>
// //             Institute of Research, Development & Training
// //           </h1>
// //           <p className="lead text-muted mt-3">
// //             Empowering teaching excellence across 147 Govt. Polytechnics in UP.
// //           </p>
// //         </div>
// //       </section>

// //       <section className="py-5 bg-#e8f6fa text-center">
// //         <div className="container">
// //           <h2 className="mb-4">Comprehensive Training Management</h2>
// //           <div className="row justify-content-center">
// //             <FeatureCard title="Multi-Role Access" desc="Access modules for all roles." />
// //             <FeatureCard title="Smart Scheduling" desc="AI-powered session planning." />
// //             <FeatureCard title="Certificate Management" desc="Instant certificate access." />
// //           </div>
// //         </div>
// //       </section>

// //       <section className="py-5 bg-#f4f7fe text-center">
// //         <div className="container">
// //           <h2 className="mb-4">Training Partners</h2>
// //           <div className="d-flex justify-content-center gap-4 flex-wrap text-muted">
// //             <div>IRDT Campus</div>
// //             <div>NITTTR Chandigarh</div>
// //             <div>NITTTR Bhopal</div>
// //           </div>
// //         </div>
// //       </section>
// //       <Footer />
// //     </>
// //   );
// // }







// import { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../utils/axiosInstance';
// import { useAuth } from '../components/AuthContext';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import FeatureCard from '../components/FeatureCard';

// export default function Home() {
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
//     <>
//       <Header />
//       <section className="bg-#f4f7fe text-center py-5">
//         <div className="container">
//           <img
//             src="/images/irdt_logo_01.png"
//             alt="IRDT Logo"
//             style={{
//               maxWidth: '250px',
//               marginBottom: '20px',
//               filter: 'brightness(0.3) contrast(1.6)',
//             }}
//           />
//           <h1 className="display-5 fw-bold" style={{ color: '#4DA8DA' }}>
//             Institute of Research, Development & Training
//           </h1>
//           <p className="lead text-muted mt-3">
//             Empowering teaching excellence across 147 Govt. Polytechnics in UP.
//           </p>
//         </div>
//       </section>

//       <section className="py-5 bg-#e8f6fa text-center">
//         <div className="container">
//           <h2 className="mb-4">Comprehensive Training Management</h2>
//           <div className="row justify-content-center">
//             <FeatureCard title="Multi-Role Access" desc="Access modules for all roles." />
//             <FeatureCard title="Smart Scheduling" desc="AI-powered session planning." />
//             <FeatureCard title="Certificate Management" desc="Instant certificate access." />
//           </div>
//         </div>
//       </section>

//       <section className="py-5 bg-#f4f7fe text-center">
//         <div className="container">
//           <h2 className="mb-4">Training Partners</h2>
//           <div className="d-flex justify-content-center gap-4 flex-wrap text-muted">
//             <div>IRDT Campus</div>
//             <div>NITTTR Chandigarh</div>
//             <div>NITTTR Bhopal</div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// }









//  import { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../utils/axiosInstance';
// import { useAuth } from '../components/AuthContext';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import FeatureCard from '../components/FeatureCard';







import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import ZoneTable from "./ZoneTable";
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../components/AuthContext';
import { useRef, useEffect } from "react"; // ✅ Add this line
import { useNavigate } from "react-router-dom"; // ✅ Add this line



const Home = () => {

  const { user, setUser } = useAuth();
  const logoutDone = useRef(false);
  const navigate = useNavigate();

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
          // Redirect with session_expired message
          navigate("/");
        }
      } catch (err) {
        logoutDone.current = true;
        // ❌ Don't force logout for guests
      }
    };

    handleUser();
  }, [user, setUser, navigate]);
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

      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/aboutus">About</Link>
          <Link to="/curriculum">Curriculum</Link>
          <Link to="/zonetable"> Polytechnics</Link>
          <Link to="/photogallery">Gallery</Link>
          <Link to="/login">Login</Link>
          <Link to="/admin-coordinator-login">AdministrationLogin</Link>
        </div>
      </nav>



      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slideshow">
          <div className="slideshow-container">
            <img src="/images/slide1.png" alt="Slide 1" className="slide" />
            <img src="/images/slide2.png" alt="Slide 2" className="slide" />
            <img src="/images/slide3.png" alt="Slide 3" className="slide" />
          </div>
        </div>

        <div className="hero-image">
          <figure>
            <img src="/images/yogi2.png" alt="Shri Yogi Aditya Nath" />
            <figcaption className="hero-caption">
              <b>Shri Yogi Aditya Nath</b> <br />
              <span>Hon'ble Chief Minister, U.P.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="marquee-container">
        <div className="marquee-content">
          <strong>Welcome to IRDT Kanpur</strong> — The Nodal Training Institute for 147 Government Polytechnics across Uttar Pradesh, empowering faculty development and technical education.
        </div>
      </div>

      {/* Programs Section */}
      <section className="programs">
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

        <div className="program">
          <div className="program-img-box">
            <img src="/images/apsir2.png" alt="ap sir" />
          </div>
          <p><b> Shri AtmaPrakash Singh Sir</b><br></br> Deputy Director IRDT U.P. Kanpur </p>
        </div>
      </section>






      {/* Quick Links */}
      <section className="quick-links">
        <button className="link-btn">New Curriculum 2025</button>
        <button
          className="link-btn"
          onClick={() => window.open("https://bteup.ac.in", "_blank")}
        >
          BTEUP Portal
        </button>
        <button
          className="link-btn"
          onClick={() => window.open("https://jeecup.admissions.nic.in", "_blank")}
        >
          JEECUP
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
            <li><Link to="/curriculum">Curriculum</Link></li>
            <li><Link to="/training">Training</Link></li>
            <li><Link to="/ELearning">E-Learning</Link></li>
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




