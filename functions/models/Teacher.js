// models/Teacher.js
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  // 1. Basic Identity
  displayName: { type: String, required: [true, "Display name is required"] }, // can override user.name for privacy
  profilePhoto: { type: String }, // URL to uploaded image
  nationality: { type: String },
  age: { type: Number },        // ✅ store age directly
  location: { type: String },   // shown as "Current Location" in UI
  headline: { type: String },

  // Contact: Masked unless unlocked by employer
  phone: { type: String },
  contactEmail: { type: String, lowercase: true, trim: true, required: [true, "Contact email is required"]}, // can be different from user.email

  // 2. Professional Summary
  bio: { type: String },
  introVideo: { type: String }, // URL (YouTube, Vimeo, or uploaded file)

  // 3. Qualifications
  education: [
    {
      _id: false,
      degree: String,
      major: String,
      institution: String,
      year: Number
    }
  ],
  teachingCertifications: [
    {
      _id: false,
      name: String,
      year: Number,
    }
  ],
  otherCertificates: [
    {
      _id: false,
      name: String,
      year: Number,
    }
  ],

  // 4. Experience
  yearsExperience: { type: Number },
  workHistory: [
    {
      school: String,
      role: String,
      country: String,
      startDate: Date,
      endDate: Date
    }
  ],

  // 5. Skills & Specializations
  ageGroups: [String], // e.g., "Kindergarten", "Adults"
  subjects: { type: String },
  languageSkills: [
    {
      _id: false,
      language: String,
      level: {
        type: String,
        enum: ["Basic", "Conversational", "Fluent", "Native"],
        required: true
      }
    }
  ],

  // 6. Availability & Preferences
  employmentType: {
    type: [String],
    enum: [
      "Full-time",
      "Part-time",
      "Hourly / Tutoring",
      "Online / Remote"
    ],
    default: []
  },

  preferredLocations: {
    type: [String],
    enum: [
      "Taipei City",
      "New Taipei City",
      "Taoyuan",
      "Hsinchu",
      "Taichung",
      "Tainan",
      "Kaohsiung",
      "Online (remote teaching)",
      "Other"
    ],
    default: []
  },
  preferredLocationOther: { type: String, default: "" },

  workVisaStatus: { type: String }, // "Has ARC", "Needs sponsorship"
  availableFrom: { type: String }, // can be "immediately" or "YYYY-MM-DD"

  // 7. Compensation
  expectedRate: { type: String }, // "NT$800/hour" or "NT$60k/month"

  // 8. Documents & Verification
  resumeUrl: { type: String },
  degreeCertificates: [String], // file URLs
  arcPassport: { type: String }, // private

  // 9. Trust & Reviews (future)
  references: [String],
  ratings: [
    {
      employer: String,
      rating: Number,
      comment: String
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Teacher", teacherSchema);
