const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// Get Logged-in Student Profile
router.get("/profile", auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;