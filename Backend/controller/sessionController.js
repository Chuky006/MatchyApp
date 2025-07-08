import SessionModel from "../models/sessionSchema.js";
import AuthModel from "../models/authSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

//Mentee books a session with a mentor
const bookSession = async (req, res) => {
  try {
    const menteeId = req.user._id;
    const { mentorId, date, time } = req.body;

    //Validate required fields
    if (!mentorId || !date || !time) {
      return res.status(400).json({ message: "All fields are required: mentorId, date, time" });
    }

    //Check if mentor exists
    const mentor = await AuthModel.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    //Check if mentor is already booked at that date and time
    const existing = await SessionModel.findOne({ mentor: mentorId, date, time });
    if (existing) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const newSession = new SessionModel({
      mentor: mentorId,
      mentee: menteeId,
      date,
      time,
    });

    await newSession.save();

    //Fetch mentor and mentee details to send mails
const mentee = await AuthModel.findById(menteeId);


//Format readable time
const formattedDate = new Date(date).toLocaleDateString();
const formattedTime = time;

//Send email to mentor
await sendEmail({
  to: mentor.email,
  subject: "New Mentorship Session Booked",
  text: `Hi ${mentor.name},\n\nYou have a new session booked by ${mentee.name} on ${formattedDate} at ${formattedTime}.\n\nPlease prepare accordingly.\n\n– Matchy App`,
});

//Send email to mentee
await sendEmail({
  to: mentee.email,
  subject: "Mentorship Session Confirmation",
  text: `Hi ${mentee.name},\n\nYour session with ${mentor.name} is scheduled for ${formattedDate} at ${formattedTime}.\n\nThank you for using Matchy!\n\n– Matchy App`,
});

    res.status(201).json({ message: "Session booked successfully", session: newSession });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//View all upcoming sessions for logged-in user (mentor or mentee)
const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await SessionModel.find({
      $or: [{ mentor: userId }, { mentee: userId }],
      status: "upcoming",
    })
      .populate("mentor", "name email")
      .populate("mentee", "name email")
      .sort({ date: 1, time: 1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Mentee submits feedback after session
const menteeFeedback = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const session = await SessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.mentee.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to leave feedback" });
    }

    session.feedbackFromMentee = { rating, comment };
    session.status = "completed";

    await session.save();
    res.status(200).json({ message: "Feedback submitted", session });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Mentor leaves optional comment
const mentorFeedback = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;
    const { comment } = req.body;

    const session = await SessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.mentor.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to comment" });
    }

    session.feedbackFromMentor = { comment };
    session.status = "completed";

    await session.save();
    res.status(200).json({ message: "Mentor comment submitted", session });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  bookSession,
  getMySessions,
  menteeFeedback,
  mentorFeedback
};