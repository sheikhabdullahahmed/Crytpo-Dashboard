require("dotenv").config(); // ✅ Load .env first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const portfolioRoutes = require("./Models/routes/portroutes");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Models/routes/authRoutes");
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true,
}));


const User = require("./Models/User");
const jwt = require("jsonwebtoken");
// JWT_SECRET="supersecretkey1kkkkmmmm23636748#Y4ytt8"


// Debug log
// console.log("Loaded MONGO_URI:", process.env.DATABASE_URL);

app.use(cookieParser());



async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

connectDB();






app.use("/user", authRoutes);
app.use("/api", portfolioRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});
