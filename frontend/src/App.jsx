import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin
import AdminDashboard from "./pages/AdminDashboard";

// Student
import StudentProfile from "./pages/student/Profile";
import StudentCertificates from "./pages/student/Certificates";
import StudentResume from "./pages/student/Resume";
import StudentCgpa from "./pages/student/Cgpa";

// Mentor
import MentorProfile from "./pages/mentor/Profile";
import MentorStudents from "./pages/mentor/Students";
import MentorCertificates from "./pages/mentor/Certificates";
import MentorCgpa from "./pages/mentor/Cgpa";
import MentorStudentDetails from "./pages/mentor/StudentDetails";

// HOD
import HodProfile from "./pages/hod/Profile";
import HodStudents from "./pages/hod/Students";
import HodStudentDetails from "./pages/hod/StudentDetails";
import HodMentors from "./pages/hod/Mentors";
import HodMentorDetails from "./pages/hod/MentorDetails";

function App() {
  return (
    <Router>
      <Routes>

        {/* ==================== AUTH ==================== */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ==================== ADMIN ==================== */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />


        {/* ==================== STUDENT ==================== */}

        {/* Student starts from Profile */}
        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student/certificates"
          element={<StudentCertificates />}
        />

        <Route
          path="/student/resume"
          element={<StudentResume />}
        />

        <Route
          path="/student/cgpa"
          element={<StudentCgpa />}
        />


        {/* ==================== MENTOR ==================== */}

        {/* Mentor starts from Profile */}
        <Route
          path="/mentor/profile"
          element={<MentorProfile />}
        />

        <Route
          path="/mentor/students"
          element={<MentorStudents />}
        />

        <Route
          path="/mentor/certificates"
          element={<MentorCertificates />}
        />

        <Route
          path="/mentor/cgpa"
          element={<MentorCgpa />}
        />

        <Route
          path="/mentor/student/:id"
          element={<MentorStudentDetails />}
        />


        {/* ==================== HOD ==================== */}

        {/* HOD starts from Profile */}
        <Route
          path="/hod/profile"
          element={<HodProfile />}
        />

        <Route
          path="/hod/students"
          element={<HodStudents />}
        />

        <Route
          path="/hod/student/:id"
          element={<HodStudentDetails />}
        />

        <Route
          path="/hod/mentors"
          element={<HodMentors />}
        />

        <Route
          path="/hod/mentor/:id"
          element={<HodMentorDetails />}
        />

      </Routes>
    </Router>
  );
}

export default App;