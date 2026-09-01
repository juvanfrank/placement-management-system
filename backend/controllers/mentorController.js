const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");
const StudentProfile = require("../models/StudentProfile");

// ==================================================
// LOCAL FILE URL HELPER
// ==================================================

const getLocalFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  // Already a complete URL
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `http://localhost:${process.env.PORT || 5000}${filePath}`;
};

// ==================================================
// GET MENTOR PROFILE
// ==================================================

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found",
      });
    }

    // ==================================================
    // GET USER
    // ==================================================

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    // ==================================================
    // GET MENTOR PROFILE
    // ==================================================

    let profile = await MentorProfile.findOne({
      userId,
    });

    // Create profile if it doesn't exist
    if (!profile) {
      profile = await MentorProfile.create({
        userId,
      });
    }

    // ==================================================
    // RETURN PROFILE
    // ==================================================

    res.status(200).json({
      userId: user._id,

      // User details
      name: user.name || "",

      email: user.email || "",

      // Department is stored in User
      department: user.department || "",

      // Mentor details
      age: profile.age || "",

      year: profile.year ?? "",

      section: profile.section || "",

      phone: profile.phone || "",

      address: profile.address || "",

      // Profile photo
      profilePhoto: getLocalFileUrl(profile.profilePhoto),
    });
  } catch (error) {
    console.error("GET MENTOR PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// UPDATE MENTOR PROFILE
// ==================================================

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found",
      });
    }

    const data = req.body;

    console.log("=================================");

    console.log("MENTOR PROFILE UPDATE");

    console.log("USER ID:", userId);

    console.log("RECEIVED DEPARTMENT:", data.department);

    console.log("RECEIVED YEAR:", data.year);

    console.log("RECEIVED SECTION:", data.section);

    console.log("=================================");

    // ==================================================
    // UPDATE USER
    // ==================================================

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: data.name,
        email: data.email,

        // Mentor can change department
        department: data.department,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ==================================================
    // UPDATE MENTOR PROFILE
    // ==================================================

    const profile = await MentorProfile.findOneAndUpdate(
      {
        userId,
      },

      {
        age: data.age || "",

        year:
          data.year !== undefined && data.year !== ""
            ? Number(data.year)
            : null,

        section: data.section || "",

        phone: data.phone || "",

        address: data.address || "",

        profilePhoto: data.profilePhoto || "",
      },

      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      message: "Mentor profile updated successfully",

      profile: {
        userId: updatedUser._id,

        name: updatedUser.name || "",

        email: updatedUser.email || "",

        department: updatedUser.department || "",

        age: profile.age || "",

        year: profile.year ?? "",

        section: profile.section || "",

        phone: profile.phone || "",

        address: profile.address || "",

        profilePhoto: getLocalFileUrl(profile.profilePhoto),
      },
    });
  } catch (error) {
    console.error("UPDATE MENTOR PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET MENTOR'S STUDENTS
// ==================================================

exports.getStudents = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found",
      });
    }

    // ==================================================
    // GET MENTOR USER
    // ==================================================

    const mentorUser = await User.findById(userId).select("-password");

    if (!mentorUser) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    // ==================================================
    // GET MENTOR PROFILE
    // ==================================================

    const mentorProfile = await MentorProfile.findOne({
      userId,
    });

    if (!mentorProfile) {
      return res.status(404).json({
        message: "Mentor profile not found",
      });
    }

    // ==================================================
    // MENTOR MAPPING DETAILS
    // ==================================================

    const mentorDepartment = mentorUser.department || "";

    const mentorYear = mentorProfile.year;

    const mentorSection = mentorProfile.section || "";

    console.log("=================================");

    console.log("MENTOR STUDENT MAPPING");

    console.log("Department:", mentorDepartment);

    console.log("Year:", mentorYear);

    console.log("Section:", mentorSection);

    console.log("=================================");

    // ==================================================
    // CHECK MAPPING DETAILS
    // ==================================================

    if (
      !mentorDepartment ||
      mentorYear === null ||
      mentorYear === undefined ||
      !mentorSection
    ) {
      return res.status(200).json({
        mentor: {
          department: mentorDepartment,

          year: mentorYear ?? "",

          section: mentorSection,
        },

        count: 0,

        students: [],

        message: "Please complete mentor department, year and section",
      });
    }

    // ==================================================
    // GET STUDENT USERS
    // ==================================================

    const studentUsers = await User.find({
      role: "student",

      department: mentorDepartment,
    }).select("-password");

    // ==================================================
    // GET USER IDS
    // ==================================================

    const userIds = studentUsers.map((student) => student._id);

    // ==================================================
    // GET STUDENT PROFILES
    // ==================================================

    const studentProfiles = await StudentProfile.find({
      userId: {
        $in: userIds,
      },

      currentYear: String(mentorYear),

      section: mentorSection,
    });

    // ==================================================
    // CREATE PROFILE MAP
    // ==================================================

    const profileMap = new Map();

    studentProfiles.forEach((profile) => {
      profileMap.set(profile.userId.toString(), profile);
    });

    // ==================================================
    // COMBINE USER + PROFILE DATA
    // ==================================================

    const students = studentUsers
      .map((user) => {
        const profile = profileMap.get(user._id.toString());

        if (!profile) {
          return null;
        }

        return {
          id: user._id,

          name: user.name || profile.name || "",

          email: user.email || profile.email || "",

          registerNumber: user.registerNumber || profile.registerNumber || "",

          rollNumber: profile.rollNumber || "",

          department: user.department || profile.department || "",

          year: profile.currentYear || "",

          section: profile.section || "",

          profilePhoto: getLocalFileUrl(profile.profilePhoto),
        };
      })
      .filter(Boolean);

    // ==================================================
    // SORT BY ROLL NUMBER
    // ==================================================

    // ==================================================
    // SORT BY ROLL NUMBER - ASCENDING
    // ==================================================

    students.sort((a, b) => {
      const rollA = String(a.rollNumber || "").trim();
      const rollB = String(b.rollNumber || "").trim();

      return rollA.localeCompare(rollB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      mentor: {
        department: mentorDepartment,

        year: mentorYear,

        section: mentorSection,
      },

      count: students.length,

      students,
    });
  } catch (error) {
    console.error("GET MENTOR STUDENTS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
