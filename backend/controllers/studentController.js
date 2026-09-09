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
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
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
    const userId = req.user.id || req.user.userId || req.user._id;

    // ==================================================
    // GET USER INFORMATION
    // ==================================================

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ==================================================
    // GET STUDENT PROFILE
    // ==================================================

    let profile = await StudentProfile.findOne({
      userId,
    });

    // Create profile if it doesn't exist
    if (!profile) {
      profile = await StudentProfile.create({
        userId,
        department: user.department || "",
      });
    }

    // ==================================================
    // SEND PROFILE
    // ==================================================

    res.status(200).json({
      // ==================================================
      // USER DETAILS
      // ==================================================

      name: user.name || "",

      email: user.email || "",

      registerNumber: user.registerNumber || "",

      department: profile.department || user.department || "",

      // ==================================================
      // PERSONAL
      // ==================================================

      dob: profile.dob || "",

      gender: profile.gender || "",

      rollNumber: profile.rollNumber || "",

      currentYear: profile.currentYear || "",

      section: profile.section || "",

      batch: profile.batch || "",

      religion: profile.religion || "",

      caste: profile.caste || "",

      community: profile.community || "",

      // ==================================================
      // ACADEMIC
      // ==================================================

      cgpa: profile.cgpa || "",

      skills: profile.skills || [],

      internship: profile.internship || [],

      placementStatus: profile.placementStatus || "Not Placed",

      // ==================================================
      // CONTACT
      // ==================================================

      studentPhone: profile.studentPhone || "",

      address: profile.address || "",

      // ==================================================
      // ACADEMIC DETAILS
      // ==================================================

      tenthPercentage: profile.tenthPercentage || "",

      twelthPercentage: profile.twelthPercentage || "",

      diplomaPercentage: profile.diplomaPercentage || "",

      currentArrears: profile.currentArrears || "",

      historyOfArrears: profile.historyOfArrears || "",

      historyOfArrearsCount: profile.historyOfArrearsCount || "",

      // ==================================================
      // PROFESSIONAL
      // ==================================================

      resumeLink: getLocalFileUrl(profile.resumeLink),

      linkedinLink: profile.linkedinLink || "",

      githubLink: profile.githubLink || "",

      portfolioLink: profile.portfolioLink || "",

      // ==================================================
      // PARENT DETAILS
      // ==================================================

      fatherName: profile.fatherName || "",

      motherName: profile.motherName || "",

      fatherPhone: profile.fatherPhone || "",

      motherPhone: profile.motherPhone || "",

      // ==================================================
      // PROFILE PHOTO
      // ==================================================

      profilePhoto: getLocalFileUrl(profile.profilePhoto),
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// UPDATE PROFILE
// ==================================================

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    console.log("STUDENT PROFILE UPDATE:", req.body);

    const data = req.body;

    // ==================================================
    // CONVERT SKILLS TO ARRAY
    // ==================================================

    if (typeof data.skills === "string") {
      data.skills = data.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // ==================================================
    // CONVERT INTERNSHIP TO ARRAY
    // ==================================================

    if (typeof data.internship === "string") {
      data.internship = data.internship
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // ==================================================
    // UPDATE USER COLLECTION
    // ==================================================

    await User.findByIdAndUpdate(
      userId,

      {
        name: data.name,

        email: data.email,

        registerNumber: data.registerNumber,

        // IMPORTANT
        // Save department in User
        department: data.department,
      },

      {
        runValidators: true,
      },
    );

    // ==================================================
    // UPDATE STUDENT PROFILE
    // ==================================================

    const profile = await StudentProfile.findOneAndUpdate(
      {
        userId,
      },

      {
        // ==============================================
        // DEPARTMENT
        // ==============================================

        // IMPORTANT FOR ADMIN PANEL
        department: data.department || "",

        // ==============================================
        // PERSONAL
        // ==============================================

        dob: data.dob || "",

        gender: data.gender || "",

        rollNumber: data.rollNumber || "",

        currentYear: data.currentYear || "",

        section: data.section || "",

        batch: data.batch || "",

        // ==============================================
        // RELIGION / COMMUNITY
        // ==============================================

        religion: data.religion || "",

        caste: data.caste || "",

        community: data.community || "",

        // ==============================================
        // ACADEMIC
        // ==============================================

        cgpa: data.cgpa || "",

        skills: data.skills || [],

        internship: data.internship || [],

        placementStatus: data.placementStatus || "Not Placed",

        // ==============================================
        // CONTACT
        // ==============================================

        studentPhone: data.studentPhone || "",

        address: data.address || "",

        // ==============================================
        // ACADEMIC DETAILS
        // ==============================================

        tenthPercentage: data.tenthPercentage || "",

        twelthPercentage: data.twelthPercentage || "",

        diplomaPercentage: data.diplomaPercentage || "",

        currentArrears: data.currentArrears || "",

        historyOfArrears: data.historyOfArrears || "",

        historyOfArrearsCount: data.historyOfArrearsCount,

        // ==============================================
        // PROFESSIONAL
        // ==============================================

        resumeLink: data.resumeLink || "",

        linkedinLink: data.linkedinLink || "",

        githubLink: data.githubLink || "",

        portfolioLink: data.portfolioLink || "",

        // ==============================================
        // PARENT DETAILS
        // ==============================================

        fatherName: data.fatherName || "",

        motherName: data.motherName || "",

        fatherPhone: data.fatherPhone || "",

        motherPhone: data.motherPhone || "",

        // ==============================================
        // PROFILE PHOTO
        // ==============================================

        profilePhoto: data.profilePhoto || "",
      },

      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      message: "Profile updated successfully",

      profile,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",

      error: error.message,
    });
  }
};
