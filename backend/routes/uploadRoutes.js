const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
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

    const extension = path.extname(file.originalname);

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

    const extension = path.extname(file.originalname);

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

    if (file.mimetype === "application/pdf") {
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
// PROFILE PHOTO ROUTE
// ==================================================

router.post(
  "/profile-photo",

  // JWT authentication
  authMiddleware,

  // Upload file
  profilePhotoUpload.single("photo"),

  async (req, res) => {

    try {

      // Check uploaded file
      if (!req.file) {

        return res.status(400).json({
          error: "No photo uploaded"
        });

      }

      // ==================================================
      // GET USER ID FROM JWT
      // ==================================================

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      if (!userId) {

        return res.status(401).json({
          error: "User ID not found in token"
        });

      }

      // ==================================================
      // LOCAL FILE URL
      // ==================================================

      const fileUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/profile-photos/${req.file.filename}`;

      console.log(
        "Profile photo saved:",
        req.file.path
      );

      console.log(
        "User ID:",
        userId
      );

      console.log(
        "Profile photo URL:",
        fileUrl
      );

      // ==================================================
      // SAVE URL INTO MONGODB
      // ==================================================

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

      console.log(
        "Profile photo saved to MongoDB"
      );

      // ==================================================
      // RESPONSE
      // ==================================================

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
// RESUME ROUTE
// ==================================================

router.post(
  "/resume",

  // JWT authentication
  authMiddleware,

  // Upload file
  resumeUpload.single("resume"),

  async (req, res) => {

    try {

      // Check uploaded file
      if (!req.file) {

        return res.status(400).json({
          error: "No resume uploaded"
        });

      }

      // ==================================================
      // GET USER ID
      // ==================================================

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      if (!userId) {

        return res.status(401).json({
          error: "User ID not found in token"
        });

      }

      // ==================================================
      // LOCAL RESUME URL
      // ==================================================

      const fileUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/resumes/${req.file.filename}`;

      console.log(
        "Resume saved:",
        req.file.path
      );

      console.log(
        "Resume URL:",
        fileUrl
      );

      // ==================================================
      // SAVE RESUME URL INTO MONGODB
      // ==================================================

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

      console.log(
        "Resume saved to MongoDB"
      );

      // ==================================================
      // RESPONSE
      // ==================================================

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
// MULTER ERROR HANDLER
// ==================================================

router.use(
  (error, req, res, next) => {

    if (error instanceof multer.MulterError) {

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
// ==================================================
// MENTOR PROFILE PHOTO UPLOAD
// ==================================================

const mentorProfilePhotoDir = path.join(
  __dirname,
  "../uploads/mentor-profile-photos"
);

if (!fs.existsSync(mentorProfilePhotoDir)) {
  fs.mkdirSync(mentorProfilePhotoDir, {
    recursive: true
  });
}

const mentorPhotoStorage =
  multer.diskStorage({

    destination: (req, file, cb) => {
      cb(null, mentorProfilePhotoDir);
    },

    filename: (req, file, cb) => {

      const extension =
        path.extname(file.originalname);

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
          error: "User ID not found in token"
        });

      }

      const fileUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/mentor-profile-photos/${req.file.filename}`;

      console.log(
        "Mentor photo saved:",
        req.file.path
      );

      console.log(
        "Mentor photo URL:",
        fileUrl
      );

      await MentorProfile.findOneAndUpdate(

        {
          userId
        },

        {
          profilePhoto: fileUrl
        },

        {
          new: true,
          upsert: true,
          runValidators: true
        }

      );

      console.log(
        "Mentor photo saved to MongoDB"
      );

      res.status(200).json({

        message:
          "Mentor profile photo uploaded successfully",

        url: fileUrl

      });

    } catch (error) {

      console.error(
        "MENTOR PHOTO UPLOAD ERROR:",
        error
      );

      res.status(500).json({

        error:
          "Mentor photo upload failed",

        message:
          error.message

      });

    }

  }
);

module.exports = router;