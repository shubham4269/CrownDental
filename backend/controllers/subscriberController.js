import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../services/emailService.js";

export const addSubscriber = async (req, res) => {
    
  try {
    const { email } = req.body;
    

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });

   
await sendEmail({
  to: email,
  subject: "Subscription Successful",
  html: `<p>Thank you for subscribing to our newsletter!</p>`
});


await sendEmail({
  to: process.env.ADMIN_EMAIL,
  subject: "New Newsletter Subscriber",
  html: `<p>New subscriber: <b>${email}</b></p>`
});


    res.json({ message: "Subscription Successful" });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: "Server Error" });
  }
};

