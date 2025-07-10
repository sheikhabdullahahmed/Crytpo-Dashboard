const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../Models/User");


// const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });



// JWT_SECRET=supersecretkey1kkkkmmmm23636748Y4ytt8


const router = express.Router();




// ✅ Let Mongoose middleware handle hashing

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ email, password }); // ❌ No hashing here
    await newUser.save(); // ✅ Now pre-save hook will hash it

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});



// Login
// const jwt = require("jsonwebtoken");

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login Request:", email, password);

      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found");
        return res.status(400).json({ error: "Invalid credentials" });
      }
      console.log("Entered password:", password);
    console.log("Saved hash:", user.password);

      // const match = await bcrypt.compare(password, user.password);
      const match = await bcrypt.compare(password, user.password);

      console.log("Password match:", match);

      if (!match) {
        console.log("Password mismatch");
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000,
      });

      res.json({ message: "Login successful" });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  });




module.exports = router;
