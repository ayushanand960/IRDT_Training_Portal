import { motion } from "framer-motion";
import "./Info.css";
import { FaLinkedin } from "react-icons/fa";

const developers = [
  {
    name: "Sumit Yadav",
    role: "Frontend Developer",
    image: "/images/sumit.png",
    desc: "Specialized in React, Flutter and modern UI design.",  
    color: "#ff6f61", // Coral Red
     linkedin: "https://www.linkedin.com/in/sumit-yadav-18v269",
  },
  {
    name: "Pawan Rathore",
    role: "Backend Developer",
    image: "/images/pawan.png",
    desc: "Expert in Django, REST APIs and PostgreSQL.",
    color: "#66bb6a", // Green
     linkedin: "https://www.linkedin.com/in/pawanrathour96",
  },
  {
    name: "Piyush Sahu",
    role: "UI/UX Designer",
    image: "/images/piyush.png",
    desc: "Designs engaging, responsive, and user-friendly interfaces.",
    color: "#42a5f5", // Blue
     linkedin: "https://www.linkedin.com/in/sumityadav",
  },
  {
    name: "Siddharth Mishra",
    role: "Backend Developer",
    image: "/images/siddharth.png",
    desc: "Expert in Django, REST APIs and PostgreSQL.",
    color: "#ff6f61", // Red
     linkedin: "https://www.linkedin.com/in/siddharth-mishra-648866281 ",
  },
  {
    name: "Ayush Anand",
    role: "UI/UX Designer",
    image: "/images/ayush.png",
    desc: "Designs engaging, responsive, and user-friendly interfaces.",
    color: "#66bb6a", // Green
     linkedin: "https://www.linkedin.com/in/ayushanand960 ",
  },
  {
    name: "Harshit Tiwari",
    role: "UI/UX Designer",
    image: "/images/harshit.png",
    desc: "Designs engaging, responsive, and user-friendly interfaces.",
    color: "#42a5f5", // Blue
     linkedin: "https://www.linkedin.com/in/harshit-tiwari-245614237",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      when: "beforeChildren",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 12,
    },
  },
};

export default function Info1() {
  return (
    <div className="info-container">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Meet Our Developers
      </motion.h1>

      <motion.div
        className="dev-cards"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {developers.map((dev, index) => (
          <motion.div
            className="dev-card"
            key={index}
            variants={cardVariants}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 12px 25px rgba(0,0,0,0.3)",
            }}
            style={{ backgroundColor: dev.color }}
          >
            <img
              src={dev.image}
              alt={dev.name}
              className="dev-img"
              onError={(e) => (e.target.src = "/images/default.png")}
            />
            <h2>{dev.name}</h2>
            <h3>{dev.role}</h3>
            <p>{dev.desc}</p>
             <a
              href={dev.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-btn"
            >
             <FaLinkedin />LinkedIn
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}


