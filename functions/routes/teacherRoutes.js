const express = require("express");
const Teacher = require("../models/Teacher");

const router = express.Router();

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    next(err);
  }
});

// READ all
router.get("/", async (req, res, next) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    next(err);
  }
});

// READ one
router.get("/:id", async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Not found" });
    res.json(teacher);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!teacher) return res.status(404).json({ error: "Not found" });
    res.json(teacher);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
