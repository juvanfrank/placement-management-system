import { useState } from "react";
import StudentLayout from "../../components/StudentLayout";

function Profile() {

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    registerNumber: "",
    rollNumber: "",
    department: "",
    batch: "",
    dob: "",
    caste: "",
    bloodGroup: "",
    community: "",
    religion: "",
    studentPhone: "",
    parentPhone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Profile Updated Successfully ✅");
  };

  return (
    <StudentLayout>

      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-6">

        <div className="flex flex-col items-center">

          <img
            src={profilePhoto || "https://via.placeholder.com/120"}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-orange-500"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mt-2 text-sm"
          />

        </div>

        <div>

  <h2 className="text-2xl font-bold text-orange-600">
    {formData.fullName || "Student Name"}
  </h2>

  <p className="text-gray-500">
    Excel Engineering College
  </p>

  <p className="text-gray-600 text-sm mt-1">
    {formData.department || "Department"} | {formData.batch || "Batch"}
  </p>

</div>

      </div>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Student Profile 
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow space-y-8"
      >

        {/* Personal Details */}
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4">
            Personal Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
            <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
            <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
            <Input label="Community" name="community" value={formData.community} onChange={handleChange} />
            <Input label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
            <Input label="Caste" name="caste" value={formData.caste} onChange={handleChange} />
          </div>
        </div>

        {/* Academic Details */}
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4">
            Academic Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <Input label="Register Number" name="registerNumber" value={formData.registerNumber} onChange={handleChange} />

            <Input label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} />

            <Input label="Department" name="department" value={formData.department} onChange={handleChange} />

            <Input label="Batch (Example: 2022-2026)" name="batch" value={formData.batch} onChange={handleChange} />

            <Input label="Email ID" name="email" type="email" value={formData.email} onChange={handleChange} />

          </div>
        </div>

        {/* Parent Details */}
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4">
            Parent Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <Input label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />

            <Input label="Mother Name" name="motherName" value={formData.motherName} onChange={handleChange} />

            <Input label="Parent Contact Number" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />

          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4">
            Contact Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <Input label="Student Contact Number" name="studentPhone" value={formData.studentPhone} onChange={handleChange} />

          </div>

          <div className="mt-4">
            <label className="block text-gray-600 mb-1">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-8 py-2 rounded hover:bg-orange-700"
        >
          Update Profile
        </button>

      </form>

    </StudentLayout>
  );
}


/* Reusable Input Component */
function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-gray-600 mb-1">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}

export default Profile;