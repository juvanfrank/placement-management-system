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
      // USER DETAILS - FROM REGISTRATION
      // ==================================================

      name: user.name || "",

      email: user.email || "",

      registerNumber: user.registerNumber || "",

      department: profile.department || user.department || "",

      // ==================================================
      // PERSONAL DETAILS
      // ==================================================

      dob: profile.dob || "",

      gender: profile.gender || "",

      rollNumber: profile.rollNumber || "",

      currentYear: profile.currentYear || "",

      section: profile.section || "",

      batch: profile.batch || "",

      aadharNumber: profile.aadharNumber || "",

      religion: profile.religion || "",

      caste: profile.caste || "",

      community: profile.community || "",

      // ==================================================
      // CONTACT DETAILS
      // ==================================================

      studentPhone: profile.studentPhone || "",

      address: profile.address || "",

      pincode: profile.pincode || "",

      district: profile.district || "",

      state: profile.state || "",

      languagesKnown: profile.languagesKnown || "",

      hostelerDayScholar: profile.hostelerDayScholar || "",

      parentsNumber: profile.parentsNumber || "",

      // ==================================================
      // ACADEMIC DETAILS
      // ==================================================

      mediumOfStudy: profile.mediumOfStudy || "",

      tenthSchoolName: profile.tenthSchoolName || "",

      tenthPercentage: profile.tenthPercentage || "",

      tenthBoard: profile.tenthBoard || "",

      tenthCompletionYear: profile.tenthCompletionYear || "",

      twelthSchoolName: profile.twelthSchoolName || "",

      twelthPercentage: profile.twelthPercentage || "",

      twelthBoard: profile.twelthBoard || "",

      twelthCompletionYear: profile.twelthCompletionYear || "",

      diplomaPercentage: profile.diplomaPercentage || "",

      diplomaCollege: profile.diplomaCollege || "",

      diplomaCompletionYear: profile.diplomaCompletionYear || "",

      diplomaDegreePercentage:
        profile.diplomaDegreePercentage || "",

      cgpa: profile.cgpa || "",

      historyOfArrears: profile.historyOfArrears || "",

      historyOfArrearsCount: profile.historyOfArrearsCount || "",

      currentArrears: profile.currentArrears || "",

      // ==================================================
      // PROFESSIONAL
      // ==================================================

      resumeLink: getLocalFileUrl(profile.resumeLink),

      linkedinLink: profile.linkedinLink || "",

      githubLink: profile.githubLink || "",

      portfolioLink: profile.portfolioLink || "",

      hackerrankLink: profile.hackerrankLink || "",

      leetcodeLink: profile.leetcodeLink || "",

      // ==================================================
      // INTERNSHIP
      // ==================================================

      internship: profile.internship || [],

      // ==================================================
      // SKILLS
      // ==================================================

      skills: profile.skills || [],

      // ==================================================
      // PLACEMENT DETAILS
      // ==================================================

      placementStatus: profile.placementStatus || "Not Placed",

      // ==================================================
      // PARENT / GUARDIAN DETAILS
      // ==================================================

      fatherName: profile.fatherName || "",

      motherName: profile.motherName || "",

      fatherOccupation: profile.fatherOccupation || "",

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

    // Registration details are stored in User
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
        // PERSONAL DETAILS
        // ==============================================

        dob: data.dob || "",

        gender: data.gender || "",

        rollNumber: data.rollNumber || "",

        currentYear: data.currentYear || "",

        section: data.section || "",

        batch: data.batch || "",

        aadharNumber: data.aadharNumber || "",

        religion: data.religion || "",

        caste: data.caste || "",

        community: data.community || "",

        // ==============================================
        // CONTACT DETAILS
        // ==============================================

        studentPhone: data.studentPhone || "",

        // KEEP EXISTING FIELD NAME
        address: data.address || "",

        pincode: data.pincode || "",

        district: data.district || "",

        state: data.state || "",

        languagesKnown: data.languagesKnown || "",

        hostelerDayScholar: data.hostelerDayScholar || "",

        parentsNumber: data.parentsNumber || "",

        // ==============================================
        // ACADEMIC DETAILS
        // ==============================================

        mediumOfStudy: data.mediumOfStudy || "",

        tenthSchoolName: data.tenthSchoolName || "",

        tenthPercentage: data.tenthPercentage || "",

        tenthBoard: data.tenthBoard || "",

        tenthCompletionYear: data.tenthCompletionYear || "",

        twelthSchoolName: data.twelthSchoolName || "",

        twelthPercentage: data.twelthPercentage || "",

        twelthBoard: data.twelthBoard || "",

        twelthCompletionYear: data.twelthCompletionYear || "",

        diplomaPercentage: data.diplomaPercentage || "",

        diplomaCollege: data.diplomaCollege || "",

        diplomaCompletionYear: data.diplomaCompletionYear || "",

        diplomaDegreePercentage:
          data.diplomaDegreePercentage || "",

        cgpa: data.cgpa || "",

        historyOfArrears: data.historyOfArrears || "",

        historyOfArrearsCount: data.historyOfArrearsCount || "",

        currentArrears: data.currentArrears || "",

        // ==============================================
        // PROFESSIONAL
        // ==============================================

        resumeLink: data.resumeLink || "",

        linkedinLink: data.linkedinLink || "",

        githubLink: data.githubLink || "",

        portfolioLink: data.portfolioLink || "",

        hackerrankLink: data.hackerrankLink || "",

        leetcodeLink: data.leetcodeLink || "",

        // ==============================================
        // INTERNSHIP
        // ==============================================

        internship: data.internship || [],

        // ==============================================
        // SKILLS
        // ==============================================

        skills: data.skills || [],

        // ==============================================
        // PLACEMENT DETAILS
        // ==============================================

        placementStatus: data.placementStatus || "Not Placed",

        // ==============================================
        // PARENT / GUARDIAN DETAILS
        // ==============================================

        fatherName: data.fatherName || "",

        motherName: data.motherName || "",

        fatherOccupation: data.fatherOccupation || "",

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