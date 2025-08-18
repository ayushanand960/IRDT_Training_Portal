import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AccessCodeModal = ({ onClose }) => {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post("/login/check-access-code/", {
        access_code: accessCode,
      });

      if (response.data.valid) {
        onClose();
        navigate("/register/staff"); // ✅ redirect if backend says valid
      } else {
        setError("Invalid access code. Please try againGUYFUF.");
      }
    } catch (err) {
      setError("Invalid access code. Please try again.");
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >



      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Enter Access Code</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              placeholder="Enter access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCodeModal;