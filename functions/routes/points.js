// routes/points.js
const express = require("express");
const router = express.Router();
const Employer = require("../models/Employer");
const PointTransaction = require("../models/PointTransaction");
const { authenticate, authorize } = require("../middleware/auth");


// Helper function
function formatTransaction(tx) {
  let formattedReason = tx.reason;

  if (tx.reason.startsWith("purchase:")) {
    const points = tx.reason.split(":")[1].replace("_points", "").trim();
    formattedReason = `Purchased ${points} points`;
  } else if (tx.reason.startsWith("unlock:")) {
    formattedReason = "Unlocked Teacher";
  }

  return {
    _id: tx._id,
    type: tx.type,
    points: tx.points,
    createdAt: tx.createdAt,
    formattedReason,        // ✅ only one friendly field
  };
}


// GET employer's current balance + transaction history
router.get("/history/:employerId", authenticate, authorize("employer"), async (req, res) => {
  try {
    const { employerId } = req.params;

    const employer = await Employer.findById(employerId).select("points");
    if (!employer) return res.status(404).json({ error: "Employer not found" });

    const transactions = await PointTransaction.find({ employerId })
      .sort({ createdAt: -1 });

    res.json({
      balance: employer.points,
      transactions: transactions.map(formatTransaction),
    });
  } catch (err) {
    console.error("Error fetching point history", err);
    res.status(500).json({ error: "Failed to fetch point history" });
  }
});

module.exports = router;
