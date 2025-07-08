import AuthModel from "../models/authSchema.js";

//GET /api/profile/me
const getMyProfile = async (req, res) => {
  // ✅ TEMPORARY DEBUG LOGS
  console.log("📦 Cookies received:", req.cookies);
  console.log("👤 Decoded user from authMiddleware:", req.user);

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

//PUT /api/profile/me
const updateMyProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {};
    const allowedFields = ["name", "email", "bio", "skills", "goals"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const updatedUser = await AuthModel.findByIdAndUpdate(
      req.user._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error in updateMyProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getMyProfile, updateMyProfile };
