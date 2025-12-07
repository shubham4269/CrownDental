import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String },
    enum: ["general", "clinic", "team", "patients", "events", "before-after"],
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", GallerySchema);
