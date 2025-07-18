import { useState } from "react";
import { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios.ts";

const MentorProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/profile/add", {
        userId: user?.id,
        name: user?.name,
        email: user?.email,
        bio,
        skills: skills.split(",").map((s) => s.trim()),
        experience,
        profileStatus: "Available",
      });

      setSuccess("Mentor profile created successfully!");
      setError("");
      navigate("/mentor/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error?.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };

  if (!user || user.role !== "mentor") {
    return <p className="text-center mt-8 text-red-500">Unauthorized</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow-lg border border-purple-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Complete Your Mentor Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          required
        />
        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="text"
          placeholder="Years of experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full p-2 border border-purple-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default MentorProfile;


