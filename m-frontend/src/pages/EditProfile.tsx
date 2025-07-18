import { useState, useEffect } from "react";
import axiosInstance from "../services/axios";
import { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
    goals: "",
    available: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile/me");
        const profile = res.data.profile;

        setForm({
          name: profile.name || "",
          email: profile.email || "",
          bio: profile.bio || "",
          skills: profile.skills?.join(", ") || "",
          goals: profile.goals?.join(", ") || "",
          available: profile.available !== undefined ? profile.available : true,
        });

        setLoading(false);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error?.response?.data?.message || "Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axiosInstance.put("/profile/me", {
        name: form.name,
        email: form.email,
        bio: form.bio,
        skills: form.skills.split(",").map((s) => s.trim()),
        goals: form.goals.split(",").map((g) => g.trim()),
        available: form.available,
      });

      setSuccess("Profile updated successfully!");
      navigate(
        user?.role === "mentor"
          ? "/mentor/dashboard"
          : user?.role === "mentee"
          ? "/mentee/dashboard"
          : "/"
      );
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">Unauthorized</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow-lg border border-purple-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma-separated)"
          value={form.skills}
          onChange={handleChange}
          className="w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          name="goals"
          placeholder="Goals (comma-separated)"
          value={form.goals}
          onChange={handleChange}
          className="w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Availability Toggle */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
            className="accent-purple-600"
          />
          <span className="text-sm">Available for mentorship</span>
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;