


import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent retry loop
    if (
      originalRequest._retry ||
      originalRequest.url.includes("/login/token/refresh/")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/login/token/refresh/");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("🔐 Token refresh failed. Logging out...");

        // Only set logoutReason once per expired session
        if (!localStorage.getItem("logoutReason")) {
          localStorage.setItem(
            "logoutReason",
            "Session expired. Please login again."
          );
        }
        localStorage.removeItem("userData");

        // Reject to let React app handle redirect and showing messages
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
