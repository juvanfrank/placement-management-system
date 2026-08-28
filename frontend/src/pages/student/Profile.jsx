
import { useEffect, useState } from "react";
import axios from "axios";
import StudentLayout from "../../components/StudentLayout";

const API = "http://localhost:5000";

function Profile() {

const [formData,setFormData]=useState({

name:"",
email:"",
registerNumber:"",

dob:"",
gender:"",
rollNumber:"",
department:"",
currentYear:"",
section:"",
batch:"",

religion:"",
caste:"",
community:"",

studentPhone:"",
address:"",

tenthPercentage:"",
twelthPercentage:"",
diplomaPercentage:"",
currentArrears:"",
historyOfArrears:"",
cgpa:"",

resumeLink:"",
linkedinLink:"",
githubLink:"",
portfolioLink:"",
skills:"",
internship:"",   // ✅ added
placementStatus:"Not Placed",

fatherName:"",
motherName:"",
fatherPhone:"",
motherPhone:"",

profilePhoto:""

});


useEffect(()=>{

const fetchProfile=async()=>{

try{

const token=localStorage.getItem("token");

const res=await axios.get(`${API}/api/student/profile`,{
headers:{Authorization:`Bearer ${token}`}
});

let data=res.data||{};

if(data.dob){
data.dob=data.dob.substring(0,10);
}

if(Array.isArray(data.skills)){
data.skills=data.skills.join(",");
}

if(Array.isArray(data.internship)){
data.internship=data.internship.join(",");
}

setFormData(prev=>({
...prev,
...data
}));

}catch(error){
console.error("Profile fetch error:",error);
}

};

fetchProfile();

},[]);


const handleChange=(e)=>{

const {name,value}=e.target;

setFormData(prev=>({
...prev,
[name]:value
}));

};


const handlePhotoUpload=async(e)=>{

const file=e.target.files[0];
if(!file) return;

try{

const token=localStorage.getItem("token");

const uploadData=new FormData();
uploadData.append("photo",file);

const res=await axios.post(
`${API}/api/upload/profile-photo`,
uploadData,
{
headers:{
Authorization:`Bearer ${token}`,
"Content-Type":"multipart/form-data"
}
}
);

setFormData(prev=>({
...prev,
profilePhoto:res.data.url
}));

}catch(error){
console.error("Photo upload error:",error);
}

};


const handleResumeUpload=async(e)=>{

const file=e.target.files[0];
if(!file) return;

try{

const token=localStorage.getItem("token");

const uploadData=new FormData();
uploadData.append("resume",file);

const res=await axios.post(
`${API}/api/upload/resume`,
uploadData,
{
headers:{
Authorization:`Bearer ${token}`,
"Content-Type":"multipart/form-data"
}
}
);

setFormData(prev=>({
...prev,
resumeLink:res.data.url
}));

}catch(error){
console.error("Resume upload error:",error);
}

};


const handleSubmit=async(e)=>{

e.preventDefault();

try{

const token=localStorage.getItem("token");

const submitData={
...formData,
skills: formData.skills
? formData.skills.split(",").map(s=>s.trim())
: [],
internship: formData.internship
? formData.internship.split(",").map(s=>s.trim())
: []
};

await axios.put(
`${API}/api/student/profile`,
submitData,
{
headers:{Authorization:`Bearer ${token}`}
}
);

alert("Profile updated successfully");

}catch(error){

console.error("Update error:",error);
alert("Profile update failed");

}

};


return(

<StudentLayout>

<div className="bg-white shadow-lg rounded-xl p-8 mt-8 max-h-[85vh] overflow-y-auto">

<h2 className="text-xl font-bold text-orange-600 mb-6">
Student Profile
</h2>

<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

{/* PROFILE HEADER */}

<div className="col-span-2 flex items-center gap-8 bg-gray-50 p-6 rounded-xl shadow-sm">

  {/* PROFILE IMAGE */}
  <div className="flex flex-col items-center">

    <img
      src={
        formData.profilePhoto ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }
      alt="profile"
      className="w-32 h-32 rounded-full object-cover border-4 border-orange-400"
    />

    {/* UPLOAD BOX */}
  <label>

    <p className="text-orange-600 font-semibold">
      Click to Upload Photo
    </p>

    <p className="text-sm text-gray-500">
      JPG, PNG supported
    </p>

    <input
      type="file"
      accept="image/*"
      onChange={handlePhotoUpload}
      className="hidden"
    />

  </label>

  </div>

  {/* STUDENT DETAILS */}
  <div>

    <h2 className="text-2xl font-bold text-orange-600">
      {formData.name || "Student Name"}
    </h2>

    <p className="text-gray-600">
      Excel Engineering College
    </p>

    <p className="text-gray-500">
      {formData.department || "Department"} | {formData.batch || "Batch"}
    </p>

  </div>

</div>
{/* PERSONAL */}

<label className="font-semibold col-span-2">Personal Details</label>

<input name="name" placeholder="Full Name" value={formData.name||""} onChange={handleChange} className="border p-2"/>
<input type="date" name="dob" value={formData.dob||""} onChange={handleChange} className="border p-2"/>
<input name="gender" placeholder="Gender" value={formData.gender||""} onChange={handleChange} className="border p-2"/>
<input name="registerNumber" placeholder="Register Number" value={formData.registerNumber||""} onChange={handleChange} className="border p-2"/>

<input name="rollNumber" placeholder="Roll Number" value={formData.rollNumber||""} onChange={handleChange} className="border p-2"/>
<input name="department" placeholder="Department" value={formData.department||""} onChange={handleChange} className="border p-2"/>
<input name="currentYear" placeholder="Current Year" value={formData.currentYear||""} onChange={handleChange} className="border p-2"/>
<input name="section" placeholder="Section" value={formData.section||""} onChange={handleChange} className="border p-2"/>
<input name="batch" placeholder="Batch" value={formData.batch||""} onChange={handleChange} className="border p-2"/>

{/* CONTACT */}

<label className="font-semibold col-span-2">Contact Details</label>

<input name="studentPhone" placeholder="Student Phone" value={formData.studentPhone||""} onChange={handleChange} className="border p-2"/>
<input name="email" placeholder="Email" value={formData.email||""} onChange={handleChange} className="border p-2"/>
<textarea name="address" placeholder="Address" value={formData.address||""} onChange={handleChange} className="border p-2 col-span-2"/>

{/* ACADEMIC */}

<label className="font-semibold col-span-2">Academic Details</label>

<input name="tenthPercentage" placeholder="10th %" value={formData.tenthPercentage||""} onChange={handleChange} className="border p-2"/>
<input name="twelthPercentage" placeholder="12th %" value={formData.twelthPercentage||""} onChange={handleChange} className="border p-2"/>
<input name="diplomaPercentage" placeholder="Diploma %" value={formData.diplomaPercentage||""} onChange={handleChange} className="border p-2"/>
<input name="currentArrears" placeholder="Current Arrears" value={formData.currentArrears||""} onChange={handleChange} className="border p-2"/>
<input name="historyOfArrears" placeholder="History Of Arrears" value={formData.historyOfArrears||""} onChange={handleChange} className="border p-2"/>
<input name="cgpa" placeholder="CGPA" value={formData.cgpa||""} onChange={handleChange} className="border p-2"/>

{/* PROFESSIONAL */}

<label className="font-semibold col-span-2">Professional</label>

<div className="col-span-2">
<label>Upload Resume</label>
<input type="file" accept="application/pdf" onChange={handleResumeUpload}/>
{formData.resumeLink && <a href={formData.resumeLink} target="_blank">View Resume</a>}
</div>

<input name="linkedinLink" placeholder="LinkedIn" value={formData.linkedinLink||""} onChange={handleChange} className="border p-2"/>
<input name="githubLink" placeholder="GitHub" value={formData.githubLink||""} onChange={handleChange} className="border p-2"/>
<input name="portfolioLink" placeholder="Portfolio" value={formData.portfolioLink||""} onChange={handleChange} className="border p-2"/>
<input name="skills" placeholder="Skills" value={formData.skills||""} onChange={handleChange} className="border p-2"/>
<input name="internship" placeholder="Internship" value={formData.internship||""} onChange={handleChange} className="border p-2"/>

{/* PARENT */}

<label className="font-semibold col-span-2">Parent Details</label>

<input name="fatherName" placeholder="Father Name" value={formData.fatherName||""} onChange={handleChange} className="border p-2"/>
<input name="motherName" placeholder="Mother Name" value={formData.motherName||""} onChange={handleChange} className="border p-2"/>
<input name="fatherPhone" placeholder="Father Phone" value={formData.fatherPhone||""} onChange={handleChange} className="border p-2"/>
<input name="motherPhone" placeholder="Mother Phone" value={formData.motherPhone||""} onChange={handleChange} className="border p-2"/>

{/* PLACEMENT */}

<label className="font-semibold col-span-2">Placement</label>

<select name="placementStatus" value={formData.placementStatus||""} onChange={handleChange} className="border p-2">
<option value="Not Placed">Not Placed</option>
<option value="Placed">Placed</option>
<option value="Internship">Internship</option>
</select>

<button className="bg-orange-600 text-white py-3 rounded col-span-2 hover:bg-orange-700">
Update Profile
</button>

</form>

</div>

</StudentLayout>

);

}

export default Profile;
