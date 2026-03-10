import Layout from "../components/Layout";

function StudentDashboard() {

  // Dummy certificate data (Later will come from backend)
  const certificates = [
    { name: "NPTEL Java Course", status: "Approved" },
    { name: "Hackathon Participation", status: "Pending" },
    { name: "Internship Certificate", status: "Rejected" },
  ];

  // Function to assign colors based on status
  const getStatusColor = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "";
  };

  return (
    <Layout>
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-orange-600 mb-6">
        Student Dashboard 🎓
      </h2>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Profile Completion</h3>
          <p className="text-gray-600 mt-2">70% Completed</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Resume Status</h3>
          <p className="text-gray-600 mt-2">Uploaded ✅</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Certificates Uploaded</h3>
          <p className="text-gray-600 mt-2">{certificates.length} Certificates</p>
        </div>

      </div>

      {/* Profile Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          My Profile Details
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Register Number:</strong> 21CS001</p>
          <p><strong>Department:</strong> CSE</p>
          <p><strong>Email:</strong> john@college.edu</p>
        </div>
      </div>

      {/* Certificate Approval Status Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Certificate Approval Status
        </h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Certificate Name</th>
              <th className="p-3">Mentor Status</th>
            </tr>
          </thead>

          <tbody>
            {certificates.map((cert, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{cert.name}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cert.status)}`}
                  >
                    {cert.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </Layout>
  );
}

export default StudentDashboard;