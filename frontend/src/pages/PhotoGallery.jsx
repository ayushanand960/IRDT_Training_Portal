// src/pages/PhotoGallery.jsx
import React, { useState } from "react";
import "./PhotoGallery.css";

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
  );
}
