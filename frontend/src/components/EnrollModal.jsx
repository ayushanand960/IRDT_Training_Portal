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
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={onConfirm}>Confirm Apply</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EnrollModal;