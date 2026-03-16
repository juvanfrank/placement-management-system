const express = require("express");
const router = express.Router();

const {
  saveCgpa,
  getCgpa
} = require("../controllers/cgpaController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, saveCgpa);
router.get("/", authMiddleware, getCgpa);

module.exports = router;