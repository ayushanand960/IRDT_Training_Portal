import React from "react";
import { motion } from "framer-motion";
import "./PageStyles.css";
import logo from "../assets/irdt-logo.png";
import { Link } from "react-router-dom";

const LearningResources = () => {
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
    
    <div className="page-container">
      {/* Hero Section */}
      <div
        className="hero"
        style={{
          backgroundImage: "url('/images/lr4.avif')",
        }}
      >
        <div className="overlay"></div>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Learning Resources Development Cell
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
          The Development / revision of a curriculum often results in
          introduction of latest technologies or practices adopted in the
          industries, as a new topic to which the teachers are not exposed. The
          learning material of the new area of technology is gathered and
          converted into reading or instructional materials for effective
          transfer of knowledge. It has been found that students sometimes find
          particular subject or topics, difficult to comprehend. Alternative
          methods of teaching i.e. transparencies, slides, workbooks,
          educational video cassettes, films, Questions banks, handouts are thus
          required for better instructional and communicable delivery.
        </p>

        <h3>The main activities of the center are:</h3>
        <ol>
          <li>
            To develop the print & non-print material, which is not available
            and is advised by C.D.C. for use in the implementation of
            curriculum.
          </li>

          <li>
            To produce and distribute tested print as well as non-print
            material.{" "}
          </li>

          <li>
            To evaluate the quality of the materials produced by obtaining feed
            back from users and then upgrade and update it.
          </li>

          <li>
            To train polytechnic teachers in preparation & use of instructional
            material.
          </li>
        </ol>

        <p>
          The activity of the Learning Resource Development Cell are being
          planned in a way to produce learning resource material before the
          reviewed / revised syllabus is implemented. The teaching aid so
          prepared, are given a pre-trial as per the lecture plan for the
          qualitative improvement of the teaching process and then evaluated to
          assess their transfer value, so that the students are benefited at the
          best accordingly.
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default LearningResources;
