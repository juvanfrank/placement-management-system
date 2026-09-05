const express = require("express");

const router = express.Router();

const {
  addCertificate,
  getCertificates,
  getMentorCertificates,
  updateCertificateStatus,
} = require("../controllers/certificateController");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

// ==================================================
// STUDENT CERTIFICATES
// ==================================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  addCertificate
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  getCertificates
);

// ==================================================
// MENTOR CERTIFICATES
// ==================================================

router.get(
  "/mentor",
  authMiddleware,
  roleMiddleware("mentor"),
  getMentorCertificates
);

router.put(
  "/mentor/:id/status",
  authMiddleware,
  roleMiddleware("mentor"),
  updateCertificateStatus
);

module.exports = router;