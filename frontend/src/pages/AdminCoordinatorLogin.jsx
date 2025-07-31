







import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../components/AuthContext"; // ✅ Import useAuth
import logo from "../assets/irdt-logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminCoordinatorLogin = () => {
  const [ehrmsId, setEhrmsId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // admin or coordinator
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);


  const { setUser } = useAuth(); // ✅ Get setUser from AuthContext
const sessionExpired = location.state?.sessionExpired || false;
  // useEffect(() => {
  //   const logoutReason = localStorage.getItem("logoutReason");
  //   if (logoutReason) {
  //     setError(logoutReason);
  //     setTimeout(() => localStorage.removeItem("logoutReason"), 100);
  //   }
  // }, []);

 useEffect(() => {
  if (location.state?.sessionExpired) {
    navigate(location.pathname, { replace: true, state: {} });
  }
}, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Step 1: Login (cookie-based JWT)
      await axiosInstance.post("/login/token/", {
        ehrms_code: ehrmsId,
        password: password,
      });

      // ✅ Step 2: Fetch user profile
      const res = await axiosInstance.get("/login/user/profile/");
      const { is_superuser, is_coordinator, ehrms_code } = res.data;

      // ✅ Step 3: Determine role and set in AuthContext
      const determinedRole = is_superuser
        ? "admin"
        : is_coordinator
        ? "coordinator"
        : "trainee";

      setUser({ ehrms_code, role: determinedRole }); // ✅ Required for PrivateRoute to work

      // ✅ Mark that user has logged in at least once
      localStorage.setItem("hasLoggedInBefore", "true");


      // ✅ Step 4: Navigate based on selected and actual role
      if (role === "admin" && is_superuser) {
        navigate("/admin-dashboard");
      } else if (role === "coordinator" && is_coordinator) {
        navigate(`/coordinator-dashboard/${ehrms_code}`);
      } else {
        setError("Access denied: You selected the wrong role.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid EHRMS ID or password");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };
return (
 <div className="container-fluid min-vh-100 bg-white p-0">
  {/* Navbar */}
  <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom" style={{ backgroundColor: "#006666" }}>
    <div className="d-flex align-items-center gap-3">
      <img src={logo} alt="IRDT Logo" style={{ height: "8vw", filter: "invert(1) brightness(2)" }} />
      <div>
        <h2 className="fw-bold mb-0" style={{ color: "white" , marginLeft: "2in"}}>
          Institute for Research, Development & Training (IRDT)
        </h2>
        <big className="fw-semibold" style={{ color: "white",marginLeft: "2in"  }}>
          Government of Uttar Pradesh
        </big>
      </div>
    </div>
    <Link to="/" className="btn btn-outline-light fw-semibold">
      Home
    </Link>
  </div>
<br/>
<br/>
<br/>
<br/>
  {/* Two-Column Section */}
  <div className="container py-5">
    <div className="row justify-content-center align-items-start">
      {/* Role Selection Column */}
      <div className="col-md-4 border-end pe-4">
        <h4 className="fw-bold mb-3 text-center">Select Role</h4>
        <br></br>

        <div className="d-flex flex-column gap-3 align-items-center">
          <button
            className={`btn ${role === "admin" ? "btn-success" : "btn-outline-success"} w-100`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
          <button
            className={`btn ${role === "coordinator" ? "btn-success" : "btn-outline-success"} w-100`}
            onClick={() => setRole("coordinator")}
          >
            Coordinator
          </button>
        </div>
      </div>

      {/* Login Form Column */}
      <div className="col-md-6 ps-4">
        <h4 className="text-center mb-4 fw-bold text-dark">
          {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login` : "Login"}
        </h4>

        <form onSubmit={handleLogin} className="shadow p-4 rounded border">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="EHRMS ID"
              value={ehrmsId}
              onChange={(e) => setEhrmsId(e.target.value)}
              required
              disabled={!role}
            />
          </div>

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!role}
            />
             <span
             className="position-absolute top-50 end-0 translate-middle-y me-3"
             style={{ cursor: "pointer", fontSize: "1.2rem", color: "#006666" }}
             onClick={() => setShowPassword(!showPassword)}
           >
             {showPassword ? <FaEyeSlash /> : <FaEye />}
           </span>
          </div>

          {error && (
            <div className="text-danger text-center mb-3 small">{error}</div>
          )}

          <button type="submit" className="btn btn-success w-100" disabled={!role}>
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

);
};
export default AdminCoordinatorLogin;