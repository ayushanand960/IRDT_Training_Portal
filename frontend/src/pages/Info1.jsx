import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "./Info.css";
import { FaLinkedin } from "react-icons/fa";

const developers = [
  {
    name: "Sumit Yadav",
    role: "Frontend Developer",
    image: "/images/sumit.png",
    desc: "Specialized in React, Flutter and modern UI design.",
    linkedin: "https://www.linkedin.com/in/sumit-yadav-18v269",
  },
  {
    name: "Pawan Rathore",
    role: "Backend Developer",
    image: "/images/pawan.png",
    desc: "Expert in Django, REST APIs and PostgreSQL.",
    linkedin: "https://www.linkedin.com/in/pawanrathour96",
  },
  {
    name: "Piyush Sahu",
    role: "UI/UX Designer",
    image: "/images/piyush.png",
    desc: "Designs engaging, responsive, and user-friendly interfaces.",
    linkedin: "https://www.linkedin.com/in/sumityadav",
  },
  {
    name: "Siddharth Mishra",
    role: "Backend Developer",
    image: "/images/siddharth.png",
    desc: "Expert in Django, REST APIs and PostgreSQL.",
    linkedin: "https://www.linkedin.com/in/siddharth-mishra-648866281",
  },
  {
    name: "Ayush Anand",
    role: "UI/UX Designer",
    image: "/images/ayush.png",
    desc: "Designs engaging, responsive, and user-friendly interfaces.",
    linkedin: "https://www.linkedin.com/in/ayushanand960",
  },
  {
    name: "Harshit Tiwari",
    role: "UI/UX Designer",
    image: "/images/harshit.png",
    desc: "Designs engaging, responsive, and user-friendly interfaces.",
    linkedin: "https://www.linkedin.com/in/harshit-tiwari-245614237",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, when: "beforeChildren" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 15 },
  },
};

export default function Info1() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effect for dev cards
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -45]);

  // Parallax effect for floating orbs
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbY3 = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="info-container" ref={ref}>
      {/* Floating background orbs with parallax */}
      <motion.div className="bg-orb orb1" style={{ y: orbY1 }} />
      <motion.div className="bg-orb orb2" style={{ y: orbY2 }} />
      <motion.div className="bg-orb orb3" style={{ y: orbY3 }} />

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Meet Our Developers
      </motion.h1>

      {/* Animated Tagline */}
      <motion.p
        className="tagline"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Building the future with passion 💡
      </motion.p>

      <motion.div
        className="dev-cards"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {developers.map((dev, index) => {
          const roleClass =
            dev.role.includes("Frontend")
              ? "frontend"
              : dev.role.includes("Backend")
              ? "backend"
              : "uiux";

          const parallax = index % 3 === 0 ? y1 : index % 3 === 1 ? y2 : y3;

          return (
            <motion.div
              className="dev-card"
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.05, rotate: 1 }}
              style={{ y: parallax }}
            >
              <img
                src={dev.image}
                alt={dev.name}
                className="dev-img"
                onError={(e) => (e.target.src = "/images/default.png")}
              />
              <h2>{dev.name}</h2>
              <h3 className={`role-badge ${roleClass}`}>{dev.role}</h3>
              <p>{dev.desc}</p>
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-btn"
              >
                <FaLinkedin /> LinkedIn
              </a>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}