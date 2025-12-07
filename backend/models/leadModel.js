import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    source: String, 
    message: String,

    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
