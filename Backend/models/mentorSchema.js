import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthModel",
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "mentor" },
  bio: { type: String },
  skills: [{ type: String }],
  experience: { type: String },
  profileStatus: {
    type: String,
    enum: ["Pending", "Available", "Unavailable"],
    default: "Pending",
  },
});

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;