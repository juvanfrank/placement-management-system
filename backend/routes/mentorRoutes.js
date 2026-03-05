const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");

// 👨‍🏫 Mentor sees only assigned students
router.get("/students", auth, roleMiddleware("mentor"), async (req, res) => {
  try {
    const students = await User.find({
      mentorId: req.user.id,
      role: "student"
    }).select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;