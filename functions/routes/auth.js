// Imports
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Employer = require("../models/Employer");

// Utils
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");

// Secrets
const { defineSecret } = require("firebase-functions/params");
// const JWT_SECRET = defineSecret("JWT_SECRET"); // moved to utils/jwt.js
const { authenticate } = require("../middleware/auth")
const { signJwt } = require("../utils/jwt");
const FRONTEND_URL = defineSecret("FRONTEND_URL");

// Helper to get frontend URL based on environment
function getFrontendUrl() {
  // Hybrid: if running locally, fall back to process.env
  return (
    (typeof FRONTEND_URL.value === "function" ? FRONTEND_URL.value() : FRONTEND_URL) ||
    process.env.FRONTEND_URL ||
    "http://localhost:4200" // fallback for dev
  );
}


// Router
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const user = new User({ email, password, role, name });
    await user.save();

    // Set up profiles depending on user role
    if (role === "teacher") {
      const teacher = new Teacher({
        user: user._id,
        contactEmail: email // 👈 default contact email = registration email
      });
      await teacher.save();
    } else if (role === "employer") {
      const employer = new Employer({ user: user._id });
      await employer.save();
    }

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
  const token = signJwt({ userId: user._id, role: user.role });

  res.json({ token }); // return token only and rely on /me for consistency
});


// Get logged-in user info
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("name email role");
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
      userId: user._id,
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

// Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "auth/user-not-found", message: "No account with that email" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${getFrontendUrl()}/reset-password/${token}`;
  await sendEmail(
    user.email,
    "Reset your password",
    `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    `Reset your password by visiting: ${resetUrl}`
  );

  res.json({ message: "Password reset link sent" });
});


// Reset password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "auth/invalid-or-expired", message: "Invalid or expired token" });

  user.password = password; // will be hashed by pre-save
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password has been reset successfully" });
});




module.exports = router;
