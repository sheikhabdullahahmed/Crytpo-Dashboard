const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ✅ Load .env first

const authRoutes = require("./Models/routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());


const User = require("./Models/User");

// Debug log
// console.log("Loaded MONGO_URI:", process.env.DATABASE_URL);

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

connectDB();









const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;










app.use("/User", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});
