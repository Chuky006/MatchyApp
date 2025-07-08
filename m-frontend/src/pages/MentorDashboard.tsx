import { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/useAuth";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useMentorProfileCheck } from "../hooks/useProfileCheck";

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
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"requests" | "sessions" | "feedback">("requests");

  useMentorProfileCheck(); 

  useEffect(() => {
    if (user?.role === "mentor") {
      axios
        .get("/api/requests/received", { withCredentials: true })
        .then((res) => setRequests(res.data.requests))
        .catch(() => console.error("Failed to load requests"));

      axios
        .get("/api/sessions", { withCredentials: true })
        .then((res) => setSessions(res.data.sessions))
        .catch(() => console.error("Failed to load sessions"));

      setLoading(false);
    }
  }, [user]);

  const handleFeedbackSubmit = async (sessionId: string) => {
    try {
      await axios.put(
        `/api/sessions/${sessionId}/mentor-feedback`,
        { feedback: feedbackMap[sessionId] },
        { withCredentials: true }
      );
      alert("Feedback submitted!");
      location.reload();
    } catch {
      alert("Failed to submit feedback.");
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      await axios.put(
        `/api/requests/${requestId}`,
        { status },
        { withCredentials: true }
      );
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
    } catch {
      console.error("Failed to update request");
      alert("Error updating request status.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar
        links={[
          { label: "Requests", path: "#", onClick: () => setTab("requests") },
          { label: "Sessions", path: "#", onClick: () => setTab("sessions") },
          { label: "Mentee Feedback", path: "#", onClick: () => setTab("feedback") },
        ]}
      />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold text-center mb-4">
            Welcome, Mentor {user?.name}
          </h1>

          {tab === "requests" && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Mentorship Requests</h2>
              {requests.length === 0 ? (
                <p className="text-gray-600">No requests received yet.</p>
              ) : (
                <ul className="space-y-2">
                  {requests.map((req) => (
                    <li
                      key={req._id}
                      className="border p-3 rounded shadow-sm flex justify-between items-center"
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
              <h2 className="text-xl font-semibold mb-2">Booked Sessions</h2>
              {sessions.length === 0 ? (
                <p className="text-gray-600">No sessions booked yet.</p>
              ) : (
                <ul className="space-y-2">
                  {sessions.map((session) => (
                    <li
                      key={session._id}
                      className="border p-3 rounded shadow-sm space-y-2"
                    >
                      <div>
                        Mentee: <strong>{session.mentee.name}</strong> <br />
                        Date: {new Date(session.scheduledDate).toLocaleString()}
                      </div>

                      {!session.feedbackFromMentor && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFeedbackSubmit(session._id);
                          }}
                          className="space-y-2"
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
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
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
              <h2 className="text-xl font-semibold mb-2">Mentee Feedback</h2>
              {sessions.filter((s) => s.feedbackFromMentee).length === 0 ? (
                <p className="text-gray-600">No feedback received yet.</p>
              ) : (
                <ul className="space-y-2">
                  {sessions
                    .filter((s) => s.feedbackFromMentee)
                    .map((s) => (
                      <li key={s._id} className="border p-3 rounded shadow-sm">
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
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
