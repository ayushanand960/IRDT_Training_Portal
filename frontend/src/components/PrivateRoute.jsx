import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      //  Not logged in
      if (!user) {
        toast.error("You must be logged in to access this page!");
        navigate("/", { replace: true });
      }

      // Logged in but role not allowed
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

  // Access granted
  if (user && (!allowedRoles || allowedRoles.includes(user.role))) {
    return <Outlet />;
  }

  return null; // prevent flicker
};

export default PrivateRoute;

