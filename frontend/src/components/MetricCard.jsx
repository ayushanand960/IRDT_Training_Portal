// src/components/MetricCard.jsx
import React from "react";
import { Card } from "react-bootstrap";

const MetricCard = ({ title, value, icon, bg }) => {
  return (
    <Card bg={bg} text="white" className="shadow-sm h-100">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="mb-0 fs-6">{title}</Card.Title>
          <h3 className="fw-bold">{value}</h3>
        </div>
        <div>{icon}</div>
      </Card.Body>
    </Card>
  );
};

export default MetricCard;
