const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER
    // ==================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==================================================
    // PERSONAL
    // ==================================================

    name: {
      type: String,
      default: "",
    },

    dob: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["", "Male", "Female"],
      default: "",
    },

    registerNumber: {
      type: String,
      default: "",
    },

    rollNumber: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    currentYear: {
      type: String,
      default: "",
    },

    section: {
      type: String,
      default: "",
    },

    batch: {
      type: String,
      default: "",
    },

    // ==================================================
    // NEW PERSONAL DETAILS
    // ==================================================

    aadharNumber: {
      type: String,
      default: "",
    },

    // ==================================================
    // RELIGION / COMMUNITY
    // ==================================================

    religion: {
      type: String,
      default: "",
    },

    caste: {
      type: String,
      default: "",
    },

    community: {
      type: String,
      default: "",
    },

    // ==================================================
    // CONTACT
    // ==================================================

    studentPhone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // ==================================================
    // NEW CONTACT DETAILS
    // ==================================================

    pincode: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    languagesKnown: {
      type: String,
      default: "",
    },

    hostelerDayScholar: {
      type: String,
      enum: ["", "Hosteler", "Dayscholar"],
      default: "",
    },

    parentsNumber: {
      type: String,
      default: "",
    },

    // ==================================================
    // ACADEMIC
    // ==================================================

    // NEW: MEDIUM OF STUDY
    mediumOfStudy: {
      type: String,
      default: "",
    },

    // ==================================================
    // 10TH DETAILS
    // ==================================================

    tenthSchoolName: {
      type: String,
      default: "",
    },

    tenthPercentage: {
      type: String,
      default: "",
    },

    tenthCompletionYear: {
      type: String,
      default: "",
    },

    // NEW: 10TH BOARD
    tenthBoard: {
      type: String,
      default: "",
    },

    // ==================================================
    // 12TH DETAILS
    // ==================================================

    twelthSchoolName: {
      type: String,
      default: "",
    },

    twelthPercentage: {
      type: String,
      default: "",
    },

    twelthCompletionYear: {
      type: String,
      default: "",
    },
   
    twelthBoard: { type: String, default: "" },
    // ==================================================
    // DIPLOMA DETAILS
    // ==================================================

    diplomaPercentage: {
      type: String,
      default: "",
    },

    diplomaCompletionYear: {
      type: String,
      default: "",
    },

    // NEW: DIPLOMA SCHOOL / COLLEGE / UNIVERSITY
    diplomaCollege: {
      type: String,
      default: "",
    },

    // NEW: DIPLOMA DEGREE PERCENTAGE
    diplomaDegreePercentage: {
      type: String,
      default: "",
    },

    // ==================================================
    // ARREARS
    // ==================================================

    currentArrears: {
      type: String,
      default: "",
    },

    historyOfArrears: {
      type: String,
      default: "",
    },

    // EXISTING: NUMBER OF HISTORY OF ARREARS
    historyOfArrearsCount: {
      type: String,
      default: "",
    },

    // ==================================================
    // CGPA
    // ==================================================

    cgpa: {
      type: String,
      default: "",
    },

    // ==================================================
    // PROFESSIONAL
    // ==================================================

    resumeLink: {
      type: String,
      default: "",
    },

    linkedinLink: {
      type: String,
      default: "",
    },

    githubLink: {
      type: String,
      default: "",
    },

    portfolioLink: {
      type: String,
      default: "",
    },

    hackerrankLink: {
      type: String,
      default: "",
    },

    leetcodeLink: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    internship: {
      type: [String],
      default: [],
    },

    // ==================================================
    // PLACEMENT STATUS
    // ==================================================

    placementStatus: {
      type: String,
      enum: ["Not Placed", "Placed", "Internship"],
      default: "Not Placed",
    },

    // ==================================================
    // PARENT DETAILS
    // ==================================================

    fatherName: {
      type: String,
      default: "",
    },

    motherName: {
      type: String,
      default: "",
    },

    // NEW: FATHER OCCUPATION
    fatherOccupation: {
      type: String,
      default: "",
    },

    fatherPhone: {
      type: String,
      default: "",
    },

    motherPhone: {
      type: String,
      default: "",
    },

    // ==================================================
    // MEDIA
    // ==================================================

    profilePhoto: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
