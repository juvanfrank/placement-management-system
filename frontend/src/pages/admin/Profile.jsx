import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

const API = "http://localhost:5000";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ==================================================
  // FETCH ADMIN PROFILE
  // ==================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${API}/api/admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ADMIN PROFILE:",
        response.data
      );

      setProfile(response.data);

      setEditData({
        name: response.data.name || "",
        email: response.data.email || "",
      });

    } catch (error) {
      console.error(
        "FETCH ADMIN PROFILE ERROR:",
        error.response || error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load profile"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // HANDLE EDIT INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================================
  // START EDITING
  // ==================================================

  const handleEdit = () => {
    setEditData({
      name: profile?.name || "",
      email: profile?.email || "",
    });

    setEditing(true);
  };

  // ==================================================
  // CANCEL EDITING
  // ==================================================

  const handleCancel = () => {
    setEditData({
      name: profile?.name || "",
      email: profile?.email || "",
    });

    setEditing(false);
  };

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      if (
        !editData.name.trim() ||
        !editData.email.trim()
      ) {
        alert("Name and email are required.");
        return;
      }

      const response = await axios.put(
        `${API}/api/admin/profile`,
        {
          name: editData.name,
          email: editData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ADMIN PROFILE UPDATE:",
        response.data
      );

      setProfile(response.data.admin);

      setEditing(false);

      alert(
        "Profile updated successfully 🎉"
      );

    } catch (error) {
      console.error(
        "UPDATE ADMIN PROFILE ERROR:",
        error.response || error
      );

      alert(
        error.response?.data?.message ||
        "Profile update failed"
      );

    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // PROFILE PHOTO UPLOAD
  // ==================================================

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // CHECK IMAGE
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // CHECK SIZE
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo must be less than 5 MB.");
      return;
    }

    try {
      setUploading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const uploadData = new FormData();

      uploadData.append(
        "photo",
        file
      );

      const response = await axios.post(
        `${API}/api/upload/admin-profile-photo`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "ADMIN PHOTO UPLOAD RESPONSE:",
        response.data
      );

      // UPDATE PROFILE PHOTO IMMEDIATELY
      setProfile((previous) => ({
        ...previous,
        profilePhoto:
          response.data.url,
      }));

      alert(
        "Profile photo uploaded successfully 🎉"
      );

    } catch (error) {
      console.error(
        "ADMIN PHOTO UPLOAD ERROR:",
        error.response || error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Photo upload failed"
      );

    } finally {
      setUploading(false);

      // RESET FILE INPUT
      e.target.value = "";
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600">
            Loading profile...
          </p>
        </div>
      </AdminLayout>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </AdminLayout>
    );
  }

  // ==================================================
  // PROFILE
  // ==================================================

  return (
    <AdminLayout>

      {/* ============================================== */}
      {/* PAGE HEADER */}
      {/* ============================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-orange-600">
              Admin Profile
            </h2>

            <p className="text-gray-600 mt-2">
              Manage your personal information
            </p>
          </div>

          {!editing && (
            <button
              onClick={handleEdit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Edit Profile
            </button>
          )}

        </div>

      </div>

      {/* ============================================== */}
      {/* PROFILE PHOTO */}
      {/* ============================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h3 className="text-lg font-semibold text-orange-600 mb-4">
          Profile Photo
        </h3>

        <div className="flex items-center gap-6">

          {/* PHOTO */}

          {profile?.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt="Admin"
              className="w-28 h-28 rounded-full object-cover border-4 border-orange-500"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}

          {/* UPLOAD */}

          <div>

            <label
              htmlFor="admin-photo"
              className={`inline-block px-5 py-2 rounded-lg text-white cursor-pointer ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {uploading
                ? "Uploading..."
                : "Change Photo"}
            </label>

            <input
              id="admin-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />

            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG or other image files.
              Maximum 5 MB.
            </p>

          </div>

        </div>

      </div>

      {/* ============================================== */}
      {/* PERSONAL DETAILS */}
      {/* ============================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h3 className="text-lg font-semibold text-orange-600 mb-6">
          Personal Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NAME */}

          <div>

            <label className="text-sm text-gray-500">
              Name
            </label>

            {editing ? (

              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />

            ) : (

              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                {profile?.name || "-"}
              </div>

            )}

          </div>

          {/* EMAIL */}

          <div>

            <label className="text-sm text-gray-500">
              Email
            </label>

            {editing ? (

              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />

            ) : (

              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                {profile?.email || "-"}
              </div>

            )}

          </div>

          {/* ROLE */}

          <div>

            <label className="text-sm text-gray-500">
              Role
            </label>

            <div className="mt-1 p-3 bg-gray-50 rounded-lg capitalize">
              {profile?.role || "Admin"}
            </div>

          </div>

        </div>

        {/* ============================================ */}
        {/* SAVE / CANCEL */}
        {/* ============================================ */}

        {editing && (

          <div className="flex gap-4 mt-8">

            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </button>

          </div>

        )}

      </div>

    </AdminLayout>
  );
}

export default Profile;