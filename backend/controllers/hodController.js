const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const Certificate = require("../models/Certificate");

// ==================================================
// HELPER
// ==================================================

const getLocalFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `http://localhost:${process.env.PORT || 5000}${filePath}`;
};

// ==================================================
// GET HOD PROFILE
// ==================================================

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "HOD not found",
      });
    }

    res.status(200).json({
      userId: user._id,
      name: user.name || "",
      email: user.email || "",
      department: user.department || "",
      profilePhoto: getLocalFileUrl(user.profilePhoto),
    });
  } catch (error) {
    console.error("GET HOD PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET HOD STUDENTS
// ==================================================
// HOD sees students belonging to their department.
// Students are grouped/sorted year-wise and roll-wise.
// ==================================================

exports.getStudents = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    // --------------------------------------------------
    // GET HOD
    // --------------------------------------------------

    const hod = await User.findById(userId).select("-password");

    if (!hod) {
      return res.status(404).json({
        message: "HOD not found",
      });
    }

    const hodDepartment = hod.department || "";

    if (!hodDepartment) {
      return res.status(200).json({
        department: "",
        students: [],
        message: "HOD department is not assigned",
      });
    }

    // --------------------------------------------------
    // GET STUDENTS FROM SAME DEPARTMENT
    // --------------------------------------------------

    const studentUsers = await User.find({
      role: "student",
      department: hodDepartment,
    }).select("-password");

    const userIds = studentUsers.map((student) => student._id);

    // --------------------------------------------------
    // GET STUDENT PROFILES
    // --------------------------------------------------

    const studentProfiles = await StudentProfile.find({
      userId: {
        $in: userIds,
      },
    });

    // --------------------------------------------------
    // PROFILE MAP
    // --------------------------------------------------

    const profileMap = new Map();

    studentProfiles.forEach((profile) => {
      profileMap.set(profile.userId.toString(), profile);
    });

    // --------------------------------------------------
    // COMBINE USER + PROFILE
    // --------------------------------------------------

    const students = studentUsers
      .map((user) => {
        const profile = profileMap.get(user._id.toString());

        if (!profile) {
          return null;
        }

        return {
          id: user._id,

          name: user.name || profile.name || "",

          registerNumber: user.registerNumber || profile.registerNumber || "",

          rollNumber: profile.rollNumber || "",

          email: user.email || profile.email || "",

          department: user.department || profile.department || "",

          year: profile.currentYear || "",

          section: profile.section || "",

          placementStatus: profile.placementStatus || "Not Placed",

          profilePhoto: getLocalFileUrl(profile.profilePhoto),
        };
      })
      .filter(Boolean);

    // --------------------------------------------------
    // SORT
    // --------------------------------------------------
    // First: Year ascending
    // Second: Roll number ascending
    // --------------------------------------------------

    students.sort((a, b) => {
      const yearA = Number(a.year) || 0;
      const yearB = Number(b.year) || 0;

      if (yearA !== yearB) {
        return yearA - yearB;
      }

      return String(a.rollNumber).localeCompare(
        String(b.rollNumber),
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        },
      );
    });

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.status(200).json({
      department: hodDepartment,

      count: students.length,

      students,
    });
  } catch (error) {
    console.error("GET HOD STUDENTS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET HOD MENTORS
// ==================================================
// HOD sees mentors belonging to their department.
// ==================================================

exports.getMentors = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    // --------------------------------------------------
    // GET HOD
    // --------------------------------------------------

    const hod = await User.findById(userId).select("-password");

    if (!hod) {
      return res.status(404).json({
        message: "HOD not found",
      });
    }

    const hodDepartment = hod.department || "";

    if (!hodDepartment) {
      return res.status(200).json({
        department: "",
        mentors: [],
        message: "HOD department is not assigned",
      });
    }

    // --------------------------------------------------
    // GET MENTORS
    // --------------------------------------------------

    const mentorUsers = await User.find({
      role: "mentor",
      department: hodDepartment,
    }).select("-password");

    const mentorIds = mentorUsers.map((mentor) => mentor._id);

    // --------------------------------------------------
    // GET MENTOR PROFILES
    // --------------------------------------------------

    const mentorProfiles = await MentorProfile.find({
      userId: {
        $in: mentorIds,
      },
    });

    const profileMap = new Map();

    mentorProfiles.forEach((profile) => {
      profileMap.set(profile.userId.toString(), profile);
    });

    // --------------------------------------------------
    // COMBINE DATA
    // --------------------------------------------------

    const mentors = mentorUsers.map((user) => {
      const profile = profileMap.get(user._id.toString());

      return {
        id: user._id,

        name: user.name || profile?.name || "",

        email: user.email || "",

        department: user.department || "",

        year: profile?.year ?? "",

        section: profile?.section || "",

        phone: profile?.phone || "",

        profilePhoto: getLocalFileUrl(profile?.profilePhoto),
      };
    });

    // --------------------------------------------------
    // SORT MENTORS BY YEAR
    // --------------------------------------------------

    mentors.sort((a, b) => {
      const yearA = Number(a.year) || 0;
      const yearB = Number(b.year) || 0;

      if (yearA !== yearB) {
        return yearA - yearB;
      }

      return String(a.name).localeCompare(String(b.name));
    });

    res.status(200).json({
      department: hodDepartment,

      count: mentors.length,

      mentors,
    });
  } catch (error) {
    console.error("GET HOD MENTORS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET SINGLE STUDENT
// ==================================================
// HOD clicks a student.
// Returns complete profile + concerned mentor +
// APPROVED certificates only.
//
// IMPORTANT:
// Student-Mentor mapping is based on:
// Department + Year + Section
// ==================================================

exports.getStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;

    // --------------------------------------------------
    // GET STUDENT USER
    // --------------------------------------------------

    const studentUser = await User.findOne({
      _id: studentId,
      role: "student",
    }).select("-password");

    if (!studentUser) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // --------------------------------------------------
    // GET STUDENT PROFILE
    // --------------------------------------------------

    const studentProfile = await StudentProfile.findOne({
      userId: studentUser._id,
    });

    if (!studentProfile) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // ==================================================
    // GET CONCERNED MENTOR
    // ==================================================
    // Mapping:
    //
    // Student Department
    //       =
    // Mentor Department
    //
    // Student Year
    //       =
    // Mentor Year
    //
    // Student Section
    //       =
    // Mentor Section
    // ==================================================

    let mentor = null;

    const studentDepartment =
      studentUser.department || studentProfile.department || "";

    const studentYear = studentProfile.currentYear || "";

    const studentSection = studentProfile.section || "";

    console.log("=================================");
    console.log("STUDENT-MENTOR MAPPING");
    console.log("Student:", studentUser.name);
    console.log("Department:", studentDepartment);
    console.log("Year:", studentYear);
    console.log("Section:", studentSection);
    console.log("=================================");

    // --------------------------------------------------
    // ONLY FIND MENTOR IF MAPPING DETAILS EXIST
    // --------------------------------------------------

    if (studentDepartment && studentYear && studentSection) {
      // --------------------------------------------------
      // GET MENTORS FROM SAME DEPARTMENT
      // --------------------------------------------------

      const mentorUsers = await User.find({
        role: "mentor",
        department: studentDepartment,
      }).select("-password");

      const mentorUserIds = mentorUsers.map((mentorUser) => mentorUser._id);

      // --------------------------------------------------
      // GET MENTOR PROFILES
      // --------------------------------------------------

      const mentorProfiles = await MentorProfile.find({
        userId: {
          $in: mentorUserIds,
        },
        year: Number(studentYear),
        section: studentSection,
      });

      // --------------------------------------------------
      // FIND MATCHING MENTOR
      // --------------------------------------------------

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
        }
      }
    }

    // --------------------------------------------------
    // GET APPROVED CERTIFICATES ONLY
    // --------------------------------------------------

    const certificates = await Certificate.find({
      userId: studentUser._id,
      status: "Approved",
    }).sort({
      createdAt: -1,
    });

    // --------------------------------------------------
    // COMPLETE STUDENT PROFILE
    // --------------------------------------------------

    const student = {
      id: studentUser._id,

      name: studentUser.name || studentProfile.name || "",

      email: studentUser.email || studentProfile.email || "",

      registerNumber:
        studentUser.registerNumber || studentProfile.registerNumber || "",

      rollNumber: studentProfile.rollNumber || "",

      department: studentUser.department || studentProfile.department || "",

      year: studentProfile.currentYear || "",

      section: studentProfile.section || "",

      dob: studentProfile.dob || "",

      gender: studentProfile.gender || "",

      batch: studentProfile.batch || "",

      religion: studentProfile.religion || "",

      caste: studentProfile.caste || "",

      community: studentProfile.community || "",

      studentPhone: studentProfile.studentPhone || "",

      address: studentProfile.address || "",

      tenthPercentage: studentProfile.tenthPercentage || "",

      twelthPercentage: studentProfile.twelthPercentage || "",

      diplomaPercentage: studentProfile.diplomaPercentage || "",

      currentArrears: studentProfile.currentArrears || "",

      historyOfArrears: studentProfile.historyOfArrears || "",

      cgpa: studentProfile.cgpa || "",

      resumeLink: studentProfile.resumeLink || "",

      linkedinLink: studentProfile.linkedinLink || "",

      githubLink: studentProfile.githubLink || "",

      portfolioLink: studentProfile.portfolioLink || "",

      skills: studentProfile.skills || [],

      internship: studentProfile.internship || [],

      placementStatus: studentProfile.placementStatus || "Not Placed",

      fatherName: studentProfile.fatherName || "",

      motherName: studentProfile.motherName || "",

      fatherPhone: studentProfile.fatherPhone || "",

      motherPhone: studentProfile.motherPhone || "",

      profilePhoto: getLocalFileUrl(studentProfile.profilePhoto),
    };

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.status(200).json({
      student,

      mentor,

      certificates,

      certificateCount: certificates.length,
    });
  } catch (error) {
    console.error("GET HOD STUDENT DETAILS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET SINGLE MENTOR
// ==================================================
// HOD clicks a mentor.
//
// IMPORTANT:
// Students are mapped to mentor using:
//
// Department + Year + Section
//
// NOT mentorId.
// ==================================================

exports.getMentorDetails = async (req, res) => {
  try {
    const mentorId = req.params.id;

    // --------------------------------------------------
    // GET HOD
    // --------------------------------------------------

    const hodId = req.user.id || req.user.userId || req.user._id;

    const hod = await User.findById(hodId).select("-password");

    if (!hod) {
      return res.status(404).json({
        message: "HOD not found",
      });
    }

    // --------------------------------------------------
    // GET MENTOR USER
    // --------------------------------------------------

    const mentorUser = await User.findOne({
      _id: mentorId,
      role: "mentor",
    }).select("-password");

    if (!mentorUser) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    // --------------------------------------------------
    // SECURITY CHECK
    // --------------------------------------------------
    // HOD can only view mentors from same department.
    // --------------------------------------------------

    if (hod.department && mentorUser.department !== hod.department) {
      return res.status(403).json({
        message: "You are not authorized to view this mentor",
      });
    }

    // --------------------------------------------------
    // GET MENTOR PROFILE
    // --------------------------------------------------

    const mentorProfile = await MentorProfile.findOne({
      userId: mentorUser._id,
    });

    if (!mentorProfile) {
      return res.status(404).json({
        message: "Mentor profile not found",
      });
    }

    // ==================================================
    // MENTOR MAPPING DETAILS
    // ==================================================

    const mentorDepartment =
      mentorUser.department || mentorProfile.department || "";

    const mentorYear = mentorProfile.year;

    const mentorSection = mentorProfile.section || "";

    console.log("=================================");
    console.log("HOD MENTOR-STUDENT MAPPING");
    console.log("Mentor:", mentorUser.name);
    console.log("Department:", mentorDepartment);
    console.log("Year:", mentorYear);
    console.log("Section:", mentorSection);
    console.log("=================================");

    // --------------------------------------------------
    // GET STUDENTS USING SAME MAPPING LOGIC
    // --------------------------------------------------

    let assignedStudents = [];

    if (
      mentorDepartment &&
      mentorYear !== null &&
      mentorYear !== undefined &&
      mentorSection
    ) {
      // --------------------------------------------------
      // GET STUDENT USERS FROM SAME DEPARTMENT
      // --------------------------------------------------

      const studentUsers = await User.find({
        role: "student",
        department: mentorDepartment,
      }).select("-password");

      const studentUserIds = studentUsers.map((student) => student._id);

      // --------------------------------------------------
      // GET STUDENT PROFILES
      // --------------------------------------------------

      const studentProfiles = await StudentProfile.find({
        userId: {
          $in: studentUserIds,
        },

        currentYear: String(mentorYear),

        section: mentorSection,
      });

      // --------------------------------------------------
      // PROFILE MAP
      // --------------------------------------------------

      const profileMap = new Map();

      studentProfiles.forEach((profile) => {
        profileMap.set(profile.userId.toString(), profile);
      });

      // --------------------------------------------------
      // COMBINE USER + PROFILE
      // --------------------------------------------------

      assignedStudents = studentUsers
        .map((studentUser) => {
          const studentProfile = profileMap.get(studentUser._id.toString());

          if (!studentProfile) {
            return null;
          }

          return {
            id: studentUser._id,

            name: studentUser.name || studentProfile.name || "",

            registerNumber:
              studentUser.registerNumber || studentProfile.registerNumber || "",

            email: studentUser.email || studentProfile.email || "",

            department:
              studentUser.department || studentProfile.department || "",

            year: studentProfile.currentYear || "",

            section: studentProfile.section || "",

            rollNumber: studentProfile.rollNumber || "",

            cgpa: studentProfile.cgpa || "",

            placementStatus: studentProfile.placementStatus || "Not Placed",

            profilePhoto: getLocalFileUrl(studentProfile.profilePhoto),
          };
        })
        .filter(Boolean);
    }

    // --------------------------------------------------
    // SORT STUDENTS BY ROLL NUMBER
    // --------------------------------------------------

    assignedStudents.sort((a, b) => {
      return String(a.rollNumber || "").localeCompare(
        String(b.rollNumber || ""),
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        },
      );
    });

    // --------------------------------------------------
    // CREATE MENTOR OBJECT
    // --------------------------------------------------

    const mentor = {
      id: mentorUser._id,

      name: mentorUser.name || mentorProfile.name || "",

      email: mentorUser.email || mentorProfile.email || "",

      department: mentorDepartment,

      age: mentorProfile.age || "",

      year: mentorProfile.year ?? "",

      section: mentorProfile.section || "",

      phone: mentorProfile.phone || "",

      address: mentorProfile.address || "",

      profilePhoto: getLocalFileUrl(mentorProfile.profilePhoto),
    };

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.status(200).json({
      mentor,

      students: assignedStudents,

      studentCount: assignedStudents.length,
    });
  } catch (error) {
    console.error("GET HOD MENTOR DETAILS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
