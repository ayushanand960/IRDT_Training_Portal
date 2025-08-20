// src/components/EnrollModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const EnrollModal = ({ show, onHide, training, ehrmsCode, onConfirm }) => {
  if (!training) return null;

  const {
    name,
    venue,
    mode,
    start_date,
    end_date,
    target_group,
    code,
  } = training;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Enrollment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p><strong>Training Name:</strong> {name}</p>
        <p><strong>Code:</strong> {code}</p>
        <p><strong>Venue:</strong> {venue}</p>
        <p><strong>Mode:</strong> {mode}</p>
        <p><strong>Dates:</strong> {new Date(start_date).toLocaleDateString()} - {new Date(end_date).toLocaleDateString()}</p>
        <p><strong>Target Group:</strong> {target_group}</p>
        <hr />
        <p><strong>Your EHRMS Code:</strong> {ehrmsCode}</p>
        <p className="text-danger"><strong>Are you sure you want to apply?</strong></p>
      </Modal.Body>

      <Modal.Footer>
        {/* Cancel button - outlined green */}
        <Button
          style={{
            borderColor: "#006666",
            color: "#006666",
            backgroundColor: "transparent",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#006666";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#006666";
          }}
          onClick={onHide}
        >
          Cancel
        </Button>

        {/* Confirm button - solid green */}
        <Button
          style={{
            backgroundColor: "#006666",
            borderColor: "#006666",
            color: "white",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#004c4c";
            e.target.style.borderColor = "#004c4c";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#006666";
            e.target.style.borderColor = "#006666";
          }}
          onClick={onConfirm}
        >
          Confirm Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EnrollModal;