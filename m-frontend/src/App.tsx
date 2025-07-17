import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import MenteeDashboard from "./pages/MenteeDashboard";
import MentorProfile from "./pages/MentorProfile";
import PrivateRoute from "./routes/PrivateRoute";
import MenteeMentorList from "./pages/MenteeMentorList";
import EditProfile from "./pages/EditProfile";
import MenteeProfile from "./pages/MenteeProfile";
import Home from "./pages/Home";
import BookMentor from "./pages/BookMentor";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🏠 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* 🔐 Mentor */}
        <Route
          path="/mentor/dashboard"
          element={
            <PrivateRoute allowedRoles={["mentor"]}>
              <MentorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentor/profile"
          element={
            <PrivateRoute allowedRoles={["mentor"]}>
              <MentorProfile />
            </PrivateRoute>
          }
        />

        {/* 🔐 Mentee */}
        <Route
          path="/mentee/dashboard"
          element={
            <PrivateRoute allowedRoles={["mentee"]}>
              <MenteeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentee/mentors"
          element={
            <PrivateRoute allowedRoles={["mentee"]}>
              <MenteeMentorList />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentee/profile"
          element={
            <PrivateRoute allowedRoles={["mentee"]}>
              <MenteeProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/book/:mentorId"
          element={
            <PrivateRoute allowedRoles={["mentee"]}>
              <BookMentor />
            </PrivateRoute>
          }
        />

        {/* 🔐 Shared: All roles */}
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute allowedRoles={["admin", "mentor", "mentee"]}>
              <EditProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
