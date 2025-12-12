import mongoose from "mongoose";

const TreatmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },

   category: { type: String, required: true },

  metaTitle: String,
  metaDescription: String,

  seoCopy: String,

  benefits: [String],

  faqs: [
    {
      q: String,
      a: String
    }
  ],

  regularPrice: String,
  memberPrice: String,

  heroImage: String,
  gallery: [String]

}, { timestamps: true });

export default mongoose.model("Treatment", TreatmentSchema);
