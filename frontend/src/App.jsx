import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/mentor/Profile";
import HodDashboard from "./pages/HodDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Profile from "./pages/student/Profile";
import Certificates from "./pages/student/Certificates";
import Resume from "./pages/student/Resume";
import Cgpa from "./pages/student/Cgpa";


import MentorProfile from "./pages/mentor/Profile";
import Students from "./pages/mentor/Students";
import MentorCertificates from "./pages/mentor/Certificates";
import MentorCgpa from "./pages/mentor/Cgpa";
import StudentDetails from "./pages/mentor/StudentDetails";
    

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/hod-dashboard" element={<HodDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/certificates" element={<Certificates />} />
        <Route path="/student/resume" element={<Resume />} />
        <Route path="/student/cgpa" element={<Cgpa />} />
        <Route path="/mentor/profile" element={<MentorProfile />} />
<Route path="/mentor/students" element={<Students />} />
<Route path="/mentor/certificates" element={<MentorCertificates />} />
<Route path="/mentor/cgpa" element={<MentorCgpa />} />
<Route path="/mentor/student/:roll" element={<StudentDetails />} />
      </Routes>
    </Router>
  );
}

export default App;