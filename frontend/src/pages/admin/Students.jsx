import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

function Students() {
  const navigate = useNavigate();

  const { department, year, section } = useParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH STUDENTS
  // ==========================================

  useEffect(() => {
    fetchStudents();
  }, [department, year, section]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/departments/${department}/year/${year}/section/${section}/students`
      );

      console.log(
        "ADMIN STUDENTS:",
        response.data
      );

      setStudents(response.data);

    } catch (error) {

      console.error(
        "FETCH STUDENTS ERROR:",
        error.response || error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load students"
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // OPEN STUDENT DETAILS
  // ==========================================

  const handleStudentClick = (student) => {

    const studentId =
      student._id ||
      student.id;

    navigate(
      `/admin/student/${studentId}`
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <AdminLayout>

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-600">
            Loading students...
          </p>

        </div>

      </AdminLayout>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <AdminLayout>

        <div className="bg-red-100 text-red-700 p-4 rounded-lg">

          {error}

        </div>

      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h2 className="text-2xl font-bold text-orange-600">
          Students
        </h2>

        <p className="text-gray-600 mt-2">

          {department} | Year {year} | Section {section}

        </p>

      </div>

      {/* ==========================================
          NO STUDENTS
      ========================================== */}

      {students.length === 0 ? (

        <div className="bg-white shadow rounded-xl p-6">

          <p className="text-gray-500">

            No students found in this section.

          </p>

        </div>

      ) : (

        /* ==========================================
            STUDENTS TABLE
        ========================================== */

        <div className="bg-white shadow rounded-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              {/* TABLE HEADER */}

              <thead className="bg-orange-500 text-white">

                <tr>

                  <th className="p-4 text-center">
                    S.No
                  </th>

                  <th className="p-4 text-left">
                    Student Name
                  </th>

                  <th className="p-4 text-center">
                    Register Number
                  </th>

                  <th className="p-4 text-center">
                    Roll Number
                  </th>

                  <th className="p-4 text-left">
                    Mentor
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody>

                {students.map(
                  (student, index) => (

                    <tr
                      key={
                        student._id ||
                        student.id
                      }
                      className="
                        border-b
                        hover:bg-orange-50
                        transition
                      "
                    >

                      {/* SERIAL NUMBER */}

                      <td className="p-4 text-center">

                        {index + 1}

                      </td>

                      {/* STUDENT NAME */}

                      <td
                        className="
                          p-4
                          text-blue-600
                          font-medium
                          cursor-pointer
                          hover:underline
                        "
                        onClick={() =>
                          handleStudentClick(student)
                        }
                      >

                        {student.name || "-"}

                      </td>

                      {/* REGISTER NUMBER */}

                      <td className="p-4 text-center">

                        {student.registerNumber || "-"}

                      </td>

                      {/* ROLL NUMBER */}

                      <td className="p-4 text-center">

                        {student.rollNumber || "-"}

                      </td>

                      {/* MENTOR */}

                      <td className="p-4">

                        {student.mentor?.name ||
                          student.mentorName ||
                          "Not Assigned"}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </AdminLayout>
  );
}

export default Students;