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
    console.error("❌ Error in getMyProfile:", error);
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

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : [];
    if (goals !== undefined) user.goals = goals;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        goals: user.goals,
      },
    });
  } catch (error) {
    console.error("❌ Error in updateMyProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getMyProfile, updateMyProfile };
