import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ ehrms_code: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  // ✅ Handle sessionExpired passed from homepage
  useEffect(() => {
    if (location.state?.sessionExpired) {
      setSessionExpired(true);

      // Remove sessionExpired from history after first render
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Step 1: Login
      await axiosInstance.post("/login/token/", credentials);

      // ✅ Step 2: Get profile
      const res = await axiosInstance.get("/login/user/profile/");
      const { is_superuser, is_coordinator, ehrms_code } = res.data;

      if (is_superuser || is_coordinator) {
        setError("Access denied. Please use the Admin/Coordinator login page.");
        return;
      }

      // ✅ Step 3: Set user in context
      setUser({ ehrms_code, role: "trainee" });

      // ✅ Optional: Remember that user logged in
      localStorage.setItem("hasLoggedInBefore", "true");

      // ✅ Step 4: Navigate to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Invalid EHRMS code or password");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#c1e4f9" }}>
      <button
        onClick={() => navigate('/')}
        className="btn btn-outline-dark btn-lg fw-semibold"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          fontSize: "1.1rem",
          padding: "6px 16px",
        }}
      >
        🏠 Home
      </button>

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
            <Link to="/forgot_password" className="text-decoration-none text-primary" style={{ fontSize: '0.9rem' }}>
              Forgot Password?
            </Link>
          </div>

          {/* ✅ Error Messages */}
          {error && <div className="text-danger text-center mb-2">{error}</div>}
          {sessionExpired && (
            <div className="text-danger text-center mb-2">
              Session expired. Please login again.
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">Login</button>

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


// import React, { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Login.css';

// const Login = () => {
//   const [credentials, setCredentials] = useState({ ehrms_code: "", password: "" });
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const { user, setUser } = useAuth();

//   // ✅ Auto-logout only if previously logged in
//   useEffect(() => {
//     const performLogoutIfPreviouslyLoggedIn = async () => {
//       const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");
//       if (user && hasLoggedInBefore === "true") {
//         try {
//           await axiosInstance.post("/login/logout/");
//           setUser(null);
//           localStorage.removeItem("hasLoggedInBefore");
//           localStorage.setItem("logoutReason", "Session reset. Please login again.");
//         } catch (err) {
//           console.error("Auto-logout failed", err);
//         }
//       }
//     };

//     performLogoutIfPreviouslyLoggedIn();
//   }, [user, setUser]);

//   // ✅ Block browser back button
//   useEffect(() => {
//     window.history.pushState(null, null, window.location.href);
//     window.onpopstate = () => window.history.go(1);
//     return () => { window.onpopstate = null; };
//   }, []);

//   // ✅ Show logout reason (optional)
//   useEffect(() => {
//     const logoutReason = localStorage.getItem("logoutReason");
//     if (logoutReason) {
//       setError(logoutReason);
//       setTimeout(() => localStorage.removeItem("logoutReason"), 100);
//     }
//   }, []);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await axiosInstance.post("/login/token/", credentials);

//       const res = await axiosInstance.get("/login/user/profile/");
//       const { is_superuser, is_coordinator, ehrms_code } = res.data;

//       if (is_superuser || is_coordinator) {
//         setError("Access denied. Please use the Admin/Coordinator login page.");
//         return;
//       }

//       setUser({ ehrms_code, role: "trainee" });
//       localStorage.setItem("hasLoggedInBefore", "true");

//       navigate("/dashboard");

//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError("Invalid EHRMS code or password");
//       } else if (err.response?.data?.error) {
//         setError(err.response.data.error);
//       } else {
//         setError("Something went wrong. Please try again later.");
//       }
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#c1e4f9" }}>
//       <div className="card shadow-lg" style={{ width: "100%", maxWidth: "400px", height: "500px", borderRadius: "20px", display: "flex", justifyContent: "center", padding: "30px" }}>
//         <div style={{ width: "100%" }}>
//           <h3 className="text-center mb-3">Login</h3>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <input
//               type="text"
//               name="ehrms_code"
//               className="form-control"
//               placeholder="EHRMS Code"
//               value={credentials.ehrms_code}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-2 position-relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               className="form-control"
//               placeholder="Password"
//               value={credentials.password}
//               onChange={handleChange}
//               required
//               style={{ paddingRight: '40px' }}
//             />
//             <span
//               className="position-absolute top-50 end-0 translate-middle-y pe-3"
//               style={{ cursor: "pointer", userSelect: "none" }}
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? "🙈" : "👁️"}
//             </span>
//           </div>

//           <div className="mb-3 text-end">
//             <Link to="/forgot_password" className="text-decoration-none text-primary" style={{ fontSize: '0.9rem' }}>
//               Forgot Password?
//             </Link>
//           </div>

//           {error && <div className="text-danger text-center mb-2">{error}</div>}

//           <button type="submit" className="btn btn-primary w-100">Login</button>

//           <div className="mt-3 text-center">
//             <span style={{ fontSize: '0.9rem' }}>
//               If you don't have an account,{" "}
//               <Link to="/register/staff" className="text-primary text-decoration-none">
//                 Register
//               </Link>
//             </span>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
