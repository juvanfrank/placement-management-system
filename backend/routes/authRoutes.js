const express = require("express");

const router = express.Router();

const {
  register,
  login,
  changePassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Change password
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;