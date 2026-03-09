import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";

function StudentLayout({ children }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <StudentSidebar />

      <div className="flex-1 flex flex-col">
        <StudentHeader />
        <div className="p-6">
          {children}
        </div>
      </div>

    </div>
  );
}

export default StudentLayout;