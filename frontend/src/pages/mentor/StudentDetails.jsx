import { useParams } from "react-router-dom";
import MentorLayout from "../../components/MentorLayout";

function StudentDetails() {

  const { roll } = useParams();

  // Example student data (later this will come from backend)
  const student = {
    name: "Arun",
    roll: roll,
    department: "CSE",
    batch: "2022-2026",
    cgpa: 8.4,
    resume: "https://drive.google.com/file/d/1example/view",
    certificates: [
      {
        name: "Python Certification",
        driveLink: "https://drive.google.com/file/d/1example123/view"
      },
      {
        name: "AWS Certification",
        driveLink: "https://drive.google.com/file/d/2example456/view"
      }
    ]
  };

  return (
    <MentorLayout>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Student Details
      </h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <p><b>Name:</b> {student.name}</p>
        <p><b>Roll Number:</b> {student.roll}</p>
        <p><b>Department:</b> {student.department}</p>
        <p><b>Batch:</b> {student.batch}</p>
        <p><b>CGPA:</b> {student.cgpa}</p>

        {/* Resume */}
        <div>
          <h3 className="font-bold mt-4">Resume</h3>

          <a
            href={student.resume}
            target="_blank"
            className="text-blue-500 underline"
          >
            View Resume
          </a>
        </div>

        {/* Certificates */}
        <div>

          <h3 className="font-bold mt-4">
            Certificates
          </h3>

          {student.certificates.map((cert, index) => (

            <div key={index} className="border p-3 rounded mt-2">

              <p className="font-semibold">
                {cert.name}
              </p>

              <a
                href={cert.driveLink}
                target="_blank"
                className="text-blue-500 underline"
              >
                View Certificate
              </a>

            </div>

          ))}

        </div>

      </div>

    </MentorLayout>
  );
}

export default StudentDetails;