import { Link, useNavigate } from "react-router-dom";

function StudentSidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <div className="w-56 bg-orange-600 text-white min-h-screen flex flex-col justify-between p-6">

      <div>

        <h2 className="text-xl font-bold mb-8">
          Student Panel
        </h2>

        <div className="flex flex-col gap-4">

          <Link to="/student/profile">Profile</Link>

          <Link to="/student/certificates">Certificates</Link>

          <Link to="/student/cgpa">CGPA</Link>

        </div>

      </div>


      {/* Logout button bottom */}

      <button
        onClick={handleLogout}
        className="bg-white text-orange-600 py-2 rounded font-semibold hover:bg-gray-200"
      >
        Logout
      </button>

    </div>

  );

}

export default StudentSidebar;