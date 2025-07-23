
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../components/AuthContext"; // ✅ Import useAuth

const AdminCoordinatorLogin = () => {
  const [ehrmsId, setEhrmsId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // admin or coordinator
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setUser } = useAuth(); // ✅ Get setUser from AuthContext

  // useEffect(() => {
  //   const logoutReason = localStorage.getItem("logoutReason");
  //   if (logoutReason) {
  //     setError(logoutReason);
  //     setTimeout(() => localStorage.removeItem("logoutReason"), 100);
  //   }
  // }, []);

  useEffect(() => {
  const logoutReason = localStorage.getItem("logoutReason");

  if (logoutReason) {
    setError(logoutReason);
    localStorage.removeItem("logoutReason");  // Clear immediately
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



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../components/AuthContext";

// const AdminCoordinatorLogin = () => {
//   const [ehrmsId, setEhrmsId] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState(""); // admin or coordinator
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const { user, setUser } = useAuth();

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

//   useEffect(() => {
//     const logoutReason = localStorage.getItem("logoutReason");
//     if (logoutReason) {
//       setError(logoutReason);
//       setTimeout(() => localStorage.removeItem("logoutReason"), 100);
//     }
//   }, []);

//   useEffect(() => {
//     window.history.pushState(null, null, window.location.href);
//     window.onpopstate = () => window.history.go(1);
//     return () => { window.onpopstate = null; };
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await axiosInstance.post("/login/token/", {
//         ehrms_code: ehrmsId,
//         password: password,
//       });

//       const res = await axiosInstance.get("/login/user/profile/");
//       const { is_superuser, is_coordinator, ehrms_code } = res.data;

//       const actualRole = is_superuser
//         ? "admin"
//         : is_coordinator
//         ? "coordinator"
//         : "trainee";

//       if ((role === "admin" && !is_superuser) || (role === "coordinator" && !is_coordinator)) {
//         await axiosInstance.post("/login/logout/");
//         setUser(null);
//         localStorage.removeItem("hasLoggedInBefore");
//         setError("Access denied: You selected the wrong role.");
//         return;
//       }

//       setUser({ ehrms_code, role: actualRole });
//       localStorage.setItem("hasLoggedInBefore", "true");

//       if (actualRole === "admin") {
//         navigate("/admin-dashboard");
//       } else if (actualRole === "coordinator") {
//         navigate(`/coordinator-dashboard/${ehrms_code}`);
//       }

//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError("Invalid EHRMS ID or password");
//       } else if (err.response?.data?.error) {
//         setError(err.response.data.error);
//       } else {
//         setError("Something went wrong. Please try again later.");
//       }
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#c1e4f9" }}>
//       <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "20px" }}>
//         <h4 className="text-center mb-4">Admin/Coordinator Login</h4>
//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="EHRMS ID"
//               value={ehrmsId}
//               onChange={(e) => setEhrmsId(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label d-block">Select Role:</label>
//             <div className="form-check form-check-inline">
//               <input
//                 className="form-check-input"
//                 type="radio"
//                 name="role"
//                 value="admin"
//                 checked={role === "admin"}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//               />
//               <label className="form-check-label">Admin</label>
//             </div>
//             <div className="form-check form-check-inline">
//               <input
//                 className="form-check-input"
//                 type="radio"
//                 name="role"
//                 value="coordinator"
//                 checked={role === "coordinator"}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//               />
//               <label className="form-check-label">Coordinator</label>
//             </div>
//           </div>

//           {error && <div className="text-danger mb-2 text-center">{error}</div>}

//           <button type="submit" className="btn btn-primary w-100">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminCoordinatorLogin;
