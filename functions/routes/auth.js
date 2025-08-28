// functions/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Secrets
const { defineSecret } = require("firebase-functions/params");
const JWT_SECRET = defineSecret("JWT_SECRET");

// Router
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const user = new User({ email, password, role, name });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed", details: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  
  // ✅ Hybrid secret: Firebase Secrets Manager in prod, .env.local in dev
  const secret =
    (JWT_SECRET.value && JWT_SECRET.value()) || process.env.JWT_SECRET;

  const token = jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn: "7d" }
  );

  res.json({ token, role: user.role, name: user.name });
});

module.exports = router;
