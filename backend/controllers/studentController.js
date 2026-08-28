const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");

// ==================================================
// LOCAL FILE URL HELPER
// ==================================================

const getLocalFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  // If already a complete URL, return it as it is
  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  // Convert local relative path to backend URL
  return `http://localhost:${process.env.PORT || 5000}${filePath}`;
};

// ==================================================
// GET PROFILE
// ==================================================

exports.getProfile = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    // Get user information
    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get student profile
    let profile = await StudentProfile.findOne({
      userId,
    });

    // Create profile if it doesn't exist
    if (!profile) {
      profile = await StudentProfile.create({
        userId,
      });
    }

    // ==================================================
    // SEND PROFILE
    // ==================================================

    res.status(200).json({
      name: user.name,
      email: user.email,
      registerNumber: user.registerNumber,

      // Personal
      dob: profile.dob,
      gender: profile.gender,
      rollNumber: profile.rollNumber,
      department: profile.department,
      currentYear: profile.currentYear,
      section: profile.section,
      batch: profile.batch,

      religion: profile.religion,
      caste: profile.caste,
      community: profile.community,

      // Academic
      cgpa: profile.cgpa,
      skills: profile.skills,
      internship: profile.internship,
      placementStatus: profile.placementStatus,

      studentPhone: profile.studentPhone,
      address: profile.address,

      tenthPercentage:
        profile.tenthPercentage,

      twelthPercentage:
        profile.twelthPercentage,

      diplomaPercentage:
        profile.diplomaPercentage,

      currentArrears:
        profile.currentArrears,

      historyOfArrears:
        profile.historyOfArrears,

      // Professional
      resumeLink:
        getLocalFileUrl(
          profile.resumeLink
        ),

      linkedinLink:
        profile.linkedinLink,

      githubLink:
        profile.githubLink,

      portfolioLink:
        profile.portfolioLink,

      // Parent
      fatherName:
        profile.fatherName,

      motherName:
        profile.motherName,

      fatherPhone:
        profile.fatherPhone,

      motherPhone:
        profile.motherPhone,

      // Local profile photo
      profilePhoto:
        getLocalFileUrl(
          profile.profilePhoto
        ),
    });

  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================================================
// UPDATE PROFILE
// ==================================================

exports.updateProfile = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    console.log(
      "REQ BODY:",
      req.body
    );

    let data = req.body;

    // ==================================================
    // CONVERT SKILLS TO ARRAY
    // ==================================================

    if (typeof data.skills === "string") {
      data.skills = data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // ==================================================
    // CONVERT INTERNSHIP TO ARRAY
    // ==================================================

    if (
      typeof data.internship === "string"
    ) {
      data.internship = data.internship
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // ==================================================
    // UPDATE USER
    // ==================================================

    await User.findByIdAndUpdate(
      userId,
      {
        name: data.name,
        email: data.email,
        registerNumber:
          data.registerNumber,
      },
      {
        runValidators: true,
      }
    );

    // ==================================================
    // UPDATE STUDENT PROFILE
    // ==================================================

    const profile =
      await StudentProfile.findOneAndUpdate(
        { userId },

        {
          // Personal
          dob: data.dob,
          gender: data.gender,
          rollNumber: data.rollNumber,
          department: data.department,
          currentYear: data.currentYear,
          section: data.section,
          batch: data.batch,

          religion: data.religion,
          caste: data.caste,
          community: data.community,

          // Academic
          cgpa: data.cgpa,

          skills:
            data.skills || [],

          internship:
            data.internship || [],

          placementStatus:
            data.placementStatus,

          studentPhone:
            data.studentPhone,

          address:
            data.address,

          tenthPercentage:
            data.tenthPercentage,

          twelthPercentage:
            data.twelthPercentage,

          diplomaPercentage:
            data.diplomaPercentage,

          currentArrears:
            data.currentArrears,

          historyOfArrears:
            data.historyOfArrears,

          // Professional
          resumeLink:
            data.resumeLink,

          linkedinLink:
            data.linkedinLink,

          githubLink:
            data.githubLink,

          portfolioLink:
            data.portfolioLink,

          // Parent
          fatherName:
            data.fatherName,

          motherName:
            data.motherName,

          fatherPhone:
            data.fatherPhone,

          motherPhone:
            data.motherPhone,

          // Profile photo
          profilePhoto:
            data.profilePhoto,
        },

        {
          returnDocument: "after",
          runValidators: true,
          upsert: true,
        }
      );

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      message:
        "Profile updated successfully",

      profile,
    });

  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};