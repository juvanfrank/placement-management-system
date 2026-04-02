const express = require("express");
const router = express.Router();

const {
  addCertificate,
  getCertificates
} = require("../controllers/certificateController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addCertificate);
router.get("/", authMiddleware, getCertificates);

module.exports = router;