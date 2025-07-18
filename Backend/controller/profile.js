import AuthModel from "../models/authSchema.js";
import Mentor from "../models/mentorSchema.js";
import jwt from "jsonwebtoken";

//Get mentor list (for mentee discovery) – only Available mentors
const getMentorProfiles = async (req, res) => {
  try {
    const mentors = await Mentor.find({
      profileStatus: "Available",
    }).select("name email bio skills experience profileStatus");

    if (!mentors || mentors.length === 0) {
      return res.status(404).json({ message: "No available mentors found" });
    }

    return res.status(200).json({ mentors });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//Get user details (Admin)
const users = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await AuthModel.findById(id).select("-password");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//Edit user profile (Admin)
const editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio, skills, goals, experience, profileStatus } = req.body;

    const user = await AuthModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.goals = goals || user.goals;
    user.experience = experience || user.experience;
    user.profileStatus = profileStatus || user.profileStatus;

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//Toggle mentor availability
const toggleAvailability = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mentor = await AuthModel.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(403).json({ message: "Access denied" });
    }

    mentor.profileStatus =
      mentor.profileStatus === "Available" ? "Unavailable" : "Available";

    await mentor.save();

    return res.status(200).json({
      message: `Availability updated to ${mentor.profileStatus}`,
      profileStatus: mentor.profileStatus,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { users, editProfile, getMentorProfiles, toggleAvailability };