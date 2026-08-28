import { useNavigate } from "react-router-dom";
import MentorLayout from "../../components/MentorLayout";

function Students() {

  const navigate = useNavigate();

  const students = [
    { roll: "22CS101", name: "Arun" },
    { roll: "22CS102", name: "Priya" }
  ];

  return (
    <MentorLayout>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Class Students
      </h2>

      <table className="w-full bg-white shadow rounded-xl">

        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="p-3">Roll No</th>
            <th className="p-3">Student Name</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.roll} className="border-b text-center">

              <td className="p-3">{student.roll}</td>

              <td
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate(`/mentor/student/${student.roll}`)}
              >
                {student.name}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </MentorLayout>
  );
}

export default Students;