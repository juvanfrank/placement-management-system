const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");


// GET student profile
exports.getProfile = async (req, res) => {

  try {

    const userId = req.user.id || req.user.userId || req.user._id;

    const user = await User.findById(userId).select("-password");

    let profile = await StudentProfile.findOne({ userId });

    if (!profile) {
      profile = await StudentProfile.create({ userId });
    }

    res.status(200).json({

      // User fields
      name: user.name,
      email: user.email,
      registerNumber: user.registerNumber,

      // Personal
      dob: profile.dob,
      gender: profile.gender,
      rollNumber: profile.rollNumber,
      department: profile.department,
      currentYear: profile.currentYear,
      section: profile.section,
      batch: profile.batch,

      // Contact
      studentPhone: profile.studentPhone,
      address: profile.address,

      // Academic
      tenthPercentage: profile.tenthPercentage,
      twelfthPercentage: profile.twelfthPercentage,
      diplomaPercentage: profile.diplomaPercentage,
      currentArrears: profile.currentArrears,
      historyOfArrears: profile.historyOfArrears,

      // Professional
      resumeLink: profile.resumeLink,
      linkedinLink: profile.linkedinLink,
      githubLink: profile.githubLink,
      portfolioLink: profile.portfolioLink,

      // Parent
      fatherName: profile.fatherName,
      motherName: profile.motherName,
      fatherPhone: profile.fatherPhone,
      motherPhone: profile.motherPhone

    });

  } catch (error) {

    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });

  }

};



// UPDATE student profile
exports.updateProfile = async (req, res) => {

  try {

    const userId = req.user.id || req.user.userId || req.user._id;

    const {
      name,
      email,
      registerNumber,

      dob,
      gender,
      rollNumber,
      department,
      currentYear,
      section,
      batch,

      studentPhone,
      address,

      tenthPercentage,
      twelfthPercentage,
      diplomaPercentage,
      currentArrears,
      historyOfArrears,

      resumeLink,
      linkedinLink,
      githubLink,
      portfolioLink,

      fatherName,
      motherName,
      fatherPhone,
      motherPhone

    } = req.body;

    // Update basic user details
    await User.findByIdAndUpdate(userId, {
      name,
      email,
      registerNumber
    });

    // Update student profile
    const profile = await StudentProfile.findOneAndUpdate(

      { userId },

      {
        dob,
        gender,
        rollNumber,
        department,
        currentYear,
        section,
        batch,

        studentPhone,
        address,

        tenthPercentage,
        twelfthPercentage,
        diplomaPercentage,
        currentArrears,
        historyOfArrears,

        resumeLink,
        linkedinLink,
        githubLink,
        portfolioLink,

        fatherName,
        motherName,
        fatherPhone,
        motherPhone
      },

      {
        new: true,
        upsert: true
      }

    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {

    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });

  }

};