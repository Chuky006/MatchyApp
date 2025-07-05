import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    from: { type: String }, // e.g. "15:00"
    to: { type: String },   // e.g. "17:00"
  },
  { timestamps: true }
);

const AvailabilityModel = mongoose.models.Availability || mongoose.model("Availability", availabilitySchema);

export default AvailabilityModel;