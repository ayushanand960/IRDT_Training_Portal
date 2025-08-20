import React, { useEffect } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./AboutUs.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import logo from "../assets/irdt-logo.png"; // adjust path based on where your logo is stored


export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  const leaders = [
    { name: "Shri F.R. Khan", role: "Director", img: "/images/fr1.png" },
    { name: "Dr. A.P. Singh", role: "Deputy Director", img: "/images/ap.jpg" },
    { name: "Shri Shyam Lal", role: "Text Book Officer", img: "/images/sks1.jpg" },
    { name: "Shri Vikas Kulshrestha", role: "Assistant Professor", img: "/images/svk.jpg" },
    { name: "Shri Gaurav Kishor Kanaujiya", role: "Assistant Professor", img: "/images/gks.jpg" },
    { name: "Shri Sambhaskar Singh", role: "Assistant Professor (On Study Leave)", img: "/images/leader6.jpg" },
     { name: "Shri Anurag singh", role: "Lecturer - Web Designing , Technical Cell", img: "/images/ang.jpg" },
  ];

  return (
    <>
      {/* Top Header */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom"
        style={{ backgroundColor: "#006666" }}
      >
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          {/* Logo */}
          <img
            src={logo}
            alt="IRDT Logo"
            style={{
              height: "60px",
              width: "auto",
              filter: "invert(1) brightness(2)",
            }}
          />

          {/* Centered Text */}
          <div className="flex-grow-1 text-center">
            <h2 className="fw-bold mb-0" style={{ color: "white" }}>
              Institute for Research, Development & Training (IRDT)
            </h2>
            <p className="fw-semibold mb-0" style={{ color: "white" }}>
              Government of Uttar Pradesh
            </p>
          </div>
        </div>

        {/* <Link to="/" className="btn btn-outline-light fw-semibold">
          Home
        </Link> */}
      </div>

      {/* Navigation Bar */}
      <nav
        className="d-flex justify-content-center gap-4 py-2"
        style={{ backgroundColor: "#004d4d" }}
      >
        <Link to="/" className="text-white fw-semibold text-decoration-none">
          Home
        </Link>
        <Link to="/aboutus" className="text-white fw-semibold text-decoration-none">
          About Us
        </Link>
        <Link to="/curriculum" className="text-white fw-semibold text-decoration-none">
          Trainings
        </Link>
        {/* <Link to="/zonetable" className="text-white fw-semibold text-decoration-none">
          Polytechnics
        </Link> */}
        <Link to="/photogallery" className="text-white fw-semibold text-decoration-none">
          Gallery
        </Link>
        <Link to="/learningresources" className="text-white fw-semibold text-decoration-none">
          LRDC
        </Link>
        <Link to="/trainingcell" className="text-white fw-semibold text-decoration-none">
          Training Cell
        </Link>
        <Link to="/curriculumdevelopment" className="text-white fw-semibold text-decoration-none">
          CDC
        </Link>
        <Link to="/login" className="text-white fw-semibold text-decoration-none">
          Login
        </Link>
      </nav>





      <div className="about-wrapper">

        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content" data-aos="fade-right">
            <h1 className="section-title animated-gradient">About Us</h1>
            <p className="intro-text">
              The Institute of Research Development & Training is the only institute of its kind, established by state government, as a part of Department of Technical Education, U.P. having an independent status and is situated in its own campus. Keeping in view ,the fast growing advancements of technology in its emerging areas, need of research and development and trained manpower, led to establishment of this institute in 1978, as a part of Directorate of Technical Education. Later on, with the expansion of activities, it was established as independent organization in 1984.
            </p>
            <p style={{ fontSize: "1.7rem", fontWeight: "500" }}>
              It functions under three main cells:
            </p>


            Curriculum Development Cell (CDC) <br />
            Learning Resource Development Cell (LRDC) <br />
            Staff Development & Manpower Information Cell <br />

          </div>
          <div className="hero-image" data-aos="fade-left">

          </div>
        </section>

        {/* Vision & Mission */}
        <section className="about-section vision" data-aos="fade-up">
          <h2 className="section-title animated-gradient">Our Vision & Mission</h2>
          <p>At <span className="highlight">IRDT Kanpur</span>, our vision is to pioneer technical education with innovative training programs. Our mission is to equip educators and students with the knowledge, skills, and values to excel in a rapidly evolving world.</p>
        </section>

        {/* Leadership Section */}
        <section className="about-section leader-section" data-aos="fade-up">
          <h2 className="section-title animated-gradient">Organization Structure</h2>
          <p>Our leadership team ensures smooth functioning of <span className="highlight">IRDT Kanpur</span>, driving its vision toward excellence in technical education:</p>
          <div className="leader-grid">
            {leaders.map((leader, i) => (
              <div className="leader-card" key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
                <img src={leader.img} alt={leader.name} />
                <h3>{leader.name}</h3>
                <p>{leader.role}</p>
              </div>
            ))}
          </div>
        </section>


        {/* Institute Cells */}
        <section className="about-section cards-section" data-aos="fade-up">
          <h2 className="section-title animated-gradient">Institute Cells</h2>
          <div className="cards-container">
            <div className="info-card" data-aos="fade-left" data-aos-delay="100">
              <h3>Curriculum Development Cell</h3>
              <p>Focuses on designing, updating, and improving technical curriculum for polytechnic staff and students.</p>
            </div>
            <div className="info-card" data-aos="fade-left" data-aos-delay="200">
              <h3>Learning Resource Development Cell</h3>
              <p>Responsible for creating high-quality learning resources, e-learning modules, and training material.</p>
            </div>
            <div className="info-card" data-aos="fade-left" data-aos-delay="300">
              <h3>Staff Development Cell</h3>
              <p>Organizes professional development, training workshops, and skill enhancement programs for staff.</p>
            </div>
          </div>
        </section>

        {/* Main Functions */}
        <section className="about-section cards-section" data-aos="fade-up">
          <h2 className="section-title animated-gradient">Main Functions</h2>
          <div className="cards-container">
            <div className="info-card" data-aos="fade-right" data-aos-delay="100">
              <h3>Curriculum Development & Updating</h3>
              <p>Regularly revising and improving curriculum to align with modern technical education trends.</p>
            </div>
            <div className="info-card" data-aos="fade-right" data-aos-delay="200">
              <h3>Learning Resource Development</h3>
              <p>Creating digital resources, manuals, and study materials for effective teaching and learning.</p>
            </div>
            <div className="info-card" data-aos="fade-right" data-aos-delay="300">
              <h3>Training of Polytechnic Staff</h3>
              <p>Organizing workshops and programs to enhance teaching skills and professional knowledge.</p>
            </div>
            <div className="info-card" data-aos="fade-right" data-aos-delay="400">
              <h3>Digital Skills & Computer Awareness</h3>
              <p>Promoting computer literacy and digital skills among educators and students.</p>
            </div>
            <div className="info-card" data-aos="fade-right" data-aos-delay="500">
              <h3>Research Projects for Advancement</h3>
              <p>Conducting research initiatives to improve technical education practices and policies.</p>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section className="about-section contact-section" data-aos="fade-up">
          <h2 className="section-title animated-gradient">Contact Us</h2>
          <p><FaMapMarkerAlt className="icon" /> <b>Address:</b> I.R.D.T. (Govt. Polytechnic Campus), Vikas Nagar, Kanpur (U.P.) - 208002</p>
          <p><FaPhone className="icon" /> <b>Telephone:</b> 0512-2580360</p>
          <p><FaEnvelope className="icon" /> <b>Email:</b> director_irdt@rediffmail.com, director.irdt@gmail.com</p>
        </section>

      </div>
    </>
  );
}
