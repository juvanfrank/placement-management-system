const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");

// ==================================================
// LOCAL FILE URL HELPER
// ==================================================

const getLocalFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  // Already a complete URL
  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  return `http://localhost:${process.env.PORT || 5000}${filePath}`;
};

// ==================================================
// GET MENTOR PROFILE
// ==================================================

exports.getProfile = async (req, res) => {
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

    // ==================================================
    // GET USER
    // ==================================================

    const user = await User.findById(userId)
      .select("-password");

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

      // Registration/User details
      name: user.name || "",
      email: user.email || "",

      // Department comes from User collection
      department: user.department || "",

      // Mentor details
      age: profile.age || "",
      className: profile.className || "",
      section: profile.section || "",
      phone: profile.phone || "",
      address: profile.address || "",

      // Profile photo
      profilePhoto: getLocalFileUrl(
        profile.profilePhoto
      ),
    });

  } catch (error) {

    console.error(
      "GET MENTOR PROFILE ERROR:",
      error
    );

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

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found",
      });
    }

    const data = req.body;

    console.log(
      "================================="
    );

    console.log(
      "MENTOR PROFILE UPDATE"
    );

    console.log(
      "USER ID:",
      userId
    );

    console.log(
      "RECEIVED DEPARTMENT:",
      data.department
    );

    console.log(
      "================================="
    );

    // ==================================================
    // UPDATE USER
    // ==================================================

    // Name, email and department are stored
    // in the User collection.

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          name: data.name,
          email: data.email,

          // IMPORTANT:
          // Mentor can change department
          department: data.department,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ==================================================
    // UPDATE MENTOR PROFILE
    // ==================================================

    const profile =
      await MentorProfile.findOneAndUpdate(
        {
          userId,
        },

        {
          age: data.age || "",

          className:
            data.className || "",

          section:
            data.section || "",

          phone:
            data.phone || "",

          address:
            data.address || "",

          profilePhoto:
            data.profilePhoto || "",
        },

        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({

      message:
        "Mentor profile updated successfully",

      profile: {

        userId:
          updatedUser._id,

        name:
          updatedUser.name || "",

        email:
          updatedUser.email || "",

        // IMPORTANT
        // Return the NEW department
        department:
          updatedUser.department || "",

        age:
          profile.age || "",

        className:
          profile.className || "",

        section:
          profile.section || "",

        phone:
          profile.phone || "",

        address:
          profile.address || "",

        profilePhoto:
          getLocalFileUrl(
            profile.profilePhoto
          ),
      },
    });

  } catch (error) {

    console.error(
      "UPDATE MENTOR PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};