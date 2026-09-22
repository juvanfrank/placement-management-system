import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";
import collegeBg from "../assets/college.jpg";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    registerNumber: "",
    email: "",
    password: "",
    role: "",
    department: "",
    secretPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSecretPassword, setShowSecretPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      // ==========================================
      // ROLE CHANGE
      // ==========================================
      if (name === "role") {
        // Admin is not available in registration.
        // Clear register number for non-students.
        if (value !== "student") {
          updatedData.registerNumber = "";
        }

        // Clear secret password when Student is selected.
        if (value === "student") {
          updatedData.secretPassword = "";
        }
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ==========================================
      // BASIC VALIDATION
      // ==========================================

      if (!formData.role) {
        alert("Please select a role.");
        return;
      }

      // ==========================================
      // MENTOR / HOD SECRET PASSWORD VALIDATION
      // ==========================================

      if (
        (formData.role === "mentor" || formData.role === "hod") &&
        !formData.secretPassword.trim()
      ) {
        alert(
          `Please enter the ${
            formData.role === "mentor" ? "Mentor" : "HOD"
          } secret password.`,
        );
        return;
      }

      // ==========================================
      // STUDENT REGISTER NUMBER
      // ==========================================

      if (formData.role === "student" && !formData.registerNumber.trim()) {
        alert("Please enter your Register Number.");
        return;
      }

      // ==========================================
      // SEND REGISTRATION DATA
      // ==========================================

      const registrationData = {
        name: formData.name,
        registerNumber:
          formData.role === "student" ? formData.registerNumber : "",
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        secretPassword:
          formData.role === "mentor" || formData.role === "hod"
            ? formData.secretPassword
            : "",
      };

      await api.post("/auth/register", registrationData);

      alert("Registration Successful 🎉");

      navigate("/");
    } catch (error) {
      console.log("REGISTRATION ERROR:", error);

      alert(error.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${collegeBg})`,
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border-t-8 border-orange-500">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />

          {/* REGISTER NUMBER - ONLY STUDENT */}
          {formData.role === "student" && (
            <input
              type="text"
              name="registerNumber"
              placeholder="Register Number"
              value={formData.registerNumber}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="College Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {/* ROLE */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
          >
            <option value="">Select Role</option>

            <option value="student">Student</option>

            <option value="mentor">Mentor</option>

            <option value="hod">HOD</option>
          </select>

          {/* ==========================================
              SECRET PASSWORD
              ONLY FOR MENTOR / HOD
          ========================================== */}

          {(formData.role === "mentor" || formData.role === "hod") && (
            <div>
              <div className="relative">
                <input
                  type={showSecretPassword ? "text" : "password"}
                  name="secretPassword"
                  placeholder={
                    formData.role === "mentor"
                      ? "Mentor Secret Password"
                      : "HOD Secret Password"
                  }
                  value={formData.secretPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowSecretPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
                >
                  {showSecretPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Secret password is required to register as{" "}
                {formData.role === "mentor" ? "Mentor" : "HOD"}.
              </p>
            </div>
          )}

          {/* DEPARTMENT */}
          {formData.role !== "" && (
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            >
              <option value="">Select Department</option>

              <option value="AIDS">
                AIDS - Artificial Intelligence & Data Science
              </option>

              <option value="CSE">CSE - Computer Science & Engineering</option>

              <option value="ECE">
                ECE - Electronics & Communication Engineering
              </option>

              <option value="EEE">
                EEE - Electrical & Electronics Engineering
              </option>

              <option value="MECH">MECH - Mechanical Engineering</option>

              <option value="CIVIL">CIVIL - Civil Engineering</option>

              <option value="IT">IT - Information Technology</option>
            </select>
          )}

          {/* REGISTER */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition font-semibold"
          >
            Register
          </button>
        </form>

        {/* LOGIN */}
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-orange-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
