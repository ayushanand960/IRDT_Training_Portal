// import React from "react";

// const ForgotPassword = () => {
//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
//         <h4 className="text-center mb-3">Reset Password</h4>
//         <p className="text-muted text-center">Enter your email to receive a reset link.</p>
//         <form>
//           <div className="mb-3">
//             <input type="email" className="form-control" placeholder="Email" required />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const correctAnswer = "blue";

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (ehrmsId && question && answer.toLowerCase() === correctAnswer) {
      setStep(2);
      setError('');
    } else {
      setError("Incorrect security answer.");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword && newPassword.length >= 4) {
      alert("✅ Password reset successfully!");
      navigate('/');
    } else {
      setError("Passwords do not match or are too short.");
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
                placeholder="Enter your EHRMS ID"
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
                <option value="color">What is your favorite color?</option>
                <option value="pet">What is your first pet’s name?</option>
                <option value="school_name">What is your school name?</option> 
                <option value="favourite_food">What is your favorite food?  </option>
                <option value="favorite_book">  What is your favorite book?   </option>
                <option value="nickname">    What was your childhood nickname? </option>
                <option value="best_friend">   What is the name of your childhood best friend?  </option>
                

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
