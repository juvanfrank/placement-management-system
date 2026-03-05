const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    registerNumber: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    department: String,
    year: Number,
    cgpa: Number,

    role: {
      type: String,
      enum: ["student", "mentor", "hod", "admin"],
      default: "student"
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }

  },
  { timestamps: true }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema, "users");  