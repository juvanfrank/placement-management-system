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

    // ==================================================
    // CHECK EXISTING EMAIL
    // ==================================================

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // ==================================================
    // REGISTER NUMBER
    // ==================================================
    // Only students need register numbers.
    // Mentors/HOD/Admin should not store an empty
    // registerNumber value.
    // ==================================================

    if (role === "student") {
      if (!registerNumber) {
        return res.status(400).json({
          message: "Register number is required for students",
        });
      }

      const existingRegisterNumber =
        await User.findOne({
          registerNumber,
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

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ==================================================
    // CREATE USER DATA
    // ==================================================

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      department,
    };

    // Register number only for students
    if (role === "student") {
      userData.registerNumber =
        registerNumber;
    }

    // ==================================================
    // CREATE USER
    // ==================================================

    const user =
      await User.create(userData);

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

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Email or register number already exists",
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

    // ==================================================
    // FIND USER
    // ==================================================

    const user = await User.findOne({
      email,
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