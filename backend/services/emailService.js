import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📨 Attempting to send email to:", to);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Crown Dental" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("✅ Email SENT:", info.response);
  } catch (error) {
    console.error("❌ REAL SMTP ERROR:", error);
    throw error;
  }
};




