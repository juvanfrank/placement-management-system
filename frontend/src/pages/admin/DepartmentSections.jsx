import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

function DepartmentSections() {
  const navigate = useNavigate();

  const { department, year } = useParams();

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH SECTIONS
  // ==========================================

  useEffect(() => {
    fetchSections();
  }, [department, year]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/departments/${department}/year/${year}/sections`
      );

      console.log(
        "ADMIN SECTIONS:",
        response.data
      );

      setSections(response.data);

    } catch (error) {
      console.error(
        "FETCH SECTIONS ERROR:",
        error.response || error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load sections"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE SECTION CLICK
  // ==========================================

  const handleSectionClick = (section) => {
    navigate(
      `/admin/departments/${department}/year/${year}/section/${section}`
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
            Loading sections...
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

        <button
          onClick={() =>
            navigate(
              `/admin/departments/${department}`
            )
          }
          className="text-orange-600 hover:underline mb-4"
        >
          ← Back to Years
        </button>

        <h2 className="text-2xl font-bold text-orange-600">
          {department} Department
        </h2>

        <p className="text-gray-600 mt-2">
          Year {year} - Select a section
        </p>

      </div>

      {/* SECTION CARDS */}

      {sections.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            No student data available for this year.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {sections.map((section) => (

            <div
              key={section}
              onClick={() =>
                handleSectionClick(section)
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
                text-center
              "
            >

              <h3 className="text-2xl font-bold text-orange-600">
                Section {section}
              </h3>

              <p className="text-gray-500 mt-3">
                View Students →
              </p>

            </div>

          ))}

        </div>

      )}

    </AdminLayout>
  );
}

export default DepartmentSections;