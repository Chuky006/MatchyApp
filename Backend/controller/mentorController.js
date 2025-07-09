import bcrypt from "bcryptjs";
import Mentor from "../models/mentorSchema.js";

//CREATE a new mentor profile
export const createMentor = async (req, res) => {
  try {
    const { userId, name, email, password, bio, skills, experience, profileStatus } = req.body;

    //Check if mentor with same userId already exists
    const existingMentor = await Mentor.findOne({ userId });
    if (existingMentor) {
      return res.status(400).json({ message: "Mentor profile already exists" });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create mentor profile
    const mentor = new Mentor({
      userId,
      name,
      email,
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

//GET mentor profile by userId (from Auth)
export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.params.id }).select("-password");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    res.status(200).json(mentor);
  } catch (err) {
    console.error("❌ Error fetching mentor:", err);
    res.status(500).json({ message: "Error retrieving mentor profile" });
  }
};