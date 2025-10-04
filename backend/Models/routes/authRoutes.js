const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../Models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

// ✅ Let Mongoose middleware handle hashing
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Signup successful", username: newUser.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
       sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });

    // ✅ Send user details in response
    res.json({
      message: "Login successful",
    });
  } catch (err) {
    // console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});





// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  // console.log(req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Pehle check karo existing token ka
    if (user.resetToken && user.resetTokenExpiry > Date.now()) {
      return res.status(400).json({ error: "Reset link already sent. Please check your email." });
    }

    // Ab naya token banao
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    // const resetLink = `${process.env.?zzzzzFRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Crypto Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});
 




router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User find
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: req.params.token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Hash password update
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
     user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(400).json({ error: "Invalid or expired token" });
  }
});









router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false, // production me true rakhna agar https use karo
  });
  res.json({ message: "Logged out successfully" });
});


module.exports = router;
