import express from "express";
import { createMentor, getMentorById } from "../controller/mentorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const mentorRouter = express.Router();

//POST /api/mentor/add
mentorRouter.post("/add", createMentor);

// GET /api/mentor/:id (for useProfileCheck)
mentorRouter.get("/:id", authMiddleware, getMentorById);

export default mentorRouter;