// // src/pages/PhotoGallery.jsx
// import React, { useState } from "react";
// import "./PhotoGallery.css";
// import logo from "../assets/irdt-logo.png";
// import { Link } from "react-router-dom";

// export default function PhotoGallery() {
//   const [selectedImage, setSelectedImage] = useState(null);

//   const events = [
//     {
//       title: "Induction Training Programme",
//       date: "10-14 June 2024",
//       venue: "IRDT U.P. Kanpur",
//       img: "gl.png",
//     },
//     {
//       title: "Induction Training Programme",
//       date: "05-08 August 2024",
//       venue: "IRDT U.P. Kanpur",
//       img: "gl2.png",
//     },
//     {
//       title: "Training on Sustainable Green Chemical Technologies",
//       date: "21-25 August 2023",
//       venue: "HBTU Kanpur",
//       img: "gl3.png",
//     },
//     {
//       title: "Two Days Training Workshop on Disciplinary Proceedings & Appeal",
//       date: "28-29 August 2023",
//       venue: "IRDT Kanpur",
//       img: "gl4.png",
//     },
//     {
//       title: "Visit of Hon'ble Principal Secretary, Technical Education Dept. U.P. Govt.",
//       date: "21 August 2023",
//       venue: "IRDT Kanpur",
//       img: "gl5.png",
//     },
//     {
//       title: "Induction Training Programme",
//       date: "07-11 August 2023",
//       venue: "IRDT U.P. Kanpur",
//       img: "gl6.png",
//     },
//     {
//       title: "Induction Training Programme",
//       date: "21-25 August 2023",
//       venue: "IRDT U.P. Kanpur",
//       img: "gl11.png",
//     },
//     {
//       title: "STC on Universal Human Values",
//       date: "28 Nov - 02 Dec 2022",
//       venue: "IRDT Kanpur",
//       img: "gl10.png",
//     },
//     {
//       title: "तकनीकी प्रतिभा सम्मान समारोह - 2019",
//       date: "17 February 2019",
//       venue: "IRDT Kanpur",
//       img: "gl8.png",
//     },
//     {
//       title: "Induction training program",
//       date: "14-18 July 2025",
//       venue: "IRDT Kanpur",
//       img: "p2.jpg",
//     },
//     {
//       title: "Drone technology",
//       date: "17-21 February 2025",
//       venue: "IRDT Kanpur",
//       img: "p3.jpg",
//     },
//     {
//       title: "Cryptography, network defence and mobile security",
//       date: "28 July-01 Aug 2025",
//       venue: "IRDT Kanpur In collaboration with CDAC Patna",
//       img: "p5.jpg",
//     },
//     {
//       title: "FDP on Cyber security essentials",
//       date: "03-07 March 2025",
//       venue: "IRDT Kanpur In collaboration with CDAC Patna",
//       img: "p8.jpg",
//     },
//     {
//       title: "Android application development",
//       date: "14-19 October 2024",
//       venue: "IRDT Kanpur",
//       img: "p10.jpg",
//     },
//   ];

//   // Function to parse date for sorting
//   const parseEventDate = (dateStr) => {
//     let cleaned = dateStr.trim();
//     if (cleaned.includes("-")) {
//       const parts = cleaned.split("-");
//       cleaned = parts[parts.length - 1].trim();
//     }
//     cleaned = cleaned.replace(/\b([a-z])/g, (c) => c.toUpperCase());
//     return new Date(cleaned);
//   };

//   // Sort events latest → oldest
//   const sortedEvents = [...events].sort(
//     (a, b) => parseEventDate(b.date) - parseEventDate(a.date)
//   );

//   return (
//     <>
//       {/* Top Header */}
//       <div
//         className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom"
//         style={{ backgroundColor: "#006666" }}
//       >
//         <div className="d-flex align-items-center gap-3 flex-grow-1">
//           <img
//             src={logo}
//             alt="IRDT Logo"
//             style={{
//               height: "60px",
//               width: "auto",
//               filter: "invert(1) brightness(2)",
//             }}
//           />
//           <div className="flex-grow-1 text-center">
//             <h2 className="fw-bold mb-0" style={{ color: "white" }}>
//               Institute for Research, Development & Training (IRDT)
//             </h2>
//             <p className="fw-semibold mb-0" style={{ color: "white" }}>
//               Government of Uttar Pradesh
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Bar */}
//       <nav
//         className="d-flex justify-content-center gap-4 py-2"
//         style={{ backgroundColor: "#004d4d" }}
//       >
//         <Link to="/" className="text-white fw-semibold text-decoration-none">Home</Link>
//         <Link to="/aboutus" className="text-white fw-semibold text-decoration-none">About Us</Link>
//         <Link to="/curriculum" className="text-white fw-semibold text-decoration-none">Trainings</Link>
//         <Link to="/photogallery" className="text-white fw-semibold text-decoration-none">Gallery</Link>
//         <Link to="/learningresources" className="text-white fw-semibold text-decoration-none">LRDC</Link>
//         <Link to="/trainingcell" className="text-white fw-semibold text-decoration-none">Training Cell</Link>
//         <Link to="/curriculumdevelopment" className="text-white fw-semibold text-decoration-none">CDC</Link>
//         <Link to="/login" className="text-white fw-semibold text-decoration-none">Login</Link>
//       </nav>

//       {/* Gallery */}
//       <div className="gallery-wrapper">
//         <h1 className="gallery-title">Photo Gallery</h1>
//         <div className="gallery-grid">
//           {sortedEvents.map((event, index) => (
//             <div
//               className="gallery-card"
//               key={index}
//               onClick={() => setSelectedImage(`/images/${event.img}`)}
//             >
//               {/* Use thumbnails here */}
//               <img
//                 src={`/images/thumbs/${event.img}`}
//                 alt={event.title}
//               />
//               <div className="gallery-info">
//                 <h2>{event.title}</h2>
//                 <p><b>Date:</b> {event.date}</p>
//                 <p><b>Venue:</b> {event.venue}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Full Image Modal */}
//         {selectedImage && (
//           <div className="image-modal" onClick={() => setSelectedImage(null)}>
//             <span className="close-btn">&times;</span>
//             <img src={selectedImage} alt="Full View" className="modal-img" />
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // src/pages/PhotoGallery.jsx
// import React, { useState, useEffect } from "react";
// import "./PhotoGallery.css";
// import logo from "../assets/irdt-logo.png";
// import { Link } from "react-router-dom";

// export default function PhotoGallery() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [fileSizes, setFileSizes] = useState({}); // store sizes

//   const events = [
//     {
//       title: "Induction Training Programme",
//       date: "10-14 June 2024",
//       venue: "IRDT U.P. Kanpur",
//       img: "gl.png",
//     },
//     {
//       title: "Induction Training Programme",
//       date: "05-08 August 2024",
//       venue: "IRDT U.P. Kanpur",
//       img: "gl2.png",
//     },
//     {
//       title: "Training on Sustainable Green Chemical Technologies",
//       date: "21-25 August 2023",
//       venue: "HBTU Kanpur",
//       img: "gl3.png",
//     },
//     {
//       title: "Two Days Training Workshop on Disciplinary Proceedings & Appeal",
//       date: "28-29 August 2023",
//       venue: "IRDT Kanpur",
//       img: "gl4.png",
//     },
//     {
//       title: "Visit of Hon'ble Principal Secretary, Technical Education Dept. U.P. Govt.",
//       date: "21 August 2023",
//       venue: "IRDT Kanpur",
//       img: "gl5.png",
//     },
//     {
//       title: "Induction Training Programme",
//       date: "07-11 August 2023",
//       venue: "IRDT U.P. Kanpur",
//       img: "gl6.png",
//     },
//     {
//       title: "Induction Training Programme",
//       date: "21-25 August 2023",
//       venue: "IRDT U.P. Kanpur",
//       img: "gl11.png",
//     },
//     {
//       title: "STC on Universal Human Values",
//       date: "28 Nov - 02 Dec 2022",
//       venue: "IRDT Kanpur",
//       img: "gl10.png",
//     },
//     {
//       title: "तकनीकी प्रतिभा सम्मान समारोह - 2019",
//       date: "17 February 2019",
//       venue: "IRDT Kanpur",
//       img: "gl8.png",
//     },
//     {
//       title: "Induction training program",
//       date: "14-18 July 2025",
//       venue: "IRDT Kanpur",
//       img: "p2.jpg",
//     },
//     {
//       title: "Drone technology",
//       date: "17-21 February 2025",
//       venue: "IRDT Kanpur",
//       img: "p3.jpg",
//     },
//     {
//       title: "Cryptography, network defence and mobile security",
//       date: "28 July-01 Aug 2025",
//       venue: "IRDT Kanpur In collaboration with CDAC Patna",
//       img: "p5.jpg",
//     },
//     {
//       title: "FDP on Cyber security essentials",
//       date: "03-07 March 2025",
//       venue: "IRDT Kanpur In collaboration with CDAC Patna",
//       img: "p8.jpg",
//     },
//     {
//       title: "Android application development",
//       date: "14-19 October 2024",
//       venue: "IRDT Kanpur",
//       img: "p10.jpg",
//     },
//   ];

//   // Function to parse date for sorting
//   const parseEventDate = (dateStr) => {
//     let cleaned = dateStr.trim();
//     if (cleaned.includes("-")) {
//       const parts = cleaned.split("-");
//       cleaned = parts[parts.length - 1].trim();
//     }
//     cleaned = cleaned.replace(/\b([a-z])/g, (c) => c.toUpperCase());
//     return new Date(cleaned);
//   };

//   // Sort events latest → oldest
//   const sortedEvents = [...events].sort(
//     (a, b) => parseEventDate(b.date) - parseEventDate(a.date)
//   );

//   // Fetch thumbnail file sizes
//   useEffect(() => {
//     sortedEvents.forEach((event) => {
//       fetch(`/images/thumbs/${event.img}`)
//         .then((res) => res.blob())
//         .then((blob) => {
//           setFileSizes((prev) => ({
//             ...prev,
//             [event.img]: (blob.size / 1024).toFixed(1), // KB
//           }));
//         })
//         .catch(() => {});
//     });
//   }, [sortedEvents]);

//   return (
//     <>
 
//       <div
//         className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom"
//         style={{ backgroundColor: "#006666" }}
//       >
//         <div className="d-flex align-items-center gap-3 flex-grow-1">
//           <img
//             src={logo}
//             alt="IRDT Logo"
//             style={{
//               height: "60px",
//               width: "auto",
//               filter: "invert(1) brightness(2)",
//             }}
//           />
//           <div className="flex-grow-1 text-center">
//             <h2 className="fw-bold mb-0" style={{ color: "white" }}>
//               Institute for Research, Development & Training (IRDT)
//             </h2>
//             <p className="fw-semibold mb-0" style={{ color: "white" }}>
//               Government of Uttar Pradesh
//             </p>
//           </div>
//         </div>
//       </div>

  
//       <nav
//         className="d-flex justify-content-center gap-4 py-2"
//         style={{ backgroundColor: "#004d4d" }}
//       >
//         <Link to="/" className="text-white fw-semibold text-decoration-none">
//           Home
//         </Link>
//         <Link to="/aboutus" className="text-white fw-semibold text-decoration-none">
//           About Us
//         </Link>
//         <Link to="/curriculum" className="text-white fw-semibold text-decoration-none">
//           Trainings
//         </Link>
//         <Link to="/photogallery" className="text-white fw-semibold text-decoration-none">
//           Gallery
//         </Link>
//         <Link to="/learningresources" className="text-white fw-semibold text-decoration-none">
//           LRDC
//         </Link>
//         <Link to="/trainingcell" className="text-white fw-semibold text-decoration-none">
//           Training Cell
//         </Link>
//         <Link to="/curriculumdevelopment" className="text-white fw-semibold text-decoration-none">
//           CDC
//         </Link>
//         <Link to="/login" className="text-white fw-semibold text-decoration-none">
//           Login
//         </Link>
//       </nav>

      
//       <div className="gallery-wrapper">
//         <h1 className="gallery-title">Photo Gallery</h1>
//         <div className="gallery-grid">
//           {sortedEvents.map((event, index) => (
//             <div
//               className="gallery-card"
//               key={index}
//               onClick={() => setSelectedImage(`/images/${event.img}`)}
//             >
            
//               <img
//                 src={`/images/thumbs/${event.img}`}
//                 alt={event.title}
//               />
//               <div className="gallery-info">
//                 <h2>{event.title}</h2>
//                 <p><b>Date:</b> {event.date}</p>
//                 <p><b>Venue:</b> {event.venue}</p>
//                 {fileSizes[event.img] && (
//                   <p style={{ fontSize: "0.85rem", color: "#666" }}>
//                     Thumbnail Size: {fileSizes[event.img]} KB
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

        
//         {selectedImage && (
//           <div className="image-modal" onClick={() => setSelectedImage(null)}>
//             <span className="close-btn">&times;</span>
//             <img src={selectedImage} alt="Full View" className="modal-img" />
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
// src/pages/PhotoGallery.jsx
// src/pages/PhotoGallery.jsx
import React, { useState } from "react";
import "./PhotoGallery.css";
import logo from "../assets/irdt-logo.png";
import { Link } from "react-router-dom";

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const events = [
    { title: "Induction Training Programme", date: "10-14 June 2024", venue: "IRDT U.P. Kanpur", img: "gl.png" },
    { title: "Induction Training Programme", date: "05-08 August 2024", venue: "IRDT U.P. Kanpur", img: "gl2.png" },
    { title: "Training on Sustainable Green Chemical Technologies", date: "21-25 August 2023", venue: "HBTU Kanpur", img: "gl3.png" },
    { title: "Two Days Training Workshop on Disciplinary Proceedings & Appeal", date: "28-29 August 2023", venue: "IRDT Kanpur", img: "gl4.png" },
    { title: "Visit of Hon'ble Principal Secretary, Technical Education Dept. U.P. Govt.", date: "21 August 2023", venue: "IRDT Kanpur", img: "gl5.png" },
    { title: "Induction Training Programme", date: "07-11 August 2023", venue: "IRDT U.P. Kanpur", img: "gl6.png" },
    { title: "Induction Training Programme", date: "21-25 August 2023", venue: "IRDT U.P. Kanpur", img: "gl11.png" },
    { title: "STC on Universal Human Values", date: "28 Nov - 02 Dec 2022", venue: "IRDT Kanpur", img: "gl10.png" },
    { title: "तकनीकी प्रतिभा सम्मान समारोह - 2019", date: "17 February 2019", venue: "IRDT Kanpur", img: "gl8.png" },
    { title: "Induction training program", date: "14-18 July 2025", venue: "IRDT Kanpur", img: "p2.jpg" },
    { title: "Drone technology", date: "17-21 February 2025", venue: "IRDT Kanpur", img: "p3.jpg" },
    { title: "Cryptography, network defence and mobile security", date: "28 July-01 Aug 2025", venue: "IRDT Kanpur In collaboration with CDAC Patna", img: "p5.jpg" },
    { title: "FDP on Cyber security essentials", date: "03-07 March 2025", venue: "IRDT Kanpur In collaboration with CDAC Patna", img: "p8.jpg" },
    { title: "Android application development", date: "14-19 October 2024", venue: "IRDT Kanpur", img: "p10.jpg" },
  ];

  // Parse date for sorting
  const parseEventDate = (dateStr) => {
    let cleaned = dateStr.trim();
    if (cleaned.includes("-")) {
      const parts = cleaned.split("-");
      cleaned = parts[parts.length - 1].trim();
    }
    cleaned = cleaned.replace(/\b([a-z])/g, (c) => c.toUpperCase());
    return new Date(cleaned);
  };

  // Sort latest → oldest
  const sortedEvents = [...events].sort(
    (a, b) => parseEventDate(b.date) - parseEventDate(a.date)
  );

  return (
    <>
      {/* Top Header */}
      <div className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom"
        style={{ backgroundColor: "#006666" }}>
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <img src={logo} alt="IRDT Logo"
            style={{ height: "60px", width: "auto", filter: "invert(1) brightness(2)" }} />
          <div className="flex-grow-1 text-center">
            <h2 className="fw-bold mb-0" style={{ color: "white" }}>
              Institute for Research, Development & Training (IRDT)
            </h2>
            <p className="fw-semibold mb-0" style={{ color: "white" }}>
              Government of Uttar Pradesh
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="d-flex justify-content-center gap-4 py-2"
        style={{ backgroundColor: "#004d4d" }}>
        <Link to="/" className="text-white fw-semibold text-decoration-none">Home</Link>
        <Link to="/aboutus" className="text-white fw-semibold text-decoration-none">About Us</Link>
        <Link to="/curriculum" className="text-white fw-semibold text-decoration-none">Trainings</Link>
        <Link to="/photogallery" className="text-white fw-semibold text-decoration-none">Gallery</Link>
        <Link to="/learningresources" className="text-white fw-semibold text-decoration-none">LRDC</Link>
        <Link to="/trainingcell" className="text-white fw-semibold text-decoration-none">Training Cell</Link>
        <Link to="/curriculumdevelopment" className="text-white fw-semibold text-decoration-none">CDC</Link>
        <Link to="/login" className="text-white fw-semibold text-decoration-none">Login</Link>
      </nav>

      {/* Gallery */}
      <div className="gallery-wrapper">
        <h1 className="gallery-title">Photo Gallery</h1>
        <div className="gallery-grid">
          {sortedEvents.map((event, index) => (
            <div className="gallery-card" key={index}
              onClick={() => setSelectedImage(`/images/${event.img}`)}>
              <img src={`/images/thumbs/${event.img}`} alt={event.title} />
              <div className="gallery-info">
                <h2>{event.title}</h2>
                <p><b>Date:</b> {event.date}</p>
                <p><b>Venue:</b> {event.venue}</p>
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
