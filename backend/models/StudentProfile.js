const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER
    // ==================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ==================================================
    // PERSONAL
    // ==================================================

    name: {
      type: String,
      default: ""
    },

    dob: {
      type: String,
      default: ""
    },

    gender: {
  type: String,
  enum: ["Male", "Female"],
  default: ""
},

    registerNumber: {
      type: String,
      default: ""
    },

    rollNumber: {
      type: String,
      default: ""
    },

    department: {
      type: String,
      default: ""
    },

    currentYear: {
  type: String,
  enum: ["I", "II", "III", "IV"],
  default: ""
},

    section: {
  type: String,
  enum: ["A", "B", "C", "D", "E", "F"],
  default: ""
},

    batch: {
      type: String,
      default: ""
    },

    // ==================================================
    // RELIGION / COMMUNITY
    // ==================================================

    religion: {
      type: String,
      
      default: ""
    },

    caste: {
      type: String,
      
      default: ""
    },

    community: {
      type: String,

      default: ""
    },

    // ==================================================
    // CONTACT
    // ==================================================
    studentPhone: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    // ==================================================
    // ACADEMIC
    // ==================================================

    tenthPercentage: {
      type: String,
      default: ""
    },

    twelthPercentage: {
      type: String,
      default: ""
    },

    diplomaPercentage: {
      type: String,
      default: ""
    },

    currentArrears: {
      type: String,
      default: ""
    },

    historyOfArrears: {
      type: String,
      default: ""
    },

    cgpa: {
      type: String,
      default: ""
    },

    // ==================================================
    // PROFESSIONAL
    // ==================================================

    resumeLink: {
      type: String,
      default: ""
    },

    linkedinLink: {
      type: String,
      default: ""
    },

    githubLink: {
      type: String,
      default: ""
    },

    portfolioLink: {
      type: String,
      default: ""
    },

    skills: {
      type: [String],
      default: []
    },

    internship: {
      type: [String],
      default: []
    },

    placementStatus: {
      type: String,

      enum: [
        "Not Placed",
        "Placed",
        "Internship"
      ],

      default: "Not Placed"
    },

    // ==================================================
    // PARENT DETAILS
    // ==================================================

    fatherName: {
      type: String,
      default: ""
    },

    motherName: {
      type: String,
      default: ""
    },

    fatherPhone: {
      type: String,
      default: ""
    },

    motherPhone: {
      type: String,
      default: ""
    },

    // ==================================================
    // MEDIA
    // ==================================================

    profilePhoto: {
      type: String,
      default: ""
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);