const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const User = require("../models/User");

const mentorController =
  require("../controllers/mentorController");

// ==================================================
// MENTOR PROFILE
// ==================================================

router.get(
  "/profile",
  auth,
  roleMiddleware("mentor"),
  mentorController.getProfile
);

router.put(
  "/profile",
  auth,
  roleMiddleware("mentor"),
  mentorController.updateProfile
);

// ==================================================
// MENTOR SEES ASSIGNED STUDENTS
// ==================================================

router.get(
  "/students",
  auth,
  roleMiddleware("mentor"),
  async (req, res) => {

    try {

      const students = await User.find({
        mentorId: req.user.id,
        role: "student"
      }).select("-password");

      res.json(students);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);

module.exports = router;