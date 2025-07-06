import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

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
      await axios.post(
        "/api/profile",
        {
          bio,
          skills: skills.split(",").map((s) => s.trim()),
          experience,
        },
        { withCredentials: true }
      );

      setSuccess("Profile created successfully!");
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
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Mentor Profile</h1>
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
          placeholder="Skills (comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Years of experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default MentorProfile;