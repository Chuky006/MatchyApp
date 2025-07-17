import { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/useAuth";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useMentorProfileCheck } from "../hooks/useProfileCheck";
import { useNavigate } from "react-router-dom";

interface Request {
  _id: string;
  mentee: { name: string };
  status: string;
}

interface Session {
  _id: string;
  mentee: { name: string };
  scheduledDate: string;
  feedbackFromMentee?: string;
  feedbackFromMentor?: string;
}

const MentorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"requests" | "sessions" | "feedback">("requests");

  useMentorProfileCheck();

  useEffect(() => {
    if (user?.role === "mentor") {
      axios
        .get("/requests/received")
        .then((res) => setRequests(res.data.requests))
        .catch(() => console.error("Failed to load requests"));

      axios
        .get("/sessions")
        .then((res) => setSessions(res.data.sessions))
        .catch(() => console.error("Failed to load sessions"));

      setLoading(false);
    }
  }, [user]);

  const handleFeedbackSubmit = async (sessionId: string) => {
    try {
      await axios.put(`/sessions/${sessionId}/mentor-feedback`, {
        feedback: feedbackMap[sessionId],
      });
      alert("✅ Feedback submitted!");
      location.reload();
    } catch {
      alert("❌ Failed to submit feedback.");
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      await axios.put(`/requests/${requestId}`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
    } catch {
      console.error("Failed to update request");
      alert("❌ Error updating request status.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <Sidebar
        links={[
          { label: "Requests", path: "#", onClick: () => setTab("requests") },
          { label: "Sessions", path: "#", onClick: () => setTab("sessions") },
          { label: "Mentee Feedback", path: "#", onClick: () => setTab("feedback") },
        ]}
      />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white bg-opacity-95 shadow-md rounded-lg">
          <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
            Welcome, Mentor {user?.name}
          </h1>

          {tab === "requests" && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-3">
                Mentorship Requests
              </h2>
              {requests.length === 0 ? (
                <p className="text-gray-600">No requests received yet.</p>
              ) : (
                <ul className="space-y-2">
                  {requests.map((req) => (
                    <li
                      key={req._id}
                      className="border p-3 rounded shadow-sm bg-white flex justify-between items-center"
                    >
                      <div>
                        Mentee: <strong>{req.mentee.name}</strong> - Status:{" "}
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            req.status === "pending"
                              ? "bg-yellow-500"
                              : req.status === "accepted"
                              ? "bg-green-600"
                              : "bg-gray-400"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      {req.status === "pending" && (
                        <div className="space-x-2">
                          <button
                            onClick={() => updateRequestStatus(req._id, "accepted")}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateRequestStatus(req._id, "declined")}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {tab === "sessions" && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700 mb-3">
                Booked Sessions
              </h2>
              {sessions.length === 0 ? (
                <p className="text-gray-600">No sessions booked yet.</p>
              ) : (
                <ul className="space-y-4">
                  {sessions.map((session) => (
                    <li
                      key={session._id}
                      className="border p-4 rounded shadow-sm bg-white"
                    >
                      <div className="text-sm text-gray-800">
                        <strong>Mentee:</strong> {session.mentee.name} <br />
                        <strong>Date:</strong>{" "}
                        {new Date(session.scheduledDate).toLocaleString()}
                      </div>

                      {!session.feedbackFromMentor && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFeedbackSubmit(session._id);
                          }}
                          className="mt-2 space-y-2"
                        >
                          <input
                            name="feedback"
                            placeholder="Write feedback..."
                            className="w-full border rounded p-2"
                            value={feedbackMap[session._id] || ""}
                            onChange={(e) =>
                              setFeedbackMap((prev) => ({
                                ...prev,
                                [session._id]: e.target.value,
                              }))
                            }
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

          {tab === "feedback" && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700 mb-3">
                Mentee Feedback
              </h2>
              {sessions.filter((s) => s.feedbackFromMentee).length === 0 ? (
                <p className="text-gray-600">No feedback received yet.</p>
              ) : (
                <ul className="space-y-2">
                  {sessions
                    .filter((s) => s.feedbackFromMentee)
                    .map((s) => (
                      <li
                        key={s._id}
                        className="border p-3 rounded shadow-sm bg-white"
                      >
                        <strong>{s.mentee.name}</strong>:{" "}
                        <span className="italic text-gray-700">
                          {s.feedbackFromMentee}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          )}

          {/* 🔙 Back to Home */}
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

export default MentorDashboard;
