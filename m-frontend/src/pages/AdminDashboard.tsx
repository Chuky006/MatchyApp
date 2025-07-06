import { useEffect, useState } from "react";
import axios from "../services/axios.ts";
;
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Request {
  _id: string;
  mentee: { _id: string; name: string };
  mentor?: { _id: string; name: string };
  status: string;
}

interface Session {
  _id: string;
  mentor: { name: string };
  mentee: { name: string };
  date: string;
  time: string;
}

const AdminDashboard = () => {
  const [tab, setTab] = useState<"users" | "requests" | "assign" | "sessions">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [menteeId, setMenteeId] = useState("");

  const mentors = users.filter((u) => u.role === "mentor");
  const mentees = users.filter((u) => u.role === "mentee");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", { withCredentials: true });
        setUsers(res.data.users || res.data);
      } catch {
        setError("Failed to load users");
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/admin/requests", { withCredentials: true });
        setRequests(res.data.requests || res.data);
      } catch {
        setError("Failed to load requests");
      }
    };

    const fetchSessions = async () => {
      try {
        const res = await axios.get("/api/admin/sessions", { withCredentials: true });
        setSessions(res.data.sessions || res.data);
      } catch {
        setError("Failed to load sessions");
      }
    };

    setError("");
    setSuccess("");

    if (tab === "users" || tab === "assign") fetchUsers();
    if (tab === "requests") fetchRequests();
    if (tab === "sessions") fetchSessions();
  }, [tab]);

  const handleAssign = async () => {
    if (!mentorId || !menteeId) {
      setError("Please select both a mentor and a mentee");
      return;
    }

    try {
      await axios.post(
        "/api/admin/assign",
        { mentorId, menteeId },
        { withCredentials: true }
      );
      setSuccess("Mentor assigned successfully");
      setError("");
      setMentorId("");
      setMenteeId("");
    } catch {
      setError("Failed to assign mentor");
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar
        links={[
          { label: "Users", path: "#", onClick: () => setTab("users") },
          { label: "Requests", path: "#", onClick: () => setTab("requests") },
          { label: "Assign", path: "#", onClick: () => setTab("assign") },
          { label: "Sessions", path: "#", onClick: () => setTab("sessions") },
        ]}
      />
      <div className="flex-1 md:ml-64">
        <Topbar />
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4">{success}</p>}

          {tab === "users" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">All Users</h2>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                <ul>
                  {users.map((user) => (
                    <li key={user._id} className="border-b py-2">
                      {user.name} ({user.role}) - {user.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "requests" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Mentorship Requests</h2>
              {requests.length === 0 ? (
                <p>No requests found.</p>
              ) : (
                <ul>
                  {requests.map((req) => (
                    <li key={req._id} className="border-b py-2">
                      Mentee: {req.mentee.name} → Mentor:{" "}
                      {req.mentor?.name || "Unassigned"} - Status: {req.status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "assign" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Assign Mentors to Mentees</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="">Select Mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor._id} value={mentor._id}>
                      {mentor.name}
                    </option>
                  ))}
                </select>

                <select
                  value={menteeId}
                  onChange={(e) => setMenteeId(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="">Select Mentee</option>
                  {mentees.map((mentee) => (
                    <option key={mentee._id} value={mentee._id}>
                      {mentee.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAssign}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Assign Mentor
              </button>
            </div>
          )}

          {tab === "sessions" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">All Sessions</h2>
              {sessions.length === 0 ? (
                <p>No sessions found.</p>
              ) : (
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-2 py-1">Mentor</th>
                      <th className="border px-2 py-1">Mentee</th>
                      <th className="border px-2 py-1">Date</th>
                      <th className="border px-2 py-1">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session._id}>
                        <td className="border px-2 py-1">{session.mentor.name}</td>
                        <td className="border px-2 py-1">{session.mentee.name}</td>
                        <td className="border px-2 py-1">{session.date}</td>
                        <td className="border px-2 py-1">{session.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;