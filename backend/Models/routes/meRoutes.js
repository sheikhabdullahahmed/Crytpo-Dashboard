// routes/home.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../Models/User");

const router = express.Router();

function authMiddleware(req, res, next) {
  // console.log("Cookies received:", req.cookies); 
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded JWT:", decoded); // 👈 check karo
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}





// uid kay lia
router.get("/user",authMiddleware , async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ message: "Welcome to Dashboard", user });
});




module.exports = router;
