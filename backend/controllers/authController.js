const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // ==================================================
    // CHECK EXISTING EMAIL
    // ==================================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // ==================================================
    // REGISTER NUMBER
    // ==================================================

    if (role === "student") {
      if (!registerNumber || !registerNumber.trim()) {
        return res.status(400).json({
          message: "Register number is required for students",
        });
      }

      const normalizedRegisterNumber =
        registerNumber.trim();

      const existingRegisterNumber =
        await User.findOne({
          registerNumber: normalizedRegisterNumber,
        });

      if (existingRegisterNumber) {
        return res.status(400).json({
          message: "Register number already exists",
        });
      }
    }

    // ==================================================
    // HASH PASSWORD
    // ==================================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ==================================================
    // CREATE USER DATA
    // ==================================================

    const userData = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      department,
    };

    // Register number only for students
    if (role === "student") {
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
      message: `${user.role} registered successfully`,
    });

  } catch (error) {

    console.error("REGISTRATION ERROR:", error);

    // ==================================================
    // SHOW EXACT DUPLICATE ERROR
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
        Object.keys(error.keyPattern || {})[0];

      if (duplicateField === "email") {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      if (duplicateField === "registerNumber") {
        return res.status(400).json({
          message: "Register number already exists",
        });
      }

      return res.status(400).json({
        message: "Duplicate data already exists",
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

    const {
      email,
      password,
    } = req.body;

    const normalizedEmail =
      email.trim().toLowerCase();

    // ==================================================
    // FIND USER
    // ==================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
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
        message: "Invalid credentials",
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