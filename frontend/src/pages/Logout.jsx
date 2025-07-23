// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 🚪 Call backend to clear cookie
        await axiosInstance.post("/login/logout/");

        // 🧹 Clear localStorage and set message
        localStorage.removeItem("hasLoggedInBefore");
        localStorage.setItem("logoutReason", "You have been logged out.");

        // ✅ Block back navigation from landing back to protected page
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = () => {
          window.history.go(1);
        };

        // 🧭 Redirect to login page
        navigate("/", { replace: true });

      } catch (error) {
        console.error("Logout failed", error);
        // Optional: navigate to login even on failure
        navigate("/", { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return null;
};

export default Logout;
