import { useEffect, useState } from "react";
import axios from "axios";
import HodLayout from "../../components/HodLayout";

const API = "http://localhost:5000";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // ==================================================
  // FETCH HOD PROFILE
  // ==================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${API}/api/hod/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "HOD PROFILE:",
        response.data
      );

      setProfile(response.data);

    } catch (error) {
      console.error(
        "FETCH HOD PROFILE ERROR:",
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
  // PROFILE PHOTO UPLOAD
  // ==================================================

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Check size
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
        `${API}/api/upload/hod-profile-photo`,
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
        "HOD PHOTO UPLOAD RESPONSE:",
        response.data
      );

      // Immediately update image
      setProfile((previous) => ({
        ...previous,
        profilePhoto:
          response.data.url,
      }));

      alert(
        "Profile photo uploaded successfully"
      );

    } catch (error) {
      console.error(
        "HOD PHOTO UPLOAD ERROR:",
        error.response || error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Photo upload failed"
      );
    } finally {
      setUploading(false);

      // Reset input
      e.target.value = "";
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <HodLayout>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600">
            Loading profile...
          </p>
        </div>
      </HodLayout>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <HodLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </HodLayout>
    );
  }

  // ==================================================
  // PROFILE
  // ==================================================

  return (
    <HodLayout>

      {/* PAGE HEADER */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h2 className="text-2xl font-bold text-orange-600">
          HOD Profile
        </h2>

        <p className="text-gray-600 mt-2">
          View your personal and department information
        </p>

      </div>

      {/* PROFILE PHOTO */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h3 className="text-lg font-semibold text-orange-600 mb-4">
          Profile Photo
        </h3>

        <div className="flex items-center gap-6">

          {/* PHOTO */}

          {profile?.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt="HOD"
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
              htmlFor="hod-photo"
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
              id="hod-photo"
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

      {/* PERSONAL DETAILS */}

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

            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              {profile?.name || "-"}
            </div>
          </div>

          {/* EMAIL */}

          <div>
            <label className="text-sm text-gray-500">
              Email
            </label>

            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              {profile?.email || "-"}
            </div>
          </div>

          {/* DEPARTMENT */}

          <div>
            <label className="text-sm text-gray-500">
              Department
            </label>

            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              {profile?.department || "-"}
            </div>
          </div>

        </div>

      </div>

    </HodLayout>
  );
}

export default Profile;