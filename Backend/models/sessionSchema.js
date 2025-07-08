import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" },
    feedbackFromMentee: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String }
    },
    feedbackFromMentor: {
      comment: { type: String }
    }
  },
  { timestamps: true }
);

const SessionModel = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default SessionModel;