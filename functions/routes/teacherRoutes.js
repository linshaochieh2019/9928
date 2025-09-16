const express = require("express");
const Teacher = require("../models/Teacher");
const Employer = require("../models/Employer");
const UnlockLog = require("../models/UnlockLog");
const PointTransaction = require("../models/PointTransaction");
const { authenticate, authorize, optionalAuth } = require("../middleware/auth");
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

// // Public: Get all teachers (list for directory)
// router.get("/", async (req, res) => {
//   try {
//     const teachers = await Teacher.find()
//       .populate("user", "name") // only show public-safe fields
//       .select("-__v"); // remove Mongoose version key

//     // Mask contact info for each teacher
//     const safeTeachers = teachers.map(maskContact);
//     res.json(safeTeachers);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// ✅ Get teachers in daily random order
router.get("/", async (req, res) => {
  try {
    // daily seed (e.g., 20250911)
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const seed = parseInt(today, 10);


    const teachers = await Teacher.aggregate([
      {
        $addFields: {
          sortKey: {
            $mod: [
              { $add: [{ $toLong: { $toDate: "$_id" } }, seed] },
              1000000
            ]
          }
        }
      },
      { $sort: { sortKey: 1 } },
      { $project: { __v: 0, sortKey: 0 } }
    ]);

    const safeTeachers = teachers.map(maskContact);
    res.json(safeTeachers);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Private: Get my profile (unmasked)
router.get("/me", authenticate, authorize("teacher"), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.userId }).populate("user", "email");
    if (!teacher) return res.status(404).json({ error: "Profile not found" });

    res.json(teacher); // full profile, no masking
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Public: Get teacher by id
// router.get("/:id", async (req, res) => {
//   try {
//     // const teacher = await Teacher.findById(req.params.id).populate("user", "email");        
//     const teacher = await Teacher.findById(req.params.id);
//     if (!teacher) return res.status(404).json({ error: "Not found" });

//     // Mask contact info
//     // (assume not unlocked, not owner), the unlocked logic will be handled in future
//     const safeTeacher = maskContact(teacher);
//     res.json(safeTeacher);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// Public: Get teacher by id (with unlock logic)
router.get("/:id", optionalAuth, async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate("user", "email name").lean();
  if (!teacher) return res.status(404).json({ error: "Not found" });

  let unlocked = false;
  let isOwner = false;
  let unlockedAt = null;

  if (req.user?.role === "employer") {
    const employer = await Employer.findOne({ user: req.user.userId }).select("_id");
    if (employer) {
      const log = await UnlockLog.findOne({ employer: employer._id, teacher: teacher._id }).select("createdAt");
      if (log) {
        unlocked = true;
        unlockedAt = log.createdAt;
      }
    }
  } else if (req.user?.role === "teacher" && teacher.user._id.toString() === req.user.userId) {
    isOwner = true;
  }

  res.json({
    ...maskContact(teacher, { unlocked, isOwner }),
    unlockedAt,
  });
});


// ✅ Employer unlock teacher contact
router.post("/unlock", authenticate, authorize("employer"), async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!teacherId) return res.status(400).json({ error: "teacherId required" });

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const employer = await Employer.findOne({ user: req.user.userId });
    if (!employer) return res.status(404).json({ error: "Employer not found" });


    // 1. Check if already unlocked
    const alreadyUnlocked = await UnlockLog.exists({
      employer: employer._id,
      teacher: teacher._id
    });
    if (alreadyUnlocked) {
      return res.status(400).json({ error: "Teacher already unlocked" });
    }

    // 3. Ensure points are available
    if (employer.points < 1) {
      return res.status(400).json({ error: "Not enough points" });
    }

    // 4. Deduct points
    employer.points -= 1;
    await employer.save();

    // 4.1 Record point transaction
    await PointTransaction.create({
      employerId: employer._id,
      type: "debit",
      points: 1,
      reason: `unlock:${teacher._id}`,
    });

    // 5. Record unlock in log
    await UnlockLog.create({
      employer: employer._id,
      teacher: teacher._id,
      pointsSpent: 1
    });

    // 6. Return teacher with real contact info
    res.json(maskContact(teacher, { unlocked: true }));
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
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error: " + err.message });
  }
});



module.exports = router;
