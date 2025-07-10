const express = require("express");
const router = express.Router();
const Portfolio = require("../../Models/Portfolio");
const auth = require("../../Middelware/auth"); // ✅ protected

// GET /api/portfolio
router.get("/portfolio", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const coins = await Portfolio.find({ user: userId });

    res.json({ coins });
  } catch (err) {
    console.error("❌ Portfolio fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
