import { useEffect, useState } from "react";
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
    minTenthPercentage: "",
    minTwelthPercentage: "",
    skills: [],
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

  const [exporting, setExporting] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // SKILLS DROPDOWN STATES
  // ==========================================

  const [availableSkills, setAvailableSkills] = useState([]);

  const [skillsOpen, setSkillsOpen] = useState(false);

  const [skillsLoading, setSkillsLoading] = useState(false);

  // ==========================================
  // FETCH AVAILABLE SKILLS
  // ==========================================

  useEffect(() => {
    fetchAvailableSkills();
  }, []);

  const fetchAvailableSkills = async () => {
    try {
      setSkillsLoading(true);

      const response = await api.get("/admin/search-students");

      const studentList = response.data.students || [];

      const skillSet = new Set();

      studentList.forEach((student) => {
        if (Array.isArray(student.skills)) {
          student.skills.forEach((skill) => {
            const normalizedSkill = String(skill)
              .trim()
              .toLowerCase();

            if (normalizedSkill) {
              skillSet.add(normalizedSkill);
            }
          });
        }
      });

      const uniqueSkills = Array.from(skillSet).sort();

      setAvailableSkills(uniqueSkills);
    } catch (error) {
      console.error(
        "FETCH AVAILABLE SKILLS ERROR:",
        error.response || error
      );
    } finally {
      setSkillsLoading(false);
    }
  };

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
  // HANDLE SKILL SELECTION
  // ==========================================

  const handleSkillToggle = (skill) => {
    const normalizedSkill = String(skill)
      .trim()
      .toLowerCase();

    setFilters((prev) => {
      const currentSkills = prev.skills || [];

      if (currentSkills.includes(normalizedSkill)) {
        return {
          ...prev,
          skills: currentSkills.filter(
            (item) => item !== normalizedSkill
          ),
        };
      }

      return {
        ...prev,
        skills: [...currentSkills, normalizedSkill],
      };
    });
  };

  // ==========================================
  // REMOVE SELECTED SKILL
  // ==========================================

  const removeSkill = (skill) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (item) => item !== skill
      ),
    }));
  };

  // ==========================================
  // BUILD SEARCH PARAMETERS
  // ==========================================

  const buildParams = () => {
    const params = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {
        if (key === "skills") {
          if (Array.isArray(value) && value.length > 0) {
            params[key] = value.join(",");
          }
        } else {
          params[key] = value;
        }
      }
    });

    return params;
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

      const params = buildParams();

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
  // DOWNLOAD EXCEL
  // ==========================================

  const handleDownloadExcel = async () => {
    try {
      setExporting(true);

      setError("");

      const params = buildParams();

      console.log(
        "EXCEL EXPORT FILTERS:",
        params
      );

      const response = await api.get(
        "/admin/search-students/export-excel",
        {
          params,
          responseType: "blob",
        }
      );

      // ==========================================
      // CREATE DOWNLOAD BLOB
      // ==========================================

      const blob = new Blob(
        [response.data],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      // ==========================================
      // CREATE TEMPORARY DOWNLOAD LINK
      // ==========================================

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      const today =
        new Date()
          .toISOString()
          .slice(0, 10);

      link.download =
        `student-search-results-${today}.xlsx`;

      document.body.appendChild(link);

      link.click();

      // ==========================================
      // CLEANUP
      // ==========================================

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "DOWNLOAD EXCEL ERROR:",
        error.response || error
      );

      setError(
        error.response?.data?.message ||
          "Unable to download Excel file"
      );
    } finally {
      setExporting(false);
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
      minTenthPercentage: "",
      minTwelthPercentage: "",
      skills: [],
      historyOfArrears: "",
      historyOfArrearsCount: "",
      currentArrears: "",
    });

    setStudents([]);

    setError("");

    setSearched(false);

    setSkillsOpen(false);
  };

  // ==========================================
  // OPEN STUDENT PROFILE
  // ==========================================

  const handleStudentClick = (student) => {
    navigate(
      `/admin/student/${student.id}`
    );
  };

  return (
    <AdminLayout>
      {/* ========================================== */}
      {/* PAGE HEADER */}
      {/* ========================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-orange-600">
          Search Students
        </h2>

        <p className="text-gray-500 mt-1">
          Search students using placement-related criteria
        </p>

        {/* ========================================== */}
        {/* FILTER GRID */}
        {/* ========================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {/* DEPARTMENT */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>

            <select
              name="department"
              value={filters.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year
            </label>

            <select
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">
                All Years
              </option>

              <option value="1">
                1st Year
              </option>

              <option value="2">
                2nd Year
              </option>

              <option value="3">
                3rd Year
              </option>

              <option value="4">
                4th Year
              </option>
            </select>
          </div>

          {/* MINIMUM CGPA */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* MINIMUM 10TH */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum 10th Percentage
            </label>

            <input
              type="number"
              name="minTenthPercentage"
              value={filters.minTenthPercentage}
              onChange={handleChange}
              placeholder="Example: 70"
              min="0"
              max="100"
              step="0.1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* MINIMUM 12TH */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum 12th Percentage
            </label>

            <input
              type="number"
              name="minTwelthPercentage"
              value={filters.minTwelthPercentage}
              onChange={handleChange}
              placeholder="Example: 70"
              min="0"
              max="100"
              step="0.1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* HISTORY OF ARREARS */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              History of Arrears
            </label>

            <select
              name="historyOfArrears"
              value={filters.historyOfArrears}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">
                All
              </option>

              <option value="No">
                No
              </option>

              <option value="Yes">
                Yes
              </option>
            </select>
          </div>

          {/* HISTORY ARREARS COUNT */}

          {filters.historyOfArrears === "Yes" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum History Arrears Count
              </label>

              <input
                type="number"
                name="historyOfArrearsCount"
                value={
                  filters.historyOfArrearsCount
                }
                onChange={handleChange}
                placeholder="Example: 2"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {/* CURRENT ARREARS */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Maximum Current Arrears
            </label>

            <input
              type="number"
              name="currentArrears"
              value={filters.currentArrears}
              onChange={handleChange}
              placeholder="Example: 0"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* SKILLS */}

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills
            </label>

            <button
              type="button"
              onClick={() =>
                setSkillsOpen((prev) => !prev)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left bg-white flex justify-between items-center"
            >
              <span className="text-gray-700">
                {filters.skills.length > 0
                  ? `${filters.skills.length} skill${
                      filters.skills.length > 1
                        ? "s"
                        : ""
                    } selected`
                  : "Select Skills"}
              </span>

              <span>
                {skillsOpen ? "▲" : "▼"}
              </span>
            </button>

            {skillsOpen && (
              <div className="absolute z-30 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {skillsLoading ? (
                  <div className="p-4 text-gray-500 text-sm">
                    Loading skills...
                  </div>
                ) : availableSkills.length === 0 ? (
                  <div className="p-4 text-gray-500 text-sm">
                    No skills available
                  </div>
                ) : (
                  availableSkills.map((skill) => {
                    const selected =
                      filters.skills.includes(skill);

                    return (
                      <label
                        key={skill}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            handleSkillToggle(skill)
                          }
                          className="w-4 h-4 accent-orange-500"
                        />

                        <span className="capitalize text-gray-700">
                          {skill}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            )}

            {/* SELECTED SKILLS */}

            {filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filters.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                  >
                    <span className="capitalize">
                      {skill}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(skill)
                      }
                      className="font-bold hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* ERROR */}
        {/* ========================================== */}

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* ========================================== */}
        {/* BUTTONS */}
        {/* ========================================== */}

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleClear}
            disabled={loading || exporting}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition font-medium disabled:opacity-50"
          >
            Clear Filters
          </button>

          <button
            onClick={handleSearch}
            disabled={loading || exporting}
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
          {/* ========================================== */}
          {/* RESULTS HEADER */}
          {/* ========================================== */}

          <div className="p-6 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-orange-600">
                Search Results
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Students matching your search criteria
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* COUNT */}

              <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-semibold">
                {students.length} Found
              </div>

              {/* DOWNLOAD EXCEL */}

              {students.length > 0 && (
                <button
                  onClick={handleDownloadExcel}
                  disabled={
                    exporting || loading
                  }
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {exporting ? (
                    <>
                      <span className="animate-spin">
                        ⟳
                      </span>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <span>⬇</span>
                      Download Excel
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* NO RESULTS */}
          {/* ========================================== */}

          {students.length === 0 && !loading ? (
            <div className="p-10 text-center">
              <div className="text-5xl mb-4">
                🔍
              </div>

              <h4 className="text-lg font-semibold text-gray-700">
                No students found
              </h4>

              <p className="text-gray-500 mt-2">
                Try changing your search criteria.
              </p>
            </div>
          ) : (
            /* ========================================== */
            /* TABLE */
            /* ========================================== */

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
                        onClick={() =>
                          handleStudentClick(
                            student
                          )
                        }
                        className="border-b hover:bg-orange-50 cursor-pointer transition"
                      >
                        <td className="p-4 text-center text-gray-700">
                          {index + 1}
                        </td>

                        <td className="p-4 font-medium text-gray-800">
                          {student.name || "-"}
                        </td>

                        <td className="p-4 text-center text-gray-700">
                          {student.registerNumber ||
                            "-"}
                        </td>

                        <td className="p-4 text-center text-gray-700">
                          {student.department ||
                            "-"}
                        </td>

                        <td className="p-4 text-center text-gray-700">
                          {student.year || "-"}
                        </td>

                        <td className="p-4 text-center font-semibold text-gray-700">
                          {student.cgpa || "-"}
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(
                              student.skills
                            ) &&
                            student.skills.length > 0 ? (
                              student.skills.map(
                                (
                                  skill,
                                  skillIndex
                                ) => (
                                  <span
                                    key={`${skill}-${skillIndex}`}
                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                                  >
                                    {skill}
                                  </span>
                                )
                              )
                            ) : (
                              <span className="text-gray-400">
                                -
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