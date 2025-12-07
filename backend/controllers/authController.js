import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Incorrect password" });

  res.json({
    message: "Login successful",
    token: generateToken(user._id),
    user: {
      id: user._id,
      email: user.email
    }
  });
};

// ✅ CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Old password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
};
