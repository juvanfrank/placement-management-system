import { useEffect, useState } from "react";
import axios from "axios";
import StudentLayout from "../../components/StudentLayout";

function Profile() {

const [formData, setFormData] = useState({

name: "",
email: "",
registerNumber: "",

dob: "",
gender: "",
rollNumber: "",
department: "",
currentYear: "",
section: "",
batch: "",

studentPhone: "",
address: "",

tenthPercentage: "",
twelfthPercentage: "",
diplomaPercentage: "",
currentArrears: "",
historyOfArrears: "",

resumeLink: "",
linkedinLink: "",
githubLink: "",
portfolioLink: "",

fatherName: "",
motherName: "",
fatherPhone: "",
motherPhone: "",

profilePhoto: ""

});

const [photo, setPhoto] = useState(null);

useEffect(() => {

const fetchProfile = async () => {

try {

const token = localStorage.getItem("token");

const res = await axios.get(
"http://localhost:5000/api/student/profile",
{
headers: {
Authorization: `Bearer ${token}`
}
}
);

setFormData(res.data);

} catch (error) {
console.error(error);
}

};

fetchProfile();

}, []);

const handleChange = (e) => {

setFormData({
...formData,
[e.target.name]: e.target.value
});

};

const handlePhotoChange = (e) => {

const file = e.target.files[0];

if (file) {
setPhoto(URL.createObjectURL(file));
}

};

const handleSubmit = async (e) => {

e.preventDefault();

try {

const token = localStorage.getItem("token");

await axios.put(
"http://localhost:5000/api/student/profile",
formData,
{
headers: {
Authorization: `Bearer ${token}`
}
}
);

alert("Profile updated");

} catch (error) {

console.error(error);

}

};

return (

<StudentLayout>

{/* PROFILE PHOTO */}
<div className="flex items-center gap-8 mt-8">

<div className="relative">

<label htmlFor="photoUpload">

<div className="w-32 h-32 rounded-full border-4 border-orange-500 overflow-hidden flex items-center justify-center cursor-pointer bg-gray-100">

{photo ? (
<img
src={photo}
alt="profile"
className="w-full h-full object-cover"
/>
) : (
"Profile"
)}

</div>

</label>

<input
id="photoUpload"
type="file"
accept="image/*"
className="hidden"
onChange={handlePhotoChange}
/>

</div>

<div>

<h2 className="text-2xl font-bold text-orange-600">
{formData.name || "Student Name"}
</h2>

<p className="text-gray-600">
Excel Engineering College
</p>

<p className="text-gray-500">
{formData.department || "Department"} | {formData.batch}
</p>

</div>

</div>


{/* PROFILE FORM */}

<div className="bg-white shadow-lg rounded-xl p-8 mt-8">

<h2 className="text-xl font-bold text-orange-600 mb-6">
Student Profile
</h2>

<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

{/* PERSONAL */}

<div>
<label>Full Name</label>
<input name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Date of Birth</label>
<input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Gender</label>
<input name="gender" value={formData.gender} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Register Number</label>
<input name="registerNumber" value={formData.registerNumber} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Roll Number</label>
<input name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Department</label>
<input name="department" value={formData.department} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Current Year</label>
<input name="currentYear" value={formData.currentYear} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Section</label>
<input name="section" value={formData.section} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Batch</label>
<input name="batch" value={formData.batch} onChange={handleChange} className="border p-2 w-full"/>
</div>

{/* CONTACT */}

<div>
<label>Student Phone</label>
<input name="studentPhone" value={formData.studentPhone} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Email</label>
<input name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div className="col-span-2">
<label>Address</label>
<textarea name="address" value={formData.address} onChange={handleChange} className="border p-2 w-full"/>
</div>

{/* ACADEMIC */}

<div>
<label>10th Percentage</label>
<input name="tenthPercentage" value={formData.tenthPercentage} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>12th Percentage</label>
<input name="twelfthPercentage" value={formData.twelfthPercentage} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Diploma Percentage</label>
<input name="diplomaPercentage" value={formData.diplomaPercentage} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Current Arrears</label>
<input name="currentArrears" value={formData.currentArrears} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>History of Arrears</label>
<input name="historyOfArrears" value={formData.historyOfArrears} onChange={handleChange} className="border p-2 w-full"/>
</div>

{/* PROFESSIONAL */}

<div>
<label>Resume Link</label>
<input name="resumeLink" value={formData.resumeLink} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>LinkedIn</label>
<input name="linkedinLink" value={formData.linkedinLink} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>GitHub</label>
<input name="githubLink" value={formData.githubLink} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Portfolio</label>
<input name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} className="border p-2 w-full"/>
</div>

{/* PARENT */}

<div>
<label>Father Name</label>
<input name="fatherName" value={formData.fatherName} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Mother Name</label>
<input name="motherName" value={formData.motherName} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Father Phone</label>
<input name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} className="border p-2 w-full"/>
</div>

<div>
<label>Mother Phone</label>
<input name="motherPhone" value={formData.motherPhone} onChange={handleChange} className="border p-2 w-full"/>
</div>

<button className="bg-orange-600 text-white py-3 rounded col-span-2 hover:bg-orange-700">
Update Profile
</button>

</form>

</div>

</StudentLayout>

);

}

export default Profile;