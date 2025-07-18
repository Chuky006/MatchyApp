import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Topbar from "../components/Topbar";
import { useMenteeProfileCheck } from "../hooks/useProfileCheck";

interface Request {
  _id: string;
  mentor: { name: string };
  status: string;
}

interface Session {
  _id: string;
  mentor: { name: string };
  scheduledDate: string;
  feedbackFromMentor?: string;
  feedbackFromMentee?: string;
}

const MenteeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"requests" | "sessions">("requests");

  const [requests, setRequests] = useState<Request[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState("");
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  useMenteeProfileCheck(); //Ensures profile is complete before proceeding

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tab === "requests") {
          const res = await axios.get("/requests/sent");
          setRequests(res.data.requests);
        } else if (tab === "sessions") {
          const res = await axios.get("/sessions");
          setSessions(res.data.sessions);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("❌ Fetch failed", axiosError);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [tab]);

  const handleFeedbackSubmit = async (sessionId: string) => {
    try {
      await axios.put(`/sessions/${sessionId}/mentee-feedback`, {
        feedback: feedbackMap[sessionId],
      });
      alert("✅ Feedback submitted!");
      location.reload();
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("❌ Feedback submission failed", axiosError);
      alert("❌ Failed to submit feedback.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1601933470928-cddc201a7cdd?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <Topbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white bg-opacity-95 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
            Welcome, Mentee {user?.name}
          </h1>

          {/* Profile Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => navigate("/mentee/profile")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate("/profile/edit")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded font-semibold transition ${
                tab === "requests"
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 text-black hover:bg-purple-100"
              }`}
              onClick={() => setTab("requests")}
            >
              My Requests
            </button>
            <button
              className={`px-4 py-2 rounded font-semibold transition ${
                tab === "sessions"
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 text-black hover:bg-purple-100"
              }`}
              onClick={() => setTab("sessions")}
            >
              My Sessions
            </button>
          </div>

          {/* Find a Mentor */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => navigate("/mentee/mentors")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              Find a Mentor
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {/* Requests */}
          {tab === "requests" && (
            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-3">
                Mentorship Requests
              </h2>
              {requests.length === 0 ? (
                <p className="text-gray-600">No requests found.</p>
              ) : (
                <ul className="divide-y">
                  {requests.map((r) => (
                    <li key={r._id} className="py-3 text-gray-800">
                      <strong>Mentor:</strong> {r.mentor.name} —{" "}
                      <span className="italic text-purple-600">{r.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Sessions */}
          {tab === "sessions" && (
            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-3">
                Upcoming or Completed Sessions
              </h2>
              {sessions.length === 0 ? (
                <p className="text-gray-600">No sessions found.</p>
              ) : (
                <ul className="space-y-4">
                  {sessions.map((s) => (
                    <li
                      key={s._id}
                      className="border p-4 rounded bg-white shadow-sm"
                    >
                      <div className="text-sm text-gray-800">
                        <strong>With:</strong> {s.mentor.name} <br />
                        <strong>Date:</strong>{" "}
                        {new Date(s.scheduledDate).toLocaleString()}
                      </div>

                      {s.feedbackFromMentor && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Mentor Feedback:</strong>{" "}
                          <em>{s.feedbackFromMentor}</em>
                        </p>
                      )}

                      {!s.feedbackFromMentee && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFeedbackSubmit(s._id);
                          }}
                          className="mt-3 space-y-2"
                        >
                          <input
                            type="text"
                            placeholder="Write your feedback"
                            value={feedbackMap[s._id] || ""}
                            onChange={(e) =>
                              setFeedbackMap((prev) => ({
                                ...prev,
                                [s._id]: e.target.value,
                              }))
                            }
                            className="w-full border p-2 rounded"
                          />
                          <button
                            type="submit"
                            className="bg-purple-700 text-white px-4 py-1 rounded hover:bg-purple-800 transition"
                          >
                            Submit Feedback
                          </button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Back to Home */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-purple-600 underline hover:text-purple-800"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;