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

  // Already complete URL
  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  return `http://localhost:${process.env.PORT || 5000}${filePath}`;
};


// ==================================================
// GET ADMIN PROFILE
// ==================================================

exports.getProfile = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const admin = await User.findById(userId)
      .select("-password");

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

      profilePhoto: getLocalFileUrl(
        admin.profilePhoto
      ),
    });

  } catch (error) {

    console.error(
      "GET ADMIN PROFILE ERROR:",
      error
    );

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

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const {
      name,
      email,
    } = req.body;


    if (!name || !email) {
      return res.status(400).json({
        message:
          "Name and email are required",
      });
    }


    // CHECK EMAIL ALREADY EXISTS

    const existingUser =
      await User.findOne({
        email,
        _id: {
          $ne: userId,
        },
      });


    if (existingUser) {
      return res.status(400).json({
        message:
          "Email is already used by another user",
      });
    }


    // UPDATE ADMIN

    const admin =
      await User.findOneAndUpdate(

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
        }

      ).select("-password");


    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }


    res.status(200).json({

      message:
        "Profile updated successfully",

      admin: {

        userId: admin._id,

        name: admin.name || "",

        email: admin.email || "",

        role: admin.role,

        profilePhoto:
          getLocalFileUrl(
            admin.profilePhoto
          ),

      },

    });

  } catch (error) {

    console.error(
      "UPDATE ADMIN PROFILE ERROR:",
      error
    );

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

    const departments =
      await StudentProfile.distinct(
        "department",
        {
          department: {
            $ne: "",
          },
        }
      );

    res.status(200).json(
      departments
    );

  } catch (error) {

    console.error(
      "GET DEPARTMENTS ERROR:",
      error
    );

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

    const { department } =
      req.params;


    const years =
      await StudentProfile.distinct(
        "currentYear",
        {
          department,

          currentYear: {
            $ne: "",
          },
        }
      );


    res.status(200).json(
      years
    );

  } catch (error) {

    console.error(
      "GET YEARS ERROR:",
      error
    );

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

    const {
      department,
      year,
    } = req.params;


    const sections =
      await StudentProfile.distinct(
        "section",
        {
          department,

          currentYear: year,

          section: {
            $ne: "",
          },
        }
      );


    res.status(200).json(
      sections
    );

  } catch (error) {

    console.error(
      "GET SECTIONS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ==================================================
// GET STUDENTS BY CLASS
// ==================================================

exports.getStudentsByClass =
  async (req, res) => {

    try {

      const {
        department,
        year,
        section,
      } = req.params;


      // ==========================================
      // GET STUDENT PROFILES
      // ==========================================

      const studentProfiles =
        await StudentProfile.find({
          department,
          currentYear: year,
          section,
        })
          .populate({
            path: "userId",
            select:
              "name registerNumber email profilePhoto",
          })
          .lean();


      // ==========================================
      // GET MENTORS FROM SAME DEPARTMENT
      // SAME LOGIC AS HOD
      // ==========================================

      const mentorUsers =
        await User.find({
          role: "mentor",
          department,
        }).select("-password");


      const mentorUserIds =
        mentorUsers.map(
          (mentorUser) =>
            mentorUser._id
        );


      // ==========================================
      // FIND MATCHING MENTOR PROFILE
      // YEAR + SECTION
      // ==========================================

      const mentorProfiles =
        await MentorProfile.find({

          userId: {
            $in: mentorUserIds,
          },

          year: Number(year),

          section,

        }).lean();


      let classMentor = null;


      if (mentorProfiles.length > 0) {

        const matchingProfile =
          mentorProfiles[0];


        const matchingMentorUser =
          mentorUsers.find(
            (mentorUser) =>
              mentorUser._id
                .toString() ===
              matchingProfile.userId
                .toString()
          );


        if (matchingMentorUser) {

          classMentor = {

            id:
              matchingMentorUser._id,

            name:
              matchingMentorUser.name ||
              matchingProfile.name ||
              "",

            email:
              matchingMentorUser.email ||
              matchingProfile.email ||
              "",

            department:
              matchingMentorUser.department ||
              matchingProfile.department ||
              "",

            year:
              matchingProfile.year ?? "",

            section:
              matchingProfile.section ||
              "",

          };

        }

      }


      // ==========================================
      // FORMAT STUDENTS
      // ==========================================

      const students =
        studentProfiles.map(
          (profile) => {

            const user =
              profile.userId || {};


            return {

              id:
                user._id,

              _id:
                user._id,

              name:
                user.name ||
                profile.name ||
                "",

              email:
                user.email ||
                profile.email ||
                "",

              registerNumber:
                user.registerNumber ||
                profile.registerNumber ||
                "",

              rollNumber:
                profile.rollNumber ||
                "",

              department:
                user.department ||
                profile.department ||
                "",

              year:
                profile.currentYear ||
                "",

              section:
                profile.section ||
                "",

              profilePhoto:
                getLocalFileUrl(
                  profile.profilePhoto
                ),

              mentor:
                classMentor,

            };

          }
        );


      // ==========================================
      // SORT BY ROLL NUMBER
      // ==========================================

      students.sort(
        (a, b) =>
          String(
            a.rollNumber || ""
          ).localeCompare(

            String(
              b.rollNumber || ""
            ),

            undefined,

            {
              numeric: true,
              sensitivity: "base",
            }

          )
      );


      res.status(200).json(
        students
      );

    } catch (error) {

      console.error(
        "GET ADMIN STUDENTS ERROR:",
        error
      );

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

exports.getStudentDetails =
  async (req, res) => {

    try {

      const studentId =
        req.params.id;


      // ==========================================
      // GET STUDENT USER
      // ==========================================

      const studentUser =
        await User.findOne({

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

      const studentProfile =
        await StudentProfile.findOne({

          userId:
            studentUser._id,

        });


      if (!studentProfile) {

        return res.status(404).json({
          message:
            "Student profile not found",
        });

      }


      // ==========================================
      // GET CONCERNED MENTOR
      //
      // SAME AS HOD
      // ==========================================

      let mentor = null;


      const studentDepartment =
        studentUser.department ||
        studentProfile.department ||
        "";


      const studentYear =
        studentProfile.currentYear ||
        "";


      const studentSection =
        studentProfile.section ||
        "";


      console.log(
        "================================="
      );

      console.log(
        "ADMIN STUDENT-MENTOR MAPPING"
      );

      console.log(
        "Student:",
        studentUser.name
      );

      console.log(
        "Department:",
        studentDepartment
      );

      console.log(
        "Year:",
        studentYear
      );

      console.log(
        "Section:",
        studentSection
      );

      console.log(
        "================================="
      );


      // ==========================================
      // FIND MENTOR
      // ONLY IF ALL DETAILS EXIST
      // ==========================================

      if (
        studentDepartment &&
        studentYear &&
        studentSection
      ) {


        // ========================================
        // GET MENTORS FROM SAME DEPARTMENT
        // ========================================

        const mentorUsers =
          await User.find({

            role: "mentor",

            department:
              studentDepartment,

          }).select("-password");


        const mentorUserIds =
          mentorUsers.map(
            (mentorUser) =>
              mentorUser._id
          );


        // ========================================
        // GET MENTOR PROFILE
        // MATCH YEAR + SECTION
        // ========================================

        const mentorProfiles =
          await MentorProfile.find({

            userId: {
              $in:
                mentorUserIds,
            },

            year:
              Number(
                studentYear
              ),

            section:
              studentSection,

          });


        // ========================================
        // FIND MATCHING MENTOR
        // ========================================

        if (
          mentorProfiles.length > 0
        ) {

          const matchingProfile =
            mentorProfiles[0];


          const matchingMentorUser =
            mentorUsers.find(
              (mentorUser) =>

                mentorUser._id
                  .toString() ===

                matchingProfile.userId
                  .toString()
            );


          if (
            matchingMentorUser
          ) {

            mentor = {

              id:
                matchingMentorUser._id,

              name:
                matchingMentorUser.name ||
                matchingProfile.name ||
                "",

              email:
                matchingMentorUser.email ||
                matchingProfile.email ||
                "",

              department:
                matchingMentorUser.department ||
                matchingProfile.department ||
                "",

              year:
                matchingProfile.year ??
                "",

              section:
                matchingProfile.section ||
                "",

              phone:
                matchingProfile.phone ||
                "",

              address:
                matchingProfile.address ||
                "",

              profilePhoto:
                getLocalFileUrl(
                  matchingProfile.profilePhoto
                ),

            };


            console.log(
              "ADMIN MENTOR FOUND:",
              mentor.name
            );

          }

        }

      }


      // ==========================================
      // GET APPROVED CERTIFICATES ONLY
      // ==========================================

      const certificates =
        await Certificate.find({

          userId:
            studentUser._id,

          status:
            "Approved",

        }).sort({

          createdAt: -1,

        });


      // ==========================================
      // COMPLETE STUDENT PROFILE
      // SAME FORMAT AS HOD
      // ==========================================

      const student = {

        id:
          studentUser._id,


        name:
          studentUser.name ||
          studentProfile.name ||
          "",


        email:
          studentUser.email ||
          studentProfile.email ||
          "",


        registerNumber:

          studentUser.registerNumber ||

          studentProfile.registerNumber ||

          "",


        rollNumber:

          studentProfile.rollNumber ||

          "",


        department:

          studentUser.department ||

          studentProfile.department ||

          "",


        year:

          studentProfile.currentYear ||

          "",


        section:

          studentProfile.section ||

          "",


        dob:

          studentProfile.dob ||

          "",


        gender:

          studentProfile.gender ||

          "",


        batch:

          studentProfile.batch ||

          "",


        religion:

          studentProfile.religion ||

          "",


        caste:

          studentProfile.caste ||

          "",


        community:

          studentProfile.community ||

          "",


        studentPhone:

          studentProfile.studentPhone ||

          "",


        address:

          studentProfile.address ||

          "",


        tenthPercentage:

          studentProfile.tenthPercentage ||

          "",


        twelthPercentage:

          studentProfile.twelthPercentage ||

          "",


        diplomaPercentage:

          studentProfile.diplomaPercentage ||

          "",


        currentArrears:

          studentProfile.currentArrears ||

          "",


        historyOfArrears:

          studentProfile.historyOfArrears ||

          "",


        cgpa:

          studentProfile.cgpa ||

          "",


        resumeLink:

          studentProfile.resumeLink ||

          "",


        linkedinLink:

          studentProfile.linkedinLink ||

          "",


        githubLink:

          studentProfile.githubLink ||

          "",


        portfolioLink:

          studentProfile.portfolioLink ||

          "",


        skills:

          studentProfile.skills ||

          [],


        internship:

          studentProfile.internship ||

          [],


        placementStatus:

          studentProfile.placementStatus ||

          "Not Placed",


        fatherName:

          studentProfile.fatherName ||

          "",


        motherName:

          studentProfile.motherName ||

          "",


        fatherPhone:

          studentProfile.fatherPhone ||

          "",


        motherPhone:

          studentProfile.motherPhone ||

          "",


        profilePhoto:

          getLocalFileUrl(
            studentProfile.profilePhoto
          ),

      };


      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        student,

        mentor,

        certificates,

        certificateCount:
          certificates.length,

      });

    } catch (error) {

      console.error(
        "GET ADMIN STUDENT DETAILS ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Server error",

        error:
          error.message,

      });

    }

  };