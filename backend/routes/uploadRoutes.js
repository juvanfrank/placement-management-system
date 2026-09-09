const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");

// ==================================================
// UPLOAD DIRECTORIES
// ==================================================

const profilePhotoDir = path.join(
  __dirname,
  "../uploads/profile-photos"
);

const resumeDir = path.join(
  __dirname,
  "../uploads/resumes"
);

if (!fs.existsSync(profilePhotoDir)) {
  fs.mkdirSync(profilePhotoDir, {
    recursive: true
  });
}

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, {
    recursive: true
  });
}

// ==================================================
// PROFILE PHOTO STORAGE
// ==================================================

const profilePhotoStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, profilePhotoDir);
  },

  filename: (req, file, cb) => {

    const extension = path.extname(
      file.originalname
    );

    const fileName =
      "profile-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, fileName);
  }

});

// ==================================================
// RESUME STORAGE
// ==================================================

const resumeStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },

  filename: (req, file, cb) => {

    const extension = path.extname(
      file.originalname
    );

    const fileName =
      "resume-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, fileName);
  }

});

// ==================================================
// PROFILE PHOTO UPLOAD
// ==================================================

const profilePhotoUpload = multer({

  storage: profilePhotoStorage,

  fileFilter: (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }

  },

  limits: {
    fileSize: 5 * 1024 * 1024
  }

});

// ==================================================
// RESUME UPLOAD
// ==================================================

const resumeUpload = multer({

  storage: resumeStorage,

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype ===
      "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF files are allowed"
        )
      );
    }

  },

  limits: {
    fileSize: 10 * 1024 * 1024
  }

});

// ==================================================
// STUDENT PROFILE PHOTO UPLOAD
// ==================================================

router.post(
  "/profile-photo",

  authMiddleware,

  profilePhotoUpload.single("photo"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: "No photo uploaded"
        });

      }

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      if (!userId) {

        return res.status(401).json({
          error: "User ID not found in token"
        });

      }

      const fileUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/profile-photos/${req.file.filename}`;

      await StudentProfile.findOneAndUpdate(

        { userId: userId },

        {
          profilePhoto: fileUrl
        },

        {
          new: true,
          upsert: true,
          runValidators: true
        }

      );

      return res.status(200).json({

        message:
          "Profile photo uploaded successfully",

        url: fileUrl

      });

    } catch (error) {

      console.error(
        "PROFILE PHOTO UPLOAD ERROR:",
        error
      );

      return res.status(500).json({

        error:
          "Profile photo upload failed",

        message:
          error.message

      });

    }

  }
);

// ==================================================
// RESUME UPLOAD
// ==================================================

router.post(
  "/resume",

  authMiddleware,

  resumeUpload.single("resume"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: "No resume uploaded"
        });

      }

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      if (!userId) {

        return res.status(401).json({
          error:
            "User ID not found in token"
        });

      }

      const fileUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/resumes/${req.file.filename}`;

      await StudentProfile.findOneAndUpdate(

        { userId: userId },

        {
          resumeLink: fileUrl
        },

        {
          new: true,
          upsert: true,
          runValidators: true
        }

      );

      return res.status(200).json({

        message:
          "Resume uploaded successfully",

        url: fileUrl

      });

    } catch (error) {

      console.error(
        "RESUME UPLOAD ERROR:",
        error
      );

      return res.status(500).json({

        error:
          "Resume upload failed",

        message:
          error.message

      });

    }

  }
);

// ==================================================
// MENTOR PROFILE PHOTO UPLOAD
// ==================================================

const mentorProfilePhotoDir = path.join(
  __dirname,
  "../uploads/mentor-profile-photos"
);

if (!fs.existsSync(mentorProfilePhotoDir)) {
  fs.mkdirSync(
    mentorProfilePhotoDir,
    {
      recursive: true
    }
  );
}

const mentorPhotoStorage =
  multer.diskStorage({

    destination: (req, file, cb) => {
      cb(null, mentorProfilePhotoDir);
    },

    filename: (req, file, cb) => {

      const extension =
        path.extname(
          file.originalname
        );

      const fileName =
        "mentor-profile-" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        extension;

      cb(null, fileName);
    }

  });

const mentorPhotoUpload = multer({

  storage: mentorPhotoStorage,

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }

  },

  limits: {
    fileSize: 5 * 1024 * 1024
  }

});

router.post(
  "/mentor-profile-photo",

  authMiddleware,

  mentorPhotoUpload.single("photo"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: "No photo uploaded"
        });

      }

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      if (!userId) {

        return res.status(401).json({
          error:
            "User ID not found in token"
        });

      }

      const fileUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/mentor-profile-photos/${req.file.filename}`;

      await MentorProfile.findOneAndUpdate(

        { userId },

        {
          profilePhoto: fileUrl
        },

        {
          new: true,
          upsert: true,
          runValidators: true
        }

      );

      return res.status(200).json({

        message:
          "Mentor profile photo uploaded successfully",

        url: fileUrl

      });

    } catch (error) {

      console.error(
        "MENTOR PHOTO UPLOAD ERROR:",
        error
      );

      return res.status(500).json({

        error:
          "Mentor photo upload failed",

        message:
          error.message

      });

    }

  }
);

// ==================================================
// HOD PROFILE PHOTO UPLOAD
// ==================================================

const hodProfilePhotoDir = path.join(
  __dirname,
  "../uploads/hod-profile-photos"
);

if (!fs.existsSync(hodProfilePhotoDir)) {
  fs.mkdirSync(
    hodProfilePhotoDir,
    {
      recursive: true
    }
  );
}

const hodPhotoStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, hodProfilePhotoDir);
  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(
        file.originalname
      );

    const fileName =
      "hod-profile-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, fileName);
  }

});

const hodPhotoUpload = multer({

  storage: hodPhotoStorage,

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }

  },

  limits: {
    fileSize: 5 * 1024 * 1024
  }

});

router.post(
  "/hod-profile-photo",

  authMiddleware,

  hodPhotoUpload.single("photo"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: "No photo uploaded"
        });

      }

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const user =
        await User.findOne({
          _id: userId,
          role: "hod"
        });

      if (!user) {

        return res.status(403).json({
          error:
            "Only HOD users can upload HOD profile photo"
        });

      }

      const fileUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/hod-profile-photos/${req.file.filename}`;

      user.profilePhoto = fileUrl;

      await user.save();

      return res.status(200).json({

        message:
          "HOD profile photo uploaded successfully",

        url: fileUrl

      });

    } catch (error) {

      console.error(
        "HOD PHOTO UPLOAD ERROR:",
        error
      );

      return res.status(500).json({

        error:
          "HOD photo upload failed",

        message:
          error.message

      });

    }

  }
);

// ==================================================
// ADMIN PROFILE PHOTO UPLOAD
// ==================================================

const adminProfilePhotoDir = path.join(
  __dirname,
  "../uploads/admin-profile-photos"
);

if (!fs.existsSync(adminProfilePhotoDir)) {
  fs.mkdirSync(
    adminProfilePhotoDir,
    {
      recursive: true
    }
  );
}

const adminPhotoStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, adminProfilePhotoDir);
  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(
        file.originalname
      );

    const fileName =
      "admin-profile-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, fileName);
  }

});

const adminPhotoUpload = multer({

  storage: adminPhotoStorage,

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }

  },

  limits: {
    fileSize: 5 * 1024 * 1024
  }

});

router.post(
  "/admin-profile-photo",

  authMiddleware,

  adminPhotoUpload.single("photo"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: "No photo uploaded"
        });

      }

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      if (!userId) {

        return res.status(401).json({
          error:
            "User ID not found in token"
        });

      }

      // ==============================================
      // CHECK ADMIN
      // ==============================================

      const user =
        await User.findOne({
          _id: userId,
          role: "admin"
        });

      if (!user) {

        return res.status(403).json({
          error:
            "Only Admin users can upload Admin profile photo"
        });

      }

      // ==============================================
      // FILE URL
      // ==============================================

      const fileUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/admin-profile-photos/${req.file.filename}`;

      console.log(
        "Admin photo saved:",
        req.file.path
      );

      console.log(
        "Admin photo URL:",
        fileUrl
      );

      // ==============================================
      // SAVE TO USER
      // ==============================================

      user.profilePhoto =
        fileUrl;

      await user.save();

      console.log(
        "Admin profile photo saved to MongoDB"
      );

      return res.status(200).json({

        message:
          "Admin profile photo uploaded successfully",

        url: fileUrl

      });

    } catch (error) {

      console.error(
        "ADMIN PHOTO UPLOAD ERROR:",
        error
      );

      return res.status(500).json({

        error:
          "Admin photo upload failed",

        message:
          error.message

      });

    }

  }
);

// ==================================================
// MULTER ERROR HANDLER
// ==================================================

router.use(
  (error, req, res, next) => {

    if (
      error instanceof multer.MulterError
    ) {

      return res.status(400).json({

        error:
          "File upload error",

        message:
          error.message

      });

    }

    if (error) {

      return res.status(400).json({

        error:
          "File upload error",

        message:
          error.message

      });

    }

    next();

  }
);

module.exports = router;