require("dotenv").config(); // ✅ Load .env first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);



const authRoutes = require("./Models/routes/authRoutes");
const meRoute = require("./Models/routes/meRoutes");

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

app.use("/", authRoutes);
app.use("/", meRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});
