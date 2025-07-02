
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { securityQuestions } from "../data/securityQuestions";
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
  const [ehrmsId, setEhrmsId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [step, setStep] = useState(1); // 1: security Q, 2: set password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dummy correct answer
  // const correctAnswer = "blue";

 const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axiosInstance.post("/login/verify-security/", {
        ehrms_code: ehrmsId,
        security_question: question,
        security_answer: answer,
      });

      if (res.data.success) {
        setStep(2);
      } else {
        setError("Incorrect answer or user not found.");
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Verification failed.";
      setError(msg);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!strongPasswordRegex.test(newPassword)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.");
      return;
    }

    try {
      const res = await axiosInstance.post("/login/reset-password/", {
        ehrms_code: ehrmsId,
        new_password: newPassword,
      });

      if (res.status === 200) {
        alert("✅ Password reset successful!");
        navigate("/login");
      } else {
        setError("Something went wrong. Please try again.");
}

    } catch (err) {
      const msg = err.response?.data?.detail || "Password reset failed.";
      setError(msg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center " style={{ minHeight: '100vh', backgroundColor: "#c1e4f9"}}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center mb-4">Forgot Password</h4>

        {step === 1 && (
          <form onSubmit={handleSecuritySubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your EHRMS CODE"
                value={ehrmsId}
                onChange={(e) => setEhrmsId(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <select
                className="form-select"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              >
                  <option value="">Select Security Question</option>
                {securityQuestions.map((q, idx) => (
                  <option key={idx} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Your Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-danger text-center mb-2">{error}</div>}

            <button type="submit" className="btn btn-primary w-100">Verify</button>

            <div className="mt-3 text-center">
              <Link to="/" className="text-decoration-none text-primary" style={{ fontSize: '0.9rem' }}>
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-danger text-center mb-2">{error}</div>}

            <button type="submit" className="btn btn-success w-100">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
