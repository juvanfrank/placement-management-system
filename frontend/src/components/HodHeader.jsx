import collegeBg from "../assets/college.jpg";
import logo from "../assets/logo.png";

function HodHeader() {
  return (
    <header
      className="h-36 bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage: `url(${collegeBg})`,
      }}
    >

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-black/50"></div>

      {/* CONTENT */}

      <div className="relative z-10 text-center text-white">

        <img
          src={logo}
          alt="College Logo"
          className="h-14 mx-auto mb-2"
        />

        <h1 className="text-2xl font-bold">
          Excel Engineering College (Autonomous)
        </h1>

        <p className="text-sm">
          NH-544, Komarapalayam, Namakkal Dt.
        </p>

      </div>

    </header>
  );
}

export default HodHeader;