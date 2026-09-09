import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

function Departments() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // DEPARTMENT NAMES
  // ==========================================

  const departmentNames = {
    AIDS: "Artificial Intelligence & Data Science",
    CSE: "Computer Science & Engineering",
    ECE: "Electronics & Communication Engineering",
    EEE: "Electrical & Electronics Engineering",
    MECH: "Mechanical Engineering",
    CIVIL: "Civil Engineering",
    IT: "Information Technology",
  };

  // ==========================================
  // FETCH DEPARTMENTS
  // ==========================================

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/departments"
      );

      console.log(
        "ADMIN DEPARTMENTS:",
        response.data
      );

      setDepartments(response.data);

    } catch (error) {

      console.error(
        "FETCH DEPARTMENTS ERROR:",
        error.response || error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load departments"
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // HANDLE DEPARTMENT CLICK
  // ==========================================

  const handleDepartmentClick = (department) => {

    navigate(
      `/admin/departments/${department}`
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
            Loading departments...
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

      {/* PAGE HEADER */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h2 className="text-2xl font-bold text-orange-600">
          Departments
        </h2>

        <p className="text-gray-600 mt-2">
          Select a department to view students
        </p>

      </div>

      {/* DEPARTMENT GRID */}

      {departments.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            No departments with student data available.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {departments.map((department) => (

            <div
              key={department}
              onClick={() =>
                handleDepartmentClick(department)
              }
              className="
                bg-white
                rounded-xl
                shadow
                p-6
                cursor-pointer
                hover:shadow-lg
                hover:-translate-y-1
                transition
                border-l-4
                border-orange-500
              "
            >

              {/* DEPARTMENT CODE */}

              <h3 className="text-xl font-bold text-orange-600">

                {department}

              </h3>

              {/* DEPARTMENT NAME */}

              <p className="text-gray-600 mt-3">

                {departmentNames[department] ||
                  department}

              </p>

              {/* VIEW */}

              <p className="text-sm text-orange-500 font-medium mt-5">

                View Department →

              </p>

            </div>

          ))}

        </div>

      )}

    </AdminLayout>
  );
}

export default Departments;