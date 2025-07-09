import MentorshipRequestModel from "../models/mentorshipRequestSchema.js";
import AuthModel from "../models/authSchema.js";

//Mentee sends a mentorship request
const createRequest = async (req, res) => {
  try {
    const menteeId = req.user._id;
    const { mentorId, message } = req.body;

    if (menteeId.toString() === mentorId) {
  return res.status(400).json({ message: "You cannot request yourself as a mentor" });

    //Check if mentor exists
    const mentor = await AuthModel.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
}
    }

    //Check if a request already exists
    const existing = await MentorshipRequestModel.findOne({ mentee: menteeId, mentor: mentorId });
    if (existing) {
      return res.status(400).json({ message: "You’ve already sent a request to this mentor." });
    }

    const newRequest = new MentorshipRequestModel({
      mentee: menteeId,
      mentor: mentorId,
      message,
    });

    await newRequest.save();
    res.status(201).json({ message: "Mentorship request sent." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Mentee views their sent requests
const getSentRequests = async (req, res) => {
  try {
    const menteeId = req.user._id;

    const requests = await MentorshipRequestModel.find({ mentee: menteeId })
      .populate("mentor", "name email skills")
      .sort({ createdAt: -1 });

      res.status(200).json({ requests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const requests = await MentorshipRequestModel.find({ mentor: mentorId })
      .populate("mentee", "name email skills goals")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const requestId = req.params.id;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await MentorshipRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }


    if (request.mentor.toString() !== mentorId.toString()) {
      return res.status(403).json({ message: "Unauthorized: Not your request" });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};




export { createRequest, getSentRequests, getReceivedRequests, updateRequestStatus };