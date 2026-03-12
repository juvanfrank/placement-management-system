const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

// GET student profile
router.get("/profile", authMiddleware, getProfile);

// UPDATE profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;