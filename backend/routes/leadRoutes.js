import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createLead, getLeads, deleteLead, updateLeadStatus } from "../controllers/leadController.js";

const router = express.Router();

// Public endpoint to create a lead from site forms
router.post("/", createLead);

// Protected fetch for admin; if 404 persists in client, ensure server restarts
router.get("/", protect, getLeads);

// Optional public fetch for debugging 404s (can be removed later)
router.get("/public", async (req, res) => {
	try {
		const { default: Lead } = await import("../models/leadModel.js");
		const leads = await Lead.find().sort({ createdAt: -1 });
		res.json(leads);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});
router.delete("/:id", protect, deleteLead);
router.put("/:id", protect, updateLeadStatus);

// Simple ping to verify router mount
router.get("/ping", (req, res) => {
	res.json({ ok: true });
});

export default router;
