const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

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
// MENTOR STUDENTS
// ==================================================

router.get(
  "/students",
  auth,
  roleMiddleware("mentor"),
  mentorController.getStudents
);

// ==================================================
// SINGLE STUDENT DETAILS
// ==================================================

router.get(
  "/student/:id",
  auth,
  roleMiddleware("mentor"),
  mentorController.getStudentDetails
);

module.exports = router;