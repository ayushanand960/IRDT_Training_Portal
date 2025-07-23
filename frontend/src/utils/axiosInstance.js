// // src/utils/axiosInstance.js
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000",
//   withCredentials: true, // to send/receive cookies
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (originalRequest.url.includes("/login/token/refresh/")) {
//       return Promise.reject(error); // prevent infinite loop
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await axiosInstance.post("/login/token/refresh/");
//         return axiosInstance(originalRequest); // retry original request
//       } catch (refreshError) {
//         console.error("🔐 Token refresh failed. Logging out...");
//         localStorage.setItem("logoutReason", "Session expired. Please login again.");
//         localStorage.removeItem("userData");
//         window.location.href = "/admin-coordinator-login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://127.0.0.1:8000",
//   withCredentials: true,
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent retry loop
//     if (
//       originalRequest._retry ||
//       originalRequest.url.includes("/login/token/refresh/")
//     ) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401) {
//       originalRequest._retry = true;
//       try {
//         await axiosInstance.post("/login/token/refresh/");
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("🔐 Token refresh failed. Logging out...");

//         // ✅ Clear session and let React Router handle redirect
//         localStorage.setItem("logoutReason", "Session expired. Please login again.");
//         localStorage.removeItem("userData");

//         // ✅ Instead of force refresh, just reject and handle redirect in AuthContext
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;






import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
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

        // ✅ Only set logoutReason once per expired session
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
