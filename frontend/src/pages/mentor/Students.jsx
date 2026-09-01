import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MentorLayout from "../../components/MentorLayout";

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH STUDENTS
  // ==================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/mentor/students",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      console.log("MENTOR STUDENTS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load students");
      }

      setStudents(data.students || []);
      setMentor(data.mentor || null);
    } catch (error) {
      console.error("FETCH STUDENTS ERROR:", error);

      setError(error.message || "Unable to load students");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // OPEN STUDENT PROFILE
  // ==================================================

  const handleStudentClick = (student) => {
    navigate(`/mentor/student/${student.id}`);
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <MentorLayout>
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-600">Loading students...</p>
        </div>
      </MentorLayout>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <MentorLayout>
      {/* HEADER */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Class Students</h2>

        {mentor && (
          <p className="text-gray-600 mt-2">
            {mentor.department} | Year {mentor.year} | Section {mentor.section}
          </p>
        )}
      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
          {error}
        </div>
      )}

      {/* NO STUDENTS */}

      {!error && students.length === 0 && (
        <div className="bg-white shadow rounded-xl p-8 text-center">
          <p className="text-gray-600 text-lg">No students found.</p>

          {mentor && (
            <p className="text-gray-500 mt-2">
              Students matching <strong>{mentor.department}</strong> - Year{" "}
              <strong>{mentor.year}</strong> - Section{" "}
              <strong>{mentor.section}</strong> will appear here.
            </p>
          )}
        </div>
      )}

      {/* STUDENTS TABLE */}

      {students.length > 0 && (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-3 text-center">S.No</th>

                <th className="p-3 text-center">Roll No</th>

                <th className="p-3 text-left">Student Name</th>

                <th className="p-3 text-center">Year</th>

                <th className="p-3 text-center">Section</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id || student.rollNumber || index}
                  className="border-b hover:bg-orange-50"
                >
                  {/* S.NO */}

                  <td className="p-3 text-center">{index + 1}</td>

                  {/* ROLL NUMBER */}

                  <td className="p-3 text-center font-medium">
                    {student.rollNumber || "-"}
                  </td>

                  {/* STUDENT NAME */}

                  <td
                    className="p-3 text-left text-blue-600 cursor-pointer hover:underline font-medium"
                    onClick={() => handleStudentClick(student)}
                  >
                    {student.name || "-"}
                  </td>

                  {/* YEAR */}

                  <td className="p-3 text-center">{student.year || "-"}</td>

                  {/* SECTION */}

                  <td className="p-3 text-center">{student.section || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MentorLayout>
  );
}

export default Students;
