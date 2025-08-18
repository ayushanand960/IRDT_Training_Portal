// src/pages/PhotoGallery.jsx
import React, { useState } from "react";
import "./PhotoGallery.css";
import logo from "../assets/irdt-logo.png";
import { Link } from "react-router-dom";

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const events = [
    {
      title: "Induction Training Programme",
      date: "10-14 June 2024",
      venue: "IRDT U.P. Kanpur",
      img: "/images/gl.png",
    },
    {
      title: "Induction Training Programme",
      date: "05-08 August 2024",
      venue: "IRDT U.P. Kanpur",
      img: "/images/gl2.png",
    },
    {
      title: "Training on Sustainable Green Chemical Technologies",
      date: "21-25 August 2023",
      venue: "HBTU Kanpur",
      img: "/images/gl3.png",
    },
    {
      title: "Two Days Training Workshop on Disciplinary Proceedings & Appeal",
      date: "28-29 August 2023",
      venue: "IRDT Kanpur",
      img: "/images/gl4.png",
    },
    {
      title: "Visit of Hon'ble Principal Secretary, Technical Education Dept. U.P. Govt.",
      date: "Shri M. Devaraj (IAS)",
      venue: "IRDT Kanpur",
      img: "/images/gl5.png",
    },
    {
      title: "Induction Training Programme",
      date: "07-11 August 2023",
      venue: "IRDT U.P. Kanpur",
      img: "/images/gl6.png",
    },
    {
      title: "Induction Training Programme",
      date: "21-25 August 2023",
      venue: "IRDT U.P. Kanpur",
      img: "/images/gl11.png",
    },
    {
      title: "STC on Universal Human Values",
      date: "28 Nov - 02 Dec 2022",
      venue: "IRDT Kanpur",
      img: "/images/gl10.png",
    },
    {
      title: "तकनीकी प्रतिभा सम्मान समारोह - 2019",
      date: "सक्षम बालिका-सम्पन्न परिवार योजना",
      venue: "IRDT Kanpur",
      img: "/images/gl8.png",
    },
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
      <div className="gallery-wrapper">
        <h1 className="gallery-title">Photo Gallery</h1>
        <div className="gallery-grid">
          {events.map((event, index) => (
            <div
              className="gallery-card"
              key={index}
              onClick={() => setSelectedImage(event.img)}
            >
              <img src={event.img} alt={event.title} />
              <div className="gallery-info">
                <h2>{event.title}</h2>
                <p>
                  <b>Date:</b> {event.date}
                </p>
                <p>
                  <b>Venue:</b> {event.venue}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Full Image Modal */}
        {selectedImage && (
          <div className="image-modal" onClick={() => setSelectedImage(null)}>
            <span className="close-btn">&times;</span>
            <img src={selectedImage} alt="Full View" className="modal-img" />
          </div>
        )}
      </div>
    </>
  );
}
