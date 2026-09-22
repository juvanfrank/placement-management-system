import { useState } from "react";
import api from "../services/api";

function ChangePassword() {
  const [showForm, setShowForm] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // RESET PASSWORD FORM
  // ==================================================

  const resetPasswordForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // ==================================================
  // CANCEL
  // ==================================================

  const handleCancel = () => {
    resetPasswordForm();
    setShowForm(false);
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }

    // Check password match
    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      alert(
        "New password and confirm password do not match."
      );
      return;
    }

    // Check minimum password length
    if (formData.newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters."
      );
      return;
    }

    // Prevent same password
    if (
      formData.currentPassword ===
      formData.newPassword
    ) {
      alert(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.put(
        "/auth/change-password",
        formData
      );

      alert(
        response.data?.message ||
          "Password changed successfully."
      );

      resetPasswordForm();
      setShowForm(false);
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-orange-600">
            Change Password
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Update your account password securely.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Change Password
          </button>
        )}
      </div>

      {/* ==================================================
          PASSWORD FORM
      ================================================== */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 max-w-xl"
        >

          {/* ==================================================
              CURRENT PASSWORD
          ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>

            <div className="relative">
              <input
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          {/* ==================================================
              NEW PASSWORD
          ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <div className="relative">
              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
                aria-label={
                  showNewPassword
                    ? "Hide new password"
                    : "Show new password"
                }
              >
                {showNewPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          {/* ==================================================
              CONFIRM PASSWORD
          ================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium px-5 py-2.5 rounded-lg transition"
            >
              {loading
                ? "Changing Password..."
                : "Update Password"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg transition"
            >
              Cancel
            </button>

          </div>

        </form>
      )}
    </div>
  );
}

export default ChangePassword;