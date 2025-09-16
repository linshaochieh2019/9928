const mongoose = require("mongoose");

const pointTransactionSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    reason: {
      type: String, // e.g. "purchase:8_points", "unlock:teacherId", "admin_adjustment"
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId, // link to Payment or Unlock record
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PointTransaction", pointTransactionSchema);
