import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // 🛑 Not logged in
      if (!user) {
        toast.error("You must be logged in to access this page!");
        navigate("/", { replace: true });
      }

      // 🛑 Logged in but role not allowed
      else if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error("Unauthorized access!");
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  // ✅ Access granted
  if (user && (!allowedRoles || allowedRoles.includes(user.role))) {
    return <Outlet />;
  }

  return null; // ⏳ prevent flicker
};

export default PrivateRoute;



// import { Outlet } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";

// const PrivateRoute = ({ allowedRoles }) => {
//   const { user, loading } = useAuth();

//   console.log("🔐 user:", user);
//   console.log("⏳ loading:", loading);

//   if (loading) {
//     return (
//       <div className="text-center mt-5">
//         <h4>Loading...</h4>
//       </div>
//     );
//   }

//   // 🛑 Not logged in
//   if (!user) {
//     return (
//       <div className="text-center mt-5 text-danger">
//         <h3>🔒 Access Denied</h3>
//         <p>You must be logged in to access this page.</p>
//       </div>
//     );
//   }

//   // 🛑 Logged in but role not allowed
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return (
//       <div className="text-center mt-5 text-danger">
//         <h3>🚫 Unauthorized</h3>
//         <p>You do not have permission to access this page.</p>
//       </div>
//     );
//   }

//   // ✅ Access granted
//   return <Outlet />;
// };

// export default PrivateRoute;
