// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8000/',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await axios.post(
//           'http://localhost:8000/login/token/refresh/',
//           {},
//           { withCredentials: true }
//         );

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // ❌ Don't redirect — throw error to component
//         console.error("🔒 Token refresh failed:", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true, // to send/receive cookies
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/login/token/refresh/")) {
      return Promise.reject(error); // prevent infinite loop
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/login/token/refresh/");
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("🔐 Token refresh failed. Logging out...");
        localStorage.setItem("logoutReason", "Session expired. Please login again.");
        localStorage.removeItem("userData");
        window.location.href = "/admin-coordinator-login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
