import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createAppointment,
  getAppointments,
  deleteAppointment,
  updateStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Public endpoint to create an appointment
router.post("/", createAppointment);

// Health check for routing/debugging
router.get("/ping", (req, res) => {
  res.json({ ok: true });
});

router.get("/", protect, getAppointments);
router.delete("/:id", protect, deleteAppointment);
router.put("/:id", protect, updateStatus);

export default router;
