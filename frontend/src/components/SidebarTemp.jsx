import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Placement Portal
      </div>

      <nav className="flex-1 p-4 space-y-3">

        <Link
          to="/student-dashboard"
          className="block p-3 rounded-lg hover:bg-gray-700 transition"
        >
           Student Dashboard
        </Link>

        <Link
          to="/mentor-dashboard"
          className="block p-3 rounded-lg hover:bg-gray-700 transition"
        >
           Mentor Dashboard
        </Link>

        <Link
          to="/hod-dashboard"
          className="block p-3 rounded-lg hover:bg-gray-700 transition"
        >
           HOD Dashboard
        </Link>

        <Link
          to="/placement-dashboard"
          className="block p-3 rounded-lg hover:bg-gray-700 transition"
        >
           Placement Dashboard
        </Link>

      </nav>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-red-500 p-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;