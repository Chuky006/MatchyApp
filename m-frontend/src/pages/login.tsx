import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AxiosError } from "axios";
import axios from "../services/axios.ts";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page refresh

    try {
      const res = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });
      const { user } = res.data;
      console.log("Login successful:", user);

      setUser(user);

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
      console.error("Login error:", error?.response?.data || error.message);
      setError(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-600 underline">Register</a>
      </p>
    </div>
  );
};

export default Login;