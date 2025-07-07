import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

interface Mentor {
  _id: string;
  name: string;
  bio: string;
  skills: string[];
  experience: string;
}

const MenteeMentorList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get("/api/profile/mentors", { withCredentials: true });
        setMentors(res.data.mentors); // assuming backend sends { mentors: [] }
      } catch (err) {
        const error = err as AxiosError;
        console.error(error);
        setError("Failed to load mentors.");
      }
    };

    fetchMentors();
  }, []);

  const handleRequest = async (mentorId: string) => {
    try {
      await axios.post(
        "/api/requests",
        { mentorId },
        { withCredentials: true }
      );
      alert("Mentorship request sent!");
      navigate("/mentee/dashboard"); // ✅ Option 1: Redirect to dashboard
    } catch (err) {
      const error = err as AxiosError;
      console.error(error);
      alert("Failed to send request.");
    }
  };

  if (!user || user.role !== "mentee") {
    return <p className="text-center mt-10 text-red-500">Unauthorized</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Available Mentors</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {mentors.length === 0 ? (
        <p className="text-center">No mentors available.</p>
      ) : (
        mentors.map((mentor) => (
          <div key={mentor._id} className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="text-lg font-semibold">{mentor.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{mentor.bio}</p>
            <p className="text-sm">Skills: {mentor.skills.join(", ")}</p>
            <p className="text-sm">Experience: {mentor.experience} years</p>
            <button
              onClick={() => handleRequest(mentor._id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Request Mentorship
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MenteeMentorList;
