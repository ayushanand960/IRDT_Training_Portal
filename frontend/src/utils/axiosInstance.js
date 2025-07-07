import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // 🔁 Replace with actual domain in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For CSRF cookies if needed
});

// ✅ Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle Token Expiry (Auto-refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh');
      if (!refreshToken) {
        console.warn("⚠️ No refresh token found. Redirecting to login.");
        localStorage.clear();
        window.location.href = '/admin-coordinator-login';
        return Promise.reject("No refresh token");
      }

      try {
        const res = await axios.post(
          'http://127.0.0.1:8000/login/token/refresh/',
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = res.data.access;
        localStorage.setItem('access', newAccessToken);

        // ✅ Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("🔐 Token refresh failed:", err);
        localStorage.clear();
        window.location.href = '/admin-coordinator-login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
