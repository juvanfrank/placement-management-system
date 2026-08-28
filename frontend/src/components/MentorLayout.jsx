import MentorSidebar from "./MentorSidebar";
import MentorHeader from "./MentorHeader";

function MentorLayout({ children }) {
  return (
    <div className="flex">

      <MentorSidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <MentorHeader />

        <div className="p-8">
          {children}
        </div>

      </div>

    </div>
  );
}

export default MentorLayout;