import express from "express";
import { createRequest, 
    getSentRequests, 
    getReceivedRequests,
  updateRequestStatus 
} from "../controller/mentorshipController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createRequest);         // Send a request
router.get("/sent", authMiddleware, getSentRequests);    // View sent requests
router.get("/received", authMiddleware, getReceivedRequests);
router.put("/:id", authMiddleware, updateRequestStatus);

export default router;