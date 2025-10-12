const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../User");
const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    // ✅ Token cookie se lo (na ke headers se)
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ User find karo (password exclude karke)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Send user data
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
