const express = require("express");

const router = express.Router();

const auth =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const adminController =
  require("../controllers/adminController");


// ==================================================
// ADMIN PROFILE
// ==================================================

router.get(
  "/profile",
  auth,
  roleMiddleware("admin"),
  adminController.getProfile
);

// ==================================================
// UPDATE ADMIN PROFILE
// ==================================================

router.put(
  "/profile",
  auth,
  roleMiddleware("admin"),
  adminController.updateProfile
);

// ==================================================
// GET ALL DEPARTMENTS
// ==================================================

router.get(
  "/departments",
  auth,
  roleMiddleware("admin"),
  adminController.getDepartments
);


// ==================================================
// GET YEARS BY DEPARTMENT
// ==================================================

router.get(
  "/departments/:department/years",
  auth,
  roleMiddleware("admin"),
  adminController.getYears
);


// ==================================================
// GET SECTIONS BY DEPARTMENT + YEAR
// ==================================================

router.get(
  "/departments/:department/year/:year/sections",
  auth,
  roleMiddleware("admin"),
  adminController.getSections
);


// ==================================================
// GET STUDENTS BY CLASS
// ==================================================

router.get(
  "/departments/:department/year/:year/section/:section/students",
  auth,
  roleMiddleware("admin"),
  adminController.getStudentsByClass
);

// ==================================================
// SEARCH STUDENTS
// ==================================================

router.get(
  "/search-students",
  auth,
  roleMiddleware("admin"),
  adminController.searchStudents
);


// ==================================================
// GET SINGLE STUDENT DETAILS
// ==================================================

router.get(
  "/student/:id",
  auth,
  roleMiddleware("admin"),
  adminController.getStudentDetails
);

router.get(
  "/search-students/export-excel",
  auth,
  roleMiddleware("admin"),
  adminController.exportSearchStudentsExcel
);

// ==================================================
// DELETION PANEL - SEARCH STUDENTS
// ==================================================

router.get(
  "/deletion/students",
  auth,
  roleMiddleware("admin"),
  adminController.getDeletionStudents
);

// ==================================================
// DELETION PANEL - GENERATE EXCEL
// ==================================================

router.post(
  "/deletion/students/export-excel",
  auth,
  roleMiddleware("admin"),
  adminController.exportDeletionStudentsExcel
);

// // ==================================================
// // DELETION PANEL - DELETE STUDENTS
// // ==================================================

router.delete(
  "/deletion/students",
  auth,
  roleMiddleware("admin"),
  adminController.deleteStudents
);

module.exports = router;