import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import collegeBg from "../assets/college.jpg";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data?.token;
      const role = response.data?.user?.role;

      if (!token) {
        alert("Login failed: token missing");
        return;
      }

      // Save token
      localStorage.setItem("token", token);

      console.log("ROLE:", role);

      // Redirect based on role
      switch (role) {

        case "student":
          navigate("/student/profile");
          break;

        case "mentor":
          navigate("/mentor-dashboard");
          break;

        case "hod":
          navigate("/hod-dashboard");
          break;

        case "admin":
          navigate("/admin-dashboard");
          break;

        default:
          navigate("/student/profile");
      }

    } catch (error) {

      console.error("Login error:", error);

      if (error.response) {
        alert(error.response.data?.message || "Invalid credentials");
      } else {
        alert("Server error. Please try again.");
      }

    } finally {
      setLoading(false);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm mt-6">
          New user?{" "}
          <Link
            to="/register"
            className="text-orange-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;