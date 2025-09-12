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

// Google OAuth 
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = defineSecret("GOOGLE_CLIENT_ID");

// Helper to resolve client ID at runtime
function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.value();
}

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

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    user.emailVerifyToken = token;
    user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h

    // Save user
    await user.save();

    // Send verification email
    const verifyUrl = `${getFrontendUrl()}/verify-email/${token}`;
    await sendEmail(
      user.email,
      "Verify your email address",
      `<p>Welcome to 9928! Please <a href="${verifyUrl}">verify your email</a>.</p>`,
      `Visit this link to verify: ${verifyUrl}`
    );


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
    const user = await User.findById(req.user.userId);
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
      isVerified: user.isVerified
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

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "auth/user-not-found", message: "No account with that email" });
  }

  if (user.isVerified) {
    return res.status(400).json({ error: "auth/already-verified", message: "This account is already verified" });
  }

  // Generate new token
  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerifyToken = token;
  user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  await user.save();

  // Send email
  const verifyUrl = `${getFrontendUrl()}/verify-email/${token}`;
  await sendEmail(
    user.email,
    "Verify your email address",
    `<p>Please <a href="${verifyUrl}">verify your email</a>.</p>`,
    `Visit this link to verify: ${verifyUrl}`
  );

  res.json({ message: "Verification email resent" });
});


// Verify email
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerifyToken: token,
    emailVerifyExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "auth/invalid-or-expired", message: "Invalid or expired verification link" });
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
});

// Google Login
router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "auth/no-id-token", message: "Missing Google ID token" });
  }

  try {
    // Initialize Google OAuth client
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID.value());

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: getGoogleClientId(),
    });
    const payload = ticket.getPayload();

    const { email, name, sub } = payload; // sub = Google user ID

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        role: "teacher", // 👈 default role; you may redirect frontend to let them choose
        isVerified: true, // Google guarantees verified email
      });
      await user.save();

      // Create teacher/employer profile depending on role
      const teacher = new Teacher({ user: user._id, contactEmail: email });
      await teacher.save();
    }

    // Issue JWT
    const token = signJwt({ userId: user._id, role: user.role, name: user.name });
    res.json({ token });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ error: "auth/google-failed", message: "Google login failed" });
  }
});

module.exports = router;
