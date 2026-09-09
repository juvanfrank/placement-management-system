import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

function Search() {
  const navigate = useNavigate();

  // ==========================================
  // SEARCH FILTERS
  // ==========================================

  const [filters, setFilters] = useState({
    department: "",
    year: "",
    minCgpa: "",
    skills: "",
    historyOfArrears: "",
    historyOfArrearsCount: "",
    currentArrears: "",
  });

  // ==========================================
  // SEARCH STATES
  // ==========================================

  const [searched, setSearched] = useState(false);

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // HANDLE FILTER CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,

      // Clear arrears count when No or All
      ...(name === "historyOfArrears" &&
      value !== "Yes"
        ? {
            historyOfArrearsCount: "",
          }
        : {}),
    }));
  };

  // ==========================================
  // SEARCH STUDENTS
  // ==========================================

  const handleSearch = async () => {
    try {
      setLoading(true);

      setError("");

      setSearched(true);

      console.log(
        "SEARCH FILTERS:",
        filters
      );

      // Remove empty filters
      const params = {};

      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== "" &&
          filters[key] !== null &&
          filters[key] !== undefined
        ) {
          params[key] = filters[key];
        }
      });

      const response = await api.get(
        "/admin/search-students",
        {
          params,
        }
      );

      console.log(
        "SEARCH RESULTS:",
        response.data
      );

      setStudents(
        response.data.students || []
      );

    } catch (error) {

      console.error(
        "SEARCH STUDENTS ERROR:",
        error.response || error
      );

      setError(
        error.response?.data?.message ||
          "Unable to search students"
      );

      setStudents([]);

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const handleClear = () => {
    setFilters({
      department: "",
      year: "",
      minCgpa: "",
      skills: "",
      historyOfArrears: "",
      historyOfArrearsCount: "",
      currentArrears: "",
    });

    setStudents([]);

    setError("");

    setSearched(false);
  };

  // ==========================================
  // OPEN STUDENT PROFILE
  // ==========================================

  const handleStudentClick = (student) => {
    navigate(`/admin/student/${student.id}`);
  };

  return (
    <AdminLayout>

      {/* ========================================== */}
      {/* PAGE HEADER */}
      {/* ========================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h2 className="text-2xl font-bold text-orange-600">
          Student Search
        </h2>

        <p className="text-gray-600 mt-2">
          Find students based on academic performance and skills
        </p>

      </div>

      {/* ========================================== */}
      {/* SEARCH FILTERS */}
      {/* ========================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">

        <h3 className="text-lg font-semibold text-orange-600 mb-6">
          Search Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* DEPARTMENT */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>

            <select
              name="department"
              value={filters.department}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            >

              <option value="">
                All Departments
              </option>

              <option value="AIDS">
                AIDS
              </option>

              <option value="CSE">
                CSE
              </option>

              <option value="ECE">
                ECE
              </option>

              <option value="EEE">
                EEE
              </option>

              <option value="MECH">
                MECH
              </option>

              <option value="CIVIL">
                CIVIL
              </option>

              <option value="IT">
                IT
              </option>

            </select>

          </div>


          {/* YEAR */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>

            <select
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            >

              <option value="">
                All Years
              </option>

              <option value="1">
                Year 1
              </option>

              <option value="2">
                Year 2
              </option>

              <option value="3">
                Year 3
              </option>

              <option value="4">
                Year 4
              </option>

            </select>

          </div>


          {/* MINIMUM CGPA */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum CGPA
            </label>

            <input
              type="number"
              name="minCgpa"
              value={filters.minCgpa}
              onChange={handleChange}
              placeholder="Example: 7.5"
              min="0"
              max="10"
              step="0.1"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            />

          </div>


          {/* SKILLS */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={filters.skills}
              onChange={handleChange}
              placeholder="Example: java, python"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            />

            <p className="text-xs text-gray-500 mt-1">
              Enter multiple skills separated by commas
            </p>

          </div>


          {/* HISTORY OF ARREARS */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              History of Arrears
            </label>

            <select
              name="historyOfArrears"
              value={filters.historyOfArrears}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            >

              <option value="">
                All
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>

            </select>

          </div>


          {/* HISTORY OF ARREARS COUNT */}

          {filters.historyOfArrears === "Yes" && (

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Number of History of Arrears
              </label>

              <input
                type="number"
                name="historyOfArrearsCount"
                value={filters.historyOfArrearsCount}
                onChange={handleChange}
                placeholder="Example: 2"
                min="1"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
              />

              <p className="text-xs text-gray-500 mt-1">
                Students with previous arrears less than or equal to this number
              </p>

            </div>

          )}


          {/* CURRENT ARREARS */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Current Arrears
            </label>

            <input
              type="number"
              name="currentArrears"
              value={filters.currentArrears}
              onChange={handleChange}
              placeholder="Example: 0"
              min="0"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            />

            <p className="text-xs text-gray-500 mt-1">
              Students with arrears less than or equal to this value
            </p>

          </div>

        </div>


        {/* ========================================== */}
        {/* BUTTONS */}
        {/* ========================================== */}

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">

          <button
            onClick={handleClear}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition font-medium disabled:opacity-50"
          >
            Clear Filters
          </button>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium disabled:opacity-50"
          >

            {loading
              ? "Searching..."
              : "🔍 Search Students"}

          </button>

        </div>

      </div>


      {/* ========================================== */}
      {/* SEARCH RESULTS */}
      {/* ========================================== */}

      {searched && (

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* RESULTS HEADER */}

          <div className="p-6 border-b flex justify-between items-center">

            <div>

              <h3 className="text-xl font-bold text-orange-600">
                Search Results
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Students matching your search criteria
              </p>

            </div>

            <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-semibold">

              {loading
                ? "..."
                : `${students.length} Found`}

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="p-8 text-center text-gray-500">
              Searching students...
            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="m-6 bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>

          )}


          {/* NO RESULTS */}

          {!loading &&
            !error &&
            students.length === 0 && (

              <div className="p-8 text-center text-gray-500">

                No students found matching your search criteria.

              </div>

            )}


          {/* TABLE */}

          {!loading &&
            !error &&
            students.length > 0 && (

              <div className="overflow-x-auto">

                <table className="w-full">

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
                        Department
                      </th>

                      <th className="p-4 text-center">
                        Year
                      </th>

                      <th className="p-4 text-center">
                        CGPA
                      </th>

                      <th className="p-4 text-left">
                        Skills
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {students.map(
                      (student, index) => (

                        <tr
                          key={
                            student.id ||
                            student._id ||
                            index
                          }
                          className="border-b hover:bg-orange-50 transition"
                        >

                          <td className="p-4 text-center">
                            {index + 1}
                          </td>


                          {/* STUDENT NAME */}

                          <td
                            onClick={() =>
                              handleStudentClick(
                                student
                              )
                            }
                            className="p-4 text-blue-600 font-medium cursor-pointer hover:underline"
                          >

                            {student.name ||
                              "N/A"}

                          </td>


                          {/* REGISTER NUMBER */}

                          <td className="p-4 text-center">

                            {student.registerNumber ||
                              "N/A"}

                          </td>


                          {/* DEPARTMENT */}

                          <td className="p-4 text-center">

                            {student.department ||
                              "N/A"}

                          </td>


                          {/* YEAR */}

                          <td className="p-4 text-center">

                            {student.year ||
                              student.currentYear ||
                              "N/A"}

                          </td>


                          {/* CGPA */}

                          <td className="p-4 text-center font-medium">

                            {student.cgpa ||
                              "N/A"}

                          </td>


                          {/* SKILLS */}

                          <td className="p-4">

                            <div className="flex flex-wrap gap-2">

                              {student.skills &&
                              student.skills.length > 0
                                ? (

                                  student.skills.map(
                                    (
                                      skill,
                                      skillIndex
                                    ) => (

                                      <span
                                        key={`${skill}-${skillIndex}`}
                                        className="bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-xs"
                                      >

                                        {skill}

                                      </span>

                                    )
                                  )

                                ) : (

                                  <span className="text-gray-400 text-sm">
                                    No skills
                                  </span>

                                )}

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

        </div>

      )}

    </AdminLayout>
  );
}

export default Search;