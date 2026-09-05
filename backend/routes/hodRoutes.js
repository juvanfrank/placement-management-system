const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const hodController = require("../controllers/hodController");

// ==================================================
// HOD PROFILE
// ==================================================

router.get(
  "/profile",
  auth,
  roleMiddleware("hod"),
  hodController.getProfile
);

// ==================================================
// HOD STUDENTS
// ==================================================

router.get(
  "/students",
  auth,
  roleMiddleware("hod"),
  hodController.getStudents
);

// ==================================================
// SINGLE STUDENT DETAILS
// ==================================================

router.get(
  "/student/:id",
  auth,
  roleMiddleware("hod"),
  hodController.getStudentDetails
);

// ==================================================
// HOD MENTORS
// ==================================================

router.get(
  "/mentors",
  auth,
  roleMiddleware("hod"),
  hodController.getMentors
);

// ==================================================
// SINGLE MENTOR DETAILS
// ==================================================

router.get(
  "/mentor/:id",
  auth,
  roleMiddleware("hod"),
  hodController.getMentorDetails
);

module.exports = router;