import axios from "axios";

const axiosInstance = axios.create({
  // Use environment variable in production, fallback to localhost for dev
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;