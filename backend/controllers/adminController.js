const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const Certificate = require("../models/Certificate");
const XLSX = require("xlsx");
// ==================================================
// HELPER
// ==================================================

const getLocalFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  // Already complete URL
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `http://localhost:${process.env.PORT || 5000}${filePath}`;
};

// ==================================================
// GET ADMIN PROFILE
// ==================================================

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    const admin = await User.findById(userId).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      userId: admin._id,

      name: admin.name || "",

      email: admin.email || "",

      role: admin.role || "admin",

      profilePhoto: getLocalFileUrl(admin.profilePhoto),
    });
  } catch (error) {
    console.error("GET ADMIN PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// UPDATE ADMIN PROFILE
// ==================================================

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // CHECK EMAIL ALREADY EXISTS

    const existingUser = await User.findOne({
      email,
      _id: {
        $ne: userId,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already used by another user",
      });
    }

    // UPDATE ADMIN

    const admin = await User.findOneAndUpdate(
      {
        _id: userId,
        role: "admin",
      },

      {
        name,
        email,
      },

      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",

      admin: {
        userId: admin._id,

        name: admin.name || "",

        email: admin.email || "",

        role: admin.role,

        profilePhoto: getLocalFileUrl(admin.profilePhoto),
      },
    });
  } catch (error) {
    console.error("UPDATE ADMIN PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET ALL DEPARTMENTS
// ==================================================

exports.getDepartments = async (req, res) => {
  try {
    const departments = await StudentProfile.distinct("department", {
      department: {
        $ne: "",
      },
    });

    res.status(200).json(departments);
  } catch (error) {
    console.error("GET DEPARTMENTS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET YEARS BY DEPARTMENT
// ==================================================

exports.getYears = async (req, res) => {
  try {
    const { department } = req.params;

    const years = await StudentProfile.distinct("currentYear", {
      department,

      currentYear: {
        $ne: "",
      },
    });

    res.status(200).json(years);
  } catch (error) {
    console.error("GET YEARS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET SECTIONS
// DEPARTMENT + YEAR
// ==================================================

exports.getSections = async (req, res) => {
  try {
    const { department, year } = req.params;

    const sections = await StudentProfile.distinct("section", {
      department,

      currentYear: year,

      section: {
        $ne: "",
      },
    });

    res.status(200).json(sections);
  } catch (error) {
    console.error("GET SECTIONS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET STUDENTS BY CLASS
// ==================================================

exports.getStudentsByClass = async (req, res) => {
  try {
    const { department, year, section } = req.params;

    // ==========================================
    // GET STUDENT PROFILES
    // ==========================================

    const studentProfiles = await StudentProfile.find({
      department,
      currentYear: year,
      section,
    })
      .populate({
        path: "userId",
        select: "name registerNumber email profilePhoto",
      })
      .lean();

    // ==========================================
    // GET MENTORS FROM SAME DEPARTMENT
    // SAME LOGIC AS HOD
    // ==========================================

    const mentorUsers = await User.find({
      role: "mentor",
      department,
    }).select("-password");

    const mentorUserIds = mentorUsers.map((mentorUser) => mentorUser._id);

    // ==========================================
    // FIND MATCHING MENTOR PROFILE
    // YEAR + SECTION
    // ==========================================

    const mentorProfiles = await MentorProfile.find({
      userId: {
        $in: mentorUserIds,
      },

      year: Number(year),

      section,
    }).lean();

    let classMentor = null;

    if (mentorProfiles.length > 0) {
      const matchingProfile = mentorProfiles[0];

      const matchingMentorUser = mentorUsers.find(
        (mentorUser) =>
          mentorUser._id.toString() === matchingProfile.userId.toString(),
      );

      if (matchingMentorUser) {
        classMentor = {
          id: matchingMentorUser._id,

          name: matchingMentorUser.name || matchingProfile.name || "",

          email: matchingMentorUser.email || matchingProfile.email || "",

          department:
            matchingMentorUser.department || matchingProfile.department || "",

          year: matchingProfile.year ?? "",

          section: matchingProfile.section || "",
        };
      }
    }

    // ==========================================
    // FORMAT STUDENTS
    // ==========================================

    const students = studentProfiles.map((profile) => {
      const user = profile.userId || {};

      return {
        id: user._id,

        _id: user._id,

        name: user.name || profile.name || "",

        email: user.email || profile.email || "",

        registerNumber: user.registerNumber || profile.registerNumber || "",

        rollNumber: profile.rollNumber || "",

        department: user.department || profile.department || "",

        year: profile.currentYear || "",

        section: profile.section || "",

        profilePhoto: getLocalFileUrl(profile.profilePhoto),

        mentor: classMentor,
      };
    });

    // ==========================================
    // SORT BY ROLL NUMBER
    // ==========================================

    students.sort((a, b) =>
      String(a.rollNumber || "").localeCompare(
        String(b.rollNumber || ""),

        undefined,

        {
          numeric: true,
          sensitivity: "base",
        },
      ),
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("GET ADMIN STUDENTS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET SINGLE STUDENT DETAILS
// ADMIN
//
// SAME LOGIC AS HOD
//
// Student Mentor Mapping:
// Department + Year + Section
// ==================================================

exports.getStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;

    // ==========================================
    // GET STUDENT USER
    // ==========================================

    const studentUser = await User.findOne({
      _id: studentId,

      role: "student",
    }).select("-password");

    if (!studentUser) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // ==========================================
    // GET STUDENT PROFILE
    // ==========================================

    const studentProfile = await StudentProfile.findOne({
      userId: studentUser._id,
    });

    if (!studentProfile) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // ==========================================
    // GET CONCERNED MENTOR
    //
    // SAME AS HOD
    // ==========================================

    let mentor = null;

    const studentDepartment =
      studentUser.department || studentProfile.department || "";

    const studentYear = studentProfile.currentYear || "";

    const studentSection = studentProfile.section || "";

    console.log("=================================");

    console.log("ADMIN STUDENT-MENTOR MAPPING");

    console.log("Student:", studentUser.name);

    console.log("Department:", studentDepartment);

    console.log("Year:", studentYear);

    console.log("Section:", studentSection);

    console.log("=================================");

    // ==========================================
    // FIND MENTOR
    // ONLY IF ALL DETAILS EXIST
    // ==========================================

    if (studentDepartment && studentYear && studentSection) {
      // ========================================
      // GET MENTORS FROM SAME DEPARTMENT
      // ========================================

      const mentorUsers = await User.find({
        role: "mentor",

        department: studentDepartment,
      }).select("-password");

      const mentorUserIds = mentorUsers.map((mentorUser) => mentorUser._id);

      // ========================================
      // GET MENTOR PROFILE
      // MATCH YEAR + SECTION
      // ========================================

      const mentorProfiles = await MentorProfile.find({
        userId: {
          $in: mentorUserIds,
        },

        year: Number(studentYear),

        section: studentSection,
      });

      // ========================================
      // FIND MATCHING MENTOR
      // ========================================

      if (mentorProfiles.length > 0) {
        const matchingProfile = mentorProfiles[0];

        const matchingMentorUser = mentorUsers.find(
          (mentorUser) =>
            mentorUser._id.toString() === matchingProfile.userId.toString(),
        );

        if (matchingMentorUser) {
          mentor = {
            id: matchingMentorUser._id,

            name: matchingMentorUser.name || matchingProfile.name || "",

            email: matchingMentorUser.email || matchingProfile.email || "",

            department:
              matchingMentorUser.department || matchingProfile.department || "",

            year: matchingProfile.year ?? "",

            section: matchingProfile.section || "",

            phone: matchingProfile.phone || "",

            address: matchingProfile.address || "",

            profilePhoto: getLocalFileUrl(matchingProfile.profilePhoto),
          };

          console.log("ADMIN MENTOR FOUND:", mentor.name);
        }
      }
    }

    // ==========================================
    // GET APPROVED CERTIFICATES ONLY
    // ==========================================

    const certificates = await Certificate.find({
      userId: studentUser._id,

      status: "Approved",
    }).sort({
      createdAt: -1,
    });

    // ==========================================
    // COMPLETE STUDENT PROFILE
    // SAME FORMAT AS HOD
    // ==========================================

    const student = {
      id: studentUser._id,

      // ==========================================
      // REGISTRATION DETAILS
      // ==========================================

      name: studentUser.name || studentProfile.name || "",

      email: studentUser.email || studentProfile.email || "",

      registerNumber:
        studentUser.registerNumber || studentProfile.registerNumber || "",

      rollNumber: studentProfile.rollNumber || "",

      department: studentUser.department || studentProfile.department || "",

      year: studentProfile.currentYear || "",

      section: studentProfile.section || "",

      // ==========================================
      // PERSONAL DETAILS
      // ==========================================

      dob: studentProfile.dob || "",

      gender: studentProfile.gender || "",

      batch: studentProfile.batch || "",

      religion: studentProfile.religion || "",

      caste: studentProfile.caste || "",

      community: studentProfile.community || "",

      aadharNumber: studentProfile.aadharNumber || "",

      // ==========================================
      // CONTACT DETAILS
      // ==========================================

      studentPhone: studentProfile.studentPhone || "",

      address: studentProfile.address || "",

      pincode: studentProfile.pincode || "",

      district: studentProfile.district || "",

      state: studentProfile.state || "",

      languagesKnown: studentProfile.languagesKnown || "",

      hostelerDayScholar: studentProfile.hostelerDayScholar || "",

      parentsNumber: studentProfile.parentsNumber || "",

      // ==========================================
      // ACADEMIC DETAILS
      // ==========================================

      mediumOfStudy: studentProfile.mediumOfStudy || "",

      // ------------------------------------------
      // 10TH
      // ------------------------------------------

      tenthSchoolName: studentProfile.tenthSchoolName || "",

      tenthPercentage: studentProfile.tenthPercentage || "",

      tenthBoard: studentProfile.tenthBoard || "",

      tenthCompletionYear: studentProfile.tenthCompletionYear || "",

      // ------------------------------------------
      // 12TH
      // ------------------------------------------

      twelthSchoolName: studentProfile.twelthSchoolName || "",

      twelthPercentage: studentProfile.twelthPercentage || "",

      twelthBoard: studentProfile.twelthBoard || "",

      twelthCompletionYear: studentProfile.twelthCompletionYear || "",

      // ------------------------------------------
      // DIPLOMA
      // ------------------------------------------

      diplomaPercentage: studentProfile.diplomaPercentage || "",

      diplomaCollege: studentProfile.diplomaCollege || "",

      diplomaDegreePercentage: studentProfile.diplomaDegreePercentage || "",

      diplomaCompletionYear: studentProfile.diplomaCompletionYear || "",

      // ==========================================
      // ARREARS
      // ==========================================

      currentArrears: studentProfile.currentArrears || "",

      historyOfArrears: studentProfile.historyOfArrears || "",

      historyOfArrearsCount: studentProfile.historyOfArrearsCount || "",

      // ==========================================
      // CGPA
      // ==========================================

      cgpa: studentProfile.cgpa || "",

      // ==========================================
      // PROFESSIONAL DETAILS
      // ==========================================

      resumeLink: studentProfile.resumeLink || "",

      linkedinLink: studentProfile.linkedinLink || "",

      githubLink: studentProfile.githubLink || "",

      portfolioLink: studentProfile.portfolioLink || "",

      hackerrankLink: studentProfile.hackerrankLink || "",

      leetcodeLink: studentProfile.leetcodeLink || "",

      // ==========================================
      // SKILLS
      // ==========================================

      skills: studentProfile.skills || [],

      // ==========================================
      // INTERNSHIP
      // ==========================================

      internship: studentProfile.internship || [],

      // ==========================================
      // PLACEMENT
      // ==========================================

      placementStatus: studentProfile.placementStatus || "Not Placed",

      // ==========================================
      // PARENT / GUARDIAN
      // ==========================================

      fatherName: studentProfile.fatherName || "",

      motherName: studentProfile.motherName || "",

      fatherOccupation: studentProfile.fatherOccupation || "",

      fatherPhone: studentProfile.fatherPhone || "",

      motherPhone: studentProfile.motherPhone || "",

      // ==========================================
      // PROFILE PHOTO
      // ==========================================

      profilePhoto: getLocalFileUrl(studentProfile.profilePhoto),
    };

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      student,

      mentor,

      certificates,

      certificateCount: certificates.length,
    });
  } catch (error) {
    console.error("GET ADMIN STUDENT DETAILS ERROR:", error);

    res.status(500).json({
      message: "Server error",

      error: error.message,
    });
  }
};

// ==================================================
// SEARCH STUDENTS
// ADMIN
// ==================================================

// ==================================================
// SEARCH STUDENTS
// ADMIN
// ==================================================

// ==================================================
// SEARCH STUDENTS
// ADMIN
// ==================================================

exports.searchStudents = async (req, res) => {
  try {
    const {
      department,
      year,
      minCgpa,
      minTenthPercentage,
      minTwelthPercentage,
      skills,
      skillMatch,
      historyOfArrears,
      historyOfArrearsCount,
      currentArrears,
    } = req.query;

    // ==========================================
    // GET ALL STUDENT PROFILES
    // ==========================================
    const studentUsers = await User.find({
      role: "student",
    }).select("_id");

    const studentUserIds = studentUsers.map((user) => user._id);

    let studentProfiles = await StudentProfile.find({
      userId: { $in: studentUserIds },
    })
      .populate({
        path: "userId",
        select: "name email registerNumber department",
      })
      .lean();

    // ==========================================
    // REMOVE INVALID USERS
    // ==========================================

    studentProfiles = studentProfiles.filter((profile) => profile.userId);

    // ==========================================
    // DEPARTMENT FILTER
    // ==========================================

    if (department && department.trim()) {
      studentProfiles = studentProfiles.filter(
        (profile) =>
          String(profile.department || "")
            .trim()
            .toLowerCase() === department.trim().toLowerCase(),
      );
    }

    // ==========================================
    // YEAR FILTER
    // ==========================================

    if (year && String(year).trim()) {
      studentProfiles = studentProfiles.filter(
        (profile) =>
          String(profile.currentYear || "").trim() === String(year).trim(),
      );
    }

    // ==========================================
    // MINIMUM CGPA FILTER
    // ==========================================

    if (minCgpa !== undefined && minCgpa !== "") {
      const minimumCgpa = Number(minCgpa);

      studentProfiles = studentProfiles.filter((profile) => {
        const studentCgpa = Number(profile.cgpa);

        return !isNaN(studentCgpa) && studentCgpa >= minimumCgpa;
      });
    }

    // ==========================================
    // MINIMUM 10TH PERCENTAGE
    // ==========================================

    if (minTenthPercentage !== undefined && minTenthPercentage !== "") {
      const minimumTenthPercentage = Number(minTenthPercentage);

      studentProfiles = studentProfiles.filter((profile) => {
        const tenthPercentage = Number(profile.tenthPercentage);

        return (
          !isNaN(tenthPercentage) && tenthPercentage >= minimumTenthPercentage
        );
      });
    }

    // ==========================================
    // MINIMUM 12TH PERCENTAGE
    // ==========================================

    if (minTwelthPercentage !== undefined && minTwelthPercentage !== "") {
      const minimumTwelthPercentage = Number(minTwelthPercentage);

      studentProfiles = studentProfiles.filter((profile) => {
        const twelthPercentage = Number(profile.twelthPercentage);

        return (
          !isNaN(twelthPercentage) &&
          twelthPercentage >= minimumTwelthPercentage
        );
      });
    }

    // ==========================================
// SKILLS FILTER
// ==========================================
//
// skillMatch = "together"
// → Student must have ALL selected skills.
//
// skillMatch = "individually"
// → Student must have ANY ONE selected skill.
//
// Example:
// Java, Python, SQL
//
// Together:
// Java AND Python AND SQL
//
// Individually:
// Java OR Python OR SQL
// ==========================================

if (skills && skills.trim()) {
  const searchSkills = skills
    .split(",")
    .map((skill) => String(skill).trim().toLowerCase())
    .filter(Boolean);

  const normalizedSkillMatch =
    String(skillMatch || "together").trim().toLowerCase();

  studentProfiles = studentProfiles.filter((profile) => {
    const studentSkills = (profile.skills || [])
      .map((skill) => String(skill).trim().toLowerCase())
      .filter(Boolean);

    // INDIVIDUALLY = ANY ONE skill
    if (normalizedSkillMatch === "individually") {
      return searchSkills.some((searchSkill) =>
        studentSkills.includes(searchSkill),
      );
    }

    // TOGETHER = ALL skills
    return searchSkills.every((searchSkill) =>
      studentSkills.includes(searchSkill),
    );
  });
}

    // ==========================================
    // HISTORY OF ARREARS
    // ==========================================
    //
    // No:
    // Only students with NO history
    //
    // Yes:
    // Students with history = Yes
    //
    // Yes + count:
    // Include:
    //   1. Students with NO history
    //   2. Students with YES and count <= entered count
    //
    // Example:
    // Yes + 1
    //
    // Included:
    // No
    // Yes + 1
    //
    // Not included:
    // Yes + 2
    // Yes + 3
    // ==========================================

    if (historyOfArrears && historyOfArrears.trim()) {
      const normalizedHistory = historyOfArrears.trim().toLowerCase();

      // ------------------------------------------
      // HISTORY = NO
      // ------------------------------------------

      if (normalizedHistory === "no") {
        studentProfiles = studentProfiles.filter(
          (profile) =>
            String(profile.historyOfArrears || "")
              .trim()
              .toLowerCase() === "no",
        );
      }

      // ------------------------------------------
      // HISTORY = YES
      // ------------------------------------------
      else if (normalizedHistory === "yes") {
        // If count is NOT entered,
        // show students with history = Yes

        if (
          historyOfArrearsCount === undefined ||
          historyOfArrearsCount === ""
        ) {
          studentProfiles = studentProfiles.filter(
            (profile) =>
              String(profile.historyOfArrears || "")
                .trim()
                .toLowerCase() === "yes",
          );
        }

        // If count IS entered,
        // include No history + Yes within count
        else {
          const maxHistoryArrears = Number(historyOfArrearsCount);

          studentProfiles = studentProfiles.filter((profile) => {
            const history = String(profile.historyOfArrears || "")
              .trim()
              .toLowerCase();

            // Students with NO history
            if (history === "no") {
              return true;
            }

            // Students with YES history
            if (history === "yes") {
              const studentCount = Number(profile.historyOfArrearsCount);

              return !isNaN(studentCount) && studentCount <= maxHistoryArrears;
            }

            return false;
          });
        }
      }
    }

    // ==========================================
    // CURRENT ARREARS
    //
    // Student arrears <= entered number
    // ==========================================

    if (currentArrears !== undefined && currentArrears !== "") {
      const maxCurrentArrears = Number(currentArrears);

      studentProfiles = studentProfiles.filter((profile) => {
        const studentArrears = Number(profile.currentArrears);

        return !isNaN(studentArrears) && studentArrears <= maxCurrentArrears;
      });
    }

    // ==========================================
    // FORMAT RESULTS
    // ==========================================

    const students = studentProfiles.map((profile) => {
      const user = profile.userId || {};

      return {
        id: user._id,

        _id: user._id,

        name: profile.name || user.name || "",

        email: profile.email || user.email || "",

        registerNumber: profile.registerNumber || user.registerNumber || "",

        department: profile.department || user.department || "",

        year: profile.currentYear || "",

        section: profile.section || "",

        // ======================================
        // ACADEMIC
        // ======================================

        cgpa: profile.cgpa || "",

        tenthSchoolName: profile.tenthSchoolName || "",

        tenthPercentage: profile.tenthPercentage || "",

        tenthCompletionYear: profile.tenthCompletionYear || "",

        twelthSchoolName: profile.twelthSchoolName || "",

        twelthPercentage: profile.twelthPercentage || "",

        twelthCompletionYear: profile.twelthCompletionYear || "",

        diplomaPercentage: profile.diplomaPercentage || "",

        diplomaCompletionYear: profile.diplomaCompletionYear || "",

        // ======================================
        // SKILLS
        // ======================================

        skills: profile.skills || [],

        // ======================================
        // ARREARS
        // ======================================

        historyOfArrears: profile.historyOfArrears || "",

        historyOfArrearsCount: profile.historyOfArrearsCount || "",

        currentArrears: profile.currentArrears || "",
      };
    });

    // ==========================================
    // SORT BY NAME
    // ==========================================

    students.sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || ""), undefined, {
        sensitivity: "base",
      }),
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("SEARCH STUDENTS ERROR:", error);

    return res.status(500).json({
      message: "Unable to search students",
      error: error.message,
    });
  }
};

// ==================================================
// EXPORT SEARCHED STUDENTS TO EXCEL
// ADMIN
// ==================================================

exports.exportSearchStudentsExcel = async (req, res) => {
  try {
    const {
      department,
      year,
      minCgpa,
      minTenthPercentage,
      minTwelthPercentage,
      skills,
       skillMatch,
      historyOfArrears,
      historyOfArrearsCount,
      currentArrears,
    } = req.query;

    // ==========================================
    // GET ALL STUDENT PROFILES
    // ==========================================

    const studentUsers = await User.find({
      role: "student",
    }).select("_id");

    const studentUserIds = studentUsers.map((user) => user._id);

    let studentProfiles = await StudentProfile.find({
      userId: { $in: studentUserIds },
    })
      .populate({
        path: "userId",
        select: "name email registerNumber department",
      })
      .lean();
    // ==========================================
    // REMOVE INVALID USERS
    // ==========================================

    studentProfiles = studentProfiles.filter((profile) => profile.userId);

    // ==========================================
    // DEPARTMENT FILTER
    // ==========================================

    if (department && department.trim()) {
      studentProfiles = studentProfiles.filter(
        (profile) =>
          String(profile.department || "")
            .trim()
            .toLowerCase() === department.trim().toLowerCase(),
      );
    }

    // ==========================================
    // YEAR FILTER
    // ==========================================

    if (year && String(year).trim()) {
      studentProfiles = studentProfiles.filter(
        (profile) =>
          String(profile.currentYear || "").trim() === String(year).trim(),
      );
    }

    // ==========================================
    // MINIMUM CGPA FILTER
    // ==========================================

    if (minCgpa !== undefined && minCgpa !== "") {
      const minimumCgpa = Number(minCgpa);

      studentProfiles = studentProfiles.filter((profile) => {
        const studentCgpa = Number(profile.cgpa);

        return !isNaN(studentCgpa) && studentCgpa >= minimumCgpa;
      });
    }

    // ==========================================
    // MINIMUM 10TH PERCENTAGE
    // ==========================================

    if (minTenthPercentage !== undefined && minTenthPercentage !== "") {
      const minimumTenthPercentage = Number(minTenthPercentage);

      studentProfiles = studentProfiles.filter((profile) => {
        const tenthPercentage = Number(profile.tenthPercentage);

        return (
          !isNaN(tenthPercentage) && tenthPercentage >= minimumTenthPercentage
        );
      });
    }

    // ==========================================
    // MINIMUM 12TH PERCENTAGE
    // ==========================================

    if (minTwelthPercentage !== undefined && minTwelthPercentage !== "") {
      const minimumTwelthPercentage = Number(minTwelthPercentage);

      studentProfiles = studentProfiles.filter((profile) => {
        const twelthPercentage = Number(profile.twelthPercentage);

        return (
          !isNaN(twelthPercentage) &&
          twelthPercentage >= minimumTwelthPercentage
        );
      });
    }

    // ==========================================
// SKILLS FILTER
// SAME LOGIC AS SEARCH
// ==========================================
//
// Together:
// ALL selected skills required.
//
// Individually:
// ANY ONE selected skill is enough.
// ==========================================

if (skills && skills.trim()) {
  const searchSkills = skills
    .split(",")
    .map((skill) => String(skill).trim().toLowerCase())
    .filter(Boolean);

  const normalizedSkillMatch =
    String(skillMatch || "together").trim().toLowerCase();

  studentProfiles = studentProfiles.filter((profile) => {
    const studentSkills = (profile.skills || [])
      .map((skill) => String(skill).trim().toLowerCase())
      .filter(Boolean);

    // INDIVIDUALLY = ANY ONE
    if (normalizedSkillMatch === "individually") {
      return searchSkills.some((searchSkill) =>
        studentSkills.includes(searchSkill),
      );
    }

    // TOGETHER = ALL
    return searchSkills.every((searchSkill) =>
      studentSkills.includes(searchSkill),
    );
  });
}
    // ==========================================
    // HISTORY OF ARREARS
    // ==========================================

    if (historyOfArrears && historyOfArrears.trim()) {
      const normalizedHistory = historyOfArrears.trim().toLowerCase();

      // HISTORY = NO
      if (normalizedHistory === "no") {
        studentProfiles = studentProfiles.filter(
          (profile) =>
            String(profile.historyOfArrears || "")
              .trim()
              .toLowerCase() === "no",
        );
      }

      // HISTORY = YES
      else if (normalizedHistory === "yes") {
        // YES WITHOUT COUNT
        if (
          historyOfArrearsCount === undefined ||
          historyOfArrearsCount === ""
        ) {
          studentProfiles = studentProfiles.filter(
            (profile) =>
              String(profile.historyOfArrears || "")
                .trim()
                .toLowerCase() === "yes",
          );
        }

        // YES WITH COUNT
        else {
          const maxHistoryArrears = Number(historyOfArrearsCount);

          studentProfiles = studentProfiles.filter((profile) => {
            const history = String(profile.historyOfArrears || "")
              .trim()
              .toLowerCase();

            // No history
            if (history === "no") {
              return true;
            }

            // Yes history within count
            if (history === "yes") {
              const studentCount = Number(profile.historyOfArrearsCount);

              return !isNaN(studentCount) && studentCount <= maxHistoryArrears;
            }

            return false;
          });
        }
      }
    }

    // ==========================================
    // CURRENT ARREARS
    // ==========================================

    if (currentArrears !== undefined && currentArrears !== "") {
      const maxCurrentArrears = Number(currentArrears);

      studentProfiles = studentProfiles.filter((profile) => {
        const studentArrears = Number(profile.currentArrears);

        return !isNaN(studentArrears) && studentArrears <= maxCurrentArrears;
      });
    }

    // ==========================================
    // SORT BY NAME
    // SAME AS SEARCH
    // ==========================================

    studentProfiles.sort((a, b) =>
      String(a.name || a.userId?.name || "").localeCompare(
        String(b.name || b.userId?.name || ""),
        undefined,
        {
          sensitivity: "base",
        },
      ),
    );

    // ==========================================
    // EXACT 39 EXCEL COLUMNS
    // ==========================================

    const headers = [
      "S.NO",
      "DEPARTMENT",
      "REGISTRATION NUMBER",
      "ROLL NUMBER",
      "NAME WITH INITIAL AT END",
      "GENDER (M/F)",
      "DOB",
      "AADHAR NUMBER",
      "RELIGION",
      "COMMUNITY",
      "FATHER NAME",
      "MOTHER NAME",
      "FATHER OCCUPATION",
      "PERMANENT ADDRESS",
      "PINCODE",
      "DISTRICT",
      "STATE",
      "LANGUAGES KNOWN",
      "HOSTELER / DAYSCHOLAR",
      "PARENTS NUMBER",
      "PERSONAL NUMBER",
      "EMAIL-ID",
      "MEDIUM OF STUDY",
      "10TH PERCENTAGE",
      "10TH BOARD",
      "10TH SCHOOL NAME",
      "10TH YEAR OF PASSING",
      "12TH PERCENTAGE",
      "12TH BOARD",
      "12TH SCHOOL NAME",
      "12TH YEAR OF PASSING",
      "DIPLOMA PERCENTAGE",
      "DIPLOMA SCHOOL / COLLEGE / UNIVERSITY",
      "DIPLOMA YEAR OF PASSING",
      "DIPLOMA DEGREE PERCENTAGE",
      "CGPA",
      "HISTORY OF ARREARS",
      "CURRENT ARREARS",
      "PLACEMENT STATUS",
      "Resume LINK",
    ];

    // ==========================================
    // CREATE EXCEL ROWS
    // ==========================================

    const rows = studentProfiles.map((profile, index) => {
      const user = profile.userId || {};

      let gender = profile.gender || user.gender || "";

      // Convert Male/Female to M/F
      if (String(gender).trim().toLowerCase() === "male") {
        gender = "M";
      } else if (String(gender).trim().toLowerCase() === "female") {
        gender = "F";
      }

      return [
        index + 1,

        profile.department || user.department || "",

        profile.registerNumber || user.registerNumber || "",

        profile.rollNumber || "",

        profile.name || user.name || "",

        gender,

        profile.dob || "",

        profile.aadharNumber || "",

        profile.religion || "",

        profile.community || "",

        profile.fatherName || "",

        profile.motherName || "",

        profile.fatherOccupation || "",

        // Keep existing DB field `address`
        profile.address || "",

        profile.pincode || "",

        profile.district || "",

        profile.state || "",

        profile.languagesKnown || "",

        profile.hostelerDayScholar || "",

        profile.parentsNumber || "",

        profile.studentPhone || "",

        profile.email || user.email || "",

        profile.mediumOfStudy || "",

        profile.tenthPercentage || "",

        profile.tenthBoard || "",

        profile.tenthSchoolName || "",

        profile.tenthCompletionYear || "",

        profile.twelthPercentage || "",

        profile.twelthBoard || "",

        profile.twelthSchoolName || "",

        profile.twelthCompletionYear || "",

        profile.diplomaPercentage || "",

        profile.diplomaCollege || "",

        profile.diplomaCompletionYear || "",

        profile.diplomaDegreePercentage || "",

        profile.cgpa || "",

        profile.historyOfArrears || "",

        profile.currentArrears || "",

        profile.placementStatus || "",

        profile.resumeLink || "",
      ];
    });

    // ==========================================
    // CREATE WORKSHEET
    // ==========================================

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // ==========================================
    // COLUMN WIDTHS
    // ==========================================

    worksheet["!cols"] = [
      { wch: 7 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 28 },
      { wch: 12 },
      { wch: 14 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 22 },
      { wch: 35 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 35 },
      { wch: 20 },
      { wch: 25 },
      { wch: 12 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
      { wch: 50 },
    ];

    // ==========================================
    // CREATE WORKBOOK
    // ==========================================

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // ==========================================
    // GENERATE XLSX BUFFER
    // ==========================================

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // ==========================================
    // DOWNLOAD RESPONSE
    // ==========================================

    const date = new Date().toISOString().slice(0, 10);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="student-search-results-${date}.xlsx"`,
    );

    return res.status(200).send(excelBuffer);
  } catch (error) {
    console.error("EXPORT SEARCH STUDENTS EXCEL ERROR:", error);

    return res.status(500).json({
      message: "Unable to export students to Excel",
      error: error.message,
    });
  }
};

// ==================================================
// DELETION PANEL
// GET STUDENTS FOR DELETION
// ==================================================

exports.getDeletionStudents = async (req, res) => {
  try {
    const { department, year, section } = req.query;

    // ==========================================
    // GET ONLY REAL STUDENT USERS
    // ==========================================

    const studentUsers = await User.find({
      role: "student",
    }).select("_id");

    const studentUserIds = studentUsers.map((user) => user._id);

    // ==========================================
    // BUILD FILTER
    // ==========================================

    const filter = {
      userId: {
        $in: studentUserIds,
      },
    };

    if (department && department.trim()) {
      filter.department = department.trim();
    }

    if (year && String(year).trim()) {
      filter.currentYear = String(year).trim();
    }

    if (section && section.trim() && section.trim().toUpperCase() !== "ALL") {
      filter.section = section.trim();
    }

    // ==========================================
    // GET STUDENTS
    // ==========================================

    const studentProfiles = await StudentProfile.find(filter)
      .populate({
        path: "userId",
        select: "name email registerNumber department",
      })
      .lean();

    // ==========================================
    // REMOVE INVALID USERS
    // ==========================================

    const validProfiles = studentProfiles.filter((profile) => profile.userId);

    // ==========================================
    // FORMAT RESULTS
    // ==========================================

    const students = validProfiles.map((profile) => {
      const user = profile.userId || {};

      return {
        id: user._id,
        _id: user._id,

        name: user.name || profile.name || "",

        email: user.email || profile.email || "",

        registerNumber: user.registerNumber || profile.registerNumber || "",

        department: user.department || profile.department || "",

        year: profile.currentYear || "",

        section: profile.section || "",

        rollNumber: profile.rollNumber || "",

        cgpa: profile.cgpa || "",
      };
    });

    // ==========================================
    // SORT BY ROLL NUMBER
    // ==========================================

    students.sort((a, b) =>
      String(a.rollNumber || "").localeCompare(
        String(b.rollNumber || ""),
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        },
      ),
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("GET DELETION STUDENTS ERROR:", error);

    return res.status(500).json({
      message: "Unable to get students for deletion",
      error: error.message,
    });
  }
};
// ==================================================
// DELETE SELECTED STUDENTS
// ADMIN
// ==================================================

exports.deleteStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        message: "No students selected for deletion",
      });
    }

    // Remove duplicate IDs
    const uniqueStudentIds = [
      ...new Set(studentIds.map((id) => String(id).trim())),
    ];

    // ==========================================
    // VERIFY THAT ALL IDS BELONG TO STUDENTS
    // ==========================================

    const studentUsers = await User.find({
      _id: { $in: uniqueStudentIds },
      role: "student",
    }).select("_id");

    const validStudentIds = studentUsers.map((user) => user._id.toString());

    // ==========================================
    // CHECK IF ANY INVALID ID WAS PROVIDED
    // ==========================================

    if (validStudentIds.length !== uniqueStudentIds.length) {
      return res.status(400).json({
        message:
          "One or more selected users are invalid or are not student accounts",
      });
    }

    // ==========================================
    // DELETE CERTIFICATES
    // ==========================================

    const certificateDeleteResult = await Certificate.deleteMany({
      userId: { $in: validStudentIds },
    });

    // ==========================================
    // DELETE STUDENT PROFILES
    // ==========================================

    const profileDeleteResult = await StudentProfile.deleteMany({
      userId: { $in: validStudentIds },
    });

    // ==========================================
    // DELETE USER ACCOUNTS
    // ==========================================

    const userDeleteResult = await User.deleteMany({
      _id: { $in: validStudentIds },
      role: "student",
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message: "Students deleted successfully",

      deletedStudents: userDeleteResult.deletedCount,

      deletedProfiles: profileDeleteResult.deletedCount,

      deletedCertificates: certificateDeleteResult.deletedCount,
    });
  } catch (error) {
    console.error("DELETE STUDENTS ERROR:", error);

    return res.status(500).json({
      message: "Unable to delete students",
      error: error.message,
    });
  }
};

// ==================================================
// DELETION PANEL - EXPORT SELECTED STUDENTS TO EXCEL
// ==================================================

exports.exportDeletionStudentsExcel = async (req, res) => {
  try {
    const { studentIds } = req.body;

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        message: "No students selected for export",
      });
    }

    // Remove duplicate IDs
    const uniqueStudentIds = [
      ...new Set(studentIds.map((id) => String(id).trim())),
    ];

    // ==========================================
    // GET ONLY REAL STUDENT USERS
    // ==========================================

    const studentUsers = await User.find({
      _id: { $in: uniqueStudentIds },
      role: "student",
    })
      .select("_id name email registerNumber department")
      .lean();

    // ==========================================
    // CHECK VALID STUDENTS
    // ==========================================

    if (studentUsers.length !== uniqueStudentIds.length) {
      return res.status(400).json({
        message:
          "One or more selected users are invalid or are not student accounts",
      });
    }

    const validStudentIds = studentUsers.map((user) => user._id);

    // ==========================================
    // GET STUDENT PROFILES
    // ==========================================

    const studentProfiles = await StudentProfile.find({
      userId: { $in: validStudentIds },
    })
      .populate({
        path: "userId",
        select: "name email registerNumber department",
      })
      .lean();

    // ==========================================
    // REMOVE STUDENTS WITHOUT PROFILE
    // ==========================================

    const validProfiles = studentProfiles.filter((profile) => profile.userId);

    if (validProfiles.length !== uniqueStudentIds.length) {
      return res.status(400).json({
        message: "One or more selected students do not have a profile",
      });
    }

    // ==========================================
    // SORT BY ROLL NUMBER
    // ==========================================

    validProfiles.sort((a, b) =>
      String(a.rollNumber || "").localeCompare(
        String(b.rollNumber || ""),
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        },
      ),
    );

    // ==========================================
    // EXACT 40 EXCEL COLUMNS
    // ==========================================

    const headers = [
      "S.NO",
      "DEPARTMENT",
      "REGISTRATION NUMBER",
      "ROLL NUMBER",
      "NAME WITH INITIAL AT END",
      "GENDER (M/F)",
      "DOB",
      "AADHAR NUMBER",
      "RELIGION",
      "COMMUNITY",
      "FATHER NAME",
      "MOTHER NAME",
      "FATHER OCCUPATION",
      "PERMANENT ADDRESS",
      "PINCODE",
      "DISTRICT",
      "STATE",
      "LANGUAGES KNOWN",
      "HOSTELER / DAYSCHOLAR",
      "PARENTS NUMBER",
      "PERSONAL NUMBER",
      "EMAIL-ID",
      "MEDIUM OF STUDY",
      "10TH PERCENTAGE",
      "10TH BOARD",
      "10TH SCHOOL NAME",
      "10TH YEAR OF PASSING",
      "12TH PERCENTAGE",
      "12TH BOARD",
      "12TH SCHOOL NAME",
      "12TH YEAR OF PASSING",
      "DIPLOMA PERCENTAGE",
      "DIPLOMA SCHOOL / COLLEGE / UNIVERSITY",
      "DIPLOMA YEAR OF PASSING",
      "DIPLOMA DEGREE PERCENTAGE",
      "CGPA",
      "HISTORY OF ARREARS",
      "CURRENT ARREARS",
      "PLACEMENT STATUS",
      "RESUME LINK",
    ];

    // ==========================================
    // CREATE EXCEL ROWS
    // ==========================================

    const rows = validProfiles.map((profile, index) => {
      const user = profile.userId || {};

      let gender = profile.gender || "";

      // Convert Male/Female to M/F
      if (String(gender).trim().toLowerCase() === "male") {
        gender = "M";
      } else if (String(gender).trim().toLowerCase() === "female") {
        gender = "F";
      }

      return [
        index + 1,

        profile.department || user.department || "",

        profile.registerNumber || user.registerNumber || "",

        profile.rollNumber || "",

        profile.name || user.name || "",

        gender,

        profile.dob || "",

        profile.aadharNumber || "",

        profile.religion || "",

        profile.community || "",

        profile.fatherName || "",

        profile.motherName || "",

        profile.fatherOccupation || "",

        // Keep existing DB field `address`
        profile.address || "",

        profile.pincode || "",

        profile.district || "",

        profile.state || "",

        profile.languagesKnown || "",

        profile.hostelerDayScholar || "",

        profile.parentsNumber || "",

        profile.studentPhone || "",

        profile.email || user.email || "",

        profile.mediumOfStudy || "",

        profile.tenthPercentage || "",

        profile.tenthBoard || "",

        profile.tenthSchoolName || "",

        profile.tenthCompletionYear || "",

        profile.twelthPercentage || "",

        profile.twelthBoard || "",

        profile.twelthSchoolName || "",

        profile.twelthCompletionYear || "",

        profile.diplomaPercentage || "",

        profile.diplomaCollege || "",

        profile.diplomaCompletionYear || "",

        profile.diplomaDegreePercentage || "",

        profile.cgpa || "",

        profile.historyOfArrears || "",

        profile.currentArrears || "",

        profile.placementStatus || "",

        profile.resumeLink || "",
      ];
    });

    // ==========================================
    // CREATE WORKSHEET
    // ==========================================

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // ==========================================
    // COLUMN WIDTHS
    // ==========================================

    worksheet["!cols"] = [
      { wch: 7 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 28 },
      { wch: 12 },
      { wch: 14 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 22 },
      { wch: 35 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 35 },
      { wch: 20 },
      { wch: 25 },
      { wch: 12 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
      { wch: 50 },
    ];

    // ==========================================
    // CREATE WORKBOOK
    // ==========================================

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // ==========================================
    // GENERATE XLSX BUFFER
    // ==========================================

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // ==========================================
    // DOWNLOAD RESPONSE
    // ==========================================

    const date = new Date().toISOString().slice(0, 10);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="student-deletion-backup-${date}.xlsx"`,
    );

    return res.status(200).send(excelBuffer);
  } catch (error) {
    console.error("EXPORT DELETION STUDENTS EXCEL ERROR:", error);

    return res.status(500).json({
      message: "Unable to export deletion students to Excel",
      error: error.message,
    });
  }
};
