const mongoose = require("mongoose");

const cgpaSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sem1: Number,
  sem2: Number,
  sem3: Number,
  sem4: Number,
  sem5: Number,
  sem6: Number,
  sem7: Number,
  sem8: Number,

  cgpa: Number

}, { timestamps: true });

module.exports = mongoose.model("Cgpa", cgpaSchema);