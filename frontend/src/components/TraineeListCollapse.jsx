import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function TraineeListCollapse({ trainingCode }) {
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (showList) {
      axiosInstance
        .get(`/training/enrolled-trainees/${trainingCode}/`)
        .then((res) => {
          setTrainees(res.data);
        })
        .catch((err) => {
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
      })
      .catch((err) => {
        toast.error("⚠️ Nomination failed!");
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

  return (
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
              <button className="btn btn-primary me-2" onClick={handleNominate}>
                Nominate Selected
              </button>
              <button className="btn btn-outline-secondary" onClick={handleDownloadCSV}>
                Download CSV
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
