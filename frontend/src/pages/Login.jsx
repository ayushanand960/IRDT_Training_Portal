

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Optional – if you have custom styles

const Login = () => {
  const [ehrmsId, setEhrmsId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (ehrmsId === 'admin' && password === '1234') {
      setError('');
      navigate('/dashboard');
    } else {
      setError('Invalid EHRMS ID or Password');
    }

  
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center bg-light" style={{ minHeight: "100vh" }}>
      <div className="card login-card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>


{/* Add the link below */}
      <Link to="/admin-coordinator-login">Admin-Coordinator Login</Link>


        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="EHRMS ID"
              value={ehrmsId}
              onChange={(e) => setEhrmsId(e.target.value)}
              required
            />
          </div>

          <div className="mb-2 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '40px' }}
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y pe-3"
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="mb-3 text-end">
            <Link
              to="/forgot_password"
              className="text-decoration-none text-primary"
              style={{ fontSize: '0.9rem' }}
            >
              Forgot Password?
            </Link>
          </div>

          {error && <div className="text-danger text-center mb-2">{error}</div>}

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <div className="mt-3 text-center">
            <span style={{ fontSize: '0.9rem' }}>
              If you don't have an account,{" "}
              <Link to="/register/staff" className="text-primary text-decoration-none">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;   