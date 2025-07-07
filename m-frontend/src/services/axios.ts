import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://matchyapp-7.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;