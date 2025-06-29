import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Add a request interceptor to dynamically set the Authorization header
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log("🔐 Axios Interceptor Token:", token); // <-- ADD THIS

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;