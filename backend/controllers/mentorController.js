const User = require("../models/User");
const MentorProfile = require("../models/MentorProfile");

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
        message: "User ID not found"
      });
    }

    // Find logged-in mentor
    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Mentor not found"
      });
    }

    // Find mentor profile
    let profile = await MentorProfile.findOne({
      userId
    });

    // Create profile if it doesn't exist
    if (!profile) {
      profile = await MentorProfile.create({
        userId
      });
    }

    // ==================================================
    // RETURN PROFILE
    // ==================================================

    res.status(200).json({

      name: profile.name || user.name || "",

      age: profile.age || "",

      registerNumber:
        profile.registerNumber ||
        user.registerNumber ||
        "",

      department:
        profile.department || "",

      className:
        profile.className || "",

      section:
        profile.section || "",

      phone:
        profile.phone || "",

      email:
        profile.email ||
        user.email ||
        "",

      address:
        profile.address || "",

      profilePhoto:
        profile.profilePhoto || ""

    });

  } catch (error) {

    console.error(
      "GET MENTOR PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
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
        message: "User ID not found"
      });
    }

    const data = req.body;

    console.log(
      "MENTOR PROFILE UPDATE:",
      data
    );

    // ==================================================
    // UPDATE USER
    // ==================================================

    await User.findByIdAndUpdate(
      userId,
      {
        name: data.name,
        email: data.email,
        registerNumber:
          data.registerNumber
      },
      {
        runValidators: true
      }
    );

    // ==================================================
    // UPDATE MENTOR PROFILE
    // ==================================================

    const profile =
      await MentorProfile.findOneAndUpdate(

        {
          userId
        },

        {
          name: data.name || "",

          age: data.age || "",

          registerNumber:
            data.registerNumber || "",

          department:
            data.department || "",

          className:
            data.className || "",

          section:
            data.section || "",

          phone:
            data.phone || "",

          email:
            data.email || "",

          address:
            data.address || "",

          profilePhoto:
            data.profilePhoto || ""
        },

        {
          new: true,
          upsert: true,
          runValidators: true
        }

      );

    res.status(200).json({

      message:
        "Mentor profile updated successfully",

      profile

    });

  } catch (error) {

    console.error(
      "UPDATE MENTOR PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};