import express from "express";
import { bookSession, 
    getMySessions, 
    menteeFeedback,
  mentorFeedback 
} from "../controller/sessionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, bookSession);
router.get("/", authMiddleware, getMySessions);    //Mentor or Mentee views sessions
router.post("/:id/mentee-feedback", authMiddleware, menteeFeedback);
router.post("/:id/mentor-feedback", authMiddleware, mentorFeedback);

export default router;