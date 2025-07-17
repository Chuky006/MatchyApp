import bcrypt from "bcryptjs";
import Mentor from "../models/mentorSchema.js";

// ✅ CREATE a new mentor profile
export const createMentor = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      password,
      bio,
      skills,
      experience,
      profileStatus,
    } = req.body;

    const existingMentor = await Mentor.findOne({ userId });
    if (existingMentor) {
      return res.status(400).json({ message: "Mentor profile already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const mentor = new Mentor({
      userId,
      name,
      email,
      password: hashedPassword,
      bio,
      skills,
      experience,
      profileStatus: profileStatus || "Available",
    });

    await mentor.save();
    return res.status(201).json({ message: "Mentor profile created successfully" });
  } catch (error) {
    console.error("❌ Error creating mentor:", error);
    res.status(500).json({ message: "Error creating mentor profile" });
  }
};

// ✅ GET mentor profile by userId
export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({
      userId: req.params.id,
    }).select("name email bio skills experience profileStatus");

    if (!mentor) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    res.status(200).json(mentor);
  } catch (err) {
    console.error("❌ Error fetching mentor:", err);
    res.status(500).json({ message: "Error retrieving mentor profile" });
  }
};

// ✅ GET all mentors (used by mentees to browse)
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ profileStatus: "Available" }).select(
      "name bio skills experience profileStatus"
    );

    if (!mentors || mentors.length === 0) {
      return res.status(404).json({ message: "No mentors available at the moment" });
    }

    res.status(200).json({ success: true, mentors });
  } catch (err) {
    console.error("❌ Error fetching all mentors:", err);
    res.status(500).json({ message: "Error retrieving mentors" });
  }
};