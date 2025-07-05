import AuthModel from "../models/authSchema.js";

// GET /api/profile/me
const getMyProfile = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ profile: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile/me
const updateMyProfile = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, bio, skills, goals } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.goals = goals || user.goals;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Export them here
export { getMyProfile, updateMyProfile };