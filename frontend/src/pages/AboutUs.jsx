// src/pages/AboutUs.jsx
import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUniversity } from "react-icons/fa";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-wrapper">
      <div className="about-hero">
        <h1>About Us</h1>
        <p>
          Welcome to <b>Institute of Research, Development & Training (IRDT) Kanpur</b>, 
          the nodal training institute for <b>147 Government Polytechnics</b> across Uttar Pradesh.  
          We are committed to empowering technical education by fostering innovation, 
          curriculum development, and continuous faculty training.
        </p>
      </div>

      <div className="about-section">
        <h2>Organization Structure</h2>
        <p>
          Our leadership team ensures smooth functioning of IRDT Kanpur, driving its vision 
          towards excellence in technical education:
        </p>
        <ul>
          <li><b>Shri F.R. Khan</b>, Director</li>
          <li><b>Dr. A.P. Singh</b>, Deputy Director</li>
          <li><b>Shri Shyam Lal</b>, Text Book Officer</li>
          <li><b>Shri Vikas Kulshrestha</b>, Assistant Professor</li>
          <li><b>Shri Gaurav Kishor Kanaujiya</b>, Assistant Professor</li>
          <li><b>Shri Sambhaskar Singh</b>, Assistant Professor (On Study Leave)</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Contact Us</h2>
        <p>
          <FaMapMarkerAlt className="icon" /> <b>Address:</b> I.R.D.T. (Govt. Polytechnic Campus), 
          Vikas Nagar, Kanpur (U.P.) - 208002
        </p>
        <p>
          <FaPhone className="icon" /> <b>Telephone:</b> 0512-2580360
        </p>
        <p>
          <FaEnvelope className="icon" /> <b>Email:</b> director_irdt@rediffmail.com, director.irdt@gmail.com
        </p>
      </div>

      <div className="about-section">
        <h2>Institute Cells</h2>
        <p>
          The institute's functions are coordinated through the following three specialized cells:
        </p>
        <ol>
          <li>Curriculum Development Cell</li>
          <li>Learning Resource Development Cell</li>
          <li>Staff Development Cell</li>
        </ol>
      </div>

      <div className="about-section">
        <h2>Main Functions</h2>
        <p>
          The primary functions carried out by these cells focus on continuous growth and modernization 
          of technical education:
        </p>
        <ul>
          <li>A — Curriculum Development and Updating</li>
          <li>B — Learning Resource Development</li>
          <li>C — Training of Polytechnic Staff</li>
          <li>D — Creation of Computer Awareness and Training in Digital Skills</li>
          <li>E — Undertaking Research Projects for the Advancement of Education</li>
        </ul>
      </div>

      <div className="about-section vision">
        <h2>Our Vision & Mission</h2>
        <p>
          At IRDT Kanpur, our vision is to be a pioneer in technical education by providing 
          cutting-edge training programs and fostering innovation.  
          Our mission is to prepare educators and students with the skills, values, 
          and knowledge required to excel in a rapidly changing world.
        </p>
      </div>
    </div>
  );
}
