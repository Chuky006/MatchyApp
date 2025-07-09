import AvailabilityModel from "../models/availabilitySchema.js";

//Mentor sets availability
const setAvailability = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { day, from, to } = req.body;

    if (!day || !from || !to) {
      return res.status(400).json({ message: "All fields are required: day, from, to" });
    }

    const newSlot = new AvailabilityModel({
      mentor: mentorId,
      day,
      from,
      to,
    });

    await newSlot.save();
    res.status(201).json({ message: "Availability set successfully", slot: newSlot });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Anyone can view a mentor’s availability
const getMentorAvailability = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const slots = await AvailabilityModel.find({ mentor: mentorId }).sort({ day: 1, from: 1 });
    res.status(200).json({ availability: slots });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { setAvailability, getMentorAvailability };