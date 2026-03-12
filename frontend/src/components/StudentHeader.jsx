import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bg from "../assets/college.jpg";

function StudentHeader() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="h-48 flex flex-col items-center justify-center text-white relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 bg-orange-600 px-5 py-2 rounded hover:bg-orange-700 z-20"
      >
        Logout
      </button>

      <div className="relative z-10 text-center">
        <img src={logo} alt="Logo" className="h-16 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">
          Excel Engineering College (Autonomous)
        </h1>
        <p className="text-1xl font-bold">
          NH-544, Komarapalyam, Namakkal Dt.
        </p>
      </div>
    </div>
  );
}

export default StudentHeader;