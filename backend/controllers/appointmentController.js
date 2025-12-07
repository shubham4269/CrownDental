import Appointment from "../models/appointmentModel.js";
import { sendEmail } from "../services/emailService.js";

// ---------------- CREATE APPOINTMENT ----------------
export const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, date, time, treatment, message } = req.body;

    // Save to DB
    const appointment = new Appointment(req.body);
    await appointment.save();

    // 1️⃣ Email to User
    await sendEmail({
      to: email,
      subject: "Appointment Confirmed - Crown Dental 🦷",
      html: `
        <div style="font-family:Arial; padding:20px;">
          <h2 style="color:#0a84ff;">Appointment Confirmed</h2>

          <p>Dear <strong>${name}</strong>,</p>
          <p>Your appointment at <strong>Crown Dental Clinic</strong> is confirmed.</p>

          <h3>📅 Appointment Details</h3>
          <div style="background:#f2f2f2; padding:15px; border-radius:8px;">
            <p><strong>Treatment:</strong> ${treatment ?? "Not specified"}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>

          <p>If you need to make any changes, you can reply to this email.</p>

          <p>Looking forward to seeing you! 😊</p>

          <br>
          <p>Warm regards,<br><strong>Crown Dental Team</strong></p>
        </div>
      `,
    });

    // 2️⃣ Email to Admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Appointment Booked",
      html: `
        <h2>New Appointment Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Treatment:</strong> ${treatment}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Message:</strong> ${message ?? "No additional notes"}</p>
      `,
    });

    return res.json({ success: true, appointment });

  } catch (err) {
    console.error("Appointment error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ---------------- GET ALL APPOINTMENTS ----------------
export const getAppointments = async (req, res) => {
  try {
    const list = await Appointment.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- DELETE APPOINTMENT ----------------
export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- UPDATE STATUS ----------------
export const updateStatus = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





