import Treatment from "../models/Treatment.js";
import slugify from "slugify";

/* ======================================================
   CREATE TREATMENT
====================================================== */
export const createTreatment = async (req, res) => {
  try {
    const body = { ...req.body };

    // REQUIRED FIELDS
    if (!body.title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!body.category?.trim()) {
      return res.status(400).json({ error: "Category is required" });
    }

    // AUTO SLUG
    body.slug =
      body.slug?.trim() ||
      slugify(body.title, { lower: true, strict: true });

    // CHECK DUPLICATE SLUG
    const exists = await Treatment.findOne({ slug: body.slug });
    if (exists) return res.status(400).json({ error: "Slug already exists" });

    // CLEAN BENEFITS (remove empty strings)
    if (Array.isArray(body.benefits)) {
      body.benefits = body.benefits.filter((b) => b && b.trim() !== "");
    }

    // CREATE
    const treatment = new Treatment(body);
    await treatment.save();

    res.json({ success: true, treatment });

  } catch (err) {
    console.error("createTreatment error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   GET ALL TREATMENTS
====================================================== */
export const getAllTreatments = async (req, res) => {
  try {
    const list = await Treatment.find({}).sort({ updatedAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("getAllTreatments error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   GET TREATMENT BY ID
====================================================== */
export const getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id).lean();
    if (!treatment) return res.status(404).json({ error: "Not found" });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   GET TREATMENT BY SLUG
====================================================== */
export const getTreatmentBySlug = async (req, res) => {
  try {
    const t = await Treatment.findOne({ slug: req.params.slug });
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   UPDATE TREATMENT
====================================================== */
export const updateTreatment = async (req, res) => {
  try {
    const body = { ...req.body };

    // AUTO SLUG UPDATE IF TITLE CHANGES
    if (body.title && !body.slug) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    // CLEAN BENEFITS
    if (Array.isArray(body.benefits)) {
      body.benefits = body.benefits.filter((b) => b && b.trim() !== "");
    }

    const updated = await Treatment.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("updateTreatment error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   DELETE TREATMENT
====================================================== */
export const deleteTreatment = async (req, res) => {
  try {
    await Treatment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("deleteTreatment error:", err);
    res.status(500).json({ error: err.message });
  }
};

