import React from "react";
import { motion } from "framer-motion";
import "./PageStyles.css";
import logo from "../assets/irdt-logo.png";
import { Link } from "react-router-dom";


const CurriculumDevelopment = () => {
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

    <div className="page-container">
      {/* Hero Section */}
      <div
        className="hero"
        style={{
          backgroundImage: "url('/images/cd4.jpg')",
        }}
      >
        <div className="overlay"></div>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Curriculum Development Cell
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
          <strong>Curriculum Development</strong> is a guiding framework for the
          planned educational process. It aims to keep the content updated with
          industry needs, emerging technologies, and pedagogical advancements.
        </p>

        <h3>The main functions of the CDC are:</h3>
        <ul>
          <li>
            Designing curriculum for various new courses for running in
            institutions affiliated to Board of Technical Education Lucknow.
          </li>

          <li>
            Revising, updating and reviewing curriculum of the existing courses.
          </li>

          <li>
            Identifying staff needs and physical resources, required for running
            the courses.
          </li>

          <li>
            Identifying new courses as per the need of industries and in the
            areas of service center were the need is as per latest technological
            development in the world.
          </li>

          <li>Identifying training and retraining needs of existing staff.</li>
        </ul>

        <p>
          C.D.C. continuously evaluates the curriculum as per needs. of span.
          Mutually interactive relationship is maintained for effective
          implementation of curriculum with polytechnics. Institute carries out
          survey to assess the short coming in the curriculum, functions
          performed by the manpower being produced and their on-job
          deficiencies.
        </p>

        <p>
          The development, revision and review are taken up by holding
          workshops, inviting experts from the industry, higher level
          institutions, premier employing agencies and the faculty of the
          institutes. The draft syllabus is then sent to the teachers, experts
          in the field and employers to solicit their views on the contents. The
          contents are finalized through discussions on inclusion/deletion of
          suggestions obtained in workshop and thereafter finally by the
          validation committee. The curriculum is thus finalized and is
          implemented after approval of statutory syllabus committee of the
          Board of Technical Education (U.P.) Lucknow.
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default CurriculumDevelopment;
