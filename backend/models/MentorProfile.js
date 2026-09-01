const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER
    // ==================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ==================================================
    // PERSONAL DETAILS
    // ==================================================

    name: {
      type: String,
      default: "",
    },

    age: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
      default: null,
    },

    section: {
      type: String,
      default: "",
    },

    // ==================================================
    // CONTACT DETAILS
    // ==================================================

    phone: {
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
    // PROFILE PHOTO
    // ==================================================

    profilePhoto: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MentorProfile",
  mentorProfileSchema
);