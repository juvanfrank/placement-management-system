import logo from "../assets/logo.png";
import bg from "../assets/college.jpg";

function StudentHeader() {
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

      <div className="relative z-10 text-center">
        <img src={logo} alt="Logo" className="h-16 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">
          Excel Engineering College(Autonomous)
        </h1>
        <p className="text-1xl font-bold">
            NH-544, Komarapalyam, Namakkal Dt.,
        </p>
      </div>
    </div>
  );
}

export default StudentHeader;