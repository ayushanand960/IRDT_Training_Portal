import React from "react";
import { Card } from "react-bootstrap";


const MetricCard = ({ title, value, icon, iconBg = "#006666" }) => {
  return (
    <Card
      className="shadow-sm h-100 metric-card"
      style={{
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        color: "#333",
        border: "1px solid #eee",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
    >
      <Card.Body className="d-flex justify-content-between align-items-center p-4">
        <div>
          <Card.Title className="mb-1 fs-6 text-muted">{title}</Card.Title>
          <h3 className="fw-bold mb-0" style={{ fontSize: "1.8rem" }}>
            {value}
          </h3>
        </div>

        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: iconBg,
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            color: "#fff",
            fontSize: "1.4rem",
          }}
        >
          {icon}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MetricCard;

