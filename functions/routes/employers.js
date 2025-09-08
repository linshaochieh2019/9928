const express = require("express");
const Employer = require("../models/Employer");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

// ✅ Create or Update employer profile
router.post("/profile", authenticate, authorize("employer"), async (req, res) => {
  try {
    const existing = await Employer.findOne({ user: req.user.userId });
    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      return res.json(existing);
    }
    const employer = new Employer({ ...req.body, user: req.user.userId });
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

// ✅ Private: Get logged-in employer profile
router.get("/me", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ error: "Only employers can access this" });
    }

    const employer = await Employer.findOne({ user: req.user.userId })
      .populate("user", "email name role")
      .select("companyName location points");

    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    res.json(employer);
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


// Add image
router.put("/me/images", authenticate, authorize("employer"), async (req, res) => {
  try {
    const { imageUrl } = req.body; // frontend sends Firebase download URL
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const employer = await Employer.findOneAndUpdate(
      { user: req.user.userId },
      { $push: { images: imageUrl } },
      { new: true }
    );

    if (!employer) return res.status(404).json({ error: "Employer profile not found" });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: "Failed to add image", details: err.message });
  }
});


// Set cover image
router.put("/me/cover-image", authenticate, authorize("employer"), async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const employer = await Employer.findOneAndUpdate(
      { user: req.user.userId },
      { coverImage: imageUrl },
      { new: true }
    );

    if (!employer) return res.status(404).json({ error: "Employer profile not found" });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: "Failed to set cover image", details: err.message });
  }
});

// ✅ Update employer points (admin or employer themselves)
router.put("/points", authenticate, async (req, res) => {
  try {
    const { employerId, amount } = req.body; // 👈 read both from body

    if (!employerId || typeof amount !== "number") {
      return res.status(400).json({ error: "employerId and amount are required" });
    }

    const employer = await Employer.findById(employerId);
    if (!employer) return res.status(404).json({ error: "Employer not found" });

    // Option A: Replace balance
    // employer.points = amount;

    // Option B: Increment balance (usually better)
    employer.points += amount;

    if (employer.points < 0) employer.points = 0; // safety check
    await employer.save();

    res.json({ employerId: employer._id, points: employer.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
