function Navbar() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      
      <h1 className="text-xl font-semibold text-gray-700">
        Dashboard Panel
      </h1>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Welcome User</span>
        <div className="w-10 h-10 bg-orange-500 rounded-full"></div>
      </div>

    </div>
  );
}

export default Navbar;