const User = require("../models/User");

// GET student profile
exports.getProfile = async (req, res) => {
  try {

    const userId = req.user.id || req.user.userId || req.user._id;

    const student = await User.findById(userId).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);

  } catch (error) {

    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });

  }
};


// UPDATE student profile
exports.updateProfile = async (req, res) => {

  try {

    const userId = req.user.id || req.user.userId || req.user._id;

    const student = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      student
    });

  } catch (error) {

    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });

  }

};