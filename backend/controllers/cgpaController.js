const Cgpa = require("../models/Cgpa");


// Save CGPA
exports.saveCgpa = async (req, res) => {

  try {

    const userId = req.user.id;

    const cgpa = await Cgpa.findOneAndUpdate(

      { userId },

      req.body,

      { new: true, upsert: true }

    );

    res.json(cgpa);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};


// Get CGPA
exports.getCgpa = async (req, res) => {

  try {

    const userId = req.user.id;

    const cgpa = await Cgpa.findOne({ userId });

    res.json(cgpa);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};