import { useState } from "react";
import MentorLayout from "../../components/MentorLayout";

function MentorCgpa() {

  const [students, setStudents] = useState([
    { id: 1, roll: "22CS101", name: "Arun", cgpa: 8.4, finalized: false },
    { id: 2, roll: "22CS102", name: "Priya", cgpa: 8.9, finalized: false }
  ]);

  const finalizeCgpa = (id) => {

    const updated = students.map((student) =>
      student.id === id
        ? { ...student, finalized: true }
        : student
    );

    setStudents(updated);
  };

  return (
    <MentorLayout>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        CGPA Verification
      </h2>

      <table className="w-full bg-white shadow rounded-xl">

        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="p-3">Roll No</th>
            <th className="p-3">Name</th>
            <th className="p-3">CGPA</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id} className="border-b text-center">

              <td className="p-3">{student.roll}</td>

              <td>{student.name}</td>

              <td>
                <input
                  type="number"
                  value={student.cgpa}
                  disabled={student.finalized}
                  className="border p-1 rounded"
                />
              </td>

              <td>

                {student.finalized ? (

                  <span className="text-green-600 font-bold">
                    Finalized
                  </span>

                ) : (

                  <button
                    onClick={() => finalizeCgpa(student.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Finalize
                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </MentorLayout>
  );
}

export default MentorCgpa;