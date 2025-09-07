const express = require("express");
const Teacher = require("../models/Teacher");
const { authenticate, authorize } = require("../middleware/auth");
const { mongo, default: mongoose } = require("mongoose");
const router = express.Router();
const { maskContact } = require("../utils/maskContact");

// Create or Update profile
router.post("/profile", authenticate, authorize("teacher"), async (req, res) => {
  try {
    const existing = await Teacher.findOne({ user: req.user.userId });
    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      return res.json(existing);
    }
    const teacher = new Teacher({ ...req.body, user: req.user.userId });
    await teacher.save();
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get all teachers (list for directory)
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("user", "name") // only show public-safe fields
      .select("-__v"); // remove Mongoose version key

    // Mask contact info for each teacher
    const safeTeachers = teachers.map(maskContact);
    res.json(safeTeachers);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Private: Get my profile (unmasked)
router.get("/me", authenticate, authorize("teacher"), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.userId });
    if (!teacher) return res.status(404).json({ error: "Profile not found" });

    res.json(teacher); // full profile, no masking
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get teacher by id
router.get("/:id", async (req, res) => {
  try {
    // const teacher = await Teacher.findById(req.params.id).populate("user", "email");        
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Not found" });

    // If logged in as the owner → return full
    if (req.user && req.user.userId === teacher.user._id.toString()) {
      return res.json(teacher);
    }

    // Mask contact info
    const safeTeacher = maskContact(teacher);
    res.json(safeTeacher);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update teacher profile photo
router.put("/me/profile-photo", authenticate, authorize("teacher"), async (req, res) => {
  try {
    const { profilePhoto } = req.body; // frontend sends the Firebase download URL

    if (!profilePhoto) {
      return res.status(400).json({ error: "profilePhoto is required" });
    }

    const teacher = await Teacher.findOneAndUpdate(
      { user: req.user.userId },
      { profilePhoto },
      { new: true }
    );

    res.json({ profilePhoto: teacher.profilePhoto });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile photo", details: err.message });
  }
});

// ✅ Section update
router.patch("/me/:section", authenticate, authorize("teacher"), async (req, res) => {
  try {
    const { section } = req.params;
    const teacher = await Teacher.findOne({ user: req.user.userId });
    if (!teacher) return res.status(404).json({ error: "Profile not found" });

    switch (section) {
      case "basic":
        Object.assign(teacher, {
          displayName: req.body.displayName,
          nationality: req.body.nationality,
          age: req.body.age,
          location: req.body.location,
          profilePhoto: req.body.profilePhoto,
          headline: req.body.headline,
        });
        break;

      case "contact":
        Object.assign(teacher, {
          phone: req.body.phone,
          contactEmail: req.body.contactEmail, // 👈 new field
        });
        break;

      case "professional":
        Object.assign(teacher, {
          bio: req.body.bio,
          introVideo: req.body.introVideo,
        });
        break;

      case "qualifications":
        Object.assign(teacher, {
          education: req.body.education,
          teachingCertifications: req.body.teachingCertifications,
          otherCertificates: req.body.otherCertificates,
        });
        break;

      case "experience":
        Object.assign(teacher, {
          yearsExperience: req.body.yearsExperience,
          workHistory: req.body.workHistory,
        });
        break;

      case "skills":
        Object.assign(teacher, {
          ageGroups: req.body.ageGroups,
          subjects: req.body.subjects,
          languageSkills: req.body.languageSkills,
        });
        break;

      case "preferences":
        Object.assign(teacher, {
          employmentType: req.body.employmentType,
          preferredLocations: req.body.preferredLocations,
          preferredLocationOther: req.body.preferredLocationOther,
          workVisaStatus: req.body.workVisaStatus,
          availableFrom: req.body.availableFrom,
        });
        break;

      case "compensation":
        Object.assign(teacher, {
          expectedRate: req.body.expectedRate,
        });
        break;

      default:
        return res.status(400).json({ error: "Invalid section" });
    }

    await teacher.save();
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
