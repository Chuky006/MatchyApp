import express from "express";
import { users, editProfile } from "../controller/profile.js";
import { getMyProfile, updateMyProfile } from "../controller/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMentorProfiles } from "../controller/profile.js";


const profileRoutes = express.Router();

//Existing: Admin/Other role fetch by ID
profileRoutes.get("/users/:id", authMiddleware, users);

//Existing: Admin/Other role edit by ID
profileRoutes.put("/editProfile/:id", authMiddleware, editProfile);

//New: Authenticated user fetch own profile
profileRoutes.get("/me", authMiddleware, getMyProfile);

//New: Authenticated user edit own profile
profileRoutes.put("/me", authMiddleware, updateMyProfile);

profileRoutes.get("/mentors", authMiddleware, getMentorProfiles);

export default profileRoutes;