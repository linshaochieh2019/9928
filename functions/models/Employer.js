const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        companyName: { type: String, required: true },
        companyDescription: String,
        companyWebsite: String,
        industry: String,
        location: String,
        size: Number,
        logoUrl: String,
        contactPhone: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employer", EmployerSchema);
