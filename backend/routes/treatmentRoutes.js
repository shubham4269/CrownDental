import express from "express";
import {
  createTreatment,
  getAllTreatments,
  getTreatmentById,
  getTreatmentBySlug,
  updateTreatment,
  deleteTreatment,
} from "../controllers/treatmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTreatment);
router.get("/", getAllTreatments);
router.get("/id/:id", getTreatmentById);
router.get("/:slug", getTreatmentBySlug);
router.put("/:id", protect, updateTreatment);
router.delete("/:id",  protect, deleteTreatment);

export default router;
