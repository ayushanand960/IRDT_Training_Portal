import React from "react";
import "./ELearning.css";

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
  );
}
