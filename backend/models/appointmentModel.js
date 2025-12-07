import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String, 
    date: String,
    time: String,
    message: String,
    treatment: String,
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
