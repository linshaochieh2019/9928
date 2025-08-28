const express = require("express");
const Teacher = require("../models/Teacher");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

// Create or Update profile
router.post("/profile", authenticate, async (req, res) => {
  try {
    const existing = await Teacher.findOne({ user: req.user.id });
    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      return res.json(existing);
    }
    const teacher = new Teacher({ ...req.body, user: req.user.id });
    await teacher.save();
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get own profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) return res.status(404).json({ error: "Profile not found" });
    res.json(teacher);
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

module.exports = router;
