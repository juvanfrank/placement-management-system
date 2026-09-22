const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==================================================
// SECRET PASSWORDS
// ==================================================
//
// IMPORTANT:
// For production, move these to your .env file.
//
// Example:
//
// MENTOR_SECRET_PASSWORD=mentor@2026
// HOD_SECRET_PASSWORD=hod@2026
//
// ==================================================

const MENTOR_SECRET_PASSWORD =
  process.env.MENTOR_SECRET_PASSWORD || "MENTOR@2026";

const HOD_SECRET_PASSWORD =
  process.env.HOD_SECRET_PASSWORD || "HOD@2026";

// ==================================================
// REGISTER
// ==================================================

exports.register = async (req, res) => {
  try {
    const {
      name,
      registerNumber,
      email,
      password,
      role,
      department,
      secretPassword,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // ==================================================
    // NORMALIZE ROLE
    // ==================================================

    const normalizedRole = String(role)
      .trim()
      .toLowerCase();

    // ==================================================
    // ALLOWED PUBLIC REGISTRATION ROLES
    // ==================================================

    const allowedRoles = [
      "student",
      "mentor",
      "hod",
    ];

    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(403).json({
        message:
          "Admin registration is not allowed.",
      });
    }

    // ==================================================
    // DEPARTMENT
    // ==================================================

    if (
      ["student", "mentor", "hod"].includes(
        normalizedRole
      ) &&
      !department
    ) {
      return res.status(400).json({
        message:
          "Department is required for this role",
      });
    }

    // ==================================================
    // MENTOR SECRET PASSWORD
    // ==================================================

    if (normalizedRole === "mentor") {
      if (
        !secretPassword ||
        !secretPassword.trim()
      ) {
        return res.status(400).json({
          message:
            "Mentor secret password is required",
        });
      }

      if (
        secretPassword !==
        MENTOR_SECRET_PASSWORD
      ) {
        return res.status(403).json({
          message:
            "Invalid Mentor secret password",
        });
      }
    }

    // ==================================================
    // HOD SECRET PASSWORD
    // ==================================================

    if (normalizedRole === "hod") {
      if (
        !secretPassword ||
        !secretPassword.trim()
      ) {
        return res.status(400).json({
          message:
            "HOD secret password is required",
        });
      }

      if (
        secretPassword !==
        HOD_SECRET_PASSWORD
      ) {
        return res.status(403).json({
          message:
            "Invalid HOD secret password",
        });
      }
    }

    // ==================================================
    // NORMALIZE EMAIL
    // ==================================================

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // ==================================================
    // CHECK EXISTING EMAIL
    // ==================================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists with this email",
      });
    }

    // ==================================================
    // REGISTER NUMBER
    // ==================================================

    if (normalizedRole === "student") {
      if (
        !registerNumber ||
        !registerNumber.trim()
      ) {
        return res.status(400).json({
          message:
            "Register number is required for students",
        });
      }

      const normalizedRegisterNumber =
        registerNumber.trim();

      const existingRegisterNumber =
        await User.findOne({
          registerNumber:
            normalizedRegisterNumber,
        });

      if (existingRegisterNumber) {
        return res.status(400).json({
          message:
            "Register number already exists",
        });
      }
    }

    // ==================================================
    // HASH PASSWORD
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ==================================================
    // CREATE USER DATA
    // ==================================================

    const userData = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
      department: department.trim(),
    };

    // ==================================================
    // REGISTER NUMBER ONLY FOR STUDENTS
    // ==================================================

    if (normalizedRole === "student") {
      userData.registerNumber =
        registerNumber.trim();
    }

    // ==================================================
    // CREATE USER
    // ==================================================

    const user = await User.create(userData);

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(201).json({
      message:
        `${user.role} registered successfully`,
    });
  } catch (error) {
    console.error(
      "REGISTRATION ERROR:",
      error
    );

    // ==================================================
    // DUPLICATE ERROR
    // ==================================================

    if (error.code === 11000) {
      console.log(
        "DUPLICATE KEY PATTERN:",
        error.keyPattern
      );

      console.log(
        "DUPLICATE KEY VALUE:",
        error.keyValue
      );

      const duplicateField =
        Object.keys(
          error.keyPattern || {}
        )[0];

      if (duplicateField === "email") {
        return res.status(400).json({
          message:
            "Email already exists",
        });
      }

      if (
        duplicateField ===
        "registerNumber"
      ) {
        return res.status(400).json({
          message:
            "Register number already exists",
        });
      }

      return res.status(400).json({
        message:
          "Duplicate data already exists",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// LOGIN
// ==================================================

exports.login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // ==================================================
    // FIND USER
    // ==================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid credentials",
      });
    }

    // ==================================================
    // CHECK PASSWORD
    // ==================================================

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid credentials",
      });
    }

    // ==================================================
    // CREATE TOKEN
    // ==================================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department:
          user.department || "",
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // Validate fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All password fields are required",
      });
    }

    // Check new password confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message:
          "New password and confirm password do not match",
      });
    }

    // Minimum password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    // Get logged-in user from JWT
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Save new password
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};