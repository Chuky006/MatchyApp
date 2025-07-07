import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://matchyapp-7.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;