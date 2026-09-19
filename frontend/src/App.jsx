import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";


// Student
import StudentProfile from "./pages/student/Profile";
import StudentCertificates from "./pages/student/Certificates";


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

// Admin
import AdminProfile from "./pages/admin/Profile";
import Departments from "./pages/admin/Departments";
import DepartmentYears from "./pages/admin/DepartmentYears";
import DepartmentSections from "./pages/admin/DepartmentSections";
import AdminStudents from "./pages/admin/Students";
import AdminStudentDetails from "./pages/admin/StudentDetails";
import AdminSearch from "./pages/admin/Search";
import Deletion from "./pages/admin/Deletion";

function App() {
  return (
    <Router>
      <Routes>
        {/* ==================== AUTH ==================== */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ==================== ADMIN ==================== */}

        <Route path="/admin/profile" element={<AdminProfile />} />

        <Route path="/admin/departments" element={<Departments />} />

        <Route
          path="/admin/departments/:department"
          element={<DepartmentYears />}
        />

        <Route
          path="/admin/departments/:department/year/:year"
          element={<DepartmentSections />}
        />

        <Route
          path="/admin/departments/:department/year/:year/section/:section"
          element={<AdminStudents />}
        />

        <Route path="/admin/student/:id" element={<AdminStudentDetails />} />

        <Route path="/admin/search" element={<AdminSearch />} />

        <Route path="/admin/deletion" element={<Deletion />} />

        {/* ==================== STUDENT ==================== */}

        <Route path="/student/profile" element={<StudentProfile />} />

        <Route path="/student/certificates" element={<StudentCertificates />} />

        

        

        {/* ==================== MENTOR ==================== */}

        <Route path="/mentor/profile" element={<MentorProfile />} />

        <Route path="/mentor/students" element={<MentorStudents />} />

        <Route path="/mentor/certificates" element={<MentorCertificates />} />

        <Route path="/mentor/cgpa" element={<MentorCgpa />} />

        <Route path="/mentor/student/:id" element={<MentorStudentDetails />} />

        {/* ==================== HOD ==================== */}

        <Route path="/hod/profile" element={<HodProfile />} />

        <Route path="/hod/students" element={<HodStudents />} />

        <Route path="/hod/student/:id" element={<HodStudentDetails />} />

        <Route path="/hod/mentors" element={<HodMentors />} />

        <Route path="/hod/mentor/:id" element={<HodMentorDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
