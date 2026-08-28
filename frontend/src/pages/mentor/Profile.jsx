import { useState } from "react";
import MentorLayout from "../../components/MentorLayout";

function MentorProfile() {

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    registerNumber: "",
    department: "",
    className: "",
    section: "",
    phone: "",
    email: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
    alert("Mentor Profile Updated");
  };

  return (
    <MentorLayout>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Mentor Profile
      </h2>

      <div className="bg-white p-8 rounded-xl shadow">

        {/* Profile Section */}
        <div className="flex items-center gap-8 mb-8">

          <div className="flex flex-col items-center">

            <div className="w-32 h-32 rounded-full border-4 border-orange-500 overflow-hidden flex items-center justify-center bg-gray-100">

              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Profile</span>
              )}

            </div>

            {/* Upload Button */}
            <label className="mt-3 bg-orange-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-orange-700">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

          </div>

          {/* Live Preview */}
          <div>

            <h3 className="text-xl font-bold text-orange-600">
              {formData.name || "Mentor Name"}
            </h3>

            <p>Excel Engineering College</p>

            <p>
              {(formData.department || "Department")} |{" "}
              {(formData.className || "Class")} -{" "}
              {(formData.section || "Section")}
            </p>

          </div>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            <Input
              label="Mentor Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />

            <Input
              label="Register Number"
              name="registerNumber"
              value={formData.registerNumber}
              onChange={handleChange}
            />

            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />

            <Input
              label="Class Name"
              name="className"
              value={formData.className}
              onChange={handleChange}
            />

            <Input
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div>

            <label className="block text-gray-600 mb-1">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-400"
            />

          </div>

          <button
            type="submit"
            className="bg-orange-600 text-white px-8 py-2 rounded hover:bg-orange-700"
          >
            Update Profile
          </button>

        </form>

      </div>

    </MentorLayout>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>

      <label className="block text-gray-600 mb-1">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-400"
      />

    </div>
  );
}

export default MentorProfile;