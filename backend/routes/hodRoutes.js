const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");

// 🏛 HOD sees all students in their department
router.get("/students", auth, roleMiddleware("hod"), async (req, res) => {
  try {
    const hod = await User.findById(req.user.id);

    const students = await User.find({
      department: hod.department,
      role: "student"
    }).select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;