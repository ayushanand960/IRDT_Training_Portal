import React from "react";
import "./ELearning.css";
import logo from "../assets/irdt-logo.png";
import { Link } from "react-router-dom";

const portals = [
  {
    name: "NPTEL",
    description: "Free online courses from IITs & IISc",
    url: "https://nptel.ac.in/",
    img: "/images/nptel1.png",
    bgColor: "#e63946",
  },
  {
    name: "SWAYAM",
    description: "Government MOOC platform",
    url: "https://swayam.gov.in/",
    img: "/images/swayam.png",
    bgColor: "#457b9d",
  },
  {
    name: "AICTE E-Content",
    description: "Digital content for technical education",
    url: "https://free.aicte-india.org/",
    img: "/images/aicte.png",
    bgColor: "#1d3557",
  },
  {
    name: "DIKSHA",
    description: "Digital Infrastructure for Knowledge Sharing",
    url: "https://diksha.gov.in/",
    img: "/images/diksha.png",
    bgColor: "#2a9d8f",
  },
  {
    name: "Spoken Tutorial",
    description: "IT skills training by IIT Bombay",
    url: "https://spoken-tutorial.org/",
    img: "/images/spoken.png",
    bgColor: "#f4a261",
  },
];

export default function ELearning() {
  return (
    <>
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
          <p className="fw-semibold mb-0" style={{ color: "white", fontStyle: "italic" }}>
            Shiksha Pragati - "Bridge of Education for Progress"
          </p>
        </div>
      </div>


    </div>
    
          {/* Navigation Bar */ }
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
    <div className="elearn-container">

      {/* Main Text Content */}
      <div className="elearn-intro-wrapper">
        <h1 className="elearn-main-title">E-Learning @ IRDT Kanpur</h1>

        <p className="elearn-intro-text">
          Welcome to the <strong>E-Learning Portal of IRDT Kanpur</strong>. This platform is designed to provide faculty and students with easy access to digital learning resources, training modules, and professional development programs.
        </p>

        <section className="elearn-section-text">
          <h2>Digital Learning Resources</h2>
          <p>
            Explore a wide range of curated digital resources, including e-books, lecture notes, research papers, and interactive study materials to enhance your technical knowledge.
          </p>
          <ul>
            <li>Free access to technical e-books and journals</li>
            <li>Video lectures and recorded sessions</li>
            <li>Interactive PDFs and presentations</li>
          </ul>
        </section>

        <section className="elearn-section-text">
          <h2>Online Courses & Modules</h2>
          <p>
            Stay updated with the latest trends and technologies by enrolling in our online courses.
          </p>
          <ul>
            <li>Skill-based certification programs</li>
            <li>MOOCs (Massive Open Online Courses) integration</li>
            <li>Technical workshops & short-term training modules</li>
          </ul>
        </section>

        <section className="elearn-section-text">
          <h2>Faculty Development Programs</h2>
          <p>
            Special training programs tailored for polytechnic faculty members to enhance teaching skills and stay aligned with modern pedagogical methods.
          </p>
          <ul>
            <li>Workshops on latest teaching methodologies</li>
            <li>Technical orientation and refresher programs</li>
            <li>Collaborations with premier technical institutes</li>
          </ul>
        </section>

        <section className="elearn-section-text">
          <h2>Certifications & Achievements</h2>
          <p>
            IRDT Kanpur offers recognition and certification upon successful completion of e-learning programs, ensuring your professional development is formally acknowledged.
          </p>
          <ul>
            <li>IRDT-approved training certificates</li>
            <li>Participation in skill competitions</li>
            <li>Government-recognized certifications</li>
          </ul>
        </section>

        <p className="elearn-note">
          📢 <strong>Note:</strong> To access the E-Learning modules, kindly use your institutional login credentials. For support, please contact <a href="mailto:elearning@irdtkanpur.ac.in">elearning@irdtkanpur.ac.in</a>.
        </p>
      </div>

      {/* Portal Cards Section */}
      <div className="portal-cards">
        {portals.map(({ name, description, url, img, bgColor }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="portal-card"
            style={{ backgroundColor: bgColor }}
          >
            <div className="portal-img-wrapper">
              <img src={img} alt={name} />
            </div>
            <div className="portal-text">
              <h2>{name}</h2>
              <p>{description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
    </>
  );
}
