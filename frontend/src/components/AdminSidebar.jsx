import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // ==========================================
  // MENU ITEMS
  // ==========================================

  const menuItems = [
    {
      name: "Profile",
      path: "/admin/profile",
    },
    {
      name: "Departments",
      path: "/admin/departments",
    },
    {
      name: "Student Search",
      path: "/admin/search",
    },
  ];

  return (
    <div className="w-52 min-h-screen bg-orange-500 text-white flex flex-col">

      {/* TITLE */}

      <div className="p-5 border-b border-orange-400">
        <h2 className="text-xl font-bold">
          Admin Panel
        </h2>
      </div>

      {/* MENU */}

      <div className="flex-1">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-5 py-4 transition ${
                isActive
                  ? "bg-orange-600"
                  : "hover:bg-orange-600"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </div>

      {/* LOGOUT */}

      <div className="p-4 border-t border-orange-400">

        <button
          onClick={handleLogout}
          className="w-full bg-white text-orange-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default AdminSidebar;