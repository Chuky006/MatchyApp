import mongoose from "mongoose";

const mentorshipRequestSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: { type: String },
  },
  { timestamps: true }
);

const MentorshipRequestModel = mongoose.models.MentorshipRequest || mongoose.model("MentorshipRequest", mentorshipRequestSchema);

export default MentorshipRequestModel;