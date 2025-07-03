import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ ehrms_code: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/login/token/", credentials);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid EHRMS code or password");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#c1e4f9", margin: 0 }}>
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "400px", height: "500px", borderRadius: "20px", display: "flex", justifyContent: "center", padding: "30px" }}>
        <div style={{ width: "100%" }}>
          <h3 className="text-center mb-3">Login</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="ehrms_code"
              className="form-control"
              placeholder="EHRMS Code"
              value={credentials.ehrms_code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
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
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
