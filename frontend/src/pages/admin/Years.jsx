import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

function Years() {
  const navigate = useNavigate();
  const { department } = useParams();

  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH YEARS
  // ==========================================

  useEffect(() => {
    fetchYears();
  }, [department]);

  const fetchYears = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/departments/${department}/years`
      );

      console.log(
        "ADMIN YEARS:",
        response.data
      );

      setYears(response.data);

    } catch (error) {

      console.error(
        "FETCH YEARS ERROR:",
        error.response || error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load years"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // YEAR CLICK
  // ==========================================

  const handleYearClick = (year) => {
    navigate(
      `/admin/departments/${department}/year/${year}`
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
            Loading years...
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

      {/* HEADER */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <button
          onClick={() =>
            navigate("/admin/departments")
          }
          className="text-orange-600 hover:underline mb-4"
        >
          ← Back to Departments
        </button>

        <h2 className="text-2xl font-bold text-orange-600">
          {department} - Years
        </h2>

        <p className="text-gray-600 mt-2">
          Select a year to view sections
        </p>

      </div>

      {/* YEARS */}

      {years.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-6">

          <p className="text-gray-500">
            No student data available for this department.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {years.map((year) => (

            <div
              key={year}
              onClick={() =>
                handleYearClick(year)
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

              <h3 className="text-xl font-bold text-orange-600">
                Year {year}
              </h3>

              <p className="text-gray-600 mt-3">
                View Sections
              </p>

              <p className="text-sm text-orange-500 font-medium mt-5">
                View Year →
              </p>

            </div>

          ))}

        </div>

      )}

    </AdminLayout>
  );
}

export default Years;