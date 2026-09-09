import logo from "../assets/logo.png";
import collegeBg from "../assets/college.jpg";

function AdminHeader() {
  return (
    <div
      className="h-40 relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${collegeBg})`,
      }}
    >
      {/* OVERLAY */}

      <div className="absolute inset-0 bg-black/60"></div>

      {/* CONTENT */}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">

        <img
          src={logo}
          alt="College Logo"
          className="w-14 h-14 object-contain mb-2"
        />

        <h1 className="text-2xl font-bold">
          Excel Engineering College (Autonomous)
        </h1>

        <p className="text-sm mt-1">
          NH-544, Komarapalayam, Namakkal Dt.
        </p>

      </div>
    </div>
  );
}

export default AdminHeader;