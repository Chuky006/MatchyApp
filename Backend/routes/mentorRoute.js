import express from "express";
import {
  createMentor,
  getMentorById,
  getAllMentors,
  toggleMentorAvailability,
} from "../controller/mentorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const mentorRouter = express.Router();

//Get all mentors (for mentees)
mentorRouter.get("/mentors", authMiddleware, getAllMentors);

//Toggle availability (for mentors)
mentorRouter.put("/status", authMiddleware, toggleMentorAvailability);

//Add a new mentor (admin or manually)
mentorRouter.post("/add", createMentor);

//Get mentor by ID (used in useProfileCheck)
mentorRouter.get("/:id", authMiddleware, getMentorById);

export default mentorRouter;