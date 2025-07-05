import express from "express";
import { setAvailability, getMentorAvailability } from "../controller/availabilityController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mentor sets availability
router.post("/", authMiddleware, setAvailability);

// Anyone can view a mentor’s availability
router.get("/:mentorId", getMentorAvailability);

export default router;
