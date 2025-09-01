
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// Set your backend base URL here
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';  // Adjust as per deployment

const AllCertificatesModal = ({ show, onClose, certificates }) => {
  const handleDownload = (certificate) => {
    if (!certificate?.certificate_file) {
      alert('Certificate file not available.');
      return;
    }

    // Prepend BASE_URL if the file path is relative
    const downloadURL = certificate.certificate_file.startsWith('http')
      ? certificate.certificate_file
      : `${BASE_URL}${certificate.certificate_file}`;

    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = `certificate_${certificate.training?.code || 'unknown'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>All Certificates</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {certificates.length === 0 ? (
          <p className="text-muted">No certificates found.</p>
        ) : (
          <ul className="list-group">
            {certificates.map((cert, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{cert.training?.name || "Training Name Not Available"}</strong><br />
                  <small>
                    {cert.training?.start_date || "Start"} to {cert.training?.end_date || "End"}
                  </small>
                </div>
                <a
                  href={`${BASE_URL}/certificate/download/${cert.training.code}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="sm">
                    Download
                  </Button>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AllCertificatesModal;
