import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getGallery, addGallery, deleteGallery } from "../controllers/galleryController.js";

const router = express.Router();

// Public GET, protected mutations
router.get("/", getGallery);
router.post("/", protect, addGallery);
router.delete("/:id", protect, deleteGallery);

export default router;
