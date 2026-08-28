import { Link } from "react-router-dom";

function MentorSidebar() {
  return (
    <div className="w-64 h-screen bg-orange-600 text-white flex flex-col">

      <div className="p-6 text-xl font-bold border-b border-orange-400">
        Mentor Panel
      </div>

      <nav className="flex-1 p-4 space-y-3">

        <Link
          to="/mentor/profile"
          className="block p-3 rounded hover:bg-orange-500"
        >
          Profile
        </Link>

        <Link
          to="/mentor/students"
          className="block p-3 rounded hover:bg-orange-500"
        >
          Students
        </Link>

        <Link
          to="/mentor/certificates"
          className="block p-3 rounded hover:bg-orange-500"
        >
          Certificates
        </Link>

        <Link
          to="/mentor/cgpa"
          className="block p-3 rounded hover:bg-orange-500"
        >
          CGPA
        </Link>

      </nav>

      <div className="p-4 border-t border-orange-400">
        <button className="w-full bg-white text-orange-600 p-2 rounded">
          Logout
        </button>
      </div>

    </div>
  );
}

export default MentorSidebar;