const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");


// ================= GET PROFILE =================

exports.getProfile = async (req,res)=>{

try{

const userId = req.user.id || req.user.userId || req.user._id;

const user = await User.findById(userId).select("-password");

let profile = await StudentProfile.findOne({userId});

if(!profile){
profile = await StudentProfile.create({userId});
}

res.status(200).json({

name:user.name,
email:user.email,
registerNumber:user.registerNumber,

dob:profile.dob,
gender:profile.gender,
rollNumber:profile.rollNumber,
department:profile.department,
currentYear:profile.currentYear,
section:profile.section,
batch:profile.batch,

religion:profile.religion,
caste:profile.caste,
community:profile.community,

cgpa:profile.cgpa,
skills:profile.skills,
internship:profile.internship,   // ✅ added
placementStatus:profile.placementStatus,

studentPhone:profile.studentPhone,
address:profile.address,

tenthPercentage:profile.tenthPercentage,
twelthPercentage:profile.twelthPercentage,
diplomaPercentage:profile.diplomaPercentage,
currentArrears:profile.currentArrears,
historyOfArrears:profile.historyOfArrears,

resumeLink:profile.resumeLink,
linkedinLink:profile.linkedinLink,
githubLink:profile.githubLink,
portfolioLink:profile.portfolioLink,

fatherName:profile.fatherName,
motherName:profile.motherName,
fatherPhone:profile.fatherPhone,
motherPhone:profile.motherPhone,

profilePhoto:profile.profilePhoto

});

}catch(error){

console.error("GET PROFILE ERROR:",error);
res.status(500).json({message:"Server error"});

}

};


// ================= UPDATE PROFILE =================

exports.updateProfile = async (req,res)=>{

try{

const userId = req.user.id || req.user.userId || req.user._id;

console.log("REQ BODY:", req.body); // ✅ debug

let data = req.body;

// convert strings to arrays if needed
if(typeof data.skills === "string"){
data.skills = data.skills.split(",").map(s=>s.trim());
}

if(typeof data.internship === "string"){
data.internship = data.internship.split(",").map(s=>s.trim());
}

// update user
await User.findByIdAndUpdate(userId,{
name:data.name,
email:data.email,
registerNumber:data.registerNumber
});

// update profile
const profile = await StudentProfile.findOneAndUpdate(

{userId},

{
dob:data.dob,
gender:data.gender,
rollNumber:data.rollNumber,
department:data.department,
currentYear:data.currentYear,
section:data.section,
batch:data.batch,

religion:data.religion,
caste:data.caste,
community:data.community,

cgpa:data.cgpa,
skills:data.skills || [],
internship:data.internship || [],   // ✅ added

placementStatus:data.placementStatus,

studentPhone:data.studentPhone,
address:data.address,

tenthPercentage:data.tenthPercentage,
twelthPercentage:data.twelthPercentage,
diplomaPercentage:data.diplomaPercentage,
currentArrears:data.currentArrears,
historyOfArrears:data.historyOfArrears,

resumeLink:data.resumeLink,
linkedinLink:data.linkedinLink,
githubLink:data.githubLink,
portfolioLink:data.portfolioLink,

fatherName:data.fatherName,
motherName:data.motherName,
fatherPhone:data.fatherPhone,
motherPhone:data.motherPhone,

profilePhoto:data.profilePhoto

},

{
returnDocument:"after",   // ✅ fixed
runValidators:true,
upsert:true
}

);

res.status(200).json({
message:"Profile updated successfully",
profile
});

}catch(error){

console.error("UPDATE PROFILE ERROR:",error);
res.status(500).json({message:"Server error"});

}

};