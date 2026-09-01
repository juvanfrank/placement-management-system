import MentorSidebar from "./MentorSidebar";
import MentorHeader from "./MentorHeader";

function MentorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Fixed Sidebar */}
      <MentorSidebar />

      {/* Main Content */}
      <div className="ml-64 min-h-screen">

        <MentorHeader />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default MentorLayout;