import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <div className="flex-1">

        {/* HEADER */}

        <AdminHeader />

        {/* PAGE CONTENT */}

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;