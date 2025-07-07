import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCoordinatorLogin = () => {
  const [ehrmsId, setEhrmsId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // admin or coordinator
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/login/admin-token/", {
        ehrms_code: ehrmsId,
        password: password,
      });

      const { access, refresh, is_superuser, is_coordinator } = response.data;

      // Store tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // ✅ Validate selected role matches backend response
      if (role === "admin" && is_superuser) {
        navigate("/admin-dashboard");
      } else if (role === "coordinator" && is_coordinator) {
        navigate("/coordinator-dashboard");
      } else {
        setError("Access denied: You selected the wrong role.");
      }

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid EHRMS ID or password");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#c1e4f9" }}>
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "20px" }}>
        <h4 className="text-center mb-4">Admin/Coordinator Login</h4>
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
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ Role Selection Radio */}
          <div className="mb-3">
            <label className="form-label d-block">Select Role:</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <label className="form-check-label">Admin</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                value="coordinator"
                checked={role === "coordinator"}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <label className="form-check-label">Coordinator</label>
            </div>
          </div>

          {error && <div className="text-danger mb-2">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminCoordinatorLogin;
