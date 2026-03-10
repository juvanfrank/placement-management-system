import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashBoard";
import HodDashboard from "./pages/HodDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Profile from "./pages/student/Profile";
import Certificates from "./pages/student/Certificates";
import Resume from "./pages/student/Resume";
import Cgpa from "./pages/student/Cgpa";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/hod-dashboard" element={<HodDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/certificates" element={<Certificates />} />
        <Route path="/student/resume" element={<Resume />} />
        <Route path="/student/cgpa" element={<Cgpa />} />
      </Routes>
    </Router>
  );
}

export default App;