import Treatment from "../models/Treatment.js";
import slugify from "slugify";

export const createTreatment = async (req, res) => {
  try {
    const body = { ...req.body };
    // auto-generate slug if not provided
    body.slug = body.slug?.trim() || slugify(body.title || "", { lower: true, strict: true });
    if (!body.title || !body.title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const exists = await Treatment.findOne({ slug: body.slug });
    if (exists) return res.status(400).json({ error: "Slug already exists" });

    const t = new Treatment(body);
    await t.save();
    res.json({ success: true, treatment: t });
  } catch (err) {
    console.error("createTreatment error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllTreatments = async (req, res) => {
  try {
    const list = await Treatment.find({}).sort({ updatedAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("getAllTreatments error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTreatmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const treatment = await Treatment.findById(id).lean();
    if (!treatment) return res.status(404).json({ error: "Not found" });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTreatmentBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const t = await Treatment.findOne({ slug });
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTreatment = async (req, res) => {
  try {
    const id = req.params.id;
    const body = { ...req.body };
    if (body.title && !body.slug) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }
    const updated = await Treatment.findByIdAndUpdate(id, body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTreatment = async (req, res) => {
  try {
    await Treatment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
