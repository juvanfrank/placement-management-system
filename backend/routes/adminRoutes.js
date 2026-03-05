const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const User = require("../models/User");

// Get All Students (Admin Only)
router.get("/students", auth, admin, async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// 🔎 Admin Search Students
router.get("/search", auth, admin, async (req, res) => {
  try {
    const { department, minCgpa } = req.query;

    let filter = {};

    if (department) {
      filter.department = department;
    }

    if (minCgpa) {
      filter.cgpa = { $gte: Number(minCgpa) };
    }

    const students = await Student.find(filter).select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;