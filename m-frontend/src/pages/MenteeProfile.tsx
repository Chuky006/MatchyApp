import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const MenteeProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [goals, setGoals] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile/me", { withCredentials: true });
        const profile = res.data.profile;

        setBio(profile.bio || "");
        setGoals((profile.goals || []).join(", "));
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error?.response?.data?.message || "Could not fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(
        "/api/profile/me",
        {
          bio,
          goals: goals.split(",").map((g) => g.trim()),
        },
        { withCredentials: true }
      );

      setSuccess("Profile updated successfully!");
      setError("");
      navigate("/mentee/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };

  if (!user || user.role !== "mentee") {
    return <p className="text-center mt-8 text-red-500">Unauthorized</p>;
  }

  if (loading) {
    return <p className="text-center mt-8">Loading profile...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-700">Complete Your Mentee Profile</h1>
        <button
          onClick={() => navigate("/profile/edit")}
          className="text-sm text-purple-600 underline hover:text-purple-800 transition"
        >
          View/Edit Profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
        <input
          type="text"
          placeholder="Goals (comma-separated)"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default MenteeProfile;
