const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    packageId: {
      type: String, // e.g. "10_points", "30_points"
      required: true,
    },
    merchantOrderNo: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    tradeNo: {
      type: String, // NewebPay’s TradeNo (set after callback)
    },
    rawResponse: {
      type: Object, // store NewebPay callback payload
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
