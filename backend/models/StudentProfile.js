const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({

userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},

// Personal
name: String,
dob: String,
gender: String,
registerNumber: String,
rollNumber: String,
department: String,
currentYear: String,
section: String,
batch: String,

// Contact
studentPhone: String,
email: String,
address: String,

// Academic
tenthPercentage: String,
twelfthPercentage: String,
diplomaPercentage: String,
currentArrears: String,
historyOfArrears: String,

// Professional
resumeLink: String,
linkedinLink: String,
githubLink: String,
portfolioLink: String,

// Parent
fatherName: String,
motherName: String,
fatherPhone: String,
motherPhone: String,

// Other
profilePhoto: String

}, { timestamps: true });

module.exports = mongoose.model("StudentProfile", studentProfileSchema);