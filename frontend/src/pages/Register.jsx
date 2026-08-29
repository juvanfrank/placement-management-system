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
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", formData);

      alert("Registration Successful 🎉");

      navigate("/");
    } catch (error) {
      alert("Registration Failed ❌");
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: `url(${collegeBg})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border-t-8 border-orange-500">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="h-16"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

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

          {/* REGISTER NUMBER */}
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

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          />

          {/* ROLE */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
          >
            <option value="">
              Select Role
            </option>

            <option value="student">
              Student
            </option>

            <option value="mentor">
              Mentor
            </option>

            <option value="hod">
              HOD
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          {/* DEPARTMENT */}
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
          >
            <option value="">
              Select Department
            </option>

            <option value="AIDS">
              AIDS - Artificial Intelligence & Data Science
            </option>

            <option value="CSE">
              CSE - Computer Science & Engineering
            </option>

            <option value="ECE">
              ECE - Electronics & Communication Engineering
            </option>

            <option value="EEE">
              EEE - Electrical & Electronics Engineering
            </option>

            <option value="MECH">
              MECH - Mechanical Engineering
            </option>

            <option value="CIVIL">
              CIVIL - Civil Engineering
            </option>

            <option value="IT">
              IT - Information Technology
            </option>
          </select>

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