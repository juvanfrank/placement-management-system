import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";
import collegeBg from "../assets/college.jpg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  if (data.user.role === "admin") {
    navigate("/admin-dashboard");
  } else if (data.user.role === "mentor") {
    navigate("/mentor-dashboard");
  } else if (data.user.role === "hod") {
    navigate("/hod-dashboard");
  } else {
    navigate("/student-dashboard");
  }
}
  } catch (error) {
    console.error("Login error:", error);
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
          Placement Portal
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          New user?{" "}
          <Link to="/register" className="text-orange-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;