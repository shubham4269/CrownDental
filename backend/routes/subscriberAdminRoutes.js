import express from "express";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

// Fetch all subscribers
router.get("/", async (req, res) => {
  try {
    const list = await Subscriber.find().sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Export subscribers as CSV
router.get("/export/csv", async (req, res) => {
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
    res.status(500).json({ message: "CSV Export Failed" });
  }
});

export default router;
