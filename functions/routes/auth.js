// functions/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Employer = require("../models/Employer");

// Secrets
const { defineSecret } = require("firebase-functions/params");
const JWT_SECRET = defineSecret("JWT_SECRET");
const { authenticate} = require("../middleware/auth")

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


// Get logged-in user info
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role");
    if (!user) return res.status(404).json({ error: "User not found" });

    // if teacher, attach teacherId
    let teacherId = null;
    let employerId = null;

    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ user: user._id }).select("_id");
      teacherId = teacher?._id || null;
    } else if (user.role === "employer") {
      const employer = await Employer.findOne({ user: user._id }).select("_id");
      employerId = employer?._id || null;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      teacherId,
      employerId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
