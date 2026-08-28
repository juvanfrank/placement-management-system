import { useState } from "react";
import MentorLayout from "../../components/MentorLayout";

function Certificates() {

  const [certificates, setCertificates] = useState([
    {
      id: 1,
      student: "Arun",
      name: "Python Certification",
      driveLink: "https://drive.google.com/file/d/1example/view",
      status: "Pending"
    },
    {
      id: 2,
      student: "Priya",
      name: "AWS Certification",
      driveLink: "https://drive.google.com/file/d/2example/view",
      status: "Pending"
    }
  ]);

  const updateStatus = (id, newStatus) => {
    const updated = certificates.map((cert) =>
      cert.id === id ? { ...cert, status: newStatus } : cert
    );

    setCertificates(updated);
  };

  return (
    <MentorLayout>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Certificate Verification
      </h2>

      {certificates.map((cert) => (

        <div key={cert.id} className="bg-white p-6 rounded-xl shadow mb-6">

          <h3 className="font-bold text-lg">{cert.student}</h3>

          <p>{cert.name}</p>

          <a
            href={cert.driveLink}
            target="_blank"
            className="text-blue-500 underline"
          >
            View Certificate
          </a>

          <p className="mt-2">
            Status: <b>{cert.status}</b>
          </p>

          <div className="mt-3 space-x-3">

            <button
              onClick={() => updateStatus(cert.id, "Approved")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus(cert.id, "Rejected")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject
            </button>

          </div>

        </div>

      ))}

    </MentorLayout>
  );
}

export default Certificates;