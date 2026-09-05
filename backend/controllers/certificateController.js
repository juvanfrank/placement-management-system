const Certificate = require("../models/Certificate");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");

// ==================================================
// ADD CERTIFICATE - STUDENT
// ==================================================

exports.addCertificate = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found",
      });
    }

    const certificate = await Certificate.create({
      userId,
      name: req.body.name,
      link: req.body.link,
      status: "Pending",
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error("ADD CERTIFICATE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET CERTIFICATES - STUDENT
// ==================================================

exports.getCertificates = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found",
      });
    }

    const certificates =
      await Certificate.find({ userId }).sort({
        createdAt: -1,
      });

    res.status(200).json(certificates);
  } catch (error) {
    console.error("GET CERTIFICATES ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// GET MENTOR CERTIFICATES
// ==================================================

exports.getMentorCertificates = async (req, res) => {
  try {
    const mentorUserId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    if (!mentorUserId) {
      return res.status(401).json({
        message: "User ID not found",
      });
    }

    // ==================================================
    // GET MENTOR USER
    // ==================================================

    const mentorUser =
      await User.findById(mentorUserId)
        .select("-password");

    if (!mentorUser) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    // ==================================================
    // GET MENTOR PROFILE
    // ==================================================

    const mentorProfile =
      await MentorProfile.findOne({
        userId: mentorUserId,
      });

    if (!mentorProfile) {
      return res.status(404).json({
        message: "Mentor profile not found",
      });
    }

    // ==================================================
    // MENTOR MAPPING
    //
    // Department + Year + Section
    // ==================================================

    const mentorDepartment =
      mentorUser.department || "";

    const mentorYear =
      mentorProfile.year;

    const mentorSection =
      mentorProfile.section || "";

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

        certificates: [],

        message:
          "Please complete mentor department, year and section",
      });
    }

    // ==================================================
    // GET STUDENTS MATCHING MENTOR
    // ==================================================

    const studentUsers =
      await User.find({
        role: "student",
        department: mentorDepartment,
      }).select("-password");

    const studentUserIds =
      studentUsers.map(
        (student) => student._id
      );

    const studentProfiles =
      await StudentProfile.find({
        userId: {
          $in: studentUserIds,
        },

        currentYear:
          String(mentorYear),

        section:
          mentorSection,
      });

    // ==================================================
    // VALID STUDENT IDS
    // ==================================================

    const validStudentIds =
      studentProfiles.map(
        (profile) => profile.userId
      );

    // ==================================================
    // GET CERTIFICATES
    // ==================================================

    const certificates =
      await Certificate.find({
        userId: {
          $in: validStudentIds,
        },
      }).sort({
        createdAt: -1,
      });

    // ==================================================
    // CREATE STUDENT MAP
    // ==================================================

    const studentMap = new Map();

    studentUsers.forEach((user) => {
      studentMap.set(
        user._id.toString(),
        user
      );
    });

    const profileMap = new Map();

    studentProfiles.forEach((profile) => {
      profileMap.set(
        profile.userId.toString(),
        profile
      );
    });

    // ==================================================
    // COMBINE CERTIFICATE + STUDENT DATA
    // ==================================================

    const result =
      certificates.map((certificate) => {
        const studentUser =
          studentMap.get(
            certificate.userId.toString()
          );

        const studentProfile =
          profileMap.get(
            certificate.userId.toString()
          );

        return {
          id: certificate._id,

          userId:
            certificate.userId,

          name:
            certificate.name,

          link:
            certificate.link,

          status:
            certificate.status,

          createdAt:
            certificate.createdAt,

          student: {
            id:
              studentUser?._id,

            name:
              studentUser?.name ||
              studentProfile?.name ||
              "",

            registerNumber:
              studentUser?.registerNumber ||
              studentProfile?.registerNumber ||
              "",

            rollNumber:
              studentProfile?.rollNumber ||
              "",

            department:
              studentUser?.department ||
              studentProfile?.department ||
              "",

            year:
              studentProfile?.currentYear ||
              "",

            section:
              studentProfile?.section ||
              "",
          },
        };
      });

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      mentor: {
        department:
          mentorDepartment,

        year:
          mentorYear,

        section:
          mentorSection,
      },

      count:
        result.length,

      certificates:
        result,
    });
  } catch (error) {
    console.error(
      "GET MENTOR CERTIFICATES ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// UPDATE CERTIFICATE STATUS - MENTOR
// ==================================================

exports.updateCertificateStatus =
  async (req, res) => {
    try {
      const mentorUserId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const certificateId =
        req.params.id;

      const { status } = req.body;

      // ==================================================
      // VALIDATE STATUS
      // ==================================================

      if (
        !["Approved", "Rejected"].includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Status must be Approved or Rejected",
        });
      }

      // ==================================================
      // GET MENTOR
      // ==================================================

      const mentorUser =
        await User.findById(
          mentorUserId
        ).select("-password");

      if (!mentorUser) {
        return res.status(404).json({
          message: "Mentor not found",
        });
      }

      const mentorProfile =
        await MentorProfile.findOne({
          userId: mentorUserId,
        });

      if (!mentorProfile) {
        return res.status(404).json({
          message:
            "Mentor profile not found",
        });
      }

      // ==================================================
      // GET CERTIFICATE
      // ==================================================

      const certificate =
        await Certificate.findById(
          certificateId
        );

      if (!certificate) {
        return res.status(404).json({
          message:
            "Certificate not found",
        });
      }

      // ==================================================
      // GET STUDENT
      // ==================================================

      const studentUser =
        await User.findById(
          certificate.userId
        ).select("-password");

      if (
        !studentUser ||
        studentUser.role !== "student"
      ) {
        return res.status(404).json({
          message:
            "Certificate student not found",
        });
      }

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

      // ==================================================
      // MAPPING CHECK
      //
      // Department + Year + Section
      // ==================================================

      const mentorDepartment =
        mentorUser.department || "";

      const mentorYear =
        mentorProfile.year;

      const mentorSection =
        mentorProfile.section || "";

      const studentDepartment =
        studentUser.department ||
        studentProfile.department ||
        "";

      const studentYear =
        studentProfile.currentYear || "";

      const studentSection =
        studentProfile.section || "";

      if (
        studentDepartment !==
          mentorDepartment ||
        String(studentYear) !==
          String(mentorYear) ||
        studentSection !==
          mentorSection
      ) {
        return res.status(403).json({
          message:
            "You cannot approve this student's certificate",
        });
      }

      // ==================================================
      // UPDATE STATUS
      // ==================================================

      certificate.status =
        status;

      await certificate.save();

      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json({
        message:
          `Certificate ${status.toLowerCase()} successfully`,

        certificate,
      });
    } catch (error) {
      console.error(
        "UPDATE CERTIFICATE STATUS ERROR:",
        error
      );

      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };