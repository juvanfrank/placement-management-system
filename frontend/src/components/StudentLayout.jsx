import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";

function StudentLayout({ children }) {

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>

      <StudentSidebar />

      <div style={{ flex: 1 }}>
        <StudentHeader />

        <div style={{ padding: "20px" }}>
          {children}
        </div>

      </div>

    </div>
  );

}

export default StudentLayout;