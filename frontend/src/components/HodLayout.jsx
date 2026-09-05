import HodSidebar from "./HodSidebar";
import HodHeader from "./HodHeader";

function HodLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <HodSidebar />

      {/* MAIN */}

      <div className="ml-64 min-h-screen">

        <HodHeader />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default HodLayout;