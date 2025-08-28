const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // link to User, contains name/email/role
  bio: { type: String },
  subjects: [{ type: String }],
  experience: { type: Number },
  hourlyRate: { type: Number },
  availability: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Teacher", teacherSchema);
