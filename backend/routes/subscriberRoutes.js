import express from "express";
import { addSubscriber } from "../controllers/subscriberController.js";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

// Add a subscriber
router.post("/subscribe", addSubscriber);

// Get all subscribers (admin)
router.get("/subscribers", async (req, res) => {
  try {
    const list = await Subscriber.find().sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
});

// Export subscribers as CSV
router.get("/subscribers/export/csv", async (req, res) => {
  try {
    const list = await Subscriber.find().sort({ date: -1 });

    let csv = "Email,Date\n";

    list.forEach(sub => {
      csv += `${sub.email},${sub.date.toISOString()}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");

    res.send(csv);

  } catch (err) {
    res.status(500).json({ message: "CSV export failed" });
  }
});

export default router;


