import express from "express";
import { login, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/login", login);

// Protected route
router.put("/change-password", protect, changePassword);

export default router;
