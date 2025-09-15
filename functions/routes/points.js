// routes/points.js
const express = require("express");
const router = express.Router();
const Employer = require("../models/Employer");
const PointTransaction = require("../models/PointTransaction");
const { authenticate, authorize } = require("../middleware/auth");


// GET employer's current balance + transaction history
router.get("/history/:employerId", authenticate, authorize("employer"), async (req, res) => {
  try {
    const { employerId } = req.params;

    const employer = await Employer.findById(employerId);
    if (!employer) return res.status(404).json({ error: "Employer not found" });

    const transactions = await PointTransaction.find({ employerId })
      .sort({ createdAt: -1 });

    res.json({
      balance: employer.points,
      transactions,
    });
  } catch (err) {
    console.error("Error fetching point history", err);
    res.status(500).json({ error: "Failed to fetch point history" });
  }
});

module.exports = router;
