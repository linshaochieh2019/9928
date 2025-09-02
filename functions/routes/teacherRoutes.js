const express = require("express");
const Teacher = require("../models/Teacher");
const { authenticate, authorize } = require("../middleware/auth");
const { mongo, default: mongoose } = require("mongoose");
const router = express.Router();

// Create or Update profile
router.post("/profile", authenticate, authorize("teacher"), async (req, res) => {
  try {
    const existing = await Teacher.findOne({ user: req.user.userId });
    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      return res.json(existing);
    }
    const teacher = new Teacher({ ...req.body, user: req.user.userId });
    await teacher.save();
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get all teachers (list for directory)
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("user", "name") // only show public-safe fields
      .select("-__v"); // remove Mongoose version key
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get teacher by id
router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("user", "email");
    if (!teacher) return res.status(404).json({ error: "Not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update teacher profile photo
router.put("/me/profile-photo", authenticate, authorize("teacher"), async (req, res) => {
  try {
    const { profilePhoto } = req.body; // frontend sends the Firebase download URL

    if (!profilePhoto) {
      return res.status(400).json({ error: "profilePhoto is required" });
    }

    const teacher = await Teacher.findOneAndUpdate(
      { user: req.user.userId },
      { profilePhoto },
      { new: true }
    );

    res.json({ profilePhoto: teacher.profilePhoto });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile photo", details: err.message });
  }
});

module.exports = router;
