import logo from "../assets/logo.png";
import collegeBg from "../assets/college.jpg";

function MentorHeader() {
  return (
    <div
      className="h-48 flex flex-col items-center justify-center text-white relative"
      style={{
        backgroundImage: `url(${collegeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-center">

        <img src={logo} className="h-16 mx-auto mb-2" />

        <h1 className="text-3xl font-bold">
          Excel Engineering College (Autonomous)
        </h1>

        <p className="text-sm">
          NH-544, Komarapalayam, Namakkal Dt.,
        </p>

      </div>
    </div>
  );
}

export default MentorHeader;