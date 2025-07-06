import express from "express";
import {
  getAllUsers,
  getAllRequests,
  getAllSessions,
  assignMentorToMentee, 
} from "../controller/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();


router.get("/users", authMiddleware, requireAdmin, getAllUsers);
router.get("/requests", authMiddleware, requireAdmin, getAllRequests);
router.get("/sessions", authMiddleware, requireAdmin, getAllSessions);


router.post("/assign", authMiddleware, requireAdmin, assignMentorToMentee);

export default router;