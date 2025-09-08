const mongoose = require("mongoose");

const UnlockLogSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    pointsSpent: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true } // createdAt = when unlocked
);

module.exports = mongoose.model("UnlockLog", UnlockLogSchema);
