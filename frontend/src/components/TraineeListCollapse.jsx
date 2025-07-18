import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function TraineeListCollapse({ trainingCode }) {
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [showList, setShowList] = useState(false);
  const [nominatedTrainees, setNominatedTrainees] = useState([]);
  const [showNominatedModal, setShowNominatedModal] = useState(false);

  // Fetch enrolled trainees
  useEffect(() => {
    if (showList) {
      axiosInstance
        .get(`/training/enrolled-trainees/${trainingCode}/`)
        .then((res) => {
          setTrainees(res.data);
        })
        .catch(() => {
          toast.error("⚠️ Failed to fetch enrolled trainees");
        });
    }
  }, [showList, trainingCode]);

  const toggleList = () => setShowList(!showList);

  const handleCheckboxChange = (ehrms_code) => {
    setSelectedTrainees((prev) =>
      prev.includes(ehrms_code)
        ? prev.filter((id) => id !== ehrms_code)
        : [...prev, ehrms_code]
    );
  };

  const handleNominate = () => {
    axiosInstance
      .post('/training/nominate-multiple/', {
        training_code: trainingCode,
        trainee_ehrms_codes: selectedTrainees,
      })
      .then(() => {
        toast.success("✅ Nomination successful!");
        setSelectedTrainees([]);
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          toast.error(`⚠️ ${error.response.data.error}`);
        } else {
          toast.error("⚠️ Nomination failed!");
        }
      });
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ['EHRMS Code', 'Name', 'Email'],
      ...trainees.map((t) => [t.ehrms_code, t.full_name, t.email])
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${trainingCode}_trainees.csv`;
    link.click();
  };

  const openNominatedModal = () => {
    axiosInstance
      .get(`/training/nominated/${trainingCode}/`)
      .then((res) => {
        setNominatedTrainees(res.data);
        setShowNominatedModal(true);
      })
      .catch(() => {
        toast.error("⚠️ Failed to fetch nominated trainees");
      });
  };

  const handleRemoveNominee = (ehrms_code) => {
    axiosInstance
      .delete(`/training/nomination/remove/${trainingCode}/${ehrms_code}/`)
      .then(() => {
        toast.success("❌ Nomination removed");
        setNominatedTrainees((prev) =>
          prev.filter((t) => t.ehrms_code !== ehrms_code)
        );
      })
      .catch(() => {
        toast.error("⚠️ Failed to remove nominee");
      });
  };

  return (
    <>
      <div className="card mb-3 border shadow">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          onClick={toggleList}
          style={{ cursor: 'pointer' }}
        >
          <span className="fw-bold">{trainingCode}</span>
          <span>{showList ? '▲' : '▼'}</span>
        </div>

        {showList && (
          <div className="card-body">
            {trainees.length === 0 ? (
              <p>No trainees enrolled.</p>
            ) : (
              <>
                <ul className="list-group mb-3">
                  {trainees.map((trainee) => (
                    <li key={trainee.ehrms_code} className="list-group-item d-flex justify-content-between">
                      <span>{trainee.name} ({trainee.ehrms_code})</span>
                      <input
                        type="checkbox"
                        checked={selectedTrainees.includes(trainee.ehrms_code)}
                        onChange={() => handleCheckboxChange(trainee.ehrms_code)}
                      />
                    </li>
                  ))}
                </ul>
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-primary" onClick={handleNominate}>
                    Nominate Selected
                  </button>
                  <button className="btn btn-secondary" onClick={openNominatedModal}>
                    Nominated Trainees
                  </button>
                  <button className="btn btn-outline-secondary" onClick={handleDownloadCSV}>
                    Download CSV
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal for nominated trainees */}
      <Modal show={showNominatedModal} onHide={() => setShowNominatedModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nominated Trainees - {trainingCode}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {nominatedTrainees.length === 0 ? (
            <p>No one nominated yet.</p>
          ) : (
            <ul className="list-group">
              {nominatedTrainees.map((trainee) => (
                <li key={trainee.ehrms_code} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{trainee.full_name} ({trainee.ehrms_code})</span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveNominee(trainee.ehrms_code)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNominatedModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
