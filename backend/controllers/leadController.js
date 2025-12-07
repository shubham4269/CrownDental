import Lead from "../models/leadModel.js";
import { sendEmail } from "../services/emailService.js";

export const createLead = async (req, res) => {
  try {
    const { name, phone, email, message, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    // 1️⃣ Save lead in DB
    const lead = await Lead.create({ name, phone, email, message, source });

    // 2️⃣ EMAIL TO USER (Optional — only if email is provided)
    if (email) {
      await sendEmail({
        to: email,
        subject: "Thank You for Reaching Out - Crown Dental 🦷",
        html: `
          <div style="font-family:Arial; padding:20px;">
            <h2 style="color:#0a84ff;">We Received Your Request</h2>

            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for showing interest in Crown Dental.</p>

            <p>Our team will contact you shortly about your inquiry.</p>

            <h3>Your Submitted Details:</h3>
            <div style="background:#f2f2f2; padding:15px; border-radius:8px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
              ${source ? `<p><strong>Source:</strong> ${source}</p>` : ""}
            </div>

            <p>We appreciate your interest in improving your smile! 😊</p>

            <br>
            <p>Warm regards,<br><strong>Crown Dental Team</strong></p>
          </div>
        `,
      });
    }

    // 3️⃣ EMAIL TO ADMIN — Lead Notification
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Lead Captured - Crown Dental",
      html: `
        <h2>New Lead Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        ${source ? `<p><strong>Source:</strong> ${source}</p>` : ""}
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    res.status(201).json({ success: true, lead });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeads = async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
};

export const deleteLead = async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

export const updateLeadStatus = async (req, res) => {
  const updated = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
};

