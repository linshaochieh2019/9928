const express = require("express");
const Employer = require("../models/Employer");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

// Create profile
router.post("/", authenticate, async (req, res) => {
  try {
    const employer = new Employer({ ...req.body, user: req.user.id });
    await employer.save();
    res.status(201).json(employer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all employers
router.get("/", async (req, res) => {
  const employers = await Employer.find().populate("user", "name email");
  res.json(employers);
});

// Get one employer
router.get("/:id", async (req, res) => {
  const employer = await Employer.findById(req.params.id).populate("user", "name email");
  if (!employer) return res.status(404).json({ error: "Employer not found" });
  res.json(employer);
});

// Update profile
router.put("/:id", authenticate, async (req, res) => {
  const employer = await Employer.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!employer) return res.status(404).json({ error: "Employer not found or not authorized" });
  res.json(employer);
});

// Delete
router.delete("/:id", authenticate, async (req, res) => {
  const employer = await Employer.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!employer) return res.status(404).json({ error: "Employer not found or not authorized" });
  res.json({ message: "Employer deleted" });
});

module.exports = router;
