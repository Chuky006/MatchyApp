import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AxiosError } from "axios";
import axiosInstance from "../services/axios";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { user } = res.data;

      console.log("✅ Login successful:", user);
      setUser(user);

      try {
        const profileRes = await axiosInstance.get("/profile/me");
        console.log("📥 /profile/me response:", profileRes.data);
      } catch (profileErr) {
        console.error("❌ /profile/me failed:", profileErr);
      }

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "mentor":
          navigate("/mentor/dashboard");
          break;
        case "mentee":
          navigate("/mentee/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("❌ Login error:", error?.response?.data || error.message);
      setError(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-purple-100 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-purple-200">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-md font-medium transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-purple-600 underline hover:text-purple-800 transition"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;