import { useEffect, useState } from "react";
import axios from "axios";
import StudentLayout from "../../components/StudentLayout";

const API = "http://localhost:5000";

function Profile() {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // ==================================================
  // FETCH PROFILE
  // ==================================================

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/student/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile = res.data || {};

      if (profile.dob) {
        profile.dob = profile.dob.substring(0, 10);
      }

      if (Array.isArray(profile.skills)) {
        profile.skills = profile.skills.join(", ");
      }

      if (Array.isArray(profile.internship)) {
        profile.internship = profile.internship.join(", ");
      }

      setData(profile);
    } catch (error) {
      console.error("FETCH PROFILE ERROR:", error.response || error);
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
  // PHOTO UPLOAD
  // ==================================================

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const token = localStorage.getItem("token");

      const uploadData = new FormData();

      uploadData.append("photo", file);

      const res = await axios.post(
        `${API}/api/upload/profile-photo`,
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
      console.error("PHOTO UPLOAD ERROR:", error.response || error);

      alert(error.response?.data?.message || "Photo upload failed");
    }
  };

  // ==================================================
  // RESUME UPLOAD
  // ==================================================

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const token = localStorage.getItem("token");

      const uploadData = new FormData();

      uploadData.append("resume", file);

      const res = await axios.post(`${API}/api/upload/resume`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setData((prev) => ({
        ...prev,
        resumeLink: res.data.url,
      }));

      alert("Resume uploaded successfully");
    } catch (error) {
      console.error("RESUME UPLOAD ERROR:", error.response || error);

      alert(error.response?.data?.message || "Resume upload failed");
    }
  };

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const submitData = {
        ...data,

        skills: data.skills
          ? data.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],

        internship: data.internship
          ? data.internship
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

        // Prevent Mongoose enum validation error
        // for empty values.
        religion: data.religion || undefined,
        caste: data.caste || undefined,
        community: data.community || undefined,
      };

      await axios.put(`${API}/api/student/profile`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile Updated Successfully");

      setEditMode(false);

      // Reload latest saved data
      await fetchProfile();
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error.response || error);

      alert(error.response?.data?.message || "Profile update failed");
    }
  };

  // ==================================================
  // CANCEL EDIT
  // ==================================================

  const handleCancel = async () => {
    setEditMode(false);

    await fetchProfile();
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (!data) {
    return (
      <StudentLayout>
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </StudentLayout>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-orange-600">
              Student Profile
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your personal and academic information
            </p>
          </div>

          <div className="flex gap-3">
            {editMode && (
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}

            <button
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
                  alt="Student Profile"
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
            <Input
              label="Name"
              value={data.name}
              edit={editMode}
              onChange={(v) => handleChange("name", v)}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={data.dob ? data.dob.substring(0, 10) : ""}
              edit={editMode}
              onChange={(v) => handleChange("dob", v)}
            />

            <Input
              label="Gender"
              value={data.gender}
              edit={editMode}
              onChange={(v) => handleChange("gender", v)}
            />

            <Input
              label="Register Number"
              value={data.registerNumber}
              edit={editMode}
              onChange={(v) => handleChange("registerNumber", v)}
            />

            <Input
              label="Roll Number"
              value={data.rollNumber}
              edit={editMode}
              onChange={(v) => handleChange("rollNumber", v)}
            />

            <div>
              <p className="text-gray-500 text-sm">Department</p>
              <p className="font-semibold">{data.department || "-"}</p>
            </div>

            <Input
              label="Current Year"
              value={data.currentYear}
              edit={editMode}
              onChange={(v) => handleChange("currentYear", v)}
            />

            <Input
              label="Section"
              value={data.section}
              edit={editMode}
              onChange={(v) => handleChange("section", v)}
            />

            <Input
              label="Batch"
              value={data.batch}
              edit={editMode}
              onChange={(v) => handleChange("batch", v)}
            />

            <Input
              label="Religion"
              value={data.religion}
              edit={editMode}
              onChange={(v) => handleChange("religion", v)}
            />

            <Input
              label="Caste"
              value={data.caste}
              edit={editMode}
              onChange={(v) => handleChange("caste", v)}
            />

            <Input
              label="Community"
              value={data.community}
              edit={editMode}
              onChange={(v) => handleChange("community", v)}
            />
          </Grid>
        </Card>

        {/* ==================================================
            CONTACT
        ================================================== */}

        <Card title="Contact">
          <Grid>
            <Input
              label="Phone"
              value={data.studentPhone}
              edit={editMode}
              onChange={(v) => handleChange("studentPhone", v)}
            />

            <Input
              label="Email"
              value={data.email}
              edit={editMode}
              onChange={(v) => handleChange("email", v)}
            />
          </Grid>

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
            ACADEMIC
        ================================================== */}

        <Card title="Academic Details">
          <Grid>
            <Input
              label="10th Percentage"
              value={data.tenthPercentage}
              edit={editMode}
              onChange={(v) => handleChange("tenthPercentage", v)}
            />

            <Input
              label="12th Percentage"
              value={data.twelthPercentage}
              edit={editMode}
              onChange={(v) => handleChange("twelthPercentage", v)}
            />

            <Input
              label="Diploma Percentage"
              value={data.diplomaPercentage}
              edit={editMode}
              onChange={(v) => handleChange("diplomaPercentage", v)}
            />

            <Input
              label="Current Arrears"
              value={data.currentArrears}
              edit={editMode}
              onChange={(v) => handleChange("currentArrears", v)}
            />

            <Input
              label="History of Arrears"
              value={data.historyOfArrears}
              edit={editMode}
              onChange={(v) => handleChange("historyOfArrears", v)}
            />

            <Input
              label="CGPA"
              value={data.cgpa}
              edit={editMode}
              onChange={(v) => handleChange("cgpa", v)}
            />
          </Grid>
        </Card>

        {/* ==================================================
            PROFESSIONAL
        ================================================== */}

        <Card title="Professional">
          <Grid>
            <Input
              label="LinkedIn"
              value={data.linkedinLink}
              edit={editMode}
              onChange={(v) => handleChange("linkedinLink", v)}
            />

            <Input
              label="GitHub"
              value={data.githubLink}
              edit={editMode}
              onChange={(v) => handleChange("githubLink", v)}
            />

            <Input
              label="Portfolio"
              value={data.portfolioLink}
              edit={editMode}
              onChange={(v) => handleChange("portfolioLink", v)}
            />

            <Input
              label="Skills"
              value={data.skills}
              edit={editMode}
              onChange={(v) => handleChange("skills", v)}
            />

            <Input
              label="Internship"
              value={data.internship}
              edit={editMode}
              onChange={(v) => handleChange("internship", v)}
            />
          </Grid>

          {/* RESUME */}

          <div className="mt-6">
            <p className="text-gray-500 text-sm mb-2">Resume</p>

            {data.resumeLink && (
              <a
                href={data.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 font-semibold hover:underline mr-4"
              >
                View Resume
              </a>
            )}

            {editMode && (
              <label className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700">
                Upload Resume
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* PLACEMENT */}

          <div className="mt-6">
            <p className="text-gray-500 text-sm mb-2">Placement Status</p>

            {editMode ? (
              <select
                value={data.placementStatus || "Not Placed"}
                onChange={(e) =>
                  handleChange("placementStatus", e.target.value)
                }
                className="border p-2 rounded-lg w-full md:w-1/2"
              >
                <option value="Not Placed">Not Placed</option>

                <option value="Placed">Placed</option>

                <option value="Internship">Internship</option>
              </select>
            ) : (
              <p className="font-semibold">{data.placementStatus || "-"}</p>
            )}
          </div>
        </Card>

        {/* ==================================================
            PARENT / GUARDIAN
        ================================================== */}

        <Card title="Parent / Guardian">
          <Grid>
            <Input
              label="Father Name"
              value={data.fatherName}
              edit={editMode}
              onChange={(v) => handleChange("fatherName", v)}
            />

            <Input
              label="Mother Name"
              value={data.motherName}
              edit={editMode}
              onChange={(v) => handleChange("motherName", v)}
            />

            <Input
              label="Father Phone"
              value={data.fatherPhone}
              edit={editMode}
              onChange={(v) => handleChange("fatherPhone", v)}
            />

            <Input
              label="Mother Phone"
              value={data.motherPhone}
              edit={editMode}
              onChange={(v) => handleChange("motherPhone", v)}
            />
          </Grid>
        </Card>

        {/* ==================================================
            SAVE
        ================================================== */}

        {editMode && (
          <div className="flex justify-end pb-8">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
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
// INPUT COMPONENT
// ==================================================

const Input = ({
  label,
  value,
  edit,
  onChange,
  type = "text",
  textarea = false,
}) => {
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
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          />
        )
      ) : (
        <p className="font-semibold text-gray-800 break-words">
          {value || "-"}
        </p>
      )}
    </div>
  );
};

export default Profile;
