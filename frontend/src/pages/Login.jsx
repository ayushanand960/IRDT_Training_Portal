import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../assets/irdt-logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AccessCodeModal from "../components/AccessCodeModal";
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ ehrms_code: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);

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

      // if (is_superuser || is_coordinator) {
      //   setError("Access denied. Please use the Admin/Coordinator login page.");
      //   return;
      // }

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
    <div className="container-fluid min-vh-100 bg-light p-0">
      {/* Navbar */}
      {/* <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom" style={{ backgroundColor: "#006666" }}>
              <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                <img
                  src={logo}
                  alt="IRDT Logo"
                  style={{ height: "8vw", filter: "invert(1) brightness(2)" }}
                />
      
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h2 className="fw-bold mb-0" style={{ color: "white" }}>
                    Institute for Research, Development & Training (IRDT)
                  </h2>
                  <big className="fw-semibold" style={{ color: "white" }}>
                    Government of Uttar Pradesh
                  </big>
                  <br></br>
                  <big className="fw-semibold mb-0" style={{ color: "white", fontStyle: "italic" }}>
                    Shiksha Pragati - "Bridge of Education for Progress"
                  </big>
                </div>
              </div>
      
              <Link to="/" className="btn btn-outline-light fw-semibold">
                Home
              </Link>
            </div> */}
            <div className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom" style={{ backgroundColor: "#006666" }}>
  <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
    <img
      src={logo}
      alt="IRDT Logo"
      style={{ height: "7vw", filter: "invert(1) brightness(2)" }} // reduced logo size
    />

    <div style={{ textAlign: "center", flex: 1 }}>
      <h2 className="fw-bold mb-0" style={{ color: "white", fontSize: "2rem" }}>
        Institute for Research, Development & Training (IRDT)
      </h2>
      <p className="fw-semibold mb-0" style={{ color: "white", fontSize: "1.25rem" }}>
        Government of Uttar Pradesh
      </p>
      <p className="fw-semibold mb-0" style={{ color: "white", fontStyle: "italic", fontSize: "1.25rem" }}>
        Shiksha Pragati - "Bridge of Education for Progress"
      </p>
    </div>
  </div>

  <Link to="/" className="btn btn-outline-light fw-semibold btn-lg">
  Home
</Link>

</div>

      <br />
      <br />
      <br />
      <br />
     
      {/* Page content */}
      <div className="container d-flex justify-content-center align-items-center py-5">
        <div className="row w-100" style={{ maxWidth: "900px" }}>

          
          {/* New User Box */}
          <div className="col-md-6 p-4 border-end">
            <h5 className="fw-bold">NEW USER</h5>
            <hr className="border-2 border-warning w-25 mb-3 mt-1" />
            <p>Don’t have an Account Yet?</p>
            <button
              className="btn"
              style={{ backgroundColor: "#006666", color: "white" }}
              onClick={() => setShowAccessCodeModal(true)}
            >
              Sign up
            </button>
          </div>

          {/* Access Code Modal */}
          {showAccessCodeModal && (
            <AccessCodeModal onClose={() => setShowAccessCodeModal(false)} />
          )}

          {/* Existing User Box */}
          <div className="col-md-6 p-4">
            <h5 className="fw-bold">EXISTING USER</h5>
            <hr className="border-2 border-warning w-25 mb-3 mt-1" />
            <p>Login to your Account</p>

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

              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: "pointer", fontSize: "1.2rem", color: "#006666" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>

              </div>

              <div className="text-end mb-2">
                <Link to="/forgot_password" className="text-decoration-none small" style={{ color: "#006666" }}>
                  Forgot Password?
                </Link>

              </div>

              {error && (
                <div className="text-danger text-center mb-2 small">{error}</div>
              )}

              <button type="submit" className="btn w-100" style={{ backgroundColor: "#006666", color: "white" }}>
                Login
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>

  );
};
export default Login;





// {/* ✅ Error Messages */}
//           {error && <div className="text-danger text-center mb-2">{error}</div>}
//           {sessionExpired && (
//             <div className="text-danger text-center mb-2">
//               Session expired. Please login again.
//             </div>
//           )}

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
