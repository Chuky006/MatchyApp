import AuthModel from "../models/authSchema.js";
import MentorshipRequestModel from "../models/mentorshipRequestSchema.js";
import SessionModel from "../models/sessionSchema.js";

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await AuthModel.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all mentorship requests (matches)
const getAllRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequestModel.find()
      .populate("mentor", "name email")
      .populate("mentee", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await SessionModel.find()
      .populate("mentor", "name email")
      .populate("mentee", "name email")
      .sort({ scheduledDate: 1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST assign mentor to mentee
const manuallyAssignMentor = async (req, res) => {
  try {
    const { mentorId, menteeId, message } = req.body;

    const mentor = await AuthModel.findById(mentorId);
    const mentee = await AuthModel.findById(menteeId);

    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found or invalid role" });
    }

    if (!mentee || mentee.role !== "mentee") {
      return res.status(404).json({ message: "Mentee not found or invalid role" });
    }

    const existing = await MentorshipRequestModel.findOne({ mentor: mentorId, mentee: menteeId });
    if (existing) {
      return res.status(400).json({ message: "A request already exists between these users" });
    }

    const request = new MentorshipRequestModel({
      mentor: mentorId,
      mentee: menteeId,
      message,
      status: "accepted",
    });

    await request.save();
    res.status(201).json({ message: "Mentor assigned successfully", request });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllUsers, getAllRequests, getAllSessions, manuallyAssignMentor };