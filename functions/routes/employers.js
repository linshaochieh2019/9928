const express = require("express");
const Employer = require("../models/Employer");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

// ✅ Create or Update employer profile
router.post("/profile", authenticate, async (req, res) => {
  try {
    const existing = await Employer.findOne({ user: req.user.id });
    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      return res.json(existing);
    }
    const employer = new Employer({ ...req.body, user: req.user.id });
    await employer.save();
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Public: Get all employers (list for directory)
router.get("/", async (req, res) => {
  try {
    const employers = await Employer.find()
      .populate("user", "name") // only show safe user fields
      .select("-__v"); // remove Mongoose version key
    res.json(employers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Public: Get employer by id
router.get("/:id", async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id).populate("user", "email");
    if (!employer) return res.status(404).json({ error: "Not found" });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
