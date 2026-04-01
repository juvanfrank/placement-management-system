const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Personal
  name: String,
  dob: String,
  gender: String,
  registerNumber: String,
  rollNumber: String,
  department: String,
  currentYear: String,
  section: String,
  batch: String,

  // Religion
  religion: {
    type: String,
    enum: ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Others"]
  },

  caste: {
    type: String,
    enum: ["General", "OBC", "SC", "ST", "Others"]
  },

  community: {
    type: String,
    enum: ["OC", "BC", "MBC", "SC", "ST"]
  },

  // Contact
  studentPhone: String,
  email: String,
  address: String,

  // Academic
  tenthPercentage: String,
  twelthPercentage: String,
  diplomaPercentage: String,
  currentArrears: String,
  historyOfArrears: String,
  cgpa: String,   // ✅ fixed

  // Professional
  resumeLink: String,
  linkedinLink: String,
  githubLink: String,
  portfolioLink: String,

  skills: [String],
  internship: [String],   // ✅ added

  placementStatus: {
    type: String,
    enum: ["Not Placed", "Placed", "Internship"],
    default: "Not Placed"
  },

  // Parent
  fatherName: String,
  motherName: String,
  fatherPhone: String,
  motherPhone: String,

  // Media
  profilePhoto: String

}, { timestamps: true });

module.exports = mongoose.model("StudentProfile", studentProfileSchema);