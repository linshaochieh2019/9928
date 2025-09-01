const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    logoUrl: String,
    type: {
        type: String,
        enum: ["Kindergarten", "Cram School", "International School", "University", "Online Platform", "Corporate Training"],
    },
    website: String,

    location: {
        mainAddress: String,
        branches: [String],
        onlineOnly: Boolean,
    },

    contact: {
        personName: String,
        position: String,
        email: String,
        phone: String,
        verified: { type: Boolean, default: false },
    },

    about: {
        description: String,
        yearEstablished: Number,
        numberOfStudents: Number,
        numberOfForeignTeachers: Number,
    },

    hiringPreferences: {
        typicalSubjects: [String],
        employmentTypes: [String], // Full-time, Part-time, Hourly, Online
        visaSponsorship: Boolean,
    },

    jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
}, { timestamps: true });

module.exports = mongoose.model("Employer", EmployerSchema);
