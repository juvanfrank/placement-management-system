import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";
import collegeBg from "../assets/college.jpg";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border-t-8 border-orange-500">

        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Student Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="email"
            name="email"
            placeholder="College Email"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-orange-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;