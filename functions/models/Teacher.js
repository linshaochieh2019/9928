const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
