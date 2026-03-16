import { useState, useEffect } from "react";
import axios from "axios";
import StudentLayout from "../../components/StudentLayout";

function Certificates() {

  const [certificates, setCertificates] = useState([]);

  const [certificateName, setCertificateName] = useState("");
  const [driveLink, setDriveLink] = useState("");

  // Load certificates from backend
  useEffect(() => {

    const fetchCertificates = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/certificates",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setCertificates(res.data);

      } catch (error) {
        console.error(error);
      }

    };

    fetchCertificates();

  }, []);

  // Add certificate
  const handleAddCertificate = async () => {

    if (!certificateName || !driveLink) return;

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/certificates",
        {
          name: certificateName,
          link: driveLink
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCertificates([...certificates, res.data]);

      setCertificateName("");
      setDriveLink("");

    } catch (error) {
      console.error(error);
    }

  };

  const getStatusColor = (status) => {

    if (status === "Approved") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    if (status === "Rejected") return "text-red-600";

  };

  return (

    <StudentLayout>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Certificates 📜
      </h2>


      {/* Add Certificate */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h3 className="font-semibold mb-4 text-lg">
          Add Certificate (Google Drive Link)
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Certificate Name"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="text"
            placeholder="Paste Google Drive Link"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

        </div>

        <button
          onClick={handleAddCertificate}
          className="mt-4 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Add Certificate
        </button>

      </div>


      {/* Certificates Table */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="font-semibold mb-4 text-lg">
          Uploaded Certificates
        </h3>

        <table className="w-full text-left">

          <thead>
            <tr className="border-b">
              <th className="p-3">Certificate</th>
              <th className="p-3">Drive Link</th>
              <th className="p-3">Mentor Status</th>
            </tr>
          </thead>

          <tbody>

            {certificates.map((cert, index) => (

              <tr key={index} className="border-b">

                <td className="p-3">{cert.name}</td>

                <td className="p-3">

                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 underline"
                  >
                    View
                  </a>

                </td>

                <td className={`p-3 font-semibold ${getStatusColor(cert.status)}`}>
                  {cert.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </StudentLayout>

  );

}

export default Certificates;