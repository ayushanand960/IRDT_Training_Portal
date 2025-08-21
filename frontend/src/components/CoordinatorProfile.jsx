

import React from "react";
import { Card, Badge } from "react-bootstrap";
import { FaUserCircle, FaEnvelope, FaUniversity, FaIdBadge } from "react-icons/fa";

const CoordinatorProfile = ({ coordinator }) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    institute,
    ehrms_code,
  } = coordinator || {};

  const fullName = [first_name, middle_name, last_name].filter(Boolean).join(" ");

  return (
   <Card
  className="shadow-sm border-start border-4 rounded"
  style={{
    borderColor: "#006666",
    backgroundColor: "#f8f9fa",
    transition: "box-shadow 0.3s ease, transform 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 102, 102, 0.2)";
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0, 0, 0, 0.075)";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  <Card.Body>
    <div className="d-flex align-items-center mb-3">
      <FaUserCircle size={36} style={{ marginRight: "0.5rem", color: "#006666" }} />
      <h5 className="mb-0 fw-bold text-dark">Coordinator Profile</h5>
    </div>

    <hr className="mb-3" />

    <p className="mb-2">
      <strong style={{ color: "#333" }}>Name:</strong>{" "}
      {fullName || <span style={{ color: "#888" }}>N/A</span>}
    </p>

    <p className="mb-2">
      <FaEnvelope style={{ marginRight: "0.5rem", color: "#006666" }} />
      <strong style={{ color: "#333" }}>Email:</strong>{" "}
      {email || <span style={{ color: "#888" }}>N/A</span>}
    </p>

    <p className="mb-2">
      <FaUniversity style={{ marginRight: "0.5rem", color: "#006666" }} />
      <strong style={{ color: "#333" }}>Institute:</strong>{" "}
      {institute || <span style={{ color: "#888" }}>N/A</span>}
    </p>

    <p className="mb-0">
      <FaIdBadge style={{ marginRight: "0.5rem", color: "#006666" }} />
      <strong style={{ color: "#333" }}>EHRMS Code:</strong>{" "}
      {ehrms_code ? (
        <span
          style={{
            backgroundColor: "#006666",
            color: "white",
            borderRadius: "0.25rem",
            padding: "0.2rem 0.5rem",
            marginLeft: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          {ehrms_code}
        </span>
      ) : (
        <span style={{ color: "#888" }}>N/A</span>
      )}
    </p>
  </Card.Body>
</Card>

  );
};

export default CoordinatorProfile;