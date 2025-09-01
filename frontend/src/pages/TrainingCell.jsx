import React from "react";
import { motion } from "framer-motion";
import "./PageStyles.css";
import logo from "../assets/irdt-logo.png";
import { Link } from "react-router-dom";

const TrainingCell = () => {
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
                 <p className="fw-semibold mb-0" style={{ color: "white", fontStyle: "italic" }}>
              Shiksha Pragati - "Bridge of Education for Progress"
             </p>
              </div>
            </div>
    
            
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
    
    
    <div className="page-container">
      {/* Hero Section */}
      <div
        className="hero"
        style={{
          backgroundImage: "url('/images/lc.jpg')",
        }}
      >
        <div className="overlay"></div>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Training Cell
        </motion.h1>
      </div>

      {/* Content Section */}
      <motion.div
        className="content-container left-align"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p className="intro">
          <strong>Technology & Sciences</strong> are fast developing areas.
          Industries are growing at a very rapid rate and the use of high-tech
          fields has thus become eminent to cope up with the quality-consciousness
          of the products as well as competition.
        </p>

        <h3>The objectives achieved at the end of training are:</h3>
        <ul>
          <li>Learning of newer technologies or upgraded skills.</li>
          <li>Updating knowledge and skills.</li>
          <li>Arrangement requiring higher level of knowledge or skill.</li>
          <li>Horizontal exposure - shift of job functions where earlier knowledge does not suffice.</li>
          <li>Industrial exposure - periodical hands-on experience.</li>
          <li>Development of managerial/administrative knowledge or skills.</li>
        </ul>

        <a href="/curriculum" className="download-link">
          📄 Download Training Calendar 2025-26
        </a>
      </motion.div>
    </div>
    </>
  );
};

export default TrainingCell;
