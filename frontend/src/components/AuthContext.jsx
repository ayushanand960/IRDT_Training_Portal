

import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let didCancel = false;

    // Skip session check if already on login-like page
    const currentPath = window.location.pathname;
    const isLoginPage =
      currentPath === "/login" ||
      currentPath === "/admin-coordinator-login" ||
      currentPath === "/forgot_password";

    // Don't check profile if already on login page
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/login/user/profile/");
        if (didCancel) return;

        const { is_superuser, is_coordinator, ehrms_code } = res.data;

        


        setUser({
          ehrms_code,
          is_superuser,
          is_coordinator,
          role: is_superuser
            ? "admin"
            : is_coordinator
              ? "coordinator"
              : "trainee",
        });



      } catch (err) {
        if (!didCancel) {
          setUser(null);

          const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");
          if (err.response?.status === 401) {
            if (hasLoggedInBefore === "true") {
              localStorage.setItem("logoutReason", "Session expired. Please login again.");
            }
            localStorage.removeItem("hasLoggedInBefore"); // ✅ Clear it after failure
          }

        }
      } finally {
        if (!didCancel) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
