import { useEffect, useState } from "react";
import axios from "axios";
import MentorLayout from "../../components/MentorLayout";

const API = "http://localhost:5000";

function MentorProfile() {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // ==================================================
  // FETCH MENTOR PROFILE
  // ==================================================

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/mentor/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data || {});
    } catch (error) {
      console.error("FETCH MENTOR PROFILE ERROR:", error.response || error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==================================================
  // HANDLE CHANGE
  // ==================================================

  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==================================================
  // PROFILE PHOTO UPLOAD
  // ==================================================

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const token = localStorage.getItem("token");

      const uploadData = new FormData();
      uploadData.append("photo", file);

      const res = await axios.post(
        `${API}/api/upload/mentor-profile-photo`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setData((prev) => ({
        ...prev,
        profilePhoto: res.data.url,
      }));

      alert("Profile photo uploaded successfully");
    } catch (error) {
      console.error("MENTOR PHOTO UPLOAD ERROR:", error.response || error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Photo upload failed",
      );
    }
  };

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${API}/api/mentor/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Mentor Profile Updated Successfully");

      setEditMode(false);

      // Fetch latest saved data
      await fetchProfile();
    } catch (error) {
      console.error("UPDATE MENTOR PROFILE ERROR:", error.response || error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Mentor profile update failed",
      );
    }
  };

  // ==================================================
  // CANCEL EDIT
  // ==================================================

  const handleCancel = async () => {
    setEditMode(false);

    // Restore original saved data
    await fetchProfile();
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (!data) {
    return (
      <MentorLayout>
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </MentorLayout>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <MentorLayout>
      <div className="space-y-6">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-orange-600">
              Mentor Profile
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your personal and contact information
            </p>
          </div>

          <div className="flex gap-3">
            {editMode && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
            >
              {editMode ? "Editing" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* ==================================================
            PROFILE PHOTO
        ================================================== */}

        <Card title="Profile Photo">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-orange-400 bg-gray-100 flex items-center justify-center">
              {data.profilePhoto ? (
                <img
                  src={data.profilePhoto}
                  alt="Mentor Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Profile</span>
              )}
            </div>

            {editMode && (
              <div>
                <label className="inline-block bg-orange-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-orange-700">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <p className="text-sm text-gray-500 mt-2">
                  JPG and PNG supported
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* ==================================================
            PERSONAL DETAILS
        ================================================== */}

        <Card title="Personal Details">
          <Grid>
            {/* NAME - NOT EDITABLE */}

            <Input
              label="Name"
              value={data.name}
              edit={false}
              onChange={() => {}}
            />

            {/* AGE - EDITABLE */}

            <Input
              label="Age"
              value={data.age}
              edit={editMode}
              onChange={(v) => handleChange("age", v)}
            />

            {/* DEPARTMENT - EDITABLE */}

            <DepartmentSelect
              value={data.department}
              edit={editMode}
              onChange={(v) => handleChange("department", v)}
            />

            {/* YEAR - EDITABLE DROPDOWN */}

            <SelectInput
              label="Year"
              value={data.year}
              edit={editMode}
              options={["1", "2", "3", "4"]}
              onChange={(v) => handleChange("year", v)}
            />

            {/* SECTION - EDITABLE DROPDOWN */}

            <SelectInput
              label="Section"
              value={data.section}
              edit={editMode}
              options={["A", "B", "C", "D", "E", "F"]}
              onChange={(v) => handleChange("section", v)}
            />
          </Grid>
        </Card>

        {/* ==================================================
            CONTACT
        ================================================== */}

        <Card title="Contact">
          <Grid>
            {/* PHONE */}

            <Input
              label="Phone Number"
              value={data.phone}
              edit={editMode}
              onChange={(v) => handleChange("phone", v)}
            />

            {/* EMAIL - NOT EDITABLE */}

            <Input
              label="Email"
              value={data.email}
              edit={false}
              onChange={() => {}}
            />
          </Grid>

          {/* ADDRESS */}

          <div className="mt-6">
            <Input
              label="Address"
              value={data.address}
              edit={editMode}
              textarea
              onChange={(v) => handleChange("address", v)}
            />
          </div>
        </Card>

        {/* ==================================================
            SAVE
        ================================================== */}

        {editMode && (
          <div className="flex justify-end pb-8">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </MentorLayout>
  );
}

// ==================================================
// CARD COMPONENT
// ==================================================

const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow border">
    <h3 className="text-orange-600 font-semibold text-lg mb-5">{title}</h3>

    {children}
  </div>
);

// ==================================================
// GRID COMPONENT
// ==================================================

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
);

// ==================================================
// DEPARTMENT DROPDOWN
// ==================================================

const DepartmentSelect = ({ value, edit, onChange }) => {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">Department</p>

      {edit ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none bg-white"
        >
          <option value="">Select Department</option>

          <option value="AI&DS">AI & DS</option>

          <option value="CSE">CSE</option>

          <option value="ECE">ECE</option>

          <option value="EEE">EEE</option>

          <option value="MECH">Mechanical</option>

          <option value="CIVIL">Civil</option>
        </select>
      ) : (
        <p className="font-semibold text-gray-800 break-words bg-gray-50 p-2 rounded-lg">
          {value || "-"}
        </p>
      )}
    </div>
  );
};

// ==================================================
// YEAR / SECTION DROPDOWN
// ==================================================

const SelectInput = ({ label, value, edit, options, onChange }) => {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>

      {edit ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none bg-white"
        >
          <option value="">Select {label}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <p className="font-semibold text-gray-800 break-words bg-gray-50 p-2 rounded-lg">
          {value || "-"}
        </p>
      )}
    </div>
  );
};

// ==================================================
// INPUT COMPONENT
// ==================================================

const Input = ({ label, value, edit, onChange, textarea = false }) => {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>

      {edit ? (
        textarea ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows="3"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          />
        )
      ) : (
        <p className="font-semibold text-gray-800 break-words bg-gray-50 p-2 rounded-lg">
          {value || "-"}
        </p>
      )}
    </div>
  );
};

export default MentorProfile;
