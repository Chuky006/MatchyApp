import express from "express";
import {
  createMentor,
  getMentorById,
  getAllMentors, // ✅ NEW
} from "../controller/mentorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const mentorRouter = express.Router();

// ✅ For mentees to fetch list of mentors
// GET /api/mentor/mentors
mentorRouter.get("/mentors", authMiddleware, getAllMentors);

// POST /api/mentor/add
mentorRouter.post("/add", createMentor);

// GET /api/mentor/:id (used for useProfileCheck)
mentorRouter.get("/:id", authMiddleware, getMentorById);

export default mentorRouter;