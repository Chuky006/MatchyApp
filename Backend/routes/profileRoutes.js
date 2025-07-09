import express from "express";
import {
  users,
  editProfile,
  getMentorProfiles,
  toggleAvailability,
} from "../controller/profile.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controller/profileController.js";
import { createMentor } from "../controller/mentorController.js"; // ✅ FIXED import name
import { authMiddleware } from "../middleware/authMiddleware.js";

const profileRoutes = express.Router();

// ✅ Route to add mentor (used by admin or internal form)
profileRoutes.post("/add", createMentor);

// Authenticated user fetches own profile
profileRoutes.get("/me", authMiddleware, getMyProfile);

// Authenticated user updates their own profile
profileRoutes.put("/me", authMiddleware, updateMyProfile);

// Admin fetches any user's profile by ID
profileRoutes.get("/users/:id", authMiddleware, users);

// Admin edits any user's profile by ID
profileRoutes.put("/editProfile/:id", authMiddleware, editProfile);

// Get all mentor profiles (for mentees to view)
profileRoutes.get("/mentors", authMiddleware, getMentorProfiles);

// ✅ Toggle mentor availability (mentor dashboard button)
profileRoutes.put("/toggle-availability", authMiddleware, toggleAvailability);

export default profileRoutes;