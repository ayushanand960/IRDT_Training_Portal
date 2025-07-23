


// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";

// const PrivateRoute = ({ allowedRoles }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   console.log("🔐 user:", user);
//   console.log("⏳ loading:", loading);
  
//   if (loading) {
//     return (
//       <div className="text-center mt-5">
//         <h4>Loading...</h4>
//       </div>
//     );
//   }

//   // If not authenticated or role not allowed
//   if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;




import { Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  console.log("🔐 user:", user);
  console.log("⏳ loading:", loading);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  // 🛑 Not logged in
  if (!user) {
    return (
      <div className="text-center mt-5 text-danger">
        <h3>🔒 Access Denied</h3>
        <p>You must be logged in to access this page.</p>
      </div>
    );
  }

  // 🛑 Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="text-center mt-5 text-danger">
        <h3>🚫 Unauthorized</h3>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  // ✅ Access granted
  return <Outlet />;
};

export default PrivateRoute;
