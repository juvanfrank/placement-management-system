import { useEffect, useState } from "react";
import axios from "axios";
import StudentLayout from "../../components/StudentLayout";
import ChangePassword from "../../components/ChangePassword";

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

      // DOB
      if (profile.dob) {
        profile.dob = profile.dob.substring(0, 10);
      }

      // Skills
      if (!Array.isArray(profile.skills)) {
        profile.skills = profile.skills
          ? profile.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      }

      // Internship
      if (Array.isArray(profile.internship)) {
        profile.internship = profile.internship.map((item) => {
          if (typeof item === "object") {
            return item;
          }

          const parts = item.split(" | ");

          return {
            companyName: parts[0] || "",
            domainName: parts[1] || "",
            fromDate: parts[2] || "",
            toDate: parts[3] || "",
          };
        });
      } else {
        profile.internship = [];
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
        }
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
  // ADD INTERNSHIP
  // ==================================================

  const addInternship = () => {
    setData((prev) => ({
      ...prev,
      internship: [
        ...(prev.internship || []),
        {
          companyName: "",
          domainName: "",
          fromDate: "",
          toDate: "",
        },
      ],
    }));
  };

  // ==================================================
  // UPDATE INTERNSHIP
  // ==================================================

  const updateInternship = (index, field, value) => {
    setData((prev) => {
      const internships = [...(prev.internship || [])];

      internships[index] = {
        ...internships[index],
        [field]: value,
      };

      return {
        ...prev,
        internship: internships,
      };
    });
  };

  // ==================================================
  // REMOVE INTERNSHIP
  // ==================================================

  const removeInternship = (index) => {
    setData((prev) => ({
      ...prev,
      internship: (prev.internship || []).filter((_, i) => i !== index),
    }));
  };

  // ==================================================
  // ADD SKILL
  // ==================================================

  const addSkill = () => {
    setData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), ""],
    }));
  };

  // ==================================================
  // UPDATE SKILL
  // ==================================================

  const updateSkill = (index, value) => {
    setData((prev) => {
      const skills = [...(prev.skills || [])];

      skills[index] = value.trimStart().toLowerCase();

      return {
        ...prev,
        skills,
      };
    });
  };

  // ==================================================
  // REMOVE SKILL
  // ==================================================

  const removeSkill = (index) => {
    setData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index),
    }));
  };

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      // ==================================================
      // CLEAN SKILLS
      // ==================================================

      const cleanedSkills = [
        ...new Set(
          (data.skills || [])
            .map((skill) => String(skill).trim().toLowerCase())
            .filter(Boolean)
        ),
      ];

      // ==================================================
      // CLEAN INTERNSHIP DATA
      // ==================================================

      const internshipData = (data.internship || [])
        .filter(
          (intern) =>
            intern.companyName ||
            intern.domainName ||
            intern.fromDate ||
            intern.toDate
        )
        .map(
          (intern) =>
            `${intern.companyName || ""} | ${
              intern.domainName || ""
            } | ${intern.fromDate || ""} | ${intern.toDate || ""}`
        );

      // ==================================================
      // FINAL DATA
      // ==================================================

      const submitData = {
        ...data,

        skills: cleanedSkills,

        internship: internshipData,

        religion: data.religion || undefined,
        caste: data.caste || undefined,
        community: data.community || undefined,

        // RESUME DRIVE LINK
        resumeLink: data.resumeLink || "",

        // NEW PLACEMENT PROFILE FIELDS
        aadharNumber: data.aadharNumber || "",
        pincode: data.pincode || "",
        district: data.district || "",
        state: data.state || "",
        languagesKnown: data.languagesKnown || "",
        hostelerDayScholar: data.hostelerDayScholar || "",
        parentsNumber: data.parentsNumber || "",
        mediumOfStudy: data.mediumOfStudy || "",
        tenthBoard: data.tenthBoard || "",
        twelthBoard: data.twelthBoard || "",
        diplomaCollege: data.diplomaCollege || "",
        diplomaDegreePercentage: data.diplomaDegreePercentage || "",
        fatherOccupation: data.fatherOccupation || "",
      };

      // ==================================================
      // UPDATE PROFILE
      // ==================================================

      await axios.put(`${API}/api/student/profile`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile Updated Successfully");

      setEditMode(false);

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
              {editMode ? "Close Edit" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* ==================================================
            PROFILE PHOTO
        ================================================== */}

        <div className="bg-gray-50 p-6 rounded-2xl shadow border">
          <h3 className="text-orange-600 font-semibold mb-4">
            Profile Photo
          </h3>

          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-orange-500 bg-gray-200 flex items-center justify-center">
              {data.profilePhoto ? (
                <img
                  src={data.profilePhoto}
                  alt="Student Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Photo</span>
              )}
            </div>

            {editMode && (
              <label className="cursor-pointer bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600">
                Upload Photo

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* ==================================================
            PERSONAL DETAILS
        ================================================== */}

        <Card title="Personal Details">
          <Grid>

            <Input
              label="Name"
              value={data.name}
              edit={false}
              onChange={() => {}}
            />

            <Input
              label="Email"
              value={data.email}
              edit={false}
              onChange={() => {}}
            />

            <Input
              label="Register Number"
              value={data.registerNumber}
              edit={false}
              onChange={() => {}}
            />

            <Input
              label="DOB"
              type="date"
              value={data.dob ? data.dob.substring(0, 10) : ""}
              edit={editMode}
              onChange={(v) => handleChange("dob", v)}
            />

            <div>
              <p className="text-gray-500 text-sm mb-1">Gender</p>

              {editMode ? (
                <select
                  value={data.gender || ""}
                  onChange={(e) =>
                    handleChange("gender", e.target.value)
                  }
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                >
                  <option value="">Select Gender</option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="font-semibold text-gray-800">
                  {data.gender || "-"}
                </p>
              )}
            </div>

            <Input
              label="Roll Number"
              value={data.rollNumber}
              edit={editMode}
              onChange={(v) => handleChange("rollNumber", v)}
            />

            <Input
              label="Department"
              value={data.department}
              edit={false}
              onChange={() => {}}
            />

            <SelectInput
              label="Current Year"
              value={data.currentYear}
              edit={editMode}
              options={["1", "2", "3", "4"]}
              onChange={(v) => handleChange("currentYear", v)}
            />

            <SelectInput
              label="Section"
              value={data.section}
              edit={editMode}
              options={["A", "B", "C", "D", "E", "F"]}
              onChange={(v) => handleChange("section", v)}
            />

            <Input
              label="Batch"
              value={data.batch}
              edit={editMode}
              onChange={(v) => handleChange("batch", v)}
            />

            <Input
              label="Aadhar Number"
              value={data.aadharNumber}
              edit={editMode}
              onChange={(v) => handleChange("aadharNumber", v)}
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
            CONTACT DETAILS
        ================================================== */}

        <Card title="Contact Details">
          <Grid>

            <Input
              label="Phone"
              value={data.studentPhone}
              edit={editMode}
              onChange={(v) => handleChange("studentPhone", v)}
            />

            <Input
              label="Address"
              value={data.address}
              edit={editMode}
              onChange={(v) => handleChange("address", v)}
            />

            <Input
              label="Pincode"
              value={data.pincode}
              edit={editMode}
              onChange={(v) => handleChange("pincode", v)}
            />

            <Input
              label="District"
              value={data.district}
              edit={editMode}
              onChange={(v) => handleChange("district", v)}
            />

            <Input
              label="State"
              value={data.state}
              edit={editMode}
              onChange={(v) => handleChange("state", v)}
            />

            <Input
              label="Languages Known"
              value={data.languagesKnown}
              edit={editMode}
              onChange={(v) => handleChange("languagesKnown", v)}
            />

            <SelectInput
              label="Hosteler / Dayscholar"
              value={data.hostelerDayScholar}
              edit={editMode}
              options={["Hosteler", "Dayscholar"]}
              onChange={(v) =>
                handleChange("hostelerDayScholar", v)
              }
            />

            <Input
              label="Parents Number"
              value={data.parentsNumber}
              edit={editMode}
              onChange={(v) => handleChange("parentsNumber", v)}
            />

            <Input
              label="Email"
              value={data.email}
              edit={false}
              onChange={() => {}}
            />

          </Grid>
        </Card>

        {/* ==================================================
            ACADEMIC DETAILS
        ================================================== */}

        <Card title="Academic Details">
          <Grid>

            <SelectInput
              label="Medium of Study"
              value={data.mediumOfStudy}
              edit={editMode}
              options={["English", "Tamil"]}
              onChange={(v) => handleChange("mediumOfStudy", v)}
            />

            {/* 10TH DETAILS */}

            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-orange-600 border-b pb-2">
                10th Details
              </h4>
            </div>

            <SelectInput
              label="10th Board"
              value={data.tenthBoard}
              edit={editMode}
              options={[
                "CBSE",
                "ICSE",
                "State Board",
                "Matriculation",
                "NIOS",
                "Other",
              ]}
              onChange={(v) => handleChange("tenthBoard", v)}
            />

            <Input
              label="10th School Name"
              value={data.tenthSchoolName}
              edit={editMode}
              onChange={(v) =>
                handleChange("tenthSchoolName", v)
              }
            />

            <Input
              label="10th Percentage"
              value={data.tenthPercentage}
              edit={editMode}
              onChange={(v) =>
                handleChange("tenthPercentage", v)
              }
            />

            <Input
              label="10th Year of Passing"
              type="number"
              value={data.tenthCompletionYear}
              edit={editMode}
              onChange={(v) =>
                handleChange("tenthCompletionYear", v)
              }
            />

            {/* 12TH DETAILS */}

            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-orange-600 border-b pb-2 mt-3">
                12th Details
              </h4>
            </div>

            <SelectInput
              label="12th Board"
              value={data.twelthBoard}
              edit={editMode}
              options={[
                "CBSE",
                "ICSE",
                "State Board",
                "Matriculation",
                "NIOS",
                "Other",
              ]}
              onChange={(v) =>
                handleChange("twelthBoard", v)
              }
            />

            <Input
              label="12th School Name"
              value={data.twelthSchoolName}
              edit={editMode}
              onChange={(v) =>
                handleChange("twelthSchoolName", v)
              }
            />

            <Input
              label="12th Percentage"
              value={data.twelthPercentage}
              edit={editMode}
              onChange={(v) =>
                handleChange("twelthPercentage", v)
              }
            />

            <Input
              label="12th Year of Passing"
              type="number"
              value={data.twelthCompletionYear}
              edit={editMode}
              onChange={(v) =>
                handleChange("twelthCompletionYear", v)
              }
            />

            {/* DIPLOMA DETAILS */}

            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-orange-600 border-b pb-2 mt-3">
                Diploma Details
              </h4>
            </div>

            <Input
              label="Diploma Percentage"
              value={data.diplomaPercentage}
              edit={editMode}
              onChange={(v) =>
                handleChange("diplomaPercentage", v)
              }
            />

            <Input
              label="Diploma School / College / University"
              value={data.diplomaCollege}
              edit={editMode}
              onChange={(v) =>
                handleChange("diplomaCollege", v)
              }
            />

            <Input
              label="Diploma Year of Passing"
              type="number"
              value={data.diplomaCompletionYear}
              edit={editMode}
              onChange={(v) =>
                handleChange("diplomaCompletionYear", v)
              }
            />

            <Input
              label="Diploma Degree Percentage"
              value={data.diplomaDegreePercentage}
              edit={editMode}
              onChange={(v) =>
                handleChange("diplomaDegreePercentage", v)
              }
            />

            <Input
              label="CGPA"
              value={data.cgpa}
              edit={editMode}
              onChange={(v) => handleChange("cgpa", v)}
            />

            <Input
              label="Current Arrears"
              type="number"
              value={data.currentArrears}
              edit={editMode}
              onChange={(v) =>
                handleChange("currentArrears", v)
              }
            />

            <SelectInput
              label="History of Arrears"
              value={data.historyOfArrears}
              edit={editMode}
              options={["Yes", "No"]}
              onChange={(v) => {
                setData((prev) => ({
                  ...prev,
                  historyOfArrears: v,
                  historyOfArrearsCount:
                    v === "No" ? "" : prev.historyOfArrearsCount,
                }));
              }}
            />

            {data.historyOfArrears === "Yes" && (
              <Input
                label="Number of History of Arrears"
                type="number"
                value={data.historyOfArrearsCount}
                edit={editMode}
                onChange={(v) =>
                  handleChange("historyOfArrearsCount", v)
                }
              />
            )}

          </Grid>
        </Card>

        {/* ==================================================
            PROFESSIONAL
        ================================================== */}

        <Card title="Professional">
          <Grid>

            {/* RESUME DRIVE LINK */}

            <LinkInput
              label="Resume Drive Link"
              value={data.resumeLink}
              edit={editMode}
              placeholder="https://drive.google.com/..."
              displayText="View Resume"
              onChange={(v) =>
                handleChange("resumeLink", v)
              }
            />

            {/* LINKEDIN */}

            <LinkInput
              label="LinkedIn"
              value={data.linkedinLink}
              edit={editMode}
              placeholder="https://linkedin.com/in/yourname"
              displayText="View LinkedIn"
              onChange={(v) =>
                handleChange("linkedinLink", v)
              }
            />

            {/* GITHUB */}

            <LinkInput
              label="GitHub"
              value={data.githubLink}
              edit={editMode}
              placeholder="https://github.com/yourname"
              displayText="View GitHub"
              onChange={(v) =>
                handleChange("githubLink", v)
              }
            />

            {/* PORTFOLIO */}

            <LinkInput
              label="Portfolio"
              value={data.portfolioLink}
              edit={editMode}
              placeholder="https://yourportfolio.com"
              displayText="View Portfolio"
              onChange={(v) =>
                handleChange("portfolioLink", v)
              }
            />

            {/* HACKERRANK */}

            <LinkInput
              label="HackerRank"
              value={data.hackerrankLink}
              edit={editMode}
              placeholder="https://hackerrank.com/yourname"
              displayText="View HackerRank"
              onChange={(v) =>
                handleChange("hackerrankLink", v)
              }
            />

            {/* LEETCODE */}

            <LinkInput
              label="LeetCode"
              value={data.leetcodeLink}
              edit={editMode}
              placeholder="https://leetcode.com/yourname"
              displayText="View LeetCode"
              onChange={(v) =>
                handleChange("leetcodeLink", v)
              }
            />

          </Grid>
        </Card>

        {/* ==================================================
            INTERNSHIP
        ================================================== */}

        <Card title="Internship">
          <div className="space-y-5">

            {(data.internship || []).map((intern, index) => (
              <div
                key={index}
                className="border rounded-xl p-5 bg-white"
              >
                <div className="flex justify-between items-center mb-4">

                  <h4 className="font-semibold text-gray-700">
                    Internship {index + 1}
                  </h4>

                  {editMode && (
                    <button
                      onClick={() => removeInternship(index)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  )}

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <Input
                    label="Company Name"
                    value={intern.companyName}
                    edit={editMode}
                    onChange={(v) =>
                      updateInternship(
                        index,
                        "companyName",
                        v
                      )
                    }
                  />

                  <Input
                    label="Domain Name"
                    value={intern.domainName}
                    edit={editMode}
                    onChange={(v) =>
                      updateInternship(
                        index,
                        "domainName",
                        v
                      )
                    }
                  />

                  <Input
                    label="From Date"
                    type="date"
                    value={intern.fromDate}
                    edit={editMode}
                    onChange={(v) =>
                      updateInternship(
                        index,
                        "fromDate",
                        v
                      )
                    }
                  />

                  <Input
                    label="To Date"
                    type="date"
                    value={intern.toDate}
                    edit={editMode}
                    onChange={(v) =>
                      updateInternship(
                        index,
                        "toDate",
                        v
                      )
                    }
                  />

                </div>
              </div>
            ))}

            {editMode && (
              <button
                onClick={addInternship}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
              >
                + Add Another Internship
              </button>
            )}

            {!editMode &&
              (!data.internship ||
                data.internship.length === 0) && (
                <p className="text-gray-500">
                  No internship details added.
                </p>
              )}

          </div>
        </Card>

        {/* ==================================================
            SKILLS
        ================================================== */}

        <Card title="Skills">
          <div className="space-y-3">

            {(data.skills || []).map((skill, index) => (
              <div key={index} className="flex gap-3">

                <input
                  type="text"
                  value={skill}
                  disabled={!editMode}
                  onChange={(e) =>
                    updateSkill(index, e.target.value)
                  }
                  placeholder="Enter skill"
                  className="flex-1 border p-2 rounded-lg disabled:bg-gray-100"
                />

                {editMode && (
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-500 px-3"
                  >
                    Remove
                  </button>
                )}

              </div>
            ))}

            {editMode && (
              <button
                onClick={addSkill}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
              >
                + Add Skill
              </button>
            )}

            {!editMode &&
              (!data.skills || data.skills.length === 0) && (
                <p className="text-gray-500">
                  No skills added.
                </p>
              )}

          </div>
        </Card>

        {/* ==================================================
            PLACEMENT STATUS
        ================================================== */}

        <Card title="Placement Status">
          <SelectInput
            label="Status"
            value={data.placementStatus}
            edit={editMode}
            options={["Not Placed", "Placed", "Internship"]}
            onChange={(v) =>
              handleChange("placementStatus", v)
            }
          />
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
              onChange={(v) =>
                handleChange("fatherName", v)
              }
            />

            <Input
              label="Mother Name"
              value={data.motherName}
              edit={editMode}
              onChange={(v) =>
                handleChange("motherName", v)
              }
            />

            <Input
              label="Father Occupation"
              value={data.fatherOccupation}
              edit={editMode}
              onChange={(v) =>
                handleChange("fatherOccupation", v)
              }
            />

            <Input
              label="Father Phone"
              value={data.fatherPhone}
              edit={editMode}
              onChange={(v) =>
                handleChange("fatherPhone", v)
              }
            />

            <Input
              label="Mother Phone"
              value={data.motherPhone}
              edit={editMode}
              onChange={(v) =>
                handleChange("motherPhone", v)
              }
            />

          </Grid>
        </Card>

        {/* ==================================================
            SAVE BUTTON
        ================================================== */}

        {editMode && (
          <div className="flex justify-end">

            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-semibold"
            >
              Save Changes
            </button>

          </div>
        )}

      </div>
      { /* chnage password */}

      <ChangePassword />

    </StudentLayout>
  );
}

export default Profile;

// ==================================================
// CARD COMPONENT
// ==================================================

const Card = ({ title, children }) => (
  <div className="bg-gray-50 p-6 rounded-2xl shadow border">

    <h3 className="text-orange-600 font-semibold mb-4">
      {title}
    </h3>

    {children}

  </div>
);

// ==================================================
// GRID COMPONENT
// ==================================================

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-6">
    {children}
  </div>
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
}) => (
  <div>

    <p className="text-gray-500 text-sm mb-1">
      {label}
    </p>

    {edit ? (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
      />
    ) : (
      <p className="font-semibold text-gray-800">
        {value || "-"}
      </p>
    )}

  </div>
);

// ==================================================
// LINK INPUT COMPONENT
// ==================================================

const LinkInput = ({
  label,
  value,
  edit,
  onChange,
  placeholder,
  displayText,
}) => (
  <div>

    <p className="text-gray-500 text-sm mb-1">
      {label}
    </p>

    {edit ? (
      <input
        type="url"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
      />
    ) : value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-600 font-semibold hover:underline"
      >
        {displayText}
      </a>
    ) : (
      <p className="font-semibold text-gray-800">
        -
      </p>
    )}

  </div>
);

// ==================================================
// SELECT INPUT COMPONENT
// ==================================================

const SelectInput = ({
  label,
  value,
  edit,
  options,
  onChange,
}) => (
  <div>

    <p className="text-gray-500 text-sm mb-1">
      {label}
    </p>

    {edit ? (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-orange-400 outline-none"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <p className="font-semibold text-gray-800">
        {value || "-"}
      </p>
    )}

  </div>
);