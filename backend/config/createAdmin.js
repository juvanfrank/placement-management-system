const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin@123";

    // Check whether admin already exists
    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    // Hash admin password
    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    // Create admin
    const admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      department: "",
    });

    console.log("=================================");
    console.log("Admin account created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", adminPassword);
    console.log("Role:", admin.role);
    console.log("=================================");

    process.exit(0);

  } catch (error) {
    console.error(
      "Failed to create admin:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();